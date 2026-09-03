import {
  consolidarLotesHissatsu,
  auditarLotesHissatsu,
  normalizarNomesHissatsu,
  normalizarImagemReferencia
} from "../bancoHissatsuEstrutura.js";

import {
  loteHissatsuIE1Base
} from "../bancoHissatsuLoteIE1Base.js";

import {
  loteHissatsuIE1Expansao01
} from "../bancoHissatsuLoteIE1Expansao01.js";

import {
  loteHissatsuIE1Expansao02
} from "../bancoHissatsuLoteIE1Expansao02.js";

import {
  loteHissatsuIE1Expansao03
} from "../bancoHissatsuLoteIE1Expansao03.js";

import {
  loteHissatsuIE1Nomes01
} from "../bancoHissatsuLoteIE1Nomes01.js";

import {
  loteHissatsuIE1ImagensMapeadas01
} from "../bancoHissatsuLoteIE1ImagensMapeadas01.js";

import {
  loteHissatsuImagensAutomaticas
} from "../bancoHissatsuLoteImagensAutomaticas.js";


/* ========================================
   BANCO DE HISSATSU — SUPER ONZE

   ESTRATÉGIA:

   1. Primeiro consolidamos APENAS os dados
      factuais das Hissatsu.

   2. Depois descobrimos quais IDs realmente
      existem nesse Banco factual.

   3. Complementos de nomes e imagem são
      filtrados.

   4. Um complemento só pode enriquecer uma
      Hissatsu que já exista.

   CONSEQUÊNCIA:

   - complemento nunca cria Hissatsu;
   - nomes/imagens nunca aumentam o total;
   - arquivos antigos/stale são ignorados;
   - imagens manuais continuam tendo
     prioridade sobre automáticas.
======================================== */


/* ========================================
   LOTES FACTUAIS

   Estes são os únicos lotes autorizados
   a criar novas Hissatsu.
======================================== */

export const lotesBancoHissatsuFatuais = [
  loteHissatsuIE1Base,
  loteHissatsuIE1Expansao01,
  loteHissatsuIE1Expansao02,
  loteHissatsuIE1Expansao03
];


/* ========================================
   BANCO FACTUAL TEMPORÁRIO

   Serve para determinar quais IDs existem
   antes de aplicar qualquer complemento.
======================================== */

export const bancoHissatsuFactual =
  consolidarLotesHissatsu(
    lotesBancoHissatsuFatuais
  );


const idsBancoHissatsuFactual =
  new Set(
    bancoHissatsuFactual
      .map(
        registro =>
          String(
            registro?.id ||
            ""
          ).trim()
      )
      .filter(Boolean)
  );


/* ========================================
   FILTRO DE COMPLEMENTOS

   REGRA DE SEGURANÇA:

   Se o ID não existir no Banco factual,
   o complemento é ignorado.

   Portanto:

   complemento de nomes ou imagem
   NÃO TEM AUTORIZAÇÃO
   para criar Hissatsu.
======================================== */

function filtrarComplementosHissatsuExistentes(
  lote
) {
  if (
    !Array.isArray(
      lote
    )
  ) {
    return [];
  }

  return lote.filter(
    registro => {
      const id =
        String(
          registro?.id ||
          ""
        ).trim();

      return (
        id &&
        idsBancoHissatsuFactual.has(
          id
        )
      );
    }
  );
}


/* ========================================
   COMPLEMENTOS DE NOMES VALIDADOS

   A localização só pode enriquecer IDs
   que já existam no Banco factual.
======================================== */

export const loteHissatsuIE1Nomes01Seguro =
  filtrarComplementosHissatsuExistentes(
    loteHissatsuIE1Nomes01
  );


/* ========================================
   COMPLEMENTOS MANUAIS VALIDADOS
======================================== */

export const loteHissatsuIE1ImagensMapeadas01Seguro =
  filtrarComplementosHissatsuExistentes(
    loteHissatsuIE1ImagensMapeadas01
  );


/* ========================================
   COMPLEMENTOS AUTOMÁTICOS VALIDADOS

   Mesmo que o arquivo automático tenha
   registros antigos ou IDs que ainda não
   façam parte do Banco factual, somente
   IDs realmente existentes podem entrar.

   Os demais são ignorados.
======================================== */

