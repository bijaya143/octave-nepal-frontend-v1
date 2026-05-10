/**
 * Admin service types
 */

import { PaginationInput, PaginationOutput } from "../common-types";
import type { Student } from "../student";
import type { Instructor } from "../instructor";

export type { Student, Instructor };

/**
 * Admin information returned from authentication
 */
export interface Admin {
  id: string;
  email: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phoneNumber?: string;
  phoneCountryCode?: string;
  readableTemporaryPassword?: string;
  roleType: string | "SUPER_ADMIN" | "ADMIN" | "MODERATOR";
  userType: string | "ADMIN";
  isActive: boolean;
  isVerified: boolean;
  isSuspended: boolean;
  profilePictureKey?: string;
  bio?: string;
  createdBy?: Admin;
  address?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: unknown;
}

/**
 * Login credentials
 */
export interface AdminLoginCredentials {
  email: string;
  password: string;
}

/**
 * Login response data
 */
export interface AdminLoginResponseData {
  accessToken: string;
  refreshToken: string;
}

/**
 * Common response data
 */
export interface AdminCommonResponseData {
  message: string;
}

/**
 * Forgot Password input
 */
export interface AdminForgotPasswordInput {
  email: string;
}

/**
 * Reset Password input
 */
export interface AdminResetPasswordInput {
  email: string;
  token: string;
  password: string;
}

/**
 * Update password input
 */
export interface AdminUpdatePasswordInput {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

/**
 * Student list API response
 */
export interface AdminStudentOutput {
  data: Student[];
  meta: PaginationOutput;
}

/**
 * Student list query parameters
 */
export interface AdminStudentFilterInput extends PaginationInput {
  startDate?: string;
  endDate?: string;
  keyword?: string;
  isActive?: boolean;
  isVerified?: boolean;
  isSuspended?: boolean;
  maxCourseCount?: number;
  minCourseCount?: number;
}

/**
 * Instructor list API response
 */
export interface AdminInstructorOutput {
  data: Instructor[];
  meta: PaginationOutput;
}

/**
 * Instructor list query parameters
 */
export interface AdminInstructorFilterInput extends PaginationInput {
  startDate?: string;
  endDate?: string;
  keyword?: string;
  isActive?: boolean;
  isVerified?: boolean;
  isSuspended?: boolean;
  isFeatured?: boolean;
  maxCourseCount?: number;
  minCourseCount?: number;
}

/**
 * Admin list API response
 */
export interface AdminListOutput {
  data: Admin[];
  meta: PaginationOutput;
}

/**
 * Admin list query parameters
 */
export interface AdminListFilterInput extends PaginationInput {
  startDate?: string;
  endDate?: string;
  keyword?: string;
  isActive?: boolean;
  isVerified?: boolean;
  isSuspended?: boolean;
  roleType?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageKey: string;
  isPublished: boolean;
  popularityCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Tag list API response
 */
export interface AdminTagOutput {
  data: Tag[];
  meta: PaginationOutput;
}

/**
 * Tag list query parameters
 */
export interface AdminTagFilterInput extends PaginationInput {
  keyword?: string;
  isPublished?: boolean;
}

export interface CategoryToTag {
  id: string;
  tag: Tag;
  category: Category;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageKey: string;
  iconKey?: string;
  isPublished: boolean;
  popularityCount: number;
  studentCount: number;
  courseCount: number;
  tagCount: number;
  categoryToTags: CategoryToTag[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminCategoryOutput {
  data: Category[];
  meta: PaginationOutput;
}

export interface AdminCategoryFilterInput extends PaginationInput {
  keyword?: string;
  isPublished?: boolean;
}

export enum CourseLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
}

export enum CourseLanguage {
  ENGLISH = "ENGLISH",
  NEPALI = "NEPALI",
}

export enum DurationUnit {
  HOUR = "HOUR",
  MINUTE = "MINUTE",
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
  YEAR = "YEAR",
}

export enum CourseSyllabusSectionItemType {
  LESSON = "LESSON",
  QUIZ = "QUIZ",
  ASSIGNMENT = "ASSIGNMENT",
  GROUP = "GROUP",
  RESOURCE = "RESOURCE",
  CUSTOM = "CUSTOM",
}

export enum CourseType {
  FREE = "FREE",
  PAID = "PAID",
}

export enum CourseDiscountType {
  FLAT = "FLAT",
  PERCENTAGE = "PERCENTAGE",
}

export enum DayType {
  SUNDAY = "SUNDAY",
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
}

export enum TimeDesignator {
  AM = "AM",
  PM = "PM",
}

export enum TimezoneType {
  UTC = "UTC",
  ASIA_KATHMANDU = "Asia/Kathmandu",
}

export enum PublishStatusType {
  UNDER_REVIEW = "UNDER_REVIEW",
  PUBLISHED = "PUBLISHED",
  UNPUBLISHED = "UNPUBLISHED",
}

export enum CourseMeetingPlatform {
  GOOGLE_MEET = "GOOGLE_MEET",
  ZOOM = "ZOOM",
  MICROSOFT_TEAMS = "MICROSOFT_TEAMS",
  WEBEX = "WEBEX",
  OTHER = "OTHER",
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  instructor: Instructor;
  category: Category;
  level: CourseLevel;
  language: CourseLanguage;
  shortDescription?: string;
  longDescription?: string;
  prerequisite?: string;
  learningOutcome?: string;
  duration: number;
  durationUnit: DurationUnit;
  lessonCount?: number;
  syllabus?: {
    sections: {
      title: string;
      items: {
        type: CourseSyllabusSectionItemType;
        title: string;
        description: string;
        isPublished: boolean;
        duration: number;
        durationUnit: DurationUnit;
      }[];
    }[];
  };
  courseType: CourseType;
  markedPrice: number;
  isDiscountApplied?: boolean;
  discountType?: CourseDiscountType;
  discountValue?: number;
  sellingPrice?: number;
  isSalePeriodApplied?: boolean;
  salePeriodDateRange?: {
    startDate: string;
    endDate: string;
  };
  isTaxIncluded?: boolean;
  startDate: string;
  endDate: string;
  fromDay: DayType;
  toDay: DayType;
  startTime: string;
  startTimeDesignator: TimeDesignator;
  endTime: string;
  endTimeDesignator: TimeDesignator;
  timezone?: TimezoneType;

