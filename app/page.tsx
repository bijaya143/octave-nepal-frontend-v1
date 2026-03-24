import Image from "next/image";
import Link from "next/link";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Card, { CardContent } from "../components/ui/Card";
import Carousel from "../components/ui/Carousel";
import CourseCard, { type Course } from "../components/CourseCard";
import Rating from "../components/ui/Rating";
import OfferTimer from "../components/ui/OfferTimer";
import NewsletterForm from "../components/NewsletterForm";
import Container from "../components/Container";
import { BookOpen, LayoutGrid, Sparkles, Users, Hammer, Wallet } from "lucide-react";
import { SITE_NAME } from "@/lib/constant";

const featured: Course[] = [
  {
    id: "1",
    title: "Mastering React 19",
    instructor: "Jane Doe",
    instructorAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=80",
    rating: 4.7,
    ratingCount: 1120,
    price: 129,
    discount: 35,
    thumbnail:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "2",
    title: "TypeScript Deep Dive",
    instructor: "John Smith",
    instructorAvatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=96&q=80",
    rating: 4.8,
    ratingCount: 860,
    price: 119,
    discount: 25,
    thumbnail:
      "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "3",
    title: "Next.js 15 Pro",
    instructor: "Alex Kim",
    instructorAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=96&q=80",
    rating: 4.9,
    ratingCount: 540,
    price: 139,
    discount: 30,
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "4",
    title: "UI Design Principles",
    instructor: "Sam Lee",
    instructorAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=96&q=80",
    rating: 4.6,
    ratingCount: 540,
    price: 139,
    discount: 30,
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "5",
    title: "Python for Beginners",
    instructor: "Sam Lee",
    instructorAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=96&q=80",
    rating: 4.6,
    ratingCount: 540,
    price: 139,
    discount: 30,
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  },
];

const categories = [
  {
    name: "Development",
    thumbnail: "https://placehold.co/40x40/png?text=</>",
    bg: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Design",
    thumbnail: "https://placehold.co/40x40/png?text=UI",
    bg: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Marketing",
    thumbnail: "https://placehold.co/40x40/png?text=Ad",
    bg: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Data Science",
    thumbnail: "https://placehold.co/40x40/png?text=DS",
    bg: "https://images.unsplash.com/photo-1517148815978-75f6acaaf32c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Business",
    thumbnail: "https://placehold.co/40x40/png?text=Biz",
    bg: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Photography",
    thumbnail: "https://placehold.co/40x40/png?text=📷",
    bg: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  },
];

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

