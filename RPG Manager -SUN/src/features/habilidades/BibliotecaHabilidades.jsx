import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import "./BibliotecaHabilidades.css";

import EditorMecanicaBanco
  from "./EditorMecanicaBanco.jsx";

import {
  VisualizadorRequisitosTecnica,
  normalizarRequisitosNarrativos
} from "./RequisitosTecnica.jsx";

import {
  descobrirElegibilidadeSugerida
} from "./EstadoTecnica.jsx";

import {
  DISPONIBILIDADES_BANCO_HISSATSU,
  obterContextoBancoHissatsuLocal,
  carregarConfiguracoesBancoHissatsu,
  salvarRascunhoTemplateBancoHissatsu,
  descartarRascunhoTemplateBancoHissatsu,
  publicarTemplateBancoHissatsu,
  atualizarDisponibilidadeTemplateBancoHissatsu,
  atualizarApresentacaoTemplateBancoHissatsu,
  removerMecanicaPersonalizadaTemplateBancoHissatsu
} from "./data/bancoHissatsuCampanhaStore.js";

import {
  mecanicaHabilidadeEstaCompleta,
  resolverMecanicaHabilidade
} from "./mecanicaHabilidades.js";

import {
  criarInstanciaHabilidadeDaBiblioteca
} from "./instanciaHabilidade.js";


const ITENS_POR_PAGINA =
  50;


function criarItensPaginacao(
  paginaAtual,
  totalPaginas
) {
  if (
    totalPaginas <=
    7
  ) {
    return Array.from(
      {
        length:
          totalPaginas
      },
      (_, indice) =>
        indice + 1
    );
  }


  const paginas =
    new Set([
      1,
      totalPaginas,
      paginaAtual - 2,
      paginaAtual - 1,
      paginaAtual,
      paginaAtual + 1,
      paginaAtual + 2
    ]);


  if (
    paginaAtual <=
    4
  ) {
    paginas.add(2);
    paginas.add(3);
    paginas.add(4);
    paginas.add(5);
  }


  if (
    paginaAtual >=
    totalPaginas - 3
  ) {
    paginas.add(
      totalPaginas - 4
    );
    paginas.add(
      totalPaginas - 3
    );
    paginas.add(
      totalPaginas - 2
    );
    paginas.add(
      totalPaginas - 1
    );
  }


  const ordenadas =
    [...paginas]
      .filter(
        pagina =>
          pagina >= 1 &&
          pagina <=
            totalPaginas
      )
      .sort(
        (a, b) =>
          a - b
      );


  const itens =
    [];


  ordenadas.forEach(
    (pagina, indice) => {
      const anterior =
        ordenadas[
          indice - 1
        ];


      if (
        indice > 0 &&
        pagina -
          anterior >
          1
      ) {
        itens.push(
          `reticencias-${anterior}-${pagina}`
        );
      }


      itens.push(
        pagina
      );
    }
  );


  return itens;
}


/* ========================================
   UTILIDADES
======================================== */

function normalizarTexto(
  valor
) {
  return String(
    valor || ""
  )
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLocaleLowerCase(
      "pt-BR"
    );
}


function textoLimpo(
  valor
) {
  return String(
    valor ?? ""
  ).trim();
}


function normalizarListaTextos(
  valor
) {
  if (
    !Array.isArray(
      valor
    )
  ) {
    return [];
  }

  return valor
    .map(
      item => {
        if (
          typeof item ===
          "string"
        ) {
          return textoLimpo(
            item
          );
        }

        if (
          !item ||
          typeof item !==
            "object"
        ) {
          return "";
        }

        return textoLimpo(
          item.nome ||
          item.valor ||
          item.alias ||
          item.texto ||
          ""
        );
      }
    )
    .filter(Boolean);
}


function formatarIdentificador(
  valor
) {
  const texto =
    textoLimpo(
      valor
    );

  if (!texto) {
    return "";
  }

  return texto
    .split(
      /[-_\s]+/
    )
    .filter(Boolean)
    .map(
      parte =>
        parte.length <=
        3
          ? parte.toUpperCase()
          : (
              parte
                .charAt(0)
                .toUpperCase() +
              parte.slice(1)
            )
    )
    .join(" ");
}


/* ========================================
   NOMES
======================================== */

function obterNomesRegistro(
  registro,
  configuracaoHabilidades
) {
  const nomes =
    registro?.nomes &&
    typeof registro.nomes ===
      "object" &&
    !Array.isArray(
      registro.nomes
    )
      ? registro.nomes
      : {};

  const idiomaPrincipal =
    configuracaoHabilidades
      ?.localizacao
      ?.idiomaPrincipal ||
    "ptBR";


  /*
    IMPORTANTE:

    PT-BR somente existe quando foi
    explicitamente catalogado como PT-BR.

    registro.nome continua aceito como
    compatibilidade com registros antigos,
    mas nunca será tratado automaticamente
    como tradução brasileira.
  */

  const ptBR =
    textoLimpo(
      nomes.ptBR
    );

  const original =
    textoLimpo(
      nomes.original ||
      registro?.nomeOriginal ||
      registro?.nome ||
      ""
    );

  const japonesRomanizado =
    textoLimpo(
      nomes.japonesRomanizado ||
      nomes.romanizado ||
      registro?.japonesRomanizado ||
      registro?.romanizado ||
      ""
    );


  const alternativos =
    [
      ...new Set(
        [
          ...normalizarListaTextos(
            nomes.alternativos
          ),

          ...normalizarListaTextos(
            nomes.aliases
          ),

          ...normalizarListaTextos(
            registro?.aliases
          ),

          ...normalizarListaTextos(
            registro
              ?.metadados
              ?.aliases
          ),

          ...normalizarListaTextos(
            registro
              ?.metadados
              ?.nomesAlternativos
          )
        ]
      )
    ];


  const nomeIdiomaPrincipal =
    textoLimpo(
      nomes[
        idiomaPrincipal
      ]
    );


  const nomeLegado =
    textoLimpo(
      registro?.nome
    );


  const principal =
    nomeIdiomaPrincipal ||
    ptBR ||
    nomeLegado ||
    original ||
    japonesRomanizado ||
    alternativos[0] ||
    "Sem nome";


  return {
    principal,

    ptBR:
      ptBR ||
      null,

    original,

    japonesRomanizado,

    alternativos
  };
}


/* ========================================
   TIPOS
======================================== */

function obterTipos(
  configuracaoHabilidades
) {
  const tipos =
    configuracaoHabilidades
      ?.tipos;

  if (
    !tipos ||
    typeof tipos !==
      "object"
  ) {
    return {};
  }

  return tipos;
}


function descobrirTipo(
  valor,
  tipos
) {
  if (
    valor &&
    tipos[
      valor
    ]
  ) {
    return valor;
  }

  const procurado =
    normalizarTexto(
      valor
    );

  if (procurado) {
    const encontrado =
      Object.entries(
        tipos
      ).find(
        ([
          ,
          configuracao
        ]) =>
          normalizarTexto(
            configuracao
              ?.nome
          ) ===
          procurado
      );

    if (encontrado) {
      return encontrado[
        0
      ];
    }
  }

  if (
    tipos.outro
  ) {
    return "outro";
  }

  return (
    Object.keys(
      tipos
    )[0] ||
    "outro"
  );
}


function obterParametrosTipo(
  tipo,
  tipos
) {
  const parametros =
    tipos
      ?.[tipo]
      ?.parametros;

  return Array.isArray(
    parametros
  )
    ? parametros
    : [];
}


function parametroFoiDefinido(
  valor
) {
  return (
    valor !== "" &&
    valor !== null &&
    valor !== undefined &&
    !Number.isNaN(
      Number(
        valor
      )
    )
  );
}


/* ========================================
   ORIGEM
======================================== */

function obterOrigemRegistro(
  registro
) {
  const metadados =
    registro?.metadados ||
    {};

  const chave =
    textoLimpo(
      metadados.origemTipo ||
      metadados.classificacao ||
      ""
    );

  const nome =
    textoLimpo(
      metadados.origemRotulo ||
      metadados.rotuloClassificacao ||
      metadados.origemNome ||
      metadados.classificacao ||
      ""
    );

  return {
    chave:
      chave ||
      nome,

    nome:
      nome ||
      chave
  };
}


function obterTagsRegistro(
  registro
) {
  const tags =
    registro
      ?.metadados
      ?.tags;

  if (
    !Array.isArray(
      tags
    )
  ) {
    return [];
  }

  return tags
    .map(
      textoLimpo
    )
    .filter(Boolean);
}


/* ========================================
   MÍDIAS
======================================== */

function obterCatalogoMidias(
  configuracaoHabilidades
) {
  const midias =
    configuracaoHabilidades
      ?.biblioteca
      ?.catalogos
      ?.midias;

  return Array.isArray(
    midias
  )
    ? midias
    : [];
}


function criarMapaMidias(
  catalogoMidias
) {
  return Object.fromEntries(
    catalogoMidias
      .filter(
        midia =>
          midia?.id
      )
      .map(
        midia => [
          midia.id,
          midia
        ]
      )
  );
}


