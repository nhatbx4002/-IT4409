import { useEffect, useState  } from "react";
import MainLayout from "@/layout/MainLayout";
import { HomepageSkeleton } from "@/components/Skeleton/HomepageSkeleton";

import { Hero } from "@/components/Hero";
import { FeaturedCollections } from "@/components/HomePage/FeaturedCollection";
import { BrandCarousel } from "@/components/HomePage/BrandCarousel";
import { NewArrivals } from "@/components/HomePage/NewArrivals";
import { PromotionBanner } from "@/components/HomePage/PromotionBanner";
import { EditorialSection } from "@/components/HomePage/EditorialSection";
import { InstagramGallery } from "@/components/HomePage/InstagramGallery";
import { TrustStrip } from "@/components/HomePage/TrustStrip";
import { ValuePropsStrip } from "@/components/HomePage/ValuePropsStrip";


export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <MainLayout>
      {isLoading ? (
        <HomepageSkeleton />
      ) : (
        <>
          <Hero />
          <TrustStrip />
          <FeaturedCollections />
          <BrandCarousel />
          <NewArrivals />
          <ValuePropsStrip />
          <PromotionBanner />
          <EditorialSection />
          <InstagramGallery />
        </>
      )}
    </MainLayout>
  );
}
