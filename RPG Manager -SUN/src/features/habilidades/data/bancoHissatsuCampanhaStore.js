import {
  CHAVE_CAMPANHAS,
  CHAVE_NAVEGACAO,
  CHAVE_SESSAO_NAVEGACAO,
  possuiPermissao
} from "../../campanhas/campanhas.js";

import { supabase }
  from "../../../lib/supabase.js";

const PREFIXO_CONFIGURACAO_BANCO =
  "rpg-manager-banco-hissatsu-campanha";

const VERSAO_ESTRUTURA = 3;

export const DISPONIBILIDADES_BANCO_HISSATSU = {
  LIBERADA: "liberada",
  BLOQUEADA: "bloqueada",
  OCULTA: "oculta"
};

const DISPONIBILIDADES_VALIDAS = new Set(
  Object.values(
    DISPONIBILIDADES_BANCO_HISSATSU
  )
);


function lerJson(
  storage,
  chave
) {
  if (
    !storage ||
    !chave
  ) {
    return null;
  }

  try {
    const salvo =
      storage.getItem(
        chave
      );

    if (!salvo) {
      return null;
    }

    return JSON.parse(
      salvo
    );

  } catch {
    return null;
  }
}


function obterLocalStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}


function obterSessionStorage() {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}


function agoraIso() {
  return new Date()
    .toISOString();
}


function texto(
  valor
) {
  return String(
    valor || ""
  ).trim();
}


function normalizarCamada(
  camada
) {
  if (
    !camada ||
    typeof camada !== "object" ||
    Array.isArray(
      camada
    )
  ) {
    return null;
  }

  return {
    ...camada
  };
}


function normalizarDisponibilidade(
  valor,
  possuiPublicada = false
) {
  let estado = "";
  let atualizadoEm = null;

  if (
    typeof valor === "string"
  ) {
    estado = valor;

  } else if (
    valor &&
    typeof valor === "object" &&
    !Array.isArray(
      valor
    )
  ) {
    estado =
      valor.estado ||
      valor.status ||
      "";

    atualizadoEm =
      valor.atualizadoEm ||
      null;
  }

  if (
    !DISPONIBILIDADES_VALIDAS.has(
      estado
    )
  ) {
    estado =
      possuiPublicada
        ? DISPONIBILIDADES_BANCO_HISSATSU.LIBERADA
        : DISPONIBILIDADES_BANCO_HISSATSU.BLOQUEADA;
  }

  return {
    estado,
    atualizadoEm
  };
}


function normalizarApresentacao(
  valor
) {
  if (
    !valor ||
    typeof valor !== "object" ||
    Array.isArray(
      valor
    )
  ) {
    return {
      imagemUrl: "",
      atualizadoEm: null
    };
  }

  return {
    ...valor,

    imagemUrl:
      texto(
        valor.imagemUrl ||
        valor.imagem ||
        ""
      ),

    atualizadoEm:
      valor.atualizadoEm ||
      null
  };
}


function normalizarRegistroTemplate(
  templateId,
  valor
) {
  const objeto =
    valor &&
    typeof valor === "object" &&
    !Array.isArray(
      valor
    )
      ? valor
      : {};

  const publicada =
    normalizarCamada(
      objeto.publicada
    );

  const rascunho =
    normalizarCamada(
      objeto.rascunho
    );

  return {
    ...objeto,

    templateId,

    publicada,
    rascunho,

    disponibilidade:
      normalizarDisponibilidade(
        objeto.disponibilidade,
        Boolean(
          publicada
        )
      ),

    apresentacao:
      normalizarApresentacao(
        objeto.apresentacao
      )
  };
}


function criarEstadoVazio(
  campanhaId
) {
  return {
    versaoEstrutura:
      VERSAO_ESTRUTURA,

    campanhaId:
      campanhaId ||
      null,

    templates:
      {},

    atualizadoEm:
      null
  };
}


function normalizarEstadoBanco(
  campanhaId,
  valor
) {
  const base =
    criarEstadoVazio(
      campanhaId
    );

  if (
    !valor ||
    typeof valor !== "object" ||
    Array.isArray(
      valor
    )
  ) {
    return base;
  }

  const templates = {};

  Object.entries(
    valor.templates ||
    {}
  ).forEach(
    ([
      templateId,
      configuracao
    ]) => {
      if (!templateId) {
        return;
      }

      templates[
        templateId
      ] =
        normalizarRegistroTemplate(
          templateId,
          configuracao
        );
    }
  );

  return {
    ...base,
    ...valor,

    versaoEstrutura:
      VERSAO_ESTRUTURA,

    campanhaId:
      campanhaId ||
      valor.campanhaId ||
      null,

    templates
  };
}


