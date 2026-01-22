import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { Pencil, Check, X } from "lucide-react";

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  isEditMode: boolean;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  tag?: "h1" | "h2" | "h3" | "p" | "span" | "div";
}

export default function EditableText({
  value,
  onChange,
  isEditMode,
  className,
  multiline = false,
  placeholder = "הקלד טקסט...",
  tag: Tag = "span",
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    onChange(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (!isEditMode) {
    return <Tag className={className}>{value}</Tag>;
  }

  if (isEditing) {
    return (
      <div className="relative inline-flex items-center gap-2 w-full">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className={cn(
              "w-full min-h-[80px] p-2 rounded-md border-2 border-primary bg-background text-foreground resize-none",
              "focus:outline-none focus:ring-2 focus:ring-primary/50",
              className
            )}
            placeholder={placeholder}
            dir="rtl"
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className={cn(
              "w-full p-2 rounded-md border-2 border-primary bg-background text-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary/50",
              className
            )}
            placeholder={placeholder}
            dir="rtl"
          />
        )}
        <div className="flex gap-1 absolute left-2 top-1/2 -translate-y-1/2">
          <button
            onClick={handleSave}
            className="p-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            aria-label="שמור"
          >
            <Check className="w-3 h-3" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 bg-muted text-muted-foreground rounded hover:bg-muted/80 transition-colors"
            aria-label="בטל"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <Tag
      className={cn(
        className,
        "relative cursor-pointer group",
        "outline-2 outline-dashed outline-transparent hover:outline-primary/50",
        "transition-all duration-200 rounded px-1 -mx-1"
      )}
      onClick={() => setIsEditing(true)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsEditing(true);
        }
      }}
      aria-label={`לחץ לעריכת: ${value}`}
    >
      {value || <span className="text-muted-foreground italic">{placeholder}</span>}
      <span className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground p-1 rounded-full shadow-lg">
        <Pencil className="w-3 h-3" />
      </span>
    </Tag>
  );
}
