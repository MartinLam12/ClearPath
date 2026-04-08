"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, Badge, Button, ScoreRing, ProgressBar } from "@/components/ui";
import { mockUser, mockDashboardStats, mockReportsList, mockReport } from "@/lib/mock-data";
import { formatDate, businessTypeLabels } from "@/lib/utils";
import {
  ArrowRight,
  BarChart3,
  ClipboardList,
  Clock,
  FileText,
  Lightbulb,
  Plus,
  TrendingUp,
  Zap,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const [hasAssessments, setHasAssessments] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem("clearpath_has_assessment");
    if (completed === "true") {
      setHasAssessments(true);
    }
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">
            Welcome{hasAssessments ? ` back` : ""}, {mockUser.name.split(" ")[0]}
          </h1>
          <p className="text-surface-500 mt-1">
            {hasAssessments
              ? "Here's an overview of your AI readiness journey"
              : "Let's find out where AI can help your business"}
          </p>
        </div>
        <Link href="/assessment">
          <Button icon={<Plus className="w-4 h-4" />}>New Assessment</Button>
        </Link>
      </div>

      {hasAssessments ? (
        <DashboardWithData />
      ) : (
        <EmptyDashboard />
      )}
    </div>
  );
}

// ============ Empty State for New Users ============

function EmptyDashboard() {
  return (
    <>
      {/* Welcome Hero Card */}
      <Card className="gradient-subtle border-brand-100">
        <div className="flex flex-col md:flex-row items-center gap-8 py-4">
          <div className="w-20 h-20 rounded-2xl bg-brand-50 flex items-center justify-center shrink-0">
            <Sparkles className="w-10 h-10 text-brand-600" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-surface-900 mb-2">
              Discover your AI advantage
            </h2>
            <p className="text-surface-600 leading-relaxed mb-4 max-w-xl">
              Take a quick 5-minute assessment about your business — your industry, pain points,
              tools, and goals. We&apos;ll generate a tailored AI readiness report with prioritized
              recommendations and a concrete action plan.
            </p>
            <Link href="/assessment">
              <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                Start Your First Assessment
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* What You'll Get */}
      <div>
        <h2 className="text-lg font-semibold text-surface-900 mb-4">
          What you&apos;ll get
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: <BarChart3 className="w-5 h-5 text-brand-600" />,
              bg: "bg-brand-50",
              title: "AI Readiness Score",
              description: "A clear score across 6 dimensions showing exactly where you stand.",
            },
            {
              icon: <Lightbulb className="w-5 h-5 text-accent-600" />,
              bg: "bg-accent-50",
              title: "Prioritized Recommendations",
              description: "Your top 3-5 AI opportunities ranked by impact and ease of implementation.",
            },
            {
              icon: <ClipboardList className="w-5 h-5 text-success-500" />,
              bg: "bg-success-50",
              title: "Action Plan",
              description: "A practical week-by-week plan with concrete steps to get started.",
            },
          ].map((item) => (
            <Card key={item.title}>
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-3`}>
                {item.icon}
              </div>
              <h3 className="text-sm font-semibold text-surface-900 mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-surface-500 leading-relaxed">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <Card>
        <h2 className="text-lg font-semibold text-surface-900 mb-6">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "1",
              title: "Tell us about your business",
              description: "Industry, team size, pain points, tools, and goals.",
            },
            {
              step: "2",
              title: "We analyze your situation",
              description: "We match your inputs against hundreds of AI use cases.",
            },
            {
              step: "3",
              title: "Get your tailored report",
              description: "Prioritized recommendations with impact estimates and next steps.",
            },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                {item.step}
              </div>
              <div>
                <p className="text-sm font-semibold text-surface-900">{item.title}</p>
                <p className="text-xs text-surface-500 mt-0.5">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Empty History */}
      <div>
        <h2 className="text-lg font-semibold text-surface-900 mb-4">Assessment History</h2>
        <Card className="text-center py-12">
          <FileText className="w-10 h-10 text-surface-300 mx-auto mb-3" />
          <p className="text-surface-500 text-sm mb-1">No assessments yet</p>
          <p className="text-surface-400 text-xs">
            Complete your first assessment to see your results here.
          </p>
        </Card>
      </div>
    </>
  );
}

// ============ Dashboard With Data ============

function DashboardWithData() {
  return (
    <>
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
    </>
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
