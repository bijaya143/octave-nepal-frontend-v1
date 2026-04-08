"use client";

import React, { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Card, {
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/Card";
import { studentAuthService } from "@/lib/services/student/auth";
import { useStudentAuth } from "@/lib/hooks/useStudentAuth";
import { UpdateStudentInput } from "@/lib/services/admin/student";
import Select from "@/components/ui/Select";
import { toast } from "sonner";

type TabId = "personal" | "contact" | "address" | "billing";

const TABS: { id: TabId; label: string }[] = [
  { id: "personal", label: "Personal Information" },
  { id: "contact", label: "Contact Information" },
  { id: "address", label: "Mailing Address" },
  { id: "billing", label: "Billing Information" },
];

export default function StudentEditProfilePage() {
  const { user, isAuthenticated, isLoading } = useStudentAuth();
  const [profileData, setProfileData] = useState<Partial<UpdateStudentInput>>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    phoneCountryCode: "",
    bio: "",
    dateOfBirth: "",
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
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("personal");

  useEffect(() => {
    if (isAuthenticated) {
      studentAuthService
        .me()
        .then((meResponse) => {
          if (meResponse.success && meResponse.data) {
            localStorage.setItem("user", JSON.stringify(meResponse.data));
            window.dispatchEvent(new Event("storage"));
          }
        })
        .catch((err) => {
          console.error("Failed to fetch fresh user data on mount:", err);
        });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (profileData.profilePicture instanceof File) {
      const objectUrl = URL.createObjectURL(profileData.profilePicture);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [profileData.profilePicture]);

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
        },
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setProfileData((prev) => ({
        ...prev,
        address: {
          ...(prev.address || {}),
          [field]: value,
        },
      }));
    } else if (name.startsWith("billing.")) {
      const field = name.split(".")[1];
      setProfileData((prev) => ({
        ...prev,
        billing: {
          ...(prev.billing || {}),
          [field]: value,
        },
      }));
    } else {
      setProfileData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setProfileData((prev) => ({
        ...prev,
        profilePicture: file,
      }));
    } else {
      setProfileData((prev) => {
        const newData = { ...prev };
        delete newData.profilePicture;
        return newData;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    // Manual Validation to prevent HTML5 hidden required blockers across tabs
    if (!profileData.firstName || !profileData.lastName) {
      toast.error("First Name and Last Name are required.");
      setActiveTab("personal");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: UpdateStudentInput = {
        id: user.id,
        ...profileData,
      };

      const response = await studentAuthService.updateProfile(payload);

      if (response.success) {
        toast.success("Profile updated successfully!");
        window.scrollTo({ top: 0, behavior: "smooth" });

        try {
          const meResponse = await studentAuthService.me();
          if (meResponse.success && meResponse.data) {
            localStorage.setItem("user", JSON.stringify(meResponse.data));
            window.dispatchEvent(new Event("storage"));
          }
        } catch (err) {
          console.error("Failed to sync updated profile:", err);
        }
      } else {
        toast.error(
          response.error?.message ||
            "Failed to update profile. Please try again.",
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const TAB_FIELDS: Record<TabId, string[]> = {
    personal: ["firstName", "middleName", "lastName", "dateOfBirth", "bio"],
    contact: ["email", "phoneCountryCode", "phoneNumber"],
    address: [
      "address.addressLine1",
      "address.addressLine2",
      "address.city",
      "address.state",
      "address.zipCode",
      "address.country",
    ],
    billing: [
      "billing.billingEmail",
      "billing.billingAddress",
      "billing.billingTaxId",
    ],
  };

  const getFieldCounts = (tabId: TabId) => {
    const fields = TAB_FIELDS[tabId];
    const total = fields.length;
    let empty = 0;

    fields.forEach((field) => {
      let value: any;
      if (field.includes(".")) {
        const [obj, key] = field.split(".");
        value = (profileData as any)[obj]?.[key];
      } else {
        value = (profileData as any)[field];
      }

      if (!value || (typeof value === "string" && value.trim() === "")) {
        empty++;
      }
    });

    return { empty, total };
  };

  const ProgressDonut = ({
    empty,
    total,
  }: {
    empty: number;
    total: number;
  }) => {
    const filled = total - empty;
    const percentage = (filled / total) * 100;
    const size = 22;
    const strokeWidth = 3;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    let colorClass = "text-[color:var(--color-primary-600)]";
    if (filled === 0) colorClass = "text-[color:var(--color-neutral-300)]";
    if (filled === total) colorClass = "text-green-600";

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
            className="text-[color:var(--color-neutral-100)]"
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

  if (isLoading) {
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
          Manage your personal details, physical address, and billing
          information.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:items-start">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          {/* Mobile Dropdown */}
          <div className="md:hidden">
            <Select
              aria-label="Select section"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as TabId)}
            >
              {TABS.map((tab) => {
                return (
                  <option key={tab.id} value={tab.id}>
                    {tab.label}
                  </option>
                );
              })}
            </Select>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-col gap-1">
            {TABS.map((tab) => {
              const { empty, total } = getFieldCounts(tab.id);
              return (
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
                  <ProgressDonut empty={empty} total={total} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Tab Content Area */}
        <div className="flex-1 min-w-0">
          <form onSubmit={handleSubmit} className="w-full">
            {/* Personal Information Tab */}
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
                    placeholder="Tell us a little bit about yourself..."
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

            {/* Contact Information Tab */}
            {activeTab === "contact" && (
              <Card className="overflow-hidden shadow-sm sm:rounded-xl">
                <CardHeader className="border-b border-[color:var(--color-neutral-100)] bg-white pb-4">
                  <h2 className="text-base font-semibold text-[color:var(--color-neutral-900)]">
                    Contact Information
                  </h2>
                  <p className="mt-1 text-sm text-[color:var(--color-neutral-500)]">
                    Manage how we communicate with you.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6 py-5 bg-white">
                  <Input
                    label="Primary Email Address"
                    name="email"
                    type="email"
                    value={profileData.email || ""}
                    disabled
                    hint="Contact platform support if an email change is absolutely required."
                  />

                  <div>
                    <label className="block text-sm font-medium text-[color:var(--color-neutral-700)] mb-2">
                      Phone Number
                    </label>
                    <div className="grid grid-cols-3 gap-3 sm:gap-5">
                      <div className="col-span-1">
                        <Input
                          name="phoneCountryCode"
                          placeholder="+1"
                          value={profileData.phoneCountryCode || ""}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          name="phoneNumber"
                          placeholder="Phone number"
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

            {/* Mailing Address Tab */}
            {activeTab === "address" && (
              <Card className="overflow-hidden shadow-sm sm:rounded-xl">
                <CardHeader className="border-b border-[color:var(--color-neutral-100)] bg-white pb-4">
                  <h2 className="text-base font-semibold text-[color:var(--color-neutral-900)]">
                    Mailing Address
                  </h2>
                  <p className="mt-1 text-sm text-[color:var(--color-neutral-500)]">
                    Where would you like to receive physical mail?
                  </p>
                </CardHeader>
                <CardContent className="space-y-6 py-5 bg-white">
                  <Input
                    label="Address Line 1"
                    name="address.addressLine1"
                    placeholder="Street address, P.O. box"
                    value={profileData.address?.addressLine1 || ""}
                    onChange={handleChange}
                  />
                  <Input
                    label="Address Line 2"
                    name="address.addressLine2"
                    placeholder="Apartment, suite, unit"
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
                      label="State/Province"
                      name="address.state"
                      value={profileData.address?.state || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="Zip/Postal Code"
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

            {/* Billing Information Tab */}
            {activeTab === "billing" && (
              <Card className="overflow-hidden shadow-sm sm:rounded-xl">
                <CardHeader className="border-b border-[color:var(--color-neutral-100)] bg-white pb-4">
                  <h2 className="text-base font-semibold text-[color:var(--color-neutral-900)]">
                    Billing Information
                  </h2>
                  <p className="mt-1 text-sm text-[color:var(--color-neutral-500)]">
                    Important details for invoices and receipts.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6 py-5 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="Billing Email"
                      name="billing.billingEmail"
                      type="email"
                      placeholder="Where to send invoices"
                      value={profileData.billing?.billingEmail || ""}
                      onChange={handleChange}
                    />
                    <Input
                      label="Billing Tax ID"
                      name="billing.billingTaxId"
                      placeholder="e.g. VAT or Company Tax ID"
                      value={profileData.billing?.billingTaxId || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <Textarea
                    label="Billing Address Override"
                    name="billing.billingAddress"
                    placeholder="Full billing address if different from mailing..."
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
