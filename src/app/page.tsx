import dynamic from 'next/dynamic';

// Dynamic imports for better performance
const HeroSection = dynamic(() => import('@/components/home/HeroSection'));
const FeaturedProducts = dynamic(() => import('@/components/home/FeaturedProducts'));
const CategoriesShowcase = dynamic(() => import('@/components/home/CategoriesShowcase'));
const NewsletterSignup = dynamic(() => import('@/components/home/NewsletterSignup'));

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <FeaturedProducts />
      <CategoriesShowcase />
      <NewsletterSignup />
    </main>
  );
}
