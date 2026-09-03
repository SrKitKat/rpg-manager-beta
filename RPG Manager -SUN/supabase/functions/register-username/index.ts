import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json"
};

Deno.serve(async request => {
  if (request.method === "OPTIONS") return new Response("ok", { headers });
  if (request.method !== "POST") return new Response("Método não permitido", { status: 405, headers });
  try {
    const { username, password } = await request.json();
    const original = String(username || "").trim();
    const normalized = original.toLowerCase();
    if (!/^[a-z0-9_.]{3,32}$/.test(normalized) || typeof password !== "string" || password.length < 8) {
      return new Response(JSON.stringify({ code: "INVALID_INPUT" }), { headers });
    }

    const url = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !anonKey || !serviceKey) throw new Error("Ambiente incompleto");

    const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: existing } = await admin.from("profiles").select("id").eq("username_normalized", normalized).maybeSingle();
    if (existing) return new Response(JSON.stringify({ code: "USERNAME_TAKEN" }), { headers });

    // Identificador tecnico interno exigido pelo Supabase Auth. Nao e um e-mail do usuario.
    const internalEmail = `${normalized}@accounts.rpg-manager.invalid`;
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email: internalEmail,
      password,
      email_confirm: true,
      user_metadata: { username: original, display_name: original, username_only: true }
    });
    if (createError || !created.user) {
      const duplicate = /already|registered|duplicate/i.test(createError?.message || "");
      return new Response(JSON.stringify({ code: duplicate ? "USERNAME_TAKEN" : "CREATE_FAILED" }), { headers });
    }

    await admin.from("profiles").upsert({ id: created.user.id, username: original, display_name: original });
    const auth = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await auth.auth.signInWithPassword({ email: internalEmail, password });
    if (error || !data.session) return new Response(JSON.stringify({ code: "CREATE_FAILED" }), { headers });

    return new Response(JSON.stringify({ session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token
    }}), { headers });
  } catch {
    return new Response(JSON.stringify({ code: "CREATE_FAILED" }), { headers });
  }
});
