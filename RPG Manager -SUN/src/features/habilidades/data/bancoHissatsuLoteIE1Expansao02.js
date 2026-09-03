import {
  criarRegistroHissatsuOficial
} from "./bancoHissatsuEstrutura.js";


/* ========================================
   INAZUMA ELEVEN
   EXPANSÃO 02

   OBJETIVO:
   acelerar a base com uma primeira leva
   grande de técnicas oficiais.

   ESTRATÉGIA DESTE LOTE:
   - IDs estáveis;
   - nome original já catalogado;
   - tipo já catalogado;
   - PT-BR fica pendente quando ainda
     não foi auditado;
   - elemento fica pendente quando ainda
     não foi auditado;
   - imagens serão preenchidas pelo fluxo
     automático de catalogação.

   Isso nos permite crescer rápido sem
   inventar dados finos antes da auditoria.
======================================== */


const TIPO_ORIGINAL = {
  chute:
    "Shoot",

  drible:
    "Dribble",

  bloqueio:
    "Block",

  defesa_goleiro:
    "Catch",

  passe:
    "Pass",

  suporte:
    "Support",

  outro:
    "Other"
};


const TAG_TIPO = {
  chute:
    "chute",

  drible:
    "drible",

  bloqueio:
    "bloqueio",

  defesa_goleiro:
    "goleiro",

  passe:
    "passe",

  suporte:
    "suporte",

  outro:
    "outro"
};


function criarRegistroEscala({
  id,
  nomeOriginal,
  japonesRomanizado = "",
  alternativos = [],
  tipo,
  elemento = "",
  elementoOriginal = ""
}) {
  return criarRegistroHissatsuOficial({
    id,

    nomeOriginal,

    nomePtBR:
      null,

    japonesRomanizado:
      japonesRomanizado ||
      nomeOriginal,

    alternativos,

    tipo,
    elemento,

    tipoOriginal:
      TIPO_ORIGINAL[tipo] ||
      "Other",

    elementoOriginal:
      elementoOriginal ||
      elemento ||
      "",

    observacaoCatalogacao:
      "Registro incluído em lote de escala. Nome original e tipo já foram catalogados; PT-BR, elemento, imagens e demais complementos finos serão auditados progressivamente.",

    tags: [
      "oficial",
      "inazuma-eleven",
      TAG_TIPO[tipo] ||
        "outro"
    ]
  });
}


