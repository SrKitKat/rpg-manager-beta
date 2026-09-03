/* ========================================
   CATÁLOGO DE MÍDIAS — SUPER ONZE

   Este arquivo centraliza as fontes que
   podem ser utilizadas pelo Banco de
   Hissatsu.

   IMPORTANTE:

   Uma mídia não é uma Hissatsu.

   O Banco futuramente guardará apenas IDs:

   midiaIds: [
     "inazuma-eleven-2",
     "inazuma-eleven-strikers"
   ]

   A interface consulta este arquivo para
   descobrir os nomes completos.

   Assim não repetimos textos enormes em
   centenas de técnicas.
======================================== */


/* ========================================
   TIPOS DE MÍDIA
======================================== */

export const TIPOS_MIDIA_SUPER_ONZE = {

  JOGO:
    "jogo",

  FILME:
    "filme"

};


/* ========================================
   PAPEL DA FONTE

   principal:
   faz parte diretamente do levantamento.

   auditoria:
   será verificada para procurar aparições
   ou conteúdo exclusivo, mas não precisa
   gerar duplicatas do que já existe.
======================================== */

export const PAPEIS_FONTE_SUPER_ONZE = {

  PRINCIPAL:
    "principal",

  AUDITORIA:
    "auditoria"

};


/* ========================================
   ERAS / CONTEXTOS

   Isto serve para filtros e organização.

   NÃO é bloqueio mecânico.

   Uma campanha pode permitir que uma
   técnica de qualquer era seja aprendida
   em outra por motivos narrativos.
======================================== */

export const ERAS_SUPER_ONZE = {

  CLASSICO:
    "classico",

  GO:
    "go",

  ARES_ORION:
    "ares-orion",

  VICTORY_ROAD:
    "victory-road",

  CROSSOVER:
    "crossover",

  GERAL:
    "geral"

};


/* ========================================
   NOMES DAS ERAS
======================================== */

export const NOMES_ERAS_SUPER_ONZE = {

  [ERAS_SUPER_ONZE.CLASSICO]:
    "Inazuma Eleven Clássico",

  [ERAS_SUPER_ONZE.GO]:
    "Inazuma Eleven GO",

  [ERAS_SUPER_ONZE.ARES_ORION]:
    "Ares / Orion",

  [ERAS_SUPER_ONZE.VICTORY_ROAD]:
    "Victory Road",

  [ERAS_SUPER_ONZE.CROSSOVER]:
    "Crossover",

  [ERAS_SUPER_ONZE.GERAL]:
    "Franquia geral"

};


/* ========================================
   GRUPOS
======================================== */

export const GRUPOS_MIDIA_SUPER_ONZE = {

  TRILOGIA_CLASSICA:
    "trilogia-classica",

  TRILOGIA_GO:
    "trilogia-go",

  STRIKERS:
    "strikers",

  DERIVADOS:
    "derivados",

  MOBILE:
    "mobile",

  ARCADE:
    "arcade",

  VICTORY_ROAD:
    "victory-road",

  FILMES_CLASSICOS:
    "filmes-classicos",

  FILME_2025:
    "filme-2025"

};


/* ========================================
   CATÁLOGO
======================================== */

