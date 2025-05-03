import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const objectColors = {
  "Fire Extinguisher": {
    bg: "bg-[hsl(var(--cosmic-red))]",
    bgLight: "bg-[hsl(var(--cosmic-red))] bg-opacity-10 dark:bg-opacity-20",
    border: "border-[hsl(var(--cosmic-red))]",
    text: "text-[hsl(var(--cosmic-red))]"
  },
  "Toolbox": {
    bg: "bg-[hsl(var(--nebula-violet))]",
    bgLight: "bg-[hsl(var(--nebula-violet))] bg-opacity-10 dark:bg-opacity-20",
    border: "border-[hsl(var(--nebula-violet))]",
    text: "text-[hsl(var(--nebula-violet))]"
  },
  "Oxygen Tank": {
    bg: "bg-[hsl(var(--orbit-green))]",
    bgLight: "bg-[hsl(var(--orbit-green))] bg-opacity-10 dark:bg-opacity-20",
    border: "border-[hsl(var(--orbit-green))]",
    text: "text-[hsl(var(--orbit-green))]"
  }
};

export function formatDateTime(date: Date | string): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj instanceof Date && !isNaN(dateObj.getTime())
      ? dateObj.toLocaleString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
          timeZoneName: 'short'
        })
      : '';
  } catch {
    return '';
  }
}

export function formatTimeAgo(date: Date | string): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return '';
    
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}
