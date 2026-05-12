"use client";

import React, { useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";

import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $insertNodes } from "lexical";

import theme from "./theme";
import ToolbarPlugin from "./ToolbarPlugin";
import FloatingLinkPlugin from "./FloatingLinkPlugin";

function HtmlOnChangePlugin({
  onChange,
}: {
  onChange: (html: string) => void;
}) {
  const [editor] = useLexicalComposerContext();
  return (
    <OnChangePlugin
      onChange={(editorState) => {
        editorState.read(() => {
          const html = $generateHtmlFromNodes(editor, null);
          onChange(html);
        });
      }}
    />
  );
}

function InitialHtmlPlugin({ html }: { html: string }) {
  const [editor] = useLexicalComposerContext();
  const isInitializedRef = React.useRef(false);

  useEffect(() => {
    if (!html || isInitializedRef.current) return;

    editor.update(() => {
      const root = $getRoot();
      root.clear();
      const parser = new DOMParser();
      const dom = parser.parseFromString(html, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      $insertNodes(nodes);
    });
    isInitializedRef.current = true;
  }, [editor, html]);

  return null;
}

function Placeholder() {
  return (
    <div className="absolute top-[80px] left-4 text-[color:var(--color-neutral-400)] pointer-events-none text-sm">
      Write your blog post content here...
    </div>
  );
}

const editorConfig = {
  namespace: "BlogPostEditor",
  theme,
  onError(error: Error) {
    console.error(error);
  },
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    AutoLinkNode,
    LinkNode,
  ],
};

type LexicalEditorProps = {
  value?: string;
  onChange?: (html: string) => void;
};

export default function LexicalEditor({
  value = "",
  onChange,
}: LexicalEditorProps) {
  const [initialValue] = React.useState(value);

  return (
    <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white overflow-hidden flex flex-col focus-within:ring-2 focus-within:ring-[color:var(--color-primary-200)] focus-within:border-[color:var(--color-primary-400)] transition-shadow relative">
      <LexicalComposer initialConfig={editorConfig}>
        <ToolbarPlugin />
        <div className="relative min-h-[300px] max-h-[500px] overflow-y-auto">
          <FloatingLinkPlugin />
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[300px] outline-none p-4 text-sm text-[color:var(--color-neutral-800)]" />
            }
            placeholder={<Placeholder />}
            ErrorBoundary={
              LexicalErrorBoundary as unknown as React.ComponentType<any>
            }
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <InitialHtmlPlugin html={initialValue} />
          {onChange && <HtmlOnChangePlugin onChange={onChange} />}
        </div>
      </LexicalComposer>
    </div>
  );
}
