// UI Parity Utilities - Mirror legacy workspace styling exactly
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Workspace shell classes for pixel parity
export const WORKSPACE_SHELL_CLASSES = {
  container: "min-h-screen bg-background flex flex-col",
  header: "border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50",
  main: "flex flex-1 overflow-hidden",
  sidebar: "w-80 border-r bg-card/30 backdrop-blur",
  content: "flex-1 flex flex-col",
  toolbar: "border-b bg-muted/30 px-6 py-3",
  workspace: "flex-1 overflow-auto p-6"
};

// Bundle container classes
export const BUNDLE_CLASSES = {
  container: "space-y-6",
  header: "flex items-center justify-between",
  title: "text-2xl font-semibold tracking-tight",
  subtitle: "text-muted-foreground",
  content: "grid gap-6 md:grid-cols-2 lg:grid-cols-3",
  panel: "rounded-lg border bg-card text-card-foreground shadow-sm",
  panelHeader: "flex flex-col space-y-1.5 p-6",
  panelContent: "p-6 pt-0"
};

// Capacity-specific colors for consistency
export const CAPACITY_COLORS = {
  responsive: {
    bg: "bg-red-50 dark:bg-red-950/50",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-800 dark:text-red-200",
    accent: "bg-red-500"
  },
  reflexive: {
    bg: "bg-blue-50 dark:bg-blue-950/50",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-800 dark:text-blue-200",
    accent: "bg-blue-500"
  },
  deliberative: {
    bg: "bg-purple-50 dark:bg-purple-950/50",
    border: "border-purple-200 dark:border-purple-800",
    text: "text-purple-800 dark:text-purple-200",
    accent: "bg-purple-500"
  },
  anticipatory: {
    bg: "bg-green-50 dark:bg-green-950/50",
    border: "border-green-200 dark:border-green-800",
    text: "text-green-800 dark:text-green-200",
    accent: "bg-green-500"
  },
  structural: {
    bg: "bg-orange-50 dark:bg-orange-950/50",
    border: "border-orange-200 dark:border-orange-800",
    text: "text-orange-800 dark:text-orange-200",
    accent: "bg-orange-500"
  }
};

// Animation classes for smooth transitions
export const ANIMATION_CLASSES = {
  fadeIn: "animate-fade-in",
  slideIn: "animate-slide-in-right",
  scaleIn: "animate-scale-in",
  transition: "transition-all duration-200 ease-in-out"
};

// Generate capacity-specific classes
export const getCapacityClasses = (capacity: string) => {
  const colors = CAPACITY_COLORS[capacity as keyof typeof CAPACITY_COLORS];
  if (!colors) return CAPACITY_COLORS.responsive;
  return colors;
};

// Responsive breakpoint utilities
export const BREAKPOINTS = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)"
};

// Z-index layers for consistent stacking
export const Z_INDEX = {
  dropdown: 50,
  sticky: 20,
  overlay: 40,
  modal: 50,
  popover: 60,
  tooltip: 70
};