"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Card, { CardContent, CardFooter } from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Container from "@/components/Container";
import PaymentSection from "@/components/PaymentSection";
import { PhoneInput, usePhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { guestCourseService } from "@/lib/services/guest";
import {
  CourseDiscountType,
  PaymentMethod,
  type Course,
} from "@/lib/services/admin";
import { guestEnrollmentService } from "@/lib/services/guest/enrollment";
import { toast } from "sonner";
import { CircleCheck } from "lucide-react";
import { SITE_NAME } from "@/lib/constant";
import { useStudentAuth } from "@/lib/hooks/useStudentAuth";

function toAmount(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getDiscountPercent(course: Course): number {
  const markedPrice = toAmount(course.markedPrice);
  if (!course.isDiscountApplied || !markedPrice) return 0;

  if (
    course.discountType === CourseDiscountType.PERCENTAGE &&
    course.discountValue
  ) {
    return Math.round(toAmount(course.discountValue));
  }

  if (course.discountType === CourseDiscountType.FLAT && course.discountValue) {
    return Math.round((toAmount(course.discountValue) / markedPrice) * 100);
  }

  return 0;
}

export default function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseSlug = searchParams.get("course");

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
  const [notFoundMessage, setNotFoundMessage] = useState("");
  const [redirectCountdown, setRedirectCountdown] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const { user: studentUser, isAuthenticated: isStudentAuthenticated } =
    useStudentAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.QR,
  );
  const [receipts, setReceipts] = useState<File[]>([]);
  const [transactionId, setTransactionId] = useState("");

  const { phone, country } = usePhoneInput({
    defaultCountry: "np",
    value: formData.phone,
    onChange: (data) => {
      setFormData((prev) => ({ ...prev, phone: data.phone }));
    },
  });

  useEffect(() => {
    if (isStudentAuthenticated && studentUser) {
      const phoneCountryCode = studentUser.phoneCountryCode || "";
      const phoneNumber = studentUser.phoneNumber || "";
      const fullPhone =
        phoneCountryCode && phoneNumber
          ? `${phoneCountryCode}${phoneNumber}`
          : "";

      setFormData((prev) => ({
        ...prev,
        firstName: studentUser.firstName || prev.firstName,
        lastName: studentUser.lastName || prev.lastName,
        email: studentUser.email || prev.email,
        phone: fullPhone || prev.phone,
      }));
    }
  }, [isStudentAuthenticated, studentUser]);

  useEffect(() => {
    if (!courseSlug) {
      setNotFoundMessage("No course was selected for checkout.");
      setIsLoadingCourse(false);
      return;
    }

    let cancelled = false;
    setIsLoadingCourse(true);
    setNotFoundMessage("");

    guestCourseService
      .getBySlug(courseSlug)
      .then((res) => {
        if (cancelled) return;
        if (res.success && res.data) {
          setCourse(res.data);
        } else {
          setNotFoundMessage("The requested course could not be found.");
        }
      })
      .catch(() => {
        if (cancelled) return;
        setNotFoundMessage("Unable to load this course at the moment.");
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoadingCourse(false);
      });

    return () => {
      cancelled = true;
    };
  }, [courseSlug, router]);

  const isEnrollmentClosed = course
    ? !course.lastEnrollmentDate ||
      course.availableSeatCount <= 0 ||
      new Date(course.lastEnrollmentDate) < new Date()
    : false;

  const unavailableMessage =
    notFoundMessage ||
    (isEnrollmentClosed
      ? "Enrollment for this course is currently closed."
      : "");

  useEffect(() => {
    if (!unavailableMessage) return;

    setRedirectCountdown(10);
    const intervalId = window.setInterval(() => {
      setRedirectCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [unavailableMessage]);

  useEffect(() => {
    if (!unavailableMessage) return;
    if (redirectCountdown !== 0) return;
    router.replace("/courses");
  }, [unavailableMessage, redirectCountdown, router]);

  const courseTitle = useMemo(() => {
    if (isLoadingCourse) return "Loading…";
    return course?.title || "Course";
  }, [course, isLoadingCourse]);

  const orderTotal = useMemo(() => {
    if (!course) return 0;
    const markedPrice = toAmount(course.markedPrice);
    const sellingPrice = toAmount(course.sellingPrice);
    return sellingPrice > 0 ? sellingPrice : markedPrice;
  }, [course]);

  const discountPercent = useMemo(() => {
    if (!course) return 0;
    return getDiscountPercent(course);
  }, [course]);

  const markedPrice = useMemo(() => {
    if (!course) return 0;
    return toAmount(course.markedPrice);
  }, [course]);

  const discountAmount = useMemo(() => {
    if (!course?.isDiscountApplied) return 0;
    return Math.max(markedPrice - orderTotal, 0);
  }, [course, markedPrice, orderTotal]);

  const handleEnrollmentConfirm = async () => {
    if (!course) return;

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone
    ) {
      toast.error("Please fill in all student information fields.");
      return;
    }

    if (receipts.length === 0) {
      toast.error("Please upload at least one payment receipt.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Extract country code and number from phone using usePhoneInput metadata
      const phoneCountryCode = `+${country.dialCode}`;
      const phoneNumber = phone
        .replace(phoneCountryCode, "")
        .replace(/\D/g, "");

      const res = await guestEnrollmentService.create({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: phoneNumber,
        phoneCountryCode: phoneCountryCode,
        courseId: course.id,
        paymentMethod: paymentMethod,
        transactionId: transactionId,
        receipts: receipts,
      });

      if (res.success) {
        toast.success(
          res.message || "Enrollment request submitted successfully!",
        );
        setIsEnrolled(true);
      } else {
        toast.error(
          res.error.message || "Failed to submit enrollment request.",
        );
      }
    } catch (error) {
      toast.error("An error occurred during enrollment. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEnrolled) {
    return (
      <main>
        <Container className="py-8 md:py-12">
          <Card className="max-w-2xl mx-auto border border-[color:var(--color-primary-200)] bg-[color:var(--color-primary-50)] shadow-sm">
            <CardContent className="py-10 md:py-12 text-center">
              <div className="hidden sm:flex mx-auto mb-5 h-16 w-16 items-center justify-center rounded-full bg-[color:var(--color-primary-100)] border border-[color:var(--color-primary-200)]">
                <CircleCheck className="h-8 w-8 text-[color:var(--color-primary-600)]" />
              </div>
              <h1
                className="text-2xl md:text-3xl font-semibold tracking-tight text-[color:var(--color-primary-900)]"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                Enrollment Submitted!
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-sm md:text-base leading-relaxed text-[color:var(--color-primary-800)]">
                Thank you for choosing {SITE_NAME}. Your enrollment request for{" "}
                <span className="font-semibold">{courseTitle}</span> has been
                received.
              </p>
              <div className="mt-8 rounded-lg bg-white p-5 border border-[color:var(--color-primary-200)] text-left shadow-xs">
                <h3 className="text-sm font-semibold text-[color:var(--color-neutral-900)] mb-2">
                  What happens next?
                </h3>
                <ul className="text-sm space-y-2 text-[color:var(--color-neutral-700)]">
                  <li className="flex gap-2">
                    <span className="text-[color:var(--color-primary-600)] font-bold">
                      1.
                    </span>
                    <span>Our team will verify your payment receipt.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[color:var(--color-primary-600)] font-bold">
                      2.
                    </span>
                    <span>
                      You will receive a confirmation email or SMS once
                      verified.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[color:var(--color-primary-600)] font-bold">
                      3.
                    </span>
                    <span>
                      Course materials and links will be shared in your
                      dashboard.
                    </span>
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t border-[color:var(--color-neutral-100)]">
                  <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                    <p className="text-xs text-red-800 leading-relaxed">
                      <span className="font-semibold text-red-700">
                        Important Note:
                      </span>{" "}
                      If this is your first time with us, your login credentials
                      will be sent to your email. If you already have an
                      account, simply log in or go to your dashboard to start
                      learning once verified.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  className="w-full sm:w-auto"
                  onClick={() => router.push("/courses")}
                >
                  Browse courses
                </Button>
                <Button
                  variant="secondary"
                  className="w-full sm:w-auto"
                  onClick={() => router.push("/dashboard")}
                >
                  Go to dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </Container>
      </main>
    );
  }

  if (unavailableMessage) {
    return (
      <main>
        <Container className="py-12 md:py-20">
          <Card className="max-w-2xl mx-auto border border-[color:var(--color-neutral-200)] shadow-sm">
            <CardContent className="py-10 md:py-12 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--color-primary-50)] border border-[color:var(--color-primary-100)]">
                <span className="text-lg font-semibold text-[color:var(--color-primary-700)]">
                  !
                </span>
              </div>
              <h1
                className="text-2xl md:text-3xl font-semibold tracking-tight"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                Course not available
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-sm md:text-base leading-relaxed text-[color:var(--color-neutral-700)]">
                {unavailableMessage}
              </p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[color:var(--color-neutral-100)] px-4 py-2 text-sm text-[color:var(--color-neutral-700)]">
                <span>Redirecting in</span>
                <span className="inline-flex min-w-7 justify-center rounded-full bg-white px-2 py-0.5 font-semibold text-[color:var(--color-primary-700)] border border-[color:var(--color-neutral-200)]">
                  {redirectCountdown}
                </span>
                <span>second{redirectCountdown === 1 ? "" : "s"}</span>
              </div>
              <div className="mt-6">
                <Button onClick={() => router.replace("/courses")}>
                  Browse courses now
                </Button>
              </div>
            </CardContent>
          </Card>
        </Container>
      </main>
    );
  }

  return (
    <main>
      <Container className="py-5 md:py-10">
        <div className="mb-6">
          <h1
            className="text-xl md:text-2xl font-semibold"
            style={{ fontFamily: "var(--font-heading-sans)" }}
          >
            Checkout
          </h1>
          <p className="hidden sm:block text-sm text-[color:var(--color-neutral-600)]">
            Review your details and complete payment securely
          </p>
        </div>
        <div className="grid lg:grid-cols-[1fr_420px] gap-6 items-start">
          {/* Form */}
          <section>
            <Card>
              <CardContent className="py-5">
                <h2 className="text-base font-semibold mb-4">
                  Student information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="First name"
                    placeholder="Octave"
                    required
                    disabled={isStudentAuthenticated}
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                  <Input
                    label="Last name"
                    placeholder="Nepal"
                    required
                    disabled={isStudentAuthenticated}
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4 mt-4 text-left">
                  <Input
                    label="Email"
                    type="email"
                    placeholder="info@octavenepal.com"
                    required
                    disabled={isStudentAuthenticated}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[color:var(--foreground)]">
                      Phone number <span className="ml-1 text-red-600">*</span>
                    </label>
                    <PhoneInput
                      defaultCountry="np"
                      value={formData.phone}
                      onChange={(phone) => setFormData({ ...formData, phone })}
                      className="flex items-stretch"
                      inputClassName="!h-11 !w-full !rounded-r-lg !rounded-l-none !border !border-[color:var(--color-neutral-200)] !px-4 !text-[color:var(--foreground)] !text-base md:!text-sm !transition-all !shadow-xs focus:!shadow-sm"
                      countrySelectorStyleProps={{
                        buttonClassName:
                          "!h-11 !rounded-l-lg !rounded-r-none !border !border-r-0 !border-[color:var(--color-neutral-200)] !bg-white !px-3 hover:!bg-[color:var(--color-neutral-50)] !transition-all",
                      }}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Payment</h3>
                  <PaymentSection
                    method={paymentMethod}
                    setMethod={setPaymentMethod}
                    selectedFiles={receipts}
                    setSelectedFiles={setReceipts}
                    transactionId={transactionId}
                    setTransactionId={setTransactionId}
                  />
                </div>
              </CardContent>
              <CardFooter className="sm:flex sm:justify-end">
                <Button
                  className="w-full sm:w-auto sm:min-w-56"
                  onClick={handleEnrollmentConfirm}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Confirm enrollment"}
                </Button>
              </CardFooter>
            </Card>
          </section>

          {/* Summary */}
          <aside className="lg:sticky lg:top-20">
            <Card>
              <CardContent className="py-5">
                <h2 className="text-base font-semibold mb-3">Order summary</h2>
                {isLoadingCourse ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="grid grid-cols-[1fr_auto] items-start gap-x-3 py-2 border-b border-[color:var(--color-neutral-200)]">
                      <div className="h-4 rounded bg-[color:var(--color-neutral-200)]" />
                      <div className="h-4 w-16 rounded bg-[color:var(--color-neutral-200)]" />
                    </div>
                    <div className="py-2 border-b border-[color:var(--color-neutral-200)] space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="h-3 w-24 rounded bg-[color:var(--color-neutral-200)]" />
                        <div className="h-3 w-14 rounded bg-[color:var(--color-neutral-200)]" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="h-3 w-20 rounded bg-[color:var(--color-neutral-200)]" />
                        <div className="h-3 w-14 rounded bg-[color:var(--color-neutral-200)]" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div className="h-4 w-10 rounded bg-[color:var(--color-neutral-200)]" />
                      <div className="h-4 w-16 rounded bg-[color:var(--color-neutral-200)]" />
                    </div>
                    <div className="space-y-1">
                      <div className="h-3 w-full rounded bg-[color:var(--color-neutral-200)]" />
                      <div className="h-3 w-4/5 rounded bg-[color:var(--color-neutral-200)]" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-[1fr_auto] items-start gap-x-3 text-sm py-2 border-b border-[color:var(--color-neutral-200)]">
                      <span className="min-w-0 break-words">{courseTitle}</span>
                      <span className="font-medium whitespace-nowrap">
                        {`Rs ${orderTotal.toLocaleString()}`}
                      </span>
                    </div>
                    {course?.isDiscountApplied && (
                      <div className="py-2 border-b border-[color:var(--color-neutral-200)] space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[color:var(--color-neutral-600)]">
                            Original price
                          </span>
                          <span className="line-through text-[color:var(--color-neutral-500)]">
                            Rs {markedPrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[color:var(--color-green-700)]">
                            Discount ({discountPercent}%)
                          </span>
                          <span className="font-medium text-[color:var(--color-green-700)]">
                            - Rs {discountAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm py-2">
                      <span>Total</span>
                      <span className="font-semibold text-[color:var(--color-primary-700)]">
                        {`Rs ${orderTotal.toLocaleString()}`}
                      </span>
                    </div>
                    <p className="text-xs text-[color:var(--color-neutral-600)] mt-2">
                      A confirmation email with course links will be sent after
                      enrollment.
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </Container>
    </main>
  );
}
