"use client";
import React from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import {
  CreditCard,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
} from "lucide-react";

type PayoutStatus = "Completed" | "Processing" | "Failed";

type Payout = {
  id: string;
  date: string; // friendly date
  amount: number; // in NPR
  status: PayoutStatus;
  method: "Bank" | "eSewa" | "Khalti" | "FonePay";
  reference: string;
};

const samplePayouts: Payout[] = Array.from({ length: 28 }).map((_, i) => {
  const statuses: PayoutStatus[] = ["Completed", "Processing", "Failed"];
  const methods = ["Bank", "eSewa", "Khalti", "FonePay"] as const;
  return {
    id: `tx_${(i + 1).toString().padStart(3, "0")}`,
    date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
    amount: 2000 + (i % 7) * 750,
    status: statuses[i % statuses.length],
    method: methods[i % methods.length],
    reference: `REF${(100000 + i * 137).toString()}`,
  };
});

function statusBadgeClass(status: PayoutStatus): string {
  const s = String(status).toLowerCase();
  if (s.includes("complete"))
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s.includes("process"))
    return "bg-amber-50 text-amber-700 border-amber-200";
  if (s.includes("fail")) return "bg-rose-50 text-rose-700 border-rose-200";
  return "bg-gray-50 text-gray-700 border-gray-200";
}

