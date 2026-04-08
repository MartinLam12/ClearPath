import Link from "next/link";
import { Button } from "@/components/ui";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  Lightbulb,
  Target,
  TrendingUp,
  Users,
  Zap,
  Star,
  Shield,
  ChevronRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <LogoBar />
      <FeaturesSection />
      <HowItWorksSection />
      <ResultsPreview />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="gradient-subtle">
        <div className="container-wide py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              AI Readiness for Small Business
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-display-xl font-bold text-surface-900 tracking-tight mb-6 leading-tight">
              Find out where AI can{" "}
              <span className="text-brand-600">actually help</span>{" "}
              your business
            </h1>
            <p className="text-lg md:text-body-xl text-surface-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Stop guessing about AI. Take a 5-minute assessment and get a tailored report
              with prioritized recommendations, estimated impact, and a practical action plan
              for your specific business.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                  Start Free Assessment
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="lg">
                  See How It Works
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-surface-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-500" />
                Free to start
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-500" />
                5 min assessment
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-500" />
                Actionable report
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LogoBar() {
  const industries = [
    "Dental Practices",
    "Marketing Agencies",
    "E-Commerce",
    "Salons & Spas",
    "Contractors",
    "Consultants",
    "Clinics",
    "Restaurants",
  ];

  return (
    <section className="py-12 border-b border-surface-100">
      <div className="container-wide">
        <p className="text-center text-sm text-surface-400 font-medium mb-6">
          TRUSTED BY SMALL BUSINESSES ACROSS INDUSTRIES
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
          {industries.map((industry) => (
            <span
              key={industry}
              className="px-4 py-2 rounded-lg bg-surface-50 text-surface-500 text-sm font-medium"
            >
              {industry}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: Target,
      title: "Tailored to Your Business",
      description:
        "No generic advice. Every recommendation is matched to your industry, team size, pain points, and budget.",
    },
    {
      icon: BarChart3,
      title: "AI Readiness Score",
      description:
        "Get a clear score across 6 dimensions so you know exactly where you stand and where to focus first.",
    },
    {
      icon: Lightbulb,
      title: "Prioritized Opportunities",
      description:
        "See the top 3-5 ways AI can help, ranked by impact and ease of implementation for your situation.",
    },
    {
      icon: Clock,
      title: "Time & Cost Estimates",
      description:
        "Know the estimated time saved, implementation timeline, and difficulty level for each recommendation.",
    },
    {
      icon: TrendingUp,
      title: "Action Plan",
      description:
        "Walk away with a practical 'what to do this week' plan, not just a list of possibilities.",
    },
    {
      icon: Shield,
      title: "Honest Assessment",
      description:
        "We tell you about risks and limitations too. No hype — just practical advice you can trust.",
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28">
      <div className="container-wide">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-display-md font-bold text-surface-900 mb-4">
            Everything you need to make smart AI decisions
          </h2>
          <p className="text-body-lg text-surface-500">
            ClearPath gives you the clarity and confidence to invest in AI where it matters most for your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-2xl bg-white border border-surface-100 shadow-soft-xs hover:shadow-soft-md hover:border-surface-200 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-brand-600" />
              </div>
              <h3 className="text-base font-semibold text-surface-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-surface-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Tell us about your business",
      description:
        "Answer questions about your industry, team, pain points, tools, and goals. Takes about 5 minutes.",
      color: "bg-brand-50 text-brand-700",
    },
    {
      number: "02",
      title: "We analyze your situation",
      description:
        "Our engine maps your inputs against hundreds of AI use cases to find the best matches for your specific context.",
      color: "bg-accent-50 text-accent-700",
    },
    {
      number: "03",
      title: "Get your tailored report",
      description:
        "Receive a prioritized list of AI opportunities with impact estimates, difficulty ratings, and a concrete action plan.",
      color: "bg-success-50 text-success-700",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-surface-50">
      <div className="container-wide">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-display-md font-bold text-surface-900 mb-4">
            How ClearPath works
          </h2>
          <p className="text-body-lg text-surface-500">
            Three simple steps to understand your AI opportunity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, idx) => (
            <div key={step.number} className="relative">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${step.color} text-lg font-bold mb-5`}>
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-surface-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-surface-500 leading-relaxed">
                {step.description}
              </p>
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-[calc(100%_-_0.5rem)] w-[calc(100%_-_3rem)]">
                  <div className="border-t-2 border-dashed border-surface-200" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResultsPreview() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-display-md font-bold text-surface-900 mb-4">
              Reports your team can actually use
            </h2>
            <p className="text-body-lg text-surface-500 mb-8">
              Every report is a clear, shareable deliverable — not a vague chatbot response. It&apos;s structured like an executive summary with the detail of a strategy playbook.
            </p>
            <ul className="space-y-4">
              {[
                "AI Readiness Score across 6 dimensions",
                "Top 3-5 prioritized recommendations",
                "Impact & difficulty ratings for each",
                "Week-by-week action plan",
                "Tool category suggestions",
                "Risks and limitations clearly noted",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-500 mt-0.5 shrink-0" />
                  <span className="text-surface-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl border border-surface-200 shadow-soft-lg p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-surface-900">AI Readiness Report</h3>
                <p className="text-sm text-surface-500">Bright Smiles Dental</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center">
                <span className="text-xl font-bold text-brand-600">68</span>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: "Digital Foundation", value: 70 },
                { label: "Process Readiness", value: 65 },
                { label: "Team Readiness", value: 72 },
                { label: "Growth Potential", value: 80 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-surface-600">{item.label}</span>
                    <span className="font-medium text-surface-800">{item.value}%</span>
                  </div>
                  <div className="h-2 bg-surface-100 rounded-full">
                    <div
                      className="h-2 bg-brand-500 rounded-full"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-surface-100">
              <p className="text-xs text-surface-400 uppercase font-medium mb-2">Top Recommendation</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent-50 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-accent-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-800">Automated Appointment Scheduling</p>
                  <p className="text-xs text-surface-500">Save 8-10 hrs/week • Easy to implement</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "ClearPath helped us see that we were spending 15 hours a week on things AI could handle. We started with their top recommendation and freed up two full days of admin time.",
      name: "Maria Rodriguez",
      role: "Owner, Fresh Start Cleaning Co.",
      rating: 5,
    },
    {
      quote:
        "As a solo consultant, I didn't think AI was relevant to me. The assessment showed me three quick wins I implemented in a week. My client follow-up is now automatic.",
      name: "James Park",
      role: "Independent Marketing Consultant",
      rating: 5,
    },
    {
      quote:
        "The report was incredibly detailed and practical. I shared it with my team and we had a clear plan within a day. No other tool gave us this kind of clarity.",
      name: "Priya Sharma",
      role: "Co-Founder, Bloom Digital Agency",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-surface-50">
      <div className="container-wide">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-display-md font-bold text-surface-900 mb-4">
            Trusted by real business owners
          </h2>
          <p className="text-body-lg text-surface-500">
            See what small business owners say about their ClearPath experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-6 rounded-2xl bg-white border border-surface-100 shadow-soft-xs"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-accent-400 text-accent-400"
                  />
                ))}
              </div>
              <p className="text-surface-700 text-sm leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-900">{t.name}</p>
                  <p className="text-xs text-surface-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-narrow">
        <div className="gradient-brand rounded-3xl p-10 md:p-16 text-center">
          <h2 className="text-3xl md:text-display-md font-bold text-white mb-4">
            Ready to find your AI advantage?
          </h2>
          <p className="text-lg text-brand-100 max-w-xl mx-auto mb-8">
            Take the free 5-minute assessment and get a tailored AI readiness report for your business. No credit card required.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              variant="secondary"
              icon={<ChevronRight className="w-5 h-5" />}
              className="bg-white text-brand-700 hover:bg-brand-50"
            >
              Start Your Free Assessment
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
