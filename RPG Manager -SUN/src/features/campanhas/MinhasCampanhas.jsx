import React from "react";
import { PAPEIS_CAMPANHA } from "./campanhas.js";
import "../auth/AuthScreen.css";

export default function MinhasCampanhas({ campanhas, onEntrar }) {
  return (
    <main className="auth-shell">
      <section className="auth-card campaign-picker">
        <span className="auth-kicker">RPG MANAGER</span>
        <h1>Minhas campanhas</h1>
        <div className="campaign-picker-list">
          {campanhas.map(campanha => {
            const mestre = campanha.acesso?.papel === PAPEIS_CAMPANHA.MESTRE;
            return (
              <article className="campaign-picker-item" key={campanha.id}>
                <div>
                  <strong>{campanha.nome}</strong>
                  <span>{mestre ? "Mestre" : "Jogador"}</span>
                  {mestre && campanha.inviteCode && <small>Código de convite: <code>{campanha.inviteCode}</code></small>}
                </div>
                <button type="button" onClick={() => onEntrar(campanha.id)}>Entrar</button>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
