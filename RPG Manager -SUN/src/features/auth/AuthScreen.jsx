import React, { useState } from "react";
import { supabase } from "../../lib/supabase.js";
import "./AuthScreen.css";

export default function AuthScreen({ configurado }) {
  const [modo, setModo] = useState("entrar");
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento) {
    evento.preventDefault();
    if (!supabase || enviando) return;
    setMensagem("");
    const nome = username.trim();
    if (!/^[a-zA-Z0-9_.]{3,32}$/.test(nome)) {
      setMensagem("Use de 3 a 32 caracteres: letras, números, ponto ou underscore.");
      return;
    }
    if (modo === "criar" && senha !== confirmarSenha) {
      setMensagem("As senhas não coincidem.");
      return;
    }

    setEnviando(true);
    const funcao = modo === "criar" ? "register-username" : "login-username";
    const { data, error } = await supabase.functions.invoke(funcao, { body: { username: nome, password: senha } });
    let erroSessao = null;
    if (!error && data?.session) {
      ({ error: erroSessao } = await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token
      }));
    }

    if (error || erroSessao || !data?.session) {
      setMensagem(modo === "criar" && data?.code === "USERNAME_TAKEN"
        ? "Este nome de usuário já está em uso."
        : modo === "criar"
          ? "Não foi possível criar a conta. Tente outro nome de usuário."
          : "Usuário ou senha incorretos.");
    }
    setEnviando(false);
  }

  if (!configurado) return <main className="auth-shell"><section className="auth-card"><h1>RPG Manager</h1><p>Supabase ainda não configurado. Defina as variáveis descritas em <code>.env.example</code>.</p></section></main>;

  return <main className="auth-shell"><section className="auth-card">
    <span className="auth-kicker">RPG MANAGER</span>
    <h1>{modo === "criar" ? "Criar conta" : "Entrar"}</h1>
    <form onSubmit={enviar}>
      <label>Nome de usuário<input type="text" autoComplete="username" minLength={3} maxLength={32} value={username} onChange={e => setUsername(e.target.value)} required /></label>
      <label>Senha<div className="auth-password"><input type={mostrarSenha ? "text" : "password"} autoComplete={modo === "entrar" ? "current-password" : "new-password"} minLength={8} value={senha} onChange={e => setSenha(e.target.value)} required /><button type="button" onClick={() => setMostrarSenha(v => !v)} aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}>{mostrarSenha ? "Ocultar" : "Mostrar"}</button></div><small>A senha deve possuir pelo menos 8 caracteres.</small></label>
      {modo === "criar" && <label>Confirmar senha<div className="auth-password"><input type={mostrarSenha ? "text" : "password"} autoComplete="new-password" minLength={8} value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} required /></div></label>}
      <button type="submit" disabled={enviando}>{enviando ? (modo === "criar" ? "Criando conta..." : "Entrando...") : modo === "criar" ? "Criar conta" : "Entrar"}</button>
    </form>
    {mensagem && <p className="auth-message" role="status">{mensagem}</p>}
    <div className="auth-actions"><button type="button" onClick={() => { setModo(modo === "criar" ? "entrar" : "criar"); setMensagem(""); setConfirmarSenha(""); }}>{modo === "criar" ? "Entrar" : "Criar conta"}</button></div>
  </section></main>;
}
