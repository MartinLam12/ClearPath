import { AssessmentReport, User, DashboardStats, AssessmentInput } from "./types";

// ============ Mock User ============
export const mockUser: User = {
  id: "usr_01",
  name: "Sarah Chen",
  email: "sarah@brightsmilesdental.com",
  businessName: "Bright Smiles Dental",
  createdAt: "2026-03-15T10:00:00Z",
};

// ============ Mock Dashboard Stats ============
export const mockDashboardStats: DashboardStats = {
  totalAssessments: 3,
  averageScore: 62,
  topOpportunity: "Automated Appointment Scheduling",
  estimatedTimeSaved: "12-18 hours/week",
};

// ============ Mock Assessment Input ============
export const mockAssessmentInput: AssessmentInput = {
  businessName: "Bright Smiles Dental",
  businessType: "healthcare",
  teamSize: "6-15",
  painPoints: ["scheduling", "customer_communication", "data_entry", "invoicing"],
  customerCommunicationVolume: "high",
  leadVolume: "medium",
  schedulingComplexity: "complex",
  repetitiveTasks: [
    "Appointment reminders",
    "Insurance verification",
    "Patient intake forms",
    "Follow-up emails",
    "Billing data entry",
  ],
  existingTools: ["Google Workspace", "QuickBooks", "Basic website"],
  comfortLevel: "intermediate",
  budgetRange: "300_500",
  primaryGoals: ["save_time", "improve_support", "reduce_manual_work"],
};

