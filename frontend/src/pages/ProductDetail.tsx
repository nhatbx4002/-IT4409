import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/layout/MainLayout";
import { getProductDetail } from "@/lib/api";
import { addViewedProduct } from "@/lib/viewedProducts";
import type { ProductDetail } from "@/types/products";
import { ProductHero } from "@/components/ProductDetail/ProductHero";
import { ProductDetailsAccordion } from "@/components/ProductDetail/ProductDetailsAccordion";
import { ReviewsSection } from "@/components/ProductDetail/ReviewsSection";
import { RecommendationsCarousel } from "@/components/ProductDetail/RecommendationsCarousel";
import { ViewedProductsCarousel } from "@/components/ProductDetail/ViewedProductsCarousel";
import { ProductBreadcrumbs } from "@/components/ProductDetail/ProductBreadcrumbs";
import { MobileStickyCart } from "@/components/ProductDetail/MobileStickyCart";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) {
        setError("Product slug is required");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await getProductDetail(slug);
        if (!data) {
          setError("Product not found");
          return;
        }
        setProduct(data);
        setError(null);

        addViewedProduct(data.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [slug]);

  if (isLoading) {
    return (
      <MainLayout>
      <div className="flex min-h-[70vh] items-center justify-center bg-[#050509]">
        <div className="rounded-3xl border border-white/10 bg-white/5 px-10 py-8 text-center shadow-[0_18px_80px_rgba(15,23,42,0.85)] backdrop-blur-2xl">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-[#D4AF37]/30 border-t-[#D4AF37]" />
          <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
            Loading product details
          </p>
        </div>
      </div>
      </MainLayout>
    );
  }

  if (error || !product) {
    return (
      <MainLayout>
      <div className="flex min-h-[70vh] items-center justify-center bg-gradient-to-b from-[#F9FAFB] to-white">
        <div className="max-w-md rounded-3xl border border-[#E5E7EB] bg-white px-8 py-10 text-center shadow-[0_18px_60px_rgba(15,23,42,0.10)]">
          <h1 className="mb-3 font-['Playfair_Display'] text-2xl font-semibold text-[#111827]">
            Product not found
          </h1>
          <p className="mb-6 text-sm text-[#6B7280]">
            {error || "The piece you are looking for is no longer available or does not exist."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="rounded-full bg-[#111827] px-8 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-black"
          >
            Back to Home
          </button>
        </div>
      </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
    <div className="min-h-screen bg-white">
      {/* Main Container */}
      <div className="w-full px-4 pb-16 pt-4 sm:px-8 lg:px-12 xl:px-16">
          {/* Breadcrumbs */}
          <div className="pt-6 pb-4">
            <ProductBreadcrumbs product={product} />
          </div>

          {/* Hero Section */}
          <div className="pt-4 pb-10 lg:pt-6 lg:pb-14">
            <ProductHero product={product} />
          </div>

          {/* Details Accordion */}
          <div className="border-t border-[#E5E7EB] pt-10 lg:pt-14">
            <ProductDetailsAccordion product={product} />
          </div>

          {/* Reviews Section */}
          <div className="border-t border-[#E5E7EB] pt-10 lg:pt-14">
            <ReviewsSection product={product} />
          </div>

          {/* Recommendations */}
          <div className="space-y-16 border-t border-[#E5E7EB] pt-12 lg:pt-16">
            <RecommendationsCarousel 
              title="You May Also Like" 
              product={product} 
              variant="similar"
              excludeProductId={product.id}
            />
            {product.collection && (
              <RecommendationsCarousel 
                title="More from This Collection" 
                product={product} 
                variant="category"
                excludeProductId={product.id}
              />
            )}
            
            {/* Recently Viewed */}
            <ViewedProductsCarousel 
              title="Recently Viewed" 
              excludeProductId={product.id}
            />
          </div>
        </div>

        {/* Mobile Sticky Add to Cart Button */}
        {product && <MobileStickyCart product={product} />}
      </div>
    </MainLayout>
  );
}

