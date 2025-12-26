import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import type { ProductDetail } from "@/types/products";
import type { ReviewItem, ReviewRatingStats } from "@/types/reviews";
import { getProductReviews } from "@/lib/api";

interface ReviewsSectionProps {
  product: ProductDetail;
}

const calculateRatingDistribution = (reviews: ReviewItem[]) => {
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
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [ratingStats, setRatingStats] = useState<ReviewRatingStats | null>(null);
  const [totalReviews, setTotalReviews] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true);
      try {
        const data = await getProductReviews(product.id, { page: 1, pageSize: 3 });
        setReviews(data.reviews);
        setRatingStats(data.ratingStats);
        setTotalReviews(data.total);
        setPage(data.page);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
        setReviews([]);
        setRatingStats(null);
        setTotalReviews(0);
        setPage(1);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    if (product?.id) {
      loadReviews();
    }
  }, [product?.id]);

  const handleLoadMore = async () => {
    if (isLoadingMore || page >= totalPages) return;
    const nextPage = page + 1;
    setIsLoadingMore(true);
    try {
      const data = await getProductReviews(product.id, { page: nextPage, pageSize: 3 });
      setReviews((prev) => [...prev, ...data.reviews]);
      setRatingStats(data.ratingStats);
      setTotalReviews(data.total);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to load more reviews", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const ratingDistribution = useMemo(() => {
    if (ratingStats?.counts) {
      return {
        5: ratingStats.counts[5] || 0,
        4: ratingStats.counts[4] || 0,
        3: ratingStats.counts[3] || 0,
        2: ratingStats.counts[2] || 0,
        1: ratingStats.counts[1] || 0,
      };
    }
    return calculateRatingDistribution(reviews);
  }, [ratingStats, reviews]);

  const resolvedTotalReviews = totalReviews || product.reviewCount || reviews.length;
  const resolvedRating =
    ratingStats?.averageRating ?? (product.rating ? product.rating : 0);

  return (
    <section id="reviews" className="w-full space-y-10 px-4 sm:px-6 lg:px-10">
      <div className="flex flex-col gap-6 rounded-[32px] border border-[#E5E7EB] bg-white/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[28px] font-semibold text-[#1A1A1A]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Đánh giá của khách hàng
          </p>
          <p className="text-[15px] text-[#6B7280]">Phản hồi xác thực từ cộng đồng Aristino</p>
        </div>
        <div className="flex items-end gap-4">
          <div className="text-[56px] font-bold leading-none text-[#1A1A1A]">
            {resolvedRating.toFixed(1)}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={`h-5 w-5 ${idx < Math.round(resolvedRating) ? "fill-[#D4AF37] text-[#D4AF37]" : "text-[#E5E7EB]"}`}
                  strokeWidth={idx < Math.round(resolvedRating) ? 0 : 1.5}
                />
              ))}
            </div>
            <p className="text-[14px] text-[#6B7280]">
              Dựa trên {resolvedTotalReviews} khách hàng
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <div className="rounded-[24px] border border-[#E5E7EB] bg-white/90 p-6 shadow-sm">
          <p className="mb-4 text-[16px] font-semibold text-[#1A1A1A]">Phân tích đánh giá</p>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingDistribution[rating as keyof typeof ratingDistribution];
              const percentage = resolvedTotalReviews > 0 ? Math.round((count / resolvedTotalReviews) * 100) : 0;
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
          {isLoading && (
            <div className="rounded-[24px] border border-[#E5E7EB] bg-white/90 p-6 text-[14px] text-[#6B7280] shadow-sm">
              Đang tải đánh giá...
            </div>
          )}

          {!isLoading && reviews.length === 0 && (
            <div className="rounded-[24px] border border-[#E5E7EB] bg-white/90 p-6 text-[14px] text-[#6B7280] shadow-sm">
              Chưa có đánh giá nào.
            </div>
          )}

          {reviews.map((review) => (
            <article key={review.id} className="rounded-[24px] border border-[#E5E7EB] bg-white/90 p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37] text-[15px] font-semibold text-white">
                  {getInitials(review.user.name)}
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
                    <span className="text-[15px] font-semibold text-[#1A1A1A]">{review.user.name}</span>
                    <span className="text-[13px] text-[#9CA3AF]">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-[15px] leading-relaxed text-[#4B5563]">
                    {review.comment || "Không có nhận xét."}
                  </p>
                </div>
              </div>
            </article>
          ))}
          {page < totalPages && (
            <div className="text-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="inline-flex items-center justify-center rounded-[14px] border border-[#1A1A1A] px-8 py-3 text-[14px] font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] transition hover:bg-[#1A1A1A] hover:text-white disabled:opacity-60"
              >
                {isLoadingMore ? "Đang tải..." : "Xem thêm đánh giá"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

