import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import Card, { CardContent, CardFooter } from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Container from "@/components/Container";
import { SITE_NAME } from "@/lib/constant";
import PaymentSection from "@/components/PaymentSection";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ courseId?: string }>;
}) {
  const { courseId } = await searchParams;
  const courseTitle = courseId ? `Course #${courseId}` : undefined;
  if (!courseId) {
    // In a real app we'd keep state; for now redirect to courses when missing
    // to avoid empty checkout.
    redirect("/courses");
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
                  <Input label="Full name" placeholder={SITE_NAME} required />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <Input
                    label="Address"
                    placeholder="Jawalakhel, Lalitpur, Nepal"
                    required
                  />
                  <Input label="Phone" placeholder="9800000000" required />
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Payment</h3>
                  <PaymentSection />
                </div>
              </CardContent>
              <CardFooter>
                <Link
                  href={`/checkout/success?courseId=${courseId}`}
                  className="w-full block"
                >
                  <Button className="w-full">Confirm enrollment</Button>
                </Link>
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
                  <span>Rs 84</span>
                </div>
                <div className="flex items-center justify-between text-sm py-2">
                  <span>Total</span>
                  <span className="font-semibold text-[color:var(--color-primary-700)]">
                    Rs 84
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
