import { AssessmentReport, Recommendation, ActionItem } from "./types";
import { businessTypeLabels, painPointLabels, goalLabels } from "./utils";

interface FormInput {
  businessName: string;
  businessType: string;
  customBusinessType?: string;
  teamSize: string;
  painPoints: string[];
  customPainPoint?: string;
  customerCommunicationVolume: string;
  leadVolume: string;
  schedulingComplexity: string;
  repetitiveTasks: string[];
  customRepetitiveTask?: string;
  existingTools: string[];
  customTool?: string;
  comfortLevel: string;
  budgetRange: string;
  primaryGoals: string[];
  customGoal?: string;
}

const STORAGE_KEY = "clearpath_assessment_data";

export function saveAssessmentData(data: FormInput) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadAssessmentData(): FormInput | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// =====================================================
// Dynamic report generation based on actual user input
// =====================================================

export function generateReport(input: FormInput): AssessmentReport {
  const businessLabel =
    input.businessType === "other" && input.customBusinessType
      ? input.customBusinessType
      : businessTypeLabels[input.businessType] || input.businessType || "your business";
  const bName = input.businessName || "Your Business";

  // Collect all pain points including custom — filter out raw "other" key
  const allPainPoints = input.painPoints
    .filter((p) => p !== "other")
    .map((p) => painPointLabels[p] || p)
    .concat(input.customPainPoint ? [input.customPainPoint] : []);

  // Collect all goals including custom — filter out raw "other" key
  const allGoals = input.primaryGoals
    .filter((g) => g !== "other")
    .map((g) => goalLabels[g] || g)
    .concat(input.customGoal ? [input.customGoal] : []);

  // Collect all repetitive tasks including custom — filter out __other__ marker
  const allTasks = [
    ...input.repetitiveTasks.filter((t) => t !== "__other__"),
    ...(input.customRepetitiveTask ? [input.customRepetitiveTask] : []),
  ];

  // Collect all tools including custom — filter out __other__ marker
  const allTools = [
    ...input.existingTools.filter((t) => t !== "__other__"),
    ...(input.customTool ? [input.customTool] : []),
  ];

  // ---------- Score Calculation ----------
  const digitalScore = computeDigitalScore(input, allTools);
  const processScore = computeProcessScore(input, allTasks);
  const teamScore = computeTeamScore(input);
  const dataScore = computeDataScore(input, allTools);
  const budgetScore = computeBudgetScore(input);
  const growthScore = computeGrowthScore(input, allGoals);

  const categoryScores = [
    { category: "Digital Foundation", score: digitalScore, maxScore: 100 },
    { category: "Process Readiness", score: processScore, maxScore: 100 },
    { category: "Team Readiness", score: teamScore, maxScore: 100 },
    { category: "Data Availability", score: dataScore, maxScore: 100 },
    { category: "Budget Alignment", score: budgetScore, maxScore: 100 },
    { category: "Growth Potential", score: growthScore, maxScore: 100 },
  ];

  const readinessScore = Math.round(
    categoryScores.reduce((sum, c) => sum + c.score, 0) / categoryScores.length
  );

  const readinessLevel: AssessmentReport["readinessLevel"] =
    readinessScore >= 75
      ? "Ready to Go"
      : readinessScore >= 60
        ? "Well Positioned"
        : readinessScore >= 40
          ? "Getting Ready"
          : "Starting Out";

  // ---------- Summary ----------
  const summary = buildSummary(
    bName,
    businessLabel,
    readinessScore,
    readinessLevel,
    allPainPoints,
    allGoals,
    input.comfortLevel,
    allTools
  );

  // ---------- Recommendations ----------
  const recommendations = buildRecommendations(input, allPainPoints, allTasks, allGoals);

  // ---------- Action Plan ----------
  const actionPlan = buildActionPlan(recommendations, bName);

  // ---------- Strengths & Considerations ----------
  const strengths = buildStrengths(input, allTools, allGoals);
  const considerations = buildConsiderations(input, businessLabel);

  return {
    id: "rpt_" + Date.now().toString(36),
    createdAt: new Date().toISOString(),
    businessName: bName,
    businessType: (input.businessType as AssessmentReport["businessType"]) || "other",
    businessTypeDisplay: businessLabel,
    readinessScore,
    readinessLevel,
    summary,
    recommendations,
    actionPlan,
    strengths,
    considerations,
    categoryScores,
  };
}

