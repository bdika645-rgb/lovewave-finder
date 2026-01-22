// Lovable Cloud Function: delete-account
// Best-effort full account deletion + cleanup, with server-side permissions.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.90.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    // IMPORTANT: use the anon key for user-scoped auth calls.
    // Some environments expose both "publishable" and "anon"; anon is the canonical key.
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      console.error("Missing required environment variables");
      return new Response(JSON.stringify({ error: "Server not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const userId = userData.user.id;

    const { data: profile, error: profileErr } = await admin
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
    if (profileErr) throw profileErr;

    const profileId = profile?.id ?? null;

    if (profileId) {
      // Conversations cleanup: remove conversations that include this profile.
      const { data: parts, error: partsErr } = await admin
        .from("conversation_participants")
        .select("conversation_id")
        .eq("profile_id", profileId);
      if (partsErr) throw partsErr;

      const conversationIds = (parts ?? []).map((p) => p.conversation_id).filter(Boolean);

      if (conversationIds.length > 0) {
        const { error: msgErr } = await admin.from("messages").delete().in("conversation_id", conversationIds);
        if (msgErr) throw msgErr;

        const { error: cpErr } = await admin
          .from("conversation_participants")
          .delete()
          .in("conversation_id", conversationIds);
        if (cpErr) throw cpErr;

        const { error: convErr } = await admin.from("conversations").delete().in("id", conversationIds);
        if (convErr) throw convErr;
      }

      // Other related records (best-effort, but don't silently ignore failures)
      const deletions = await Promise.all([
        admin.from("photos").delete().eq("profile_id", profileId),
        admin.from("action_history").delete().eq("profile_id", profileId),
        admin.from("action_history").delete().eq("target_profile_id", profileId),
        admin.from("likes").delete().eq("liker_id", profileId),
        admin.from("likes").delete().eq("liked_id", profileId),
        admin.from("matches").delete().eq("profile1_id", profileId),
        admin.from("matches").delete().eq("profile2_id", profileId),
        admin.from("reports").delete().eq("reporter_id", profileId),
        admin.from("reports").delete().eq("reported_id", profileId),
        admin.from("blocked_users").delete().eq("blocker_id", profileId),
        admin.from("blocked_users").delete().eq("blocked_id", profileId),
      ]);

      const firstErr = deletions.find((r) => (r as { error?: unknown })?.error)?.error as any;
      if (firstErr) {
        throw new Error(firstErr.message ?? "Cleanup failed");
      }

      // Finally delete profile
      const { error: profDelErr } = await admin.from("profiles").delete().eq("id", profileId);
      if (profDelErr) throw profDelErr;
    }

    // User settings are tied to user_id
    const { error: settingsErr } = await admin.from("user_settings").delete().eq("user_id", userId);
    if (settingsErr) throw settingsErr;

    // Delete auth user (revokes sessions)
    const { error: delUserErr } = await admin.auth.admin.deleteUser(userId);
    if (delUserErr) throw delUserErr;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("delete-account failed", e);
    return new Response(JSON.stringify({ error: (e as Error).message ?? "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
