/**
 * POST /api/style/add-sample
 *
 * Adds a manually pasted email as a style sample.
 * Body: { body: string }
 */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { addStyleSample, updateStyleProfile } from "@/lib/style-memory";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const emailBody = body?.body?.trim();

  if (!emailBody || emailBody.length < 20) {
    return NextResponse.json({ error: "Email text too short" }, { status: 400 });
  }

  await addStyleSample(supabase, user.id, emailBody);
  await updateStyleProfile(supabase, user.id);

  // Return updated sample count
  const { data: profile } = await supabase
    .from("style_profile")
    .select("sample_count")
    .eq("user_id", user.id)
    .single();

  return NextResponse.json({ ok: true, sampleCount: profile?.sample_count ?? 1 });
}
