import { Suspense } from "react";
import Card, { CardContent } from "../../../../components/ui/Card";
import VerifyOtpForm from "./VerifyOtpForm";

function VerifyOtpLoadingFallback() {
  return (
    <main className="mx-auto max-w-md px-4 sm:px-6 py-10">
      <h1 className="text-xl md:text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-heading-sans)" }}>
        Verify your email
      </h1>
      <Card>
        <CardContent className="py-5">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[color:var(--color-primary-700)]"></div>
            <p className="mt-4 text-sm text-muted-foreground">Verifying your email...</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<VerifyOtpLoadingFallback />}>
      <VerifyOtpForm />
    </Suspense>
  );
}

