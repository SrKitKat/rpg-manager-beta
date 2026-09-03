import React, {
  useState
} from "react";

import "./AreaEntidades.css";

import ClassificacaoEntidade
  from "./ClassificacaoEntidade.jsx";

import {
  PAPEIS_CAMPANHA,
  TIPOS_ENTIDADE,
  VISIBILIDADES_ENTIDADE,

  possuiPermissao,
  podeVisualizarEntidade,
  podeEditarEntidade,
  podeExcluirEntidade,
  entidadeEstaArquivada
} from "../campanhas/campanhas.js";


export const AREAS_ENTIDADES = {
  npcs: {
    tipo:
      TIPOS_ENTIDADE.NPC,

    permissao:
      "criarNPCs",

    titulo:
      "NPCs",

    singular:
      "NPC",

    icone:
      "🎭",

    descricao:
      "Personagens da campanha organizados como NPCs."
  },

  adversarios: {
    tipo:
      TIPOS_ENTIDADE.ADVERSARIO,

    permissao:
      "criarAdversarios",

    titulo:
      "Adversários",

    singular:
      "Adversário",

    icone:
      "⚔️",

    descricao:
      "Personagens, grupos ou entidades organizados como oposição."
  },

  monstros: {
    tipo:
      TIPOS_ENTIDADE.MONSTRO,

    permissao:
      "criarMonstros",

    titulo:
      "Monstros",

    singular:
      "Monstro",

    icone:
      "👹",

    descricao:
      "Criaturas e entidades organizadas nesta categoria."
  },

  auxiliares: {
    tipo:
      TIPOS_ENTIDADE.AUXILIAR,

    permissao:
      "criarAuxiliares",

    titulo:
      "Auxiliares",

    singular:
      "Auxiliar",

    icone:
      "🧰",

    descricao:
      "Entidades e recursos auxiliares utilizados durante a campanha."
  }
};


export function encontrarAreaPorTipo(
  tipo
) {
  return (
    Object.entries(
      AREAS_ENTIDADES
    ).find(
      ([, configuracao]) =>
        configuracao.tipo ===
        tipo
    )?.[0] ||
    null
  );
}


