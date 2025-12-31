import { useEffect, useMemo, useState } from "react";
import { Star, Send, X, Edit2, Trash2, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductDetail } from "@/types/products";
import type { ReviewItem, ReviewRatingStats } from "@/types/reviews";
import { getProductReviews, createReview, updateReview, deleteReview } from "@/lib/api";
import { isAuthenticated, getStoredUser } from "@/lib/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [ratingStats, setRatingStats] = useState<ReviewRatingStats | null>(null);
  const [totalReviews, setTotalReviews] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewImages, setReviewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(getStoredUser());
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  const loadReviews = async (targetPage = 1) => {
    setIsLoading(true);
    try {
      const data = await getProductReviews(product.id, { page: targetPage, pageSize: 3 });
      setReviews(data.reviews);
      setRatingStats(data.ratingStats);
      setTotalReviews(data.total);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
      setReviews([]);
      setPage(1);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (product?.id) {
      loadReviews(1);
    }
  }, [product?.id]);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    setUser(getStoredUser());
  }, []);

  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === page || isLoading) return;
    await loadReviews(newPage);
    // Scroll to reviews section
    document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentTotal = reviewImages.length + imagePreviews.filter(p => !p.startsWith('blob:')).length;
    if (files.length + currentTotal > 5) {
      toast.error("Tối đa 5 ảnh");
      return;
    }
    setReviewImages([...reviewImages, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const handleRemoveImage = (index: number) => {
    const preview = imagePreviews[index];
    const isBlobUrl = preview.startsWith('blob:');
    
    if (isBlobUrl) {
      // Remove from both reviewImages and imagePreviews
      const blobIndex = imagePreviews.slice(0, index).filter(p => p.startsWith('blob:')).length;
      const newImages = reviewImages.filter((_, i) => i !== blobIndex);
      setReviewImages(newImages);
    }
    
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    
    // Revoke object URL if it's a blob URL
    if (isBlobUrl) {
      URL.revokeObjectURL(preview);
    }
  };

  const resetForm = () => {
    setSelectedRating(0);
    setComment("");
    setReviewImages([]);
    imagePreviews.forEach(url => URL.revokeObjectURL(url));
    setImagePreviews([]);
    setEditingReview(null);
    setShowReviewForm(false);
  };

  const handleEditReview = (review: ReviewItem) => {
    if (review.user.id !== user?.id) {
      toast.error("Bạn chỉ có thể chỉnh sửa đánh giá của chính mình");
      return;
    }
    setEditingReview(review);
    setSelectedRating(review.rating);
    setComment(review.comment || "");
    setReviewImages([]);
    // Set existing images as previews (these are URLs, not files)
    setImagePreviews(review.images || []);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
      return;
    }

    try {
      await deleteReview(reviewId);
      toast.success("Đã xóa đánh giá thành công!");
      // If current page becomes empty, go to previous page
      if (reviews.length === 1 && page > 1) {
        await loadReviews(page - 1);
      } else {
        await loadReviews(page);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Không thể xóa đánh giá. Vui lòng thử lại.";
      toast.error(errorMessage);
    }
  };

  const handleSubmitReview = async () => {
    if (!authenticated) {
      toast.error("Vui lòng đăng nhập để đánh giá sản phẩm");
      navigate("/login?redirect=" + encodeURIComponent(window.location.pathname));
      return;
    }

    if (selectedRating === 0) {
      toast.error("Vui lòng chọn số sao đánh giá");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingReview) {
        // Update existing review
        // Separate existing image URLs (not blob URLs) from new file uploads (blob URLs)
        const existingImageUrls: string[] = [];
        const newImageFiles: File[] = [];
        
        imagePreviews.forEach((preview, index) => {
          if (preview.startsWith('blob:')) {
            // This is a new file upload
            const fileIndex = imagePreviews.slice(0, index).filter(p => p.startsWith('blob:')).length;
            if (reviewImages[fileIndex]) {
              newImageFiles.push(reviewImages[fileIndex]);
            }
          } else {
            // This is an existing image URL
            existingImageUrls.push(preview);
          }
        });
        
        await updateReview(editingReview.id, {
          rating: selectedRating,
          comment: comment.trim() || undefined,
          images: newImageFiles.length > 0 ? newImageFiles : undefined,
          existingImages: existingImageUrls.length > 0 ? existingImageUrls : undefined,
        });
        toast.success("Đã cập nhật đánh giá thành công!");
      } else {
        // Create new review
        await createReview({
          productId: product.id,
          rating: selectedRating,
          comment: comment.trim() || undefined,
          images: reviewImages.length > 0 ? reviewImages : undefined,
        });
        toast.success("Đánh giá của bạn đã được gửi thành công!");
      }
      
      resetForm();
      
      // Reload reviews to show the new/updated one
      await loadReviews(1);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Không thể gửi đánh giá. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
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
          {/* Review Form */}
          {authenticated && (
            <div className="rounded-[24px] border border-[#E5E7EB] bg-white/90 p-6 shadow-sm">
              {!showReviewForm ? (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="w-full rounded-[14px] border-2 border-dashed border-[#D4AF37] bg-[#D4AF37]/5 px-6 py-4 text-[15px] font-semibold text-[#1A1A1A] transition hover:bg-[#D4AF37]/10"
                >
                  Viết đánh giá của bạn
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[16px] font-semibold text-[#1A1A1A]">
                      {editingReview ? "Chỉnh sửa đánh giá" : "Viết đánh giá"}
                    </p>
                    <button
                      onClick={resetForm}
                      className="text-[14px] text-[#6B7280] hover:text-[#1A1A1A]"
                    >
                      Hủy
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="mb-2 text-[14px] font-medium text-[#1A1A1A]">Đánh giá của bạn *</p>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setSelectedRating(rating)}
                            onMouseEnter={() => setHoveredRating(rating)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`h-8 w-8 ${
                                rating <= (hoveredRating || selectedRating)
                                  ? "fill-[#D4AF37] text-[#D4AF37]"
                                  : "text-[#E5E7EB]"
                              }`}
                              strokeWidth={rating <= (hoveredRating || selectedRating) ? 0 : 1.5}
                            />
                          </button>
                        ))}
                        {selectedRating > 0 && (
                          <span className="ml-2 text-[14px] text-[#6B7280]">
                            {selectedRating === 5 && "Tuyệt vời"}
                            {selectedRating === 4 && "Tốt"}
                            {selectedRating === 3 && "Bình thường"}
                            {selectedRating === 2 && "Không hài lòng"}
                            {selectedRating === 1 && "Rất không hài lòng"}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="review-comment" className="mb-2 block text-[14px] font-medium text-[#1A1A1A]">
                        Nhận xét (tùy chọn)
                      </label>
                      <textarea
                        id="review-comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                        rows={4}
                        className="w-full rounded-[12px] border border-[#E5E7EB] px-4 py-3 text-[14px] text-[#1A1A1A] placeholder-[#9CA3AF] focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
                      />
                    </div>

                    <div>
                      <label htmlFor="review-images" className="mb-2 block text-[14px] font-medium text-[#1A1A1A]">
                        Thêm ảnh (tối đa 5 ảnh)
                      </label>
                      <div className="space-y-3">
                        <label
                          htmlFor="review-images"
                          className="flex cursor-pointer items-center justify-center gap-2 rounded-[12px] border-2 border-dashed border-[#E5E7EB] bg-[#FAFAFA] px-4 py-3 text-[14px] text-[#6B7280] transition hover:border-[#D4AF37] hover:bg-[#D4AF37]/5"
                        >
                          <ImageIcon className="h-5 w-5" />
                          <span>Chọn ảnh</span>
                        </label>
                        <input
                          id="review-images"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="hidden"
                          disabled={reviewImages.length + imagePreviews.length >= 5}
                        />
                        
                        {imagePreviews.length > 0 && (
                          <div className="grid grid-cols-5 gap-2">
                            {imagePreviews.map((preview, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={preview}
                                  alt={`Preview ${index + 1}`}
                                  className="h-20 w-20 rounded-lg object-cover border border-[#E5E7EB]"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(index)}
                                  className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={handleSubmitReview}
                      disabled={isSubmitting || selectedRating === 0}
                      className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#1A1A1A] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#2A2A2A] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          <span>Đang gửi...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Gửi đánh giá</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {!authenticated && (
            <div className="rounded-[24px] border border-[#E5E7EB] bg-white/90 p-4 text-center shadow-sm">
              <p className="text-[14px] text-[#6B7280]">
                <button
                  onClick={() => navigate("/login?redirect=" + encodeURIComponent(window.location.pathname))}
                  className="font-semibold text-[#D4AF37] hover:underline"
                >
                  Đăng nhập
                </button>
                {" "}để viết đánh giá
              </p>
            </div>
          )}

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

          {reviews.map((review) => {
            const isOwnReview = review.user.id === user?.id;
            return (
              <article key={review.id} className="rounded-[24px] border border-[#E5E7EB] bg-white/90 p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37] text-[15px] font-semibold text-white">
                    {getInitials(review.user.name)}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
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
                      {isOwnReview && authenticated && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditReview(review)}
                            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[12px] text-[#6B7280] transition hover:bg-[#F3F4F6] hover:text-[#1A1A1A]"
                            title="Chỉnh sửa"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                            <span>Sửa</span>
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[12px] text-red-600 transition hover:bg-red-50"
                            title="Xóa"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Xóa</span>
                          </button>
                        </div>
                      )}
                    </div>
                    {review.comment && (
                      <p className="text-[15px] leading-relaxed text-[#4B5563]">
                        {review.comment}
                      </p>
                    )}
                    {review.images && review.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-2">
                        {review.images.map((image, idx) => (
                          <img
                            key={idx}
                            src={image}
                            alt={`Review image ${idx + 1}`}
                            className="h-24 w-full rounded-lg object-cover border border-[#E5E7EB] cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => window.open(image, '_blank')}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1 || isLoading}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#6B7280] transition hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 hover:text-[#D4AF37] disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Trang trước"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isLoading}
                      className={`h-10 w-10 rounded-lg border text-[14px] font-medium transition ${
                        page === pageNum
                          ? "border-[#D4AF37] bg-[#D4AF37] text-white"
                          : "border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 hover:text-[#D4AF37]"
                      } disabled:opacity-30 disabled:cursor-not-allowed`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages || isLoading}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#6B7280] transition hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 hover:text-[#D4AF37] disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Trang sau"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              
              <span className="ml-4 text-[13px] text-[#6B7280]">
                Trang {page} / {totalPages}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

