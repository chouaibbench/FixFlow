import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  if (!date) return 'N/A';
  if (date.toDate) {
    return date.toDate().toLocaleString();
  }
  return new Date(date).toLocaleString();
}
