/**
 * Tests for src/lib/style-memory.ts
 *
 * Pure-function tests (no Supabase / Gemini calls):
 *   cleanEmailText, detectCluster, computeToneScore, buildStylePromptSection
 *
 * addStyleSample tests (mocked Supabase + Gemini):
 *   - returns { saved: true } on success
 *   - returns { saved: false } when word count too low (text cleaned to nothing)
 *   - returns { saved: false } when Supabase insert fails
 *   - returns { saved: false } when table does not exist
 */

// Mock Gemini before importing the module
jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      embedContent: jest.fn().mockResolvedValue({
        embedding: { values: new Array(768).fill(0.1) },
      }),
    }),
  })),
  TaskType: {
    RETRIEVAL_DOCUMENT: "RETRIEVAL_DOCUMENT",
    RETRIEVAL_QUERY:    "RETRIEVAL_QUERY",
  },
}));

import {
  cleanEmailText,
  detectCluster,
  computeToneScore,
  buildStylePromptSection,
  addStyleSample,
} from "@/lib/style-memory";
import type { StyleContext } from "@/lib/style-memory";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeSupabase(overrides: {
  insertError?: { message: string } | null;
  selectData?: unknown;
} = {}) {
  const chain = {
    upsert:  jest.fn().mockResolvedValue({ error: null }),
    select:  jest.fn().mockReturnThis(),
    eq:      jest.fn().mockReturnThis(),
    order:   jest.fn().mockReturnThis(),
    limit:   jest.fn().mockResolvedValue({ data: overrides.selectData ?? [] }),
    single:  jest.fn().mockResolvedValue({ data: overrides.selectData ?? null }),
    insert:  jest.fn().mockResolvedValue({ error: overrides.insertError ?? null }),
  };
  return { from: jest.fn().mockReturnValue(chain), ...chain } as unknown as import("@supabase/supabase-js").SupabaseClient;
}

const LONG_EMAIL = `Hey John,

Thanks for reaching out about the membership. We'd love to have you come in and give it a try.
We run boxing sessions Monday through Friday at 6pm and Saturday mornings at 9am.
Drop by any time or let me know what works and I'll get you booked in.

Looking forward to meeting you!`;

// ─── cleanEmailText ───────────────────────────────────────────────────────────

describe("cleanEmailText", () => {
  test("passes through plain text unchanged", () => {
    const text = "Hey, thanks for your email. Come in any time this week.";
    expect(cleanEmailText(text)).toBe(text);
  });

  test("removes quoted reply lines starting with >", () => {
    const input = "Sure, see you then!\n\n> On Monday, Bob wrote:\n> Can you come in?";
    const result = cleanEmailText(input);
    expect(result).not.toContain(">");
    expect(result).toContain("Sure, see you then!");
  });

  test("stops at sign-off line", () => {
    const input = "Thanks for your interest.\n\nThanks,\nCoach Martin";
    const result = cleanEmailText(input);
    expect(result).not.toContain("Coach Martin");
    expect(result).toContain("Thanks for your interest.");
  });

  test("stops at 'Best,' sign-off", () => {
    const input = "We offer a free trial.\n\nBest,\nMartin";
    const result = cleanEmailText(input);
    expect(result).not.toContain("Martin");
    expect(result).toContain("We offer a free trial.");
  });

  test("stops at -- signature separator", () => {
    const input = "See you at 6pm.\n\n--\nMartin Lam | Nomad Boxing";
    const result = cleanEmailText(input);
    expect(result).not.toContain("Nomad Boxing");
    expect(result).toContain("See you at 6pm.");
  });

  test("stops at forwarded message block", () => {
    const input = "Forwarding this for your info.\n\n--- Forwarded message ---\nFrom: alice@example.com";
    const result = cleanEmailText(input);
    expect(result).not.toContain("alice@example.com");
    expect(result).toContain("Forwarding this for your info.");
  });

  test("strips HTML tags and entities", () => {
    const html = "<p>Hey there,</p><p>Come join us!</p>";
    const result = cleanEmailText(html);
    expect(result).not.toContain("<p>");
    expect(result).toContain("Hey there,");
    expect(result).toContain("Come join us!");
  });

  test("removes bare tracking URLs", () => {
    const input = "Check it out here\nhttps://click.tracker.example.com/abc123\nSee you soon.";
    const result = cleanEmailText(input);
    expect(result).not.toContain("https://click");
    expect(result).toContain("Check it out here");
  });

  test("handles empty string without throwing", () => {
    expect(() => cleanEmailText("")).not.toThrow();
    expect(cleanEmailText("")).toBe("");
  });

  test("handles null-ish input without throwing", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => cleanEmailText(null as any)).not.toThrow();
  });
});

// ─── detectCluster ────────────────────────────────────────────────────────────

describe("detectCluster", () => {
  test("classifies short replies (< 25 words) as short_reply", () => {
    expect(detectCluster("Sure, sounds good!", 4)).toBe("short_reply");
  });

  test("classifies payment/invoice emails as transactional", () => {
    const text = "Please find attached your invoice for last month's payment.";
    expect(detectCluster(text, 30)).toBe("transactional");
  });

  test("classifies booking emails as transactional", () => {
    expect(detectCluster("Your booking confirmation has been sent.", 30)).toBe("transactional");
  });

  test("classifies problem/error emails as support", () => {
    const text = "I'm having an issue with the app and it's not working.";
    expect(detectCluster(text, 30)).toBe("support");
  });

  test("defaults to work for general emails", () => {
    const text = "Thanks for your interest in joining. We have a few spots available this week.";
    expect(detectCluster(text, 40)).toBe("work");
  });
});

