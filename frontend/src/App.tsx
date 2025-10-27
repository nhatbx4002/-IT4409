"use client";

import { useState, useEffect } from "react";

import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { FeaturedCollections } from "./components/HomePage/FeaturedCollection";
import { BrandCarousel } from "./components/HomePage/BrandCarousel";
import { NewArrivals } from "./components/HomePage/NewArrivals";
import { PromotionBanner } from "./components/HomePage/PromotionBanner";
import { EditorialSection } from "./components/HomePage/EditorialSection";
import { InstagramGallery } from "./components/HomePage/InstagramGallery";
import { Footer } from "./components/Footer";
import { HomepageSkeleton } from "@/components/Skeleton/HomepageSkeleton";

export default function App() {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <HomepageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white max-w-full overflow-x-hidden">
      <Navbar />
      <Hero />
      <FeaturedCollections />
      <BrandCarousel />
      <NewArrivals />
      <PromotionBanner />
      <EditorialSection />
      <InstagramGallery />
      <Footer />
    </div>
  );
}
