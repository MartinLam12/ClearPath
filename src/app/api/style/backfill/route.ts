/**
 * POST /api/style/backfill
 *
 * Processes the user's existing outbound email_messages into style_samples.
 * Call once after enabling the style learning module, then on demand.
 *
 * Processes in batches of 20 to stay within Vercel's function timeout.
 * Returns { processed, skipped, total } so the caller can show progress
 * and know when to call again (processed < total means more remain).
 *
 * Idempotent: the UNIQUE constraint on message_id means re-running is safe.
 */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { addStyleSample, updateStyleProfile } from "@/lib/style-memory";

const BATCH_SIZE = 20;

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Fetch outbound messages that have no style_sample yet.
  // LEFT JOIN approach via NOT EXISTS to avoid loading the samples table.
  const { data: messages, error } = await supabase
    .from("email_messages")
    .select("id, body_text, thread_id")
    .eq("direction", "outbound")
    // Exclude messages already processed (message_id unique in style_samples)
    .not(
      "id",
      "in",
      `(select message_id from style_samples where user_id = '${user.id}' and message_id is not null)`
    )
    .order("sent_at", { ascending: false })
    .limit(BATCH_SIZE);

  if (error) {
    console.error("[backfill] query error:", error.message);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }

  // Count total remaining (for progress reporting)
  const { count: totalRemaining } = await supabase
    .from("email_messages")
    .select("id", { count: "exact", head: true })
    .eq("direction", "outbound")
    .not(
      "id",
      "in",
      `(select message_id from style_samples where user_id = '${user.id}' and message_id is not null)`
    );

  let processed = 0;
  let skipped   = 0;

  for (const msg of messages ?? []) {
    if (!msg.body_text?.trim()) { skipped++; continue; }

    await addStyleSample(supabase, user.id, msg.body_text, {
      messageId: msg.id,
    });
    processed++;
  }

  // Recompute style profile after batch
  if (processed > 0) {
    await updateStyleProfile(supabase, user.id);
  }

  return NextResponse.json({
    processed,
    skipped,
    remaining: Math.max(0, (totalRemaining ?? 0) - processed),
  });
}
