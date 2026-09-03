import {
  arquetiposSuperOnze,
  talentosPosicionaisSuperOnze,
  colecoesProgressaoSuperOnze,
  FAMILIAS_TALENTO
} from "../habilidades/data/conteudoSuperOnze.js";

import {
  bancoHissatsuSuperOnze
} from "../habilidades/data/bancoHissatsuSuperOnze.js";

import {
  midiasSuperOnze
} from "../habilidades/data/midiasSuperOnze.js";


/* ========================================
   LIMPEZA DE PROPRIEDADES LEGADAS
======================================== */

function prepararColecaoBase(
  colecao
) {
  const resultado = {
    ...(colecao || {})
  };


  delete resultado.escolhaInicial;
  delete resultado.obrigatoriaNaCriacao;
  delete resultado.obrigatorioParaTipos;


  return resultado;
}


/* ========================================
   PROGRESSÃO
======================================== */

const colecaoArquetiposOriginal =
  colecoesProgressaoSuperOnze.find(
    colecao =>
      colecao.id ===
      "arquetipos"
  );


const colecaoTalentosOriginal =
  colecoesProgressaoSuperOnze.find(
    colecao =>
      colecao.id ===
      "talentos-posicionais"
  );


const colecaoArquetipos =
  prepararColecaoBase(
    colecaoArquetiposOriginal
  );


const colecaoTalentos =
  prepararColecaoBase(
    colecaoTalentosOriginal
  );


/* ========================================
   ESTRUTURA FUNCIONAL
======================================== */

const funcoesSuperOnze = [

  {
    id:
      "goleiro",

    valor:
      "Goleiro",

    nome:
      "Goleiro",

    especializacoes:
      []
  },


  {
    id:
      "defesa",

    valor:
      "Defesa",

    nome:
      "Defesa",

    especializacoes: [
      "Zagueiro Central",
      "Líbero",
      "Lateral Direito",
      "Lateral Esquerdo",
      "Ala Direito",
      "Ala Esquerdo"
    ]
  },


  {
    id:
      "meio-campo",

    valor:
      "Meio-campo",

    nome:
      "Meio-campo",

    especializacoes: [
      "Volante",
      "Meio-Campista Central",
      "Meia Direita",
      "Meia Esquerda",
      "Meia Ofensivo",
      "Meia Box-to-Box"
    ]
  },


  {
    id:
      "atacante",

    valor:
      "Atacante",

    nome:
      "Atacante",

    especializacoes: [
      "Centroavante",
      "Segundo Atacante",
      "Ponta Direita",
      "Ponta Esquerda"
    ]
  }

];


const afinidadeTalentoPorFuncao = {

  Atacante:
    FAMILIAS_TALENTO.OFENSIVO,

  Defesa:
    FAMILIAS_TALENTO.DEFENSIVO,

  "Meio-campo":
    FAMILIAS_TALENTO.MEIO_CAMPO,

  Goleiro:
    FAMILIAS_TALENTO.GOLEIRO

};


/* ========================================
   ATRIBUTOS UTILIZÁVEIS COMO REQUISITO
======================================== */

const atributosRequisitosSuperOnze = [

  {
    chave:
      "forca",

    nome:
      "Força"
  },


  {
    chave:
      "destreza",

    nome:
      "Destreza"
  },


  {
    chave:
      "constituicao",

    nome:
      "Constituição"
  },


  {
    chave:
      "agilidade",

    nome:
      "Agilidade"
  },


  {
    chave:
      "resistencia",

    nome:
      "Resistência"
  },


  {
    chave:
      "visao",

    nome:
      "Visão"
  },


  {
    chave:
      "percepcao",

    nome:
      "Percepção"
  },


  {
    chave:
      "inteligencia",

    nome:
      "Inteligência"
  },


  {
    chave:
      "sabedoria",

    nome:
      "Sabedoria"
  },


  {
    chave:
      "sorte",

    nome:
      "Sorte"
  },


  {
    chave:
      "carisma",

    nome:
      "Carisma"
  }

];


/* ========================================
   TIPOS DE HISSATSU
======================================== */