// ============ Mock Reports ============
export const mockReport: AssessmentReport = {
  id: "rpt_001",
  createdAt: "2026-04-05T14:30:00Z",
  businessName: "Bright Smiles Dental",
  businessType: "healthcare",
  readinessScore: 68,
  readinessLevel: "Well Positioned",
  summary:
    "Your dental practice has a strong foundation for AI adoption. With high customer communication volume, complex scheduling needs, and several repetitive administrative tasks, there are clear opportunities to save significant time and improve patient experience. Your team's intermediate comfort with technology and existing digital tools make implementation straightforward.",
  recommendations: [
    {
      id: "rec_01",
      title: "Automated Appointment Scheduling & Reminders",
      description:
        "Implement an AI-powered scheduling system that handles booking, rescheduling, and automated reminders via SMS and email. Reduces no-shows by 30-40% and eliminates back-and-forth phone calls.",
      whyItMatches:
        "You indicated complex scheduling as a major pain point with high communication volume. Your practice likely loses significant staff time on phone-based scheduling and deals with costly no-shows.",
      impact: "very_high",
      difficulty: "easy",
      timeToValue: "1-2 weeks",
      estimatedTimeSaved: "8-10 hours/week",
      toolCategory: "Scheduling & Communication",
      risks: [
        "Some older patients may prefer phone calls",
        "Initial setup requires importing existing appointments",
      ],
      priority: 1,
      icon: "calendar",
    },
    {
      id: "rec_02",
      title: "AI-Powered Patient Communication Hub",
      description:
        "Deploy a smart communication platform that handles routine patient inquiries, sends personalized follow-ups after visits, manages review requests, and routes complex questions to staff.",
      whyItMatches:
        "With high customer communication volume and customer communication listed as a pain point, your team is likely spending hours daily on routine messages that could be automated while maintaining a personal touch.",
      impact: "high",
      difficulty: "moderate",
      timeToValue: "2-4 weeks",
      estimatedTimeSaved: "5-7 hours/week",
      toolCategory: "Customer Communication",
      risks: [
        "HIPAA compliance must be verified",
        "Responses need periodic review for accuracy",
      ],
      priority: 2,
      icon: "message-square",
    },
    {
      id: "rec_03",
      title: "Smart Intake & Documentation Automation",
      description:
        "Replace paper intake forms with digital forms that auto-populate patient records. Use AI to extract information from insurance cards and pre-fill verification forms.",
      whyItMatches:
        "Data entry and patient intake forms are among your repetitive tasks. Automating this eliminates manual transcription errors and frees up front desk staff for patient-facing work.",
      impact: "high",
      difficulty: "moderate",
      timeToValue: "2-4 weeks",
      estimatedTimeSaved: "4-6 hours/week",
      toolCategory: "Document Automation",
      risks: [
        "Staff training period of 1-2 weeks",
        "Need reliable internet connectivity",
      ],
      priority: 3,
      icon: "file-text",
    },
    {
      id: "rec_04",
      title: "Automated Billing & Insurance Processing",
      description:
        "Streamline billing with AI that auto-generates invoices from treatment codes, verifies insurance eligibility in real-time, and flags claim issues before submission.",
      whyItMatches:
        "You listed invoicing as a pain point and billing data entry as repetitive. Automating this reduces claim denials and accelerates your revenue cycle.",
      impact: "high",
      difficulty: "challenging",
      timeToValue: "1-2 months",
      estimatedTimeSaved: "3-5 hours/week",
      toolCategory: "Financial Automation",
      risks: [
        "Integration with existing QuickBooks needed",
        "Insurance verification accuracy varies by provider",
      ],
      priority: 4,
      icon: "receipt",
    },
    {
      id: "rec_05",
      title: "Review & Reputation Management",
      description:
        "Automatically request reviews from satisfied patients at optimal timing, monitor online reputation across platforms, and generate response suggestions for reviews.",
      whyItMatches:
        "Growing your practice and improving patient support are primary goals. Online reputation directly drives new patient acquisition for dental practices, and this requires minimal effort once set up.",
      impact: "medium",
      difficulty: "easy",
      timeToValue: "days",
      estimatedTimeSaved: "2-3 hours/week",
      toolCategory: "Marketing & Growth",
      risks: [
        "Review platform policies change frequently",
        "Requires consistent monitoring initially",
      ],
      priority: 5,
      icon: "star",
    },
  ],
  actionPlan: [
    {
      id: "act_01",
      task: "Set up automated appointment reminders",
      description:
        "Choose and configure an AI scheduling tool. Start with SMS reminders for existing appointments this week.",
      timeframe: "This week",
      completed: false,
    },
    {
      id: "act_02",
      task: "Digitize your intake forms",
      description:
        "Convert your top 3 most-used paper forms to digital versions. Test with staff before rolling out to patients.",
      timeframe: "This week",
      completed: false,
    },
    {
      id: "act_03",
      task: "Audit your current communication workflow",
      description:
        "Track how many patient messages your team handles daily, what types they are, and how long each takes. This data will help you set up the right automation.",
      timeframe: "Next week",
      completed: false,
    },
    {
      id: "act_04",
      task: "Research HIPAA-compliant AI communication tools",
      description:
        "Look into platforms specifically designed for healthcare. Schedule demos with 2-3 vendors.",
      timeframe: "Next week",
      completed: false,
    },
    {
      id: "act_05",
      task: "Set up automated review requests",
      description:
        "Configure post-visit review request emails. Start with a simple template and refine based on response rates.",
      timeframe: "Week 2",
      completed: false,
    },
    {
      id: "act_06",
      task: "Begin billing automation evaluation",
      description:
        "Document your current billing workflow and identify the most time-consuming steps. Research AI billing tools that integrate with QuickBooks.",
      timeframe: "Week 3-4",
      completed: false,
    },
  ],
  strengths: [
    "Already using digital tools (Google Workspace, QuickBooks)",
    "Team has intermediate technology comfort",
    "Clear understanding of pain points",
    "Reasonable budget allocated for improvement",
    "High-volume practice with clear ROI potential",
  ],
  considerations: [
    "HIPAA compliance is critical for any AI tool handling patient data",
    "Staff training should be planned alongside each new tool rollout",
    "Start with one tool at a time to avoid change fatigue",
    "Monitor patient satisfaction during transitions",
    "Keep manual fallback processes during initial adoption",
  ],
  categoryScores: [
    { category: "Digital Foundation", score: 70, maxScore: 100 },
    { category: "Process Readiness", score: 65, maxScore: 100 },
    { category: "Team Readiness", score: 72, maxScore: 100 },
    { category: "Data Availability", score: 55, maxScore: 100 },
    { category: "Budget Alignment", score: 75, maxScore: 100 },
    { category: "Growth Potential", score: 80, maxScore: 100 },
  ],
};

export const mockReportsList: Pick<
  AssessmentReport,
  "id" | "createdAt" | "businessName" | "readinessScore" | "readinessLevel" | "businessType"
>[] = [
  {
    id: "rpt_001",
    createdAt: "2026-04-05T14:30:00Z",
    businessName: "Bright Smiles Dental",
    readinessScore: 68,
    readinessLevel: "Well Positioned",
    businessType: "healthcare",
  },
  {
    id: "rpt_002",
    createdAt: "2026-03-28T09:15:00Z",
    businessName: "Bright Smiles Dental",
    readinessScore: 54,
    readinessLevel: "Getting Ready",
    businessType: "healthcare",
  },
  {
    id: "rpt_003",
    createdAt: "2026-03-20T16:45:00Z",
    businessName: "Bright Smiles Dental",
    readinessScore: 41,
    readinessLevel: "Getting Ready",
    businessType: "healthcare",
  },
];
