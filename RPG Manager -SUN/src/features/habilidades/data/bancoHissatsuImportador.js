import {
  criarRegistroHissatsuOficial,
  normalizarImagemReferencia
} from "./bancoHissatsuEstrutura.js";


/* ========================================
   IMPORTADOR COMPACTO — BANCO DE HISSATSU

   Objetivo:

   Permitir alimentar o Banco com lotes
   grandes sem repetir dezenas de linhas
   estruturais para cada Hissatsu.

   Este importador NÃO substitui:

   - bancoHissatsuEstrutura.js
   - consolidarLotesHissatsu()
   - auditarLotesHissatsu()

   Ele apenas converte dados compactos para
   o formato oficial já utilizado pelo Banco.
======================================== */


export const MODELO_IMPORTACAO_HISSATSU =
  "lote-compacto-v1";


function texto(
  valor
) {
  return String(
    valor ?? ""
  ).trim();
}


function objetoSeguro(
  valor
) {
  return (
    valor &&
    typeof valor === "object" &&
    !Array.isArray(valor)
      ? valor
      : {}
  );
}


function listaSegura(
  valor
) {
  return Array.isArray(valor)
    ? valor
    : [];
}


function clonar(
  valor
) {
  if (
    valor === undefined
  ) {
    return undefined;
  }

  try {
    return JSON.parse(
      JSON.stringify(valor)
    );
  } catch {
    return valor;
  }
}


function listaTextos(
  valor
) {
  if (
    !Array.isArray(valor)
  ) {
    return [];
  }

  return [
    ...new Set(
      valor
        .map(
          item =>
            texto(item)
        )
        .filter(Boolean)
    )
  ];
}


/* ========================================
   LOCALIZAÇÃO

   IMPORTANTE:

   ptBR NÃO recebe fallback automático.

   Ausência de localização significa:
   null.

   Nunca inventamos tradução.
======================================== */

function obterNomePtBREntrada(
  entrada
) {
  if (
    Object.prototype
      .hasOwnProperty
      .call(
        entrada,
        "nomePtBR"
      )
  ) {
    const valor =
      texto(
        entrada.nomePtBR
      );

    return valor || null;
  }


  if (
    Object.prototype
      .hasOwnProperty
      .call(
        entrada,
        "ptBR"
      )
  ) {
    const valor =
      texto(
        entrada.ptBR
      );

    return valor || null;
  }


  return null;
}


function obterNomeOriginalEntrada(
  entrada
) {
  return texto(
    entrada.nomeOriginal ||
    entrada.original ||
    entrada.nome
  );
}


function obterRomanizacaoEntrada(
  entrada
) {
  return texto(
    entrada.japonesRomanizado ||
    entrada.romanizado ||
    entrada.romanizacao
  );
}


function obterAlternativosEntrada(
  entrada
) {
  return [
    ...new Set([
      ...listaTextos(
        entrada.alternativos
      ),

      ...listaTextos(
        entrada.aliases
      ),

      ...listaTextos(
        entrada.nomesAlternativos
      )
    ])
  ];
}


/* ========================================
   IMAGEM DE REFERÊNCIA

   Formatos aceitos:

   imagemReferencia: {
     url,
     fonte,
     fonteUrl,
     status
   }

   ou formato compacto:

   imagemUrl
   imagemFonte
   imagemFonteUrl

   A imagem continua sendo somente
   apresentação.

   Nenhuma mecânica é criada aqui.
======================================== */

function obterImagemReferenciaEntrada(
  entrada
) {
  if (
    entrada.imagemReferencia !==
      undefined &&
    entrada.imagemReferencia !==
      null
  ) {
    return normalizarImagemReferencia(
      entrada.imagemReferencia
    );
  }


  const url =
    texto(
      entrada.imagemUrl
    );


  const fonte =
    texto(
      entrada.imagemFonte
    );


  const fonteUrl =
    texto(
      entrada.imagemFonteUrl
    );


  if (
    !url &&
    !fonte &&
    !fonteUrl
  ) {
    return normalizarImagemReferencia(
      null
    );
  }


  return normalizarImagemReferencia({
    url,

    fonte,

    fonteUrl,

    status:
      url
        ? "catalogada"
        : "pendente"
  });
}


