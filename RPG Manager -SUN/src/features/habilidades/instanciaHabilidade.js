export const MODELO_INSTANCIA_HABILIDADE =
  "snapshot-independente-v1";

export const MODELO_BASE_INSTANCIA_HABILIDADE =
  "base-aquisicao-v1";


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


function valorVazio(valor) {
  return (
    valor === "" ||
    valor === null ||
    valor === undefined
  );
}


function obterCampoCustoPrincipal(
  configuracaoHabilidades
) {
  return (
    configuracaoHabilidades
      ?.custoPrincipal
      ?.campo ||
    "custoTP"
  );
}


function obterCamposOrigem(
  configuracaoHabilidades
) {
  const configurados =
    configuracaoHabilidades
      ?.biblioteca
      ?.aquisicao
      ?.camposOrigem ||
    {};

  return {
    id:
      configurados.id ||
      "origemBibliotecaId",

    versao:
      configurados.versao ||
      "origemBibliotecaVersao",

    nome:
      configurados.nome ||
      "origemBibliotecaNome"
  };
}


/* ========================================
   IMAGENS

   Hierarquia visual:

   1. imagemFicha
   2. imagemCampanha
   3. imagemReferencia
   4. imagem legada

   "imagem" continua existindo como campo
   efetivo por compatibilidade com partes
   antigas do sistema.
======================================== */