// =====================================================
// Score helpers
// =====================================================

function computeDigitalScore(input: FormInput, tools: string[]): number {
  let score = 40;
  if (tools.length >= 5) score += 25;
  else if (tools.length >= 3) score += 15;
  else if (tools.length >= 1) score += 8;
  if (input.comfortLevel === "advanced") score += 20;
  else if (input.comfortLevel === "comfortable") score += 15;
  else if (input.comfortLevel === "intermediate") score += 10;
  return Math.min(score, 100);
}

function computeProcessScore(input: FormInput, tasks: string[]): number {
  let score = 35;
  // More repetitive tasks = more process insight = higher readiness
  if (tasks.length >= 6) score += 25;
  else if (tasks.length >= 3) score += 15;
  else if (tasks.length >= 1) score += 8;
  if (input.schedulingComplexity === "complex") score += 15;
  else if (input.schedulingComplexity === "moderate") score += 10;
  return Math.min(score, 100);
}

function computeTeamScore(input: FormInput): number {
  let score = 40;
  if (input.comfortLevel === "advanced") score += 30;
  else if (input.comfortLevel === "comfortable") score += 22;
  else if (input.comfortLevel === "intermediate") score += 14;
  const sizeMap: Record<string, number> = {
    solo: 5,
    "2-5": 10,
    "6-15": 15,
    "16-30": 12,
    "31-50": 10,
    "50+": 8,
  };
  score += sizeMap[input.teamSize] || 5;
  return Math.min(score, 100);
}

function computeDataScore(input: FormInput, tools: string[]): number {
  let score = 30;
  const dataTools = [
    "Google Workspace",
    "Microsoft 365",
    "QuickBooks",
    "HubSpot",
    "Shopify",
    "Square POS",
    "Stripe",
    "Freshbooks",
  ];
  const overlap = tools.filter((t) => dataTools.includes(t)).length;
  score += overlap * 8;
  if (input.comfortLevel === "advanced" || input.comfortLevel === "comfortable") score += 10;
  return Math.min(score, 100);
}

function computeBudgetScore(input: FormInput): number {
  const map: Record<string, number> = {
    under_100: 40,
    "100_300": 55,
    "300_500": 70,
    "500_1000": 85,
    "1000_plus": 95,
  };
  return map[input.budgetRange] || 40;
}

function computeGrowthScore(input: FormInput, goals: string[]): number {
  let score = 45;
  score += Math.min(goals.length * 8, 30);
  if (
    input.customerCommunicationVolume === "high" ||
    input.customerCommunicationVolume === "very_high"
  )
    score += 10;
  if (input.leadVolume === "high" || input.leadVolume === "very_high") score += 10;
  return Math.min(score, 100);
}

// =====================================================
// Summary
// =====================================================

