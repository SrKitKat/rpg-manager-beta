import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";

import {
  fileURLToPath,
  pathToFileURL
} from "node:url";


/* ========================================
   RPG MANAGER
   MIGRAÇÃO HISSATSU 903 — V2

   CORREÇÕES IMPORTANTES

   - aceita entradas oficiais "???";
   - não inventa nomes para técnicas ocultas;
   - nomes repetidos são permitidos;
   - IDs continuam obrigatoriamente únicos;
   - categorias vêm da LEVEL-5;
   - inglês/japonês visíveis vêm da LEVEL-5;
   - imagens antigas aprovadas são preservadas;
   - imagens automáticas ficam C / revisar;
   - banco atual só é substituído se
     toda a estrutura 903 for validada.
======================================== */


const __filename =
  fileURLToPath(
    import.meta.url
  );


const __dirname =
  path.dirname(
    __filename
  );


const ROOT =
  path.resolve(
    __dirname,
    ".."
  );


const SRC =
  path.join(
    ROOT,
    "src"
  );


const PUBLIC =
  path.join(
    ROOT,
    "public"
  );


const DADOS =
  path.join(
    ROOT,
    "dados",
    "migracao-hissatsu-903"
  );


const DIR_IMAGENS =
  path.join(
    PUBLIC,
    "assets",
    "hissatsu",
    "catalogo903"
  );


const ARQUIVO_BANCO_ATUAL =
  path.join(
    SRC,
    "features",
    "habilidades",
    "data",
    "bancoHissatsuSuperOnze.js"
  );


const ARQUIVO_BACKUP =
  path.join(
    SRC,
    "features",
    "habilidades",
    "data",
    "legacy",
    "bancoHissatsuSuperOnze.pre903.js"
  );


const ARQUIVO_CATALOGO =
  path.join(
    SRC,
    "bancoHissatsuCatalogoOficial903.js"
  );


const ARQUIVO_AUDITORIA =
  path.join(
    ROOT,
    "auditarBancoHissatsu903.mjs"
  );


const ARQUIVO_RELATORIO =
  path.join(
    DADOS,
    "RELATORIO_MIGRACAO_903.json"
  );


const ARQUIVO_SNAPSHOT =
  path.join(
    DADOS,
    "BANCO_ANTES_DA_MIGRACAO.json"
  );


const ARQUIVO_CACHE_FANDOM =
  path.join(
    DADOS,
    "CACHE_IMAGENS_FANDOM.json"
  );


const ARQUIVO_PLACEHOLDER =
  path.join(
    DIR_IMAGENS,
    "_pendente.svg"
  );


const ARQUIVO_SEGREDO =
  path.join(
    DIR_IMAGENS,
    "_segredo-oficial.svg"
  );


/* ========================================
   FONTES
======================================== */


const SITE_OFICIAL_EN =
  "https://zukan.inazuma.jp/en/skill/";


const SITE_OFICIAL_JP =
  "https://zukan.inazuma.jp/skill/";


const FANDOM_API =
  "https://inazuma-eleven.fandom.com/api.php";


const TOTAL_ESPERADO =
  903;


/* ========================================
   CATEGORIAS OFICIAIS
======================================== */


const CATEGORIAS = [

  {
    chave:
      "shot",

    tipo:
      "chute",

    oficialEn:
      "Shot",

    oficialJp:
      "シュート",

    marcadorEn:
      "Shot",

    marcadorJp:
      "シュート",

    esperado:
      369,

    q:
      "hN2cnouamJCNhqCZlpOLmo3dxaTOooI="
  },


  {
    chave:
      "offence",

    tipo:
      "drible",

    oficialEn:
      "Offence",

    oficialJp:
      "オフェンス",

    marcadorEn:
      "Offence",

    marcadorJp:
      "オフェンス",

    esperado:
      167,

    q:
      "hN2cnouamJCNhqCZlpOLmo3dxaTNooI="
  },


  {
    chave:
      "defence",

    tipo:
      "bloqueio",

    oficialEn:
      "Defence",

    oficialJp:
      "ディフェンス",

    marcadorEn:
      "Defence",

    marcadorJp:
      "ディフェンス",

    esperado:
      176,

    q:
      "hN2cnouamJCNhqCZlpOLmo3dxaTMooI="
  },


  {
    chave:
      "goalkeep",

    tipo:
      "defesa_goleiro",

    oficialEn:
      "Goalkeep",

    oficialJp:
      "キーパー",

    marcadorEn:
      "Success",

    marcadorJp:
      "成功",

    esperado:
      191,

    q:
      "hN2cnouamJCNhqCZlpOLmo3dxaTLooI="
  }

];


/* ========================================
   AMOSTRAS DE SEGURANÇA
======================================== */


const AMOSTRAS_OFICIAIS = {

  shot: [
    "Fire Tornado",
    "Inazuma Drop",
    "Dragon Crash"
  ],

  offence: [
    "Flurry Dash",
    "Illusory Ball"
  ],

  defence: [
    "The Wall",
    "Blade Attack"
  ],

  goalkeep: [
    "God Hand",
    "Fireball Knuckle",
    "Power Shield"
  ]

};


/* ========================================
   AMOSTRAS EN ↔ JP
======================================== */


const AMOSTRAS_PAREAMENTO = {

  shot: {

    "Fire Tornado":
      "ファイアトルネード",

    "Dragon Crash":
      "ドラゴンクラッシュ"

  },


  offence: {

    "Illusory Ball":
      "イリュージョンボール"

  },


  defence: {

    "The Wall":
      "ザ・ウォール",

    "Blade Attack":
      "ブレードアタック"

  },


  goalkeep: {

    "God Hand":
      "ゴッドハンド",

    "Power Shield":
      "パワーシールド",

    "Fireball Knuckle":
      "熱血パンチ"

  }

};


/* ========================================
   CURADORIA HUMANA RECUPERADA
======================================== */


const CURADORIA_A =
  new Set([

    "majin-the-hand",
    "shippuu-dash",
    "spinning-shoot"

  ]);


const CURADORIA_B =
  new Set([

    "bakunetsu-screw",
    "bakuretsu-punch",
    "beast-fang",
    "black-hole",
    "bunshin-feint",
    "bunshin-shoot",
    "burnout",
    "condor-dive",
    "dark-tornado",
    "dash-storm",
    "death-zone",
    "dokonjou-bat",
    "double-rocket",
    "dragon-crash",
    "dragon-tornado",
    "drill-smasher",
    "dual-smash",
    "fire-tornado",
    "freeze-shot",
    "full-power-shield",
    "god-hand",
    "god-knows",
    "gorimuchuu",
    "grenade-shot",
    "hanafubuki",
    "heat-tackle",
    "hyakuretsu-shot",
    "illusion-ball",
    "inazuma-1gou",
    "inazuma-break",
    "inazuma-otoshi",
    "koutei-penguin-2gou",
    "kung-fu-head",
    "makiwari-chop",
    "monkey-turn",
    "moonsault",
    "mugen-no-kabe",
    "mugen-the-hand",
    "nekketsu-punch",
    "phantom-shoot",
    "procyon-net",
    "reflect-buster",
    "rocket-kobushi",
    "rolling-kick",
    "safety-protect",
    "seigi-no-tekken",
    "shine-drive",
    "shoot-pocket",
    "spiral-shot",
    "super-armadillo",
    "tarzan-kick",
    "tatsumaki-senpuu",
    "the-phoenix",
    "the-tower",
    "the-wall",
    "triple-defense",
    "tsuchi-daruma",
    "wormhole",
    "yugamu-kuukan",
    "zigzag-spark"

  ]);


const CURADORIA_D =
  new Set([

    "divine-arrow",
    "gigant-wall",
    "power-shield"

  ]);


const CANDIDATOS_REJEITADOS = {

  "divine-arrow": [

    "File:(IE) Divine Arrow 1.png",
    "File:(IE) Divine Arrow 2.png"

  ],


  "gigant-wall": [

    "File:(IE) Gigant Wall 1.png",
    "File:(IE) Gigant Wall 2.png"

  ],


  "power-shield": [

    "File:(IE) Power Shield 2.png"

  ]

};


/* ========================================
   UTILITÁRIOS
======================================== */


function texto(
  valor
) {

  return String(
    valor ??
    ""
  ).trim();

}


function lista(
  valor
) {

  return Array.isArray(
    valor
  )
    ? valor
    : [];

}


function objeto(
  valor
) {

  return (
    valor &&
    typeof valor ===
      "object" &&
    !Array.isArray(
      valor
    )
  )
    ? valor
    : {};

}


function dormir(
  ms
) {

  return new Promise(
    resolve =>
      setTimeout(
        resolve,
        ms
      )
  );

}


/* ========================================
   NORMALIZAÇÃO
======================================== */


