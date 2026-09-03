import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  bancoHissatsuFactual,
  obterTodosOsNomesHissatsu
} from "../src/features/habilidades/data/bancoHissatsuSuperOnze.js";


/* ========================================
   CATÁLOGO AUTOMÁTICO DE IMAGENS HISSATSU

   VERSÃO 1.5
   PROPOSTAS SEGURAS + VALIDAÇÃO DE BYTES

   REGRA CENTRAL:

   APROVADA
   → imagem fica congelada
   → não pesquisa substituição

   REVISAR
   → imagem atual continua no lote
   → nova imagem vira apenas PROPOSTA
   → proposta não substitui a atual

   REJEITADA
   → imagem rejeitada sai do lote
   → nova imagem vira apenas PROPOSTA
   → só entra no lote após aprovação humana

   VALIDAÇÃO DE ARQUIVO:

   Um asset só é tratado como imagem quando:

   1. existe fisicamente;
   2. possui extensão suportada;
   3. os bytes internos correspondem a
      JPEG, PNG, WEBP, GIF ou AVIF.

   Portanto:

   arquivo.jpg contendo MP4
   → NÃO é imagem
   → NÃO pode ser fallback
   → NÃO entra no lote

   IMPORTANTE:

   - propostas ficam em pasta separada;
   - proposta nunca sobrescreve referência;
   - curadoria humana nunca é sobrescrita;
   - vídeos não são aceitos como imagens;
   - sem imagem é melhor que imagem errada;
   - não altera Banco factual;
   - não altera mecânica.
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


const PASTA_HISSATSU =
  path.join(
    PASTA_PUBLIC,
    "assets",
    "hissatsu"
  );


const PASTA_ASSETS_AUTOMATICOS =
  path.join(
    PASTA_HISSATSU,
    "referencia"
  );


const PASTA_PROPOSTAS =
  path.join(
    PASTA_HISSATSU,
    "propostas"
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


const ARQUIVO_PROPOSTAS =
  path.join(
    PASTA_DOCUMENTACAO,
    "IMAGENS_HISSATSU_PROPOSTAS.json"
  );


const ARQUIVO_PENDENCIAS =
  path.join(
    PASTA_DOCUMENTACAO,
    "IMAGENS_HISSATSU_PENDENTES.json"
  );


const ARQUIVO_RELATORIO =
  path.join(
    PASTA_DOCUMENTACAO,
    "RELATORIO_IMAGENS_HISSATSU.md"
  );


const ARQUIVO_LOTE_GERADO =
  path.join(
    RAIZ_PROJETO,
    "src",
    "features",
    "habilidades",
    "data",
    "bancoHissatsuLoteImagensAutomaticas.js"
  );


const API_WIKI =
  "https://inazuma-eleven.fandom.com/api.php";


const BASE_WIKI =
  "https://inazuma-eleven.fandom.com/wiki/";


const INTERVALO_REQUISICOES_MS =
  300;


const LIMITE_POR_EXECUCAO =
  Number(
    process.env.HISSATSU_LIMITE ||
    0
  );


/* ========================================
   REGRAS VISUAIS AUTOMÁTICAS
======================================== */

const LARGURA_MINIMA =
  480;


const ALTURA_MINIMA =
  270;


const PROPORCAO_MINIMA =
  1.08;


const PROPORCAO_MAXIMA =
  2.5;


const PONTUACAO_MINIMA =
  52;


const ESTADOS_CURADORIA =
  new Set([
    "aprovada",
    "revisar",
    "rejeitada"
  ]);


const EXTENSOES_IMAGEM =
  new Set([
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".gif",
    ".avif"
  ]);


const MIMES_IMAGEM =
  new Set([
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/gif",
    "image/avif"
  ]);


const TERMOS_NEGATIVOS_FORTES = [
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
  "caderno",
  "victory road",
  "strikers",
  "3ds",
  "nds",
  "game screenshot",
  "gameplay"
];


const TERMOS_POSITIVOS_ANIME = [
  "anime",
  "episode",
  "episodio",
  "hissatsu",
  "technique"
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
    )
      .replace(
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


function extensaoPorMime(
  mime
) {
  const valor =
    texto(
      mime
    )
      .toLowerCase()
      .split(";")[0];


  const mapa = {
    "image/png":
      ".png",

    "image/jpeg":
      ".jpg",

    "image/jpg":
      ".jpg",

    "image/webp":
      ".webp",

    "image/gif":
      ".gif",

    "image/avif":
      ".avif"
  };


  return (
    mapa[valor] ||
    ""
  );
}


function extensaoDaUrl(
  url
) {
  const limpa =
    texto(
      url
    )
      .split("?")[0]
      .split("#")[0];


  const match =
    limpa.match(
      /\.(png|jpe?g|webp|gif|avif)$/i
    );


  if (
    !match
  ) {
    return "";
  }


  const extensao =
    match[1]
      .toLowerCase();


  return (
    extensao ===
      "jpeg"
      ? ".jpg"
      : `.${extensao}`
  );
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


function converterUrlPublicaParaCaminho(
  urlLocal
) {
  const valor =
    texto(
      urlLocal
    );


  if (
    !valor.startsWith("/")
  ) {
    return "";
  }


  return path.join(
    PASTA_PUBLIC,

    ...valor
      .replace(
        /^\/+/,
        ""
      )
      .split("/")
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


async function prepararPastas() {
  await fs.mkdir(
    PASTA_ASSETS_AUTOMATICOS,
    {
      recursive:
        true
    }
  );


  await fs.mkdir(
    PASTA_PROPOSTAS,
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
    const conteudo =
      await fs.readFile(
        caminho,
        "utf8"
      );


    return JSON.parse(
      conteudo
    );

  } catch {
    return fallback;
  }
}


/* ========================================
   VALIDAÇÃO REAL DE IMAGEM

   NÃO confia apenas em:

   - extensão;
   - nome do arquivo;
   - Content-Type.

   Os bytes precisam corresponder a uma
   imagem conhecida.
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


  /* JPEG */

  if (
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return {
      formato:
        "jpeg",

      mime:
        "image/jpeg",

      extensao:
        ".jpg"
    };
  }


  /* PNG */

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
      formato:
        "png",

      mime:
        "image/png",

      extensao:
        ".png"
    };
  }


  /* GIF */

  const assinaturaGif =
    buffer
      .subarray(
        0,
        6
      )
      .toString(
        "ascii"
      );


  if (
    assinaturaGif ===
      "GIF87a" ||
    assinaturaGif ===
      "GIF89a"
  ) {
    return {
      formato:
        "gif",

      mime:
        "image/gif",

      extensao:
        ".gif"
    };
  }


  /* WEBP */

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
      formato:
        "webp",

      mime:
        "image/webp",

      extensao:
        ".webp"
    };
  }


  /* AVIF */

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
      formato:
        "avif",

      mime:
        "image/avif",

      extensao:
        ".avif"
    };
  }


  /*
    MP4 normalmente também contém:

    bytes 4..7 = ftyp

    mas com marcas como:

    mp42
    mp41
    isom
    avc1

    Esses formatos NÃO chegam aqui como
    imagem.
  */

  return null;
}