function normalizarImagemReferenciaInstancia(
  valor
) {
  if (
    typeof valor ===
    "string"
  ) {
    const url =
      texto(valor);

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
      valor
    );

  const url =
    texto(
      origem.url
    );

  return {
    ...clonar(
      origem
    ),

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


export function resolverCamadasImagemHabilidade(
  habilidade = {}
) {
  const imagemLegada =
    texto(
      habilidade?.imagem
    );


  const base =
    objetoSeguro(
      habilidade
        ?.origemBibliotecaBase
    );


  const imagemBase =
    texto(
      base.imagem
    );


  let imagemFicha =
    texto(
      habilidade
        ?.imagemFicha
    );


  let imagemCampanha =
    texto(
      habilidade
        ?.imagemCampanha ||
      habilidade
        ?.apresentacaoCampanha
        ?.imagemUrl
    );


  let imagemReferencia =
    normalizarImagemReferenciaInstancia(
      habilidade
        ?.imagemReferencia
    );


  /*
    Compatibilidade com instâncias antigas.

    Se a ficha já possui uma base histórica
    e "imagem" ficou diferente dessa base,
    tratamos a imagem atual como uma
    personalização da ficha.
  */

  if (
    !imagemFicha &&
    imagemBase &&
    imagemLegada &&
    imagemLegada !==
      imagemBase
  ) {
    imagemFicha =
      imagemLegada;
  }


  /*
    Compatibilidade com o registro atual da
    Biblioteca.

    A Biblioteca antiga entregava:

      imagem =
        imagem da campanha
        OU
        imagem de referência

    Se existe imagemReferencia e "imagem"
    é diferente dela, podemos reconhecer
    que o valor efetivo veio da campanha.
  */

  if (
    !imagemCampanha &&
    !imagemFicha &&
    imagemReferencia.url &&
    imagemLegada &&
    imagemLegada !==
      imagemReferencia.url
  ) {
    imagemCampanha =
      imagemLegada;
  }


  /*
    Compatibilidade com registros antigos
    que possuem somente "imagem".

    Sem qualquer camada explícita, a imagem
    antiga continua funcionando como
    referência visual.
  */

  if (
    !imagemReferencia.url &&
    !imagemCampanha &&
    !imagemFicha &&
    imagemLegada
  ) {
    imagemReferencia =
      normalizarImagemReferenciaInstancia(
        imagemLegada
      );
  }


  const url =
    imagemFicha ||
    imagemCampanha ||
    imagemReferencia.url ||
    imagemLegada ||
    "";


  let origem =
    "nenhuma";


  if (imagemFicha) {
    origem =
      "ficha";

  } else if (
    imagemCampanha
  ) {
    origem =
      "campanha";

  } else if (
    imagemReferencia.url
  ) {
    origem =
      "referencia";

  } else if (
    imagemLegada
  ) {
    origem =
      "legado";
  }


  return {
    url,
    origem,

    ficha:
      imagemFicha,

    campanha:
      imagemCampanha,

    referencia:
      imagemReferencia
  };
}


export function obterImagemEfetivaHabilidade(
  habilidade
) {
  return resolverCamadasImagemHabilidade(
    habilidade
  ).url;
}


export function definirImagemFichaHabilidade(
  habilidade,
  novaImagem
) {
  if (!habilidade) {
    return habilidade;
  }


  const imagemFicha =
    texto(
      novaImagem
    );


  const camadasAtuais =
    resolverCamadasImagemHabilidade(
      habilidade
    );


  const base =
    objetoSeguro(
      habilidade
        ?.origemBibliotecaBase
    );


  const fallback =
    camadasAtuais.campanha ||
    camadasAtuais
      .referencia
      .url ||
    texto(
      base.imagem
    ) ||
    "";


  return {
    ...habilidade,

    imagemFicha,

    imagem:
      imagemFicha ||
      fallback
  };
}


export function removerImagemFichaHabilidade(
  habilidade
) {
  return definirImagemFichaHabilidade(
    habilidade,
    ""
  );
}


/* ========================================
   COMPARAÇÃO ESTÁVEL
======================================== */

function normalizarComparavel(valor) {
  if (valorVazio(valor)) {
    return null;
  }

  if (Array.isArray(valor)) {
    return valor.map(
      normalizarComparavel
    );
  }

  if (
    valor &&
    typeof valor === "object"
  ) {
    return Object.keys(valor)
      .sort()
      .reduce(
        (resultado, chave) => {
          const normalizado =
            normalizarComparavel(
              valor[chave]
            );

          if (
            normalizado !== null
          ) {
            resultado[chave] =
              normalizado;
          }

          return resultado;
        },
        {}
      );
  }

  return valor;
}


function valoresEquivalentes(
  a,
  b
) {
  return (
    JSON.stringify(
      normalizarComparavel(a)
    ) ===
    JSON.stringify(
      normalizarComparavel(b)
    )
  );
}


/* ========================================
   REQUISITOS NARRATIVOS

   O texto/definição pode vir do Banco.
   O campo "cumprido" pertence à ficha.
======================================== */

function definicoesNarrativas(
  requisitos
) {
  return listaSegura(requisitos)
    .map((requisito, indice) => {
      if (
        typeof requisito === "string"
      ) {
        const descricao =
          requisito.trim();

        if (!descricao) {
          return null;
        }

        return {
          id:
            `texto-${indice}`,

          texto:
            descricao
        };
      }

      if (
        !requisito ||
        typeof requisito !== "object"
      ) {
        return null;
      }

      const descricao =
        texto(
          requisito.texto ||
          requisito.descricao ||
          requisito.nome
        );

      if (!descricao) {
        return null;
      }

      return {
        id:
          requisito.id ||
          `texto-${indice}`,

        texto:
          descricao
      };
    })
    .filter(Boolean);
}


function definicoesNarrativasEquivalentes(
  a,
  b
) {
  return valoresEquivalentes(
    definicoesNarrativas(a),
    definicoesNarrativas(b)
  );
}


function fundirNarrativosComProgresso(
  novos,
  atuais
) {
  const atuaisNormalizados =
    listaSegura(atuais);

  return listaSegura(novos)
    .map((requisito, indice) => {
      const objeto =
        typeof requisito === "string"
          ? {
              id:
                `texto-${indice}`,

              texto:
                requisito
            }
          : {
              ...(requisito || {})
            };

      const textoNovo =
        texto(
          objeto.texto ||
          objeto.descricao ||
          objeto.nome
        );

      const idNovo =
        objeto.id ||
        null;

      const correspondente =
        atuaisNormalizados.find(
          atual => {
            if (
              !atual ||
              typeof atual !== "object"
            ) {
              return false;
            }

            if (
              idNovo &&
              atual.id === idNovo
            ) {
              return true;
            }

            return (
              texto(
                atual.texto ||
                atual.descricao ||
                atual.nome
              ) ===
              textoNovo
            );
          }
        );

      return {
        ...objeto,

        texto:
          textoNovo,

        cumprido:
          Boolean(
            correspondente
              ?.cumprido
          )
      };
    })
    .filter(
      requisito =>
        requisito.texto
    );
}


/* ========================================
   VEIO DA BIBLIOTECA?
======================================== */

export function habilidadeVeioDaBiblioteca(
  habilidade,
  configuracaoHabilidades = {}
) {
  if (!habilidade) {
    return false;
  }

  const campos =
    obterCamposOrigem(
      configuracaoHabilidades
    );

  return Boolean(
    habilidade[
      campos.id
    ] ||
    habilidade
      .origemBibliotecaId
  );
}


/* ========================================
   BASE HISTÓRICA
======================================== */

export function criarBaseInstanciaHabilidade(
  habilidade,
  configuracaoHabilidades = {}
) {
  const campoCusto =
    obterCampoCustoPrincipal(
      configuracaoHabilidades
    );


  const camadasImagem =
    resolverCamadasImagemHabilidade(
      habilidade
    );


  return {
    modelo:
      MODELO_BASE_INSTANCIA_HABILIDADE,

    capturadaEm:
      new Date()
        .toISOString(),

    campoCustoPrincipal:
      campoCusto,

    nome:
      texto(
        habilidade?.nome
      ),

    nomes:
      clonar(
        habilidade?.nomes ||
        {}
      ),

    tipo:
      habilidade?.tipo ||
      "",

    categoria:
      habilidade?.categoria ||
      "",

    elemento:
      habilidade?.elemento ||
      "",

    grau:
      habilidade?.grau ||
      "",

    custoPrincipal:
      habilidade
        ?.[campoCusto] ??
      "",

    /*
      "imagem" é a imagem efetiva que servia
      como base naquele momento.

      As camadas também são preservadas para
      que saibamos de onde ela veio.
    */

    imagem:
      camadasImagem.url,

    imagemReferencia:
      clonar(
        camadasImagem.referencia
      ),

    imagemCampanha:
      camadasImagem.campanha,

    descricao:
      habilidade?.descricao ||
      "",

    parametros:
      clonar(
        habilidade
          ?.parametros ||
        {}
      ),

    custos:
      clonar(
        habilidade
          ?.custos ||
        {}
      ),

    requisitosAtributos:
      clonar(
        habilidade
          ?.requisitosAtributos ||
        {}
      ),

    requisitosNarrativos:
      clonar(
        habilidade
          ?.requisitosNarrativos ||
        []
      )
  };
}


function dadosAssinaturaReferencia(
  habilidade,
  configuracaoHabilidades = {}
) {
  const campoCusto =
    obterCampoCustoPrincipal(
      configuracaoHabilidades
    );


  const camadasImagem =
    resolverCamadasImagemHabilidade(
      habilidade
    );


  return {
    nome:
      texto(
        habilidade?.nome
      ),

    nomes:
      clonar(
        habilidade?.nomes ||
        {}
      ),

    tipo:
      habilidade?.tipo ||
      "",

    categoria:
      habilidade?.categoria ||
      "",

    elemento:
      habilidade?.elemento ||
      "",

    grau:
      habilidade?.grau ||
      "",

    custoPrincipal:
      habilidade
        ?.[campoCusto] ??
      "",

    imagem:
      camadasImagem.url,

    imagemReferencia:
      clonar(
        camadasImagem.referencia
      ),

    imagemCampanha:
      camadasImagem.campanha,

    descricao:
      habilidade?.descricao ||
      "",

    parametros:
      clonar(
        habilidade
          ?.parametros ||
        {}
      ),

    custos:
      clonar(
        habilidade
          ?.custos ||
        {}
      ),

    requisitosAtributos:
      clonar(
        habilidade
          ?.requisitosAtributos ||
        {}
      ),

    requisitosNarrativos:
      definicoesNarrativas(
        habilidade
          ?.requisitosNarrativos ||
        []
      )
  };
}


export function criarAssinaturaReferenciaHabilidade(
  habilidade,
  configuracaoHabilidades = {}
) {
  if (!habilidade) {
    return "";
  }

  return JSON.stringify(
    normalizarComparavel(
      dadosAssinaturaReferencia(
        habilidade,
        configuracaoHabilidades
      )
    )
  );
}


/* ========================================
   CRIAR INSTÂNCIA DO BANCO
======================================== */

export function criarInstanciaHabilidadeDaBiblioteca({
  registro,
  configuracaoHabilidades = {},
  campanhaId = null,
  estadoInicial = "disponivel"
}) {
  if (!registro) {
    return null;
  }

  const campos =
    obterCamposOrigem(
      configuracaoHabilidades
    );

  const {
    id:
      templateId,

    versao:
      templateVersao,

    metadados,

    mecanicaCampanha,

    mecanicaHeranca,

    configuracaoCampanhaInfo,

    disponibilidadeBanco,

    ...conteudo
  } =
    registro;

  void mecanicaCampanha;
  void disponibilidadeBanco;


  const agora =
    new Date()
      .toISOString();


  const camadasImagem =
    resolverCamadasImagemHabilidade(
      registro
    );


  const snapshot =
    clonar(
      conteudo
    ) ||
    {};


  /*
    A instância nasce sem imagem própria
    da ficha.

    Ela começa usando:

      campanha
        ou
      referência do catálogo.

    A ficha poderá criar posteriormente
    sua camada própria sem alterar as
    outras duas.
  */

  snapshot.imagemReferencia =
    clonar(
      camadasImagem.referencia
    );

  snapshot.imagemCampanha =
    camadasImagem.campanha;

  snapshot.imagemFicha =
    "";

  snapshot.imagem =
    camadasImagem.url;


  snapshot.estado =
    estadoInicial;

  snapshot[
    campos.id
  ] =
    templateId;

  snapshot[
    campos.versao
  ] =
    templateVersao ??
    1;

  snapshot[
    campos.nome
  ] =
    registro.nome;

  snapshot.origemBibliotecaVersaoMecanica =
    configuracaoCampanhaInfo
      ?.versaoMecanica ??
    null;

  snapshot.origemBibliotecaFonteMecanica =
    mecanicaHeranca
      ?.temPersonalizacaoPublicada
      ? "personalizada"
      : "padrao-campanha";

  snapshot.origemCampanhaId =
    campanhaId ||
    null;

  snapshot.origemBibliotecaMetadados =
    clonar(
      metadados ||
      {}
    );

  snapshot.adquiridaDoBancoEm =
    agora;

  snapshot.origemBibliotecaBase =
    criarBaseInstanciaHabilidade(
      snapshot,
      configuracaoHabilidades
    );

  snapshot.instanciaHabilidade = {
    modelo:
      MODELO_INSTANCIA_HABILIDADE,

    origem:
      "biblioteca",

    criadaEm:
      agora,

    baseReconstruida:
      false,

    atualizacaoIgnorada:
      null,

    atualizacoesBanco:
      []
  };

  return snapshot;
}


/* ========================================
   OBTER BASE
======================================== */

export function obterBaseInstanciaHabilidade(
  habilidade
) {
  const base =
    habilidade
      ?.origemBibliotecaBase;

  if (
    !base ||
    typeof base !== "object" ||
    Array.isArray(base)
  ) {
    return null;
  }

  return base;
}


/* ========================================
   MIGRAÇÃO CONSERVADORA
======================================== */

export function garantirBaseInstanciaHabilidade(
  habilidade,
  configuracaoHabilidades = {}
) {
  if (
    !habilidadeVeioDaBiblioteca(
      habilidade,
      configuracaoHabilidades
    )
  ) {
    return habilidade;
  }

  if (
    obterBaseInstanciaHabilidade(
      habilidade
    )
  ) {
    return habilidade;
  }

  const agora =
    new Date()
      .toISOString();

  return {
    ...habilidade,

    origemBibliotecaBase:
      criarBaseInstanciaHabilidade(
        habilidade,
        configuracaoHabilidades
      ),

    instanciaHabilidade: {
      ...objetoSeguro(
        habilidade
          ?.instanciaHabilidade
      ),

      modelo:
        MODELO_INSTANCIA_HABILIDADE,

      origem:
        "biblioteca",

      migradaEm:
        agora,

      baseReconstruida:
        true,

      atualizacaoIgnorada:
        habilidade
          ?.instanciaHabilidade
          ?.atualizacaoIgnorada ||
        null,

      atualizacoesBanco:
        listaSegura(
          habilidade
            ?.instanciaHabilidade
            ?.atualizacoesBanco
        )
    }
  };
}


/* ========================================
   PERSONALIZAÇÕES DO PERSONAGEM
======================================== */

export function compararInstanciaComBase(
  habilidade,
  configuracaoHabilidades = {}
) {
  const base =
    obterBaseInstanciaHabilidade(
      habilidade
    );

  if (!base) {
    return {
      possuiBase:
        false,

      temAlteracoes:
        false,

      quantidade:
        0,

      alteracoes:
        []
    };
  }

  const campoCusto =
    base.campoCustoPrincipal ||
    obterCampoCustoPrincipal(
      configuracaoHabilidades
    );

  const alteracoes = [];


  function compararCampo(
    chave,
    rotulo,
    valorBase,
    valorAtual,
    grupo = "geral"
  ) {
    if (
      valoresEquivalentes(
        valorBase,
        valorAtual
      )
    ) {
      return;
    }

    alteracoes.push({
      grupo,
      chave,
      rotulo,

      base:
        clonar(
          valorBase
        ),

      atual:
        clonar(
          valorAtual
        )
    });
  }


  compararCampo(
    "nome",
    "Nome",
    base.nome,
    habilidade?.nome,
    "apresentacao"
  );

  compararCampo(
    "imagem",
    "Imagem",
    base.imagem,
    habilidade?.imagem,
    "apresentacao"
  );

  compararCampo(
    "tipo",
    "Tipo",
    base.tipo,
    habilidade?.tipo
  );

  compararCampo(
    "categoria",
    "Categoria",
    base.categoria,
    habilidade?.categoria
  );

  compararCampo(
    "elemento",
    "Elemento",
    base.elemento,
    habilidade?.elemento
  );

  compararCampo(
    "grau",
    "Grau / estágio",
    base.grau,
    habilidade?.grau,
    "mecanica"
  );

  compararCampo(
    campoCusto,

    configuracaoHabilidades
      ?.custoPrincipal
      ?.nome ||
      "Custo",

    base.custoPrincipal,

    habilidade
      ?.[campoCusto],

    "mecanica"
  );

  compararCampo(
    "descricao",
    "Descrição",
    base.descricao,
    habilidade?.descricao,
    "apresentacao"
  );


  const parametrosBase =
    objetoSeguro(
      base.parametros
    );

  const parametrosAtuais =
    objetoSeguro(
      habilidade
        ?.parametros
    );

  const chavesParametros =
    new Set([
      ...Object.keys(
        parametrosBase
      ),

      ...Object.keys(
        parametrosAtuais
      )
    ]);

  chavesParametros.forEach(
    chave => {
      compararCampo(
        chave,
        chave,

        parametrosBase[
          chave
        ],

        parametrosAtuais[
          chave
        ],

        "parametros"
      );
    }
  );


  const custosBase =
    objetoSeguro(
      base.custos
    );

  const custosAtuais =
    objetoSeguro(
      habilidade?.custos
    );

  const chavesCustos =
    new Set([
      ...Object.keys(
        custosBase
      ),

      ...Object.keys(
        custosAtuais
      )
    ]);

  chavesCustos.forEach(
    chave => {
      compararCampo(
        chave,
        chave,

        custosBase[
          chave
        ],

        custosAtuais[
          chave
        ],

        "custos"
      );
    }
  );


  return {
    possuiBase:
      true,

    temAlteracoes:
      alteracoes.length >
      0,

    quantidade:
      alteracoes.length,

    alteracoes
  };
}


/* ========================================
   RESTAURAR UM CAMPO DA BASE
======================================== */

export function restaurarAlteracaoInstanciaDaBase({
  habilidade,
  alteracao,
  configuracaoHabilidades = {}
}) {
  const base =
    obterBaseInstanciaHabilidade(
      habilidade
    );

  if (
    !base ||
    !alteracao
  ) {
    return habilidade;
  }

  const resultado = {
    ...habilidade
  };


  if (
    alteracao.grupo ===
    "parametros"
  ) {
    const parametros = {
      ...objetoSeguro(
        habilidade
          ?.parametros
      )
    };

    const atributos = {
      ...objetoSeguro(
        habilidade
          ?.atributos
      )
    };

    if (
      valorVazio(
        alteracao.base
      )
    ) {
      delete parametros[
        alteracao.chave
      ];

      delete atributos[
        alteracao.chave
      ];

    } else {
      parametros[
        alteracao.chave
      ] =
        clonar(
          alteracao.base
        );

      atributos[
        alteracao.chave
      ] =
        clonar(
          alteracao.base
        );
    }

    resultado.parametros =
      parametros;

    resultado.atributos =
      atributos;

    return resultado;
  }


  if (
    alteracao.grupo ===
    "custos"
  ) {
    const custos = {
      ...objetoSeguro(
        habilidade?.custos
      )
    };

    if (
      valorVazio(
        alteracao.base
      )
    ) {
      delete custos[
        alteracao.chave
      ];

    } else {
      custos[
        alteracao.chave
      ] =
        clonar(
          alteracao.base
        );
    }

    resultado.custos =
      custos;

    if (
      alteracao.chave ===
      "condicao"
    ) {
      resultado.condicoes =
        valorVazio(
          alteracao.base
        )
          ? ""
          : String(
              alteracao.base
            );
    }

    return resultado;
  }


  /*
    Restaurar a imagem remove somente a
    personalização da ficha.

    As camadas da base voltam a ser usadas.
  */

  if (
    alteracao.chave ===
    "imagem"
  ) {
    resultado.imagemFicha =
      "";

    resultado.imagem =
      valorVazio(
        base.imagem
      )
        ? ""
        : clonar(
            base.imagem
          );

    if (
      base.imagemReferencia !==
      undefined
    ) {
      resultado.imagemReferencia =
        clonar(
          base.imagemReferencia
        );
    }

    if (
      base.imagemCampanha !==
      undefined
    ) {
      resultado.imagemCampanha =
        clonar(
          base.imagemCampanha
        );
    }

    return resultado;
  }


  const campoCusto =
    base.campoCustoPrincipal ||
    obterCampoCustoPrincipal(
      configuracaoHabilidades
    );

  if (
    alteracao.chave ===
    campoCusto
  ) {
    resultado[
      campoCusto
    ] =
      valorVazio(
        alteracao.base
      )
        ? ""
        : clonar(
            alteracao.base
          );

    return resultado;
  }


  resultado[
    alteracao.chave
  ] =
    valorVazio(
      alteracao.base
    )
      ? ""
      : clonar(
          alteracao.base
        );


  if (
    alteracao.chave ===
    "descricao"
  ) {
    resultado.funcao =
      resultado.descricao;
  }

  if (
    alteracao.chave ===
    "grau"
  ) {
    resultado.estagio =
      resultado.grau;
  }

  return resultado;
}


/* ========================================
   BANCO ATUAL × BASE DA FICHA
======================================== */

export function compararBaseInstanciaComReferenciaAtual(
  habilidade,
  referenciaAtual,
  configuracaoHabilidades = {}
) {
  const baseAntiga =
    obterBaseInstanciaHabilidade(
      habilidade
    );

  if (
    !baseAntiga ||
    !referenciaAtual
  ) {
    return {
      possuiBase:
        Boolean(
          baseAntiga
        ),

      possuiReferenciaAtual:
        Boolean(
          referenciaAtual
        ),

      temAlteracoes:
        false,

      quantidade:
        0,

      alteracoes:
        []
    };
  }

  const baseNova =
    criarBaseInstanciaHabilidade(
      referenciaAtual,
      configuracaoHabilidades
    );

  const alteracoes = [];


  function registrar(
    chave,
    rotulo,
    anterior,
    atual,
    grupo = "geral"
  ) {
    if (
      valoresEquivalentes(
        anterior,
        atual
      )
    ) {
      return;
    }

    alteracoes.push({
      grupo,
      chave,
      rotulo,

      base:
        clonar(
          anterior
        ),

      atual:
        clonar(
          atual
        )
    });
  }


  registrar(
    "nome",
    "Nome",
    baseAntiga.nome,
    baseNova.nome,
    "apresentacao"
  );

  registrar(
    "nomes",
    "Nomes / localização",
    baseAntiga.nomes,
    baseNova.nomes,
    "referencia"
  );

  /*
    Para o usuário, uma alteração visual
    continua aparecendo como uma única
    mudança de "Imagem".

    As camadas internas são preservadas na
    base, mas não criamos três avisos para
    uma única troca visual.
  */

  registrar(
    "imagem",
    "Imagem",
    baseAntiga.imagem,
    baseNova.imagem,
    "apresentacao"
  );

  registrar(
    "tipo",
    "Tipo",
    baseAntiga.tipo,
    baseNova.tipo
  );

  registrar(
    "categoria",
    "Categoria",
    baseAntiga.categoria,
    baseNova.categoria
  );

  registrar(
    "elemento",
    "Elemento",
    baseAntiga.elemento,
    baseNova.elemento
  );

  registrar(
    "grau",
    "Grau / estágio",
    baseAntiga.grau,
    baseNova.grau,
    "mecanica"
  );

  registrar(
    obterCampoCustoPrincipal(
      configuracaoHabilidades
    ),

    configuracaoHabilidades
      ?.custoPrincipal
      ?.nome ||
      "Custo",

    baseAntiga
      .custoPrincipal,

    baseNova
      .custoPrincipal,

    "mecanica"
  );

  registrar(
    "descricao",
    "Descrição",
    baseAntiga.descricao,
    baseNova.descricao,
    "apresentacao"
  );


  const parametrosAntigos =
    objetoSeguro(
      baseAntiga.parametros
    );

  const parametrosNovos =
    objetoSeguro(
      baseNova.parametros
    );

  const chavesParametros =
    new Set([
      ...Object.keys(
        parametrosAntigos
      ),
      ...Object.keys(
        parametrosNovos
      )
    ]);

  chavesParametros.forEach(
    chave => {
      registrar(
        chave,
        chave,

        parametrosAntigos[
          chave
        ],

        parametrosNovos[
          chave
        ],

        "parametros"
      );
    }
  );


  const custosAntigos =
    objetoSeguro(
      baseAntiga.custos
    );

  const custosNovos =
    objetoSeguro(
      baseNova.custos
    );

  const chavesCustos =
    new Set([
      ...Object.keys(
        custosAntigos
      ),
      ...Object.keys(
        custosNovos
      )
    ]);

  chavesCustos.forEach(
    chave => {
      registrar(
        chave,
        chave,

        custosAntigos[
          chave
        ],

        custosNovos[
          chave
        ],

        "custos"
      );
    }
  );


  registrar(
    "requisitosAtributos",
    "Requisitos de atributos",

    baseAntiga
      .requisitosAtributos,

    baseNova
      .requisitosAtributos,

    "requisitos"
  );


  if (
    !definicoesNarrativasEquivalentes(
      baseAntiga
        .requisitosNarrativos,

      baseNova
        .requisitosNarrativos
    )
  ) {
    alteracoes.push({
      grupo:
        "requisitos",

      chave:
        "requisitosNarrativos",

      rotulo:
        "Requisitos narrativos",

      base:
        clonar(
          definicoesNarrativas(
            baseAntiga
              .requisitosNarrativos
          )
        ),

      atual:
        clonar(
          definicoesNarrativas(
            baseNova
              .requisitosNarrativos
          )
        )
    });
  }


  return {
    possuiBase:
      true,

    possuiReferenciaAtual:
      true,

    temAlteracoes:
      alteracoes.length >
      0,

    quantidade:
      alteracoes.length,

    alteracoes,

    baseAntiga,
    baseNova
  };
}


/* ========================================
   IGNORAR / RECONSIDERAR UMA ATUALIZAÇÃO

   Ignorar NÃO muda a base e NÃO muda a
   habilidade. Apenas registra que aquela
   referência específica foi vista e que a
   pessoa decidiu manter a versão da ficha.

   Se o Banco mudar novamente, a assinatura
   muda e o aviso reaparece automaticamente.
======================================== */

export function atualizacaoReferenciaEstaIgnorada(
  habilidade,
  referenciaAtual,
  configuracaoHabilidades = {}
) {
  if (
    !habilidade ||
    !referenciaAtual
  ) {
    return false;
  }

  const ignorada =
    habilidade
      ?.instanciaHabilidade
      ?.atualizacaoIgnorada;

  if (
    !ignorada ||
    !ignorada.assinatura
  ) {
    return false;
  }

  const assinaturaAtual =
    criarAssinaturaReferenciaHabilidade(
      referenciaAtual,
      configuracaoHabilidades
    );

  return (
    assinaturaAtual &&
    assinaturaAtual ===
      ignorada.assinatura
  );
}


export function marcarAtualizacaoReferenciaComoIgnorada({
  habilidade,
  referenciaAtual,
  configuracaoHabilidades = {},
  versaoMecanicaAtual = null
}) {
  if (
    !habilidade ||
    !referenciaAtual
  ) {
    return habilidade;
  }

  const comBase =
    garantirBaseInstanciaHabilidade(
      habilidade,
      configuracaoHabilidades
    );

  const assinatura =
    criarAssinaturaReferenciaHabilidade(
      referenciaAtual,
      configuracaoHabilidades
    );

  return {
    ...comBase,

    instanciaHabilidade: {
      ...objetoSeguro(
        comBase
          .instanciaHabilidade
      ),

      atualizacaoIgnorada: {
        assinatura,

        versaoMecanica:
          versaoMecanicaAtual ??
          null,

        ignoradaEm:
          new Date()
            .toISOString()
      }
    }
  };
}


export function reabrirAtualizacaoReferenciaIgnorada(
  habilidade
) {
  if (!habilidade) {
    return habilidade;
  }

  return {
    ...habilidade,

    instanciaHabilidade: {
      ...objetoSeguro(
        habilidade
          .instanciaHabilidade
      ),

      atualizacaoIgnorada:
        null
    }
  };
}


export function obterHistoricoAtualizacoesBanco(
  habilidade
) {
  return listaSegura(
    habilidade
      ?.instanciaHabilidade
      ?.atualizacoesBanco
  );
}


/* ========================================
   ATUALIZAÇÃO SEGURA DE TRÊS VIAS

   BASE ANTIGA
      ↓
   PERSONAGEM

   comparado com

   BANCO NOVO

   Campo não personalizado acompanha o
   Banco. Campo personalizado permanece.
======================================== */

export function aplicarAtualizacaoReferenciaInstancia({
  habilidade,
  referenciaAtual,
  configuracaoHabilidades = {},

  versaoMecanicaAtual = null,
  fonteMecanicaAtual = "padrao-campanha",

  versaoTemplateAtual = null,
  nomeTemplateAtual = null,
  metadadosAtuais = null
}) {
  if (
    !habilidade ||
    !referenciaAtual
  ) {
    return habilidade;
  }

  const comBase =
    garantirBaseInstanciaHabilidade(
      habilidade,
      configuracaoHabilidades
    );

  const baseAntiga =
    obterBaseInstanciaHabilidade(
      comBase
    );

  if (!baseAntiga) {
    return comBase;
  }

  const baseNova =
    criarBaseInstanciaHabilidade(
      referenciaAtual,
      configuracaoHabilidades
    );

  const resultado = {
    ...comBase
  };


  function aplicarCampoSimples(
    chave,
    valorBaseAntiga,
    valorBaseNova
  ) {
    const valorPersonagem =
      comBase[
        chave
      ];

    const foiPersonalizado =
      !valoresEquivalentes(
        valorPersonagem,
        valorBaseAntiga
      );

    if (
      !foiPersonalizado
    ) {
      resultado[
        chave
      ] =
        valorVazio(
          valorBaseNova
        )
          ? ""
          : clonar(
              valorBaseNova
            );
    }
  }


  aplicarCampoSimples(
    "nome",
    baseAntiga.nome,
    baseNova.nome
  );


  /*
    IMAGEM

    Não usamos aplicarCampoSimples aqui
    porque agora a imagem possui camadas.

    imagemFicha é preservada.

    imagemCampanha e imagemReferencia
    acompanham a nova referência.

    Se a ficha nunca personalizou a imagem,
    o valor efetivo acompanha automaticamente
    o Banco.
  */

  const camadasImagemReferenciaAtual =
    resolverCamadasImagemHabilidade(
      referenciaAtual
    );


  const imagemPersonagem =
    texto(
      comBase.imagem
    );


  const imagemFichaExplicita =
    texto(
      comBase.imagemFicha
    );


  const imagemFoiPersonalizada =
    Boolean(
      imagemFichaExplicita
    ) ||
    !valoresEquivalentes(
      imagemPersonagem,
      baseAntiga.imagem
    );


  resultado.imagemReferencia =
    clonar(
      camadasImagemReferenciaAtual
        .referencia
    );


  resultado.imagemCampanha =
    camadasImagemReferenciaAtual
      .campanha;


  if (
    imagemFoiPersonalizada
  ) {
    const personalizada =
      imagemFichaExplicita ||
      imagemPersonagem;

    resultado.imagemFicha =
      personalizada;

    resultado.imagem =
      personalizada;

  } else {
    resultado.imagemFicha =
      "";

    resultado.imagem =
      camadasImagemReferenciaAtual
        .url;
  }


  aplicarCampoSimples(
    "tipo",
    baseAntiga.tipo,
    baseNova.tipo
  );

  aplicarCampoSimples(
    "categoria",
    baseAntiga.categoria,
    baseNova.categoria
  );

  aplicarCampoSimples(
    "elemento",
    baseAntiga.elemento,
    baseNova.elemento
  );

  aplicarCampoSimples(
    "grau",
    baseAntiga.grau,
    baseNova.grau
  );

  aplicarCampoSimples(
    "descricao",
    baseAntiga.descricao,
    baseNova.descricao
  );


  resultado.estagio =
    resultado.grau ||
    "";

  resultado.funcao =
    resultado.descricao ||
    "";


  /* ======================================
     CUSTO PRINCIPAL
  ====================================== */

  const campoCusto =
    baseAntiga
      .campoCustoPrincipal ||
    obterCampoCustoPrincipal(
      configuracaoHabilidades
    );

  const custoPersonagem =
    comBase[
      campoCusto
    ];

  if (
    valoresEquivalentes(
      custoPersonagem,
      baseAntiga
        .custoPrincipal
    )
  ) {
    resultado[
      campoCusto
    ] =
      valorVazio(
        baseNova
          .custoPrincipal
      )
        ? ""
        : clonar(
            baseNova
              .custoPrincipal
          );
  }


  /* ======================================
     PARÂMETROS
  ====================================== */

  const parametrosAntigos =
    objetoSeguro(
      baseAntiga.parametros
    );

  const parametrosNovos =
    objetoSeguro(
      baseNova.parametros
    );

  const parametrosPersonagem =
    objetoSeguro(
      comBase.parametros
    );

  const parametrosResultado = {
    ...parametrosPersonagem
  };

  const chavesParametros =
    new Set([
      ...Object.keys(
        parametrosAntigos
      ),
      ...Object.keys(
        parametrosNovos
      ),
      ...Object.keys(
        parametrosPersonagem
      )
    ]);

  chavesParametros.forEach(
    chave => {
      const personalizado =
        !valoresEquivalentes(
          parametrosPersonagem[
            chave
          ],

          parametrosAntigos[
            chave
          ]
        );

      if (personalizado) {
        return;
      }

      if (
        valorVazio(
          parametrosNovos[
            chave
          ]
        )
      ) {
        delete parametrosResultado[
          chave
        ];

      } else {
        parametrosResultado[
          chave
        ] =
          clonar(
            parametrosNovos[
              chave
            ]
          );
      }
    }
  );

  resultado.parametros =
    parametrosResultado;

  resultado.atributos = {
    ...parametrosResultado
  };


  /* ======================================
     CUSTOS ADICIONAIS
  ====================================== */

  const custosAntigos =
    objetoSeguro(
      baseAntiga.custos
    );

  const custosNovos =
    objetoSeguro(
      baseNova.custos
    );

  const custosPersonagem =
    objetoSeguro(
      comBase.custos
    );

  const custosResultado = {
    ...custosPersonagem
  };

  const chavesCustos =
    new Set([
      ...Object.keys(
        custosAntigos
      ),
      ...Object.keys(
        custosNovos
      ),
      ...Object.keys(
        custosPersonagem
      )
    ]);

  chavesCustos.forEach(
    chave => {
      const personalizado =
        !valoresEquivalentes(
          custosPersonagem[
            chave
          ],

          custosAntigos[
            chave
          ]
        );

      if (personalizado) {
        return;
      }

      if (
        valorVazio(
          custosNovos[
            chave
          ]
        )
      ) {
        delete custosResultado[
          chave
        ];

      } else {
        custosResultado[
          chave
        ] =
          clonar(
            custosNovos[
              chave
            ]
          );
      }
    }
  );

  resultado.custos =
    custosResultado;

  resultado.condicoes =
    texto(
      custosResultado.condicao ||
      resultado.condicoes
    );


  /* ======================================
     REQUISITOS AUTOMÁTICOS
  ====================================== */

  if (
    valoresEquivalentes(
      comBase
        .requisitosAtributos,

      baseAntiga
        .requisitosAtributos
    )
  ) {
    resultado.requisitosAtributos =
      clonar(
        baseNova
          .requisitosAtributos
      ) ||
      {};
  }


  /* ======================================
     REQUISITOS NARRATIVOS

     Definição pode atualizar.
     Check do personagem é preservado.
  ====================================== */

  if (
    definicoesNarrativasEquivalentes(
      comBase
        .requisitosNarrativos,

      baseAntiga
        .requisitosNarrativos
    )
  ) {
    resultado.requisitosNarrativos =
      fundirNarrativosComProgresso(
        baseNova
          .requisitosNarrativos,

        comBase
          .requisitosNarrativos
      );
  }


  /* ======================================
     REFERÊNCIA / LOCALIZAÇÃO
  ====================================== */

  resultado.nomes =
    clonar(
      referenciaAtual
        ?.nomes ||
      resultado.nomes ||
      {}
    );


  /* ======================================
     HISTÓRICO E NOVA BASE
  ====================================== */

  const comparacao =
    compararBaseInstanciaComReferenciaAtual(
      comBase,
      referenciaAtual,
      configuracaoHabilidades
    );

  const assinaturaAnterior =
    JSON.stringify(
      normalizarComparavel(
        {
          ...baseAntiga,
          capturadaEm:
            undefined,
          modelo:
            undefined
        }
      )
    );

  const assinaturaNova =
    criarAssinaturaReferenciaHabilidade(
      referenciaAtual,
      configuracaoHabilidades
    );

  resultado.origemBibliotecaBaseInicial =
    resultado
      .origemBibliotecaBaseInicial ||
    clonar(
      baseAntiga
    );

  resultado.origemBibliotecaBase =
    baseNova;

  resultado.origemBibliotecaVersaoMecanica =
    versaoMecanicaAtual ??
    null;

  resultado.origemBibliotecaFonteMecanica =
    fonteMecanicaAtual ||
    "padrao-campanha";

  const camposOrigem =
    obterCamposOrigem(
      configuracaoHabilidades
    );

  if (
    versaoTemplateAtual !== null &&
    versaoTemplateAtual !== undefined
  ) {
    resultado[
      camposOrigem.versao
    ] =
      versaoTemplateAtual;
  }

  if (
    nomeTemplateAtual
  ) {
    resultado[
      camposOrigem.nome
    ] =
      nomeTemplateAtual;
  }

  if (
    metadadosAtuais
  ) {
    resultado.origemBibliotecaMetadados =
      clonar(
        metadadosAtuais
      );
  }

  const instanciaAnterior =
    objetoSeguro(
      resultado
        .instanciaHabilidade
    );

  const historicoAnterior =
    listaSegura(
      instanciaAnterior
        .atualizacoesBanco
    );

  const agora =
    new Date()
      .toISOString();

  resultado.instanciaHabilidade = {
    ...instanciaAnterior,

    modelo:
      MODELO_INSTANCIA_HABILIDADE,

    origem:
      "biblioteca",

    atualizadaDoBancoEm:
      agora,

    atualizacaoIgnorada:
      null,

    atualizacoesBanco: [
      ...historicoAnterior,

      {
        atualizadaEm:
          agora,

        deVersaoMecanica:
          comBase
            .origemBibliotecaVersaoMecanica ??
          null,

        paraVersaoMecanica:
          versaoMecanicaAtual ??
          null,

        assinaturaAnterior,
        assinaturaNova,

        quantidadeAlteracoes:
          comparacao
            .quantidade,

        campos:
          comparacao
            .alteracoes
            .map(
              alteracao => ({
                grupo:
                  alteracao.grupo,

                chave:
                  alteracao.chave,

                rotulo:
                  alteracao.rotulo
              })
            )
      }
    ]
  };

  /*
    Estado, progresso e evolução ficam
    exatamente como pertencem ao personagem.
  */

  return resultado;
}