import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function isSafeRedirect(path: string): boolean {
  // Only allow relative paths starting with a single "/"
  // Reject values starting with "//" or any absolute URL
  return path.startsWith("/") && !path.startsWith("//");
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/dashboard";

  // Sanitize the redirect path to prevent open redirects
  const next = isSafeRedirect(rawNext) ? rawNext : "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}