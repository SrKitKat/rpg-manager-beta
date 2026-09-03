import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase, supabaseConfigurado } from "../../lib/supabase.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [sessao, setSessao] = useState(null);
  const [carregando, setCarregando] = useState(supabaseConfigurado);

  useEffect(() => {
    if (!supabase) return undefined;

    let ativo = true;
    supabase.auth.getSession().then(({ data }) => {
      if (ativo) {
        setSessao(data.session ?? null);
        setCarregando(false);
      }
    });

    const { data } = supabase.auth.onAuthStateChange((_evento, novaSessao) => {
      setSessao(novaSessao);
      setCarregando(false);
    });

    return () => {
      ativo = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const valor = useMemo(() => ({
    usuario: sessao?.user ?? null,
    sessao,
    carregando,
    configurado: supabaseConfigurado,
    sair: () => supabase?.auth.signOut()
  }), [sessao, carregando]);

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth precisa estar dentro de AuthProvider.");
  return contexto;
}
