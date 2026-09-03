import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import "./ConfiguracoesCampanha.css";

import {
  PAPEIS_CAMPANHA,
  permissoesMestre,
  permissoesJogador
} from "./campanhas.js";

import {
  configuracaoCampanha
} from "./configCampanha.js";


/* ========================================
   SEÇÕES
======================================== */

const SECOES_CONFIGURACAO = {
  INICIO:
    "inicio",

  PARTICIPANTES:
    "participantes",

  MODULOS:
    "modulos",

  DADOS:
    "dados"
};


/* ========================================
   PERMISSÕES EXPOSTAS

   Papel e permissão são conceitos
   separados.

   O Mestre possui o conjunto-base do
   papel Mestre.

   Jogadores podem receber permissões
   extras sem deixar de ser Jogadores.
======================================== */

const GRUPOS_PERMISSOES = [

  {
    id:
      "campanha",

    titulo:
      "CAMPANHA",

    permissoes: [

      {
        chave:
          "administrarCampanha",

        icone:
          "⚙",

        nome:
          "Administrar campanha",

        descricao:
          "Acesso às áreas administrativas gerais da campanha."
      },

      {
        chave:
          "editarConfiguracao",

        icone:
          "🛠",

        nome:
          "Editar configuração",

        descricao:
          "Permite alterar configurações e conteúdo administrativo da campanha."
      }

    ]
  },


  {
    id:
      "personagens",

    titulo:
      "PERSONAGENS",

    permissoes: [

      {
        chave:
          "criarPersonagens",

        icone:
          "＋",

        nome:
          "Criar personagens",

        descricao:
          "Permite criar novas fichas de personagem."
      },

      {
        chave:
          "visualizarPersonagensCampanha",

        icone:
          "👁",

        nome:
          "Visualizar personagens da campanha",

        descricao:
          "Permite visualizar personagens disponibilizados pela campanha."
      },

      {
        chave:
          "editarPropriosPersonagens",

        icone:
          "✏",

        nome:
          "Editar personagens próprios",

        descricao:
          "Permite editar personagens pertencentes ao próprio participante."
      },

      {
        chave:
          "excluirPropriosPersonagens",

        icone:
          "🗑",

        nome:
          "Excluir personagens próprios",

        descricao:
          "Permite excluir personagens pertencentes ao próprio participante."
      },

      {
        chave:
          "editarQualquerPersonagem",

        icone:
          "📝",

        nome:
          "Editar qualquer personagem",

        descricao:
          "Permissão avançada de colaboração para editar personagens de outros participantes."
      },

      {
        chave:
          "excluirQualquerPersonagem",

        icone:
          "⚠",

        nome:
          "Excluir qualquer personagem",

        descricao:
          "Permissão administrativa sensível para excluir personagens de outros participantes."
      }

    ]
  },


  {
    id:
      "mestragem",

    titulo:
      "MESTRAGEM E ENTIDADES",

    permissoes: [

      {
        chave:
          "criarNPCs",

        icone:
          "🎭",

        nome:
          "Criar NPCs",

        descricao:
          "Permite criar e administrar NPCs da campanha."
      },

      {
        chave:
          "criarAdversarios",

        icone:
          "⚔",

        nome:
          "Criar adversários",

        descricao:
          "Permite criar entidades organizadas como oposição."
      },

      {
        chave:
          "criarMonstros",

        icone:
          "👹",

        nome:
          "Criar monstros",

        descricao:
          "Permite criar monstros e criaturas da campanha."
      },

      {
        chave:
          "criarAuxiliares",

        icone:
          "🧰",

        nome:
          "Criar auxiliares",

        descricao:
          "Permite criar entidades e recursos auxiliares."
      }

    ]
  },


  {
    id:
      "conteudo",

    titulo:
      "CONTEÚDO",

    permissoes: [

      {
        chave:
          "criarConteudo",

        icone:
          "✦",

        nome:
          "Criar conteúdo",

        descricao:
          "Permite criar conteúdo compartilhável dentro da campanha."
      },

      {
        chave:
          "editarConteudoCompartilhado",

        icone:
          "📚",

        nome:
          "Editar conteúdo compartilhado",

        descricao:
          "Permite editar conteúdo compartilhado da campanha."
      },

      {
        chave:
          "visualizarConteudoOculto",

        icone:
          "🔎",

        nome:
          "Visualizar conteúdo oculto",

        descricao:
          "Permite visualizar conteúdo reservado ou oculto aos jogadores comuns."
      }

    ]
  },


  {
    id:
      "participantes",

    titulo:
      "PARTICIPANTES",

    permissoes: [

      {
        chave:
          "administrarJogadores",

        icone:
          "👥",

        nome:
          "Administrar jogadores",

        descricao:
          "Permite acessar funções administrativas relacionadas aos participantes."
      },

      {
        chave:
          "administrarPermissoes",

        icone:
          "🔐",

        nome:
          "Administrar permissões",

        descricao:
          "Permite alterar permissões de outros participantes da campanha."
      }

    ]
  }

];


