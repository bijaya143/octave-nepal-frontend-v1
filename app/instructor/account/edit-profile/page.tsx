"use client";

import React, { useEffect, useState, useRef } from "react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Card, {
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import { toast } from "sonner";
import Image from "next/image";
import { X } from "lucide-react";

import { useInstructorAuth } from "@/lib/hooks/useInstructorAuth";
import { instructorAuthService } from "@/lib/services/instructor/auth";
import type {
  UpdateInstructorInput,
  InstructorSocialLinkInput,
  InstructorBillingPaymentMethod,
} from "@/lib/services/admin/instructor";

type TabId = "personal" | "professional" | "contact" | "address" | "billing";

const TABS: { id: TabId; label: string }[] = [
  { id: "personal", label: "Personal Information" },
  { id: "professional", label: "Professional Details" },
  { id: "contact", label: "Contact Information" },
  { id: "address", label: "Mailing Address" },
  { id: "billing", label: "Billing Information" },
];

const PLATFORMS = [
  {
    value: "Website",
    placeholder: "https://your-site.com",
    icon: "/images/social-medias/internet.png",
  },
  {
    value: "LinkedIn",
    placeholder: "https://www.linkedin.com/in/username",
    icon: "/images/social-medias/linkedin.png",
  },
  {
    value: "X",
    placeholder: "https://x.com/username",
    icon: "/images/social-medias/twitter.png",
  },
  {
    value: "Facebook",
    placeholder: "https://www.facebook.com/username",
    icon: "/images/social-medias/facebook.png",
  },
  {
    value: "Instagram",
    placeholder: "https://www.instagram.com/username",
    icon: "/images/social-medias/instagram.png",
  },
  {
    value: "YouTube",
    placeholder: "https://www.youtube.com/@channel",
    icon: "/images/social-medias/youtube.png",
  },
  {
    value: "GitHub",
    placeholder: "https://github.com/username",
    icon: "/images/social-medias/github.png",
  },
] as const;

