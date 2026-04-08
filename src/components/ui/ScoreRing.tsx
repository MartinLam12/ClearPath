"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  maxScore?: number;
  size?: "sm" | "md" | "lg" | "xl";
  label?: string;
  sublabel?: string;
  className?: string;
}

const sizeConfig = {
  sm: { diameter: 80, strokeWidth: 6, fontSize: "text-lg", sublabelSize: "text-xs" },
  md: { diameter: 120, strokeWidth: 8, fontSize: "text-2xl", sublabelSize: "text-xs" },
  lg: { diameter: 160, strokeWidth: 10, fontSize: "text-3xl", sublabelSize: "text-sm" },
  xl: { diameter: 200, strokeWidth: 12, fontSize: "text-4xl", sublabelSize: "text-sm" },
};

function getScoreGradient(score: number): [string, string] {
  if (score >= 80) return ["#10b981", "#047857"];
  if (score >= 60) return ["#3b8a6a", "#2d6f54"];
  if (score >= 40) return ["#f59e0b", "#b45309"];
  return ["#ef4444", "#b91c1c"];
}

export function ScoreRing({
  score,
  maxScore = 100,
  size = "lg",
  label,
  sublabel,
  className,
}: ScoreRingProps) {
  const config = sizeConfig[size];
  const radius = (config.diameter - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((score / maxScore) * 100, 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const [color1, color2] = getScoreGradient(score);
  const gradientId = `score-gradient-${score}-${size}`;

  return (
    <div className={cn("inline-flex flex-col items-center", className)}>
      <div className="relative" style={{ width: config.diameter, height: config.diameter }}>
        <svg
          width={config.diameter}
          height={config.diameter}
          viewBox={`0 0 ${config.diameter} ${config.diameter}`}
          className="transform -rotate-90"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color1} />
              <stop offset="100%" stopColor={color2} />
            </linearGradient>
          </defs>
          <circle
            cx={config.diameter / 2}
            cy={config.diameter / 2}
            r={radius}
            fill="none"
            stroke="#f5f5f4"
            strokeWidth={config.strokeWidth}
          />
          <circle
            cx={config.diameter / 2}
            cy={config.diameter / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold text-surface-900", config.fontSize)}>
            {score}
          </span>
          {sublabel && (
            <span className={cn("text-surface-500", config.sublabelSize)}>
              {sublabel}
            </span>
          )}
        </div>
      </div>
      {label && (
        <span className="mt-2 text-sm font-medium text-surface-600">{label}</span>
      )}
    </div>
  );
}