/* ========================================
   APARIÇÕES

   Se "aparicoes" vier explicitamente,
   preservamos.

   Caso contrário, o importador pode criar
   automaticamente a aparição usando o
   midiaId definido no lote.

   Isso reduz muita repetição nos arquivos
   com dezenas ou centenas de registros.
======================================== */

function obterAparicoesEntrada(
  entrada,
  contexto
) {
  if (
    Array.isArray(
      entrada.aparicoes
    ) &&
    entrada.aparicoes.length >
      0
  ) {
    return clonar(
      entrada.aparicoes
    );
  }


  const midiaId =
    texto(
      entrada.midiaId ||
      contexto.midiaId
    );


  if (!midiaId) {
    return [];
  }


  const aparicao = {
    midiaId,

    versoes:
      listaTextos(
        entrada.versoes ||
        contexto.versoes
      )
  };


  const variante =
    objetoSeguro(
      entrada.variante
    );


  if (
    Object.keys(
      variante
    ).length >
    0
  ) {
    aparicao.variante =
      clonar(
        variante
      );
  }


  return [
    aparicao
  ];
}


/* ========================================
   TAGS

   Tags do lote + tags do registro.

   Não adicionamos traduções, mídia ou
   classificação escondidamente.

   O lote decide seus padrões.
======================================== */

function obterTagsEntrada(
  entrada,
  contexto
) {
  return [
    ...new Set([
      ...listaTextos(
        contexto.tagsPadrao
      ),

      ...listaTextos(
        entrada.tags
      )
    ])
  ];
}


/* ========================================
   VALIDAÇÃO DE UMA ENTRADA NOVA
======================================== */

function validarEntradaNova(
  entrada,
  indice
) {
  const erros = [];

  const id =
    texto(
      entrada?.id
    );

  const nomeOriginal =
    obterNomeOriginalEntrada(
      entrada || {}
    );


  if (!id) {
    erros.push(
      `Registro ${indice + 1}: ID ausente.`
    );
  }


  if (!nomeOriginal) {
    erros.push(
      `Registro ${indice + 1}${id ? ` (${id})` : ""}: nome original ausente.`
    );
  }


  return erros;
}


/* ========================================
   CONVERTER UMA ENTRADA COMPACTA
======================================== */

export function criarRegistroHissatsuImportado(
  entrada,
  contexto = {}
) {
  const origem =
    objetoSeguro(
      entrada
    );


  const erros =
    validarEntradaNova(
      origem,
      0
    );


  if (
    erros.length >
    0
  ) {
    throw new Error(
      [
        "Não foi possível importar a Hissatsu:",
        ...erros
      ].join("\n")
    );
  }


  const nomeOriginal =
    obterNomeOriginalEntrada(
      origem
    );


  const nomePtBR =
    obterNomePtBREntrada(
      origem
    );


  const japonesRomanizado =
    obterRomanizacaoEntrada(
      origem
    );


  const alternativos =
    obterAlternativosEntrada(
      origem
    );


  const imagemReferencia =
    obterImagemReferenciaEntrada(
      origem
    );


  const aparicoes =
    obterAparicoesEntrada(
      origem,
      contexto
    );


  const tags =
    obterTagsEntrada(
      origem,
      contexto
    );


  return criarRegistroHissatsuOficial({
    id:
      texto(
        origem.id
      ),

    nomeOriginal,

    nomePtBR,

    japonesRomanizado,

    alternativos,

    tipo:
      texto(
        origem.tipo
      ),

    elemento:
      texto(
        origem.elemento
      ),

    tipoOriginal:
      texto(
        origem.tipoOriginal
      ),

    elementoOriginal:
      texto(
        origem.elementoOriginal
      ),

    aparicoes,

    imagemReferencia,

    observacaoMecanica:
      texto(
        origem.observacaoMecanica ||
        contexto.observacaoMecanica
      ),

    observacaoCatalogacao:
      texto(
        origem.observacaoCatalogacao ||
        contexto.observacaoCatalogacao
      ),

    tags
  });
}


/* ========================================
   AUDITORIA DO ARQUIVO DE IMPORTAÇÃO

   Esta auditoria acontece ANTES da
   consolidação geral.

   Ela procura problemas do próprio lote:

   - registro inválido;
   - ID ausente;
   - nome original ausente;
   - ID repetido dentro do MESMO lote.

   IDs repetidos entre lotes continuam
   permitidos e são tratados pelo
   consolidarLotesHissatsu().
======================================== */

