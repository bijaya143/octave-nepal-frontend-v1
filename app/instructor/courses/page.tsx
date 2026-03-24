"use client";
import React from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";

type InstructorCourse = {
  id: string;
  title: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  students: number;
  rating: number;
  status: "Draft" | "Published" | "Archived";
  updatedAt: string; // ISO or friendly
};

const sampleCourses: InstructorCourse[] = Array.from({ length: 27 }).map(
  (_, i) => ({
    id: `course_${i + 1}`,
    title: `Professional Course ${i + 1}`,
    category: [
      "Development",
      "Design",
      "Business",
      "Marketing",
      "Data Science",
    ][i % 5],
    level: (["Beginner", "Intermediate", "Advanced"] as const)[i % 3],
    price: 1500 + (i % 7) * 500,
    students: 20 + ((i * 3) % 200),
    rating: 3.5 + ((i * 7) % 15) / 10,
    status: ["Draft", "Published", "Published", "Draft", "Archived"][
      i % 5
    ] as InstructorCourse["status"],
    updatedAt: new Date(Date.now() - i * 86400000).toLocaleDateString(),
  })
);

export default function InstructorCoursesPage() {
  const [page, setPage] = React.useState(1);
  const [selectedCourse, setSelectedCourse] =
    React.useState<InstructorCourse | null>(null);
  const pageSize = 10;
  const total = sampleCourses.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const pageItems = sampleCourses.slice(start, end);

  const nextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));

  const statusBadgeClass = (status: InstructorCourse["status"]) => {
    const s = String(status).toLowerCase();
    if (s.includes("publish"))
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (s.includes("draft"))
      return "bg-amber-50 text-amber-700 border-amber-200";
    if (s.includes("archiv")) return "bg-gray-50 text-gray-700 border-gray-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <>
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h1
            className="text-xl md:text-2xl font-semibold"
            style={{ fontFamily: "var(--font-heading-sans)" }}
          >
            Your courses
          </h1>
          <p className="text-sm text-[color:var(--color-neutral-600)]">
            Manage and review your courses
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="py-0">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                    Title
                  </th>
                  <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                    Category
                  </th>
                  <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                    Level
                  </th>
                  <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                    Price
                  </th>
                  <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                    Students
                  </th>
                  <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                    Rating
                  </th>
                  <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                    Status
                  </th>
                  <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                    Updated
                  </th>
                  <th className="font-medium px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-[color:var(--color-neutral-50)]"
                  >
                    <td className="px-6 py-3 border-b border-[color:var(--color-neutral-200)] min-w-[240px]">
                      <div className="font-medium truncate" title={c.title}>
                        {c.title}
                      </div>
                      <div className="text-xs text-[color:var(--color-neutral-600)] truncate">
                        ID: {c.id}
                      </div>
                    </td>
                    <td className="px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                      {c.category}
                    </td>
                    <td className="px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                      {c.level}
                    </td>
                    <td className="px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                      Rs {c.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                      {c.students.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                      {c.rating.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                      <Badge
                        variant="outline"
                        className={statusBadgeClass(c.status)}
                      >
                        {c.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 border-b border-[color:var(--color-neutral-200)] whitespace-nowrap">
                      {c.updatedAt}
                    </td>
                    <td className="px-4 py-3 border-b border-[color:var(--color-neutral-200)]">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelectedCourse(c)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4">
            <div className="text-xs text-[color:var(--color-neutral-600)]">
              Showing {start + 1}-{end} of {total}
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="text-sm">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                size="sm"
                variant="secondary"
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
        open={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
        title={selectedCourse ? selectedCourse.title : undefined}
      >
        {selectedCourse && (
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="text-[color:var(--color-neutral-600)]">
                Status
              </div>
              <Badge
                variant="outline"
                className={statusBadgeClass(selectedCourse.status)}
              >
                {selectedCourse.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-[color:var(--color-neutral-600)]">
                Category
              </div>
              <div className="font-medium">{selectedCourse.category}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-[color:var(--color-neutral-600)]">Level</div>
              <div className="font-medium">{selectedCourse.level}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-[color:var(--color-neutral-600)]">Price</div>
              <div className="font-medium">
                Rs {selectedCourse.price.toLocaleString()}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-[color:var(--color-neutral-600)]">
                Students
              </div>
              <div className="font-medium">
                {selectedCourse.students.toLocaleString()}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-[color:var(--color-neutral-600)]">
                Rating
              </div>
              <div className="font-medium">
                {selectedCourse.rating.toFixed(1)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-[color:var(--color-neutral-600)]">
                Last updated
              </div>
              <div className="font-medium">{selectedCourse.updatedAt}</div>
            </div>

            {/* <div className="pt-2 flex items-center justify-end gap-2">
                <Link href={`/courses/${selectedCourse.id}`} className="inline-flex">
                  <Button variant="secondary" size="sm">Open full page</Button>
                </Link>
                <Button size="sm" onClick={() => setSelectedCourse(null)}>Close</Button>
              </div> */}
          </div>
        )}
      </Modal>
    </>
  );
}