export function descobrirCampanhaAtivaBancoHissatsu() {
  const sessionStorageSeguro =
    obterSessionStorage();

  const localStorageSeguro =
    obterLocalStorage();

  const navegacaoSessao =
    lerJson(
      sessionStorageSeguro,
      CHAVE_SESSAO_NAVEGACAO
    );

  if (
    navegacaoSessao
      ?.campanhaAtivaId
  ) {
    return navegacaoSessao
      .campanhaAtivaId;
  }

  const navegacaoPersistida =
    lerJson(
      localStorageSeguro,
      CHAVE_NAVEGACAO
    );

  if (
    navegacaoPersistida
      ?.campanhaAtivaId
  ) {
    return navegacaoPersistida
      .campanhaAtivaId;
  }

  return null;
}


function buscarCampanhaSalva(
  campanhaId
) {
  if (!campanhaId) {
    return null;
  }

  const localStorageSeguro =
    obterLocalStorage();

  const campanhas =
    lerJson(
      localStorageSeguro,
      CHAVE_CAMPANHAS
    );

  if (
    !Array.isArray(
      campanhas
    )
  ) {
    return null;
  }

  return (
    campanhas.find(
      campanha =>
        campanha?.id ===
        campanhaId
    ) ||
    null
  );
}


export function obterContextoBancoHissatsuLocal() {
  const campanhaId =
    descobrirCampanhaAtivaBancoHissatsu();

  const campanha =
    buscarCampanhaSalva(
      campanhaId
    );

  const podeAdministrar =
    Boolean(
      campanha &&
      possuiPermissao(
        campanha,
        "editarConfiguracao"
      )
    );

  return {
    campanhaId,
    campanha,
    podeAdministrar
  };
}


function criarChaveBanco(
  campanhaId
) {
  return (
    `${PREFIXO_CONFIGURACAO_BANCO}:` +
    `${campanhaId || "sem-campanha"}`
  );
}


export function carregarConfiguracoesBancoHissatsu(
  campanhaId
) {
  if (!campanhaId) {
    return criarEstadoVazio(
      null
    );
  }

  const localStorageSeguro =
    obterLocalStorage();

  const salvo =
    lerJson(
      localStorageSeguro,
      criarChaveBanco(
        campanhaId
      )
    );

  return normalizarEstadoBanco(
    campanhaId,
    salvo
  );
}


function salvarEstadoBanco(
  campanhaId,
  estado
) {
  const normalizado =
    normalizarEstadoBanco(
      campanhaId,
      estado
    );

  const atualizado = {
    ...normalizado,

    atualizadoEm:
      agoraIso()
  };

  const localStorageSeguro =
    obterLocalStorage();

  if (!localStorageSeguro) {
    return atualizado;
  }

  try {
    localStorageSeguro.setItem(
      criarChaveBanco(
        campanhaId
      ),
      JSON.stringify(
        atualizado
      )
    );

    if (supabase) {
      const registros = Object.values(atualizado.templates).map(item => ({
        campaign_id: campanhaId,
        template_id: item.templateId,
        availability: item.disponibilidade?.estado || "bloqueada",
        published_data: item.publicada || null,
        draft_data: item.rascunho || null,
        presentation: item.apresentacao || {},
        mechanical_version: Number(item.publicada?.versaoMecanica) || 0
      }));

      if (registros.length) {
        supabase.from("campaign_hissatsu").upsert(registros).then(({ error }) => {
          if (error) console.error("Erro ao sincronizar Banco Hissatsu:", error);
        });
      }
    }

  } catch (erro) {
    console.error(
      "Erro ao salvar configuração da biblioteca de habilidades:",
      erro
    );
  }

  return atualizado;
}


function obterRegistroAtual(
  estado,
  templateId
) {
  return normalizarRegistroTemplate(
    templateId,
    estado
      ?.templates
      ?.[templateId]
  );
}


/* ========================================
   RASCUNHO MECÂNICO

   Não altera disponibilidade.
   Não altera imagem.
======================================== */

export function salvarRascunhoTemplateBancoHissatsu({
  campanhaId,
  templateId,
  configuracao
}) {
  if (
    !campanhaId ||
    !templateId
  ) {
    return carregarConfiguracoesBancoHissatsu(
      campanhaId
    );
  }

  const estado =
    carregarConfiguracoesBancoHissatsu(
      campanhaId
    );

  const anterior =
    obterRegistroAtual(
      estado,
      templateId
    );

  const agora =
    agoraIso();

  const rascunho = {
    ...(
      configuracao ||
      {}
    ),

    status:
      "rascunho",

    baseadoNaVersao:
      anterior
        ?.publicada
        ?.versaoMecanica ??
      null,

    atualizadoEm:
      agora
  };

  return salvarEstadoBanco(
    campanhaId,
    {
      ...estado,

      templates: {
        ...estado.templates,

        [templateId]: {
          ...anterior,
          templateId,
          rascunho
        }
      }
    }
  );
}


/* ========================================
   DESCARTAR RASCUNHO

   A publicação existente permanece.
======================================== */