/* ========================================
   MÓDULOS
======================================== */

const ROTULOS_MODULOS = {

  resumo: {
    icone:
      "▦",

    nome:
      "Resumo",

    descricao:
      "Visão geral e informações principais da ficha."
  },

  atributos: {
    icone:
      "◆",

    nome:
      "Atributos",

    descricao:
      "Atributos físicos, mentais e especiais."
  },

  habilidades: {
    icone:
      "⚡",

    nome:
      "Habilidades",

    descricao:
      "Habilidades, técnicas e Banco da campanha."
  },

  recursos: {
    icone:
      "◈",

    nome:
      "Recursos",

    descricao:
      "Recursos consumíveis e estados numéricos da ficha."
  },

  arquetipo: {
    icone:
      "✦",

    nome:
      "Arquétipo",

    descricao:
      "Arquétipos adquiridos e destaque atual."
  },

  talentos: {
    icone:
      "★",

    nome:
      "Talentos",

    descricao:
      "Talentos e progressão especializada."
  },

  ritmo: {
    icone:
      "♫",

    nome:
      "Ritmo",

    descricao:
      "Ritmo individual e mecânicas relacionadas."
  },

  momentum: {
    icone:
      "↑",

    nome:
      "Momentum",

    descricao:
      "Estado especial de Momentum da campanha."
  },

  condicoes: {
    icone:
      "♡",

    nome:
      "Condições",

    descricao:
      "Condições físicas, mentais e temporárias."
  },

  vinculos: {
    icone:
      "∞",

    nome:
      "Vínculos",

    descricao:
      "Relações e vínculos narrativos."
  },

  jornada: {
    icone:
      "🗺",

    nome:
      "Jornada",

    descricao:
      "Sessões, acontecimentos, arcos e trajetória."
  },

  evolucao: {
    icone:
      "↗",

    nome:
      "Evolução",

    descricao:
      "Histórico e evolução narrativa/mecânica."
  },

  inventario: {
    icone:
      "🎒",

    nome:
      "Inventário",

    descricao:
      "Itens, equipamentos e recursos carregados."
  }

};


/* ========================================
   UTILIDADES
======================================== */

function textoLimpo(
  valor
) {
  return String(
    valor ?? ""
  ).trim();
}


function formatarIdentificador(
  valor
) {
  const texto =
    textoLimpo(
      valor
    );

  if (!texto) {
    return "Não definido";
  }

  return texto
    .split(
      /[-_\s]+/
    )
    .filter(Boolean)
    .map(
      parte =>
        parte
          .charAt(0)
          .toLocaleUpperCase(
            "pt-BR"
          ) +
        parte.slice(1)
    )
    .join(" ");
}


function formatarData(
  valor
) {
  if (!valor) {
    return "Não registrado";
  }

  const data =
    new Date(
      valor
    );

  if (
    Number.isNaN(
      data.getTime()
    )
  ) {
    return "Não registrado";
  }

  return data.toLocaleString(
    "pt-BR",
    {
      dateStyle:
        "short",

      timeStyle:
        "short"
    }
  );
}


