import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-success-700";
  if (score >= 60) return "text-brand-600";
  if (score >= 40) return "text-warning-700";
  return "text-danger-700";
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return "bg-success-50";
  if (score >= 60) return "bg-brand-50";
  if (score >= 40) return "bg-warning-50";
  return "bg-danger-50";
}

export function getImpactColor(impact: string): string {
  switch (impact) {
    case "very_high":
      return "text-success-700 bg-success-50";
    case "high":
      return "text-brand-700 bg-brand-50";
    case "medium":
      return "text-warning-700 bg-warning-50";
    case "low":
      return "text-surface-600 bg-surface-100";
    default:
      return "text-surface-600 bg-surface-100";
  }
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "easy":
      return "text-success-700 bg-success-50";
    case "moderate":
      return "text-warning-700 bg-warning-50";
    case "challenging":
      return "text-accent-700 bg-accent-50";
    case "complex":
      return "text-danger-700 bg-danger-50";
    default:
      return "text-surface-600 bg-surface-100";
  }
}

export function formatImpact(impact: string): string {
  return impact.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export function formatDifficulty(difficulty: string): string {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

export const businessTypeLabels: Record<string, string> = {
  service: "Local Service Business",
  agency: "Agency",
  ecommerce: "E-Commerce",
  healthcare: "Healthcare / Clinic",
  beauty: "Beauty / Salon",
  construction: "Construction / Contractor",
  consulting: "Consulting",
  restaurant: "Restaurant / Food Service",
  retail: "Retail",
  other: "Other",
};

export const painPointLabels: Record<string, string> = {
  scheduling: "Scheduling & Appointments",
  customer_communication: "Customer Communication",
  lead_management: "Lead Management",
  invoicing: "Invoicing & Billing",
  inventory: "Inventory Management",
  social_media: "Social Media Management",
  data_entry: "Data Entry",
  reporting: "Reporting & Analytics",
  hiring: "Hiring & Recruitment",
  customer_support: "Customer Support",
  other: "Other",
};

export const goalLabels: Record<string, string> = {
  save_time: "Save Time",
  improve_support: "Improve Customer Support",
  increase_sales: "Increase Sales",
  reduce_manual_work: "Reduce Manual Work",
  grow_business: "Grow the Business",
  reduce_costs: "Reduce Costs",
  other: "Other",
};
