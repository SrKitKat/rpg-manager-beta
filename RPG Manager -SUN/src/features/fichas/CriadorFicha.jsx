import React, {
  useState
} from "react";

import Avatar from "../../components/Avatar.jsx";

import AttributeControl
  from "../../components/AttributeControl.jsx";


/* ========================================
   CRIADOR DE FICHA

   Fluxo:

   1. Informações
   2. Atributos
   3. Recursos
   4. Revisão
======================================== */

function CriadorFicha({

  novaFicha,

  alterarCampo,

  alterarAtributo,

  definirAtributo,

  inputFotoRef,

  selecionarAvatar,

  abrirSeletorDeFoto,

  removerAvatar,

  usarImagemPorUrl,

  onCriar,

  onVoltar

}) {


  /* ========================================
     ETAPA ATUAL
  ======================================== */

  const [
    etapa,
    setEtapa
  ] = useState(0);


  const etapas = [

    {
      chave:
        "informacoes",

      nome:
        "Informações"
    },

    {
      chave:
        "atributos",

      nome:
        "Atributos"
    },

    {
      chave:
        "recursos",

      nome:
        "Recursos"
    },

    {
      chave:
        "revisao",

      nome:
        "Revisão"
    }

  ];


  const etapaAtual =
    etapas[
      etapa
    ];


  /* ========================================
     IMAGEM É ARQUIVO?
  ======================================== */

  const imagemEhArquivo =
    novaFicha.imagem &&
    novaFicha.imagem.startsWith(
      "data:"
    );


  /* ========================================
     NOMES VISUAIS DOS ATRIBUTOS
  ======================================== */

  function nomeAtributo(
    nome
  ) {

    const nomes = {

      forca:
        "Força",

      destreza:
        "Destreza",

      constituicao:
        "Constituição",

      agilidade:
        "Agilidade",

      resistencia:
        "Resistência",

      visao:
        "Visão",

      percepcao:
        "Percepção",

      inteligencia:
        "Inteligência",

      sabedoria:
        "Sabedoria",

      sorte:
        "Sorte",

      carisma:
        "Carisma"

    };


    return (
      nomes[nome] ||
      nome
    );

  }


  /* ========================================
     GRUPOS VISUAIS DE ATRIBUTOS

     Isso é apenas apresentação.

     Atributos desconhecidos continuam
     aparecendo em "Outros".
  ======================================== */

  const gruposAtributos = [

    {
      titulo:
        "FÍSICOS",

      atributos: [
        "forca",
        "destreza",
        "constituicao",
        "agilidade",
        "resistencia"
      ]
    },

    {
      titulo:
        "MENTAIS",

      atributos: [
        "visao",
        "percepcao",
        "inteligencia",
        "sabedoria"
      ]
    },

    {
      titulo:
        "SOCIAIS / ESPECIAIS",

      atributos: [
        "sorte",
        "carisma"
      ]
    }

  ];


  /* ========================================
     ATRIBUTOS NÃO CATEGORIZADOS
  ======================================== */

  const atributosConhecidos =
    gruposAtributos.flatMap(
      grupo =>
        grupo.atributos
    );


  const outrosAtributos =
    Object.keys(
      novaFicha.atributos ||
      {}
    ).filter(
      nome =>
        !atributosConhecidos.includes(
          nome
        )
    );


  /* ========================================
     VALIDAÇÃO DA ETAPA
  ======================================== */

  function podeAvancar() {

    if (
      etapaAtual.chave ===
      "informacoes"
    ) {

      return Boolean(
        String(
          novaFicha.nome ||
          ""
        ).trim()
      );

    }


    return true;

  }


  /* ========================================
     PRÓXIMA ETAPA
  ======================================== */

  function avancar() {

    if (
      etapaAtual.chave ===
        "informacoes" &&
      !String(
        novaFicha.nome ||
        ""
      ).trim()
    ) {

      alert(
        "Digite o nome do personagem antes de continuar."
      );

      return;

    }


    setEtapa(
      atual =>
        Math.min(
          atual + 1,
          etapas.length - 1
        )
    );

  }


  /* ========================================
     VOLTAR UMA ETAPA
  ======================================== */

  function voltarEtapa() {

    if (
      etapa === 0
    ) {

      onVoltar();

      return;

    }


    setEtapa(
      atual =>
        Math.max(
          0,
          atual - 1
        )
    );

  }


  /* ========================================
     INDICADOR DE ETAPAS
  ======================================== */

  function renderizarEtapas() {

    return (

      <div
        style={{
          display:
            "grid",

          gridTemplateColumns:
            `repeat(${etapas.length}, 1fr)`,

          gap:
            "8px",

          marginBottom:
            "22px"
        }}
      >

        {etapas.map(
          (
            item,
            indice
          ) => {

            const ativa =
              indice ===
              etapa;


            const concluida =
              indice <
              etapa;


            return (

              <button
                key={
                  item.chave
                }

                type="button"

                onClick={() => {

                  /*
                    Permite voltar para
                    etapas anteriores.

                    Não permite pular
                    livremente para frente.
                  */

                  if (
                    indice <=
                    etapa
                  ) {

                    setEtapa(
                      indice
                    );

                  }

                }}

                style={{
                  minHeight:
                    "52px",

                  padding:
                    "8px",

                  border:
                    ativa
                      ? "1px solid #7d8cff"
                      : "1px solid #303846",

                  borderRadius:
                    "10px",

                  background:
                    ativa
                      ? "#252c3a"
                      : "#202631",

                  color:
                    concluida ||
                    ativa
                      ? "white"
                      : "#8d96a6",

                  cursor:
                    indice <= etapa
                      ? "pointer"
                      : "default"
                }}
              >

                <span
                  style={{
                    display:
                      "block",

                    fontSize:
                      "11px",

                    marginBottom:
                      "3px",

                    opacity:
                      0.7
                  }}
                >
                  {indice + 1}
                </span>


                <strong
                  style={{
                    fontSize:
                      "11px"
                  }}
                >
                  {item.nome}
                </strong>

              </button>

            );

          }
        )}

      </div>

    );

  }


  /* ========================================
     ETAPA 1 — INFORMAÇÕES
  ======================================== */

  function renderizarInformacoes() {

    return (

      <div>


        {/* ========================================
            FOTO
        ======================================== */}

        <div
          style={{
            padding:
              "18px",

            marginBottom:
              "20px",

            border:
              "1px solid #303846",

            borderRadius:
              "12px",

            background:
              "#202631"
          }}
        >

          <h3
            style={{
              marginTop: 0
            }}
          >
            FOTO DO PERSONAGEM
          </h3>


          <div
            style={{
              display:
                "flex",

              justifyContent:
                "center",

              marginBottom:
                "18px"
            }}
          >

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
            URL da foto
          </label>


          <input
            type="url"

            value={
              imagemEhArquivo
                ? ""
                : novaFicha.imagem ||
                  ""
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


          <p
            style={{
              color:
                "#8d96a6",

              fontSize:
                "12px"
            }}
          >
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

            style={{
              width:
                "100%"
            }}
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

              style={{
                width:
                  "100%",

                marginTop:
                  "10px"
              }}
            >
              REMOVER FOTO
            </button>

          )}

        </div>


        {/* ========================================
            DADOS BÁSICOS
        ======================================== */}

        <div
          style={{
            padding:
              "18px",

            border:
              "1px solid #303846",

            borderRadius:
              "12px",

            background:
              "#202631"
          }}
        >

          <h3
            style={{
              marginTop: 0
            }}
          >
            INFORMAÇÕES BÁSICAS
          </h3>


          <label>
            Nome
          </label>


          <input
            type="text"

            value={
              novaFicha.nome ||
              ""
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


          <label>
            Idade
          </label>


          <input
            type="number"

            min="0"

            value={
              novaFicha.idade ??
              ""
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


          <label>
            Nível inicial
          </label>


          <input
            type="number"

            min="1"

            value={
              novaFicha.nivel ??
              1
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


          <label>
            Posição
          </label>


          <select

            value={
              novaFicha.posicao ||
              "Meio-campo"
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

            <option>
              Meio-campo
            </option>

            <option>
              Atacante
            </option>

            <option>
              Defesa
            </option>

            <option>
              Goleiro
            </option>

          </select>

        </div>

      </div>

    );

  }


  /* ========================================
     BLOCO DE ATRIBUTOS
  ======================================== */

  function renderizarGrupoAtributos(
    grupo
  ) {

    const existentes =
      grupo.atributos.filter(
        nome =>
          Object.prototype
            .hasOwnProperty
            .call(
              novaFicha.atributos ||
              {},
              nome
            )
      );


    if (
      existentes.length ===
      0
    ) {

      return null;

    }


    return (

      <div
        key={
          grupo.titulo
        }

        style={{
          padding:
            "18px",

          marginBottom:
            "15px",

          border:
            "1px solid #303846",

          borderRadius:
            "12px",

          background:
            "#202631"
        }}
      >

        <h3
          style={{
            marginTop: 0
          }}
        >
          {grupo.titulo}
        </h3>


        <div
          className=
            "attributes"
        >

          {existentes.map(
            nome => (

              <AttributeControl

                key={
                  nome
                }

                nome={
                  nome
                }

                valor={
                  novaFicha
                    .atributos[
                      nome
                    ]
                }

                onAlterar={
                  quantidade =>
                    alterarAtributo(
                      nome,
                      quantidade
                    )
                }

                onDefinir={
                  novoValor =>
                    definirAtributo(
                      nome,
                      novoValor
                    )
                }

              />

            )
          )}

        </div>

      </div>

    );

  }


  /* ========================================
     ETAPA 2 — ATRIBUTOS
  ======================================== */

  function renderizarAtributos() {

    return (

      <div>


        <div
          style={{
            padding:
              "16px",

            marginBottom:
              "18px",

            border:
              "1px solid #303846",

            borderRadius:
              "12px",

            background:
              "#202631"
          }}
        >

          <h3
            style={{
              margin:
                "0 0 6px"
            }}
          >
            ATRIBUTOS INICIAIS
          </h3>


          <p
            style={{
              margin: 0,

              color:
                "#8d96a6",

              fontSize:
                "12px",

              lineHeight:
                "1.6"
            }}
          >
            Estes são os valores iniciais
            definidos pela campanha.

            Você pode ajustá-los antes
            de criar o personagem.
          </p>

        </div>


        {gruposAtributos.map(
          grupo =>
            renderizarGrupoAtributos(
              grupo
            )
        )}


        {/* ========================================
            OUTROS ATRIBUTOS

            Importante para campanhas futuras.
        ======================================== */}

        {outrosAtributos.length >
          0 && (

          <div
            style={{
              padding:
                "18px",

              border:
                "1px solid #303846",

              borderRadius:
                "12px",

              background:
                "#202631"
            }}
          >

            <h3
              style={{
                marginTop: 0
              }}
            >
              OUTROS
            </h3>


            <div
              className=
                "attributes"
            >

              {outrosAtributos.map(
                nome => (

                  <AttributeControl

                    key={
                      nome
                    }

                    nome={
                      nome
                    }

                    valor={
                      novaFicha
                        .atributos[
                          nome
                        ]
                    }

                    onAlterar={
                      quantidade =>
                        alterarAtributo(
                          nome,
                          quantidade
                        )
                    }

                    onDefinir={
                      novoValor =>
                        definirAtributo(
                          nome,
                          novoValor
                        )
                    }

                  />

                )
              )}

            </div>

          </div>

        )}

      </div>

    );

  }


  /* ========================================
     ETAPA 3 — RECURSOS
  ======================================== */

  function renderizarRecursos() {

    return (

      <div>


        <div
          style={{
            padding:
              "16px",

            marginBottom:
              "18px",

            border:
              "1px solid #303846",

            borderRadius:
              "12px",

            background:
              "#202631"
          }}
        >

          <h3
            style={{
              margin:
                "0 0 6px"
            }}
          >
            RECURSOS INICIAIS
          </h3>


          <p
            style={{
              margin: 0,

              color:
                "#8d96a6",

              fontSize:
                "12px",

              lineHeight:
                "1.6"
            }}
          >
            Configure os recursos com
            os quais o personagem
            começará a campanha.
          </p>

        </div>


        <div
          style={{
            padding:
              "18px",

            border:
              "1px solid #303846",

            borderRadius:
              "12px",

            background:
              "#202631"
          }}
        >

          <label>
            Vida máxima
          </label>


          <input
            type="number"

            min="0"

            value={
              novaFicha.vidaMax ??
              ""
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


          <label>
            TP máximo
          </label>


          <input
            type="number"

            min="0"

            value={
              novaFicha.tpMax ??
              ""
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


          <div
            style={{
              marginTop:
                "18px",

              padding:
                "14px",

              border:
                "1px solid #303846",

              borderRadius:
                "10px",

              background:
                "#171b24"
            }}
          >

            <p
              style={{
                margin: 0,

                color:
                  "#8d96a6",

                fontSize:
                  "12px",

                lineHeight:
                  "1.6"
              }}
            >
              Mais recursos poderão ser
              adicionados aqui futuramente
              conforme os módulos da campanha.

              Por enquanto usamos Vida e TP.
            </p>

          </div>

        </div>

      </div>

    );

  }


  /* ========================================
     ITEM DE REVISÃO
  ======================================== */

  function ItemRevisao({

    titulo,

    valor

  }) {

    return (

      <div
        style={{
          display:
            "flex",

          justifyContent:
            "space-between",

          alignItems:
            "center",

          gap:
            "15px",

          padding:
            "11px 0",

          borderBottom:
            "1px solid #303846"
        }}
      >

        <span
          style={{
            color:
              "#8d96a6",

            fontSize:
              "12px"
          }}
        >
          {titulo}
        </span>


        <strong
          style={{
            textAlign:
              "right"
          }}
        >
          {valor ?? "—"}
        </strong>

      </div>

    );

  }


  /* ========================================
     ETAPA 4 — REVISÃO
  ======================================== */

  function renderizarRevisao() {

    return (

      <div>


        {/* ========================================
            PERFIL
        ======================================== */}

        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap:
              "18px",

            padding:
              "18px",

            marginBottom:
              "18px",

            border:
              "1px solid #303846",

            borderRadius:
              "12px",

            background:
              "#202631"
          }}
        >

          <Avatar

            imagem={
              novaFicha.imagem
            }

            grande={
              true
            }

          />


          <div>

            <p
              style={{
                margin:
                  "0 0 4px",

                color:
                  "#8d96a6",

                fontSize:
                  "11px"
              }}
            >
              NOVO PERSONAGEM
            </p>


            <h2
              style={{
                margin:
                  "0 0 6px"
              }}
            >
              {
                novaFicha.nome ||
                "Sem nome"
              }
            </h2>


            <p
              style={{
                margin: 0,

                color:
                  "#b8c0ce"
              }}
            >
              Nível {
                novaFicha.nivel
              }

              {" • "}

              {
                novaFicha.posicao
              }
            </p>

          </div>

        </div>


        {/* ========================================
            INFORMAÇÕES
        ======================================== */}

        <div
          style={{
            padding:
              "18px",

            marginBottom:
              "15px",

            border:
              "1px solid #303846",

            borderRadius:
              "12px",

            background:
              "#202631"
          }}
        >

          <h3
            style={{
              marginTop: 0
            }}
          >
            INFORMAÇÕES
          </h3>


          <ItemRevisao
            titulo="Nome"
            valor={
              novaFicha.nome
            }
          />


          <ItemRevisao
            titulo="Idade"
            valor={
              novaFicha.idade
            }
          />


          <ItemRevisao
            titulo="Nível"
            valor={
              novaFicha.nivel
            }
          />


          <ItemRevisao
            titulo="Posição"
            valor={
              novaFicha.posicao
            }
          />

        </div>


        {/* ========================================
            RECURSOS
        ======================================== */}

        <div
          style={{
            padding:
              "18px",

            marginBottom:
              "15px",

            border:
              "1px solid #303846",

            borderRadius:
              "12px",

            background:
              "#202631"
          }}
        >

          <h3
            style={{
              marginTop: 0
            }}
          >
            RECURSOS
          </h3>


          <ItemRevisao

            titulo=
              "Vida máxima"

            valor={
              novaFicha.vidaMax
            }

          />


          <ItemRevisao

            titulo=
              "TP máximo"

            valor={
              novaFicha.tpMax
            }

          />

        </div>


        {/* ========================================
            ATRIBUTOS
        ======================================== */}

        <div
          style={{
            padding:
              "18px",

            border:
              "1px solid #303846",

            borderRadius:
              "12px",

            background:
              "#202631"
          }}
        >

          <h3
            style={{
              marginTop: 0
            }}
          >
            ATRIBUTOS
          </h3>


          {Object.entries(
            novaFicha.atributos ||
            {}
          ).map(
            (
              [
                nome,
                valor
              ]
            ) => (

              <ItemRevisao

                key={
                  nome
                }

                titulo={
                  nomeAtributo(
                    nome
                  )
                }

                valor={
                  valor
                }

              />

            )
          )}

        </div>

      </div>

    );

  }


  /* ========================================
     CONTEÚDO DA ETAPA
  ======================================== */

  function renderizarConteudo() {

    if (
      etapaAtual.chave ===
      "atributos"
    ) {

      return renderizarAtributos();

    }


    if (
      etapaAtual.chave ===
      "recursos"
    ) {

      return renderizarRecursos();

    }


    if (
      etapaAtual.chave ===
      "revisao"
    ) {

      return renderizarRevisao();

    }


    return renderizarInformacoes();

  }


  /* ========================================
     INTERFACE
  ======================================== */

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
            voltarEtapa
          }
        >
          ←
        </button>


        <div>

          <h1>
            CRIAR PERSONAGEM
          </h1>


          <p>
            {
              etapaAtual.nome
            }
          </p>

        </div>

      </header>


      {/* ========================================
          CONTEÚDO
      ======================================== */}

      <main
        className="container"

        style={{
          paddingBottom:
            "45px"
        }}
      >

        {renderizarEtapas()}


        <section className="panel">

          {renderizarConteudo()}

        </section>


        {/* ========================================
            NAVEGAÇÃO
        ======================================== */}

        <div
          style={{
            display:
              "grid",

            gridTemplateColumns:
              etapa === 0
                ? "1fr"
                : "1fr 1fr",

            gap:
              "10px",

            marginTop:
              "18px"
          }}
        >

          {etapa >
            0 && (

            <button
              type="button"

              className=
                "back-home"

              onClick={
                voltarEtapa
              }
            >
              ← VOLTAR
            </button>

          )}


          {etapa <
            etapas.length -
              1 ? (

            <button
              type="button"

              className=
                "new-button"

              onClick={
                avancar
              }

              disabled={
                !podeAvancar()
              }
            >
              PRÓXIMO →
            </button>

          ) : (

            <button
              type="button"

              className=
                "new-button"

              onClick={
                onCriar
              }
            >
              ✓ CRIAR PERSONAGEM
            </button>

          )}

        </div>

      </main>

    </div>

  );

}


export default CriadorFicha;