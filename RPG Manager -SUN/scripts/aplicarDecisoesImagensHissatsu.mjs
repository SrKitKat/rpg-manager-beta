import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";


/* ========================================
   APLICADOR DE DECISÕES VISUAIS HISSATSU

   VERSÃO 1.1

   OBJETIVO:

   Aplicar decisões humanas registradas em:

   documentacao/
   IMAGENS_HISSATSU_DECISOES_PROPOSTAS.json

   AÇÕES:

   aprovar
   → promove a proposta para /referencia/
   → marca a técnica como aprovada

   rejeitar
   → rejeição TOTAL / legada
   → marca a técnica como rejeitada
   → usado quando a imagem atual também
     não deve continuar no catálogo

   rejeitar-proposta
   → rejeita SOMENTE a nova proposta
   → preserva imagem atual
   → preserva estado "revisar"
   → bloqueia o candidato rejeitado

   SEGURANÇA:

   - valida todas as decisões antes de alterar;
   - compara ID e tituloArquivo com a fila atual;
   - decisão antiga/stale interrompe a execução;
   - não altera Banco factual;
   - não altera mecânica;
   - não cria Hissatsu;
   - não executa o catalogador.
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


const PASTA_PROPOSTAS =
  path.join(
    PASTA_HISSATSU,
    "propostas"
  );


const PASTA_REFERENCIA =
  path.join(
    PASTA_HISSATSU,
    "referencia"
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


const ARQUIVO_DECISOES =
  path.join(
    PASTA_DOCUMENTACAO,
    "IMAGENS_HISSATSU_DECISOES_PROPOSTAS.json"
  );


const ARQUIVO_PROPOSTAS =
  path.join(
    PASTA_DOCUMENTACAO,
    "IMAGENS_HISSATSU_PROPOSTAS.json"
  );


const ACOES_VALIDAS =
  new Set([
    "aprovar",
    "rejeitar",
    "rejeitar-proposta"
  ]);


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


function normalizarTexto(
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


async function lerJson(
  caminho,
  descricao
) {
  if (
    !await existe(
      caminho
    )
  ) {
    throw new Error(
      `${descricao} não encontrado: ${caminho}`
    );
  }


  let conteudo;


  try {
    conteudo =
      await fs.readFile(
        caminho,
        "utf8"
      );

  } catch (erro) {
    throw new Error(
      `Não foi possível ler ${descricao}: ${erro.message}`
    );
  }


  try {
    return JSON.parse(
      conteudo
    );

  } catch (erro) {
    throw new Error(
      `${descricao} contém JSON inválido: ${erro.message}`
    );
  }
}


async function escreverJson(
  caminho,
  dados
) {
  await fs.writeFile(
    caminho,

    JSON.stringify(
      dados,
      null,
      2
    ) + "\n",

    "utf8"
  );
}


function urlPublicaDoCaminho(
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


function caminhoDeUrlPublica(
  url
) {
  const valor =
    texto(
      url
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


/* ========================================
   LOCALIZAR PROPOSTA FÍSICA
======================================== */

