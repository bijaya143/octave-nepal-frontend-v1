"use client";
import React from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DataTable, { DataTableColumn } from "@/components/ui/DataTable";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import { Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import ManagementTeamFormModal, {
  ManagementTeamFormValues,
} from "./ManagementTeamFormModal";
import {
  adminManagementTeamService,
  CreateManagementTeamInput,
  UpdateManagementTeamInput,
} from "@/lib/services/admin/management-team";
import {
  ManagementTeam as ManagementTeamType,
  AdminManagementTeamFilterInput,
} from "@/lib/services/admin/types";

type TeamMember = {
  id: string;
  name: string;
  position: string;
  imageUrl: string;
  email?: string;
  order: number;
  isPublished: boolean;
};

function statusBadgeClass(isPublished: boolean): string {
  return isPublished
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : "bg-gray-50 text-gray-700 border-gray-200";
}

export default function AdminManagementTeamsPage() {
  const [teamMembers, setTeamMembers] = React.useState<TeamMember[]>([]);
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

  const refreshTeamMembers = React.useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  React.useEffect(() => {
    const fetchTeamMembers = async () => {
      setIsLoading(true);
      try {
        const queryParams: AdminManagementTeamFilterInput = {
          page,
          limit: pageSize,
        };

        const response = await adminManagementTeamService.list(queryParams);

        if (!response.success) {
          throw new Error(
            response.error?.message || "Failed to fetch team members"
          );
        }

        const transformedMembers: TeamMember[] = response.data.data.map(
          (entity: ManagementTeamType) => ({
            id: entity.id,
            name: entity.name,
            position: entity.position,
            imageUrl: entity.imageKey
              ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${entity.imageKey}`
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  entity.name
                )}&background=random`,
            email: entity.email,
            order: entity.displayOrder,
            isPublished: entity.isPublished || false,
          })
        );

        setTeamMembers(transformedMembers);
        setPagination(response.data.meta);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch team members"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMembers();
  }, [page, pageSize, refreshKey]);

  const total = pagination?.total || 0;
  const totalPages = pagination
    ? Math.max(1, Math.ceil(total / pagination.limit))
    : 1;
  const paginatedTeamMembers = teamMembers;

  const [openCreate, setOpenCreate] = React.useState(false);
  const [editing, setEditing] = React.useState<TeamMember | null>(null);
  const [pendingDelete, setPendingDelete] = React.useState<TeamMember | null>(
    null
  );

  const handleCreate = React.useCallback(
    async (values: ManagementTeamFormValues) => {
      if (!values.imageFile) {
        toast.error("Image is required");
        return;
      }
      setIsSubmitting(true);
      try {
        const payload: CreateManagementTeamInput = {
          name: values.name,
          position: values.position,
          email: values.email,
          displayOrder: values.order,
          image: values.imageFile,
          isPublished: values.isPublished,
        };

        const response = await adminManagementTeamService.create(payload);
        if (response.success) {
          toast.success(`Team member created: ${values.name}`);
          setOpenCreate(false);
          refreshTeamMembers();
        } else {
          throw new Error(
            response.error?.message || "Failed to create team member"
          );
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to create team member"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [refreshTeamMembers]
  );

  const handleEdit = React.useCallback(
    async (values: ManagementTeamFormValues) => {
      if (!editing) return;
      setIsSubmitting(true);
      try {
        const payload: UpdateManagementTeamInput = {
          id: editing.id,
          name: values.name,
          position: values.position,
          email: values.email,
          displayOrder: values.order,
          image: values.imageFile || undefined,
          isPublished: values.isPublished,
        };

        const response = await adminManagementTeamService.update(payload);
        if (response.success) {
          toast.success(`Team member updated: ${values.name}`);
          setEditing(null);
          refreshTeamMembers();
        } else {
          throw new Error(
            response.error?.message || "Failed to update team member"
          );
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update team member"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [editing, refreshTeamMembers]
  );

  const handleDelete = React.useCallback((member: TeamMember) => {
    setPendingDelete(member);
  }, []);

  const confirmDelete = React.useCallback(async () => {
    if (!pendingDelete) return;
    try {
      const response = await adminManagementTeamService.delete(
        pendingDelete.id
      );
      if (response.success) {
        toast.success(`Team member deleted: ${pendingDelete.name}`);
        setPendingDelete(null);
        refreshTeamMembers();
      } else {
        throw new Error(
          response.error?.message || "Failed to delete team member"
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete team member"
      );
    }
  }, [pendingDelete, refreshTeamMembers]);

  const cancelDelete = React.useCallback(() => {
    setPendingDelete(null);
  }, []);

  const columns: Array<DataTableColumn<TeamMember>> = [
    {
      id: "image",
      header: "Image",
      accessor: "imageUrl",
      cell: (member) => (
        <div className="h-10 w-10 overflow-hidden rounded-full">
          <Image
            src={member.imageUrl}
            alt={member.name}
            width={40}
            height={40}
            className="h-full w-full object-cover"
            unoptimized
          />
        </div>
      ),
    },
    {
      id: "name",
      header: "Name",
      accessor: "name",
      cell: (member) => (
        <div>
          <div className="font-medium text-gray-900">{member.name}</div>
        </div>
      ),
    },
    {
      id: "position",
      header: "Position",
      accessor: "position",
      cell: (member) => (
        <span className="text-sm text-gray-600">{member.position}</span>
      ),
    },
    {
      id: "email",
      header: "Email",
      accessor: "email",
      cell: (member) => (
        <span className="text-sm text-gray-600">{member.email || "—"}</span>
      ),
    },
    {
      id: "order",
      header: "Order",
      accessor: "order",
      cell: (member) => (
        <span className="text-sm text-gray-600">{member.order}</span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <Badge
          variant="outline"
          className={statusBadgeClass(row.isPublished)}
        >
          <span className="inline-flex items-center gap-1">
            {row.isPublished ? (
              <CheckCircle2 size={14} />
            ) : (
              <XCircle size={14} />
            )}
            {row.isPublished ? "Published" : "Unpublished"}
          </span>
        </Badge>
      ),
      cellClassName: "whitespace-nowrap",
    },
    {
      id: "actions",
      header: "Actions",
      align: "center",
      cell: (member) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="gap-1"
            aria-label="Edit"
            onClick={(e) => {
              e.stopPropagation();
              setEditing(member);
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
              handleDelete(member);
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
          <h1 className="text-xl sm:text-2xl font-semibold">
            Management Teams
          </h1>
        </div>
        <Button size="sm" onClick={() => setOpenCreate(true)}>
          Add Team Member
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={paginatedTeamMembers}
            getRowKey={(member) => member.id}
            emptyMessage={isLoading ? "Loading..." : "No team members found"}
          />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4">
            <p className="text-sm text-[color:var(--color-neutral-600)]">
              Showing {total === 0 ? 0 : (page - 1) * pageSize + 1}-
              {Math.min(page * pageSize, total)} of {total}
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
              <div className="text-sm sm:hidden">
                {page}/{totalPages}
              </div>
              <div className="text-sm hidden sm:block">
                Page {page} of {totalPages}
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto"
                disabled={page === totalPages || isLoading}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ManagementTeamFormModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreate}
        mode="create"
        isLoading={isSubmitting}
      />
      <ManagementTeamFormModal
        open={!!editing}
        onClose={() => setEditing(null)}
        onSubmit={handleEdit}
        mode="edit"
        isLoading={isSubmitting}
        initialValues={
          editing
            ? {
                name: editing.name,
                position: editing.position,
                email: editing.email,
                order: editing.order,
                isPublished: editing.isPublished,
              }
            : undefined
        }
        initialImageUrl={editing?.imageUrl}
      />

      <Modal
        open={!!pendingDelete}
        onClose={cancelDelete}
        title={pendingDelete ? "Delete Team Member" : undefined}
      >
        {pendingDelete && (
          <div className="space-y-4 text-sm">
            <div className="text-[color:var(--color-neutral-800)]">
              Are you sure you want to delete
              <span className="font-medium"> {pendingDelete.name} </span>
              from the team? This action cannot be undone.
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
    </div>
  );
}
