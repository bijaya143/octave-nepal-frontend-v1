import Link from "next/link";
import Container from "../../components/Container";
import Carousel from "../../components/ui/Carousel";
import CourseCard, { type Course } from "../../components/CourseCard";

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

function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

export default function FeaturedCourse() {
  return (
    <section className="mt-12 md:mt-16">
      <Container>
        <div className="flex items-center justify-between gap-2 mb-4">
          <h2
            className="text-xl md:text-2xl font-semibold"
            style={{ fontFamily: "var(--font-heading-sans)" }}
          >
            Featured courses
          </h2>
          <Link
            href="/courses"
            className="text-sm text-[color:var(--color-primary-700)] hover:underline underline-offset-2 whitespace-nowrap"
          >
            View all
          </Link>
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
  );
}