async function localizarArquivoImagemPorId(
  pasta,
  id
) {
  if (
    !await existe(
      pasta
    )
  ) {
    return null;
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
      const encontrado =
        await localizarArquivoImagemPorId(
          caminho,
          id
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


    return {
      caminho,
      extensao,

      urlLocal:
        urlPublicaDoCaminho(
          caminho
        )
    };
  }


  return null;
}


async function localizarProposta(
  decisao
) {
  const id =
    texto(
      decisao?.id
    );


  const declarada =
    caminhoDeUrlPublica(
      decisao
        ?.propostaAtual
    );


  if (
    declarada &&
    await existe(
      declarada
    )
  ) {
    const extensao =
      path.extname(
        declarada
      )
        .toLowerCase();


    if (
      EXTENSOES_IMAGEM.has(
        extensao
      )
    ) {
      return {
        caminho:
          declarada,

        extensao,

        urlLocal:
          urlPublicaDoCaminho(
            declarada
          )
      };
    }
  }


  return localizarArquivoImagemPorId(
    PASTA_PROPOSTAS,
    id
  );
}


/* ========================================
   REFERÊNCIAS AUTOMÁTICAS ANTIGAS
======================================== */

async function removerReferenciasAntigas(
  id,
  preservarCaminho
) {
  if (
    !await existe(
      PASTA_REFERENCIA
    )
  ) {
    return;
  }


  const entradas =
    await fs.readdir(
      PASTA_REFERENCIA,
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


    const caminho =
      path.join(
        PASTA_REFERENCIA,
        entrada.name
      );


    if (
      path.resolve(
        caminho
      ) ===
      path.resolve(
        preservarCaminho
      )
    ) {
      continue;
    }


    await fs.rm(
      caminho,
      {
        force:
          true
      }
    );
  }
}


/* ========================================
   LIMPAR PROPOSTAS PROCESSADAS
======================================== */

async function removerArquivosPropostaPorId(
  id
) {
  if (
    !await existe(
      PASTA_PROPOSTAS
    )
  ) {
    return;
  }


  const entradas =
    await fs.readdir(
      PASTA_PROPOSTAS,
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


    await fs.rm(
      path.join(
        PASTA_PROPOSTAS,
        entrada.name
      ),
      {
        force:
          true
      }
    );
  }
}


/* ========================================
   CANDIDATO REJEITADO
======================================== */

function adicionarCandidatoRejeitado(
  registroCuradoria,
  {
    tituloArquivo,
    motivo
  }
) {
  const atuais =
    Array.isArray(
      registroCuradoria
        ?.candidatosRejeitados
    )
      ? [
          ...registroCuradoria
            .candidatosRejeitados
        ]
      : [];


  const tituloNormalizado =
    normalizarTexto(
      tituloArquivo
    );


  const jaExiste =
    atuais.some(
      item =>
        normalizarTexto(
          item
            ?.tituloArquivo
        ) ===
        tituloNormalizado
    );


  if (
    tituloNormalizado &&
    !jaExiste
  ) {
    atuais.push({
      tituloArquivo:
        texto(
          tituloArquivo
        ),

      motivo:
        texto(
          motivo
        ) ||
        "Candidato rejeitado durante curadoria humana."
    });
  }


  return atuais;
}


/* ========================================
   METADATA DA PROPOSTA
======================================== */

function obterPropostaMetadata(
  propostas,
  id
) {
  if (
    !Array.isArray(
      propostas
    )
  ) {
    return null;
  }


  return (
    propostas.find(
      item =>
        item?.id ===
        id
    ) ||
    null
  );
}


/* ========================================
   VALIDAÇÃO PRÉVIA

   Nenhum arquivo é alterado antes de todas
   as decisões pendentes passarem aqui.

   Também protege contra decisões antigas:

   se o tituloArquivo da decisão for
   diferente da proposta atualmente na fila,
   a execução inteira é interrompida.
======================================== */

async function prepararDecisoes(
  decisoes,
  propostas
) {
  if (
    !Array.isArray(
      decisoes
    )
  ) {
    throw new Error(
      "O campo 'decisoes' deve ser uma lista."
    );
  }


  const ids =
    new Set();


  const preparadas =
    [];


  for (
    let indice = 0;
    indice <
      decisoes.length;
    indice += 1
  ) {
    const decisao =
      decisoes[
        indice
      ];


    if (
      decisao
        ?.aplicada ===
      true
    ) {
      continue;
    }


    const id =
      texto(
        decisao?.id
      );


    const acao =
      texto(
        decisao?.acao
      );


    if (!id) {
      throw new Error(
        `Decisão ${indice + 1}: ID ausente.`
      );
    }


    if (
      ids.has(
        id
      )
    ) {
      throw new Error(
        `ID duplicado nas decisões pendentes: ${id}`
      );
    }


    ids.add(
      id
    );


    if (
      !ACOES_VALIDAS.has(
        acao
      )
    ) {
      throw new Error(
        `Decisão ${id}: ação inválida "${acao}".`
      );
    }


    const propostaMetadata =
      obterPropostaMetadata(
        propostas,
        id
      );


    if (
      !propostaMetadata
    ) {
      throw new Error(
        `Decisão ${id}: o ID não existe mais na fila atual de propostas. Nenhuma decisão foi aplicada.`
      );
    }


    const tituloDecisao =
      normalizarTexto(
        decisao
          ?.tituloArquivo
      );


    const tituloFila =
      normalizarTexto(
        propostaMetadata
          ?.tituloArquivo
      );


    if (
      tituloDecisao &&
      tituloFila &&
      tituloDecisao !==
        tituloFila
    ) {
      throw new Error(
        `Decisão ${id}: candidato mudou.\n` +
        `Decisão: ${decisao.tituloArquivo}\n` +
        `Fila atual: ${propostaMetadata.tituloArquivo}\n` +
        "Nenhuma decisão foi aplicada."
      );
    }


    let propostaFisica =
      null;


    if (
      acao ===
      "aprovar"
    ) {
      propostaFisica =
        await localizarProposta(
          decisao
        );


      if (
        !propostaFisica
      ) {
        throw new Error(
          `Decisão ${id}: proposta física não encontrada. Nenhuma decisão foi aplicada.`
        );
      }
    }


    preparadas.push({
      indice,
      decisao,
      id,
      acao,

      propostaMetadata,

      propostaFisica
    });
  }


  return preparadas;
}


/* ========================================
   EXECUÇÃO
======================================== */

async function main() {
  await fs.mkdir(
    PASTA_REFERENCIA,
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


  const curadoria =
    await lerJson(
      ARQUIVO_CURADORIA,
      "arquivo de curadoria"
    );


  const arquivoDecisoes =
    await lerJson(
      ARQUIVO_DECISOES,
      "arquivo de decisões"
    );


  const propostas =
    await lerJson(
      ARQUIVO_PROPOSTAS,
      "arquivo de propostas"
    );


  if (
    !curadoria.registros ||
    typeof curadoria.registros !==
      "object"
  ) {
    curadoria.registros =
      {};
  }


  const preparadas =
    await prepararDecisoes(
      arquivoDecisoes
        .decisoes,
      propostas
    );


  console.log(
    `Decisões pendentes: ${preparadas.length}`
  );


  if (
    preparadas.length ===
      0
  ) {
    console.log(
      "Nenhuma decisão nova para aplicar."
    );

    return;
  }


  console.log("");


  const idsProcessados =
    new Set();


  let aprovadas =
    0;


  let rejeitadasTotais =
    0;


  let propostasRejeitadas =
    0;


  const agora =
    new Date()
      .toISOString();


  for (
    const preparada of
    preparadas
  ) {
    const {
      indice,
      decisao,
      id,
      acao,
      propostaMetadata,
      propostaFisica
    } =
      preparada;


    const registroAnterior =
      curadoria
        .registros[
          id
        ] ||
      {};


    /* ======================================
       APROVAR
    ====================================== */

    if (
      acao ===
      "aprovar"
    ) {
      const extensaoReal =
        propostaFisica
          .extensao;


      const destino =
        path.join(
          PASTA_REFERENCIA,
          `${id}${extensaoReal}`
        );


      await fs.copyFile(
        propostaFisica
          .caminho,
        destino
      );


      await removerReferenciasAntigas(
        id,
        destino
      );


      curadoria
        .registros[
          id
        ] = {
        ...registroAnterior,

        estado:
          "aprovada",

        imagemAtual:
          urlPublicaDoCaminho(
            destino
          ),

        candidatoAtual:
          texto(
            decisao
              .tituloArquivo
          ) ||
          texto(
            propostaMetadata
              ?.tituloArquivo
          ) ||
          texto(
            registroAnterior
              ?.candidatoAtual
          ),

        observacao:
          texto(
            decisao.motivo
          ) ||
          "Proposta aprovada durante curadoria humana."
      };


      arquivoDecisoes
        .decisoes[
          indice
        ] = {
        ...decisao,

        aplicada:
          true,

        aplicadaEm:
          agora,

        resultado:
          "aprovada",

        destinoReal:
          urlPublicaDoCaminho(
            destino
          )
      };


      idsProcessados.add(
        id
      );


      aprovadas +=
        1;


      console.log(
        `✅ ${id} — APROVADA → ${urlPublicaDoCaminho(destino)}`
      );


      continue;
    }


    /* ======================================
       REJEITAR — TOTAL / LEGADO

       A técnica passa para "rejeitada".

       Use somente quando a imagem atual
       também não deve permanecer.
    ====================================== */

    if (
      acao ===
      "rejeitar"
    ) {
      const candidatosRejeitados =
        adicionarCandidatoRejeitado(
          registroAnterior,
          {
            tituloArquivo:
              decisao
                .tituloArquivo,

            motivo:
              decisao
                .motivo
          }
        );


      curadoria
        .registros[
          id
        ] = {
        ...registroAnterior,

        estado:
          "rejeitada",

        candidatoAtual:
          texto(
            decisao
              .tituloArquivo
          ) ||
          texto(
            registroAnterior
              ?.candidatoAtual
          ),

        observacao:
          texto(
            decisao.motivo
          ) ||
          "Imagem rejeitada durante curadoria humana.",

        candidatosRejeitados
      };


      arquivoDecisoes
        .decisoes[
          indice
        ] = {
        ...decisao,

        aplicada:
          true,

        aplicadaEm:
          agora,

        resultado:
          "rejeitada"
      };


      idsProcessados.add(
        id
      );


      rejeitadasTotais +=
        1;


      console.log(
        `❌ ${id} — IMAGEM/TÉCNICA REJEITADA`
      );


      continue;
    }


    /* ======================================
       REJEITAR SOMENTE A PROPOSTA

       Esta é a ação usada normalmente em
       itens que continuam em "revisar".

       A imagem atual permanece.
       O estado atual permanece.
       candidatoAtual permanece.

       Somente a nova proposta entra na
       blacklist.
    ====================================== */

    if (
      acao ===
      "rejeitar-proposta"
    ) {
      const candidatosRejeitados =
        adicionarCandidatoRejeitado(
          registroAnterior,
          {
            tituloArquivo:
              decisao
                .tituloArquivo ||
              propostaMetadata
                ?.tituloArquivo,

            motivo:
              decisao
                .motivo
          }
        );


      const estadoAnterior =
        ESTADOS_CURADORIA.has(
          registroAnterior
            ?.estado
        )
          ? registroAnterior
              .estado
          : "revisar";


      curadoria
        .registros[
          id
        ] = {
        ...registroAnterior,

        estado:
          estadoAnterior,

        candidatosRejeitados
      };


      arquivoDecisoes
        .decisoes[
          indice
        ] = {
        ...decisao,

        aplicada:
          true,

        aplicadaEm:
          agora,

        resultado:
          "proposta-rejeitada",

        estadoPreservado:
          estadoAnterior
      };


      idsProcessados.add(
        id
      );


      propostasRejeitadas +=
        1;


      console.log(
        `🚫 ${id} — PROPOSTA REJEITADA · estado ${estadoAnterior} preservado`
      );
    }
  }


  /* ========================================
     REMOVER PROCESSADOS DA FILA
  ======================================== */

  const propostasRestantes =
    Array.isArray(
      propostas
    )
      ? propostas.filter(
          item =>
            !idsProcessados.has(
              item?.id
            )
        )
      : [];


  /*
    Persistimos os JSONs antes de apagar
    os arquivos físicos das propostas.
  */

  await escreverJson(
    ARQUIVO_CURADORIA,
    curadoria
  );


  await escreverJson(
    ARQUIVO_DECISOES,
    arquivoDecisoes
  );


  await escreverJson(
    ARQUIVO_PROPOSTAS,
    propostasRestantes
  );


  for (
    const id of
    idsProcessados
  ) {
    await removerArquivosPropostaPorId(
      id
    );
  }


  console.log("");
  console.log(
    "Decisões aplicadas."
  );
  console.log("");


  console.log(
    `Aprovadas: ${aprovadas}`
  );


  console.log(
    `Rejeições totais: ${rejeitadasTotais}`
  );


  console.log(
    `Somente propostas rejeitadas: ${propostasRejeitadas}`
  );


  console.log(
    `Propostas restantes: ${propostasRestantes.length}`
  );


  console.log("");


  console.log(
    "Curadoria atualizada:"
  );


  console.log(
    "documentacao/IMAGENS_HISSATSU_CURADORIA.json"
  );


  console.log("");


  console.log(
    "Decisões marcadas como aplicadas:"
  );


  console.log(
    "documentacao/IMAGENS_HISSATSU_DECISOES_PROPOSTAS.json"
  );


  console.log("");


  console.log(
    "IMPORTANTE: o catalogador ainda não foi executado."
  );


  console.log(
    "O Banco factual não foi alterado."
  );
}


main()
  .catch(
    erro => {
      console.error("");
      console.error(
        "Falha ao aplicar decisões:"
      );
      console.error(
        erro
      );

      process.exitCode =
        1;
    }
  );