function encontrarMidiaLegada(
  valor,
  catalogoMidias
) {
  const procurado =
    normalizarTexto(
      valor
    );

  if (!procurado) {
    return null;
  }

  return (
    catalogoMidias.find(
      midia =>
        normalizarTexto(
          midia?.id
        ) ===
          procurado ||
        normalizarTexto(
          midia?.nome
        ) ===
          procurado ||
        normalizarTexto(
          midia?.nomeCurto
        ) ===
          procurado
    ) ||
    null
  );
}


function normalizarVersoesAparicao(
  valor
) {
  if (
    !Array.isArray(
      valor
    )
  ) {
    return [];
  }

  return [
    ...new Set(
      valor
        .map(
          item =>
            typeof item ===
            "string"
              ? textoLimpo(
                  item
                )
              : textoLimpo(
                  item?.id ||
                  item?.versaoId ||
                  item?.nome
                )
        )
        .filter(Boolean)
    )
  ];
}


function normalizarAparicoesRegistro(
  registro
) {
  if (
    Array.isArray(
      registro?.aparicoes
    ) &&
    registro.aparicoes.length >
      0
  ) {
    return registro.aparicoes
      .map(
        aparicao => {
          if (
            typeof aparicao ===
            "string"
          ) {
            return {
              midiaId:
                textoLimpo(
                  aparicao
                ),

              versoes:
                []
            };
          }

          if (
            !aparicao ||
            typeof aparicao !==
              "object"
          ) {
            return null;
          }

          return {
            ...aparicao,

            midiaId:
              textoLimpo(
                aparicao.midiaId ||
                aparicao.midia ||
                aparicao.id ||
                ""
              ),

            versoes:
              normalizarVersoesAparicao(
                aparicao.versoes ||
                aparicao.versaoIds ||
                []
              ),

            observacao:
              textoLimpo(
                aparicao.observacao ||
                ""
              )
          };
        }
      )
      .filter(
        aparicao =>
          aparicao &&
          aparicao.midiaId
      );
  }

  const legadas =
    registro
      ?.metadados
      ?.midias;

  if (
    !Array.isArray(
      legadas
    )
  ) {
    return [];
  }

  return legadas
    .map(
      midia => {
        if (
          typeof midia ===
          "string"
        ) {
          return {
            midiaId:
              "",

            midiaLegada:
              textoLimpo(
                midia
              ),

            versoes:
              []
          };
        }

        if (
          !midia ||
          typeof midia !==
            "object"
        ) {
          return null;
        }

        return {
          ...midia,

          midiaId:
            textoLimpo(
              midia.midiaId ||
              midia.id ||
              ""
            ),

          midiaLegada:
            textoLimpo(
              midia.nome ||
              midia.titulo ||
              ""
            ),

          versoes:
            normalizarVersoesAparicao(
              midia.versoes ||
              []
            )
        };
      }
    )
    .filter(Boolean);
}


function resolverVersaoMidia(
  midia,
  versaoId
) {
  const encontrada =
    Array.isArray(
      midia?.versoes
    )
      ? midia.versoes.find(
          versao =>
            versao?.id ===
            versaoId
        )
      : null;

  return (
    encontrada ||
    {
      id:
        versaoId,

      nome:
        formatarIdentificador(
          versaoId
        ) ||
        versaoId
    }
  );
}


function resolverAparicoesRegistro(
  registro,
  catalogoMidias,
  mapaMidias
) {
  return normalizarAparicoesRegistro(
    registro
  ).map(
    aparicao => {
      let midia =
        aparicao.midiaId
          ? mapaMidias[
              aparicao.midiaId
            ] ||
            null
          : null;

      if (
        !midia &&
        aparicao.midiaLegada
      ) {
        midia =
          encontrarMidiaLegada(
            aparicao.midiaLegada,
            catalogoMidias
          );
      }

      const midiaId =
        midia?.id ||
        aparicao.midiaId ||
        "";

      return {
        ...aparicao,

        midia,
        midiaId,

        nomeMidia:
          midia?.nome ||
          midia?.nomeCurto ||
          aparicao.midiaLegada ||
          formatarIdentificador(
            midiaId
          ),

        eraId:
          textoLimpo(
            midia?.era ||
            ""
          ),

        versoesResolvidas:
          aparicao.versoes.map(
            versaoId =>
              resolverVersaoMidia(
                midia,
                versaoId
              )
          )
      };
    }
  );
}


function obterErasLegadas(
  registro
) {
  const eras =
    registro
      ?.metadados
      ?.eras;

  return Array.isArray(
    eras
  )
    ? eras
        .map(
          textoLimpo
        )
        .filter(Boolean)
    : [];
}


function obterCatalogoEras(
  catalogoMidias
) {
  const mapa = {};

  catalogoMidias.forEach(
    midia => {
      const eraId =
        textoLimpo(
          midia?.era
        );

      if (!eraId) {
        return;
      }

      if (
        !mapa[
          eraId
        ]
      ) {
        mapa[
          eraId
        ] =
          textoLimpo(
            midia?.eraNome ||
            midia?.rotuloEra ||
            ""
          ) ||
          formatarIdentificador(
            eraId
          );
      }
    }
  );

  return Object.entries(
    mapa
  ).map(
    ([
      id,
      nome
    ]) => ({
      id,
      nome
    })
  );
}


function obterNomeEra(
  eraId,
  catalogoEras
) {
  return (
    catalogoEras.find(
      era =>
        era.id ===
        eraId
    )?.nome ||
    formatarIdentificador(
      eraId
    ) ||
    eraId
  );
}


/* ========================================
   TEMPLATE
======================================== */

function normalizarTemplate(
  registro,
  configuracaoHabilidades
) {
  const tipos =
    obterTipos(
      configuracaoHabilidades
    );

  const tipo =
    descobrirTipo(
      registro?.tipo,
      tipos
    );

  const nomes =
    obterNomesRegistro(
      registro,
      configuracaoHabilidades
    );

  return {
    ...registro,

    /*
      nome é o nome usado para exibição
      e compatibilidade.

      Isso NÃO significa que ele seja
      automaticamente uma tradução PT-BR.
    */

    nome:
      nomes.principal,

    nomes: {
      ...(
        registro?.nomes ||
        {}
      ),

      /*
        O ponto principal desta correção:

        se não existe tradução PT-BR
        explicitamente catalogada, ptBR
        permanece null.
      */

      ptBR:
        nomes.ptBR,

      original:
        nomes.original,

      japonesRomanizado:
        nomes.japonesRomanizado,

      alternativos:
        nomes.alternativos
    },

    tipo,

    elemento:
      textoLimpo(
        registro?.elemento
      ),

    imagem:
      textoLimpo(
        registro?.imagem
      ),

    descricao:
      textoLimpo(
        registro?.descricao ||
        registro?.funcao ||
        registro?.efeito
      ),

    aparicoes:
      normalizarAparicoesRegistro(
        registro
      ),

    metadados: {
      ...(
        registro?.metadados ||
        {}
      )
    }
  };
}


/* ========================================
   DISPONIBILIDADE
======================================== */

function obterDisponibilidadeCamadas(
  camadas,
  configuracaoHabilidades
) {
  const salva =
    camadas
      ?.disponibilidade
      ?.estado ||
    camadas
      ?.disponibilidade ||
    "";

  const validas = [
    DISPONIBILIDADES_BANCO_HISSATSU.LIBERADA,
    DISPONIBILIDADES_BANCO_HISSATSU.BLOQUEADA,
    DISPONIBILIDADES_BANCO_HISSATSU.OCULTA
  ];

  if (
    validas.includes(
      salva
    )
  ) {
    return salva;
  }

  /*
    Compatibilidade com o modelo anterior:
    se já havia publicação sem disponibilidade
    explícita, ela era tratada como liberada.
  */

  if (
    camadas?.publicada
  ) {
    return DISPONIBILIDADES_BANCO_HISSATSU.LIBERADA;
  }

  const inicial =
    configuracaoHabilidades
      ?.biblioteca
      ?.disponibilidadeInicial;

  if (
    validas.includes(
      inicial
    )
  ) {
    return inicial;
  }

  return DISPONIBILIDADES_BANCO_HISSATSU.BLOQUEADA;
}


/* ========================================
   APLICAR CAMPANHA
======================================== */