export const midiasSuperOnze = [

  /* ======================================
     JOGOS PRINCIPAIS — CLÁSSICO
  ====================================== */

  {
    id:
      "inazuma-eleven",

    nome:
      "Inazuma Eleven",

    nomeCurto:
      "Inazuma Eleven",

    tipo:
      TIPOS_MIDIA_SUPER_ONZE.JOGO,

    grupo:
      GRUPOS_MIDIA_SUPER_ONZE.TRILOGIA_CLASSICA,

    era:
      ERAS_SUPER_ONZE.CLASSICO,

    papelFonte:
      PAPEIS_FONTE_SUPER_ONZE.PRINCIPAL,

    principal:
      true,

    versoes:
      [],

    fonteVersionada:
      false
  },


  {
    id:
      "inazuma-eleven-2",

    nome:
      "Inazuma Eleven 2",

    nomeCurto:
      "Inazuma Eleven 2",

    tipo:
      TIPOS_MIDIA_SUPER_ONZE.JOGO,

    grupo:
      GRUPOS_MIDIA_SUPER_ONZE.TRILOGIA_CLASSICA,

    era:
      ERAS_SUPER_ONZE.CLASSICO,

    papelFonte:
      PAPEIS_FONTE_SUPER_ONZE.PRINCIPAL,

    principal:
      true,

    versoes: [

      {
        id:
          "firestorm",

        nome:
          "Firestorm"
      },

      {
        id:
          "blizzard",

        nome:
          "Blizzard"
      }

    ],

    fonteVersionada:
      false
  },


  {
    id:
      "inazuma-eleven-3",

    nome:
      "Inazuma Eleven 3",

    nomeCurto:
      "Inazuma Eleven 3",

    tipo:
      TIPOS_MIDIA_SUPER_ONZE.JOGO,

    grupo:
      GRUPOS_MIDIA_SUPER_ONZE.TRILOGIA_CLASSICA,

    era:
      ERAS_SUPER_ONZE.CLASSICO,

    papelFonte:
      PAPEIS_FONTE_SUPER_ONZE.PRINCIPAL,

    principal:
      true,

    versoes: [

      {
        id:
          "lightning-bolt",

        nome:
          "Lightning Bolt"
      },

      {
        id:
          "bomb-blast",

        nome:
          "Bomb Blast"
      },

      {
        id:
          "team-ogre-attacks",

        nome:
          "Team Ogre Attacks!"
      }

    ],

    fonteVersionada:
      false
  },


  /* ======================================
     JOGOS PRINCIPAIS — GO
  ====================================== */

  {
    id:
      "inazuma-eleven-go",

    nome:
      "Inazuma Eleven GO",

    nomeCurto:
      "GO",

    tipo:
      TIPOS_MIDIA_SUPER_ONZE.JOGO,

    grupo:
      GRUPOS_MIDIA_SUPER_ONZE.TRILOGIA_GO,

    era:
      ERAS_SUPER_ONZE.GO,

    papelFonte:
      PAPEIS_FONTE_SUPER_ONZE.PRINCIPAL,

    principal:
      true,

    versoes: [

      {
        id:
          "light",

        nome:
          "Light"
      },

      {
        id:
          "shadow",

        nome:
          "Shadow"
      }

    ],

    fonteVersionada:
      false
  },


  {
    id:
      "inazuma-eleven-go-chrono-stones",

    nome:
      "Inazuma Eleven GO Chrono Stones",

    nomeCurto:
      "GO Chrono Stones",

    tipo:
      TIPOS_MIDIA_SUPER_ONZE.JOGO,

    grupo:
      GRUPOS_MIDIA_SUPER_ONZE.TRILOGIA_GO,

    era:
      ERAS_SUPER_ONZE.GO,

    papelFonte:
      PAPEIS_FONTE_SUPER_ONZE.PRINCIPAL,

    principal:
      true,

    versoes: [

      {
        id:
          "wildfire",

        nome:
          "Wildfire"
      },

      {
        id:
          "thunderflash",

        nome:
          "Thunderflash"
      }

    ],

    fonteVersionada:
      false
  },


  {
    id:
      "inazuma-eleven-go-galaxy",

    nome:
      "Inazuma Eleven GO Galaxy",

    nomeCurto:
      "GO Galaxy",

    tipo:
      TIPOS_MIDIA_SUPER_ONZE.JOGO,

    grupo:
      GRUPOS_MIDIA_SUPER_ONZE.TRILOGIA_GO,

    era:
      ERAS_SUPER_ONZE.GO,

    papelFonte:
      PAPEIS_FONTE_SUPER_ONZE.PRINCIPAL,

    principal:
      true,

    versoes: [

      {
        id:
          "big-bang",

        nome:
          "Big Bang"
      },

      {
        id:
          "supernova",

        nome:
          "Supernova"
      }

    ],

    fonteVersionada:
      false
  },


  /* ======================================
     VICTORY ROAD

     Fonte versionada.

     O catálogo de técnicas poderá mudar
     conforme atualizações do jogo.
  ====================================== */

  {
    id:
      "inazuma-eleven-victory-road",

    nome:
      "INAZUMA ELEVEN: Victory Road",

    nomeCurto:
      "Victory Road",

    tipo:
      TIPOS_MIDIA_SUPER_ONZE.JOGO,

    grupo:
      GRUPOS_MIDIA_SUPER_ONZE.VICTORY_ROAD,

    era:
      ERAS_SUPER_ONZE.VICTORY_ROAD,

    papelFonte:
      PAPEIS_FONTE_SUPER_ONZE.PRINCIPAL,

    principal:
      true,

    versoes:
      [],

    fonteVersionada:
      true,

    controleVersao: {

      ativo:
        true,

      descricao:
        "O conteúdo desta mídia deve registrar quando a informação de origem foi verificada, pois Victory Road continua recebendo atualizações."

    }
  },


  /* ======================================
     STRIKERS
  ====================================== */

  {
    id:
      "inazuma-eleven-strikers",

    nome:
      "Inazuma Eleven Strikers",

    nomeCurto:
      "Strikers",

    tipo:
      TIPOS_MIDIA_SUPER_ONZE.JOGO,

    grupo:
      GRUPOS_MIDIA_SUPER_ONZE.STRIKERS,

    era:
      ERAS_SUPER_ONZE.CLASSICO,

    papelFonte:
      PAPEIS_FONTE_SUPER_ONZE.PRINCIPAL,

    principal:
      false,

    versoes:
      [],

    fonteVersionada:
      false
  },


  {
    id:
      "inazuma-eleven-strikers-2012-xtreme",

    nome:
      "Inazuma Eleven Strikers 2012 Xtreme",

    nomeCurto:
      "Strikers 2012 Xtreme",

    tipo:
      TIPOS_MIDIA_SUPER_ONZE.JOGO,

    grupo:
      GRUPOS_MIDIA_SUPER_ONZE.STRIKERS,

    era:
      ERAS_SUPER_ONZE.CLASSICO,

    papelFonte:
      PAPEIS_FONTE_SUPER_ONZE.PRINCIPAL,

    principal:
      false,

    versoes:
      [],

    fonteVersionada:
      false
  },


  {
    id:
      "inazuma-eleven-go-strikers-2013",

    nome:
      "Inazuma Eleven GO Strikers 2013",

    nomeCurto:
      "GO Strikers 2013",

    tipo:
      TIPOS_MIDIA_SUPER_ONZE.JOGO,

    grupo:
      GRUPOS_MIDIA_SUPER_ONZE.STRIKERS,

    era:
      ERAS_SUPER_ONZE.GO,

    papelFonte:
      PAPEIS_FONTE_SUPER_ONZE.PRINCIPAL,

    principal:
      false,

    versoes:
      [],

    fonteVersionada:
      false
  },


  /* ======================================
     MOBILE RELEVANTE
  ====================================== */

  {
    id:
      "inazuma-eleven-sd",

    nome:
      "Inazuma Eleven SD",

    nomeCurto:
      "Inazuma Eleven SD",

    tipo:
      TIPOS_MIDIA_SUPER_ONZE.JOGO,

    grupo:
      GRUPOS_MIDIA_SUPER_ONZE.MOBILE,

    era:
      ERAS_SUPER_ONZE.GERAL,

    papelFonte:
      PAPEIS_FONTE_SUPER_ONZE.PRINCIPAL,

    principal:
      false,

    versoes:
      [],

    fonteVersionada:
      false,

    observacao:
      "Pode conter conteúdo relacionado a diferentes períodos da franquia."
  },


  /* ======================================
     DERIVADOS — AUDITORIA

     Só acrescentam uma nova Hissatsu se
     encontrarmos conteúdo realmente
     exclusivo ou relevante.

     Técnicas repetidas não serão duplicadas.
  ====================================== */

  {
    id:
      "inazuma-eleven-dash",

    nome:
      "Inazuma Eleven Dash",

    nomeCurto:
      "Dash",

    tipo:
      TIPOS_MIDIA_SUPER_ONZE.JOGO,

    grupo:
      GRUPOS_MIDIA_SUPER_ONZE.DERIVADOS,

    era:
      ERAS_SUPER_ONZE.CLASSICO,

    papelFonte:
      PAPEIS_FONTE_SUPER_ONZE.AUDITORIA,

    principal:
      false,

    versoes:
      [],

    fonteVersionada:
      false
  },


  {
    id:
      "inazuma-eleven-123-endou-mamoru-densetsu",

    nome:
      "Inazuma Eleven 1・2・3!! Endou Mamoru Densetsu",

    nomeCurto:
      "Inazuma Eleven 1・2・3!!",

    tipo:
      TIPOS_MIDIA_SUPER_ONZE.JOGO,

    grupo:
      GRUPOS_MIDIA_SUPER_ONZE.DERIVADOS,

    era:
      ERAS_SUPER_ONZE.CLASSICO,

    papelFonte:
      PAPEIS_FONTE_SUPER_ONZE.AUDITORIA,

    principal:
      false,

    versoes:
      [],

    fonteVersionada:
      false,

    observacao:
      "Compilação. Não deve gerar duplicatas apenas por repetir conteúdo dos jogos anteriores."
  },


  {
    id:
      "inazuma-eleven-everyday",

    nome:
      "Inazuma Eleven Everyday!!",

    nomeCurto:
      "Everyday!!",

    tipo:
      TIPOS_MIDIA_SUPER_ONZE.JOGO,

    grupo:
      GRUPOS_MIDIA_SUPER_ONZE.DERIVADOS,

    era:
      ERAS_SUPER_ONZE.GO,

    papelFonte:
      PAPEIS_FONTE_SUPER_ONZE.AUDITORIA,

    principal:
      false,

    versoes:
      [],

    fonteVersionada:
      false
  },


  {
    id:
      "line-puzzle-inazuma-eleven",

    nome:
      "LINE Puzzle de Inazuma Eleven",

    nomeCurto:
      "LINE Puzzle",

    tipo:
      TIPOS_MIDIA_SUPER_ONZE.JOGO,

    grupo:
      GRUPOS_MIDIA_SUPER_ONZE.MOBILE,

    era:
      ERAS_SUPER_ONZE.GO,

    papelFonte:
      PAPEIS_FONTE_SUPER_ONZE.AUDITORIA,

    principal:
      false,

    versoes:
      [],

    fonteVersionada:
      false
  },


  {
    id:
      "inazuma-eleven-online",

    nome:
      "Inazuma Eleven Online",

    nomeCurto:
      "Inazuma Eleven Online",

    tipo:
      TIPOS_MIDIA_SUPER_ONZE.JOGO,

    grupo:
      GRUPOS_MIDIA_SUPER_ONZE.DERIVADOS,

    era:
      ERAS_SUPER_ONZE.GERAL,

    papelFonte:
      PAPEIS_FONTE_SUPER_ONZE.AUDITORIA,

    principal:
      false,

    versoes:
      [],

    fonteVersionada:
      false
  },


  {
    id:
      "inazuma-eleven-mobile",

    nome:
      "Inazuma Eleven Mobile",

    nomeCurto:
      "Inazuma Eleven Mobile",

    tipo:
      TIPOS_MIDIA_SUPER_ONZE.JOGO,

    grupo:
      GRUPOS_MIDIA_SUPER_ONZE.MOBILE,

    era:
      ERAS_SUPER_ONZE.CLASSICO,

    papelFonte:
      PAPEIS_FONTE_SUPER_ONZE.AUDITORIA,

    principal:
      false,

    versoes:
      [],

    fonteVersionada:
      false
  },


  /* ======================================
     ARCADE — AUDITORIA
  ====================================== */

  {
    id:
      "inazuma-eleven-bakunetsu-soccer-battle",

    nome:
      "Inazuma Eleven Bakunetsu Soccer Battle",

    nomeCurto:
      "Bakunetsu Soccer Battle",

    tipo:
      TIPOS_MIDIA_SUPER_ONZE.JOGO,

    grupo:
      GRUPOS_MIDIA_SUPER_ONZE.ARCADE,

    era:
      ERAS_SUPER_ONZE.CLASSICO,

    papelFonte:
      PAPEIS_FONTE_SUPER_ONZE.AUDITORIA,

    principal:
      false,

    versoes:
      [],

    fonteVersionada:
      false
  },


  {
    id:
      "inazuma-eleven-go-battle-stadium",

    nome:
      "Inazuma Eleven GO Battle Stadium",

    nomeCurto:
      "GO Battle Stadium",

    tipo:
      TIPOS_MIDIA_SUPER_ONZE.JOGO,

    grupo:
      GRUPOS_MIDIA_SUPER_ONZE.ARCADE,

    era:
      ERAS_SUPER_ONZE.GO,

    papelFonte:
      PAPEIS_FONTE_SUPER_ONZE.AUDITORIA,

    principal:
      false,

    versoes:
      [],

    fonteVersionada:
      false
  },


  {
    id:
      "inazuma-eleven-go-battle-rhythm",

    nome:
      "Inazuma Eleven GO Battle Rhythm",

    nomeCurto:
      "GO Battle Rhythm",

    tipo:
      TIPOS_MIDIA_SUPER_ONZE.JOGO,

    grupo:
      GRUPOS_MIDIA_SUPER_ONZE.ARCADE,

    era:
      ERAS_SUPER_ONZE.GO,

    papelFonte:
      PAPEIS_FONTE_SUPER_ONZE.AUDITORIA,

    principal:
      false,

    versoes:
      [],

    fonteVersionada:
      false
  },


  {
    id:
      "inazuma-eleven-ac",

    nome:
      "Inazuma Eleven AC",

    nomeCurto:
      "Inazuma Eleven AC",

    tipo:
      TIPOS_MIDIA_SUPER_ONZE.JOGO,

    grupo:
      GRUPOS_MIDIA_SUPER_ONZE.ARCADE,

    era:
      ERAS_SUPER_ONZE.ARES_ORION,

    papelFonte:
      PAPEIS_FONTE_SUPER_ONZE.AUDITORIA,

    principal:
      false,

    versoes:
      [],

    fonteVersionada:
      false
  },


  /* ======================================
     FILMES
  ====================================== */

  {
    id:
      "filme-invasao-exercito-ogre",

    nome:
      "Inazuma Eleven: The Invasion of the Strongest Army Ogre",

    nomeCurto:
      "Strongest Army Ogre",

    tipo:
      TIPOS_MIDIA_SUPER_ONZE.FILME,

    grupo:
      GRUPOS_MIDIA_SUPER_ONZE.FILMES_CLASSICOS,

    era:
      ERAS_SUPER_ONZE.CLASSICO,

    papelFonte:
      PAPEIS_FONTE_SUPER_ONZE.PRINCIPAL,

    principal:
      true,

    versoes:
      [],

    fonteVersionada:
      false
  },


  {
    id:
      "filme-go-ultimate-bonds-gryphon",

    nome:
      "Inazuma Eleven GO: The Ultimate Bonds Gryphon",

    nomeCurto:
      "Ultimate Bonds Gryphon",

    tipo:
      TIPOS_MIDIA_SUPER_ONZE.FILME,

    grupo:
      GRUPOS_MIDIA_SUPER_ONZE.FILMES_CLASSICOS,

    era:
      ERAS_SUPER_ONZE.GO,

    papelFonte:
      PAPEIS_FONTE_SUPER_ONZE.PRINCIPAL,

    principal:
      true,

    versoes:
      [],

    fonteVersionada:
      false
  },


  {
    id:
      "filme-go-vs-danball-senki-w",

    nome:
      "Inazuma Eleven GO vs. Danball Senki W",

    nomeCurto:
      "GO vs. Danball Senki W",

    tipo:
      TIPOS_MIDIA_SUPER_ONZE.FILME,

    grupo:
      GRUPOS_MIDIA_SUPER_ONZE.FILMES_CLASSICOS,

    era:
      ERAS_SUPER_ONZE.CROSSOVER,

    papelFonte:
      PAPEIS_FONTE_SUPER_ONZE.PRINCIPAL,

    principal:
      true,

    versoes:
      [],

    fonteVersionada:
      false
  },


  {
    id:
      "filme-chou-jigen-dream-match",

    nome:
      "Inazuma Eleven: Chou Jigen Dream Match",

    nomeCurto:
      "Chou Jigen Dream Match",

    tipo:
      TIPOS_MIDIA_SUPER_ONZE.FILME,

    grupo:
      GRUPOS_MIDIA_SUPER_ONZE.FILMES_CLASSICOS,

    era:
      ERAS_SUPER_ONZE.GERAL,

    papelFonte:
      PAPEIS_FONTE_SUPER_ONZE.PRINCIPAL,

    principal:
      true,

    versoes:
      [],

    fonteVersionada:
      false
  },


  /* ======================================
     INAZUMA ELEVEN THE MOVIE 2025

     O projeto cinematográfico possui duas
     partes. Mantemos IDs separados porque
     uma técnica pode aparecer em apenas uma
     delas.
  ====================================== */

  {
    id:
      "filme-2025-legendary-kickoff",

    nome:
      "Inazuma Eleven Compilation Film: Legendary Kickoff",

    nomeCurto:
      "Legendary Kickoff",

    tipo:
      TIPOS_MIDIA_SUPER_ONZE.FILME,

    grupo:
      GRUPOS_MIDIA_SUPER_ONZE.FILME_2025,

    era:
      ERAS_SUPER_ONZE.CLASSICO,

    papelFonte:
      PAPEIS_FONTE_SUPER_ONZE.PRINCIPAL,

    principal:
      true,

    versoes:
      [],

    fonteVersionada:
      false
  },


  {
    id:
      "filme-2025-prologue-new-heroes",

    nome:
      "Inazuma Eleven: Prologue of New Heroes",

    nomeCurto:
      "Prologue of New Heroes",

    tipo:
      TIPOS_MIDIA_SUPER_ONZE.FILME,

    grupo:
      GRUPOS_MIDIA_SUPER_ONZE.FILME_2025,

    era:
      ERAS_SUPER_ONZE.VICTORY_ROAD,

    papelFonte:
      PAPEIS_FONTE_SUPER_ONZE.PRINCIPAL,

    principal:
      true,

    versoes:
      [],

    fonteVersionada:
      false
  }

];


