import React, {
  useMemo,
  useState
} from "react";

import "./AnotacoesCampanha.css";

import {
  PAPEIS_CAMPANHA,
  VISIBILIDADES_ENTIDADE
} from "./campanhas.js";


function AnotacoesCampanha({
  campanha,
  anotacoes = [],
  participantes = [],
  usuarioAtualId,

  onVoltar,
  onCriarAnotacao,
  onAtualizarAnotacao,
  onExcluirAnotacao
}) {
  const [
    busca,
    setBusca
  ] = useState("");


  const [
    anotacaoSelecionadaId,
    setAnotacaoSelecionadaId
  ] = useState(null);


  const eMestre =
    campanha
      ?.acesso
      ?.papel ===
    PAPEIS_CAMPANHA.MESTRE;


  function obterParticipante(
    participanteId
  ) {
    return (
      participantes.find(
        participante =>
          participante.id ===
          participanteId
      ) ||
      null
    );
  }


  function obterNomeAutor(
    anotacao
  ) {
    return (
      obterParticipante(
        anotacao
          ?.proprietarioId
      )?.nome ||
      "Não identificado"
    );
  }


  function podeEditar(
    anotacao
  ) {
    if (!anotacao) {
      return false;
    }


    if (eMestre) {
      return true;
    }


    return (
      anotacao.proprietarioId ===
      usuarioAtualId
    );
  }


  function formatarData(
    timestamp
  ) {
    if (!timestamp) {
      return "";
    }


    try {
      return new Date(
        timestamp
      ).toLocaleString(
        "pt-BR",
        {
          dateStyle:
            "short",

          timeStyle:
            "short"
        }
      );

    } catch {
      return "";
    }
  }


  function obterNomeVisibilidade(
    anotacao
  ) {
    const visibilidade =
      anotacao?.visibilidade;


    if (
      visibilidade ===
      VISIBILIDADES_ENTIDADE
        .CAMPANHA
    ) {
      return "🌐 Campanha";
    }


    if (
      visibilidade ===
      VISIBILIDADES_ENTIDADE
        .MESTRE
    ) {
      return "👑 Mestre";
    }


    if (
      visibilidade ===
      VISIBILIDADES_ENTIDADE
        .RESTRITA
    ) {
      return "👥 Restrita";
    }


    return "🔒 Particular";
  }


  const anotacoesOrdenadas =
    useMemo(
      () => {
        const termo =
          busca
            .trim()
            .toLocaleLowerCase(
              "pt-BR"
            );


        return [
          ...anotacoes
        ]
          .filter(
            anotacao => {
              if (!termo) {
                return true;
              }


              const titulo =
                String(
                  anotacao.titulo ||
                  ""
                )
                  .toLocaleLowerCase(
                    "pt-BR"
                  );


              const texto =
                String(
                  anotacao.texto ||
                  ""
                )
                  .toLocaleLowerCase(
                    "pt-BR"
                  );


              return (
                titulo.includes(
                  termo
                ) ||
                texto.includes(
                  termo
                )
              );
            }
          )
          .sort(
            (a, b) => {
              const aFixada =
                Boolean(
                  a.fixada
                );


              const bFixada =
                Boolean(
                  b.fixada
                );


              if (
                aFixada !==
                bFixada
              ) {
                return aFixada
                  ? -1
                  : 1;
              }


              const dataA =
                Number(
                  a.atualizadaEm ||
                  a.criadaEm ||
                  0
                );


              const dataB =
                Number(
                  b.atualizadaEm ||
                  b.criadaEm ||
                  0
                );


              return (
                dataB -
                dataA
              );
            }
          );
      },
      [
        anotacoes,
        busca
      ]
    );


  const anotacaoSelecionada =
    anotacoes.find(
      anotacao =>
        anotacao.id ===
        anotacaoSelecionadaId
    ) ||
    null;


  function criarNovaAnotacao() {
    const novaAnotacao =
      onCriarAnotacao?.();


    if (
      novaAnotacao?.id
    ) {
      setAnotacaoSelecionadaId(
        novaAnotacao.id
      );
    }
  }


  function atualizarAnotacao(
    alteracoes
  ) {
    if (
      !anotacaoSelecionada
    ) {
      return;
    }


    if (
      !podeEditar(
        anotacaoSelecionada
      )
    ) {
      return;
    }


    onAtualizarAnotacao?.(
      anotacaoSelecionada.id,
      alteracoes
    );
  }


  function excluirAnotacao() {
    if (
      !anotacaoSelecionada
    ) {
      return;
    }


    if (
      !podeEditar(
        anotacaoSelecionada
      )
    ) {
      return;
    }


    const titulo =
      anotacaoSelecionada
        .titulo ||
      "Sem título";


    const confirmou =
      window.confirm(
        `Excluir a anotação "${titulo}"?`
      );


    if (!confirmou) {
      return;
    }


    onExcluirAnotacao?.(
      anotacaoSelecionada.id
    );


    setAnotacaoSelecionadaId(
      null
    );
  }


  return (
    <div className="anotacoes-campanha">

      <header className="anotacoes-topo">

        <button
          type="button"
          className="anotacoes-voltar"
          onClick={
            onVoltar
          }
        >
          ←
        </button>


        <div className="anotacoes-topo-identidade">

          <p className="anotacoes-etiqueta">
            CAMPANHA
          </p>


          <h1>
            📝 Anotações
          </h1>


          <p className="anotacoes-subtitulo">
            Bloco de notas de{" "}
            {
              campanha?.nome ||
              "Campanha"
            }.
          </p>

        </div>


        <button
          type="button"
          className="anotacoes-nova"
          onClick={
            criarNovaAnotacao
          }
        >
          ＋ NOVA ANOTAÇÃO
        </button>

      </header>


      <main className="anotacoes-conteudo">

        <aside className="anotacoes-lista-area">

          <label className="anotacoes-busca">

            <span>
              🔎
            </span>


            <input
              type="text"
              value={
                busca
              }
              onChange={
                evento =>
                  setBusca(
                    evento.target.value
                  )
              }
              placeholder=
                "Buscar anotações..."
            />

          </label>


          <div className="anotacoes-lista">

            {
              anotacoesOrdenadas.length ===
              0
                ? (

                  <div className="anotacoes-vazio">

                    <span className="anotacoes-vazio-icone">
                      📝
                    </span>


                    <strong>
                      Nenhuma anotação
                    </strong>


                    <p>
                      Crie uma nota para
                      registrar ideias,
                      lembretes ou informações
                      da campanha.
                    </p>

                  </div>

                )
                : (

                  anotacoesOrdenadas.map(
                    anotacao => {

                      const selecionada =
                        anotacao.id ===
                        anotacaoSelecionadaId;


                      return (
                        <button
                          key={
                            anotacao.id
                          }
                          type="button"
                          className={
                            selecionada
                              ? "anotacoes-item anotacoes-item-ativo"
                              : "anotacoes-item"
                          }
                          onClick={() =>
                            setAnotacaoSelecionadaId(
                              anotacao.id
                            )
                          }
                        >

                          <div className="anotacoes-item-topo">

                            <strong>

                              {
                                anotacao.fixada
                                  ? "📌 "
                                  : ""
                              }

                              {
                                anotacao.titulo ||
                                "Sem título"
                              }

                            </strong>


                            <span>
                              {
                                obterNomeVisibilidade(
                                  anotacao
                                )
                              }
                            </span>

                          </div>


                          <p>

                            {
                              anotacao.texto ||
                              "Anotação vazia"
                            }

                          </p>


                          <small>

                            {
                              formatarData(
                                anotacao.atualizadaEm ||
                                anotacao.criadaEm
                              )
                            }

                          </small>

                        </button>
                      );
                    }
                  )

                )
            }

          </div>

        </aside>


        <section className="anotacoes-editor">

          {
            !anotacaoSelecionada
              ? (

                <div className="anotacoes-editor-vazio">

                  <span>
                    ✍️
                  </span>


                  <h2>
                    Selecione uma anotação
                  </h2>


                  <p>
                    Ou crie uma nova para
                    começar a escrever.
                  </p>

                </div>

              )
              : (

                <>

                  <div className="anotacoes-editor-topo">

                    <div>

                      <p className="anotacoes-etiqueta">
                        ANOTAÇÃO
                      </p>


                      <span className="anotacoes-autor">

                        Autor:{" "}

                        <strong>

                          {
                            obterNomeAutor(
                              anotacaoSelecionada
                            )
                          }

                        </strong>

                      </span>

                    </div>


                    <span className="anotacoes-salvo">
                      ✓ SALVO AUTOMATICAMENTE
                    </span>

                  </div>


                  <input
                    className="anotacoes-titulo"
                    type="text"
                    value={
                      anotacaoSelecionada
                        .titulo ||
                      ""
                    }
                    readOnly={
                      !podeEditar(
                        anotacaoSelecionada
                      )
                    }
                    onChange={
                      evento =>
                        atualizarAnotacao({
                          titulo:
                            evento.target.value
                        })
                    }
                    placeholder=
                      "Título da anotação"
                  />


                  <textarea
                    className="anotacoes-texto"
                    value={
                      anotacaoSelecionada
                        .texto ||
                      ""
                    }
                    readOnly={
                      !podeEditar(
                        anotacaoSelecionada
                      )
                    }
                    onChange={
                      evento =>
                        atualizarAnotacao({
                          texto:
                            evento.target.value
                        })
                    }
                    placeholder=
                      "Escreva aqui..."
                  />

                  <input
                    className="anotacoes-titulo"
                    type="text"
                    value={(anotacaoSelecionada.tags || []).join(", ")}
                    readOnly={!podeEditar(anotacaoSelecionada)}
                    onChange={evento => atualizarAnotacao({
                      tags: evento.target.value.split(",").map(tag => tag.trim()).filter(Boolean)
                    })}
                    placeholder="Tags separadas por vírgula"
                  />


                  <div className="anotacoes-opcoes">

                    <label className="anotacoes-opcao-visibilidade">

                      <span>
                        VISIBILIDADE
                      </span>


                      <select
                        value={
                          anotacaoSelecionada
                            .visibilidade ||
                          VISIBILIDADES_ENTIDADE
                            .PROPRIETARIO
                        }
                        disabled={
                          !podeEditar(
                            anotacaoSelecionada
                          )
                        }
                        onChange={
                          evento =>
                            atualizarAnotacao({
                              visibilidade:
                                evento.target.value
                            })
                        }
                      >

                        <option
                          value={
                            VISIBILIDADES_ENTIDADE
                              .PROPRIETARIO
                          }
                        >
                          🔒 Particular
                        </option>


                        <option
                          value={
                            VISIBILIDADES_ENTIDADE
                              .MESTRE
                          }
                        >
                          👑 Mestre + autor
                        </option>


                        <option
                          value={
                            VISIBILIDADES_ENTIDADE
                              .CAMPANHA
                          }
                        >
                          🌐 Toda a campanha
                        </option>

                      </select>

                    </label>


                    <label className="anotacoes-fixar">

                      <input
                        type="checkbox"
                        checked={
                          Boolean(
                            anotacaoSelecionada
                              .fixada
                          )
                        }
                        disabled={
                          !podeEditar(
                            anotacaoSelecionada
                          )
                        }
                        onChange={
                          evento =>
                            atualizarAnotacao({
                              fixada:
                                evento.target.checked
                            })
                        }
                      />

                      <span>
                        📌 Fixar anotação
                      </span>

                    </label>

                  </div>


                  <footer className="anotacoes-editor-rodape">

                    <span>

                      Última alteração:{" "}

                      {
                        formatarData(
                          anotacaoSelecionada
                            .atualizadaEm ||
                          anotacaoSelecionada
                            .criadaEm
                        )
                      }

                    </span>


                    {
                      podeEditar(
                        anotacaoSelecionada
                      ) && (

                        <button
                          type="button"
                          className="anotacoes-excluir"
                          onClick={
                            excluirAnotacao
                          }
                        >
                          🗑 EXCLUIR
                        </button>

                      )
                    }

                  </footer>

                </>

              )
          }

        </section>

      </main>

    </div>
  );
}


export default AnotacoesCampanha;
