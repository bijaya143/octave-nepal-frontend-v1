"use client";
import React from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DataTable, { DataTableColumn } from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import {
  CheckCircle2,
  XCircle,
  Pencil,
  Trash2,
  RotateCcw,
} from "lucide-react";
import Input from "@/components/ui/Input";
import DateRangePicker from "@/components/ui/DateRangePicker";
import Select from "@/components/ui/Select";
import { toast } from "sonner";
import StudentFormModal, { StudentFormValues } from "./StudentFormModal";
import { useRouter } from "next/navigation";
import { AdminStudentFilterInput, adminStudentService } from "@/lib/services/admin";
import { Student as StudentType } from "@/lib/services/student";
import Avatar from "@/components/ui/Avatar";

// Student type for UI display (matches the current page interface)
type Student = {
  id: string;
  name: string;
  email: string;
  bio: string;
  isActive: boolean;
  isVerified?: boolean;
  isSuspended?: boolean;
  phone?: string;
  phoneCountryCode?: string;
  dateOfBirth?: string;
  address?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  addressString?: string; // For display purposes
  billing?: {
    billingEmail?: string;
    billingAddress?: string;
    billingTaxId?: string;
  };
  billingAddress?: string;
  taxId?: string;
  billingEmail?: string;
  joinedAt: string; // YYYY-MM-DD (UTC)
  updatedAt: string; // YYYY-MM-DD (UTC)
  coursesEnrolled: number;
  avatarUrl: string;
};

function statusBadgeClass(isActive: boolean): string {
  return isActive
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : "bg-gray-50 text-gray-700 border-gray-200";
}

