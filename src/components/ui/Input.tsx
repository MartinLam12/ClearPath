"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-surface-700"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full px-3.5 py-2.5 rounded-xl border bg-white text-surface-900 text-sm",
          "placeholder:text-surface-400",
          "transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500",
          error
            ? "border-danger-500 focus:ring-danger-500"
            : "border-surface-300 hover:border-surface-400",
          className
        )}
        {...props}
      />
      {hint && !error && (
        <p className="text-xs text-surface-500">{hint}</p>
      )}
      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-surface-700"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn(
          "w-full px-3.5 py-2.5 rounded-xl border bg-white text-surface-900 text-sm",
          "placeholder:text-surface-400 resize-none",
          "transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500",
          error
            ? "border-danger-500 focus:ring-danger-500"
            : "border-surface-300 hover:border-surface-400",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({
  label,
  error,
  options,
  placeholder,
  className,
  id,
  ...props
}: SelectProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-surface-700"
        >
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={cn(
          "w-full px-3.5 py-2.5 rounded-xl border bg-white text-surface-900 text-sm appearance-none",
          "transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500",
          error
            ? "border-danger-500 focus:ring-danger-500"
            : "border-surface-300 hover:border-surface-400",
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  );
}
