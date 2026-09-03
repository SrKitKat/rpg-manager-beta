import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json"
};

const invalido = () => new Response(JSON.stringify({ error: "Usuário/e-mail ou senha incorretos." }), { status: 401, headers });

Deno.serve(async request => {
  if (request.method === "OPTIONS") return new Response("ok", { headers });
  if (request.method !== "POST") return new Response("Método não permitido", { status: 405, headers });
  try {
    const { username, password } = await request.json();
    const nome = String(username || "").trim().toLowerCase();
    if (!nome || nome.includes("@") || typeof password !== "string" || password.length < 8) return invalido();

    const url = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !anonKey || !serviceKey) throw new Error("Ambiente incompleto");

    const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: profile } = await admin.from("profiles").select("id").eq("username_normalized", nome).maybeSingle();
    if (!profile?.id) return invalido();
    const { data: userData, error: userError } = await admin.auth.admin.getUserById(profile.id);
    if (userError || !userData.user?.email) return invalido();

    const auth = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await auth.auth.signInWithPassword({ email: userData.user.email, password });
    if (error || !data.session) return invalido();

    return new Response(JSON.stringify({ session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token
    }}), { headers });
  } catch {
    return invalido();
  }
});
