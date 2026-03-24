"use client";
import React from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DataTable, { DataTableColumn } from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { CheckCircle2, XCircle, Pencil, Trash2, RotateCcw } from "lucide-react";
import Input from "@/components/ui/Input";
import DateRangePicker from "@/components/ui/DateRangePicker";
import Select from "@/components/ui/Select";
import { toast } from "sonner";
import InstructorFormModal, { InstructorFormValues } from "./InstructorFormModal";
import { useRouter } from "next/navigation";
import { adminInstructorService, InstructorBillingPaymentMethod } from "@/lib/services/admin/instructor";
import { AdminInstructorFilterInput, Instructor as InstructorType } from "@/lib/services"; // Import service type as alias
import Avatar from "@/components/ui/Avatar";

// Instructor type for UI display (matches AdminStudentsPage pattern)
type Instructor = {
    id: string;
    name: string; // Full name combined
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    bio: string;
    isActive: boolean;
    isVerified?: boolean;
    isSuspended?: boolean;
    isFeatured?: boolean;
    phone?: string;
    phoneCountryCode?: string;
    experience?: string;
    role?: string;
    skills: string[];
    address?: {
        addressLine1?: string;
        addressLine2?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
    };
    addressString?: string;
    billing?: {
        billingEmail?: string;
        billingAddress?: string;
        billingPaymentMethod?: string;
        billingTaxId?: string;
    };
    socialLinks?: Array<{ name: string; url: string }>;
    joinedAt: string;
    updatedAt: string;
    courseCount: number;
    avatarUrl: string; // Pre-computed URL
};

function statusBadgeClass(isActive: boolean): string {
    return isActive
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-gray-50 text-gray-700 border-gray-200";
}

