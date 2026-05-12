"use client";
import React from "react";
import Image from "next/image";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = React.useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const twitter = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const linkedin = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`;
  const messenger = `fb-messenger://share/?link=${encodedUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <a
        href={twitter}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X (Twitter)"
        className="h-10 w-10 rounded-full inline-flex items-center justify-center border border-[color:var(--color-neutral-200)] bg-white shadow-xs hover:bg-[color:var(--color-neutral-50)]"
      >
        <Image
          src="/images/social-medias/twitter.png"
          alt=""
          width={20}
          height={20}
          sizes="20px"
          className="object-contain"
          aria-hidden
        />
      </a>
      <a
        href={facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="h-10 w-10 rounded-full inline-flex items-center justify-center border border-[color:var(--color-neutral-200)] bg-white shadow-xs hover:bg-[color:var(--color-neutral-50)]"
      >
        <Image
          src="/images/social-medias/facebook.png"
          alt=""
          width={20}
          height={20}
          sizes="20px"
          className="object-contain"
          aria-hidden
        />
      </a>
      <a
        href={linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="h-10 w-10 rounded-full inline-flex items-center justify-center border border-[color:var(--color-neutral-200)] bg-white shadow-xs hover:bg-[color:var(--color-neutral-50)]"
      >
        <Image
          src="/images/social-medias/linkedin.png"
          alt=""
          width={20}
          height={20}
          sizes="20px"
          className="object-contain"
          aria-hidden
        />
      </a>
      <a
        href={messenger}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Messenger"
        className="h-10 w-10 rounded-full inline-flex items-center justify-center border border-[color:var(--color-neutral-200)] bg-white shadow-xs hover:bg-[color:var(--color-neutral-50)]"
      >
        <Image
          src="/images/social-medias/messenger.png"
          alt=""
          width={20}
          height={20}
          sizes="20px"
          className="object-contain"
          aria-hidden
        />
      </a>
      <button
        type="button"
        onClick={handleCopyLink}
        aria-label={copied ? "Link copied" : "Copy link"}
        className="h-10 w-10 rounded-full inline-flex items-center justify-center border border-[color:var(--color-neutral-200)] bg-white shadow-xs hover:bg-[color:var(--color-neutral-50)] transition-colors"
      >
        {copied ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[color:var(--color-green-600)]"
            aria-hidden
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[color:var(--color-neutral-700)]"
            aria-hidden
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
    </div>
  );
}
