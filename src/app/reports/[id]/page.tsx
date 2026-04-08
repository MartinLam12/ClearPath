"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, Badge, Button, ScoreRing, ProgressBar } from "@/components/ui";
import { mockReport } from "@/lib/mock-data";
import {
  formatDate,
  formatImpact,
  formatDifficulty,
  getImpactColor,
  getDifficultyColor,
  businessTypeLabels,
} from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  AlertTriangle,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Star,
  MessageSquare,
  Receipt,
  Zap,
  Share2,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  calendar: <Calendar className="w-5 h-5" />,
  "message-square": <MessageSquare className="w-5 h-5" />,
  "file-text": <FileText className="w-5 h-5" />,
  receipt: <Receipt className="w-5 h-5" />,
  star: <Star className="w-5 h-5" />,
};

export default function ReportDetailPage() {
  const report = mockReport;
  const [expandedRec, setExpandedRec] = useState<string | null>(report.recommendations[0]?.id || null);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Back nav */}
      <Link
        href="/reports"
        className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Reports
      </Link>

      {/* Report Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-surface-900">
              AI Readiness Report
            </h1>
            <Badge variant="brand" size="md">{report.readinessLevel}</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-surface-500">
            <span>{report.businessName}</span>
            <span className="text-surface-300">•</span>
            <span>{businessTypeLabels[report.businessType]}</span>
            <span className="text-surface-300">•</span>
            <span>{formatDate(report.createdAt)}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={<Share2 className="w-4 h-4" />}>
            Share
          </Button>
          <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>
            Export PDF
          </Button>
        </div>
      </div>

      {/* Executive Summary */}
      <Card className="gradient-subtle border-brand-100">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <ScoreRing
            score={report.readinessScore}
            size="xl"
            sublabel="out of 100"
            className="shrink-0"
          />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-lg font-semibold text-surface-900 mb-2">
              Executive Summary
            </h2>
            <p className="text-surface-600 leading-relaxed">
              {report.summary}
            </p>
          </div>
        </div>
      </Card>

      {/* Category Scores */}
      <div>
        <h2 className="text-lg font-semibold text-surface-900 mb-4">
          Readiness Breakdown
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {report.categoryScores.map((cat) => (
            <Card key={cat.category} padding="sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-surface-700">
                  {cat.category}
                </span>
                <span className="text-sm font-bold text-surface-900">
                  {cat.score}%
                </span>
              </div>
              <ProgressBar
                value={cat.score}
                size="md"
                color={cat.score >= 70 ? "brand" : cat.score >= 50 ? "accent" : "warning"}
              />
            </Card>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-surface-900">
            Recommended AI Opportunities
          </h2>
          <span className="text-sm text-surface-500">
            {report.recommendations.length} recommendations
          </span>
        </div>

        <div className="space-y-4">
          {report.recommendations.map((rec) => {
            const isExpanded = expandedRec === rec.id;

            return (
              <Card key={rec.id} padding="none" className="overflow-hidden">
                {/* Collapsed header */}
                <button
                  onClick={() => setExpandedRec(isExpanded ? null : rec.id)}
                  className="w-full p-5 md:p-6 text-left flex items-start gap-4 hover:bg-surface-50/50 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0 mt-0.5">
                    {iconMap[rec.icon] || <Zap className="w-5 h-5 text-brand-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="brand" size="sm">#{rec.priority}</Badge>
                      <h3 className="font-semibold text-surface-900 truncate">
                        {rec.title}
                      </h3>
                    </div>
                    <p className="text-sm text-surface-500 line-clamp-1">
                      {rec.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getImpactColor(rec.impact)}`}>
                        {formatImpact(rec.impact)} Impact
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getDifficultyColor(rec.difficulty)}`}>
                        {formatDifficulty(rec.difficulty)}
                      </span>
                      <span className="text-xs text-surface-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {rec.timeToValue}
                      </span>
                      <span className="text-xs text-surface-500 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> {rec.estimatedTimeSaved}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 text-surface-400">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-5 md:px-6 pb-6 pt-0 border-t border-surface-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                      <div>
                        <h4 className="text-sm font-semibold text-surface-800 mb-2">
                          What this does
                        </h4>
                        <p className="text-sm text-surface-600 leading-relaxed">
                          {rec.description}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-surface-800 mb-2">
                          Why it matches your business
                        </h4>
                        <p className="text-sm text-surface-600 leading-relaxed">
                          {rec.whyItMatches}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      <MetricCard label="Impact" value={formatImpact(rec.impact)} />
                      <MetricCard label="Difficulty" value={formatDifficulty(rec.difficulty)} />
                      <MetricCard label="Time to Value" value={rec.timeToValue} />
                      <MetricCard label="Time Saved" value={rec.estimatedTimeSaved} />
                    </div>

                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-surface-800 mb-2">
                        Tool Category
                      </h4>
                      <Badge variant="default" size="md">{rec.toolCategory}</Badge>
                    </div>

                    {rec.risks.length > 0 && (
                      <div className="mt-5 bg-warning-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-warning-700" />
                          <h4 className="text-sm font-semibold text-warning-700">
                            Things to Consider
                          </h4>
                        </div>
                        <ul className="space-y-1">
                          {rec.risks.map((risk, i) => (
                            <li key={i} className="text-sm text-warning-700 flex items-start gap-2">
                              <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-warning-500" />
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Action Plan */}
      <div>
        <h2 className="text-lg font-semibold text-surface-900 mb-1">
          Your Action Plan
        </h2>
        <p className="text-sm text-surface-500 mb-4">
          Concrete steps to start implementing AI in your business this week
        </p>
        <Card padding="none">
          <div className="divide-y divide-surface-100">
            {report.actionPlan.map((action, idx) => (
              <ActionRow key={action.id} action={action} index={idx} />
            ))}
          </div>
        </Card>
      </div>

      {/* Strengths & Considerations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-base font-semibold text-surface-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success-500" />
            Your Strengths
          </h3>
          <ul className="space-y-3">
            {report.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-surface-600">
                <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-success-500" />
                {s}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h3 className="text-base font-semibold text-surface-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning-500" />
            Important Considerations
          </h3>
          <ul className="space-y-3">
            {report.considerations.map((c, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-surface-600">
                <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-warning-500" />
                {c}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Bottom CTA */}
      <Card className="text-center gradient-subtle border-brand-100">
        <h3 className="text-lg font-semibold text-surface-900 mb-2">
          Ready to take the next step?
        </h3>
        <p className="text-sm text-surface-500 mb-4 max-w-lg mx-auto">
          Share this report with your team, or start a new assessment as your business evolves.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" icon={<Share2 className="w-4 h-4" />}>
            Share Report
          </Button>
          <Link href="/assessment">
            <Button size="sm">New Assessment</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-50 rounded-xl p-3 text-center">
      <p className="text-xs text-surface-500 mb-1">{label}</p>
      <p className="text-sm font-semibold text-surface-900">{value}</p>
    </div>
  );
}

function ActionRow({
  action,
  index,
}: {
  action: { id: string; task: string; description: string; timeframe: string; completed: boolean };
  index: number;
}) {
  const [checked, setChecked] = useState(action.completed);

  return (
    <div className="flex items-start gap-4 p-4 md:p-5">
      <button
        onClick={() => setChecked(!checked)}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
          checked
            ? "bg-brand-600 border-brand-600"
            : "border-surface-300 hover:border-brand-400"
        }`}
      >
        {checked && (
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${checked ? "text-surface-400 line-through" : "text-surface-900"}`}>
          {action.task}
        </p>
        <p className="text-xs text-surface-500 mt-0.5">{action.description}</p>
      </div>
      <Badge variant="default" size="sm">{action.timeframe}</Badge>
    </div>
  );
}
