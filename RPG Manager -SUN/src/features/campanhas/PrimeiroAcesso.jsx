import React, { useState } from "react";
import "../auth/AuthScreen.css";

export default function PrimeiroAcesso({ nome, onCriar, onEntrar }) {
  const [acao, setAcao] = useState(null);
  const [valor, setValor] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento) {
    evento.preventDefault(); setEnviando(true); setMensagem("");
    try {
      if (acao === "criar") await onCriar(valor.trim());
      else await onEntrar(valor.trim().toUpperCase());
    } catch {
      setMensagem(acao === "criar" ? "Não foi possível criar a campanha." : "Código de convite inválido ou indisponível.");
    } finally { setEnviando(false); }
  }

  return <main className="auth-shell"><section className="auth-card"><span className="auth-kicker">RPG MANAGER</span><h1>Olá, {nome}.</h1><p>Você ainda não participa de nenhuma campanha.</p>
    {!acao ? <div className="auth-first-actions"><button onClick={()=>setAcao("criar")}>Criar campanha</button><button onClick={()=>setAcao("entrar")}>Entrar em campanha</button></div> : <form onSubmit={enviar}><label>{acao === "criar" ? "Nome da campanha" : "Código de convite"}<input autoFocus value={valor} onChange={e=>setValor(e.target.value)} required maxLength={120}/></label><button type="submit" disabled={enviando}>{enviando?"Aguarde...":acao==="criar"?"Criar como Mestre":"Entrar como Jogador"}</button><button type="button" className="auth-link-button" onClick={()=>{setAcao(null);setMensagem("")}}>Voltar</button></form>}
    {mensagem&&<p className="auth-message">{mensagem}</p>}
  </section></main>;
}
