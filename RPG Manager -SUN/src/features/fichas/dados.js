import {
  configuracaoCampanha,
  criarInformacoesIniciais,
  criarRecursosIniciais,
  criarEstadosIniciais
} from "../campanhas/configCampanha.js";


/* ========================================
   CHAVE DO ARMAZENAMENTO
======================================== */

export const CHAVE_FICHAS =
  "rpg-manager-fichas";


/* ========================================
   ATRIBUTOS PADRÃO
======================================== */

export const atributosPadrao = {

  forca: 10,

  destreza: 10,

  constituicao: 10,

  agilidade: 10,

  resistencia: 10,

  visao: 10,

  percepcao: 10,

  inteligencia: 10,

  sabedoria: 10,

  sorte: 10,

  carisma: 10

};


/* ========================================
   INFORMAÇÕES PADRÃO

   Agora parte das informações vem
   da configuração da campanha.
======================================== */

const informacoesPadrao = {

  ...criarInformacoesIniciais(),

  posicao:
    configuracaoCampanha
      .posicaoInicial,

  experienciaMax:
    100

};


/* ========================================
   RECURSOS PADRÃO

   Estes são os novos recursos estruturados.

   Exemplo:

   vida: {
     atual: 100,
     maximo: 100
   }
======================================== */

const recursosPadrao =
  criarRecursosIniciais();


/* ========================================
   ESTADOS PADRÃO
======================================== */

const estadosPadrao =
  criarEstadosIniciais();


/* ========================================
   MODELO PADRÃO DE FICHA
======================================== */

export const fichaModelo = {

  nome:
    "Novo Personagem",

  imagem:
    "",


  /* ========================================
     INFORMAÇÕES — COMPATIBILIDADE

     Estes campos continuam existindo
     temporariamente porque partes atuais
     do app ainda utilizam:

     ficha.idade
     ficha.nivel
     ficha.posicao
     etc.
  ======================================== */

  idade:
    informacoesPadrao.idade,

  altura:
    informacoesPadrao.altura,

  peDominante:
    informacoesPadrao.peDominante,

  raca:
    informacoesPadrao.raca,

  nivel:
    informacoesPadrao.nivel,

  experiencia:
    informacoesPadrao.experiencia,

  experienciaMax:
    informacoesPadrao.experienciaMax,

  posicao:
    informacoesPadrao.posicao,


  /* ========================================
     NOVA ESTRUTURA DE INFORMAÇÕES
  ======================================== */

  informacoes: {

    ...informacoesPadrao

  },


  /* ========================================
     RECURSOS ANTIGOS

     Estes campos continuam existindo
     temporariamente para não quebrar:

     CharacterCard
     FichaDetalhes
     App.jsx
     fichas antigas
  ======================================== */

  vida:
    recursosPadrao
      .vida
      .atual,

  vidaMax:
    recursosPadrao
      .vida
      .maximo,

  tp:
    recursosPadrao
      .tp
      .atual,

  tpMax:
    recursosPadrao
      .tp
      .maximo,


  /*
    Momentum antigo.

    Ele será removido futuramente,
    quando todas as telas estiverem
    usando estados.momentum.
  */

  momentum:
    0,

  momentumMax:
    10,


  /* ========================================
     NOVA ESTRUTURA DE RECURSOS

     Todos trabalham com:

     atual / maximo

     inclusive Ritmo.
  ======================================== */

  recursos:
    criarRecursosIniciais(),


  /* ========================================
     ESTADOS DO PERSONAGEM

     Momentum agora começa a existir
     corretamente como estado.
  ======================================== */

  estados: {

    ...estadosPadrao

  },


  /* ========================================
     ATRIBUTOS
  ======================================== */

  atributos: {

    ...atributosPadrao

  },


  /* ========================================
     HABILIDADES
  ======================================== */

  habilidades: []

};


/* ========================================
   PERSONAGEM DE EXEMPLO
   OIKAWA SHIMO
======================================== */

