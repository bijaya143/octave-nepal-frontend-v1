import Hero from "@/app/homepage/Hero";
import PostHeroBanner from "@/app/homepage/PostHeroBanner";
import SpecialOfferCourse from "@/app/homepage/SpecialOfferCourse";
import FeaturedCourse from "@/app/homepage/FeaturedCourse";
import FeaturedCategory from "@/app/homepage/FeaturedCategory";
import FeaturedTestimonial from "@/app/homepage/FeaturedTestimonial";
import SupportPaymentMethod from "@/app/homepage/SupportedPaymentMethod";
import Newsletter from "@/app/homepage/Newsletter";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      {/* Hero */}
      <Hero />

      {/* Post-Hero Banner */}
      <PostHeroBanner />

      {/* Special Offers */}
      <SpecialOfferCourse />

      {/* Featured Carousel */}
      <FeaturedCourse />

      {/* Categories */}
      <FeaturedCategory />

      {/* Testimonials */}
      <FeaturedTestimonial />

      {/* Supported Payment Methods */}
      <SupportPaymentMethod />

      {/* Newsletter */}
      <Newsletter />
    </main>
  );
}
