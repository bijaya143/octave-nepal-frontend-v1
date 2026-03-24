"use client";
import React from "react";
import Card, { CardContent } from "./ui/Card";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { CircleCheck } from "lucide-react";
import Carousel from "./ui/Carousel";

type PaymentMethod = "qr" | "bank";

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

export default function PaymentSection() {
  const [method, setMethod] = React.useState<PaymentMethod>("qr");
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = React.useState<string>("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : "");
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          className={
            "h-11 inline-flex items-center justify-center gap-2 rounded-lg border text-sm font-medium shadow-xs transition-all " +
            (method === "qr"
              ? "border-[color:var(--color-primary-400)] bg-[color:var(--color-primary-50)] text-[color:var(--color-primary-700)]"
              : "border-[color:var(--color-neutral-200)] bg-white hover:bg-[color:var(--color-neutral-50)]")
          }
          onClick={() => setMethod("qr")}
          aria-pressed={method === "qr"}
        >
          {method === "qr" && <CircleCheck className="h-4 w-4" aria-hidden />}
          <span>QR Payment</span>
        </button>
        <button
          type="button"
          className={
            "h-11 inline-flex items-center justify-center gap-2 rounded-lg border text-sm font-medium shadow-xs transition-all " +
            (method === "bank"
              ? "border-[color:var(--color-primary-400)] bg-[color:var(--color-primary-50)] text-[color:var(--color-primary-700)]"
              : "border-[color:var(--color-neutral-200)] bg-white hover:bg-[color:var(--color-neutral-50)]")
          }
          onClick={() => setMethod("bank")}
          aria-pressed={method === "bank"}
        >
          {method === "bank" && <CircleCheck className="h-4 w-4" aria-hidden />}
          <span>Bank Transfer</span>
        </button>
      </div>

      {method === "qr" ? (
        <div className="space-y-3">
          <p className="text-sm text-[color:var(--color-neutral-700)]">Scan any of the QR codes below:</p>
          {/* Mobile: carousel */}
          <div className="sm:hidden">
            <Carousel auto={false} showArrows={true} >
              {qrOptions.map((qr) => (
                <div key={qr.id} className="px-1">
                  <Card>
                    <CardContent className="py-4">
                      <div className="w-full flex items-center justify-center">
                        <img src={qr.src} alt={`${qr.name} QR`} className="h-48 w-auto rounded-md object-contain" />
                      </div>
                      <p className="mt-2 text-center text-xs text-[color:var(--color-neutral-600)]">{qr.name}</p>
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
                    <img src={qr.src} alt={`${qr.name} QR`} className="h-56 w-auto rounded-md object-contain" />
                  </div>
                  <p className="mt-2 text-center text-xs text-[color:var(--color-neutral-600)]">{qr.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-4 text-sm text-[color:var(--color-neutral-700)]">
            After payment, please upload the receipt below so we can verify and confirm your enrollment.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-[color:var(--color-neutral-700)]">Transfer to the following bank account:</p>
          <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-4 text-sm">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              <div>
                <dt className="text-[color:var(--color-neutral-600)]">Account name</dt>
                <dd className="font-medium">{bankDetails.accountName}</dd>
              </div>
              <div>
                <dt className="text-[color:var(--color-neutral-600)]">Account number</dt>
                <dd className="font-medium">{bankDetails.accountNumber}</dd>
              </div>
              <div>
                <dt className="text-[color:var(--color-neutral-600)]">Bank</dt>
                <dd className="font-medium">{bankDetails.bankName}</dd>
              </div>
              <div>
                <dt className="text-[color:var(--color-neutral-600)]">Branch</dt>
                <dd className="font-medium">{bankDetails.branch}</dd>
              </div>
              <div>
                <dt className="text-[color:var(--color-neutral-600)]">SWIFT</dt>
                <dd className="font-medium">{bankDetails.swiftCode}</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-[color:var(--color-neutral-50)] p-3 text-xs text-[color:var(--color-neutral-700)]">
            After transferring, please upload the receipt below so we can verify and confirm your enrollment faster.
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Upload payment receipt <span className="ml-1 text-red-600" aria-hidden>*</span></h4>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            required
            aria-required="true"
            onChange={handleFileChange}
          />
          <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>Choose file</Button>
          <span className="text-xs text-[color:var(--color-neutral-600)] truncate">{fileName || "No file chosen"}</span>
        </div>
        <Input label="Reference/Transaction ID (optional)" placeholder="e.g. TXN-123456" />
      </div>
    </div>
  );
}