function buildSummary(
  bName: string,
  businessLabel: string,
  score: number,
  level: string,
  painPoints: string[],
  goals: string[],
  comfort: string,
  tools: string[]
): string {
  // Format pain points as a readable list with "like" phrasing
  const painStr =
    painPoints.length > 0
      ? formatList(painPoints.slice(0, 3).map((p) => p.toLowerCase()))
      : "several operational areas";

  // Format goals as gerund phrases so they read naturally after "such as"
  const goalStr =
    goals.length > 0
      ? formatList(goals.slice(0, 3).map((g) => toGerundPhrase(g.toLowerCase())))
      : "improving efficiency";

  const toolStr =
    tools.length > 0
      ? `Already using ${formatList(tools.slice(0, 3))}, ${bName}`
      : `${bName}`;

  const comfortMap: Record<string, string> = {
    beginner:
      "Your team is still early in its tech journey, so starting with one or two focused tools will build momentum and confidence for broader adoption.",
    intermediate:
      "Your team's intermediate comfort with technology makes implementation straightforward.",
    comfortable:
      "With a tech-comfortable team already using multiple digital tools, implementation should be smooth.",
    advanced:
      "Your team's advanced technical skills position you well for rapid implementation across multiple areas.",
  };
  const comfortSentence = comfortMap[comfort] || comfortMap.intermediate;

  if (score >= 75) {
    return `${bName}, a ${businessLabel.toLowerCase()}, is highly ready for AI adoption. With challenges like ${painStr} and goals such as ${goalStr}, there are strong opportunities to drive major efficiency gains. ${toolStr} has a solid digital foundation. ${comfortSentence}`;
  }
  if (score >= 60) {
    return `${bName}, a ${businessLabel.toLowerCase()}, has a strong foundation for AI adoption. With pain points like ${painStr} and goals focused on ${goalStr}, there are clear opportunities to save significant time and improve operations. ${toolStr} can start implementing targeted AI solutions right away. ${comfortSentence}`;
  }
  if (score >= 40) {
    return `${bName}, a ${businessLabel.toLowerCase()}, is getting ready for AI adoption. Key challenges like ${painStr} highlight areas where AI could help, especially around ${goalStr}. ${comfortSentence}`;
  }
  return `${bName}, a ${businessLabel.toLowerCase()}, is at the beginning of its AI journey. Addressing challenges like ${painStr} will be important, especially for ${goalStr}. ${comfortSentence}`;
}

/** Joins items as "a, b, and c" */
function formatList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

/** Converts goal labels to gerund-style phrases for natural reading */
function toGerundPhrase(text: string): string {
  const conversions: Record<string, string> = {
    "save time": "saving time",
    "improve customer support": "improving customer support",
    "increase sales": "increasing sales",
    "reduce manual work": "reducing manual work",
    "grow the business": "growing the business",
    "reduce costs": "reducing costs",
  };
  return conversions[text] || text;
}

// =====================================================
// Recommendations engine
// =====================================================

interface RecTemplate {
  id: string;
  title: string;
  description: string;
  match: (input: FormInput) => boolean;
  whyFn: (input: FormInput, bName: string) => string;
  impact: Recommendation["impact"];
  difficulty: Recommendation["difficulty"];
  timeToValue: Recommendation["timeToValue"];
  estimatedTimeSaved: string;
  toolCategory: string;
  risks: string[];
  icon: string;
}

