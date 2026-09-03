import React from "react";

import "./ClassificacaoEntidade.css";

import {
  TIPOS_ENTIDADE
} from "../campanhas/campanhas.js";


const OPCOES_CLASSIFICACAO = [
  {
    valor:
      TIPOS_ENTIDADE.PERSONAGEM,

    nome:
      "Personagem",

    icone:
      "👤"
  },

  {
    valor:
      TIPOS_ENTIDADE.NPC,

    nome:
      "NPC",

    icone:
      "🎭"
  },

  {
    valor:
      TIPOS_ENTIDADE.ADVERSARIO,

    nome:
      "Adversário",

    icone:
      "⚔️"
  },

  {
    valor:
      TIPOS_ENTIDADE.MONSTRO,

    nome:
      "Monstro",

    icone:
      "👹"
  },

  {
    valor:
      TIPOS_ENTIDADE.AUXILIAR,

    nome:
      "Auxiliar",

    icone:
      "🧰"
  }
];


export function obterConfiguracaoTipo(
  tipo
) {
  return (
    OPCOES_CLASSIFICACAO.find(
      opcao =>
        opcao.valor === tipo
    ) ||
    OPCOES_CLASSIFICACAO[0]
  );
}


function ClassificacaoEntidade({
  entidade,

  podeAlterar = false,

  onAlterar,

  modo = "selo"
}) {
  const tipoAtual =
    entidade
      ?.tipoEntidade ||
    TIPOS_ENTIDADE.PERSONAGEM;


  const configuracaoAtual =
    obterConfiguracaoTipo(
      tipoAtual
    );


  function escolherTipo(
    evento,
    tipo
  ) {
    evento.preventDefault();
    evento.stopPropagation();


    if (
      tipo === tipoAtual
    ) {
      evento
        .currentTarget
        .closest("details")
        ?.removeAttribute(
          "open"
        );

      return;
    }


    onAlterar?.(
      entidade,
      tipo
    );


    evento
      .currentTarget
      .closest("details")
      ?.removeAttribute(
        "open"
      );
  }


  if (!podeAlterar) {
    return (
      <span className="classificacao-entidade-selo classificacao-entidade-selo-estatico">

        <span>
          {configuracaoAtual.icone}
        </span>


        {configuracaoAtual.nome}

      </span>
    );
  }


  return (
    <details
      className={
        modo === "acao"
          ? "classificacao-entidade classificacao-entidade-acao"
          : "classificacao-entidade"
      }
    >

      <summary
        className={
          modo === "acao"
            ? "classificacao-entidade-resumo classificacao-entidade-resumo-acao"
            : "classificacao-entidade-resumo classificacao-entidade-selo"
        }
      >

        {modo === "acao" ? (

          <>
            <span className="classificacao-entidade-acao-icone">
              ↔
            </span>

            <span>
              Alterar classificação
            </span>
          </>

        ) : (

          <>
            <span>
              {configuracaoAtual.icone}
            </span>

            <span>
              {configuracaoAtual.nome}
            </span>

            <span className="classificacao-entidade-seta">
              ▾
            </span>
          </>

        )}

      </summary>


      <div
        className={
          modo === "acao"
            ? "classificacao-entidade-menu classificacao-entidade-menu-acao"
            : "classificacao-entidade-menu"
        }
      >

        <p className="classificacao-entidade-menu-titulo">
          CLASSIFICAÇÃO
        </p>


        {OPCOES_CLASSIFICACAO.map(
          opcao => {
            const ativa =
              opcao.valor ===
              tipoAtual;

            return (
              <button
                key={
                  opcao.valor
                }
                type="button"
                className={
                  ativa
                    ? "classificacao-entidade-opcao classificacao-entidade-opcao-ativa"
                    : "classificacao-entidade-opcao"
                }
                onClick={
                  evento =>
                    escolherTipo(
                      evento,
                      opcao.valor
                    )
                }
              >

                <span className="classificacao-entidade-opcao-icone">
                  {opcao.icone}
                </span>


                <span className="classificacao-entidade-opcao-nome">
                  {opcao.nome}
                </span>


                {ativa && (
                  <span className="classificacao-entidade-check">
                    ✓
                  </span>
                )}

              </button>
            );
          }
        )}

      </div>

    </details>
  );
}


export default ClassificacaoEntidade;