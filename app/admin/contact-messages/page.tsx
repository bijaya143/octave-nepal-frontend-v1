"use client";
import React from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DataTable, { DataTableColumn } from "@/components/ui/DataTable";
import Modal from "@/components/ui/Modal";
import { Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  adminContactMessageService,
  ContactMessage,
} from "@/lib/services/admin";

export default function AdminContactMessagesPage() {
  // Pagination state
  const [page, setPage] = React.useState(1);
  const pageSize = 10;
  const [totalCount, setTotalCount] = React.useState(0);
  const [messages, setMessages] = React.useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchMessages = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminContactMessageService.list({
        page,
        limit: pageSize,
      });
      if (response.success && response.data) {
        setMessages(response.data.data);
        setTotalCount(response.data.meta.total);
      } else {
        toast.error("Failed to fetch contact messages");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize]);

  React.useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Delete state
  const [pendingDelete, setPendingDelete] =
    React.useState<ContactMessage | null>(null);

  // View state
  const [viewingMessage, setViewingMessage] =
    React.useState<ContactMessage | null>(null);

  const handleView = React.useCallback((message: ContactMessage) => {
    setViewingMessage(message);
  }, []);

  const handleDelete = React.useCallback((message: ContactMessage) => {
    setPendingDelete(message);
  }, []);

  const confirmDelete = React.useCallback(async () => {
    if (!pendingDelete) return;
    try {
      const response = await adminContactMessageService.delete(
        pendingDelete.id,
      );
      if (response.success) {
        toast.success(`Contact message from ${pendingDelete.fullName} deleted`);
        if (messages.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          fetchMessages();
        }
      } else {
        toast.error(response.error?.message || "Failed to delete message");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete message");
    } finally {
      setPendingDelete(null);
    }
  }, [pendingDelete, messages.length, page, fetchMessages]);

  const cancelDelete = React.useCallback(() => {
    setPendingDelete(null);
  }, []);

  const closeView = React.useCallback(() => {
    setViewingMessage(null);
  }, []);

  const columns: Array<DataTableColumn<ContactMessage>> = [
    {
      id: "fullName",
      header: "Name",
      accessor: "fullName",
      cell: (message) => (
        <div className="font-medium text-gray-900">{message.fullName}</div>
      ),
    },
    {
      id: "email",
      header: "Email",
      accessor: "email",
      cell: (message) => (
        <span className="text-sm text-gray-600">{message.email}</span>
      ),
    },
    {
      id: "subject",
      header: "Subject",
      accessor: "subject",
      cell: (message) => (
        <span className="text-sm text-gray-600">{message.subject || "—"}</span>
      ),
    },
    {
      id: "message",
      header: "Message",
      accessor: "message",
      cell: (message) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-600 line-clamp-2">
            {message.message}
          </p>
        </div>
      ),
    },
    {
      id: "createdAt",
      header: "Date",
      accessor: "createdAt",
      cell: (message) => (
        <span className="text-sm text-gray-600">
          {new Date(message.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      align: "center",
      accessor: (message) => "",
      cell: (message) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="gap-1 text-primary-600 border-primary-200 hover:bg-primary-50"
            aria-label="View"
            onClick={(e) => {
              e.stopPropagation();
              handleView(message);
            }}
          >
            <Eye size={16} />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="gap-1 text-red-600 border-red-200 hover:bg-red-50"
            aria-label="Delete"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(message);
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
            Contact Messages
          </h1>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={messages}
            getRowKey={(message) => message.id}
            emptyMessage={
              isLoading ? "Loading messages..." : "No messages found."
            }
          />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4">
            <p className="text-sm text-[color:var(--color-neutral-600)]">
              Showing {messages.length === 0 ? 0 : (page - 1) * pageSize + 1}-
              {Math.min(page * pageSize, totalCount)} of {totalCount}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <Button
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto"
                disabled={page === 1}
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
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Message Modal */}
      <Modal
        open={!!viewingMessage}
        onClose={closeView}
        title={viewingMessage ? "Contact Message Details" : undefined}
      >
        {viewingMessage && (
          <div className="space-y-6">
            {/* Message Header */}
            <div className="bg-gradient-to-r from-[color:var(--color-primary-50)] to-[color:var(--color-primary-25)] rounded-lg p-4 border border-[color:var(--color-primary-100)]">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-[color:var(--color-neutral-900)] mb-1">
                    {viewingMessage.subject || "No Subject"}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-[color:var(--color-neutral-600)]">
                    <span className="font-medium">
                      {viewingMessage.fullName}
                    </span>
                    <span>•</span>
                    <span>{viewingMessage.email}</span>
                  </div>
                  <div className="text-xs text-[color:var(--color-neutral-500)] mt-1">
                    Received on{" "}
                    {new Date(viewingMessage.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-[color:var(--color-primary-500)] rounded-full"></div>
                <h4 className="text-base font-medium text-[color:var(--color-neutral-900)]">
                  Message Content
                </h4>
              </div>
              <div className="bg-white border border-[color:var(--color-neutral-200)] rounded-lg p-5 shadow-sm">
                <div className="text-[color:var(--color-neutral-800)] leading-relaxed whitespace-pre-wrap">
                  {viewingMessage.message}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-[color:var(--color-neutral-200)]">
              <div className="text-xs text-[color:var(--color-neutral-500)]">
                Message ID: {viewingMessage.id}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={closeView}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!pendingDelete}
        onClose={cancelDelete}
        title={pendingDelete ? "Delete Contact Message" : undefined}
      >
        {pendingDelete && (
          <div className="space-y-4 text-sm">
            <div className="text-[color:var(--color-neutral-800)]">
              Are you sure you want to delete the contact message from
              <span className="font-medium"> {pendingDelete.fullName} </span>(
              {pendingDelete.email})? This action cannot be undone.
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
