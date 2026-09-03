import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";


/* ========================================
   QUARENTENA DE VÍDEOS HISSATSU LEGADOS

   VERSÃO 1.0

   Problema identificado:

   Alguns arquivos antigos possuem extensão:

   .jpg
   .png
   .webp
   etc.

   mas o conteúdo real é MP4.

   Exemplo:

   corodra-shoot.jpg
   → bytes: ftypmp42
   → na realidade é vídeo MP4.

   OBJETIVO:

   - localizar esses arquivos;
   - NÃO apagá-los;
   - movê-los para:
     public/assets/hissatsu/fontes-video/legado/
   - corrigir a extensão para .mp4;
   - gerar relatório;
   - não tocar no Banco factual;
   - não tocar na mecânica;
   - não alterar a curadoria;
   - não executar o catalogador.

   Esses vídeos poderão futuramente servir
   como fonte para extrair frames melhores.
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


const PASTA_VIDEOS_LEGADO =
  path.join(
    PASTA_HISSATSU,
    "fontes-video",
    "legado"
  );


const PASTA_DOCUMENTACAO =
  path.join(
    RAIZ_PROJETO,
    "documentacao"
  );


const ARQUIVO_RELATORIO =
  path.join(
    PASTA_DOCUMENTACAO,
    "IMAGENS_HISSATSU_VIDEOS_LEGADO.json"
  );


const EXTENSOES_DECLARADAS_COMO_IMAGEM =
  new Set([
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif",
    ".avif"
  ]);


/* ========================================
   UTILIDADES
======================================== */

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


