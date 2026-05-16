/**
 * GET /api/style/status
 *
 * Returns the user's current style memory stats.
 */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("style_profile")
    .select("sample_count, tone_score, avg_word_count, updated_at")
    .eq("user_id", user.id)
    .single();

  return NextResponse.json({
    sampleCount:  profile?.sample_count  ?? 0,
    toneScore:    profile?.tone_score    ?? null,
    avgWordCount: profile?.avg_word_count ?? null,
    updatedAt:    profile?.updated_at    ?? null,
  });
}
