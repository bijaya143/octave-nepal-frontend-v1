export const editorTheme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "editor-placeholder text-gray-400 absolute top-[15px] left-[15px] overflow-hidden truncate pointer-events-none",
  paragraph: "m-0 mb-2 leading-relaxed text-[color:var(--color-neutral-800)]",
  quote: "m-0 ml-5 text-[color:var(--color-neutral-600)] border-l-4 border-[color:var(--color-neutral-300)] pl-4",
  heading: {
    h1: "text-2xl font-semibold m-0 mt-6 mb-4 text-[color:var(--color-neutral-900)]",
    h2: "text-xl font-medium m-0 mt-5 mb-3 text-[color:var(--color-neutral-900)]",
    h3: "text-lg font-medium m-0 mt-4 mb-2 text-[color:var(--color-neutral-900)]",
    h4: "text-base font-medium m-0 mt-3 mb-2 text-[color:var(--color-neutral-900)]",
    h5: "text-sm font-medium m-0 mt-2 mb-1 text-[color:var(--color-neutral-900)]",
    h6: "text-xs font-medium m-0 mt-2 mb-1 text-[color:var(--color-neutral-900)]",
  },
  list: {
    nested: {
      listitem: "list-none",
    },
    ol: "m-0 p-0 ml-4 mb-4 list-decimal text-[color:var(--color-neutral-800)]",
    ul: "m-0 p-0 ml-4 mb-4 list-disc text-[color:var(--color-neutral-800)]",
    listitem: "m-0 ml-4 mb-1",
    olDepth: [
      "m-0 p-0",
      "m-0 p-0",
      "m-0 p-0",
      "m-0 p-0",
      "m-0 p-0",
    ],
  },
  image: "editor-image max-w-full rounded-md",
  link: "text-[color:var(--color-primary-600)] underline hover:text-[color:var(--color-primary-800)]",
  text: {
    bold: "font-bold",
    italic: "italic",
    overflowed: "editor-text-overflowed",
    hashtag: "editor-text-hashtag text-[color:var(--color-primary-600)]",
    underline: "underline",
    strikethrough: "line-through",
    underlineStrikethrough: "underline line-through",
    code: "bg-[color:var(--color-neutral-100)] text-sm font-mono px-1.5 py-0.5 rounded text-[color:var(--color-neutral-800)]",
  },
};

export default editorTheme;
