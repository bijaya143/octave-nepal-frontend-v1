"use client";

import { useState, useEffect, useCallback } from "react";
import type { ApiSuccessResponse } from "@/lib/api/types";
import {
  adminStudentService,
  adminInstructorService,
  adminCourseService,
  adminEnrollmentService,
  adminEnrollmentPaymentService,
  adminReviewService,
  PaymentStatus,
  EnrollmentStatus,
  PublishStatusType,
  type AdminStudentOutput,
  type AdminInstructorOutput,
  type AdminCourseOutput,
  type AdminEnrollmentOutput,
  type AdminEnrollmentPaymentOutput,
  type AdminReviewOutput,
} from "@/lib/services/admin";

export interface DateRangeFilter {
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
}

export interface DashboardStats {
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  publishedCourses: number;
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  totalRevenue: number;
  totalReviews: number;
  averageRating: number;
}

export interface RecentEnrollment {
  id: string;
  studentName: string;
  courseName: string;
  status: string;
  amount: number;
  createdAt: Date;
}

export interface RecentPayment {
  id: string;
  enrollmentPaymentId: string;
  studentName: string;
  amount: number;
  status: string;
  paymentMethod: string;
  paidAt: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentEnrollments: RecentEnrollment[];
  recentPayments: RecentPayment[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

const defaultStats: DashboardStats = {
  totalStudents: 0,
  totalInstructors: 0,
  totalCourses: 0,
  publishedCourses: 0,
  totalEnrollments: 0,
  activeEnrollments: 0,
  completedEnrollments: 0,
  totalRevenue: 0,
  totalReviews: 0,
  averageRating: 0,
};

/** Safely unwrap a settled promise result — returns data only on success */
function unwrap<T>(result: PromiseSettledResult<unknown>): T | null {
  if (result.status !== "fulfilled") return null;
  const val = result.value as ApiSuccessResponse<T> | { success: false };
  if (!val.success) return null;
  return (val as ApiSuccessResponse<T>).data;
}

export function useAdminDashboard(dateRange?: DateRangeFilter): DashboardData {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [recentEnrollments, setRecentEnrollments] = useState<RecentEnrollment[]>([]);
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const startDate = dateRange?.startDate;
  const endDate = dateRange?.endDate;

  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      setIsLoading(true);
      setError(null);

      // Build common date filter — only include if set
      const dateFilter = {
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
      };

      try {
        const results = await Promise.allSettled([
          adminStudentService.list({ page: 1, limit: 1, ...dateFilter }),                                     // 0
          adminInstructorService.list({ page: 1, limit: 1, ...dateFilter }),                                  // 1
          adminCourseService.list({ page: 1, limit: 1, ...dateFilter }),                                      // 2
          adminCourseService.list({ page: 1, limit: 1, status: PublishStatusType.PUBLISHED, ...dateFilter }), // 3
          adminEnrollmentService.list({ page: 1, limit: 1, ...dateFilter }),                                  // 4
          adminEnrollmentService.list({ page: 1, limit: 1, status: EnrollmentStatus.ACTIVE, ...dateFilter }), // 5
          adminEnrollmentService.list({ page: 1, limit: 1, status: EnrollmentStatus.COMPLETED, ...dateFilter }), // 6
          adminEnrollmentPaymentService.list({ page: 1, limit: 1000, status: PaymentStatus.PAID, ...dateFilter }), // 7 — large batch to sum revenue
          adminReviewService.list({ page: 1, limit: 10, ...dateFilter }),                                     // 8
          adminEnrollmentService.list({ page: 1, limit: 5, ...dateFilter }),                                  // 9
          adminEnrollmentPaymentService.list({ page: 1, limit: 5, ...dateFilter }),                           // 10
        ]);

        if (cancelled) return;

        const students    = unwrap<AdminStudentOutput>(results[0]);
        const instructors = unwrap<AdminInstructorOutput>(results[1]);
        const courses     = unwrap<AdminCourseOutput>(results[2]);
        const published   = unwrap<AdminCourseOutput>(results[3]);
        const enrollments = unwrap<AdminEnrollmentOutput>(results[4]);
        const active      = unwrap<AdminEnrollmentOutput>(results[5]);
        const completed   = unwrap<AdminEnrollmentOutput>(results[6]);
        const payments    = unwrap<AdminEnrollmentPaymentOutput>(results[7]);
        const reviews     = unwrap<AdminReviewOutput>(results[8]);
        const recentEnr   = unwrap<AdminEnrollmentOutput>(results[9]);
        const recentPmt   = unwrap<AdminEnrollmentPaymentOutput>(results[10]);

        // Calculate average rating from fetched reviews page
        const reviewList = reviews?.data ?? [];
        const avgRating  = reviewList.length > 0
          ? reviewList.reduce((sum, r) => sum + r.rating, 0) / reviewList.length
          : 0;

        // Sum revenue from all fetched paid payment records
        const totalRevenue = (payments?.data ?? []).reduce((sum, p) => sum + (p.amount ?? 0), 0);

        setStats({
          totalStudents:        students?.meta.total ?? 0,
          totalInstructors:     instructors?.meta.total ?? 0,
          totalCourses:         courses?.meta.total ?? 0,
          publishedCourses:     published?.meta.total ?? 0,
          totalEnrollments:     enrollments?.meta.total ?? 0,
          activeEnrollments:    active?.meta.total ?? 0,
          completedEnrollments: completed?.meta.total ?? 0,
          totalRevenue,
          totalReviews:         reviews?.meta.total ?? 0,
          averageRating:        avgRating,
        });

        // Map recent enrollments
        setRecentEnrollments(
          (recentEnr?.data ?? []).map((e) => ({
            id:          e.id,
            studentName: e.student
              ? `${e.student.firstName ?? ""} ${e.student.lastName ?? ""}`.trim()
              : "Unknown Student",
            courseName: e.course?.title ?? "Unknown Course",
            status:     e.status ?? "ACTIVE",
            amount:     e.amount ?? 0,
            createdAt:  e.createdAt,
          })),
        );

        // Map recent payments
        setRecentPayments(
          (recentPmt?.data ?? []).map((p) => ({
            id:                  p.id,
            enrollmentPaymentId: p.enrollmentPaymentId,
            studentName:         p.enrollment?.student
              ? `${p.enrollment.student.firstName ?? ""} ${p.enrollment.student.lastName ?? ""}`.trim()
              : "Unknown Student",
            amount:        p.amount ?? 0,
            status:        p.status ?? "PAID",
            paymentMethod: p.paymentMethod ?? "OTHER",
            paidAt:        p.paidAt,
          })),
        );
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load dashboard data");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey, startDate, endDate]);

  return { stats, recentEnrollments, recentPayments, isLoading, error, refresh };
}
