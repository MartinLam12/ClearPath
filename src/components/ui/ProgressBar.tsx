import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  color?: "brand" | "success" | "warning" | "danger" | "accent";
  showLabel?: boolean;
  className?: string;
}

const colorStyles = {
  brand: "bg-brand-500",
  success: "bg-success-500",
  warning: "bg-warning-500",
  danger: "bg-danger-500",
  accent: "bg-accent-500",
};

const sizeStyles = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export function ProgressBar({
  value,
  max = 100,
  size = "md",
  color = "brand",
  showLabel = false,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-medium text-surface-700">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={cn("w-full bg-surface-100 rounded-full overflow-hidden", sizeStyles[size])}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            colorStyles[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
