"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Loader2, XCircle, Star, MessageSquare } from "lucide-react";
import { studentReviewService } from "@/lib/services/student";
import { AdminReview } from "@/lib/services/admin/types";

type Props = {
  enrollmentId: string | null;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function StudentCourseReviewModal({
  enrollmentId,
  onClose,
  onSuccess,
}: Props) {
  const [review, setReview] = useState<AdminReview | null>(null);

  // Form states
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  // Process states
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enrollmentId) {
      setReview(null);
      setRating(0);
      setComment("");
      setError(null);
      return;
    }

    const fetchReview = async () => {
      setIsFetching(true);
      setError(null);
      try {
        const res = await studentReviewService.getByEnrollmentId(enrollmentId);
        if (res.success && res.data) {
          setReview(res.data);
          setRating(res.data.rating || 0);
          setComment(res.data.comment || "");
        } else {
          setReview(null);
          setRating(0);
          setComment("");
        }
      } catch (err: any) {
        setReview(null);
        setRating(0);
        setComment("");
      } finally {
        setIsFetching(false);
      }
    };

    fetchReview();
  }, [enrollmentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollmentId) return;

    if (rating === 0) {
      setError("Please provide a star rating to submit your review.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (review && review.id) {
        // Wait, if it exists but id is somehow missing it could break, but if setReview was called it has an id.
        const res = await studentReviewService.updateByEnrollmentId(enrollmentId, {
          rating,
          comment,
        });

        if (res.success) {
          onSuccess?.();
          onClose();
        } else {
          setError(
            (res as any).message ||
              (res as any).error?.message ||
              "Failed to update review"
          );
        }
      } else {
        const res = await studentReviewService.create({
          enrollmentId,
          rating,
          comment,
        });

        if (res.success) {
          onSuccess?.();
          onClose();
        } else {
          setError(
            (res as any).message ||
              (res as any).error?.message ||
              "Failed to submit review"
          );
        }
      }
    } catch (err) {
      setError("An unexpected error occurred while saving the review.");
    } finally {
      setIsSaving(false);
    }
  };

  const isEditMode = !!review;

  return (
    <Modal
      open={!!enrollmentId}
      onClose={onClose}
      title={isEditMode ? "Update Course Review" : "Rate this Course"}
      panelClassName="max-w-md"
    >
      {isFetching ? (
        <div className="space-y-6">
          {/* Rating Skeleton */}
          <div className="flex flex-col items-center justify-center py-6">
            <div className="h-4 w-56 bg-[color:var(--color-neutral-200)] rounded-md animate-pulse mb-6" />
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 w-10 bg-[color:var(--color-neutral-200)]/60 rounded-full animate-pulse" />
              ))}
            </div>
          </div>

          {/* Textarea Skeleton */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-32 bg-[color:var(--color-neutral-200)] rounded-md animate-pulse" />
              <div className="h-3 w-10 bg-[color:var(--color-neutral-200)]/60 rounded-md animate-pulse" />
            </div>
            <div className="h-[120px] w-full bg-[color:var(--color-neutral-50)]/50 border border-[color:var(--color-neutral-200)] rounded-lg animate-pulse" />
          </div>

          {/* Buttons Skeleton */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[color:var(--color-neutral-200)] mt-6">
            <div className="h-9 w-20 bg-[color:var(--color-neutral-200)] rounded-md animate-pulse" />
            <div className="h-9 w-28 bg-[color:var(--color-neutral-300)] rounded-md animate-pulse" />
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-[color:var(--color-error-50)] p-4 text-sm text-[color:var(--color-error-700)] flex items-start gap-3">
              <XCircle size={18} className="mt-0.5 shrink-0" />
              <div>{error}</div>
            </div>
          )}

          <div className="flex flex-col items-center justify-center py-6">
            <div className="text-sm font-medium text-[color:var(--color-neutral-700)] mb-4">
              How would you rate your experience?
            </div>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110 active:scale-95"
                >
                  <Star
                    size={36}
                    strokeWidth={1.5}
                    className={`transition-colors duration-200 ${(hoveredRating || rating) >= star ? "fill-amber-400 text-amber-500" : "fill-transparent text-[color:var(--color-neutral-300)]"}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[color:var(--color-neutral-700)] flex items-center gap-2">
                <MessageSquare size={16} />
                Feedback (Optional)
              </label>
              <span className={`text-xs font-medium ${comment.length >= 500 ? "text-[color:var(--color-error-500)]" : "text-[color:var(--color-neutral-500)]"}`}>
                {comment.length} / 500
              </span>
            </div>
            <textarea
              maxLength={500}
              className="min-h-[120px] w-full resize-none rounded-lg border border-[color:var(--color-neutral-300)] bg-white px-4 py-3 text-sm text-[color:var(--color-neutral-900)] shadow-sm placeholder:text-[color:var(--color-neutral-400)] focus:border-[color:var(--color-primary-500)] focus:outline-none focus:ring-1 focus:ring-[color:var(--color-primary-500)] transition-colors"
              placeholder="What did you like about this course? Are there areas for improvement?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[color:var(--color-neutral-200)] mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving || rating === 0}
            >
              <div className="flex items-center gap-2">
                {isSaving && <Loader2 size={16} className="animate-spin" />}
                <span>{isEditMode ? "Save Changes" : "Submit Review"}</span>
              </div>
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
