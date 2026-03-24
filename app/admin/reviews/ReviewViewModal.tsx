"use client";
import React from "react";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  User,
  Star,
  Quote,
  Clock,
  Hash,
} from "lucide-react";

export type Review = {
  id: string;
  enrollmentId: string;
  studentName: string;
  courseTitle: string;
  rating: number;
  comment: string;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  review: Review | null;
  onClose: () => void;
};

export default function ReviewViewModal({ review, onClose }: Props) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
            className={`${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-100 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Modal
      open={!!review}
      onClose={onClose}
      title="Review Details"
      panelClassName="max-w-xl"
    >
      {review && (
        <div className="space-y-6">
          {/* Header with Course & Student Info */}
          <div className="flex flex-col gap-4 border-b border-[color:var(--color-neutral-100)] pb-6">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-[color:var(--color-neutral-900)] leading-tight">
                  {review.courseTitle}
                </h3>
                <div className="flex items-center gap-2 text-[color:var(--color-neutral-500)]">
                  <User size={14} />
                  <span className="text-sm font-medium">
                    {review.studentName}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge
                  variant="outline"
                  className={
                    review.isPublished
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-gray-50 text-gray-700 border-gray-200"
                  }
                >
                  <span className="inline-flex items-center gap-1.5">
                    {review.isPublished ? (
                      <CheckCircle2 size={12} />
                    ) : (
                      <XCircle size={12} />
                    )}
                    {review.isPublished ? "Published" : "Unpublished"}
                  </span>
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    review.isFeatured
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-gray-50 text-gray-700 border-gray-200"
                  }
                >
                  <span className="inline-flex items-center gap-1.5">
                    {review.isFeatured ? (
                      <CheckCircle2 size={12} />
                    ) : (
                      <XCircle size={12} />
                    )}
                    {review.isFeatured ? "Featured" : "Not featured"}
                  </span>
                </Badge>
              </div>
            </div>
          </div>

          {/* Rating & Comment */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {renderStars(review.rating)}
                <span className="text-sm font-medium text-[color:var(--color-neutral-900)]">
                  {review.rating}.0
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[color:var(--color-neutral-500)]">
                <Calendar size={14} />
                <span>{review.createdAt}</span>
              </div>
            </div>

            <div className="relative rounded-xl bg-[color:var(--color-neutral-50)] p-5">
              <Quote
                size={20}
                className="absolute top-4 left-4 text-[color:var(--color-neutral-300)] opacity-50"
              />
              <p className="relative z-10 pt-2 pl-6 text-sm leading-relaxed text-[color:var(--color-neutral-700)] italic">
                {review.comment || (
                  <span className="text-[color:var(--color-neutral-400)] not-italic">
                    No comment provided.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Metadata Footer */}
          <div className="rounded-lg border border-[color:var(--color-neutral-100)] bg-white p-3">
            <div className="flex items-center justify-between text-xs text-[color:var(--color-neutral-500)]">
              <div className="flex items-center gap-1.5">
                <Hash size={12} />
                <span className="font-mono">{review.id}</span>
              </div>
              {review.updatedAt && (
                <div className="flex items-center gap-1.5">
                  <Clock size={12} />
                  <span>Updated: {review.updatedAt}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
