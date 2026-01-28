import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cleanJson(text: string): string {
  // Remove markdown code blocks if present
  let cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
  // Sometimes it might just be ``` without json
  cleaned = cleaned.replace(/```\n?|\n?```/g, "").trim();
  return cleaned;
}
