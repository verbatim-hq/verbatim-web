import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes without conflicts.
 * The only utility you'll reach for a dozen times a day.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
