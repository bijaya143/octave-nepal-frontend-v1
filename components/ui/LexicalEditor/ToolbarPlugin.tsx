import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  UNDO_COMMAND,
  REDO_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
} from "lexical";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $setBlocksType } from "@lexical/selection";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from "@lexical/list";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from "@lexical/rich-text";

import {
  Strikethrough,
  Subscript,
  Superscript,
  Highlighter,
  ChevronDown,
  Code,
  Link,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Quote,
  List,
  ListOrdered,
} from "lucide-react";

const LowPriority = 1;

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isHighlight, setIsHighlight] = useState(false);
  const [align, setAlign] = useState("left");

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type);
        }
      }

      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsSubscript(selection.hasFormat("subscript"));
      setIsSuperscript(selection.hasFormat("superscript"));
      setIsHighlight(selection.hasFormat("highlight"));
      setIsCode(selection.hasFormat("code"));

      const node = selection.anchor.getNode();
      const parent = node.getParent();
      setIsLink($isLinkNode(parent) || $isLinkNode(node));

      let alignment = "left";
      if (
        $isRangeSelection(selection) &&
        typeof (element as any).getFormatType === "function"
      ) {
        alignment = (element as any).getFormatType() || "left";
      }
      setAlign(alignment);
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          updateToolbar();
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [editor, updateToolbar]);

  const insertLink = useCallback(() => {
    if (!isLink) {
      const url = prompt("Enter URL:", "https://");
      if (url) {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
      }
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const formatBlock = (type: string) => {
    if (blockType === type) return;

    if (type === "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      return;
    }
    if (type === "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      return;
    }

    if (blockType === "ul" || blockType === "ol") {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }

    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (type === "paragraph") {
          $setBlocksType(selection, () => $createParagraphNode());
        } else if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(type)) {
          $setBlocksType(selection, () => $createHeadingNode(type as any));
        } else if (type === "quote") {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      }
    });
  };

  const Button = ({ active, disabled, onClick, children, title }: any) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded text-[color:var(--color-neutral-700)] transition-colors ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-[color:var(--color-neutral-200)]"
      } ${
        active && !disabled
          ? "bg-[color:var(--color-primary-100)] text-[color:var(--color-primary-700)] shadow-inner"
          : ""
      }`}
      title={title}
      aria-label={title}
    >
      {children}
    </button>
  );

  const [isAaOpen, setIsAaOpen] = useState(false);
  const [isBlockOpen, setIsBlockOpen] = useState(false);
  const [isAlignOpen, setIsAlignOpen] = useState(false);

  const aaRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const alignRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (aaRef.current && !aaRef.current.contains(e.target as Node))
        setIsAaOpen(false);
      if (blockRef.current && !blockRef.current.contains(e.target as Node))
        setIsBlockOpen(false);
      if (alignRef.current && !alignRef.current.contains(e.target as Node))
        setIsAlignOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const DropdownItem = ({ active, onClick, icon, label, closeMenu }: any) => (
    <button
      type="button"
      onClick={(e) => {
        onClick(e);
        if (closeMenu) closeMenu();
      }}
      className={`px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-[color:var(--color-neutral-50)] text-left w-full ${
        active
          ? "bg-[color:var(--color-primary-50)] text-[color:var(--color-primary-700)]"
          : "text-[color:var(--color-neutral-700)]"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  const blockTypeToName: Record<string, string> = {
    paragraph: "Normal",
    h1: "Heading 1",
    h2: "Heading 2",
    h3: "Heading 3",
    h4: "Heading 4",
    h5: "Heading 5",
    h6: "Heading 6",
    quote: "Quote",
    ul: "Bulleted List",
    ol: "Numbered List",
  };

  const blockTypeToIcon: Record<string, any> = {
    paragraph: <Type size={16} />,
    h1: <Heading1 size={16} />,
    h2: <Heading2 size={16} />,
    h3: <Heading3 size={16} />,
    h4: <Heading4 size={16} />,
    h5: <Heading5 size={16} />,
    h6: <Heading6 size={16} />,
    quote: <Quote size={16} />,
    ul: <List size={16} />,
    ol: <ListOrdered size={16} />,
  };

  return (
    <div
      className="flex flex-wrap items-center gap-1 p-2 border-b border-[color:var(--color-neutral-200)] bg-[color:var(--color-neutral-50)] rounded-t-lg sticky top-0 z-10"
      ref={toolbarRef}
    >
      <Button
        disabled={!canUndo}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        title="Undo"
      >
        <Undo size={16} />
      </Button>
      <Button
        disabled={!canRedo}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        title="Redo"
      >
        <Redo size={16} />
      </Button>
      <div className="w-[1px] h-6 bg-[color:var(--color-neutral-300)] mx-1" />

      <div className="relative" ref={blockRef}>
        <button
          type="button"
          onClick={() => setIsBlockOpen(!isBlockOpen)}
          className={`px-2 py-1.5 rounded flex items-center justify-between gap-2 text-sm text-[color:var(--color-neutral-700)] transition-colors hover:bg-[color:var(--color-neutral-200)] w-36 ${isBlockOpen ? "bg-[color:var(--color-neutral-200)]" : ""}`}
        >
          <div className="flex items-center gap-2 truncate">
            {blockTypeToIcon[blockType] || <Type size={16} />}
            <span className="truncate">
              {blockTypeToName[blockType] || "Normal"}
            </span>
          </div>
          <ChevronDown size={14} className="shrink-0" />
        </button>
        {isBlockOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-[color:var(--color-neutral-200)] rounded-md shadow-lg flex flex-col z-20 py-1 max-h-64 overflow-y-auto">
            {Object.keys(blockTypeToName).map((type) => (
              <DropdownItem
                key={type}
                onClick={() => formatBlock(type)}
                active={blockType === type}
                icon={blockTypeToIcon[type]}
                label={blockTypeToName[type]}
                closeMenu={() => setIsBlockOpen(false)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="w-[1px] h-6 bg-[color:var(--color-neutral-300)] mx-1" />

      <Button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        active={isBold}
        title="Bold (Ctrl+B)"
      >
        <span className="font-bold">B</span>
      </Button>
      <Button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        active={isItalic}
        title="Italic (Ctrl+I)"
      >
        <span className="italic">I</span>
      </Button>
      <Button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        active={isUnderline}
        title="Underline (Ctrl+U)"
      >
        <span className="underline">U</span>
      </Button>

      <div className="relative" ref={aaRef}>
        <button
          type="button"
          onClick={() => setIsAaOpen(!isAaOpen)}
          className={`p-1.5 rounded flex items-center gap-0.5 text-[color:var(--color-neutral-700)] transition-colors hover:bg-[color:var(--color-neutral-200)] ${isAaOpen ? "bg-[color:var(--color-neutral-200)]" : ""}`}
          title="More Text Formatting"
        >
          Aa
          <ChevronDown size={14} />
        </button>
        {isAaOpen && (
          <div className="absolute top-full left-0 mt-1 min-w-[160px] bg-white border border-[color:var(--color-neutral-200)] rounded-md shadow-lg flex flex-col z-20 py-1">
            <DropdownItem
              onClick={() =>
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
              }
              active={isStrikethrough}
              icon={<Strikethrough size={16} />}
              label="Strikethrough"
              closeMenu={() => setIsAaOpen(false)}
            />
            <DropdownItem
              onClick={() =>
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript")
              }
              active={isSubscript}
              icon={<Subscript size={16} />}
              label="Subscript"
              closeMenu={() => setIsAaOpen(false)}
            />
            <DropdownItem
              onClick={() =>
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript")
              }
              active={isSuperscript}
              icon={<Superscript size={16} />}
              label="Superscript"
              closeMenu={() => setIsAaOpen(false)}
            />
            <DropdownItem
              onClick={() =>
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight")
              }
              active={isHighlight}
              icon={<Highlighter size={16} />}
              label="Highlight"
              closeMenu={() => setIsAaOpen(false)}
            />
          </div>
        )}
      </div>

      <Button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")}
        active={isCode}
        title="Insert Code"
      >
        <Code size={16} />
      </Button>
      <Button onClick={insertLink} active={isLink} title="Insert Link">
        <Link size={16} />
      </Button>

      <div className="w-[1px] h-6 bg-[color:var(--color-neutral-300)] mx-1" />

      <div className="relative" ref={alignRef}>
        <button
          type="button"
          onClick={() => setIsAlignOpen(!isAlignOpen)}
          className={`p-1.5 rounded flex items-center gap-0.5 text-[color:var(--color-neutral-700)] transition-colors hover:bg-[color:var(--color-neutral-200)] ${isAlignOpen ? "bg-[color:var(--color-neutral-200)]" : ""}`}
          title="Align"
        >
          {align === "left" && <AlignLeft size={16} />}
          {align === "center" && <AlignCenter size={16} />}
          {align === "right" && <AlignRight size={16} />}
          {align === "justify" && <AlignJustify size={16} />}
          <ChevronDown size={14} />
        </button>
        {isAlignOpen && (
          <div className="absolute top-full right-0 mt-1 min-w-[140px] bg-white border border-[color:var(--color-neutral-200)] rounded-md shadow-lg flex flex-col z-20 py-1">
            <DropdownItem
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
                setAlign("left");
              }}
              active={align === "left"}
              icon={<AlignLeft size={16} />}
              label="Left Align"
              closeMenu={() => setIsAlignOpen(false)}
            />
            <DropdownItem
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
                setAlign("center");
              }}
              active={align === "center"}
              icon={<AlignCenter size={16} />}
              label="Center Align"
              closeMenu={() => setIsAlignOpen(false)}
            />
            <DropdownItem
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
                setAlign("right");
              }}
              active={align === "right"}
              icon={<AlignRight size={16} />}
              label="Right Align"
              closeMenu={() => setIsAlignOpen(false)}
            />
            <DropdownItem
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
                setAlign("justify");
              }}
              active={align === "justify"}
              icon={<AlignJustify size={16} />}
              label="Justify Align"
              closeMenu={() => setIsAlignOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
