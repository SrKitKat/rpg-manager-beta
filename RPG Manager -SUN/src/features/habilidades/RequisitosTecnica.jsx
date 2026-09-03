import React, {
  useState
} from "react";


/* ========================================
   CATÁLOGO PADRÃO DE COMPATIBILIDADE

   A campanha pode fornecer outro catálogo.

   Este existe apenas para fichas/configurações
   antigas continuarem funcionando.
======================================== */

const ATRIBUTOS_PADRAO = [
  {
    chave: "forca",
    nome: "Força"
  },
  {
    chave: "destreza",
    nome: "Destreza"
  },
  {
    chave: "constituicao",
    nome: "Constituição"
  },
  {
    chave: "agilidade",
    nome: "Agilidade"
  },
  {
    chave: "resistencia",
    nome: "Resistência"
  },
  {
    chave: "visao",
    nome: "Visão"
  },
  {
    chave: "percepcao",
    nome: "Percepção"
  },
  {
    chave: "inteligencia",
    nome: "Inteligência"
  },
  {
    chave: "sabedoria",
    nome: "Sabedoria"
  },
  {
    chave: "sorte",
    nome: "Sorte"
  },
  {
    chave: "carisma",
    nome: "Carisma"
  }
];


/* ========================================
   ESTILOS

   Mantemos neste arquivo por enquanto.

   Quando a interface estiver consolidada,
   podemos mover para CSS próprio.
======================================== */

const estilos = {
  area: {
    display: "grid",
    gap: "18px"
  },

  bloco: {
    padding: "18px",
    border: "1px solid #303846",
    borderRadius: "12px",
    background: "#202631"
  },

  blocoInterno: {
    padding: "12px",
    border: "1px solid #303846",
    borderRadius: "10px",
    background: "#171b24"
  },

  titulo: {
    margin: "0 0 6px"
  },

  textoAjuda: {
    margin: "0 0 16px",
    color: "#8d96a6",
    fontSize: "12px",
    lineHeight: "1.5"
  },

  etiqueta: {
    display: "block",
    marginBottom: "4px",
    color: "#8d96a6",
    fontSize: "10px",
    fontWeight: "bold"
  },

  grid: {
    display: "grid",
    gap: "10px"
  },

  vazio: {
    padding: "14px",
    border: "1px dashed #3a4352",
    borderRadius: "10px",
    color: "#8d96a6",
    fontSize: "12px",
    textAlign: "center"
  },

  requisitoNumerico: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 100px 42px",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    border: "1px solid #303846",
    borderRadius: "10px",
    background: "#171b24"
  },

  requisitoNarrativoEditor: {
    display: "grid",
    gridTemplateColumns: "34px minmax(0, 1fr) 42px",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    border: "1px solid #303846",
    borderRadius: "10px",
    background: "#171b24"
  },

  requisitoVisual: {
    display: "grid",
    gridTemplateColumns: "34px minmax(0, 1fr) auto",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    border: "1px solid #303846",
    borderRadius: "10px",
    background: "#171b24"
  },

  iconeCumprido: {
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    border: "1px solid #4caf78",
    fontWeight: "bold"
  },

  iconePendente: {
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    border: "1px solid #d0a22a",
    fontWeight: "bold"
  },

  input: {
    width: "100%"
  },

  textareaNarrativo: {
    width: "100%",
    minHeight: "42px",
    resize: "vertical"
  },

  botaoRemover: {
    width: "42px",
    height: "42px",
    padding: 0
  },

  adicionarNarrativo: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: "10px",
    marginTop: "14px"
  },

  resumo: {
    marginTop: "14px",
    padding: "12px",
    border: "1px solid #303846",
    borderRadius: "10px",
    background: "#171b24",
    color: "#b8c0ce",
    fontSize: "12px",
    lineHeight: "1.5"
  }
};


/* ========================================
   CATÁLOGO DE ATRIBUTOS
======================================== */

