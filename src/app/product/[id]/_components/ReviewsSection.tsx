"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/apiClient";
import { getReviews, getMyReviewStatus, submitReview, deleteReview } from "@/lib/api/reviews";
import { Review } from "@/types/review";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const PAGE_SIZE = 5;

function StarRow({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <FaStar key={n} size={size} className={n <= value ? "text-turmeric" : "text-bark/15"} />
      ))}
    </span>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <FaStar size={24} className={n <= shown ? "text-turmeric" : "text-bark/15"} />
        </button>
      ))}
    </div>
  );
}

export default function ReviewsSection({ productId }: { productId: string }) {
  const { user } = useAuth();
  const router = useRouter();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [hasPurchased, setHasPurchased] = useState(false);
  const [myReview, setMyReview] = useState<Review | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadReviews = useCallback(
    async (pageToLoad: number, replace: boolean) => {
      try {
        const data = await getReviews(productId, pageToLoad, PAGE_SIZE);
        setReviews((prev) => (replace ? data.reviews : [...prev, ...data.reviews]));
        setPage(data.page);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      } catch {
        toast.error("Couldn't load reviews");
      } finally {
        setIsLoading(false);
      }
    },
    [productId]
  );

  useEffect(() => {
    loadReviews(1, true);
  }, [loadReviews]);

  useEffect(() => {
    if (!user) {
      setHasPurchased(false);
      setMyReview(null);
      return;
    }
    getMyReviewStatus(productId)
      .then((status) => {
        setHasPurchased(status.hasPurchased);
        setMyReview(status.review);
        setRating(status.review?.rating ?? 0);
        setComment(status.review?.comment ?? "");
      })
      .catch(() => {});
  }, [user, productId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1) {
      toast.error("Pick a star rating first");
      return;
    }
    if (comment.trim().length < 3) {
      toast.error("Write a few words about the product");
      return;
    }

    setIsSubmitting(true);
    try {
      const { review } = await submitReview(productId, rating, comment.trim());
      setMyReview(review);
      toast.success(myReview ? "Review updated" : "Thanks for your review!");
      await loadReviews(1, true);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't submit your review");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleConfirmDelete() {
    if (!myReview) return;
    setIsDeleting(true);
    try {
      await deleteReview(productId, myReview.id);
      setMyReview(null);
      setRating(0);
      setComment("");
      setShowDelete(false);
      toast.success("Review deleted");
      await loadReviews(1, true);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't delete your review");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <section className="mt-20 border-t border-bark/10 pt-12">
      <h2 className="font-display text-2xl text-bark mb-6">
        Customer Reviews {total > 0 && <span className="text-bark/40 text-lg">({total})</span>}
      </h2>

      {/* Write / edit box */}
      <div className="mb-10">
        {!user ? (
          <p className="font-body text-sm text-bark/60">
            <Link href="/login" className="text-canopy underline underline-offset-4">Log in</Link> to review this product.
          </p>
        ) : !hasPurchased ? (
          <p className="font-body text-sm text-bark/60">
            You can review this product once you&apos;ve ordered it.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white/60 border border-bark/10 rounded-2xl p-5 flex flex-col gap-4 max-w-2xl">
            <p className="font-body text-sm font-semibold text-bark">
              {myReview ? "Your review" : "Write a review"}
            </p>
            <StarPicker value={rating} onChange={setRating} />
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you think of it?"
              className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition resize-none"
            />
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-canopy text-sand font-body tracking-wide uppercase text-sm rounded-full hover:bg-ink transition disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : myReview ? "Update review" : "Submit review"}
              </button>
              {myReview && (
                <button
                  type="button"
                  onClick={() => setShowDelete(true)}
                  className="font-body text-sm text-red-700/70 hover:text-red-700 transition"
                >
                  Delete
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      {/* List */}
      {isLoading ? (
        <p className="font-body text-sm text-bark/50">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="font-body text-sm text-bark/50">No reviews yet.</p>
      ) : (
        <div className="flex flex-col gap-4 max-w-2xl">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-bark/10 pb-4">
              <div className="flex items-center justify-between gap-3 mb-1">
                <div className="flex items-center gap-3">
                  <StarRow value={review.rating} />
                  <span className="font-body text-sm text-bark font-medium">
                    {review.userName}
                    {user?.userId === review.userId && (
                      <span className="ml-2 text-xs text-canopy">(you)</span>
                    )}
                  </span>
                </div>
                <span className="font-body text-xs text-bark/40">
                  {new Date(review.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="font-body text-sm text-bark/70 leading-relaxed whitespace-pre-wrap">
                {review.comment}
              </p>
            </div>
          ))}

          {page < totalPages && (
            <button
              onClick={() => loadReviews(page + 1, false)}
              className="self-start font-body text-sm text-canopy hover:text-ink transition"
            >
              Load more reviews
            </button>
          )}
        </div>
      )}

      <ConfirmDialog
        isOpen={showDelete}
        title="Delete your review?"
        message="Your review will be removed and the product's rating will be recalculated."
        isConfirming={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDelete(false)}
      />
    </section>
  );
}