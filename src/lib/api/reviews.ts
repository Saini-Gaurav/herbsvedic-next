import { apiFetch } from "@/lib/apiClient";
import { Review, ReviewsPage, MyReviewStatus } from "@/types/review";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function getReviews(productId: string, page = 1, limit = 5): Promise<ReviewsPage> {
  return apiFetch(`${API_URL}/products/${productId}/reviews?page=${page}&limit=${limit}`);
}

export function getMyReviewStatus(productId: string): Promise<MyReviewStatus> {
  return apiFetch(`${API_URL}/products/${productId}/reviews/mine`);
}

export function submitReview(
  productId: string,
  rating: number,
  comment: string
): Promise<{ review: Review }> {
  return apiFetch(`${API_URL}/products/${productId}/reviews`, {
    method: "POST",
    body: JSON.stringify({ rating, comment }),
  });
}

export function deleteReview(productId: string, reviewId: string): Promise<{ message: string }> {
  return apiFetch(`${API_URL}/products/${productId}/reviews/${reviewId}`, {
    method: "DELETE",
  });
}