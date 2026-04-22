import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

interface Recommendation {
  title: string;
  toolCategory: string;
}

interface AssessmentData {
  businessName?: string;
  businessType?: string;
  customBusinessType?: string;
  teamSize?: string;
  comfortLevel?: string;
  budgetRange?: string;
  painPoints?: string[];
  customPainPoint?: string;
  primaryGoals?: string[];
  customGoal?: string;
  existingTools?: string[];
  customTool?: string;
  repetitiveTasks?: string[];
  customerCommunicationVolume?: string;
  leadVolume?: string;
  schedulingComplexity?: string;
}

function buildPrompt(data: AssessmentData, recommendations: Recommendation[]): string {
  const businessDisplay =
    data.businessType === "other" && data.customBusinessType
      ? data.customBusinessType
      : data.businessType || "general business";

  const painPoints = [
    ...(data.painPoints || []).filter((p) => p !== "other"),
    ...(data.customPainPoint ? [data.customPainPoint] : []),
  ].join(", ") || "general operations";

  const goals = [
    ...(data.primaryGoals || []).filter((g) => g !== "other"),
    ...(data.customGoal ? [data.customGoal] : []),
  ].join(", ") || "improve efficiency";

  const tools = [
    ...(data.existingTools || []).filter((t) => t !== "__other__"),
    ...(data.customTool ? [data.customTool] : []),
  ].join(", ") || "none listed";

  const tasks = [
    ...(data.repetitiveTasks || []).filter((t) => t !== "__other__"),
  ].join(", ") || "various manual tasks";

  const budgetMap: Record<string, string> = {
    under_100: "under $100/month",
    "100_300": "$100–$300/month",
    "300_500": "$300–$500/month",
    "500_1000": "$500–$1,000/month",
    "1000_plus": "$1,000+/month",
  };
  const budget = budgetMap[data.budgetRange || ""] || data.budgetRange || "flexible";

  const recList = recommendations
    .slice(0, 3)
    .map((r, i) => `${i + 1}. ${r.title} (${r.toolCategory})`)
    .join("\n");

  return `You are integrating AI into a real business right now. Do NOT give generic advice — create ready-to-use assets this specific business can deploy immediately.

**Business Profile:**
- Business name: ${data.businessName || "This Business"}
- Industry: ${businessDisplay}
- Team size: ${data.teamSize || "small team"}
- Tech comfort level: ${data.comfortLevel || "intermediate"}
- Monthly AI budget: ${budget}
- Biggest pain points: ${painPoints}
- Primary goals: ${goals}
- Current tools: ${tools}
- Repetitive tasks: ${tasks}
- Communication volume: ${data.customerCommunicationVolume || "moderate"}
- Lead volume: ${data.leadVolume || "moderate"}
- Top AI opportunities identified:
${recList}

Generate EXACTLY these 5 sections with these EXACT headers (use ## prefix):

## QUICK WINS — START TODAY
List 3 AI actions they can take in the next 24 hours using free tools (ChatGPT free tier, Claude.ai free, Google Workspace AI, etc.). For each action:
- **Action title** — one sentence explaining what to do
- Exact step-by-step instructions (numbered)
- Expected result or time saved
Make each action specific to their business type (${businessDisplay}) and pain points (${painPoints}).

## YOUR TOOL SETUP GUIDE
For the top 2 recommendations, provide:
**[Tool recommendation title]**
- Best tool match for their budget (${budget}): tool name, pricing tier, monthly cost
- Getting started: exact URL path to sign up (describe the flow without giving actual URLs)
- Setup steps (5 numbered steps, specific to their use case)
- What success looks like in week 1 (measurable outcome)

## READY-TO-USE TEMPLATES
Create 2–3 complete, copy-paste-ready templates specific to ${data.businessName || "their business"} (${businessDisplay}). Each template should directly address one of their pain points (${painPoints}).

For each template:
**Template: [Name] — [Use case]**
How to use: [One sentence]

---
[Full template text — make it professional and ready to use with [BRACKET] placeholders for customizable fields]
---

## YOUR 30-DAY INTEGRATION ROADMAP
A week-by-week plan tailored to their budget (${budget}) and team size (${data.teamSize}):

**Week 1 — Foundation (Est. [X] hours)**
- [Task 1] — [who does it] — [time required]
- [Task 2] ...
- Success metric: [measurable result]

**Week 2 — First Tool Live (Est. [X] hours)**
[Same format]

**Week 3 — Measure & Refine (Est. [X] hours)**
[Same format]

**Week 4 — Expand (Est. [X] hours)**
[Same format]

## AI PROMPTS FOR YOUR BUSINESS
5 prompts they can paste directly into ChatGPT or Claude right now. Each prompt should solve one of their specific pain points (${painPoints}) and be tailored to ${businessDisplay}.

**Prompt 1: [Use case]**
\`\`\`
[Full prompt text — ready to paste, specific to their business context]
\`\`\`

[Repeat for prompts 2–5]`;
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY is not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid request body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const payload = body as Record<string, unknown>;
  const rawAssessment = payload.assessmentData;
  const rawRecommendations = payload.recommendations;

  const hasValidAssessmentData =
    typeof rawAssessment === "object" && rawAssessment !== null;

  const hasValidRecommendations =
    Array.isArray(rawRecommendations) &&
    rawRecommendations.every(
      (r) =>
        typeof r === "object" &&
        r !== null &&
        typeof (r as Record<string, unknown>).title === "string" &&
        typeof (r as Record<string, unknown>).toolCategory === "string"
    );

  if (!hasValidAssessmentData || !hasValidRecommendations) {
    return new Response(
      JSON.stringify({ error: "Missing required fields: assessmentData and recommendations" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const assessmentData = rawAssessment as AssessmentData;
  const recommendations = rawRecommendations as Recommendation[];
  const prompt = buildPrompt(assessmentData, recommendations);

  const stream = client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: [
      {
        type: "text" as const,
        text: "You are an AI integration specialist for small businesses. Create practical, specific, ready-to-use assets — not generic advice. Every template, prompt, and step should be directly usable by this specific business without any modification beyond filling in bracketed placeholders.",
        cache_control: { type: "ephemeral" as const },
      },
    ],
    messages: [{ role: "user", content: prompt }],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
