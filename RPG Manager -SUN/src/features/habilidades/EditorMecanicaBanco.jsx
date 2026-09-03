import React, {
  useMemo,
  useState
} from "react";

import "./EditorMecanicaBanco.css";

import {
  normalizarRequisitosNarrativos
} from "./RequisitosTecnica.jsx";

import {
  criarConfiguracaoMecanicaVazia,
  normalizarConfiguracaoMecanicaPersistida,
  obterPadraoMecanicaHabilidade,
  obterParametrosDoTipo,
  resolverMecanicaHabilidade
} from "./mecanicaHabilidades.js";


function texto(
  valor
) {
  return String(
    valor || ""
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


function criarIdRequisito() {
  return (
    `req-${Date.now()}-` +
    Math.random()
      .toString(36)
      .slice(2, 8)
  );
}


function normalizarCatalogoAtributos(
  entrada
) {
  if (
    !Array.isArray(
      entrada
    )
  ) {
    return [];
  }

  return entrada
    .map(
      item => {
        if (
          typeof item ===
          "string"
        ) {
          return {
            chave:
              item,

            nome:
              item
          };
        }

        if (
          !item ||
          typeof item !==
            "object"
        ) {
          return null;
        }

        const chave =
          item.chave ||
          item.id ||
          item.valor;

        if (!chave) {
          return null;
        }

        return {
          chave,

          nome:
            item.nome ||
            item.rotulo ||
            chave
        };
      }
    )
    .filter(Boolean);
}


function normalizarNarrativosTemplate(
  requisitos
) {
  if (
    !Array.isArray(
      requisitos
    )
  ) {
    return [];
  }

  return requisitos
    .map(
      (
        requisito,
        indice
      ) => {
        if (
          typeof requisito ===
          "string"
        ) {
          const textoRequisito =
            requisito.trim();

          if (!textoRequisito) {
            return null;
          }

          return {
            id:
              `req-legado-${indice}`,

            texto:
              textoRequisito
          };
        }

        if (
          !requisito ||
          typeof requisito !==
            "object"
        ) {
          return null;
        }

        const textoRequisito =
          String(
            requisito.texto ||
            requisito.descricao ||
            requisito.nome ||
            ""
          ).trim();

        if (!textoRequisito) {
          return null;
        }

        return {
          id:
            requisito.id ||
            `req-legado-${indice}`,

          texto:
            textoRequisito
        };
      }
    )
    .filter(Boolean);
}


function normalizarParaComparacao(
  valor
) {
  if (
    Array.isArray(
      valor
    )
  ) {
    return valor.map(
      normalizarParaComparacao
    );
  }

  if (
    valor &&
    typeof valor ===
      "object"
  ) {
    return Object.keys(
      valor
    )
      .sort()
      .reduce(
        (
          resultado,
          chave
        ) => {
          if (
            valor[
              chave
            ] ===
            undefined
          ) {
            return resultado;
          }

          resultado[
            chave
          ] =
            normalizarParaComparacao(
              valor[
                chave
              ]
            );

          return resultado;
        },
        {}
      );
  }

  return valor;
}


function assinaturaMecanica(
  configuracao
) {
  return JSON.stringify(
    normalizarParaComparacao(
      configuracao
    )
  );
}


function obterNomesRegistro(
  registro
) {
  const nomes =
    registro?.nomes &&
    typeof registro.nomes ===
      "object"
      ? registro.nomes
      : {};

  const principal =
    texto(
      nomes.ptBR ||
      registro?.nome ||
      nomes.original ||
      ""
    ).trim();

  const original =
    texto(
      nomes.original ||
      registro?.nome ||
      ""
    ).trim();

  return {
    principal,
    original
  };
}


function prepararConfiguracaoInicial({
  registroBase,
  configuracaoAtual,
  configuracaoHabilidades
}) {
  const normalizada =
    normalizarConfiguracaoMecanicaPersistida(
      configuracaoAtual,
      configuracaoHabilidades,
      registroBase?.tipo
    );

  return {
    ...normalizada,

    sobrescritas: {
      ...objetoSeguro(
        normalizada.sobrescritas
      ),

      parametros: {
        ...objetoSeguro(
          normalizada
            ?.sobrescritas
            ?.parametros
        )
      }
    },

    custos: {
      ...objetoSeguro(
        normalizada.custos
      )
    },

    requisitosAtributos: {
      ...objetoSeguro(
        normalizada
          .requisitosAtributos
      )
    },

    requisitosNarrativos:
      normalizarNarrativosTemplate(
        normalizada
          .requisitosNarrativos
      ),

    observacaoMestre:
      texto(
        normalizada
          .observacaoMestre
      )
  };
}


function limitarNumero(
  valor,
  minimo,
  maximo
) {
  const numero =
    Number(
      valor
    );

  if (
    Number.isNaN(
      numero
    )
  ) {
    return null;
  }

  let resultado =
    numero;

  if (
    minimo !==
    null
  ) {
    resultado =
      Math.max(
        minimo,
        resultado
      );
  }

  if (
    maximo !==
    null
  ) {
    resultado =
      Math.min(
        maximo,
        resultado
      );
  }

  return resultado;
}


function EditorMecanicaBanco({
  registroBase,
  configuracaoAtual = null,
  configuracaoPublicada = null,
  configuracaoHabilidades = {},
  possuiRascunho = false,

  onCancelar,
  onSalvarRascunho,
  onPublicar,
  onDescartarRascunho
}) {
  const tipo =
    registroBase?.tipo;

  const tipoConfigurado =
    configuracaoHabilidades
      ?.tipos
      ?.[tipo] ||
    {};

  const nomes =
    obterNomesRegistro(
      registroBase
    );

  const parametrosTipo =
    obterParametrosDoTipo(
      configuracaoHabilidades,
      tipo
    );

  const padrao =
    obterPadraoMecanicaHabilidade(
      configuracaoHabilidades,
      tipo
    );

  const configuracaoPublicadaNormalizada =
    normalizarConfiguracaoMecanicaPersistida(
      configuracaoPublicada,
      configuracaoHabilidades,
      tipo
    );

  const configuracaoVazia =
    criarConfiguracaoMecanicaVazia();

  const [
    configuracao,
    setConfiguracao
  ] = useState(
    () =>
      prepararConfiguracaoInicial({
        registroBase,
        configuracaoAtual,
        configuracaoHabilidades
      })
  );


  /*
    Estes valores existem SOMENTE enquanto
    alguém está digitando.

    Isso permite apagar "5", deixar o input
    temporariamente vazio e então escrever
    "2", "0", "4", etc.

    O valor herdado só volta quando o campo
    vazio perde o foco.
  */

  const [
    entradasNumericas,
    setEntradasNumericas
  ] = useState({});


  const configuracaoInicial =
    useMemo(
      () =>
        prepararConfiguracaoInicial({
          registroBase,
          configuracaoAtual,
          configuracaoHabilidades
        }),
      [
        registroBase,
        configuracaoAtual,
        configuracaoHabilidades
      ]
    );

  const atributosDisponiveis =
    useMemo(
      () =>
        normalizarCatalogoAtributos(
          configuracaoHabilidades
            ?.requisitos
            ?.atributosDisponiveis
        ),
      [
        configuracaoHabilidades
      ]
    );

  const versaoPublicada =
    Number(
      configuracaoPublicada
        ?.versaoMecanica
    ) ||
    null;

  const existePublicacao =
    Boolean(
      configuracaoPublicada
    );

  const referenciaPublicacao =
    existePublicacao
      ? configuracaoPublicadaNormalizada
      : configuracaoVazia;

  const assinaturaAtual =
    assinaturaMecanica(
      configuracao
    );

  const assinaturaInicial =
    assinaturaMecanica(
      configuracaoInicial
    );

  const assinaturaPublicada =
    assinaturaMecanica(
      referenciaPublicacao
    );

  const alteradoDesdeAbertura =
    assinaturaAtual !==
    assinaturaInicial;

  const diferenteDaPublicada =
    assinaturaAtual !==
    assinaturaPublicada;

  const podeSalvarRascunho =
    diferenteDaPublicada &&
    (
      alteradoDesdeAbertura ||
      !possuiRascunho
    );

  const podePublicar =
    diferenteDaPublicada;

  const resolvidaAtual =
    resolverMecanicaHabilidade({
      registroBase,
      camada:
        configuracao,
      configuracaoHabilidades
    });

  const sobrescritas =
    objetoSeguro(
      configuracao.sobrescritas
    );

  const parametrosSobrescritos =
    objetoSeguro(
      sobrescritas.parametros
    );

  const atributosNaoUtilizados =
    atributosDisponiveis.filter(
      atributo =>
        !Object.prototype
          .hasOwnProperty
          .call(
            configuracao
              .requisitosAtributos,
            atributo.chave
          )
    );


  function possuiSobrescrita(
    chave
  ) {
    return Object.prototype
      .hasOwnProperty
      .call(
        sobrescritas,
        chave
      );
  }


  function possuiSobrescritaParametro(
    chave
  ) {
    return Object.prototype
      .hasOwnProperty
      .call(
        parametrosSobrescritos,
        chave
      );
  }


  function chaveEntradaCusto() {
    return "custoPrincipal";
  }


  function chaveEntradaParametro(
    chave
  ) {
    return (
      `parametro:${chave}`
    );
  }


  function possuiEntradaTemporaria(
    chave
  ) {
    return Object.prototype
      .hasOwnProperty
      .call(
        entradasNumericas,
        chave
      );
  }


  function obterValorEntrada(
    chave,
    valorEfetivo
  ) {
    if (
      possuiEntradaTemporaria(
        chave
      )
    ) {
      return entradasNumericas[
        chave
      ];
    }

    if (
      valorEfetivo ===
        null ||
      valorEfetivo ===
        undefined
    ) {
      return "";
    }

    return String(
      valorEfetivo
    );
  }


  function definirEntradaTemporaria(
    chave,
    valor
  ) {
    setEntradasNumericas(
      anterior => ({
        ...anterior,

        [chave]:
          valor
      })
    );
  }


  function limparEntradaTemporaria(
    chave
  ) {
    setEntradasNumericas(
      anterior => {
        const proximo = {
          ...anterior
        };

        delete proximo[
          chave
        ];

        return proximo;
      }
    );
  }


  function definirSobrescrita(
    chave,
    valor
  ) {
    setConfiguracao(
      anterior => ({
        ...anterior,

        sobrescritas: {
          ...objetoSeguro(
            anterior.sobrescritas
          ),

          [chave]:
            valor
        }
      })
    );
  }


  function restaurarSobrescrita(
    chave
  ) {
    setConfiguracao(
      anterior => {
        const proximas = {
          ...objetoSeguro(
            anterior.sobrescritas
          )
        };

        delete proximas[
          chave
        ];

        return {
          ...anterior,

          sobrescritas:
            proximas
        };
      }
    );

    limparEntradaTemporaria(
      chave
    );
  }


  function definirParametro(
    chave,
    valor
  ) {
    setConfiguracao(
      anterior => ({
        ...anterior,

        sobrescritas: {
          ...objetoSeguro(
            anterior.sobrescritas
          ),

          parametros: {
            ...objetoSeguro(
              anterior
                ?.sobrescritas
                ?.parametros
            ),

            [chave]:
              valor
          }
        }
      })
    );
  }


  function restaurarParametro(
    chave
  ) {
    setConfiguracao(
      anterior => {
        const parametros = {
          ...objetoSeguro(
            anterior
              ?.sobrescritas
              ?.parametros
          )
        };

        delete parametros[
          chave
        ];

        return {
          ...anterior,

          sobrescritas: {
            ...objetoSeguro(
              anterior.sobrescritas
            ),

            parametros
          }
        };
      }
    );

    limparEntradaTemporaria(
      chaveEntradaParametro(
        chave
      )
    );
  }


  function alterarEntradaCusto(
    valor
  ) {
    const chaveEntrada =
      chaveEntradaCusto();

    definirEntradaTemporaria(
      chaveEntrada,
      valor
    );

    /*
      Vazio durante a digitação não significa
      restaurar imediatamente.

      Assim é possível:
      5 → vazio → 2
    */

    if (
      valor ===
      ""
    ) {
      return;
    }

    const minimoBruto =
      Number(
        configuracaoHabilidades
          ?.custoPrincipal
          ?.minimo
      );

    const minimo =
      Number.isNaN(
        minimoBruto
      )
        ? 0
        : minimoBruto;

    const numero =
      limitarNumero(
        valor,
        minimo,
        null
      );

    if (
      numero ===
      null
    ) {
      return;
    }

    definirSobrescrita(
      "custoPrincipal",
      numero
    );
  }


  function finalizarEntradaCusto() {
    const chaveEntrada =
      chaveEntradaCusto();

    if (
      possuiEntradaTemporaria(
        chaveEntrada
      )
    ) {
      const valor =
        entradasNumericas[
          chaveEntrada
        ];

      if (
        valor ===
        ""
      ) {
        restaurarSobrescrita(
          "custoPrincipal"
        );

        return;
      }
    }

    limparEntradaTemporaria(
      chaveEntrada
    );
  }


  function alterarEntradaParametro(
    chave,
    valor
  ) {
    const chaveEntrada =
      chaveEntradaParametro(
        chave
      );

    definirEntradaTemporaria(
      chaveEntrada,
      valor
    );

    /*
      O campo pode ficar temporariamente
      vazio sem restaurar o valor herdado.
    */

    if (
      valor ===
      ""
    ) {
      return;
    }

    const minimoBruto =
      Number(
        configuracaoHabilidades
          ?.escalaParametros
          ?.minimo
      );

    const maximoBruto =
      Number(
        configuracaoHabilidades
          ?.escalaParametros
          ?.maximo
      );

    const minimo =
      Number.isNaN(
        minimoBruto
      )
        ? 0
        : minimoBruto;

    const maximo =
      Number.isNaN(
        maximoBruto
      )
        ? 10
        : maximoBruto;

    const numero =
      limitarNumero(
        valor,
        minimo,
        maximo
      );

    if (
      numero ===
      null
    ) {
      return;
    }

    definirParametro(
      chave,
      numero
    );
  }


  function finalizarEntradaParametro(
    chave
  ) {
    const chaveEntrada =
      chaveEntradaParametro(
        chave
      );

    if (
      possuiEntradaTemporaria(
        chaveEntrada
      )
    ) {
      const valor =
        entradasNumericas[
          chaveEntrada
        ];

      /*
        Só AGORA um campo vazio significa:
        voltar à herança.
      */

      if (
        valor ===
        ""
      ) {
        restaurarParametro(
          chave
        );

        return;
      }
    }

    limparEntradaTemporaria(
      chaveEntrada
    );
  }


  function alterarCustoAdicional(
    chave,
    valor,
    tipoCampo
  ) {
    setConfiguracao(
      anterior => {
        const custos = {
          ...objetoSeguro(
            anterior.custos
          )
        };

        if (
          valor === ""
        ) {
          delete custos[
            chave
          ];

        } else {
          custos[
            chave
          ] =
            tipoCampo ===
            "numero"
              ? Number(
                  valor
                )
              : valor;
        }

        return {
          ...anterior,
          custos
        };
      }
    );
  }


  function adicionarRequisitoAtributo(
    chave
  ) {
    if (!chave) {
      return;
    }

    setConfiguracao(
      anterior => ({
        ...anterior,

        requisitosAtributos: {
          ...objetoSeguro(
            anterior
              .requisitosAtributos
          ),

          [chave]:
            0
        }
      })
    );
  }


  function alterarRequisitoAtributo(
    chave,
    valor
  ) {
    setConfiguracao(
      anterior => ({
        ...anterior,

        requisitosAtributos: {
          ...objetoSeguro(
            anterior
              .requisitosAtributos
          ),

          [chave]:
            Math.max(
              0,
              Number(
                valor
              ) ||
              0
            )
        }
      })
    );
  }


  function removerRequisitoAtributo(
    chave
  ) {
    setConfiguracao(
      anterior => {
        const proximos = {
          ...objetoSeguro(
            anterior
              .requisitosAtributos
          )
        };

        delete proximos[
          chave
        ];

        return {
          ...anterior,

          requisitosAtributos:
            proximos
        };
      }
    );
  }


  function adicionarNarrativo() {
    setConfiguracao(
      anterior => ({
        ...anterior,

        requisitosNarrativos: [
          ...anterior
            .requisitosNarrativos,

          {
            id:
              criarIdRequisito(),

            texto:
              ""
          }
        ]
      })
    );
  }


  function alterarNarrativo(
    id,
    valor
  ) {
    setConfiguracao(
      anterior => ({
        ...anterior,

        requisitosNarrativos:
          anterior
            .requisitosNarrativos
            .map(
              requisito =>
                requisito.id ===
                id
                  ? {
                      ...requisito,

                      texto:
                        valor
                    }
                  : requisito
            )
      })
    );
  }


  function removerNarrativo(
    id
  ) {
    setConfiguracao(
      anterior => ({
        ...anterior,

        requisitosNarrativos:
          anterior
            .requisitosNarrativos
            .filter(
              requisito =>
                requisito.id !==
                id
            )
      })
    );
  }


  function alterarObservacao(
    valor
  ) {
    setConfiguracao(
      anterior => ({
        ...anterior,

        observacaoMestre:
          valor
      })
    );
  }


  function prepararParaSalvar() {
    const narrativos =
      normalizarRequisitosNarrativos(
        configuracao
          .requisitosNarrativos
      )
        .map(
          requisito => {
            if (
              typeof requisito ===
              "string"
            ) {
              return {
                id:
                  criarIdRequisito(),

                texto:
                  requisito.trim()
              };
            }

            return {
              id:
                requisito.id ||
                criarIdRequisito(),

              texto:
                String(
                  requisito.texto ||
                  requisito.descricao ||
                  ""
                ).trim()
            };
          }
        )
        .filter(
          requisito =>
            requisito.texto
        );

    return {
      ...configuracao,

      sobrescritas: {
        ...objetoSeguro(
          configuracao.sobrescritas
        ),

        parametros: {
          ...objetoSeguro(
            configuracao
              ?.sobrescritas
              ?.parametros
          )
        }
      },

      custos: {
        ...objetoSeguro(
          configuracao.custos
        )
      },

      requisitosAtributos: {
        ...objetoSeguro(
          configuracao
            .requisitosAtributos
        )
      },

      requisitosNarrativos:
        narrativos,

      observacaoMestre:
        texto(
          configuracao
            .observacaoMestre
        ).trim()
    };
  }


  function salvarRascunho() {
    if (!podeSalvarRascunho) {
      return;
    }

    onSalvarRascunho?.(
      prepararParaSalvar()
    );
  }


  function publicar() {
    if (!podePublicar) {
      return;
    }

    onPublicar?.(
      prepararParaSalvar()
    );
  }


  const origemTopo =
    possuiRascunho
      ? versaoPublicada
        ? `Rascunho baseado na V${versaoPublicada}`
        : "Rascunho baseado nos padrões da campanha"
      : versaoPublicada
        ? `Editando exceções da V${versaoPublicada}`
        : "Base: padrões da campanha";


  return (
    <section className="editor-banco">

      <header className="editor-banco-topo">

        <button
          type="button"
          className="editor-banco-voltar"
          onClick={
            onCancelar
          }
        >
          ← VOLTAR
        </button>


        <div className="editor-banco-topo-acoes">

          {possuiRascunho && (

            <button
              type="button"
              className="editor-banco-remover"
              onClick={
                onDescartarRascunho
              }
            >
              DESCARTAR RASCUNHO
            </button>

          )}


          <button
            type="button"
            className="editor-banco-rascunho"
            disabled={
              !podeSalvarRascunho
            }
            onClick={
              salvarRascunho
            }
          >
            💾 SALVAR RASCUNHO
          </button>


          <button
            type="button"
            className="editor-banco-publicar"
            disabled={
              !podePublicar
            }
            onClick={
              publicar
            }
          >
            ✓ PUBLICAR NOVA VERSÃO
          </button>

        </div>

      </header>


      <section className="editor-banco-identidade">

        <div className="editor-banco-identidade-icone">
          {tipoConfigurado.icone ||
            "⚡"}
        </div>


        <div>

          <span>
            EDITOR DE EXCEÇÕES MECÂNICAS
          </span>

          <h2>
            {nomes.principal ||
              "Habilidade"}
          </h2>

          {nomes.original &&
          nomes.original !==
            nomes.principal && (

            <p className="editor-banco-nome-original">
              {nomes.original}
            </p>

          )}

          <p>
            {tipoConfigurado.nome ||
              tipo}

            {registroBase?.elemento
              ? ` · ${registroBase.elemento}`
              : ""}
          </p>

        </div>


        <div className="editor-banco-status">

          <span>
            {origemTopo}
          </span>

          {versaoPublicada && (

            <strong>
              MECÂNICA · V{versaoPublicada}
            </strong>

          )}

        </div>

      </section>


      <div className="editor-banco-aviso">

        <span>
          ℹ
        </span>

        <p>
          Os valores herdados já funcionam. Você só precisa personalizar aquilo que deve ser diferente nesta habilidade. O valor herdado não é um limite: qualquer número permitido pela escala pode substituir o padrão.
        </p>

      </div>


      <section className="editor-banco-bloco">

        <header>

          <span>
            CUSTO PRINCIPAL
          </span>

          <h3>
            {configuracaoHabilidades
              ?.custoPrincipal
              ?.nome ||
              "Custo"}
          </h3>

          <p>
            O padrão atual da campanha é {padrao.custoPrincipal}. Você pode usar qualquer valor permitido pela campanha, inclusive valores menores que o padrão.
          </p>

        </header>


        <div className="editor-banco-campo-herdado">

          <div className="editor-banco-campo-herdado-topo">

            <span
              className={
                possuiSobrescrita(
                  "custoPrincipal"
                )
                  ? "editor-banco-origem editor-banco-origem-personalizado"
                  : "editor-banco-origem"
              }
            >
              {possuiSobrescrita(
                "custoPrincipal"
              )
                ? "PERSONALIZADO"
                : "HERDADO"}
            </span>

            {possuiSobrescrita(
              "custoPrincipal"
            ) && (

              <button
                type="button"
                className="editor-banco-restaurar"
                onClick={() =>
                  restaurarSobrescrita(
                    "custoPrincipal"
                  )
                }
              >
                ↶ RESTAURAR PADRÃO
              </button>

            )}

          </div>


          <input
            type="number"
            min={
              configuracaoHabilidades
                ?.custoPrincipal
                ?.minimo ??
              0
            }
            value={
              obterValorEntrada(
                chaveEntradaCusto(),
                resolvidaAtual
                  .efetiva
                  .custoPrincipal
              )
            }
            onChange={
              evento =>
                alterarEntradaCusto(
                  evento.target.value
                )
            }
            onBlur={
              finalizarEntradaCusto
            }
            onFocus={
              evento =>
                evento.currentTarget
                  .select()
            }
          />

        </div>

      </section>


      <section className="editor-banco-bloco">

        <header className="editor-banco-bloco-topo">

          <div>

            <span>
              PARÂMETROS DA TÉCNICA
            </span>

            <h3>
              {tipoConfigurado.nome ||
                tipo}
            </h3>

            <p>
              O padrão é apenas o ponto de partida. Um parâmetro herdado em 5 pode ser personalizado para 0, 1, 2, 8, 10 ou qualquer outro valor permitido pela escala.
            </p>

          </div>

          <strong>
            {configuracaoHabilidades
              ?.escalaParametros
              ?.minimo ??
              0}
            {" – "}
            {configuracaoHabilidades
              ?.escalaParametros
              ?.maximo ??
              10}
          </strong>

        </header>


        <div className="editor-banco-parametros editor-banco-parametros-herdados">

          {parametrosTipo.map(
            parametro => {
              const personalizado =
                possuiSobrescritaParametro(
                  parametro.chave
                );

              const valorAtual =
                resolvidaAtual
                  .efetiva
                  .parametros[
                    parametro.chave
                  ];

              const valorPadrao =
                padrao
                  .parametros[
                    parametro.chave
                  ];

              const chaveEntrada =
                chaveEntradaParametro(
                  parametro.chave
                );

              return (
                <label
                  key={
                    parametro.chave
                  }
                  className={
                    personalizado
                      ? "editor-banco-parametro-herdado editor-banco-parametro-personalizado"
                      : "editor-banco-parametro-herdado"
                  }
                >

                  <div className="editor-banco-parametro-herdado-topo">

                    <span>
                      {parametro.nome ||
                        parametro.chave}
                    </span>

                    <small>
                      {personalizado
                        ? "PERSONALIZADO"
                        : "HERDADO"}
                    </small>

                  </div>


                  <input
                    type="number"
                    min={
                      configuracaoHabilidades
                        ?.escalaParametros
                        ?.minimo ??
                      0
                    }
                    max={
                      configuracaoHabilidades
                        ?.escalaParametros
                        ?.maximo ??
                      10
                    }
                    value={
                      obterValorEntrada(
                        chaveEntrada,
                        valorAtual
                      )
                    }
                    onChange={
                      evento =>
                        alterarEntradaParametro(
                          parametro.chave,
                          evento.target.value
                        )
                    }
                    onBlur={() =>
                      finalizarEntradaParametro(
                        parametro.chave
                      )
                    }
                    onFocus={
                      evento =>
                        evento.currentTarget
                          .select()
                    }
                  />


                  <div className="editor-banco-parametro-herdado-rodape">

                    <span>
                      Padrão: {valorPadrao}
                    </span>

                    {personalizado && (

                      <button
                        type="button"
                        onClick={() =>
                          restaurarParametro(
                            parametro.chave
                          )
                        }
                      >
                        ↶ restaurar
                      </button>

                    )}

                  </div>

                </label>
              );
            }
          )}

        </div>

      </section>


      <section className="editor-banco-bloco">

        <header>

          <span>
            GRAU / ESTÁGIO
          </span>

          <h3>
            Identificação mecânica opcional
          </h3>

          <p>
            Use somente quando a campanha realmente precisar distinguir algo como V2, Avançada ou Dominada no template geral.
          </p>

        </header>


        <div className="editor-banco-campo-herdado">

          <div className="editor-banco-campo-herdado-topo">

            <span
              className={
                possuiSobrescrita(
                  "grau"
                )
                  ? "editor-banco-origem editor-banco-origem-personalizado"
                  : "editor-banco-origem"
              }
            >
              {possuiSobrescrita(
                "grau"
              )
                ? "PERSONALIZADO"
                : "HERDADO"}
            </span>

            {possuiSobrescrita(
              "grau"
            ) && (

              <button
                type="button"
                className="editor-banco-restaurar"
                onClick={() =>
                  restaurarSobrescrita(
                    "grau"
                  )
                }
              >
                ↶ RESTAURAR PADRÃO
              </button>

            )}

          </div>


          <input
            type="text"
            value={
              resolvidaAtual
                .efetiva
                .grau ||
              ""
            }
            onChange={
              evento => {
                const valor =
                  evento.target.value;

                if (
                  valor === ""
                ) {
                  restaurarSobrescrita(
                    "grau"
                  );

                  return;
                }

                definirSobrescrita(
                  "grau",
                  valor
                );
              }
            }
            placeholder="Opcional"
          />

        </div>

      </section>


      <section className="editor-banco-bloco">

        <header>

          <span>
            UTILIZAÇÃO
          </span>

          <h3>
            Custos e condições adicionais
          </h3>

          <p>
            Estes campos continuam opcionais. Deixe vazios quando a habilidade não precisar de uma exceção adicional.
          </p>

        </header>


        {(
          configuracaoHabilidades
            ?.custosAdicionais ||
          []
        ).length >
        0 ? (

          <div className="editor-banco-grid">

            {(
              configuracaoHabilidades
                ?.custosAdicionais ||
              []
            ).map(
              custo => (

                <label
                  key={
                    custo.chave
                  }
                  className={
                    custo.tipo ===
                    "texto"
                      ? "editor-banco-campo-largo"
                      : ""
                  }
                >

                  <span>
                    {custo.nome.toUpperCase()}
                  </span>


                  {custo.tipo ===
                  "numero" ? (

                    <input
                      type="number"
                      min={
                        custo.minimo ??
                        0
                      }
                      value={
                        configuracao
                          .custos
                          ?.[custo.chave] ??
                        ""
                      }
                      onChange={
                        evento =>
                          alterarCustoAdicional(
                            custo.chave,
                            evento.target.value,
                            "numero"
                          )
                      }
                      placeholder="Herdado / sem custo adicional"
                    />

                  ) : (

                    <input
                      type="text"
                      value={
                        configuracao
                          .custos
                          ?.[custo.chave] ??
                        ""
                      }
                      onChange={
                        evento =>
                          alterarCustoAdicional(
                            custo.chave,
                            evento.target.value,
                            "texto"
                          )
                      }
                      placeholder={
                        custo.placeholder ||
                        "Opcional"
                      }
                    />

                  )}

                </label>

              )
            )}

          </div>

        ) : (

          <div className="editor-banco-vazio">
            Nenhum custo adicional configurado para esta campanha.
          </div>

        )}

      </section>


      <section className="editor-banco-bloco">

        <header>

          <span>
            APRENDIZADO
          </span>

          <h3>
            Requisitos verificáveis
          </h3>

          <p>
            O sistema verifica estes requisitos automaticamente na ficha do personagem.
          </p>

        </header>


        {Object.entries(
          configuracao
            .requisitosAtributos
        ).length >
        0 && (

          <div className="editor-banco-requisitos">

            {Object.entries(
              configuracao
                .requisitosAtributos
            ).map(
              ([
                chave,
                valor
              ]) => {
                const atributo =
                  atributosDisponiveis.find(
                    item =>
                      item.chave ===
                      chave
                  );

                return (
                  <div
                    key={
                      chave
                    }
                    className="editor-banco-requisito"
                  >

                    <strong>
                      {atributo?.nome ||
                        chave}
                    </strong>

                    <input
                      type="number"
                      min="0"
                      value={
                        valor
                      }
                      onChange={
                        evento =>
                          alterarRequisitoAtributo(
                            chave,
                            evento.target.value
                          )
                      }
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removerRequisitoAtributo(
                          chave
                        )
                      }
                    >
                      ✕
                    </button>

                  </div>
                );
              }
            )}

          </div>

        )}


        {atributosNaoUtilizados.length >
        0 && (

          <label className="editor-banco-adicionar-requisito">

            <span>
              ADICIONAR ATRIBUTO
            </span>

            <select
              value=""
              onChange={
                evento =>
                  adicionarRequisitoAtributo(
                    evento.target.value
                  )
              }
            >

              <option value="">
                Selecione...
              </option>

              {atributosNaoUtilizados.map(
                atributo => (

                  <option
                    key={
                      atributo.chave
                    }
                    value={
                      atributo.chave
                    }
                  >
                    {atributo.nome}
                  </option>

                )
              )}

            </select>

          </label>

        )}

      </section>


      <section className="editor-banco-bloco">

        <header className="editor-banco-bloco-topo">

          <div>

            <span>
              NARRATIVA
            </span>

            <h3>
              Requisitos narrativos
            </h3>

            <p>
              A campanha define o requisito; o cumprimento continua sendo controlado individualmente na ficha.
            </p>

          </div>


          <button
            type="button"
            className="editor-banco-adicionar"
            onClick={
              adicionarNarrativo
            }
          >
            ＋ ADICIONAR
          </button>

        </header>


        {configuracao
          .requisitosNarrativos
          .length ===
        0 ? (

          <div className="editor-banco-vazio">
            Nenhum requisito narrativo personalizado.
          </div>

        ) : (

          <div className="editor-banco-narrativos">

            {configuracao
              .requisitosNarrativos
              .map(
                (
                  requisito,
                  indice
                ) => (

                  <div
                    key={
                      requisito.id
                    }
                    className="editor-banco-narrativo"
                  >

                    <span>
                      {indice + 1}
                    </span>

                    <input
                      type="text"
                      value={
                        requisito.texto
                      }
                      onChange={
                        evento =>
                          alterarNarrativo(
                            requisito.id,
                            evento.target.value
                          )
                      }
                      placeholder="Ex.: dominar controle do elemento Fogo"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removerNarrativo(
                          requisito.id
                        )
                      }
                    >
                      ✕
                    </button>

                  </div>

                )
              )}

          </div>

        )}

      </section>


      <section className="editor-banco-bloco">

        <header>

          <span>
            NOTA DO MESTRE
          </span>

          <h3>
            Observação da mecânica
          </h3>

        </header>


        <label className="editor-banco-textarea">

          <textarea
            rows="4"
            value={
              configuracao
                .observacaoMestre
            }
            onChange={
              evento =>
                alterarObservacao(
                  evento.target.value
                )
            }
            placeholder="Opcional. Explique por que esta habilidade foge do padrão."
          />

        </label>

      </section>


      <section className="editor-banco-resumo-alteracoes">

        <div>
          <span>
            ESTADO DO EDITOR
          </span>

          <strong>
            {diferenteDaPublicada
              ? "Há alterações mecânicas não publicadas"
              : "Nenhuma alteração mecânica em relação à versão ativa"}
          </strong>
        </div>

        <p>
          Disponibilidade e imagem não participam deste cálculo e nunca aumentam a versão mecânica.
        </p>

      </section>


      <footer className="editor-banco-rodape">

        <div>

          {possuiRascunho && (

            <button
              type="button"
              className="editor-banco-remover"
              onClick={
                onDescartarRascunho
              }
            >
              DESCARTAR RASCUNHO
            </button>

          )}

        </div>


        <div className="editor-banco-rodape-acoes">

          <button
            type="button"
            className="editor-banco-voltar"
            onClick={
              onCancelar
            }
          >
            VOLTAR
          </button>

          <button
            type="button"
            className="editor-banco-rascunho"
            disabled={
              !podeSalvarRascunho
            }
            onClick={
              salvarRascunho
            }
          >
            💾 SALVAR RASCUNHO
          </button>

          <button
            type="button"
            className="editor-banco-publicar"
            disabled={
              !podePublicar
            }
            onClick={
              publicar
            }
          >
            ✓ PUBLICAR NOVA VERSÃO
          </button>

        </div>

      </footer>

    </section>
  );
}


export default EditorMecanicaBanco;