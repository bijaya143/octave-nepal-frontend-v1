"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { mergeRegister } from "@lexical/utils";
import { Link2, X } from "lucide-react";

export default function FloatingLinkPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isVisible, setIsVisible] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const floatRef = useRef<HTMLDivElement>(null);

  const updateFloatingLink = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = selection.anchor.getNode();
      const parent = node.getParent();
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL());
        setIsVisible(true);
        return;
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
        setIsVisible(true);
        return;
      }
    }
    setIsVisible(false);
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        editor.getEditorState().read(() => {
          updateFloatingLink();
        });
      }),
    );
  }, [editor, updateFloatingLink]);

  const handleRemoveLink = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    setIsVisible(false);
  };

  return (
    <>
      {isVisible && (
        <div
          ref={floatRef}
          className="absolute z-30 flex items-center gap-2 p-2 bg-white rounded-md shadow-lg border border-[color:var(--color-neutral-200)]"
          style={{
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Link2 size={16} className="text-[color:var(--color-neutral-600)]" />
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[color:var(--color-primary-600)] hover:underline max-w-[200px] truncate"
          >
            {linkUrl}
          </a>
          <button
            onClick={handleRemoveLink}
            className="p-1 hover:bg-[color:var(--color-neutral-100)] rounded"
            type="button"
          >
            <X size={14} className="text-[color:var(--color-neutral-600)]" />
          </button>
        </div>
      )}
    </>
  );
}
