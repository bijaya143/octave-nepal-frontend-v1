"use client";
import React from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { adminTagService } from "@/lib/services/admin/tag";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/*
 * We'll use a local Tag definition or can import from services if desired.
 * For FormValues, we need to store the array of tags.
 */
type Tag = {
  id: string;
  name: string;
};

export type CategoryFormValues = {
  name: string;
  slug: string;
  image?: File | null;
  icon?: File | null;
  description: string;
  isPublished: boolean;
  tags: Tag[];
};

type CategoryFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CategoryFormValues) => void;
  title?: string;
  mode?: "create" | "edit";
  initialValues?: Partial<CategoryFormValues>;
  initialImageUrl?: string; // for edit preview
  initialIconUrl?: string; // for edit preview
  isLoading?: boolean;
};

const DEFAULTS: CategoryFormValues = {
  name: "",
  slug: "",
  image: null,
  icon: null,
  description: "",
  isPublished: true,
  tags: [],
};

const TAG_PAGE_SIZE = 10;

export default function CategoryFormModal({
  open,
  onClose,
  onSubmit,
  title,
  mode = "create",
  initialValues,
  initialImageUrl,
  initialIconUrl,
  isLoading = false,
}: CategoryFormModalProps) {
  const [values, setValues] = React.useState<CategoryFormValues>({
    ...DEFAULTS,
    ...initialValues,
  });
  const [previewUrl, setPreviewUrl] = React.useState<string>(
    initialImageUrl || ""
  );
  const [previewIconUrl, setPreviewIconUrl] = React.useState<string>(
    initialIconUrl || ""
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const iconInputRef = React.useRef<HTMLInputElement>(null);
  const [isTagMenuOpen, setIsTagMenuOpen] = React.useState(false);
  const tagMenuRef = React.useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = React.useState<
    "details" | "media" | "visibility"
  >("details");
  const tabs = React.useMemo(
    () =>
      [
        { key: "details", label: "Details" },
        { key: "media", label: "Media" },
        { key: "visibility", label: "Visibility" },
      ] as const,
    []
  );

  // Tag states
  const [tagList, setTagList] = React.useState<Tag[]>([]);
  const [tagSearch, setTagSearch] = React.useState("");
  const [tagPage, setTagPage] = React.useState(1);
  const [hasMoreTags, setHasMoreTags] = React.useState(true);
  const [isLoadingTags, setIsLoadingTags] = React.useState(false);

  // Reset UI state when modal opens
  React.useEffect(() => {
    if (open) {
      setActiveTab("details");
      setTagSearch("");
    }
  }, [open]);

  // Sync data when modal opens or props change
  React.useEffect(() => {
    if (open) {
      setValues({ ...DEFAULTS, ...initialValues });
      setPreviewUrl(initialImageUrl || "");
      setPreviewIconUrl(initialIconUrl || "");
    }
  }, [open, initialValues, initialImageUrl, initialIconUrl]);

  React.useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  React.useEffect(() => {
    return () => {
      if (previewIconUrl?.startsWith("blob:"))
        URL.revokeObjectURL(previewIconUrl);
    };
  }, [previewIconUrl]);

  // Fetch tags
  const fetchTags = React.useCallback(
    async (page: number, search: string, reset = false) => {
      try {
        setIsLoadingTags(true);
        const response = await adminTagService.list({
          page,
          limit: TAG_PAGE_SIZE,
          isPublished: true,
          keyword: search || undefined,
        });

        if (response.success) {
          const newTags = response.data.data.map((t) => ({
            id: t.id,
            name: t.name,
          }));
          setTagList((prev) => (reset ? newTags : [...prev, ...newTags]));
          const totalPages = Math.ceil(
            response.data.meta.total / response.data.meta.limit
          );
          setHasMoreTags(response.data.meta.page < totalPages);
        }
      } catch (error) {
        console.error("Failed to fetch tags", error);
      } finally {
        setIsLoadingTags(false);
      }
    },
    []
  );

  // Initial fetch and search effect
  React.useEffect(() => {
    if (isTagMenuOpen) {
      setTagPage(1);
      fetchTags(1, tagSearch, true);
    }
  }, [isTagMenuOpen, tagSearch, fetchTags]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMoreTags &&
      !isLoadingTags
    ) {
      const nextPage = tagPage + 1;
      setTagPage(nextPage);
      fetchTags(nextPage, tagSearch);
    }
  };

  // close tags menu on outside click / Esc
  React.useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      if (!isTagMenuOpen) return;
      if (
        tagMenuRef.current &&
        !tagMenuRef.current.contains(e.target as Node)
      ) {
        setIsTagMenuOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsTagMenuOpen(false);
    }
    document.addEventListener("mousedown", handleDocClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isTagMenuOpen]);

  // ensure tag dropdown closes when leaving the Details tab (where tags live)
  React.useEffect(() => {
    if (activeTab !== "details") setIsTagMenuOpen(false);
  }, [activeTab]);

  function handleChange<K extends keyof CategoryFormValues>(
    key: K,
    value: CategoryFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value;
    handleChange("name", name);
    if (!initialValues?.slug) {
      handleChange("slug", slugify(name));
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    handleChange("image", file);
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(file ? URL.createObjectURL(file) : "");
  }

  function handleIconFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    handleChange("icon", file);
    if (previewIconUrl?.startsWith("blob:"))
      URL.revokeObjectURL(previewIconUrl);
    setPreviewIconUrl(file ? URL.createObjectURL(file) : "");
  }

  function isTagSelected(id: string) {
    return values.tags.some((t) => t.id === id);
  }

  function toggleTag(tag: Tag) {
    handleChange(
      "tags",
      isTagSelected(tag.id)
        ? values.tags.filter((t) => t.id !== tag.id)
        : [...values.tags, tag]
    );
  }

  function clearImage() {
    handleChange("image", null);
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function clearIcon() {
    handleChange("icon", null);
    if (previewIconUrl?.startsWith("blob:"))
      URL.revokeObjectURL(previewIconUrl);
    setPreviewIconUrl("");
    if (iconInputRef.current) iconInputRef.current.value = "";
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
  }

  const disabled = !values.name || !values.slug;

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
      title={title ?? (mode === "edit" ? "Edit Category" : "Create Category")}
    >
      <form
        onSubmit={handleFormSubmit}
        noValidate
        className="space-y-5 text-sm"
      >
        <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white p-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-1">
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
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Name"
                value={values.name}
                onChange={handleNameChange}
                placeholder="Category name"
                required
              />
              <div>
                <Input
                  label="Slug"
                  value={values.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                  placeholder="category-slug"
                  required
                />
                <div className="mt-1 inline-flex items-center gap-1 rounded-md border border-[color:var(--color-neutral-200)] bg-white px-2 py-0.5 font-mono text-[11px] text-[color:var(--color-neutral-700)]">
                  /{values.slug || "your-slug"}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-xs font-medium text-[color:var(--color-neutral-700)]">
                Tags
              </div>
              {values.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {values.tags.map((t) => (
                    <Badge key={t.id} variant="outline" className="text-[11px]">
                      {t.name || t.id}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-[color:var(--color-neutral-500)]">
                  No tags selected
                </p>
              )}
              <div className="relative" ref={tagMenuRef}>
                <button
                  type="button"
                  className="h-11 w-full rounded-lg bg-white border pr-9 px-3 text-left text-[color:var(--foreground)] border-[color:var(--color-neutral-200)] focus:border-[color:var(--color-primary-400)] shadow-xs focus:shadow-sm transition-all"
                  onClick={() => setIsTagMenuOpen((v) => !v)}
                >
                  <span className="block truncate text-[color:var(--color-neutral-700)]">
                    {values.tags.length > 0
                      ? values.tags.map((t) => t.name || t.id).join(", ")
                      : "Select tags"}
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
                {isTagMenuOpen && (
                  <div
                    className="absolute z-50 mt-1 w-full rounded-lg border border-[color:var(--color-neutral-200)] bg-white shadow-md max-h-56 overflow-y-auto scroll-elegant"
                    onScroll={handleScroll}
                  >
                    <div className="p-2 border-b border-[color:var(--color-neutral-200)] sticky top-0 bg-white z-10">
                      <div className="relative">
                        <Input
                          value={tagSearch}
                          onChange={(e) => setTagSearch(e.target.value)}
                          placeholder="Search tags"
                          className="[&_input]:pr-8"
                        />
                        {tagSearch && (
                          <button
                            type="button"
                            aria-label="Clear search"
                            title="Clear search"
                            onClick={() => setTagSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--color-neutral-500)] hover:text-[color:var(--color-neutral-700)]"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                    <ul className="py-1">
                      {tagList.length === 0 && !isLoadingTags ? (
                        <li className="px-3 py-2 text-[12px] text-[color:var(--color-neutral-500)]">
                          No tags found
                        </li>
                      ) : (
                        tagList.map((tag) => {
                          const selected = isTagSelected(tag.id);
                          return (
                            <li
                              key={tag.id}
                              className="px-3 py-2 hover:bg-[color:var(--color-neutral-50)]"
                            >
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  onChange={() => toggleTag(tag)}
                                  className="h-4 w-4"
                                />
                                <span className="text-sm">{tag.name}</span>
                              </label>
                            </li>
                          );
                        })
                      )}
                      {isLoadingTags && (
                        <li className="px-3 py-2 text-[12px] text-center text-[color:var(--color-neutral-500)]">
                          Loading...
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Textarea
                label="Description"
                value={values.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Short description"
                rows={3}
              />
            </div>
          </div>
        )}

        {activeTab === "media" && (
          <div className="space-y-3">
            <div className="rounded-lg border border-dashed border-[color:var(--color-neutral-300)] bg-[color:var(--color-neutral-50)] p-3">
              <label
                htmlFor="category-image-input"
                className="block text-xs text-[color:var(--color-neutral-600)] mb-2"
              >
                Category Image
              </label>
              <div className="flex items-center gap-3">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-20 w-20 rounded-lg object-cover ring-1 ring-[color:var(--color-neutral-200)]"
                  />
                ) : (
                  <div className="h-20 w-20 flex items-center justify-center rounded-lg bg-white text-[color:var(--color-neutral-400)] ring-1 ring-[color:var(--color-neutral-200)]">
                    No image
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-xs text-[color:var(--color-neutral-600)]">
                    Upload a square image for this category.
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="category-image-input"
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

            <div className="rounded-lg border border-dashed border-[color:var(--color-neutral-300)] bg-[color:var(--color-neutral-50)] p-3">
              <label
                htmlFor="category-icon-input"
                className="block text-xs text-[color:var(--color-neutral-600)] mb-2"
              >
                Category Icon
              </label>
              <div className="flex items-center gap-3">
                {previewIconUrl ? (
                  <img
                    src={previewIconUrl}
                    alt="Icon preview"
                    className="h-20 w-20 rounded-lg object-cover ring-1 ring-[color:var(--color-neutral-200)]"
                  />
                ) : (
                  <div className="h-20 w-20 flex items-center justify-center rounded-lg bg-white text-[color:var(--color-neutral-400)] ring-1 ring-[color:var(--color-neutral-200)]">
                    No icon
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-xs text-[color:var(--color-neutral-600)]">
                    Upload a square icon for this category.
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      ref={iconInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleIconFileChange}
                      className="hidden"
                      id="category-icon-input"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => iconInputRef.current?.click()}
                    >
                      Browse
                    </Button>
                    {previewIconUrl && (
                      <Button
                        type="button"
                        variant="secondary"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={clearIcon}
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
          </div>
        )}

        {activeTab === "visibility" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Status"
                hint="Controls whether this category is visible to users."
                value={values.isPublished ? "Published" : "Unpublished"}
                onChange={(e) =>
                  handleChange("isPublished", e.target.value === "Published")
                }
              >
                <option value="Published">Published</option>
                <option value="Unpublished">Unpublished</option>
              </Select>
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
              onClick={() => {
                const cleaned: CategoryFormValues = {
                  ...values,
                  slug: values.slug || slugify(values.name),
                };
                onSubmit(cleaned);
              }}
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
