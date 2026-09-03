import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

import {
  bancoHissatsuFactual,
  obterTodosOsNomesHissatsu
} from "../src/features/habilidades/data/bancoHissatsuSuperOnze.js";


/* ========================================
   CANDIDATOS VISUAIS DE HISSATSU

   VERSÃO 1.0 — CAMADA ISOLADA

   OBJETIVO

   Criar um conjunto de alternativas visuais
   para Hissatsu que ainda estão em revisão
   ou rejeitadas, sem tocar na imagem que o
   RPG já exibe.

   Esta camada NÃO:

   - altera o Banco factual;
   - altera mecânica;
   - altera o manifesto final;
   - altera o lote de imagens;
   - altera IMAGENS_HISSATSU_PROPOSTAS.json;
   - altera a curadoria;
   - aplica decisões humanas.

   Ela apenas:

   - procura várias candidatas;
   - valida os bytes reais;
   - salva alternativas em pasta isolada;
   - gera metadados para futura curadoria.

   IMPORTANTE

   Nesta versão ainda NÃO existe análise
   semântica dos pixels e NÃO há OCR.

   Portanto o script não afirma que viu
   kanji, nome da técnica ou o ápice da
   execução dentro da imagem.

   A pontuação atual é apenas um filtro por
   metadados para produzir um conjunto melhor
   de imagens que será avaliado visualmente
   na próxima camada.
======================================== */


const ARQUIVO_ATUAL =
  fileURLToPath(
    import.meta.url
  );


const PASTA_SCRIPTS =
  path.dirname(
    ARQUIVO_ATUAL
  );


const RAIZ_PROJETO =
  path.resolve(
    PASTA_SCRIPTS,
    ".."
  );


const PASTA_PUBLIC =
  path.join(
    RAIZ_PROJETO,
    "public"
  );


const PASTA_CANDIDATOS =
  path.join(
    PASTA_PUBLIC,
    "assets",
    "hissatsu",
    "candidatos-visuais"
  );


const PASTA_DOCUMENTACAO =
  path.join(
    RAIZ_PROJETO,
    "documentacao"
  );


const ARQUIVO_CURADORIA =
  path.join(
    PASTA_DOCUMENTACAO,
    "IMAGENS_HISSATSU_CURADORIA.json"
  );


const ARQUIVO_MANIFESTO =
  path.join(
    PASTA_DOCUMENTACAO,
    "IMAGENS_HISSATSU_MANIFESTO.json"
  );


const ARQUIVO_PROPOSTAS_ATUAIS =
  path.join(
    PASTA_DOCUMENTACAO,
    "IMAGENS_HISSATSU_PROPOSTAS.json"
  );


const ARQUIVO_SAIDA =
  path.join(
    PASTA_DOCUMENTACAO,
    "IMAGENS_HISSATSU_CANDIDATOS_VISUAIS.json"
  );


const ARQUIVO_RELATORIO =
  path.join(
    PASTA_DOCUMENTACAO,
    "RELATORIO_CANDIDATOS_VISUAIS_HISSATSU.md"
  );


const API_WIKI =
  "https://inazuma-eleven.fandom.com/api.php";


const BASE_WIKI =
  "https://inazuma-eleven.fandom.com/wiki/";


const INTERVALO_REQUISICOES_MS =
  300;


const MAX_CANDIDATOS_POR_HISSATSU =
  Math.max(
    1,
    Number(
      process.env.HISSATSU_CANDIDATOS_POR_ID ||
      4
    ) || 4
  );


const LIMITE_HISSATSU =
  Math.max(
    0,
    Number(
      process.env.HISSATSU_CANDIDATOS_LIMITE ||
      0
    ) || 0
  );


const LARGURA_MINIMA =
  360;


const ALTURA_MINIMA =
  200;


const PROPORCAO_MINIMA =
  0.8;


const PROPORCAO_MAXIMA =
  2.8;


const MIMES_IMAGEM =
  new Set([
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif"
  ]);


const TERMOS_REJEICAO_DURA = [
  "icon",
  "icone",
  "sprite",
  "logo",
  "portrait",
  "profile",
  "headshot",
  "render",
  "artwork",
  "character",
  "card",
  "trading card",
  "manga",
  "manual",
  "menu",
  "skill icon",
  "skill-icon",
  "concept",
  "notebook",
  "caderno"
];


const TERMOS_INDICIO_ANIME = [
  "anime",
  "episode",
  "episodio",
  "hissatsu",
  "technique"
];


const TERMOS_INDICIO_JOGO = [
  "victory road",
  "strikers",
  "3ds",
  "nds",
  "game screenshot",
  "gameplay"
];


