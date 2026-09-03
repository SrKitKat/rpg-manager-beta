import React, {
  useState
} from "react";

import "./EditorEntidade.css";

import {
  TIPOS_ENTIDADE,
  VISIBILIDADES_ENTIDADE
} from "../campanhas/campanhas.js";


const OPCOES_TIPO = [
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


const OPCOES_VISIBILIDADE = [
  {
    valor:
      VISIBILIDADES_ENTIDADE.CAMPANHA,

    nome:
      "Toda a campanha",

    icone:
      "🌐"
  },

  {
    valor:
      VISIBILIDADES_ENTIDADE.PROPRIETARIO,

    nome:
      "Somente proprietário",

    icone:
      "🔒"
  },

  {
    valor:
      VISIBILIDADES_ENTIDADE.MESTRE,

    nome:
      "Mestre + proprietário",

    icone:
      "👑"
  },

  {
    valor:
      VISIBILIDADES_ENTIDADE.RESTRITA,

    nome:
      "Restrita",

    icone:
      "👥"
  }
];


function encontrarTipo(
  tipo
) {
  return (
    OPCOES_TIPO.find(
      opcao =>
        opcao.valor ===
        tipo
    ) ||
    OPCOES_TIPO[0]
  );
}


function EditorEntidade({
  ficha,

  tipoEntidade,

  tiposPermitidos = [],

  podeAlterarTipo = false,

  nomeProprietario,

  alterarCampo,

  onAlterarTipo,

  inputFotoRef,

  selecionarAvatar,

  abrirSeletorDeFoto,

  removerAvatar,

  usarImagemPorUrl,

  onSalvar,

  onVoltar
}) {
  const [
    mostrandoUrl,
    setMostrandoUrl
  ] = useState(false);


  const [
    urlImagem,
    setUrlImagem
  ] = useState("");


  const tipoAtual =
    encontrarTipo(
      tipoEntidade
    );


  function aplicarUrl() {
    const limpa =
      String(
        urlImagem ||
        ""
      ).trim();

    if (!limpa) {
      return;
    }

    usarImagemPorUrl?.(
      limpa
    );

    setMostrandoUrl(
      false
    );

    setUrlImagem("");
  }


  return (
    <div className="editor-entidade">

      <header className="editor-entidade-topo">

        <button
          type="button"
          className="editor-entidade-voltar"
          onClick={
            onVoltar
          }
        >
          ←
        </button>


        <div className="editor-entidade-icone">

          {tipoAtual.icone}

        </div>


        <div>

          <p className="editor-entidade-etiqueta">
            EDITAR ENTIDADE
          </p>


          <h1>
            Editar {tipoAtual.nome}
          </h1>


          <p>
            Altere identidade e informações gerais.
            Atributos, recursos, habilidades e demais
            módulos são administrados diretamente na
            ficha.
          </p>

        </div>

      </header>


      <main className="editor-entidade-conteudo">

        <section className="editor-entidade-card">

          <header className="editor-entidade-secao-topo">

            <div>

              <p className="editor-entidade-etiqueta">
                IDENTIDADE
              </p>

              <h2>
                Informações gerais
              </h2>

              <p>
                Dados usados para identificar e
                organizar esta entidade.
              </p>

            </div>

          </header>


          <div className="editor-entidade-identidade">

            <div className="editor-entidade-imagem-area">

              <div className="editor-entidade-imagem">

                {ficha.imagem ? (

                  <img
                    src={
                      ficha.imagem
                    }
                    alt={
                      ficha.nome ||
                      "Imagem da entidade"
                    }
                  />

                ) : (

                  <span>
                    {tipoAtual.icone}
                  </span>

                )}

              </div>


              <input
                ref={
                  inputFotoRef
                }
                type="file"
                accept="image/*"
                onChange={
                  selecionarAvatar
                }
                hidden
              />


              <button
                type="button"
                className="editor-entidade-botao-secundario"
                onClick={
                  abrirSeletorDeFoto
                }
              >
                🖼 ESCOLHER IMAGEM
              </button>


              <button
                type="button"
                className="editor-entidade-botao-texto"
                onClick={() =>
                  setMostrandoUrl(
                    anterior =>
                      !anterior
                  )
                }
              >
                Usar URL
              </button>


              {ficha.imagem && (

                <button
                  type="button"
                  className="editor-entidade-botao-texto editor-entidade-botao-remover"
                  onClick={
                    removerAvatar
                  }
                >
                  Remover imagem
                </button>

              )}


              {mostrandoUrl && (

                <div className="editor-entidade-url">

                  <input
                    type="text"
                    placeholder="https://..."
                    value={
                      urlImagem
                    }
                    onChange={
                      evento =>
                        setUrlImagem(
                          evento.target.value
                        )
                    }
                  />

                  <button
                    type="button"
                    onClick={
                      aplicarUrl
                    }
                  >
                    USAR
                  </button>

                </div>

              )}

            </div>


            <div className="editor-entidade-formulario">

              <label className="editor-entidade-campo editor-entidade-campo-largo">

                <span>
                  NOME
                </span>

                <input
                  type="text"
                  value={
                    ficha.nome ||
                    ""
                  }
                  onChange={
                    evento =>
                      alterarCampo(
                        "nome",
                        evento.target.value
                      )
                  }
                />

              </label>


              <label className="editor-entidade-campo">

                <span>
                  CLASSIFICAÇÃO
                </span>

                <select
                  value={
                    tipoEntidade
                  }
                  disabled={
                    !podeAlterarTipo
                  }
                  onChange={
                    evento =>
                      onAlterarTipo?.(
                        evento.target.value
                      )
                  }
                >

                  {OPCOES_TIPO
                    .filter(
                      opcao =>
                        tiposPermitidos
                          .includes(
                            opcao.valor
                          )
                    )
                    .map(
                      opcao => (

                        <option
                          key={
                            opcao.valor
                          }
                          value={
                            opcao.valor
                          }
                        >
                          {opcao.icone}{" "}
                          {opcao.nome}
                        </option>

                      )
                    )}

                </select>

              </label>


              <label className="editor-entidade-campo">

                <span>
                  VISIBILIDADE
                </span>

                <select
                  value={
                    ficha.visibilidade ||
                    VISIBILIDADES_ENTIDADE.CAMPANHA
                  }
                  onChange={
                    evento =>
                      alterarCampo(
                        "visibilidade",
                        evento.target.value
                      )
                  }
                >

                  {OPCOES_VISIBILIDADE.map(
                    opcao => (

                      <option
                        key={
                          opcao.valor
                        }
                        value={
                          opcao.valor
                        }
                      >
                        {opcao.icone}{" "}
                        {opcao.nome}
                      </option>

                    )
                  )}

                </select>

              </label>


              <label className="editor-entidade-campo editor-entidade-campo-largo">

                <span>
                  PROPRIETÁRIO
                </span>

                <input
                  type="text"
                  value={
                    nomeProprietario ||
                    "Não identificado"
                  }
                  disabled
                />

                <small>
                  A transferência de propriedade será
                  tratada separadamente nas ferramentas
                  de participantes e permissões.
                </small>

              </label>


              <label className="editor-entidade-campo">

                <span>
                  FUNÇÃO / POSIÇÃO
                </span>

                <input
                  type="text"
                  value={
                    ficha.posicao ||
                    ""
                  }
                  onChange={
                    evento =>
                      alterarCampo(
                        "posicao",
                        evento.target.value
                      )
                  }
                />

              </label>


              <label className="editor-entidade-campo">

                <span>
                  RAÇA / ESPÉCIE
                </span>

                <input
                  type="text"
                  value={
                    ficha.raca ||
                    ""
                  }
                  onChange={
                    evento =>
                      alterarCampo(
                        "raca",
                        evento.target.value
                      )
                  }
                />

              </label>


              <label className="editor-entidade-campo">

                <span>
                  IDADE
                </span>

                <input
                  type="number"
                  min="0"
                  value={
                    ficha.idade ??
                    ""
                  }
                  onChange={
                    evento =>
                      alterarCampo(
                        "idade",
                        evento.target.value
                      )
                  }
                />

              </label>


              <label className="editor-entidade-campo">

                <span>
                  ALTURA
                </span>

                <input
                  type="text"
                  placeholder="Ex.: 168 cm"
                  value={
                    ficha.altura ||
                    ""
                  }
                  onChange={
                    evento =>
                      alterarCampo(
                        "altura",
                        evento.target.value
                      )
                  }
                />

              </label>


              <label className="editor-entidade-campo">

                <span>
                  PÉ DOMINANTE
                </span>

                <input
                  type="text"
                  value={
                    ficha.peDominante ||
                    ""
                  }
                  onChange={
                    evento =>
                      alterarCampo(
                        "peDominante",
                        evento.target.value
                      )
                  }
                />

              </label>


              <div className="editor-entidade-divisor editor-entidade-campo-largo">

                <span>
                  PROGRESSÃO BÁSICA
                </span>

                <p>
                  Estes campos continuam disponíveis
                  aqui por enquanto. Quando o módulo
                  Evolução for aprofundado, eles poderão
                  ser administrados por lá.
                </p>

              </div>


              <label className="editor-entidade-campo">

                <span>
                  NÍVEL
                </span>

                <input
                  type="number"
                  min="1"
                  value={
                    ficha.nivel ??
                    1
                  }
                  onChange={
                    evento =>
                      alterarCampo(
                        "nivel",
                        evento.target.value
                      )
                  }
                />

              </label>


              <label className="editor-entidade-campo">

                <span>
                  EXPERIÊNCIA
                </span>

                <input
                  type="number"
                  min="0"
                  value={
                    ficha.experiencia ??
                    0
                  }
                  onChange={
                    evento =>
                      alterarCampo(
                        "experiencia",
                        evento.target.value
                      )
                  }
                />

              </label>


              <label className="editor-entidade-campo">

                <span>
                  EXPERIÊNCIA MÁXIMA
                </span>

                <input
                  type="number"
                  min="1"
                  value={
                    ficha.experienciaMax ??
                    100
                  }
                  onChange={
                    evento =>
                      alterarCampo(
                        "experienciaMax",
                        evento.target.value
                      )
                  }
                />

              </label>

            </div>

          </div>

        </section>


        <section className="editor-entidade-aviso">

          <div>
            ✓
          </div>

          <div>

            <strong>
              Cada informação no seu lugar
            </strong>

            <p>
              Atributos agora são alterados na aba
              Atributos. Vida, GP e TP ficam na aba
              Recursos. Habilidades, Arquétipo e
              Talentos continuam em seus próprios
              módulos.
            </p>

          </div>

        </section>


        <footer className="editor-entidade-acoes">

          <button
            type="button"
            className="editor-entidade-cancelar"
            onClick={
              onVoltar
            }
          >
            CANCELAR
          </button>


          <button
            type="button"
            className="editor-entidade-salvar"
            onClick={
              onSalvar
            }
          >
            💾 SALVAR ALTERAÇÕES
          </button>

        </footer>

      </main>

    </div>
  );
}


export default EditorEntidade;