function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

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

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      {/* Hero */}
      <section className="pt-12 sm:pt-16 md:pt-20">
        <Container>
        <div className="grid md:grid-cols-2 items-center gap-8 md:gap-12">
          <div>
            <h1 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-balance mb-4 sm:mb-6 max-w-[28ch] md:max-w-none" style={{ fontFamily: "var(--font-heading-sans)" }}>
              <span className="block sm:hidden">Turn Curiosity into a Career</span>
              <div className="hidden sm:block">
                <span className="block">Real <span className="gradient-text">Mentors</span>.</span>
                <span className="block">Real <span className="gradient-text">Deadlines</span>.</span>
                <span className="block">Real <span className="gradient-text">Results</span>.</span>
              </div>
              <span className="pointer-events-none absolute -bottom-2 left-0 h-[3px] w-24 sm:w-28 md:w-32 rounded-full bg-gradient-to-r from-primary-600 to-indigo-500/60 blur-[0.5px] hidden sm:block"></span>
            </h1>
            <p className="text-[color:var(--color-neutral-600)] text-base md:text-lg text-pretty max-w-xl mb-6">
              Cohort based courses by industry experts. Flexible schedules, and easy local payments
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Link href="/courses">
                <Button size="lg" block>
                  <BookOpen size={18} className="mr-2" aria-hidden="true" />
                  <span className="hidden lg:inline">Browse{"\u00A0"}</span>Courses
                </Button>
              </Link>
              <Link href="/categories">
                <Button size="lg" variant="secondary" block>
                  <LayoutGrid size={18} className="mr-2" aria-hidden="true" />
                  <span className="hidden lg:inline">Explore{"\u00A0"}</span>Categories
                </Button>
              </Link>
            </div>
          </div>
          <div>
            <Card className="p-0 overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1600&q=80" alt="Learning hero" width={1600} height={900} sizes="(min-width: 768px) 50vw, 100vw" className="w-full h-auto" priority />
              <CardContent className="py-5">
                <p className="text-sm text-[color:var(--color-neutral-600)]">Trusted by 10k+ learners worldwide</p>
              </CardContent>
            </Card>
          </div>
        </div>
        </Container>
      </section>

      {/* Post-Hero Banner */}
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
              <h2 className="mt-3 text-lg md:text-xl font-semibold" style={{ fontFamily: "var(--font-heading-sans)" }}>Learn with Community, Build with Mentors, Grow with Confidence</h2>
              <p className="mt-2 text-sm text-[color:var(--color-neutral-600)]">Live cohorts, project‑first learning and local payment support. Made for ambitious learners in Nepal.</p>
            </div>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5 text-sm">
              <div className="flex items-center justify-center gap-2 rounded-lg border border-black/5 bg-white/80 backdrop-blur px-4 py-2">
                <Users size={16} className="text-[color:var(--color-primary-700)]" />
                <span>Community support</span>
              </div>
              <div className="flex items-center justify-center gap-2 rounded-lg border border-black/5 bg-white/80 backdrop-blur px-4 py-2">
                <Hammer size={16} className="text-[color:var(--color-primary-700)]" />
                <span>Project‑first learning</span>
              </div>
              <div className="flex items-center justify-center gap-2 rounded-lg border border-black/5 bg-white/80 backdrop-blur px-4 py-2">
                <Wallet size={16} className="text-[color:var(--color-primary-700)]" />
                <span>Easy local payments</span>
              </div>
            </div>
          </CardContent>
        </Card>
        </Container>
      </section>

      {/* Special Offers */}
      <section id="offers" className="mt-12 md:mt-16">
        <Container>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold" style={{ fontFamily: "var(--font-heading-sans)" }}>Special offers</h2>
            <p className="hidden sm:block text-sm text-[color:var(--color-neutral-600)] mt-1">Live cohorts starting soon · Limited seats</p>
          </div>
          <Badge variant="outline" className="shrink-0 whitespace-nowrap">Limited time</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {offers.map((o, idx) => (
            <Card key={o.id} className="relative p-0 overflow-hidden">
              <div className="absolute right-3 top-3 z-10">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50/95 backdrop-blur px-2 py-1 border border-amber-200 shadow">
                  <OfferTimer startDate={o.startDate} timeStart={o.timeStart} totalSeats={o.totalSeats} reservedSeats={o.reservedSeats} />
                </div>
              </div>
              <div className="relative h-44 sm:h-48 md:h-56">
                <Image src={o.thumbnail} alt={`${o.title} thumbnail`} fill sizes="(max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 16vw" className="object-cover" />
                <div className="absolute left-3 top-3">
                  <Badge>{`Save ${o.discountPercent}%`}</Badge>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <CardContent className="py-4">
                <h3 className="text-base font-semibold leading-snug" style={{ fontFamily: "var(--font-heading-sans)" }}>{o.title}</h3>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-[color:var(--color-neutral-600)]">
                  <span className="inline-flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[color:var(--color-neutral-600)]">
                      <path d="M12 8v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    {o.days} · {o.timeStart} – {o.timeEnd}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[color:var(--color-neutral-600)]">
                      <path d="M7 3h10M7 21h10M7 3c0 3 5 5 5 9s-5 6-5 9M17 3c0 3-5 5-5 9s5 6 5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {o.duration}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-[color:var(--color-neutral-600)]">
                  <span className="inline-flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[color:var(--color-neutral-600)]">
                      <path d="M7 2v3M17 2v3M3.5 9.5h17M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Starts {o.startDate}
                  </span>
                  {(() => {
                    const seatsLeft = o.totalSeats - o.reservedSeats;
                    const ratio = o.reservedSeats / o.totalSeats;
                    const limited = ratio >= 0.7;
                    return (
                      <span className={`inline-flex items-center gap-1 ${limited ? "text-red-700" : "text-green-700"}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={limited ? "text-red-600" : "text-green-600"}>
                          <path d="M7 11v6M12 11v6M17 11v6M5 21h14a2 2 0 002-2v-7a2 2 0 00-2-2h-1V7a4 4 0 00-8 0v3H5a2 2 0 00-2 2v7a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {limited ? `Limited seats (${seatsLeft} left)` : `Seats available (${seatsLeft} left)`}
                      </span>
                    );
                  })()}
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex items-baseline gap-2 whitespace-nowrap">
                    <span className="text-base font-semibold text-[color:var(--color-primary-700)]">Rs {o.price}</span>
                    <span className="text-xs text-[color:var(--color-neutral-500)] line-through">Rs {o.originalPrice}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/courses/${o.courseId}`}><Button size="sm">View Details</Button></Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        </Container>
      </section>

      {/* Featured Carousel */}
      <section className="mt-12 md:mt-16">
        <Container>
        <div className="flex items-center justify-between gap-2 mb-4">
          <h2 className="text-xl md:text-2xl font-semibold" style={{ fontFamily: "var(--font-heading-sans)" }}>Featured courses</h2>
          <Link href="/courses" className="text-sm text-[color:var(--color-primary-700)] hover:underline underline-offset-2 whitespace-nowrap">View all</Link>
        </div>
        {/* Mobile: one course per slide */}
        <div className="sm:hidden">
          <Carousel>
            {featured.map((course) => (
              <div key={course.id}>
                <CourseCard course={course} />
              </div>
            ))}
          </Carousel>
        </div>

        {/* Tablets: slides of 2 items */}
        <div className="hidden sm:block lg:hidden">
          <Carousel>
            {chunkArray(featured, 2).map((group, i) => (
              <div key={i} className="grid sm:grid-cols-2 gap-4 md:gap-6">
                {group.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ))}
          </Carousel>
        </div>

        {/* Desktop: slides of 3 items */}
        <div className="hidden lg:block">
          <Carousel>
            {chunkArray(featured, 3).map((group, i) => (
              <div key={i} className="grid lg:grid-cols-3 gap-6">
                {group.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ))}
          </Carousel>
        </div>
        </Container>
      </section>

      {/* Categories */}
      <section id="categories" className="mt-12 md:mt-16">
        <Container>
        <h2 className="text-xl md:text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-heading-sans)" }}>Popular categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Card key={cat.name} className="relative overflow-hidden p-0 group">
              <div className="relative h-28">
                <Image src={cat.bg} alt={`${cat.name} background`} fill sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, (max-width: 1280px) 16vw, 12vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 text-center">
                  <div className="h-12 w-12 rounded-full bg-white/90 backdrop-blur border border-white/60 shadow flex items-center justify-center">
                    <Image src={cat.thumbnail} alt={`${cat.name} icon`} width={24} height={24} />
                  </div>
                  <span className="text-sm font-medium text-white/95 px-2 py-0.5 rounded bg-black/35">{cat.name}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="mt-12 md:mt-16 mb-16">
        <Container>
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-semibold" style={{ fontFamily: "var(--font-heading-sans)" }}>What learners say</h2>
          <span className="hidden sm:inline text-sm text-[color:var(--color-neutral-600)]">Real feedback from our community</span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <Card key={t.name} className="relative overflow-hidden p-0 border border-black/5 bg-white/95 backdrop-blur-sm transition-shadow hover:shadow-lg">
              <CardContent className="py-5">
                <div className="flex items-center gap-3 mb-3">
                  <Image src={t.avatar} alt={`${t.name} avatar`} width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-[color:var(--color-neutral-600)]">{t.date}</div>
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

      {/* Supported Payment Methods */}
      <section id="payments" className="mt-12 md:mt-16 mb-20">
        <Container>
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-semibold" style={{ fontFamily: "var(--font-heading-sans)" }}>Supported payment methods</h2>
          <span className="hidden sm:inline text-sm text-[color:var(--color-neutral-600)]">Secure payments powered by trusted providers</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 justify-items-center">
          {[
            { name: "eSewa", src: "/images/payments/esewa.png" },
            { name: "Khalti", src: "/images/payments/khalti.png" },
            { name: "Fonepay", src: "/images/payments/fonepay.png" },
            { name: "Visa", src: "/images/payments/visa.png" },
            { name: "Mastercard", src: "/images/payments/mastercard.png" },
          ].map((m) => (
            <div key={m.name} className="flex h-16 w-full items-center justify-center rounded-lg border border-black/5 bg-white/95 backdrop-blur-sm px-3 py-2 hover:shadow-sm transition">
              <Image src={m.src} alt={`${m.name} logo`} width={96} height={32} className="h-8 w-auto object-contain" />
            </div>
          ))}
        </div>
        <p className="text-xs text-[color:var(--color-neutral-600)] mt-3">We support local wallets and international cards.</p>
        </Container>
      </section>

      {/* Newsletter */}
      <section id="newsletter" className="mt-6 md:mt-10 mb-8">
        <Container>
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent_60%)]" />
          <CardContent className="relative py-8 md:py-10">
            <div className="grid md:grid-cols-2 items-center gap-6 md:gap-10">
              <div>
                <h3 className="text-lg md:text-xl font-semibold" style={{ fontFamily: "var(--font-heading-sans)" }}>Stay in the loop</h3>
                <p className="mt-2 text-sm text-[color:var(--color-neutral-600)]">Get updates on new courses, offers, and events. No spam.</p>
              </div>
              <NewsletterForm />
            </div>
          </CardContent>
        </Card>
        </Container>
      </section>
    </main>
  );
}

