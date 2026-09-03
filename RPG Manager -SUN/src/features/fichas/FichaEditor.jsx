import React from "react";

import Avatar from "../../components/Avatar.jsx";


/* ========================================
   EDITOR / CRIADOR DE FICHA
======================================== */

function FichaEditor({

  titulo,
  subtitulo,

  novaFicha,

  alterarCampo,

  inputFotoRef,

  selecionarAvatar,
  abrirSeletorDeFoto,
  removerAvatar,
  usarImagemPorUrl,

  textoBotao,
  onSalvar,

  onVoltar

}) {


  /* ========================================
     VERIFICAR TIPO DA IMAGEM
  ======================================== */

  const imagemEhArquivo =
    novaFicha.imagem &&
    novaFicha.imagem.startsWith(
      "data:"
    );


  return (

    <div className="app">


      {/* ========================================
          CABEÇALHO
      ======================================== */}

      <header className="header">

        <button
          type="button"

          className="back-button"

          onClick={
            onVoltar
          }
        >
          ←
        </button>


        <div>

          <h1>
            {titulo}
          </h1>

          <p>
            {subtitulo}
          </p>

        </div>

      </header>


      {/* ========================================
          CONTEÚDO
      ======================================== */}

      <main className="container">

        <section className="panel">


          <h2>
            PERSONAGEM
          </h2>


          <p
            style={{
              marginTop: 0,
              marginBottom: "24px",
              color: "#8d96a6",
              lineHeight: "1.5"
            }}
          >
            Edite as informações gerais
            e administrativas da ficha.
          </p>


          {/* ========================================
              FOTO
          ======================================== */}

          <div className="avatar-editor">

            <h3>
              FOTO DO PERSONAGEM
            </h3>


            <div className="avatar-preview">

              <Avatar

                imagem={
                  novaFicha.imagem
                }

                grande={
                  true
                }

              />

            </div>


            <label>
              URL DA FOTO
            </label>


            <input
              type="url"

              value={
                imagemEhArquivo
                  ? ""
                  : novaFicha.imagem
              }

              onChange={
                evento =>
                  usarImagemPorUrl(
                    evento
                      .target
                      .value
                  )
              }

              placeholder=
                "https://..."
            />


            <p className="avatar-help">

              Você pode usar uma URL
              ou escolher uma imagem
              diretamente do computador.

            </p>


            <input

              ref={
                inputFotoRef
              }

              type="file"

              accept="image/*"

              className=
                "avatar-file-input"

              onChange={
                selecionarAvatar
              }

            />


            <button
              type="button"

              className=
                "avatar-upload"

              onClick={
                abrirSeletorDeFoto
              }
            >

              📷 ESCOLHER FOTO DO COMPUTADOR

            </button>


            {novaFicha.imagem && (

              <button
                type="button"

                className=
                  "avatar-remove"

                onClick={
                  removerAvatar
                }
              >

                REMOVER FOTO

              </button>

            )}

          </div>


          {/* ========================================
              NOME
          ======================================== */}

          <label>
            Nome
          </label>


          <input
            type="text"

            value={
              novaFicha.nome
            }

            onChange={
              evento =>
                alterarCampo(
                  "nome",
                  evento
                    .target
                    .value
                )
            }

            placeholder=
              "Nome do personagem"
          />


          {/* ========================================
              IDADE
          ======================================== */}

          <label>
            Idade
          </label>


          <input
            type="number"

            min="0"

            value={
              novaFicha.idade
            }

            onChange={
              evento =>
                alterarCampo(
                  "idade",
                  evento
                    .target
                    .value
                )
            }
          />


          {/* ========================================
              NÍVEL
          ======================================== */}

          <label>
            Nível
          </label>


          <input
            type="number"

            min="1"

            step="1"

            value={
              novaFicha.nivel
            }

            onChange={
              evento =>
                alterarCampo(
                  "nivel",
                  evento
                    .target
                    .value
                )
            }
          />


          {/* ========================================
              POSIÇÃO
          ======================================== */}

          <label>
            Posição
          </label>


          <select

            value={
              novaFicha.posicao
            }

            onChange={
              evento =>
                alterarCampo(
                  "posicao",
                  evento
                    .target
                    .value
                )
            }

          >

            <option value="Meio-campo">
              Meio-campo
            </option>

            <option value="Atacante">
              Atacante
            </option>

            <option value="Defesa">
              Defesa
            </option>

            <option value="Goleiro">
              Goleiro
            </option>

          </select>


          {/* ========================================
              VIDA
          ======================================== */}

          <label>
            Vida máxima
          </label>


          <input
            type="number"

            min="0"

            value={
              novaFicha.vidaMax
            }

            onChange={
              evento =>
                alterarCampo(
                  "vidaMax",
                  evento
                    .target
                    .value
                )
            }
          />


          {/* ========================================
              TP
          ======================================== */}

          <label>
            TP máximo
          </label>


          <input
            type="number"

            min="0"

            value={
              novaFicha.tpMax
            }

            onChange={
              evento =>
                alterarCampo(
                  "tpMax",
                  evento
                    .target
                    .value
                )
            }
          />


          {/* ========================================
              OBSERVAÇÃO SOBRE ATRIBUTOS
          ======================================== */}

          <div
            style={{
              marginTop: "24px",
              padding: "16px",
              border: "1px solid #303846",
              borderRadius: "10px",
              background: "#202631"
            }}
          >

            <strong>
              🛡️ ATRIBUTOS
            </strong>


            <p
              style={{
                marginBottom: 0,
                color: "#8d96a6",
                lineHeight: "1.5"
              }}
            >
              Os atributos agora possuem
              uma área própria na ficha.
              Para alterá-los, abra o módulo
              Atributos do personagem.
            </p>

          </div>


          {/* ========================================
              SALVAR
          ======================================== */}

          <button
            type="button"

            className=
              "new-button"

            onClick={
              onSalvar
            }

            style={{
              marginTop: "24px",
              width: "100%"
            }}
          >

            {textoBotao}

          </button>

        </section>

      </main>

    </div>

  );

}


export default FichaEditor;