function urlPublica(
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


async function lerCabecalho(
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


/* ========================================
   DETECÇÃO DO CONTEÚDO REAL
======================================== */

function detectarMp4(
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


  const marcador =
    buffer
      .subarray(
        4,
        8
      )
      .toString(
        "ascii"
      );


  if (
    marcador !==
      "ftyp"
  ) {
    return null;
  }


  const marcaPrincipal =
    buffer
      .subarray(
        8,
        12
      )
      .toString(
        "ascii"
      );


  /*
    AVIF também usa estrutura ISO-BMFF
    com "ftyp", então não pode ser
    classificado como MP4 por engano.
  */

  if (
    marcaPrincipal === "avif" ||
    marcaPrincipal === "avis"
  ) {
    return null;
  }


  const marcasVideo =
    new Set([
      "mp41",
      "mp42",
      "isom",
      "iso2",
      "avc1",
      "M4V ",
      "M4A ",
      "MSNV"
    ]);


  if (
    marcasVideo.has(
      marcaPrincipal
    )
  ) {
    return {
      tipo:
        "video/mp4",

      marcaPrincipal
    };
  }


  /*
    Os arquivos problemáticos encontrados
    usam mp42. Para formatos ISO-BMFF
    desconhecidos, não movemos nada
    automaticamente.
  */

  return null;
}


/* ========================================
   BUSCA RECURSIVA
======================================== */

async function encontrarVideosDisfarcados(
  pasta,
  resultados = []
) {
  if (
    !await existe(
      pasta
    )
  ) {
    return resultados;
  }


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
    const caminho =
      path.join(
        pasta,
        entrada.name
      );


    if (
      entrada.isDirectory()
    ) {
      /*
        Não processar novamente a própria
        pasta de vídeos já corrigidos.
      */

      if (
        caminho.startsWith(
          PASTA_VIDEOS_LEGADO
        )
      ) {
        continue;
      }


      await encontrarVideosDisfarcados(
        caminho,
        resultados
      );

      continue;
    }


    if (
      !entrada.isFile()
    ) {
      continue;
    }


    const extensao =
      path.extname(
        entrada.name
      )
        .toLowerCase();


    if (
      !EXTENSOES_DECLARADAS_COMO_IMAGEM.has(
        extensao
      )
    ) {
      continue;
    }


    const cabecalho =
      await lerCabecalho(
        caminho
      );


    const deteccao =
      detectarMp4(
        cabecalho
      );


    if (
      !deteccao
    ) {
      continue;
    }


    const stat =
      await fs.stat(
        caminho
      );


    resultados.push({
      caminho,
      extensaoAnterior:
        extensao,

      id:
        path.basename(
          entrada.name,
          extensao
        ),

      bytes:
        stat.size,

      marcaPrincipal:
        deteccao
          .marcaPrincipal
    });
  }


  return resultados;
}


/* ========================================
   DESTINO SEM SOBRESCRITA ACIDENTAL
======================================== */

async function escolherDestino(
  id
) {
  const base =
    path.join(
      PASTA_VIDEOS_LEGADO,
      `${id}.mp4`
    );


  if (
    !await existe(
      base
    )
  ) {
    return base;
  }


  let indice =
    2;


  while (
    true
  ) {
    const candidato =
      path.join(
        PASTA_VIDEOS_LEGADO,
        `${id}-${indice}.mp4`
      );


    if (
      !await existe(
        candidato
      )
    ) {
      return candidato;
    }


    indice +=
      1;
  }
}


/* ========================================
   MOVIMENTAÇÃO SEGURA
======================================== */

async function moverArquivo(
  origem,
  destino
) {
  try {
    await fs.rename(
      origem,
      destino
    );

  } catch {
    /*
      Fallback para situações em que rename
      não seja permitido.
    */

    await fs.copyFile(
      origem,
      destino
    );


    const existeDestino =
      await existe(
        destino
      );


    if (
      !existeDestino
    ) {
      throw new Error(
        `Falha ao copiar ${origem}`
      );
    }


    await fs.rm(
      origem,
      {
        force:
          true
      }
    );
  }
}


/* ========================================
   EXECUÇÃO
======================================== */

async function main() {
  await fs.mkdir(
    PASTA_VIDEOS_LEGADO,
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


  const encontrados =
    await encontrarVideosDisfarcados(
      PASTA_HISSATSU
    );


  console.log(
    `Vídeos disfarçados encontrados: ${encontrados.length}`
  );


  if (
    encontrados.length ===
      0
  ) {
    console.log(
      "Nenhum arquivo precisa ser movido."
    );

    return;
  }


  console.log("");


  const movidos =
    [];


  for (
    const item of
    encontrados
  ) {
    const destino =
      await escolherDestino(
        item.id
      );


    await moverArquivo(
      item.caminho,
      destino
    );


    const registro = {
      id:
        item.id,

      origemAnterior:
        urlPublica(
          item.caminho
        ),

      destinoVideo:
        urlPublica(
          destino
        ),

      extensaoAnterior:
        item
          .extensaoAnterior,

      formatoReal:
        "video/mp4",

      marcaPrincipal:
        item
          .marcaPrincipal,

      tamanhoBytes:
        item.bytes,

      observacao:
        "Arquivo possuía extensão de imagem, mas assinatura interna de vídeo MP4. Preservado como fonte de vídeo para futura extração de frame."
    };


    movidos.push(
      registro
    );


    console.log(
      `🎞️ ${item.id} → ${registro.destinoVideo}`
    );
  }


  const relatorio = {
    versao:
      1,

    geradoEm:
      new Date()
        .toISOString(),

    total:
      movidos.length,

    descricao:
      "Vídeos legados que estavam armazenados com extensão de imagem. Foram preservados como MP4 para possível extração futura de frames.",

    arquivos:
      movidos
  };


  await fs.writeFile(
    ARQUIVO_RELATORIO,

    JSON.stringify(
      relatorio,
      null,
      2
    ) + "\n",

    "utf8"
  );


  console.log("");
  console.log(
    "Quarentena concluída."
  );


  console.log(
    `Vídeos preservados: ${movidos.length}`
  );


  console.log("");
  console.log(
    "Destino:"
  );


  console.log(
    "public/assets/hissatsu/fontes-video/legado/"
  );


  console.log("");
  console.log(
    "Relatório:"
  );


  console.log(
    "documentacao/IMAGENS_HISSATSU_VIDEOS_LEGADO.json"
  );


  console.log("");
  console.log(
    "IMPORTANTE:"
  );


  console.log(
    "- Nenhuma Hissatsu factual foi alterada."
  );


  console.log(
    "- Nenhuma mecânica foi alterada."
  );


  console.log(
    "- O catalogador não foi executado."
  );


  console.log(
    "- Os vídeos não foram apagados."
  );
}


main()
  .catch(
    erro => {
      console.error("");
      console.error(
        "Falha ao colocar vídeos legados em quarentena:"
      );

      console.error(
        erro
      );

      process.exitCode =
        1;
    }
  );