const tiposHissatsuSuperOnze = {

  chute: {

    nome:
      "Chute",

    icone:
      "⚽",

    parametros: [

      {
        chave:
          "impacto",

        nome:
          "Impacto"
      },

      {
        chave:
          "velocidade",

        nome:
          "Velocidade"
      },

      {
        chave:
          "precisao",

        nome:
          "Precisão"
      },

      {
        chave:
          "curva",

        nome:
          "Curva"
      },

      {
        chave:
          "pressao",

        nome:
          "Pressão"
      },

      {
        chave:
          "estabilidade",

        nome:
          "Estabilidade"
      }

    ]

  },


  drible: {

    nome:
      "Drible",

    icone:
      "💨",

    parametros: [

      {
        chave:
          "controle",

        nome:
          "Controle"
      },

      {
        chave:
          "agilidade",

        nome:
          "Agilidade"
      },

      {
        chave:
          "velocidade",

        nome:
          "Velocidade"
      },

      {
        chave:
          "tecnica",

        nome:
          "Técnica"
      },

      {
        chave:
          "imprevisibilidade",

        nome:
          "Imprevisibilidade"
      },

      {
        chave:
          "estabilidade",

        nome:
          "Estabilidade"
      }

    ]

  },


  bloqueio: {

    nome:
      "Bloqueio",

    icone:
      "🛡️",

    parametros: [

      {
        chave:
          "bloqueio",

        nome:
          "Bloqueio"
      },

      {
        chave:
          "resistencia",

        nome:
          "Resistência"
      },

      {
        chave:
          "alcance",

        nome:
          "Alcance"
      },

      {
        chave:
          "reacao",

        nome:
          "Reação"
      },

      {
        chave:
          "pressao",

        nome:
          "Pressão"
      },

      {
        chave:
          "estabilidade",

        nome:
          "Estabilidade"
      }

    ]

  },


  defesa_goleiro: {

    nome:
      "Defesa de goleiro",

    icone:
      "🧤",

    parametros: [

      {
        chave:
          "defesa",

        nome:
          "Defesa"
      },

      {
        chave:
          "reflexo",

        nome:
          "Reflexo"
      },

      {
        chave:
          "alcance",

        nome:
          "Alcance"
      },

      {
        chave:
          "firmeza",

        nome:
          "Firmeza"
      },

      {
        chave:
          "reacao",

        nome:
          "Reação"
      },

      {
        chave:
          "estabilidade",

        nome:
          "Estabilidade"
      }

    ]

  },


  passe: {

    nome:
      "Passe",

    icone:
      "🎯",

    parametros: [

      {
        chave:
          "precisao",

        nome:
          "Precisão"
      },

      {
        chave:
          "alcance",

        nome:
          "Alcance"
      },

      {
        chave:
          "velocidade",

        nome:
          "Velocidade"
      },

      {
        chave:
          "controle",

        nome:
          "Controle"
      },

      {
        chave:
          "leitura",

        nome:
          "Leitura"
      },

      {
        chave:
          "estabilidade",

        nome:
          "Estabilidade"
      }

    ]

  },


  suporte: {

    nome:
      "Suporte",

    icone:
      "✨",

    parametros: [

      {
        chave:
          "alcance",

        nome:
          "Alcance"
      },

      {
        chave:
          "duracao",

        nome:
          "Duração"
      },

      {
        chave:
          "intensidade",

        nome:
          "Intensidade"
      },

      {
        chave:
          "controle",

        nome:
          "Controle"
      },

      {
        chave:
          "estabilidade",

        nome:
          "Estabilidade"
      },

      {
        chave:
          "versatilidade",

        nome:
          "Versatilidade"
      }

    ]

  },


  outro: {

    nome:
      "Outro",

    icone:
      "✦",

    parametros: [

      {
        chave:
          "potencia",

        nome:
          "Potência"
      },

      {
        chave:
          "controle",

        nome:
          "Controle"
      },

      {
        chave:
          "alcance",

        nome:
          "Alcance"
      },

      {
        chave:
          "velocidade",

        nome:
          "Velocidade"
      },

      {
        chave:
          "estabilidade",

        nome:
          "Estabilidade"
      },

      {
        chave:
          "versatilidade",

        nome:
          "Versatilidade"
      }

    ]

  }

};


/* ========================================
   CAMPANHA
======================================== */