export function auditarDadosImportacaoHissatsu(
  registros
) {
  const origem =
    listaSegura(
      registros
    );


  const erros = [];

  const avisos = [];

  const ids =
    new Map();


  origem.forEach(
    (
      entrada,
      indice
    ) => {
      if (
        !entrada ||
        typeof entrada !==
          "object" ||
        Array.isArray(
          entrada
        )
      ) {
        erros.push(
          `Registro ${indice + 1}: entrada inválida.`
        );

        return;
      }


      const errosEntrada =
        validarEntradaNova(
          entrada,
          indice
        );


      erros.push(
        ...errosEntrada
      );


      const id =
        texto(
          entrada.id
        );


      if (!id) {
        return;
      }


      if (
        ids.has(id)
      ) {
        erros.push(
          `ID "${id}" repetido dentro do mesmo lote nos registros ${ids.get(id) + 1} e ${indice + 1}.`
        );

      } else {
        ids.set(
          id,
          indice
        );
      }


      if (
        !obterNomePtBREntrada(
          entrada
        )
      ) {
        avisos.push({
          tipo:
            "localizacao-ptbr-pendente",

          id,

          indice,

          mensagem:
            `PT-BR ainda não catalogado para "${id}".`
        });
      }


      const imagem =
        obterImagemReferenciaEntrada(
          entrada
        );


      if (
        !imagem.url
      ) {
        avisos.push({
          tipo:
            "imagem-pendente",

          id,

          indice,

          mensagem:
            `Imagem de referência ainda não catalogada para "${id}".`
        });
      }
    }
  );


  return {
    modelo:
      MODELO_IMPORTACAO_HISSATSU,

    total:
      origem.length,

    valido:
      erros.length ===
      0,

    totalErros:
      erros.length,

    totalAvisos:
      avisos.length,

    erros,

    avisos
  };
}


/* ========================================
   CRIAR LOTE

   Exemplo:

   criarLoteHissatsuImportado({
     midiaId: "inazuma-eleven",

     tagsPadrao: [
       "oficial",
       "inazuma-eleven"
     ],

     registros: [...]
   });

   Resultado:
   array pronto para entrar em
   consolidarLotesHissatsu().
======================================== */

export function criarLoteHissatsuImportado({
  midiaId = "",
  versoes = [],
  tagsPadrao = [],

  observacaoMecanica = "",
  observacaoCatalogacao = "",

  registros = []
} = {}) {
  const auditoria =
    auditarDadosImportacaoHissatsu(
      registros
    );


  if (
    !auditoria.valido
  ) {
    throw new Error(
      [
        "Lote de Hissatsu inválido.",
        "",
        ...auditoria.erros
      ].join("\n")
    );
  }


  const contexto = {
    midiaId:
      texto(
        midiaId
      ),

    versoes:
      listaTextos(
        versoes
      ),

    tagsPadrao:
      listaTextos(
        tagsPadrao
      ),

    observacaoMecanica:
      texto(
        observacaoMecanica
      ),

    observacaoCatalogacao:
      texto(
        observacaoCatalogacao
      )
  };


  return listaSegura(
    registros
  ).map(
    entrada =>
      criarRegistroHissatsuImportado(
        entrada,
        contexto
      )
  );
}


/* ========================================
   RESUMO DE UM LOTE COMPACTO

   Útil posteriormente para ferramentas de
   desenvolvimento, importação de JSON/CSV
   e painéis de auditoria.
======================================== */

export function obterResumoDadosImportacaoHissatsu(
  registros
) {
  const auditoria =
    auditarDadosImportacaoHissatsu(
      registros
    );


  const semPtBR =
    auditoria.avisos
      .filter(
        aviso =>
          aviso.tipo ===
          "localizacao-ptbr-pendente"
      )
      .length;


  const semImagem =
    auditoria.avisos
      .filter(
        aviso =>
          aviso.tipo ===
          "imagem-pendente"
      )
      .length;


  return {
    modelo:
      MODELO_IMPORTACAO_HISSATSU,

    total:
      auditoria.total,

    valido:
      auditoria.valido,

    erros:
      auditoria.totalErros,

    avisos:
      auditoria.totalAvisos,

    semPtBR,

    semImagem
  };
}