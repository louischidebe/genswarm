import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const glassStyle = {
  background: "rgba(34, 26, 69, 0.4)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(124, 255, 178, 0.2)",
} as const
