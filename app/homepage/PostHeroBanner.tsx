import { Hammer, Users, Wallet } from "lucide-react";
import Container from "../../components/Container";
import Card, { CardContent } from "../../components/ui/Card";
import { SITE_NAME } from "@/lib/constant";

export default function PostHeroBanner() {
  return (
    <section className="mt-8 md:mt-12">
      <Container>
        <Card className="relative overflow-hidden border border-black/5 bg-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(55,126,234,0.10),transparent_60%)]" />
          <CardContent className="relative py-7 md:py-9">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-primary-50)] text-[color:var(--color-primary-700)] px-2.5 py-1 text-xs border border-[color:var(--color-primary-200)]">
                {/* <Sparkles size={14} /> */}
                Keep growing with {SITE_NAME}
              </div>
              <h2
                className="mt-3 text-lg md:text-xl font-semibold"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                Learn with Community, Build with Mentors, Grow with Confidence
              </h2>
              <p className="mt-2 text-sm text-[color:var(--color-neutral-600)]">
                Live cohorts, project‑first learning and local payment support.
                Made for ambitious learners in Nepal.
              </p>
            </div>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5 text-sm">
              <div className="flex items-center justify-center gap-2 rounded-lg border border-black/5 bg-white/80 backdrop-blur px-4 py-2">
                <Users
                  size={16}
                  className="text-[color:var(--color-primary-700)]"
                />
                <span>Community support</span>
              </div>
              <div className="flex items-center justify-center gap-2 rounded-lg border border-black/5 bg-white/80 backdrop-blur px-4 py-2">
                <Hammer
                  size={16}
                  className="text-[color:var(--color-primary-700)]"
                />
                <span>Project‑first learning</span>
              </div>
              <div className="flex items-center justify-center gap-2 rounded-lg border border-black/5 bg-white/80 backdrop-blur px-4 py-2">
                <Wallet
                  size={16}
                  className="text-[color:var(--color-primary-700)]"
                />
                <span>Easy local payments</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
