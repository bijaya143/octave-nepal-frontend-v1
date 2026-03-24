export type Blog = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  authorAvatar?: string;
  date: string;
  readingTime: string;
  thumbnail?: string;
  tags?: string[];
};

export const blogs: Blog[] = [
  {
    id: "1",
    title: "Designing delightful learning experiences",
    excerpt:
      "Principles and patterns we use to craft elegant, effective course UIs.",
    author: "Team Octave",
    authorAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=96&q=80",
    date: "Oct 10, 2025",
    readingTime: "6 min read",
    thumbnail:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
    tags: ["Design", "UX"],
  },
  {
    id: "2",
    title: "Next.js 15 for production apps",
    excerpt:
      "Our checklist for shipping reliable, fast experiences with the new App Router.",
    author: "Alex Kim",
    authorAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=80",
    date: "Oct 02, 2025",
    readingTime: "8 min read",
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    tags: ["Development", "Next.js"],
  },
  {
    id: "3",
    title: "How we structure modern TypeScript projects",
    excerpt:
      "Pragmatic patterns for clarity, safety, and scalability across teams.",
    author: "Jane Doe",
    authorAvatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=96&q=80",
    date: "Sep 20, 2025",
    readingTime: "7 min read",
    thumbnail:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=80",
    tags: ["TypeScript", "Architecture"],
  },
];

export function getBlogById(id: string): Blog | undefined {
  return blogs.find((b) => b.id === id);
}