export default function InstructorPayoutsPage() {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<"All" | PayoutStatus>("All");
  const [method, setMethod] = React.useState<"All" | Payout["method"]>("All");
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState<Payout | null>(null);

  const pageSize = 10;

  const filtered = React.useMemo(() => {
    return samplePayouts.filter((p) => {
      const matchesQuery = query
        ? [p.id, p.reference, p.amount.toString(), p.date].some((v) =>
            String(v).toLowerCase().includes(query.toLowerCase())
          )
        : true;
      const matchesStatus = status === "All" ? true : p.status === status;
      const matchesMethod = method === "All" ? true : p.method === method;
      return matchesQuery && matchesStatus && matchesMethod;
    });
  }, [query, status, method]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const pageItems = filtered.slice(start, end);

  const nextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));

  React.useEffect(() => {
    setPage(1);
  }, [query, status, method]);

  const totalCompletedAmount = React.useMemo(
    () =>
      samplePayouts
        .filter((p) => p.status === "Completed")
        .reduce((sum, p) => sum + p.amount, 0),
    []
  );
  const pendingAmount = React.useMemo(
    () =>
      samplePayouts
        .filter((p) => p.status === "Processing")
        .reduce((sum, p) => sum + p.amount, 0),
    []
  );

  return (
    <>
      <div className="flex items-center justify-between gap-2 mb-5">
        <div>
          <h1
            className="text-xl md:text-2xl font-semibold"
            style={{ fontFamily: "var(--font-heading-sans)" }}
          >
            Payouts
          </h1>
          <p className="text-sm text-[color:var(--color-neutral-600)]">
            View your payout history and statuses
          </p>
        </div>
        {/* <div className="hidden sm:flex items-center gap-2">
            <Button variant="secondary" size="sm" className="inline-flex items-center gap-2">
              <CreditCard size={16} />
              Request payout
            </Button>
          </div> */}
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-5">
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.08),transparent_60%)]" />
          <CardContent className="relative py-4">
            <div className="text-xs text-[color:var(--color-neutral-600)]">
              Total completed
            </div>
            <div
              className="mt-1 text-lg font-semibold"
              style={{ fontFamily: "var(--font-heading-sans)" }}
            >
              Rs {totalCompletedAmount.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(234,179,8,0.10),transparent_60%)]" />
          <CardContent className="relative py-4">
            <div className="text-xs text-[color:var(--color-neutral-600)]">
              Pending processing
            </div>
            <div
              className="mt-1 text-lg font-semibold"
              style={{ fontFamily: "var(--font-heading-sans)" }}
            >
              Rs {pendingAmount.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent_60%)]" />
          <CardContent className="relative py-4">
            <div className="text-xs text-[color:var(--color-neutral-600)]">
              Total payouts
            </div>
            <div
              className="mt-1 text-lg font-semibold"
              style={{ fontFamily: "var(--font-heading-sans)" }}
            >
              {samplePayouts.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3 sm:items-end">
        <div className="sm:w-64">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by ID, reference, date, amount"
            aria-label="Search payouts"
          />
        </div>
        <div className="sm:w-48">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            aria-label="Filter by status"
          >
            <option value="All">All statuses</option>
            <option value="Completed">Completed</option>
            <option value="Processing">Processing</option>
            <option value="Failed">Failed</option>
          </Select>
        </div>
        <div className="sm:w-48">
          <Select
            value={method}
            onChange={(e) => setMethod(e.target.value as any)}
            aria-label="Filter by method"
          >
            <option value="All">All methods</option>
            <option value="Bank">Bank</option>
            <option value="eSewa">eSewa</option>
            <option value="Khalti">Khalti</option>
            <option value="FonePay">FonePay</option>
          </Select>
        </div>
        <div className="sm:ml-auto">
          <Button
            variant="secondary"
            className="inline-flex items-center gap-2"
            onClick={() => {
              setQuery("");
              setStatus("All");
              setMethod("All");
            }}
          >
            <RotateCcw size={16} />
            Reset
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-2 pb-0">
          <div className="overflow-auto px-6">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="font-medium px-6 py-3 border-b border-[color:var(--color-neutral-200)]">
                    Payout ID
                  </th>
                  <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                    Date
                  </th>
                  <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                    Amount
                  </th>
                  <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                    Method
                  </th>
                  <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                    Status
                  </th>
                  <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                    Reference
                  </th>
                  <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-[color:var(--color-neutral-50)]"
                  >
                    <td className="px-6 py-3 border-b border-[color:var(--color-neutral-200)] whitespace-nowrap">
                      <div className="font-medium">{p.id}</div>
                    </td>
                    <td className="px-4 py-3 border-b border-[color:var(--color-neutral-200)] whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <Calendar size={14} /> {p.date}
                      </div>
                    </td>
                    <td className="px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                      Rs {p.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                      {p.method}
                    </td>
                    <td className="px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                      <Badge
                        variant="outline"
                        className={statusBadgeClass(p.status)}
                      >
                        <span className="inline-flex items-center gap-1">
                          {p.status === "Completed" && (
                            <CheckCircle2 size={14} />
                          )}
                          {p.status === "Processing" && <Clock size={14} />}
                          {p.status === "Failed" && <XCircle size={14} />}
                          {p.status}
                        </span>
                      </Badge>
                    </td>
                    <td className="px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                      {p.reference}
                    </td>
                    <td className="px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelected(p)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
                {pageItems.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-sm text-[color:var(--color-neutral-600)]"
                    >
                      No payouts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4">
            <div className="text-xs text-[color:var(--color-neutral-600)]">
              Showing {total === 0 ? 0 : start + 1}-{end} of {total}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <Button
                size="sm"
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="text-sm sm:hidden">
                {currentPage}/{totalPages}
              </div>
              <div className="text-sm hidden sm:block">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Payout ${selected.id}` : undefined}
      >
        {selected && (
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="text-[color:var(--color-neutral-600)]">Date</div>
              <div className="font-medium">{selected.date}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-[color:var(--color-neutral-600)]">
                Amount
              </div>
              <div className="font-medium">
                Rs {selected.amount.toLocaleString()}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-[color:var(--color-neutral-600)]">
                Method
              </div>
              <div className="font-medium">{selected.method}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-[color:var(--color-neutral-600)]">
                Status
              </div>
              <Badge
                variant="outline"
                className={statusBadgeClass(selected.status)}
              >
                {selected.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-[color:var(--color-neutral-600)]">
                Reference
              </div>
              <div className="font-medium">{selected.reference}</div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
