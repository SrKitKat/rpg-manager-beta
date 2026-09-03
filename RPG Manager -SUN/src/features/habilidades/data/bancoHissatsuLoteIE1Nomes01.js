/* ========================================
   INAZUMA ELEVEN
   COMPLEMENTO DE NOMES 01

   Camada de localização do banco factual.
   - 315 IDs factuais, sem criar Hissatsu novas;
   - inglês: 313 verificados + 2 pendentes;
   - japonês romanizado: 18 verificados + 297 pendentes;
   - PT-BR permanece no banco factual.
======================================== */

const IDS_INGLES_PENDENTES = new Set([
  "bull-attack",
  "horizon"
]);

const IDS_JAPONES_VERIFICADOS = new Set([
  "fire-tornado",
  "dragon-crash",
  "god-knows",
  "shippuu-dash",
  "illusion-ball",
  "the-wall",
  "god-hand",
  "majin-the-hand",
  "inazuma-otoshi",
  "death-zone",
  "the-phoenix",
  "heavens-time",
  "the-tower",
  "nekketsu-punch",
  "mugen-no-kabe",
  "inazuma-1gou",
  "koutei-penguin-2gou",
  "tenkuu-otoshi"
]);

function nome(id, ingles, japonesRomanizado) {
  return {
    id,

    nomes: {
      ingles,
      japonesRomanizado
    },

    localizacao: {
      ingles: IDS_INGLES_PENDENTES.has(id)
        ? "pendente"
        : "verificada",

      japonesRomanizado: IDS_JAPONES_VERIFICADOS.has(id)
        ? "verificada"
        : "pendente"
    }
  };
}

