import Image from "next/image";
import Container from "../../components/Container";
import Badge from "../../components/ui/Badge";
import Card, { CardContent } from "../../components/ui/Card";
import OfferTimer from "../../components/ui/OfferTimer";
import Link from "next/link";
import Button from "../../components/ui/Button";

const offers = [
  {
    id: "o1",
    courseId: "1",
    title: "React 19 Bootcamp",
    thumbnail:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
    discountPercent: 35,
    originalPrice: 129,
    price: 84,
    startDate: "Nov 05, 2025",
    timeStart: "7:00 PM",
    timeEnd: "8:30 PM",
    days: "Sun–Thu",
    totalSeats: 40,
    reservedSeats: 32,
    duration: "2.5 months",
  },
  {
    id: "o2",
    courseId: "2",
    title: "Advanced TypeScript",
    thumbnail:
      "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=1200&q=80",
    discountPercent: 25,
    originalPrice: 119,
    price: 89,
    startDate: "Nov 12, 2025",
    timeStart: "6:30 PM",
    timeEnd: "8:00 PM",
    days: "Mon–Fri",
    totalSeats: 30,
    reservedSeats: 12,
    duration: "5 weeks",
  },
  {
    id: "o3",
    courseId: "3",
    title: "Next.js 15 Pro",
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    discountPercent: 30,
    originalPrice: 139,
    price: 97,
    startDate: "Dec 01, 2025",
    timeStart: "7:30 PM",
    timeEnd: "9:00 PM",
    days: "Mon–Fri",
    totalSeats: 35,
    reservedSeats: 20,
    duration: "6 weeks",
  },
];

export default function SpecialOfferCourse() {
  return (
    <section id="offers" className="mt-12 md:mt-16">
      <Container>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div>
            <h2
              className="text-xl md:text-2xl font-semibold"
              style={{ fontFamily: "var(--font-heading-sans)" }}
            >
              Special offers
            </h2>
            <p className="hidden sm:block text-sm text-[color:var(--color-neutral-600)] mt-1">
              Live cohorts starting soon · Limited seats
            </p>
          </div>
          <Badge variant="outline" className="shrink-0 whitespace-nowrap">
            Limited time
          </Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {offers.map((o, idx) => (
            <Card key={o.id} className="relative p-0 overflow-hidden">
              <div className="absolute right-3 top-3 z-10">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50/95 backdrop-blur px-2 py-1 border border-amber-200 shadow">
                  <OfferTimer
                    startDate={o.startDate}
                    timeStart={o.timeStart}
                    totalSeats={o.totalSeats}
                    reservedSeats={o.reservedSeats}
                  />
                </div>
              </div>
              <div className="relative h-44 sm:h-48 md:h-56">
                <Image
                  src={o.thumbnail}
                  alt={`${o.title} thumbnail`}
                  fill
                  sizes="(max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 16vw"
                  className="object-cover"
                />
                <div className="absolute left-3 top-3">
                  <Badge>{`Save ${o.discountPercent}%`}</Badge>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <CardContent className="py-4">
                <h3
                  className="text-base font-semibold leading-snug"
                  style={{ fontFamily: "var(--font-heading-sans)" }}
                >
                  {o.title}
                </h3>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-[color:var(--color-neutral-600)]">
                  <span className="inline-flex items-center gap-1">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-[color:var(--color-neutral-600)]"
                    >
                      <path
                        d="M12 8v5l3 2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                    {o.days} · {o.timeStart} – {o.timeEnd}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-[color:var(--color-neutral-600)]"
                    >
                      <path
                        d="M7 3h10M7 21h10M7 3c0 3 5 5 5 9s-5 6-5 9M17 3c0 3-5 5-5 9s5 6 5 9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {o.duration}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-[color:var(--color-neutral-600)]">
                  <span className="inline-flex items-center gap-1">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-[color:var(--color-neutral-600)]"
                    >
                      <path
                        d="M7 2v3M17 2v3M3.5 9.5h17M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Starts {o.startDate}
                  </span>
                  {(() => {
                    const seatsLeft = o.totalSeats - o.reservedSeats;
                    const ratio = o.reservedSeats / o.totalSeats;
                    const limited = ratio >= 0.7;
                    return (
                      <span
                        className={`inline-flex items-center gap-1 ${limited ? "text-red-700" : "text-green-700"}`}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className={
                            limited ? "text-red-600" : "text-green-600"
                          }
                        >
                          <path
                            d="M7 11v6M12 11v6M17 11v6M5 21h14a2 2 0 002-2v-7a2 2 0 00-2-2h-1V7a4 4 0 00-8 0v3H5a2 2 0 00-2 2v7a2 2 0 002 2z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {limited
                          ? `Limited seats (${seatsLeft} left)`
                          : `Seats available (${seatsLeft} left)`}
                      </span>
                    );
                  })()}
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex items-baseline gap-2 whitespace-nowrap">
                    <span className="text-base font-semibold text-[color:var(--color-primary-700)]">
                      Rs {o.price}
                    </span>
                    <span className="text-xs text-[color:var(--color-neutral-500)] line-through">
                      Rs {o.originalPrice}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/courses/${o.courseId}`}>
                      <Button size="sm">View Details</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
