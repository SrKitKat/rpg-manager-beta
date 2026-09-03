/* ========================================
   ESTRUTURA DO BANCO DE HISSATSU

   Responsabilidades:

   - criar registros oficiais;
   - normalizar nomes/localização;
   - normalizar imagem de referência;
   - consolidar lotes;
   - unir aparições sem duplicar Hissatsu;
   - preservar IDs estáveis.

   Este arquivo NÃO conhece regras de TP,
   parâmetros ou balanceamento da campanha.
======================================== */


function clonar(valor) {
  if (valor === undefined) {
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


function objetoSeguro(valor) {
  return (
    valor &&
    typeof valor === "object" &&
    !Array.isArray(valor)
      ? valor
      : {}
  );
}


function listaSegura(valor) {
  return Array.isArray(valor)
    ? valor
    : [];
}


function texto(valor) {
  return String(
    valor ?? ""
  ).trim();
}


function valorPreenchido(valor) {
  return (
    valor !== undefined &&
    valor !== null &&
    valor !== ""
  );
}


function localizacaoVerificada(
  valor
) {
  return (
    texto(valor)
      .toLocaleLowerCase(
        "pt-BR"
      ) ===
    "verificada"
  );
}


function escolherNomeLocalizado({
  valorBase = "",
  statusBase = "",
  valorEntrada = "",
  statusEntrada = "",
  fallback = ""
} = {}) {
  const base =
    texto(
      valorBase
    );

  const entrada =
    texto(
      valorEntrada
    );

  const statusBasePronto =
    texto(
      statusBase
    ) ||
    "pendente";

  const statusEntradaPronto =
    texto(
      statusEntrada
    ) ||
    "pendente";

  if (
    entrada &&
    localizacaoVerificada(
      statusEntradaPronto
    ) &&
    !localizacaoVerificada(
      statusBasePronto
    )
  ) {
    return {
      valor:
        entrada,

      status:
        "verificada"
    };
  }

  if (base) {
    return {
      valor:
        base,

      status:
        statusBasePronto
    };
  }

  if (entrada) {
    return {
      valor:
        entrada,

      status:
        statusEntradaPronto
    };
  }

  return {
    valor:
      texto(
        fallback
      ),

    status:
      "pendente"
  };
}


function unirValoresUnicos(
  ...listas
) {
  const resultado = [];
  const vistos = new Set();

  listas
    .flatMap(
      lista =>
        listaSegura(lista)
    )
    .forEach(
      valor => {
        const normalizado =
          texto(valor);

        if (!normalizado) {
          return;
        }

        const chave =
          normalizado
            .toLocaleLowerCase(
              "pt-BR"
            );

        if (
          vistos.has(chave)
        ) {
          return;
        }

        vistos.add(chave);

        resultado.push(
          normalizado
        );
      }
    );

  return resultado;
}


/* ========================================
   NOMES / LOCALIZAÇÃO
======================================== */

export function normalizarNomesHissatsu({
  nome = "",
  nomeOriginal = "",
  nomePtBR = null,
  nomeIngles = "",
  japonesRomanizado = "",
  alternativos = [],
  nomes = null
} = {}) {
  const nomesEntrada =
    objetoSeguro(nomes);

  const original =
    texto(
      nomesEntrada.original ||
      nomeOriginal ||
      nome
    );

  const ptBRBruto =
    nomesEntrada.ptBR ??
    nomePtBR;

  const ptBR =
    texto(
      ptBRBruto
    ) ||
    null;

  const ingles =
    texto(
      nomesEntrada.ingles ||
      nomeIngles
    );

  const romanizado =
    texto(
      nomesEntrada
        .japonesRomanizado ||
      japonesRomanizado
    );

  const alternativosProntos =
    unirValoresUnicos(
      nomesEntrada.alternativos,
      alternativos
    )
      .filter(
        item =>
          item !== ptBR &&
          item !== ingles &&
          item !== original &&
          item !== romanizado
      );

  return {
    ptBR,
    ingles,
    original,
    japonesRomanizado:
      romanizado,

    alternativos:
      alternativosProntos
  };
}


export function obterNomePrincipalRegistro(
  registro
) {
  const nomes =
    normalizarNomesHissatsu({
      nome:
        registro?.nome,

      nomes:
        registro?.nomes
    });

  return (
    nomes.ptBR ||
    nomes.original ||
    texto(
      registro?.nome
    ) ||
    "Sem nome"
  );
}


/* ========================================
   IMAGEM DE REFERÊNCIA

   A imagem pertence ao catálogo da
   franquia.

   Uma campanha pode substituir esta URL
   sem alterar o catálogo.

   Uma ficha pode posteriormente substituir
   a imagem da campanha sem alterar nenhuma
   das camadas anteriores.
======================================== */

export function normalizarImagemReferencia(
  imagem
) {
  if (
    typeof imagem ===
    "string"
  ) {
    const url =
      texto(imagem);

    return {
      url,

      fonte:
        "",

      fonteUrl:
        "",

      status:
        url
          ? "catalogada"
          : "pendente"
    };
  }

  const origem =
    objetoSeguro(
      imagem
    );

  const url =
    texto(
      origem.url
    );

  return {
    url,

    fonte:
      texto(
        origem.fonte
      ),

    fonteUrl:
      texto(
        origem.fonteUrl
      ),

    status:
      texto(
        origem.status
      ) ||
      (
        url
          ? "catalogada"
          : "pendente"
      )
  };
}


/* ========================================
   APARIÇÕES
======================================== */

function ordenarObjeto(
  valor
) {
  if (
    Array.isArray(valor)
  ) {
    return valor.map(
      ordenarObjeto
    );
  }

  if (
    valor &&
    typeof valor ===
      "object"
  ) {
    return Object.keys(valor)
      .sort()
      .reduce(
        (
          resultado,
          chave
        ) => {
          resultado[chave] =
            ordenarObjeto(
              valor[chave]
            );

          return resultado;
        },
        {}
      );
  }

  return valor;
}


function assinaturaVariante(
  variante
) {
  if (
    !variante ||
    typeof variante !==
      "object"
  ) {
    return "";
  }

  return JSON.stringify(
    ordenarObjeto(
      variante
    )
  );
}


function chaveAparicao(
  aparicao
) {
  return (
    `${texto(
      aparicao?.midiaId
    )}::${assinaturaVariante(
      aparicao?.variante
    )}`
  );
}


function mesclarAparicoes(
  base,
  complemento
) {
  const mapa =
    new Map();

  [
    ...listaSegura(base),
    ...listaSegura(complemento)
  ].forEach(
    aparicao => {
      const midiaId =
        texto(
          aparicao?.midiaId
        );

      if (!midiaId) {
        return;
      }

      const chave =
        chaveAparicao(
          aparicao
        );

      const existente =
        mapa.get(
          chave
        );

      if (!existente) {
        mapa.set(
          chave,
          {
            ...clonar(
              aparicao
            ),

            midiaId,

            versoes:
              unirValoresUnicos(
                aparicao?.versoes
              )
          }
        );

        return;
      }

      mapa.set(
        chave,
        {
          ...existente,
          ...clonar(
            aparicao
          ),

          midiaId,

          versoes:
            unirValoresUnicos(
              existente.versoes,
              aparicao?.versoes
            )
        }
      );
    }
  );

  return [
    ...mapa.values()
  ];
}


/* ========================================
   METADADOS
======================================== */

function mesclarMetadados(
  base,
  complemento
) {
  const baseSegura =
    objetoSeguro(base);

  const complementoSeguro =
    objetoSeguro(
      complemento
    );

  const catalogacaoBase =
    objetoSeguro(
      baseSegura.catalogacao
    );

  const catalogacaoComplemento =
    objetoSeguro(
      complementoSeguro
        .catalogacao
    );

  return {
    ...baseSegura,
    ...complementoSeguro,

    catalogacao: {
      ...catalogacaoBase,
      ...catalogacaoComplemento,

      midiasVerificadas:
        unirValoresUnicos(
          catalogacaoBase
            .midiasVerificadas,

          catalogacaoComplemento
            .midiasVerificadas
        )
    },

    referencia: {
      ...objetoSeguro(
        baseSegura.referencia
      ),

      ...objetoSeguro(
        complementoSeguro
          .referencia
      )
    },

    tags:
      unirValoresUnicos(
        baseSegura.tags,
        complementoSeguro.tags
      )
  };
}


/* ========================================
   CRIAR REGISTRO OFICIAL
======================================== */

export function criarRegistroHissatsuOficial({
  id,
  versao = 1,

  nome = "",
  nomeOriginal = "",
  nomePtBR = null,
  nomeIngles = "",
  japonesRomanizado = "",
  alternativos = [],
  nomes = null,

  tipo,
  elemento,

  descricao = "",

  imagemReferencia = null,

  aparicoes = null,

  midiaId =
    "inazuma-eleven",

  tipoOriginal = "",
  elementoOriginal = "",

  estreiaJogo =
    "Inazuma Eleven",

  observacaoMecanica =
    "A técnica ainda não recebeu parâmetros, custos e requisitos próprios do RPG.",

  observacaoCatalogacao =
    "Outras aparições serão adicionadas conforme cada mídia for auditada.",

  tags = []
}) {
  const nomesProntos =
    normalizarNomesHissatsu({
      nome,
      nomeOriginal,
      nomePtBR,
      nomeIngles,
      japonesRomanizado,
      alternativos,
      nomes
    });

  const nomePrincipal =
    nomesProntos.ptBR ||
    nomesProntos.original ||
    texto(nome);

  const imagemPronta =
    normalizarImagemReferencia(
      imagemReferencia
    );

  const descricoesPadrao = {
    chute:
      "Hissatsu de chute introduzida em Inazuma Eleven.",

    drible:
      "Hissatsu de drible introduzida em Inazuma Eleven.",

    bloqueio:
      "Hissatsu de bloqueio introduzida em Inazuma Eleven.",

    defesa_goleiro:
      "Hissatsu de goleiro introduzida em Inazuma Eleven.",

    passe:
      "Hissatsu de passe da franquia Inazuma Eleven.",

    suporte:
      "Hissatsu de suporte da franquia Inazuma Eleven.",

    outro:
      "Hissatsu oficial da franquia Inazuma Eleven."
  };

  const aparicoesProntas =
    Array.isArray(
      aparicoes
    ) &&
    aparicoes.length > 0
      ? clonar(
          aparicoes
        )
      : [
          {
            midiaId,
            versoes: []
          }
        ];

  const midiasVerificadas =
    unirValoresUnicos(
      aparicoesProntas
        .map(
          aparicao =>
            aparicao?.midiaId
        )
    );

  return {
    id:
      texto(id),

    versao:
      Number(versao) ||
      1,

    /*
      "nome" continua existindo por
      compatibilidade.

      Quando existe localização PT-BR
      verificada, ela é o nome principal.
    */

    nome:
      nomePrincipal,

    nomes:
      nomesProntos,

    localizacao: {
      idiomaPrincipal:
        nomesProntos.ptBR
          ? "ptBR"
          : "original",

      ptBR:
        nomesProntos.ptBR
          ? "verificada"
          : "pendente",

      ingles:
        "pendente",

      japonesRomanizado:
        "pendente"
    },

    tipo,
    elemento,

    grau: "",
    custoTP: "",

    /*
      "imagem" permanece por compatibilidade.

      Para conteúdo de catálogo, usamos
      imagemReferencia.
    */

    imagem:
      imagemPronta.url,

    imagemReferencia:
      imagemPronta,

    descricao:
      descricao ||
      descricoesPadrao[tipo] ||
      descricoesPadrao.outro,

    parametros: {},
    custos: {},

    requisitosAtributos: {},
    requisitosNarrativos: [],

    evolucao: "",

    /*
      Campo legado.

      A mecânica atual já pode ser funcional
      apenas herdando os padrões da campanha.
    */

    mecanicaCampanha: {
      status:
        "pendente",

      observacao:
        observacaoMecanica
    },

    aparicoes:
      aparicoesProntas,

    metadados: {
      origemTipo:
        "oficial",

      origemRotulo:
        "OFICIAL",

      classificacao:
        "oficial",

      rotuloClassificacao:
        "OFICIAL",

      origemTexto:
        "Técnica pertencente à franquia Inazuma Eleven.",

      catalogacao: {
        status:
          "parcial",

        midiasVerificadas,

        observacao:
          observacaoCatalogacao
      },

      referencia: {
        tipoOriginal,
        elementoOriginal,
        estreiaJogo
      },

      tags:
        unirValoresUnicos(
          tags
        )
    }
  };
}


/* ========================================
   MESCLAR REGISTROS REPETIDOS

   Um ID repetido em outro lote significa
   complemento da mesma Hissatsu.
======================================== */

function mesclarRegistro(
  base,
  complemento
) {
  const resultado =
    clonar(base) ||
    {};

  const entrada =
    clonar(complemento) ||
    {};

  /*
    NOMES
  */

  const nomesBase =
    normalizarNomesHissatsu({
      nome:
        resultado.nome,

      nomes:
        resultado.nomes
    });

  const nomesEntrada =
    normalizarNomesHissatsu({
      nome:
        entrada.nome,

      nomes:
        entrada.nomes
    });

  const localizacaoBase =
    objetoSeguro(
      resultado.localizacao
    );

  const localizacaoEntrada =
    objetoSeguro(
      entrada.localizacao
    );

  const ptBRPronto =
    escolherNomeLocalizado({
      valorBase:
        nomesBase.ptBR,

      statusBase:
        localizacaoBase.ptBR,

      valorEntrada:
        nomesEntrada.ptBR,

      statusEntrada:
        localizacaoEntrada.ptBR
    });

  const inglesPronto =
    escolherNomeLocalizado({
      valorBase:
        nomesBase.ingles,

      statusBase:
        localizacaoBase.ingles,

      valorEntrada:
        nomesEntrada.ingles,

      statusEntrada:
        localizacaoEntrada.ingles
    });

  const japonesRomanizadoPronto =
    escolherNomeLocalizado({
      valorBase:
        nomesBase
          .japonesRomanizado,

      statusBase:
        localizacaoBase
          .japonesRomanizado,

      valorEntrada:
        nomesEntrada
          .japonesRomanizado,

      statusEntrada:
        localizacaoEntrada
          .japonesRomanizado
    });

  resultado.nomes = {
    ptBR:
      ptBRPronto.valor ||
      null,

    ingles:
      inglesPronto.valor,

    original:
      nomesBase.original ||
      nomesEntrada.original ||
      "",

    japonesRomanizado:
      japonesRomanizadoPronto
        .valor,

    alternativos:
      unirValoresUnicos(
        nomesBase.alternativos,
        nomesEntrada.alternativos
      )
  };

  resultado.nome =
    resultado.nomes.ptBR ||
    resultado.nomes.original ||
    resultado.nome ||
    entrada.nome ||
    "Sem nome";

  resultado.localizacao = {
    ...localizacaoEntrada,
    ...localizacaoBase,

    idiomaPrincipal:
      resultado.nomes.ptBR
        ? "ptBR"
        : "original",

    ptBR:
      ptBRPronto.status,

    ingles:
      inglesPronto.status,

    japonesRomanizado:
      japonesRomanizadoPronto
        .status
  };


  /*
    IMAGEM
  */

  const imagemBase =
    normalizarImagemReferencia(
      resultado
        .imagemReferencia ||
      resultado.imagem
    );

  const imagemEntrada =
    normalizarImagemReferencia(
      entrada
        .imagemReferencia ||
      entrada.imagem
    );

  resultado.imagemReferencia =
    imagemBase.url
      ? imagemBase
      : imagemEntrada;

  resultado.imagem =
    resultado
      .imagemReferencia
      .url ||
    "";


  /*
    CAMPOS PRINCIPAIS
  */

  Object.entries(
    entrada
  ).forEach(
    ([
      chave,
      valor
    ]) => {
      if (
        [
          "id",
          "versao",
          "nome",
          "nomes",
          "localizacao",
          "imagem",
          "imagemReferencia",
          "aparicoes",
          "metadados"
        ].includes(chave)
      ) {
        return;
      }

      if (
        !valorPreenchido(
          resultado[chave]
        ) &&
        valorPreenchido(
          valor
        )
      ) {
        resultado[chave] =
          valor;
      }
    }
  );

  resultado.versao =
    Math.max(
      Number(
        resultado.versao
      ) ||
      1,

      Number(
        entrada.versao
      ) ||
      1
    );

  resultado.aparicoes =
    mesclarAparicoes(
      resultado.aparicoes,
      entrada.aparicoes
    );

  resultado.metadados =
    mesclarMetadados(
      resultado.metadados,
      entrada.metadados
    );

  return resultado;
}


/* ========================================
   CONSOLIDAR LOTES
======================================== */

export function consolidarLotesHissatsu(
  lotes = []
) {
  const mapa =
    new Map();

  listaSegura(lotes)
    .flatMap(
      lote =>
        listaSegura(lote)
    )
    .forEach(
      registro => {
        const id =
          texto(
            registro?.id
          );

        if (!id) {
          return;
        }

        const existente =
          mapa.get(id);

        if (!existente) {
          mapa.set(
            id,
            clonar(registro)
          );

          return;
        }

        mapa.set(
          id,
          mesclarRegistro(
            existente,
            registro
          )
        );
      }
    );

  return [
    ...mapa.values()
  ];
}


/* ========================================
   AUDITORIA
======================================== */

export function auditarLotesHissatsu(
  lotes = []
) {
  const entradas =
    listaSegura(lotes)
      .flatMap(
        lote =>
          listaSegura(lote)
      );

  const contagem =
    new Map();

  const semId = [];

  entradas.forEach(
    (
      registro,
      indice
    ) => {
      const id =
        texto(
          registro?.id
        );

      if (!id) {
        semId.push(indice);
        return;
      }

      contagem.set(
        id,
        (
          contagem.get(id) ||
          0
        ) +
        1
      );
    }
  );

  const idsComComplementos =
    [
      ...contagem.entries()
    ]
      .filter(
        ([
          ,
          quantidade
        ]) =>
          quantidade > 1
      )
      .map(
        ([
          id,
          quantidade
        ]) => ({
          id,
          quantidade
        })
      );

  return {
    totalEntradas:
      entradas.length,

    totalIdsUnicos:
      contagem.size,

    totalComplementos:
      entradas.length -
      contagem.size,

    registrosSemId:
      semId.length,

    idsComComplementos
  };
}