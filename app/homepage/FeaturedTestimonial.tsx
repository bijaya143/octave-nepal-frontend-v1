import Image from "next/image";
import Container from "../../components/Container";
import Card, { CardContent } from "../../components/ui/Card";
import Rating from "../../components/ui/Rating";

const testimonials = [
  {
    quote:
      "The UI is beautiful and the content is top-notch. Highly recommended!",
    name: "Aarav Shrestha",
    date: "Oct 2025",
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=256&q=80",
    rating: 5,
  },
  {
    quote:
      "Instructors explain complex topics clearly. I landed a better job after these courses.",
    name: "Prerana Karki",
    date: "Sep 2025",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80",
    rating: 5,
  },
  {
    quote:
      "Practical projects and elegant design made learning enjoyable and effective.",
    name: "Sujan Gurung",
    date: "Aug 2025",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
    rating: 4.5,
  },
];

export default function FeaturedTestimonial() {
  return (
    <section id="testimonials" className="mt-12 md:mt-16 mb-16">
      <Container>
        <div className="flex items-end justify-between mb-4">
          <h2
            className="text-xl md:text-2xl font-semibold"
            style={{ fontFamily: "var(--font-heading-sans)" }}
          >
            What learners say
          </h2>
          <span className="hidden sm:inline text-sm text-[color:var(--color-neutral-600)]">
            Real feedback from our community
          </span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <Card
              key={t.name}
              className="relative overflow-hidden p-0 border border-black/5 bg-white/95 backdrop-blur-sm transition-shadow hover:shadow-lg"
            >
              <CardContent className="py-5">
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src={t.avatar}
                    alt={`${t.name} avatar`}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-[color:var(--color-neutral-600)]">
                      {t.date}
                    </div>
                  </div>
                </div>
                <Rating value={t.rating} />
                <p className="text-sm leading-relaxed mt-3">“{t.quote}”</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
