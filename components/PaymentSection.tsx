"use client";
import React from "react";
import Card, { CardContent } from "./ui/Card";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { CircleCheck, X } from "lucide-react";
import Carousel from "./ui/Carousel";

import { PaymentMethod } from "@/lib/services/admin";

interface PaymentSectionProps {
  method: PaymentMethod;
  setMethod: (method: PaymentMethod) => void;
  selectedFiles: File[];
  setSelectedFiles: (files: File[] | ((prev: File[]) => File[])) => void;
  transactionId: string;
  setTransactionId: (id: string) => void;
}

const qrOptions = [
  { id: "esewa", name: "eSewa", src: "/images/payments/qrs/qr2.jpg" },
  { id: "fonepay", name: "FonePay", src: "/images/payments/qrs/qr1.jpg" },
];

const bankDetails = {
  accountName: "Octave Nepal Pvt. Ltd.",
  accountNumber: "00123456789012",
  bankName: "Nabil Bank Limited",
  branch: "Jawalakhel, Lalitpur",
  swiftCode: "NARBNPKA",
};

export default function PaymentSection({
  method,
  setMethod,
  selectedFiles,
  setSelectedFiles,
  transactionId,
  setTransactionId,
}: PaymentSectionProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  function getFileKey(file: File) {
    return `${file.name}-${file.size}-${file.lastModified}`;
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    // If the user cancels the picker dialog, keep the previous selection.
    if (files.length === 0) return;
    setSelectedFiles((prev) => {
      const existingKeys = new Set(prev.map(getFileKey));
      const newUniqueFiles = files.filter(
        (file) => !existingKeys.has(getFileKey(file)),
      );
      return [...prev, ...newUniqueFiles];
    });
    // Allow choosing the same file again in a later selection.
    e.target.value = "";
  }

  function removeSelectedFile(indexToRemove: number) {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  }

  function clearSelectedFiles() {
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          className={
            "h-11 inline-flex items-center justify-center gap-2 rounded-lg border text-sm font-medium shadow-xs transition-all " +
            (method === PaymentMethod.QR
              ? "border-[color:var(--color-primary-400)] bg-[color:var(--color-primary-50)] text-[color:var(--color-primary-700)]"
              : "border-[color:var(--color-neutral-200)] bg-white hover:bg-[color:var(--color-neutral-50)]")
          }
          onClick={() => setMethod(PaymentMethod.QR)}
          aria-pressed={method === PaymentMethod.QR}
        >
          {method === PaymentMethod.QR && (
            <CircleCheck className="h-4 w-4" aria-hidden />
          )}
          <span>QR Payment</span>
        </button>
        <button
          type="button"
          className={
            "h-11 inline-flex items-center justify-center gap-2 rounded-lg border text-sm font-medium shadow-xs transition-all " +
            (method === PaymentMethod.BANK_TRANSFER
              ? "border-[color:var(--color-primary-400)] bg-[color:var(--color-primary-50)] text-[color:var(--color-primary-700)]"
              : "border-[color:var(--color-neutral-200)] bg-white hover:bg-[color:var(--color-neutral-50)]")
          }
          onClick={() => setMethod(PaymentMethod.BANK_TRANSFER)}
          aria-pressed={method === PaymentMethod.BANK_TRANSFER}
        >
          {method === PaymentMethod.BANK_TRANSFER && (
            <CircleCheck className="h-4 w-4" aria-hidden />
          )}
          <span>Bank Transfer</span>
        </button>
      </div>

      {method === PaymentMethod.QR ? (
        <div className="space-y-3">
          <p className="text-sm text-[color:var(--color-neutral-700)]">
            Scan any of the QR codes below:
          </p>
          {/* Mobile: carousel */}
          <div className="sm:hidden">
            <Carousel auto={false} showArrows={true}>
              {qrOptions.map((qr) => (
                <div key={qr.id} className="px-1">
                  <Card>
                    <CardContent className="py-4">
                      <div className="w-full flex items-center justify-center">
                        <img
                          src={qr.src}
                          alt={`${qr.name} QR`}
                          className="h-48 w-auto rounded-md object-contain"
                        />
                      </div>
                      <p className="mt-2 text-center text-xs text-[color:var(--color-neutral-600)]">
                        {qr.name}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </Carousel>
          </div>
          {/* Desktop: grid */}
          <div className="hidden sm:grid grid-cols-2 gap-4">
            {qrOptions.map((qr) => (
              <Card key={qr.id}>
                <CardContent className="py-4">
                  <div className="w-full flex items-center justify-center">
                    <img
                      src={qr.src}
                      alt={`${qr.name} QR`}
                      className="h-56 w-auto rounded-md object-contain"
                    />
                  </div>
                  <p className="mt-2 text-center text-xs text-[color:var(--color-neutral-600)]">
                    {qr.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-4 text-sm text-[color:var(--color-neutral-700)]">
            After payment, please upload the receipt below so we can verify and
            confirm your enrollment.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-[color:var(--color-neutral-700)]">
            Transfer to the following bank account:
          </p>
          <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-4 text-sm">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              <div>
                <dt className="text-[color:var(--color-neutral-600)]">
                  Account name
                </dt>
                <dd className="font-medium">{bankDetails.accountName}</dd>
              </div>
              <div>
                <dt className="text-[color:var(--color-neutral-600)]">
                  Account number
                </dt>
                <dd className="font-medium">{bankDetails.accountNumber}</dd>
              </div>
              <div>
                <dt className="text-[color:var(--color-neutral-600)]">Bank</dt>
                <dd className="font-medium">{bankDetails.bankName}</dd>
              </div>
              <div>
                <dt className="text-[color:var(--color-neutral-600)]">
                  Branch
                </dt>
                <dd className="font-medium">{bankDetails.branch}</dd>
              </div>
              <div>
                <dt className="text-[color:var(--color-neutral-600)]">SWIFT</dt>
                <dd className="font-medium">{bankDetails.swiftCode}</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-[color:var(--color-neutral-50)] p-3 text-xs text-[color:var(--color-neutral-700)]">
            After transferring, please upload the receipt below so we can verify
            and confirm your enrollment faster.
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h4 className="text-sm font-medium">
          Upload payment receipt{" "}
          <span className="ml-1 text-red-600" aria-hidden>
            *
          </span>
        </h4>
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            multiple
            className="hidden"
            required
            aria-required="true"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose files
          </Button>
          {selectedFiles.length > 0 ? (
            <div className="text-xs text-[color:var(--color-neutral-600)] space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p>{selectedFiles.length} file(s) selected</p>
                <button
                  type="button"
                  className="text-[color:var(--color-primary-700)] hover:underline"
                  onClick={clearSelectedFiles}
                >
                  Remove all
                </button>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedFiles.map((file, index) => (
                  <li
                    key={`${file.name}-${index}`}
                    className="grid grid-cols-[1fr_auto] items-start gap-2 rounded-md border border-[color:var(--color-neutral-200)] bg-white px-3 py-2 hover:bg-[color:var(--color-neutral-50)]"
                  >
                    <span className="min-w-0 break-words">{file.name}</span>
                    <button
                      type="button"
                      className="shrink-0 text-red-600 hover:text-red-700 justify-self-end"
                      onClick={() => removeSelectedFile(index)}
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="h-4 w-4" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-xs text-[color:var(--color-neutral-600)]">
              No files chosen
            </p>
          )}
        </div>
        <Input
          label="Reference/Transaction ID (optional)"
          placeholder="e.g. TXN-123456"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
        />
      </div>
    </div>
  );
}
