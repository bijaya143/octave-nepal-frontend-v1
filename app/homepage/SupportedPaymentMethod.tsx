import Image from "next/image";
import Container from "../../components/Container";

export default function SupportPaymentMethod() {
  return (
    <section id="payments" className="mt-12 md:mt-16 mb-20">
      <Container>
        <div className="flex items-end justify-between mb-4">
          <h2
            className="text-xl md:text-2xl font-semibold"
            style={{ fontFamily: "var(--font-heading-sans)" }}
          >
            Supported payment methods
          </h2>
          <span className="hidden sm:inline text-sm text-[color:var(--color-neutral-600)]">
            Secure payments powered by trusted providers
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 justify-items-center">
          {[
            { name: "eSewa", src: "/images/payments/esewa.png" },
            { name: "Khalti", src: "/images/payments/khalti.png" },
            { name: "Fonepay", src: "/images/payments/fonepay.png" },
            { name: "Visa", src: "/images/payments/visa.png" },
            { name: "Mastercard", src: "/images/payments/mastercard.png" },
          ].map((m) => (
            <div
              key={m.name}
              className="flex h-16 w-full items-center justify-center rounded-lg border border-black/5 bg-white/95 backdrop-blur-sm px-3 py-2 hover:shadow-sm transition"
            >
              <Image
                src={m.src}
                alt={`${m.name} logo`}
                width={96}
                height={32}
                className="h-8 w-auto object-contain"
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-[color:var(--color-neutral-600)] mt-3">
          We support local wallets and international cards.
        </p>
      </Container>
    </section>
  );
}