async function lerCabecalhoArquivo(
  caminho,
  quantidade = 32
) {
  const arquivo =
    await fs.open(
      caminho,
      "r"
    );


  try {
    const buffer =
      Buffer.alloc(
        quantidade
      );


    const {
      bytesRead
    } =
      await arquivo.read(
        buffer,
        0,
        quantidade,
        0
      );


    return buffer.subarray(
      0,
      bytesRead
    );

  } finally {
    await arquivo.close();
  }
}


async function validarArquivoImagemReal(
  caminho
) {
  if (
    !caminho ||
    !await existe(
      caminho
    )
  ) {
    return {
      valida:
        false,

      motivo:
        "arquivo inexistente",

      formato:
        null
    };
  }


  const extensao =
    path.extname(
      caminho
    )
      .toLowerCase();


  if (
    !EXTENSOES_IMAGEM.has(
      extensao
    )
  ) {
    return {
      valida:
        false,

      motivo:
        `extensão não suportada: ${extensao}`,

      formato:
        null
    };
  }


  try {
    const cabecalho =
      await lerCabecalhoArquivo(
        caminho
      );


    const formato =
      detectarFormatoImagemBuffer(
        cabecalho
      );


    if (
      !formato
    ) {
      return {
        valida:
          false,

        motivo:
          "bytes internos não correspondem a uma imagem suportada",

        formato:
          null
      };
    }


    return {
      valida:
        true,

      motivo:
        "",

      formato
    };

  } catch (
    erro
  ) {
    return {
      valida:
        false,

      motivo:
        `falha lendo arquivo: ${erro.message}`,

      formato:
        null
    };
  }
}


/* ========================================
   CURADORIA
======================================== */

async function carregarCuradoria() {
  const dados =
    await lerJsonSeguro(
      ARQUIVO_CURADORIA,
      {}
    );


  const estadoPadrao =
    ESTADOS_CURADORIA.has(
      dados?.estadoPadrao
    )
      ? dados.estadoPadrao
      : "revisar";


  const registros =
    dados?.registros &&
    typeof dados.registros ===
      "object"
      ? dados.registros
      : {};


  return {
    ...dados,
    estadoPadrao,
    registros
  };
}


function obterCuradoriaRegistro({
  id,
  curadoria
}) {
  const registro =
    curadoria
      ?.registros
      ?.[id];


  const estado =
    ESTADOS_CURADORIA.has(
      registro?.estado
    )
      ? registro.estado
      : curadoria
          ?.estadoPadrao ||
        "revisar";


  return {
    explicita:
      Boolean(
        registro
      ),

    estado,

    imagemAtual:
      texto(
        registro
          ?.imagemAtual
      ),

    candidatoAtual:
      texto(
        registro
          ?.candidatoAtual
      ),

    observacao:
      texto(
        registro
          ?.observacao
      ),

    candidatosRejeitados:
      Array.isArray(
        registro
          ?.candidatosRejeitados
      )
        ? registro
            .candidatosRejeitados
        : []
  };
}


function obterTitulosBloqueados({
  regraCuradoria,
  manifestoAnterior
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
      .candidatosRejeitados ||
    []
  ) {
    adicionar(
      item
        ?.tituloArquivo
    );
  }


  if (
    regraCuradoria.estado ===
      "revisar" ||
    regraCuradoria.estado ===
      "rejeitada"
  ) {
    adicionar(
      regraCuradoria
        .candidatoAtual
    );


    adicionar(
      manifestoAnterior
        ?.tituloArquivo
    );
  }


  return bloqueados;
}


/* ========================================
   NOMES DA HISSATSU
======================================== */