export const loteHissatsuIE1Nomes01 = [
  // CHUTES
  nome("fire-tornado", "Fire Tornado", "Faia Torunēdo"),
  nome("dragon-crash", "Dragon Crash", "Doragon Kurasshu"),
  nome("god-knows", "God Knows", "Goddo Nōzu"),

  // DRIBLES
  nome("shippuu-dash", "Flurry Dash", "Shippū Dasshu"),
  nome("illusion-ball", "Illusory Ball", "Iruujion Bouru"),

  // BLOQUEIOS
  nome("the-wall", "The Wall", "Za Uōru"),

  // DEFESAS DE GOLEIRO
  nome("god-hand", "God Hand", "Goddo Hando"),
  nome("majin-the-hand", "Majin the Hand", "Majin Za Hando"),

  // CHUTES
  nome("inazuma-otoshi", "Inazuma Drop", "Inazuma Otoshi"),
  nome("death-zone", "Death Zone", "Desu Zōn"),
  nome("the-phoenix", "The Phoenix", "Za Fenikkusu"),

  // DRIBLES
  nome("heavens-time", "Heaven's Time", "Hebunzu Taimu"),

  // BLOQUEIOS
  nome("the-tower", "The Tower", "Za Tawā"),

  // DEFESAS DE GOLEIRO
  nome("nekketsu-punch", "Fireball Knuckle", "Nekketsu Panchi"),
  nome("mugen-no-kabe", "Infinite Wall", "Mugen no Kabe"),

  // CHUTES
  nome("rolling-kick", "Rolling Kick", "Rolling Kick"),
  nome("spiral-shot", "Spiral Shot", "Spiral Shot"),
  nome("spinning-shoot", "Spinning Shot", "Spinning Shoot"),
  nome("snake-shot", "Snake Shot", "Snake Shot"),
  nome("suisei-shoot", "Comet Shot", "Suisei Shoot"),
  nome("grenade-shot", "Grenade Shot", "Grenade Shot"),
  nome("kamikakushi", "Teleport Shot", "Kamikakushi"),
  nome("condor-dive", "Condor Dive", "Condor Dive"),
  nome("phantom-shoot", "Phantom Shot", "Phantom Shoot"),
  nome("psycho-shot", "Psycho Shot", "Psycho Shot"),
  nome("dynamite-shoot", "Dynamite Shot", "Dynamite Shoot"),
  nome("tarzan-kick", "Tarzan Kick", "Tarzan Kick"),
  nome("meteor-attack", "Meteor Attack", "Meteor Attack"),
  nome("hyakuretsu-shot", "Wrath Shot", "Hyakuretsu Shot"),
  nome("cross-drive", "Cross Drive", "Cross Drive"),
  nome("kung-fu-head", "Kung Fu Header", "Kung Fu Head"),
  nome("patriot-shoot", "Patriot Shot", "Patriot Shoot"),
  nome("hawk-shot", "Hawk Shot", "Hawk Shot"),
  nome("dark-tornado", "Dark Tornado", "Dark Tornado"),
  nome("dokonjou-bat", "Utter Gutsiness Bat", "Dokonjou Bat"),
  nome("tsuchi-daruma", "Dirt Ball", "Tsuchi Daruma"),
  nome("freeze-shot", "Freeze Shot", "Freeze Shot"),
  nome("run-ball-run", "Run Ball Run", "Run Ball Run"),
  nome("corodra-shoot", "Baby Corodragon", "Corodra Shoot"),
  nome("shine-drive", "Shine Drive", "Shine Drive"),
  nome("twin-boost", "Twin Boost", "Twin Boost"),
  nome("inazuma-break", "Inazuma Break", "Inazuma Break"),
  nome("inazuma-1gou", "Inazuma-1", "Inazuma Ichigou"),
  nome("bunshin-shoot", "Clone Shot", "Bunshin Shoot"),
  nome("dragon-tornado", "Dragon Tornado", "Dragon Tornado"),
  nome("divine-arrow", "Divine Arrows", "Divine Arrow"),
  nome("koutei-penguin-2gou", "Emperor Penguin No. 2", "Koutei Penguin Nigou"),
  nome("honoo-no-kazamidori", "Fire Rooster", "Honoo no Kazamidori"),
  nome("triangle-z", "Triangle Z", "Triangle Z"),
  nome("reflect-buster", "Reflect Buster", "Reflect Buster"),
  nome("the-galaxy", "The Galaxy", "The Galaxy"),
  nome("bakunetsu-screw", "Fireball Screw", "Bakunetsu Screw"),

  // DRIBLES
  nome("dash-accel", "Dash Accelerator", "Dash Accel"),
  nome("tamanori-pierrot", "Rodeo Clown", "Tamanori Pierrot"),
  nome("tatsumaki-senpuu", "Whirlwind Twister", "Tatsumaki Senpuu"),
  nome("noroi", "Black Magic", "Noroi"),
  nome("monkey-turn", "Monkey Turn", "Monkey Turn"),
  nome("dokugiri-no-jutsu", "Poison Fog", "Dokugiri no Jutsu"),
  nome("magic", "Magic", "Magic"),
  nome("moonsault", "Moonsault", "Moonsault"),
  nome("super-scan", "Attack Scan", "Super Scan"),
  nome("judge-through", "Foul Offence", "Judge Through"),
  nome("super-armadillo", "Super Armadillo", "Super Armadillo"),
  nome("zigzag-spark", "Zigzag Spark", "Zigzag Spark"),
  nome("heat-tackle", "Scorching Tackle", "Heat Tackle"),
  nome("gorimuchuu", "Bewildered", "Gorimuchuu"),
  nome("zanzou", "Afterimage", "Zanzou"),
  nome("kamaitachi", "Whirlwind Cut", "Kamaitachi"),
  nome("mogura-feint", "Mole Fake", "Mogura Feint"),
  nome("bunshin-feint", "Clone Faker", "Bunshin Feint"),
  nome("dash-storm", "Dash Storm", "Dash Storm"),
  nome("jigoku-guruma", "Rolling Hell", "Jigoku Guruma"),
  nome("boost-glider", "Boost Glider", "Boost Glider"),

  // DEFESAS DE GOLEIRO
  nome("black-hole", "Black Hole", "Black Hole"),
  nome("swan-dive", "Swan Dive", "Swan Dive"),
  nome("killer-blade", "Killer Blade", "Killer Blade"),

  // BLOQUEIOS
  nome("toughness-block", "Toughness Block", "Toughness Block"),

  // DEFESAS DE GOLEIRO
  nome("tornado-catch", "Tornado Catch", "Tornado Catch"),
  nome("yugamu-kuukan", "Warp Space", "Yugamu Kuukan"),
  nome("pressure-punch", "Pressure Punch", "Pressure Punch"),
  nome("makiwari-chop", "Wood Chopper", "Makiwari Chop"),
  nome("wormhole", "Wormhole", "Wormhole"),
  nome("ice-block", "Ice Block", "Ice Block"),
  nome("drill-smasher", "Drill Smasher", "Drill Smasher"),
  nome("procyon-net", "Procyon Net", "Procyon Net"),
  nome("burnout", "Burnout", "Burnout"),
  nome("jikuu-no-kabe", "Temporal Wall", "Jikuu no Kabe"),
  nome("kogarashi", "Mistral", "Kogarashi"),

  // BLOQUEIOS
  nome("power-shield", "Power Shield", "Power Shield"),

  // DEFESAS DE GOLEIRO
  nome("wild-claw", "Wild Claw", "Wild Claw"),
  nome("rocket-kobushi", "Rocket Kobushi", "Rocket Kobushi"),
  nome("hanafubuki", "Flower Power", "Hanafubuki"),
  nome("shoot-pocket", "Shot Pocket", "Shoot Pocket"),
  nome("nekketsu-head", "Fireball Head", "Nekketsu Head"),
  nome("tsumuji", "Whirlwind", "Tsumuji"),
  nome("slash-nail", "Claw Slash", "Slash Nail"),

  // BLOQUEIOS
  nome("full-power-shield", "Full Power Shield", "Full Power Shield"),

  // DEFESAS DE GOLEIRO
  nome("goal-zurashi", "Sliding Goal", "Goal Zurashi"),
  nome("aurora-curtain", "Aurora Curtain", "Aurora Curtain"),
  nome("bakuretsu-punch", "Blazing Knuckle", "Bakuretsu Punch"),
  nome("dokonjou-catch", "Utter Gutsiness Catch", "Dokonjou Catch"),
  nome("safety-protect", "Safety First", "Safety Protect"),
  nome("kaenhousha", "Flame Breath", "Kaenhousha"),
  nome("chabudai-gaeshi", "Table-Turner", "Chabudai Gaeshi"),

  // BLOQUEIOS
  nome("tsunami-wall", "Tsunami Wall", "Tsunami Wall"),

  // DEFESAS DE GOLEIRO
  nome("counterstrike", "Counter Strike", "Counterstrike"),
  nome("dual-smash", "Dual Smash", "Dual Smash"),
  nome("double-rocket", "Double Rocket", "Double Rocket"),

  // BLOQUEIOS
  nome("bunshin-block", "Clone Block", "Bunshin Block"),
  nome("gigant-wall", "Gigant Wall", "Gigant Wall"),
  nome("triple-defense", "Triple Defence", "Triple Defense"),

  // DEFESAS DE GOLEIRO
  nome("seigi-no-tekken", "Fist of Justice", "Seigi no Tekken"),
  nome("mugen-the-hand", "Mugen the Hand", "Mugen The Hand"),
  nome("god-hand-triple", "Triple God Hand", "God Hand Triple"),
  nome("beast-fang", "Beast Fang", "Beast Fang"),

  // CHUTES
  nome("astro-break", "Astro Break", "Astro Break"),
  nome("gungnir", "Gungnir", "Gungnir"),
  nome("tiger-drive", "Tiger Drive", "Tiger Drive"),
  nome("atomic-flare", "Atomic Flare", "Atomic Flare"),
  nome("gaia-break", "Gaia Break", "Gaia Break"),
  nome("northern-impact", "Northern Impact", "Northern Impact"),
  nome("odin-sword", "Odin Sword", "Odin Sword"),
  nome("back-tornado", "Back Tornado", "Back Tornado"),
  nome("double-grenade", "Double Grenade", "Double Grenade"),
  nome("fire-blizzard", "Fire Blizzard", "Fire Blizzard"),
  nome("space-penguin", "Space Penguin", "Space Penguin"),
  nome("supernova", "Supernova", "Supernova"),
  nome("eternal-blizzard", "Eternal Blizzard", "Eternal Blizzard"),
  nome("gladius-arch", "Gladius Arch", "Gladius Arch"),
  nome("assault-shoot", "Assault Shot", "Assault Shoot"),
  nome("security-shot", "Security Shot", "Security Shot"),
  nome("tsuutenkaku-shoot", "Steeple Shot", "Tsuutenkaku Shoot"),
  nome("nihyakuretsu-shot", "Double Wrath Shot", "Nihyakuretsu Shot"),
  nome("dragon-cannon", "Dragon Cannon", "Dragon Cannon"),
  nome("megaton-head", "Megaton Head", "Megaton Head"),
  nome("dual-strike", "Dual Strike", "Dual Strike"),
  nome("tsunami-boost", "Tsunami Boost", "Tsunami Boost"),
  nome("butterfly-dream", "Butterfly Trance", "Butterfly Dream"),
  nome("revolution-v", "Revolution V", "Revolution V"),
  nome("wyvern-crash", "Wyvern Crash", "Wyvern Crash"),
  nome("double-tornado", "Double Tornado", "Double Tornado"),
  nome("eagle-buster", "Eagle Buster", "Eagle Buster"),
  nome("koutei-penguin-1gou", "Emperor Penguin No. 1", "Koutei Penguin 1gou"),
  nome("wolf-legend", "Legendary Wolf", "Wolf Legend"),
  nome("tri-pegasus", "Tri-Pegasus", "Tri-Pegasus"),
  nome("twin-boost-f", "Twin Boost F", "Twin Boost F"),
  nome("wyvern-blizzard", "Wyvern Blizzard", "Wyvern Blizzard"),
  nome("death-zone-2", "Death Zone 2", "Death Zone 2"),
  nome("god-break", "God Break", "God Break"),
  nome("triple-boost", "Triple Boost", "Triple Boost"),
  nome("dark-phoenix", "Dark Phoenix", "Dark Phoenix"),
  nome("inazuma-1gou-otoshi", "Inazuma-1 Drop", "Inazuma 1gou Otoshi"),
  nome("neo-galaxy", "Neo Galaxy", "Neo Galaxy"),
  nome("crossfire", "Cross Fire", "Crossfire"),
  nome("the-earth", "The Earth", "The Earth"),
  nome("megalodon", "Megalodon", "Megalodon"),
  nome("the-typhoon", "The Typhoon", "The Typhoon"),
  nome("thunder-beast", "Thunder Beast", "Thunder Beast"),
  nome("tatsumaki-otoshi", "Whirlwind Drop", "Tatsumaki Otoshi"),
  nome("the-birth", "The Dawn", "The Birth"),
  nome("the-hurricane", "The Hurricane", "The Hurricane"),
  nome("prime-legend", "Prime Legend", "Prime Legend"),
  nome("excalibur", "Excalibur", "Excalibur"),
  nome("rose-splash", "Bed of Roses", "Rose Splash"),
  nome("tkachev-bomber", "Acrobat Bomber", "Tkachev Bomber"),
  nome("card-buster", "Sweet Deal", "Card Buster"),
  nome("mirage-shoot", "Mirage Shot", "Mirage Shoot"),
  nome("death-spear", "Doom Spear", "Death Spear"),
  nome("astro-gate", "Astro Gate", "Astro Gate"),
  nome("pegasus-shot", "Pegasus Shot", "Pegasus Shot"),
  nome("universe-blast", "Cosmic Blast", "Universe Blast"),
  nome("dragon-slayer", "Dragon Slayer", "Dragon Slayer"),
  nome("dark-matter", "Dark Matter", "Dark Matter"),
  nome("bunshin-penguin", "Clone Penguin", "Bunshin Penguin"),
  nome("bunshin-death-zone", "Clone Death Zone", "Bunshin Death Zone"),
  nome("gran-fenrir", "Grand Fenrir", "Gran Fenrir"),
  nome("koutei-penguin-3gou", "Emperor Penguin No. 3", "Koutei Penguin 3gou"),
  nome("chaos-break", "Chaos Break", "Chaos Break"),
  nome("shadow-ray", "Shadow Ray", "Shadow Ray"),
  nome("abisegeri", "Heel Kick", "Abisegeri"),
  nome("rc-shoot", "RC Shot", "RC Shoot"),
  nome("gunshot", "Gunshot", "Gunshot"),
  nome("bakunetsu-storm", "Fireball Storm", "Bakunetsu Storm"),
  nome("hellfire", "Hellfire", "Hellfire"),
  nome("ryuusei-blade", "Meteor Blade", "Ryuusei Blade"),
  nome("death-rain", "Doom Rain", "Death Rain"),
  nome("tenkuu-otoshi", "Celestial Smash", "Tenkuu Otoshi"),
  nome("koutei-penguin-x", "Emperor Penguin X", "Koutei Penguin X"),
  nome("tiger-storm", "Tiger Storm", "Tiger Storm"),
  nome("double-jaw", "Double Jaw", "Double Jaw"),
  nome("maximum-fire", "Maximum Fire", "Maximum Fire"),
  nome("grand-fire", "Grand Fire", "Grand Fire"),
  nome("x-blast", "X Blast", "X Blast"),
  nome("big-bang", "Big Bang", "Big Bang"),
  nome("kurukuru-head", "Gyro Head", "Kurukuru Head"),

  // DRIBLES
  nome("ribbon-shower", "Ribbon Shower", "Ribbon Shower"),
  nome("aurora-dribble", "Aurora Dribble", "Aurora Dribble"),
  nome("oouchiwa", "Big Fan", "Oouchiwa"),
  nome("big-card", "Card Slap", "Big Card"),
  nome("aikidou", "Aikido", "Aikidou"),
  nome("water-veil", "Water Veil", "Water Veil"),
  nome("fuujin-no-mai", "Wind God's Dance", "Fuujin no Mai"),
  nome("angel-ball", "Angel Ball", "Angel Ball"),
  nome("air-ride", "Air Ride", "Air Ride"),
  nome("warp-drive", "Warp Drive", "Warp Drive"),
  nome("tatsumaki-dokugiri", "Dark Whirlwind", "Tatsumaki Dokugiri"),
  nome("maboroshi-dribble", "Deceptor Dribble", "Maboroshi Dribble"),
  nome("ultra-moon", "Ultra Moon", "Ultra Moon"),
  nome("echo-ball", "Echo Ball", "Echo Ball"),
  nome("matador-feint", "Matador Feint", "Matador Feint"),
  nome("southern-crosscut", "Southern Cross", "Southern Crosscut"),
  nome("dual-pass", "Dual Pass", "Dual Pass"),
  nome("devil-ball", "Devil Ball", "Devil Ball"),
  nome("killer-fields", "Field of Force", "Killer Fields"),
  nome("hitori-one-two", "Double Touch", "Hitori One-Two"),
  nome("fuusengamu", "Bubble Gum", "Fuusengamu"),
  nome("naraku-otoshi", "Heel Drop", "Naraku Otoshi"),
  nome("dog-run", "Dog Run", "Dog Run"),
  nome("meteor-shower", "Meteor Shower", "Meteor Shower"),
  nome("reppuu-dash", "Gale Dash", "Reppuu Dash"),
  nome("liar-shoot", "Liar Shot", "Liar Shoot"),
  nome("armadillo-circus", "Armadillo Circus", "Armadillo Circus"),
  nome("lightning-accel", "Lightning Bolt", "Lightning Accel"),
  nome("judge-through-2", "Foul Offence 2", "Judge Through 2"),
  nome("the-icarus", "The Ikaros", "The Icarus"),
  nome("judge-through-3", "Foul Offence 3", "Judge Through 3"),
  nome("kangaroo-kick", "Kangaroo Kick", "Kangaroo Kick"),
  nome("scissors-bomb", "Bewilder Blast", "Scissors Bomb"),
  nome("prima-donna", "Prima Donna", "Prima Donna"),
  nome("toumei-feint", "Invisible Fake", "Toumei Feint"),
  nome("mogura-shuffle", "Mole Shuffle", "Mogura Shuffle"),
  nome("u-boat", "Sub-Terfuge", "U-Boat"),
  nome("ninin-sankyaku", "Three-Legged Rush", "Ninin Sankyaku"),
  nome("super-elastic", "Super Elastico", "Super Elastic"),
  nome("triple-dash", "Triple Dash", "Triple Dash"),

  // BLOQUEIOS
  nome("coil-turn", "Coil Turn", "Coil Turn"),
  nome("bull-attack", "Bull Attack", "Bull Attack"),
  nome("ice-ground", "Land of Ice", "Ice Ground"),
  nome("spinning-cut", "Spinning Cut", "Spinning Cut"),
  nome("desert-storm", "Desert Blast", "Desert Storm"),
  nome("cyclone", "Cyclone", "Cyclone"),
  nome("profile-zone", "Perimeter Zone", "Profile Zone"),
  nome("senpuujin", "Whirlwind Force", "Senpuujin"),
  nome("shinkuuma", "Vac Attack", "Shinkuuma"),
  nome("snow-angel", "Snow Angel", "Snow Angel"),
  nome("double-cyclone", "Double Cyclone", "Double Cyclone"),
  nome("whale-guard", "Whale Guard", "Whale Guard"),
  nome("frozen-steal", "Frozen Steal", "Frozen Steal"),
  nome("go-to-heaven", "Dawnrise", "Go To Heaven"),
  nome("hurricane-arrow", "Hurricane Arrows", "Hurricane Arrow"),
  nome("perfect-tower", "Perfect Tower", "Perfect Tower"),
  nome("quick-draw", "Quick Draw", "Quick Draw"),
  nome("doppelganger", "Doppelganger", "Doppelganger"),
  nome("onryou", "Ghost Pull", "Onryou"),
  nome("killer-slide", "Killer Slide", "Killer Slide"),
  nome("fake-ball", "Fake Ball", "Fake Ball"),
  nome("kumo-no-ito", "Spider Web", "Kumo no Ito"),
  nome("welcome-back", "Yo-Yo Ball", "Welcome Back"),
  nome("good-smell", "Sleeping Dust", "Good Smell"),
  nome("bunshin-defense", "Clone Defence", "Bunshin Defense"),
  nome("sneaking-raid", "Am-Bush", "Sneaking Raid"),
  nome("asteroid-belt", "Asteroid Belt", "Asteroid Belt"),
  nome("dual-storm", "Dual Storm", "Dual Storm"),
  nome("harvest", "Harvest", "Harvest"),
  nome("demon-cut", "Diabolical Cut", "Demon Cut"),
  nome("rock-wall-dam", "Stone Wall", "Rock Wall Dam"),
  nome("go-to-hell", "Duskfall", "Go To Hell"),
  nome("sigma-zone", "Sigma Zone", "Sigma Zone"),
  nome("giant-spin", "Supreme Spin", "Giant Spin"),
  nome("photon-flash", "Photon Crash", "Photon Flash"),
  nome("super-shikofumi", "Super Sumo Stomp", "Super Shikofumi"),
  nome("fake-bomber", "Fake Bomber", "Fake Bomber"),
  nome("zigzag-flame", "Zigzag Flame", "Zigzag Flame"),
  nome("flame-dance", "Flame Dance", "Flame Dance"),
  nome("volcano-cut", "Volcano Cut", "Volcano Cut"),
  nome("rolling-slide", "Rolling Slide", "Rolling Slide"),
  nome("sabaki-no-tettsui", "Divine Stamp", "Sabaki no Tettsui"),
  nome("shooting-star", "Shooting Star", "Shooting Star"),
  nome("planet-shield", "Planet Shield", "Planet Shield"),
  nome("ignite-steal", "Ignited Steal", "Ignite Steal"),
  nome("mad-express", "Mad Express", "Mad Express"),
  nome("shikofumi", "Sumo Stomp", "Shikofumi"),
  nome("horn-train", "Horn Train", "Horn Train"),
  nome("ushiro-no-shoumen", "About Face", "Ushiro no Shoumen"),
  nome("earthquake", "Earthquake", "Earthquake"),
  nome("power-charge", "Power Charge", "Power Charge"),
  nome("gravitation", "Gravitation", "Gravitation"),
  nome("stone-prison", "Stone Prison", "Stone Prison"),
  nome("heavy-baby", "Heavy Mettle", "Heavy Baby"),
  nome("iron-wall", "Iron Wall", "Iron Wall"),

  // DEFESAS DE GOLEIRO
  nome("galatyn", "Galatyn", "Galatyn"),
  nome("great-barrier-reef", "Barrier Reef", "Great Barrier Reef"),
  nome("storm-rider", "Storm Rider", "Storm Rider"),
  nome("needle-hammer", "Needle Hammer", "Needle Hammer"),
  nome("electrap", "Electric Trap", "Electrap"),
  nome("high-voltage", "High Voltage", "High Voltage"),
  nome("horizon", "Horizon", "Horizon"),
  nome("stinger", "The Stinger", "Stinger"),
  nome("big-spider", "Giant Spider", "Big Spider"),
  nome("ijigen-the-hand", "Dimensional Hand", "Ijigen The Hand"),
  nome("the-end", "The End", "The End"),
  nome("maou-the-hand", "Fiend Hand", "Maou The Hand"),
  nome("shootrap", "Shot Trap", "Shootrap"),
  nome("god-hand-x", "God Hand X", "God Hand X"),
  nome("million-hands", "Million Hands", "Million Hands"),
  nome("tamashii-the-hand", "Soul Hand", "Tamashii The Hand"),
  nome("card-protect", "Card Protector", "Card Protect"),
  nome("colosseo-guard", "Colosseum Guard", "Colosseo Guard"),
  nome("ikari-no-tettsui", "Hammer of Fury", "Ikari no Tettsui"),
  nome("capoeira-snatch", "Capoeira Grab", "Capoeira Snatch"),
  nome("flash-upper", "Flash Upper", "Flash Upper"),
  nome("god-catch", "God Catch", "God Catch"),
  nome("omega-the-hand", "Omega Hand", "Omega The Hand"),
  nome("dai-bakuhatsu-harite", "Nitro Slap", "Dai Bakuhatsu Harite"),
  nome("ouke-no-tate", "Lunar Eclipse", "Ouke no Tate")
];