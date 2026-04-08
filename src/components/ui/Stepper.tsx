"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StepperProps {
  steps: { label: string; description?: string }[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <nav className={cn("w-full", className)} aria-label="Progress">
      <ol className="flex items-center w-full">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step.label}
              className={cn("flex items-center", !isLast && "flex-1")}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 transition-all duration-300",
                    isCompleted &&
                      "bg-brand-600 text-white",
                    isCurrent &&
                      "bg-brand-600 text-white ring-4 ring-brand-100",
                    !isCompleted &&
                      !isCurrent &&
                      "bg-surface-100 text-surface-400"
                  )}
                >
                  {isCompleted ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="hidden sm:block">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      (isCompleted || isCurrent) ? "text-surface-900" : "text-surface-400"
                    )}
                  >
                    {step.label}
                  </p>
                </div>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-4 transition-all duration-300",
                    isCompleted ? "bg-brand-500" : "bg-surface-200"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
