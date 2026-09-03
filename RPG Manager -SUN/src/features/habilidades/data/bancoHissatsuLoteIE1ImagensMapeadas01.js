import {
  criarComplementoImagemHissatsu
} from "./bancoHissatsuComplementos.js";


/* ========================================
   INAZUMA ELEVEN
   IMAGENS MAPEADAS 01

   PILOTO DE ASSETS LOCAIS

   Objetivo desta rodada:

   Validar o fluxo:

   pesquisa visual
        ↓
   imagem selecionada
        ↓
   asset local em /public
        ↓
   complemento pelo mesmo ID
        ↓
   Banco
        ↓
   campanha
        ↓
   ficha

   IMPORTANTE:

   Este lote NÃO cria novas Hissatsu.

   Ele apenas complementa técnicas já
   existentes usando os mesmos IDs.

   PRIORIDADE VISUAL:

   1. anime no ápice da execução;
   2. momento imediatamente anterior/final
      quando visualmente mais forte;
   3. jogo/filme somente quando necessário.

   A imagem continua sendo apresentação.
   Nenhuma versão mecânica é alterada.
======================================== */


export const loteHissatsuIE1ImagensMapeadas01 = [


  /* ======================================
     FIRE TORNADO

     Já possui imagem funcional no lote-base.

     Mantemos apenas o mapeamento da fonte
     aqui. Como a imagem-base já é válida,
     a consolidação não deve substituí-la
     por um valor vazio.
  ====================================== */

  criarComplementoImagemHissatsu({
    id:
      "fire-tornado",

    imagemReferencia: {
      url:
        "",

      fonte:
        "Referência visual já catalogada no lote-base",

      fonteUrl:
        "",

      status:
        "catalogada"
    }
  }),


  /* ======================================
     DRAGON CRASH

     PRIMEIRO TESTE REAL DE ASSET LOCAL.
  ====================================== */

  criarComplementoImagemHissatsu({
    id:
      "dragon-crash",

    imagemReferencia: {
      url:
        "/assets/hissatsu/ie1/dragon-crash.png",

      fonte:
        "Inazuma Eleven Wiki / Fandom — referência visual de anime",

      fonteUrl:
        "https://inazuma-elevenbr.fandom.com/pt-br/wiki/Dragon_Crash",

      status:
        "catalogada"
    }
  }),


  /* ======================================
     GOD KNOWS
  ====================================== */

  criarComplementoImagemHissatsu({
    id:
      "god-knows",

    imagemReferencia: {
      url:
        "",

      fonte:
        "Inazuma Eleven Wiki / página de referência visual",

      fonteUrl:
        "https://inazuma-eleven.fandom.com/wiki/God_Knows",

      status:
        "fonte-localizada"
    }
  }),


  /* ======================================
     SHIPPUU DASH
  ====================================== */

  criarComplementoImagemHissatsu({
    id:
      "shippuu-dash",

    imagemReferencia: {
      url:
        "",

      fonte:
        "Inazuma Eleven Wiki / página de referência visual",

      fonteUrl:
        "https://inazuma-eleven.fandom.com/wiki/Shippuu_Dash",

      status:
        "fonte-localizada"
    }
  }),


  /* ======================================
     ILLUSION BALL
  ====================================== */

  criarComplementoImagemHissatsu({
    id:
      "illusion-ball",

    imagemReferencia: {
      url:
        "",

      fonte:
        "Inazuma Eleven Wiki / página de referência visual",

      fonteUrl:
        "https://inazuma-eleven.fandom.com/wiki/Illusion_Ball",

      status:
        "fonte-localizada"
    }
  }),


  /* ======================================
     THE WALL
  ====================================== */

  criarComplementoImagemHissatsu({
    id:
      "the-wall",

    imagemReferencia: {
      url:
        "",

      fonte:
        "Inazuma Eleven Wiki / página de referência visual",

      fonteUrl:
        "https://inazuma-eleven.fandom.com/wiki/The_Wall",

      status:
        "fonte-localizada"
    }
  }),


  /* ======================================
     GOD HAND

     SEGUNDO TESTE REAL DE ASSET LOCAL.
  ====================================== */

  criarComplementoImagemHissatsu({
    id:
      "god-hand",

    imagemReferencia: {
      url:
        "/assets/hissatsu/ie1/god-hand.png",

      fonte:
        "Pesquisa visual — frame de anime de God Hand",

      fonteUrl:
        "https://www.pinterest.com/pin/endou-god-hand--212584044904256920/",

      status:
        "catalogada"
    }
  }),


  /* ======================================
     MAJIN THE HAND
  ====================================== */

  criarComplementoImagemHissatsu({
    id:
      "majin-the-hand",

    imagemReferencia: {
      url:
        "",

      fonte:
        "Inazuma Eleven Wiki / página de referência visual",

      fonteUrl:
        "https://inazuma-eleven.fandom.com/wiki/Majin_The_Hand",

      status:
        "fonte-localizada"
    }
  }),


  /* ======================================
     INAZUMA OTOSHI
  ====================================== */

  criarComplementoImagemHissatsu({
    id:
      "inazuma-otoshi",

    imagemReferencia: {
      url:
        "",

      fonte:
        "Inazuma Eleven Wiki / página de referência visual",

      fonteUrl:
        "https://inazuma-eleven.fandom.com/wiki/Inazuma_Otoshi",

      status:
        "fonte-localizada"
    }
  }),


  /* ======================================
     DEATH ZONE
  ====================================== */

  criarComplementoImagemHissatsu({
    id:
      "death-zone",

    imagemReferencia: {
      url:
        "",

      fonte:
        "Inazuma Eleven Wiki / página de referência visual",

      fonteUrl:
        "https://inazuma-eleven.fandom.com/wiki/Death_Zone",

      status:
        "fonte-localizada"
    }
  }),


  /* ======================================
     THE PHOENIX
  ====================================== */

  criarComplementoImagemHissatsu({
    id:
      "the-phoenix",

    imagemReferencia: {
      url:
        "",

      fonte:
        "Inazuma Eleven Wiki / página de referência visual",

      fonteUrl:
        "https://inazuma-eleven.fandom.com/wiki/The_Phoenix",

      status:
        "fonte-localizada"
    }
  }),


  /* ======================================
     HEAVEN'S TIME
  ====================================== */

  criarComplementoImagemHissatsu({
    id:
      "heavens-time",

    imagemReferencia: {
      url:
        "",

      fonte:
        "Inazuma Eleven Wiki / página de referência visual",

      fonteUrl:
        "https://inazuma-eleven.fandom.com/wiki/Heaven%27s_Time",

      status:
        "fonte-localizada"
    }
  }),


  /* ======================================
     THE TOWER
  ====================================== */

  criarComplementoImagemHissatsu({
    id:
      "the-tower",

    imagemReferencia: {
      url:
        "",

      fonte:
        "Inazuma Eleven Wiki / página de referência visual",

      fonteUrl:
        "https://inazuma-eleven.fandom.com/wiki/The_Tower",

      status:
        "fonte-localizada"
    }
  }),


  /* ======================================
     NEKKETSU PUNCH
  ====================================== */

  criarComplementoImagemHissatsu({
    id:
      "nekketsu-punch",

    imagemReferencia: {
      url:
        "",

      fonte:
        "Inazuma Eleven Wiki / página de referência visual",

      fonteUrl:
        "https://inazuma-eleven.fandom.com/wiki/Nekketsu_Punch",

      status:
        "fonte-localizada"
    }
  }),


  /* ======================================
     MUGEN NO KABE
  ====================================== */

  criarComplementoImagemHissatsu({
    id:
      "mugen-no-kabe",

    imagemReferencia: {
      url:
        "",

      fonte:
        "Inazuma Eleven Wiki / página de referência visual",

      fonteUrl:
        "https://inazuma-eleven.fandom.com/wiki/Mugen_no_Kabe",

      status:
        "fonte-localizada"
    }
  })

];