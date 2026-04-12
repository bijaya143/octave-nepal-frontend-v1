"use client";
import { X } from "lucide-react";
import React from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Image from "next/image";
import SyllabusBuilder from "./SyllabusBuilder";
import DateRangePicker from "@/components/ui/DateRangePicker";
import Avatar from "@/components/ui/Avatar";
import { adminInstructorService } from "@/lib/services/admin/instructor";
import { adminCategoryService } from "@/lib/services/admin/category";

import {
  CourseLevel,
  CourseLanguage,
  DurationUnit,
  CourseType,
  CourseDiscountType,
  DayType,
  TimeDesignator,
  TimezoneType,
  PublishStatusType,
  Category,
  Instructor,
  CourseMeetingPlatform,
} from "@/lib/services/admin/types";

type SyllabusSection = import("./SyllabusBuilder").SyllabusSection;

function formatLabel(str: string) {
  if (str === "AM" || str === "PM") return str;
  return str
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export type CourseFormValues = {
  title: string;
  subtitle: string;
  instructorId: string;
  categoryId: string;
  level: CourseLevel | string;
  language: CourseLanguage | string;

  // Content
  shortDescription: string;
  longDescription: string;
  prerequisite: string;
  learningOutcome: string;
  duration: number | "";
  durationUnit: DurationUnit | string;
  lessonCount: number | "";

  // Syllabus
  syllabus: SyllabusSection[];

  // Price
  courseType: CourseType | string;
  markedPrice: number | "";
  isDiscountApplied: boolean;
  discountType: CourseDiscountType | string;
  discountValue: number | "";
  sellingPrice: number | "";
  isSalePeriodApplied: boolean;
  saleStartDate: string;
  saleEndDate: string;
  isTaxIncluded: boolean;

  // Schedule
  startDate: string;
  endDate: string;
  fromDay: DayType | string;
  toDay: DayType | string;
  startTime: string;
  startTimeDesignator: TimeDesignator | string;
  endTime: string;
  endTimeDesignator: TimeDesignator | string;
  timezone: TimezoneType | string;

  // Seats
  seatCapacityCount: number | "";
  availableSeatCount: number | "";
  occupiedSeatCount: number | "";
  lastEnrollmentDate: string;
  isWaitlistApplied: boolean;
  waitlistCapacityCount: number | "";

  // Status
  status: PublishStatusType | string;
  isFeatured: boolean;
  isReviewAllowed: boolean;

  // Media
  thumbnail: File | null;
  additionalResourceLinks: Array<{ label: string; link: string; id: string }>;

  // Meeting
  meetingLinks: Array<{
    id: string;
    platform: CourseMeetingPlatform;
    link: string;
    isPrimary: boolean;
  }>;

  // SEO
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
};

type CourseFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CourseFormValues) => void;
  title?: string;
  mode?: "create" | "edit";
  initialValues?: Partial<CourseFormValues>;
  initialThumbnailUrl?: string;
  availableCategories?: Category[];
  availableInstructors?: Instructor[];
  isLoading?: boolean;
};

const DEFAULTS: CourseFormValues = {
  title: "",
  subtitle: "",
  instructorId: "",
  categoryId: "",
  level: CourseLevel.BEGINNER,
  language: CourseLanguage.ENGLISH,
  shortDescription: "",
  longDescription: "",
  prerequisite: "",
  learningOutcome: "",
  duration: "",
  durationUnit: DurationUnit.HOUR,
  lessonCount: "",
  syllabus: [],
  courseType: CourseType.PAID,
  markedPrice: "",
  isDiscountApplied: false,
  discountType: CourseDiscountType.PERCENTAGE,
  discountValue: "",
  sellingPrice: "",
  isSalePeriodApplied: false,
  saleStartDate: "",
  saleEndDate: "",
  isTaxIncluded: true,
  startDate: "",
  endDate: "",
  fromDay: DayType.MONDAY,
  toDay: DayType.FRIDAY,
  startTime: "",
  startTimeDesignator: TimeDesignator.AM,
  endTime: "",
  endTimeDesignator: TimeDesignator.PM,
  timezone: TimezoneType.ASIA_KATHMANDU,
  seatCapacityCount: "",
  availableSeatCount: "",
  occupiedSeatCount: "",
  lastEnrollmentDate: "",
  isWaitlistApplied: false,
  waitlistCapacityCount: "",
  status: PublishStatusType.UNDER_REVIEW,
  isFeatured: false,
  isReviewAllowed: true,
  thumbnail: null,
  additionalResourceLinks: [],
  meetingLinks: [],
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
};

const INSTRUCTOR_PAGE_SIZE = 10;
const CATEGORY_PAGE_SIZE = 10;

