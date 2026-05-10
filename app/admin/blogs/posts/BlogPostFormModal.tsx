"use client";
import React from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import LexicalEditor from "@/components/ui/LexicalEditor";
import { X } from "lucide-react";

export type BlogPostFormValues = {
  title: string;
  excerpt: string;
  content: string;
  featuredImageFile?: File | null;
  authorImageFile?: File | null;
  status: "unpublished" | "published";
  isFeatured: boolean;
  categoryId: string;
  author: string;
  tags: string[];
  estimatedReadTime: number | "";
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
};

type BlogCategory = {
  id: string;
  name: string;
};

type BlogPostFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: BlogPostFormValues) => void;
  title?: string;
  mode?: "create" | "edit";
  initialValues?: Partial<BlogPostFormValues>;
  initialImageUrl?: string;
  initialAuthorImageUrl?: string;
  availableCategories: BlogCategory[];
  isLoading?: boolean;
};

const DEFAULTS: BlogPostFormValues = {
  title: "",
  excerpt: "",
  content: "",
  featuredImageFile: null,
  authorImageFile: null,
  status: "unpublished",
  isFeatured: false,
  categoryId: "",
  author: "Team Octave",
  tags: [],
  estimatedReadTime: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
};

export default function BlogPostFormModal({
  open,
  onClose,
  onSubmit,
  title,
  mode = "create",
  initialValues,
  initialImageUrl,
  initialAuthorImageUrl,
  availableCategories,
  isLoading = false,
}: BlogPostFormModalProps) {
  const [values, setValues] = React.useState<BlogPostFormValues>({
    ...DEFAULTS,
    ...initialValues,
  });
  const [previewUrl, setPreviewUrl] = React.useState<string>(
    initialImageUrl || "",
  );
  const [authorPreviewUrl, setAuthorPreviewUrl] = React.useState<string>(
    initialAuthorImageUrl || "",
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const authorFileInputRef = React.useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = React.useState<
    "details" | "content" | "summary" | "media" | "status" | "seo"
  >("details");
  const [tagInput, setTagInput] = React.useState("");
  const tabs = React.useMemo(
    () =>
      [
        { key: "details", label: "Details" },
        { key: "content", label: "Content" },
        { key: "summary", label: "Summary" },
        { key: "media", label: "Media" },
        { key: "status", label: "Status" },
        { key: "seo", label: "SEO" },
      ] as const,
    [],
  );

  React.useEffect(() => {
    if (open) {
      setActiveTab("details");
    }
  }, [open]);

  React.useEffect(() => {
    if (open) {
      setValues({ ...DEFAULTS, ...initialValues });
      setPreviewUrl(initialImageUrl || "");
      setAuthorPreviewUrl(initialAuthorImageUrl || "");
    }
  }, [initialValues, initialImageUrl, initialAuthorImageUrl, open]);

  React.useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
      if (authorPreviewUrl?.startsWith("blob:"))
        URL.revokeObjectURL(authorPreviewUrl);
    };
  }, [previewUrl, authorPreviewUrl]);

  function handleChange<K extends keyof BlogPostFormValues>(
    key: K,
    value: BlogPostFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleChange("title", e.target.value);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    handleChange("featuredImageFile", file);
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(file ? URL.createObjectURL(file) : "");
  }

  function clearImage() {
    handleChange("featuredImageFile", null);
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleAuthorFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    handleChange("authorImageFile", file);
    if (authorPreviewUrl?.startsWith("blob:"))
      URL.revokeObjectURL(authorPreviewUrl);
    setAuthorPreviewUrl(file ? URL.createObjectURL(file) : "");
  }

  function clearAuthorImage() {
    handleChange("authorImageFile", null);
    if (authorPreviewUrl?.startsWith("blob:"))
      URL.revokeObjectURL(authorPreviewUrl);
    setAuthorPreviewUrl("");
    if (authorFileInputRef.current) authorFileInputRef.current.value = "";
  }

  function capitalizeFirstAlphabet(text: string): string {
    if (!text) return text;
    const first = text.charAt(0);
    if (/[a-zA-Z]/.test(first)) {
      return first.toUpperCase() + text.slice(1);
    }
    return text;
  }

  function addTag(name: string) {
    const trimmed = name.trim();
    const normalized = capitalizeFirstAlphabet(trimmed);
    if (!normalized) return;
    const exists = (values.tags || []).some(
      (t) => t.toLowerCase() === normalized.toLowerCase(),
    );
    if (exists) return;
    handleChange("tags", [...(values.tags || []), normalized]);
  }

  function removeTag(name: string) {
    handleChange(
      "tags",
      (values.tags || []).filter((t) => t.toLowerCase() !== name.toLowerCase()),
    );
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
  }

  const disabled = !values.title || !values.categoryId || !values.author;

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
      title={title ?? (mode === "edit" ? "Edit Blog Post" : "Create Blog Post")}
      panelClassName="max-w-3xl md:max-w-4xl lg:max-w-5xl max-h-[90vh]"
    >
      <form
        onSubmit={handleFormSubmit}
        noValidate
        className="space-y-5 text-sm"
      >
        <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1">
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
                  value={values.title}
                  onChange={handleTitleChange}
                  placeholder="Blog post title"
                  label="Title"
                  required
                />
              </div>
              <div>
                <Select
                  value={values.categoryId}
                  onChange={(e) => handleChange("categoryId", e.target.value)}
                  label="Category"
                  required
                >
                  <option value="">Select category</option>
                  {availableCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Input
                  value={values.author}
                  onChange={(e) => handleChange("author", e.target.value)}
                  placeholder="Author name"
                  label="Author"
                  required
                />
              </div>
              <div>
                <Input
                  value={values.estimatedReadTime}
                  onChange={(e) =>
                    handleChange(
                      "estimatedReadTime",
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  type="number"
                  min={1}
                  placeholder="e.g. 5"
                  label="Estimated read time (mins)"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "content" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-medium text-[color:var(--foreground)] mb-1">
                  Content
                </label>
                <LexicalEditor
                  value={values.content}
                  onChange={(html) => handleChange("content", html)}
                />
                <p className="mt-1 text-[11px] text-[color:var(--color-neutral-500)]">
                  Use the rich text editor to format your content.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "summary" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <Textarea
                value={values.excerpt}
                onChange={(e) => handleChange("excerpt", e.target.value)}
                placeholder="Brief description of the post"
                label="Excerpt"
                hint="This will be displayed in post previews and search results."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[color:var(--foreground)]">
                Tags
              </label>
              {values.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {values.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-sm gap-1.5 px-3 py-1.5"
                    >
                      {tag}
                      <button
                        type="button"
                        aria-label="Remove tag"
                        title="Remove"
                        className="group inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full p-0 border-0 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary-200)] hover:bg-[color:var(--color-primary-50)]"
                        onClick={() => removeTag(tag)}
                      >
                        <X
                          className="h-3.5 w-3.5 text-[color:var(--color-neutral-500)] group-hover:text-[color:var(--color-neutral-800)]"
                          aria-hidden
                        />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-[color:var(--color-neutral-500)]">
                  No tags added
                </p>
              )}
              <div>
                <Input
                  placeholder="Type tag and press Enter"
                  hint="Add relevant tags for this post."
                  value={tagInput}
                  onChange={(e) =>
                    setTagInput(capitalizeFirstAlphabet(e.target.value))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(tagInput);
                      setTagInput("");
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "media" && (
          <div className="space-y-3">
            <div className="rounded-lg border border-dashed border-[color:var(--color-neutral-300)] bg-[color:var(--color-neutral-50)] p-3">
              <label
                htmlFor="post-image-input"
                className="block text-xs text-[color:var(--color-neutral-600)] mb-2"
              >
                Featured Image
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
                    Upload a featured image for this blog post.
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="post-image-input"
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
                    PNG or JPG. Recommended: 1200x600px for best display.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-dashed border-[color:var(--color-neutral-300)] bg-[color:var(--color-neutral-50)] p-3">
              <label
                htmlFor="author-image-input"
                className="block text-xs text-[color:var(--color-neutral-600)] mb-2"
              >
                Author Image
              </label>
              <div className="flex items-center gap-3">
                {authorPreviewUrl ? (
                  <img
                    src={authorPreviewUrl}
                    alt="Preview"
                    className="h-16 w-16 rounded-full object-cover ring-1 ring-[color:var(--color-neutral-200)]"
                  />
                ) : (
                  <div className="h-16 w-16 flex items-center justify-center rounded-full bg-white text-[color:var(--color-neutral-400)] ring-1 ring-[color:var(--color-neutral-200)]">
                    No image
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-xs text-[color:var(--color-neutral-600)]">
                    Upload a profile picture for the author.
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      ref={authorFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAuthorFileChange}
                      className="hidden"
                      id="author-image-input"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => authorFileInputRef.current?.click()}
                    >
                      Browse
                    </Button>
                    {authorPreviewUrl && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={clearAuthorImage}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <p className="mt-1 text-[10px] text-[color:var(--color-neutral-500)]">
                    Square PNG or JPG. Recommended: 256x256px.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "status" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Select
                  value={values.status}
                  onChange={(e) =>
                    handleChange(
                      "status",
                      e.target.value as BlogPostFormValues["status"],
                    )
                  }
                  label="Status"
                  hint="Draft posts are not visible to users."
                >
                  <option value="published">Published</option>
                  <option value="unpublished">Unpublished</option>
                </Select>
              </div>
              <div>
                <Select
                  value={values.isFeatured ? "Featured" : "Not Featured"}
                  onChange={(e) =>
                    handleChange("isFeatured", e.target.value === "Featured")
                  }
                  label="Featured"
                  hint="Featured posts appear prominently on the site."
                >
                  <option value="Not Featured">Not Featured</option>
                  <option value="Featured">Featured</option>
                </Select>
              </div>
            </div>
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
                ? mode === "edit"
                  ? "Saving..."
                  : "Creating..."
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
