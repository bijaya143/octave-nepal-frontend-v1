import Image from "next/image";
import Container from "../../components/Container";

export default function SupportPaymentMethod() {
  return (
    <section id="payments" className="mt-12 md:mt-16">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-4">
          <div>
            <h2
              className="text-xl md:text-2xl font-semibold"
              style={{ fontFamily: "var(--font-heading-sans)" }}
            >
              Supported payment methods
            </h2>
            <p className="hidden sm:block text-sm text-foreground/70 mt-1">
              Secure payments powered by trusted providers
            </p>
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-medium text-foreground/50 uppercase tracking-wider">
              100% Secure Transaction
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { name: "eSewa", src: "/images/payments/esewa.png" },
            { name: "Khalti", src: "/images/payments/khalti.png" },
            { name: "Fonepay", src: "/images/payments/fonepay.png" },
            {
              name: "Bank Transfer",
              src: "/images/payments/bank-transfer.png",
            },
          ].map((m) => (
            <div
              key={m.name}
              className="flex h-20 w-full items-center justify-center rounded-xl border border-neutral-100 bg-white p-4"
            >
              <Image
                src={m.src}
                alt={`${m.name} logo`}
                width={120}
                height={40}
                className="h-6 md:h-8 lg:h-8 w-auto object-contain"
              />
            </div>
          ))}
        </div>
        <p className="text-sm text-foreground/70 mt-6 text-center md:text-left">
          We support major local wallets, bank transfers, and international
          cards for your convenience.
        </p>
      </Container>
    </section>
  );
}