const recTemplates: RecTemplate[] = [
  {
    id: "rec_sched",
    title: "Automated Scheduling & Reminders",
    description:
      "Implement an AI-powered scheduling system that handles booking, rescheduling, and automated reminders via SMS and email. Reduces no-shows and eliminates back-and-forth communication.",
    match: (i) =>
      i.painPoints.includes("scheduling") ||
      i.schedulingComplexity === "complex" ||
      i.schedulingComplexity === "moderate",
    whyFn: (i, b) =>
      `You indicated scheduling as a challenge${i.schedulingComplexity === "complex" ? " with complex, multi-staff coordination" : ""}. ${b} likely loses staff time on phone-based scheduling. Automating this directly reduces no-shows by 30-40%.`,
    impact: "very_high",
    difficulty: "easy",
    timeToValue: "1-2 weeks",
    estimatedTimeSaved: "6-10 hours/week",
    toolCategory: "Scheduling & Communication",
    risks: [
      "Some customers may prefer phone calls initially",
      "Initial setup requires importing existing appointments",
    ],
    icon: "calendar",
  },
  {
    id: "rec_comm",
    title: "AI-Powered Customer Communication Hub",
    description:
      "Deploy a smart communication platform that handles routine inquiries, sends personalized follow-ups, manages review requests, and routes complex questions to staff.",
    match: (i) =>
      i.painPoints.includes("customer_communication") ||
      i.painPoints.includes("customer_support") ||
      i.customerCommunicationVolume === "high" ||
      i.customerCommunicationVolume === "very_high",
    whyFn: (i, b) =>
      `With ${i.customerCommunicationVolume === "very_high" ? "very high" : "high"} communication volume, ${b}'s team is likely spending hours daily on routine messages. Automating these while maintaining a personal touch frees up significant staff time.`,
    impact: "high",
    difficulty: "moderate",
    timeToValue: "2-4 weeks",
    estimatedTimeSaved: "5-8 hours/week",
    toolCategory: "Customer Communication",
    risks: [
      "Responses need periodic review for accuracy",
      "Complex edge cases still require human handling",
    ],
    icon: "message-square",
  },
  {
    id: "rec_docs",
    title: "Smart Document & Data Entry Automation",
    description:
      "Replace manual data entry with AI-powered document processing. Automatically extract information from forms, invoices, and records to populate your systems.",
    match: (i) =>
      i.painPoints.includes("data_entry") ||
      i.repetitiveTasks.includes("Data entry") ||
      i.repetitiveTasks.includes("Customer intake forms"),
    whyFn: (_i, b) =>
      `Data entry and document processing are among ${b}'s repetitive tasks. Automating this eliminates transcription errors and frees up staff for higher-value work.`,
    impact: "high",
    difficulty: "moderate",
    timeToValue: "2-4 weeks",
    estimatedTimeSaved: "4-6 hours/week",
    toolCategory: "Document Automation",
    risks: [
      "Staff training period of 1-2 weeks",
      "Need reliable internet connectivity",
    ],
    icon: "file-text",
  },
  {
    id: "rec_billing",
    title: "Automated Invoicing & Billing",
    description:
      "Streamline billing with AI that auto-generates invoices, tracks payments, sends reminders, and flags issues before they become problems.",
    match: (i) =>
      i.painPoints.includes("invoicing") ||
      i.repetitiveTasks.includes("Invoice generation"),
    whyFn: (_i, b) =>
      `You listed invoicing as a pain point. Automating billing at ${b} reduces late payments, accelerates your revenue cycle, and eliminates manual invoice creation.`,
    impact: "high",
    difficulty: "challenging",
    timeToValue: "1-2 months",
    estimatedTimeSaved: "3-5 hours/week",
    toolCategory: "Financial Automation",
    risks: [
      "Integration with existing accounting tools needed",
      "Initial setup requires configuring pricing/templates",
    ],
    icon: "receipt",
  },
  {
    id: "rec_leads",
    title: "AI Lead Management & Follow-up",
    description:
      "Automatically capture, score, and nurture leads with personalized follow-up sequences. Ensure no lead falls through the cracks with smart reminders and routing.",
    match: (i) =>
      i.painPoints.includes("lead_management") ||
      i.leadVolume === "high" ||
      i.leadVolume === "very_high" ||
      i.repetitiveTasks.includes("Lead follow-up"),
    whyFn: (i, b) =>
      `With ${i.leadVolume === "very_high" ? "very high" : i.leadVolume} lead volume, ${b} can't afford to let prospects slip away. AI lead management ensures every inquiry gets a fast, personalized response.`,
    impact: "very_high",
    difficulty: "moderate",
    timeToValue: "1-2 weeks",
    estimatedTimeSaved: "5-8 hours/week",
    toolCategory: "Sales & Marketing",
    risks: [
      "Lead scoring rules need tuning over time",
      "CRM integration may require setup",
    ],
    icon: "star",
  },
  {
    id: "rec_social",
    title: "AI Social Media & Content Management",
    description:
      "Use AI to generate content ideas, draft posts, schedule across platforms, and analyze engagement — keeping your brand active without the daily grind.",
    match: (i) =>
      i.painPoints.includes("social_media") ||
      i.repetitiveTasks.includes("Social media posting"),
    whyFn: (_i, b) =>
      `Social media management is a time sink for ${b}. AI tools can generate on-brand content, auto-schedule posts, and analyze what resonates — all with minimal daily effort.`,
    impact: "medium",
    difficulty: "easy",
    timeToValue: "days",
    estimatedTimeSaved: "3-5 hours/week",
    toolCategory: "Marketing & Growth",
    risks: [
      "AI-generated content needs brand voice review",
      "Platform algorithm changes can affect reach",
    ],
    icon: "star",
  },
  {
    id: "rec_inventory",
    title: "Smart Inventory & Supply Chain Tracking",
    description:
      "AI-powered inventory management that predicts stock needs, automates reordering, and reduces waste with demand forecasting.",
    match: (i) =>
      i.painPoints.includes("inventory") ||
      i.repetitiveTasks.includes("Inventory counting"),
    whyFn: (_i, b) =>
      `Inventory management is a clear pain point for ${b}. AI forecasting prevents stockouts and overordering, saving both time and money.`,
    impact: "high",
    difficulty: "moderate",
    timeToValue: "2-4 weeks",
    estimatedTimeSaved: "3-5 hours/week",
    toolCategory: "Operations",
    risks: [
      "Requires accurate historical data for best results",
      "Integration with existing POS/ERP needed",
    ],
    icon: "file-text",
  },
  {
    id: "rec_reporting",
    title: "Automated Reporting & Analytics",
    description:
      "Replace manual report compilation with AI dashboards that automatically aggregate data, identify trends, and surface actionable insights.",
    match: (i) =>
      i.painPoints.includes("reporting") ||
      i.repetitiveTasks.includes("Report compilation"),
    whyFn: (_i, b) =>
      `Report compilation is eating into productive time at ${b}. Automated analytics give you real-time insights without the manual effort.`,
    impact: "medium",
    difficulty: "moderate",
    timeToValue: "2-4 weeks",
    estimatedTimeSaved: "3-4 hours/week",
    toolCategory: "Analytics & Insights",
    risks: [
      "Data sources need to be connected/integrated",
      "Custom metrics may require initial configuration",
    ],
    icon: "file-text",
  },
  {
    id: "rec_hiring",
    title: "AI-Assisted Hiring & Recruitment",
    description:
      "Streamline hiring with AI that screens resumes, schedules interviews, and identifies the best candidates faster.",
    match: (i) => i.painPoints.includes("hiring"),
    whyFn: (_i, b) =>
      `Hiring is a challenge for ${b}. AI recruitment tools dramatically cut time-to-hire by automating screening and scheduling while finding better-fit candidates.`,
    impact: "medium",
    difficulty: "moderate",
    timeToValue: "2-4 weeks",
    estimatedTimeSaved: "3-5 hours/week",
    toolCategory: "HR & Recruitment",
    risks: [
      "AI screening should be reviewed for bias",
      "Candidate experience still needs human touch",
    ],
    icon: "star",
  },
  {
    id: "rec_email",
    title: "Automated Email & Follow-up Sequences",
    description:
      "Set up AI-driven email workflows that send the right message at the right time — appointment reminders, follow-ups, promotions, and re-engagement campaigns.",
    match: (i) =>
      i.repetitiveTasks.includes("Follow-up emails") ||
      i.repetitiveTasks.includes("Appointment reminders"),
    whyFn: (_i, b) =>
      `${b}'s team spends time on repetitive email tasks like reminders and follow-ups. Automating these ensures nothing falls through the cracks while freeing up hours every week.`,
    impact: "high",
    difficulty: "easy",
    timeToValue: "1-2 weeks",
    estimatedTimeSaved: "4-6 hours/week",
    toolCategory: "Email & Communication",
    risks: [
      "Email deliverability needs monitoring",
      "Templates should be personalized for best results",
    ],
    icon: "message-square",
  },
  {
    id: "rec_proposals",
    title: "AI-Powered Proposal & Document Generation",
    description:
      "Use AI to draft proposals, contracts, and documents in minutes instead of hours. Customize templates for each client automatically.",
    match: (i) => i.repetitiveTasks.includes("Proposal writing"),
    whyFn: (_i, b) =>
      `Proposal writing is one of ${b}'s repetitive tasks. AI document generation creates professional, customized proposals in a fraction of the time.`,
    impact: "medium",
    difficulty: "easy",
    timeToValue: "days",
    estimatedTimeSaved: "3-5 hours/week",
    toolCategory: "Document Automation",
    risks: [
      "Generated content should be reviewed before sending",
      "Templates need initial setup",
    ],
    icon: "file-text",
  },
  {
    id: "rec_faq",
    title: "AI Chatbot for FAQs & Customer Self-Service",
    description:
      "Deploy an AI chatbot on your website that answers common questions instantly, captures leads, and escalates complex issues to your team.",
    match: (i) =>
      i.repetitiveTasks.includes("Answering FAQs") ||
      i.painPoints.includes("customer_support"),
    whyFn: (_i, b) =>
      `${b} handles many repeated customer questions. An AI chatbot provides instant answers 24/7, reducing support load and improving customer experience.`,
    impact: "high",
    difficulty: "easy",
    timeToValue: "1-2 weeks",
    estimatedTimeSaved: "5-8 hours/week",
    toolCategory: "Customer Support",
    risks: [
      "Chatbot needs training on your specific FAQ content",
      "Complex queries still need human escalation",
    ],
    icon: "message-square",
  },
  {
    id: "rec_staffsched",
    title: "AI Staff Scheduling & Workforce Management",
    description:
      "Optimize staff schedules automatically based on demand patterns, availability, and labor rules. Reduce scheduling conflicts and overtime costs.",
    match: (i) => i.repetitiveTasks.includes("Scheduling staff"),
    whyFn: (_i, b) =>
      `Staff scheduling is a recurring task at ${b}. AI scheduling tools optimize shifts based on demand, reducing conflicts and saving management time.`,
    impact: "medium",
    difficulty: "moderate",
    timeToValue: "2-4 weeks",
    estimatedTimeSaved: "2-4 hours/week",
    toolCategory: "Operations",
    risks: [
      "Staff need to adopt the new scheduling system",
      "Shift preferences need initial configuration",
    ],
    icon: "calendar",
  },
];

