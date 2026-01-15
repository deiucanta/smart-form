import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a field name to a human-readable label.
 * e.g., "firstName" -> "First Name", "hobbies[0].name" -> "Name"
 */
export function fieldNameToLabel(fieldName: string): string {
  // Extract the last segment (after last dot or closing bracket)
  const lastSegment = fieldName
    .replace(/\[\d+\]/g, "") // Remove array indices
    .split(".")
    .pop() ?? fieldName;

  // Convert camelCase to Title Case with spaces
  return lastSegment
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}