export const fichaOikawa = {

  id:
    1,


  ...fichaModelo,


  /* ========================================
     INFORMAÇÕES ANTIGAS / COMPATIBILIDADE
  ======================================== */

  nome:
    "Oikawa Shimo",

  imagem:
    "",

  idade:
    15,

  altura:
    "",

  peDominante:
    "Direito",

  raca:
    "Humano",

  nivel:
    1,

  experiencia:
    0,

  experienciaMax:
    100,

  posicao:
    "Meio-campo",


  /* ========================================
     NOVA ESTRUTURA DE INFORMAÇÕES
  ======================================== */

  informacoes: {

    ...criarInformacoesIniciais(),

    idade:
      15,

    altura:
      "",

    peDominante:
      "Direito",

    raca:
      "Humano",

    nivel:
      1,

    experiencia:
      0,

    experienciaMax:
      100,

    posicao:
      "Meio-campo"

  },


  /* ========================================
     RECURSOS ANTIGOS / COMPATIBILIDADE
  ======================================== */

  vida:
    73,

  vidaMax:
    73,

  tp:
    88,

  tpMax:
    88,

  momentum:
    6,

  momentumMax:
    10,


  /* ========================================
     NOVOS RECURSOS

     GP ainda utiliza o padrão provisório
     definido em configCampanha.js.

     Ritmo funciona em pontos,
     nunca em porcentagem.
  ======================================== */

  recursos: {

    ...criarRecursosIniciais(),


    vida: {

      atual:
        73,

      maximo:
        73

    },


    tp: {

      atual:
        88,

      maximo:
        88

    },


    resistencia: {

      atual:
        100,

      maximo:
        100

    },


    ritmoIndividual: {

      atual:
        10,

      maximo:
        10

    },


    ritmoEquipe: {

      atual:
        20,

      maximo:
        20

    }

  },


  /* ========================================
     ESTADOS
  ======================================== */

  estados: {

    ...criarEstadosIniciais(),

    momentum:
      "crescente",

    fisico:
      "normal",

    mental:
      "estavel"

  },


  /* ========================================
     ATRIBUTOS
  ======================================== */

  atributos: {

    forca:
      7,

    destreza:
      5,

    constituicao:
      13,

    agilidade:
      18,

    resistencia:
      100,

    visao:
      25,

    percepcao:
      8,

    inteligencia:
      34,

    sabedoria:
      4,

    sorte:
      5,

    carisma:
      18

  },


  /* ========================================
     HABILIDADES
  ======================================== */

  habilidades: [


    /* ========================================
       RAIJIN MURASAKI
    ======================================== */

    {

      id:
        101,

      nome:
        "Raijin Murasaki",

      tipo:
        "chute",

      elemento:
        "Raio",

      grau:
        "G5",

      estado:
        "aprendida",

      custoTP:
        23,

      imagem:
        "",

      descricao:
        "Um chute de alta velocidade que concentra energia elétrica na bola, priorizando trajetória e impacto.",


      atributos: {

        impacto:
          8,

        velocidade:
          10,

        precisao:
          7,

        curva:
          3,

        pressao:
          8,

        estabilidade:
          6

      },


      custos: {

        ritmo:
          1,

        momentum:
          "",

        condicao:
          "Bola sob controle"

      },


      requisitosAtributos: {},


      requisitosNarrativos: [

        "Necessário espaço para finalização.",

        "Não pode ser utilizada em estado Exausto.",

        "Bônus se o jogador estiver em Momentum Crescente."

      ]

    },


    /* ========================================
       FURACÃO DE FOGO
    ======================================== */

    {

      id:
        102,

      nome:
        "Furacão de Fogo",

      tipo:
        "chute",

      elemento:
        "Fogo",

      grau:
        "G5",

      estado:
        "aprendida",

      custoTP:
        20,

      imagem:
        "",

      descricao:
        "Um chute em alta velocidade após um giro com alto potencial.",


      atributos: {

        impacto:
          9,

        velocidade:
          5,

        precisao:
          7,

        curva:
          2,

        pressao:
          8,

        estabilidade:
          5

      },


      custos: {

        ritmo:
          1,

        momentum:
          "",

        condicao:
          "Bola sob controle"

      },


      /*
        Deixamos os requisitos numéricos
        vazios por enquanto.

        Assim não transformamos exemplos
        discutidos durante o desenvolvimento
        em regras oficiais da campanha
        sem confirmação.
      */

      requisitosAtributos: {},


      requisitosNarrativos: [

        "Necessário espaço para finalização.",

        "Não pode ser utilizada em estado Exausto.",

        "Bônus se estiver em Momentum Crescente."

      ]

    },


    /* ========================================
       HEKIREKI ISSEN
    ======================================== */

    {

      id:
        103,

      nome:
        "Hekireki Issen",

      tipo:
        "drible",

      elemento:
        "Raio",

      grau:
        "V3",

      estado:
        "aprendida",

      custoTP:
        15,

      imagem:
        "",

      descricao:
        "Uma técnica de movimentação explosiva baseada em aceleração e mudança rápida de direção.",


      /*
        Agora utiliza parâmetros próprios
        de uma técnica de Drible.
      */

      atributos: {

        controle:
          8,

        agilidade:
          9,

        velocidade:
          9,

        tecnica:
          8,

        imprevisibilidade:
          6,

        estabilidade:
          7

      },


      custos: {

        ritmo:
          1,

        momentum:
          "",

        condicao:
          "Jogador com posse da bola"

      },


      requisitosAtributos: {},

      requisitosNarrativos: []

    },


    /* ========================================
       PASSE ILUMINADO
    ======================================== */

    {

      id:
        104,

      nome:
        "Passe Iluminado",

      tipo:
        "passe",

      elemento:
        "Luz",

      grau:
        "V3",

      estado:
        "aprendida",

      custoTP:
        10,

      imagem:
        "",

      descricao:
        "Um passe preciso que utiliza leitura de campo e percepção para encontrar companheiros em posições favoráveis.",


      /*
        Parâmetros próprios de Passe.
      */

      atributos: {

        precisao:
          9,

        alcance:
          8,

        velocidade:
          7,

        controle:
          8,

        leitura:
          9,

        estabilidade:
          8

      },


      custos: {

        ritmo:
          "",

        momentum:
          "",

        condicao:
          "Posse da bola"

      },


      requisitosAtributos: {},

      requisitosNarrativos: []

    },


    /* ========================================
       DEFESA EM CAIXA
    ======================================== */

    {

      id:
        105,

      nome:
        "Defesa em Caixa",

      /*
        Antes estava como "Defesa".

        Agora usamos o tipo Bloqueio,
        que já existe oficialmente
        no novo sistema de técnicas.
      */

      tipo:
        "bloqueio",

      elemento:
        "Neutro",

      grau:
        "V3",

      estado:
        "aprendida",

      custoTP:
        18,

      imagem:
        "",

      descricao:
        "Uma técnica defensiva focada em posicionamento, resistência e interrupção da trajetória adversária.",


      /*
        Parâmetros próprios
        de uma técnica defensiva.
      */

      atributos: {

        bloqueio:
          9,

        resistencia:
          9,

        alcance:
          7,

        reacao:
          6,

        pressao:
          9,

        estabilidade:
          9

      },


      custos: {

        ritmo:
          "",

        momentum:
          "",

        condicao:
          "Confronto defensivo"

      },


      requisitosAtributos: {},

      requisitosNarrativos: []

    }

  ]

};