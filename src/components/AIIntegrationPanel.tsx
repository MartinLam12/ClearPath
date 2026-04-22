"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Sparkles,
  Zap,
  Copy,
  Check,
  ChevronRight,
  Clock,
  Wrench,
  FileText,
  Calendar,
  Bot,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Card, Button, Badge } from "@/components/ui";
import { Recommendation } from "@/lib/types";

interface Props {
  recommendations: Recommendation[];
}

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string;
}

const SECTION_DEFS = [
  { key: "QUICK WINS", id: "quick-wins", label: "Quick Wins", icon: <Zap className="w-4 h-4" /> },
  { key: "YOUR TOOL SETUP GUIDE", id: "tool-guide", label: "Tool Setup", icon: <Wrench className="w-4 h-4" /> },
  { key: "READY-TO-USE TEMPLATES", id: "templates", label: "Templates", icon: <FileText className="w-4 h-4" /> },
  { key: "YOUR 30-DAY INTEGRATION ROADMAP", id: "roadmap", label: "30-Day Roadmap", icon: <Calendar className="w-4 h-4" /> },
  { key: "AI PROMPTS FOR YOUR BUSINESS", id: "prompts", label: "AI Prompts", icon: <Bot className="w-4 h-4" /> },
];

function parseSections(raw: string): Section[] {
  const results: Section[] = [];
  // Split on ## headers, keeping the separator
  const parts = raw.split(/^## /m).filter(Boolean);
  for (const part of parts) {
    const newline = part.indexOf("\n");
    if (newline === -1) continue;
    const headerLine = part.slice(0, newline).trim();
    const body = part.slice(newline + 1).trim();
    const def = SECTION_DEFS.find((d) => headerLine.startsWith(d.key));
    if (def) {
      results.push({ id: def.id, title: def.label, icon: def.icon, content: body });
    }
  }
  return results;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handle = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  };
  return (
    <button
      onClick={handle}
      className="flex items-center gap-1 text-xs text-surface-500 hover:text-brand-600 transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-success-500" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function renderLine(line: string, idx: number): React.ReactNode {
  if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
    return (
      <p key={idx} className="font-semibold text-surface-900 mt-4 mb-1">
        {line.slice(2, -2)}
      </p>
    );
  }
  if (line.startsWith("**")) {
    const closingIdx = line.indexOf("**", 2);
    if (closingIdx !== -1) {
      const bold = line.slice(2, closingIdx);
      const rest = line.slice(closingIdx + 2);
      return (
        <p key={idx} className="text-sm text-surface-700 mb-1">
          <span className="font-semibold text-surface-900">{bold}</span>
          {rest}
        </p>
      );
    }
  }
  if (line.startsWith("- ")) {
    return (
      <li key={idx} className="text-sm text-surface-700 flex gap-2 mb-1">
        <span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-brand-400" />
        <span>{renderInline(line.slice(2))}</span>
      </li>
    );
  }
  if (/^\d+\. /.test(line)) {
    const match = line.match(/^(\d+)\. (.+)/);
    if (match) {
      return (
        <li key={idx} className="text-sm text-surface-700 flex gap-2.5 mb-1.5 items-start">
          <span className="shrink-0 w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold mt-0.5">
            {match[1]}
          </span>
          <span>{renderInline(match[2])}</span>
        </li>
      );
    }
  }
  if (line.startsWith("### ")) {
    return (
      <h4 key={idx} className="text-sm font-semibold text-surface-800 mt-4 mb-1.5">
        {line.slice(4)}
      </h4>
    );
  }
  if (line.startsWith("---")) {
    return <hr key={idx} className="border-surface-200 my-3" />;
  }
  if (line === "") {
    return <div key={idx} className="h-2" />;
  }
  return (
    <p key={idx} className="text-sm text-surface-700 mb-1 leading-relaxed">
      {renderInline(line)}
    </p>
  );
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-surface-900">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function renderSectionContent(content: string) {
  const blocks: React.ReactNode[] = [];
  const lines = content.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block (backtick fence)
    if (line.trim() === "```" || line.trim().startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== "```") {
        codeLines.push(lines[i]);
        i++;
      }
      const code = codeLines.join("\n");
      blocks.push(
        <div key={i} className="relative my-3 group">
          <pre className="bg-surface-50 border border-surface-200 rounded-xl p-4 text-xs text-surface-800 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
            {code}
          </pre>
          <div className="absolute top-2 right-2">
            <CopyButton text={code} />
          </div>
        </div>
      );
      i++;
      continue;
    }

    // Template block (between --- delimiters)
    if (line.trim() === "---") {
      const templateLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== "---") {
        templateLines.push(lines[i]);
        i++;
      }
      if (templateLines.length > 0) {
        const templateText = templateLines.join("\n");
        blocks.push(
          <div key={i} className="relative my-3 group">
            <div className="bg-brand-50 border border-brand-200 rounded-xl p-4">
              <p className="text-xs font-medium text-brand-600 mb-2 uppercase tracking-wide">Template — Ready to Copy</p>
              <p className="text-sm text-surface-800 whitespace-pre-wrap leading-relaxed">{templateText}</p>
            </div>
            <div className="mt-1.5 flex justify-end">
              <CopyButton text={templateText} />
            </div>
          </div>
        );
      }
      i++;
      continue;
    }

    blocks.push(renderLine(line, i));
    i++;
  }

  return <div className="space-y-0.5">{blocks}</div>;
}

