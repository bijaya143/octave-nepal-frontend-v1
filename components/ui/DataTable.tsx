import React from "react";
import { cn } from "../../lib/cn";

export type DataTableColumn<T> = {
  id: string;
  header: React.ReactNode;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  cell?: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
  headerClassName?: string;
  cellClassName?: string;
  title?: (row: T) => string;
};

export type DataTableProps<T> = {
  data: T[];
  columns: Array<DataTableColumn<T>>;
  getRowKey?: (row: T, index: number) => string | number;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (row: T) => void;
};

function getAlignClass(align?: "left" | "right" | "center") {
  if (align === "right") return "text-right";
  if (align === "center") return "text-center";
  return "text-left";
}

export default function DataTable<T>({
  data,
  columns,
  getRowKey,
  emptyMessage = "No records found.",
  className,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left">
            {columns.map((col) => (
              <th
                key={col.id}
                className={cn(
                  "py-3 px-2 font-semibold text-[color:var(--color-neutral-700)]",
                  getAlignClass(col.align),
                  col.headerClassName,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr className="border-t border-[color:var(--color-neutral-200)]">
              <td
                colSpan={columns.length}
                className="py-4 px-2 text-[color:var(--color-neutral-600)] border-b border-[color:var(--color-neutral-200)]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={getRowKey ? getRowKey(row, rowIdx) : rowIdx}
                className={cn(
                  "border-t border-[color:var(--color-neutral-200)]",
                  onRowClick &&
                    "cursor-pointer hover:bg-[color:var(--color-neutral-50)]",
                )}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col) => {
                  let content: React.ReactNode = null;

                  if (col.cell) {
                    content = col.cell(row);
                  } else if (typeof col.accessor === "function") {
                    content = col.accessor(row as T);
                  } else if (typeof col.accessor === "string") {
                    content = (row as any)[col.accessor];
                  } else if (col.id in (row as any)) {
                    content = (row as any)[col.id];
                  }

                  return (
                    <td
                      key={col.id}
                      className={cn(
                        "py-3 px-2 text-[color:var(--color-neutral-700)] border-b border-[color:var(--color-neutral-200)]",
                        getAlignClass(col.align),
                        col.cellClassName,
                      )}
                      title={col.title ? col.title(row) : undefined}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