function aplicarEstadoCampanha({
  registro,
  camadas,
  configuracaoHabilidades
}) {
  /*
    Rascunho não é mecânica ativa.

    O que os jogadores recebem é:

    versão publicada
          ou
    padrão da campanha.
  */

  const camadaPublicada =
    camadas?.publicada ||
    null;

  const resolvida =
    resolverMecanicaHabilidade({
      registroBase:
        registro,

      camada:
        camadaPublicada,

      configuracaoHabilidades
    });

  const completa =
    mecanicaHabilidadeEstaCompleta(
      registro,
      camadaPublicada,
      configuracaoHabilidades
    );

  const campoCusto =
    configuracaoHabilidades
      ?.custoPrincipal
      ?.campo ||
    "custoTP";

  const disponibilidade =
    obterDisponibilidadeCamadas(
      camadas,
      configuracaoHabilidades
    );

  const imagemPersonalizada =
    textoLimpo(
      camadas
        ?.apresentacao
        ?.imagemUrl ||
      ""
    );

  return {
    ...registro,

    [campoCusto]:
      resolvida
        .efetiva
        .custoPrincipal,

    grau:
      resolvida
        .efetiva
        .grau,

    parametros: {
      ...resolvida
        .efetiva
        .parametros
    },

    custos: {
      ...resolvida
        .efetiva
        .custos
    },

    requisitosAtributos: {
      ...resolvida
        .efetiva
        .requisitosAtributos
    },

    requisitosNarrativos:
      normalizarRequisitosNarrativos(
        resolvida
          .efetiva
          .requisitosNarrativos ||
        []
      ),

    imagem:
      imagemPersonalizada ||
      registro.imagem ||
      "",

    disponibilidadeBanco:
      disponibilidade,

    mecanicaCampanha: {
      ...(
        registro
          ?.mecanicaCampanha ||
        {}
      ),

      status:
        completa
          ? "funcional"
          : "pendente"
    },

    mecanicaHeranca: {
      completa,

      padrao:
        resolvida.padrao,

      origem:
        resolvida.origem,

      temPersonalizacaoPublicada:
        Boolean(
          camadaPublicada
        ),

      temRascunho:
        Boolean(
          camadas?.rascunho
        ),

      versaoMecanica:
        camadaPublicada
          ?.versaoMecanica ??
        null
    },

    configuracaoCampanhaInfo: {
      versaoMecanica:
        camadaPublicada
          ?.versaoMecanica ??
        null,

      publicadaEm:
        camadaPublicada
          ?.publicadaEm ||
        null,

      atualizadoEm:
        camadaPublicada
          ?.atualizadoEm ||
        null
    }
  };
}


/* ========================================
   ORIGEM EM HABILIDADES ADQUIRIDAS
======================================== */

function obterIdOrigem(
  habilidade,
  configuracaoHabilidades
) {
  const configurados =
    configuracaoHabilidades
      ?.biblioteca
      ?.aquisicao
      ?.camposOrigem ||
    {};

  const campo =
    configurados.id ||
    "origemBibliotecaId";

  return (
    habilidade
      ?.[campo] ||
    habilidade
      ?.origemBibliotecaId ||
    null
  );
}


/* ========================================
   SITUAÇÃO
======================================== */

function obterSituacaoRegistro({
  registro,
  adquirido,
  atributosJogador
}) {
  if (adquirido) {
    return "adquirida";
  }

  if (
    !registro
      ?.mecanicaHeranca
      ?.completa
  ) {
    return "configuracao_pendente";
  }

  if (
    registro.disponibilidadeBanco ===
    DISPONIBILIDADES_BANCO_HISSATSU.OCULTA
  ) {
    return "oculta";
  }

  if (
    registro.disponibilidadeBanco ===
    DISPONIBILIDADES_BANCO_HISSATSU.BLOQUEADA
  ) {
    return "bloqueada";
  }

  const elegibilidade =
    descobrirElegibilidadeSugerida({
      requisitosAtributos:
        registro
          .requisitosAtributos,

      requisitosNarrativos:
        registro
          .requisitosNarrativos,

      atributosJogador:
        atributosJogador ||
        {}
    });

  return elegibilidade ===
    "disponivel"
      ? "disponivel"
      : "pendente";
}


/* ========================================
   OUTRAS UTILIDADES
======================================== */