const ENTRADAS_EXPANSAO02 = [

  /* ======================================
     CHUTES
  ====================================== */

  {
    id:
      "rolling-kick",
    nomeOriginal:
      "Rolling Kick",
    tipo:
      "chute"
  },

  {
    id:
      "spiral-shot",
    nomeOriginal:
      "Spiral Shot",
    tipo:
      "chute"
  },

  {
    id:
      "spinning-shoot",
    nomeOriginal:
      "Spinning Shoot",
    tipo:
      "chute"
  },

  {
    id:
      "snake-shot",
    nomeOriginal:
      "Snake Shot",
    tipo:
      "chute"
  },

  {
    id:
      "suisei-shoot",
    nomeOriginal:
      "Suisei Shoot",
    tipo:
      "chute"
  },

  {
    id:
      "grenade-shot",
    nomeOriginal:
      "Grenade Shot",
    tipo:
      "chute"
  },

  {
    id:
      "kamikakushi",
    nomeOriginal:
      "Kamikakushi",
    tipo:
      "chute"
  },

  {
    id:
      "condor-dive",
    nomeOriginal:
      "Condor Dive",
    tipo:
      "chute"
  },

  {
    id:
      "phantom-shoot",
    nomeOriginal:
      "Phantom Shoot",
    tipo:
      "chute"
  },

  {
    id:
      "psycho-shot",
    nomeOriginal:
      "Psycho Shot",
    tipo:
      "chute"
  },

  {
    id:
      "dynamite-shoot",
    nomeOriginal:
      "Dynamite Shoot",
    tipo:
      "chute"
  },

  {
    id:
      "tarzan-kick",
    nomeOriginal:
      "Tarzan Kick",
    tipo:
      "chute"
  },

  {
    id:
      "meteor-attack",
    nomeOriginal:
      "Meteor Attack",
    tipo:
      "chute"
  },

  {
    id:
      "hyakuretsu-shot",
    nomeOriginal:
      "Hyakuretsu Shot",
    tipo:
      "chute"
  },

  {
    id:
      "cross-drive",
    nomeOriginal:
      "Cross Drive",
    tipo:
      "chute"
  },

  {
    id:
      "kung-fu-head",
    nomeOriginal:
      "Kung Fu Head",
    tipo:
      "chute"
  },

  {
    id:
      "patriot-shoot",
    nomeOriginal:
      "Patriot Shoot",
    tipo:
      "chute"
  },

  {
    id:
      "hawk-shot",
    nomeOriginal:
      "Hawk Shot",
    tipo:
      "chute"
  },

  {
    id:
      "dark-tornado",
    nomeOriginal:
      "Dark Tornado",
    tipo:
      "chute"
  },

  {
    id:
      "dokonjou-bat",
    nomeOriginal:
      "Dokonjou Bat",
    tipo:
      "chute"
  },

  {
    id:
      "tsuchi-daruma",
    nomeOriginal:
      "Tsuchi Daruma",
    tipo:
      "chute"
  },

  {
    id:
      "freeze-shot",
    nomeOriginal:
      "Freeze Shot",
    tipo:
      "chute"
  },

  {
    id:
      "run-ball-run",
    nomeOriginal:
      "Run Ball Run",
    tipo:
      "chute"
  },

  {
    id:
      "corodra-shoot",
    nomeOriginal:
      "Corodra Shoot",
    tipo:
      "chute"
  },

  {
    id:
      "shine-drive",
    nomeOriginal:
      "Shine Drive",
    tipo:
      "chute"
  },

  {
    id:
      "twin-boost",
    nomeOriginal:
      "Twin Boost",
    tipo:
      "chute"
  },

  {
    id:
      "inazuma-break",
    nomeOriginal:
      "Inazuma Break",
    tipo:
      "chute"
  },

  {
    id:
      "inazuma-1gou",
    nomeOriginal:
      "Inazuma 1gou",
    japonesRomanizado:
      "Inazuma Ichigou",
    alternativos: [
      "Inazuma No. 1"
    ],
    tipo:
      "chute"
  },

  {
    id:
      "bunshin-shoot",
    nomeOriginal:
      "Bunshin Shoot",
    tipo:
      "chute"
  },

  {
    id:
      "dragon-tornado",
    nomeOriginal:
      "Dragon Tornado",
    tipo:
      "chute"
  },

  {
    id:
      "divine-arrow",
    nomeOriginal:
      "Divine Arrow",
    tipo:
      "chute"
  },

  {
    id:
      "koutei-penguin-2gou",
    nomeOriginal:
      "Koutei Penguin 2gou",
    japonesRomanizado:
      "Koutei Penguin Nigou",
    alternativos: [
      "Emperor Penguin No. 2"
    ],
    tipo:
      "chute"
  },

  {
    id:
      "honoo-no-kazamidori",
    nomeOriginal:
      "Honoo no Kazamidori",
    tipo:
      "chute"
  },

  {
    id:
      "triangle-z",
    nomeOriginal:
      "Triangle Z",
    tipo:
      "chute"
  },

  {
    id:
      "reflect-buster",
    nomeOriginal:
      "Reflect Buster",
    tipo:
      "chute"
  },

  {
    id:
      "the-galaxy",
    nomeOriginal:
      "The Galaxy",
    tipo:
      "chute"
  },

  {
    id:
      "bakunetsu-screw",
    nomeOriginal:
      "Bakunetsu Screw",
    tipo:
      "chute"
  },


  /* ======================================
     DRIBLES
  ====================================== */

  {
    id:
      "dash-accel",
    nomeOriginal:
      "Dash Accel",
    tipo:
      "drible"
  },

  {
    id:
      "tamanori-pierrot",
    nomeOriginal:
      "Tamanori Pierrot",
    tipo:
      "drible"
  },

  {
    id:
      "tatsumaki-senpuu",
    nomeOriginal:
      "Tatsumaki Senpuu",
    tipo:
      "drible"
  },

  {
    id:
      "noroi",
    nomeOriginal:
      "Noroi",
    tipo:
      "drible"
  },

  {
    id:
      "monkey-turn",
    nomeOriginal:
      "Monkey Turn",
    tipo:
      "drible"
  },

  {
    id:
      "dokugiri-no-jutsu",
    nomeOriginal:
      "Dokugiri no Jutsu",
    tipo:
      "drible"
  },

  {
    id:
      "magic",
    nomeOriginal:
      "Magic",
    tipo:
      "drible"
  },

  {
    id:
      "moonsault",
    nomeOriginal:
      "Moonsault",
    tipo:
      "drible"
  },

  {
    id:
      "super-scan",
    nomeOriginal:
      "Super Scan",
    tipo:
      "drible"
  },

  {
    id:
      "judge-through",
    nomeOriginal:
      "Judge Through",
    tipo:
      "drible"
  },

  {
    id:
      "super-armadillo",
    nomeOriginal:
      "Super Armadillo",
    tipo:
      "drible"
  },

  {
    id:
      "zigzag-spark",
    nomeOriginal:
      "Zigzag Spark",
    tipo:
      "drible"
  },

  {
    id:
      "heat-tackle",
    nomeOriginal:
      "Heat Tackle",
    tipo:
      "drible"
  },

  {
    id:
      "gorimuchuu",
    nomeOriginal:
      "Gorimuchuu",
    tipo:
      "drible"
  },

  {
    id:
      "zanzou",
    nomeOriginal:
      "Zanzou",
    tipo:
      "drible"
  },

  {
    id:
      "kamaitachi",
    nomeOriginal:
      "Kamaitachi",
    tipo:
      "drible"
  },

  {
    id:
      "mogura-feint",
    nomeOriginal:
      "Mogura Feint",
    tipo:
      "drible"
  },

  {
    id:
      "bunshin-feint",
    nomeOriginal:
      "Bunshin Feint",
    tipo:
      "drible"
  },

  {
    id:
      "dash-storm",
    nomeOriginal:
      "Dash Storm",
    tipo:
      "drible"
  },

  {
    id:
      "jigoku-guruma",
    nomeOriginal:
      "Jigoku Guruma",
    tipo:
      "drible"
  },

  {
    id:
      "boost-glider",
    nomeOriginal:
      "Boost Glider",
    tipo:
      "drible"
  },


  /* ======================================
     DEFESA / BLOQUEIO
  ====================================== */

  {
    id:
      "black-hole",
    nomeOriginal:
      "Black Hole",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "swan-dive",
    nomeOriginal:
      "Swan Dive",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "killer-blade",
    nomeOriginal:
      "Killer Blade",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "toughness-block",
    nomeOriginal:
      "Toughness Block",
    tipo:
      "bloqueio"
  },

  {
    id:
      "tornado-catch",
    nomeOriginal:
      "Tornado Catch",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "yugamu-kuukan",
    nomeOriginal:
      "Yugamu Kuukan",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "pressure-punch",
    nomeOriginal:
      "Pressure Punch",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "makiwari-chop",
    nomeOriginal:
      "Makiwari Chop",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "wormhole",
    nomeOriginal:
      "Wormhole",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "ice-block",
    nomeOriginal:
      "Ice Block",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "drill-smasher",
    nomeOriginal:
      "Drill Smasher",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "procyon-net",
    nomeOriginal:
      "Procyon Net",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "burnout",
    nomeOriginal:
      "Burnout",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "jikuu-no-kabe",
    nomeOriginal:
      "Jikuu no Kabe",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "kogarashi",
    nomeOriginal:
      "Kogarashi",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "power-shield",
    nomeOriginal:
      "Power Shield",
    tipo:
      "bloqueio"
  },

  {
    id:
      "wild-claw",
    nomeOriginal:
      "Wild Claw",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "rocket-kobushi",
    nomeOriginal:
      "Rocket Kobushi",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "hanafubuki",
    nomeOriginal:
      "Hanafubuki",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "shoot-pocket",
    nomeOriginal:
      "Shoot Pocket",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "nekketsu-head",
    nomeOriginal:
      "Nekketsu Head",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "tsumuji",
    nomeOriginal:
      "Tsumuji",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "slash-nail",
    nomeOriginal:
      "Slash Nail",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "full-power-shield",
    nomeOriginal:
      "Full Power Shield",
    tipo:
      "bloqueio"
  },

  {
    id:
      "goal-zurashi",
    nomeOriginal:
      "Goal Zurashi",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "aurora-curtain",
    nomeOriginal:
      "Aurora Curtain",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "bakuretsu-punch",
    nomeOriginal:
      "Bakuretsu Punch",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "dokonjou-catch",
    nomeOriginal:
      "Dokonjou Catch",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "safety-protect",
    nomeOriginal:
      "Safety Protect",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "kaenhousha",
    nomeOriginal:
      "Kaenhousha",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "chabudai-gaeshi",
    nomeOriginal:
      "Chabudai Gaeshi",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "tsunami-wall",
    nomeOriginal:
      "Tsunami Wall",
    tipo:
      "bloqueio"
  },

  {
    id:
      "counterstrike",
    nomeOriginal:
      "Counterstrike",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "dual-smash",
    nomeOriginal:
      "Dual Smash",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "double-rocket",
    nomeOriginal:
      "Double Rocket",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "bunshin-block",
    nomeOriginal:
      "Bunshin Block",
    tipo:
      "bloqueio"
  },

  {
    id:
      "gigant-wall",
    nomeOriginal:
      "Gigant Wall",
    tipo:
      "bloqueio"
  },

  {
    id:
      "triple-defense",
    nomeOriginal:
      "Triple Defense",
    tipo:
      "bloqueio"
  },

  {
    id:
      "seigi-no-tekken",
    nomeOriginal:
      "Seigi no Tekken",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "mugen-the-hand",
    nomeOriginal:
      "Mugen The Hand",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "god-hand-triple",
    nomeOriginal:
      "God Hand Triple",
    tipo:
      "defesa_goleiro"
  },

  {
    id:
      "beast-fang",
    nomeOriginal:
      "Beast Fang",
    tipo:
      "defesa_goleiro"
  }

];


export const loteHissatsuIE1Expansao02 =
  ENTRADAS_EXPANSAO02.map(
    criarRegistroEscala
  );