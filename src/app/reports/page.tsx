"use client";

import React from "react";
import Link from "next/link";
import { Card, Badge, Button } from "@/components/ui";
import { mockReportsList } from "@/lib/mock-data";
import { formatDate, businessTypeLabels } from "@/lib/utils";
import { ArrowRight, FileText, Plus } from "lucide-react";

export default function ReportsListPage() {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Reports</h1>
          <p className="text-surface-500 mt-1">
            View and compare all your AI readiness assessments
          </p>
        </div>
        <Link href="/assessment">
          <Button icon={<Plus className="w-4 h-4" />}>New Assessment</Button>
        </Link>
      </div>

      {mockReportsList.length === 0 ? (
        <Card className="text-center py-16">
          <FileText className="w-12 h-12 text-surface-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-surface-700 mb-2">
            No reports yet
          </h2>
          <p className="text-surface-500 mb-6 max-w-md mx-auto">
            Complete your first AI readiness assessment to generate a report with
            tailored recommendations.
          </p>
          <Link href="/assessment">
            <Button icon={<ArrowRight className="w-4 h-4" />}>
              Start Assessment
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {mockReportsList.map((report) => (
            <Link key={report.id} href={`/reports/${report.id}`}>
              <Card hover className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-brand-600" />
                  </div>
                  <div>
                    <p className="font-medium text-surface-900">{report.businessName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm text-surface-500">
                        {formatDate(report.createdAt)}
                      </span>
                      <span className="text-sm text-surface-300">•</span>
                      <span className="text-sm text-surface-500">
                        {businessTypeLabels[report.businessType]}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-surface-900">
                      {report.readinessScore}
                    </p>
                    <Badge
                      variant={report.readinessScore >= 60 ? "brand" : "warning"}
                      size="sm"
                    >
                      {report.readinessLevel}
                    </Badge>
                  </div>
                  <ArrowRight className="w-5 h-5 text-surface-400" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
