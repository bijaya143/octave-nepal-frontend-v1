"use client";
import React from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "../../lib/cn";

type AvatarProps = Omit<ImageProps, "src" | "alt"> & {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
  fallbackIcon?: React.ReactNode;
};

export default function Avatar({
  src,
  alt,
  fallbackSrc = "https://www.gravatar.com/avatar/?d=mp&s=256", // Default fallback
  fallbackIcon,
  className,
  unoptimized = true, // Default to unoptimized to prevent 500 errors on large S3 images as per previous fix
  ...props
}: AvatarProps) {
  const [hasError, setHasError] = React.useState(false);

  // Reset error if src changes
  React.useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    if (fallbackIcon) {
      return (
        <div
          className={cn(
            "flex items-center justify-center bg-[color:var(--color-neutral-100)] text-[color:var(--color-neutral-400)]",
            className
          )}
        >
          {fallbackIcon}
        </div>
      );
    }
    // Render fallback image
    return (
      <Image
        src={fallbackSrc}
        alt={alt}
        className={className}
        unoptimized={unoptimized}
        {...props}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      unoptimized={unoptimized}
      {...props}
    />
  );
}
