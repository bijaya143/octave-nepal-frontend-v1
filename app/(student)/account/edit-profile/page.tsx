"use client";

import React, { useEffect, useState } from "react";
import Container from "@/components/Container";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { studentAuthService } from "@/lib/services/student/auth";
import { useStudentAuth } from "@/lib/hooks/useStudentAuth";
import { UpdateStudentInput } from "@/lib/services/admin/student";

export default function StudentEditProfilePage() {
  const { user, isAuthenticated, isLoading } = useStudentAuth();
  const [profileData, setProfileData] = useState<Partial<UpdateStudentInput>>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "", // Read only if populated
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const payload: UpdateStudentInput = {
        id: user.id,
        ...profileData,
      };

      const response = await studentAuthService.updateProfile(payload);

      if (response.success) {
        setSuccessMessage("Profile updated successfully!");
        window.scrollTo({ top: 0, behavior: "smooth" });
        
        // Background sync to update local storage with fresh data
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
        setError(
          response.error?.message ||
            "Failed to update profile. Please try again.",
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
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
    <Container>
      <div className="w-full max-w-xl md:max-w-2xl mx-auto">
        <div className="mb-8 px-2 sm:px-0">
          <h1
            className="text-2xl md:text-3xl font-semibold text-[color:var(--color-neutral-900)]"
            style={{ fontFamily: "var(--font-heading-sans)" }}
          >
            Edit Profile
          </h1>
          <p className="mt-2 text-sm text-[color:var(--color-neutral-600)]">
            Update your personal details, physical address, and billing
            information.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full relative px-2 sm:px-0 pb-12"
        >
          {successMessage && (
            <div className="mb-8 p-4 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200 shadow-sm">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="mb-8 p-4 bg-red-50 text-red-700 text-sm font-medium rounded-lg border border-red-200 shadow-sm">
              {error}
            </div>
          )}

          <div className="space-y-10">
            {/* Personal Information */}
            <div>
              <h2
                className="text-lg font-semibold text-[color:var(--color-neutral-900)] mb-5"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                Personal Information
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[color:var(--color-neutral-700)] mb-2">
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
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-[color:var(--color-neutral-600)] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[color:var(--color-primary-50)] file:text-[color:var(--color-primary-700)] hover:file:bg-[color:var(--color-primary-100)] transition-colors cursor-pointer"
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
                    label="Middle Name (Optional)"
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
              </div>
            </div>

            {/* Contact Information */}
            <div className="pt-8 border-t border-[color:var(--color-neutral-200)]">
              <h2
                className="text-lg font-semibold text-[color:var(--color-neutral-900)] mb-5"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                Contact Information
              </h2>
              <div className="space-y-5">
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
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="sm:col-span-1">
                      <Input
                        name="phoneCountryCode"
                        placeholder="Code (+1)"
                        value={profileData.phoneCountryCode || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Input
                        name="phoneNumber"
                        placeholder="Phone number"
                        value={profileData.phoneNumber || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="pt-8 border-t border-[color:var(--color-neutral-200)]">
              <h2
                className="text-lg font-semibold text-[color:var(--color-neutral-900)] mb-5"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                Mailing Address
              </h2>
              <div className="space-y-5">
                <Input
                  label="Address Line 1"
                  name="address.addressLine1"
                  placeholder="Street address, P.O. box"
                  value={profileData.address?.addressLine1 || ""}
                  onChange={handleChange}
                />
                <Input
                  label="Address Line 2 (Optional)"
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
              </div>
            </div>

            {/* Billing */}
            <div className="pt-8 border-t border-[color:var(--color-neutral-200)]">
              <h2
                className="text-lg font-semibold text-[color:var(--color-neutral-900)] mb-5"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                Billing Information
              </h2>
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Billing Email (Optional)"
                    name="billing.billingEmail"
                    type="email"
                    placeholder="Where to send invoices"
                    value={profileData.billing?.billingEmail || ""}
                    onChange={handleChange}
                  />
                  <Input
                    label="Billing Tax ID (Optional)"
                    name="billing.billingTaxId"
                    placeholder="e.g. VAT or Company Tax ID"
                    value={profileData.billing?.billingTaxId || ""}
                    onChange={handleChange}
                  />
                </div>
                <Textarea
                  label="Billing Address Override (Optional)"
                  name="billing.billingAddress"
                  placeholder="Full billing address if different from mailing..."
                  value={profileData.billing?.billingAddress || ""}
                  onChange={handleChange}
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
            <Button
              type="submit"
              variant="primary"
              className="w-full sm:w-auto px-8"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving changes..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}
