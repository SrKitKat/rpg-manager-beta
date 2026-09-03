import {
  criarLoteHissatsuImportado
} from "./bancoHissatsuImportador.js";


/* ========================================
   INAZUMA ELEVEN
   EXPANSÃO 01

   FORMATO COMPACTO — IMPORTADOR V1

   Esta é a primeira prova real do
   importador.

   OBJETIVO DESTA ETAPA:

   O resultado consolidado deve permanecer
   equivalente ao lote anterior.

   Por isso, NÃO definimos "midiaId" ainda.

   O lote antigo não possuía aparicoes[]
   explícitas. Se adicionássemos midiaId
   agora, o importador criaria essas
   aparições automaticamente e esta etapa
   deixaria de ser uma prova neutra.

   IMPORTANTE:

   Quando uma localização PT-BR ainda não
   está confirmada, usamos:

   ptBR: null

   O aplicativo deve continuar mostrando
   o nome original e:

   "PT-BR: Não catalogado"
======================================== */


const dadosHissatsuIE1Expansao01 = [

  /* ======================================
     INAZUMA OTOSHI
  ====================================== */

  {
    id:
      "inazuma-otoshi",

    original:
      "Inazuma Otoshi",

    ptBR:
      null,

    romanizado:
      "Inazuma Otoshi",

    alternativos: [
      "Inazuma Drop"
    ],

    tipo:
      "chute",

    elemento:
      "Vento",

    tipoOriginal:
      "Shoot",

    elementoOriginal:
      "Wind",

    tags: [
      "chute",
      "vento"
    ]
  },


  /* ======================================
     DEATH ZONE
  ====================================== */

  {
    id:
      "death-zone",

    original:
      "Death Zone",

    ptBR:
      null,

    romanizado:
      "Desu Zōn",

    tipo:
      "chute",

    elemento:
      "Floresta",

    tipoOriginal:
      "Shoot",

    elementoOriginal:
      "Forest",

    tags: [
      "chute",
      "floresta"
    ]
  },


  /* ======================================
     THE PHOENIX
  ====================================== */

  {
    id:
      "the-phoenix",

    original:
      "The Phoenix",

    ptBR:
      null,

    romanizado:
      "Za Fenikkusu",

    tipo:
      "chute",

    elemento:
      "Fogo",

    tipoOriginal:
      "Shoot",

    elementoOriginal:
      "Fire",

    tags: [
      "chute",
      "fogo"
    ]
  },


  /* ======================================
     HEAVEN'S TIME
  ====================================== */

  {
    id:
      "heavens-time",

    original:
      "Heaven's Time",

    ptBR:
      null,

    romanizado:
      "Hebunzu Taimu",

    tipo:
      "drible",

    elemento:
      "Vento",

    tipoOriginal:
      "Dribble",

    elementoOriginal:
      "Wind",

    tags: [
      "drible",
      "vento"
    ]
  },


  /* ======================================
     THE TOWER
  ====================================== */

  {
    id:
      "the-tower",

    original:
      "The Tower",

    ptBR:
      null,

    romanizado:
      "Za Tawā",

    tipo:
      "bloqueio",

    elemento:
      "Vento",

    tipoOriginal:
      "Block",

    elementoOriginal:
      "Wind",

    tags: [
      "bloqueio",
      "vento"
    ]
  },


  /* ======================================
     NEKKETSU PUNCH
  ====================================== */

  {
    id:
      "nekketsu-punch",

    original:
      "Nekketsu Punch",

    ptBR:
      null,

    romanizado:
      "Nekketsu Panchi",

    alternativos: [],

    tipo:
      "defesa_goleiro",

    elemento:
      "Fogo",

    tipoOriginal:
      "Catch",

    elementoOriginal:
      "Fire",

    tags: [
      "goleiro",
      "fogo"
    ]
  },


  /* ======================================
     MUGEN NO KABE
  ====================================== */

  {
    id:
      "mugen-no-kabe",

    original:
      "Mugen no Kabe",

    ptBR:
      null,

    romanizado:
      "Mugen no Kabe",

    tipo:
      "defesa_goleiro",

    elemento:
      "Montanha",

    tipoOriginal:
      "Catch",

    elementoOriginal:
      "Mountain",

    tags: [
      "goleiro",
      "montanha"
    ]
  }

];


/* ========================================
   LOTE OFICIAL

   Estas duas tags eram repetidas em todos
   os registros do arquivo antigo:

   - oficial
   - inazuma-eleven

   Agora são declaradas apenas uma vez.

   As tags específicas continuam em cada
   Hissatsu.

   Exemplo final:

   [
     "oficial",
     "inazuma-eleven",
     "chute",
     "vento"
   ]
======================================== */


export const loteHissatsuIE1Expansao01 =
  criarLoteHissatsuImportado({

    tagsPadrao: [
      "oficial",
      "inazuma-eleven"
    ],

    registros:
      dadosHissatsuIE1Expansao01

  });