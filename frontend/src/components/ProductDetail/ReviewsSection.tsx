import { Star } from "lucide-react";
import type { ProductDetail } from "@/types/products";

interface ReviewsSectionProps {
  product: ProductDetail;
}

// Mock review data - Replace with actual API call later
const mockReviews = [
  {
    id: 1,
    userName: "John D.",
    date: "2024-01-15",
    rating: 5,
    comment: "Excellent quality! The fabric is soft and the fit is perfect. Highly recommend!",
    avatar: null,
  },
  {
    id: 2,
    userName: "Sarah M.",
    date: "2024-01-10",
    rating: 4,
    comment: "Great product, but the sizing runs a bit small. Order one size up.",
    avatar: null,
  },
  {
    id: 3,
    userName: "Michael T.",
    date: "2024-01-05",
    rating: 5,
    comment: "Love it! The design is elegant and the material is premium. Worth every penny.",
    avatar: null,
  },
];

// Calculate rating distribution
const calculateRatingDistribution = (reviews: typeof mockReviews) => {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((review) => {
    distribution[review.rating as keyof typeof distribution]++;
  });
  return distribution;
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function ReviewsSection({ product }: ReviewsSectionProps) {
  const reviews = mockReviews; // TODO: Replace with actual API call
  const ratingDistribution = calculateRatingDistribution(reviews);
  const totalReviews = reviews.length;
  const maxCount = Math.max(...Object.values(ratingDistribution));

  return (
    <div id="reviews" className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2
            className="text-black mb-2"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "32px",
              fontWeight: 600,
            }}
          >
            Customer Reviews
          </h2>
          <div className="flex items-center gap-4">
            <div
              className="text-black"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "48px",
                fontWeight: 700,
              }}
            >
              {product.rating.toFixed(1)}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={`w-5 h-5 ${
                      idx < Math.floor(product.rating) ? "fill-current" : "fill-none"
                    }`}
                    style={{
                      color: idx < Math.floor(product.rating) ? "#C2A26F" : "#E0E0E0",
                      strokeWidth: idx < Math.floor(product.rating) ? 0 : 2,
                    }}
                  />
                ))}
              </div>
              <span
                className="text-[#757575] text-sm"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Based on {product.reviewCount} reviews
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Distribution Bar Chart */}
      <div className="mb-12 space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingDistribution[rating as keyof typeof ratingDistribution];
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

          return (
            <div key={rating} className="flex items-center gap-4">
              <div className="flex items-center gap-1 w-20">
                <span
                  className="text-[#757575] text-sm"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {rating}
                </span>
                <Star className="w-4 h-4 fill-current" style={{ color: "#C2A26F" }} />
              </div>
              <div className="flex-1 h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C2A26F] transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span
                className="text-[#757575] text-sm w-12 text-right"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {count}
              </span>
            </div>
          );
        })}
      </div>

      {/* Review List */}
      <div className="space-y-6 mb-8">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-[#EEEEEE] pb-6 last:border-b-0">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div
                className="w-12 h-12 rounded-full bg-[#C2A26F] flex items-center justify-center text-white font-medium flex-shrink-0"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "16px",
                }}
              >
                {getInitials(review.userName)}
              </div>

              {/* Review Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-4 h-4 ${
                          idx < review.rating ? "fill-current" : "fill-none"
                        }`}
                        style={{
                          color: idx < review.rating ? "#C2A26F" : "#E0E0E0",
                          strokeWidth: idx < review.rating ? 0 : 2,
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="text-black font-medium"
                    style={{ fontFamily: "'Poppins', sans-serif", fontSize: "14px" }}
                  >
                    {review.userName}
                  </span>
                  <span
                    className="text-[#757575]"
                    style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13px" }}
                  >
                    {new Date(review.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p
                  className="text-[#757575] leading-relaxed"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "14px",
                    lineHeight: "1.6",
                  }}
                >
                  {review.comment}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Write Review Button */}
      <div className="text-center">
        <button
          className="border-2 border-black bg-white text-black uppercase tracking-widest py-4 px-8 text-sm font-medium hover:bg-black hover:text-white transition-all duration-300"
          style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: "1.5px" }}
        >
          WRITE A REVIEW
        </button>
      </div>
    </div>
  );
}

