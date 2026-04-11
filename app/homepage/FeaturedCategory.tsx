import Image from "next/image";
import Container from "../../components/Container";
import Card from "../../components/ui/Card";

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

export default function FeaturedCategory() {
  return (
    <section id="categories" className="mt-12 md:mt-16">
      <Container>
        <h2
          className="text-xl md:text-2xl font-semibold mb-4"
          style={{ fontFamily: "var(--font-heading-sans)" }}
        >
          Popular categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Card key={cat.name} className="relative overflow-hidden p-0 group">
              <div className="relative h-28">
                <Image
                  src={cat.bg}
                  alt={`${cat.name} background`}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, (max-width: 1280px) 16vw, 12vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 text-center">
                  <div className="h-12 w-12 rounded-full bg-white/90 backdrop-blur border border-white/60 shadow flex items-center justify-center">
                    <Image
                      src={cat.thumbnail}
                      alt={`${cat.name} icon`}
                      width={24}
                      height={24}
                    />
                  </div>
                  <span className="text-sm font-medium text-white/95 px-2 py-0.5 rounded bg-black/35">
                    {cat.name}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
