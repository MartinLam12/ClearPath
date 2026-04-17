"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input, Textarea, Select, Stepper, ToggleChip } from "@/components/ui";
import { ArrowLeft, ArrowRight, Building2, Users, AlertTriangle, Wrench, Target, DollarSign } from "lucide-react";
import { painPointLabels, goalLabels } from "@/lib/utils";
import { saveAssessmentData } from "@/lib/report-generator";

const steps = [
  { label: "Business Info", description: "Basic details" },
  { label: "Pain Points", description: "Current challenges" },
  { label: "Operations", description: "Workflows & tools" },
  { label: "Goals & Budget", description: "Priorities" },
  { label: "Review", description: "Confirm & submit" },
];

const businessTypeOptions = [
  { value: "service", label: "Local Service Business" },
  { value: "agency", label: "Agency" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "healthcare", label: "Healthcare / Clinic" },
  { value: "beauty", label: "Beauty / Salon" },
  { value: "construction", label: "Construction / Contractor" },
  { value: "consulting", label: "Consulting" },
  { value: "restaurant", label: "Restaurant / Food Service" },
  { value: "retail", label: "Retail" },
  { value: "other", label: "Other" },
];

const teamSizeOptions = [
  { value: "solo", label: "Just me" },
  { value: "2-5", label: "2-5 people" },
  { value: "6-15", label: "6-15 people" },
  { value: "16-30", label: "16-30 people" },
  { value: "31-50", label: "31-50 people" },
  { value: "50+", label: "50+ people" },
];

const volumeOptions = [
  { value: "low", label: "Low (< 10/day)" },
  { value: "medium", label: "Medium (10-30/day)" },
  { value: "high", label: "High (30-100/day)" },
  { value: "very_high", label: "Very High (100+/day)" },
];

const schedulingOptions = [
  { value: "none", label: "No scheduling needed" },
  { value: "simple", label: "Simple (few appointments)" },
  { value: "moderate", label: "Moderate (daily scheduling)" },
  { value: "complex", label: "Complex (multi-staff, multi-location)" },
];

const comfortOptions = [
  { value: "beginner", label: "Beginner — We mostly use paper/phone" },
  { value: "intermediate", label: "Intermediate — We use basic software" },
  { value: "comfortable", label: "Comfortable — We use multiple digital tools" },
  { value: "advanced", label: "Advanced — We're very tech-savvy" },
];

const budgetOptions = [
  { value: "under_100", label: "Under $100/month" },
  { value: "100_300", label: "$100-300/month" },
  { value: "300_500", label: "$300-500/month" },
  { value: "500_1000", label: "$500-1,000/month" },
  { value: "1000_plus", label: "$1,000+/month" },
];

const commonTools = [
  "Google Workspace",
  "Microsoft 365",
  "QuickBooks",
  "Slack",
  "Zoom",
  "Mailchimp",
  "Shopify",
  "WordPress",
  "HubSpot",
  "Squarespace",
  "Square POS",
  "Calendly",
  "Trello",
  "Asana",
  "Freshbooks",
  "Stripe",
];

const repetitiveTasks = [
  "Appointment reminders",
  "Follow-up emails",
  "Invoice generation",
  "Data entry",
  "Social media posting",
  "Inventory counting",
  "Report compilation",
  "Lead follow-up",
  "Customer intake forms",
  "Scheduling staff",
  "Answering FAQs",
  "Proposal writing",
];

interface FormData {
  businessName: string;
  businessType: string;
  customBusinessType: string;
  teamSize: string;
  painPoints: string[];
  customPainPoint: string;
  customerCommunicationVolume: string;
  leadVolume: string;
  schedulingComplexity: string;
  repetitiveTasks: string[];
  customRepetitiveTask: string;
  existingTools: string[];
  customTool: string;
  comfortLevel: string;
  budgetRange: string;
  primaryGoals: string[];
  customGoal: string;
  additionalContext: string;
}

