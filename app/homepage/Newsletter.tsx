import Container from "../../components/Container";
import NewsletterForm from "../../components/NewsletterForm";
import Card, { CardContent } from "../../components/ui/Card";

export default function Newsletter() {
  return (
    <section id="newsletter" className="mt-6 md:mt-10 mb-8">
      <Container>
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent_60%)]" />
          <CardContent className="relative py-8 md:py-10">
            <div className="grid md:grid-cols-2 items-center gap-6 md:gap-10">
              <div>
                <h3
                  className="text-lg md:text-xl font-semibold"
                  style={{ fontFamily: "var(--font-heading-sans)" }}
                >
                  Stay in the loop
                </h3>
                <p className="mt-2 text-sm text-[color:var(--color-neutral-600)]">
                  Get updates on new courses, offers, and events. No spam.
                </p>
              </div>
              <NewsletterForm />
            </div>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