export default function CourseFormModal({
  open,
  onClose,
  onSubmit,
  title,
  mode = "create",
  initialValues,
  initialThumbnailUrl = "",
  availableCategories = [],
  availableInstructors = [],
  isLoading,
}: CourseFormModalProps) {
  const [activeTab, setActiveTab] = React.useState<
    | "details"
    | "content"
    | "syllabus"
    | "pricing"
    | "schedule"
    | "seats"
    | "status"
    | "media"
    | "meeting"
    | "seo"
  >("details");
  const [values, setValues] = React.useState<CourseFormValues>(DEFAULTS);
  const [previewUrl, setPreviewUrl] = React.useState(initialThumbnailUrl || "");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Instructor searchable dropdown state
  const [isInstructorMenuOpen, setIsInstructorMenuOpen] = React.useState(false);
  const instructorMenuRef = React.useRef<HTMLDivElement>(null);
  const [instructorList, setInstructorList] = React.useState<Instructor[]>([]);
  const [instructorQuery, setInstructorQuery] = React.useState("");
  const [instructorPage, setInstructorPage] = React.useState(1);
  const [hasMoreInstructors, setHasMoreInstructors] = React.useState(true);
  const [isLoadingInstructors, setIsLoadingInstructors] = React.useState(false);

  const selectedInstructor = React.useMemo(
    () =>
      availableInstructors.find((i) => i.id === values.instructorId) ||
      instructorList.find((i) => i.id === values.instructorId) ||
      null,
    [availableInstructors, instructorList, values.instructorId]
  );

  const fetchInstructors = React.useCallback(
    async (page: number, search: string, reset = false) => {
      try {
        setIsLoadingInstructors(true);
        const resp = await adminInstructorService.list({
          page,
          limit: INSTRUCTOR_PAGE_SIZE,
          keyword: search || undefined,
        });
        if (resp.success) {
          setInstructorList((prev) =>
            reset ? resp.data.data : [...prev, ...resp.data.data]
          );
          const totalPages = Math.ceil(
            resp.data.meta.total / resp.data.meta.limit
          );
          setHasMoreInstructors(resp.data.meta.page < totalPages);
        }
      } catch (err) {
        console.error("Failed to fetch instructors", err);
      } finally {
        setIsLoadingInstructors(false);
      }
    },
    []
  );

  React.useEffect(() => {
    if (isInstructorMenuOpen) {
      setInstructorPage(1);
      fetchInstructors(1, instructorQuery, true);
    }
  }, [isInstructorMenuOpen, instructorQuery, fetchInstructors]);

  const handleInstructorScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMoreInstructors &&
      !isLoadingInstructors
    ) {
      const next = instructorPage + 1;
      setInstructorPage(next);
      fetchInstructors(next, instructorQuery);
    }
  };

  // Category dropdown state
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = React.useState(false);
  const categoryMenuRef = React.useRef<HTMLDivElement>(null);
  const [categoryList, setCategoryList] = React.useState<Category[]>([]);
  const [categoryQuery, setCategoryQuery] = React.useState("");
  const [categoryPage, setCategoryPage] = React.useState(1);
  const [hasMoreCategories, setHasMoreCategories] = React.useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = React.useState(false);

  const selectedCategory = React.useMemo(
    () =>
      availableCategories.find((c) => c.id === values.categoryId) ||
      categoryList.find((c) => c.id === values.categoryId) ||
      null,
    [availableCategories, categoryList, values.categoryId]
  );

  const fetchCategories = React.useCallback(
    async (page: number, search: string, reset = false) => {
      try {
        setIsLoadingCategories(true);
        const resp = await adminCategoryService.list({
          page,
          limit: CATEGORY_PAGE_SIZE,
          keyword: search || undefined,
          isPublished: true,
        });
        if (resp.success) {
          setCategoryList((prev) =>
            reset ? resp.data.data : [...prev, ...resp.data.data]
          );
          const totalPages = Math.ceil(
            resp.data.meta.total / resp.data.meta.limit
          );
          setHasMoreCategories(resp.data.meta.page < totalPages);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setIsLoadingCategories(false);
      }
    },
    []
  );

  React.useEffect(() => {
    if (isCategoryMenuOpen) {
      setCategoryPage(1);
      fetchCategories(1, categoryQuery, true);
    }
  }, [isCategoryMenuOpen, categoryQuery, fetchCategories]);

  const handleCategoryScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMoreCategories &&
      !isLoadingCategories
    ) {
      const next = categoryPage + 1;
      setCategoryPage(next);
      fetchCategories(next, categoryQuery);
    }
  };

  // Meeting platform dropdown (restored original logic style)
  const [isMeetingPlatformMenuOpen, setIsMeetingPlatformMenuOpen] =
    React.useState(false);
  const meetingPlatformMenuRef = React.useRef<HTMLDivElement>(null);

  const meetingPlatforms = React.useMemo(
    () =>
      [
        {
          value: CourseMeetingPlatform.GOOGLE_MEET,
          label: "Google Meet",
          icon: "/images/meeting/meet.png",
        },
        {
          value: CourseMeetingPlatform.ZOOM,
          label: "Zoom",
          icon: "/images/meeting/zoom.png",
        },
        {
          value: CourseMeetingPlatform.MICROSOFT_TEAMS,
          label: "Microsoft Teams",
          icon: "/images/meeting/teams.png",
        },
        {
          value: CourseMeetingPlatform.WEBEX,
          label: "Webex",
          icon: "/images/meeting/video-call.png", // Fallback icon
        },
        {
          value: CourseMeetingPlatform.OTHER,
          label: "Custom",
          icon: "/images/meeting/video-call.png",
        },
      ] as const,
    []
  );
  const [meetingTypeInput, setMeetingTypeInput] =
    React.useState<CourseMeetingPlatform>(meetingPlatforms[0].value);
  const [meetingUrlInput, setMeetingUrlInput] = React.useState("");

  const tabs = React.useMemo(
    () =>
      [
        { key: "details", label: "Details" },
        { key: "content", label: "Content" },
        { key: "syllabus", label: "Syllabus" },
        { key: "pricing", label: "Pricing" },
        { key: "schedule", label: "Schedule" },
        { key: "seats", label: "Seats" },
        { key: "status", label: "Status" },
        { key: "media", label: "Media" },
        { key: "meeting", label: "Meeting" },
        { key: "seo", label: "SEO" },
      ] as const,
    []
  );

  React.useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        isInstructorMenuOpen &&
        instructorMenuRef.current &&
        !instructorMenuRef.current.contains(target)
      )
        setIsInstructorMenuOpen(false);
      if (
        isCategoryMenuOpen &&
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(target)
      )
        setIsCategoryMenuOpen(false);
      if (
        isMeetingPlatformMenuOpen &&
        meetingPlatformMenuRef.current &&
        !meetingPlatformMenuRef.current.contains(target)
      )
        setIsMeetingPlatformMenuOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsInstructorMenuOpen(false);
        setIsCategoryMenuOpen(false);
        setIsMeetingPlatformMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDocClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isInstructorMenuOpen, isCategoryMenuOpen, isMeetingPlatformMenuOpen]);

  function generateId(): string {
    return Math.random().toString(36).slice(2, 10);
  }

  function getMeetingPlatformLogo(platform: string): React.ReactNode {
    const plat = meetingPlatforms.find((p) => p.value === platform);
    if (!plat) return null;
    return (
      <img
        src={plat.icon}
        alt=""
        className="h-[18px] w-[18px] object-contain shrink-0"
        aria-hidden
      />
    );
  }

  // Reset tab when modal opens
  React.useEffect(() => {
    if (open) {
      setActiveTab("details");
    }
  }, [open]);

  // Initialize values when modal opens or initialValues change
  React.useEffect(() => {
    if (open) {
      setValues({ ...DEFAULTS, ...initialValues });
      setPreviewUrl(initialThumbnailUrl || "");
      setMeetingTypeInput(meetingPlatforms[0].value);
      setMeetingUrlInput("");
    }
  }, [initialValues, initialThumbnailUrl, open, meetingPlatforms]);

  React.useEffect(
    () => () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl]
  );

  function handleChange<K extends keyof CourseFormValues>(
    key: K,
    value: CourseFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }
  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleChange("title", e.target.value);
  }
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    handleChange("thumbnail", f);
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(f ? URL.createObjectURL(f) : "");
  }
  function clearImage() {
    handleChange("thumbnail", null);
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }
  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
  }

  const [mediaLabelInput, setMediaLabelInput] = React.useState("");
  const [mediaUrlInput, setMediaUrlInput] = React.useState("");

  function addMediaLink() {
    const url = mediaUrlInput.trim();
    const label = mediaLabelInput.trim();
    if (!url) return;
    const next = [
      ...values.additionalResourceLinks,
      { id: generateId(), label, link: url },
    ];
    handleChange("additionalResourceLinks", next);
    setMediaLabelInput("");
    setMediaUrlInput("");
  }
  function removeMediaLink(id: string) {
    handleChange(
      "additionalResourceLinks",
      values.additionalResourceLinks.filter((l) => l.id !== id)
    );
  }

  function addMeetingLink() {
    const url = meetingUrlInput.trim();
    if (!url || !meetingTypeInput) return;
    const next = [
      ...values.meetingLinks,
      {
        id: generateId(),
        platform: meetingTypeInput as CourseMeetingPlatform,
        link: url,
        isPrimary: values.meetingLinks.length === 0,
      },
    ];
    handleChange("meetingLinks", next);
    setMeetingUrlInput("");
  }
  function removeMeetingLink(id: string) {
    const remaining = values.meetingLinks.filter((l) => l.id !== id);
    const removedWasPrimary = values.meetingLinks.find(
      (l) => l.id === id
    )?.isPrimary;
    if (removedWasPrimary && remaining.length > 0) {
      remaining[0].isPrimary = true;
    }
    handleChange("meetingLinks", remaining);
  }
  function setPrimaryMeetingLink(id: string) {
    handleChange(
      "meetingLinks",
      values.meetingLinks.map((l) => ({ ...l, isPrimary: l.id === id }))
    );
  }

  function handleSeatCapacityChange(raw: string) {
    if (raw === "") {
      handleChange("seatCapacityCount", "");
      return;
    }
    const capacity = Math.max(0, Number(raw));
    let occupied =
      typeof values.occupiedSeatCount === "number"
        ? values.occupiedSeatCount
        : 0;
    if (occupied > capacity) occupied = capacity;
    const available = capacity - occupied;
    handleChange("seatCapacityCount", capacity);
    handleChange("occupiedSeatCount", occupied);
    handleChange("availableSeatCount", available);
  }

  function handleSeatsOccupiedChange(raw: string) {
    if (raw === "") {
      handleChange("occupiedSeatCount", "");
      return;
    }
    const capacity =
      typeof values.seatCapacityCount === "number"
        ? values.seatCapacityCount
        : 0;
    const occupied = Math.max(0, Math.min(capacity, Number(raw)));
    const available = Math.max(0, capacity - occupied);
    handleChange("occupiedSeatCount", occupied);
    if (typeof values.seatCapacityCount === "number")
      handleChange("availableSeatCount", available);
  }

  function handleSeatsAvailableChange(raw: string) {
    if (raw === "") {
      handleChange("availableSeatCount", "");
      return;
    }
    const capacity =
      typeof values.seatCapacityCount === "number"
        ? values.seatCapacityCount
        : 0;
    const available = Math.max(0, Math.min(capacity, Number(raw)));
    const occupied = Math.max(0, capacity - available);
    handleChange("availableSeatCount", available);
    if (typeof values.seatCapacityCount === "number")
      handleChange("occupiedSeatCount", occupied);
  }

  const basePrice = Number(values.markedPrice) || 0;
  const computedSalePrice = React.useMemo(() => {
    if (values.courseType === CourseType.FREE) return 0;
    if (values.discountType === CourseDiscountType.PERCENTAGE) {
      const p = Math.max(0, Math.min(100, Number(values.discountValue) || 0));
      return Math.max(0, Math.round(basePrice * (1 - p / 100)));
    }
    const amt = Math.max(0, Number(values.discountValue) || 0);
    return Math.max(0, basePrice - amt);
  }, [values.courseType, values.discountType, values.discountValue, basePrice]);

  const savingsAmount = Math.max(0, basePrice - computedSalePrice);
  const savingsPercent =
    basePrice > 0 ? Math.round((savingsAmount / basePrice) * 100) : 0;

  React.useEffect(() => {
    if (values.sellingPrice !== computedSalePrice) {
      handleChange("sellingPrice", computedSalePrice);
    }
  }, [computedSalePrice, values.sellingPrice]);

  const salePeriodMaxDate = React.useMemo(() => {
    const now = new Date();
    const y = now.getUTCFullYear() + 50;
    return `${y}-12-31`;
  }, []);

  const timezoneOptions = Object.values(TimezoneType);
  const dayOptions = Object.values(DayType);
  const durationUnitOptions = Object.values(DurationUnit);
  const courseLevelOptions = Object.values(CourseLevel);
  const languageOptions = Object.values(CourseLanguage);
  const timeDesignatorOptions = Object.values(TimeDesignator);

  const disabled =
    !values.title ||
    !values.categoryId ||
    !values.instructorId ||
    (values.courseType === CourseType.PAID && !values.markedPrice);

  const currentTabIndexRaw = tabs.findIndex((t) => t.key === activeTab);
  const currentTabIndex = currentTabIndexRaw < 0 ? 0 : currentTabIndexRaw;
  const isFirstTab = currentTabIndex <= 0;
  const isLastTab = currentTabIndex >= tabs.length - 1;
  function goNextTab() {
    if (!isLastTab) {
      const next = tabs[currentTabIndex + 1]?.key || tabs[tabs.length - 1].key;
      setActiveTab(next as typeof activeTab);
    }
  }
  function goPrevTab() {
    if (!isFirstTab) {
      const prev = tabs[currentTabIndex - 1]?.key || tabs[0].key;
      setActiveTab(prev as typeof activeTab);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title ?? (mode === "edit" ? "Edit Course" : "Create Course")}
      panelClassName="max-w-3xl md:max-w-4xl lg:max-w-5xl max-h-[90vh]"
    >
      <form
        onSubmit={handleFormSubmit}
        noValidate
        className="space-y-5 text-sm"
      >
        <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key)}
                className={
                  t.key === activeTab
                    ? "w-full text-center px-3 py-1.5 rounded-md border border-[color:var(--color-primary-200)] text-[color:var(--color-primary-700)] bg-[color:var(--color-primary-50)]"
                    : "w-full text-center px-3 py-1.5 rounded-md border border-[color:var(--color-neutral-200)] text-[color:var(--color-neutral-700)] hover:bg-[color:var(--color-neutral-50)]"
                }
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "details" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <Input
                  label="Title"
                  value={values.title}
                  onChange={handleTitleChange}
                  placeholder="Course title"
                  required
                />
              </div>
              <div>
                <Input
                  label="Subtitle"
                  value={values.subtitle}
                  onChange={(e) => handleChange("subtitle", e.target.value)}
                  placeholder="A short subtitle (optional)"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[color:var(--foreground)]">
                  Instructor
                </label>
                <div className="relative mt-2" ref={instructorMenuRef}>
                  <button
                    type="button"
                    className="h-11 w-full rounded-lg bg-white border pr-9 px-3 text-left text-[color:var(--foreground)] border-[color:var(--color-neutral-200)] focus:border-[color:var(--color-primary-400)] shadow-xs focus:shadow-sm transition-all"
                    onClick={() => setIsInstructorMenuOpen((v) => !v)}
                  >
                    <span className="block truncate text-[color:var(--color-neutral-700)]">
                      {selectedInstructor
                        ? selectedInstructor.firstName +
                          " " +
                          (selectedInstructor.middleName
                            ? selectedInstructor.middleName + " "
                            : "") +
                          selectedInstructor.lastName
                        : "Select instructor"}
                    </span>
                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[color:var(--color-neutral-500)]"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {isInstructorMenuOpen && (
                    <div
                      className="absolute z-50 mt-1 w-full rounded-lg border border-[color:var(--color-neutral-200)] bg-white shadow-md max-h-56 overflow-y-auto scroll-elegant"
                      onScroll={handleInstructorScroll}
                    >
                      <div className="p-2 border-b border-[color:var(--color-neutral-200)] sticky top-0 bg-white z-10">
                        <div className="relative">
                          <Input
                            value={instructorQuery}
                            onChange={(e) => setInstructorQuery(e.target.value)}
                            placeholder="Search instructor"
                          />
                          {instructorQuery && (
                            <button
                              type="button"
                              aria-label="Clear search"
                              title="Clear search"
                              onClick={() => setInstructorQuery("")}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--color-neutral-500)] hover:text-[color:var(--color-neutral-700)]"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <ul className="py-1">
                        {instructorList.length === 0 &&
                        !isLoadingInstructors ? (
                          <li className="px-3 py-2 text-[12px] text-[color:var(--color-neutral-500)] text-center">
                            No instructors found
                          </li>
                        ) : (
                          instructorList.map((ins) => {
                            const selected = ins.id === values.instructorId;
                            return (
                              <li
                                key={ins.id}
                                className="px-3 py-2 hover:bg-[color:var(--color-neutral-50)]"
                              >
                                <button
                                  type="button"
                                  className={`w-full flex items-center gap-2 text-left text-sm ${
                                    selected
                                      ? "text-[color:var(--color-primary-800)] font-medium"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    handleChange("instructorId", ins.id);
                                    setIsInstructorMenuOpen(false);
                                  }}
                                >
                                  <Avatar
                                    src={
                                      ins.profilePictureKey
                                        ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${ins.profilePictureKey}`
                                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                            [
                                              ins.firstName,
                                              ins.middleName,
                                              ins.lastName,
                                              ins.email,
                                            ]
                                              .filter(Boolean)
                                              .join(" ")
                                          )}&background=random`
                                    }
                                    alt={ins.firstName || "Instructor"}
                                    className="h-6 w-6 rounded-full object-cover border border-[color:var(--color-neutral-200)]"
                                    width={24}
                                    height={24}
                                  />
                                  <span>
                                    {ins.firstName ||
                                    ins.middleName ||
                                    ins.lastName
                                      ? `${ins.firstName ?? ""} ${
                                          ins.middleName
                                            ? ins.middleName + " "
                                            : ""
                                        }${ins.lastName ?? ""}`.trim()
                                      : ins.email}
                                  </span>
                                </button>
                              </li>
                            );
                          })
                        )}
                        {isLoadingInstructors && (
                          <li className="px-3 py-2 text-[12px] text-center text-[color:var(--color-neutral-500)]">
                            Loading...
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[color:var(--foreground)]">
                  Category
                </label>
                <div className="relative mt-2" ref={categoryMenuRef}>
                  <button
                    type="button"
                    className="h-11 w-full rounded-lg bg-white border pr-9 px-3 text-left text-[color:var(--foreground)] border-[color:var(--color-neutral-200)] focus:border-[color:var(--color-primary-400)] shadow-xs focus:shadow-sm transition-all"
                    onClick={() => setIsCategoryMenuOpen((v) => !v)}
                  >
                    <span className="block truncate text-[color:var(--color-neutral-700)]">
                      {selectedCategory
                        ? selectedCategory.name
                        : "Select a category"}
                    </span>
                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[color:var(--color-neutral-500)]"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {isCategoryMenuOpen && (
                    <div
                      className="absolute z-50 mt-1 w-full rounded-lg border border-[color:var(--color-neutral-200)] bg-white shadow-md max-h-56 overflow-y-auto scroll-elegant"
                      onScroll={handleCategoryScroll}
                    >
                      <div className="p-2 border-b border-[color:var(--color-neutral-200)] sticky top-0 bg-white z-10">
                        <div className="relative">
                          <Input
                            value={categoryQuery}
                            onChange={(e) => setCategoryQuery(e.target.value)}
                            placeholder="Search category"
                          />
                          {categoryQuery && (
                            <button
                              type="button"
                              aria-label="Clear search"
                              title="Clear search"
                              onClick={() => setCategoryQuery("")}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--color-neutral-500)] hover:text-[color:var(--color-neutral-700)]"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <ul className="py-1">
                        {categoryList.length === 0 && !isLoadingCategories ? (
                          <li className="px-3 py-2 text-[12px] text-[color:var(--color-neutral-500)] text-center">
                            No categories found
                          </li>
                        ) : (
                          categoryList.map((c) => (
                            <li
                              key={c.id}
                              className="px-3 py-2 hover:bg-[color:var(--color-neutral-50)]"
                            >
                              <button
                                type="button"
                                className={`w-full text-left text-sm ${
                                  values.categoryId === c.id
                                    ? "text-[color:var(--color-primary-800)] font-medium"
                                    : ""
                                }`}
                                onClick={() => {
                                  handleChange("categoryId", c.id);
                                  setIsCategoryMenuOpen(false);
                                }}
                              >
                                {c.name}
                              </button>
                            </li>
                          ))
                        )}
                        {isLoadingCategories && (
                          <li className="px-3 py-2 text-[12px] text-center text-[color:var(--color-neutral-500)]">
                            Loading...
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Select
                  label="Level"
                  value={values.level}
                  onChange={(e) =>
                    handleChange("level", e.target.value as CourseLevel)
                  }
                >
                  {courseLevelOptions.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {formatLabel(lvl)}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Select
                  label="Language"
                  value={values.language}
                  onChange={(e) =>
                    handleChange("language", e.target.value as CourseLanguage)
                  }
                >
                  {languageOptions.map((lang) => (
                    <option key={lang} value={lang}>
                      {formatLabel(lang)}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        )}

        {activeTab === "content" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <Textarea
                  label="Short description"
                  value={values.shortDescription}
                  onChange={(e) =>
                    handleChange("shortDescription", e.target.value)
                  }
                  placeholder="Short description"
                  rows={2}
                />
              </div>
              <div className="sm:col-span-2">
                <Textarea
                  label="Full description"
                  value={values.longDescription}
                  onChange={(e) =>
                    handleChange("longDescription", e.target.value)
                  }
                  placeholder="Full course description"
                  rows={4}
                />
              </div>
              <div>
                <Input
                  label="Duration"
                  type="number"
                  min={0}
                  step="1"
                  value={values.duration}
                  onChange={(e) =>
                    handleChange("duration", Number(e.target.value))
                  }
                  placeholder="0"
                />
              </div>
              <div>
                <Select
                  label="Duration Unit"
                  value={values.durationUnit}
                  onChange={(e) =>
                    handleChange("durationUnit", e.target.value as DurationUnit)
                  }
                >
                  {durationUnitOptions.map((unit) => (
                    <option key={unit} value={unit}>
                      {formatLabel(unit)}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Input
                  label="Lessons count"
                  type="number"
                  min={0}
                  step="1"
                  value={values.lessonCount}
                  onChange={(e) =>
                    handleChange("lessonCount", Number(e.target.value))
                  }
                  placeholder="0"
                />
              </div>
              <div className="sm:col-span-2">
                <Textarea
                  label="Prerequisites"
                  value={values.prerequisite}
                  onChange={(e) => handleChange("prerequisite", e.target.value)}
                  placeholder="What should learners know before starting?"
                  rows={3}
                />
              </div>
              <div className="sm:col-span-2">
                <Textarea
                  label="Learning outcomes"
                  value={values.learningOutcome}
                  onChange={(e) =>
                    handleChange("learningOutcome", e.target.value)
                  }
                  placeholder="What will learners achieve?"
                  rows={3}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "syllabus" && (
          <SyllabusBuilder
            value={values.syllabus}
            onChange={(next) => handleChange("syllabus", next)}
          />
        )}

        {activeTab === "media" && (
          <div className="space-y-3">
            <div className="rounded-lg border border-dashed border-[color:var(--color-neutral-300)] bg-[color:var(--color-neutral-50)] p-3">
              <label
                htmlFor="course-thumb-input"
                className="block text-xs text-[color:var(--color-neutral-600)] mb-2"
              >
                Thumbnail
              </label>
              <div className="flex items-center gap-3">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-20 w-32 rounded-md object-cover ring-1 ring-[color:var(--color-neutral-200)]"
                  />
                ) : (
                  <div className="h-20 w-32 flex items-center justify-center rounded-md bg-white text-[color:var(--color-neutral-400)] ring-1 ring-[color:var(--color-neutral-200)]">
                    No image
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-xs text-[color:var(--color-neutral-600)]">
                    Upload a thumbnail image for this course.
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="course-thumb-input"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Browse
                    </Button>
                    {previewUrl && (
                      <Button
                        type="button"
                        variant="secondary"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={clearImage}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <p className="mt-1 text-[10px] text-[color:var(--color-neutral-500)]">
                    PNG or JPG. Max ~2MB.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-xs font-medium text-[color:var(--color-neutral-700)]">
              Links
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Input
                  label="Label (optional)"
                  value={mediaLabelInput}
                  onChange={(e) => setMediaLabelInput(e.target.value)}
                  placeholder="e.g., PDF Guide"
                />
              </div>
              <div>
                <Input
                  label="URL"
                  value={mediaUrlInput}
                  onChange={(e) => setMediaUrlInput(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="sm:col-span-2">
                <Button
                  type="button"
                  onClick={addMediaLink}
                  disabled={!mediaUrlInput.trim()}
                >
                  Add link
                </Button>
              </div>
              <div className="sm:col-span-2">
                {values.additionalResourceLinks.length === 0 ? (
                  <p className="text-[11px] text-[color:var(--color-neutral-600)]">
                    No links added yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {values.additionalResourceLinks.map((l) => (
                      <div
                        key={l.id}
                        className="flex items-start justify-between gap-3 rounded-md border border-[color:var(--color-neutral-200)] bg-white px-3 py-2"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-[color:var(--color-neutral-800)] truncate">
                            {l.label || l.link}
                          </div>
                          <div className="text-[11px] text-[color:var(--color-neutral-600)] truncate">
                            {l.link}
                          </div>
                        </div>
                        <div className="shrink-0">
                          <Button
                            type="button"
                            variant="secondary"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => removeMediaLink(l.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "pricing" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="inline-flex items-center gap-2 text-xs text-[color:var(--color-neutral-700)]">
                  <input
                    type="checkbox"
                    checked={values.courseType === CourseType.FREE}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      handleChange(
                        "courseType",
                        isChecked ? CourseType.FREE : CourseType.PAID
                      );
                    }}
                  />
                  <span>Free course</span>
                </label>
                <label className="ml-4 inline-flex items-center gap-2 text-xs text-[color:var(--color-neutral-700)]">
                  <input
                    type="checkbox"
                    checked={values.courseType === CourseType.PAID}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      handleChange(
                        "courseType",
                        isChecked ? CourseType.PAID : CourseType.FREE
                      );
                    }}
                  />
                  <span>Paid course</span>
                </label>
              </div>
              <div>
                <Input
                  label="Price (Rs)"
                  type="number"
                  min={0}
                  step="1"
                  value={values.markedPrice}
                  onChange={(e) => {
                    const v = e.target.value;
                    handleChange("markedPrice", v === "" ? "" : Number(v));
                  }}
                  placeholder="0"
                  disabled={values.courseType === CourseType.FREE}
                />
              </div>
              <div>
                <Select
                  label="Discount type"
                  value={values.discountType}
                  onChange={(e) =>
                    handleChange(
                      "discountType",
                      e.target.value as CourseDiscountType
                    )
                  }
                >
                  <option value={CourseDiscountType.PERCENTAGE}>
                    Percent (%)
                  </option>
                  <option value={CourseDiscountType.FLAT}>
                    Fixed amount (Rs)
                  </option>
                </Select>
              </div>
              <div>
                <Input
                  label="Discount value"
                  type="number"
                  min={0}
                  step="1"
                  value={values.discountValue}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "") {
                      handleChange("discountValue", "");
                      handleChange("isDiscountApplied", false);
                    } else {
                      const v = Number(raw);
                      handleChange("discountValue", v);
                      handleChange("isDiscountApplied", v > 0);
                    }
                  }}
                  placeholder="0"
                  disabled={values.courseType === CourseType.FREE}
                />
              </div>
              <div className="sm:col-span-2">
                <div className="rounded-md border border-[color:var(--color-neutral-200)] bg-[color:var(--color-neutral-50)] px-3 py-2 flex items-center justify-between">
                  <div className="text-xs text-[color:var(--color-neutral-700)]">
                    Calculated sale price
                  </div>
                  <div className="text-sm font-medium">
                    Rs {computedSalePrice.toLocaleString()}
                  </div>
                </div>
                {values.courseType !== CourseType.FREE && savingsAmount > 0 && (
                  <div className="mt-1 text-[11px] text-[color:var(--color-neutral-600)]">
                    You save Rs {savingsAmount.toLocaleString()} (
                    {savingsPercent}%)
                  </div>
                )}
              </div>
              <div className="sm:col-span-2">
                <DateRangePicker
                  label="Sale period"
                  value={{
                    from: values.saleStartDate || null,
                    to: values.saleEndDate || null,
                  }}
                  onChange={(r) => {
                    handleChange("saleStartDate", r.from || "");
                    handleChange("saleEndDate", r.to || "");
                    handleChange("isSalePeriodApplied", !!(r.from && r.to));
                  }}
                  max={salePeriodMaxDate}
                  placeholder="Optional start and end date"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="inline-flex items-center gap-2 text-xs text-[color:var(--color-neutral-700)]">
                  <input
                    type="checkbox"
                    checked={values.isTaxIncluded}
                    onChange={(e) =>
                      handleChange("isTaxIncluded", e.target.checked)
                    }
                    disabled={values.courseType === CourseType.FREE}
                  />
                  <span>Price includes tax (VAT)</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Input
                  label="Start date"
                  type="date"
                  value={values.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                />
              </div>
              <div>
                <Input
                  label="End date"
                  type="date"
                  value={values.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                />
              </div>
              <div>
                <Select
                  label="From day"
                  value={values.fromDay}
                  onChange={(e) =>
                    handleChange("fromDay", e.target.value as DayType)
                  }
                >
                  {dayOptions.map((d) => (
                    <option key={d} value={d}>
                      {formatLabel(d)}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Select
                  label="To day"
                  value={values.toDay}
                  onChange={(e) =>
                    handleChange("toDay", e.target.value as DayType)
                  }
                >
                  {dayOptions.map((d) => (
                    <option key={d} value={d}>
                      {formatLabel(d)}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-[color:var(--foreground)]">
                  Start time
                </label>
                <div className="flex gap-2 mt-2">
                  <Input
                    className="flex-1"
                    type="text"
                    value={values.startTime}
                    onChange={(e) => handleChange("startTime", e.target.value)}
                    placeholder="09:00"
                  />
                  <Select
                    value={values.startTimeDesignator}
                    onChange={(e) =>
                      handleChange(
                        "startTimeDesignator",
                        e.target.value as TimeDesignator
                      )
                    }
                  >
                    {timeDesignatorOptions.map((td) => (
                      <option key={td} value={td}>
                        {formatLabel(td)}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[color:var(--foreground)]">
                  End time
                </label>
                <div className="flex gap-2 mt-2">
                  <Input
                    className="flex-1"
                    type="text"
                    value={values.endTime}
                    onChange={(e) => handleChange("endTime", e.target.value)}
                    placeholder="11:00"
                  />
                  <Select
                    value={values.endTimeDesignator}
                    onChange={(e) =>
                      handleChange(
                        "endTimeDesignator",
                        e.target.value as TimeDesignator
                      )
                    }
                  >
                    {timeDesignatorOptions.map((td) => (
                      <option key={td} value={td}>
                        {formatLabel(td)}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="sm:col-span-2">
                <Select
                  label="Timezone"
                  value={values.timezone}
                  onChange={(e) =>
                    handleChange("timezone", e.target.value as TimezoneType)
                  }
                >
                  {timezoneOptions.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        )}

        {activeTab === "seats" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Input
                  label="Seat capacity"
                  hint="Total number of seats available for this course."
                  type="number"
                  min={0}
                  step="1"
                  value={values.seatCapacityCount}
                  onChange={(e) => handleSeatCapacityChange(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Input
                  label="Seats occupied"
                  hint="Number of seats currently filled."
                  type="number"
                  min={0}
                  step="1"
                  value={values.occupiedSeatCount}
                  onChange={(e) => handleSeatsOccupiedChange(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Input
                  label="Seats available"
                  hint="Remaining seats that can be filled."
                  type="number"
                  min={0}
                  step="1"
                  value={values.availableSeatCount}
                  onChange={(e) => handleSeatsAvailableChange(e.target.value)}
                  placeholder="0"
                  disabled
                />
              </div>
              <div>
                <Input
                  label="Last Enrollment date"
                  hint="Last date learners can enroll."
                  type="date"
                  value={values.lastEnrollmentDate}
                  onChange={(e) =>
                    handleChange("lastEnrollmentDate", e.target.value)
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <label className="inline-flex items-center gap-2 text-xs text-[color:var(--color-neutral-700)]">
                  <input
                    type="checkbox"
                    checked={values.isWaitlistApplied}
                    onChange={(e) =>
                      handleChange("isWaitlistApplied", e.target.checked)
                    }
                  />
                  <span>Enable waitlist</span>
                </label>
              </div>
              <div>
                <Input
                  label="Waitlist capacity"
                  hint="Number of learners allowed on the waitlist."
                  type="number"
                  min={0}
                  step="1"
                  value={values.waitlistCapacityCount}
                  onChange={(e) =>
                    handleChange(
                      "waitlistCapacityCount",
                      e.target.value === ""
                        ? ""
                        : Math.max(0, Number(e.target.value))
                    )
                  }
                  placeholder="0"
                  disabled={!values.isWaitlistApplied}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "status" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Select
                  label="Status"
                  hint="Control the visibility and approval status of this course."
                  value={values.status}
                  onChange={(e) =>
                    handleChange("status", e.target.value as PublishStatusType)
                  }
                >
                  {Object.values(PublishStatusType).map((st) => (
                    <option key={st} value={st}>
                      {formatLabel(st)}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Select
                  label="Featured"
                  hint="Highlight this course in featured sections."
                  value={values.isFeatured ? "Featured" : "Not Featured"}
                  onChange={(e) =>
                    handleChange("isFeatured", e.target.value === "Featured")
                  }
                >
                  <option value="Featured">Featured</option>
                  <option value="Not Featured">Not Featured</option>
                </Select>
              </div>
              <div>
                <Select
                  label="Reviews"
                  hint="Control whether learners can leave comments/reviews."
                  value={values.isReviewAllowed ? "Allowed" : "Disabled"}
                  onChange={(e) =>
                    handleChange(
                      "isReviewAllowed",
                      e.target.value === "Allowed"
                    )
                  }
                >
                  <option value="Allowed">Allowed</option>
                  <option value="Disabled">Disabled</option>
                </Select>
              </div>
            </div>
          </div>
        )}

        {activeTab === "meeting" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr_auto] gap-3 items-end">
              <div>
                <label className="text-sm font-medium text-[color:var(--foreground)]">
                  Meeting Platform
                </label>
                <div className="relative mt-2" ref={meetingPlatformMenuRef}>
                  <button
                    type="button"
                    className="h-11 w-full rounded-lg bg-white border pr-9 px-3 text-left text-[color:var(--foreground)] border-[color:var(--color-neutral-200)] focus:border-[color:var(--color-primary-400)] shadow-xs focus:shadow-sm transition-all inline-flex items-center gap-2"
                    onClick={() => setIsMeetingPlatformMenuOpen((v) => !v)}
                  >
                    {meetingTypeInput ? (
                      <>
                        {(() => {
                          const platform = meetingPlatforms.find(
                            (p) => p.value === meetingTypeInput
                          );
                          return platform ? (
                            <>
                              <Image
                                src={platform.icon}
                                alt=""
                                width={18}
                                height={18}
                                className="h-[18px] w-[18px] object-contain"
                                aria-hidden
                              />
                              <span className="block truncate text-[color:var(--color-neutral-700)]">
                                {platform.label}
                              </span>
                            </>
                          ) : (
                            <span className="block truncate text-[color:var(--color-neutral-700)]">
                              Select platform
                            </span>
                          );
                        })()}
                      </>
                    ) : (
                      <span className="block truncate text-[color:var(--color-neutral-700)]">
                        Select platform
                      </span>
                    )}
                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[color:var(--color-neutral-500)]"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {isMeetingPlatformMenuOpen && (
                    <div className="absolute z-50 mt-1 w-full rounded-lg border border-[color:var(--color-neutral-200)] bg-white shadow-md max-h-56 overflow-y-auto scroll-elegant">
                      <ul className="py-1">
                        {meetingPlatforms.map((platform) => (
                          <li
                            key={platform.value}
                            className="px-3 py-2 hover:bg-[color:var(--color-neutral-50)]"
                          >
                            <button
                              type="button"
                              className={`w-full text-left text-sm inline-flex items-center gap-2 ${
                                meetingTypeInput === platform.value
                                  ? "text-[color:var(--color-primary-800)]"
                                  : ""
                              }`}
                              onClick={() => {
                                setMeetingTypeInput(platform.value);
                                setIsMeetingPlatformMenuOpen(false);
                              }}
                              role="option"
                              aria-selected={
                                meetingTypeInput === platform.value
                              }
                            >
                              <Image
                                src={platform.icon}
                                alt=""
                                width={18}
                                height={18}
                                className="h-[18px] w-[18px] object-contain"
                                aria-hidden
                              />
                              {platform.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Input
                  label="Meeting Link"
                  value={meetingUrlInput}
                  onChange={(e) => setMeetingUrlInput(e.target.value)}
                  placeholder={
                    meetingTypeInput === CourseMeetingPlatform.ZOOM
                      ? "https://zoom.us/j/..."
                      : meetingTypeInput === CourseMeetingPlatform.GOOGLE_MEET
                      ? "https://meet.google.com/..."
                      : meetingTypeInput ===
                        CourseMeetingPlatform.MICROSOFT_TEAMS
                      ? "https://teams.microsoft.com/..."
                      : meetingTypeInput === CourseMeetingPlatform.WEBEX
                      ? "https://..."
                      : meetingTypeInput === CourseMeetingPlatform.OTHER
                      ? "https://..."
                      : "Select a platform first"
                  }
                  disabled={!meetingTypeInput}
                />
              </div>
              <div>
                <Button
                  type="button"
                  onClick={addMeetingLink}
                  disabled={!meetingUrlInput.trim() || !meetingTypeInput}
                >
                  Add link
                </Button>
              </div>
            </div>

            <div className="text-xs font-medium text-[color:var(--color-neutral-700)]">
              Meeting Links
            </div>
            {values.meetingLinks.length === 0 ? (
              <p className="text-[11px] text-[color:var(--color-neutral-600)]">
                No meeting links added yet.
              </p>
            ) : (
              <div className="space-y-2">
                {values.meetingLinks.map((link) => {
                  const platformName =
                    meetingPlatforms.find((p) => p.value === link.platform)
                      ?.label || link.platform;
                  return (
                    <div
                      key={link.id}
                      className="flex items-start justify-between gap-3 rounded-md border border-[color:var(--color-neutral-200)] bg-white px-3 py-2"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getMeetingPlatformLogo(link.platform)}
                          <span className="text-xs font-medium text-[color:var(--color-neutral-800)] capitalize">
                            {platformName}
                          </span>
                          {link.isPrimary && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[color:var(--color-primary-100)] text-[color:var(--color-primary-700)] font-medium">
                              Primary
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[color:var(--color-neutral-600)] truncate">
                          {link.link}
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        {!link.isPrimary && (
                          <Button
                            type="button"
                            variant="secondary"
                            className="text-xs"
                            onClick={() => setPrimaryMeetingLink(link.id)}
                          >
                            Set Primary
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="secondary"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => removeMeetingLink(link.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "seo" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <Input
                  label="Meta title"
                  value={values.metaTitle}
                  onChange={(e) => handleChange("metaTitle", e.target.value)}
                  placeholder="Optional"
                />
              </div>
              <div>
                <Textarea
                  label="Meta description"
                  value={values.metaDescription}
                  onChange={(e) =>
                    handleChange("metaDescription", e.target.value)
                  }
                  placeholder="Optional"
                  rows={3}
                />
              </div>
              <div>
                <Input
                  label="Meta keywords (comma separated)"
                  value={values.metaKeywords}
                  onChange={(e) => handleChange("metaKeywords", e.target.value)}
                  placeholder="keyword1, keyword2"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[color:var(--color-neutral-200)]">
          {!isFirstTab && (
            <Button type="button" variant="secondary" onClick={goPrevTab}>
              Previous
            </Button>
          )}
          {!isLastTab ? (
            <Button type="button" onClick={goNextTab}>
              Next
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => onSubmit(values)}
              disabled={disabled || isLoading}
            >
              {isLoading
                ? "Saving..."
                : mode === "edit"
                ? "Save changes"
                : "Create"}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
}
