import {
  catalogoHissatsuOficial903,
  METADADOS_CATALOGO_HISSATSU_903
} from "./bancoHissatsuCatalogoOficial903.js";


export {
  METADADOS_CATALOGO_HISSATSU_903
};


export const bancoHissatsuFactual =
  catalogoHissatsuOficial903;


export const bancoHissatsuSuperOnze =
  catalogoHissatsuOficial903;


export const lotesBancoHissatsuFatuais = [
  catalogoHissatsuOficial903
];


export const lotesBancoHissatsuSuperOnze = [
  catalogoHissatsuOficial903
];


/* Compatibilidade com imports antigos. */

export const loteHissatsuIE1Nomes01Seguro =
  [];


export const loteHissatsuIE1ImagensMapeadas01Seguro =
  [];


export const loteHissatsuImagensAutomaticasSeguro =
  [];


export const auditoriaBancoHissatsuSuperOnze = {

  totalEntradas:
    catalogoHissatsuOficial903.length,


  totalIdsUnicos:
    new Set(
      catalogoHissatsuOficial903.map(
        item =>
          item.id
      )
    ).size,


  totalComplementos:
    0,


  registrosSemId:
    catalogoHissatsuOficial903.filter(
      item =>
        !item.id
    ).length,


  idsComComplementos:
    []

};


/* ========================================
   BUSCA
======================================== */


export function normalizarTextoBuscaHissatsu(
  valor
) {

  return String(
    valor ??
    ""
  )

    .normalize(
      "NFD"
    )

    .replace(
      /[\u0300-\u036f]/g,
      ""
    )

    .toLocaleLowerCase(
      "pt-BR"
    )

    .replace(
      /[’'´]/g,
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


export function obterNomesHissatsu(
  registro
) {

  const nomes =
    registro?.nomes ||
    {};


  return {

    ptBR:
      nomes.ptBR ||
      null,

    ingles:
      nomes.ingles ||
      "",

    original:
      nomes.original ||
      "",

    japones:
      nomes.japones ||
      "",

    japonesRomanizado:
      nomes.japonesRomanizado ||
      "",

    alternativos:
      Array.isArray(
        nomes.alternativos
      )
        ? nomes.alternativos
        : []

  };

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

  const nomes =
    obterNomesHissatsu(
      registro
    );


  return (

    nomes.original ||

    nomes.japones ||

    nomes.ingles ||

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

    nomes.ingles ||

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


  return [

    ...new Set(

      [

        registro?.nome,

        nomes.ptBR,

        nomes.ingles,

        nomes.original,

        nomes.japones,

        nomes.japonesRomanizado,

        ...nomes.alternativos

      ]

        .map(
          item =>
            String(
              item ||
              ""
            )
              .trim()
        )

        .filter(
          Boolean
        )

    )

  ];

}


/* ========================================
   IMAGEM
======================================== */


export function obterImagemReferenciaHissatsu(
  registro
) {

  const origem =
    registro
      ?.imagemReferencia;


  if (
    typeof origem ===
    "string"
  ) {

    return {

      url:
        origem,

      fonte:
        "",

      fonteUrl:
        "",

      status:
        origem
          ? "catalogada"
          : "pendente"

    };

  }


  if (
    origem &&
    typeof origem ===
      "object"
  ) {

    return {

      url:
        String(
          origem.url ||
          registro?.imagem ||
          ""
        )
          .trim(),

      fonte:
        String(
          origem.fonte ||
          ""
        )
          .trim(),

      fonteUrl:
        String(
          origem.fonteUrl ||
          ""
        )
          .trim(),

      ...origem

    };

  }


  return {

    url:
      String(
        registro?.imagem ||
        ""
      )
        .trim(),

    fonte:
      "",

    fonteUrl:
      "",

    status:
      registro?.imagem
        ? "catalogada"
        : "pendente"

  };

}


/* ========================================
   TERMOS DE BUSCA
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


  return [

    ...new Set(

      [

        registro?.id,

        ...obterTodosOsNomesHissatsu(
          registro
        ),

        registro?.tipo,

        registro?.elemento,

        registro
          ?.metadados
          ?.referencia
          ?.categoriaOficial,

        ...tags,

        ...aparicoes
          .map(
            item =>
              item?.midiaId
          )
          .filter(
            Boolean
          )

      ]

        .map(
          item =>
            String(
              item ||
              ""
            )
              .trim()
        )

        .filter(
          Boolean
        )

    )

  ];

}


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
      .split(
        " "
      )
      .filter(
        Boolean
      );


  const indice =
    montarTermosBuscaHissatsu(
      registro
    )

      .map(
        normalizarTextoBuscaHissatsu
      )

      .join(
        " "
      );


  return palavras.every(
    palavra =>
      indice.includes(
        palavra
      )
  );

}


export function buscarHissatsuNoBanco(
  id
) {

  if (!id) {
    return null;
  }


  return (

    bancoHissatsuSuperOnze.find(
      item =>
        item.id ===
        id
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
          item =>
            String(
              item.elemento ||
              ""
            )
              .trim()
        )

        .filter(
          Boolean
        )

    )

  ].sort(
    (
      a,
      b
    ) =>
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
          item =>
            String(
              item.tipo ||
              ""
            )
              .trim()
        )

        .filter(
          Boolean
        )

    )

  ];

}


export function listarMidiasUtilizadasNoBanco() {

  return [

    ...new Set(

      bancoHissatsuSuperOnze

        .flatMap(
          item =>
            Array.isArray(
              item.aparicoes
            )
              ? item.aparicoes
                  .map(
                    aparicao =>
                      aparicao
                        ?.midiaId
                  )
                  .filter(
                    Boolean
                  )
              : []
        )

    )

  ];

}


/* ========================================
   PENDÊNCIAS

   Slots secretos oficiais NÃO contam
   como erro de tradução ou imagem.
======================================== */


export function listarHissatsuSemLocalizacaoPtBR() {

  return bancoHissatsuSuperOnze
    .filter(
      item =>

        item
          ?.metadados
          ?.segredoOficial !==
          true &&

        !obterNomePtBRHissatsu(
          item
        )
    );

}


export function listarHissatsuSemImagemReferencia() {

  return bancoHissatsuSuperOnze
    .filter(
      item => {

        if (
          item
            ?.metadados
            ?.segredoOficial ===
          true
        ) {
          return false;
        }


        const imagem =
          obterImagemReferenciaHissatsu(
            item
          );


        return (

          !imagem.url ||

          imagem.placeholder ===
            true

        );

      }
    );

}


export function listarHissatsuComMecanicaPendente() {

  return bancoHissatsuSuperOnze
    .filter(
      item =>
        item
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


    segredosOficiais:
      bancoHissatsuSuperOnze
        .filter(
          item =>
            item
              ?.metadados
              ?.segredoOficial ===
            true
        )
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
      0,


    semPtBR:
      listarHissatsuSemLocalizacaoPtBR()
        .length,


    semImagem:
      listarHissatsuSemImagemReferencia()
        .length

  };

}


export default bancoHissatsuSuperOnze;
