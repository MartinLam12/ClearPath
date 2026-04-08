"use client";

import React from "react";
import Link from "next/link";
import { Card, Badge, Button, ScoreRing, ProgressBar } from "@/components/ui";
import { mockUser, mockDashboardStats, mockReportsList, mockReport } from "@/lib/mock-data";
import { formatDate, businessTypeLabels } from "@/lib/utils";
import {
  ArrowRight,
  BarChart3,
  Clock,
  FileText,
  Lightbulb,
  Plus,
  TrendingUp,
  Zap,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">
            Welcome back, {mockUser.name.split(" ")[0]}
          </h1>
          <p className="text-surface-500 mt-1">
            Here&apos;s an overview of your AI readiness journey
          </p>
        </div>
        <Link href="/assessment">
          <Button icon={<Plus className="w-4 h-4" />}>New Assessment</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<FileText className="w-5 h-5 text-brand-600" />}
          label="Assessments"
          value={String(mockDashboardStats.totalAssessments)}
          bgColor="bg-brand-50"
        />
        <StatCard
          icon={<BarChart3 className="w-5 h-5 text-accent-600" />}
          label="Avg. Score"
          value={`${mockDashboardStats.averageScore}/100`}
          bgColor="bg-accent-50"
        />
        <StatCard
          icon={<Lightbulb className="w-5 h-5 text-warning-500" />}
          label="Top Opportunity"
          value={mockDashboardStats.topOpportunity}
          small
          bgColor="bg-warning-50"
        />
        <StatCard
          icon={<Clock className="w-5 h-5 text-success-500" />}
          label="Est. Time Saved"
          value={mockDashboardStats.estimatedTimeSaved}
          bgColor="bg-success-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Score */}
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-sm font-medium text-surface-500 mb-4">Latest AI Readiness Score</h2>
            <ScoreRing
              score={mockReport.readinessScore}
              size="lg"
              sublabel={`/ 100`}
            />
            <Badge variant="brand" className="mt-4" size="md">
              {mockReport.readinessLevel}
            </Badge>
            <p className="text-sm text-surface-500 mt-3 max-w-xs">
              Your business is well positioned to start adopting AI tools in key areas.
            </p>
            <Link href="/reports/rpt_001" className="mt-4">
              <Button variant="outline" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                View Full Report
              </Button>
            </Link>
          </div>
        </Card>

        {/* Category Breakdown */}
        <Card className="lg:col-span-2">
          <h2 className="text-sm font-medium text-surface-500 mb-6">Readiness by Category</h2>
          <div className="space-y-5">
            {mockReport.categoryScores.map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-surface-700">{cat.category}</span>
                  <span className="text-sm font-semibold text-surface-800">
                    {cat.score}%
                  </span>
                </div>
                <ProgressBar
                  value={cat.score}
                  color={cat.score >= 70 ? "brand" : cat.score >= 50 ? "accent" : "warning"}
                  size="md"
                />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Recommendations Quick View */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-surface-900">Top Recommendations</h2>
          <Link href="/reports/rpt_001">
            <Button variant="ghost" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
              View All
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockReport.recommendations.slice(0, 3).map((rec, idx) => (
            <Card key={rec.id} hover>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-brand-600" />
                </div>
                <Badge variant={rec.impact === "very_high" ? "success" : "brand"} size="sm">
                  #{idx + 1} Priority
                </Badge>
              </div>
              <h3 className="text-sm font-semibold text-surface-900 mb-1.5">
                {rec.title}
              </h3>
              <p className="text-xs text-surface-500 mb-3 line-clamp-2">
                {rec.description}
              </p>
              <div className="flex items-center gap-3 text-xs text-surface-500">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {rec.estimatedTimeSaved}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {rec.timeToValue}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Reports History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-surface-900">Assessment History</h2>
        </div>
        <Card padding="none">
          <div className="divide-y divide-surface-100">
            {mockReportsList.map((report) => (
              <Link
                key={report.id}
                href={`/reports/${report.id}`}
                className="flex items-center justify-between p-4 md:p-5 hover:bg-surface-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-900">
                      {report.businessName}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-surface-500">
                        {formatDate(report.createdAt)}
                      </span>
                      <span className="text-xs text-surface-300">•</span>
                      <span className="text-xs text-surface-500">
                        {businessTypeLabels[report.businessType]}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-surface-900">
                      {report.readinessScore}/100
                    </p>
                    <Badge
                      variant={report.readinessScore >= 60 ? "brand" : "warning"}
                      size="sm"
                    >
                      {report.readinessLevel}
                    </Badge>
                  </div>
                  <ArrowRight className="w-4 h-4 text-surface-400" />
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  small,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  small?: boolean;
  bgColor: string;
}) {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-surface-500 uppercase tracking-wide">
            {label}
          </p>
          <p
            className={`font-semibold text-surface-900 mt-0.5 ${
              small ? "text-sm" : "text-xl"
            } truncate`}
          >
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}
