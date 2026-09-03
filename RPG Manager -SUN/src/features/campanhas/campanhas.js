import {
  configuracaoCampanha
} from "./configCampanha.js";


/* ========================================
   CHAVES DE ARMAZENAMENTO
======================================== */

export const CHAVE_CAMPANHAS =
  "rpg-manager-campanhas";


export const CHAVE_NAVEGACAO =
  "rpg-manager-navegacao";


export const CHAVE_SESSAO_NAVEGACAO =
  "rpg-manager-sessao-navegacao";


/* ========================================
   USUÁRIO LOCAL

   Ainda não existem contas reais.

   Esta identidade representa o usuário
   atual enquanto o projeto é local.
======================================== */

export const USUARIO_LOCAL_ID =
  "usuario-local";


export const USUARIO_LOCAL_NOME =
  "Você";


/* ========================================
   PAPÉIS DA CAMPANHA
======================================== */

export const PAPEIS_CAMPANHA = {

  MESTRE:
    "mestre",

  JOGADOR:
    "jogador"

};


/* ========================================
   TIPOS DE ENTIDADE
======================================== */

export const TIPOS_ENTIDADE = {

  PERSONAGEM:
    "personagem",

  NPC:
    "npc",

  ADVERSARIO:
    "adversario",

  MONSTRO:
    "monstro",

  AUXILIAR:
    "auxiliar"

};


/* ========================================
   VISIBILIDADES
======================================== */

export const VISIBILIDADES_ENTIDADE = {

  CAMPANHA:
    "campanha",

  PROPRIETARIO:
    "proprietario",

  MESTRE:
    "mestre",

  RESTRITA:
    "restrita"

};


/* ========================================
   CICLO DE VIDA

   ATIVO:
   personagem em uso normal.

   ARQUIVADO:
   personagem preservado historicamente,
   mas fora da lista de ativos.
======================================== */

export const ESTADOS_CICLO_ENTIDADE = {

  ATIVO:
    "ativo",

  ARQUIVADO:
    "arquivado"

};


/* ========================================
   CRIAR CICLO INICIAL
======================================== */

export function criarCicloEntidadeInicial() {

  return {

    estado:
      ESTADOS_CICLO_ENTIDADE
        .ATIVO,


    motivoEncerramento:
      null,


    encerradoEm:
      null,


    restauradoEm:
      null,


    historico:
      []

  };

}


/* ========================================
   NORMALIZAR CICLO
======================================== */

export function normalizarCicloEntidade(
  ciclo
) {

  const padrao =
    criarCicloEntidadeInicial();


  if (
    !ciclo ||
    typeof ciclo !==
    "object"
  ) {

    return padrao;

  }


  const estadosValidos =
    Object.values(
      ESTADOS_CICLO_ENTIDADE
    );


  const estado =
    estadosValidos.includes(
      ciclo.estado
    )

      ? ciclo.estado

      : ESTADOS_CICLO_ENTIDADE
          .ATIVO;


  return {

    estado,


    motivoEncerramento:
      ciclo.motivoEncerramento ??
      null,


    encerradoEm:
      typeof ciclo.encerradoEm ===
      "number"

        ? ciclo.encerradoEm

        : null,


    restauradoEm:
      typeof ciclo.restauradoEm ===
      "number"

        ? ciclo.restauradoEm

        : null,


    historico:
      Array.isArray(
        ciclo.historico
      )

        ? ciclo.historico

        : []

  };

}


/* ========================================
   VERIFICAR SE ESTÁ ARQUIVADA
======================================== */

export function entidadeEstaArquivada(
  entidade
) {

  return (

    entidade
      ?.ciclo
      ?.estado ===
    ESTADOS_CICLO_ENTIDADE
      .ARQUIVADO

  );

}


/* ========================================
   PERMISSÕES DO MESTRE
======================================== */

export const permissoesMestre = {

  /* CAMPANHA */

  administrarCampanha:
    true,

  editarConfiguracao:
    true,


  /* PERSONAGENS */

  criarPersonagens:
    true,

  visualizarPersonagensCampanha:
    true,

  editarPropriosPersonagens:
    true,

  excluirPropriosPersonagens:
    true,

  editarQualquerPersonagem:
    true,

  excluirQualquerPersonagem:
    true,


  /* MESTRAGEM */

  criarNPCs:
    true,

  criarAdversarios:
    true,

  criarMonstros:
    true,

  criarAuxiliares:
    true,


  /* CONTEÚDO */

  criarConteudo:
    true,

  editarConteudoCompartilhado:
    true,

  visualizarConteudoOculto:
    true,


  /* PARTICIPANTES */

  administrarJogadores:
    true,

  administrarPermissoes:
    true

};


