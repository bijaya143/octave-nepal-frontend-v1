"use client";
import React from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import PaymentSection from "@/components/PaymentSection";
import Image from "next/image";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Modal from "@/components/ui/Modal";
import { useRouter } from "next/navigation";

export default function StudentBillingPage() {
  const [openPayment, setOpenPayment] = React.useState(false);
  const router = useRouter();
  function handleSubmitPayment() {
    // In a real app, you'd validate and submit the receipt here.
    setOpenPayment(false);
    router.push("/checkout/success");
  }
  const payments = [
    {
      id: "INV-1003",
      course: "React 19 Bootcamp",
      amount: 2499,
      status: "Paid",
      date: "Oct 10, 2025",
    },
    {
      id: "INV-1002",
      course: "TypeScript Essentials",
      amount: 1999,
      status: "Paid",
      date: "Sep 12, 2025",
    },
    {
      id: "INV-1001",
      course: "UI Design Basics",
      amount: 1499,
      status: "Refunded",
      date: "Aug 02, 2025",
    },
  ];

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Billing" },
        ]}
        className="mb-2"
      />
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1
          className="text-xl md:text-2xl font-semibold"
          style={{ fontFamily: "var(--font-heading-sans)" }}
        >
          Billing
        </h1>
        <Badge variant="outline">Student</Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-start">
        {/* Main */}
        <section className="md:col-span-2 space-y-6">
          {/* Summary */}
          {/* <Card>
              <CardContent className="py-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-sm text-[color:var(--color-neutral-700)]">Next payment</div>
                    <div className="mt-1 text-lg font-semibold" style={{ fontFamily: "var(--font-heading-sans)" }}>Rs 2,499 on Nov 5</div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button className="w-full sm:w-auto" onClick={() => setOpenPayment(true)}>Pay now</Button>
                  </div>
                </div>
              </CardContent>
            </Card> */}

          {/* Payment modal */}
          <Modal
            open={openPayment}
            onClose={() => setOpenPayment(false)}
            title="Make a payment"
          >
            <PaymentSection />
            <div className="mt-5 flex items-center justify-end gap-2">
              <Button
                className="w-full sm:w-auto"
                onClick={handleSubmitPayment}
              >
                Submit payment
              </Button>
            </div>
          </Modal>

          {/* Payment history */}
          <Card>
            <CardContent className="py-5">
              <div className="flex items-center justify-between mb-3">
                <h2
                  className="text-base font-semibold"
                  style={{ fontFamily: "var(--font-heading-sans)" }}
                >
                  Payment history
                </h2>
                <a
                  href="/dashboard/billing/receipts"
                  className="text-sm text-[color:var(--color-primary-700)] hover:underline underline-offset-2"
                >
                  View receipts
                </a>
              </div>
              {/* Mobile list view */}
              <div className="sm:hidden space-y-3">
                {payments.map((p) => (
                  <Card key={p.id} className="overflow-hidden">
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div
                            className="text-[13px] font-semibold truncate"
                            style={{ fontFamily: "var(--font-heading-sans)" }}
                          >
                            {p.course}
                          </div>
                          <div className="mt-1 flex items-center gap-3 text-[10px] text-[color:var(--color-neutral-600)]">
                            <span className="inline-flex items-center gap-1">
                              {p.id}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              •
                            </span>
                            <span className="inline-flex items-center gap-1">
                              {p.date}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`shrink-0 inline-flex h-7 items-center rounded-full px-3 text-xs font-medium ${
                            p.status === "Paid"
                              ? "bg-[color:var(--color-green-50)] text-[color:var(--color-green-700)]"
                              : p.status === "Refunded"
                              ? "bg-[rgba(234,179,8,0.15)] text-[color:var(--color-amber-800)]"
                              : "bg-[color:var(--color-neutral-100)] text-[color:var(--color-neutral-700)]"
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                      <div className="mt-3 flex items-baseline justify-between">
                        <div className="text-[11px] text-[color:var(--color-neutral-600)]">
                          Amount
                        </div>
                        <div
                          className="text-sm font-semibold text-primary-700"
                          style={{ fontFamily: "var(--font-heading-sans)" }}
                        >
                          Rs {p.amount}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-[color:var(--color-neutral-600)]">
                      <th className="py-2 pr-4 font-medium">Invoice</th>
                      <th className="py-2 pr-4 font-medium">Course</th>
                      <th className="py-2 pr-4 font-medium">Date</th>
                      <th className="py-2 pr-4 font-medium">Amount</th>
                      <th className="py-2 pr-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr
                        key={p.id}
                        className="border-t border-[color:var(--color-neutral-200)]"
                      >
                        <td className="py-3 pr-4 font-medium">{p.id}</td>
                        <td className="py-3 pr-4">{p.course}</td>
                        <td className="py-3 pr-4">{p.date}</td>
                        <td className="py-3 pr-4">Rs {p.amount}</td>
                        <td className="py-3 pr-4">
                          <span
                            className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-medium ${
                              p.status === "Paid"
                                ? "bg-[color:var(--color-green-50)] text-[color:var(--color-green-700)]"
                                : p.status === "Refunded"
                                ? "bg-[rgba(234,179,8,0.15)] text-[color:var(--color-amber-800)]"
                                : "bg-[color:var(--color-neutral-100)] text-[color:var(--color-neutral-700)]"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Sidebar */}
        <aside className="space-y-6">
          <Card>
            <CardContent className="py-5">
              <div className="text-sm font-medium">Billing details</div>
              <dl className="mt-3 grid grid-cols-1 gap-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-[color:var(--color-neutral-600)]">
                    Student
                  </dt>
                  <dd className="font-medium">You</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-[color:var(--color-neutral-600)]">
                    Email
                  </dt>
                  <dd className="font-medium">you@example.com</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-[color:var(--color-neutral-600)]">
                    Currency
                  </dt>
                  <dd className="font-medium">NPR (Rs)</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-5">
              <div className="text-sm font-medium">Need help?</div>
              <div className="mt-2 text-xs text-[color:var(--color-neutral-600)]">
                Chat with support or browse FAQs.
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="inline-flex items-center gap-2 w-full"
                >
                  <Image
                    src="/images/social-medias/whatsapp.png"
                    alt="WhatsApp"
                    width={16}
                    height={16}
                    className="h-4 w-4"
                  />
                  Chat
                </Button>
                <a href="/faq" className="w-full">
                  <Button size="sm" variant="secondary" className="w-full">
                    FAQ
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </>
  );
}