/* ========================================
   MAPA POR ID

   Útil quando tivermos centenas de
   Hissatsu e quisermos resolver rapidamente
   "inazuma-eleven-2" para o objeto completo.
======================================== */

export const midiasSuperOnzePorId =
  Object.fromEntries(
    midiasSuperOnze.map(
      midia => [
        midia.id,
        midia
      ]
    )
  );


/* ========================================
   BUSCAR MÍDIA
======================================== */

export function buscarMidiaSuperOnze(
  id
) {
  if (!id) {
    return null;
  }


  return (
    midiasSuperOnzePorId[
      id
    ] ||
    null
  );
}


/* ========================================
   OBTER NOME
======================================== */

export function obterNomeMidiaSuperOnze(
  id,
  usarNomeCurto = false
) {
  const midia =
    buscarMidiaSuperOnze(
      id
    );


  if (!midia) {
    return String(
      id ||
      ""
    );
  }


  if (
    usarNomeCurto &&
    midia.nomeCurto
  ) {
    return midia.nomeCurto;
  }


  return midia.nome;
}


/* ========================================
   LISTAR POR TIPO
======================================== */

export function listarMidiasSuperOnzePorTipo(
  tipo
) {
  if (!tipo) {
    return [
      ...midiasSuperOnze
    ];
  }


  return midiasSuperOnze.filter(
    midia =>
      midia.tipo ===
      tipo
  );
}


/* ========================================
   LISTAR FONTES PRINCIPAIS
======================================== */

export function listarFontesPrincipaisSuperOnze() {
  return midiasSuperOnze.filter(
    midia =>
      midia.papelFonte ===
      PAPEIS_FONTE_SUPER_ONZE.PRINCIPAL
  );
}


/* ========================================
   LISTAR FONTES DE AUDITORIA
======================================== */

export function listarFontesAuditoriaSuperOnze() {
  return midiasSuperOnze.filter(
    midia =>
      midia.papelFonte ===
      PAPEIS_FONTE_SUPER_ONZE.AUDITORIA
  );
}


/* ========================================
   BUSCAR VERSÃO DE UMA MÍDIA
======================================== */

export function buscarVersaoMidiaSuperOnze(
  midiaId,
  versaoId
) {
  const midia =
    buscarMidiaSuperOnze(
      midiaId
    );


  if (
    !midia ||
    !Array.isArray(
      midia.versoes
    ) ||
    !versaoId
  ) {
    return null;
  }


  return (
    midia.versoes.find(
      versao =>
        versao.id ===
        versaoId
    ) ||
    null
  );
}