function nomesPesquisaRegistro(
  registro
) {
  const nomesNormalizados =
    registro?.nomes ||
    {};


  const nomes = [
    nomesNormalizados.original,

    registro
      ?.nomeOriginal,

    registro
      ?.nome,

    nomesNormalizados
      .japonesRomanizado,

    registro
      ?.japonesRomanizado,

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


function analisarRelacaoNome({
  tituloArquivo,
  nomes
}) {
  const arquivoNormalizado =
    normalizarParaComparacao(
      texto(
        tituloArquivo
      )
        .replace(
          /^File:/i,
          ""
        )
    );


  let melhor = {
    nome:
      "",

    fraseCompleta:
      false,

    cobertura:
      0,

    totalPalavras:
      0,

    palavrasEncontradas:
      0
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
          arquivoNormalizado
            .includes(
              palavra
            )
      ).length;


    const cobertura =
      palavras.length > 0
        ? encontradas /
          palavras.length
        : 0;


    const fraseCompleta =
      arquivoNormalizado
        .includes(
          nomeNormalizado
        );


    const melhorAgora =
      fraseCompleta &&
      !melhor
        .fraseCompleta;


    const coberturaMelhor =
      fraseCompleta ===
        melhor.fraseCompleta &&
      cobertura >
        melhor.cobertura;


    if (
      melhorAgora ||
      coberturaMelhor
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
   LOCALIZAÇÃO DE ASSETS

   Agora cada arquivo encontrado passa por
   validação real dos bytes antes de poder
   virar imagem efetiva.
======================================== */

async function localizarAssetPorIdRecursivamente(
  pasta,
  id,
  {
    pastasIgnoradas = []
  } = {}
) {
  if (
    !await existe(
      pasta
    )
  ) {
    return null;
  }


  const ignoradas =
    new Set(
      pastasIgnoradas
    );


  const entradas =
    await fs.readdir(
      pasta,
      {
        withFileTypes:
          true
      }
    );


  for (
    const entrada of
    entradas
  ) {
    if (
      entrada.isDirectory() &&
      ignoradas.has(
        entrada.name
      )
    ) {
      continue;
    }


    const caminho =
      path.join(
        pasta,
        entrada.name
      );


    if (
      entrada.isDirectory()
    ) {
      const encontrado =
        await localizarAssetPorIdRecursivamente(
          caminho,
          id,
          {
            pastasIgnoradas
          }
        );


      if (
        encontrado
      ) {
        return encontrado;
      }


      continue;
    }


    const extensao =
      path.extname(
        entrada.name
      )
        .toLowerCase();


    if (
      !EXTENSOES_IMAGEM.has(
        extensao
      )
    ) {
      continue;
    }


    const nomeSemExtensao =
      path.basename(
        entrada.name,
        extensao
      );


    if (
      nomeSemExtensao !==
      id
    ) {
      continue;
    }


    const validacao =
      await validarArquivoImagemReal(
        caminho
      );


    if (
      !validacao.valida
    ) {
      continue;
    }


    return {
      caminho,

      urlLocal:
        converterCaminhoParaUrlPublica(
          caminho
        ),

      formatoReal:
        validacao
          .formato
          ?.formato ||
        "",

      mimeReal:
        validacao
          .formato
          ?.mime ||
        ""
    };
  }


  return null;
}


async function localizarImagemDeclarada({
  id,
  urlLocal
}) {
  const caminhoDeclarado =
    converterUrlPublicaParaCaminho(
      urlLocal
    );


  if (
    caminhoDeclarado &&
    !normalizarParaComparacao(
      urlLocal
    ).includes(
      "assets hissatsu propostas"
    ) &&
    await existe(
      caminhoDeclarado
    )
  ) {
    const validacao =
      await validarArquivoImagemReal(
        caminhoDeclarado
      );


    if (
      validacao.valida
    ) {
      return {
        caminho:
          caminhoDeclarado,

        urlLocal:
          converterCaminhoParaUrlPublica(
            caminhoDeclarado
          ),

        formatoReal:
          validacao
            .formato
            ?.formato ||
          "",

        mimeReal:
          validacao
            .formato
            ?.mime ||
          ""
      };
    }
  }


  return localizarAssetPorIdRecursivamente(
    PASTA_HISSATSU,
    id,
    {
      pastasIgnoradas: [
        "propostas",
        "fontes-video"
      ]
    }
  );
}


async function localizarFallbackRevisao({
  id,
  regraCuradoria,
  manifestoAnterior
}) {
  if (
    regraCuradoria.imagemAtual
  ) {
    const daCuradoria =
      await localizarImagemDeclarada({
        id,

        urlLocal:
          regraCuradoria.imagemAtual
      });


    if (
      daCuradoria
    ) {
      return daCuradoria;
    }
  }


  const urlManifesto =
    texto(
      manifestoAnterior
        ?.urlLocal
    );


  if (
    urlManifesto &&
    !urlManifesto.includes(
      "/propostas/"
    )
  ) {
    const doManifesto =
      await localizarImagemDeclarada({
        id,

        urlLocal:
          urlManifesto
      });


    if (
      doManifesto
    ) {
      return doManifesto;
    }
  }


  return localizarAssetPorIdRecursivamente(
    PASTA_HISSATSU,
    id,
    {
      pastasIgnoradas: [
        "propostas",
        "fontes-video"
      ]
    }
  );
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
            "RPG-Manager-Hissatsu-Catalog/1.5"
        }
      }
    );


  if (
    resposta.status ===
      429 &&
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
   LOCALIZAÇÃO DA PÁGINA
======================================== */

async function consultarTituloDireto(
  nome
) {
  const parametros =
    new URLSearchParams({
      action:
        "query",

      prop:
        "info",

      titles:
        nome,

      redirects:
        "1",

      format:
        "json",

      origin:
        "*"
    });


  const dados =
    await requisitarJson(
      `${API_WIKI}?${parametros.toString()}`
    );


  const paginas =
    Object.values(
      dados
        ?.query
        ?.pages ||
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

    criterio:
      "titulo-direto",

    pontos:
      200
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


  const prefixosRuins = [
    "category ",
    "list of ",
    "user ",
    "template ",
    "file "
  ];


  if (
    prefixosRuins.some(
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
      // Continua.
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
        action:
          "query",

        list:
          "search",

        srsearch:
          nome,

        srlimit:
          "10",

        format:
          "json",

        origin:
          "*"
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
   AVALIAÇÃO DA IMAGEM
======================================== */

function avaliarImagem({
  tituloArquivo,
  largura,
  altura,
  mime,
  nomes,
  titulosBloqueados
}) {
  const arquivoN =
    normalizarParaComparacao(
      texto(
        tituloArquivo
      )
        .replace(
          /^File:/i,
          ""
        )
    );


  const relacao =
    analisarRelacaoNome({
      tituloArquivo,
      nomes
    });


  const mimeN =
    texto(
      mime
    )
      .toLowerCase()
      .split(";")[0];


  const mimeValido =
    MIMES_IMAGEM.has(
      mimeN
    );


  const bloqueadaCuradoria =
    titulosBloqueados
      .has(
        normalizarParaComparacao(
          tituloArquivo
        )
      );


  const termoNegativo =
    TERMOS_NEGATIVOS_FORTES
      .find(
        termo =>
          arquivoN.includes(
            normalizarParaComparacao(
              termo
            )
          )
      );


  const positivoAnime =
    TERMOS_POSITIVOS_ANIME
      .some(
        termo =>
          arquivoN.includes(
            normalizarParaComparacao(
              termo
            )
          )
      );


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


  const horizontal =
    proporcao >=
      PROPORCAO_MINIMA &&
    proporcao <=
      PROPORCAO_MAXIMA;


  const resolucaoUtil =
    w >=
      LARGURA_MINIMA &&
    h >=
      ALTURA_MINIMA;


  const relacaoForte =
    relacao.fraseCompleta ||
    (
      relacao.totalPalavras >=
        2 &&
      relacao.cobertura >=
        0.75
    ) ||
    (
      relacao.totalPalavras ===
        1 &&
      relacao.cobertura ===
        1 &&
      positivoAnime
    );


  let pontos =
    0;


  if (
    relacao.fraseCompleta
  ) {
    pontos +=
      42;
  }


  pontos +=
    Math.round(
      relacao.cobertura *
      24
    );


  if (
    relacao.totalPalavras >=
      2 &&
    relacao.cobertura ===
      1
  ) {
    pontos +=
      12;
  }


  if (
    positivoAnime
  ) {
    pontos +=
      20;
  }


  if (
    horizontal
  ) {
    pontos +=
      12;

  } else {
    pontos -=
      30;
  }


  if (
    resolucaoUtil
  ) {
    pontos +=
      10;

  } else {
    pontos -=
      18;
  }


  if (
    w >= 1000 &&
    h >= 500
  ) {
    pontos +=
      4;
  }


  if (
    mimeValido
  ) {
    pontos +=
      2;

  } else {
    pontos -=
      100;
  }


  if (
    termoNegativo
  ) {
    pontos -=
      70;
  }


  if (
    bloqueadaCuradoria
  ) {
    pontos -=
      1000;
  }


  const motivosRejeicao =
    [];


  if (
    !mimeValido
  ) {
    motivosRejeicao.push(
      `formato não é imagem (${mimeN || "desconhecido"})`
    );
  }


  if (
    bloqueadaCuradoria
  ) {
    motivosRejeicao.push(
      "candidato bloqueado pela curadoria humana"
    );
  }


  if (
    termoNegativo
  ) {
    motivosRejeicao.push(
      `termo negativo: ${termoNegativo}`
    );
  }


  if (
    !relacaoForte
  ) {
    motivosRejeicao.push(
      "relação fraca com o nome da Hissatsu"
    );
  }


  if (
    !horizontal
  ) {
    motivosRejeicao.push(
      "formato não horizontal"
    );
  }


  if (
    !resolucaoUtil
  ) {
    motivosRejeicao.push(
      "resolução abaixo do mínimo"
    );
  }


  if (
    pontos <
      PONTUACAO_MINIMA
  ) {
    motivosRejeicao.push(
      `pontuação ${pontos} abaixo do mínimo ${PONTUACAO_MINIMA}`
    );
  }


  const aprovada =
    mimeValido &&
    !bloqueadaCuradoria &&
    !termoNegativo &&
    relacaoForte &&
    horizontal &&
    resolucaoUtil &&
    pontos >=
      PONTUACAO_MINIMA;


  return {
    pontos,
    aprovada,
    positivoAnime,
    horizontal,
    resolucaoUtil,
    mimeValido,
    bloqueadaCuradoria,
    relacao,

    termoNegativo:
      termoNegativo ||
      "",

    motivosRejeicao
  };
}


/* ========================================
   BUSCA DE CANDIDATOS
======================================== */

async function buscarImagensPagina({
  tituloPagina,
  nomes,
  titulosBloqueados
}) {
  const parametros =
    new URLSearchParams({
      action:
        "query",

      generator:
        "images",

      titles:
        tituloPagina,

      gimlimit:
        "100",

      prop:
        "imageinfo",

      iiprop:
        "url|size|mime",

      format:
        "json",

      origin:
        "*"
    });


  const dados =
    await requisitarJson(
      `${API_WIKI}?${parametros.toString()}`
    );


  const paginas =
    Object.values(
      dados
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
            ?.[0];


        if (
          !info?.url
        ) {
          return null;
        }


        const avaliacao =
          avaliarImagem({
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

          url:
            info.url,

          largura:
            info.width ||
            0,

          altura:
            info.height ||
            0,

          mime:
            info.mime ||
            "",

          ...avaliacao
        };
      }
    )
    .filter(
      Boolean
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


async function selecionarImagemWiki({
  tituloPagina,
  nomes,
  titulosBloqueados
}) {
  let candidatas =
    [];


  try {
    candidatas =
      await buscarImagensPagina({
        tituloPagina,
        nomes,
        titulosBloqueados
      });

  } catch {
    candidatas =
      [];
  }


  const aprovada =
    candidatas.find(
      item =>
        item.aprovada
    );


  return {
    aprovada:
      aprovada ||
      null,

    candidatas:
      candidatas.slice(
        0,
        8
      )
  };
}


/* ========================================
   DOWNLOAD DE PROPOSTA

   Além do MIME HTTP, valida também os
   bytes reais recebidos.

   Assim:

   servidor diz image/jpeg
   mas entrega MP4
   → download rejeitado.
======================================== */

async function baixarImagemProposta({
  url,
  id,
  mimeSugerido = ""
}) {
  const resposta =
    await fetch(
      url,
      {
        headers: {
          "Accept":
            "image/avif,image/webp,image/png,image/jpeg,image/gif,*/*;q=0.8",

          "User-Agent":
            "Mozilla/5.0 RPG-Manager-Hissatsu-Catalog/1.5"
        }
      }
    );


  if (
    !resposta.ok
  ) {
    throw new Error(
      `Falha ao baixar imagem: HTTP ${resposta.status}`
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
    !MIMES_IMAGEM.has(
      mimeResposta
    )
  ) {
    throw new Error(
      `Resposta HTTP não declarou imagem (${mimeResposta || "tipo desconhecido"}).`
    );
  }


  const dados =
    Buffer.from(
      await resposta
        .arrayBuffer()
    );


  if (
    dados.length <
      4096
  ) {
    throw new Error(
      "Arquivo recebido é pequeno demais para ser aceito como referência."
    );
  }


  const formatoReal =
    detectarFormatoImagemBuffer(
      dados
    );


  if (
    !formatoReal
  ) {
    const marcador =
      dados.length >= 12
        ? dados
            .subarray(
              4,
              12
            )
            .toString(
              "ascii"
            )
        : "";


    throw new Error(
      `Conteúdo recebido não é uma imagem suportada${marcador ? ` (${marcador})` : ""}.`
    );
  }


  /*
    A extensão vem dos BYTES REAIS.

    Não usamos mais apenas MIME ou URL.
  */

  const extensao =
    formatoReal
      .extensao ||
    extensaoPorMime(
      mimeResposta ||
      mimeSugerido
    ) ||
    extensaoDaUrl(
      url
    ) ||
    ".jpg";


  const caminho =
    path.join(
      PASTA_PROPOSTAS,
      `${id}${extensao}`
    );


  await fs.writeFile(
    caminho,
    dados
  );


  /*
    Validação final do arquivo já salvo.
  */

  const validacaoFinal =
    await validarArquivoImagemReal(
      caminho
    );


  if (
    !validacaoFinal.valida
  ) {
    await fs.rm(
      caminho,
      {
        force:
          true
      }
    );


    throw new Error(
      `Arquivo salvo falhou na validação final: ${validacaoFinal.motivo}.`
    );
  }


  return {
    caminho,

    urlLocal:
      converterCaminhoParaUrlPublica(
        caminho
      ),

    bytes:
      dados.length,

    mime:
      formatoReal.mime,

    formato:
      formatoReal.formato,

    extensaoReal:
      formatoReal.extensao
  };
}


/* ========================================
   PROCURAR UMA PROPOSTA
======================================== */

async function pesquisarProposta({
  registro,
  regraCuradoria,
  manifestoAnterior
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


  const nomes =
    nomesPesquisaRegistro(
      registro
    );


  const titulosBloqueados =
    obterTitulosBloqueados({
      regraCuradoria,
      manifestoAnterior
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
      encontrada:
        false,

      id,
      nome,

      motivo:
        `Erro pesquisando página: ${erro.message}`,

      candidatas:
        []
    };
  }


  if (
    !pagina
  ) {
    return {
      encontrada:
        false,

      id,
      nome,

      motivo:
        "Nenhuma página compatível encontrada na Wiki.",

      candidatas:
        []
    };
  }


  await esperar(
    INTERVALO_REQUISICOES_MS
  );


  let selecao;


  try {
    selecao =
      await selecionarImagemWiki({
        tituloPagina:
          pagina.titulo,

        nomes,

        titulosBloqueados
      });

  } catch (
    erro
  ) {
    return {
      encontrada:
        false,

      id,
      nome,

      paginaWiki:
        pagina.titulo,

      fonteUrl:
        urlPaginaWiki(
          pagina.titulo
        ),

      motivo:
        `Erro procurando imagem: ${erro.message}`,

      candidatas:
        []
    };
  }


  if (
    !selecao.aprovada
  ) {
    return {
      encontrada:
        false,

      id,
      nome,

      paginaWiki:
        pagina.titulo,

      fonteUrl:
        urlPaginaWiki(
          pagina.titulo
        ),

      motivo:
        "Nenhuma nova candidata atingiu os critérios mínimos.",

      candidatas:
        selecao.candidatas
    };
  }


  await esperar(
    INTERVALO_REQUISICOES_MS
  );


  let baixada;


  try {
    baixada =
      await baixarImagemProposta({
        url:
          selecao
            .aprovada
            .url,

        id,

        mimeSugerido:
          selecao
            .aprovada
            .mime
      });

  } catch (
    erro
  ) {
    return {
      encontrada:
        false,

      id,
      nome,

      paginaWiki:
        pagina.titulo,

      fonteUrl:
        urlPaginaWiki(
          pagina.titulo
        ),

      tituloArquivo:
        selecao
          .aprovada
          .tituloArquivo,

      motivo:
        erro.message,

      candidatas:
        selecao.candidatas
    };
  }


  return {
    encontrada:
      true,

    id,
    nome,

    urlLocal:
      baixada.urlLocal,

    fonte:
      "Inazuma Eleven Wiki / Fandom — proposta automática aguardando aprovação humana",

    fonteUrl:
      urlPaginaWiki(
        pagina.titulo
      ),

    paginaWiki:
      pagina.titulo,

    tituloArquivo:
      selecao
        .aprovada
        .tituloArquivo,

    pontos:
      selecao
        .aprovada
        .pontos,

    positivoAnime:
      selecao
        .aprovada
        .positivoAnime,

    largura:
      selecao
        .aprovada
        .largura ||
      0,

    altura:
      selecao
        .aprovada
        .altura ||
      0,

    mime:
      baixada.mime ||
      selecao
        .aprovada
        .mime ||
      "",

    formatoReal:
      baixada.formato ||
      "",

    bytes:
      baixada.bytes,

    candidatas:
      selecao.candidatas
  };
}


/* ========================================
   IMAGEM FINAL EXISTENTE
======================================== */

function criarImagemFinalExistente({
  registro,
  asset,
  regraCuradoria,
  manifestoAnterior,
  criterio,
  origemDecisao
}) {
  return {
    usarNoLote:
      true,

    id:
      texto(
        registro?.id
      ),

    nome:
      texto(
        registro?.nome
      ) ||
      texto(
        registro?.id
      ),

    urlLocal:
      asset.urlLocal,

    fonte:
      manifestoAnterior
        ?.fonte ||
      "Curadoria visual persistente",

    fonteUrl:
      manifestoAnterior
        ?.fonteUrl ||
      "",

    paginaWiki:
      manifestoAnterior
        ?.paginaWiki ||
      "",

    tituloArquivo:
      regraCuradoria
        .candidatoAtual ||
      manifestoAnterior
        ?.tituloArquivo ||
      "",

    criterio,

    origemDecisao,

    estadoCuradoria:
      regraCuradoria.estado,

    pontos:
      manifestoAnterior
        ?.pontos ??
      999,

    animeProvavel:
      Boolean(
        manifestoAnterior
          ?.animeProvavel
      ),

    formatoReal:
      asset.formatoReal ||
      "",

    mimeReal:
      asset.mimeReal ||
      ""
  };
}


/* ========================================
   PROCESSAR UMA HISSATSU
======================================== */

async function processarRegistro({
  registro,
  curadoria,
  manifestoAnterior
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


  if (
    !id
  ) {
    return {
      final:
        null,

      proposta:
        null,

      pendencia: {
        id:
          "",

        nome,

        estadoCuradoria:
          "",

        motivo:
          "Registro sem ID.",

        candidatas:
          []
      }
    };
  }


  const regraCuradoria =
    obterCuradoriaRegistro({
      id,
      curadoria
    });


  /* ======================================
     APROVADA
  ====================================== */

  if (
    regraCuradoria.estado ===
      "aprovada"
  ) {
    const asset =
      await localizarImagemDeclarada({
        id,

        urlLocal:
          regraCuradoria.imagemAtual ||
          manifestoAnterior?.urlLocal ||
          ""
      });


    if (
      !asset
    ) {
      return {
        final:
          null,

        proposta:
          null,

        pendencia: {
          id,
          nome,

          estadoCuradoria:
            "aprovada",

          motivo:
            "A imagem está marcada como aprovada, mas nenhum asset local válido foi encontrado. Nenhuma substituição automática foi feita.",

          candidatas:
            []
        }
      };
    }


    return {
      final:
        criarImagemFinalExistente({
          registro,
          asset,
          regraCuradoria,
          manifestoAnterior,

          criterio:
            "curadoria-aprovada",

          origemDecisao:
            "humana-aprovada"
        }),

      proposta:
        null,

      pendencia:
        null
    };
  }


  /* ======================================
     REVISAR

     Só preserva fallback que seja uma
     imagem REAL e válida.

     MP4 disfarçado de JPG é ignorado.
  ====================================== */

  if (
    regraCuradoria.estado ===
      "revisar"
  ) {
    const fallback =
      await localizarFallbackRevisao({
        id,
        regraCuradoria,
        manifestoAnterior
      });


    const proposta =
      await pesquisarProposta({
        registro,
        regraCuradoria,
        manifestoAnterior
      });


    const final =
      fallback
        ? criarImagemFinalExistente({
            registro,

            asset:
              fallback,

            regraCuradoria,
            manifestoAnterior,

            criterio:
              "revisao-imagem-atual-preservada",

            origemDecisao:
              "humana-revisao"
          })
        : null;


    const propostaPronta =
      proposta.encontrada
        ? {
            ...proposta,

            estadoCuradoria:
              "revisar",

            acao:
              "aguardando-aprovacao"
          }
        : null;


    const pendencia =
      !final &&
      !propostaPronta
        ? {
            id,
            nome,

            estadoCuradoria:
              "revisar",

            motivo:
              proposta.motivo,

            paginaWiki:
              proposta.paginaWiki ||
              "",

            fonteUrl:
              proposta.fonteUrl ||
              "",

            candidatas:
              proposta.candidatas ||
              []
          }
        : null;


    return {
      final,
      proposta:
        propostaPronta,
      pendencia
    };
  }


  /* ======================================
     REJEITADA
  ====================================== */

  if (
    regraCuradoria.estado ===
      "rejeitada"
  ) {
    const proposta =
      await pesquisarProposta({
        registro,
        regraCuradoria,
        manifestoAnterior
      });


    if (
      proposta.encontrada
    ) {
      return {
        final:
          null,

        proposta: {
          ...proposta,

          estadoCuradoria:
            "rejeitada",

          acao:
            "aguardando-aprovacao"
        },

        pendencia:
          null
      };
    }


    return {
      final:
        null,

      proposta:
        null,

      pendencia: {
        id,
        nome,

        estadoCuradoria:
          "rejeitada",

        motivo:
          proposta.motivo,

        paginaWiki:
          proposta.paginaWiki ||
          "",

        fonteUrl:
          proposta.fonteUrl ||
          "",

        candidatas:
          proposta.candidatas ||
          []
      }
    };
  }


  return {
    final:
      null,

    proposta:
      null,

    pendencia: {
      id,
      nome,

      estadoCuradoria:
        regraCuradoria.estado,

      motivo:
        `Estado de curadoria inválido: ${regraCuradoria.estado}`,

      candidatas:
        []
    }
  };
}


/* ========================================
   GERAR LOTE FINAL
======================================== */

function gerarLoteComplementar(
  finais
) {
  const linhas = [
    "import {",
    "  criarComplementoImagemHissatsu",
    "} from \"./bancoHissatsuComplementos.js\";",
    "",
    "",
    "/* ========================================",
    "   IMAGENS DE REFERÊNCIA — LOTE FINAL",
    "",
    "   Gerado automaticamente por:",
    "   scripts/catalogarImagensHissatsu.mjs",
    "",
    "   IMPORTANTE:",
    "",
    "   Este lote contém somente imagens que",
    "   podem continuar sendo exibidas agora.",
    "",
    "   Arquivos passam por validação real",
    "   dos bytes antes de entrarem no lote.",
    "",
    "   MP4 disfarçado de JPG/PNG/WEBP",
    "   não pode entrar neste arquivo.",
    "",
    "   Propostas aguardando aprovação humana",
    "   NÃO entram neste arquivo.",
    "",
    "   Não altera mecânica.",
    "   Não cria Hissatsu.",
    "======================================== */",
    "",
    "",
    "export const loteHissatsuImagensAutomaticas = ["
  ];


  finais.forEach(
    (
      item,
      indice
    ) => {
      linhas.push(
        "",
        "  criarComplementoImagemHissatsu({",

        `    id: ${JSON.stringify(
          item.id
        )},`,

        "",

        "    imagemReferencia: {",

        `      url: ${JSON.stringify(
          item.urlLocal
        )},`,

        "",

        `      fonte: ${JSON.stringify(
          item.fonte
        )},`,

        "",

        `      fonteUrl: ${JSON.stringify(
          item.fonteUrl
        )},`,

        "",

        "      status: \"catalogada\"",

        "    }",

        "  })" +
          (
            indice <
              finais.length -
                1
              ? ","
              : ""
          )
      );
    }
  );


  linhas.push(
    "",
    "];",
    ""
  );


  return linhas.join(
    "\n"
  );
}


/* ========================================
   SERIALIZAÇÃO DE CANDIDATAS
======================================== */

function simplificarCandidata(
  candidata
) {
  if (
    !candidata
  ) {
    return null;
  }


  return {
    tituloArquivo:
      candidata
        .tituloArquivo ||
      "",

    url:
      candidata.url ||
      "",

    largura:
      candidata.largura ||
      0,

    altura:
      candidata.altura ||
      0,

    mime:
      candidata.mime ||
      "",

    pontos:
      candidata.pontos ??
      null,

    aprovada:
      Boolean(
        candidata.aprovada
      ),

    positivoAnime:
      Boolean(
        candidata
          .positivoAnime
      ),

    bloqueadaCuradoria:
      Boolean(
        candidata
          .bloqueadaCuradoria
      ),

    relacao:
      candidata.relacao ||
      null,

    motivosRejeicao:
      Array.isArray(
        candidata
          .motivosRejeicao
      )
        ? candidata
            .motivosRejeicao
        : []
  };
}


function simplificarProposta(
  proposta
) {
  return {
    id:
      proposta.id,

    nome:
      proposta.nome,

    estadoCuradoria:
      proposta.estadoCuradoria,

    acao:
      proposta.acao,

    urlLocal:
      proposta.urlLocal,

    fonte:
      proposta.fonte,

    fonteUrl:
      proposta.fonteUrl,

    paginaWiki:
      proposta.paginaWiki ||
      "",

    tituloArquivo:
      proposta.tituloArquivo ||
      "",

    pontos:
      proposta.pontos ??
      null,

    positivoAnime:
      Boolean(
        proposta
          .positivoAnime
      ),

    largura:
      proposta.largura ||
      0,

    altura:
      proposta.altura ||
      0,

    mime:
      proposta.mime ||
      "",

    formatoReal:
      proposta.formatoReal ||
      "",

    geradaEm:
      new Date()
        .toISOString()
  };
}


/* ========================================
   RELATÓRIO
======================================== */

function gerarRelatorio({
  totalBanco,
  processados,
  finais,
  propostas,
  pendencias
}) {
  const aprovadas =
    finais.filter(
      item =>
        item.estadoCuradoria ===
        "aprovada"
    );


  const revisoesMantidas =
    finais.filter(
      item =>
        item.estadoCuradoria ===
        "revisar"
    );


  const propostasRevisao =
    propostas.filter(
      item =>
        item.estadoCuradoria ===
        "revisar"
    );


  const propostasRejeitadas =
    propostas.filter(
      item =>
        item.estadoCuradoria ===
        "rejeitada"
    );


  const linhas = [
    "# Relatório de imagens — Banco de Hissatsu",
    "",

    `Gerado em: ${new Date().toISOString()}`,
    "",

    `- Hissatsu factuais no Banco: ${totalBanco}`,
    `- Processadas nesta execução: ${processados}`,
    `- Imagens atualmente exibíveis: ${finais.length}`,
    `- Aprovadas preservadas: ${aprovadas.length}`,
    `- Imagens atuais válidas mantidas em revisão: ${revisoesMantidas.length}`,
    `- Propostas novas aguardando decisão: ${propostas.length}`,
    `- Propostas para itens em revisão: ${propostasRevisao.length}`,
    `- Propostas para itens rejeitados: ${propostasRejeitadas.length}`,
    `- Pendências sem imagem nem proposta: ${pendencias.length}`,
    "",

    "## Regra central",
    "",

    "Uma candidata automática nunca substitui a imagem exibida antes de aprovação humana. Além disso, um arquivo local só é considerado imagem quando sua assinatura interna corresponde a JPEG, PNG, WEBP, GIF ou AVIF.",

    "",

    "## Imagens atualmente exibíveis",
    ""
  ];


  for (
    const item of
    finais
  ) {
    linhas.push(
      `### ${item.nome || item.id}`,
      "",

      `- ID: \`${item.id}\``,

      `- Asset: \`${item.urlLocal}\``,

      `- Estado: ${item.estadoCuradoria || "—"}`,

      `- Decisão: ${item.origemDecisao || "—"}`,

      `- Formato real: ${item.formatoReal || "—"}`,

      `- Fonte: ${item.fonteUrl || "—"}`,

      `- Arquivo de origem: ${item.tituloArquivo || "—"}`,

      ""
    );
  }


  if (
    propostas.length >
      0
  ) {
    linhas.push(
      "## Propostas aguardando aprovação",
      ""
    );


    for (
      const item of
      propostas
    ) {
      linhas.push(
        `### ${item.nome || item.id}`,
        "",

        `- ID: \`${item.id}\``,

        `- Estado atual: ${item.estadoCuradoria}`,

        `- Proposta local: \`${item.urlLocal}\``,

        `- Formato real: ${item.formatoReal || item.mime || "—"}`,

        `- Arquivo de origem: ${item.tituloArquivo || "—"}`,

        `- Pontuação automática: ${item.pontos ?? "—"}`,

        `- Fonte: ${item.fonteUrl || "—"}`,

        ""
      );
    }
  }


  if (
    pendencias.length >
      0
  ) {
    linhas.push(
      "## Pendências sem proposta utilizável",
      ""
    );


    for (
      const item of
      pendencias
    ) {
      linhas.push(
        `### ${item.nome || item.id || "Sem ID"}`,
        "",

        `- ID: \`${item.id || "—"}\``,

        `- Estado: ${item.estadoCuradoria || "—"}`,

        `- Motivo: ${item.motivo || "Falha desconhecida"}`,

        `- Página: ${item.fonteUrl || item.paginaWiki || "—"}`,

        ""
      );
    }
  }


  return linhas.join(
    "\n"
  );
}


/* ========================================
   EXECUÇÃO
======================================== */

async function main() {
  await prepararPastas();


  const curadoria =
    await carregarCuradoria();


  const manifestoAnterior =
    await lerJsonSeguro(
      ARQUIVO_MANIFESTO,
      {}
    );


  const registrosOriginais =
    Array.isArray(
      bancoHissatsuFactual
    )
      ? bancoHissatsuFactual
      : [];


  const registros =
    LIMITE_POR_EXECUCAO >
      0
      ? registrosOriginais.slice(
          0,
          LIMITE_POR_EXECUCAO
        )
      : registrosOriginais;


  const finais =
    [];


  const propostas =
    [];


  const pendencias =
    [];


  console.log(
    `Banco factual: ${registrosOriginais.length} Hissatsu.`
  );


  console.log(
    `Processando: ${registros.length}.`
  );


  console.log(
    "Modo: propostas seguras + validação real de arquivos."
  );


  console.log(
    `Decisões humanas cadastradas: ${
      Object.keys(
        curadoria.registros ||
        {}
      ).length
    }.`
  );


  console.log("");


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
      ) ||
      `registro-${
        indice + 1
      }`;


    const nome =
      texto(
        registro?.nome
      ) ||
      id;


    process.stdout.write(
      `[${
        indice + 1
      }/${
        registros.length
      }] ${nome} ... `
    );


    const resultado =
      await processarRegistro({
        registro,
        curadoria,

        manifestoAnterior:
          manifestoAnterior[
            id
          ] ||
          {}
      });


    if (
      resultado.final
    ) {
      finais.push(
        resultado.final
      );
    }


    if (
      resultado.proposta
    ) {
      propostas.push(
        resultado.proposta
      );
    }


    if (
      resultado.pendencia
    ) {
      pendencias.push(
        resultado.pendencia
      );
    }


    if (
      resultado
        .final
        ?.estadoCuradoria ===
      "aprovada"
    ) {
      console.log(
        "aprovada · preservada · arquivo válido"
      );

    } else if (
      resultado.final &&
      resultado.proposta
    ) {
      console.log(
        `revisão · imagem válida preservada · proposta aguardando aprovação (${resultado.proposta.pontos} pts)`
      );

    } else if (
      resultado.final
    ) {
      console.log(
        "revisão · imagem válida preservada · sem nova proposta"
      );

    } else if (
      resultado
        .proposta
        ?.estadoCuradoria ===
      "rejeitada"
    ) {
      console.log(
        `rejeitada · proposta aguardando aprovação (${resultado.proposta.pontos} pts)`
      );

    } else if (
      resultado.proposta
    ) {
      console.log(
        `revisão sem imagem válida · proposta aguardando aprovação (${resultado.proposta.pontos} pts)`
      );

    } else {
      console.log(
        `${resultado.pendencia?.estadoCuradoria || "pendente"} · sem imagem utilizável (${resultado.pendencia?.motivo || "sem detalhe"})`
      );
    }


    await esperar(
      INTERVALO_REQUISICOES_MS
    );
  }


  /* ======================================
     MANIFESTO FINAL
  ====================================== */

  const manifestoNovo =
    {};


  for (
    const item of
    finais
  ) {
    manifestoNovo[
      item.id
    ] = {
      id:
        item.id,

      nome:
        item.nome,

      urlLocal:
        item.urlLocal,

      fonte:
        item.fonte,

      fonteUrl:
        item.fonteUrl,

      paginaWiki:
        item.paginaWiki ||
        "",

      tituloArquivo:
        item.tituloArquivo ||
        "",

      criterio:
        item.criterio ||
        "",

      origemDecisao:
        item.origemDecisao ||
        "",

      estadoCuradoria:
        item.estadoCuradoria ||
        "",

      pontos:
        item.pontos ??
        null,

      animeProvavel:
        Boolean(
          item
            .animeProvavel
        ),

      formatoReal:
        item.formatoReal ||
        "",

      mimeReal:
        item.mimeReal ||
        "",

      atualizadoEm:
        new Date()
          .toISOString()
    };
  }


  await fs.writeFile(
    ARQUIVO_MANIFESTO,

    JSON.stringify(
      manifestoNovo,
      null,
      2
    ) +
      "\n",

    "utf8"
  );


  /* ======================================
     PROPOSTAS
  ====================================== */

  const propostasJson =
    propostas.map(
      simplificarProposta
    );


  await fs.writeFile(
    ARQUIVO_PROPOSTAS,

    JSON.stringify(
      propostasJson,
      null,
      2
    ) +
      "\n",

    "utf8"
  );


  /* ======================================
     PENDÊNCIAS
  ====================================== */

  const pendenciasJson =
    pendencias.map(
      item => ({
        id:
          item.id ||
          "",

        nome:
          item.nome ||
          "",

        estadoCuradoria:
          item.estadoCuradoria ||
          "",

        paginaWiki:
          item.paginaWiki ||
          "",

        fonteUrl:
          item.fonteUrl ||
          "",

        motivo:
          item.motivo ||
          "",

        candidatas:
          Array.isArray(
            item.candidatas
          )
            ? item
                .candidatas
                .slice(
                  0,
                  8
                )
                .map(
                  simplificarCandidata
                )
            : []
      })
    );


  await fs.writeFile(
    ARQUIVO_PENDENCIAS,

    JSON.stringify(
      pendenciasJson,
      null,
      2
    ) +
      "\n",

    "utf8"
  );


  /* ======================================
     LOTE FINAL
  ====================================== */

  const finaisOrdenados =
    [
      ...finais
    ]
      .sort(
        (
          a,
          b
        ) =>
          String(
            a.id
          )
            .localeCompare(
              String(
                b.id
              ),
              "pt-BR"
            )
      );


  await fs.writeFile(
    ARQUIVO_LOTE_GERADO,

    gerarLoteComplementar(
      finaisOrdenados
    ),

    "utf8"
  );


  /* ======================================
     RELATÓRIO
  ====================================== */

  await fs.writeFile(
    ARQUIVO_RELATORIO,

    gerarRelatorio({
      totalBanco:
        registrosOriginais
          .length,

      processados:
        registros.length,

      finais,
      propostas,
      pendencias
    }),

    "utf8"
  );


  /* ======================================
     RESUMO
  ====================================== */

  const aprovadasPreservadas =
    finais.filter(
      item =>
        item.estadoCuradoria ===
        "aprovada"
    ).length;


  const revisoesPreservadas =
    finais.filter(
      item =>
        item.estadoCuradoria ===
        "revisar"
    ).length;


  const propostasRevisao =
    propostas.filter(
      item =>
        item.estadoCuradoria ===
        "revisar"
    ).length;


  const propostasRejeitadas =
    propostas.filter(
      item =>
        item.estadoCuradoria ===
        "rejeitada"
    ).length;


  console.log("");
  console.log(
    "Concluído."
  );
  console.log("");


  console.log(
    `Banco factual: ${registrosOriginais.length}`
  );


  console.log(
    `Imagens atualmente exibíveis e válidas: ${finais.length}`
  );


  console.log(
    `  Aprovadas preservadas: ${aprovadasPreservadas}`
  );


  console.log(
    `  Revisões com imagem válida preservada: ${revisoesPreservadas}`
  );


  console.log(
    `Propostas aguardando aprovação: ${propostas.length}`
  );


  console.log(
    `  Para itens em revisão: ${propostasRevisao}`
  );


  console.log(
    `  Para itens rejeitados: ${propostasRejeitadas}`
  );


  console.log(
    `Pendências sem imagem nem proposta: ${pendencias.length}`
  );


  console.log("");
  console.log(
    "Validação de bytes reais: ATIVA"
  );


  console.log("");
  console.log(
    "Curadoria preservada: documentacao/IMAGENS_HISSATSU_CURADORIA.json"
  );


  console.log(
    "Gerado: documentacao/IMAGENS_HISSATSU_PROPOSTAS.json"
  );


  console.log(
    "Gerado: src/features/habilidades/data/bancoHissatsuLoteImagensAutomaticas.js"
  );


  console.log(
    "Gerado: documentacao/IMAGENS_HISSATSU_MANIFESTO.json"
  );


  console.log(
    "Gerado: documentacao/IMAGENS_HISSATSU_PENDENTES.json"
  );


  console.log(
    "Gerado: documentacao/RELATORIO_IMAGENS_HISSATSU.md"
  );
}


main()
  .catch(
    erro => {
      console.error("");
      console.error(
        "Falha na catalogação de imagens:"
      );


      console.error(
        erro
      );


      process.exitCode =
        1;
    }
  );
