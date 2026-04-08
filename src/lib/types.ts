// Types for the ClearPath application

// ============ Assessment Types ============

export type BusinessType =
  | "service"
  | "agency"
  | "ecommerce"
  | "healthcare"
  | "beauty"
  | "construction"
  | "consulting"
  | "restaurant"
  | "retail"
  | "other";

export type TeamSize = "solo" | "2-5" | "6-15" | "16-30" | "31-50" | "50+";

export type PainPoint =
  | "scheduling"
  | "customer_communication"
  | "lead_management"
  | "invoicing"
  | "inventory"
  | "social_media"
  | "data_entry"
  | "reporting"
  | "hiring"
  | "customer_support";

export type BudgetRange =
  | "under_100"
  | "100_300"
  | "300_500"
  | "500_1000"
  | "1000_plus";

export type PrimaryGoal =
  | "save_time"
  | "improve_support"
  | "increase_sales"
  | "reduce_manual_work"
  | "grow_business"
  | "reduce_costs";

export type ComfortLevel = "beginner" | "intermediate" | "comfortable" | "advanced";

export interface AssessmentInput {
  businessName: string;
  businessType: BusinessType;
  teamSize: TeamSize;
  painPoints: PainPoint[];
  customerCommunicationVolume: "low" | "medium" | "high" | "very_high";
  leadVolume: "low" | "medium" | "high" | "very_high";
  schedulingComplexity: "none" | "simple" | "moderate" | "complex";
  repetitiveTasks: string[];
  existingTools: string[];
  comfortLevel: ComfortLevel;
  budgetRange: BudgetRange;
  primaryGoals: PrimaryGoal[];
}

// ============ Report Types ============

export type ImpactLevel = "low" | "medium" | "high" | "very_high";
export type DifficultyLevel = "easy" | "moderate" | "challenging" | "complex";
export type TimeToValue = "days" | "1-2 weeks" | "2-4 weeks" | "1-2 months" | "3+ months";

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  whyItMatches: string;
  impact: ImpactLevel;
  difficulty: DifficultyLevel;
  timeToValue: TimeToValue;
  estimatedTimeSaved: string;
  toolCategory: string;
  risks: string[];
  priority: number;
  icon: string;
}

export interface ActionItem {
  id: string;
  task: string;
  description: string;
  timeframe: string;
  completed: boolean;
}

export interface AssessmentReport {
  id: string;
  createdAt: string;
  businessName: string;
  businessType: BusinessType;
  businessTypeDisplay?: string;
  readinessScore: number;
  readinessLevel: "Starting Out" | "Getting Ready" | "Well Positioned" | "Ready to Go";
  summary: string;
  recommendations: Recommendation[];
  actionPlan: ActionItem[];
  strengths: string[];
  considerations: string[];
  categoryScores: {
    category: string;
    score: number;
    maxScore: number;
  }[];
}

// ============ User Types ============

export interface User {
  id: string;
  name: string;
  email: string;
  businessName: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalAssessments: number;
  averageScore: number;
  topOpportunity: string;
  estimatedTimeSaved: string;
}

// ============ UI Types ============

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";
export type BadgeVariant = "default" | "success" | "warning" | "danger" | "brand";