function normalizarCatalogoAtributos(
  catalogo
) {
  const origem =
    Array.isArray(
      catalogo
    ) &&
    catalogo.length > 0
      ? catalogo
      : ATRIBUTOS_PADRAO;


  const encontrados =
    new Set();


  return origem
    .map(
      item => {
        if (
          typeof item ===
          "string"
        ) {
          const chave =
            item.trim();


          if (!chave) {
            return null;
          }


          const padrao =
            ATRIBUTOS_PADRAO.find(
              atributo =>
                atributo.chave ===
                chave
            );


          return {
            chave,

            nome:
              padrao?.nome ||
              chave
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
          String(
            item.chave ||
            item.id ||
            ""
          ).trim();


        if (!chave) {
          return null;
        }


        return {
          ...item,

          chave,

          nome:
            String(
              item.nome ||
              item.rotulo ||
              chave
            )
        };
      }
    )
    .filter(Boolean)
    .filter(
      item => {
        if (
          encontrados.has(
            item.chave
          )
        ) {
          return false;
        }


        encontrados.add(
          item.chave
        );


        return true;
      }
    );
}


function obterNomeAtributo(
  chave,
  catalogo
) {
  return (
    catalogo.find(
      atributo =>
        atributo.chave ===
        chave
    )?.nome ||
    chave
  );
}


/* ========================================
   ID ESTÁVEL PARA DADOS ANTIGOS
======================================== */

function hashTexto(
  texto
) {
  let hash = 0;


  for (
    let indice = 0;
    indice < texto.length;
    indice += 1
  ) {
    hash =
      (
        hash * 31 +
        texto.charCodeAt(
          indice
        )
      ) | 0;
  }


  return Math.abs(
    hash
  ).toString(
    36
  );
}


function criarIdNarrativoLegado(
  texto,
  indice
) {
  return (
    `narrativo-legado-${indice}-${hashTexto(texto)}`
  );
}


function criarNovoIdNarrativo() {
  return (
    `narrativo-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`
  );
}


/* ========================================
   NORMALIZAR REQUISITOS NARRATIVOS

   Formato novo:

   {
     id,
     texto,
     cumprido
   }

   Compatibilidade aceita:

   [
     "Treinar movimentos giratórios"
   ]

   e texto com várias linhas.
======================================== */

export function normalizarRequisitosNarrativos(
  requisitos,
  opcoes = {}
) {
  const assumirCumpridos =
    Boolean(
      opcoes
        ?.assumirCumpridos
    );


  let origem = [];


  if (
    typeof requisitos ===
    "string"
  ) {
    origem =
      requisitos
        .split("\n")
        .map(
          texto =>
            texto.trim()
        )
        .filter(Boolean);

  } else if (
    Array.isArray(
      requisitos
    )
  ) {
    origem =
      requisitos;
  }


  return origem
    .map(
      (
        requisito,
        indice
      ) => {
        if (
          typeof requisito ===
          "string"
        ) {
          const texto =
            requisito.trim();


          if (!texto) {
            return null;
          }


          return {
            id:
              criarIdNarrativoLegado(
                texto,
                indice
              ),

            texto,

            cumprido:
              assumirCumpridos
          };
        }


        if (
          !requisito ||
          typeof requisito !==
          "object"
        ) {
          return null;
        }


        const texto =
          String(
            requisito.texto ||
            requisito.descricao ||
            requisito.nome ||
            requisito.requisito ||
            ""
          ).trim();


        if (!texto) {
          return null;
        }


        const possuiEstadoExplicito =
          Object.prototype
            .hasOwnProperty
            .call(
              requisito,
              "cumprido"
            ) ||
          Object.prototype
            .hasOwnProperty
            .call(
              requisito,
              "concluido"
            ) ||
          Object.prototype
            .hasOwnProperty
            .call(
              requisito,
              "feito"
            );


        const cumprido =
          possuiEstadoExplicito
            ? Boolean(
                requisito.cumprido ??
                requisito.concluido ??
                requisito.feito
              )
            : assumirCumpridos;


        const idSalvo =
          String(
            requisito.id ||
            ""
          ).trim();


        return {
          ...requisito,

          id:
            idSalvo ||
            criarIdNarrativoLegado(
              texto,
              indice
            ),

          texto,

          cumprido
        };
      }
    )
    .filter(Boolean);
}


/* ========================================
   VERIFICAÇÃO NARRATIVA
======================================== */

export function requisitosNarrativosCumpridos(
  requisitosNarrativos = []
) {
  const narrativos =
    normalizarRequisitosNarrativos(
      requisitosNarrativos
    );


  if (
    narrativos.length ===
    0
  ) {
    return true;
  }


  return narrativos.every(
    requisito =>
      requisito.cumprido
  );
}


/* ========================================
   EDITOR DE REQUISITOS
======================================== */

export function EditorRequisitosTecnica({
  requisitosAtributos = {},
  requisitosNarrativos = [],
  atributosDisponiveis = null,

  onAlterarAtributo,
  onRemoverAtributo,
  onAlterarNarrativos
}) {
  const [
    novoNarrativo,
    setNovoNarrativo
  ] = useState("");


  const catalogo =
    normalizarCatalogoAtributos(
      atributosDisponiveis
    );


  const narrativos =
    normalizarRequisitosNarrativos(
      requisitosNarrativos
    );


  const atributosNaoUsados =
    catalogo.filter(
      atributo =>
        !Object.prototype
          .hasOwnProperty
          .call(
            requisitosAtributos,
            atributo.chave
          )
    );


  function adicionarAtributo(
    chave
  ) {
    if (!chave) {
      return;
    }


    if (
      Object.prototype
        .hasOwnProperty
        .call(
          requisitosAtributos,
          chave
        )
    ) {
      return;
    }


    onAlterarAtributo?.(
      chave,
      ""
    );
  }


  function atualizarNarrativo(
    id,
    alteracoes
  ) {
    const atualizados =
      narrativos.map(
        requisito =>
          requisito.id ===
          id
            ? {
                ...requisito,
                ...alteracoes
              }
            : requisito
      );


    onAlterarNarrativos?.(
      atualizados
    );
  }


  function removerNarrativo(
    id
  ) {
    onAlterarNarrativos?.(
      narrativos.filter(
        requisito =>
          requisito.id !==
          id
      )
    );
  }


  function adicionarNarrativo() {
    const texto =
      String(
        novoNarrativo ||
        ""
      ).trim();


    if (!texto) {
      return;
    }


    onAlterarNarrativos?.([
      ...narrativos,

      {
        id:
          criarNovoIdNarrativo(),

        texto,

        cumprido:
          false
      }
    ]);


    setNovoNarrativo("");
  }


  return (
    <div style={estilos.area}>

      <section style={estilos.bloco}>

        <h3 style={estilos.titulo}>
          REQUISITOS VERIFICÁVEIS
        </h3>


        <p style={estilos.textoAjuda}>
          Estes requisitos são conferidos
          automaticamente usando os dados da ficha.
          A campanha decide quais atributos podem
          aparecer aqui.
        </p>


        {Object.entries(
          requisitosAtributos
        ).length === 0 ? (

          <div style={estilos.vazio}>
            Nenhum requisito automático cadastrado.
          </div>

        ) : (

          <div style={estilos.grid}>

            {Object.entries(
              requisitosAtributos
            ).map(
              ([
                chave,
                valor
              ]) => (

                <div
                  key={chave}
                  style={
                    estilos.requisitoNumerico
                  }
                >

                  <div>

                    <span style={estilos.etiqueta}>
                      ATRIBUTO
                    </span>

                    <strong>
                      {obterNomeAtributo(
                        chave,
                        catalogo
                      )}
                    </strong>

                  </div>


                  <label>

                    <span style={estilos.etiqueta}>
                      MÍNIMO
                    </span>

                    <input
                      type="number"
                      min="0"
                      value={valor}
                      onChange={
                        evento =>
                          onAlterarAtributo?.(
                            chave,
                            evento
                              .target
                              .value
                          )
                      }
                      placeholder="0"
                      style={estilos.input}
                    />

                  </label>


                  <button
                    type="button"
                    className="delete-button"
                    title="Remover requisito"
                    style={
                      estilos.botaoRemover
                    }
                    onClick={() =>
                      onRemoverAtributo?.(
                        chave
                      )
                    }
                  >
                    ×
                  </button>

                </div>

              )
            )}

          </div>

        )}


        {atributosNaoUsados.length >
          0 && (

          <div
            style={{
              marginTop:
                "16px"
            }}
          >

            <label>
              Adicionar requisito automático
            </label>


            <select
              defaultValue=""
              onChange={
                evento => {
                  adicionarAtributo(
                    evento
                      .target
                      .value
                  );

                  evento.target.value =
                    "";
                }
              }
            >

              <option
                value=""
                disabled
              >
                Escolha um atributo
              </option>


              {atributosNaoUsados.map(
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

          </div>

        )}

      </section>


      <section style={estilos.bloco}>

        <h3 style={estilos.titulo}>
          REQUISITOS NARRATIVOS
        </h3>


        <p style={estilos.textoAjuda}>
          História, treinamentos, domínio elemental,
          conquistas ou outras condições que o
          computador não consegue descobrir sozinho.
          O cumprimento é registrado manualmente.
        </p>


        {narrativos.length ===
        0 ? (

          <div style={estilos.vazio}>
            Nenhum requisito narrativo cadastrado.
          </div>

        ) : (

          <div style={estilos.grid}>

            {narrativos.map(
              requisito => (

                <div
                  key={
                    requisito.id
                  }
                  style={
                    estilos.requisitoNarrativoEditor
                  }
                >

                  <input
                    type="checkbox"
                    checked={
                      requisito.cumprido
                    }
                    title={
                      requisito.cumprido
                        ? "Requisito cumprido"
                        : "Marcar como cumprido"
                    }
                    onChange={
                      evento =>
                        atualizarNarrativo(
                          requisito.id,
                          {
                            cumprido:
                              evento
                                .target
                                .checked
                          }
                        )
                    }
                  />


                  <textarea
                    rows="2"
                    value={
                      requisito.texto
                    }
                    style={
                      estilos.textareaNarrativo
                    }
                    onChange={
                      evento =>
                        atualizarNarrativo(
                          requisito.id,
                          {
                            texto:
                              evento
                                .target
                                .value
                          }
                        )
                    }
                  />


                  <button
                    type="button"
                    className="delete-button"
                    title="Remover requisito narrativo"
                    style={
                      estilos.botaoRemover
                    }
                    onClick={() =>
                      removerNarrativo(
                        requisito.id
                      )
                    }
                  >
                    ×
                  </button>

                </div>

              )
            )}

          </div>

        )}


        <div style={estilos.adicionarNarrativo}>

          <input
            type="text"
            value={
              novoNarrativo
            }
            placeholder="Ex.: Desenvolver controle do elemento Raio"
            onChange={
              evento =>
                setNovoNarrativo(
                  evento
                    .target
                    .value
                )
            }
            onKeyDown={
              evento => {
                if (
                  evento.key ===
                  "Enter"
                ) {
                  evento.preventDefault();

                  adicionarNarrativo();
                }
              }
            }
          />


          <button
            type="button"
            onClick={
              adicionarNarrativo
            }
          >
            ＋ ADICIONAR
          </button>

        </div>


        <div style={estilos.resumo}>

          <strong>
            Como funciona:
          </strong>

          {" "}

          requisitos automáticos são conferidos pela
          ficha. Requisitos narrativos são marcados
          manualmente quando realmente forem
          cumpridos.

        </div>

      </section>

    </div>
  );
}


/* ========================================
   VISUALIZADOR DOS REQUISITOS
======================================== */

export function VisualizadorRequisitosTecnica({
  requisitosAtributos = {},
  requisitosNarrativos = [],
  atributosJogador = {},
  atributosDisponiveis = null
}) {
  const catalogo =
    normalizarCatalogoAtributos(
      atributosDisponiveis
    );


  const narrativos =
    normalizarRequisitosNarrativos(
      requisitosNarrativos
    );


  const numericos =
    Object.entries(
      requisitosAtributos
    );


  const possuiRequisitos =
    numericos.length > 0 ||
    narrativos.length > 0;


  const numericosCumpridos =
    numericos.every(
      ([
        chave,
        minimo
      ]) => {
        const atual =
          Number(
            atributosJogador[
              chave
            ]
          ) || 0;


        const necessario =
          Number(
            minimo
          ) || 0;


        return (
          atual >=
          necessario
        );
      }
    );


  const narrativosOk =
    requisitosNarrativosCumpridos(
      narrativos
    );


  const todosCumpridos =
    numericosCumpridos &&
    narrativosOk;


  if (!possuiRequisitos) {
    return (
      <div style={estilos.vazio}>
        Nenhum requisito de aprendizagem cadastrado.
      </div>
    );
  }


  return (
    <div style={estilos.area}>

      {numericos.length >
      0 && (

        <section style={estilos.bloco}>

          <h3 style={estilos.titulo}>
            REQUISITOS AUTOMÁTICOS
          </h3>


          <p style={estilos.textoAjuda}>
            Comparados automaticamente com os
            atributos atuais da ficha.
          </p>


          <div style={estilos.grid}>

            {numericos.map(
              ([
                chave,
                minimo
              ]) => {
                const atual =
                  Number(
                    atributosJogador[
                      chave
                    ]
                  ) || 0;


                const necessario =
                  Number(
                    minimo
                  ) || 0;


                const cumprido =
                  atual >=
                  necessario;


                return (
                  <div
                    key={chave}
                    style={
                      estilos.requisitoVisual
                    }
                  >

                    <div
                      style={
                        cumprido
                          ? estilos.iconeCumprido
                          : estilos.iconePendente
                      }
                    >
                      {cumprido
                        ? "✓"
                        : "✕"}
                    </div>


                    <div>

                      <span style={estilos.etiqueta}>
                        ATRIBUTO
                      </span>

                      <strong>
                        {obterNomeAtributo(
                          chave,
                          catalogo
                        )}
                      </strong>

                    </div>


                    <div
                      style={{
                        textAlign:
                          "right"
                      }}
                    >

                      <span style={estilos.etiqueta}>
                        ATUAL / NECESSÁRIO
                      </span>

                      <strong>
                        {atual}
                        {" / "}
                        {necessario}
                      </strong>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </section>

      )}


      {narrativos.length >
      0 && (

        <section style={estilos.bloco}>

          <h3 style={estilos.titulo}>
            REQUISITOS NARRATIVOS
          </h3>


          <p style={estilos.textoAjuda}>
            O cumprimento destes requisitos é
            confirmado manualmente de acordo com a
            campanha e com a narrativa.
          </p>


          <div style={estilos.grid}>

            {narrativos.map(
              requisito => (

                <div
                  key={
                    requisito.id
                  }
                  style={
                    estilos.requisitoVisual
                  }
                >

                  <div
                    style={
                      requisito.cumprido
                        ? estilos.iconeCumprido
                        : estilos.iconePendente
                    }
                  >
                    {requisito.cumprido
                      ? "✓"
                      : "○"}
                  </div>


                  <div>

                    <span style={estilos.etiqueta}>
                      NARRATIVO
                    </span>

                    <strong>
                      {requisito.texto}
                    </strong>

                  </div>


                  <span
                    style={{
                      color:
                        requisito.cumprido
                          ? "#8fd4a9"
                          : "#d8b85b",

                      fontSize:
                        "10px",

                      fontWeight:
                        "bold"
                    }}
                  >
                    {requisito.cumprido
                      ? "CUMPRIDO"
                      : "PENDENTE"}
                  </span>

                </div>

              )
            )}

          </div>

        </section>

      )}


      <div style={estilos.resumo}>

        <strong>
          {todosCumpridos
            ? "✓ Requisitos completos."
            : "◇ Ainda existem requisitos pendentes."}
        </strong>


        <div
          style={{
            marginTop:
              "5px"
          }}
        >
          Para a técnica ficar disponível para
          aprendizagem, tanto os requisitos
          automáticos quanto os narrativos precisam
          estar cumpridos.
        </div>

      </div>

    </div>
  );
}


export default EditorRequisitosTecnica;