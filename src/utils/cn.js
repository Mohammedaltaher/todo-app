import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for merging Tailwind CSS classes
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
