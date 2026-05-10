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
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";

import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $insertNodes } from "lexical";

import theme from "./theme";
import ToolbarPlugin from "./ToolbarPlugin";

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
  const [isInitialized, setIsInitialized] = React.useState(false);

  useEffect(() => {
    if (!html || isInitialized) return;

    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(html, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      $getRoot().select();
      $insertNodes(nodes);
    });
    setIsInitialized(true);
  }, [editor, html, isInitialized]);

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
    CodeNode,
    CodeHighlightNode,
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
  return (
    <div className="rounded-lg border border-[color:var(--color-neutral-200)] bg-white overflow-hidden flex flex-col focus-within:ring-2 focus-within:ring-[color:var(--color-primary-200)] focus-within:border-[color:var(--color-primary-400)] transition-shadow relative">
      <LexicalComposer initialConfig={editorConfig}>
        <ToolbarPlugin />
        <div className="relative flex-1 min-h-[300px]">
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
          <InitialHtmlPlugin html={value} />
          {onChange && <HtmlOnChangePlugin onChange={onChange} />}
        </div>
      </LexicalComposer>
    </div>
  );
}
