import { Star, ThumbsUp } from "lucide-react";
import type { ProductDetail } from "@/types/products";

interface ReviewsSectionProps {
  product: ProductDetail;
}

const mockReviews = [
  {
    id: 1,
    userName: "Luca B.",
    date: "2024-02-18",
    rating: 5,
    comment: "Impeccable craftsmanship. The drape is phenomenal and the shoulder expression rivals my bespoke jackets.",
    sizeWorn: "Size 40R",
    helpfulCount: 18,
  },
  {
    id: 2,
    userName: "Ethan K.",
    date: "2024-01-29",
    rating: 4,
    comment: "Fabric feels luxurious and lightweight. Needed minor tailoring at the waist but worth every visit to the atelier.",
    sizeWorn: "Size 38R",
    helpfulCount: 11,
  },
  {
    id: 3,
    userName: "Marco D.",
    date: "2024-01-12",
    rating: 5,
    comment: "Received compliments at every event. The midnight blue tone has a subtle sheen that feels truly premium.",
    sizeWorn: "Size 42R",
    helpfulCount: 24,
  },
];

const calculateRatingDistribution = (reviews: typeof mockReviews) => {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((review) => {
    distribution[review.rating as keyof typeof distribution]++;
  });
  return distribution;
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export function ReviewsSection({ product }: ReviewsSectionProps) {
  const reviews = mockReviews;
  const ratingDistribution = calculateRatingDistribution(reviews);
  const totalReviews = reviews.length || product.reviewCount;

  return (
    <section id="reviews" className="mx-auto max-w-5xl space-y-10">
      <div className="flex flex-col gap-6 rounded-[32px] border border-[#E5E7EB] bg-white/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[28px] font-semibold text-[#1A1A1A]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Customer Reviews
          </p>
          <p className="text-[15px] text-[#6B7280]">Verified feedback from our sartorial community</p>
        </div>
        <div className="flex items-end gap-4">
          <div className="text-[56px] font-bold leading-none text-[#1A1A1A]">{product.rating.toFixed(1)}</div>
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={`h-5 w-5 ${idx < Math.round(product.rating) ? "fill-[#D4AF37] text-[#D4AF37]" : "text-[#E5E7EB]"}`}
                  strokeWidth={idx < Math.round(product.rating) ? 0 : 1.5}
                />
              ))}
            </div>
            <p className="text-[14px] text-[#6B7280]">
              Based on {product.reviewCount || totalReviews} luxury clients
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <div className="rounded-[24px] border border-[#E5E7EB] bg-white/90 p-6 shadow-sm">
          <p className="mb-4 text-[16px] font-semibold text-[#1A1A1A]">Rating Breakdown</p>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingDistribution[rating as keyof typeof ratingDistribution];
              const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
              return (
                <div key={rating} className="flex items-center gap-3">
                  <span className="w-6 text-[13px] text-[#6B7280]">{rating}</span>
                  <div className="relative h-2 flex-1 rounded-full bg-[#F1F5F9]">
                    <div className="absolute inset-y-0 left-0 rounded-full bg-[#D4AF37]" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="w-12 text-right text-[13px] text-[#6B7280]">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          {reviews.slice(0, 3).map((review) => (
            <article key={review.id} className="rounded-[24px] border border-[#E5E7EB] bg-white/90 p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37] text-[15px] font-semibold text-white">
                  {getInitials(review.userName)}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`h-4 w-4 ${idx < review.rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-[#E5E7EB]"}`}
                          strokeWidth={idx < review.rating ? 0 : 1}
                        />
                      ))}
                    </div>
                    <span className="text-[15px] font-semibold text-[#1A1A1A]">{review.userName}</span>
                    <span className="text-[13px] text-[#9CA3AF]">
                      {new Date(review.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-[15px] leading-relaxed text-[#4B5563]">{review.comment}</p>
                  <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#6B7280]">
                    <span className="rounded-full bg-[#F9FAFB] px-3 py-1">Size Worn: {review.sizeWorn}</span>
                    <button className="inline-flex items-center gap-1 text-[#1A1A1A] transition hover:text-[#D4AF37]">
                      <ThumbsUp className="h-4 w-4" />
                      Helpful ({review.helpfulCount})
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
          <div className="text-center">
            <button className="inline-flex items-center justify-center rounded-[14px] border border-[#1A1A1A] px-8 py-3 text-[14px] font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] transition hover:bg-[#1A1A1A] hover:text-white">
              Load More Reviews
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