function AreaEntidades({
  area,

  campanha,

  entidades = [],

  participantes = [],

  usuarioAtualId,

  onVoltar,

  onNovaEntidade,

  onAbrirEntidade,

  onArquivarEntidade,

  onExcluirEntidade,

  onAlterarVisibilidadeEntidade,

  onAlterarTipoEntidade
}) {
  const [
    busca,
    setBusca
  ] = useState("");


  const [
    entidadeParaArquivar,
    setEntidadeParaArquivar
  ] = useState(null);


  const [
    motivoArquivamento,
    setMotivoArquivamento
  ] = useState("");


  const configuracao =
    AREAS_ENTIDADES[
      area
    ] ||
    null;


  if (
    !configuracao ||
    !campanha
  ) {
    return (
      <main className="area-entidades">

        <section className="area-entidades-vazio">

          <h2>
            Área não encontrada
          </h2>


          <button
            type="button"
            className="area-entidades-botao"
            onClick={
              onVoltar
            }
          >
            ← VOLTAR
          </button>

        </section>

      </main>
    );
  }


  const eMestre =
    campanha
      ?.acesso
      ?.papel ===
    PAPEIS_CAMPANHA.MESTRE;


  const podeCriar =
    possuiPermissao(
      campanha,
      configuracao.permissao
    );


  function obterParticipante(
    id
  ) {
    return (
      participantes.find(
        participante =>
          participante.id ===
          id
      ) ||
      null
    );
  }


  function obterNomeProprietario(
    entidade
  ) {
    return (
      obterParticipante(
        entidade
          ?.proprietarioId
      )?.nome ||
      "Não identificado"
    );
  }


  function obterNomeVisibilidade(
    entidade
  ) {
    switch (
      entidade?.visibilidade
    ) {
      case VISIBILIDADES_ENTIDADE
        .PROPRIETARIO:

        return "Privada";


      case VISIBILIDADES_ENTIDADE
        .MESTRE:

        return "Mestre";


      case VISIBILIDADES_ENTIDADE
        .RESTRITA:

        return "Restrita";


      default:

        return "Campanha";
    }
  }


  function obterIconeVisibilidade(
    entidade
  ) {
    switch (
      entidade?.visibilidade
    ) {
      case VISIBILIDADES_ENTIDADE
        .CAMPANHA:

        return "🌐";


      case VISIBILIDADES_ENTIDADE
        .RESTRITA:

        return "👥";


      default:

        return "🔒";
    }
  }


  const termo =
    busca
      .trim()
      .toLocaleLowerCase(
        "pt-BR"
      );


  const entidadesDaArea =
    entidades
      .filter(
        entidade => {
          if (
            entidadeEstaArquivada(
              entidade
            )
          ) {
            return false;
          }


          if (
            entidade.tipoEntidade !==
            configuracao.tipo
          ) {
            return false;
          }


          if (
            !podeVisualizarEntidade(
              campanha,
              entidade
            )
          ) {
            return false;
          }


          if (!termo) {
            return true;
          }


          const nome =
            String(
              entidade.nome ||
              ""
            )
              .toLocaleLowerCase(
                "pt-BR"
              );


          const proprietario =
            obterNomeProprietario(
              entidade
            )
              .toLocaleLowerCase(
                "pt-BR"
              );


          return (
            nome.includes(
              termo
            ) ||
            proprietario.includes(
              termo
            )
          );
        }
      )
      .sort(
        (a, b) =>
          String(
            a.nome ||
            ""
          )
            .localeCompare(
              String(
                b.nome ||
                ""
              ),
              "pt-BR",
              {
                sensitivity:
                  "base"
              }
            )
      );


  function confirmarArquivamento() {
    if (
      !entidadeParaArquivar
    ) {
      return;
    }


    onArquivarEntidade?.(
      entidadeParaArquivar,
      motivoArquivamento
    );


    setEntidadeParaArquivar(
      null
    );


    setMotivoArquivamento(
      ""
    );
  }


  function MenuAcoes({
    entidade
  }) {
    const podeEditar =
      podeEditarEntidade(
        campanha,
        entidade
      );


    const podeExcluir =
      podeExcluirEntidade(
        campanha,
        entidade
      );


    if (
      !podeEditar &&
      !podeExcluir
    ) {
      return null;
    }


    return (
      <details className="area-entidades-acoes">

        <summary>
          ⋯ AÇÕES
        </summary>


        <div className="area-entidades-acoes-menu">

          {eMestre &&
            typeof onAlterarTipoEntidade ===
              "function" && (

              <ClassificacaoEntidade
                entidade={
                  entidade
                }
                podeAlterar
                modo="acao"
                onAlterar={
                  onAlterarTipoEntidade
                }
              />

            )}


          {podeEditar &&
            typeof onAlterarVisibilidadeEntidade ===
              "function" && (

              <label className="area-entidades-visibilidade">

                <span>
                  VISIBILIDADE
                </span>


                <select
                  value={
                    entidade.visibilidade ||
                    VISIBILIDADES_ENTIDADE.MESTRE
                  }
                  onChange={
                    evento =>
                      onAlterarVisibilidadeEntidade(
                        entidade,
                        evento.target.value
                      )
                  }
                >

                  <option
                    value={
                      VISIBILIDADES_ENTIDADE.MESTRE
                    }
                  >
                    👑 Mestre + proprietário
                  </option>


                  <option
                    value={
                      VISIBILIDADES_ENTIDADE.PROPRIETARIO
                    }
                  >
                    🔒 Privada
                  </option>


                  <option
                    value={
                      VISIBILIDADES_ENTIDADE.CAMPANHA
                    }
                  >
                    🌐 Toda a campanha
                  </option>

                </select>

              </label>

            )}


          {podeEditar && (

            <button
              type="button"
              onClick={() => {
                setEntidadeParaArquivar(
                  entidade
                );

                setMotivoArquivamento(
                  ""
                );
              }}
            >
              📦 Arquivar
            </button>

          )}


          {podeExcluir && (

            <button
              type="button"
              className="area-entidades-perigo"
              onClick={() =>
                onExcluirEntidade?.(
                  entidade
                )
              }
            >
              🗑 Excluir permanentemente
            </button>

          )}

        </div>

      </details>
    );
  }


  function CardEntidade({
    entidade
  }) {
    const proprietario =
      obterNomeProprietario(
        entidade
      );


    const mostrarProprietario =
      eMestre ||
      entidade.proprietarioId !==
        usuarioAtualId;


    return (
      <article className="area-entidades-card">

        <div className="area-entidades-avatar">

          {entidade.imagem ? (

            <img
              src={
                entidade.imagem
              }
              alt={
                entidade.nome
              }
            />

          ) : (

            <span>
              {configuracao.icone}
            </span>

          )}

        </div>


        <div className="area-entidades-card-info">

          <div className="area-entidades-card-titulo">

            <h3>
              {entidade.nome}
            </h3>


            <ClassificacaoEntidade
              entidade={
                entidade
              }
              podeAlterar={
                eMestre
              }
              onAlterar={
                onAlterarTipoEntidade
              }
            />

          </div>


          <p>
            {entidade.posicao ||
              entidade
                ?.informacoes
                ?.posicao ||
              "Sem função adicional"}
          </p>


          <div className="area-entidades-meta">

            {mostrarProprietario && (

              <span>
                👤 {proprietario}
              </span>

            )}


            <span>

              {obterIconeVisibilidade(
                entidade
              )}{" "}

              {obterNomeVisibilidade(
                entidade
              )}

            </span>

          </div>

        </div>


        <div className="area-entidades-card-acoes">

          <button
            type="button"
            className="area-entidades-botao"
            onClick={() =>
              onAbrirEntidade?.(
                entidade,
                area
              )
            }
          >
            ABRIR →
          </button>


          <MenuAcoes
            entidade={
              entidade
            }
          />

        </div>

      </article>
    );
  }


  return (
    <div className="area-entidades">

      <header className="area-entidades-topo">

        <button
          type="button"
          className="area-entidades-voltar"
          onClick={
            onVoltar
          }
        >
          ←
        </button>


        <div className="area-entidades-identidade">

          <span className="area-entidades-icone">
            {configuracao.icone}
          </span>


          <div>

            <p>
              {eMestre
                ? "MESTRAGEM"
                : "COLABORAÇÃO"}
            </p>


            <h1>
              {configuracao.titulo}
            </h1>


            <span>
              {configuracao.descricao}
            </span>

          </div>

        </div>


        {podeCriar && (

          <button
            type="button"
            className="area-entidades-novo"
            onClick={() =>
              onNovaEntidade?.(
                configuracao.tipo,
                area
              )
            }
          >
            ＋ NOVO{" "}
            {configuracao
              .singular
              .toUpperCase()}
          </button>

        )}

      </header>


      <main className="area-entidades-conteudo">

        <section className="area-entidades-ferramentas">

          <label className="area-entidades-busca">

            <span>
              🔎
            </span>


            <input
              value={
                busca
              }
              onChange={
                evento =>
                  setBusca(
                    evento.target.value
                  )
              }
              placeholder={
                `Buscar em ${configuracao.titulo.toLowerCase()}...`
              }
            />

          </label>


          <span className="area-entidades-contador">

            {entidadesDaArea.length}{" "}

            {entidadesDaArea.length ===
              1
              ? "item ativo"
              : "itens ativos"}

          </span>

        </section>


        {entidadesDaArea.length ===
          0 ? (

          <section className="area-entidades-vazio">

            <span className="area-entidades-vazio-icone">
              {configuracao.icone}
            </span>


            <h2>

              Nenhum{" "}

              {configuracao
                .singular
                .toLowerCase()}{" "}

              ativo

            </h2>


            <p>
              {podeCriar
                ? `Crie o primeiro ${configuracao.singular.toLowerCase()} desta campanha.`
                : "Nenhuma entidade visível foi encontrada nesta área."}
            </p>


            {podeCriar && (

              <button
                type="button"
                className="area-entidades-novo"
                onClick={() =>
                  onNovaEntidade?.(
                    configuracao.tipo,
                    area
                  )
                }
              >
                ＋ CRIAR{" "}
                {configuracao
                  .singular
                  .toUpperCase()}
              </button>

            )}

          </section>

        ) : (

          <section className="area-entidades-lista">

            {entidadesDaArea.map(
              entidade => (

                <CardEntidade
                  key={
                    entidade.id
                  }
                  entidade={
                    entidade
                  }
                />

              )
            )}

          </section>

        )}

      </main>


      {entidadeParaArquivar && (

        <div
          className="area-entidades-modal-fundo"
          onMouseDown={() =>
            setEntidadeParaArquivar(
              null
            )
          }
        >

          <section
            className="area-entidades-modal"
            onMouseDown={
              evento =>
                evento.stopPropagation()
            }
          >

            <p className="area-entidades-modal-etiqueta">
              ARQUIVAR
            </p>


            <h2>
              {entidadeParaArquivar.nome}
            </h2>


            <p>
              A entidade deixará esta área
              ativa, mas continuará preservada
              nos Arquivos da Campanha.
            </p>


            <label>

              <span>
                Motivo do arquivamento
              </span>


              <textarea
                rows="4"
                value={
                  motivoArquivamento
                }
                onChange={
                  evento =>
                    setMotivoArquivamento(
                      evento.target.value
                    )
                }
                placeholder="Opcional..."
                autoFocus
              />

            </label>


            <div className="area-entidades-modal-acoes">

              <button
                type="button"
                className="area-entidades-botao"
                onClick={() =>
                  setEntidadeParaArquivar(
                    null
                  )
                }
              >
                CANCELAR
              </button>


              <button
                type="button"
                className="area-entidades-novo"
                onClick={
                  confirmarArquivamento
                }
              >
                📦 ARQUIVAR
              </button>

            </div>

          </section>

        </div>

      )}

    </div>
  );
}


export default AreaEntidades;