export const campanhaSuperOnze = {

  id:
    "super-onze-rpg",

  nome:
    "Super Onze RPG",

  descricao:
    "Campanha inspirada em Inazuma Eleven.",


  /* ========================================
     INFORMAÇÕES
  ======================================== */

  informacoes: {

    campos: [

      {
        chave:
          "idade",

        nome:
          "Idade",

        tipo:
          "numero",

        unidade:
          "anos",

        valorInicial:
          15
      },


      {
        chave:
          "altura",

        nome:
          "Altura",

        tipo:
          "numero",

        unidade:
          "cm",

        valorInicial:
          ""
      },


      {
        chave:
          "peDominante",

        nome:
          "Pé dominante",

        tipo:
          "selecao",

        valorInicial:
          "Direito",

        opcoes: [
          "Direito",
          "Esquerdo",
          "Ambidestro"
        ]
      },


      {
        chave:
          "raca",

        nome:
          "Raça",

        tipo:
          "texto",

        valorInicial:
          "Humano"
      },


      {
        chave:
          "nivel",

        nome:
          "Nível",

        tipo:
          "numero",

        valorInicial:
          1
      },


      {
        chave:
          "experiencia",

        nome:
          "EXP",

        tipo:
          "numero",

        valorInicial:
          0
      }

    ]

  },


  /* ========================================
     FUNÇÃO / ESPECIALIZAÇÃO
  ======================================== */

  estruturaFuncional: {

    ativo:
      true,

    campoPrincipal:
      "posicao",

    campoSecundario:
      "especializacaoFuncao",

    rotuloPrincipal:
      "Posição",

    rotuloSecundario:
      "Função em campo",

    valorInicial:
      "Meio-campo",

    permiteSemEspecializacao:
      true,

    opcoes:
      funcoesSuperOnze

  },


  /* Compatibilidade temporária. */

  posicoes:
    funcoesSuperOnze.map(
      funcao =>
        funcao.valor
    ),

  posicaoInicial:
    "Meio-campo",


  /* ========================================
     RECURSOS
  ======================================== */

  recursos: [

    {
      chave:
        "vida",

      nome:
        "Vida",

      icone:
        "❤️",

      maximoInicial:
        100,

      atualInicial:
        100,

      categoria:
        "recurso",

      exibirNoCriador:
        true
    },


    {
      chave:
        "gp",

      nome:
        "GP",

      icone:
        "◆",

      maximoInicial:
        100,

      atualInicial:
        100,

      categoria:
        "recurso",

      exibirNoCriador:
        true
    },


    {
      chave:
        "tp",

      nome:
        "TP",

      icone:
        "⚡",

      maximoInicial:
        100,

      atualInicial:
        100,

      categoria:
        "recurso",

      exibirNoCriador:
        true
    },


    {
      chave:
        "ritmoIndividual",

      nome:
        "Ritmo Individual",

      icone:
        "🎵",

      maximoInicial:
        10,

      atualInicial:
        10,

      categoria:
        "fluxo",

      exibirNoCriador:
        false
    },


    {
      chave:
        "ritmoEquipe",

      nome:
        "Ritmo da Equipe",

      icone:
        "👥",

      maximoInicial:
        20,

      atualInicial:
        20,

      categoria:
        "fluxo",

      exibirNoCriador:
        false
    }

  ],


  /* ========================================
     MOMENTUM
  ======================================== */

  momentum: {

    ativo:
      true,

    atualInicial:
      10,

    maximoInicial:
      10,

    categoria:
      "fluxo-especial",

    descricao:
      "Recurso especial raro utilizado em jogadas importantes e difícil de recuperar."

  },


  /* ========================================
     CONDIÇÕES
  ======================================== */

  estadosPersonagem: {

    fisico: {

      ativo:
        true,

      valorInicial:
        "Normal"

    },


    mental: {

      ativo:
        true,

      valorInicial:
        "Estável"

    }

  },


  /* ========================================
     HABILIDADES
  ======================================== */

  habilidades: {

    ativo:
      true,


    rotulos: {

      singular:
        "Hissatsu",

      plural:
        "Hissatsu",

      nova:
        "Nova Hissatsu",

      editar:
        "Editar Hissatsu",

      biblioteca:
        "Banco de Hissatsu",

      parametros:
        "Parâmetros da técnica"

    },


    /* ======================================
       LOCALIZAÇÃO

       A campanha prefere PT-BR na superfície.

       O Banco continua preservando os demais
       nomes para busca e referência.
    ====================================== */

    localizacao: {

      idiomaPrincipal:
        "ptBR",

      mostrarNomeOriginal:
        true,

      indexarTodosOsNomes:
        true

    },


    tipoInicial:
      "chute",


    tipos:
      tiposHissatsuSuperOnze,


    escalaParametros: {

      minimo:
        0,

      maximo:
        10

    },


    custoPrincipal: {

      campo:
        "custoTP",

      nome:
        "TP",

      unidade:
        "TP",

      icone:
        "⚡",

      minimo:
        0

    },


    /* ======================================
       PADRÕES MECÂNICOS

       Esta é a mudança central desta etapa.

       Eles NÃO são dados oficiais da
       franquia.

       São defaults da CAMPANHA.

       Uma Hissatsu recém-catalogada já
       consegue funcionar com:

       TP: 20

       e todos os parâmetros do seu tipo
       começando em 5.

       O Mestre configura somente exceções.
    ====================================== */

    padroesMecanica: {

      custoPrincipal:
        20,


      valorParametro:
        5,


      grau:
        "",


      custos:
        {},


      requisitosAtributos:
        {},


      requisitosNarrativos:
        [],


      /* ====================================
         PADRÕES ESPECÍFICOS POR TIPO

         Por enquanto vazio.

         No futuro poderemos fazer, por
         exemplo:

         chute: {
           custoPrincipal: 18,

           parametros: {
             impacto: 6
           }
         }

         sem modificar o núcleo.
      ==================================== */

      porTipo:
        {}

    },


    custosAdicionais: [

      {
        chave:
          "ritmo",

        nome:
          "Ritmo",

        tipo:
          "numero",

        minimo:
          0,

        opcional:
          true
      },


      {
        chave:
          "momentum",

        nome:
          "Momentum necessário",

        tipo:
          "numero",

        minimo:
          0,

        opcional:
          true
      },


      {
        chave:
          "condicao",

        nome:
          "Condição de utilização",

        tipo:
          "texto",

        opcional:
          true,

        placeholder:
          "Ex.: Bola sob controle"
      }

    ],


    requisitos: {

      atributosDisponiveis:
        atributosRequisitosSuperOnze

    },


    /* ======================================
       BANCO
    ====================================== */

    biblioteca: {

      ativo:
        true,


      registros:
        bancoHissatsuSuperOnze,


      /* ====================================
         DISPONIBILIDADE INICIAL

         Técnica nova:

         - já possui mecânica funcional;
         - mas não precisa estar liberada.

         Isso separa "funciona" de
         "jogadores podem adquirir".
      ==================================== */

      disponibilidadeInicial:
        "bloqueada",


      catalogos: {

        midias:
          midiasSuperOnze

      },


      aquisicao: {

        modo:
          "snapshot",

        atualizarAutomaticamente:
          false,

        preservarOrigem:
          true,


        camposOrigem: {

          id:
            "origemBibliotecaId",

          versao:
            "origemBibliotecaVersao",

          nome:
            "origemBibliotecaNome"

        }

      },


      filtros: {

        busca:
          true,

        tipo:
          true,

        elemento:
          true,

        classificacao:
          true,

        origem:
          true,

        midia:
          true,

        era:
          true,

        situacao:
          true

      },


      ordenacaoInicial:
        "nome"

    }

  },


  /* ========================================
     PROGRESSÃO
  ======================================== */

  progressao: {

    colecoes: [

      {
        ...colecaoArquetipos,

        id:
          "arquetipos",

        descricao:
          "Uma característica central que representa a maneira única como o personagem se destaca.",


        armazenamento: {

          campo:
            "arquetipoId",

          formato:
            "unico"

        },


        criacaoInicial: {

          habilitado:
            true,

          minimo:
            0,


          minimoPorTipo: {

            personagem:
              1

          },


          maximo:
            1,

          modo:
            "adicionar"

        },


        opcoes:
          arquetiposSuperOnze

      },


      {
        ...colecaoTalentos,

        id:
          "talentos-posicionais",

        descricao:
          "Passivas ligadas ao estilo de jogo. A função principal cria afinidade, mas não impede outras escolhas.",


        armazenamento: {

          campo:
            "talentosPosicionais",

          formato:
            "lista",

          item:
            "objeto",


          valoresIniciais: {

            grau:
              1,

            observacaoEvolucao:
              ""

          },


          registrarAquisicao:
            true

        },


        criacaoInicial: {

          habilitado:
            true,

          minimo:
            0,

          maximo:
            null,

          modo:
            "adicionar"

        },


        grupos: [

          {
            id:
              FAMILIAS_TALENTO.OFENSIVO,

            nome:
              "Ofensivos",

            icone:
              "⚽"
          },


          {
            id:
              FAMILIAS_TALENTO.DEFENSIVO,

            nome:
              "Defensivos",

            icone:
              "🛡️"
          },


          {
            id:
              FAMILIAS_TALENTO.MEIO_CAMPO,

            nome:
              "Meio-campo",

            icone:
              "🧠"
          },


          {
            id:
              FAMILIAS_TALENTO.GOLEIRO,

            nome:
              "Goleiro",

            icone:
              "🧤"
          }

        ],


        opcoesPorGrupo:
          talentosPosicionaisSuperOnze,


        afinidadePorFuncaoPrincipal:
          afinidadeTalentoPorFuncao,


        afinidadePorPosicao:
          afinidadeTalentoPorFuncao

      }

    ]

  },


  /* ========================================
     MÓDULOS
  ======================================== */

  modulos: {

    resumo:
      true,

    atributos:
      true,

    habilidades:
      true,

    recursos:
      true,

    arquetipo:
      true,

    talentos:
      true,

    ritmo:
      true,

    momentum:
      true,

    condicoes:
      true,

    vinculos:
      true,

    jornada:
      true,

    evolucao:
      true,

    inventario:
      true

  }

};