/* ========================================
   PERMISSÕES DO JOGADOR
======================================== */

export const permissoesJogador = {

  /* CAMPANHA */

  administrarCampanha:
    false,

  editarConfiguracao:
    false,


  /* PERSONAGENS */

  criarPersonagens:
    true,

  visualizarPersonagensCampanha:
    true,

  editarPropriosPersonagens:
    true,

  excluirPropriosPersonagens:
    true,

  editarQualquerPersonagem:
    false,

  excluirQualquerPersonagem:
    false,


  /* MESTRAGEM */

  criarNPCs:
    false,

  criarAdversarios:
    false,

  criarMonstros:
    false,

  criarAuxiliares:
    false,


  /* CONTEÚDO */

  criarConteudo:
    false,

  editarConteudoCompartilhado:
    false,

  visualizarConteudoOculto:
    false,


  /* PARTICIPANTES */

  administrarJogadores:
    false,

  administrarPermissoes:
    false

};


/* ========================================
   CRIAR ACESSO
======================================== */

export function criarAcessoCampanha(

  papel =
    PAPEIS_CAMPANHA.JOGADOR,

  permissoesExtras =
    {}

) {

  const permissoesBase =
    papel ===
    PAPEIS_CAMPANHA.MESTRE

      ? permissoesMestre

      : permissoesJogador;


  return {

    papel,


    permissoes: {

      ...permissoesBase,

      ...permissoesExtras

    }

  };

}


/* ========================================
   CRIAR PARTICIPANTE
======================================== */

export function criarParticipante({

  id,

  nome =
    "Participante",

  papel =
    PAPEIS_CAMPANHA.JOGADOR,

  permissoesExtras =
    {},

  ativo =
    true

}) {

  const agora =
    Date.now();


  return {

    id,

    nome,

    ativo,


    acesso:
      criarAcessoCampanha(
        papel,
        permissoesExtras
      ),


    criadoEm:
      agora,


    atualizadoEm:
      agora

  };

}


/* ========================================
   NORMALIZAR PARTICIPANTE
======================================== */

export function normalizarParticipante(

  participante,

  papelPadrao =
    PAPEIS_CAMPANHA.JOGADOR

) {

  if (
    !participante ||
    typeof participante !==
    "object" ||
    !participante.id
  ) {

    return null;

  }


  const papel =
    participante
      ?.acesso
      ?.papel ||

    participante.papel ||

    papelPadrao;


  const permissoesExtras =
    participante
      ?.acesso
      ?.permissoes ||

    participante.permissoes ||

    {};


  return {

    ...participante,


    id:
      participante.id,


    nome:
      participante.nome ||
      "Participante",


    ativo:
      participante.ativo !==
      false,


    acesso:
      criarAcessoCampanha(
        papel,
        permissoesExtras
      ),


    criadoEm:
      participante.criadoEm ||
      Date.now(),


    atualizadoEm:
      participante.atualizadoEm ||
      participante.criadoEm ||
      Date.now()

  };

}


/* ========================================
   BUSCAR PARTICIPANTE
======================================== */

export function buscarParticipante(

  campanha,

  participanteId

) {

  if (
    !campanha ||
    !participanteId
  ) {

    return null;

  }


  const participantes =
    Array.isArray(
      campanha.participantes
    )

      ? campanha.participantes

      : [];


  return (

    participantes.find(
      participante =>
        participante.id ===
        participanteId
    ) ||

    null

  );

}


/* ========================================
   PARTICIPANTE ATUAL
======================================== */

export function obterParticipanteAtual(
  campanha
) {

  if (!campanha) {

    return null;

  }


  const participanteId =
    campanha.usuarioAtualId ||
    USUARIO_LOCAL_ID;


  return buscarParticipante(
    campanha,
    participanteId
  );

}


/* ========================================
   ACESSO ATUAL
======================================== */

export function obterAcessoAtual(
  campanha
) {

  const participanteAtual =
    obterParticipanteAtual(
      campanha
    );


  if (
    participanteAtual
      ?.acesso
  ) {

    return participanteAtual
      .acesso;

  }


  return (

    campanha?.acesso ||

    criarAcessoCampanha()

  );

}