// Fallback generic recommendation
function fallbackRec(bName: string, priority: number): Recommendation {
  return {
    id: `rec_generic_${priority}`,
    title: "Reputation & Review Management",
    description:
      "Automatically request reviews from satisfied customers at optimal timing, monitor online reputation across platforms, and generate response suggestions.",
    whyItMatches: `Growing ${bName} and improving customer relationships are key goals. Online reputation directly drives new customer acquisition, and this requires minimal effort once set up.`,
    impact: "medium",
    difficulty: "easy",
    timeToValue: "days",
    estimatedTimeSaved: "2-3 hours/week",
    toolCategory: "Marketing & Growth",
    risks: [
      "Review platform policies change frequently",
      "Requires consistent monitoring initially",
    ],
    priority,
    icon: "star",
  };
}

function buildRecommendations(
  input: FormInput,
  _painPoints: string[],
  _tasks: string[],
  _goals: string[]
): Recommendation[] {
  const bName = input.businessName || "Your Business";
  const matched: Recommendation[] = [];

  for (const tpl of recTemplates) {
    if (tpl.match(input)) {
      matched.push({
        id: tpl.id,
        title: tpl.title,
        description: tpl.description,
        whyItMatches: tpl.whyFn(input, bName),
        impact: tpl.impact,
        difficulty: tpl.difficulty,
        timeToValue: tpl.timeToValue,
        estimatedTimeSaved: tpl.estimatedTimeSaved,
        toolCategory: tpl.toolCategory,
        risks: tpl.risks,
        priority: matched.length + 1,
        icon: tpl.icon,
      });
    }
  }

  // Ensure at least 3 recommendations
  while (matched.length < 3) {
    matched.push(fallbackRec(bName, matched.length + 1));
  }

  // Cap at 5 and fix priorities
  return matched.slice(0, 5).map((r, i) => ({ ...r, priority: i + 1 }));
}