export default function InstructorEditProfilePage() {
  const {
    user,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useInstructorAuth();
  const [profileData, setProfileData] = useState<
    Partial<UpdateInstructorInput>
  >({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    phoneCountryCode: "",
    bio: "",
    dateOfBirth: "",
    role: "",
    experienceInYears: 0,
    skills: [],
    socialLinks: [],
    address: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    billing: {
      billingEmail: "",
      billingAddress: "",
      billingTaxId: "",
      billingPaymentMethod: "" as InstructorBillingPaymentMethod,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("personal");
  const [skillInput, setSkillInput] = useState("");

  // Initial fetch to sync data
  useEffect(() => {
    if (isAuthenticated) {
      instructorAuthService
        .me()
        .then((res) => {
          if (res.success && res.data) {
            localStorage.setItem("user", JSON.stringify(res.data));
            window.dispatchEvent(new Event("storage"));
          }
        })
        .catch((err) => console.error("Sync error:", err));
    }
  }, [isAuthenticated]);

  // Handle preview URL
  useEffect(() => {
    if (profileData.profilePicture instanceof File) {
      const url = URL.createObjectURL(profileData.profilePicture);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [profileData.profilePicture]);

  // Populate state from user hook
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        middleName: user.middleName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        phoneCountryCode: user.phoneCountryCode || "",
        bio: user.bio || "",
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().split("T")[0]
          : "",
        role: user.role || "",
        experienceInYears: user.experienceInYears || 0,
        skills: user.skills || [],
        socialLinks: (user.socialLinks as InstructorSocialLinkInput[]) || [],
        address: {
          addressLine1: user.address?.addressLine1 || "",
          addressLine2: user.address?.addressLine2 || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          zipCode: user.address?.zipCode || "",
          country: user.address?.country || "",
        },
        billing: {
          billingEmail: user.billing?.billingEmail || "",
          billingAddress: user.billing?.billingAddress || "",
          billingTaxId: user.billing?.billingTaxId || "",
          billingPaymentMethod:
            (user.billing
              ?.billingPaymentMethod as InstructorBillingPaymentMethod) || "",
        },
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setProfileData((prev) => ({
        ...prev,
        address: { ...(prev.address || {}), [field]: value },
      }));
    } else if (name.startsWith("billing.")) {
      const field = name.split(".")[1];
      setProfileData((prev) => ({
        ...prev,
        billing: { ...(prev.billing || {}), [field]: value },
      }));
    } else {
      setProfileData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileData((prev) => ({
        ...prev,
        profilePicture: e.target.files![0],
      }));
    }
  };

  const addSocialLink = () => {
    setProfileData((prev) => ({
      ...prev,
      socialLinks: [
        ...(prev.socialLinks || []),
        { name: PLATFORMS[0].value, url: "" },
      ],
    }));
  };

  const updateSocialLink = (
    index: number,
    patch: Partial<InstructorSocialLinkInput>,
  ) => {
    setProfileData((prev) => {
      const links = [...(prev.socialLinks || [])];
      links[index] = { ...links[index], ...patch };
      return { ...prev, socialLinks: links };
    });
  };

  const removeSocialLink = (index: number) => {
    setProfileData((prev) => ({
      ...prev,
      socialLinks: (prev.socialLinks || []).filter((_, i) => i !== index),
    }));
  };

  const capitalizeFirstAlphabet = (text: string): string => {
    if (!text) return text;
    const first = text.charAt(0);
    if (/[a-zA-Z]/.test(first)) {
      return first.toUpperCase() + text.slice(1);
    }
    return text;
  };

  const addSkill = (name: string) => {
    const trimmed = name.trim();
    const normalized = capitalizeFirstAlphabet(trimmed);
    if (!normalized) return;

    const exists = (profileData.skills || []).some(
      (s) => s.toLowerCase() === normalized.toLowerCase(),
    );
    if (exists) return;

    setProfileData((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), normalized],
    }));
  };

  const removeSkill = (name: string) => {
    setProfileData((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter(
        (s) => s.toLowerCase() !== name.toLowerCase(),
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    if (!profileData.firstName || !profileData.lastName) {
      toast.error("First Name and Last Name are required.");
      setActiveTab("personal");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await instructorAuthService.updateProfile({
        id: user.id,
        ...profileData,
      });

      if (res.success) {
        toast.success("Profile updated successfully!");
        const meRes = await instructorAuthService.me();
        if (meRes.success && meRes.data) {
          localStorage.setItem("user", JSON.stringify(meRes.data));
          window.dispatchEvent(new Event("storage"));
        }
      } else {
        toast.error(res.error?.message || "Failed to update profile.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const TAB_FIELDS: Record<TabId, string[]> = {
    personal: ["firstName", "lastName", "dateOfBirth", "bio"],
    professional: ["role", "experienceInYears", "socialLinks", "skills"],
    contact: ["email", "phoneNumber"],
    address: ["address.addressLine1", "address.city", "address.country"],
    billing: [
      "billing.billingEmail",
      "billing.billingTaxId",
      "billing.billingPaymentMethod",
      "billing.billingAddress",
    ],
  };

  const getFieldCounts = (tabId: TabId) => {
    const fields = TAB_FIELDS[tabId];
    const total = fields.length;
    let filled = 0;

    fields.forEach((field) => {
      let val: any;
      if (field.includes(".")) {
        const [o, k] = field.split(".");
        val = (profileData as any)[o]?.[k];
      } else {
        val = (profileData as any)[field];
      }
      if (val && (typeof val !== "string" || val.trim() !== "")) {
        if (Array.isArray(val)) {
          if (val.length > 0) filled++;
        } else {
          filled++;
        }
      }
    });

    return { filled, total };
  };

  const ProgressDonut = ({ tabId }: { tabId: TabId }) => {
    const { filled, total } = getFieldCounts(tabId);
    const percentage = (filled / total) * 100;
    const size = 22;
    const strokeWidth = 3;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    let colorClass = "text-[color:var(--color-primary-600)]";
    let trackClass = "text-[color:var(--color-neutral-100)]";

    if (filled === 0) {
      colorClass = "text-rose-500/20";
      trackClass = "text-rose-500";
    } else if (filled === total) {
      colorClass = "text-green-600";
    }

    return (
      <div className="relative inline-flex items-center justify-center shrink-0">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className={`${trackClass} transition-colors duration-500`}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${colorClass} transition-all duration-500`}
          />
        </svg>
      </div>
    );
  };

  function PlatformPicker({
    value,
    onChange,
  }: {
    value: string;
    onChange: (next: string) => void;
  }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);
    const current = PLATFORMS.find((p) => p.value === value) || PLATFORMS[0];

    useEffect(() => {
      function onDocClick(e: MouseEvent) {
        if (!ref.current?.contains(e.target as Node)) setOpen(false);
      }
      document.addEventListener("mousedown", onDocClick);
      return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    return (
      <div className="relative" ref={ref}>
        <button
          type="button"
          className="h-11 w-full rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 shadow-xs hover:bg-[color:var(--color-neutral-50)] inline-flex items-center justify-between gap-2"
          onClick={() => setOpen(!open)}
        >
          <span className="inline-flex items-center gap-2 text-sm">
            <Image
              src={current.icon}
              alt=""
              width={18}
              height={18}
              className="h-[18px] w-[18px] object-contain"
            />
            {current.value}
          </span>
          <svg
            className="h-4 w-4 text-[color:var(--color-neutral-500)]"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-lg border border-[color:var(--color-neutral-200)] bg-white shadow-md">
            <ul className="py-1 max-h-64 overflow-auto">
              {PLATFORMS.map((p) => (
                <li key={p.value}>
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-left hover:bg-[color:var(--color-neutral-50)] inline-flex items-center gap-2 text-sm"
                    onClick={() => {
                      onChange(p.value);
                      setOpen(false);
                    }}
                  >
                    <Image
                      src={p.icon}
                      alt=""
                      width={18}
                      height={18}
                      className="h-[18px] w-[18px] object-contain"
                    />
                    {p.value}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  if (isAuthLoading) {
    return (
      <div className="py-12 flex justify-center text-[color:var(--color-neutral-500)] text-sm font-medium">
        Loading profile...
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="w-full max-w-5xl mx-auto pb-12">
      <div className="mb-6">
        <h1
          className="text-xl md:text-2xl font-semibold text-[color:var(--color-neutral-900)]"
          style={{ fontFamily: "var(--font-heading-sans)" }}
        >
          Account Center
        </h1>
        <p className="mt-2 text-sm text-[color:var(--color-neutral-600)]">
          Manage your professional details, social links, and billing
          information.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:items-start">
        <aside className="w-full md:w-64 shrink-0">
          <div className="md:hidden">
            <Select
              aria-label="Select section"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as TabId)}
            >
              {TABS.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </Select>
          </div>
          <nav className="hidden md:flex flex-col gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-[color:var(--color-primary-700)] shadow-sm border border-[color:var(--color-neutral-100)] ring-1 ring-black/5"
                    : "text-[color:var(--color-neutral-500)] hover:bg-[color:var(--color-neutral-100)] hover:text-[color:var(--color-neutral-900)]"
                }`}
              >
                <ProgressDonut tabId={tab.id} />
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 min-w-0">
          <form onSubmit={handleSubmit} className="w-full">
            {activeTab === "personal" && (
              <Card className="overflow-hidden shadow-sm sm:rounded-xl">
                <CardHeader className="border-b border-[color:var(--color-neutral-100)] bg-white pb-4">
                  <h2 className="text-base font-semibold text-[color:var(--color-neutral-900)]">
                    Personal Information
                  </h2>
                  <p className="mt-1 text-sm text-[color:var(--color-neutral-500)]">
                    Update your photo and basic personal details.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6 py-5 bg-white">
                  <div>
                    <label className="block text-sm font-medium text-[color:var(--color-neutral-700)] mb-3">
                      Profile Picture
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-[color:var(--color-neutral-100)] border border-[color:var(--color-neutral-200)] flex items-center justify-center overflow-hidden shrink-0">
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                        ) : user?.profilePictureKey ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${user?.profilePictureKey}`}
                            alt="Avatar"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-[color:var(--color-neutral-400)] text-xs font-medium">
                            Avatar
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleFileChange}
                          className="block w-full text-xs sm:text-sm text-[color:var(--color-neutral-600)] file:mr-2 sm:file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-[color:var(--color-neutral-100)] file:text-[color:var(--color-neutral-900)] hover:file:bg-[color:var(--color-neutral-200)] transition-colors cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="First Name"
                      name="firstName"
                      value={profileData.firstName || ""}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="Last Name"
                      name="lastName"
                      value={profileData.lastName || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="Middle Name"
                      name="middleName"
                      value={profileData.middleName || ""}
                      onChange={handleChange}
                    />
                    <Input
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      value={profileData.dateOfBirth || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <Textarea
                    label="Bio / Abstract"
                    name="bio"
                    placeholder="Tell students about yourself..."
                    value={profileData.bio || ""}
                    onChange={handleChange}
                    rows={4}
                    className="resize-none"
                  />
                </CardContent>
                <CardFooter className="border-t border-[color:var(--color-neutral-100)] flex justify-end py-4 px-4 sm:px-6 bg-[color:var(--color-neutral-50)]/50">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            )}

            {activeTab === "professional" && (
              <Card className="overflow-hidden shadow-sm sm:rounded-xl">
                <CardHeader className="border-b border-[color:var(--color-neutral-100)] bg-white pb-4">
                  <h2 className="text-base font-semibold text-[color:var(--color-neutral-900)]">
                    Professional Details
                  </h2>
                  <p className="mt-1 text-sm text-[color:var(--color-neutral-500)]">
                    Showcase your expertise and social presence.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6 py-5 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="Headline / Role"
                      name="role"
                      placeholder="Senior Web Instructor"
                      value={profileData.role || ""}
                      onChange={handleChange}
                    />
                    <Input
                      label="Experience (Years)"
                      name="experienceInYears"
                      type="number"
                      value={profileData.experienceInYears || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-[color:var(--color-neutral-700)]">
                      Skills & Expertise
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(profileData.skills || []).map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="pl-3 pr-1.5 py-1 text-sm bg-white border-[color:var(--color-neutral-200)] text-[color:var(--color-neutral-700)] inline-flex items-center gap-1.5 rounded-lg group"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="p-0.5 rounded-md hover:bg-[color:var(--color-neutral-100)] text-[color:var(--color-neutral-400)] hover:text-[color:var(--color-neutral-900)] transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <Input
                      placeholder="Type a skill and press Enter (e.g. React, Python)"
                      value={skillInput}
                      onChange={(e) =>
                        setSkillInput(capitalizeFirstAlphabet(e.target.value))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill(skillInput);
                          setSkillInput("");
                        }
                      }}
                    />
                    <p className="text-xs text-[color:var(--color-neutral-500)]">
                      Press enter after each skill to add it.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[color:var(--color-neutral-700)] mb-3">
                      Social Profiles
                    </label>
                    <div className="space-y-3">
                      {(profileData.socialLinks || []).map((item, idx) => {
                        const plat =
                          PLATFORMS.find((p) => p.value === item.name) ||
                          PLATFORMS[0];
                        return (
                          <div
                            key={idx}
                            className="grid grid-cols-1 sm:grid-cols-[160px_1fr_auto] gap-2 items-center"
                          >
                            <PlatformPicker
                              value={item.name}
                              onChange={(next) =>
                                updateSocialLink(idx, { name: next })
                              }
                            />
                            <Input
                              type="url"
                              placeholder={plat.placeholder}
                              value={item.url}
                              onChange={(e) =>
                                updateSocialLink(idx, {
                                  url: e.currentTarget.value,
                                })
                              }
                            />
                            <Button
                              type="button"
                              variant="secondary"
                              size="md"
                              onClick={() => removeSocialLink(idx)}
                            >
                              Remove
                            </Button>
                          </div>
                        );
                      })}
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={addSocialLink}
                      >
                        Add link
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-[color:var(--color-neutral-100)] flex justify-end py-4 px-4 sm:px-6 bg-[color:var(--color-neutral-50)]/50">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            )}

            {activeTab === "contact" && (
              <Card className="overflow-hidden shadow-sm sm:rounded-xl">
                <CardHeader className="border-b border-[color:var(--color-neutral-100)] bg-white pb-4">
                  <h2 className="text-base font-semibold text-[color:var(--color-neutral-900)]">
                    Contact Information
                  </h2>
                  <p className="mt-1 text-sm text-[color:var(--color-neutral-500)]">
                    Manage your primary communication channels.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6 py-5 bg-white">
                  <Input
                    label="Primary Email Address"
                    name="email"
                    type="email"
                    value={profileData.email || ""}
                    disabled
                    hint="Email contact platform support to change."
                  />
                  <div>
                    <label className="block text-sm font-medium text-[color:var(--color-neutral-700)] mb-2">
                      Phone Number
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <Input
                        name="phoneCountryCode"
                        placeholder="+977"
                        value={profileData.phoneCountryCode || ""}
                        onChange={handleChange}
                      />
                      <div className="col-span-2">
                        <Input
                          name="phoneNumber"
                          placeholder="98XXXXXXXX"
                          value={profileData.phoneNumber || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-[color:var(--color-neutral-100)] flex justify-end py-4 px-4 sm:px-6 bg-[color:var(--color-neutral-50)]/50">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            )}

            {activeTab === "address" && (
              <Card className="overflow-hidden shadow-sm sm:rounded-xl">
                <CardHeader className="border-b border-[color:var(--color-neutral-100)] bg-white pb-4">
                  <h2 className="text-base font-semibold text-[color:var(--color-neutral-900)]">
                    Mailing Address
                  </h2>
                  <p className="mt-1 text-sm text-[color:var(--color-neutral-500)]">
                    Where should we send your physical documents?
                  </p>
                </CardHeader>
                <CardContent className="space-y-6 py-5 bg-white">
                  <Input
                    label="Address Line 1"
                    name="address.addressLine1"
                    placeholder="Street address"
                    value={profileData.address?.addressLine1 || ""}
                    onChange={handleChange}
                  />
                  <Input
                    label="Address Line 2"
                    name="address.addressLine2"
                    placeholder="Apartment, suite, etc."
                    value={profileData.address?.addressLine2 || ""}
                    onChange={handleChange}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="City"
                      name="address.city"
                      value={profileData.address?.city || ""}
                      onChange={handleChange}
                    />
                    <Input
                      label="State"
                      name="address.state"
                      value={profileData.address?.state || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="Zip Code"
                      name="address.zipCode"
                      value={profileData.address?.zipCode || ""}
                      onChange={handleChange}
                    />
                    <Input
                      label="Country"
                      name="address.country"
                      value={profileData.address?.country || ""}
                      onChange={handleChange}
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t border-[color:var(--color-neutral-100)] flex justify-end py-4 px-4 sm:px-6 bg-[color:var(--color-neutral-50)]/50">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            )}

            {activeTab === "billing" && (
              <Card className="overflow-hidden shadow-sm sm:rounded-xl">
                <CardHeader className="border-b border-[color:var(--color-neutral-100)] bg-white pb-4">
                  <h2 className="text-base font-semibold text-[color:var(--color-neutral-900)]">
                    Billing Information
                  </h2>
                  <p className="mt-1 text-sm text-[color:var(--color-neutral-500)]">
                    Details for invoices and tax compliance.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6 py-5 bg-white">
                  <Input
                    label="Billing Email"
                    name="billing.billingEmail"
                    type="email"
                    value={profileData.billing?.billingEmail || ""}
                    onChange={handleChange}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="Tax ID"
                      name="billing.billingTaxId"
                      value={profileData.billing?.billingTaxId || ""}
                      onChange={handleChange}
                    />
                    <Select
                      label="Payment Method"
                      name="billing.billingPaymentMethod"
                      value={profileData.billing?.billingPaymentMethod || ""}
                      onChange={handleChange}
                    >
                      <option value="">Select payment method</option>
                      <option value="QR">QR</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                      <option value="ONLINE_BANKING">Online Banking</option>
                      <option value="CARD">Card</option>
                      <option value="WALLET">Wallet</option>
                      <option value="OTHER">Other</option>
                    </Select>
                  </div>
                  <Textarea
                    label="Billing Address"
                    name="billing.billingAddress"
                    placeholder="If different from mailing..."
                    value={profileData.billing?.billingAddress || ""}
                    onChange={handleChange}
                    rows={3}
                    className="resize-none"
                  />
                </CardContent>
                <CardFooter className="border-t border-[color:var(--color-neutral-100)] flex justify-end py-4 px-4 sm:px-6 bg-[color:var(--color-neutral-50)]/50">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