/* ========================================
   POSSUI PERMISSÃO
======================================== */

export function possuiPermissao(

  campanha,

  permissao

) {

  const acesso =
    obterAcessoAtual(
      campanha
    );


  return Boolean(

    acesso
      ?.permissoes
      ?.[permissao]

  );

}


/* ========================================
   PARTICIPANTE É MESTRE
======================================== */

export function participanteEhMestre(

  campanha,

  participanteId

) {

  const participante =
    buscarParticipante(
      campanha,
      participanteId
    );


  if (participante) {

    return (

      participante
        ?.acesso
        ?.papel ===
      PAPEIS_CAMPANHA.MESTRE

    );

  }


  /*
    Compatibilidade com campanhas
    criadas antes de participantes.
  */

  if (
    participanteId ===
    (
      campanha?.usuarioAtualId ||
      USUARIO_LOCAL_ID
    )
  ) {

    return (

      campanha
        ?.acesso
        ?.papel ===
      PAPEIS_CAMPANHA.MESTRE

    );

  }


  return false;

}


/* ========================================
   VISUALIZAR ENTIDADE
======================================== */

export function podeVisualizarEntidade(

  campanha,

  entidade,

  participanteId =
    campanha?.usuarioAtualId ||
    USUARIO_LOCAL_ID

) {

  if (
    !campanha ||
    !entidade
  ) {

    return false;

  }


  /* Mestre visualiza tudo */

  if (
    participanteEhMestre(
      campanha,
      participanteId
    )
  ) {

    return true;

  }


  /* Dono visualiza a própria entidade */

  if (
    entidade.proprietarioId ===
    participanteId
  ) {

    return true;

  }


  const visibilidade =
    entidade.visibilidade ||
    VISIBILIDADES_ENTIDADE
      .CAMPANHA;


  if (
    visibilidade ===
    VISIBILIDADES_ENTIDADE
      .CAMPANHA
  ) {

    return true;

  }


  if (
    visibilidade ===
    VISIBILIDADES_ENTIDADE
      .PROPRIETARIO
  ) {

    return false;

  }


  if (
    visibilidade ===
    VISIBILIDADES_ENTIDADE
      .MESTRE
  ) {

    return false;

  }


  if (
    visibilidade ===
    VISIBILIDADES_ENTIDADE
      .RESTRITA
  ) {

    const permitidos =
      Array.isArray(
        entidade
          .participantesPermitidos
      )

        ? entidade
            .participantesPermitidos

        : [];


    return permitidos.includes(
      participanteId
    );

  }


  return false;

}


/* ========================================
   EDITAR ENTIDADE
======================================== */

export function podeEditarEntidade(

  campanha,

  entidade,

  participanteId =
    campanha?.usuarioAtualId ||
    USUARIO_LOCAL_ID

) {

  if (
    !campanha ||
    !entidade
  ) {

    return false;

  }


  const participante =
    buscarParticipante(
      campanha,
      participanteId
    );


  if (participante) {

    const permissoes =
      participante
        ?.acesso
        ?.permissoes ||
      {};


    if (
      permissoes
        .editarQualquerPersonagem
    ) {

      return true;

    }


    if (
      entidade.proprietarioId ===
        participanteId &&
      permissoes
        .editarPropriosPersonagens
    ) {

      return true;

    }


    return false;

  }


  /*
    Compatibilidade temporária
    com campanhas antigas.
  */

  const acesso =
    obterAcessoAtual(
      campanha
    );


  if (
    acesso
      ?.permissoes
      ?.editarQualquerPersonagem
  ) {

    return true;

  }


  if (
    entidade.proprietarioId ===
      participanteId &&
    acesso
      ?.permissoes
      ?.editarPropriosPersonagens
  ) {

    return true;

  }


  return false;

}


/* ========================================
   EXCLUIR ENTIDADE
======================================== */

export function podeExcluirEntidade(

  campanha,

  entidade,

  participanteId =
    campanha?.usuarioAtualId ||
    USUARIO_LOCAL_ID

) {

  if (
    !campanha ||
    !entidade
  ) {

    return false;

  }


  const participante =
    buscarParticipante(
      campanha,
      participanteId
    );


  if (participante) {

    const permissoes =
      participante
        ?.acesso
        ?.permissoes ||
      {};


    if (
      permissoes
        .excluirQualquerPersonagem
    ) {

      return true;

    }


    if (
      entidade.proprietarioId ===
        participanteId &&
      permissoes
        .excluirPropriosPersonagens
    ) {

      return true;

    }


    return false;

  }


  const acesso =
    obterAcessoAtual(
      campanha
    );


  if (
    acesso
      ?.permissoes
      ?.excluirQualquerPersonagem
  ) {

    return true;

  }


  if (
    entidade.proprietarioId ===
      participanteId &&
    acesso
      ?.permissoes
      ?.excluirPropriosPersonagens
  ) {

    return true;

  }


  return false;

}


