export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsPage {
  reviews: Review[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MyReviewStatus {
  hasPurchased: boolean;
  review: Review | null;
}