function valoresUnicos(
  valores
) {
  return [
    ...new Set(
      valores
        .map(
          valor =>
            textoLimpo(
              valor
            )
        )
        .filter(Boolean)
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


/* ========================================
   BARRA DE PARÂMETRO
======================================== */

function BarraParametroBanco({
  parametro,
  valor,
  origem,
  configuracaoHabilidades
}) {
  const minimoBruto =
    Number(
      configuracaoHabilidades
        ?.escalaParametros
        ?.minimo
    );

  const minimo =
    Number.isNaN(
      minimoBruto
    )
      ? 0
      : minimoBruto;

  const maximoBruto =
    Number(
      configuracaoHabilidades
        ?.escalaParametros
        ?.maximo
    );

  const maximo =
    Number.isNaN(
      maximoBruto
    ) ||
    maximoBruto <=
      minimo
      ? 10
      : maximoBruto;

  const definido =
    parametroFoiDefinido(
      valor
    );

  const numero =
    definido
      ? Number(
          valor
        )
      : 0;

  const porcentagem =
    definido
      ? Math.max(
          0,

          Math.min(
            100,

            (
              (
                numero -
                minimo
              ) /
              (
                maximo -
                minimo
              )
            ) *
            100
          )
        )
      : 0;

  return (
    <div className="biblioteca-habilidades-parametro">

      <div className="biblioteca-habilidades-parametro-topo">

        <strong>
          {parametro.nome ||
            parametro.chave}
        </strong>

        <span>
          {definido
            ? (
                `${numero}/${maximo} · ` +
                (
                  origem ===
                  "personalizado"
                    ? "PERSONALIZADO"
                    : "HERDADO"
                )
              )
            : "NÃO DEFINIDO"}
        </span>

      </div>


      <div className="biblioteca-habilidades-barra">

        <div
          className="biblioteca-habilidades-barra-preenchimento"
          style={{
            width:
              `${porcentagem}%`
          }}
        />

      </div>

    </div>
  );
}


/* ========================================
   COMPONENTE
======================================== */

function BibliotecaHabilidades({
  habilidadesAdquiridas = [],
  atributosJogador = {},
  configuracaoHabilidades = {},
  somenteLeitura = false,
  onAdquirir
}) {
  const contextoBanco =
    obterContextoBancoHissatsuLocal();

  const campanhaId =
    contextoBanco
      .campanhaId;

  const podeAdministrarBanco =
    contextoBanco
      .podeAdministrar;


  const [
    configuracoesBanco,
    setConfiguracoesBanco
  ] = useState(
    () =>
      carregarConfiguracoesBancoHissatsu(
        campanhaId
      )
  );


  const [
    busca,
    setBusca
  ] = useState("");


  const [
    filtroTipo,
    setFiltroTipo
  ] = useState(
    "todos"
  );


  const [
    filtroElemento,
    setFiltroElemento
  ] = useState(
    "todos"
  );


  const [
    filtroOrigem,
    setFiltroOrigem
  ] = useState(
    "todos"
  );


  const [
    filtroMidia,
    setFiltroMidia
  ] = useState(
    "todos"
  );


  const [
    filtroEra,
    setFiltroEra
  ] = useState(
    "todos"
  );


  const [
    filtroSituacao,
    setFiltroSituacao
  ] = useState(
    "todos"
  );


  const [
    paginaAtual,
    setPaginaAtual
  ] = useState(
    1
  );


  const [
    abertoId,
    setAbertoId
  ] = useState(
    null
  );


  const [
    editorTemplateId,
    setEditorTemplateId
  ] = useState(
    null
  );


  const [
    imagemEdicao,
    setImagemEdicao
  ] = useState("");


  const [
    mensagemRapida,
    setMensagemRapida
  ] = useState("");


  useEffect(
    () => {
      setConfiguracoesBanco(
        carregarConfiguracoesBancoHissatsu(
          campanhaId
        )
      );
    },
    [
      campanhaId
    ]
  );


  useEffect(
    () => {
      setPaginaAtual(
        1
      );
    },
    [
      busca,
      filtroTipo,
      filtroElemento,
      filtroOrigem,
      filtroMidia,
      filtroEra,
      filtroSituacao
    ]
  );


  const registrosBase =
    Array.isArray(
      configuracaoHabilidades
        ?.biblioteca
        ?.registros
    )
      ? configuracaoHabilidades
          .biblioteca
          .registros
      : [];


  const tipos =
    obterTipos(
      configuracaoHabilidades
    );


  const campoCusto =
    configuracaoHabilidades
      ?.custoPrincipal
      ?.campo ||
    "custoTP";


  const catalogoMidias =
    obterCatalogoMidias(
      configuracaoHabilidades
    );


  const mapaMidias =
    useMemo(
      () =>
        criarMapaMidias(
          catalogoMidias
        ),
      [
        catalogoMidias
      ]
    );


  const catalogoEras =
    useMemo(
      () =>
        obterCatalogoEras(
          catalogoMidias
        ),
      [
        catalogoMidias
      ]
    );


  const registrosBaseNormalizados =
    useMemo(
      () =>
        registrosBase.map(
          registro =>
            normalizarTemplate(
              registro,
              configuracaoHabilidades
            )
        ),
      [
        registrosBase,
        configuracaoHabilidades
      ]
    );


  const registrosComCampanha =
    useMemo(
      () =>
        registrosBaseNormalizados.map(
          registro => {
            const camadas =
              configuracoesBanco
                ?.templates
                ?.[registro.id] ||
              null;

            return aplicarEstadoCampanha({
              registro,
              camadas,
              configuracaoHabilidades
            });
          }
        ),
      [
        registrosBaseNormalizados,
        configuracoesBanco,
        configuracaoHabilidades
      ]
    );


  const registrosVisiveis =
    useMemo(
      () =>
        podeAdministrarBanco
          ? registrosComCampanha
          : registrosComCampanha.filter(
              registro =>
                registro
                  .disponibilidadeBanco !==
                DISPONIBILIDADES_BANCO_HISSATSU.OCULTA
            ),
      [
        registrosComCampanha,
        podeAdministrarBanco
      ]
    );


  const idsJaAdquiridos =
    useMemo(
      () =>
        new Set(
          habilidadesAdquiridas
            .map(
              habilidade =>
                obterIdOrigem(
                  habilidade,
                  configuracaoHabilidades
                )
            )
            .filter(Boolean)
        ),
      [
        habilidadesAdquiridas,
        configuracaoHabilidades
      ]
    );


  useEffect(
    () => {
      if (!abertoId) {
        setImagemEdicao("");
        setMensagemRapida("");
        return;
      }

      const registro =
        registrosComCampanha.find(
          item =>
            item.id ===
            abertoId
        );

      setImagemEdicao(
        registro?.imagem ||
        ""
      );

      setMensagemRapida("");
    },
    [
      abertoId
    ]
  );


  /* ======================================
     EDITOR MECÂNICO
  ====================================== */

  if (
    editorTemplateId &&
    podeAdministrarBanco
  ) {
    const registroBase =
      registrosBaseNormalizados.find(
        registro =>
          registro.id ===
          editorTemplateId
      );

    if (registroBase) {
      const camadas =
        configuracoesBanco
          ?.templates
          ?.[editorTemplateId] ||
        {};

      const configuracaoAtual =
        camadas.rascunho ||
        camadas.publicada ||
        null;

      return (
        <EditorMecanicaBanco
          key={
            `${editorTemplateId}-${camadas?.rascunho?.atualizadoEm || camadas?.publicada?.atualizadoEm || "padrao"}`
          }

          registroBase={
            registroBase
          }

          configuracaoAtual={
            configuracaoAtual
          }

          configuracaoPublicada={
            camadas.publicada ||
            null
          }

          configuracaoHabilidades={
            configuracaoHabilidades
          }

          possuiRascunho={
            Boolean(
              camadas.rascunho
            )
          }

          onCancelar={() =>
            setEditorTemplateId(
              null
            )
          }

          onSalvarRascunho={
            configuracao => {
              const atualizado =
                salvarRascunhoTemplateBancoHissatsu({
                  campanhaId,

                  templateId:
                    editorTemplateId,

                  configuracao
                });

              setConfiguracoesBanco(
                atualizado
              );

              setEditorTemplateId(
                null
              );

              setAbertoId(
                editorTemplateId
              );
            }
          }

          onPublicar={
            configuracao => {
              const atualizado =
                publicarTemplateBancoHissatsu({
                  campanhaId,

                  templateId:
                    editorTemplateId,

                  configuracao
                });

              setConfiguracoesBanco(
                atualizado
              );

              setEditorTemplateId(
                null
              );

              setAbertoId(
                editorTemplateId
              );
            }
          }

          onDescartarRascunho={() => {
            const confirmou =
              window.confirm(
                "Descartar este rascunho mecânico? A versão publicada continuará intacta."
              );

            if (!confirmou) {
              return;
            }

            const atualizado =
              descartarRascunhoTemplateBancoHissatsu({
                campanhaId,

                templateId:
                  editorTemplateId
              });

            setConfiguracoesBanco(
              atualizado
            );

            setEditorTemplateId(
              null
            );

            setAbertoId(
              editorTemplateId
            );
          }}
        />
      );
    }
  }


  /* ======================================
     FILTROS
  ====================================== */

  const contagemPorTipo =
    {};

  Object.keys(
    tipos
  ).forEach(
    chave => {
      contagemPorTipo[
        chave
      ] =
        0;
    }
  );


  registrosVisiveis.forEach(
    registro => {
      contagemPorTipo[
        registro.tipo
      ] =
        (
          contagemPorTipo[
            registro.tipo
          ] ||
          0
        ) +
        1;
    }
  );


  const opcoesTipos =
    Object.entries(
      tipos
    ).map(
      ([
        chave,
        tipo
      ]) => ({
        chave,

        nome:
          tipo.nome ||
          chave,

        quantidade:
          contagemPorTipo[
            chave
          ] ||
          0
      })
    );


  const opcoesElementos =
    valoresUnicos(
      registrosVisiveis.map(
        registro =>
          registro.elemento
      )
    );


  const mapaOrigens =
    new Map();


  registrosVisiveis.forEach(
    registro => {
      const origem =
        obterOrigemRegistro(
          registro
        );

      if (
        origem.chave &&
        origem.nome
      ) {
        mapaOrigens.set(
          origem.chave,
          origem.nome
        );
      }
    }
  );


  const opcoesOrigens =
    [
      ...mapaOrigens.entries()
    ].map(
      ([
        chave,
        nome
      ]) => ({
        chave,
        nome
      })
    );


  const contagemPorMidia =
    {};


  catalogoMidias.forEach(
    midia => {
      contagemPorMidia[
        midia.id
      ] =
        0;
    }
  );


  registrosVisiveis.forEach(
    registro => {
      const ids =
        new Set(
          resolverAparicoesRegistro(
            registro,
            catalogoMidias,
            mapaMidias
          )
            .map(
              aparicao =>
                aparicao.midiaId
            )
            .filter(Boolean)
        );

      ids.forEach(
        id => {
          contagemPorMidia[
            id
          ] =
            (
              contagemPorMidia[
                id
              ] ||
              0
            ) +
            1;
        }
      );
    }
  );


  const opcoesMidias =
    catalogoMidias.map(
      midia => ({
        ...midia,

        quantidade:
          contagemPorMidia[
            midia.id
          ] ||
          0
      })
    );


  const contagemPorEra =
    {};


  catalogoEras.forEach(
    era => {
      contagemPorEra[
        era.id
      ] =
        0;
    }
  );


  registrosVisiveis.forEach(
    registro => {
      const aparicoes =
        resolverAparicoesRegistro(
          registro,
          catalogoMidias,
          mapaMidias
        );

      const eras =
        new Set(
          aparicoes
            .map(
              aparicao =>
                aparicao.eraId
            )
            .filter(Boolean)
        );

      if (
        eras.size ===
        0
      ) {
        obterErasLegadas(
          registro
        ).forEach(
          era =>
            eras.add(
              era
            )
        );
      }

      eras.forEach(
        era => {
          contagemPorEra[
            era
          ] =
            (
              contagemPorEra[
                era
              ] ||
              0
            ) +
            1;
        }
      );
    }
  );


  const opcoesEras =
    catalogoEras.map(
      era => ({
        ...era,

        quantidade:
          contagemPorEra[
            era.id
          ] ||
          0
      })
    );


  const registrosFiltrados =
    registrosVisiveis
      .filter(
        registro => {
          const adquirido =
            idsJaAdquiridos.has(
              registro.id
            );

          const situacao =
            obterSituacaoRegistro({
              registro,
              adquirido,
              atributosJogador
            });

          const origem =
            obterOrigemRegistro(
              registro
            );

          const aparicoes =
            resolverAparicoesRegistro(
              registro,
              catalogoMidias,
              mapaMidias
            );

          const midias =
            aparicoes
              .map(
                aparicao =>
                  aparicao.midiaId
              )
              .filter(Boolean);

          let eras =
            aparicoes
              .map(
                aparicao =>
                  aparicao.eraId
              )
              .filter(Boolean);


          if (
            eras.length ===
            0
          ) {
            eras =
              obterErasLegadas(
                registro
              );
          }


          if (
            filtroTipo !==
              "todos" &&
            registro.tipo !==
              filtroTipo
          ) {
            return false;
          }


          if (
            filtroElemento !==
              "todos" &&
            registro.elemento !==
              filtroElemento
          ) {
            return false;
          }


          if (
            filtroOrigem !==
              "todos" &&
            origem.chave !==
              filtroOrigem
          ) {
            return false;
          }


          if (
            filtroMidia !==
              "todos" &&
            !midias.includes(
              filtroMidia
            )
          ) {
            return false;
          }


          if (
            filtroEra !==
              "todos" &&
            !eras.includes(
              filtroEra
            )
          ) {
            return false;
          }


          if (
            filtroSituacao ===
            "rascunho"
          ) {
            if (
              !registro
                ?.mecanicaHeranca
                ?.temRascunho
            ) {
              return false;
            }

          } else if (
            filtroSituacao !==
              "todos" &&
            situacao !==
              filtroSituacao
          ) {
            return false;
          }


          const termo =
            normalizarTexto(
              busca
            );

          if (!termo) {
            return true;
          }


          const nomes =
            obterNomesRegistro(
              registro,
              configuracaoHabilidades
            );

          const tags =
            obterTagsRegistro(
              registro
            );

          const tipoNome =
            tipos
              ?.[registro.tipo]
              ?.nome ||
            registro.tipo;


          /*
            Busca unificada.

            normalizarTexto remove diferenças
            entre maiúsculas/minúsculas e
            também remove acentos.

            Assim, por exemplo:

            Furacão
            furacao

            são equivalentes para a busca.
          */

          const textoBusca =
            normalizarTexto(
              [
                registro.id,

                nomes.principal,

                nomes.ptBR,

                nomes.original,

                nomes.japonesRomanizado,

                nomes.alternativos.join(
                  " "
                ),

                tipoNome,

                registro.elemento,

                origem.chave,

                origem.nome,

                registro.descricao,

                aparicoes
                  .map(
                    aparicao => [
                      aparicao.nomeMidia,

                      aparicao.midiaId,

                      aparicao.versoesResolvidas
                        .map(
                          versao =>
                            versao.nome
                        )
                        .join(" ")
                    ].join(" ")
                  )
                  .join(" "),

                tags.join(" ")
              ].join(" ")
            );


          return textoBusca.includes(
            termo
          );
        }
      )
      .sort(
        (
          a,
          b
        ) =>
          obterNomesRegistro(
            a,
            configuracaoHabilidades
          )
            .principal
            .localeCompare(
              obterNomesRegistro(
                b,
                configuracaoHabilidades
              ).principal,
              "pt-BR"
            )
      );


  const totalResultados =
    registrosFiltrados.length;


  const totalPaginas =
    Math.max(
      1,
      Math.ceil(
        totalResultados /
        ITENS_POR_PAGINA
      )
    );


  const paginaExibida =
    Math.min(
      Math.max(
        paginaAtual,
        1
      ),
      totalPaginas
    );


  const indiceInicialPagina =
    (
      paginaExibida -
      1
    ) *
    ITENS_POR_PAGINA;


  const registrosPaginados =
    registrosFiltrados.slice(
      indiceInicialPagina,
      indiceInicialPagina +
        ITENS_POR_PAGINA
    );


  const primeiroResultadoPagina =
    totalResultados > 0
      ? indiceInicialPagina +
        1
      : 0;


  const ultimoResultadoPagina =
    totalResultados > 0
      ? Math.min(
          indiceInicialPagina +
            ITENS_POR_PAGINA,
          totalResultados
        )
      : 0;


  const itensPaginacao =
    criarItensPaginacao(
      paginaExibida,
      totalPaginas
    );


  function mudarPagina(
    novaPagina
  ) {
    const destino =
      Math.min(
        Math.max(
          Number(
            novaPagina
          ) || 1,
          1
        ),
        totalPaginas
      );


    if (
      destino ===
      paginaExibida
    ) {
      return;
    }


    setPaginaAtual(
      destino
    );


    if (
      typeof document !==
      "undefined"
    ) {
      window.requestAnimationFrame(
        () => {
          document
            .querySelector(
              ".biblioteca-habilidades-resultado-topo"
            )
            ?.scrollIntoView({
              behavior:
                "smooth",
              block:
                "start"
            });
        }
      );
    }
  }


  function renderizarPaginacao(
    posicao
  ) {
    if (
      totalPaginas <=
      1
    ) {
      return null;
    }


    return (
      <nav
        className={
          `biblioteca-habilidades-paginacao biblioteca-habilidades-paginacao-${posicao}`
        }
        aria-label={
          `Paginação da Biblioteca de Hissatsu — ${posicao}`
        }
      >

        <div className="biblioteca-habilidades-paginacao-resumo">

          <strong>
            Página {paginaExibida}
            {" de "}
            {totalPaginas}
          </strong>

          <span>
            Mostrando {primeiroResultadoPagina}
            {"–"}
            {ultimoResultadoPagina}
            {" de "}
            {totalResultados}
          </span>

        </div>


        <div className="biblioteca-habilidades-paginacao-controles">

          <button
            type="button"
            className="biblioteca-habilidades-paginacao-navegacao"
            disabled={
              paginaExibida ===
              1
            }
            onClick={() =>
              mudarPagina(
                paginaExibida -
                1
              )
            }
          >
            ← ANTERIOR
          </button>


          <div className="biblioteca-habilidades-paginacao-paginas">

            {itensPaginacao.map(
              item => {
                if (
                  typeof item !==
                  "number"
                ) {
                  return (
                    <span
                      key={item}
                      className="biblioteca-habilidades-paginacao-reticencias"
                      aria-hidden="true"
                    >
                      …
                    </span>
                  );
                }


                const ativa =
                  item ===
                  paginaExibida;


                return (
                  <button
                    key={item}
                    type="button"
                    className={
                      ativa
                        ? "biblioteca-habilidades-paginacao-pagina biblioteca-habilidades-paginacao-pagina-ativa"
                        : "biblioteca-habilidades-paginacao-pagina"
                    }
                    aria-current={
                      ativa
                        ? "page"
                        : undefined
                    }
                    onClick={() =>
                      mudarPagina(
                        item
                      )
                    }
                  >
                    {item}
                  </button>
                );
              }
            )}

          </div>


          <button
            type="button"
            className="biblioteca-habilidades-paginacao-navegacao"
            disabled={
              paginaExibida ===
              totalPaginas
            }
            onClick={() =>
              mudarPagina(
                paginaExibida +
                1
              )
            }
          >
            PRÓXIMA →
          </button>

        </div>

      </nav>
    );
  }


  /* ======================================
     AQUISIÇÃO

     Aqui nasce agora a instância independente.
  ====================================== */

  function adquirir(
    registro
  ) {
    if (
      somenteLeitura ||
      idsJaAdquiridos.has(
        registro.id
      ) ||
      !registro
        ?.mecanicaHeranca
        ?.completa ||
      registro.disponibilidadeBanco !==
        DISPONIBILIDADES_BANCO_HISSATSU.LIBERADA
    ) {
      return;
    }


    const elegibilidade =
      descobrirElegibilidadeSugerida({
        requisitosAtributos:
          registro
            .requisitosAtributos,

        requisitosNarrativos:
          registro
            .requisitosNarrativos,

        atributosJogador:
          atributosJogador ||
          {}
      });


    const instancia =
      criarInstanciaHabilidadeDaBiblioteca({
        registro,

        configuracaoHabilidades,

        campanhaId,

        estadoInicial:
          elegibilidade
      });


    if (instancia) {
      onAdquirir?.(
        instancia
      );
    }
  }


  /* ======================================
     CONTROLES RÁPIDOS
  ====================================== */

  function alterarDisponibilidadeRapida(
    templateId,
    novaDisponibilidade
  ) {
    if (
      !podeAdministrarBanco ||
      !campanhaId ||
      !templateId
    ) {
      return;
    }


    const atualizado =
      atualizarDisponibilidadeTemplateBancoHissatsu({
        campanhaId,
        templateId,

        estadoDisponibilidade:
          novaDisponibilidade
      });


    setConfiguracoesBanco(
      atualizado
    );


    const rotulo =
      novaDisponibilidade ===
        DISPONIBILIDADES_BANCO_HISSATSU.LIBERADA
        ? "Liberada"
        : novaDisponibilidade ===
            DISPONIBILIDADES_BANCO_HISSATSU.OCULTA
          ? "Oculta"
          : "Bloqueada";


    setMensagemRapida(
      `Disponibilidade alterada para ${rotulo}. Nenhuma nova versão mecânica foi criada.`
    );
  }


  function salvarImagemRapida(
    templateId
  ) {
    if (
      !podeAdministrarBanco ||
      !campanhaId ||
      !templateId
    ) {
      return;
    }


    const atualizado =
      atualizarApresentacaoTemplateBancoHissatsu({
        campanhaId,
        templateId,

        apresentacao: {
          imagemUrl:
            textoLimpo(
              imagemEdicao
            )
        }
      });


    setConfiguracoesBanco(
      atualizado
    );


    setMensagemRapida(
      textoLimpo(
        imagemEdicao
      )
        ? "Imagem salva. A versão mecânica não foi alterada."
        : "Imagem removida. A versão mecânica não foi alterada."
    );
  }


  /* ======================================
     DETALHES
  ====================================== */

  if (abertoId) {
    const registro =
      registrosVisiveis.find(
        item =>
          item.id ===
          abertoId
      );


    if (registro) {
      const tipo =
        tipos
          ?.[registro.tipo] ||
        {};


      const nomes =
        obterNomesRegistro(
          registro,
          configuracaoHabilidades
        );


      const adquirido =
        idsJaAdquiridos.has(
          registro.id
        );


      const situacao =
        obterSituacaoRegistro({
          registro,
          adquirido,
          atributosJogador
        });


      const parametros =
        obterParametrosTipo(
          registro.tipo,
          tipos
        ).filter(
          parametro =>
            parametroFoiDefinido(
              registro
                ?.parametros
                ?.[parametro.chave]
            )
        );


      const aparicoes =
        resolverAparicoesRegistro(
          registro,
          catalogoMidias,
          mapaMidias
        );


      const origem =
        obterOrigemRegistro(
          registro
        );


      const camadas =
        configuracoesBanco
          ?.templates
          ?.[registro.id] ||
        {};


      const temPublicacao =
        Boolean(
          camadas.publicada
        );


      const versaoMecanica =
        camadas
          ?.publicada
          ?.versaoMecanica ||
        null;


      const temRascunho =
        Boolean(
          camadas.rascunho
        );


      const disponibilidade =
        registro
          .disponibilidadeBanco;


      return (
        <div className="biblioteca-habilidades">

          <div className="biblioteca-habilidades-detalhes-topo">

            <button
              type="button"
              className="biblioteca-habilidades-botao-secundario"
              onClick={() =>
                setAbertoId(
                  null
                )
              }
            >
              ← VOLTAR AO BANCO
            </button>


            <div className="biblioteca-habilidades-card-acoes">

              {podeAdministrarBanco && (

                <button
                  type="button"
                  className="biblioteca-habilidades-botao-secundario"
                  onClick={() =>
                    setEditorTemplateId(
                      registro.id
                    )
                  }
                >
                  ⚙{" "}
                  {temRascunho
                    ? "CONTINUAR RASCUNHO"
                    : temPublicacao
                      ? "EDITAR MECÂNICA"
                      : "PERSONALIZAR MECÂNICA"}
                </button>

              )}


              {!somenteLeitura &&
              registro
                ?.mecanicaHeranca
                ?.completa &&
              disponibilidade ===
                DISPONIBILIDADES_BANCO_HISSATSU.LIBERADA &&
              !adquirido && (

                <button
                  type="button"
                  className="biblioteca-habilidades-botao-principal"
                  onClick={() =>
                    adquirir(
                      registro
                    )
                  }
                >
                  ＋ ADQUIRIR
                </button>

              )}

            </div>

          </div>


          <section className="biblioteca-habilidades-hero">

            {registro.imagem ? (

              <img
                src={
                  registro.imagem
                }
                alt={
                  nomes.principal
                }
              />

            ) : (

              <div className="biblioteca-habilidades-hero-vazio">
                {tipo.icone ||
                  "⚡"}
              </div>

            )}


            <div className="biblioteca-habilidades-hero-info">

              <div className="biblioteca-habilidades-selos">

                {origem.nome && (

                  <span>
                    {origem.nome}
                  </span>

                )}


                {temRascunho && (

                  <em className="biblioteca-habilidades-selo-bloqueado">
                    ⚙ RASCUNHO EXISTENTE
                  </em>

                )}


                {disponibilidade ===
                DISPONIBILIDADES_BANCO_HISSATSU.BLOQUEADA && (

                  <em className="biblioteca-habilidades-selo-bloqueado">
                    🔒 BLOQUEADA
                  </em>

                )}


                {disponibilidade ===
                DISPONIBILIDADES_BANCO_HISSATSU.OCULTA && (

                  <em className="biblioteca-habilidades-selo-bloqueado">
                    👁 OCULTA
                  </em>

                )}


                {adquirido && (

                  <strong>
                    ✓ NA FICHA
                  </strong>

                )}

              </div>


              <h2>
                {nomes.principal}
              </h2>


              {nomes.original &&
              nomes.original !==
                nomes.principal && (

                <p>
                  {nomes.original}
                </p>

              )}


              <p>
                {tipo.nome ||
                  registro.tipo}

                {registro.elemento
                  ? ` · ${registro.elemento}`
                  : ""}
              </p>

            </div>

          </section>


          <div className="biblioteca-habilidades-resumo-grid">

            <article>

              <span>
                TIPO
              </span>

              <strong>
                {tipo.nome ||
                  registro.tipo}
              </strong>

            </article>


            <article>

              <span>
                ELEMENTO
              </span>

              <strong>
                {registro.elemento ||
                  "—"}
              </strong>

            </article>


            <article>

              <span>
                MECÂNICA
              </span>

              <strong>
                {temPublicacao
                  ? `Personalizada · V${versaoMecanica}`
                  : "Padrão da campanha"}
              </strong>

            </article>


            <article>

              <span>
                {(
                  configuracaoHabilidades
                    ?.custoPrincipal
                    ?.nome ||
                  "CUSTO"
                ).toUpperCase()}
              </span>

              <strong>
                {configuracaoHabilidades
                  ?.custoPrincipal
                  ?.icone ||
                  "⚡"}

                {" "}

                {registro[
                  campoCusto
                ]}
              </strong>

            </article>

          </div>


          {podeAdministrarBanco && (

            <section className="biblioteca-habilidades-bloco">

              <span className="biblioteca-habilidades-etiqueta">
                CONTROLES RÁPIDOS DO MESTRE
              </span>

              <h3>
                Disponibilidade
              </h3>

              <p>
                Esta alteração é aplicada imediatamente. Ela não salva rascunho e não cria uma nova versão da mecânica.
              </p>


              <div
                className="biblioteca-habilidades-card-acoes"
                style={{
                  marginTop:
                    "12px"
                }}
              >

                <button
                  type="button"
                  className={
                    disponibilidade ===
                    DISPONIBILIDADES_BANCO_HISSATSU.LIBERADA
                      ? "biblioteca-habilidades-botao-principal"
                      : "biblioteca-habilidades-botao-secundario"
                  }
                  onClick={() =>
                    alterarDisponibilidadeRapida(
                      registro.id,
                      DISPONIBILIDADES_BANCO_HISSATSU.LIBERADA
                    )
                  }
                >
                  ◇ LIBERADA
                </button>


                <button
                  type="button"
                  className={
                    disponibilidade ===
                    DISPONIBILIDADES_BANCO_HISSATSU.BLOQUEADA
                      ? "biblioteca-habilidades-botao-principal"
                      : "biblioteca-habilidades-botao-secundario"
                  }
                  onClick={() =>
                    alterarDisponibilidadeRapida(
                      registro.id,
                      DISPONIBILIDADES_BANCO_HISSATSU.BLOQUEADA
                    )
                  }
                >
                  🔒 BLOQUEADA
                </button>


                <button
                  type="button"
                  className={
                    disponibilidade ===
                    DISPONIBILIDADES_BANCO_HISSATSU.OCULTA
                      ? "biblioteca-habilidades-botao-principal"
                      : "biblioteca-habilidades-botao-secundario"
                  }
                  onClick={() =>
                    alterarDisponibilidadeRapida(
                      registro.id,
                      DISPONIBILIDADES_BANCO_HISSATSU.OCULTA
                    )
                  }
                >
                  👁 OCULTA
                </button>

              </div>


              {mensagemRapida && (

                <p
                  style={{
                    marginTop:
                      "12px",
                    color:
                      "#9fc8a8"
                  }}
                >
                  ✓ {mensagemRapida}
                </p>

              )}

            </section>

          )}


          {podeAdministrarBanco && (

            <section className="biblioteca-habilidades-bloco">

              <span className="biblioteca-habilidades-etiqueta">
                APRESENTAÇÃO
              </span>

              <h3>
                Imagem opcional
              </h3>

              <p>
                A URL é salva separadamente da mecânica. Trocar a imagem não aumenta a versão da habilidade.
              </p>


              <div
                style={{
                  display:
                    "grid",

                  gridTemplateColumns:
                    "minmax(0, 1fr) auto",

                  gap:
                    "8px",

                  marginTop:
                    "12px"
                }}
              >

                <input
                  type="url"
                  value={
                    imagemEdicao
                  }
                  onChange={
                    evento =>
                      setImagemEdicao(
                        evento.target.value
                      )
                  }
                  placeholder="https://..."
                  style={{
                    width:
                      "100%",

                    minWidth:
                      0,

                    minHeight:
                      "42px",

                    border:
                      "1px solid #364252",

                    borderRadius:
                      "8px",

                    background:
                      "#111720",

                    color:
                      "#eef2f7",

                    padding:
                      "8px 11px"
                  }}
                />


                <button
                  type="button"
                  className="biblioteca-habilidades-botao-principal"
                  onClick={() =>
                    salvarImagemRapida(
                      registro.id
                    )
                  }
                >
                  SALVAR IMAGEM
                </button>

              </div>


              {imagemEdicao && (

                <div
                  style={{
                    marginTop:
                      "12px",

                    maxWidth:
                      "320px",

                    overflow:
                      "hidden",

                    borderRadius:
                      "10px",

                    border:
                      "1px solid #303a49"
                  }}
                >

                  <img
                    src={
                      imagemEdicao
                    }
                    alt="Prévia"
                    style={{
                      display:
                        "block",

                      width:
                        "100%",

                      maxHeight:
                        "180px",

                      objectFit:
                        "cover"
                    }}
                  />

                </div>

              )}

            </section>

          )}


          {situacao ===
          "configuracao_pendente" && (

            <section className="biblioteca-habilidades-disponibilidade biblioteca-habilidades-disponibilidade-pendente">

              <strong>
                ⚙ PADRÕES INCOMPLETOS
              </strong>

              <p>
                Esta campanha ainda não fornece uma mecânica funcional para este tipo de habilidade.
              </p>

            </section>

          )}


          {situacao ===
          "bloqueada" && (

            <section className="biblioteca-habilidades-disponibilidade biblioteca-habilidades-disponibilidade-pendente">

              <strong>
                🔒 BLOQUEADA PELA CAMPANHA
              </strong>

              <p>
                A mecânica está pronta, mas a habilidade não pode ser adquirida enquanto estiver bloqueada.
              </p>

            </section>

          )}


          {situacao ===
          "oculta" && (

            <section className="biblioteca-habilidades-disponibilidade biblioteca-habilidades-disponibilidade-pendente">

              <strong>
                👁 OCULTA DOS JOGADORES
              </strong>

              <p>
                Somente quem administra a campanha consegue ver este registro no Banco.
              </p>

            </section>

          )}


          {situacao ===
          "disponivel" && (

            <section className="biblioteca-habilidades-disponibilidade biblioteca-habilidades-disponibilidade-ok">

              <strong>
                ◇ DISPONÍVEL PARA APRENDER
              </strong>

              <p>
                A habilidade está liberada e os requisitos atuais deste personagem foram cumpridos.
              </p>

            </section>

          )}


          {situacao ===
          "pendente" && (

            <section className="biblioteca-habilidades-disponibilidade biblioteca-habilidades-disponibilidade-pendente">

              <strong>
                🔒 REQUISITOS PENDENTES
              </strong>

              <p>
                A habilidade está liberada no Banco, mas este personagem ainda não cumpre todos os requisitos de aprendizado.
              </p>

            </section>

          )}


          <section className="biblioteca-habilidades-bloco">

            <span className="biblioteca-habilidades-etiqueta">
              REFERÊNCIA
            </span>

            <p>
              {registro.descricao ||
                "Sem descrição cadastrada."}
            </p>

          </section>


          <section className="biblioteca-habilidades-bloco">

            <div className="biblioteca-habilidades-bloco-topo">

              <div>

                <span className="biblioteca-habilidades-etiqueta">
                  MECÂNICA EFETIVA
                </span>

                <h3>
                  Parâmetros
                </h3>

                <p>
                  Valores herdados vêm do padrão da campanha. Valores personalizados são exceções publicadas para esta habilidade.
                </p>

              </div>

            </div>


            {parametros.length >
            0 ? (

              <div className="biblioteca-habilidades-parametros">

                {parametros.map(
                  parametro => (

                    <BarraParametroBanco
                      key={
                        parametro.chave
                      }

                      parametro={
                        parametro
                      }

                      valor={
                        registro
                          .parametros[
                            parametro.chave
                          ]
                      }

                      origem={
                        registro
                          ?.mecanicaHeranca
                          ?.origem
                          ?.parametros
                          ?.[parametro.chave] ||
                        "herdado"
                      }

                      configuracaoHabilidades={
                        configuracaoHabilidades
                      }
                    />

                  )
                )}

              </div>

            ) : (

              <div className="biblioteca-habilidades-vazio">
                Este tipo não possui parâmetros numéricos configurados.
              </div>

            )}

          </section>


          {registro
            ?.mecanicaHeranca
            ?.completa && (

            <section className="biblioteca-habilidades-bloco">

              <span className="biblioteca-habilidades-etiqueta">
                APRENDIZADO
              </span>

              <h3>
                Requisitos
              </h3>

              <VisualizadorRequisitosTecnica
                requisitosAtributos={
                  registro
                    .requisitosAtributos
                }

                requisitosNarrativos={
                  registro
                    .requisitosNarrativos
                }

                atributosJogador={
                  atributosJogador
                }

                atributosDisponiveis={
                  configuracaoHabilidades
                    ?.requisitos
                    ?.atributosDisponiveis
                }
              />

            </section>

          )}


          <section className="biblioteca-habilidades-bloco">

            <span className="biblioteca-habilidades-etiqueta">
              AO ADQUIRIR
            </span>

            <h3>
              Instância independente
            </h3>

            <p>
              A ficha recebe uma cópia da habilidade e preserva uma fotografia da base no momento da aquisição. Personalizações futuras do personagem não alteram este registro do Banco.
            </p>

          </section>


          <section className="biblioteca-habilidades-bloco">

            <span className="biblioteca-habilidades-etiqueta">
              PROVENIÊNCIA
            </span>

            <h3>
              Nomes, origem e aparições
            </h3>


            <div className="biblioteca-habilidades-origem-grid">

              <article>

                <span>
                  NOMES E LOCALIZAÇÃO
                </span>

                <strong>
                  PT-BR:{" "}
                  {nomes.ptBR ||
                    "Não catalogado"}
                </strong>


                {nomes.original && (

                  <p>
                    Original: {nomes.original}
                  </p>

                )}


                {nomes.japonesRomanizado && (

                  <p>
                    Japonês romanizado: {nomes.japonesRomanizado}
                  </p>

                )}


                {nomes.alternativos.length >
                0 && (

                  <p>
                    Outros nomes:{" "}
                    {nomes.alternativos.join(
                      ", "
                    )}
                  </p>

                )}

              </article>


              {aparicoes.map(
                (
                  aparicao,
                  indice
                ) => (

                  <article
                    key={
                      `${aparicao.midiaId}-${indice}`
                    }
                  >

                    <span>
                      APARIÇÃO
                    </span>

                    <strong>
                      {aparicao.nomeMidia}
                    </strong>

                    {aparicao.eraId && (

                      <p>
                        Era:{" "}
                        {obterNomeEra(
                          aparicao.eraId,
                          catalogoEras
                        )}
                      </p>

                    )}

                  </article>

                )
              )}


              <article>

                <span>
                  FONTE DA MECÂNICA
                </span>

                <strong>
                  {temPublicacao
                    ? `Personalizada · V${versaoMecanica}`
                    : "Padrões da campanha"}
                </strong>

                {temRascunho && (

                  <p>
                    Existe um rascunho ainda não publicado.
                  </p>

                )}

              </article>

            </div>

          </section>


          {podeAdministrarBanco &&
          temPublicacao && (

            <section className="biblioteca-habilidades-bloco">

              <span className="biblioteca-habilidades-etiqueta">
                ADMINISTRAÇÃO
              </span>

              <h3>
                Voltar aos padrões da campanha
              </h3>

              <p>
                Isto remove somente a mecânica personalizada e o rascunho. Disponibilidade e imagem permanecem intactas.
              </p>

              <button
                type="button"
                className="biblioteca-habilidades-botao-secundario"
                onClick={() => {
                  const confirmou =
                    window.confirm(
                      "Remover a mecânica personalizada desta habilidade e voltar aos padrões da campanha?"
                    );

                  if (!confirmou) {
                    return;
                  }

                  const atualizado =
                    removerMecanicaPersonalizadaTemplateBancoHissatsu({
                      campanhaId,

                      templateId:
                        registro.id
                    });

                  setConfiguracoesBanco(
                    atualizado
                  );

                  setMensagemRapida(
                    "Mecânica personalizada removida. A habilidade voltou a herdar os padrões da campanha."
                  );
                }}
              >
                ↶ USAR PADRÕES DA CAMPANHA
              </button>

            </section>

          )}

        </div>
      );
    }
  }


  /* ======================================
     LISTA
  ====================================== */

  const jogos =
    opcoesMidias.filter(
      midia =>
        midia.tipo ===
        "jogo"
    );


  const filmes =
    opcoesMidias.filter(
      midia =>
        midia.tipo ===
        "filme"
    );


  const outrasMidias =
    opcoesMidias.filter(
      midia =>
        midia.tipo !==
          "jogo" &&
        midia.tipo !==
          "filme"
    );


  const filtrosAtivos =
    Boolean(
      busca ||
      filtroTipo !==
        "todos" ||
      filtroElemento !==
        "todos" ||
      filtroOrigem !==
        "todos" ||
      filtroMidia !==
        "todos" ||
      filtroEra !==
        "todos" ||
      filtroSituacao !==
        "todos"
    );


  return (
    <div className="biblioteca-habilidades">

      <header className="biblioteca-habilidades-topo">

        <div>

          <span className="biblioteca-habilidades-etiqueta">
            BIBLIOTECA DA CAMPANHA
          </span>

          <h2>
            {configuracaoHabilidades
              ?.rotulos
              ?.biblioteca ||
              "Biblioteca de Habilidades"}
          </h2>

          <p>
            O Banco define a referência geral. Ao adquirir, o personagem recebe uma cópia independente que poderá evoluir sem modificar o template.
          </p>

        </div>


        <div className="biblioteca-habilidades-contagem">

          <span>
            BANCO
          </span>

          <strong>
            {registrosVisiveis.length}
          </strong>

          <small>
            registros
          </small>

        </div>

      </header>


      <section className="biblioteca-habilidades-filtros">

        <label className="biblioteca-habilidades-busca">

          <span>
            BUSCAR
          </span>

          <input
            type="search"
            value={
              busca
            }
            onChange={
              evento =>
                setBusca(
                  evento.target.value
                )
            }
            placeholder="PT-BR, original, romanização, aliases, tipo, mídia..."
          />

        </label>


        <label>

          <span>
            TIPO
          </span>

          <select
            value={
              filtroTipo
            }
            onChange={
              evento =>
                setFiltroTipo(
                  evento.target.value
                )
            }
          >

            <option value="todos">
              Todos ({registrosVisiveis.length})
            </option>

            {opcoesTipos.map(
              tipo => (

                <option
                  key={
                    tipo.chave
                  }
                  value={
                    tipo.chave
                  }
                >
                  {tipo.nome}
                  {" "}
                  ({tipo.quantidade})
                </option>

              )
            )}

          </select>

        </label>


        <label>

          <span>
            ELEMENTO
          </span>

          <select
            value={
              filtroElemento
            }
            onChange={
              evento =>
                setFiltroElemento(
                  evento.target.value
                )
            }
          >

            <option value="todos">
              Todos
            </option>

            {opcoesElementos.map(
              elemento => (

                <option
                  key={
                    elemento
                  }
                  value={
                    elemento
                  }
                >
                  {elemento}
                </option>

              )
            )}

          </select>

        </label>


        <label>

          <span>
            ORIGEM
          </span>

          <select
            value={
              filtroOrigem
            }
            onChange={
              evento =>
                setFiltroOrigem(
                  evento.target.value
                )
            }
          >

            <option value="todos">
              Todas
            </option>

            {opcoesOrigens.map(
              origem => (

                <option
                  key={
                    origem.chave
                  }
                  value={
                    origem.chave
                  }
                >
                  {origem.nome}
                </option>

              )
            )}

          </select>

        </label>


        <label>

          <span>
            MÍDIA
          </span>

          <select
            value={
              filtroMidia
            }
            onChange={
              evento =>
                setFiltroMidia(
                  evento.target.value
                )
            }
          >

            <option value="todos">
              Todas
            </option>


            {jogos.length >
            0 && (

              <optgroup label="Jogos">

                {jogos.map(
                  midia => (

                    <option
                      key={
                        midia.id
                      }
                      value={
                        midia.id
                      }
                    >
                      {midia.nomeCurto ||
                        midia.nome}
                      {" "}
                      ({midia.quantidade})
                    </option>

                  )
                )}

              </optgroup>

            )}


            {filmes.length >
            0 && (

              <optgroup label="Filmes">

                {filmes.map(
                  midia => (

                    <option
                      key={
                        midia.id
                      }
                      value={
                        midia.id
                      }
                    >
                      {midia.nomeCurto ||
                        midia.nome}
                      {" "}
                      ({midia.quantidade})
                    </option>

                  )
                )}

              </optgroup>

            )}


            {outrasMidias.length >
            0 && (

              <optgroup label="Outras fontes">

                {outrasMidias.map(
                  midia => (

                    <option
                      key={
                        midia.id
                      }
                      value={
                        midia.id
                      }
                    >
                      {midia.nomeCurto ||
                        midia.nome}
                      {" "}
                      ({midia.quantidade})
                    </option>

                  )
                )}

              </optgroup>

            )}

          </select>

        </label>


        <label>

          <span>
            ERA / SÉRIE
          </span>

          <select
            value={
              filtroEra
            }
            onChange={
              evento =>
                setFiltroEra(
                  evento.target.value
                )
            }
          >

            <option value="todos">
              Todas
            </option>

            {opcoesEras.map(
              era => (

                <option
                  key={
                    era.id
                  }
                  value={
                    era.id
                  }
                >
                  {era.nome}
                  {" "}
                  ({era.quantidade})
                </option>

              )
            )}

          </select>

        </label>


        <label>

          <span>
            SITUAÇÃO
          </span>

          <select
            value={
              filtroSituacao
            }
            onChange={
              evento =>
                setFiltroSituacao(
                  evento.target.value
                )
            }
          >

            <option value="todos">
              Todas
            </option>


            {podeAdministrarBanco && (

              <option value="rascunho">
                Com rascunho
              </option>

            )}


            {podeAdministrarBanco && (

              <option value="oculta">
                Oculta dos jogadores
              </option>

            )}


            <option value="bloqueada">
              Bloqueada
            </option>


            <option value="disponivel">
              Disponível para aprender
            </option>


            <option value="pendente">
              Requisitos pendentes
            </option>


            <option value="adquirida">
              Já está na ficha
            </option>


            {podeAdministrarBanco && (

              <option value="configuracao_pendente">
                Padrões incompletos
              </option>

            )}

          </select>

        </label>

      </section>


      <div className="biblioteca-habilidades-resultado-topo">

        <div className="biblioteca-habilidades-resultado-info">

          <span>
            {totalResultados}
            {" "}

            {totalResultados ===
            1
              ? "resultado"
              : "resultados"}
          </span>


          {totalResultados >
          0 && (

            <small>
              Exibindo {primeiroResultadoPagina}
              {"–"}
              {ultimoResultadoPagina}
              {" nesta página · "}
              {ITENS_POR_PAGINA}
              {" por página"}
            </small>

          )}

        </div>


        {filtrosAtivos && (

          <button
            type="button"
            onClick={() => {
              setBusca("");
              setFiltroTipo(
                "todos"
              );
              setFiltroElemento(
                "todos"
              );
              setFiltroOrigem(
                "todos"
              );
              setFiltroMidia(
                "todos"
              );
              setFiltroEra(
                "todos"
              );
              setFiltroSituacao(
                "todos"
              );
            }}
          >
            LIMPAR FILTROS
          </button>

        )}

      </div>


      {registrosFiltrados.length ===
      0 ? (

        <div className="biblioteca-habilidades-vazio biblioteca-habilidades-vazio-grande">

          <span>
            🔎
          </span>

          <strong>
            Nenhuma habilidade encontrada
          </strong>

          <p>
            Tente alterar a busca ou os filtros atuais.
          </p>

        </div>

      ) : (

        <>

          {renderizarPaginacao(
            "topo"
          )}


          <div className="biblioteca-habilidades-grid">

          {registrosPaginados.map(
            registro => {
              const tipo =
                tipos
                  ?.[registro.tipo] ||
                {};


              const nomes =
                obterNomesRegistro(
                  registro,
                  configuracaoHabilidades
                );


              const adquirido =
                idsJaAdquiridos.has(
                  registro.id
                );


              const situacao =
                obterSituacaoRegistro({
                  registro,
                  adquirido,
                  atributosJogador
                });


              const temRascunho =
                Boolean(
                  registro
                    ?.mecanicaHeranca
                    ?.temRascunho
                );


              const temPublicacao =
                Boolean(
                  registro
                    ?.mecanicaHeranca
                    ?.temPersonalizacaoPublicada
                );


              const versaoMecanica =
                registro
                  ?.mecanicaHeranca
                  ?.versaoMecanica;


              return (
                <article
                  key={
                    registro.id
                  }
                  className={
                    adquirido
                      ? "biblioteca-habilidades-card biblioteca-habilidades-card-adquirido"
                      : "biblioteca-habilidades-card"
                  }
                >

                  <div className="biblioteca-habilidades-card-imagem">

                    {registro.imagem ? (

                      <img
                        src={
                          registro.imagem
                        }
                        alt={
                          nomes.principal
                        }
                      />

                    ) : (

                      <span>
                        {tipo.icone ||
                          "⚡"}
                      </span>

                    )}

                  </div>


                  <div className="biblioteca-habilidades-card-corpo">

                    <div className="biblioteca-habilidades-selos">

                      <span>
                        {obterOrigemRegistro(
                          registro
                        ).nome}
                      </span>


                      {temRascunho && (

                        <em className="biblioteca-habilidades-selo-bloqueado">
                          ⚙ RASCUNHO
                        </em>

                      )}


                      {situacao ===
                      "configuracao_pendente" ? (

                        <em className="biblioteca-habilidades-selo-bloqueado">
                          ⚙ PADRÕES INCOMPLETOS
                        </em>

                      ) : situacao ===
                      "oculta" ? (

                        <em className="biblioteca-habilidades-selo-bloqueado">
                          👁 OCULTA
                        </em>

                      ) : situacao ===
                      "bloqueada" ? (

                        <em className="biblioteca-habilidades-selo-bloqueado">
                          🔒 BLOQUEADA
                        </em>

                      ) : adquirido ? (

                        <strong>
                          ✓ NA FICHA
                        </strong>

                      ) : situacao ===
                      "disponivel" ? (

                        <em className="biblioteca-habilidades-selo-disponivel">
                          ◇ DISPONÍVEL
                        </em>

                      ) : (

                        <em className="biblioteca-habilidades-selo-bloqueado">
                          🔒 REQUISITOS PENDENTES
                        </em>

                      )}

                    </div>


                    <h3>
                      {nomes.principal}
                    </h3>


                    {nomes.original &&
                    nomes.original !==
                      nomes.principal && (

                      <p className="biblioteca-habilidades-card-meta">
                        {nomes.original}
                      </p>

                    )}


                    <p className="biblioteca-habilidades-card-meta">

                      {tipo.nome ||
                        registro.tipo}

                      {registro.elemento
                        ? ` · ${registro.elemento}`
                        : ""}

                    </p>


                    {registro.descricao && (

                      <p className="biblioteca-habilidades-card-descricao">
                        {registro.descricao}
                      </p>

                    )}


                    <div className="biblioteca-habilidades-card-custo">

                      <span>
                        {temPublicacao
                          ? `MECÂNICA V${versaoMecanica}`
                          : "PADRÃO DA CAMPANHA"}
                      </span>

                      <strong>
                        {configuracaoHabilidades
                          ?.custoPrincipal
                          ?.icone ||
                          "⚡"}

                        {" "}

                        {registro[
                          campoCusto
                        ]}
                      </strong>

                    </div>


                    <div className="biblioteca-habilidades-card-acoes">

                      <button
                        type="button"
                        className="biblioteca-habilidades-botao-secundario"
                        onClick={() =>
                          setAbertoId(
                            registro.id
                          )
                        }
                      >
                        ABRIR
                      </button>


                      {podeAdministrarBanco && (

                        <button
                          type="button"
                          className="biblioteca-habilidades-botao-secundario"
                          onClick={() =>
                            setEditorTemplateId(
                              registro.id
                            )
                          }
                        >
                          ⚙{" "}
                          {temRascunho
                            ? "CONTINUAR"
                            : temPublicacao
                              ? "EDITAR"
                              : "PERSONALIZAR"}
                        </button>

                      )}


                      {!somenteLeitura &&
                      registro
                        ?.mecanicaHeranca
                        ?.completa &&
                      registro.disponibilidadeBanco ===
                        DISPONIBILIDADES_BANCO_HISSATSU.LIBERADA &&
                      !adquirido && (

                        <button
                          type="button"
                          className="biblioteca-habilidades-botao-principal"
                          onClick={() =>
                            adquirir(
                              registro
                            )
                          }
                        >
                          ＋ ADQUIRIR
                        </button>

                      )}

                    </div>

                  </div>

                </article>
              );
            }
          )}

          </div>


          {renderizarPaginacao(
            "rodape"
          )}

        </>

      )}

    </div>
  );
}


export default BibliotecaHabilidades;