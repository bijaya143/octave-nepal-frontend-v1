"use client";
import React, { useState, useEffect } from "react";
import Card, { CardContent, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Switch from "@/components/ui/Switch";
import { Separator } from "@/components/ui/Separator";
import { Settings, Mail, CreditCard, Shield, BookOpen, Users, Link } from "lucide-react";
import { toast } from "sonner";
import CopyButton from "../../../components/ui/CopyButton";
import { useSettings } from "@/lib/useSettings";

type SettingsFormData = {
  // General Settings
  siteName: string;
  siteDescription: string;
  defaultLanguage: string;
  timezone: string;
  maintenanceMode: boolean;
  supportEmail: string;
  supportPhone: string;
  companyAddress: string;
  businessDaysFrom: string;
  businessDaysTo: string;
  businessHoursOpen: string;
  businessHoursClose: string;

  // Email & Notifications
  smtpHost: string;
  smtpPort: string;
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  emailNotifications: boolean;
  enrollmentNotifications: boolean;
  paymentNotifications: boolean;

  // Payment Settings
  currency: string;
  stripeEnabled: boolean;
  khaltiEnabled: boolean;
  esewaEnabled: boolean;
  paypalEnabled: boolean;
  taxRate: string;

  // Security Settings
  passwordMinLength: string;
  sessionTimeout: string;
  twoFactorAuth: boolean;
  loginAttempts: string;
  ipWhitelist: boolean;
  auditLogging: boolean;

  // Course Management
  autoApproveCourses: boolean;
  maxFileSize: string;
  allowedFileTypes: string;
  courseApprovalRequired: boolean;
  instructorVerification: boolean;

  // User Management
  autoEnrollStudents: boolean;
  emailVerification: boolean;
  profileCompletionRequired: boolean;
  bulkUserImport: boolean;
  userAnalytics: boolean;

  // Social Links
  facebookUrl: string;
  xUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
  websiteUrl: string;
};

export default function AdminSettingsPage() {
  const { settings, updateSettings, isLoaded } = useSettings();

  // Initialize form data - only maintenance mode comes from settings
  const [formData, setFormData] = useState<SettingsFormData>({
    // General Settings
    siteName: "Octave Nepal",
    siteDescription: "Online Learning Platform in Nepal",
    defaultLanguage: "en",
    timezone: "Asia/Kathmandu",
    maintenanceMode: false, // Will be updated when settings load
    supportEmail: "support@octavenepal.com",
    supportPhone: "+977-1-234567",
    companyAddress: "Kathmandu, Nepal",
    businessDaysFrom: "Monday",
    businessDaysTo: "Friday",
    businessHoursOpen: "09:00",
    businessHoursClose: "17:00",

    // Email & Notifications
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",
    fromEmail: "noreply@octavenepal.com",
    fromName: "Octave Nepal",
    emailNotifications: true,
    enrollmentNotifications: true,
    paymentNotifications: true,

    // Payment Settings
    currency: "NPR",
    stripeEnabled: false,
    khaltiEnabled: true,
    esewaEnabled: true,
    paypalEnabled: false,
    taxRate: "13",

    // Security Settings
    passwordMinLength: "8",
    sessionTimeout: "60",
    twoFactorAuth: false,
    loginAttempts: "5",
    ipWhitelist: false,
    auditLogging: true,

    // Course Management
    autoApproveCourses: false,
    maxFileSize: "100",
    allowedFileTypes: "pdf,doc,docx,ppt,pptx,mp4,avi,mov",
    courseApprovalRequired: true,
    instructorVerification: true,

    // User Management
    autoEnrollStudents: false,
    emailVerification: true,
    profileCompletionRequired: false,
    bulkUserImport: true,
    userAnalytics: true,

    // Social Links
    facebookUrl: "",
    xUrl: "",
    instagramUrl: "",
    linkedinUrl: "",
    youtubeUrl: "",
    websiteUrl: "",
  });

  // Update maintenance mode in form data when settings are loaded
  useEffect(() => {
    if (isLoaded) {
      setFormData(prev => ({
        ...prev,
        maintenanceMode: settings.maintenanceMode,
      }));
    }
  }, [isLoaded, settings.maintenanceMode]);

  const [activeTab, setActiveTab] = useState("general");

  const handleInputChange = (field: keyof SettingsFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // For maintenance mode, update settings immediately when toggled
    if (field === 'maintenanceMode') {
      updateSettings({ maintenanceMode: value as boolean });
    }
  };

  const handleSave = () => {
    // Maintenance mode is already saved immediately on toggle
    // In a real app, this would save other settings to backend
    console.log("Saving settings:", formData);
    toast.success("Settings saved successfully!");
  };

  const tabs = [
    { id: "general", label: "General", icon: Settings, disabled: false },
    { id: "email", label: "Notifications", icon: Mail, disabled: false },
    { id: "payments", label: "Payments", icon: CreditCard, disabled: false },
    { id: "security", label: "Security", icon: Shield, disabled: false },
    { id: "social", label: "Social Links", icon: Link, disabled: false },
    { id: "courses", label: "Courses", icon: BookOpen, disabled: true },
    { id: "users", label: "Users", icon: Users, disabled: true },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Site Name"
                value={formData.siteName}
                onChange={(e) => handleInputChange("siteName", e.target.value)}
                placeholder="Enter site name"
              />
              <Select
                label="Default Language"
                value={formData.defaultLanguage}
                onChange={(e) => handleInputChange("defaultLanguage", e.target.value)}
              >
                <option value="en">English</option>
                <option value="ne">Nepali</option>
                <option value="hi">Hindi</option>
              </Select>
            </div>
            <Input
              label="Site Description"
              value={formData.siteDescription}
              onChange={(e) => handleInputChange("siteDescription", e.target.value)}
              placeholder="Brief description of your platform"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Timezone"
                value={formData.timezone}
                onChange={(e) => handleInputChange("timezone", e.target.value)}
              >
                <option value="Asia/Kathmandu">Asia/Kathmandu (UTC+5:45)</option>
                <option value="UTC">UTC</option>
                <option value="Asia/Kolkata">Asia/Kolkata (UTC+5:30)</option>
              </Select>
              <div className="flex items-end">
                <Switch
                  label="Maintenance Mode"
                  hint="Put site in maintenance mode"
                  checked={formData.maintenanceMode}
                  onChange={(e) => handleInputChange("maintenanceMode", e.target.checked)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Support Email"
                value={formData.supportEmail}
                onChange={(e) => handleInputChange("supportEmail", e.target.value)}
                placeholder="support@yourdomain.com"
                type="email"
              />
              <Input
                label="Support Phone"
                value={formData.supportPhone}
                onChange={(e) => handleInputChange("supportPhone", e.target.value)}
                placeholder="+977-1-234567"
              />
            </div>
            <Input
              label="Company Address"
              value={formData.companyAddress}
              onChange={(e) => handleInputChange("companyAddress", e.target.value)}
              placeholder="Enter your company address"
            />
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Business Hours</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Business Days From"
                  value={formData.businessDaysFrom}
                  onChange={(e) => handleInputChange("businessDaysFrom", e.target.value)}
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </Select>
                <Select
                  label="Business Days To"
                  value={formData.businessDaysTo}
                  onChange={(e) => handleInputChange("businessDaysTo", e.target.value)}
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Opening Time"
                  value={formData.businessHoursOpen}
                  onChange={(e) => handleInputChange("businessHoursOpen", e.target.value)}
                  placeholder="09:00"
                  type="time"
                />
                <Input
                  label="Closing Time"
                  value={formData.businessHoursClose}
                  onChange={(e) => handleInputChange("businessHoursClose", e.target.value)}
                  placeholder="17:00"
                  type="time"
                />
              </div>
            </div>
          </div>
        );

      case "email":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="SMTP Host"
                value={formData.smtpHost}
                onChange={(e) => handleInputChange("smtpHost", e.target.value)}
                placeholder="smtp.example.com"
              />
              <Input
                label="SMTP Port"
                value={formData.smtpPort}
                onChange={(e) => handleInputChange("smtpPort", e.target.value)}
                placeholder="587"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="SMTP Username"
                value={formData.smtpUsername}
                onChange={(e) => handleInputChange("smtpUsername", e.target.value)}
                placeholder="your-email@example.com"
              />
              <Input
                label="SMTP Password"
                type="password"
                value={formData.smtpPassword}
                onChange={(e) => handleInputChange("smtpPassword", e.target.value)}
                placeholder="Enter password"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="From Email"
                value={formData.fromEmail}
                onChange={(e) => handleInputChange("fromEmail", e.target.value)}
                placeholder="noreply@yourdomain.com"
              />
              <Input
                label="From Name"
                value={formData.fromName}
                onChange={(e) => handleInputChange("fromName", e.target.value)}
                placeholder="Your Platform Name"
              />
            </div>
            <Separator />
            <div className="space-y-4">
              <Switch
                label="Email Notifications"
                hint="Enable email notifications system"
                checked={formData.emailNotifications}
                onChange={(e) => handleInputChange("emailNotifications", e.target.checked)}
              />
              <Switch
                label="Enrollment Notifications"
                hint="Send notifications for new enrollments"
                checked={formData.enrollmentNotifications}
                onChange={(e) => handleInputChange("enrollmentNotifications", e.target.checked)}
              />
              <Switch
                label="Payment Notifications"
                hint="Send notifications for payment activities"
                checked={formData.paymentNotifications}
                onChange={(e) => handleInputChange("paymentNotifications", e.target.checked)}
              />
            </div>
          </div>
        );

      case "payments":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Currency"
                value={formData.currency}
                onChange={(e) => handleInputChange("currency", e.target.value)}
              >
                <option value="NPR">Nepalese Rupee (NPR)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="INR">Indian Rupee (INR)</option>
              </Select>
              <Input
                label="Tax Rate (%)"
                value={formData.taxRate}
                onChange={(e) => handleInputChange("taxRate", e.target.value)}
                placeholder="13"
              />
            </div>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Payment Methods</h3>
              <Switch
                label="Khalti"
                hint="Enable Khalti payment gateway"
                checked={formData.khaltiEnabled}
                onChange={(e) => handleInputChange("khaltiEnabled", e.target.checked)}
              />
              <Switch
                label="eSewa"
                hint="Enable eSewa payment gateway"
                checked={formData.esewaEnabled}
                onChange={(e) => handleInputChange("esewaEnabled", e.target.checked)}
              />
              <Switch
                label="Stripe"
                hint="Enable Stripe payment gateway"
                checked={formData.stripeEnabled}
                onChange={(e) => handleInputChange("stripeEnabled", e.target.checked)}
              />
              <Switch
                label="PayPal"
                hint="Enable PayPal payment gateway"
                checked={formData.paypalEnabled}
                onChange={(e) => handleInputChange("paypalEnabled", e.target.checked)}
              />
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Password Minimum Length"
                value={formData.passwordMinLength}
                onChange={(e) => handleInputChange("passwordMinLength", e.target.value)}
                type="number"
              />
              <Input
                label="Session Timeout (minutes)"
                value={formData.sessionTimeout}
                onChange={(e) => handleInputChange("sessionTimeout", e.target.value)}
                type="number"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Max Login Attempts"
                value={formData.loginAttempts}
                onChange={(e) => handleInputChange("loginAttempts", e.target.value)}
                type="number"
              />
            </div>
            <Separator />
            <div className="space-y-4">
              <Switch
                label="Two-Factor Authentication"
                hint="Require 2FA for admin accounts"
                checked={formData.twoFactorAuth}
                onChange={(e) => handleInputChange("twoFactorAuth", e.target.checked)}
              />
              <Switch
                label="IP Whitelist"
                hint="Restrict access to specific IP addresses"
                checked={formData.ipWhitelist}
                onChange={(e) => handleInputChange("ipWhitelist", e.target.checked)}
              />
              <Switch
                label="Audit Logging"
                hint="Log all admin actions for security"
                checked={formData.auditLogging}
                onChange={(e) => handleInputChange("auditLogging", e.target.checked)}
              />
            </div>
          </div>
        );

      case "courses":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Max File Size (MB)"
                value={formData.maxFileSize}
                onChange={(e) => handleInputChange("maxFileSize", e.target.value)}
                type="number"
              />
            </div>
            <Input
              label="Allowed File Types"
              value={formData.allowedFileTypes}
              onChange={(e) => handleInputChange("allowedFileTypes", e.target.value)}
              placeholder="pdf,doc,mp4,etc."
              hint="Comma-separated list of allowed file extensions"
            />
            <Separator />
            <div className="space-y-4">
              <Switch
                label="Auto-approve Courses"
                hint="Automatically approve new course submissions"
                checked={formData.autoApproveCourses}
                onChange={(e) => handleInputChange("autoApproveCourses", e.target.checked)}
              />
              <Switch
                label="Course Approval Required"
                hint="Require admin approval for new courses"
                checked={formData.courseApprovalRequired}
                onChange={(e) => handleInputChange("courseApprovalRequired", e.target.checked)}
              />
              <Switch
                label="Instructor Verification"
                hint="Require instructor verification before publishing"
                checked={formData.instructorVerification}
                onChange={(e) => handleInputChange("instructorVerification", e.target.checked)}
              />
            </div>
          </div>
        );

      case "users":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Switch
                label="Auto-enroll Students"
                hint="Automatically enroll students in courses"
                checked={formData.autoEnrollStudents}
                onChange={(e) => handleInputChange("autoEnrollStudents", e.target.checked)}
              />
              <Switch
                label="Email Verification"
                hint="Require email verification for new accounts"
                checked={formData.emailVerification}
                onChange={(e) => handleInputChange("emailVerification", e.target.checked)}
              />
              <Switch
                label="Profile Completion Required"
                hint="Require complete profile before access"
                checked={formData.profileCompletionRequired}
                onChange={(e) => handleInputChange("profileCompletionRequired", e.target.checked)}
              />
              <Switch
                label="Bulk User Import"
                hint="Allow bulk import of users via CSV"
                checked={formData.bulkUserImport}
                onChange={(e) => handleInputChange("bulkUserImport", e.target.checked)}
              />
              <Switch
                label="User Analytics"
                hint="Enable user behavior analytics"
                checked={formData.userAnalytics}
                onChange={(e) => handleInputChange("userAnalytics", e.target.checked)}
              />
            </div>
          </div>
        );

      case "social":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 py-2 px-3 rounded-md border border-[color:var(--color-neutral-200)] hover:border-[color:var(--color-primary-300)] transition-colors">
                <img
                  src="/images/social-medias/facebook.png"
                  alt="Facebook"
                  className="h-8 w-8 flex-shrink-0"
                />
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    value={formData.facebookUrl}
                    onChange={(e) => handleInputChange("facebookUrl", e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                  />
                  <CopyButton text={formData.facebookUrl} />
                </div>
              </div>

              <div className="flex items-center gap-3 py-2 px-3 rounded-md border border-[color:var(--color-neutral-200)] hover:border-[color:var(--color-primary-300)] transition-colors">
                <img
                  src="/images/social-medias/twitter.png"
                  alt="X"
                  className="h-8 w-8 flex-shrink-0"
                />
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    value={formData.xUrl}
                    onChange={(e) => handleInputChange("xUrl", e.target.value)}
                    placeholder="https://x.com/yourhandle"
                  />
                  <CopyButton text={formData.xUrl} />
                </div>
              </div>

              <div className="flex items-center gap-3 py-2 px-3 rounded-md border border-[color:var(--color-neutral-200)] hover:border-[color:var(--color-primary-300)] transition-colors">
                <img
                  src="/images/social-medias/instagram.png"
                  alt="Instagram"
                  className="h-8 w-8 flex-shrink-0"
                />
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    value={formData.instagramUrl}
                    onChange={(e) => handleInputChange("instagramUrl", e.target.value)}
                    placeholder="https://instagram.com/yourhandle"
                  />
                  <CopyButton text={formData.instagramUrl} />
                </div>
              </div>

              <div className="flex items-center gap-3 py-2 px-3 rounded-md border border-[color:var(--color-neutral-200)] hover:border-[color:var(--color-primary-300)] transition-colors">
                <img
                  src="/images/social-medias/linkedin.png"
                  alt="LinkedIn"
                  className="h-8 w-8 flex-shrink-0"
                />
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    value={formData.linkedinUrl}
                    onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                  <CopyButton text={formData.linkedinUrl} />
                </div>
              </div>

              <div className="flex items-center gap-3 py-2 px-3 rounded-md border border-[color:var(--color-neutral-200)] hover:border-[color:var(--color-primary-300)] transition-colors">
                <img
                  src="/images/social-medias/youtube.png"
                  alt="YouTube"
                  className="h-8 w-8 flex-shrink-0"
                />
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    value={formData.youtubeUrl}
                    onChange={(e) => handleInputChange("youtubeUrl", e.target.value)}
                    placeholder="https://youtube.com/channel/yourchannel"
                  />
                  <CopyButton text={formData.youtubeUrl} />
                </div>
              </div>

              <div className="flex items-center gap-3 py-2 px-3 rounded-md border border-[color:var(--color-neutral-200)] hover:border-[color:var(--color-primary-300)] transition-colors">
                <img
                  src="/images/social-medias/internet.png"
                  alt="Website"
                  className="h-8 w-8 flex-shrink-0"
                />
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    value={formData.websiteUrl}
                    onChange={(e) => handleInputChange("websiteUrl", e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                  <CopyButton text={formData.websiteUrl} />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Advanced Settings</h1>
          <p className="text-sm text-[color:var(--color-neutral-600)]">Configure advanced platform settings</p>
        </div>
        <Button size="sm" variant="secondary" onClick={handleSave}>
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => !tab.disabled && setActiveTab(tab.id)}
                      disabled={tab.disabled}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                        tab.disabled
                          ? "text-[color:var(--color-neutral-400)] cursor-not-allowed opacity-60"
                          : activeTab === tab.id
                          ? "bg-[color:var(--color-primary-50)] text-[color:var(--color-primary-700)]"
                          : "text-[color:var(--color-neutral-700)] hover:bg-[color:var(--color-neutral-50)]"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                {(() => {
                  const activeTabData = tabs.find(tab => tab.id === activeTab);
                  const IconComponent = activeTabData?.icon;
                  return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
                })()}
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h2>
            </CardHeader>
            <CardContent>
              {renderTabContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