type State = "idle" | "loading" | "streaming" | "done" | "error";

export function AIIntegrationPanel({ recommendations }: Props) {
  const [state, setState] = useState<State>("idle");
  const [streamedText, setStreamedText] = useState("");
  const [sections, setSections] = useState<Section[]>([]);
  const [activeTab, setActiveTab] = useState("");
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  const generate = useCallback(async () => {
    setState("loading");
    setStreamedText("");
    setSections([]);
    setError("");

    let raw = "";
    try {
      let assessmentData = {};
      try {
        const stored = localStorage.getItem("clearpath_assessment_data");
        assessmentData = stored ? JSON.parse(stored) : {};
      } catch {
        // localStorage unavailable or data corrupted — proceed with empty profile
      }

      abortRef.current = new AbortController();
      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentData, recommendations }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error || `Error ${response.status}`);
      }

      setState("streaming");

      if (!response.body) throw new Error("Response body is empty");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        raw += decoder.decode(value, { stream: true });
        setStreamedText(raw);
      }

      const parsed = parseSections(raw);
      setSections(parsed);
      setActiveTab(parsed[0]?.id || "");
      setState("done");
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setState("error");
    }
  }, [recommendations]);

  // Pre-generation CTA
  if (state === "idle") {
    return (
      <Card className="border-2 border-dashed border-brand-200 bg-gradient-to-br from-brand-50 to-white">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="text-lg font-semibold text-surface-900">
                Get Your AI Integration Plan
              </h3>
              <Badge variant="brand" size="sm">Powered by Claude</Badge>
            </div>
            <p className="text-sm text-surface-600 mb-4 leading-relaxed">
              Go beyond recommendations. Claude will generate ready-to-use assets for your specific business —
              copy-paste templates, step-by-step tool guides, AI prompts, and a 30-day implementation roadmap.
            </p>
            <div className="flex flex-wrap gap-3 mb-5">
              {[
                { icon: <Zap className="w-3.5 h-3.5" />, label: "Quick wins for this week" },
                { icon: <FileText className="w-3.5 h-3.5" />, label: "Ready-to-use templates" },
                { icon: <Bot className="w-3.5 h-3.5" />, label: "AI prompts for your use case" },
                { icon: <Calendar className="w-3.5 h-3.5" />, label: "30-day roadmap" },
              ].map((item) => (
                <span
                  key={item.label}
                  className="flex items-center gap-1.5 text-xs text-surface-600 bg-white border border-surface-200 rounded-full px-3 py-1"
                >
                  <span className="text-brand-500">{item.icon}</span>
                  {item.label}
                </span>
              ))}
            </div>
            <Button onClick={generate} icon={<Sparkles className="w-4 h-4" />}>
              Generate My Integration Plan
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Error state
  if (state === "error") {
    return (
      <Card className="border-danger-200">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-danger-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-surface-900 mb-1">Couldn&apos;t generate your plan</p>
            <p className="text-sm text-surface-600 mb-4">{error}</p>
            <Button variant="outline" size="sm" onClick={generate}>
              Try Again
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Loading spinner before stream begins
  if (state === "loading") {
    return (
      <Card className="border-brand-100">
        <div className="flex items-center gap-4 py-4">
          <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
            <Loader2 className="w-5 h-5 text-brand-600 animate-spin" />
          </div>
          <div>
            <p className="text-sm font-medium text-surface-900">Analyzing your business profile…</p>
            <p className="text-xs text-surface-500 mt-0.5">Claude is building your personalized AI integration plan</p>
          </div>
        </div>
      </Card>
    );
  }

  // Streaming state — show progressive text
  if (state === "streaming") {
    const sectionsStreamed = SECTION_DEFS.filter((d) =>
      streamedText.includes(`## ${d.key}`)
    );

    return (
      <Card className="border-brand-100">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-brand-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-surface-900">Building your AI integration plan…</p>
          </div>
          <div className="flex gap-1.5">
            {SECTION_DEFS.map((d) => (
              <div
                key={d.id}
                className={`w-2 h-2 rounded-full transition-colors ${
                  sectionsStreamed.some((s) => s.id === d.id)
                    ? "bg-brand-500"
                    : "bg-surface-200"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-4">
          {SECTION_DEFS.map((d) => {
            const done = sectionsStreamed.some((s) => s.id === d.id);
            return (
              <span
                key={d.id}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-all ${
                  done
                    ? "border-brand-200 bg-brand-50 text-brand-700"
                    : "border-surface-200 bg-surface-50 text-surface-400"
                }`}
              >
                {done ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                {d.label}
              </span>
            );
          })}
        </div>

        <div className="bg-surface-50 rounded-xl p-4 max-h-64 overflow-y-auto">
          <pre className="text-xs text-surface-700 whitespace-pre-wrap font-mono leading-relaxed">
            {streamedText}
            <span className="inline-block w-1.5 h-3.5 bg-brand-500 animate-pulse ml-0.5 align-middle" />
          </pre>
        </div>
      </Card>
    );
  }

  // Done — show tabbed sections
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-600" />
          <h2 className="text-lg font-semibold text-surface-900">Your AI Integration Plan</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setState("idle")}>
          Regenerate
        </Button>
      </div>

      {/* Tabs */}
      <div role="tablist" className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {sections.map((s) => {
          const def = SECTION_DEFS.find((d) => d.id === s.id);
          return (
            <button
              key={s.id}
              role="tab"
              id={`tab-${s.id}`}
              aria-selected={activeTab === s.id}
              aria-controls={`panel-${s.id}`}
              onClick={() => setActiveTab(s.id)}
              className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeTab === s.id
                  ? "bg-brand-600 text-white"
                  : "bg-surface-100 text-surface-600 hover:bg-surface-200"
              }`}
            >
              {def?.icon}
              {s.title}
            </button>
          );
        })}
      </div>

      {/* Active section */}
      {sections.map((s) => (
        <div
          key={s.id}
          id={`panel-${s.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${s.id}`}
          className={s.id === activeTab ? "block" : "hidden"}
        >
          <Card>
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-surface-100">
              <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600">
                {SECTION_DEFS.find((d) => d.id === s.id)?.icon}
              </div>
              <h3 className="font-semibold text-surface-900">{s.title}</h3>
              <ChevronRight className="w-4 h-4 text-surface-400" />
              <span className="text-sm text-surface-500">
                {SECTION_DEFS.find((d) => d.id === s.id)?.label}
              </span>
            </div>
            {renderSectionContent(s.content)}
          </Card>
        </div>
      ))}
    </div>
  );
}
