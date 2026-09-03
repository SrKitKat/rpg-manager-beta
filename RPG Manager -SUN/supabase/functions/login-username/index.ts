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
    if (!url || !anonKey) throw new Error("Ambiente incompleto");

    // O cadastro usa exatamente este e-mail técnico para o username normalizado.
    // Ele nunca é exibido ao usuário e evita expor a service role no fluxo de login.
    const internalEmail = `${nome}@accounts.rpg-manager.invalid`;
    const auth = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await auth.auth.signInWithPassword({ email: internalEmail, password });
    if (error || !data.session) {
      console.error("Falha no login por username", {
        username: nome,
        status: error?.status,
        code: error?.code,
        message: error?.message
      });
      return invalido();
    }

    return new Response(JSON.stringify({ session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token
    }}), { headers });
  } catch (error) {
    console.error("Erro inesperado no login por username", error);
    return invalido();
  }
});