export default function AdminStudentsPage() {
  const router = useRouter();
  const [students, setStudents] = React.useState<Student[]>([]);
  const [pagination, setPagination] = React.useState<{
    page: number;
    limit: number;
    total: number;
  } | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [page, setPage] = React.useState(1);
  const pageSize = 10;
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<
    "All" | "Active" | "Inactive"
  >("All");
  const [verifiedFilter, setVerifiedFilter] = React.useState<
    "All" | "Verified" | "Unverified"
  >("All");
  const [suspendedFilter, setSuspendedFilter] = React.useState<
    "All" | "Suspended" | "NotSuspended"
  >("All");
  const [joinedFrom, setJoinedFrom] = React.useState<string>("");
  const [joinedTo, setJoinedTo] = React.useState<string>("");
  const [minCourses, setMinCourses] = React.useState<string>("");
  const [maxCourses, setMaxCourses] = React.useState<string>("");

  // Refresh function to force data reload
  const refreshStudents = React.useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  // Fetch students when filters or page changes
  React.useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const queryParams: AdminStudentFilterInput = {
          page,
          limit: pageSize,
        };

        // Add keyword search
        if (query.trim()) {
          queryParams.keyword = query.trim();
        }

        // Add status filter
        if (statusFilter !== "All") {
          queryParams.isActive = statusFilter === "Active";
        }

        // Add verified filter
        if (verifiedFilter !== "All") {
          queryParams.isVerified = verifiedFilter === "Verified";
        }

        // Add suspended filter
        if (suspendedFilter !== "All") {
          queryParams.isSuspended = suspendedFilter === "Suspended";
        }

        // Add date range
        if (joinedFrom) {
          queryParams.startDate = joinedFrom;
        }
        if (joinedTo) {
          queryParams.endDate = joinedTo;
        }

        // Add course count filters
        if (minCourses.trim()) {
          const minC = Number.parseInt(minCourses, 10);
          if (!Number.isNaN(minC)) {
            queryParams.minCourseCount = minC;
          }
        }
        if (maxCourses.trim()) {
          const maxC = Number.parseInt(maxCourses, 10);
          if (!Number.isNaN(maxC)) {
            queryParams.maxCourseCount = maxC;
          }
        }

        const response = await adminStudentService.list(queryParams);

        if (!response.success) {
          throw new Error(
            response.error?.message || "Failed to fetch students"
          );
        }

        // Transform data to UI format
        const transformedStudents: Student[] = response.data.data.map(
          (entity: StudentType) => {
            // Build full name from firstName, middleName, lastName
            const nameParts = [
              entity.firstName,
              entity.middleName,
              entity.lastName,
            ].filter(Boolean);
            const name =
              nameParts.length > 0 ? nameParts.join(" ") : entity.email;

            // Build full address string
            const addressParts = [];
            if (entity.address?.addressLine1)
              addressParts.push(entity.address.addressLine1);
            if (entity.address?.addressLine2)
              addressParts.push(entity.address.addressLine2);
            if (entity.address?.city) addressParts.push(entity.address.city);
            if (entity.address?.state) addressParts.push(entity.address.state);
            if (entity.address?.zipCode)
              addressParts.push(entity.address.zipCode);
            if (entity.address?.country)
              addressParts.push(entity.address.country);
            const address = addressParts.join(", ");

            // Build avatar URL from profilePictureKey
            const avatarUrl = entity.profilePictureKey
              ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${entity.profilePictureKey}`
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

            // Format dates to YYYY-MM-DD (UTC)
            const formatDate = (date: Date | string | undefined): string => {
              if (!date) return "";
              const d = new Date(date);
              return `${d.getUTCFullYear()}-${String(
                d.getUTCMonth() + 1
              ).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
            };

            return {
              id: entity.id,
              name,
              email: entity.email,
              bio: entity.bio || "",
              isActive: entity.isActive,
              isVerified: entity.isVerified,
              isSuspended: entity.isSuspended,
              phone: entity.phoneNumber,
              phoneCountryCode: entity.phoneCountryCode,
              dateOfBirth: entity.dateOfBirth,
              address: entity.address,
              addressString: address,
              billing: entity.billing,
              billingAddress: entity.billing?.billingAddress,
              taxId: entity.billing?.billingTaxId,
              billingEmail: entity.billing?.billingEmail,
              joinedAt: formatDate(entity.createdAt),
              updatedAt: formatDate(entity.updatedAt),
              coursesEnrolled: entity.enrolledCourseCount || 0,
              avatarUrl,
            };
          }
        );

        setStudents(transformedStudents);
        setPagination(response.data.meta);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An error occurred while fetching students";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [
    page,
    query,
    statusFilter,
    verifiedFilter,
    suspendedFilter,
    joinedFrom,
    joinedTo,
    minCourses,
    maxCourses,
    pageSize,
    refreshKey,
  ]);

  const total = pagination?.total || 0;
  const pageCount = pagination
    ? Math.max(1, Math.ceil(total / pagination.limit))
    : 1;
  const currentPage = Math.min(Math.max(1, page), pageCount);
  const pagedStudents = students;

  const nextPage = () => setPage((p) => Math.min(p + 1, pageCount));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));
  const [openCreate, setOpenCreate] = React.useState(false);
  const [editing, setEditing] = React.useState<Student | null>(null);
  const [pendingDelete, setPendingDelete] = React.useState<Student | null>(
    null
  );

  const handleCreate = React.useCallback(async (values: StudentFormValues) => {
    setIsSubmitting(true);
    try {
      // Filter out null profilePicture before sending to API
      const apiData = {
        ...values,
        profilePicture: values.profilePicture || undefined,
      };
      const response = await adminStudentService.create(apiData);
      if (response.success) {
        toast.success(`Student created successfully`);
        setOpenCreate(false);
        // Refresh the students list
        refreshStudents();
      } else {
        throw new Error(response.error?.message || "Failed to create student");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create student";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleEdit = React.useCallback(
    async (values: StudentFormValues) => {
      if (!editing) return;

      setIsSubmitting(true);
      try {
        const updateData = {
          ...values,
          id: editing.id,
          profilePicture: values.profilePicture || undefined,
        };
        const response = await adminStudentService.update(updateData);
        if (response.success) {
          toast.success(`Student updated successfully`);
          setEditing(null);
          // Refresh the students list
          refreshStudents();
        } else {
          throw new Error(
            response.error?.message || "Failed to update student"
          );
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to update student";
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [editing]
  );

  const handleDelete = React.useCallback((student: Student) => {
    setPendingDelete(student);
  }, []);

  const confirmDelete = React.useCallback(async () => {
    if (!pendingDelete) return;

    try {
      const response = await adminStudentService.delete(pendingDelete.id);
      if (response.success) {
        toast.success(`Student deleted successfully`);
        setPendingDelete(null);
        // Refresh the students list
        refreshStudents();
      } else {
        throw new Error(response.error?.message || "Failed to delete student");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete student";
      toast.error(errorMessage);
    }
  }, [pendingDelete]);

  const cancelDelete = React.useCallback(() => {
    setPendingDelete(null);
  }, []);

  const coursesRangeValue = React.useMemo(() => {
    const minC = minCourses.trim();
    const maxC = maxCourses.trim();
    if (minC === "" && maxC === "") return "any";
    if (minC === "0" && maxC === "3") return "0-3";
    if (minC === "4" && maxC === "6") return "4-6";
    if (minC === "7" && maxC === "10") return "7-10";
    if (minC === "11" && maxC === "") return "11+";
    return "custom";
  }, [minCourses, maxCourses]);

  const columns: Array<DataTableColumn<Student>> = [
    {
      id: "name",
      header: "Name",
      accessor: "name",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 overflow-hidden rounded-full">
            <Avatar
              src={row.avatarUrl}
              alt={row.name}
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      id: "email",
      header: "Email",
      accessor: "email",
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "verified",
      header: "Verified",
      accessor: (row) =>
        row.isVerified ? <CheckCircle2 size={14} /> : <XCircle size={14} />,
      cellClassName: "whitespace-nowrap",
      cell: (row) => (
        <Badge
          variant="outline"
          className={statusBadgeClass(row.isVerified ?? false)}
        >
          <span className="inline-flex items-center gap-1">
            {row.isVerified ? (
              <CheckCircle2 size={14} />
            ) : (
              <XCircle size={14} />
            )}
            {row.isVerified ? "Verified" : "Unverified"}
          </span>
        </Badge>
      ),
    },
    {
      id: "suspended",
      header: "Suspended",
      accessor: (row) =>
        row.isSuspended ? <XCircle size={14} /> : <CheckCircle2 size={14} />,
      cellClassName: "whitespace-nowrap",
      cell: (row) => (
        <Badge
          variant="outline"
          className={
            row.isSuspended
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-emerald-50 text-emerald-700 border-emerald-200"
          }
        >
          <span className="inline-flex items-center gap-1">
            {row.isSuspended ? (
              <XCircle size={14} />
            ) : (
              <CheckCircle2 size={14} />
            )}
            {row.isSuspended ? "Suspended" : "Not suspended"}
          </span>
        </Badge>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessor: (row) => (row.isActive ? "Active" : "Inactive"),
      cellClassName: "whitespace-nowrap",
      cell: (row) => (
        <Badge variant="outline" className={statusBadgeClass(row.isActive)}>
          {row.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "coursesEnrolled",
      header: "Courses",
      accessor: (row) => row.coursesEnrolled,
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "actions",
      header: "Actions",
      align: "center",
      cell: (row) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="gap-1"
            aria-label="Edit"
            onClick={(e) => {
              e.stopPropagation();
              setEditing(row);
            }}
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="gap-1 text-red-600 border-red-200 hover:bg-red-50"
            aria-label="Delete"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Students</h1>
        </div>
        <Button size="sm" onClick={() => setOpenCreate(true)}>
          Add Student
        </Button>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-5">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Search
            </label>
            <Input
              placeholder="Search students..."
              value={query}
              onChange={(e) => {
                setPage(1);
                setQuery(e.target.value);
              }}
            />
          </div>
          <div className="md:col-span-5">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Joined Date
            </label>
            <DateRangePicker
              value={{ from: joinedFrom || null, to: joinedTo || null }}
              onChange={(r) => {
                setPage(1);
                setJoinedFrom(r.from || "");
                setJoinedTo(r.to || "");
              }}
              placeholder="Joined date range"
            />
          </div>
          <div className="md:col-span-2 flex md:justify-end">
            <Button
              variant="secondary"
              size="md"
              className="w-full md:w-auto inline-flex items-center gap-2 text-primary-600 border-primary-200 hover:bg-primary-50"
              onClick={() => {
                setQuery("");
                setStatusFilter("All");
                setVerifiedFilter("All");
                setSuspendedFilter("All");
                setJoinedFrom("");
                setJoinedTo("");
                setMinCourses("");
                setMaxCourses("");
                setPage(1);
              }}
            >
              <RotateCcw size={16} /> Reset
            </Button>
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Status
            </label>
            <Select
              value={statusFilter}
              onChange={(e) => {
                setPage(1);
                setStatusFilter(e.target.value as any);
              }}
            >
              <option value="All">Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Verified
            </label>
            <Select
              value={verifiedFilter}
              onChange={(e) => {
                setPage(1);
                setVerifiedFilter(e.target.value as any);
              }}
            >
              <option value="All">Verifications</option>
              <option value="Verified">Verified</option>
              <option value="Unverified">Unverified</option>
            </Select>
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Suspended
            </label>
            <Select
              value={suspendedFilter}
              onChange={(e) => {
                setPage(1);
                setSuspendedFilter(e.target.value as any);
              }}
            >
              <option value="All">Suspensions</option>
              <option value="Suspended">Suspended</option>
              <option value="NotSuspended">Not suspended</option>
            </Select>
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">
              Courses
            </label>
            <Select
              value={coursesRangeValue}
              onChange={(e) => {
                const v = e.target.value;
                setPage(1);
                if (v === "any") {
                  setMinCourses("");
                  setMaxCourses("");
                } else if (v === "0-3") {
                  setMinCourses("0");
                  setMaxCourses("3");
                } else if (v === "4-6") {
                  setMinCourses("4");
                  setMaxCourses("6");
                } else if (v === "7-10") {
                  setMinCourses("7");
                  setMaxCourses("10");
                } else if (v === "11+") {
                  setMinCourses("11");
                  setMaxCourses("");
                }
              }}
            >
              <option value="any">Courses</option>
              <option value="0-3">0-3 courses</option>
              <option value="4-6">4-6 courses</option>
              <option value="7-10">7-10 courses</option>
              <option value="11+">11+ courses</option>
            </Select>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="py-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2 text-[color:var(--color-neutral-600)]">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Loading students...</span>
              </div>
            </div>
          ) : (
            <>
              <DataTable<Student>
                data={pagedStudents}
                columns={columns}
                getRowKey={(row) => row.id}
                emptyMessage="No students found."
                onRowClick={(row) => router.push(`/admin/students/${row.id}`)}
              />
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4">
                <p className="text-sm text-[color:var(--color-neutral-600)]">
                  Showing {total === 0 ? 0 : (currentPage - 1) * pageSize + 1}-
                  {Math.min(currentPage * pageSize, total)} of {total}
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full sm:w-auto"
                    disabled={currentPage === 1 || isLoading}
                    onClick={prevPage}
                  >
                    Previous
                  </Button>
                  <div className="text-sm sm:hidden">
                    {currentPage}/{pageCount}
                  </div>
                  <div className="text-sm hidden sm:block">
                    Page {currentPage} of {pageCount}
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full sm:w-auto"
                    disabled={currentPage === pageCount || isLoading}
                    onClick={nextPage}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Modal
        open={!!pendingDelete}
        onClose={cancelDelete}
        title={pendingDelete ? "Delete Student" : undefined}
      >
        {pendingDelete && (
          <div className="space-y-4 text-sm">
            <div className="text-[color:var(--color-neutral-800)]">
              Are you sure you want to delete
              <span className="font-medium"> {pendingDelete.name} </span>? This
              action cannot be undone.
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button variant="secondary" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button
                variant="secondary"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <StudentFormModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreate}
        title="Create Student"
        mode="create"
        isLoading={isSubmitting}
      />
      <StudentFormModal
        open={!!editing}
        onClose={() => setEditing(null)}
        onSubmit={handleEdit}
        title="Edit Student"
        mode="edit"
        initialValues={
          editing
            ? {
                // Split the combined name back into parts (this is a simple split, might need refinement)
                firstName: editing.name.split(" ")[0] || "",
                middleName:
                  editing.name.split(" ").slice(1, -1).join(" ") || "",
                lastName: editing.name.split(" ").slice(-1)[0] || "",
                email: editing.email,
                phoneNumber: editing.phone,
                phoneCountryCode: editing.phoneCountryCode || "",
                bio: editing.bio,
                dateOfBirth: editing.dateOfBirth || "",
                address: editing.address
                  ? {
                      addressLine1: editing.address.addressLine1 || "",
                      addressLine2: editing.address.addressLine2 || "",
                      city: editing.address.city || "",
                      state: editing.address.state || "",
                      zipCode: editing.address.zipCode || "",
                      country: editing.address.country || "",
                    }
                  : {
                      addressLine1: "",
                      addressLine2: "",
                      city: "",
                      state: "",
                      zipCode: "",
                      country: "",
                    },
                billing: editing.billing
                  ? {
                      billingEmail: editing.billing.billingEmail || "",
                      billingAddress: editing.billing.billingAddress || "",
                      billingTaxId: editing.billing.billingTaxId || "",
                    }
                  : editing.billingAddress ||
                    editing.taxId ||
                    editing.billingEmail
                  ? {
                      billingEmail: editing.billingEmail || "",
                      billingAddress: editing.billingAddress || "",
                      billingTaxId: editing.taxId || "",
                    }
                  : {
                      billingEmail: "",
                      billingAddress: "",
                      billingTaxId: "",
                    },
                isActive: editing.isActive,
                isVerified: editing.isVerified,
                isSuspended: editing.isSuspended,
              }
            : undefined
        }
        initialAvatarUrl={editing?.avatarUrl}
        isLoading={isSubmitting}
      />
    </div>
  );
}
