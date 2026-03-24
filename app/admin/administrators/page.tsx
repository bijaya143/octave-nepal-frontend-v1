"use client";
import React from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DataTable, { DataTableColumn } from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { CheckCircle2, XCircle, Pencil, Trash2, RotateCcw, Shield, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Input from "@/components/ui/Input";
import DateRangePicker from "@/components/ui/DateRangePicker";
import Select from "@/components/ui/Select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AdministratorFormModal, { AdministratorFormValues, AdminAddressInput } from "./AdministratorFormModal";
import { adminSelfService, AdminRoleType } from "@/lib/services/admin/self";
import { Admin as AdminType } from "@/lib/services"; // Import service type as alias
import Avatar from "@/components/ui/Avatar";

// Administrator type for UI display
type Administrator = {
    id: string;
    name: string; // Full name
    firstName: string;
    middleName?: string;
    lastName?: string;
    email: string;
    bio: string;
    isActive: boolean;
    isVerified?: boolean;
    isSuspended?: boolean;
    role: AdminRoleType;
    phoneNumber?: string;
    phoneCountryCode?: string;
    address?: AdminAddressInput;
    addressString?: string;
    joinedAt: string;
    updatedAt: string;
    lastLogin?: string;
    avatarUrl: string;
};

function statusBadgeClass(isActive: boolean): string {
    return isActive
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-gray-50 text-gray-700 border-gray-200";
}

export default function AdminAdministratorsPage() {
    const router = useRouter();
    const [administrators, setAdministrators] = React.useState<Administrator[]>([]);
    const [pagination, setPagination] = React.useState<{ page: number; limit: number; total: number } | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const [page, setPage] = React.useState(1);
    const pageSize = 10;
    const [refreshKey, setRefreshKey] = React.useState(0);
    const [query, setQuery] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState<"All" | "Active" | "Inactive">("All");
    const [roleFilter, setRoleFilter] = React.useState<"All" | AdminRoleType>("All");
    const [verifiedFilter, setVerifiedFilter] = React.useState<"All" | "Verified" | "Unverified">("All");
    const [suspendedFilter, setSuspendedFilter] = React.useState<"All" | "Suspended" | "NotSuspended">("All");
    const [joinedFrom, setJoinedFrom] = React.useState<string>("");
    const [joinedTo, setJoinedTo] = React.useState<string>("");

    const refreshAdministrators = React.useCallback(() => {
        setRefreshKey((prev) => prev + 1);
    }, []);

    React.useEffect(() => {
        const fetchAdministrators = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const queryParams: any = {
                    page,
                    limit: pageSize,
                };

                if (query.trim()) queryParams.keyword = query.trim();
                if (statusFilter !== "All") queryParams.isActive = statusFilter === "Active";
                if (verifiedFilter !== "All") queryParams.isVerified = verifiedFilter === "Verified";
                if (suspendedFilter !== "All") queryParams.isSuspended = suspendedFilter === "Suspended";
                if (roleFilter !== "All") queryParams.roleType = roleFilter;
                
                if (joinedFrom) queryParams.startDate = joinedFrom;
                if (joinedTo) queryParams.endDate = joinedTo;

                const response = await adminSelfService.list(queryParams);

                if (!response.success) {
                    throw new Error(response.error?.message || "Failed to fetch administrators");
                }

                // Transform data to UI format
                const transformedAdministrators: Administrator[] = response.data.data.map((entity: AdminType) => {
                    const nameParts = [entity.firstName, entity.middleName, entity.lastName].filter(Boolean);
                    const name = nameParts.length > 0 ? nameParts.join(" ") : entity.email;

                    const addressParts = [];
                    const addr = entity.address as any; 
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
                        lastName: entity.lastName,
                        email: entity.email,
                        bio: entity.bio || "",
                        isActive: entity.isActive,
                        isVerified: entity.isVerified,
                        isSuspended: entity.isSuspended,
                        role: entity.roleType as AdminRoleType,
                        phoneNumber: entity.phoneNumber,
                        phoneCountryCode: entity.phoneCountryCode,
                        address: entity.address as AdminAddressInput,
                        addressString,
                        joinedAt: formatDate(entity.createdAt),
                        updatedAt: formatDate(entity.updatedAt),
                        lastLogin: formatDate(entity.lastLoginAt),
                        avatarUrl,
                    };
                });

                setAdministrators(transformedAdministrators);
                setPagination(response.data.meta);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "An error occurred while fetching administrators";
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAdministrators();
    }, [page, query, statusFilter, verifiedFilter, suspendedFilter, roleFilter, joinedFrom, joinedTo, pageSize, refreshKey]);

    const total = pagination?.total || 0;
    const pageCount = pagination ? Math.max(1, Math.ceil(total / pagination.limit)) : 1;
    
    // Use transformed list directly
    const pagedAdministrators = administrators; 

    // Modal states
    const [openCreate, setOpenCreate] = React.useState(false);
    const [editing, setEditing] = React.useState<Administrator | null>(null);
    const [pendingDelete, setPendingDelete] = React.useState<Administrator | null>(null);

    const handleCreate = React.useCallback(async (values: AdministratorFormValues) => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...values,
                profilePicture: values.profilePicture || undefined,
            };

            const response = await adminSelfService.create(payload);
            if (response.success) {
                toast.success(`Administrator created successfully`);
                setOpenCreate(false);
                refreshAdministrators();
            } else {
                throw new Error(response.error?.message || "Failed to create administrator");
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to create";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    }, [refreshAdministrators]);

    const handleEdit = React.useCallback(async (values: AdministratorFormValues) => {
        if (!editing) return;
        setIsSubmitting(true);
        try {
            const updateData = {
                ...values,
                id: editing.id,
                profilePicture: values.profilePicture || undefined,
            };

            const response = await adminSelfService.update(updateData);
            if (response.success) {
                toast.success("Administrator updated successfully");
                setEditing(null);
                refreshAdministrators();
            } else {
                throw new Error(response.error?.message || "Failed to update");
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update");
        } finally {
            setIsSubmitting(false);
        }
    }, [editing, refreshAdministrators]);

    const confirmDelete = React.useCallback(async () => {
        if (!pendingDelete) return;
        try {
            const response = await adminSelfService.delete(pendingDelete.id);
            if (response.success) {
                toast.success("Administrator deleted successfully");
                setPendingDelete(null);
                refreshAdministrators();
            } else {
                throw new Error(response.error?.message || "Failed to delete");
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to delete");
        }
    }, [pendingDelete, refreshAdministrators]);

    const columns: Array<DataTableColumn<Administrator>> = [
        {
            id: "name",
            header: "Name",
            accessor: "name",
            cell: (admin) => (
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 overflow-hidden rounded-full">
                         <Avatar
                            src={admin.avatarUrl}
                            fallbackSrc={`https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name)}&background=random`}
                            alt={admin.name}
                            width={32}
                            height={32}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div>
                        <div className="font-medium">{admin.name}</div>
                        <div className="text-sm text-gray-500">{admin.email}</div>
                    </div>
                </div>
            ),
        },
        {
            id: "role",
            header: "Role",
            accessor: "role",
            cell: (admin) => (
                <div className="flex items-center gap-2">
                    {admin.role === AdminRoleType.SUPER_ADMIN ? (
                        <ShieldCheck className="w-4 h-4 text-red-500" />
                    ) : admin.role === AdminRoleType.ADMIN ? (
                        <Shield className="w-4 h-4 text-blue-500" />
                    ) : (
                        <Shield className="w-4 h-4 text-green-500" />
                    )}
                    <span className="text-sm font-medium">{admin.role.replace('_', ' ')}</span>
                </div>
            ),
        },
        {
            id: "status",
            header: "Status",
            accessor: (admin) => admin.isActive ? "Active" : "Inactive",
            cell: (admin) => (
                <div className="flex flex-col gap-1">
                    <Badge variant="outline" className={statusBadgeClass(admin.isActive)}>
                        <span className="inline-flex items-center gap-1">
                            {admin.isActive ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                            {admin.isActive ? "Active" : "Inactive"}
                        </span>
                    </Badge>
                    {admin.isSuspended && (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            <span className="inline-flex items-center gap-1">
                                <XCircle size={14} />
                                Suspended
                            </span>
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            id: "verified",
            header: "Verified",
            accessor: (admin) => admin.isVerified ? "Verified" : "Unverified",
            cellClassName: "whitespace-nowrap",
            cell: (admin) => (
                <Badge variant="outline" className={statusBadgeClass(admin.isVerified ?? false)}>
                    <span className="inline-flex items-center gap-1">
                        {admin.isVerified ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        {admin.isVerified ? "Verified" : "Unverified"}
                    </span>
                </Badge>
            ),
        },
        {
            id: "lastLogin",
            header: "Last Login",
            accessor: (admin) => admin.lastLogin || "Never",
            cell: (admin) => (
                <span className="text-sm text-gray-600">
                    {admin.lastLogin || "Never"}
                </span>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            align: "center",
            accessor: (admin) => "",
            cell: (admin) => (
                <div className="flex items-center justify-center gap-2">
                    <Button variant="secondary" size="sm" className="gap-1" aria-label="Edit" onClick={(e) => { e.stopPropagation(); setEditing(admin); }}>
                        <Pencil size={16} />
                    </Button>
                    <Button variant="secondary" size="sm" className="gap-1 text-red-600 border-red-200 hover:bg-red-50" aria-label="Delete" onClick={(e) => { e.stopPropagation(); setPendingDelete(admin); }}>
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
                    <h1 className="text-xl sm:text-2xl font-semibold">Administrators</h1>
                </div>
                <Button size="sm" onClick={() => setOpenCreate(true)}>Add Administrator</Button>
            </div>

            {/* Filters */}
            <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-3">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    <div className="md:col-span-5">
                        <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Search</label>
                        <Input
                            placeholder="Search administrators..."
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
                            onClick={() => { setQuery(""); setStatusFilter("All"); setRoleFilter("All"); setVerifiedFilter("All"); setSuspendedFilter("All"); setJoinedFrom(""); setJoinedTo(""); setPage(1); }}
                        >
                            <RotateCcw size={16} /> Reset
                        </Button>
                    </div>
                    <div className="md:col-span-3">
                        <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Status</label>
                        <Select value={statusFilter} onChange={(e) => { setPage(1); setStatusFilter(e.target.value as "All" | "Active" | "Inactive"); }}>
                            <option value="All">Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </Select>
                    </div>
                    <div className="md:col-span-3">
                        <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Role</label>
                        <Select value={roleFilter} onChange={(e) => { setPage(1); setRoleFilter(e.target.value as "All" | AdminRoleType); }}>
                            <option value="All">Roles</option>
                            <option value={AdminRoleType.SUPER_ADMIN}>Super Admin</option>
                            <option value={AdminRoleType.ADMIN}>Admin</option>
                            <option value={AdminRoleType.MODERATOR}>Moderator</option>
                        </Select>
                    </div>
                    <div className="md:col-span-3">
                        <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Verified</label>
                        <Select value={verifiedFilter} onChange={(e) => { setPage(1); setVerifiedFilter(e.target.value as "All" | "Verified" | "Unverified"); }}>
                            <option value="All">Verifications</option>
                            <option value="Verified">Verified</option>
                            <option value="Unverified">Unverified</option>
                        </Select>
                    </div>
                    <div className="md:col-span-3">
                        <label className="block text-xs text-[color:var(--color-neutral-600)] mb-1">Suspended</label>
                        <Select value={suspendedFilter} onChange={(e) => { setPage(1); setSuspendedFilter(e.target.value as "All" | "Suspended" | "NotSuspended"); }}>
                            <option value="All">Suspensions</option>
                            <option value="Suspended">Suspended</option>
                            <option value="NotSuspended">Not suspended</option>
                        </Select>
                    </div>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <DataTable
                        columns={columns}
                        data={pagedAdministrators}
                        getRowKey={(admin) => admin.id}
                        emptyMessage={isLoading ? "Loading..." : "No administrators found"}
                    />
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4">
                        <p className="text-sm text-[color:var(--color-neutral-600)]">
                            Showing {total === 0 ? 0 : (page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of {total}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                            <Button
                                variant="secondary"
                                size="sm"
                                className="w-full sm:w-auto"
                                disabled={page === 1 || isLoading}
                                onClick={() => setPage(page - 1)}
                            >
                                Previous
                            </Button>
                            <div className="text-sm sm:hidden">{page}/{pageCount}</div>
                            <div className="text-sm hidden sm:block">Page {page} of {pageCount}</div>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="w-full sm:w-auto"
                                disabled={page === pageCount || isLoading}
                                onClick={() => setPage(page + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Modals */}
            <AdministratorFormModal
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                onSubmit={handleCreate}
                mode="create"
                isLoading={isSubmitting}
            />
            <AdministratorFormModal
                open={!!editing}
                onClose={() => setEditing(null)}
                onSubmit={handleEdit}
                mode="edit"
                isLoading={isSubmitting}
                initialValues={editing ? {
                    firstName: editing.firstName,
                    middleName: editing.middleName,
                    lastName: editing.lastName,
                    email: editing.email,
                    phoneNumber: editing.phoneNumber,
                    phoneCountryCode: editing.phoneCountryCode,
                    roleType: editing.role,
                    bio: editing.bio,
                    address: editing.address,
                    isActive: editing.isActive,
                    isVerified: editing.isVerified || false,
                    isSuspended: editing.isSuspended || false,
                } : undefined}
                initialAvatarUrl={editing?.avatarUrl}
            />

            {/* Delete Confirmation Modal */}
            <Modal open={!!pendingDelete} onClose={() => setPendingDelete(null)} title={pendingDelete ? 'Delete Administrator' : undefined}>
                {pendingDelete && (
                    <div className="space-y-4 text-sm">
                        <div className="text-[color:var(--color-neutral-800)]">
                            Are you sure you want to delete
                            <span className="font-medium"> {pendingDelete.name} </span>
                            ({pendingDelete.email})?
                            This action cannot be undone.
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <Button variant="secondary" onClick={() => setPendingDelete(null)}>Cancel</Button>
                            <Button variant="secondary" className="text-red-600 border-red-200 hover:bg-red-50" onClick={confirmDelete}>Delete</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