export default function AdminInstructorsPage() {
    const router = useRouter();
    const [instructors, setInstructors] = React.useState<Instructor[]>([]);
    const [pagination, setPagination] = React.useState<{ page: number; limit: number; total: number } | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const [page, setPage] = React.useState(1);
    const pageSize = 10;
    const [refreshKey, setRefreshKey] = React.useState(0);
    const [query, setQuery] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState<"All" | "Active" | "Inactive">("All");
    const [verifiedFilter, setVerifiedFilter] = React.useState<"All" | "Verified" | "Unverified">("All");
    const [suspendedFilter, setSuspendedFilter] = React.useState<"All" | "Suspended" | "NotSuspended">("All");
    const [featuredFilter, setFeaturedFilter] = React.useState<"All" | "Featured" | "NotFeatured">("All");
    const [joinedFrom, setJoinedFrom] = React.useState<string>("");
    const [joinedTo, setJoinedTo] = React.useState<string>("");
    const [minCourses, setMinCourses] = React.useState<string>("");
    const [maxCourses, setMaxCourses] = React.useState<string>("");

    const refreshInstructors = React.useCallback(() => {
        setRefreshKey((prev) => prev + 1);
    }, []);

    React.useEffect(() => {
        const fetchInstructors = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const queryParams: AdminInstructorFilterInput = {
                    page,
                    limit: pageSize,
                };

                if (query.trim()) queryParams.keyword = query.trim();
                if (statusFilter !== "All") queryParams.isActive = statusFilter === "Active";
                if (verifiedFilter !== "All") queryParams.isVerified = verifiedFilter === "Verified";
                if (suspendedFilter !== "All") queryParams.isSuspended = suspendedFilter === "Suspended";
                if (featuredFilter !== "All") queryParams.isFeatured = featuredFilter === "Featured";
                
                if (joinedFrom) queryParams.startDate = joinedFrom;
                if (joinedTo) queryParams.endDate = joinedTo;

                // Course count filters (if supported by API types, currently passing them, types.ts might ignore if not defined but strictly speaking correct pattern)
                if (minCourses.trim() && !Number.isNaN(Number(minCourses))) queryParams.minCourseCount = Number(minCourses);
                if (maxCourses.trim() && !Number.isNaN(Number(maxCourses))) queryParams.maxCourseCount = Number(maxCourses);

                const response = await adminInstructorService.list(queryParams);

                if (!response.success) {
                    throw new Error(response.error?.message || "Failed to fetch instructors");
                }

                // Transform data to UI format
                const transformedInstructors: Instructor[] = response.data.data.map((entity: InstructorType) => {
                    const nameParts = [entity.firstName, entity.middleName, entity.lastName].filter(Boolean);
                    const name = nameParts.length > 0 ? nameParts.join(" ") : entity.email;

                    const addressParts = [];
                    const addr = entity.address as any; // Cast safely or define proper type if needed
                    if (addr?.addressLine1) addressParts.push(addr.addressLine1);
                    if (addr?.city) addressParts.push(addr.city);
                    if (addr?.country) addressParts.push(addr.country);
                    const addressString = addressParts.join(", ");

                    const avatarUrl = entity.profilePictureKey
                        ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${entity.profilePictureKey}`
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

                    const formatDate = (date: Date | string | undefined): string => {
                        if (!date) return "";
                        const d = new Date(date);
                        return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
                    };

                    return {
                        id: entity.id,
                        name,
                        firstName: entity.firstName || "",
                        middleName: entity.middleName,
                        lastName: entity.lastName || "",
                        email: entity.email,
                        bio: entity.bio || "",
                        isActive: entity.isActive,
                        isVerified: entity.isVerified,
                        isSuspended: entity.isSuspended,
                        isFeatured: (entity as any).isFeatured, // Use any cast if type def lagging
                        phone: entity.phoneNumber as string | undefined, // Handle loose typing
                        phoneCountryCode: entity.phoneCountryCode as string | undefined,
                        role: (entity as any).role,
                        experience: (entity as any).experienceInYears?.toString(),
                        skills: (entity as any).skills || [],
                        address: entity.address as any,
                        addressString,
                        billing: entity.billing as any,
                        socialLinks: (entity as any).socialLinks || [],
                        joinedAt: formatDate(entity.createdAt as any), // Types might use createdAt from base or specific
                        updatedAt: formatDate(entity.updatedAt as any),
                        courseCount: 0, // Placeholder as service might not return this yet or field name differs
                        avatarUrl,
                    };
                });

                setInstructors(transformedInstructors);
                setPagination(response.data.meta);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "An error occurred while fetching instructors";
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInstructors();
    }, [page, query, statusFilter, verifiedFilter, suspendedFilter, featuredFilter, joinedFrom, joinedTo, minCourses, maxCourses, pageSize, refreshKey]);

    const total = pagination?.total || 0;
    const pageCount = pagination ? Math.max(1, Math.ceil(total / pagination.limit)) : 1;
    const currentPage = Math.min(Math.max(1, page), pageCount);
    // Use transformed list directly
    const pagedInstructors = instructors; 

    const nextPage = () => setPage((p) => Math.min(p + 1, pageCount));
    const prevPage = () => setPage((p) => Math.max(p - 1, 1));
    const [openCreate, setOpenCreate] = React.useState(false);
    const [editing, setEditing] = React.useState<Instructor | null>(null);
    const [pendingDelete, setPendingDelete] = React.useState<Instructor | null>(null);

    const handleCreate = React.useCallback(async (values: InstructorFormValues) => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...values,
                billing: values.billing ? {
                    ...values.billing,
                    billingPaymentMethod: values.billing.billingPaymentMethod as InstructorBillingPaymentMethod | undefined
                } : undefined,
                profilePicture: values.avatarFile || undefined,
                experienceInYears: values.experience ? parseInt(values.experience) : undefined,
            };

            const response = await adminInstructorService.create(payload);
            if (response.success) {
                toast.success(`Instructor created successfully`);
                setOpenCreate(false);
                refreshInstructors();
            } else {
                throw new Error(response.error?.message || "Failed to create instructor");
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to create";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    }, [refreshInstructors]);

    const handleEdit = React.useCallback(async (values: InstructorFormValues) => {
        if (!editing) return;
        setIsSubmitting(true);
        try {
            const updateData = {
                ...values,
                id: editing.id,
                billing: values.billing ? {
                    ...values.billing,
                    billingPaymentMethod: values.billing.billingPaymentMethod as InstructorBillingPaymentMethod | undefined
                } : undefined,
                profilePicture: values.avatarFile || undefined,
                experienceInYears: values.experience ? parseInt(values.experience) : undefined,
            };

            const response = await adminInstructorService.update(updateData);
            if (response.success) {
                toast.success("Instructor updated successfully");
                setEditing(null);
                refreshInstructors();
            } else {
                throw new Error(response.error?.message || "Failed to update");
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update");
        } finally {
            setIsSubmitting(false);
        }
    }, [editing, refreshInstructors]);

    const handleDelete = React.useCallback((instructor: Instructor) => {
        setPendingDelete(instructor);
    }, []);

    const confirmDelete = React.useCallback(async () => {
        if (!pendingDelete) return;
        try {
            const response = await adminInstructorService.delete(pendingDelete.id);
            if (response.success) {
                toast.success("Instructor deleted successfully");
                setPendingDelete(null);
                refreshInstructors();
            } else {
                throw new Error(response.error?.message || "Failed to delete");
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to delete");
        }
    }, [pendingDelete, refreshInstructors]);

    const cancelDelete = React.useCallback(() => {
        setPendingDelete(null);
    }, []);

    const coursesRangeValue = React.useMemo(() => {
        const minC = minCourses.trim();
        const maxC = maxCourses.trim();
        if (minC === "" && maxC === "") return "any";
        if (minC === "0" && maxC === "5") return "0-5";
        if (minC === "6" && maxC === "10") return "6-10";
        if (minC === "11" && maxC === "20") return "11-20";
        if (minC === "21" && maxC === "") return "21+";
        return "custom";
    }, [minCourses, maxCourses]);

    const columns: Array<DataTableColumn<Instructor>> = [
        {
            id: "name",
            header: "Name",
            accessor: "name", // Use the pre-computed full name
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 overflow-hidden rounded-full">
                         <Avatar
                            src={row.avatarUrl} // Use pre-computed avatar URL
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
        { id: "email", header: "Email", accessor: "email", cellClassName: "whitespace-nowrap" },
        { id: "verified", header: "Verified", accessor: (row) => row.isVerified ? <CheckCircle2 size={14} /> : <XCircle size={14} />, cellClassName: "whitespace-nowrap", cell: (row) => (
            <Badge variant="outline" className={statusBadgeClass(row.isVerified ?? false)}>
                <span className="inline-flex items-center gap-1">
                    {row.isVerified ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    {row.isVerified ? "Verified" : "Unverified"}
                </span>
            </Badge>
        )},
        { id: "suspended", header: "Suspended", accessor: (row) => row.isSuspended ? <XCircle size={14} /> : <CheckCircle2 size={14} />, cellClassName: "whitespace-nowrap", cell: (row) => (
            <Badge
                variant="outline"
                className={row.isSuspended
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"}
            >
                <span className="inline-flex items-center gap-1">
                    {row.isSuspended ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                    {row.isSuspended ? "Suspended" : "Not suspended"}
                </span>
            </Badge>
        )},
        {
            id: "featured",
            header: "Featured",
            accessor: (row) => row.isFeatured ? <CheckCircle2 size={14} /> : <XCircle size={14} />,
            cellClassName: "whitespace-nowrap",
            cell: (row) => (
                <Badge
                    variant="outline"
                    className={row.isFeatured
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-gray-50 text-gray-700 border-gray-200"}
                >
                    <span className="inline-flex items-center gap-1">
                        {row.isFeatured ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        {row.isFeatured ? "Featured" : "Not featured"}
                    </span>
                </Badge>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            align: "center",
            cell: (row) => (
                <div className="flex items-center justify-center gap-2">
                    <Button variant="secondary" size="sm" className="gap-1" aria-label="Edit" onClick={(e) => { e.stopPropagation(); setEditing(row); }}>
                        <Pencil size={16} />
                    </Button>
                    <Button variant="secondary" size="sm" className="gap-1 text-red-600 border-red-200 hover:bg-red-50" aria-label="Delete" onClick={(e) => { e.stopPropagation(); handleDelete(row); }}>
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
                    <h1 className="text-xl sm:text-2xl font-semibold">Instructors</h1>
                </div>
                <Button size="sm" onClick={() => setOpenCreate(true)}>Add Instructor</Button>
            </div>

            {/* Filters */}
            <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-3">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    <div className="md:col-span-5">
                        <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Search</label>
                        <Input
                            placeholder="Search instructors..."
                            value={query}
                            onChange={(e) => { setPage(1); setQuery(e.target.value); }}
                        />
                    </div>
                    <div className="md:col-span-5">
                        <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Joined Date</label>
                        <DateRangePicker
                            value={{ from: joinedFrom || null, to: joinedTo || null }}
                            onChange={(r) => { setPage(1); setJoinedFrom(r.from || ""); setJoinedTo(r.to || ""); }}
                            placeholder="Joined date range"
                        />
                    </div>
                    <div className="md:col-span-2 flex md:justify-end">
                        <Button
                            variant="secondary"
                            size="md"
                            className="w-full md:w-auto inline-flex items-center gap-2 text-primary-600 border-primary-200 hover:bg-primary-50"
                            onClick={() => { setQuery(""); setStatusFilter("All"); setVerifiedFilter("All"); setSuspendedFilter("All"); setFeaturedFilter("All"); setJoinedFrom(""); setJoinedTo(""); setMinCourses(""); setMaxCourses(""); setPage(1); }}
                        >
                            <RotateCcw size={16} /> Reset
                        </Button>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Status</label>
                        <Select value={statusFilter} onChange={(e) => { setPage(1); setStatusFilter(e.target.value as any); }}>
                            <option value="All">Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </Select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Verified</label>
                        <Select value={verifiedFilter} onChange={(e) => { setPage(1); setVerifiedFilter(e.target.value as any); }}>
                            <option value="All">Verifications</option>
                            <option value="Verified">Verified</option>
                            <option value="Unverified">Unverified</option>
                        </Select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Suspended</label>
                        <Select value={suspendedFilter} onChange={(e) => { setPage(1); setSuspendedFilter(e.target.value as any); }}>
                            <option value="All">Suspensions</option>
                            <option value="Suspended">Suspended</option>
                            <option value="NotSuspended">Not suspended</option>
                        </Select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Featured</label>
                        <Select value={featuredFilter} onChange={(e) => { setPage(1); setFeaturedFilter(e.target.value as any); }}>
                            <option value="All">Features</option>
                            <option value="Featured">Featured</option>
                            <option value="NotFeatured">Not featured</option>
                        </Select>
                    </div>


                    <div className="md:col-span-2">
                        <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Courses</label>
                        <Select
                            value={coursesRangeValue}
                            onChange={(e) => {
                                const v = e.target.value;
                                setPage(1);
                                if (v === "any") { setMinCourses(""); setMaxCourses(""); }
                                else if (v === "0-5") { setMinCourses("0"); setMaxCourses("5"); }
                                else if (v === "6-10") { setMinCourses("6"); setMaxCourses("10"); }
                                else if (v === "11-20") { setMinCourses("11"); setMaxCourses("20"); }
                                else if (v === "21+") { setMinCourses("21"); setMaxCourses(""); }
                            }}
                        >
                            <option value="any">Courses</option>
                            <option value="0-5">0-5 courses</option>
                            <option value="6-10">6-10 courses</option>
                            <option value="11-20">11-20 courses</option>
                            <option value="21+">21+ courses</option>
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
                                <span className="text-sm">Loading instructors...</span>
                            </div>
                        </div>
                    ) : (
                    <>
                    <DataTable<Instructor>
                        data={pagedInstructors}
                        columns={columns}
                        getRowKey={(row) => row.id}
                        emptyMessage="No instructors found."
                        onRowClick={(row) => router.push(`/admin/instructors/${row.id}`)}
                    />
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4">
                        <p className="text-sm text-[color:var(--color-neutral-600)]">
                            Showing {total === 0 ? 0 : (currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, total)} of {total}
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
                            <div className="text-sm sm:hidden">{currentPage}/{pageCount}</div>
                            <div className="text-sm hidden sm:block">Page {currentPage} of {pageCount}</div>
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

            <Modal open={!!pendingDelete} onClose={cancelDelete} title={pendingDelete ? 'Delete Instructor' : undefined}>
                {pendingDelete && (
                    <div className="space-y-4 text-sm">
                        <div className="text-[color:var(--color-neutral-800)]">
                            Are you sure you want to delete
                            <span className="font-medium"> {pendingDelete.firstName} {pendingDelete.lastName} </span>?
                            This action cannot be undone.
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <Button variant="secondary" onClick={cancelDelete}>Cancel</Button>
                            <Button variant="secondary" className="text-red-600 border-red-200 hover:bg-red-50" onClick={confirmDelete}>Delete</Button>
                        </div>
                    </div>
                )}
            </Modal>

            <InstructorFormModal
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                onSubmit={handleCreate}
                title="Create Instructor"
                mode="create"
                isLoading={isSubmitting}
            />
            <InstructorFormModal
                open={!!editing}
                onClose={() => setEditing(null)}
                onSubmit={handleEdit}
                title="Edit Instructor"
                mode="edit"
                initialValues={editing ? {
                    firstName: editing.firstName,
                    middleName: editing.middleName,
                    lastName: editing.lastName,
                    email: editing.email,
                    bio: editing.bio || "",
                    isActive: editing.isActive,
                    isVerified: editing.isVerified,
                    isSuspended: editing.isSuspended,
                    skills: editing.skills, 
                    phoneNumber: editing.phone,
                    phoneCountryCode: editing.phoneCountryCode,
                    role: editing.role,
                    experience: editing.experience,
                    address: editing.address ? {
                        addressLine1: editing.address.addressLine1 || "",
                        addressLine2: editing.address.addressLine2 || "",
                        city: editing.address.city || "",
                        state: editing.address.state || "",
                        zipCode: editing.address.zipCode || "",
                        country: editing.address.country || "",
                    } : {
                        addressLine1: "",
                        addressLine2: "",
                        city: "",
                        state: "",
                        zipCode: "",
                        country: "",
                    },
                    billing: editing.billing ? {
                        billingEmail: editing.billing.billingEmail || "",
                        billingAddress: editing.billing.billingAddress || "",
                        billingPaymentMethod: editing.billing.billingPaymentMethod || "",
                        billingTaxId: editing.billing.billingTaxId || "",
                    } : {
                        billingEmail: "",
                        billingAddress: "",
                        billingPaymentMethod: "",
                        billingTaxId: "",
                    },
                    socialLinks: editing.socialLinks,
                } : undefined}
                initialAvatarUrl={editing?.avatarUrl}
                isLoading={isSubmitting}
            />
        </div>
    );
}
