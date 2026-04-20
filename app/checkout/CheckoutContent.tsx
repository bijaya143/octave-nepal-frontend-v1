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
import type { Course } from "@/lib/services/admin";

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

  useEffect(() => {
    if (!notFoundMessage) return;

    setRedirectCountdown(10);
    const intervalId = window.setInterval(() => {
      setRedirectCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [notFoundMessage]);

  useEffect(() => {
    if (!notFoundMessage) return;
    if (redirectCountdown !== 0) return;
    router.replace("/courses");
  }, [notFoundMessage, redirectCountdown, router]);

  const courseTitle = useMemo(() => {
    if (isLoadingCourse) return "Loading…";
    return course?.title || "Course";
  }, [course, isLoadingCourse]);

  const orderTotal = useMemo(() => {
    if (!course) return 0;
    return typeof course.sellingPrice === "number"
      ? course.sellingPrice
      : course.markedPrice;
  }, [course]);

  if (notFoundMessage) {
    return (
      <main>
        <Container className="py-10 md:py-16">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-8 text-center space-y-3">
              <h1
                className="text-xl md:text-2xl font-semibold"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                Course not available
              </h1>
              <p className="text-sm text-[color:var(--color-neutral-700)]">
                {notFoundMessage}
              </p>
              <p className="text-sm text-[color:var(--color-neutral-600)]">
                Redirecting to courses in{" "}
                <span className="font-semibold">{redirectCountdown}</span>{" "}
                second{redirectCountdown === 1 ? "" : "s"}.
              </p>
            </CardContent>
          </Card>
        </Container>
      </main>
    );
  }

  return (
    <main>
      <Container className="py-5 md:py-10">
        <h1
          className="text-xl md:text-2xl font-semibold mb-6"
          style={{ fontFamily: "var(--font-heading-sans)" }}
        >
          Checkout
        </h1>
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
                      inputClassName="!h-11 !w-full !rounded-r-lg !rounded-l-none !border !border-[color:var(--color-neutral-200)] !px-4 !text-[color:var(--foreground)] !text-sm !transition-all !shadow-xs focus:!shadow-sm"
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
              <CardFooter>
                <Button className="w-full">Confirm enrollment</Button>
              </CardFooter>
            </Card>
          </section>

          {/* Summary */}
          <aside className="lg:sticky lg:top-20">
            <Card>
              <CardContent className="py-5">
                <h2 className="text-base font-semibold mb-3">Order summary</h2>
                <div className="flex items-center justify-between text-sm py-2 border-b border-[color:var(--color-neutral-200)]">
                  <span>{courseTitle}</span>
                  <span>
                    {isLoadingCourse
                      ? "—"
                      : `Rs ${orderTotal.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm py-2">
                  <span>Total</span>
                  <span className="font-semibold text-[color:var(--color-primary-700)]">
                    {isLoadingCourse
                      ? "—"
                      : `Rs ${orderTotal.toLocaleString()}`}
                  </span>
                </div>
                <p className="text-xs text-[color:var(--color-neutral-600)] mt-2">
                  A confirmation email with course links will be sent after
                  enrollment.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </Container>
    </main>
  );
}
