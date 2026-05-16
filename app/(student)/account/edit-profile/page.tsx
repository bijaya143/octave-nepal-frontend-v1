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
import { studentAuthService } from "@/lib/services/student/auth";
import { useStudentAuth } from "@/lib/hooks/useStudentAuth";
import { UpdateStudentInput } from "@/lib/services/admin/student";
import Select from "@/components/ui/Select";
import { toast } from "sonner";
import { Camera, Image as ImageIcon } from "lucide-react";
import { PhoneInput, usePhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { cn } from "@/lib/cn";

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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneValue, setPhoneValue] = useState("");

  const { phone, country } = usePhoneInput({
    defaultCountry: "np",
    value: phoneValue,
    onChange: (data) => {
      setPhoneValue(data.phone);
    },
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("personal");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setPhoneValue(
        user.phoneCountryCode && user.phoneNumber
          ? `${user.phoneCountryCode}${user.phoneNumber}`
          : "",
      );
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

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

    // Extract phone data from react-international-phone
    const phoneCountryCode = country?.dialCode ? `+${country.dialCode}` : "";
    const phoneNumber = phone.replace(phoneCountryCode, "").replace(/\D/g, "");

    // Manual Validation to prevent HTML5 hidden required blockers across tabs
    const newErrors: Record<string, string> = {};

    // Personal Info
    if (!profileData.firstName?.trim())
      newErrors.firstName = "First Name is required";
    if (!profileData.lastName?.trim())
      newErrors.lastName = "Last Name is required";

    // Contact Info (Optional, but must be valid if provided)
    if (phoneNumber && phone.length < 7) {
      newErrors.phone = "Enter a valid phone number";
    }

    // Billing Info (if partially filled)
    if (
      profileData.billing?.billingEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.billing.billingEmail)
    ) {
      newErrors["billing.billingEmail"] = "Enter a valid billing email";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      // Determine which tab to switch to based on the first error
      const firstErrorField = Object.keys(newErrors)[0];
      let targetTab: TabId = "personal";

      if (firstErrorField.startsWith("address.")) targetTab = "address";
      else if (firstErrorField.startsWith("billing.")) targetTab = "billing";
      else if (
        firstErrorField === "email" ||
        firstErrorField === "phone" ||
        firstErrorField === "phoneCountryCode"
      ) {
        targetTab = "contact";
      }

      toast.error(Object.values(newErrors)[0]);
      setActiveTab(targetTab);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const payload: UpdateStudentInput = {
        id: user.id,
        ...profileData,
        phoneNumber,
        phoneCountryCode,
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
          <form onSubmit={handleSubmit} noValidate className="w-full">
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
                    <label className="block text-sm font-medium text-[color:var(--color-neutral-700)] mb-4">
                      Profile Picture
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="relative group">
                        <div className="h-20 w-20 rounded-full bg-[color:var(--color-neutral-100)] border-2 border-[color:var(--color-neutral-200)] flex items-center justify-center overflow-hidden shrink-0 shadow-sm transition-all group-hover:border-[color:var(--color-primary-300)]">
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
                            <div className="flex flex-col items-center text-[color:var(--color-neutral-400)]">
                              <ImageIcon className="h-8 w-8 mb-1 opacity-20" />
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute bottom-0 right-0 h-7 w-7 bg-[color:var(--color-primary-600)] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[color:var(--color-primary-700)] transition-transform hover:scale-110 border-2 border-white"
                          title="Change Photo"
                        >
                          <Camera className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex flex-col gap-2 w-full sm:w-auto">
                        <p className="text-[11px] text-[color:var(--color-neutral-500)] leading-relaxed text-center sm:text-left">
                          JPG, PNG or WebP. Max size 2MB.
                          <br />
                          Recommended: 400x400px square image.
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="First Name"
                      name="firstName"
                      value={profileData.firstName || ""}
                      onChange={handleChange}
                      error={errors.firstName}
                      required
                    />
                    <Input
                      label="Last Name"
                      name="lastName"
                      value={profileData.lastName || ""}
                      onChange={handleChange}
                      error={errors.lastName}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="Middle Name"
                      name="middleName"
                      value={profileData.middleName || ""}
                      onChange={handleChange}
                      error={errors.middleName}
                    />
                    <Input
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      value={profileData.dateOfBirth || ""}
                      onChange={handleChange}
                      error={errors.dateOfBirth}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-[color:var(--color-neutral-700)]">
                        Bio / Abstract
                      </label>
                      <span
                        className={`text-xs font-medium ${(profileData.bio?.length || 0) >= 250 ? "text-red-500" : "text-[color:var(--color-neutral-500)]"}`}
                      >
                        {profileData.bio?.length || 0} / 250
                      </span>
                    </div>
                    <Textarea
                      name="bio"
                      placeholder="Tell us a little bit about yourself..."
                      value={profileData.bio || ""}
                      onChange={handleChange}
                      rows={4}
                      className="resize-none"
                      error={errors.bio}
                      maxLength={250}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                      <PhoneInput
                        defaultCountry="np"
                        value={phoneValue}
                        onChange={(p) => {
                          setPhoneValue(p);
                          if (errors.phone) {
                            setErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors.phone;
                              return newErrors;
                            });
                          }
                        }}
                        className="flex items-stretch group"
                        inputClassName={cn(
                          "!h-11 !w-full !rounded-r-lg !rounded-l-none !border !px-4 !text-[color:var(--foreground)] !text-base md:!text-sm !transition-all !shadow-xs focus:!shadow-sm",
                          errors.phone
                            ? "!border-red-400 group-focus-within:!border-red-500"
                            : "!border-[color:var(--color-neutral-200)] group-focus-within:!border-[color:var(--color-primary-400)]",
                        )}
                        countrySelectorStyleProps={{
                          buttonClassName: cn(
                            "!h-11 !rounded-l-lg !rounded-r-none !border !border-r-0 !bg-white !px-3 hover:!bg-[color:var(--color-neutral-50)] !transition-all",
                            errors.phone
                              ? "!border-red-400 group-focus-within:!border-red-500"
                              : "!border-[color:var(--color-neutral-200)] group-focus-within:!border-[color:var(--color-primary-400)]",
                          ),
                        }}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.phone}
                        </p>
                      )}
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
                    error={errors["address.addressLine1"]}
                  />
                  <Input
                    label="Address Line 2"
                    name="address.addressLine2"
                    placeholder="Apartment, suite, unit"
                    value={profileData.address?.addressLine2 || ""}
                    onChange={handleChange}
                    error={errors["address.addressLine2"]}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="City"
                      name="address.city"
                      value={profileData.address?.city || ""}
                      onChange={handleChange}
                      error={errors["address.city"]}
                    />
                    <Input
                      label="State/Province"
                      name="address.state"
                      value={profileData.address?.state || ""}
                      onChange={handleChange}
                      error={errors["address.state"]}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="Zip/Postal Code"
                      name="address.zipCode"
                      value={profileData.address?.zipCode || ""}
                      onChange={handleChange}
                      error={errors["address.zipCode"]}
                    />
                    <Input
                      label="Country"
                      name="address.country"
                      value={profileData.address?.country || ""}
                      onChange={handleChange}
                      error={errors["address.country"]}
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
                      error={errors["billing.billingEmail"]}
                    />
                    <Input
                      label="Billing Tax ID"
                      name="billing.billingTaxId"
                      placeholder="e.g. VAT or Company Tax ID"
                      value={profileData.billing?.billingTaxId || ""}
                      onChange={handleChange}
                      error={errors["billing.billingTaxId"]}
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
                    error={errors["billing.billingAddress"]}
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