// ─── computeToneScore ─────────────────────────────────────────────────────────

describe("computeToneScore", () => {
  test("returns 0.5 for neutral text with no indicators", () => {
    expect(computeToneScore("We will contact you shortly.")).toBe(0.5);
  });

  test("returns > 0.5 for casual text", () => {
    const casual = "Hey! Yeah that's awesome, we'd love to have you come in!";
    expect(computeToneScore(casual)).toBeGreaterThan(0.5);
  });

  test("returns < 0.5 for formal text", () => {
    const formal = "Dear Sir/Madam, please find herewith the requested information. Sincerely.";
    expect(computeToneScore(formal)).toBeLessThan(0.5);
  });

  test("result is always between 0 and 1", () => {
    const texts = [
      "Hey!! Yeah!! Awesome cool btw I'm so excited!!!",
      "Dear valued customer, please find attached. Sincerely yours herewith.",
      "",
      "Normal text without any special markers.",
    ];
    for (const t of texts) {
      const score = computeToneScore(t);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    }
  });
});

// ─── buildStylePromptSection ──────────────────────────────────────────────────

describe("buildStylePromptSection", () => {
  test("returns empty string for null context", () => {
    expect(buildStylePromptSection(null)).toBe("");
  });

  test("returns empty string when profile is null and no examples", () => {
    const ctx: StyleContext = { examples: [], profile: null };
    expect(buildStylePromptSection(ctx)).toBe("");
  });

  test("includes tone label for casual profile", () => {
    const ctx: StyleContext = {
      examples: [],
      profile: {
        sampleCount: 5, avgWordCount: 40, toneScore: 0.8,
        usesBullets: false, commonGreetings: [], commonSignoffs: [],
      },
    };
    expect(buildStylePromptSection(ctx)).toContain("casual and warm");
  });

  test("includes tone label for formal profile", () => {
    const ctx: StyleContext = {
      examples: [],
      profile: {
        sampleCount: 5, avgWordCount: 80, toneScore: 0.2,
        usesBullets: false, commonGreetings: [], commonSignoffs: [],
      },
    };
    expect(buildStylePromptSection(ctx)).toContain("formal and professional");
  });

  test("includes bullet point note when uses_bullets is true", () => {
    const ctx: StyleContext = {
      examples: [],
      profile: {
        sampleCount: 3, avgWordCount: 60, toneScore: 0.5,
        usesBullets: true, commonGreetings: [], commonSignoffs: [],
      },
    };
    expect(buildStylePromptSection(ctx)).toContain("bullet");
  });

  test("includes example emails when provided", () => {
    const ctx: StyleContext = {
      examples: ["Hey, thanks for reaching out!", "Sure, come in any time."],
      profile: null,
    };
    const result = buildStylePromptSection(ctx);
    expect(result).toContain("Hey, thanks for reaching out!");
    expect(result).toContain("[Example 1]");
    expect(result).toContain("[Example 2]");
  });

  test("includes common greeting patterns", () => {
    const ctx: StyleContext = {
      examples: [],
      profile: {
        sampleCount: 5, avgWordCount: 40, toneScore: 0.6,
        usesBullets: false, commonGreetings: ["Hey John,", "Hi there,"], commonSignoffs: [],
      },
    };
    expect(buildStylePromptSection(ctx)).toContain("Hey John,");
  });
});

// ─── addStyleSample ───────────────────────────────────────────────────────────

describe("addStyleSample", () => {
  beforeEach(() => jest.clearAllMocks());

  test("returns { saved: true } when insert succeeds", async () => {
    const supabase = makeSupabase({ insertError: null });
    const result = await addStyleSample(supabase, "user-1", LONG_EMAIL);
    expect(result.saved).toBe(true);
  });

  test("returns { saved: false } when text is too short after cleaning", async () => {
    const supabase = makeSupabase();
    const result = await addStyleSample(supabase, "user-1", "Hi.");
    expect(result.saved).toBe(false);
  });

  test("returns { saved: false } when text cleans down below word minimum", async () => {
    // All quoted lines — cleans to empty
    const quotedOnly = "> On Monday, Bob wrote:\n> Sure, see you then.";
    const supabase = makeSupabase();
    const result = await addStyleSample(supabase, "user-1", quotedOnly);
    expect(result.saved).toBe(false);
  });

  test("returns { saved: false } when Supabase insert returns an error", async () => {
    const supabase = makeSupabase({ insertError: { message: 'relation "style_samples" does not exist' } });
    const result = await addStyleSample(supabase, "user-1", LONG_EMAIL);
    expect(result.saved).toBe(false);
  });

  test("returns { saved: false } with reason when table does not exist", async () => {
    const supabase = makeSupabase({ insertError: { message: 'relation "style_samples" does not exist' } });
    const result = await addStyleSample(supabase, "user-1", LONG_EMAIL);
    expect(result.saved).toBe(false);
    expect(result.reason).toMatch(/style_samples/);
  });

  test("does not throw when Gemini embedding fails", async () => {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    GoogleGenerativeAI.mockImplementationOnce(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({
        embedContent: jest.fn().mockRejectedValue(new Error("Quota exceeded")),
      }),
    }));
    const supabase = makeSupabase({ insertError: null });
    // Should still insert, just without an embedding vector
    await expect(addStyleSample(supabase, "user-1", LONG_EMAIL)).resolves.not.toThrow();
  });
});
