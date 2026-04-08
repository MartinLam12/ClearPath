"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ToggleChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function ToggleChip({ label, selected, onToggle, icon, className }: ToggleChipProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer",
        "border",
        selected
          ? "bg-brand-50 border-brand-300 text-brand-700 shadow-soft-xs"
          : "bg-white border-surface-200 text-surface-600 hover:border-surface-300 hover:bg-surface-50",
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {label}
      {selected && (
        <svg className="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  );
}