function obterPapelParticipante(
  participante
) {
  return (
    participante
      ?.acesso
      ?.papel ||
    participante
      ?.papel ||
    PAPEIS_CAMPANHA.JOGADOR
  );
}


function obterNomePapel(
  participante
) {
  return (
    obterPapelParticipante(
      participante
    ) ===
    PAPEIS_CAMPANHA.MESTRE
      ? "Mestre"
      : "Jogador"
  );
}


function participanteEhMestre(
  participante
) {
  return (
    obterPapelParticipante(
      participante
    ) ===
    PAPEIS_CAMPANHA.MESTRE
  );
}


function obterPermissoesBasePapel(
  participante
) {
  return participanteEhMestre(
    participante
  )
    ? permissoesMestre
    : permissoesJogador;
}


function obterPermissaoAtual(
  participante,
  permissao
) {
  const permissoesBase =
    obterPermissoesBasePapel(
      participante
    );

  const permissoesAtuais =
    participante
      ?.acesso
      ?.permissoes ||
    {};

  if (
    Object.prototype
      .hasOwnProperty
      .call(
        permissoesAtuais,
        permissao
      )
  ) {
    return Boolean(
      permissoesAtuais[
        permissao
      ]
    );
  }

  return Boolean(
    permissoesBase[
      permissao
    ]
  );
}


function permissaoFoiPersonalizada(
  participante,
  permissao
) {
  if (
    participanteEhMestre(
      participante
    )
  ) {
    return false;
  }

  const base =
    Boolean(
      permissoesJogador[
        permissao
      ]
    );

  const atual =
    obterPermissaoAtual(
      participante,
      permissao
    );

  return (
    atual !== base
  );
}


function obterInicial(
  nome
) {
  const texto =
    textoLimpo(
      nome
    );

  if (!texto) {
    return "?";
  }

  return texto
    .charAt(0)
    .toLocaleUpperCase(
      "pt-BR"
    );
}


/* ========================================
   COMPONENTE
======================================== */