export const loteHissatsuImagensAutomaticasSeguro =
  filtrarComplementosHissatsuExistentes(
    loteHissatsuImagensAutomaticas
  );


/* ========================================
   BANCO FINAL

   ORDEM IMPORTANTE:

   1. dados factuais;
   2. nomes/localizações;
   3. imagens manuais;
   4. imagens automáticas.

   Como a consolidação preserva a primeira
   imagem válida, a curadoria manual mantém
   prioridade sobre a automática.
======================================== */

export const lotesBancoHissatsuSuperOnze = [
  ...lotesBancoHissatsuFatuais,
  loteHissatsuIE1Nomes01Seguro,
  loteHissatsuIE1ImagensMapeadas01Seguro,
  loteHissatsuImagensAutomaticasSeguro
];


export const bancoHissatsuSuperOnze =
  consolidarLotesHissatsu(
    lotesBancoHissatsuSuperOnze
  );


export const auditoriaBancoHissatsuSuperOnze =
  auditarLotesHissatsu(
    lotesBancoHissatsuSuperOnze
  );


/* ========================================
   NORMALIZAÇÃO DE BUSCA

   Exemplos equivalentes:

   Furacão de Fogo
   furacao de fogo
   FURACÃO DE FOGO

   Heaven's Time
   heavens time

   Shippū Dash
   shippu dash
======================================== */

