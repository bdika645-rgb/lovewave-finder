import { useState, useRef, useEffect, KeyboardEvent, FocusEvent } from "react";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { useLandingContent } from "@/contexts/LandingContentContext";

interface InlineEditableProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  placeholder?: string;
  multiline?: boolean;
}

/**
 * Inline editable text component - works like Word/Google Docs
 * Click on text and start typing to edit directly
 */
export default function InlineEditable({
  value,
  onChange,
  className,
  as: Tag = "span",
  placeholder = "לחץ לעריכה...",
  multiline = false,
}: InlineEditableProps) {
  const { isEditMode } = useLandingContent();
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const editableRef = useRef<HTMLElement>(null);

  // Sync local value with prop
  useEffect(() => {
    if (!isEditing) {
      setLocalValue(value);
    }
  }, [value, isEditing]);

  // Focus and select text when entering edit mode
  useEffect(() => {
    if (isEditing && editableRef.current) {
      editableRef.current.focus();
      // Select all text
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(editableRef.current);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditing]);

  const handleClick = () => {
    if (isEditMode && !isEditing) {
      setIsEditing(true);
    }
  };

  const handleBlur = (e: FocusEvent<HTMLElement>) => {
    if (isEditing) {
      const newValue = e.currentTarget.innerText || "";
      setIsEditing(false);
      if (newValue !== value) {
        onChange(newValue);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setLocalValue(value);
      if (editableRef.current) {
        editableRef.current.innerText = value;
      }
      setIsEditing(false);
    } else if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      editableRef.current?.blur();
    }
  };

  const handleInput = () => {
    if (editableRef.current) {
      setLocalValue(editableRef.current.innerText || "");
    }
  };

  // Non-edit mode: just render the text
  if (!isEditMode) {
    return <Tag className={className}>{value || placeholder}</Tag>;
  }

  // Edit mode: render editable element
  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={editableRef as any}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onClick={handleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onInput={handleInput}
      className={cn(
        className,
        "relative transition-all duration-200 outline-none",
        isEditMode && !isEditing && [
          "cursor-pointer",
          "hover:ring-2 hover:ring-primary/50 hover:ring-offset-2 hover:ring-offset-background",
          "hover:bg-primary/5 rounded-md",
          "group",
        ],
        isEditing && [
          "ring-2 ring-primary ring-offset-2 ring-offset-background",
          "bg-background rounded-md px-1",
          "min-w-[50px]",
        ],
        !value && "text-muted-foreground/50 italic"
      )}
      dir="rtl"
      role={isEditMode ? "textbox" : undefined}
      aria-label={isEditMode ? `לחץ לעריכה: ${value || placeholder}` : undefined}
      tabIndex={isEditMode ? 0 : undefined}
    >
      {isEditing ? localValue : (value || placeholder)}
      
      {/* Edit indicator on hover */}
      {isEditMode && !isEditing && (
        <span 
          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-primary text-primary-foreground p-1.5 rounded-full shadow-lg scale-75 group-hover:scale-100 pointer-events-none z-10"
          aria-hidden="true"
        >
          <Pencil className="w-3 h-3" />
        </span>
      )}
    </Tag>
  );
}