/* ========================================
   CAMPANHA ATUAL
======================================== */

export const configuracaoCampanha =
  campanhaSuperOnze;


/* ========================================
   BUSCAR RECURSO
======================================== */

export function buscarRecursoCampanha(
  chave
) {
  return (
    configuracaoCampanha
      .recursos
      .find(
        recurso =>
          recurso.chave ===
          chave
      ) ||
    null
  );
}


/* ========================================
   CRIAR RECURSOS INICIAIS
======================================== */

export function criarRecursosIniciais() {
  const resultado =
    {};


  configuracaoCampanha
    .recursos
    .forEach(
      recurso => {

        resultado[
          recurso.chave
        ] = {

          atual:
            recurso.atualInicial,

          maximo:
            recurso.maximoInicial

        };

      }
    );


  return resultado;
}


/* ========================================
   CRIAR INFORMAÇÕES INICIAIS
======================================== */

export function criarInformacoesIniciais() {
  const resultado =
    {};


  configuracaoCampanha
    .informacoes
    .campos
    .forEach(
      campo => {

        resultado[
          campo.chave
        ] =
          campo.valorInicial;

      }
    );


  return resultado;
}


/* ========================================
   CRIAR ESTADOS INICIAIS
======================================== */

export function criarEstadosIniciais() {
  return {

    fisico:
      configuracaoCampanha
        .estadosPersonagem
        .fisico
        .valorInicial,


    mental:
      configuracaoCampanha
        .estadosPersonagem
        .mental
        .valorInicial

  };
}


/* ========================================
   CRIAR MOMENTUM INICIAL
======================================== */

export function criarMomentumInicial() {
  return {

    atual:
      Math.max(
        0,

        Number(
          configuracaoCampanha
            ?.momentum
            ?.atualInicial
        ) ||
        0
      ),


    maximo:
      Math.max(
        0,

        Number(
          configuracaoCampanha
            ?.momentum
            ?.maximoInicial
        ) ||
        0
      )

  };
}


/* ========================================
   CRIAR PROGRESSÃO INICIAL
======================================== */

export function criarProgressaoInicial() {
  const resultado =
    {};


  const colecoes =
    configuracaoCampanha
      ?.progressao
      ?.colecoes ||
    [];


  colecoes.forEach(
    colecao => {

      const campo =
        colecao
          ?.armazenamento
          ?.campo;


      const formato =
        colecao
          ?.armazenamento
          ?.formato;


      if (!campo) {
        return;
      }


      resultado[
        campo
      ] =
        formato ===
        "lista"
          ? []
          : null;

    }
  );


  return resultado;
}