export interface ReviewUserSummary {
  id: number | null;
  name: string;
}

export interface ReviewItem {
  id: number;
  rating: number;
  comment: string | null;
  images: string[];
  createdAt: string;
  user: ReviewUserSummary;
}

export interface ReviewRatingStats {
  averageRating: number;
  counts: Record<number, number>;
}

export interface ProductReviewsResponse {
  reviews: ReviewItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  ratingStats: ReviewRatingStats;
}