export default function AssessmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    businessName: "",
    businessType: "",
    customBusinessType: "",
    teamSize: "",
    painPoints: [],
    customPainPoint: "",
    customerCommunicationVolume: "",
    leadVolume: "",
    schedulingComplexity: "",
    repetitiveTasks: [],
    customRepetitiveTask: "",
    existingTools: [],
    customTool: "",
    comfortLevel: "",
    budgetRange: "",
    primaryGoals: [],
    customGoal: "",
    additionalContext: "",
  });

  const toggleArrayItem = (field: keyof FormData, value: string) => {
    const current = form[field] as string[];
    if (current.includes(value)) {
      setForm({ ...form, [field]: current.filter((v) => v !== value) });
    } else {
      setForm({ ...form, [field]: [...current, value] });
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    saveAssessmentData(form);
    setTimeout(() => {
      localStorage.setItem("clearpath_has_assessment", "true");
      router.push("/reports/latest?new=true");
    }, 2000);
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900 mb-1">
          AI Readiness Assessment
        </h1>
        <p className="text-surface-500">
          Answer a few questions about your business to get your tailored AI readiness report.
        </p>
      </div>

      {/* Stepper */}
      <Stepper steps={steps} currentStep={currentStep} className="mb-10" />

      {/* Step Content */}
      <Card className="mb-6">
        {currentStep === 0 && (
          <StepBusinessInfo form={form} setForm={setForm} />
        )}
        {currentStep === 1 && (
          <StepPainPoints form={form} setForm={setForm} toggleArrayItem={toggleArrayItem} />
        )}
        {currentStep === 2 && (
          <StepOperations form={form} setForm={setForm} toggleArrayItem={toggleArrayItem} />
        )}
        {currentStep === 3 && (
          <StepGoalsBudget form={form} setForm={setForm} toggleArrayItem={toggleArrayItem} />
        )}
        {currentStep === 4 && (
          <StepReview form={form} />
        )}
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Back
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button onClick={handleNext} icon={<ArrowRight className="w-4 h-4" />}>
            Continue
          </Button>
        ) : (
          <Button onClick={handleSubmit} loading={loading} icon={<ArrowRight className="w-4 h-4" />}>
            Generate My Report
          </Button>
        )}
      </div>
    </div>
  );
}

// ============ Step Components ============

function StepBusinessInfo({
  form,
  setForm,
}: {
  form: FormData;
  setForm: (f: FormData) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-brand-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-surface-900">Business Information</h2>
          <p className="text-sm text-surface-500">Tell us the basics about your business</p>
        </div>
      </div>

      <Input
        label="Business Name"
        placeholder="e.g., Your Business Name"
        value={form.businessName}
        onChange={(e) => setForm({ ...form, businessName: e.target.value })}
      />

      <Select
        label="Business Type"
        options={businessTypeOptions}
        placeholder="Select your industry"
        value={form.businessType}
        onChange={(e) => setForm({ ...form, businessType: e.target.value })}
      />

      {form.businessType === "other" && (
        <Input
          label="Describe your business type"
          placeholder="e.g., Event planning, Pet grooming, Tutoring"
          value={form.customBusinessType}
          onChange={(e) => setForm({ ...form, customBusinessType: e.target.value })}
        />
      )}

      <Select
        label="Team Size"
        options={teamSizeOptions}
        placeholder="How many people on your team?"
        value={form.teamSize}
        onChange={(e) => setForm({ ...form, teamSize: e.target.value })}
      />

      <Select
        label="Comfort with Technology"
        options={comfortOptions}
        placeholder="How tech-savvy is your team?"
        value={form.comfortLevel}
        onChange={(e) => setForm({ ...form, comfortLevel: e.target.value })}
      />
    </div>
  );
}

function StepPainPoints({
  form,
  setForm,
  toggleArrayItem,
}: {
  form: FormData;
  setForm: (f: FormData) => void;
  toggleArrayItem: (field: keyof FormData, value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-accent-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-surface-900">Pain Points</h2>
          <p className="text-sm text-surface-500">
            What areas of your business cause the most friction? Select all that apply.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(painPointLabels).map(([key, label]) => (
          <ToggleChip
            key={key}
            label={label}
            selected={form.painPoints.includes(key)}
            onToggle={() => toggleArrayItem("painPoints", key)}
          />
        ))}
      </div>

      {form.painPoints.includes("other") && (
        <Input
          label="Describe your other pain point"
          placeholder="e.g., Managing vendor relationships"
          value={form.customPainPoint}
          onChange={(e) => setForm({ ...form, customPainPoint: e.target.value })}
        />
      )}

      {form.painPoints.length > 0 && (
        <p className="text-sm text-brand-600 font-medium">
          {form.painPoints.length} pain point{form.painPoints.length > 1 ? "s" : ""} selected
        </p>
      )}
    </div>
  );
}

