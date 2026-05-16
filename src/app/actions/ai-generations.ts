"use server";

import { createClient } from "@/lib/supabase/server";
import { addStyleSample, updateStyleProfile } from "@/lib/style-memory";
import { revalidatePath } from "next/cache";

export async function approveGeneration(
  generationId: string,
  finalBody: string,
  threadId: string
): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("ai_generations")
    .update({ status: "sent", final_body: finalBody })
    .eq("id", generationId)
    .eq("user_id", user.id);

  await supabase
    .from("email_threads")
    .update({ status: "replied" })
    .eq("id", threadId);

  // ── Style learning: add this sent reply as a voice sample ─────────────────
  // Runs after DB update, never throws — a failure here must not affect the UX.
  if (finalBody?.trim().length > 20) {
    await addStyleSample(supabase, user.id, finalBody, { generationId });
    await updateStyleProfile(supabase, user.id);
  }

  revalidatePath("/inbox");
}

export async function rejectGeneration(generationId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("ai_generations")
    .update({ status: "rejected" })
    .eq("id", generationId)
    .eq("user_id", user.id);

  revalidatePath("/inbox");
}