export function normalizarTextoBuscaHissatsu(
  valor
) {
  return String(
    valor ?? ""
  )
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLocaleLowerCase(
      "pt-BR"
    )
    .replace(
      /['’´`]/g,
      ""
    )
    .replace(
      /[-_/]+/g,
      " "
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim();
}


/* ========================================
   NOMES
======================================== */

export function obterNomesHissatsu(
  registro
) {
  return normalizarNomesHissatsu({
    nome:
      registro?.nome,

    nomes:
      registro?.nomes
  });
}


export function obterNomePtBRHissatsu(
  registro
) {
  return (
    obterNomesHissatsu(
      registro
    ).ptBR ||
    null
  );
}


export function obterNomeOriginalHissatsu(
  registro
) {
  return (
    obterNomesHissatsu(
      registro
    ).original ||
    String(
      registro?.nome ||
      ""
    )
  );
}


export function obterNomeRomanizadoHissatsu(
  registro
) {
  return (
    obterNomesHissatsu(
      registro
    )
      .japonesRomanizado ||
    ""
  );
}


export function obterNomeExibicaoHissatsu(
  registro
) {
  const nomes =
    obterNomesHissatsu(
      registro
    );

  return (
    nomes.ptBR ||
    nomes.original ||
    String(
      registro?.nome ||
      ""
    ) ||
    "Sem nome"
  );
}


export function obterTodosOsNomesHissatsu(
  registro
) {
  const nomes =
    obterNomesHissatsu(
      registro
    );

  const resultado = [
    registro?.nome,
    nomes.ptBR,
    nomes.ingles,
    nomes.original,
    nomes.japonesRomanizado,
    ...(
      Array.isArray(
        nomes.alternativos
      )
        ? nomes.alternativos
        : []
    )
  ]
    .map(
      item =>
        String(
          item || ""
        ).trim()
    )
    .filter(Boolean);

  return [
    ...new Set(
      resultado
    )
  ];
}


/* ========================================
   IMAGEM DE REFERÊNCIA
======================================== */

export function obterImagemReferenciaHissatsu(
  registro
) {
  const imagem =
    normalizarImagemReferencia(
      registro
        ?.imagemReferencia ||
      registro
        ?.imagem ||
      ""
    );

  return imagem;
}


/* ========================================
   TERMOS INDEXADOS
======================================== */

export function montarTermosBuscaHissatsu(
  registro
) {
  const tags =
    Array.isArray(
      registro
        ?.metadados
        ?.tags
    )
      ? registro
          .metadados
          .tags
      : [];

  const aparicoes =
    Array.isArray(
      registro?.aparicoes
    )
      ? registro.aparicoes
      : [];

  const termos = [
    registro?.id,

    ...obterTodosOsNomesHissatsu(
      registro
    ),

    registro?.tipo,
    registro?.elemento,

    ...tags,

    ...aparicoes
      .map(
        aparicao =>
          aparicao?.midiaId
      )
      .filter(Boolean)
  ]
    .map(
      item =>
        String(
          item || ""
        ).trim()
    )
    .filter(Boolean);

  return [
    ...new Set(
      termos
    )
  ];
}


/* ========================================
   BUSCA
======================================== */

export function hissatsuCombinaBusca(
  registro,
  consulta
) {
  const consultaNormalizada =
    normalizarTextoBuscaHissatsu(
      consulta
    );

  if (
    !consultaNormalizada
  ) {
    return true;
  }

  const palavras =
    consultaNormalizada
      .split(" ")
      .filter(Boolean);

  const indice =
    montarTermosBuscaHissatsu(
      registro
    )
      .map(
        normalizarTextoBuscaHissatsu
      )
      .join(" ");

  return palavras.every(
    palavra =>
      indice.includes(
        palavra
      )
  );
}


/* ========================================
   BUSCAR TEMPLATE POR ID
======================================== */

export function buscarHissatsuNoBanco(
  id
) {
  if (!id) {
    return null;
  }

  return (
    bancoHissatsuSuperOnze.find(
      hissatsu =>
        hissatsu.id === id
    ) ||
    null
  );
}


/* ========================================
   FILTROS
======================================== */

export function listarElementosBancoHissatsu() {
  return [
    ...new Set(
      bancoHissatsuSuperOnze
        .map(
          hissatsu =>
            String(
              hissatsu.elemento ||
              ""
            ).trim()
        )
        .filter(Boolean)
    )
  ].sort(
    (a, b) =>
      a.localeCompare(
        b,
        "pt-BR"
      )
  );
}


export function listarTiposBancoHissatsu() {
  return [
    ...new Set(
      bancoHissatsuSuperOnze
        .map(
          hissatsu =>
            String(
              hissatsu.tipo ||
              ""
            ).trim()
        )
        .filter(Boolean)
    )
  ];
}


export function listarMidiasUtilizadasNoBanco() {
  const ids =
    bancoHissatsuSuperOnze
      .flatMap(
        hissatsu =>
          Array.isArray(
            hissatsu.aparicoes
          )
            ? hissatsu.aparicoes
                .map(
                  aparicao =>
                    aparicao
                      ?.midiaId
                )
                .filter(Boolean)
            : []
      );

  return [
    ...new Set(
      ids
    )
  ];
}


/* ========================================
   LOCALIZAÇÕES PENDENTES
======================================== */

export function listarHissatsuSemLocalizacaoPtBR() {
  return bancoHissatsuSuperOnze
    .filter(
      registro =>
        !obterNomePtBRHissatsu(
          registro
        )
    );
}


/* ========================================
   IMAGENS PENDENTES
======================================== */

export function listarHissatsuSemImagemReferencia() {
  return bancoHissatsuSuperOnze
    .filter(
      registro =>
        !obterImagemReferenciaHissatsu(
          registro
        ).url
    );
}


/* ========================================
   COMPATIBILIDADE — MECÂNICA PENDENTE
======================================== */

export function listarHissatsuComMecanicaPendente() {
  return bancoHissatsuSuperOnze
    .filter(
      hissatsu =>
        hissatsu
          ?.mecanicaCampanha
          ?.status ===
        "pendente"
    );
}


/* ========================================
   RESUMO
======================================== */

export function obterResumoBancoHissatsu() {
  return {
    total:
      bancoHissatsuSuperOnze
        .length,

    tipos:
      listarTiposBancoHissatsu(),

    elementos:
      listarElementosBancoHissatsu(),

    midias:
      listarMidiasUtilizadasNoBanco(),

    lotes:
      lotesBancoHissatsuSuperOnze
        .length,

    complementos:
      auditoriaBancoHissatsuSuperOnze
        .totalComplementos,

    semPtBR:
      listarHissatsuSemLocalizacaoPtBR()
        .length,

    semImagem:
      listarHissatsuSemImagemReferencia()
        .length
  };
}