function StepOperations({
  form,
  setForm,
  toggleArrayItem,
}: {
  form: FormData;
  setForm: (f: FormData) => void;
  toggleArrayItem: (field: keyof FormData, value: string) => void;
}) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center">
          <Wrench className="w-5 h-5 text-success-500" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-surface-900">Operations & Tools</h2>
          <p className="text-sm text-surface-500">Tell us about your daily operations and current tools</p>
        </div>
      </div>

      <div className="space-y-4">
        <Select
          label="Customer Communication Volume"
          options={volumeOptions}
          placeholder="How many customer messages per day?"
          value={form.customerCommunicationVolume}
          onChange={(e) => setForm({ ...form, customerCommunicationVolume: e.target.value })}
        />

        <Select
          label="Lead Volume"
          options={volumeOptions}
          placeholder="How many new potential customers or inquiries per day?"
          value={form.leadVolume}
          onChange={(e) => setForm({ ...form, leadVolume: e.target.value })}
        />

        <Select
          label="Scheduling Complexity"
          options={schedulingOptions}
          placeholder="How complex is your scheduling?"
          value={form.schedulingComplexity}
          onChange={(e) => setForm({ ...form, schedulingComplexity: e.target.value })}
        />
      </div>

      <div>
        <p className="text-sm font-medium text-surface-700 mb-3">
          Repetitive Tasks <span className="text-surface-400 font-normal">— Select tasks your team does repeatedly</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {repetitiveTasks.map((task) => (
            <ToggleChip
              key={task}
              label={task}
              selected={form.repetitiveTasks.includes(task)}
              onToggle={() => toggleArrayItem("repetitiveTasks", task)}
            />
          ))}
          <ToggleChip
            label="Other"
            selected={form.repetitiveTasks.includes("__other__")}
            onToggle={() => toggleArrayItem("repetitiveTasks", "__other__")}
          />
        </div>
        {form.repetitiveTasks.includes("__other__") && (
          <div className="mt-3">
            <Input
              label="Describe your other repetitive task"
              placeholder="e.g., Manually updating spreadsheets"
              value={form.customRepetitiveTask}
              onChange={(e) => setForm({ ...form, customRepetitiveTask: e.target.value })}
            />
          </div>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-surface-700 mb-3">
          Current Software & Tools <span className="text-surface-400 font-normal">— What do you already use?</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {commonTools.map((tool) => (
            <ToggleChip
              key={tool}
              label={tool}
              selected={form.existingTools.includes(tool)}
              onToggle={() => toggleArrayItem("existingTools", tool)}
            />
          ))}
          <ToggleChip
            label="Other"
            selected={form.existingTools.includes("__other__")}
            onToggle={() => toggleArrayItem("existingTools", "__other__")}
          />
        </div>
        {form.existingTools.includes("__other__") && (
          <div className="mt-3">
            <Input
              label="Describe your other tool"
              placeholder="e.g., Custom CRM, industry-specific software"
              value={form.customTool}
              onChange={(e) => setForm({ ...form, customTool: e.target.value })}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function StepGoalsBudget({
  form,
  setForm,
  toggleArrayItem,
}: {
  form: FormData;
  setForm: (f: FormData) => void;
  toggleArrayItem: (field: keyof FormData, value: string) => void;
}) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
          <Target className="w-5 h-5 text-brand-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-surface-900">Goals & Budget</h2>
          <p className="text-sm text-surface-500">What are you hoping to achieve?</p>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-surface-700 mb-3">
          Primary Goals <span className="text-surface-400 font-normal">— What matters most to you?</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(goalLabels).map(([key, label]) => (
            <ToggleChip
              key={key}
              label={label}
              selected={form.primaryGoals.includes(key)}
              onToggle={() => toggleArrayItem("primaryGoals", key)}
            />
          ))}
        </div>
        {form.primaryGoals.includes("other") && (
          <div className="mt-3">
            <Input
              label="Describe your other goal"
              placeholder="e.g., Improve team collaboration"
              value={form.customGoal}
              onChange={(e) => setForm({ ...form, customGoal: e.target.value })}
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-accent-600" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-surface-900">Budget for AI Tools</h2>
          <p className="text-sm text-surface-500">How much could you invest monthly in new tools?</p>
        </div>
      </div>

      <Select
        options={budgetOptions}
        placeholder="Select your budget range"
        value={form.budgetRange}
        onChange={(e) => setForm({ ...form, budgetRange: e.target.value })}
      />

      <div className="space-y-2">
        <div className="flex items-start gap-3 p-4 bg-brand-50 rounded-xl">
          <Zap className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
          <p className="text-sm text-brand-700">
            <span className="font-semibold">The more context you add, the more specific your results will be.</span>{" "}
            Tell us anything else about your business — your biggest frustrations, what you&apos;ve already tried, or specific goals you have in mind.
          </p>
        </div>
        <Textarea
          label="Additional Context (optional)"
          placeholder="e.g., We tried using Zapier but found it too complex. Our biggest bottleneck is onboarding new clients — it takes us 3 hours per client manually..."
          rows={5}
          value={form.additionalContext}
          onChange={(e) =>
            setForm({
              ...form,
              additionalContext: e.target.value.slice(0, MAX_ADDITIONAL_CONTEXT_LENGTH),
            })
          }
        />
        {form.additionalContext.length > 0 && (
          <p className="text-xs text-surface-400 text-right">
            {form.additionalContext.length}/{MAX_ADDITIONAL_CONTEXT_LENGTH} characters
          </p>
        )}
      </div>
    </div>
  );
}

function StepReview({ form }: { form: FormData }) {
  // Build display-friendly values including custom "other" entries
  const painPointDisplay = form.painPoints
    .map((p) => {
      if (p === "other" && form.customPainPoint) return form.customPainPoint;
      return painPointLabels[p] || p;
    })
    .join(", ") || "—";

  const repTaskDisplay = form.repetitiveTasks
    .filter((t) => t !== "__other__")
    .concat(form.customRepetitiveTask ? [form.customRepetitiveTask] : [])
    .join(", ") || "—";

  const toolsDisplay = form.existingTools
    .filter((t) => t !== "__other__")
    .concat(form.customTool ? [form.customTool] : [])
    .join(", ") || "—";

  const goalsDisplay = form.primaryGoals
    .map((g) => {
      if (g === "other" && form.customGoal) return form.customGoal;
      return goalLabels[g] || g;
    })
    .join(", ") || "—";

  const entries = [
    { label: "Business Name", value: form.businessName || "—" },
    {
      label: "Business Type",
      value:
        form.businessType === "other" && form.customBusinessType
          ? form.customBusinessType
          : businessTypeOptions.find((o) => o.value === form.businessType)?.label || "—",
    },
    {
      label: "Team Size",
      value: teamSizeOptions.find((o) => o.value === form.teamSize)?.label || "—",
    },
    { label: "Pain Points", value: painPointDisplay },
    { label: "Repetitive Tasks", value: repTaskDisplay },
    { label: "Current Tools", value: toolsDisplay },
    { label: "Goals", value: goalsDisplay },
    {
      label: "Budget",
      value: budgetOptions.find((o) => o.value === form.budgetRange)?.label || "—",
    },
    ...(form.additionalContext
      ? [{ label: "Additional Context", value: form.additionalContext }]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-surface-900 mb-1">Review Your Answers</h2>
        <p className="text-sm text-surface-500">
          Double-check your responses before we generate your AI readiness report.
        </p>
      </div>

      <div className="divide-y divide-surface-100">
        {entries.map((entry) => (
          <div key={entry.label} className="py-3 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
            <span className="text-sm font-medium text-surface-500 sm:w-40 shrink-0">
              {entry.label}
            </span>
            <span className="text-sm text-surface-900">{entry.value}</span>
          </div>
        ))}
      </div>

      <div className="bg-brand-50 rounded-xl p-4 flex items-start gap-3">
        <Zap className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-brand-800">Ready to generate your report</p>
          <p className="text-sm text-brand-600 mt-0.5">
            Click &quot;Generate My Report&quot; to receive your personalized AI readiness assessment. This typically takes a few seconds.
          </p>
        </div>
      </div>
    </div>
  );
}

function Zap(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