function ConfiguracoesCampanha({
  campanha,
  participantes = [],
  onAlterarPermissaoParticipante,
  onConvidarParticipante,
  onRemoverParticipante,
  onVoltar
}) {
  const [usernameConvite, setUsernameConvite] = useState("");
  const [feedbackParticipante, setFeedbackParticipante] = useState("");
  const [
    secaoAtiva,
    setSecaoAtiva
  ] = useState(
    SECOES_CONFIGURACAO.INICIO
  );


  const participantesCampanha =
    useMemo(
      () => {
        if (
          Array.isArray(
            participantes
          ) &&
          participantes.length >
            0
        ) {
          return participantes;
        }

        return Array.isArray(
          campanha?.participantes
        )
          ? campanha.participantes
          : [];
      },
      [
        participantes,
        campanha
      ]
    );


  const participantesOrdenados =
    useMemo(
      () =>
        [
          ...participantesCampanha
        ].sort(
          (
            a,
            b
          ) => {
            const mestreA =
              participanteEhMestre(
                a
              );

            const mestreB =
              participanteEhMestre(
                b
              );

            if (
              mestreA !==
              mestreB
            ) {
              return mestreA
                ? -1
                : 1;
            }

            return textoLimpo(
              a?.nome
            ).localeCompare(
              textoLimpo(
                b?.nome
              ),
              "pt-BR"
            );
          }
        ),
      [
        participantesCampanha
      ]
    );


  const [
    participanteSelecionadoId,
    setParticipanteSelecionadoId
  ] = useState("");


  useEffect(
    () => {
      if (
        participantesOrdenados.length ===
        0
      ) {
        setParticipanteSelecionadoId(
          ""
        );

        return;
      }

      const aindaExiste =
        participantesOrdenados.some(
          participante =>
            participante.id ===
            participanteSelecionadoId
        );

      if (aindaExiste) {
        return;
      }

      const primeiroJogador =
        participantesOrdenados.find(
          participante =>
            !participanteEhMestre(
              participante
            )
        );

      setParticipanteSelecionadoId(
        primeiroJogador?.id ||
        participantesOrdenados[0]
          ?.id ||
        ""
      );
    },
    [
      participantesOrdenados,
      participanteSelecionadoId
    ]
  );


  const participanteSelecionado =
    useMemo(
      () =>
        participantesOrdenados.find(
          participante =>
            participante.id ===
            participanteSelecionadoId
        ) ||
        null,
      [
        participantesOrdenados,
        participanteSelecionadoId
      ]
    );


  const participanteSelecionadoMestre =
    participanteEhMestre(
      participanteSelecionado
    );


  const podeAlterarPermissoes =
    Boolean(
      participanteSelecionado &&
      !participanteSelecionadoMestre &&
      typeof onAlterarPermissaoParticipante ===
        "function"
    );


  async function enviarConvite(evento) {
    evento.preventDefault();
    if (!usernameConvite.trim() || !onConvidarParticipante) return;
    setFeedbackParticipante("Adicionando...");
    try {
      await onConvidarParticipante(usernameConvite.trim());
      setUsernameConvite("");
      setFeedbackParticipante("✓ Participante adicionado.");
    } catch (erro) {
      setFeedbackParticipante(erro.message || "Erro ao adicionar participante.");
    }
  }


  async function removerSelecionado() {
    if (!participanteSelecionado || !onRemoverParticipante) return;
    if (!window.confirm(`Remover ${participanteSelecionado.nome} da campanha?`)) return;
    setFeedbackParticipante("Removendo...");
    try {
      await onRemoverParticipante(participanteSelecionado.id);
      setFeedbackParticipante("✓ Participante removido.");
    } catch (erro) {
      setFeedbackParticipante(erro.message || "Erro ao remover participante.");
    }
  }


  const quantidadeJogadores =
    participantesOrdenados.filter(
      participante =>
        !participanteEhMestre(
          participante
        )
    ).length;


  const modulosConfigurados =
    useMemo(
      () =>
        Object.entries(
          configuracaoCampanha
            ?.modulos ||
          {}
        ),
      []
    );


  const quantidadeModulosAtivos =
    modulosConfigurados.filter(
      ([
        ,
        ativo
      ]) =>
        Boolean(
          ativo
        )
    ).length;


  function voltar() {
    if (
      secaoAtiva !==
      SECOES_CONFIGURACAO.INICIO
    ) {
      setSecaoAtiva(
        SECOES_CONFIGURACAO.INICIO
      );

      return;
    }

    onVoltar?.();
  }


  function alterarPermissao(
    permissao,
    valor
  ) {
    if (
      !podeAlterarPermissoes ||
      !participanteSelecionado
    ) {
      return;
    }

    onAlterarPermissaoParticipante(
      participanteSelecionado.id,
      permissao,
      valor
    );
  }


  function tituloTopo() {
    if (
      secaoAtiva ===
      SECOES_CONFIGURACAO.PARTICIPANTES
    ) {
      return "Participantes e permissões";
    }

    if (
      secaoAtiva ===
      SECOES_CONFIGURACAO.MODULOS
    ) {
      return "Módulos da campanha";
    }

    if (
      secaoAtiva ===
      SECOES_CONFIGURACAO.DADOS
    ) {
      return "Dados da campanha";
    }

    return "Configurações da campanha";
  }


  function descricaoTopo() {
    if (
      secaoAtiva ===
      SECOES_CONFIGURACAO.PARTICIPANTES
    ) {
      return "Papéis e permissões são tratados separadamente. Ajuste apenas as permissões adicionais necessárias para cada participante.";
    }

    if (
      secaoAtiva ===
      SECOES_CONFIGURACAO.MODULOS
    ) {
      return "Visualize quais módulos estão habilitados pela configuração ativa desta campanha.";
    }

    if (
      secaoAtiva ===
      SECOES_CONFIGURACAO.DADOS
    ) {
      return "Informações estruturais e identificação da campanha atualmente carregada.";
    }

    return "Participantes, permissões, módulos e informações administrativas.";
  }


  function ItemConfiguracao({
    icone,
    titulo,
    descricao,
    detalhe = "",
    onClick = null,
    breve = "",
    perigoso = false
  }) {
    const ativo =
      typeof onClick ===
      "function";

    return (
      <button
        type="button"
        className={[
          "config-item",

          ativo
            ? "config-item-ativo"
            : "",

          perigoso
            ? "config-item-perigoso"
            : ""
        ]
          .filter(Boolean)
          .join(" ")}
        disabled={
          !ativo
        }
        onClick={
          ativo
            ? onClick
            : undefined
        }
      >

        <span className="config-item-icone">
          {icone}
        </span>


        <span className="config-item-conteudo">

          <strong>
            {titulo}
          </strong>

          <small>
            {descricao}
          </small>

        </span>


        <span className="config-item-direita">

          {detalhe && (

            <small>
              {detalhe}
            </small>

          )}


          {breve ? (

            <span className="config-item-breve">
              {breve}
            </span>

          ) : ativo ? (

            <span className="config-item-seta">
              ›
            </span>

          ) : null}

        </span>

      </button>
    );
  }


  return (
    <div className="config-campanha">

      <header className="config-topo">

        <button
          type="button"
          className="config-voltar"
          onClick={
            voltar
          }
          aria-label="Voltar"
          title="Voltar"
        >
          ←
        </button>


        <div>

          <p className="config-etiqueta">
            ADMINISTRAÇÃO
          </p>

          <h1>
            {tituloTopo()}
          </h1>

          <p>
            {descricaoTopo()}
          </p>

        </div>

      </header>


      <main className="config-conteudo">

        {/* =================================
            INÍCIO
        ================================= */}

        {secaoAtiva ===
        SECOES_CONFIGURACAO.INICIO && (

          <>

            <section className="config-bloco">

              <h2 className="config-secao-titulo">
                GERENCIAMENTO
              </h2>


              <div className="config-lista">

                <ItemConfiguracao
                  icone="👥"
                  titulo="Participantes e permissões"
                  descricao="Gerencie o que cada participante pode fazer dentro desta campanha."
                  detalhe={
                    `${participantesOrdenados.length} participante${participantesOrdenados.length === 1 ? "" : "s"}`
                  }
                  onClick={() =>
                    setSecaoAtiva(
                      SECOES_CONFIGURACAO.PARTICIPANTES
                    )
                  }
                />


                <ItemConfiguracao
                  icone="▦"
                  titulo="Módulos da campanha"
                  descricao="Consulte os módulos habilitados pela configuração atual."
                  detalhe={
                    `${quantidadeModulosAtivos} ativo${quantidadeModulosAtivos === 1 ? "" : "s"}`
                  }
                  onClick={() =>
                    setSecaoAtiva(
                      SECOES_CONFIGURACAO.MODULOS
                    )
                  }
                />


                <ItemConfiguracao
                  icone="🗂"
                  titulo="Dados da campanha"
                  descricao="Identificação, configuração vinculada e datas da campanha."
                  detalhe={
                    campanha?.nome ||
                    "Campanha"
                  }
                  onClick={() =>
                    setSecaoAtiva(
                      SECOES_CONFIGURACAO.DADOS
                    )
                  }
                />

              </div>

            </section>


            <section className="config-bloco">

              <h2 className="config-secao-titulo">
                ESTRUTURA FUTURA
              </h2>


              <div className="config-lista">

                <ItemConfiguracao
                  icone="🔌"
                  titulo="Integrações"
                  descricao="Conexões externas, automações e serviços da campanha."
                  breve="EM BREVE"
                />


                <ItemConfiguracao
                  icone="👑"
                  titulo="Transferir mestragem"
                  descricao="Transferência explícita da função principal de Mestre."
                  breve="EM BREVE"
                />


                <ItemConfiguracao
                  icone="📜"
                  titulo="Histórico administrativo"
                  descricao="Registro de alterações estruturais e administrativas."
                  breve="EM BREVE"
                />

              </div>

            </section>


            <section className="config-bloco">

              <h2 className="config-secao-titulo config-secao-perigo">
                ZONA DE RISCO
              </h2>


              <div className="config-lista">

                <ItemConfiguracao
                  icone="🗑"
                  titulo="Excluir campanha"
                  descricao="Exclusão permanente da campanha e dos dados relacionados."
                  breve="INDISPONÍVEL"
                  perigoso
                />

              </div>

            </section>

          </>

        )}


        {/* =================================
            PARTICIPANTES
        ================================= */}

        {secaoAtiva ===
        SECOES_CONFIGURACAO.PARTICIPANTES && (

          <>

            {participantesOrdenados.length ===
            0 ? (

              <section className="config-vazio">

                <span>
                  👥
                </span>

                <h2>
                  Nenhum participante
                </h2>

                <p>
                  Esta campanha ainda não possui participantes cadastrados.
                </p>

              </section>

            ) : (

              <>

                <section className="config-bloco">

                  <h2 className="config-secao-titulo">
                    PARTICIPANTE
                  </h2>


                  <div className="config-seletor-participante">

                    <div className="config-avatar">
                      {
                        obterInicial(
                          participanteSelecionado
                            ?.nome
                        )
                      }
                    </div>


                    <div className="config-seletor-texto">

                      <small>
                        EDITANDO PERMISSÕES DE
                      </small>


                      <select
                        value={
                          participanteSelecionadoId
                        }
                        onChange={
                          evento =>
                            setParticipanteSelecionadoId(
                              evento.target.value
                            )
                        }
                      >

                        {participantesOrdenados.map(
                          participante => (

                            <option
                              key={
                                participante.id
                              }
                              value={
                                participante.id
                              }
                            >
                              {
                                participante.nome ||
                                "Participante"
                              }

                              {" — "}

                              {
                                obterNomePapel(
                                  participante
                                )
                              }

                              {
                                participante.ativo ===
                                false
                                  ? " — Inativo"
                                  : ""
                              }
                            </option>

                          )
                        )}

                      </select>

                    </div>

                  </div>


                  {participanteSelecionado && (

                    <div className="config-identidade-participante">

                      <div>

                        <span className="config-identidade-icone">
                          {participanteSelecionadoMestre
                            ? "👑"
                            : "👤"}
                        </span>


                        <div>

                          <strong>
                            {
                              participanteSelecionado
                                .nome ||
                              "Participante"
                            }
                          </strong>

                          <small>
                            {
                              participanteSelecionado.id ===
                              campanha?.usuarioAtualId
                                ? "Perfil atualmente ativo nesta campanha"
                                : participanteSelecionado.ativo ===
                                    false
                                  ? "Participante inativo"
                                  : "Participante ativo"
                            }
                          </small>

                        </div>

                      </div>


                      <span className="config-papel">
                        {
                          obterNomePapel(
                            participanteSelecionado
                          ).toUpperCase()
                        }
                      </span>

                    </div>

                  )}


                  <p className="config-observacao">
                    Papel e permissões são independentes. Um Jogador pode receber permissões extras sem se tornar Mestre.
                  </p>

                  {onConvidarParticipante && (
                    <form className="config-convite" onSubmit={enviarConvite}>
                      <label>
                        Adicionar por nome de usuário
                        <input value={usernameConvite} onChange={evento => setUsernameConvite(evento.target.value)} placeholder="nome de usuário exato" required />
                      </label>
                      <button type="submit">Adicionar jogador</button>
                    </form>
                  )}

                  {participanteSelecionado && participanteSelecionado.id !== campanha?.usuarioAtualId && onRemoverParticipante && (
                    <button type="button" className="config-botao-perigo" onClick={removerSelecionado}>Remover participante</button>
                  )}

                  {feedbackParticipante && <p role="status" className="config-observacao">{feedbackParticipante}</p>}

                </section>


                {participanteSelecionadoMestre && (

                  <section className="config-vazio">

                    <span>
                      👑
                    </span>

                    <h2>
                      Permissões do Mestre
                    </h2>

                    <p>
                      Nesta versão, as permissões principais do Mestre são determinadas pelo papel Mestre e não são alteradas individualmente nesta tela.
                    </p>

                  </section>

                )}


                {participanteSelecionado &&
                !participanteSelecionadoMestre && (

                  <>

                    {GRUPOS_PERMISSOES.map(
                      grupo => (

                        <section
                          key={
                            grupo.id
                          }
                          className="config-bloco"
                        >

                          <h2 className="config-secao-titulo">
                            {grupo.titulo}
                          </h2>


                          <div className="config-lista">

                            {grupo.permissoes.map(
                              permissao => {
                                const ativa =
                                  obterPermissaoAtual(
                                    participanteSelecionado,
                                    permissao.chave
                                  );

                                const personalizada =
                                  permissaoFoiPersonalizada(
                                    participanteSelecionado,
                                    permissao.chave
                                  );

                                return (
                                  <label
                                    key={
                                      permissao.chave
                                    }
                                    className="config-permissao"
                                  >

                                    <span className="config-permissao-icone">
                                      {permissao.icone}
                                    </span>


                                    <span className="config-permissao-texto">

                                      <strong>
                                        {permissao.nome}
                                      </strong>

                                      <small>
                                        {permissao.descricao}

                                        {" "}

                                        {personalizada
                                          ? "• Permissão personalizada."
                                          : "• Padrão do papel."}
                                      </small>

                                    </span>


                                    <input
                                      type="checkbox"
                                      checked={
                                        ativa
                                      }
                                      disabled={
                                        !podeAlterarPermissoes
                                      }
                                      onChange={
                                        evento =>
                                          alterarPermissao(
                                            permissao.chave,
                                            evento.target.checked
                                          )
                                      }
                                    />

                                  </label>
                                );
                              }
                            )}

                          </div>

                        </section>

                      )
                    )}


                    <p className="config-observacao">
                      Alterações feitas aqui são aplicadas à campanha atual. Elas não mudam o papel do participante.
                    </p>

                  </>

                )}

              </>

            )}

          </>

        )}


        {/* =================================
            MÓDULOS
        ================================= */}

        {secaoAtiva ===
        SECOES_CONFIGURACAO.MODULOS && (

          <section className="config-bloco">

            <h2 className="config-secao-titulo">
              MÓDULOS DA CONFIGURAÇÃO ATUAL
            </h2>


            {modulosConfigurados.length ===
            0 ? (

              <div className="config-vazio">

                <span>
                  ▦
                </span>

                <h2>
                  Nenhum módulo configurado
                </h2>

                <p>
                  A configuração ativa não declarou módulos.
                </p>

              </div>

            ) : (

              <div className="config-lista">

                {modulosConfigurados.map(
                  ([
                    chave,
                    ativo
                  ]) => {
                    const dados =
                      ROTULOS_MODULOS[
                        chave
                      ] ||
                      {
                        icone:
                          "□",

                        nome:
                          formatarIdentificador(
                            chave
                          ),

                        descricao:
                          "Módulo configurável da campanha."
                      };

                    return (
                      <div
                        key={
                          chave
                        }
                        className="config-item"
                      >

                        <span className="config-item-icone">
                          {dados.icone}
                        </span>


                        <span className="config-item-conteudo">

                          <strong>
                            {dados.nome}
                          </strong>

                          <small>
                            {dados.descricao}
                          </small>

                        </span>


                        <span className="config-item-direita">

                          <span className="config-item-breve">
                            {ativo
                              ? "ATIVO"
                              : "DESATIVADO"}
                          </span>

                        </span>

                      </div>
                    );
                  }
                )}

              </div>

            )}


            <p className="config-observacao">
              Nesta etapa esta tela é informativa. Ativar e desativar módulos dinamicamente será implementado quando a configuração por campanha puder ser persistida sem alterar o arquivo-base.
            </p>

          </section>

        )}


        {/* =================================
            DADOS
        ================================= */}

        {secaoAtiva ===
        SECOES_CONFIGURACAO.DADOS && (

          <>

            <section className="config-bloco">

              <h2 className="config-secao-titulo">
                IDENTIFICAÇÃO
              </h2>


              <div className="config-lista">

                <div className="config-item">

                  <span className="config-item-icone">
                    🏷
                  </span>

                  <span className="config-item-conteudo">

                    <strong>
                      Nome da campanha
                    </strong>

                    <small>
                      {
                        campanha?.nome ||
                        "Sem nome"
                      }
                    </small>

                  </span>

                </div>


                <div className="config-item">

                  <span className="config-item-icone">
                    📝
                  </span>

                  <span className="config-item-conteudo">

                    <strong>
                      Descrição
                    </strong>

                    <small>
                      {
                        campanha?.descricao ||
                        "Nenhuma descrição cadastrada."
                      }
                    </small>

                  </span>

                </div>


                <div className="config-item">

                  <span className="config-item-icone">
                    🔑
                  </span>

                  <span className="config-item-conteudo">

                    <strong>
                      ID da campanha
                    </strong>

                    <small>
                      {
                        campanha?.id ||
                        "Não identificado"
                      }
                    </small>

                  </span>

                </div>


                <div className="config-item">

                  <span className="config-item-icone">
                    🧩
                  </span>

                  <span className="config-item-conteudo">

                    <strong>
                      Configuração vinculada
                    </strong>

                    <small>
                      {
                        campanha
                          ?.configuracaoId ||
                        configuracaoCampanha
                          ?.id ||
                        "Não identificada"
                      }
                    </small>

                  </span>

                </div>

              </div>

            </section>


            <section className="config-bloco">

              <h2 className="config-secao-titulo">
                ESTADO
              </h2>


              <div className="config-lista">

                <div className="config-item">

                  <span className="config-item-icone">
                    👥
                  </span>

                  <span className="config-item-conteudo">

                    <strong>
                      Participantes
                    </strong>

                    <small>
                      {
                        participantesOrdenados
                          .length
                      } no total •{" "}
                      {
                        quantidadeJogadores
                      } jogador{
                        quantidadeJogadores ===
                        1
                          ? ""
                          : "es"
                      }
                    </small>

                  </span>

                </div>


                <div className="config-item">

                  <span className="config-item-icone">
                    📄
                  </span>

                  <span className="config-item-conteudo">

                    <strong>
                      Entidades
                    </strong>

                    <small>
                      {
                        Array.isArray(
                          campanha?.entidades
                        )
                          ? campanha
                              .entidades
                              .length
                          : 0
                      } cadastrada{
                        Array.isArray(
                          campanha?.entidades
                        ) &&
                        campanha.entidades.length ===
                          1
                          ? ""
                          : "s"
                      }
                    </small>

                  </span>

                </div>


                <div className="config-item">

                  <span className="config-item-icone">
                    📅
                  </span>

                  <span className="config-item-conteudo">

                    <strong>
                      Criada em
                    </strong>

                    <small>
                      {
                        formatarData(
                          campanha?.criadaEm
                        )
                      }
                    </small>

                  </span>

                </div>


                <div className="config-item">

                  <span className="config-item-icone">
                    ↻
                  </span>

                  <span className="config-item-conteudo">

                    <strong>
                      Última atualização
                    </strong>

                    <small>
                      {
                        formatarData(
                          campanha
                            ?.atualizadaEm
                        )
                      }
                    </small>

                  </span>

                </div>

              </div>

            </section>


            <p className="config-observacao">
              A edição direta de nome, descrição e configuração será implementada quando definirmos o fluxo de alteração estrutural da campanha. Por enquanto estes dados são somente leitura para evitar alterações parciais.
            </p>

          </>

        )}

      </main>

    </div>
  );
}


export default ConfiguracoesCampanha;
