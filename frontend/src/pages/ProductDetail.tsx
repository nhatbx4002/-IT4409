import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/layout/MainLayout";
import { getProductById } from "@/lib/api";
import type { ProductDetail } from "@/types/products";
import { ProductHero } from "@/components/ProductDetail/ProductHero";
import { ProductDetailsAccordion } from "@/components/ProductDetail/ProductDetailsAccordion";
import { ReviewsSection } from "@/components/ProductDetail/ReviewsSection";
import { RecommendationsCarousel } from "@/components/ProductDetail/RecommendationsCarousel";
import { ProductBreadcrumbs } from "@/components/ProductDetail/ProductBreadcrumbs";
import { MobileStickyCart } from "@/components/ProductDetail/MobileStickyCart";

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("Product ID is required");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await getProductById(Number(productId));
        setProduct(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C2A26F] mx-auto mb-4"></div>
            <p className="text-[#757575]">Loading product...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !product) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-black">Product Not Found</h1>
            <p className="text-[#757575] mb-6">{error || "The product you're looking for doesn't exist."}</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-black text-white uppercase tracking-wider hover:bg-[#C2A26F] transition-colors duration-300"
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
      <div className="bg-white min-h-screen">
        {/* Main Container */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="pt-6 pb-4">
            <ProductBreadcrumbs product={product} />
          </div>

          {/* Hero Section */}
          <div className="py-8 lg:py-12">
            <ProductHero product={product} />
          </div>

          {/* Details Accordion */}
          <div className="py-12 lg:py-16">
            <ProductDetailsAccordion product={product} />
          </div>

          {/* Reviews Section */}
          <div className="py-12 lg:py-16">
            <ReviewsSection product={product} />
          </div>

          {/* Recommendations */}
          <div className="py-12 lg:py-16">
            <RecommendationsCarousel />
          </div>
        </div>

        {/* Mobile Sticky Add to Cart Button */}
        {product && <MobileStickyCart product={product} />}
      </div>
    </MainLayout>
  );
}

