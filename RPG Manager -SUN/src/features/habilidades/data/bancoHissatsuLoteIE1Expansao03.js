import {
  criarRegistroHissatsuOficial
} from "./bancoHissatsuEstrutura.js";


/* ========================================
   INAZUMA ELEVEN
   EXPANSÃO 03

   OBJETIVO:
   adicionar 200 Hissatsu factuais inéditas
   ao Banco, preservando o fluxo de escala.

   ESTRATÉGIA DESTE LOTE:
   - 200 IDs novos em relação aos 115 atuais;
   - IDs estáveis;
   - nome original catalogado;
   - tipo catalogado;
   - PT-BR permanece pendente quando ainda
     não foi auditado;
   - elemento permanece pendente quando ainda
     não foi auditado;
   - imagens ficam para o fluxo automático
     de catalogação.

   Este lote contém somente dados factuais
   mínimos necessários para a expansão.
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


const ENTRADAS_EXPANSAO03 = [

  /* ======================================
     CHUTES — 80
  ====================================== */

  {
    id: "astro-break",
    nomeOriginal: "Astro Break",
    tipo: "chute"
  },

  {
    id: "gungnir",
    nomeOriginal: "Gungnir",
    tipo: "chute"
  },

  {
    id: "tiger-drive",
    nomeOriginal: "Tiger Drive",
    tipo: "chute"
  },

  {
    id: "atomic-flare",
    nomeOriginal: "Atomic Flare",
    tipo: "chute"
  },

  {
    id: "gaia-break",
    nomeOriginal: "Gaia Break",
    tipo: "chute"
  },

  {
    id: "northern-impact",
    nomeOriginal: "Northern Impact",
    tipo: "chute"
  },

  {
    id: "odin-sword",
    nomeOriginal: "Odin Sword",
    tipo: "chute"
  },

  {
    id: "back-tornado",
    nomeOriginal: "Back Tornado",
    tipo: "chute"
  },

  {
    id: "double-grenade",
    nomeOriginal: "Double Grenade",
    tipo: "chute"
  },

  {
    id: "fire-blizzard",
    nomeOriginal: "Fire Blizzard",
    tipo: "chute"
  },

  {
    id: "space-penguin",
    nomeOriginal: "Space Penguin",
    tipo: "chute"
  },

  {
    id: "supernova",
    nomeOriginal: "Supernova",
    tipo: "chute"
  },

  {
    id: "eternal-blizzard",
    nomeOriginal: "Eternal Blizzard",
    tipo: "chute"
  },

  {
    id: "gladius-arch",
    nomeOriginal: "Gladius Arch",
    tipo: "chute"
  },

  {
    id: "assault-shoot",
    nomeOriginal: "Assault Shoot",
    tipo: "chute"
  },

  {
    id: "security-shot",
    nomeOriginal: "Security Shot",
    tipo: "chute"
  },

  {
    id: "tsuutenkaku-shoot",
    nomeOriginal: "Tsuutenkaku Shoot",
    tipo: "chute"
  },

  {
    id: "nihyakuretsu-shot",
    nomeOriginal: "Nihyakuretsu Shot",
    tipo: "chute"
  },

  {
    id: "dragon-cannon",
    nomeOriginal: "Dragon Cannon",
    tipo: "chute"
  },

  {
    id: "megaton-head",
    nomeOriginal: "Megaton Head",
    tipo: "chute"
  },

  {
    id: "dual-strike",
    nomeOriginal: "Dual Strike",
    tipo: "chute"
  },

  {
    id: "tsunami-boost",
    nomeOriginal: "Tsunami Boost",
    tipo: "chute"
  },

  {
    id: "butterfly-dream",
    nomeOriginal: "Butterfly Dream",
    tipo: "chute"
  },

  {
    id: "revolution-v",
    nomeOriginal: "Revolution V",
    tipo: "chute"
  },

  {
    id: "wyvern-crash",
    nomeOriginal: "Wyvern Crash",
    tipo: "chute"
  },

  {
    id: "double-tornado",
    nomeOriginal: "Double Tornado",
    tipo: "chute"
  },

  {
    id: "eagle-buster",
    nomeOriginal: "Eagle Buster",
    tipo: "chute"
  },

  {
    id: "koutei-penguin-1gou",
    nomeOriginal: "Koutei Penguin 1gou",
    tipo: "chute"
  },

  {
    id: "wolf-legend",
    nomeOriginal: "Wolf Legend",
    tipo: "chute"
  },

  {
    id: "tri-pegasus",
    nomeOriginal: "Tri-Pegasus",
    tipo: "chute"
  },

  {
    id: "twin-boost-f",
    nomeOriginal: "Twin Boost F",
    tipo: "chute"
  },

  {
    id: "wyvern-blizzard",
    nomeOriginal: "Wyvern Blizzard",
    tipo: "chute"
  },

  {
    id: "death-zone-2",
    nomeOriginal: "Death Zone 2",
    tipo: "chute"
  },

  {
    id: "god-break",
    nomeOriginal: "God Break",
    tipo: "chute"
  },

  {
    id: "triple-boost",
    nomeOriginal: "Triple Boost",
    tipo: "chute"
  },

  {
    id: "dark-phoenix",
    nomeOriginal: "Dark Phoenix",
    tipo: "chute"
  },

  {
    id: "inazuma-1gou-otoshi",
    nomeOriginal: "Inazuma 1gou Otoshi",
    tipo: "chute"
  },

  {
    id: "neo-galaxy",
    nomeOriginal: "Neo Galaxy",
    tipo: "chute"
  },

  {
    id: "crossfire",
    nomeOriginal: "Crossfire",
    tipo: "chute"
  },

  {
    id: "the-earth",
    nomeOriginal: "The Earth",
    tipo: "chute"
  },

  {
    id: "megalodon",
    nomeOriginal: "Megalodon",
    tipo: "chute"
  },

  {
    id: "the-typhoon",
    nomeOriginal: "The Typhoon",
    tipo: "chute"
  },

  {
    id: "thunder-beast",
    nomeOriginal: "Thunder Beast",
    tipo: "chute"
  },

  {
    id: "tatsumaki-otoshi",
    nomeOriginal: "Tatsumaki Otoshi",
    tipo: "chute"
  },

  {
    id: "the-birth",
    nomeOriginal: "The Birth",
    tipo: "chute"
  },

  {
    id: "the-hurricane",
    nomeOriginal: "The Hurricane",
    tipo: "chute"
  },

  {
    id: "prime-legend",
    nomeOriginal: "Prime Legend",
    tipo: "chute"
  },

  {
    id: "excalibur",
    nomeOriginal: "Excalibur",
    tipo: "chute"
  },

  {
    id: "rose-splash",
    nomeOriginal: "Rose Splash",
    tipo: "chute"
  },

  {
    id: "tkachev-bomber",
    nomeOriginal: "Tkachev Bomber",
    tipo: "chute"
  },

  {
    id: "card-buster",
    nomeOriginal: "Card Buster",
    tipo: "chute"
  },

  {
    id: "mirage-shoot",
    nomeOriginal: "Mirage Shoot",
    tipo: "chute"
  },

  {
    id: "death-spear",
    nomeOriginal: "Death Spear",
    tipo: "chute"
  },

  {
    id: "astro-gate",
    nomeOriginal: "Astro Gate",
    tipo: "chute"
  },

  {
    id: "pegasus-shot",
    nomeOriginal: "Pegasus Shot",
    tipo: "chute"
  },

  {
    id: "universe-blast",
    nomeOriginal: "Universe Blast",
    tipo: "chute"
  },

  {
    id: "dragon-slayer",
    nomeOriginal: "Dragon Slayer",
    tipo: "chute"
  },

  {
    id: "dark-matter",
    nomeOriginal: "Dark Matter",
    tipo: "chute"
  },

  {
    id: "bunshin-penguin",
    nomeOriginal: "Bunshin Penguin",
    tipo: "chute"
  },

  {
    id: "bunshin-death-zone",
    nomeOriginal: "Bunshin Death Zone",
    tipo: "chute"
  },

  {
    id: "gran-fenrir",
    nomeOriginal: "Gran Fenrir",
    tipo: "chute"
  },

  {
    id: "koutei-penguin-3gou",
    nomeOriginal: "Koutei Penguin 3gou",
    tipo: "chute"
  },

  {
    id: "chaos-break",
    nomeOriginal: "Chaos Break",
    tipo: "chute"
  },

  {
    id: "shadow-ray",
    nomeOriginal: "Shadow Ray",
    tipo: "chute"
  },

  {
    id: "abisegeri",
    nomeOriginal: "Abisegeri",
    tipo: "chute"
  },

  {
    id: "rc-shoot",
    nomeOriginal: "RC Shoot",
    tipo: "chute"
  },

  {
    id: "gunshot",
    nomeOriginal: "Gunshot",
    tipo: "chute"
  },

  {
    id: "bakunetsu-storm",
    nomeOriginal: "Bakunetsu Storm",
    tipo: "chute"
  },

  {
    id: "hellfire",
    nomeOriginal: "Hellfire",
    tipo: "chute"
  },

  {
    id: "ryuusei-blade",
    nomeOriginal: "Ryuusei Blade",
    tipo: "chute"
  },

  {
    id: "death-rain",
    nomeOriginal: "Death Rain",
    tipo: "chute"
  },

  {
    id: "tenkuu-otoshi",
    nomeOriginal: "Tenkuu Otoshi",
    tipo: "chute"
  },

  {
    id: "koutei-penguin-x",
    nomeOriginal: "Koutei Penguin X",
    tipo: "chute"
  },

  {
    id: "tiger-storm",
    nomeOriginal: "Tiger Storm",
    tipo: "chute"
  },

  {
    id: "double-jaw",
    nomeOriginal: "Double Jaw",
    tipo: "chute"
  },

  {
    id: "maximum-fire",
    nomeOriginal: "Maximum Fire",
    tipo: "chute"
  },

  {
    id: "grand-fire",
    nomeOriginal: "Grand Fire",
    tipo: "chute"
  },

  {
    id: "x-blast",
    nomeOriginal: "X Blast",
    tipo: "chute"
  },

  {
    id: "big-bang",
    nomeOriginal: "Big Bang",
    tipo: "chute"
  },

  {
    id: "kurukuru-head",
    nomeOriginal: "Kurukuru Head",
    tipo: "chute"
  },


  /* ======================================
     DRIBLES — 40
  ====================================== */

  {
    id: "ribbon-shower",
    nomeOriginal: "Ribbon Shower",
    tipo: "drible"
  },

  {
    id: "aurora-dribble",
    nomeOriginal: "Aurora Dribble",
    tipo: "drible"
  },

  {
    id: "oouchiwa",
    nomeOriginal: "Oouchiwa",
    tipo: "drible"
  },

  {
    id: "big-card",
    nomeOriginal: "Big Card",
    tipo: "drible"
  },

  {
    id: "aikidou",
    nomeOriginal: "Aikidou",
    tipo: "drible"
  },

  {
    id: "water-veil",
    nomeOriginal: "Water Veil",
    tipo: "drible"
  },

  {
    id: "fuujin-no-mai",
    nomeOriginal: "Fuujin no Mai",
    tipo: "drible"
  },

  {
    id: "angel-ball",
    nomeOriginal: "Angel Ball",
    tipo: "drible"
  },

  {
    id: "air-ride",
    nomeOriginal: "Air Ride",
    tipo: "drible"
  },

  {
    id: "warp-drive",
    nomeOriginal: "Warp Drive",
    tipo: "drible"
  },

  {
    id: "tatsumaki-dokugiri",
    nomeOriginal: "Tatsumaki Dokugiri",
    tipo: "drible"
  },

  {
    id: "maboroshi-dribble",
    nomeOriginal: "Maboroshi Dribble",
    tipo: "drible"
  },

  {
    id: "ultra-moon",
    nomeOriginal: "Ultra Moon",
    tipo: "drible"
  },

  {
    id: "echo-ball",
    nomeOriginal: "Echo Ball",
    tipo: "drible"
  },

  {
    id: "matador-feint",
    nomeOriginal: "Matador Feint",
    tipo: "drible"
  },

  {
    id: "southern-crosscut",
    nomeOriginal: "Southern Crosscut",
    tipo: "drible"
  },

  {
    id: "dual-pass",
    nomeOriginal: "Dual Pass",
    tipo: "drible"
  },

  {
    id: "devil-ball",
    nomeOriginal: "Devil Ball",
    tipo: "drible"
  },

  {
    id: "killer-fields",
    nomeOriginal: "Killer Fields",
    tipo: "drible"
  },

  {
    id: "hitori-one-two",
    nomeOriginal: "Hitori One-Two",
    tipo: "drible"
  },

  {
    id: "fuusengamu",
    nomeOriginal: "Fuusengamu",
    tipo: "drible"
  },

  {
    id: "naraku-otoshi",
    nomeOriginal: "Naraku Otoshi",
    tipo: "drible"
  },

  {
    id: "dog-run",
    nomeOriginal: "Dog Run",
    tipo: "drible"
  },

  {
    id: "meteor-shower",
    nomeOriginal: "Meteor Shower",
    tipo: "drible"
  },

  {
    id: "reppuu-dash",
    nomeOriginal: "Reppuu Dash",
    tipo: "drible"
  },

  {
    id: "liar-shoot",
    nomeOriginal: "Liar Shoot",
    tipo: "drible"
  },

  {
    id: "armadillo-circus",
    nomeOriginal: "Armadillo Circus",
    tipo: "drible"
  },

  {
    id: "lightning-accel",
    nomeOriginal: "Lightning Accel",
    tipo: "drible"
  },

  {
    id: "judge-through-2",
    nomeOriginal: "Judge Through 2",
    tipo: "drible"
  },

  {
    id: "the-icarus",
    nomeOriginal: "The Icarus",
    tipo: "drible"
  },

  {
    id: "judge-through-3",
    nomeOriginal: "Judge Through 3",
    tipo: "drible"
  },

  {
    id: "kangaroo-kick",
    nomeOriginal: "Kangaroo Kick",
    tipo: "drible"
  },

  {
    id: "scissors-bomb",
    nomeOriginal: "Scissors Bomb",
    tipo: "drible"
  },

  {
    id: "prima-donna",
    nomeOriginal: "Prima Donna",
    tipo: "drible"
  },

  {
    id: "toumei-feint",
    nomeOriginal: "Toumei Feint",
    tipo: "drible"
  },

  {
    id: "mogura-shuffle",
    nomeOriginal: "Mogura Shuffle",
    tipo: "drible"
  },

  {
    id: "u-boat",
    nomeOriginal: "U-Boat",
    tipo: "drible"
  },

  {
    id: "ninin-sankyaku",
    nomeOriginal: "Ninin Sankyaku",
    tipo: "drible"
  },

  {
    id: "super-elastic",
    nomeOriginal: "Super Elastic",
    tipo: "drible"
  },

  {
    id: "triple-dash",
    nomeOriginal: "Triple Dash",
    tipo: "drible"
  },


  /* ======================================
     BLOQUEIOS — 55
  ====================================== */

  {
    id: "coil-turn",
    nomeOriginal: "Coil Turn",
    tipo: "bloqueio"
  },

  {
    id: "bull-attack",
    nomeOriginal: "Bull Attack",
    tipo: "bloqueio"
  },

  {
    id: "ice-ground",
    nomeOriginal: "Ice Ground",
    tipo: "bloqueio"
  },

  {
    id: "spinning-cut",
    nomeOriginal: "Spinning Cut",
    tipo: "bloqueio"
  },

  {
    id: "desert-storm",
    nomeOriginal: "Desert Storm",
    tipo: "bloqueio"
  },

  {
    id: "cyclone",
    nomeOriginal: "Cyclone",
    tipo: "bloqueio"
  },

  {
    id: "profile-zone",
    nomeOriginal: "Profile Zone",
    tipo: "bloqueio"
  },

  {
    id: "senpuujin",
    nomeOriginal: "Senpuujin",
    tipo: "bloqueio"
  },

  {
    id: "shinkuuma",
    nomeOriginal: "Shinkuuma",
    tipo: "bloqueio"
  },

  {
    id: "snow-angel",
    nomeOriginal: "Snow Angel",
    tipo: "bloqueio"
  },

  {
    id: "double-cyclone",
    nomeOriginal: "Double Cyclone",
    tipo: "bloqueio"
  },

  {
    id: "whale-guard",
    nomeOriginal: "Whale Guard",
    tipo: "bloqueio"
  },

  {
    id: "frozen-steal",
    nomeOriginal: "Frozen Steal",
    tipo: "bloqueio"
  },

  {
    id: "go-to-heaven",
    nomeOriginal: "Go To Heaven",
    tipo: "bloqueio"
  },

  {
    id: "hurricane-arrow",
    nomeOriginal: "Hurricane Arrow",
    tipo: "bloqueio"
  },

  {
    id: "perfect-tower",
    nomeOriginal: "Perfect Tower",
    tipo: "bloqueio"
  },

  {
    id: "quick-draw",
    nomeOriginal: "Quick Draw",
    tipo: "bloqueio"
  },

  {
    id: "doppelganger",
    nomeOriginal: "Doppelganger",
    tipo: "bloqueio"
  },

  {
    id: "onryou",
    nomeOriginal: "Onryou",
    tipo: "bloqueio"
  },

  {
    id: "killer-slide",
    nomeOriginal: "Killer Slide",
    tipo: "bloqueio"
  },

  {
    id: "fake-ball",
    nomeOriginal: "Fake Ball",
    tipo: "bloqueio"
  },

  {
    id: "kumo-no-ito",
    nomeOriginal: "Kumo no Ito",
    tipo: "bloqueio"
  },

  {
    id: "welcome-back",
    nomeOriginal: "Welcome Back",
    tipo: "bloqueio"
  },

  {
    id: "good-smell",
    nomeOriginal: "Good Smell",
    tipo: "bloqueio"
  },

  {
    id: "bunshin-defense",
    nomeOriginal: "Bunshin Defense",
    tipo: "bloqueio"
  },

  {
    id: "sneaking-raid",
    nomeOriginal: "Sneaking Raid",
    tipo: "bloqueio"
  },

  {
    id: "asteroid-belt",
    nomeOriginal: "Asteroid Belt",
    tipo: "bloqueio"
  },

  {
    id: "dual-storm",
    nomeOriginal: "Dual Storm",
    tipo: "bloqueio"
  },

  {
    id: "harvest",
    nomeOriginal: "Harvest",
    tipo: "bloqueio"
  },

  {
    id: "demon-cut",
    nomeOriginal: "Demon Cut",
    tipo: "bloqueio"
  },

  {
    id: "rock-wall-dam",
    nomeOriginal: "Rock Wall Dam",
    tipo: "bloqueio"
  },

  {
    id: "go-to-hell",
    nomeOriginal: "Go To Hell",
    tipo: "bloqueio"
  },

  {
    id: "sigma-zone",
    nomeOriginal: "Sigma Zone",
    tipo: "bloqueio"
  },

  {
    id: "giant-spin",
    nomeOriginal: "Giant Spin",
    tipo: "bloqueio"
  },

  {
    id: "photon-flash",
    nomeOriginal: "Photon Flash",
    tipo: "bloqueio"
  },

  {
    id: "super-shikofumi",
    nomeOriginal: "Super Shikofumi",
    tipo: "bloqueio"
  },

  {
    id: "fake-bomber",
    nomeOriginal: "Fake Bomber",
    tipo: "bloqueio"
  },

  {
    id: "zigzag-flame",
    nomeOriginal: "Zigzag Flame",
    tipo: "bloqueio"
  },

  {
    id: "flame-dance",
    nomeOriginal: "Flame Dance",
    tipo: "bloqueio"
  },

  {
    id: "volcano-cut",
    nomeOriginal: "Volcano Cut",
    tipo: "bloqueio"
  },

  {
    id: "rolling-slide",
    nomeOriginal: "Rolling Slide",
    tipo: "bloqueio"
  },

  {
    id: "sabaki-no-tettsui",
    nomeOriginal: "Sabaki no Tettsui",
    tipo: "bloqueio"
  },

  {
    id: "shooting-star",
    nomeOriginal: "Shooting Star",
    tipo: "bloqueio"
  },

  {
    id: "planet-shield",
    nomeOriginal: "Planet Shield",
    tipo: "bloqueio"
  },

  {
    id: "ignite-steal",
    nomeOriginal: "Ignite Steal",
    tipo: "bloqueio"
  },

  {
    id: "mad-express",
    nomeOriginal: "Mad Express",
    tipo: "bloqueio"
  },

  {
    id: "shikofumi",
    nomeOriginal: "Shikofumi",
    tipo: "bloqueio"
  },

  {
    id: "horn-train",
    nomeOriginal: "Horn Train",
    tipo: "bloqueio"
  },

  {
    id: "ushiro-no-shoumen",
    nomeOriginal: "Ushiro no Shoumen",
    tipo: "bloqueio"
  },

  {
    id: "earthquake",
    nomeOriginal: "Earthquake",
    tipo: "bloqueio"
  },

  {
    id: "power-charge",
    nomeOriginal: "Power Charge",
    tipo: "bloqueio"
  },

  {
    id: "gravitation",
    nomeOriginal: "Gravitation",
    tipo: "bloqueio"
  },

  {
    id: "stone-prison",
    nomeOriginal: "Stone Prison",
    tipo: "bloqueio"
  },

  {
    id: "heavy-baby",
    nomeOriginal: "Heavy Baby",
    tipo: "bloqueio"
  },

  {
    id: "iron-wall",
    nomeOriginal: "Iron Wall",
    tipo: "bloqueio"
  },


  /* ======================================
     DEFESAS DE GOLEIRO — 25
  ====================================== */

  {
    id: "galatyn",
    nomeOriginal: "Galatyn",
    tipo: "defesa_goleiro"
  },

  {
    id: "great-barrier-reef",
    nomeOriginal: "Great Barrier Reef",
    tipo: "defesa_goleiro"
  },

  {
    id: "storm-rider",
    nomeOriginal: "Storm Rider",
    tipo: "defesa_goleiro"
  },

  {
    id: "needle-hammer",
    nomeOriginal: "Needle Hammer",
    tipo: "defesa_goleiro"
  },

  {
    id: "electrap",
    nomeOriginal: "Electrap",
    tipo: "defesa_goleiro"
  },

  {
    id: "high-voltage",
    nomeOriginal: "High Voltage",
    tipo: "defesa_goleiro"
  },

  {
    id: "horizon",
    nomeOriginal: "Horizon",
    tipo: "defesa_goleiro"
  },

  {
    id: "stinger",
    nomeOriginal: "Stinger",
    tipo: "defesa_goleiro"
  },

  {
    id: "big-spider",
    nomeOriginal: "Big Spider",
    tipo: "defesa_goleiro"
  },

  {
    id: "ijigen-the-hand",
    nomeOriginal: "Ijigen The Hand",
    tipo: "defesa_goleiro"
  },

  {
    id: "the-end",
    nomeOriginal: "The End",
    tipo: "defesa_goleiro"
  },

  {
    id: "maou-the-hand",
    nomeOriginal: "Maou The Hand",
    tipo: "defesa_goleiro"
  },

  {
    id: "shootrap",
    nomeOriginal: "Shootrap",
    tipo: "defesa_goleiro"
  },

  {
    id: "god-hand-x",
    nomeOriginal: "God Hand X",
    tipo: "defesa_goleiro"
  },

  {
    id: "million-hands",
    nomeOriginal: "Million Hands",
    tipo: "defesa_goleiro"
  },

  {
    id: "tamashii-the-hand",
    nomeOriginal: "Tamashii The Hand",
    tipo: "defesa_goleiro"
  },

  {
    id: "card-protect",
    nomeOriginal: "Card Protect",
    tipo: "defesa_goleiro"
  },

  {
    id: "colosseo-guard",
    nomeOriginal: "Colosseo Guard",
    tipo: "defesa_goleiro"
  },

  {
    id: "ikari-no-tettsui",
    nomeOriginal: "Ikari no Tettsui",
    tipo: "defesa_goleiro"
  },

  {
    id: "capoeira-snatch",
    nomeOriginal: "Capoeira Snatch",
    tipo: "defesa_goleiro"
  },

  {
    id: "flash-upper",
    nomeOriginal: "Flash Upper",
    tipo: "defesa_goleiro"
  },

  {
    id: "god-catch",
    nomeOriginal: "God Catch",
    tipo: "defesa_goleiro"
  },

  {
    id: "omega-the-hand",
    nomeOriginal: "Omega The Hand",
    tipo: "defesa_goleiro"
  },

  {
    id: "dai-bakuhatsu-harite",
    nomeOriginal: "Dai Bakuhatsu Harite",
    tipo: "defesa_goleiro"
  },

  {
    id: "ouke-no-tate",
    nomeOriginal: "Ouke no Tate",
    tipo: "defesa_goleiro"
  }

];


export const loteHissatsuIE1Expansao03 =
  ENTRADAS_EXPANSAO03.map(
    criarRegistroEscala
  );