"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Card, { CardContent, CardFooter } from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Container from "@/components/Container";
import PaymentSection from "@/components/PaymentSection";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { guestCourseService } from "@/lib/services/guest";
import { CourseDiscountType, type Course } from "@/lib/services/admin";

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

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

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
    (isEnrollmentClosed ? "Enrollment for this course is currently closed." : "");

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
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                  <Input
                    label="Last name"
                    placeholder="Nepal"
                    required
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
                  <PaymentSection />
                </div>
              </CardContent>
              <CardFooter className="sm:flex sm:justify-end">
                <Button className="w-full sm:w-auto sm:min-w-56">
                  Confirm enrollment
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