function normalizar(
  valor
) {

  return texto(
    valor
  )

    .normalize(
      "NFD"
    )

    .replace(
      /[\u0300-\u036f]/g,
      ""
    )

    .toLocaleLowerCase(
      "pt-BR"
    )

    .replace(
      /[’'´`]/g,
      ""
    )

    .replace(
      /&/g,
      " and "
    )

    .replace(
      /[^a-z0-9\u3040-\u30ff\u3400-\u9fff々ー]+/g,
      " "
    )

    .replace(
      /\s+/g,
      " "
    )

    .trim();

}


/* ========================================
   SLUG
======================================== */


function slug(
  valor
) {

  const base =
    texto(
      valor
    )

      .normalize(
        "NFD"
      )

      .replace(
        /[\u0300-\u036f]/g,
        ""
      )

      .toLowerCase()

      .replace(
        /&/g,
        " and "
      )

      .replace(
        /[^a-z0-9]+/g,
        "-"
      )

      .replace(
        /^-+|-+$/g,
        ""
      )

      .replace(
        /-+/g,
        "-"
      );


  return (
    base ||
    "hissatsu"
  );

}


/* ========================================
   VALORES ÚNICOS
======================================== */


function unicos(
  ...valores
) {

  const vistos =
    new Set();


  const resultado =
    [];


  for (
    const valor of
    valores.flat(
      Infinity
    )
  ) {

    const pronto =
      texto(
        valor
      );


    if (!pronto) {
      continue;
    }


    const chave =
      normalizar(
        pronto
      );


    if (
      !chave ||
      vistos.has(
        chave
      )
    ) {
      continue;
    }


    vistos.add(
      chave
    );


    resultado.push(
      pronto
    );

  }


  return resultado;

}


/* ========================================
   HTML ENTITIES
======================================== */


function decodeHtml(
  valor
) {

  const mapa = {

    amp:
      "&",

    quot:
      '"',

    apos:
      "'",

    lt:
      "<",

    gt:
      ">",

    nbsp:
      " ",

    ndash:
      "–",

    mdash:
      "—",

    hellip:
      "…"

  };


  return texto(
    valor
  ).replace(

    /&(#x?[0-9a-f]+|[a-z]+);/gi,

    (
      completo,
      entidade
    ) => {

      const e =
        String(
          entidade
        );


      if (
        e[0] ===
        "#"
      ) {

        const hex =
          e[1]
            ?.toLowerCase() ===
          "x";


        const numero =
          parseInt(

            e.slice(
              hex
                ? 2
                : 1
            ),

            hex
              ? 16
              : 10

          );


        return Number.isFinite(
          numero
        )
          ? String.fromCodePoint(
              numero
            )
          : completo;

      }


      return (
        mapa[
          e.toLowerCase()
        ] ??
        completo
      );

    }

  );

}


/* ========================================
   DIRETÓRIOS / JSON
======================================== */


async function garantirDiretorios() {

  await fsp.mkdir(
    DADOS,
    {
      recursive:
        true
    }
  );


  await fsp.mkdir(
    DIR_IMAGENS,
    {
      recursive:
        true
    }
  );

}


async function salvarJson(
  arquivo,
  dados
) {

  await fsp.writeFile(

    arquivo,

    JSON.stringify(
      dados,
      null,
      2
    ) +
      "\n",

    "utf8"

  );

}


/* ========================================
   FETCH
======================================== */


async function fetchComRetry(
  url,
  opcoes = {},
  tentativas = 3
) {

  let ultimoErro =
    null;


  for (
    let tentativa = 1;
    tentativa <= tentativas;
    tentativa += 1
  ) {

    const controller =
      new AbortController();


    const timer =
      setTimeout(
        () =>
          controller.abort(),
        25000
      );


    try {

      const resposta =
        await fetch(
          url,
          {

            ...opcoes,

            signal:
              controller.signal,

            headers: {

              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151 Safari/537.36",

              "Accept-Language":
                "en-US,en;q=0.9,ja;q=0.8",

              ...(
                opcoes.headers ||
                {}
              )

            }

          }
        );


      clearTimeout(
        timer
      );


      if (
        !resposta.ok
      ) {

        throw new Error(
          "HTTP " +
          resposta.status +
          " em " +
          url
        );

      }


      return resposta;

    } catch (
      erro
    ) {

      clearTimeout(
        timer
      );


      ultimoErro =
        erro;


      if (
        tentativa <
        tentativas
      ) {

        await dormir(
          700 *
          tentativa
        );

      }

    }

  }


  throw (
    ultimoErro ||
    new Error(
      "Falha de rede em " +
      url
    )
  );

}


/* ========================================
   PARSER HTML
======================================== */


function limparFragmentoHtml(
  fragmento
) {

  let conteudo =
    String(
      fragmento ||
      ""
    );


  /*
    Remove apenas furigana auxiliar.

    Mantém o japonês principal.
  */

  conteudo =
    conteudo

      .replace(
        /<rt\b[^>]*>[\s\S]*?<\/rt>/gi,
        ""
      )

      .replace(
        /<\/?(?:ruby|rb|rp)\b[^>]*>/gi,
        ""
      )

      .replace(
        /<br\b[^>]*>/gi,
        " "
      )

      .replace(
        /<[^>]+>/g,
        " "
      );


  conteudo =
    decodeHtml(
      conteudo
    )

      .replace(
        /\s+/g,
        " "
      )

      .trim();


  /*
    Corrige:
    竜巻 落とし
    =>
    竜巻落とし
  */

  conteudo =
    conteudo.replace(

      /([\u3040-\u30ff\u3400-\u9fff々ー])\s+(?=[\u3040-\u30ff\u3400-\u9fff々ー])/g,

      "$1"

    );


  return conteudo;

}


/* ========================================
   HTML -> LINHAS
======================================== */


function htmlParaLinhas(
  html,
  idioma
) {

  let conteudo =
    String(
      html ||
      ""
    );


  conteudo =
    conteudo

      .replace(
        /<!--[\s\S]*?-->/g,
        " "
      )

      .replace(
        /<script\b[\s\S]*?<\/script>/gi,
        " "
      )

      .replace(
        /<style\b[\s\S]*?<\/style>/gi,
        " "
      )

      .replace(
        /<noscript\b[\s\S]*?<\/noscript>/gi,
        " "
      )

      .replace(
        /<svg\b[\s\S]*?<\/svg>/gi,
        " "
      );


  /*
    Consolida títulos antes da limpeza
    genérica para proteger <ruby>.
  */

  conteudo =
    conteudo.replace(

      /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi,

      (
        _completo,
        _nivel,
        interior
      ) => {

        const titulo =
          limparFragmentoHtml(
            interior
          );


        return titulo
          ? `\n${titulo}\n`
          : "\n";

      }

    );


  conteudo =
    conteudo

      .replace(
        /<rt\b[^>]*>[\s\S]*?<\/rt>/gi,
        ""
      )

      .replace(
        /<\/?(?:ruby|rb|rp)\b[^>]*>/gi,
        ""
      );


  /*
    Goalkeep usa Success / Failure.
    Secret usa Image.
  */

  conteudo =
    conteudo.replace(

      /<img\b[^>]*\balt\s*=\s*(["'])(.*?)\1[^>]*>/gi,

      "\n$2\n"

    );


  conteudo =
    conteudo

      .replace(
        /<(?:br|hr)\b[^>]*>/gi,
        "\n"
      )

      .replace(
        /<\/(?:li|p|div|section|article|dd|dt|ul|ol|button|label|option|tr|td|th)>/gi,
        "\n"
      )

      .replace(
        /<[^>]+>/g,
        " "
      );


  conteudo =
    decodeHtml(
      conteudo
    );


  const marcador =
    idioma ===
    "jp"
      ? "検索結果"
      : "Search Results";


  const pos =
    conteudo.indexOf(
      marcador
    );


  if (
    pos >= 0
  ) {

    conteudo =
      conteudo.slice(
        pos
      );

  }


  return conteudo

    .split(
      /\r?\n/
    )

    .map(
      item => {

        let linha =
          item

            .replace(
              /\s+/g,
              " "
            )

            .trim();


        if (
          idioma ===
          "jp"
        ) {

          linha =
            linha.replace(

              /([\u3040-\u30ff\u3400-\u9fff々ー])\s+(?=[\u3040-\u30ff\u3400-\u9fff々ー])/g,

              "$1"

            );

        }


        return linha;

      }
    )

    .filter(
      Boolean
    );

}


/* ========================================
   RUÍDOS
======================================== */


const RUIDOS_EN =
  new Set([

    "search results:",
    "display amount:",
    "special move",
    "name:",
    "search",
    "advanced search",
    "select",
    "image",
    "failure",
    "shot block",
    "<<",
    ">>"

  ]);


const RUIDOS_JP =
  new Set([

    "検索結果：",
    "検索結果:",
    "表示件数：",
    "表示件数:",
    "必殺技",
    "名前：",
    "名前:",
    "検索",
    "詳細な条件から検索",
    "image",
    "失敗",
    "シュートブロック",
    "<<",
    ">>"

  ]);


/* ========================================
   SEGREDO OFICIAL
======================================== */


function ehSegredo(
  valor
) {

  const v =
    texto(
      valor
    );


  return (
    v ===
      "???" ||
    v ===
      "？？？"
  );

}


/* ========================================
   TESTAR RUÍDO
======================================== */


function linhaEhRuido(
  valor,
  idioma
) {

  const v =
    texto(
      valor
    );


  if (!v) {
    return true;
  }


  if (
    ehSegredo(
      v
    )
  ) {
    return true;
  }


  const chave =
    v.toLowerCase();


  const conjunto =
    idioma ===
    "jp"
      ? RUIDOS_JP
      : RUIDOS_EN;


  if (
    conjunto.has(
      chave
    )
  ) {
    return true;
  }


  if (
    /^\d+(?:件)?$/.test(
      v
    )
  ) {
    return true;
  }


  if (
    /^page\s+\d+$/i.test(
      v
    )
  ) {
    return true;
  }


  if (
    v.length >
    140
  ) {
    return true;
  }


  return false;

}


/* ========================================
   MARCADOR DE CATEGORIA
======================================== */


function ehMarcadorCategoria(
  linha,
  config,
  idioma
) {

  const v =
    texto(
      linha
    );


  if (
    idioma ===
    "jp"
  ) {

    return (
      v ===
        config.marcadorJp ||
      v.startsWith(
        config.marcadorJp +
        " "
      )
    );

  }


  return (
    v ===
      config.marcadorEn ||
    v.startsWith(
      config.marcadorEn +
      " "
    )
  );

}


/* ========================================
   NOME ANTES DO MARCADOR
======================================== */


function nomeAnteriorValido(
  linhas,
  indiceMarcador,
  idioma,
  config
) {

  for (
    let i =
      indiceMarcador - 1;

    i >=
      Math.max(
        0,
        indiceMarcador - 8
      );

    i -= 1
  ) {

    const candidato =
      texto(
        linhas[i]
      );


    if (!candidato) {
      continue;
    }


    /*
      Um card secreto não tem nome
      utilizável.
    */

    if (
      ehSegredo(
        candidato
      )
    ) {
      return "";
    }


    if (
      ehMarcadorCategoria(
        candidato,
        config,
        idioma
      )
    ) {
      continue;
    }


    if (
      linhaEhRuido(
        candidato,
        idioma
      )
    ) {
      continue;
    }


    if (
      idioma ===
      "en"
    ) {

      if (
        /^(shot|offence|defence|goalkeep|success|failure)$/i.test(
          candidato
        )
      ) {
        continue;
      }

    }


    if (
      idioma ===
      "jp"
    ) {

      if (
        /^(シュート|オフェンス|ディフェンス|キーパー|成功|失敗)$/.test(
          candidato
        )
      ) {
        continue;
      }

    }


    return candidato;

  }


  return "";

}


/* ========================================
   ANALISAR PÁGINA

   IMPORTANTE:

   Total oficial =
   nomes visíveis + slots ???
======================================== */


function analisarPaginaCategoria(
  html,
  config,
  idioma
) {

  const linhas =
    htmlParaLinhas(
      html,
      idioma
    );


  const nomes =
    [];


  let segredos =
    0;


  /*
    Primeiro contabilizamos os slots
    explicitamente escondidos.
  */

  for (
    const linha of
    linhas
  ) {

    if (
      ehSegredo(
        linha
      )
    ) {

      segredos +=
        1;

    }

  }


  /*
    Depois catalogamos apenas nomes
    realmente mostrados pela fonte.
  */

  for (
    let i = 0;
    i < linhas.length;
    i += 1
  ) {

    if (
      !ehMarcadorCategoria(
        linhas[i],
        config,
        idioma
      )
    ) {
      continue;
    }


    const nome =
      nomeAnteriorValido(
        linhas,
        i,
        idioma,
        config
      );


    if (!nome) {
      continue;
    }


    /*
      NÃO eliminamos nomes repetidos
      globalmente.

      Apenas evitamos um mesmo card sendo
      capturado duas vezes consecutivas.
    */

    const anterior =
      nomes[
        nomes.length -
        1
      ];


    if (
      anterior &&
      normalizar(
        anterior
      ) ===
      normalizar(
        nome
      ) &&
      linhas[
        i - 1
      ] ===
      linhas[
        i - 2
      ]
    ) {

      continue;

    }


    nomes.push(
      nome
    );

  }


  return {

    nomes,

    segredos,

    total:
      nomes.length +
      segredos

  };

}


/* ========================================
   URL OFICIAL
======================================== */


function montarUrlOficial(
  base,
  config,
  pagina,
  porPagina
) {

  const url =
    new URL(
      base
    );


  url.searchParams.set(
    "q",
    config.q
  );


  url.searchParams.set(
    "page",
    String(
      pagina
    )
  );


  url.searchParams.set(
    "per_page",
    String(
      porPagina
    )
  );


  return url.toString();

}


/* ========================================
   BAIXAR CATEGORIA
======================================== */


async function tentarBaixarCategoria(
  base,
  config,
  idioma,
  porPagina
) {

  const paginas =
    Math.ceil(
      config.esperado /
      porPagina
    );


  const nomes =
    [];


  let segredos =
    0;


  const urls =
    [];


  for (
    let pagina = 1;
    pagina <= paginas;
    pagina += 1
  ) {

    const url =
      montarUrlOficial(
        base,
        config,
        pagina,
        porPagina
      );


    process.stdout.write(

      "  " +
      config.oficialEn +
      " " +
      idioma.toUpperCase() +
      " página " +
      pagina +
      "/" +
      paginas +
      "... "

    );


    const resposta =
      await fetchComRetry(
        url
      );


    const html =
      await resposta.text();


    const paginaAnalisada =
      analisarPaginaCategoria(
        html,
        config,
        idioma
      );


    nomes.push(
      ...paginaAnalisada.nomes
    );


    segredos +=
      paginaAnalisada.segredos;


    urls.push(
      url
    );


    console.log(

      paginaAnalisada
        .nomes
        .length +

      " nomes + " +

      paginaAnalisada
        .segredos +

      " segredo(s)"

    );

  }


  return {

    nomes,

    segredos,

    total:
      nomes.length +
      segredos,

    urls,

    porPagina

  };

}


/* ========================================
   AMOSTRAS
======================================== */


function validarAmostras(
  config,
  nomes
) {

  const amostras =
    AMOSTRAS_OFICIAIS[
      config.chave
    ] ||
    [];


  const normalizados =
    new Set(
      nomes.map(
        normalizar
      )
    );


  return amostras.every(
    nome =>
      normalizados.has(
        normalizar(
          nome
        )
      )
  );

}


/* ========================================
   PAREAMENTO EN / JP
======================================== */


function validarPareamento(
  config,
  ingles,
  japones
) {

  const amostras =
    AMOSTRAS_PAREAMENTO[
      config.chave
    ] ||
    {};


  for (
    const [
      nomeEn,
      nomeJp
    ]
    of Object.entries(
      amostras
    )
  ) {

    const indice =
      ingles.findIndex(
        item =>
          normalizar(
            item
          ) ===
          normalizar(
            nomeEn
          )
      );


    if (
      indice < 0
    ) {
      return false;
    }


    if (
      normalizar(
        japones[
          indice
        ]
      ) !==
      normalizar(
        nomeJp
      )
    ) {
      return false;
    }

  }


  return true;

}


/* ========================================
   DOWNLOAD COM FALLBACK
======================================== */


async function baixarCategoriaOficial(
  base,
  config,
  idioma
) {

  const tamanhos =
    [
      200,
      100,
      50
    ];


  let ultimo =
    null;


  for (
    const porPagina of
    tamanhos
  ) {

    const resultado =
      await tentarBaixarCategoria(
        base,
        config,
        idioma,
        porPagina
      );


    ultimo =
      resultado;


    /*
      A diferença fundamental da V2:

      antes:
      nomes === esperado

      agora:
      nomes + ??? === esperado
    */

    if (
      resultado.total ===
      config.esperado
    ) {

      if (
        idioma ===
          "en" &&
        !validarAmostras(
          config,
          resultado.nomes
        )
      ) {

        console.log(
          "  Total correto, mas amostras falharam. Tentando fallback."
        );


        continue;

      }


      return resultado;

    }


    console.log(

      "  Esperado " +
      config.esperado +
      "; obtido " +
      resultado.total +
      " (" +
      resultado.nomes.length +
      " nomes + " +
      resultado.segredos +
      " segredo(s)). Tentando fallback."

    );

  }


  throw new Error(

    "Não foi possível extrair " +
    config.oficialEn +
    " (" +
    idioma +
    "). Esperado " +
    config.esperado +
    "; última leitura " +
    (
      ultimo?.total ??
      0
    ) +
    ". O banco atual NÃO foi substituído."

  );

}


/* ========================================
   CATÁLOGO COMPLETO
======================================== */


async function baixarCatalogoOficial903() {

  const registros =
    [];


  const diagnostico =
    [];


  console.log(
    "\n=== BAIXANDO CATÁLOGO OFICIAL LEVEL-5 ===\n"
  );


  for (
    const config of
    CATEGORIAS
  ) {

    const en =
      await baixarCategoriaOficial(
        SITE_OFICIAL_EN,
        config,
        "en"
      );


    const jp =
      await baixarCategoriaOficial(
        SITE_OFICIAL_JP,
        config,
        "jp"
      );


    if (
      en.total !==
        config.esperado ||
      jp.total !==
        config.esperado
    ) {

      throw new Error(
        config.oficialEn +
        ": total EN/JP não corresponde ao oficial."
      );

    }


    if (
      en.segredos !==
      jp.segredos
    ) {

      throw new Error(

        config.oficialEn +
        ": quantidade de segredos difere entre EN e JP (" +
        en.segredos +
        " x " +
        jp.segredos +
        ")."

      );

    }


    if (
      en.nomes.length !==
      jp.nomes.length
    ) {

      throw new Error(

        config.oficialEn +
        ": quantidade de nomes visíveis difere entre EN e JP (" +
        en.nomes.length +
        " x " +
        jp.nomes.length +
        ")."

      );

    }


    if (
      !validarPareamento(
        config,
        en.nomes,
        jp.nomes
      )
    ) {

      throw new Error(

        config.oficialEn +
        ": pareamento EN/JP não passou pelas amostras."

      );

    }


    /*
      REGISTROS COM NOME VISÍVEL
    */

    for (
      let i = 0;
      i < en.nomes.length;
      i += 1
    ) {

      registros.push({

        segredoOficial:
          false,

        ingles:
          en.nomes[i],

        japones:
          jp.nomes[i],

        tipo:
          config.tipo,

        categoriaOficial:
          config.oficialEn,

        categoriaOficialJp:
          config.oficialJp,

        indiceVisivelNaCategoria:
          i + 1,

        fonteUrl:
          montarUrlOficial(
            SITE_OFICIAL_EN,
            config,
            1,
            200
          )

      });

    }


    /*
      SLOTS QUE A PRÓPRIA LEVEL-5
      MANTÉM COMO ???
    */

    for (
      let i = 0;
      i < en.segredos;
      i += 1
    ) {

      registros.push({

        segredoOficial:
          true,

        numeroSegredoCategoria:
          i + 1,

        ingles:
          "",

        japones:
          "",

        tipo:
          config.tipo,

        categoriaOficial:
          config.oficialEn,

        categoriaOficialJp:
          config.oficialJp,

        indiceVisivelNaCategoria:
          null,

        fonteUrl:
          montarUrlOficial(
            SITE_OFICIAL_EN,
            config,
            1,
            200
          )

      });

    }


    diagnostico.push({

      categoria:
        config.oficialEn,

      esperado:
        config.esperado,

      nomesVisiveis:
        en.nomes.length,

      segredosOficiais:
        en.segredos,

      totalEn:
        en.total,

      totalJp:
        jp.total,

      porPaginaEn:
        en.porPagina,

      porPaginaJp:
        jp.porPagina

    });


    console.log(

      "  OK " +
      config.oficialEn +
      ": " +
      en.nomes.length +
      " nomeadas + " +
      en.segredos +
      " secretas = " +
      en.total

    );

  }


  if (
    registros.length !==
    TOTAL_ESPERADO
  ) {

    throw new Error(

      "Catálogo incompleto: " +
      registros.length +
      "/" +
      TOTAL_ESPERADO

    );

  }


  return {

    registros,
    diagnostico

  };

}


/* ========================================
   NOMES LEGADOS
======================================== */


function obterNomesLegados(
  registro
) {

  const nomes =
    objeto(
      registro?.nomes
    );


  return unicos(

    registro?.nome,

    registro?.nomeOriginal,

    nomes.ptBR,

    nomes.ingles,

    nomes.original,

    nomes.japones,

    nomes.japonesRomanizado,

    nomes.alternativos

  );

}


/* ========================================
   ÍNDICE LEGADO
======================================== */


function indexarLegado(
  banco
) {

  const indice =
    new Map();


  for (
    const registro of
    banco
  ) {

    for (
      const nome of
      obterNomesLegados(
        registro
      )
    ) {

      const chave =
        normalizar(
          nome
        );


      if (!chave) {
        continue;
      }


      if (
        !indice.has(
          chave
        )
      ) {

        indice.set(
          chave,
          []
        );

      }


      indice
        .get(
          chave
        )
        .push(
          registro
        );

    }

  }


  return indice;

}


/* ========================================
   ENCONTRAR LEGADO

   Somente igualdade segura.

   Não fazemos fuzzy automático nessa
   migração porque preservar um ID errado
   seria pior do que criar um ID novo.
======================================== */


function encontrarLegadoExato(
  oficial,
  indiceLegado,
  idsUsados
) {

  if (
    oficial.segredoOficial
  ) {
    return null;
  }


  const candidatos =
    indiceLegado.get(
      normalizar(
        oficial.ingles
      )
    ) ||
    [];


  const disponiveis =
    candidatos.filter(
      item =>
        !idsUsados.has(
          texto(
            item.id
          )
        )
    );


  const porId =
    new Map(

      disponiveis

        .map(
          item => [

            texto(
              item.id
            ),

            item

          ]
        )

        .filter(
          (
            [
              id
            ]
          ) =>
            id
        )

    );


  return (
    porId.size ===
    1
  )
    ? [
        ...porId.values()
      ][0]
    : null;

}


/* ========================================
   ATRIBUIR IDS

   NOMES PODEM REPETIR.
   IDS NÃO.
======================================== */


function atribuirIds(
  oficiais,
  indiceLegado
) {

  const idsUsados =
    new Set();


  const idsLegadosUsados =
    new Set();


  const slugsUsados =
    new Map();


  return oficiais.map(
    (
      oficial,
      indiceCatalogo
    ) => {


      /*
        SLOT SECRETO
      */

      if (
        oficial.segredoOficial
      ) {

        const base =
          "official-secret-" +
          slug(
            oficial.categoriaOficial
          );


        const numero =
          String(
            oficial
              .numeroSegredoCategoria
          ).padStart(
            3,
            "0"
          );


        const id =
          base +
          "-" +
          numero;


        if (
          idsUsados.has(
            id
          )
        ) {

          throw new Error(
            "ID secreto duplicado: " +
            id
          );

        }


        idsUsados.add(
          id
        );


        return {

          ...oficial,

          id,

          legado:
            null,

          indiceCatalogo:
            indiceCatalogo +
            1

        };

      }


      /*
        TÉCNICA NOMEADA
      */

      const legado =
        encontrarLegadoExato(

          oficial,

          indiceLegado,

          idsLegadosUsados

        );


      let id =
        texto(
          legado?.id
        );


      if (
        legado?.id
      ) {

        idsLegadosUsados.add(
          texto(
            legado.id
          )
        );

      }


      /*
        Nome repetido gera sufixo.

        Exemplo:

        heart-s-desire
        heart-s-desire-2
      */

      if (
        !id ||
        idsUsados.has(
          id
        )
      ) {

        const base =
          slug(
            oficial.ingles
          );


        const numero =
          (
            slugsUsados.get(
              base
            ) ||
            0
          ) +
          1;


        slugsUsados.set(
          base,
          numero
        );


        id =
          numero ===
          1
            ? base
            : (
                base +
                "-" +
                numero
              );


        while (
          idsUsados.has(
            id
          )
        ) {

          const proximo =
            (
              slugsUsados.get(
                base
              ) ||
              numero
            ) +
            1;


          slugsUsados.set(
            base,
            proximo
          );


          id =
            base +
            "-" +
            proximo;

        }

      }


      idsUsados.add(
        id
      );


      return {

        ...oficial,

        id,

        legado:
          legado ||
          null,

        indiceCatalogo:
          indiceCatalogo +
          1

      };

    }
  );

}


/* ========================================
   LOCALIZAÇÃO LEGADA
======================================== */


function localizacaoVerificada(
  registro,
  idioma
) {

  return (
    texto(
      registro
        ?.localizacao
        ?.[idioma]
    )
      .toLowerCase() ===
    "verificada"
  );

}


/* ========================================
   IMAGEM LEGADA
======================================== */


function imagemLegada(
  registro
) {

  const imagem =
    objeto(
      registro
        ?.imagemReferencia
    );


  const url =
    texto(
      imagem.url ||
      registro?.imagem
    );


  if (!url) {
    return null;
  }


  if (
    url.startsWith(
      "/assets/"
    )
  ) {

    const local =
      path.join(

        PUBLIC,

        url.replace(
          /^\/+/,
          ""
        )

      );


    if (
      !fs.existsSync(
        local
      )
    ) {

      return null;

    }

  }


  return {

    url,

    fonte:
      texto(
        imagem.fonte
      ),

    fonteUrl:
      texto(
        imagem.fonteUrl
      ),

    tituloArquivo:
      texto(
        imagem.tituloArquivo ||
        imagem.arquivoOrigem
      ),

    status:
      texto(
        imagem.status
      ) ||
      "catalogada"

  };

}


/* ========================================
   PONTUAÇÃO VISUAL
======================================== */


function tituloImagemNormalizado(
  valor
) {

  return normalizar(

    texto(
      valor
    )

      .replace(
        /^File:/i,
        ""
      )

      .replace(
        /\.[a-z0-9]{2,5}$/i,
        ""
      )

  );

}


function pontuarCandidatoImagem(
  candidato,
  nomeTecnica,
  rejeitados = []
) {

  const titulo =
    texto(
      candidato.titulo
    );


  const tituloNorm =
    tituloImagemNormalizado(
      titulo
    );


  const nomeNorm =
    normalizar(
      nomeTecnica
    );


  const rejeitadosNorm =
    new Set(
      rejeitados.map(
        normalizar
      )
    );


  if (
    rejeitadosNorm.has(
      normalizar(
        titulo
      )
    )
  ) {

    return -10000;

  }


  let pontos =
    0;


  if (
    tituloNorm ===
    nomeNorm
  ) {

    pontos +=
      180;

  }


  if (
    tituloNorm.includes(
      nomeNorm
    )
  ) {

    pontos +=
      100;

  }


  const palavras =
    nomeNorm
      .split(
        " "
      )
      .filter(
        Boolean
      );


  const acertos =
    palavras.filter(
      palavra =>
        tituloNorm.includes(
          palavra
        )
    ).length;


  pontos +=
    acertos *
    12;


  if (
    /\(IE(?:\s|\)|\d)/i.test(
      titulo
    )
  ) {

    pontos +=
      35;

  }


  if (
    /\(AT(?:\s|\)|\d)/i.test(
      titulo
    )
  ) {

    pontos +=
      30;

  }


  if (
    /\(GO(?:\s|\)|\d)/i.test(
      titulo
    )
  ) {

    pontos +=
      15;

  }


  if (
    /\b(anime|episode|ep\.?\s*\d+)\b/i.test(
      titulo
    )
  ) {

    pontos +=
      20;

  }


  if (
    /\b(concept|notebook|icon|logo|sprite|texture|model|render|card|menu|qr|emblem|portrait|profile)\b/i.test(
      titulo
    )
  ) {

    pontos -=
      120;

  }


  if (
    /\b(failing|failure|failed)\b/i.test(
      titulo
    )
  ) {

    pontos -=
      45;

  }


  if (
    /\b(gameplay|game|3d)\b/i.test(
      titulo
    )
  ) {

    pontos -=
      15;

  }


  const largura =
    Number(
      candidato.largura ||
      0
    );


  const altura =
    Number(
      candidato.altura ||
      0
    );


  if (
    largura >=
      640 &&
    altura >=
      360
  ) {

    pontos +=
      15;

  }


  if (
    largura >=
      1000 &&
    altura >=
      500
  ) {

    pontos +=
      10;

  }


  if (
    largura >
    altura
  ) {

    pontos +=
      5;

  }


  const mime =
    texto(
      candidato.mime
    )
      .toLowerCase();


  if (
    [
      "image/png",
      "image/jpeg",
      "image/webp"
    ].includes(
      mime
    )
  ) {

    pontos +=
      5;

  }


  return pontos;

}


/* ========================================
   FANDOM — SOMENTE IMAGENS
======================================== */


async function consultarFandom(
  nomeTecnica,
  rejeitados = []
) {

  async function fazer(
    pesquisa
  ) {

    const url =
      new URL(
        FANDOM_API
      );


    url.searchParams.set(
      "action",
      "query"
    );


    url.searchParams.set(
      "generator",
      "search"
    );


    url.searchParams.set(
      "gsrsearch",
      pesquisa
    );


    url.searchParams.set(
      "gsrnamespace",
      "6"
    );


    url.searchParams.set(
      "gsrlimit",
      "10"
    );


    url.searchParams.set(
      "prop",
      "imageinfo"
    );


    url.searchParams.set(
      "iiprop",
      "url|mime|size"
    );


    url.searchParams.set(
      "format",
      "json"
    );


    url.searchParams.set(
      "origin",
      "*"
    );


    const resposta =
      await fetchComRetry(
        url.toString(),
        {},
        2
      );


    const json =
      await resposta.json();


    const paginas =
      Object.values(
        json
          ?.query
          ?.pages ||
        {}
      );


    return paginas

      .map(
        pagina => {

          const info =
            pagina
              ?.imageinfo
              ?.[0] ||
            {};


          return {

            titulo:
              texto(
                pagina?.title
              ),

            url:
              texto(
                info.url
              ),

            paginaDescricao:
              texto(
                info.descriptionurl
              ),

            mime:
              texto(
                info.mime
              ),

            largura:
              Number(
                info.width ||
                0
              ),

            altura:
              Number(
                info.height ||
                0
              )

          };

        }
      )

      .filter(
        item =>
          item.url &&
          item.titulo
      );

  }


  let candidatos =
    await fazer(

      '"' +

      nomeTecnica.replace(
        /"/g,
        ""
      ) +

      '"'

    );


  if (
    !candidatos.length
  ) {

    candidatos =
      await fazer(
        nomeTecnica
      );

  }


  return candidatos

    .map(
      item => ({

        ...item,

        pontos:
          pontuarCandidatoImagem(
            item,
            nomeTecnica,
            rejeitados
          )

      })
    )

    .filter(
      item =>
        item.pontos >=
        35
    )

    .sort(
      (
        a,
        b
      ) =>
        b.pontos -
        a.pontos
    );

}


/* ========================================
   ASSINATURA DE IMAGEM
======================================== */


function detectarExtensaoImagem(
  buffer,
  mime = ""
) {

  if (
    !Buffer.isBuffer(
      buffer
    ) ||
    buffer.length <
    12
  ) {

    return "";

  }


  if (
    buffer[0] ===
      0x89 &&
    buffer
      .slice(
        1,
        4
      )
      .toString(
        "ascii"
      ) ===
      "PNG"
  ) {

    return ".png";

  }


  if (
    buffer[0] ===
      0xff &&
    buffer[1] ===
      0xd8 &&
    buffer[2] ===
      0xff
  ) {

    return ".jpg";

  }


  if (
    buffer
      .slice(
        0,
        4
      )
      .toString(
        "ascii"
      ) ===
      "RIFF" &&

    buffer
      .slice(
        8,
        12
      )
      .toString(
        "ascii"
      ) ===
      "WEBP"
  ) {

    return ".webp";

  }


  if (
    buffer
      .slice(
        0,
        6
      )
      .toString(
        "ascii"
      ) ===
      "GIF87a" ||

    buffer
      .slice(
        0,
        6
      )
      .toString(
        "ascii"
      ) ===
      "GIF89a"
  ) {

    return ".gif";

  }


  const m =
    texto(
      mime
    )
      .toLowerCase();


  if (
    m.includes(
      "png"
    )
  ) {
    return ".png";
  }


  if (
    m.includes(
      "jpeg"
    ) ||
    m.includes(
      "jpg"
    )
  ) {
    return ".jpg";
  }


  if (
    m.includes(
      "webp"
    )
  ) {
    return ".webp";
  }


  if (
    m.includes(
      "gif"
    )
  ) {
    return ".gif";
  }


  return "";

}


/* ========================================
   BAIXAR IMAGEM
======================================== */


async function baixarImagemCandidata(
  candidato,
  id
) {

  const resposta =
    await fetchComRetry(
      candidato.url,
      {

        headers: {

          Referer:
            "https://inazuma-eleven.fandom.com/"

        }

      },
      2
    );


  const buffer =
    Buffer.from(
      await resposta.arrayBuffer()
    );


  const extensao =
    detectarExtensaoImagem(

      buffer,

      candidato.mime ||

      resposta.headers.get(
        "content-type"
      )

    );


  if (!extensao) {

    throw new Error(
      "Arquivo baixado não é imagem reconhecida."
    );

  }


  const destino =
    path.join(
      DIR_IMAGENS,
      id +
      extensao
    );


  await fsp.writeFile(
    destino,
    buffer
  );


  return {

    urlLocal:
      "/assets/hissatsu/catalogo903/" +
      id +
      extensao

  };

}


/* ========================================
   PLACEHOLDERS
======================================== */


async function criarPlaceholders() {

  const pendente = [

    '<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">',

    '<rect width="1280" height="720" fill="#151a22"/>',

    '<rect x="40" y="40" width="1200" height="640" rx="36" fill="none" stroke="#46505f" stroke-width="4"/>',

    '<text x="640" y="325" text-anchor="middle" font-family="Arial, sans-serif" font-size="56" fill="#d5dbe5">HISSATSU</text>',

    '<text x="640" y="405" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" fill="#8d99aa">IMAGEM PENDENTE DE CURADORIA</text>',

    "</svg>"

  ].join(
    ""
  );


  const segredo = [

    '<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">',

    '<rect width="1280" height="720" fill="#151a22"/>',

    '<rect x="40" y="40" width="1200" height="640" rx="36" fill="none" stroke="#46505f" stroke-width="4"/>',

    '<text x="640" y="330" text-anchor="middle" font-family="Arial, sans-serif" font-size="92" fill="#d5dbe5">???</text>',

    '<text x="640" y="420" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" fill="#8d99aa">ENTRADA AINDA OCULTA NO CATÁLOGO OFICIAL</text>',

    "</svg>"

  ].join(
    ""
  );


  await fsp.writeFile(
    ARQUIVO_PLACEHOLDER,
    pendente,
    "utf8"
  );


  await fsp.writeFile(
    ARQUIVO_SEGREDO,
    segredo,
    "utf8"
  );

}


/* ========================================
   CACHE VISUAL
======================================== */


async function carregarCacheFandom() {

  try {

    return JSON.parse(

      await fsp.readFile(
        ARQUIVO_CACHE_FANDOM,
        "utf8"
      )

    );

  } catch {

    return {};

  }

}


/* ========================================
   PREPARAR IMAGEM
======================================== */


async function prepararImagem(
  registro,
  cache
) {


  /*
    SLOT OFICIAL AINDA SECRETO
  */

  if (
    registro.segredoOficial
  ) {

    return {

      imagemReferencia: {

        url:
          "/assets/hissatsu/catalogo903/_segredo-oficial.svg",

        fonte:
          "LEVEL-5 / Inazugle — entrada ainda oculta",

        fonteUrl:
          registro.fonteUrl,

        tituloArquivo:
          "",

        status:
          "oculta",

        origemVisual:
          "segredo-oficial",

        placeholder:
          true,

        segredoOficial:
          true

      },


      curadoria: {

        estado:
          "oculta",

        qualidade:
          "",

        origemDecisao:
          "catalogo-oficial",

        observacao:
          "A própria LEVEL-5 mantém esta entrada como ???; nenhum nome ou frame foi inventado."

      }

    };

  }


  const legado =
    registro.legado;


  const id =
    registro.id;


  const antiga =
    imagemLegada(
      legado
    );


  const aprovadaA =
    CURADORIA_A.has(
      id
    );


  const aprovadaB =
    CURADORIA_B.has(
      id
    );


  const rejeitada =
    CURADORIA_D.has(
      id
    );


  /*
    PRESERVAR IMAGEM LEGADA
  */

  if (
    antiga &&
    !rejeitada
  ) {

    const qualidade =
      aprovadaA
        ? "A"
        : (
            aprovadaB
              ? "B"
              : "C"
          );


    const estado =
      (
        aprovadaA ||
        aprovadaB
      )
        ? "aprovada"
        : "revisar";


    return {

      imagemReferencia: {

        ...antiga,

        status:
          estado ===
          "aprovada"
            ? "validada"
            : "provisoria",

        origemVisual:
          "legado-preservado",

        placeholder:
          false

      },


      curadoria: {

        estado,

        qualidade,

        origemDecisao:
          estado ===
          "aprovada"
            ? "humana-recuperada"
            : "legado-em-revisao",

        observacao:
          estado ===
          "aprovada"
            ? "Decisão humana anterior preservada."
            : "Imagem antiga preservada apenas como provisória."

      }

    };

  }


  const rejeitados =
    CANDIDATOS_REJEITADOS[
      id
    ] ||
    [];


  const chaveCache =
    normalizar(
      registro.ingles
    );


  let candidatos =
    cache[
      chaveCache
    ];


  if (
    !Array.isArray(
      candidatos
    )
  ) {

    try {

      candidatos =
        await consultarFandom(
          registro.ingles,
          rejeitados
        );

    } catch (
      erro
    ) {

      candidatos =
        [];


      console.warn(

        "    imagem: " +
        registro.ingles +
        " — " +
        (
          erro?.message ||
          erro
        )

      );

    }


    cache[
      chaveCache
    ] =
      candidatos;

  }


  for (
    const candidato of
    candidatos.slice(
      0,
      4
    )
  ) {

    try {

      const baixada =
        await baixarImagemCandidata(
          candidato,
          id
        );


      return {

        imagemReferencia: {

          url:
            baixada.urlLocal,

          fonte:
            "Inazuma Eleven Wiki / Fandom — candidata automática para curadoria",

          fonteUrl:
            candidato
              .paginaDescricao ||
            candidato.url,

          tituloArquivo:
            candidato.titulo,

          status:
            "provisoria",

          origemVisual:
            "fandom-candidato-automatico",

          placeholder:
            false,

          pontuacaoAutomatica:
            candidato.pontos,

          largura:
            candidato.largura,

          altura:
            candidato.altura

        },


        curadoria: {

          estado:
            "revisar",

          qualidade:
            "C",

          origemDecisao:
            "automatica",

          observacao:
            rejeitada
              ? "A imagem anterior foi rejeitada. Esta candidata ainda precisa de curadoria humana."
              : "Candidata automática; não foi autoaprovada.",

          candidatosRejeitados:
            rejeitados.map(
              tituloArquivo => ({
                tituloArquivo
              })
            )

        }

      };

    } catch {

      /*
        tenta próxima candidata
      */

    }

  }


  return {

    imagemReferencia: {

      url:
        "/assets/hissatsu/catalogo903/_pendente.svg",

      fonte:
        "RPG Manager — placeholder de curadoria",

      fonteUrl:
        "",

      tituloArquivo:
        "",

      status:
        "pendente",

      origemVisual:
        "placeholder",

      placeholder:
        true

    },


    curadoria: {

      estado:
        "pendente",

      qualidade:
        "",

      origemDecisao:
        "sem-candidato",

      observacao:
        "Nenhuma candidata visual utilizável foi obtida automaticamente."

    }

  };

}


/* ========================================
   IMAGENS EM LOTE
======================================== */


async function prepararImagensEmLote(
  registros
) {

  await criarPlaceholders();


  const cache =
    await carregarCacheFandom();


  const resultado =
    new Array(
      registros.length
    );


  let proximo =
    0;


  let concluidos =
    0;


  let ultimoSalvamento =
    0;


  const concorrencia =
    4;


  console.log(
    "\n=== PREPARANDO IMAGENS / CANDIDATAS ===\n"
  );


  async function worker() {

    while (
      true
    ) {

      const indice =
        proximo;


      proximo +=
        1;


      if (
        indice >=
        registros.length
      ) {
        return;
      }


      resultado[
        indice
      ] =
        await prepararImagem(
          registros[
            indice
          ],
          cache
        );


      concluidos +=
        1;


      if (
        concluidos %
          25 ===
          0 ||
        concluidos ===
          registros.length
      ) {

        console.log(

          "  imagens processadas: " +
          concluidos +
          "/" +
          registros.length

        );

      }


      if (
        concluidos -
          ultimoSalvamento >=
        25
      ) {

        ultimoSalvamento =
          concluidos;


        await salvarJson(

          ARQUIVO_CACHE_FANDOM,

          cache

        );

      }


      await dormir(
        80
      );

    }

  }


  await Promise.all(

    Array.from(

      {
        length:
          concorrencia
      },

      () =>
        worker()

    )

  );


  await salvarJson(
    ARQUIVO_CACHE_FANDOM,
    cache
  );


  return resultado;

}


/* ========================================
   REGISTRO SECRETO
======================================== */


function criarRegistroSegredo(
  oficial,
  imagemPreparada
) {

  const numero =
    oficial
      .numeroSegredoCategoria;


  const categoria =
    oficial
      .categoriaOficial;


  return {

    id:
      oficial.id,


    versao:
      1,


    /*
      Este é um rótulo INTERNO.

      Não é tratado como nome oficial.
    */

    nome:
      "Técnica secreta oficial — " +
      categoria +
      " " +
      numero,


    nomes: {

      ptBR:
        null,

      ingles:
        null,

      original:
        null,

      japones:
        null,

      japonesRomanizado:
        null,

      alternativos:
        []

    },


    localizacao: {

      idiomaPrincipal:
        "oculta",

      ptBR:
        "oculta",

      ingles:
        "oculta",

      japones:
        "oculta",

      japonesRomanizado:
        "oculta"

    },


    tipo:
      oficial.tipo,


    elemento:
      "",


    grau:
      "",


    custoTP:
      "",


    imagem:
      imagemPreparada
        .imagemReferencia
        .url,


    imagemReferencia:
      imagemPreparada
        .imagemReferencia,


    descricao:
      "Entrada oficial ainda mantida como ??? pela LEVEL-5.",


    parametros:
      {},


    custos:
      {},


    requisitosAtributos:
      {},


    requisitosNarrativos:
      [],


    evolucao:
      "",


    mecanicaCampanha: {

      status:
        "pendente",

      observacao:
        "A técnica permanece oculta na fonte oficial."

    },


    aparicoes:
      [],


    metadados: {

      origemTipo:
        "oficial",

      origemRotulo:
        "OFICIAL — OCULTA",

      classificacao:
        "oficial",

      rotuloClassificacao:
        "OFICIAL — OCULTA",

      segredoOficial:
        true,


      catalogacao: {

        status:
          "catalogo-oficial-903",

        versaoCatalogo:
          "2026-08",

        idiomaIngles:
          "oculto-na-fonte",

        idiomaJapones:
          "oculto-na-fonte",

        ptBR:
          "oculto-na-fonte",

        japonesRomanizado:
          "oculto-na-fonte",

        elemento:
          "pendente"

      },


      referencia: {

        tipoOriginal:
          oficial
            .categoriaOficial,

        fonteFactual:
          "LEVEL-5 — Inazuma Eleven: Player Codex / Inazugle",

        fonteFactualUrl:
          oficial.fonteUrl,

        categoriaOficial:
          oficial
            .categoriaOficial,

        categoriaOficialJp:
          oficial
            .categoriaOficialJp,

        indiceCatalogo:
          oficial
            .indiceCatalogo,

        numeroSegredoCategoria:
          numero,

        idLegadoMigrado:
          null

      },


      curadoriaImagem:
        imagemPreparada
          .curadoria,


      tags: [

        "oficial",
        "inazuma-eleven",
        oficial.tipo,
        "segredo-oficial"

      ]

    }

  };

}


/* ========================================
   REGISTRO NOMEADO
======================================== */


function criarRegistroNomeado(
  oficial,
  imagemPreparada
) {

  const legado =
    objeto(
      oficial.legado
    );


  const nomesLegado =
    objeto(
      legado.nomes
    );


  const ptBR =
    localizacaoVerificada(
      legado,
      "ptBR"
    )
      ? texto(
          nomesLegado.ptBR
        )
      : "";


  const romanoValor =
    texto(
      nomesLegado
        .japonesRomanizado
    );


  const romanoStatus =
    (
      localizacaoVerificada(
        legado,
        "japonesRomanizado"
      ) &&
      romanoValor
    )
      ? "verificada"
      : "pendente";


  const originalLegado =
    texto(
      nomesLegado.original ||
      legado.nomeOriginal
    );


  const original =
    originalLegado ||
    oficial.japones ||
    oficial.ingles;


  const alternativos =
    unicos(

      nomesLegado
        .alternativos,

      (
        originalLegado &&
        normalizar(
          originalLegado
        ) !==
        normalizar(
          oficial.ingles
        )
      )
        ? originalLegado
        : ""

    )

      .filter(
        nome => {

          const n =
            normalizar(
              nome
            );


          return (

            n !==
              normalizar(
                oficial.ingles
              ) &&

            n !==
              normalizar(
                oficial.japones
              )

          );

        }
      );


  const metadadosLegado =
    objeto(
      legado.metadados
    );


  const referenciaLegada =
    objeto(
      metadadosLegado
        .referencia
    );


  const tagsLegadas =
    lista(
      metadadosLegado.tags
    );


  const imagemReferencia =
    imagemPreparada
      .imagemReferencia;


  const elemento =
    texto(
      legado.elemento
    );


  return {

    id:
      oficial.id,


    versao:
      Number(
        legado.versao ||
        1
      ),


    nome:
      ptBR ||
      oficial.ingles,


    nomes: {

      ptBR:
        ptBR ||
        null,

      ingles:
        oficial.ingles,

      original,

      japones:
        oficial.japones,

      japonesRomanizado:
        romanoValor ||
        null,

      alternativos

    },


    localizacao: {

      idiomaPrincipal:
        ptBR
          ? "ptBR"
          : "ingles",

      ptBR:
        ptBR
          ? "verificada"
          : "pendente",

      ingles:
        "verificada",

      japones:
        "verificada",

      japonesRomanizado:
        romanoStatus

    },


    /*
      Categoria oficial é autoridade.
    */

    tipo:
      oficial.tipo,


    /*
      Elemento não é inventado.

      Se existia no banco anterior,
      preservamos.

      Novos ficam pendentes.
    */

    elemento,


    grau:
      texto(
        legado.grau
      ),


    custoTP:
      legado.custoTP ??
      "",


    imagem:
      imagemReferencia.url,


    imagemReferencia,


    descricao:
      texto(
        legado.descricao
      ) ||
      "Hissatsu oficial catalogada no Inazugle da LEVEL-5.",


    parametros:
      objeto(
        legado.parametros
      ),


    custos:
      objeto(
        legado.custos
      ),


    requisitosAtributos:
      objeto(
        legado
          .requisitosAtributos
      ),


    requisitosNarrativos:
      lista(
        legado
          .requisitosNarrativos
      ),


    evolucao:
      legado.evolucao ??
      "",


    mecanicaCampanha:
      Object.keys(
        objeto(
          legado
            .mecanicaCampanha
        )
      ).length

        ? objeto(
            legado
              .mecanicaCampanha
          )

        : {

            status:
              "pendente",

            observacao:
              "A técnica ainda não recebeu parâmetros próprios do RPG."

          },


    aparicoes:
      lista(
        legado.aparicoes
      ),


    metadados: {

      ...metadadosLegado,


      origemTipo:
        "oficial",

      origemRotulo:
        "OFICIAL",

      classificacao:
        "oficial",

      rotuloClassificacao:
        "OFICIAL",

      segredoOficial:
        false,


      catalogacao: {

        ...objeto(
          metadadosLegado
            .catalogacao
        ),

        status:
          "catalogo-oficial-903",

        versaoCatalogo:
          "2026-08",

        idiomaIngles:
          "verificado-oficial",

        idiomaJapones:
          "verificado-oficial",

        ptBR:
          ptBR
            ? "verificado-legado"
            : "pendente",

        japonesRomanizado:
          romanoStatus,

        elemento:
          elemento
            ? "preservado-legado"
            : "pendente"

      },


      referencia: {

        ...referenciaLegada,


        tipoOriginal:
          oficial
            .categoriaOficial,


        fonteFactual:
          "LEVEL-5 — Inazuma Eleven: Player Codex / Inazugle",


        fonteFactualUrl:
          oficial.fonteUrl,


        categoriaOficial:
          oficial
            .categoriaOficial,


        categoriaOficialJp:
          oficial
            .categoriaOficialJp,


        indiceCatalogo:
          oficial
            .indiceCatalogo,


        indiceVisivelNaCategoria:
          oficial
            .indiceVisivelNaCategoria,


        idLegadoMigrado:
          texto(
            legado.id
          ) ||
          null

      },


      curadoriaImagem:
        imagemPreparada
          .curadoria,


      tags:
        unicos(

          tagsLegadas,

          "oficial",

          "inazuma-eleven",

          oficial.tipo,

          elemento
            ? elemento
                .toLowerCase()
            : ""

        )

    }

  };

}


/* ========================================
   REGISTRO FINAL
======================================== */


function criarRegistroFinal(
  oficial,
  imagemPreparada
) {

  return oficial.segredoOficial

    ? criarRegistroSegredo(
        oficial,
        imagemPreparada
      )

    : criarRegistroNomeado(
        oficial,
        imagemPreparada
      );

}


/* ========================================
   CONTAGEM POR TIPO
======================================== */


function contarPorTipo(
  banco
) {

  return banco.reduce(
    (
      acc,
      item
    ) => {

      acc[
        item.tipo
      ] =
        (
          acc[
            item.tipo
          ] ||
          0
        ) +
        1;


      return acc;

    },
    {}
  );

}


/* ========================================
   VALIDAÇÃO FINAL
======================================== */


function validarFinal(
  banco
) {

  const ids =
    banco.map(
      item =>
        texto(
          item.id
        )
    );


  const idsUnicos =
    new Set(
      ids
    );


  const nomeados =
    banco.filter(
      item =>
        item
          ?.metadados
          ?.segredoOficial !==
        true
    );


  const segredos =
    banco.filter(
      item =>
        item
          ?.metadados
          ?.segredoOficial ===
        true
    );


  const porTipo =
    contarPorTipo(
      banco
    );


  const erros =
    [];


  if (
    banco.length !==
    903
  ) {

    erros.push(
      "total != 903"
    );

  }


  if (
    idsUnicos.size !==
    903
  ) {

    erros.push(
      "IDs únicos != 903"
    );

  }


  if (
    (
      porTipo.chute ||
      0
    ) !==
    369
  ) {

    erros.push(
      "chute != 369"
    );

  }


  if (
    (
      porTipo.drible ||
      0
    ) !==
    167
  ) {

    erros.push(
      "drible != 167"
    );

  }


  if (
    (
      porTipo.bloqueio ||
      0
    ) !==
    176
  ) {

    erros.push(
      "bloqueio != 176"
    );

  }


  if (
    (
      porTipo.defesa_goleiro ||
      0
    ) !==
    191
  ) {

    erros.push(
      "defesa_goleiro != 191"
    );

  }


  /*
    Técnicas VISÍVEIS precisam ter
    EN e JP verificados.
  */

  for (
    const item of
    nomeados
  ) {

    if (
      !texto(
        item
          ?.nomes
          ?.ingles
      )
    ) {

      erros.push(
        "nome inglês ausente: " +
        item.id
      );

    }


    if (
      !texto(
        item
          ?.nomes
          ?.japones
      )
    ) {

      erros.push(
        "nome japonês ausente: " +
        item.id
      );

    }


    if (
      item
        ?.localizacao
        ?.ingles !==
      "verificada"
    ) {

      erros.push(
        "inglês sem status verificado: " +
        item.id
      );

    }


    if (
      item
        ?.localizacao
        ?.japones !==
      "verificada"
    ) {

      erros.push(
        "japonês sem status verificado: " +
        item.id
      );

    }

  }


  /*
    Técnicas SECRETAS não podem fingir
    possuir localização conhecida.
  */

  for (
    const item of
    segredos
  ) {

    if (
      item
        ?.localizacao
        ?.ingles !==
      "oculta"
    ) {

      erros.push(
        "segredo sem status oculto EN: " +
        item.id
      );

    }


    if (
      item
        ?.localizacao
        ?.japones !==
      "oculta"
    ) {

      erros.push(
        "segredo sem status oculto JP: " +
        item.id
      );

    }

  }


  /*
    Tudo precisa ter fonte e slot visual.
  */

  for (
    const item of
    banco
  ) {

    if (
      !texto(
        item
          ?.metadados
          ?.referencia
          ?.fonteFactual
      )
    ) {

      erros.push(
        "sem fonte factual: " +
        item.id
      );

    }


    if (
      !texto(
        item
          ?.imagemReferencia
          ?.url
      )
    ) {

      erros.push(
        "sem slot visual: " +
        item.id
      );

    }

  }


  return {

    passou:
      erros.length ===
      0,


    erros,


    resumo: {

      total:
        banco.length,

      idsUnicos:
        idsUnicos.size,

      nomeados:
        nomeados.length,

      segredos:
        segredos.length,

      porTipo

    }

  };

}


/* ========================================
   GERAR CATÁLOGO
======================================== */


function codigoCatalogo(
  banco
) {

  const metadados = {

    total:
      903,


    categorias: {

      chute:
        369,

      drible:
        167,

      bloqueio:
        176,

      defesa_goleiro:
        191

    },


    segredosOficiais:
      banco.filter(
        item =>
          item
            ?.metadados
            ?.segredoOficial ===
          true
      ).length,


    fonte:
      "LEVEL-5 — Inazuma Eleven: Player Codex / Inazugle",


    fonteEn:
      SITE_OFICIAL_EN,


    fonteJp:
      SITE_OFICIAL_JP,


    geradoEm:
      new Date()
        .toISOString()

  };


  return `/* ========================================
   BANCO HISSATSU — CATÁLOGO OFICIAL 903

   Gerado automaticamente por:
   scripts/migrarBancoHissatsu903.mjs

   Entradas que a fonte mantém como ???
   permanecem explicitamente ocultas.
======================================== */

export const METADADOS_CATALOGO_HISSATSU_903 =
${JSON.stringify(
  metadados,
  null,
  2
)};

export const catalogoHissatsuOficial903 =
${JSON.stringify(
  banco,
  null,
  2
)};

export default catalogoHissatsuOficial903;
`;

}


/* ========================================
   GERAR ADAPTADOR
======================================== */


function codigoAdapter() {

  return `import {
  catalogoHissatsuOficial903,
  METADADOS_CATALOGO_HISSATSU_903
} from "./bancoHissatsuCatalogoOficial903.js";


export {
  METADADOS_CATALOGO_HISSATSU_903
};


export const bancoHissatsuFactual =
  catalogoHissatsuOficial903;


export const bancoHissatsuSuperOnze =
  catalogoHissatsuOficial903;


export const lotesBancoHissatsuFatuais = [
  catalogoHissatsuOficial903
];


export const lotesBancoHissatsuSuperOnze = [
  catalogoHissatsuOficial903
];


/* Compatibilidade com imports antigos. */

export const loteHissatsuIE1Nomes01Seguro =
  [];


export const loteHissatsuIE1ImagensMapeadas01Seguro =
  [];


export const loteHissatsuImagensAutomaticasSeguro =
  [];


export const auditoriaBancoHissatsuSuperOnze = {

  totalEntradas:
    catalogoHissatsuOficial903.length,


  totalIdsUnicos:
    new Set(
      catalogoHissatsuOficial903.map(
        item =>
          item.id
      )
    ).size,


  totalComplementos:
    0,


  registrosSemId:
    catalogoHissatsuOficial903.filter(
      item =>
        !item.id
    ).length,


  idsComComplementos:
    []

};


/* ========================================
   BUSCA
======================================== */


export function normalizarTextoBuscaHissatsu(
  valor
) {

  return String(
    valor ??
    ""
  )

    .normalize(
      "NFD"
    )

    .replace(
      /[\\u0300-\\u036f]/g,
      ""
    )

    .toLocaleLowerCase(
      "pt-BR"
    )

    .replace(
      /[’'´]/g,
      ""
    )

    .replace(
      /[-_/]+/g,
      " "
    )

    .replace(
      /\\s+/g,
      " "
    )

    .trim();

}


export function obterNomesHissatsu(
  registro
) {

  const nomes =
    registro?.nomes ||
    {};


  return {

    ptBR:
      nomes.ptBR ||
      null,

    ingles:
      nomes.ingles ||
      "",

    original:
      nomes.original ||
      "",

    japones:
      nomes.japones ||
      "",

    japonesRomanizado:
      nomes.japonesRomanizado ||
      "",

    alternativos:
      Array.isArray(
        nomes.alternativos
      )
        ? nomes.alternativos
        : []

  };

}


export function obterNomePtBRHissatsu(
  registro
) {

  return (
    obterNomesHissatsu(
      registro
    ).ptBR ||
    null
  );

}


export function obterNomeOriginalHissatsu(
  registro
) {

  const nomes =
    obterNomesHissatsu(
      registro
    );


  return (

    nomes.original ||

    nomes.japones ||

    nomes.ingles ||

    String(
      registro?.nome ||
      ""
    )

  );

}


export function obterNomeRomanizadoHissatsu(
  registro
) {

  return (
    obterNomesHissatsu(
      registro
    )
      .japonesRomanizado ||
    ""
  );

}


export function obterNomeExibicaoHissatsu(
  registro
) {

  const nomes =
    obterNomesHissatsu(
      registro
    );


  return (

    nomes.ptBR ||

    nomes.ingles ||

    nomes.original ||

    String(
      registro?.nome ||
      ""
    ) ||

    "Sem nome"

  );

}


export function obterTodosOsNomesHissatsu(
  registro
) {

  const nomes =
    obterNomesHissatsu(
      registro
    );


  return [

    ...new Set(

      [

        registro?.nome,

        nomes.ptBR,

        nomes.ingles,

        nomes.original,

        nomes.japones,

        nomes.japonesRomanizado,

        ...nomes.alternativos

      ]

        .map(
          item =>
            String(
              item ||
              ""
            )
              .trim()
        )

        .filter(
          Boolean
        )

    )

  ];

}


/* ========================================
   IMAGEM
======================================== */


export function obterImagemReferenciaHissatsu(
  registro
) {

  const origem =
    registro
      ?.imagemReferencia;


  if (
    typeof origem ===
    "string"
  ) {

    return {

      url:
        origem,

      fonte:
        "",

      fonteUrl:
        "",

      status:
        origem
          ? "catalogada"
          : "pendente"

    };

  }


  if (
    origem &&
    typeof origem ===
      "object"
  ) {

    return {

      url:
        String(
          origem.url ||
          registro?.imagem ||
          ""
        )
          .trim(),

      fonte:
        String(
          origem.fonte ||
          ""
        )
          .trim(),

      fonteUrl:
        String(
          origem.fonteUrl ||
          ""
        )
          .trim(),

      ...origem

    };

  }


  return {

    url:
      String(
        registro?.imagem ||
        ""
      )
        .trim(),

    fonte:
      "",

    fonteUrl:
      "",

    status:
      registro?.imagem
        ? "catalogada"
        : "pendente"

  };

}


/* ========================================
   TERMOS DE BUSCA
======================================== */


export function montarTermosBuscaHissatsu(
  registro
) {

  const tags =
    Array.isArray(
      registro
        ?.metadados
        ?.tags
    )
      ? registro
          .metadados
          .tags
      : [];


  const aparicoes =
    Array.isArray(
      registro?.aparicoes
    )
      ? registro.aparicoes
      : [];


  return [

    ...new Set(

      [

        registro?.id,

        ...obterTodosOsNomesHissatsu(
          registro
        ),

        registro?.tipo,

        registro?.elemento,

        registro
          ?.metadados
          ?.referencia
          ?.categoriaOficial,

        ...tags,

        ...aparicoes
          .map(
            item =>
              item?.midiaId
          )
          .filter(
            Boolean
          )

      ]

        .map(
          item =>
            String(
              item ||
              ""
            )
              .trim()
        )

        .filter(
          Boolean
        )

    )

  ];

}


export function hissatsuCombinaBusca(
  registro,
  consulta
) {

  const consultaNormalizada =
    normalizarTextoBuscaHissatsu(
      consulta
    );


  if (
    !consultaNormalizada
  ) {
    return true;
  }


  const palavras =
    consultaNormalizada
      .split(
        " "
      )
      .filter(
        Boolean
      );


  const indice =
    montarTermosBuscaHissatsu(
      registro
    )

      .map(
        normalizarTextoBuscaHissatsu
      )

      .join(
        " "
      );


  return palavras.every(
    palavra =>
      indice.includes(
        palavra
      )
  );

}


export function buscarHissatsuNoBanco(
  id
) {

  if (!id) {
    return null;
  }


  return (

    bancoHissatsuSuperOnze.find(
      item =>
        item.id ===
        id
    ) ||

    null

  );

}


/* ========================================
   FILTROS
======================================== */


export function listarElementosBancoHissatsu() {

  return [

    ...new Set(

      bancoHissatsuSuperOnze

        .map(
          item =>
            String(
              item.elemento ||
              ""
            )
              .trim()
        )

        .filter(
          Boolean
        )

    )

  ].sort(
    (
      a,
      b
    ) =>
      a.localeCompare(
        b,
        "pt-BR"
      )
  );

}


export function listarTiposBancoHissatsu() {

  return [

    ...new Set(

      bancoHissatsuSuperOnze

        .map(
          item =>
            String(
              item.tipo ||
              ""
            )
              .trim()
        )

        .filter(
          Boolean
        )

    )

  ];

}


export function listarMidiasUtilizadasNoBanco() {

  return [

    ...new Set(

      bancoHissatsuSuperOnze

        .flatMap(
          item =>
            Array.isArray(
              item.aparicoes
            )
              ? item.aparicoes
                  .map(
                    aparicao =>
                      aparicao
                        ?.midiaId
                  )
                  .filter(
                    Boolean
                  )
              : []
        )

    )

  ];

}


/* ========================================
   PENDÊNCIAS

   Slots secretos oficiais NÃO contam
   como erro de tradução ou imagem.
======================================== */


export function listarHissatsuSemLocalizacaoPtBR() {

  return bancoHissatsuSuperOnze
    .filter(
      item =>

        item
          ?.metadados
          ?.segredoOficial !==
          true &&

        !obterNomePtBRHissatsu(
          item
        )
    );

}


export function listarHissatsuSemImagemReferencia() {

  return bancoHissatsuSuperOnze
    .filter(
      item => {

        if (
          item
            ?.metadados
            ?.segredoOficial ===
          true
        ) {
          return false;
        }


        const imagem =
          obterImagemReferenciaHissatsu(
            item
          );


        return (

          !imagem.url ||

          imagem.placeholder ===
            true

        );

      }
    );

}


export function listarHissatsuComMecanicaPendente() {

  return bancoHissatsuSuperOnze
    .filter(
      item =>
        item
          ?.mecanicaCampanha
          ?.status ===
        "pendente"
    );

}


/* ========================================
   RESUMO
======================================== */


export function obterResumoBancoHissatsu() {

  return {

    total:
      bancoHissatsuSuperOnze
        .length,


    segredosOficiais:
      bancoHissatsuSuperOnze
        .filter(
          item =>
            item
              ?.metadados
              ?.segredoOficial ===
            true
        )
        .length,


    tipos:
      listarTiposBancoHissatsu(),


    elementos:
      listarElementosBancoHissatsu(),


    midias:
      listarMidiasUtilizadasNoBanco(),


    lotes:
      lotesBancoHissatsuSuperOnze
        .length,


    complementos:
      0,


    semPtBR:
      listarHissatsuSemLocalizacaoPtBR()
        .length,


    semImagem:
      listarHissatsuSemImagemReferencia()
        .length

  };

}


export default bancoHissatsuSuperOnze;
`;

}


/* ========================================
   AUDITORIA FINAL 903
======================================== */


function codigoAuditoria903() {

  return `import {
  bancoHissatsuSuperOnze as banco,
  METADADOS_CATALOGO_HISSATSU_903
} from "./src/features/habilidades/data/bancoHissatsuSuperOnze.js";


function contar(
  tipo
) {

  return banco.filter(
    item =>
      item.tipo ===
      tipo
  ).length;

}


function linha(
  titulo,
  valor
) {

  console.log(

    String(
      titulo
    ).padEnd(
      36
    ) +

    " " +

    valor

  );

}


const ids =
  new Set(
    banco.map(
      item =>
        item.id
    )
  );


const segredos =
  banco.filter(
    item =>
      item
        ?.metadados
        ?.segredoOficial ===
      true
  );


const nomeados =
  banco.filter(
    item =>
      item
        ?.metadados
        ?.segredoOficial !==
      true
  );


const ingles =
  nomeados.filter(
    item =>
      item
        ?.localizacao
        ?.ingles ===
        "verificada" &&
      item
        ?.nomes
        ?.ingles
  ).length;


const japones =
  nomeados.filter(
    item =>
      item
        ?.localizacao
        ?.japones ===
        "verificada" &&
      item
        ?.nomes
        ?.japones
  ).length;


const ptBR =
  nomeados.filter(
    item =>
      item
        ?.localizacao
        ?.ptBR ===
        "verificada" &&
      item
        ?.nomes
        ?.ptBR
  ).length;


const jpRom =
  nomeados.filter(
    item =>
      item
        ?.localizacao
        ?.japonesRomanizado ===
        "verificada" &&
      item
        ?.nomes
        ?.japonesRomanizado
  ).length;


const slotsImagem =
  banco.filter(
    item =>
      item
        ?.imagemReferencia
        ?.url
  ).length;


const placeholdersPendentes =
  nomeados.filter(
    item =>
      item
        ?.imagemReferencia
        ?.placeholder ===
      true
  ).length;


const imagensReais =
  nomeados.filter(
    item =>
      item
        ?.imagemReferencia
        ?.url &&
      item
        ?.imagemReferencia
        ?.placeholder !==
      true
  ).length;


const aprovadas =
  nomeados.filter(
    item =>
      item
        ?.metadados
        ?.curadoriaImagem
        ?.estado ===
      "aprovada"
  ).length;


const revisar =
  nomeados.filter(
    item =>
      item
        ?.metadados
        ?.curadoriaImagem
        ?.estado ===
      "revisar"
  ).length;


const pendentes =
  nomeados.filter(
    item =>
      item
        ?.metadados
        ?.curadoriaImagem
        ?.estado ===
      "pendente"
  ).length;


const fonteOficial =
  banco.filter(
    item =>
      String(
        item
          ?.metadados
          ?.referencia
          ?.fonteFactual ||
        ""
      )
        .includes(
          "LEVEL-5"
        )
  ).length;


console.log(
  "\\n========================================"
);

console.log(
  "BANCO HISSATSU — AUDITORIA 903"
);

console.log(
  "========================================\\n"
);


linha(
  "TOTAL:",
  banco.length
);

linha(
  "IDS UNICOS:",
  ids.size
);

linha(
  "NOMEADAS PUBLICAMENTE:",
  nomeados.length
);

linha(
  "SEGREDOS OFICIAIS ???:",
  segredos.length
);


console.log(
  ""
);


linha(
  "CHUTE / SHOT:",
  contar(
    "chute"
  )
);

linha(
  "DRIBLE / OFFENCE:",
  contar(
    "drible"
  )
);

linha(
  "BLOQUEIO / DEFENCE:",
  contar(
    "bloqueio"
  )
);

linha(
  "GOLEIRO / GOALKEEP:",
  contar(
    "defesa_goleiro"
  )
);


console.log(
  ""
);


linha(
  "INGLES OFICIAL VISIVEL:",
  ingles
);

linha(
  "JAPONES OFICIAL VISIVEL:",
  japones
);

linha(
  "PT-BR VERIFICADO:",
  ptBR
);

linha(
  "JP ROM. VERIFICADO:",
  jpRom
);


console.log(
  ""
);


linha(
  "SLOTS VISUAIS:",
  slotsImagem
);

linha(
  "IMAGENS/CANDIDATAS REAIS:",
  imagensReais
);

linha(
  "PLACEHOLDERS PENDENTES:",
  placeholdersPendentes
);

linha(
  "CURADORIA APROVADA:",
  aprovadas
);

linha(
  "CURADORIA REVISAR:",
  revisar
);

linha(
  "CURADORIA PENDENTE:",
  pendentes
);


console.log(
  ""
);


linha(
  "FONTE LEVEL-5:",
  fonteOficial
);


/* ========================================
   TESTES
======================================== */


const testes = {

  total903:
    banco.length ===
    903,


  ids903:
    ids.size ===
    903,


  categorias:

    contar(
      "chute"
    ) ===
      369 &&

    contar(
      "drible"
    ) ===
      167 &&

    contar(
      "bloqueio"
    ) ===
      176 &&

    contar(
      "defesa_goleiro"
    ) ===
      191,


  nomeadosMaisSegredos:

    nomeados.length +
      segredos.length ===
    903,


  inglesNomeados:
    ingles ===
    nomeados.length,


  japonesNomeados:
    japones ===
    nomeados.length,


  segredosOcultos:
    segredos.every(
      item =>
        item
          ?.localizacao
          ?.ingles ===
          "oculta" &&
        item
          ?.localizacao
          ?.japones ===
          "oculta"
    ),


  slots903:
    slotsImagem ===
    903,


  fonte903:
    fonteOficial ===
    903,


  metadados903:
    METADADOS_CATALOGO_HISSATSU_903
      ?.total ===
    903

};


console.log(
  "\\n=== VALIDACAO ESTRUTURAL ===\\n"
);


for (
  const [
    nome,
    passou
  ]
  of Object.entries(
    testes
  )
) {

  console.log(
    (
      passou
        ? "OK"
        : "ERRO"
    ) +
    " - " +
    nome
  );

}


const tudoCerto =
  Object.values(
    testes
  )
    .every(
      Boolean
    );


console.log(
  "\\n========================================"
);


console.log(
  tudoCerto
    ? "RESULTADO: BANCO 903 APROVADO"
    : "RESULTADO: EXISTEM ERROS ESTRUTURAIS"
);


console.log(
  "========================================\\n"
);


if (
  !tudoCerto
) {

  process.exitCode =
    1;

}
`;

}


/* ========================================
   RELATÓRIO
======================================== */


function criarRelatorio(
  bancoAntigo,
  bancoNovo,
  diagnostico
) {

  const idsLegadosMigrados =
    new Set(

      bancoNovo

        .map(
          item =>
            texto(
              item
                ?.metadados
                ?.referencia
                ?.idLegadoMigrado
            )
        )

        .filter(
          Boolean
        )

    );


  const segredos =
    bancoNovo.filter(
      item =>
        item
          ?.metadados
          ?.segredoOficial ===
        true
    );


  const nomeados =
    bancoNovo.filter(
      item =>
        item
          ?.metadados
          ?.segredoOficial !==
        true
    );


  return {

    geradoEm:
      new Date()
        .toISOString(),


    fonteFactual:
      "LEVEL-5 — Inazuma Eleven: Player Codex / Inazugle",


    antes: {

      total:
        bancoAntigo.length,

      idsUnicos:
        new Set(
          bancoAntigo.map(
            item =>
              item.id
          )
        ).size

    },


    depois: {

      total:
        bancoNovo.length,

      idsUnicos:
        new Set(
          bancoNovo.map(
            item =>
              item.id
          )
        ).size,

      tipos:
        contarPorTipo(
          bancoNovo
        ),

      nomeadasPublicamente:
        nomeados.length,

      segredosOficiais:
        segredos.length,

      ptBRVerificados:
        nomeados.filter(
          item =>
            item
              ?.localizacao
              ?.ptBR ===
            "verificada"
        ).length,

      inglesVerificados:
        nomeados.filter(
          item =>
            item
              ?.localizacao
              ?.ingles ===
            "verificada"
        ).length,

      japonesVerificados:
        nomeados.filter(
          item =>
            item
              ?.localizacao
              ?.japones ===
            "verificada"
        ).length,

      japonesRomanizadoVerificados:
        nomeados.filter(
          item =>
            item
              ?.localizacao
              ?.japonesRomanizado ===
            "verificada"
        ).length,

      imagensAprovadas:
        nomeados.filter(
          item =>
            item
              ?.metadados
              ?.curadoriaImagem
              ?.estado ===
            "aprovada"
        ).length,

      imagensRevisar:
        nomeados.filter(
          item =>
            item
              ?.metadados
              ?.curadoriaImagem
              ?.estado ===
            "revisar"
        ).length,

      imagensPlaceholder:
        nomeados.filter(
          item =>
            item
              ?.imagemReferencia
              ?.placeholder ===
            true
        ).length

    },


    diagnosticoCatalogo:
      diagnostico,


    legadosNaoMapeados:

      bancoAntigo

        .filter(
          item =>
            !idsLegadosMigrados.has(
              texto(
                item.id
              )
            )
        )

        .map(
          item => ({

            id:
              item.id,

            nomes:
              obterNomesLegados(
                item
              )

          })
        ),


    observacoes: [

      "Os totais oficiais incluem entradas que a própria LEVEL-5 ainda mostra como ???.",

      "Slots secretos recebem ID estável e status oculta; nenhum nome é inventado.",

      "Nomes repetidos são permitidos porque podem representar registros oficiais distintos.",

      "IDs continuam obrigatoriamente únicos.",

      "PT-BR e romanização só mantêm status verificado quando já eram verificados.",

      "Imagens automáticas ficam C/revisar e nunca são autoaprovadas."

    ]

  };

}


/* ========================================
   SELF TEST V2
======================================== */


function selfTest() {

  const htmlEn = `

    <div>
      Search Results:
    </div>

    <div>
      3
    </div>

    <li>
      <h3>
        Fire Tornado
      </h3>

      <a>
        Shot
      </a>
    </li>

    <li>
      <span>
        ???
      </span>

      <img alt="Image">
    </li>

    <li>
      <h3>
        Dragon Crash
      </h3>

      <a>
        Shot
      </a>
    </li>

  `;


  const htmlGoal = `

    <div>
      Search Results:
    </div>

    <div>
      3
    </div>

    <li>
      <h3>
        God Hand
      </h3>

      <img alt="Success">
      <img alt="Failure">
    </li>

    <li>
      <span>
        ???
      </span>

      <img alt="Image">
    </li>

    <li>
      <h3>
        Power Shield
      </h3>

      <img alt="Success">
      <img alt="Failure">
    </li>

  `;


  const htmlJp = `

    <div>
      検索結果：
    </div>

    <div>
      3件
    </div>

    <li>

      <h3>
        ファイアトルネード
      </h3>

      <a>
        シュート
      </a>

    </li>

    <li>

      <span>
        ？？？
      </span>

      <img alt="Image">

    </li>

    <li>

      <h3>

        <ruby>

          竜巻

          <rt>
            たつまき
          </rt>

        </ruby>

        落とし

      </h3>

      <a>
        シュート
      </a>

    </li>

  `;


  const shot = {

    ...CATEGORIAS[0],

    esperado:
      3

  };


  const goal = {

    ...CATEGORIAS[3],

    esperado:
      3

  };


  const a =
    analisarPaginaCategoria(
      htmlEn,
      shot,
      "en"
    );


  const b =
    analisarPaginaCategoria(
      htmlGoal,
      goal,
      "en"
    );


  const c =
    analisarPaginaCategoria(
      htmlJp,
      shot,
      "jp"
    );


  const parserInglesOk =

    JSON.stringify(
      a.nomes
    ) ===
      JSON.stringify([

        "Fire Tornado",
        "Dragon Crash"

      ]) &&

    a.segredos ===
      1 &&

    a.total ===
      3;


  const parserGoalOk =

    JSON.stringify(
      b.nomes
    ) ===
      JSON.stringify([

        "God Hand",
        "Power Shield"

      ]) &&

    b.segredos ===
      1 &&

    b.total ===
      3;


  const parserJaponesOk =

    JSON.stringify(
      c.nomes
    ) ===
      JSON.stringify([

        "ファイアトルネード",
        "竜巻落とし"

      ]) &&

    c.segredos ===
      1 &&

    c.total ===
      3;


  /*
    Nomes oficiais repetidos precisam
    gerar IDs diferentes.
  */

  const duplicadosTeste =
    atribuirIds(

      [

        {

          segredoOficial:
            false,

          ingles:
            "Heart's Desire",

          japones:
            "A",

          tipo:
            "chute",

          categoriaOficial:
            "Shot",

          categoriaOficialJp:
            "シュート"

        },


        {

          segredoOficial:
            false,

          ingles:
            "Heart's Desire",

          japones:
            "B",

          tipo:
            "chute",

          categoriaOficial:
            "Shot",

          categoriaOficialJp:
            "シュート"

        }

      ],

      new Map()

    );


  const nomesRepetidosIdsOk =

    duplicadosTeste[0].id !==
      duplicadosTeste[1].id &&

    duplicadosTeste[0].ingles ===
      duplicadosTeste[1].ingles;


  const ok =

    parserInglesOk &&
    parserGoalOk &&
    parserJaponesOk &&
    nomesRepetidosIdsOk;


  console.log(
    "\n=== SELF TEST v2 ===\n"
  );


  console.log(
    "SHOT EN:",
    a
  );


  console.log(
    "GOALKEEP:",
    b
  );


  console.log(
    "SHOT JP:",
    c
  );


  console.log(

    "IDS NOME REPETIDO:",

    duplicadosTeste.map(
      item =>
        item.id
    )

  );


  console.log(
    ""
  );


  console.log(

    parserInglesOk

      ? "OK - nomes + segredo ingles"

      : "ERRO - nomes + segredo ingles"

  );


  console.log(

    parserGoalOk

      ? "OK - nomes + segredo goalkeep"

      : "ERRO - nomes + segredo goalkeep"

  );


  console.log(

    parserJaponesOk

      ? "OK - ruby + segredo japones"

      : "ERRO - ruby + segredo japones"

  );


  console.log(

    nomesRepetidosIdsOk

      ? "OK - nomes repetidos com IDs unicos"

      : "ERRO - nomes repetidos"

  );


  console.log(
    ""
  );


  console.log(

    ok
      ? "SELF TEST: OK"
      : "SELF TEST: ERRO"

  );


  if (!ok) {

    process.exitCode =
      1;

  }

}


/* ========================================
   MAIN
======================================== */


async function main() {

  await garantirDiretorios();


  if (
    !fs.existsSync(
      ARQUIVO_BANCO_ATUAL
    )
  ) {

    throw new Error(
      "Não encontrei src/features/habilidades/data/bancoHissatsuSuperOnze.js."
    );

  }


  console.log(
    "\n========================================"
  );


  console.log(
    "MIGRAÇÃO BANCO HISSATSU — 315 -> 903 v2"
  );


  console.log(
    "========================================\n"
  );


  console.log(
    "Carregando o banco atual..."
  );


  const moduloAtual =
    await import(

      pathToFileURL(
        ARQUIVO_BANCO_ATUAL
      ).href +

      "?antes903=" +

      Date.now()

    );


  const bancoAntigo =
    lista(
      moduloAtual
        .bancoHissatsuSuperOnze
    );


  if (
    !bancoAntigo.length
  ) {

    throw new Error(
      "O banco atual foi importado, mas está vazio."
    );

  }


  console.log(

    "Banco atual: " +
    bancoAntigo.length +
    " registros."

  );


  await salvarJson(
    ARQUIVO_SNAPSHOT,
    bancoAntigo
  );


  /* ======================================
     CATÁLOGO OFICIAL
  ====================================== */


  const oficial =
    await baixarCatalogoOficial903();


  /* ======================================
     MIGRAR IDs/DADOS ANTIGOS
  ====================================== */


  const indiceLegado =
    indexarLegado(
      bancoAntigo
    );


  const oficiaisComId =
    atribuirIds(
      oficial.registros,
      indiceLegado
    );


  /* ======================================
     IMAGENS
  ====================================== */


  const imagens =
    await prepararImagensEmLote(
      oficiaisComId
    );


  /* ======================================
     BANCO NOVO
  ====================================== */


  const bancoNovo =
    oficiaisComId.map(
      (
        item,
        indice
      ) =>
        criarRegistroFinal(

          item,

          imagens[
            indice
          ]

        )
    );


  /* ======================================
     VALIDAR ANTES DE ESCREVER
  ====================================== */


  const validacao =
    validarFinal(
      bancoNovo
    );


  console.log(
    "\n=== VALIDAÇÃO ANTES DE SUBSTITUIR ===\n"
  );


  console.log(

    "TOTAL: " +
    validacao
      .resumo
      .total

  );


  console.log(

    "IDS ÚNICOS: " +
    validacao
      .resumo
      .idsUnicos

  );


  console.log(

    "NOMEADAS: " +
    validacao
      .resumo
      .nomeados

  );


  console.log(

    "SEGREDOS OFICIAIS: " +
    validacao
      .resumo
      .segredos

  );


  console.log(

    "TIPOS:",

    validacao
      .resumo
      .porTipo

  );


  if (
    !validacao.passou
  ) {

    console.error(
      "\nMIGRAÇÃO ABORTADA. O banco atual NÃO foi substituído."
    );


    for (
      const erro of
      validacao.erros.slice(
        0,
        80
      )
    ) {

      console.error(
        "- " +
        erro
      );

    }


    process.exitCode =
      1;


    return;

  }


  /* ======================================
     RELATÓRIO
  ====================================== */


  const relatorio =
    criarRelatorio(

      bancoAntigo,

      bancoNovo,

      oficial.diagnostico

    );


  await salvarJson(
    ARQUIVO_RELATORIO,
    relatorio
  );


  /* ======================================
     BACKUP
  ====================================== */


  if (
    !fs.existsSync(
      ARQUIVO_BACKUP
    )
  ) {

    await fsp.copyFile(
      ARQUIVO_BANCO_ATUAL,
      ARQUIVO_BACKUP
    );

  }


  /* ======================================
     ESCREVER 903
  ====================================== */


  await fsp.writeFile(

    ARQUIVO_CATALOGO,

    codigoCatalogo(
      bancoNovo
    ),

    "utf8"

  );


  await fsp.writeFile(

    ARQUIVO_BANCO_ATUAL,

    codigoAdapter(),

    "utf8"

  );


  await fsp.writeFile(

    ARQUIVO_AUDITORIA,

    codigoAuditoria903(),

    "utf8"

  );


  console.log(
    "\n========================================"
  );


  console.log(
    "MIGRAÇÃO 903 GERADA COM SUCESSO"
  );


  console.log(
    "========================================\n"
  );


  console.log(
    "Agora execute:"
  );


  console.log(
    "node .\\auditarBancoHissatsu903.mjs"
  );


  console.log(
    ""
  );

}


/* ========================================
   EXECUÇÃO
======================================== */


if (
  process.argv.includes(
    "--self-test"
  )
) {

  selfTest();

} else {

  main()

    .catch(
      erro => {

        console.error(
          "\nERRO NA MIGRAÇÃO 903:"
        );


        console.error(
          erro?.stack ||
          erro
        );


        console.error(
          "\nO banco principal só é substituído após a validação estrutural."
        );


        process.exitCode =
          1;

      }
    );

}