  seatCapacityCount: number;
  availableSeatCount: number;
  occupiedSeatCount: number;
  lastEnrollmentDate: string;
  isWaitlistApplied: boolean;
  waitlistCapacityCount: number;
  status: PublishStatusType;
  isFeatured: boolean;
  isReviewAllowed: boolean;

  thumbnailKey: string;
  additionalResourceLinks: {
    link: string;
    label?: string;
  }[];

  meetingLinks: {
    platform: CourseMeetingPlatform;
    link: string;
    isPrimary: boolean;
  }[];

  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];

  createdBy?: Admin;

  reviewCount: number;
  averageReviewRatingCount: number;
  studentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminCourseOutput {
  data: Course[];
  meta: PaginationOutput;
}

export interface AdminCourseFilterInput extends PaginationInput {
  keyword?: string;
  maxCoursePrice?: number;
  minCoursePrice?: number;
  categoryId?: string;
  instructorId?: string;
  level?: CourseLevel;
  status?: PublishStatusType;
  startDate?: string;
  endDate?: string;
  isSalePeriodApplied?: boolean;
  isFeatured?: boolean;
  beforeEnrollmentDate?: string;
}

export enum CreationMethod {
  AUTOMATIC = "AUTOMATIC",
  MANUAL = "MANUAL",
}

export enum EnrollmentStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface Enrollment {
  id: string;
  student: Student | null;
  course: Course | null;
  creationMethod?: CreationMethod;
  createdBy: Admin | null;
  status?: EnrollmentStatus;
  paymentStatus?: PaymentStatus;
  progressPercentage?: number;
  amount: number;
  isCertificateCreated?: boolean;
  completedAt?: string | null;
  isReviewCreated?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminEnrollmentOutput {
  data: Enrollment[];
  meta: PaginationOutput;
}

export interface AdminEnrollmentFilterInput extends PaginationInput {
  keyword?: string;
  status?: EnrollmentStatus;
  maxProgressPercentage?: number;
  minProgressPercentage?: number;
  courseId?: string;
  studentId?: string;
  instructorId?: string;
  creationMethod?: CreationMethod;
  startDate?: string;
  endDate?: string;
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum PaymentMethod {
  QR = "QR",
  BANK_TRANSFER = "BANK_TRANSFER",
  ONLINE_BANKING = "ONLINE_BANKING",
  CARD = "CARD",
  WALLET = "WALLET",
  OTHER = "OTHER",
}

export interface AdminEnrollmentPayment {
  id: string;
  enrollmentPaymentId: string;
  enrollment?: Enrollment | null;
  amount: number;
  paidAt: string; // ISO date string
  paidAtTimezone?: TimezoneType;
  transactionId?: string | null;
  receiptKeys?: string[] | null;
  remarks?: string | null;
  status?: PaymentStatus | string;
  paymentMethod: PaymentMethod | string;
  creationMethod?: CreationMethod;
  createdBy?: Admin | null;
  details?: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminEnrollmentPaymentOutput {
  data: AdminEnrollmentPayment[];
  meta: PaginationOutput;
}

export interface AdminEnrollmentPaymentFilterInput extends PaginationInput {
  keyword?: string;
  maxAmountPaid?: number;
  minAmountPaid?: number;
  creationMethod?: CreationMethod;
  paymentMethod?: PaymentMethod;
  status?: PaymentStatus;
  studentId?: string;
  startDate?: string;
  endDate?: string;
}

export interface AdminEnrollmentCertificate {
  id: string;
  title: string;
  enrollmentCertificateId: string;
  enrollment?: Enrollment | null;
  certifiedAt?: Date;
  certificateKey?: string; // certificates/cert-1234567890.pdf S3 object key
  isDownloaded?: boolean;
  isPublished?: boolean;
  creationMethod?: CreationMethod;
  createdBy?: Admin | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminEnrollmentCertificateOutput {
  data: AdminEnrollmentCertificate[];
  meta: PaginationOutput;
}

export interface AdminEnrollmentCertificateFilterInput extends PaginationInput {
  keyword?: string;
  enrollmentId?: string;
  studentId?: string;
  courseId?: string;
  startDate?: string;
  endDate?: string;
}

export interface AdminReview {
  id: string;
  enrollment?: Enrollment | null;
  student?: Student | null;
  course?: Course | null;
  rating: number;
  comment: string | null;
  isPublished?: boolean;
  isFeatured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminReviewOutput {
  data: AdminReview[];
  meta: PaginationOutput;
}

export interface AdminReviewFilterInput extends PaginationInput {
  keyword?: string;
  studentId?: string;
  courseId?: string;
  isPublished?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface Testimonial {
  id: string;
  fullName: string;
  profilePictureKey: string;
  rating: number;
  message: string | null;
  isPublished?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminTestimonialOutput {
  data: Testimonial[];
  meta: PaginationOutput;
}

export interface AdminTestimonialFilterInput extends PaginationInput {
  isPublished?: boolean;
  startDate?: string;
  endDate?: string;
  keyword?: string;
  rating?: number;
}

export enum NewsletterSubscriberSourceType {
  HOMEPAGE = "HOMEPAGE",
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  isSubscribed?: boolean;
  unsubscribedAt?: Date;
  source?: NewsletterSubscriberSourceType;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminNewsletterSubscriberOutput {
  data: NewsletterSubscriber[];
  meta: PaginationOutput;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminContactMessageOutput {
  data: ContactMessage[];
  meta: PaginationOutput;
}

export interface AdminContactMessageFilterInput extends PaginationInput {
  startDate?: string;
  endDate?: string;
}

export interface ManagementTeam {
  id: string;
  name: string;
  email?: string;
  position: string;
  imageKey?: string;
  displayOrder: number;
  isPublished?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminManagementTeamOutput {
  data: ManagementTeam[];
  meta: PaginationOutput;
}

export interface AdminManagementTeamFilterInput extends PaginationInput {
  isPublished?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageKey?: string;
  isPublished?: boolean;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminBlogCategoryOutput {
  data: BlogCategory[];
  meta: PaginationOutput;
}

export interface AdminBlogCategoryFilterInput extends PaginationInput {
  keyword?: string;
  isPublished?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  author?: string;
  authorImageKey?: string;
  blogCategory?: BlogCategory | null;
  content: string;
  estimatedReadTime?: number;
  imageKey?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  excerpt?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminBlogPostOutput {
  data: BlogPost[];
  meta: PaginationOutput;
}
export interface AdminBlogPostFilterInput extends PaginationInput {
  keyword?: string;
  isPublished?: boolean;
  blogCategoryId?: string;
  startDate?: string;
  endDate?: string;
}
