import { useState, useRef, useEffect, KeyboardEvent, FocusEvent } from "react";
import { cn } from "@/lib/utils";
import { Pencil, Check, X } from "lucide-react";
import { useLandingContent } from "@/contexts/LandingContentContext";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isHovered, setIsHovered] = useState(false);
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

  const handleSave = () => {
    const newValue = editableRef.current?.innerText || "";
    setIsEditing(false);
    if (newValue !== value) {
      onChange(newValue);
    }
  };

  const handleCancel = () => {
    setLocalValue(value);
    if (editableRef.current) {
      editableRef.current.innerText = value;
    }
    setIsEditing(false);
  };

  const handleBlur = (e: FocusEvent<HTMLElement>) => {
    // Check if focus is moving to our action buttons
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget?.closest('.inline-edit-actions')) {
      return;
    }
    
    if (isEditing) {
      handleSave();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    } else if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleSave();
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
    <span 
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
          "relative transition-all duration-200 outline-none inline",
          isEditMode && !isEditing && [
            "cursor-pointer",
            "hover:bg-primary/10 rounded-md px-0.5 -mx-0.5",
            "border-b-2 border-dashed border-transparent hover:border-primary/40",
          ],
          isEditing && [
            "ring-2 ring-primary ring-offset-2 ring-offset-background",
            "bg-background text-foreground rounded-md px-2 py-0.5",
            "min-w-[60px] shadow-lg",
          ],
          !value && "text-muted-foreground/50 italic"
        )}
        dir="rtl"
        role={isEditMode ? "textbox" : undefined}
        aria-label={isEditMode ? `לחץ לעריכה: ${value || placeholder}` : undefined}
        tabIndex={isEditMode ? 0 : undefined}
      >
        {isEditing ? localValue : (value || placeholder)}
      </Tag>
      
      {/* Edit indicator on hover */}
      <AnimatePresence>
        {isEditMode && !isEditing && isHovered && (
          <motion.span 
            initial={{ opacity: 0, scale: 0.5, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-2 py-1 rounded-md shadow-lg text-xs font-medium whitespace-nowrap z-20 pointer-events-none flex items-center gap-1"
          >
            <Pencil className="w-3 h-3" />
            לחץ לעריכה
          </motion.span>
        )}
      </AnimatePresence>

      {/* Action buttons when editing */}
      <AnimatePresence>
        {isEditing && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="inline-edit-actions absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-card border border-border rounded-lg shadow-xl p-1 z-30"
          >
            <button
              type="button"
              onClick={handleSave}
              className="p-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              aria-label="שמור"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="p-1.5 rounded-md bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
              aria-label="בטל"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