const PALAVRAS_IGNORADAS =
  new Set([
    "the",
    "of",
    "and",
    "no",
    "da",
    "de",
    "do",
    "dos",
    "das",
    "a",
    "o",
    "e"
  ]);


/* ========================================
   UTILIDADES
======================================== */

function texto(
  valor
) {
  return String(
    valor ?? ""
  ).trim();
}


function esperar(
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


function normalizarParaComparacao(
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
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      " "
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim();
}


function slugWiki(
  titulo
) {
  return encodeURIComponent(
    texto(
      titulo
    ).replace(
      / /g,
      "_"
    )
  );
}


function urlPaginaWiki(
  titulo
) {
  return (
    BASE_WIKI +
    slugWiki(
      titulo
    )
  );
}


function hashCurto(
  valor
) {
  return crypto
    .createHash(
      "sha1"
    )
    .update(
      texto(
        valor
      )
    )
    .digest(
      "hex"
    )
    .slice(
      0,
      10
    );
}


async function existe(
  caminho
) {
  try {
    await fs.access(
      caminho
    );

    return true;

  } catch {
    return false;
  }
}


async function lerJsonSeguro(
  caminho,
  fallback
) {
  if (
    !await existe(
      caminho
    )
  ) {
    return fallback;
  }


  try {
    return JSON.parse(
      await fs.readFile(
        caminho,
        "utf8"
      )
    );

  } catch {
    return fallback;
  }
}


function converterCaminhoParaUrlPublica(
  caminho
) {
  const relativo =
    path.relative(
      PASTA_PUBLIC,
      caminho
    );


  return (
    "/" +
    relativo
      .split(
        path.sep
      )
      .join("/")
  );
}


function palavrasSignificativas(
  nome
) {
  return normalizarParaComparacao(
    nome
  )
    .split(" ")
    .filter(
      palavra =>
        palavra.length >= 2 &&
        !PALAVRAS_IGNORADAS.has(
          palavra
        )
    );
}


/* ========================================
   VALIDAÇÃO REAL DE IMAGEM
======================================== */

function detectarFormatoImagemBuffer(
  buffer
) {
  if (
    !Buffer.isBuffer(
      buffer
    ) ||
    buffer.length < 12
  ) {
    return null;
  }


  if (
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return {
      formato: "jpeg",
      mime: "image/jpeg",
      extensao: ".jpg"
    };
  }


  const assinaturaPng =
    Buffer.from([
      0x89,
      0x50,
      0x4e,
      0x47,
      0x0d,
      0x0a,
      0x1a,
      0x0a
    ]);


  if (
    buffer
      .subarray(
        0,
        8
      )
      .equals(
        assinaturaPng
      )
  ) {
    return {
      formato: "png",
      mime: "image/png",
      extensao: ".png"
    };
  }


  const gif =
    buffer
      .subarray(
        0,
        6
      )
      .toString(
        "ascii"
      );


  if (
    gif === "GIF87a" ||
    gif === "GIF89a"
  ) {
    return {
      formato: "gif",
      mime: "image/gif",
      extensao: ".gif"
    };
  }


  const riff =
    buffer
      .subarray(
        0,
        4
      )
      .toString(
        "ascii"
      );


  const webp =
    buffer
      .subarray(
        8,
        12
      )
      .toString(
        "ascii"
      );


  if (
    riff === "RIFF" &&
    webp === "WEBP"
  ) {
    return {
      formato: "webp",
      mime: "image/webp",
      extensao: ".webp"
    };
  }


  const ftyp =
    buffer
      .subarray(
        4,
        8
      )
      .toString(
        "ascii"
      );


  const marca =
    buffer
      .subarray(
        8,
        12
      )
      .toString(
        "ascii"
      );


  if (
    ftyp === "ftyp" &&
    (
      marca === "avif" ||
      marca === "avis"
    )
  ) {
    return {
      formato: "avif",
      mime: "image/avif",
      extensao: ".avif"
    };
  }


  return null;
}


/* ========================================
   NOMES E RELAÇÃO
======================================== */

function nomesPesquisaRegistro(
  registro
) {
  const nomesNormalizados =
    registro?.nomes ||
    {};


  const nomes = [
    nomesNormalizados.original,
    registro?.nomeOriginal,
    registro?.nome,
    nomesNormalizados.japonesRomanizado,
    registro?.japonesRomanizado,

    ...obterTodosOsNomesHissatsu(
      registro
    )
  ]
    .map(
      texto
    )
    .filter(
      Boolean
    );


  return [
    ...new Set(
      nomes
    )
  ];
}


function analisarRelacaoNome({
  tituloArquivo,
  nomes
}) {
  const arquivoNormalizado =
    normalizarParaComparacao(
      texto(
        tituloArquivo
      ).replace(
        /^File:/i,
        ""
      )
    );


  let melhor = {
    nome: "",
    fraseCompleta: false,
    cobertura: 0,
    totalPalavras: 0,
    palavrasEncontradas: 0
  };


  for (
    const nome of
    nomes
  ) {
    const nomeNormalizado =
      normalizarParaComparacao(
        nome
      );


    if (
      !nomeNormalizado
    ) {
      continue;
    }


    const palavras =
      palavrasSignificativas(
        nome
      );


    const encontradas =
      palavras.filter(
        palavra =>
          arquivoNormalizado.includes(
            palavra
          )
      ).length;


    const cobertura =
      palavras.length > 0
        ? encontradas /
          palavras.length
        : 0;


    const fraseCompleta =
      arquivoNormalizado.includes(
        nomeNormalizado
      );


    if (
      (
        fraseCompleta &&
        !melhor.fraseCompleta
      ) ||
      (
        fraseCompleta ===
          melhor.fraseCompleta &&
        cobertura >
          melhor.cobertura
      )
    ) {
      melhor = {
        nome,
        fraseCompleta,
        cobertura,
        totalPalavras:
          palavras.length,
        palavrasEncontradas:
          encontradas
      };
    }
  }


  return melhor;
}


/* ========================================
   CURADORIA EXISTENTE
======================================== */

function obterRegraCuradoria({
  id,
  curadoria
}) {
  const registro =
    curadoria
      ?.registros
      ?.[id] ||
    null;


  const estado =
    texto(
      registro?.estado
    ) ||
    texto(
      curadoria?.estadoPadrao
    ) ||
    "revisar";


  return {
    estado,

    imagemAtual:
      texto(
        registro?.imagemAtual
      ),

    candidatoAtual:
      texto(
        registro?.candidatoAtual
      ),

    candidatosRejeitados:
      Array.isArray(
        registro?.candidatosRejeitados
      )
        ? registro.candidatosRejeitados
        : []
  };
}


function criarMapaPropostasAtuais(
  propostas
) {
  const mapa =
    new Map();


  for (
    const proposta of
    Array.isArray(
      propostas
    )
      ? propostas
      : []
  ) {
    const id =
      texto(
        proposta?.id
      );


    if (
      id
    ) {
      mapa.set(
        id,
        proposta
      );
    }
  }


  return mapa;
}


function obterTitulosBloqueados({
  regraCuradoria,
  manifestoAnterior,
  propostaAtual
}) {
  const bloqueados =
    new Set();


  const adicionar =
    valor => {
      const normalizado =
        normalizarParaComparacao(
          valor
        );


      if (
        normalizado
      ) {
        bloqueados.add(
          normalizado
        );
      }
    };


  for (
    const item of
    regraCuradoria
      .candidatosRejeitados
  ) {
    adicionar(
      item?.tituloArquivo
    );
  }


  adicionar(
    regraCuradoria.candidatoAtual
  );


  adicionar(
    manifestoAnterior
      ?.tituloArquivo
  );


  adicionar(
    propostaAtual
      ?.tituloArquivo
  );


  return bloqueados;
}


/* ========================================
   HTTP
======================================== */

async function requisitarJson(
  url,
  tentativa = 1
) {
  const resposta =
    await fetch(
      url,
      {
        headers: {
          "Accept":
            "application/json",

          "User-Agent":
            "RPG-Manager-Hissatsu-Candidatos/1.0"
        }
      }
    );


  if (
    resposta.status === 429 &&
    tentativa < 5
  ) {
    await esperar(
      1000 *
      tentativa
    );


    return requisitarJson(
      url,
      tentativa + 1
    );
  }


  if (
    !resposta.ok
  ) {
    throw new Error(
      `HTTP ${resposta.status}`
    );
  }


  return resposta.json();
}


/* ========================================
   PÁGINA DA HISSATSU
======================================== */

async function consultarTituloDireto(
  nome
) {
  const parametros =
    new URLSearchParams({
      action: "query",
      prop: "info",
      titles: nome,
      redirects: "1",
      format: "json",
      origin: "*"
    });


  const dados =
    await requisitarJson(
      `${API_WIKI}?${parametros.toString()}`
    );


  const paginas =
    Object.values(
      dados?.query?.pages ||
      {}
    );


  const pagina =
    paginas[0];


  if (
    !pagina ||
    Object.prototype
      .hasOwnProperty
      .call(
        pagina,
        "missing"
      )
  ) {
    return null;
  }


  return {
    titulo:
      texto(
        pagina.title
      ),

    pontos:
      200,

    criterio:
      "titulo-direto"
  };
}


function pontuarTituloPagina({
  titulo,
  nome
}) {
  const tituloN =
    normalizarParaComparacao(
      titulo
    );


  const nomeN =
    normalizarParaComparacao(
      nome
    );


  if (
    !tituloN ||
    !nomeN
  ) {
    return -100;
  }


  let pontos =
    0;


  if (
    tituloN ===
    nomeN
  ) {
    pontos +=
      100;

  } else if (
    tituloN.startsWith(
      nomeN
    )
  ) {
    pontos +=
      60;

  } else if (
    tituloN.includes(
      nomeN
    )
  ) {
    pontos +=
      40;
  }


  const palavras =
    palavrasSignificativas(
      nome
    );


  pontos +=
    palavras.filter(
      palavra =>
        tituloN.includes(
          palavra
        )
    ).length *
    6;


  if (
    [
      "category ",
      "list of ",
      "user ",
      "template ",
      "file "
    ].some(
      prefixo =>
        tituloN.startsWith(
          prefixo
        )
    )
  ) {
    pontos -=
      80;
  }


  return pontos;
}


async function pesquisarPaginaWiki(
  nomes
) {
  for (
    const nome of
    nomes
  ) {
    try {
      const direta =
        await consultarTituloDireto(
          nome
        );


      if (
        direta?.titulo
      ) {
        return {
          ...direta,

          nomeConsultado:
            nome
        };
      }

    } catch {
      // Continua para as alternativas.
    }


    await esperar(
      INTERVALO_REQUISICOES_MS
    );
  }


  let melhor =
    null;


  for (
    const nome of
    nomes
  ) {
    const parametros =
      new URLSearchParams({
        action: "query",
        list: "search",
        srsearch: nome,
        srlimit: "10",
        format: "json",
        origin: "*"
      });


    const dados =
      await requisitarJson(
        `${API_WIKI}?${parametros.toString()}`
      );


    const resultados =
      Array.isArray(
        dados
          ?.query
          ?.search
      )
        ? dados.query.search
        : [];


    for (
      const resultado of
      resultados
    ) {
      const pontos =
        pontuarTituloPagina({
          titulo:
            resultado.title,

          nome
        });


      if (
        !melhor ||
        pontos >
          melhor.pontos
      ) {
        melhor = {
          titulo:
            resultado.title,

          nomeConsultado:
            nome,

          criterio:
            "busca-textual",

          pontos
        };
      }
    }


    if (
      melhor?.pontos >=
      100
    ) {
      break;
    }


    await esperar(
      INTERVALO_REQUISICOES_MS
    );
  }


  if (
    !melhor ||
    melhor.pontos <
      18
  ) {
    return null;
  }


  return melhor;
}


/* ========================================
   CANDIDATAS DA PÁGINA
======================================== */

function avaliarCandidata({
  tituloArquivo,
  largura,
  altura,
  mime,
  nomes,
  titulosBloqueados
}) {
  const tituloN =
    normalizarParaComparacao(
      tituloArquivo
    );


  const mimeN =
    texto(
      mime
    )
      .toLowerCase()
      .split(";")[0];


  const relacao =
    analisarRelacaoNome({
      tituloArquivo,
      nomes
    });


  const w =
    Number(
      largura
    ) ||
    0;


  const h =
    Number(
      altura
    ) ||
    0;


  const proporcao =
    w > 0 &&
    h > 0
      ? w / h
      : 0;


  const dimensaoUtil =
    w >= LARGURA_MINIMA &&
    h >= ALTURA_MINIMA;


  const proporcaoUtil =
    proporcao >=
      PROPORCAO_MINIMA &&
    proporcao <=
      PROPORCAO_MAXIMA;


  const mimeValido =
    MIMES_IMAGEM.has(
      mimeN
    );


  const bloqueada =
    titulosBloqueados.has(
      normalizarParaComparacao(
        tituloArquivo
      )
    );


  const termoRejeicao =
    TERMOS_REJEICAO_DURA.find(
      termo =>
        tituloN.includes(
          normalizarParaComparacao(
            termo
          )
        )
    ) ||
    "";


  const indicioAnime =
    TERMOS_INDICIO_ANIME.some(
      termo =>
        tituloN.includes(
          normalizarParaComparacao(
            termo
          )
        )
    );


  const indicioJogo =
    TERMOS_INDICIO_JOGO.some(
      termo =>
        tituloN.includes(
          normalizarParaComparacao(
            termo
          )
        )
    );


  const relacaoForte =
    relacao.fraseCompleta ||
    (
      relacao.totalPalavras >=
        2 &&
      relacao.cobertura >=
        0.66
    ) ||
    (
      relacao.totalPalavras ===
        1 &&
      relacao.cobertura ===
        1
    );


  let pontos =
    0;


  if (
    relacao.fraseCompleta
  ) {
    pontos +=
      55;
  }


  pontos +=
    Math.round(
      relacao.cobertura *
      30
    );


  if (
    indicioAnime
  ) {
    pontos +=
      18;
  }


  /*
    Jogo não é mais rejeição automática.

    Pela política visual atual, uma imagem
    de jogo clara pode ser um bom fallback.
  */

  if (
    indicioJogo
  ) {
    pontos -=
      8;
  }


  if (
    dimensaoUtil
  ) {
    pontos +=
      14;

  } else {
    pontos -=
      30;
  }


  if (
    proporcaoUtil
  ) {
    pontos +=
      8;

  } else {
    pontos -=
      18;
  }


  if (
    w >= 900 &&
    h >= 450
  ) {
    pontos +=
      5;
  }


  if (
    termoRejeicao
  ) {
    pontos -=
      100;
  }


  if (
    bloqueada
  ) {
    pontos -=
      1000;
  }


  if (
    !mimeValido
  ) {
    pontos -=
      1000;
  }


  const elegivel =
    mimeValido &&
    !bloqueada &&
    !termoRejeicao &&
    relacaoForte &&
    dimensaoUtil &&
    proporcaoUtil;


  /*
    ATENÇÃO:

    Isto é somente um indicador baseado
    em metadados. Não significa que o
    script analisou visualmente a imagem.
  */

  let indicadorMetadados =
    "fallback";


  if (
    relacao.fraseCompleta &&
    indicioAnime &&
    w >= 640 &&
    h >= 320
  ) {
    indicadorMetadados =
      "forte";

  } else if (
    relacaoForte &&
    dimensaoUtil
  ) {
    indicadorMetadados =
      "medio";
  }


  return {
    elegivel,
    pontos,
    indicadorMetadados,
    indicioAnime,
    indicioJogo,
    relacao,

    largura:
      w,

    altura:
      h,

    mime:
      mimeN,

    termoRejeicao,
    bloqueada
  };
}


async function buscarCandidatasPagina({
  tituloPagina,
  nomes,
  titulosBloqueados
}) {
  const parametros =
    new URLSearchParams({
      action: "query",
      generator: "images",
      titles: tituloPagina,
      gimlimit: "100",
      prop: "imageinfo",
      iiprop: "url|size|mime",
      format: "json",
      origin: "*"
    });


  const dados =
    await requisitarJson(
      `${API_WIKI}?${parametros.toString()}`
    );


  const paginas =
    Object.values(
      dados?.query?.pages ||
      {}
    );


  return paginas
    .map(
      pagina => {
        const info =
          pagina
            ?.imageinfo
            ?.[0];


        if (
          !info?.url
        ) {
          return null;
        }


        const avaliacao =
          avaliarCandidata({
            tituloArquivo:
              pagina.title ||
              "",

            largura:
              info.width,

            altura:
              info.height,

            mime:
              info.mime,

            nomes,
            titulosBloqueados
          });


        return {
          tituloArquivo:
            pagina.title ||
            "",

          urlRemota:
            info.url,

          ...avaliacao
        };
      }
    )
    .filter(
      item =>
        item?.elegivel
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
   DOWNLOAD ISOLADO
======================================== */

async function baixarCandidata({
  id,
  candidata
}) {
  const resposta =
    await fetch(
      candidata.urlRemota,
      {
        headers: {
          "Accept":
            "image/avif,image/webp,image/png,image/jpeg,image/gif,*/*;q=0.8",

          "User-Agent":
            "Mozilla/5.0 RPG-Manager-Hissatsu-Candidatos/1.0"
        }
      }
    );


  if (
    !resposta.ok
  ) {
    throw new Error(
      `HTTP ${resposta.status}`
    );
  }


  const mimeResposta =
    texto(
      resposta.headers.get(
        "content-type"
      )
    )
      .toLowerCase()
      .split(";")[0];


  if (
    mimeResposta &&
    !MIMES_IMAGEM.has(
      mimeResposta
    )
  ) {
    throw new Error(
      `Content-Type não é imagem: ${mimeResposta}`
    );
  }


  const buffer =
    Buffer.from(
      await resposta
        .arrayBuffer()
    );


  if (
    buffer.length <
      4096
  ) {
    throw new Error(
      "arquivo pequeno demais"
    );
  }


  const formatoReal =
    detectarFormatoImagemBuffer(
      buffer
    );


  if (
    !formatoReal
  ) {
    throw new Error(
      "bytes internos não correspondem a uma imagem suportada"
    );
  }


  const pastaId =
    path.join(
      PASTA_CANDIDATOS,
      id
    );


  await fs.mkdir(
    pastaId,
    {
      recursive:
        true
    }
  );


  /*
    Nome estável por origem.

    A mesma candidata não é sobrescrita
    arbitrariamente por outra em nova
    execução.
  */

  const hash =
    hashCurto(
      `${candidata.tituloArquivo}|${candidata.urlRemota}`
    );


  const nomeArquivo =
    `${id}__${hash}${formatoReal.extensao}`;


  const caminho =
    path.join(
      pastaId,
      nomeArquivo
    );


  if (
    !await existe(
      caminho
    )
  ) {
    await fs.writeFile(
      caminho,
      buffer
    );
  }


  return {
    urlLocal:
      converterCaminhoParaUrlPublica(
        caminho
      ),

    formatoReal:
      formatoReal.formato,

    mimeReal:
      formatoReal.mime,

    bytes:
      buffer.length
  };
}


/* ========================================
   PROCESSAMENTO POR HISSATSU
======================================== */

async function processarRegistro({
  registro,
  curadoria,
  manifestoAnterior,
  propostaAtual
}) {
  const id =
    texto(
      registro?.id
    );


  const nome =
    texto(
      registro?.nome
    ) ||
    id;


  const regraCuradoria =
    obterRegraCuradoria({
      id,
      curadoria
    });


  /*
    Imagens já aprovadas ficam totalmente
    fora desta busca.

    Não estamos tentando substituir aquilo
    que já foi validado.
  */

  if (
    regraCuradoria.estado ===
      "aprovada"
  ) {
    return {
      id,
      nome,

      estadoCuradoria:
        "aprovada",

      ignorada:
        true,

      motivo:
        "Imagem já aprovada; nenhuma alternativa automática foi buscada.",

      candidatos:
        []
    };
  }


  const nomes =
    nomesPesquisaRegistro(
      registro
    );


  const titulosBloqueados =
    obterTitulosBloqueados({
      regraCuradoria,
      manifestoAnterior,
      propostaAtual
    });


  let pagina;


  try {
    pagina =
      await pesquisarPaginaWiki(
        nomes
      );

  } catch (
    erro
  ) {
    return {
      id,
      nome,

      estadoCuradoria:
        regraCuradoria.estado,

      ignorada:
        false,

      motivo:
        `Falha pesquisando página: ${erro.message}`,

      candidatos:
        []
    };
  }


  if (
    !pagina
  ) {
    return {
      id,
      nome,

      estadoCuradoria:
        regraCuradoria.estado,

      ignorada:
        false,

      motivo:
        "Nenhuma página compatível encontrada.",

      candidatos:
        []
    };
  }


  await esperar(
    INTERVALO_REQUISICOES_MS
  );


  let candidatas;


  try {
    candidatas =
      await buscarCandidatasPagina({
        tituloPagina:
          pagina.titulo,

        nomes,
        titulosBloqueados
      });

  } catch (
    erro
  ) {
    return {
      id,
      nome,

      estadoCuradoria:
        regraCuradoria.estado,

      paginaWiki:
        pagina.titulo,

      fonteUrl:
        urlPaginaWiki(
          pagina.titulo
        ),

      ignorada:
        false,

      motivo:
        `Falha buscando imagens: ${erro.message}`,

      candidatos:
        []
    };
  }


  const baixados =
    [];


  /*
    Não usamos apenas as quatro primeiras
    antes do download.

    Se uma candidata estiver corrompida,
    continuamos procurando até obter até
    quatro arquivos realmente válidos.
  */

  for (
    const candidata of
    candidatas
  ) {
    if (
      baixados.length >=
        MAX_CANDIDATOS_POR_HISSATSU
    ) {
      break;
    }


    try {
      const arquivo =
        await baixarCandidata({
          id,
          candidata
        });


      baixados.push({
        ordem:
          baixados.length +
          1,

        tituloArquivo:
          candidata.tituloArquivo,

        urlRemota:
          candidata.urlRemota,

        urlLocal:
          arquivo.urlLocal,

        pontosMetadados:
          candidata.pontos,

        indicadorMetadados:
          candidata.indicadorMetadados,

        indicioAnime:
          candidata.indicioAnime,

        indicioJogo:
          candidata.indicioJogo,

        largura:
          candidata.largura,

        altura:
          candidata.altura,

        mimeOriginal:
          candidata.mime,

        formatoReal:
          arquivo.formatoReal,

        mimeReal:
          arquivo.mimeReal,

        bytes:
          arquivo.bytes,

        relacaoNome:
          candidata.relacao
      });

    } catch {
      /*
        Arquivo inválido não entra no pool.
        Continuamos com a próxima candidata.
      */
    }


    await esperar(
      INTERVALO_REQUISICOES_MS
    );
  }


  return {
    id,
    nome,

    estadoCuradoria:
      regraCuradoria.estado,

    ignorada:
      false,

    paginaWiki:
      pagina.titulo,

    fonteUrl:
      urlPaginaWiki(
        pagina.titulo
      ),

    propostaAtual:
      propostaAtual
        ? {
            tituloArquivo:
              texto(
                propostaAtual
                  .tituloArquivo
              ),

            urlLocal:
              texto(
                propostaAtual
                  .urlLocal
              )
          }
        : null,

    motivo:
      baixados.length > 0
        ? "Candidatos isolados gerados para avaliação visual."
        : "Nenhuma alternativa elegível foi baixada.",

    candidatos:
      baixados
  };
}


/* ========================================
   RELATÓRIO
======================================== */

function gerarRelatorio({
  totalBanco,
  processados,
  resultados
}) {
  const ativos =
    resultados.filter(
      item =>
        !item.ignorada
    );


  const comCandidatos =
    ativos.filter(
      item =>
        item.candidatos.length >
        0
    );


  const semCandidatos =
    ativos.filter(
      item =>
        item.candidatos.length ===
        0
    );


  const totalCandidatos =
    resultados.reduce(
      (
        total,
        item
      ) =>
        total +
        item.candidatos.length,
      0
    );


  const linhas = [
    "# Relatório — candidatos visuais de Hissatsu",
    "",

    `Gerado em: ${new Date().toISOString()}`,
    "",

    `- Banco factual: ${totalBanco}`,
    `- Hissatsu processadas nesta execução: ${processados}`,
    `- Hissatsu não aprovadas analisadas: ${ativos.length}`,
    `- Hissatsu com alternativas: ${comCandidatos.length}`,
    `- Hissatsu sem alternativa: ${semCandidatos.length}`,
    `- Arquivos candidatos isolados: ${totalCandidatos}`,
    "",

    "## Importante",
    "",

    "Esta camada não altera a imagem exibida no RPG. A pontuação é baseada em metadados e não confirma visualmente kanji, nome na tela, ápice da execução ou clareza da técnica.",

    "",

    "## Resultados",
    ""
  ];


  for (
    const item of
    ativos
  ) {
    linhas.push(
      `### ${item.nome || item.id}`,
      "",

      `- ID: \`${item.id}\``,

      `- Estado: ${item.estadoCuradoria}`,

      `- Página: ${item.fonteUrl || "—"}`,

      `- Alternativas: ${item.candidatos.length}`,

      ""
    );


    for (
      const candidato of
      item.candidatos
    ) {
      linhas.push(
        `  - ${candidato.ordem}. \`${candidato.urlLocal}\` — ${candidato.indicadorMetadados} — ${candidato.pontosMetadados} pts — ${candidato.tituloArquivo}`
      );
    }


    linhas.push(
      ""
    );
  }


  return linhas.join(
    "\n"
  );
}


/* ========================================
   EXECUÇÃO
======================================== */

async function main() {
  await fs.mkdir(
    PASTA_CANDIDATOS,
    {
      recursive:
        true
    }
  );


  await fs.mkdir(
    PASTA_DOCUMENTACAO,
    {
      recursive:
        true
    }
  );


  const curadoria =
    await lerJsonSeguro(
      ARQUIVO_CURADORIA,
      {
        estadoPadrao:
          "revisar",

        registros:
          {}
      }
    );


  const manifesto =
    await lerJsonSeguro(
      ARQUIVO_MANIFESTO,
      {}
    );


  const propostasAtuais =
    await lerJsonSeguro(
      ARQUIVO_PROPOSTAS_ATUAIS,
      []
    );


  const mapaPropostas =
    criarMapaPropostasAtuais(
      propostasAtuais
    );


  const banco =
    Array.isArray(
      bancoHissatsuFactual
    )
      ? bancoHissatsuFactual
      : [];


  const registros =
    LIMITE_HISSATSU >
      0
      ? banco.slice(
          0,
          LIMITE_HISSATSU
        )
      : banco;


  const resultados =
    [];


  console.log(
    `Banco factual: ${banco.length}`
  );


  console.log(
    `Registros avaliados nesta execução: ${registros.length}`
  );


  console.log(
    `Máximo de candidatos por Hissatsu: ${MAX_CANDIDATOS_POR_HISSATSU}`
  );


  console.log(
    "Camada isolada: nenhuma imagem exibida será alterada."
  );


  console.log(
    ""
  );


  for (
    let indice = 0;
    indice <
      registros.length;
    indice +=
      1
  ) {
    const registro =
      registros[
        indice
      ];


    const id =
      texto(
        registro?.id
      );


    const nome =
      texto(
        registro?.nome
      ) ||
      id ||
      `registro-${indice + 1}`;


    process.stdout.write(
      `[${indice + 1}/${registros.length}] ${nome} ... `
    );


    const resultado =
      await processarRegistro({
        registro,
        curadoria,

        manifestoAnterior:
          manifesto[id] ||
          {},

        propostaAtual:
          mapaPropostas.get(
            id
          ) ||
          null
      });


    resultados.push(
      resultado
    );


    if (
      resultado.ignorada
    ) {
      console.log(
        "aprovada · ignorada"
      );

    } else if (
      resultado.candidatos.length >
        0
    ) {
      console.log(
        `${resultado.candidatos.length} alternativa(s) isolada(s)`
      );

    } else {
      console.log(
        `sem alternativa · ${resultado.motivo}`
      );
    }


    await esperar(
      INTERVALO_REQUISICOES_MS
    );
  }


  const ativos =
    resultados.filter(
      item =>
        !item.ignorada
    );


  const totalCandidatos =
    resultados.reduce(
      (
        total,
        item
      ) =>
        total +
        item.candidatos.length,
      0
    );


  const saida = {
    versao:
      1,

    geradoEm:
      new Date()
        .toISOString(),

    descricao:
      "Camada isolada de alternativas visuais. Não altera manifesto, lote final, propostas atuais ou curadoria.",

    politicaVisualAlvo: [
      "execucao-clara-com-nome-ou-kanji-quando-disponivel",
      "execucao-clara-sem-overlay",
      "fallback-compreensivel"
    ],

    limitacaoAtual:
      "A versão 1.0 ainda classifica apenas por metadados; não analisa semanticamente os pixels nem executa OCR.",

    totalBanco:
      banco.length,

    processados:
      registros.length,

    hissatsuNaoAprovadas:
      ativos.length,

    totalCandidatos,

    resultados
  };


  await fs.writeFile(
    ARQUIVO_SAIDA,

    JSON.stringify(
      saida,
      null,
      2
    ) +
      "\n",

    "utf8"
  );


  await fs.writeFile(
    ARQUIVO_RELATORIO,

    gerarRelatorio({
      totalBanco:
        banco.length,

      processados:
        registros.length,

      resultados
    }),

    "utf8"
  );


  const comCandidatos =
    ativos.filter(
      item =>
        item.candidatos.length >
        0
    ).length;


  const semCandidatos =
    ativos.length -
    comCandidatos;


  console.log(
    ""
  );


  console.log(
    "Concluído."
  );


  console.log(
    ""
  );


  console.log(
    `Hissatsu não aprovadas analisadas: ${ativos.length}`
  );


  console.log(
    `Hissatsu com alternativas: ${comCandidatos}`
  );


  console.log(
    `Hissatsu sem alternativas: ${semCandidatos}`
  );


  console.log(
    `Candidatos isolados gerados: ${totalCandidatos}`
  );


  console.log(
    ""
  );


  console.log(
    "Nenhuma imagem exibida foi modificada."
  );


  console.log(
    "Nenhuma decisão de curadoria foi aplicada."
  );


  console.log(
    ""
  );


  console.log(
    "Gerado: documentacao/IMAGENS_HISSATSU_CANDIDATOS_VISUAIS.json"
  );


  console.log(
    "Gerado: documentacao/RELATORIO_CANDIDATOS_VISUAIS_HISSATSU.md"
  );


  console.log(
    "Assets: public/assets/hissatsu/candidatos-visuais/<id>/"
  );
}


main()
  .catch(
    erro => {
      console.error(
        ""
      );


      console.error(
        "Falha gerando candidatos visuais:"
      );


      console.error(
        erro
      );


      process.exitCode =
        1;
    }
  );