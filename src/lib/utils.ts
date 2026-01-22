import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safe JSON.parse with fallback + optional runtime validator.
 * Prevents hard crashes from corrupted / tampered localStorage.
 */
export function safeJsonParse<T>(
  value: string | null,
  fallback: T,
  validate?: (data: unknown) => data is T
): T {
  if (!value) return fallback;
  try {
    const parsed: unknown = JSON.parse(value);
    if (validate && !validate(parsed)) return fallback;
    return (parsed as T) ?? fallback;
  } catch {
    return fallback;
  }
}
