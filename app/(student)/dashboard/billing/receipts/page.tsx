"use client";
import React from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Eye, Download } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";

type Receipt = {
  id: string;
  course: string;
  date: string;
  amount: number;
  status: "Paid" | "Refunded" | "Pending";
  url?: string;
};

export default function StudentReceiptsPage() {
  const router = useRouter();
  const receipts: Receipt[] = [
    {
      id: "INV-1003",
      course: "React 19 Bootcamp",
      date: "Oct 10, 2025",
      amount: 2499,
      status: "Paid",
      url: "/checkout/success?courseId=react-19",
    },
    {
      id: "INV-1002",
      course: "TypeScript Essentials",
      date: "Sep 12, 2025",
      amount: 1999,
      status: "Paid",
      url: "/checkout/success?courseId=ts-essentials",
    },
    {
      id: "INV-1001",
      course: "UI Design Basics",
      date: "Aug 02, 2025",
      amount: 1499,
      status: "Refunded",
    },
  ];

  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<Receipt | null>(null);
  function openModal(r: Receipt) {
    setActive(r);
    setOpen(true);
  }
  function closeModal() {
    setOpen(false);
    setActive(null);
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Billing", href: "/dashboard/billing" },
          { label: "Receipts" },
        ]}
        className="mb-2"
      />
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1
          className="text-xl md:text-2xl font-semibold"
          style={{ fontFamily: "var(--font-heading-sans)" }}
        >
          Receipts
        </h1>
      </div>

      {receipts.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-[color:var(--color-neutral-700)]">
            No receipts yet. Payments you complete will appear here.
            <div className="mt-4">
              <Button onClick={() => router.push("/dashboard/billing")}>
                Go to billing
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Mobile list */}
          <div className="sm:hidden space-y-3">
            {receipts.map((r) => (
              <Card key={r.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div
                        className="text-[13px] font-semibold truncate"
                        style={{ fontFamily: "var(--font-heading-sans)" }}
                      >
                        {r.course}
                      </div>
                      <div className="mt-1 text-[11px] text-[color:var(--color-neutral-600)]">
                        {r.id} • {r.date}
                      </div>
                    </div>
                    <span
                      className={`shrink-0 inline-flex h-7 items-center rounded-full px-3 text-xs font-medium ${
                        r.status === "Paid"
                          ? "bg-[color:var(--color-green-50)] text-[color:var(--color-green-700)]"
                          : r.status === "Refunded"
                          ? "bg-[rgba(234,179,8,0.15)] text-[color:var(--color-amber-800)]"
                          : "bg-[color:var(--color-neutral-100)] text-[color:var(--color-neutral-700)]"
                      }`}
                    >
                      {r.status}
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
                      Rs {r.amount}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-end gap-2">
                    {r.url && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="inline-flex items-center gap-2"
                        onClick={() => openModal(r)}
                      >
                        <Eye size={14} aria-hidden />
                        View
                      </Button>
                    )}
                    <Button
                      size="sm"
                      className="inline-flex items-center gap-2"
                    >
                      <Download size={14} aria-hidden />
                      Download
                    </Button>
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
                  <th className="py-2 pr-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-[color:var(--color-neutral-200)]"
                  >
                    <td className="py-3 pr-4 font-medium">{r.id}</td>
                    <td className="py-3 pr-4">{r.course}</td>
                    <td className="py-3 pr-4">{r.date}</td>
                    <td className="py-3 pr-4">Rs {r.amount}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-medium ${
                          r.status === "Paid"
                            ? "bg-[color:var(--color-green-50)] text-[color:var(--color-green-700)]"
                            : r.status === "Refunded"
                            ? "bg-[rgba(234,179,8,0.15)] text-[color:var(--color-amber-800)]"
                            : "bg-[color:var(--color-neutral-100)] text-[color:var(--color-neutral-700)]"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        {r.url && (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="inline-flex items-center gap-2"
                            onClick={() => openModal(r)}
                          >
                            <Eye size={14} aria-hidden />
                            View
                          </Button>
                        )}
                        <Button
                          size="sm"
                          className="inline-flex items-center gap-2"
                        >
                          <Download size={14} aria-hidden />
                          Download
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Details modal */}
      <Modal open={open} onClose={closeModal} title="Receipt details">
        {active && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              <div>
                <div className="text-[color:var(--color-neutral-600)]">
                  Invoice
                </div>
                <div className="font-medium">{active.id}</div>
              </div>
              <div>
                <div className="text-[color:var(--color-neutral-600)]">
                  Date
                </div>
                <div className="font-medium">{active.date}</div>
              </div>
              <div className="col-span-2">
                <div className="text-[color:var(--color-neutral-600)]">
                  Course
                </div>
                <div className="font-medium">{active.course}</div>
              </div>
              <div>
                <div className="text-[color:var(--color-neutral-600)]">
                  Amount
                </div>
                <div className="font-semibold text-[color:var(--color-primary-700)]">
                  Rs {active.amount}
                </div>
              </div>
              <div>
                <div className="text-[color:var(--color-neutral-600)]">
                  Status
                </div>
                <div>
                  <span
                    className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-medium ${
                      active.status === "Paid"
                        ? "bg-[color:var(--color-green-50)] text-[color:var(--color-green-700)]"
                        : active.status === "Refunded"
                        ? "bg-[rgba(234,179,8,0.15)] text-[color:var(--color-amber-800)]"
                        : "bg-[color:var(--color-neutral-100)] text-[color:var(--color-neutral-700)]"
                    }`}
                  >
                    {active.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
