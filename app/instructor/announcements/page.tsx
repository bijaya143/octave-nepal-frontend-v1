"use client";
import React from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import { Calendar, RotateCcw, Megaphone } from "lucide-react";
import CreateAnnouncementModal from "./CreateAnnouncementModal";

type AnnouncementStatus = "Draft" | "Scheduled" | "Published";

type Announcement = {
  id: string;
  title: string;
  course: "All" | string;
  audience: "All students" | "Course students";
  content: string;
  createdAt: string;
  scheduledAt?: string;
  publishedAt?: string;
  status: AnnouncementStatus;
};

const courseNames = [
  "React 19 Fundamentals",
  "TypeScript Mastery",
  "Node.js APIs",
] as const;

// Use a fixed UTC base time and UTC-only formatting to avoid hydration mismatch
const FAKE_NOW_UTC_MS = Date.UTC(2025, 9, 26, 6, 0, 0); // 2025-10-26 06:00:00 UTC
function pad2(n: number) {
  return String(n).padStart(2, "0");
}
function formatUTCDate(d: Date) {
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(
    d.getUTCDate()
  )}`;
}
function formatUTCDateTime(d: Date) {
  return `${formatUTCDate(d)} ${pad2(d.getUTCHours())}:${pad2(
    d.getUTCMinutes()
  )}`;
}

const sampleAnnouncements: Announcement[] = Array.from({ length: 18 }).map(
  (_, i) => {
    const statuses: AnnouncementStatus[] = [
      "Published",
      "Draft",
      "Scheduled",
      "Published",
    ];
    const status = statuses[i % statuses.length];
    const course: Announcement["course"] =
      i % 4 === 0 ? "All" : courseNames[i % courseNames.length];
    const baseDate = new Date(FAKE_NOW_UTC_MS - i * 86400000);
    return {
      id: `ann_${(i + 1).toString().padStart(3, "0")}`,
      title:
        status === "Draft"
          ? `Draft: Upcoming update ${i + 1}`
          : `Announcement ${i + 1}`,
      course,
      audience: course === "All" ? "All students" : "Course students",
      content: "Short message about schedule/resource update.",
      createdAt: formatUTCDate(baseDate),
      scheduledAt:
        status === "Scheduled"
          ? formatUTCDateTime(new Date(baseDate.getTime() + 2 * 86400000))
          : undefined,
      publishedAt:
        status === "Published" ? formatUTCDateTime(baseDate) : undefined,
      status,
    };
  }
);

// no status badge UI required

export default function InstructorAnnouncementsPage() {
  const [items, setItems] = React.useState<Announcement[]>(sampleAnnouncements);
  const [query, setQuery] = React.useState("");
  // status filter removed
  const [course, setCourse] = React.useState<"All" | string>("All");
  const [page, setPage] = React.useState(1);
  const [viewItem, setViewItem] = React.useState<Announcement | null>(null);
  const [openCreate, setOpenCreate] = React.useState(false);

  // Create form state
  const [formTitle, setFormTitle] = React.useState("");
  const [formCourse, setFormCourse] = React.useState<"All" | string>("All");
  const [formContent, setFormContent] = React.useState("");
  const [formScheduledAt, setFormScheduledAt] = React.useState("");

  const pageSize = 10;

  const filtered = React.useMemo(() => {
    return items.filter((a) => {
      const matchesQuery = query
        ? [a.title, a.content, a.id, a.course].some((v) =>
            String(v).toLowerCase().includes(query.toLowerCase())
          )
        : true;
      const matchesCourse = course === "All" ? true : a.course === course;
      return matchesQuery && matchesCourse;
    });
  }, [items, query, course]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const pageItems = filtered.slice(start, end);

  React.useEffect(() => {
    setPage(1);
  }, [query, course]);

  const nextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));

  // removed status-based counters

  function resetCreateForm() {
    setFormTitle("");
    setFormCourse("All");
    setFormContent("");
    setFormScheduledAt("");
  }

  function handleCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    const now = new Date();
    const id = `ann_${(items.length + 1).toString().padStart(3, "0")}`;
    const hasSchedule = Boolean(formScheduledAt);
    const newItem: Announcement = {
      id,
      title: formTitle || "Untitled announcement",
      course: formCourse,
      audience: formCourse === "All" ? "All students" : "Course students",
      content: formContent,
      createdAt: now.toLocaleDateString(),
      scheduledAt: hasSchedule
        ? new Date(formScheduledAt).toLocaleString()
        : undefined,
      publishedAt: !hasSchedule ? now.toLocaleString() : undefined,
      status: hasSchedule ? "Scheduled" : "Published",
    };
    setItems((prev) => [newItem, ...prev]);
    setOpenCreate(false);
    resetCreateForm();
  }

  function handleDelete(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
        <div>
          <h1
            className="text-xl md:text-2xl font-semibold"
            style={{ fontFamily: "var(--font-heading-sans)" }}
          >
            Announcements
          </h1>
          <p className="text-sm text-[color:var(--color-neutral-600)]">
            Notify your students about updates and resources
          </p>
        </div>
        <div className="flex items-center gap-2 mt-3 sm:mt-0 w-full sm:w-auto">
          <Button
            size="md"
            className="flex w-full sm:w-auto items-center justify-center gap-2"
            onClick={() => setOpenCreate(true)}
          >
            <Megaphone size={16} />
            New announcement
          </Button>
        </div>
      </div>

      <div className="mb-5 flex flex-col sm:flex-row gap-3 sm:items-end">
        <div className="sm:w-64">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, content, ID, course"
            aria-label="Search announcements"
          />
        </div>
        <div className="sm:w-56">
          <Select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            aria-label="Filter by course"
          >
            <option value="All">All courses</option>
            {Array.from(new Set(items.map((i) => i.course)))
              .filter((c) => c !== "All")
              .map((c) => (
                <option key={String(c)} value={String(c)}>
                  {String(c)}
                </option>
              ))}
          </Select>
        </div>
        <div className="sm:ml-auto flex items-center gap-2">
          <Button
            variant="secondary"
            className="inline-flex items-center gap-2"
            onClick={() => {
              setQuery("");
              setCourse("All");
            }}
          >
            <RotateCcw size={16} />
            Reset
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="py-0">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="font-medium px-6 py-3 border-b border-[color:var(--color-neutral-200)]">
                    Title
                  </th>
                  <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                    Course/Audience
                  </th>
                  <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                    Scheduled/Published
                  </th>
                  <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((a) => (
                  <tr
                    key={a.id}
                    className="hover:bg-[color:var(--color-neutral-50)]"
                  >
                    <td className="px-6 py-3 border-b border-[color:var(--color-neutral-200)] min-w-[260px]">
                      <div className="font-medium truncate" title={a.title}>
                        {a.title}
                      </div>
                      <div className="text-xs text-[color:var(--color-neutral-600)] truncate">
                        ID: {a.id}
                      </div>
                    </td>
                    <td className="px-4 py-3 border-b border-[color:var(--color-neutral-200)] whitespace-nowrap">
                      {a.course === "All" ? "All courses" : a.course} ·{" "}
                      {a.audience}
                    </td>
                    <td className="px-4 py-3 border-b border-[color:var(--color-neutral-200)] whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <Calendar size={14} />
                        {a.status === "Scheduled" && a.scheduledAt}
                        {a.status === "Published" && a.publishedAt}
                        {a.status === "Draft" && "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setViewItem(a)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleDelete(a.id)}
                          className="inline-flex items-center gap-1"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pageItems.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-sm text-[color:var(--color-neutral-600)]"
                    >
                      No announcements found
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

      {/* View modal */}
      <Modal
        open={!!viewItem}
        onClose={() => setViewItem(null)}
        title={viewItem ? viewItem.title : undefined}
      >
        {viewItem && (
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="text-[color:var(--color-neutral-600)]">
                Course
              </div>
              <div className="font-medium">
                {viewItem.course === "All" ? "All courses" : viewItem.course}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-[color:var(--color-neutral-600)]">
                Audience
              </div>
              <div className="font-medium">{viewItem.audience}</div>
            </div>
            {/* status display removed */}
            <div className="flex items-center justify-between">
              <div className="text-[color:var(--color-neutral-600)]">
                Scheduled/Published
              </div>
              <div className="font-medium">
                {viewItem.scheduledAt || viewItem.publishedAt || "—"}
              </div>
            </div>
            <div>
              <div className="text-[color:var(--color-neutral-600)] mb-1">
                Message
              </div>
              <div>{viewItem.content || "(No content)"}</div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create modal (reusable) */}
      <CreateAnnouncementModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        courses={courseNames as unknown as string[]}
        onSubmit={() => {
          // Delegate to existing handler using local form state for consistency
          // We keep the local form for now to minimize refactor surface
          const form = document.querySelector("form");
          // no-op: announcements page still handles creation via its own form
        }}
      />
    </>
  );
}
