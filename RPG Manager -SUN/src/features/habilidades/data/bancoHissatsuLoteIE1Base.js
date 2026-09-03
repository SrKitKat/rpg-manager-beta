import {
  criarRegistroHissatsuOficial
} from "./bancoHissatsuEstrutura.js";


/* ========================================
   INAZUMA ELEVEN
   LOTE BASE

   IDs preservados.

   As localizações PT-BR abaixo são as que
   já havíamos confirmado para o projeto.

   A imagem de referência já possui estrutura
   própria.

   PADRÃO VISUAL ADOTADO:
   preferir frames do anime no auge/
   ápice da execução da Hissatsu.

   Quando não houver uma boa referência
   do anime, podemos recorrer a jogo,
   filme ou outro material visual.

   A imagem do catálogo NÃO faz parte
   da mecânica e NÃO cria versão nova.
======================================== */


export const loteHissatsuIE1Base = [

  /* ======================================
     FIRE TORNADO
  ====================================== */

  criarRegistroHissatsuOficial({
    id:
      "fire-tornado",

    nomeOriginal:
      "Fire Tornado",

    nomePtBR:
      "Furacão de Fogo",

    japonesRomanizado:
      "Faia Torunēdo",

    tipo:
      "chute",

    elemento:
      "Fogo",

    tipoOriginal:
      "Shoot",

    elementoOriginal:
      "Fire",

    imagemReferencia: {
      url:
        "https://preview.redd.it/hissatsus-explained-fire-tornado-v0-xbtshtavja6e1.png?width=2544&format=png&auto=webp&s=3341132abf813043ae80550cb3b1d16645c6b389",

      fonte:
        "Frame do anime / referência visual da execução",

      fonteUrl:
        "https://preview.redd.it/hissatsus-explained-fire-tornado-v0-xbtshtavja6e1.png?width=2544&format=png&auto=webp&s=3341132abf813043ae80550cb3b1d16645c6b389",

      status:
        "catalogada"
    },

    observacaoMecanica:
      "Os dados de referência da franquia já foram catalogados. A mecânica do RPG é resolvida pelos padrões e exceções da campanha.",

    observacaoCatalogacao:
      "A aparição do primeiro jogo está registrada. A imagem de referência atual segue o novo padrão visual do catálogo: frame do anime no auge da execução da Hissatsu. Outras mídias serão adicionadas durante a auditoria do catálogo.",

    tags: [
      "oficial",
      "inazuma-eleven",
      "chute",
      "fogo"
    ]
  }),


  /* ======================================
     DRAGON CRASH
  ====================================== */

  criarRegistroHissatsuOficial({
    id:
      "dragon-crash",

    nomeOriginal:
      "Dragon Crash",

    nomePtBR:
      "Impacto Dragão",

    japonesRomanizado:
      "Doragon Kurasshu",

    tipo:
      "chute",

    elemento:
      "Floresta",

    tipoOriginal:
      "Shoot",

    elementoOriginal:
      "Forest",

    tags: [
      "oficial",
      "inazuma-eleven",
      "chute",
      "floresta"
    ]
  }),


  /* ======================================
     GOD KNOWS
  ====================================== */

  criarRegistroHissatsuOficial({
    id:
      "god-knows",

    nomeOriginal:
      "God Knows",

    nomePtBR:
      "Asas Celestiais",

    japonesRomanizado:
      "Goddo Nōzu",

    tipo:
      "chute",

    elemento:
      "Vento",

    tipoOriginal:
      "Shoot",

    elementoOriginal:
      "Wind",

    tags: [
      "oficial",
      "inazuma-eleven",
      "chute",
      "vento"
    ]
  }),


  /* ======================================
     SHIPPUU DASH
  ====================================== */

  criarRegistroHissatsuOficial({
    id:
      "shippuu-dash",

    nomeOriginal:
      "Shippuu Dash",

    nomePtBR:
      "Deslize Veloz",

    japonesRomanizado:
      "Shippū Dasshu",

    alternativos: [
      "Shippu Dash"
    ],

    tipo:
      "drible",

    elemento:
      "Vento",

    tipoOriginal:
      "Dribble",

    elementoOriginal:
      "Wind",

    tags: [
      "oficial",
      "inazuma-eleven",
      "drible",
      "vento"
    ]
  }),


  /* ======================================
     ILLUSION BALL
  ====================================== */

  criarRegistroHissatsuOficial({
    id:
      "illusion-ball",

    nomeOriginal:
      "Illusion Ball",

    nomePtBR:
      "Bola Ilusória",

    japonesRomanizado:
      "Iruujion Bouru",

    tipo:
      "drible",

    elemento:
      "Floresta",

    tipoOriginal:
      "Dribble",

    elementoOriginal:
      "Forest",

    tags: [
      "oficial",
      "inazuma-eleven",
      "drible",
      "floresta"
    ]
  }),


  /* ======================================
     THE WALL
  ====================================== */

  criarRegistroHissatsuOficial({
    id:
      "the-wall",

    nomeOriginal:
      "The Wall",

    nomePtBR:
      "O Muro",

    japonesRomanizado:
      "Za Uōru",

    tipo:
      "bloqueio",

    elemento:
      "Montanha",

    tipoOriginal:
      "Block",

    elementoOriginal:
      "Mountain",

    tags: [
      "oficial",
      "inazuma-eleven",
      "bloqueio",
      "montanha"
    ]
  }),


  /* ======================================
     GOD HAND
  ====================================== */

  criarRegistroHissatsuOficial({
    id:
      "god-hand",

    nomeOriginal:
      "God Hand",

    nomePtBR:
      "Mão Fantasma",

    japonesRomanizado:
      "Goddo Hando",

    tipo:
      "defesa_goleiro",

    elemento:
      "Montanha",

    tipoOriginal:
      "Catch",

    elementoOriginal:
      "Mountain",

    aparicoes: [
      {
        midiaId:
          "inazuma-eleven",

        versoes:
          [],

        variante: {
          elemento:
            "Montanha",

          identificacao:
            "amarela"
        }
      }
    ],

    observacaoCatalogacao:
      "A versão do primeiro jogo está registrada. Variantes posteriores serão adicionadas durante a auditoria das demais mídias.",

    tags: [
      "oficial",
      "inazuma-eleven",
      "goleiro",
      "montanha"
    ]
  }),


  /* ======================================
     MAJIN THE HAND
  ====================================== */

  criarRegistroHissatsuOficial({
    id:
      "majin-the-hand",

    nomeOriginal:
      "Majin The Hand",

    nomePtBR:
      "Mão Demoníaca",

    japonesRomanizado:
      "Majin Za Hando",

    tipo:
      "defesa_goleiro",

    elemento:
      "Montanha",

    tipoOriginal:
      "Catch",

    elementoOriginal:
      "Mountain",

    aparicoes: [
      {
        midiaId:
          "inazuma-eleven",

        versoes:
          [],

        variante: {
          elemento:
            "Montanha",

          identificacao:
            "amarela"
        }
      }
    ],

    observacaoCatalogacao:
      "A versão original está registrada. Variantes posteriores serão adicionadas durante a auditoria das demais mídias.",

    tags: [
      "oficial",
      "inazuma-eleven",
      "goleiro",
      "montanha"
    ]
  })

];