/* ========================================
   CRIAR CAMPANHA
======================================== */

export function criarCampanha({

  id,

  nome,

  descricao =
    "",

  configuracaoId =
    "",

  papel =
    PAPEIS_CAMPANHA.JOGADOR,

  permissoesExtras =
    {},

  entidades =
    [],

  participantes =
    [],

  usuarioAtualId =
    USUARIO_LOCAL_ID

}) {

  const agora =
    Date.now();


  let participantesFinais =
    Array.isArray(
      participantes
    )

      ? participantes
          .map(
            participante =>
              normalizarParticipante(
                participante
              )
          )
          .filter(Boolean)

      : [];


  let participanteAtual =
    participantesFinais.find(
      participante =>
        participante.id ===
        usuarioAtualId
    );


  if (!participanteAtual) {

    participanteAtual =
      criarParticipante({

        id:
          usuarioAtualId,

        nome:
          USUARIO_LOCAL_NOME,

        papel,

        permissoesExtras

      });


    participantesFinais = [

      ...participantesFinais,

      participanteAtual

    ];

  }


  return {

    id,

    nome,

    descricao,

    configuracaoId,


    usuarioAtualId,


    participantes:
      participantesFinais,


    /*
      Mantido temporariamente porque
      algumas partes antigas do projeto
      ainda consultam campanha.acesso.
    */

    acesso:
      participanteAtual.acesso,


    entidades,


    equipe:
      null,


    jornada:
      null,


    vinculos:
      [],


    criadaEm:
      agora,


    atualizadaEm:
      agora

  };

}


/* ========================================
   CAMPANHA SUPER ONZE
======================================== */

export function criarCampanhaSuperOnze(
  fichasExistentes = []
) {

  const entidades =
    fichasExistentes.map(
      ficha => ({

        ...ficha,


        tipoEntidade:
          ficha.tipoEntidade ||
          TIPOS_ENTIDADE
            .PERSONAGEM,


        proprietarioId:
          ficha.proprietarioId ||
          USUARIO_LOCAL_ID,


        visibilidade:
          ficha.visibilidade ||
          VISIBILIDADES_ENTIDADE
            .CAMPANHA,


        participantesPermitidos:
          Array.isArray(
            ficha.participantesPermitidos
          )

            ? ficha
                .participantesPermitidos

            : [],


        ciclo:
          normalizarCicloEntidade(
            ficha.ciclo
          )

      })
    );


  return criarCampanha({

    id:
      configuracaoCampanha.id,


    nome:
      configuracaoCampanha.nome,


    descricao:
      configuracaoCampanha
        .descricao,


    configuracaoId:
      configuracaoCampanha.id,


    papel:
      PAPEIS_CAMPANHA.MESTRE,


    usuarioAtualId:
      USUARIO_LOCAL_ID,


    entidades

  });

}


/* ========================================
   NAVEGAÇÃO PADRÃO
======================================== */

export function criarNavegacaoInicial() {

  return {

    campanhaAtivaId:
      null,


    entidadeAtivaId:
      null,


    tela:
      "campanhas",


    ultimaAtividade:
      null

  };

}


/* ========================================
   NORMALIZAR NAVEGAÇÃO
======================================== */

export function normalizarNavegacao(
  navegacao
) {

  const padrao =
    criarNavegacaoInicial();


  if (
    !navegacao ||
    typeof navegacao !==
    "object"
  ) {

    return padrao;

  }


  const telasValidas = [

    "campanhas",

    "campanha",

    "ficha"

  ];


  const tela =
    telasValidas.includes(
      navegacao.tela
    )

      ? navegacao.tela

      : padrao.tela;


  return {

    campanhaAtivaId:
      navegacao
        .campanhaAtivaId ??
      null,


    entidadeAtivaId:
      navegacao
        .entidadeAtivaId ??
      null,


    tela,


    ultimaAtividade:
      typeof navegacao
        .ultimaAtividade ===
      "number"

        ? navegacao
            .ultimaAtividade

        : null

  };

}