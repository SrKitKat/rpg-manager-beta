/*
  MECÂNICA GENÉRICA DE HABILIDADES

  Esta camada não conhece Super Onze.

  Ela resolve a cadeia:

  padrão da campanha
        ↓
  padrão específico do tipo
        ↓
  sobrescritas do template
        ↓
  mecânica efetiva

  Assim o Banco guarda somente aquilo que
  precisa ser diferente do padrão.
*/


export const MODELO_MECANICA_HERDADA =
  "heranca-v1";


/* ========================================
   UTILIDADES
======================================== */

export function valorMecanicoDefinido(
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


function objetoSeguro(
  valor
) {
  return (
    valor &&
    typeof valor ===
      "object" &&
    !Array.isArray(
      valor
    )
      ? valor
      : {}
  );
}


function listaSegura(
  valor
) {
  return Array.isArray(
    valor
  )
    ? valor
    : [];
}


function texto(
  valor
) {
  return String(
    valor ||
    ""
  ).trim();
}


function numeroOuOriginal(
  valor
) {
  if (
    valor === "" ||
    valor === null ||
    valor === undefined
  ) {
    return "";
  }


  const numero =
    Number(
      valor
    );


  return Number.isNaN(
    numero
  )
    ? valor
    : numero;
}


/* ========================================
   PARÂMETROS DO TIPO
======================================== */

export function obterParametrosDoTipo(
  configuracaoHabilidades,
  tipo
) {
  const parametros =
    configuracaoHabilidades
      ?.tipos
      ?.[tipo]
      ?.parametros;


  return Array.isArray(
    parametros
  )
    ? parametros
    : [];
}


/* ========================================
   PADRÃO MECÂNICO

   Primeiro usa o padrão geral.

   Depois permite que um tipo possua
   valores próprios.

   Exemplo futuro:

   padrão geral:
   TP 20
   parâmetros 5

   chute:
   TP 18
   impacto 6
======================================== */

export function obterPadraoMecanicaHabilidade(
  configuracaoHabilidades,
  tipo
) {
  const global =
    objetoSeguro(
      configuracaoHabilidades
        ?.padroesMecanica
    );


  const porTipo =
    objetoSeguro(
      global
        .porTipo
        ?.[tipo]
    );


  const parametrosTipo =
    obterParametrosDoTipo(
      configuracaoHabilidades,
      tipo
    );


  const parametrosGlobais =
    objetoSeguro(
      global.parametros
    );


  const parametrosEspecificos =
    objetoSeguro(
      porTipo.parametros
    );


  const valorParametroGlobal =
    porTipo.valorParametro ??
    global.valorParametro ??
    "";


  const parametros = {};


  parametrosTipo.forEach(
    parametro => {

      const chave =
        parametro.chave;


      parametros[
        chave
      ] =
        parametrosEspecificos[
          chave
        ] ??
        parametrosGlobais[
          chave
        ] ??
        valorParametroGlobal;

    }
  );


  return {

    custoPrincipal:
      porTipo.custoPrincipal ??
      global.custoPrincipal ??
      "",


    grau:
      porTipo.grau ??
      global.grau ??
      "",


    parametros,


    custos: {

      ...objetoSeguro(
        global.custos
      ),

      ...objetoSeguro(
        porTipo.custos
      )

    },


    requisitosAtributos: {

      ...objetoSeguro(
        global
          .requisitosAtributos
      ),

      ...objetoSeguro(
        porTipo
          .requisitosAtributos
      )

    },


    requisitosNarrativos:
      porTipo
        .requisitosNarrativos !==
      undefined
        ? listaSegura(
            porTipo
              .requisitosNarrativos
          )
        : listaSegura(
            global
              .requisitosNarrativos
          )

  };
}


/* ========================================
   CONFIGURAÇÃO SEM EXCEÇÕES

   Isto NÃO significa mecânica vazia.

   Significa:

   "use completamente os padrões".
======================================== */

export function criarConfiguracaoMecanicaVazia() {
  return {

    modelo:
      MODELO_MECANICA_HERDADA,


    sobrescritas: {

      parametros:
        {}

    },


    custos:
      {},


    requisitosAtributos:
      {},


    requisitosNarrativos:
      [],


    observacaoMestre:
      ""

  };
}


/* ========================================
   NORMALIZAR CONFIGURAÇÃO SALVA

   Também converte silenciosamente as
   publicações antigas que guardavam TP
   e todos os parâmetros diretamente.

   Portanto, sua Furacão de Fogo já
   publicada continua funcionando.
======================================== */

export function normalizarConfiguracaoMecanicaPersistida(
  camada,
  configuracaoHabilidades,
  tipo
) {
  if (
    !camada ||
    typeof camada !==
      "object" ||
    Array.isArray(
      camada
    )
  ) {
    return criarConfiguracaoMecanicaVazia();
  }


  const campoCusto =
    configuracaoHabilidades
      ?.custoPrincipal
      ?.campo ||
    "custoTP";


  const parametrosTipo =
    obterParametrosDoTipo(
      configuracaoHabilidades,
      tipo
    );


  /* ======================================
     FORMATO NOVO

     Já armazena somente exceções.
  ====================================== */

  if (
    camada.modelo ===
      MODELO_MECANICA_HERDADA ||
    camada.sobrescritas
  ) {
    const sobrescritasOriginais =
      objetoSeguro(
        camada.sobrescritas
      );


    const parametrosOriginais =
      objetoSeguro(
        sobrescritasOriginais
          .parametros
      );


    const parametros =
      {};


    parametrosTipo.forEach(
      parametro => {

        if (
          Object.prototype
            .hasOwnProperty
            .call(
              parametrosOriginais,
              parametro.chave
            )
        ) {
          parametros[
            parametro.chave
          ] =
            numeroOuOriginal(
              parametrosOriginais[
                parametro.chave
              ]
            );
        }

      }
    );


    const sobrescritas = {

      parametros

    };


    if (
      Object.prototype
        .hasOwnProperty
        .call(
          sobrescritasOriginais,
          "custoPrincipal"
        )
    ) {
      sobrescritas
        .custoPrincipal =
          numeroOuOriginal(
            sobrescritasOriginais
              .custoPrincipal
          );
    }


    if (
      Object.prototype
        .hasOwnProperty
        .call(
          sobrescritasOriginais,
          "grau"
        )
    ) {
      sobrescritas.grau =
        texto(
          sobrescritasOriginais
            .grau
        );
    }


    return {

      modelo:
        MODELO_MECANICA_HERDADA,


      sobrescritas,


      custos: {

        ...objetoSeguro(
          camada.custos
        )

      },


      requisitosAtributos: {

        ...objetoSeguro(
          camada
            .requisitosAtributos
        )

      },


      requisitosNarrativos:
        listaSegura(
          camada
            .requisitosNarrativos
        ).map(
          item =>
            item &&
            typeof item ===
              "object"
              ? {
                  ...item
                }
              : item
        ),


      observacaoMestre:
        texto(
          camada
            .observacaoMestre
        )

    };
  }


  /* ======================================
     COMPATIBILIDADE COM PUBLICAÇÕES ANTIGAS

     Exemplo antigo:

     custoTP: 20

     parametros: {
       impacto: 8,
       velocidade: 7
     }

     Esses campos passam a ser entendidos
     como exceções explícitas.
  ====================================== */

  const sobrescritas = {

    parametros:
      {}

  };


  const custoLegado =
    camada[
      campoCusto
    ] ??
    camada.custoTP ??
    camada.tp ??
    camada.custo;


  if (
    valorMecanicoDefinido(
      custoLegado
    )
  ) {
    sobrescritas
      .custoPrincipal =
        Number(
          custoLegado
        );
  }


  if (
    texto(
      camada.grau
    )
  ) {
    sobrescritas.grau =
      texto(
        camada.grau
      );
  }


  const parametrosLegados =
    objetoSeguro(
      camada.parametros
    );


  parametrosTipo.forEach(
    parametro => {

      const valor =
        parametrosLegados[
          parametro.chave
        ];


      if (
        valorMecanicoDefinido(
          valor
        )
      ) {
        sobrescritas
          .parametros[
            parametro.chave
          ] =
            Number(
              valor
            );
      }

    }
  );


  return {

    modelo:
      MODELO_MECANICA_HERDADA,


    sobrescritas,


    custos: {

      ...objetoSeguro(
        camada.custos
      )

    },


    requisitosAtributos: {

      ...objetoSeguro(
        camada
          .requisitosAtributos
      )

    },


    requisitosNarrativos:
      listaSegura(
        camada
          .requisitosNarrativos
      ).map(
        item =>
          item &&
          typeof item ===
            "object"
            ? {
                ...item
              }
            : item
      ),


    observacaoMestre:
      texto(
        camada
          .observacaoMestre
      )

  };
}


/* ========================================
   RESOLVER MECÂNICA EFETIVA

   Aqui acontece:

   padrão
     +
   exceções

   O resultado já é aquilo que a ficha
   realmente deverá enxergar.
======================================== */

export function resolverMecanicaHabilidade({
  registroBase,
  camada,
  configuracaoHabilidades
}) {
  const tipo =
    registroBase?.tipo;


  const padrao =
    obterPadraoMecanicaHabilidade(
      configuracaoHabilidades,
      tipo
    );


  const configuracao =
    normalizarConfiguracaoMecanicaPersistida(
      camada,
      configuracaoHabilidades,
      tipo
    );


  const sobrescritas =
    objetoSeguro(
      configuracao.sobrescritas
    );


  const parametrosSobrescritos =
    objetoSeguro(
      sobrescritas.parametros
    );


  const parametros =
    {};


  const origemParametros =
    {};


  obterParametrosDoTipo(
    configuracaoHabilidades,
    tipo
  ).forEach(
    parametro => {

      const chave =
        parametro.chave;


      const personalizado =
        Object.prototype
          .hasOwnProperty
          .call(
            parametrosSobrescritos,
            chave
          );


      parametros[
        chave
      ] =
        personalizado
          ? parametrosSobrescritos[
              chave
            ]
          : padrao
              .parametros[
                chave
              ];


      origemParametros[
        chave
      ] =
        personalizado
          ? "personalizado"
          : "herdado";

    }
  );


  const custoPersonalizado =
    Object.prototype
      .hasOwnProperty
      .call(
        sobrescritas,
        "custoPrincipal"
      );


  const grauPersonalizado =
    Object.prototype
      .hasOwnProperty
      .call(
        sobrescritas,
        "grau"
      );


  return {

    padrao,


    configuracao,


    efetiva: {

      custoPrincipal:
        custoPersonalizado
          ? sobrescritas
              .custoPrincipal
          : padrao
              .custoPrincipal,


      grau:
        grauPersonalizado
          ? sobrescritas.grau
          : padrao.grau,


      parametros,


      custos: {

        ...padrao.custos,

        ...objetoSeguro(
          configuracao.custos
        )

      },


      requisitosAtributos: {

        ...padrao
          .requisitosAtributos,

        ...objetoSeguro(
          configuracao
            .requisitosAtributos
        )

      },


      requisitosNarrativos:
        configuracao
          .requisitosNarrativos
          .length >
        0
          ? configuracao
              .requisitosNarrativos
              .map(
                item => ({
                  ...item
                })
              )
          : padrao
              .requisitosNarrativos
              .map(
                item =>
                  item &&
                  typeof item ===
                    "object"
                    ? {
                        ...item
                      }
                    : item
              ),


      observacaoMestre:
        configuracao
          .observacaoMestre

    },


    origem: {

      custoPrincipal:
        custoPersonalizado
          ? "personalizado"
          : "herdado",


      grau:
        grauPersonalizado
          ? "personalizado"
          : "herdado",


      parametros:
        origemParametros

    }

  };
}


/* ========================================
   MECÂNICA FUNCIONAL?

   Uma campanha pode escolher não definir
   padrões.

   Nesse caso o sistema ainda consegue
   detectar que uma habilidade está
   incompleta.

   Super Onze terá TP 20 e parâmetros 5,
   portanto suas Hissatsu já terão um
   estado funcional automaticamente.
======================================== */

export function mecanicaHabilidadeEstaCompleta(
  registroBase,
  camada,
  configuracaoHabilidades
) {
  const resolvida =
    resolverMecanicaHabilidade({
      registroBase,
      camada,
      configuracaoHabilidades
    });


  if (
    !valorMecanicoDefinido(
      resolvida
        .efetiva
        .custoPrincipal
    )
  ) {
    return false;
  }


  return obterParametrosDoTipo(
    configuracaoHabilidades,
    registroBase?.tipo
  ).every(
    parametro =>
      valorMecanicoDefinido(
        resolvida
          .efetiva
          .parametros[
            parametro.chave
          ]
      )
  );
}