export function descartarRascunhoTemplateBancoHissatsu({
  campanhaId,
  templateId
}) {
  if (
    !campanhaId ||
    !templateId
  ) {
    return carregarConfiguracoesBancoHissatsu(
      campanhaId
    );
  }

  const estado =
    carregarConfiguracoesBancoHissatsu(
      campanhaId
    );

  const anterior =
    obterRegistroAtual(
      estado,
      templateId
    );

  return salvarEstadoBanco(
    campanhaId,
    {
      ...estado,

      templates: {
        ...estado.templates,

        [templateId]: {
          ...anterior,
          templateId,
          rascunho: null
        }
      }
    }
  );
}


/* ========================================
   PUBLICAR MECÂNICA

   Só esta operação cria uma nova versão.
======================================== */

export function publicarTemplateBancoHissatsu({
  campanhaId,
  templateId,
  configuracao
}) {
  if (
    !campanhaId ||
    !templateId
  ) {
    return carregarConfiguracoesBancoHissatsu(
      campanhaId
    );
  }

  const estado =
    carregarConfiguracoesBancoHissatsu(
      campanhaId
    );

  const anterior =
    obterRegistroAtual(
      estado,
      templateId
    );

  const versaoAnterior =
    Number(
      anterior
        ?.publicada
        ?.versaoMecanica
    ) ||
    0;

  const agora =
    agoraIso();

  const publicada = {
    ...(
      configuracao ||
      {}
    ),

    status:
      "configurada",

    versaoMecanica:
      versaoAnterior +
      1,

    publicadaEm:
      agora,

    atualizadoEm:
      agora
  };

  return salvarEstadoBanco(
    campanhaId,
    {
      ...estado,

      templates: {
        ...estado.templates,

        [templateId]: {
          ...anterior,
          templateId,
          publicada,
          rascunho: null
        }
      }
    }
  );
}


/* ========================================
   DISPONIBILIDADE

   Aplicação imediata.

   Não mexe em publicação ou rascunho.
======================================== */

export function atualizarDisponibilidadeTemplateBancoHissatsu({
  campanhaId,
  templateId,
  estadoDisponibilidade
}) {
  if (
    !campanhaId ||
    !templateId ||
    !DISPONIBILIDADES_VALIDAS.has(
      estadoDisponibilidade
    )
  ) {
    return carregarConfiguracoesBancoHissatsu(
      campanhaId
    );
  }

  const estado =
    carregarConfiguracoesBancoHissatsu(
      campanhaId
    );

  const anterior =
    obterRegistroAtual(
      estado,
      templateId
    );

  const agora =
    agoraIso();

  return salvarEstadoBanco(
    campanhaId,
    {
      ...estado,

      templates: {
        ...estado.templates,

        [templateId]: {
          ...anterior,
          templateId,

          disponibilidade: {
            estado:
              estadoDisponibilidade,

            atualizadoEm:
              agora
          }
        }
      }
    }
  );
}


/* ========================================
   APRESENTAÇÃO

   Imagem e futuras preferências visuais.

   Não cria versão mecânica.
======================================== */

export function atualizarApresentacaoTemplateBancoHissatsu({
  campanhaId,
  templateId,
  apresentacao
}) {
  if (
    !campanhaId ||
    !templateId
  ) {
    return carregarConfiguracoesBancoHissatsu(
      campanhaId
    );
  }

  const estado =
    carregarConfiguracoesBancoHissatsu(
      campanhaId
    );

  const anterior =
    obterRegistroAtual(
      estado,
      templateId
    );

  const agora =
    agoraIso();

  return salvarEstadoBanco(
    campanhaId,
    {
      ...estado,

      templates: {
        ...estado.templates,

        [templateId]: {
          ...anterior,
          templateId,

          apresentacao: {
            ...normalizarApresentacao(
              apresentacao
            ),

            atualizadoEm:
              agora
          }
        }
      }
    }
  );
}


/* ========================================
   REMOVER PERSONALIZAÇÃO MECÂNICA

   Preserva disponibilidade e apresentação.

   A habilidade volta a herdar os padrões
   da campanha.
======================================== */

export function removerMecanicaPersonalizadaTemplateBancoHissatsu({
  campanhaId,
  templateId
}) {
  if (
    !campanhaId ||
    !templateId
  ) {
    return carregarConfiguracoesBancoHissatsu(
      campanhaId
    );
  }

  const estado =
    carregarConfiguracoesBancoHissatsu(
      campanhaId
    );

  const anterior =
    obterRegistroAtual(
      estado,
      templateId
    );

  return salvarEstadoBanco(
    campanhaId,
    {
      ...estado,

      templates: {
        ...estado.templates,

        [templateId]: {
          ...anterior,
          templateId,
          publicada: null,
          rascunho: null
        }
      }
    }
  );
}


/* ========================================
   COMPATIBILIDADE COM O NOME ANTIGO
======================================== */

export function removerConfiguracaoTemplateBancoHissatsu(
  argumentos
) {
  return removerMecanicaPersonalizadaTemplateBancoHissatsu(
    argumentos
  );
}
