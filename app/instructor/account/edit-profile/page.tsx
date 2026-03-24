"use client";
import React from "react";
import Card, {
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import Image from "next/image";

export default function InstructorEditProfilePage() {
  const router = useRouter();

  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [headline, setHeadline] = React.useState("");
  const [experience, setExperience] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [socialLinks, setSocialLinks] = React.useState<
    { id: string; platform: string; url: string }[]
  >([]);

  const [avatarPreviewUrl, setAvatarPreviewUrl] = React.useState<string | null>(
    null
  );
  const avatarUrlRef = React.useRef<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    return () => {
      if (avatarUrlRef.current) URL.revokeObjectURL(avatarUrlRef.current);
    };
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (avatarUrlRef.current) URL.revokeObjectURL(avatarUrlRef.current);
    const url = URL.createObjectURL(file);
    avatarUrlRef.current = url;
    setAvatarPreviewUrl(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with API call to update instructor profile
    // Minimal client-only feedback for now
    alert("Profile updated");
  };

  const platforms = [
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

  function addSocialLink() {
    setSocialLinks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), platform: platforms[0].value, url: "" },
    ]);
  }

  function updateSocialLink(
    id: string,
    patch: Partial<{ platform: string; url: string }>
  ) {
    setSocialLinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  }

  function removeSocialLink(id: string) {
    setSocialLinks((prev) => prev.filter((item) => item.id !== id));
  }

  function PlatformPicker({
    value,
    onChange,
  }: {
    value: string;
    onChange: (next: string) => void;
  }) {
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef<HTMLDivElement | null>(null);
    const current = platforms.find((p) => p.value === value) || platforms[0];

    React.useEffect(() => {
      function onDocClick(e: MouseEvent) {
        if (!ref.current) return;
        const target = e.target as Node;
        if (!ref.current.contains(target)) setOpen(false);
      }
      document.addEventListener("mousedown", onDocClick);
      return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    return (
      <div className="relative" ref={ref}>
        <button
          type="button"
          className="h-11 w-full rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 shadow-xs hover:bg-[color:var(--color-neutral-50)] inline-flex items-center justify-between gap-2"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="inline-flex items-center gap-2 text-sm">
            <Image
              src={current.icon}
              alt=""
              width={18}
              height={18}
              className="h-[18px] w-[18px] object-contain"
              aria-hidden
            />
            {current.value}
          </span>
          <svg
            className="h-4 w-4 text-[color:var(--color-neutral-500)]"
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
        {open && (
          <div
            role="listbox"
            className="absolute z-50 mt-1 w-full rounded-lg border border-[color:var(--color-neutral-200)] bg-white shadow-md"
          >
            <ul className="py-1 max-h-64 overflow-auto">
              {platforms.map((p) => (
                <li key={p.value}>
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-left hover:bg-[color:var(--color-neutral-50)] inline-flex items-center gap-2 text-sm"
                    onClick={() => {
                      onChange(p.value);
                      setOpen(false);
                    }}
                    role="option"
                    aria-selected={p.value === value}
                  >
                    <Image
                      src={p.icon}
                      alt=""
                      width={18}
                      height={18}
                      className="h-[18px] w-[18px] object-contain"
                      aria-hidden
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

  return (
    <>
      <div className="mb-5 w-full max-w-xl md:max-w-2xl mx-auto">
        <div>
          <h1
            className="text-xl md:text-2xl font-semibold"
            style={{ fontFamily: "var(--font-heading-sans)" }}
          >
            Edit profile
          </h1>
          <p className="text-sm text-[color:var(--color-neutral-600)]">
            Keep your public details up to date for students.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-5 md:gap-6 w-full max-w-xl sm:max-w-xl md:max-w-2xl lg:max-w-2xl mx-auto"
      >
        <Card>
          <CardHeader>
            <h2
              className="text-base font-semibold"
              style={{ fontFamily: "var(--font-heading-sans)" }}
            >
              Profile information
            </h2>
            <p className="mt-1 text-sm text-[color:var(--color-neutral-600)]">
              Your name, contact and public bio.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="py-1">
              <div className="flex items-center justify-center">
                <div className="relative h-20 w-20 md:h-24 md:w-24">
                  <div className="h-full w-full rounded-full bg-[color:var(--color-neutral-200)] overflow-hidden flex items-center justify-center">
                    {avatarPreviewUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarPreviewUrl}
                        alt="Avatar preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-sm text-[color:var(--color-neutral-600)]">
                        No image
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    aria-label="Change avatar"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full border border-[color:var(--color-neutral-200)] bg-white text-[color:var(--color-primary-700)] hover:bg-[color:var(--color-neutral-50)] shadow-xs inline-flex items-center justify-center"
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
              </div>
              <p className="mt-2 text-center text-xs text-[color:var(--color-neutral-500)]">
                PNG or JPG up to 2MB.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Full name"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.currentTarget.value)}
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Phone number"
                type="tel"
                inputMode="tel"
                placeholder="+1 555 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.currentTarget.value)}
              />
              <Input
                label="Role"
                placeholder="Senior Web Instructor"
                value={headline}
                onChange={(e) => setHeadline(e.currentTarget.value)}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Experience"
                placeholder="5"
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                value={experience}
                onChange={(e) => setExperience(e.currentTarget.value)}
              />
              <Input
                label="Address"
                placeholder="123 Main St, Anytown, USA"
                value={address}
                onChange={(e) => setAddress(e.currentTarget.value)}
              />
            </div>

            <Textarea
              label="Bio"
              placeholder="Tell students about yourself, your experience, and what you teach."
              value={bio}
              onChange={(e) => setBio(e.currentTarget.value)}
              rows={6}
            />
            <div className="space-y-2">
              <div className="text-sm font-medium text-[color:var(--foreground)]">
                Social profiles
              </div>
              <div className="space-y-3">
                {socialLinks.map((item) => {
                  const current =
                    platforms.find((p) => p.value === item.platform) ||
                    platforms[0];
                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-1 sm:grid-cols-[160px_1fr_auto] gap-2 items-center"
                    >
                      <PlatformPicker
                        value={item.platform}
                        onChange={(next) =>
                          updateSocialLink(item.id, { platform: next })
                        }
                      />
                      <Input
                        type="url"
                        placeholder={current.placeholder}
                        value={item.url}
                        onChange={(e) =>
                          updateSocialLink(item.id, {
                            url: e.currentTarget.value,
                          })
                        }
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="md"
                        onClick={() => removeSocialLink(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  );
                })}
                <div>
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
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