// =====================================================
// Action Plan
// =====================================================

function buildActionPlan(
  recommendations: Recommendation[],
  _bName: string
): ActionItem[] {
  const items: ActionItem[] = [];
  const timeframes = ["This week", "This week", "Next week", "Next week", "Week 2", "Week 3-4"];

  recommendations.forEach((rec, idx) => {
    items.push({
      id: `act_${idx + 1}a`,
      task: `Research and choose a ${rec.toolCategory.toLowerCase()} tool`,
      description: `Look into platforms for "${rec.title}". Schedule demos with 2-3 vendors and compare pricing against your budget.`,
      timeframe: timeframes[idx * 2] || "Week 3-4",
      completed: false,
    });
    items.push({
      id: `act_${idx + 1}b`,
      task: `Implement: ${rec.title}`,
      description: `Set up your chosen tool, configure it for your workflow, and train your team. Expected time to value: ${rec.timeToValue}.`,
      timeframe: timeframes[idx * 2 + 1] || "Week 3-4",
      completed: false,
    });
  });

  return items.slice(0, 6);
}

// =====================================================
// Strengths
// =====================================================

function buildStrengths(
  input: FormInput,
  tools: string[],
  goals: string[]
): string[] {
  const s: string[] = [];
  if (tools.length >= 3) s.push(`Already using multiple digital tools (${tools.slice(0, 3).join(", ")})`);
  else if (tools.length >= 1) s.push(`Already using digital tools (${tools.join(", ")})`);
  const comfortMap: Record<string, string> = {
    beginner: "Willingness to explore new technology",
    intermediate: "Team has intermediate technology comfort",
    comfortable: "Tech-comfortable team ready for new tools",
    advanced: "Technically advanced team primed for AI adoption",
  };
  if (comfortMap[input.comfortLevel]) s.push(comfortMap[input.comfortLevel]);
  if (input.painPoints.length >= 3)
    s.push("Clear understanding of pain points — a strong foundation for targeted AI adoption");
  if (goals.length >= 2) s.push("Well-defined goals that align with proven AI use cases");
  if (
    input.budgetRange === "300_500" ||
    input.budgetRange === "500_1000" ||
    input.budgetRange === "1000_plus"
  )
    s.push("Reasonable budget allocated for improvement");
  if (
    input.customerCommunicationVolume === "high" ||
    input.customerCommunicationVolume === "very_high"
  )
    s.push("High customer engagement volume with clear ROI potential for automation");
  if (s.length < 3) s.push("Taking the initiative to assess AI readiness is already a great first step");
  return s;
}

// =====================================================
// Considerations
// =====================================================

function buildConsiderations(
  input: FormInput,
  businessLabel: string
): string[] {
  const c: string[] = [];
  if (input.businessType === "healthcare")
    c.push("HIPAA compliance is critical for any AI tool handling patient data");
  if (input.businessType === "ecommerce" || input.businessType === "retail")
    c.push("Customer data privacy (GDPR/CCPA) should be verified for all new tools");

  c.push("Start with one tool at a time to avoid change fatigue");
  c.push("Staff training should be planned alongside each new tool rollout");

  if (input.comfortLevel === "beginner")
    c.push("Choose tools with strong onboarding support and simple interfaces");
  if (input.teamSize === "solo" || input.teamSize === "2-5")
    c.push("With a smaller team, prioritize tools that require minimal ongoing management");

  c.push(`Monitor customer satisfaction during transitions at your ${businessLabel.toLowerCase()}`);
  c.push("Keep manual fallback processes during initial adoption");
  return c.slice(0, 5);
}
