import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";


/* ========================================
   APLICADOR DE DECISÕES VISUAIS HISSATSU

   VERSÃO 1.0

   Aplica decisões registradas em:

   documentacao/
   IMAGENS_HISSATSU_DECISOES_CANDIDATOS_VISUAIS.json

   SOBRE candidatos gerados em:

   documentacao/
   IMAGENS_HISSATSU_CANDIDATOS_VISUAIS.json

   SEGURANÇA:

   - valida TODAS as decisões antes de alterar;
   - confirma ID + URL + título da candidata;
   - valida os bytes reais da imagem;
   - nunca usa vídeo como imagem;
   - não altera Banco factual;
   - não altera mecânica;
   - não altera manifesto;
   - não altera lote automático;
   - não executa catalogador;
   - não apaga candidatos visuais;
   - decisões já aplicadas não são reaplicadas.

   A promoção real só copia:

   candidatos-visuais/<id>/...
            ↓
   referencia/<id>.<extensão-real>

   Depois será necessário executar o
   catalogador em uma etapa separada.
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


const PASTA_CANDIDATOS =
  path.join(
    PASTA_HISSATSU,
    "candidatos-visuais"
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


const ARQUIVO_DECISOES =
  path.join(
    PASTA_DOCUMENTACAO,
    "IMAGENS_HISSATSU_DECISOES_CANDIDATOS_VISUAIS.json"
  );


const ARQUIVO_CANDIDATOS =
  path.join(
    PASTA_DOCUMENTACAO,
    "IMAGENS_HISSATSU_CANDIDATOS_VISUAIS.json"
  );


const ARQUIVO_CURADORIA =
  path.join(
    PASTA_DOCUMENTACAO,
    "IMAGENS_HISSATSU_CURADORIA.json"
  );


const ACOES_VALIDAS =
  new Set([
    "selecionar-candidato",
    "manter-revisao",
    "buscar-novamente"
  ]);


const ESTADOS_VALIDOS =
  new Set([
    "aprovada",
    "revisar",
    "rejeitada"
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
    .toLowerCase()
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


async function lerJsonObrigatorio(
  caminho
) {
  if (
    !await existe(
      caminho
    )
  ) {
    throw new Error(
      `Arquivo obrigatório não encontrado:\n${caminho}`
    );
  }


  const conteudo =
    await fs.readFile(
      caminho,
      "utf8"
    );


  try {
    return JSON.parse(
      conteudo
    );

  } catch (
    erro
  ) {
    throw new Error(
      `JSON inválido em ${caminho}:\n${erro.message}`
    );
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


async function salvarJson(
  caminho,
  dados
) {
  await fs.writeFile(
    caminho,

    JSON.stringify(
      dados,
      null,
      2
    ) +
      "\n",

    "utf8"
  );
}


function converterUrlPublicaParaCaminho(
  url
) {
  const valor =
    texto(
      url
    );


  if (
    !valor.startsWith("/")
  ) {
    throw new Error(
      `URL local inválida: ${valor}`
    );
  }


  const partes =
    valor
      .replace(
        /^\/+/,
        ""
      )
      .split("/")
      .filter(
        Boolean
      );


  const caminho =
    path.resolve(
      PASTA_PUBLIC,
      ...partes
    );


  const raizPublic =
    path.resolve(
      PASTA_PUBLIC
    );


  if (
    !caminho.startsWith(
      raizPublic +
      path.sep
    )
  ) {
    throw new Error(
      `Caminho saiu da pasta public: ${valor}`
    );
  }


  return caminho;
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


  return null;
}


async function validarImagem(
  caminho
) {
  if (
    !await existe(
      caminho
    )
  ) {
    return {
      valida:
        false,

      motivo:
        "arquivo não encontrado",

      formato:
        null
    };
  }


  const buffer =
    await fs.readFile(
      caminho
    );


  if (
    buffer.length <
      4096
  ) {
    return {
      valida:
        false,

      motivo:
        "arquivo pequeno demais",

      formato:
        null
    };
  }


  const formato =
    detectarFormatoImagemBuffer(
      buffer
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

    formato,

    bytes:
      buffer.length
  };
}


/* ========================================
   ÍNDICE DOS CANDIDATOS
======================================== */

function criarMapaResultadosCandidatos(
  dados
) {
  const resultados =
    Array.isArray(
      dados?.resultados
    )
      ? dados.resultados
      : [];


  const mapa =
    new Map();


  for (
    const resultado of
    resultados
  ) {
    const id =
      texto(
        resultado?.id
      );


    if (
      !id
    ) {
      continue;
    }


    mapa.set(
      id,
      resultado
    );
  }


  return mapa;
}


function encontrarCandidatoExato({
  resultado,
  referencia
}) {
  if (
    !resultado ||
    !referencia
  ) {
    return null;
  }


  const candidatos =
    Array.isArray(
      resultado.candidatos
    )
      ? resultado.candidatos
      : [];


  const url =
    texto(
      referencia.urlLocal
    );


  const titulo =
    texto(
      referencia.tituloArquivo
    );


  return (
    candidatos.find(
      candidato =>
        texto(
          candidato?.urlLocal
        ) ===
          url &&
        texto(
          candidato?.tituloArquivo
        ) ===
          titulo
    ) ||
    null
  );
}


/* ========================================
   CANDIDATOS REJEITADOS

   Mantemos histórico sem duplicar títulos.
======================================== */

function normalizarListaRejeitados(
  valor
) {
  return Array.isArray(
    valor
  )
    ? valor.filter(
        Boolean
      )
    : [];
}


function adicionarRejeitado({
  lista,
  candidato,
  motivo,
  origem
}) {
  const titulo =
    texto(
      candidato?.tituloArquivo
    );


  if (
    !titulo
  ) {
    return lista;
  }


  const tituloN =
    normalizar(
      titulo
    );


  const jaExiste =
    lista.some(
      item =>
        normalizar(
          item?.tituloArquivo
        ) ===
        tituloN
    );


  if (
    jaExiste
  ) {
    return lista;
  }


  return [
    ...lista,

    {
      tituloArquivo:
        titulo,

      urlLocal:
        texto(
          candidato?.urlLocal
        ),

      motivo:
        texto(
          motivo
        ) ||
        "Candidato visual rejeitado durante curadoria.",

      origem:
        origem ||
        "candidatos-visuais-v1",

      rejeitadoEm:
        new Date()
          .toISOString()
    }
  ];
}


/* ========================================
   PRÉ-VALIDAÇÃO

   Nenhum arquivo é alterado antes de TODAS
   as decisões passarem por esta etapa.
======================================== */

async function prevalidarDecisoes({
  decisoesPendentes,
  mapaResultados
}) {
  const preparadas =
    [];


  const erros =
    [];


  for (
    const decisao of
    decisoesPendentes
  ) {
    const id =
      texto(
        decisao?.id
      );


    const acao =
      texto(
        decisao?.acao
      );


    if (
      !id
    ) {
      erros.push(
        "Existe decisão sem ID."
      );

      continue;
    }


    if (
      !ACOES_VALIDAS.has(
        acao
      )
    ) {
      erros.push(
        `${id}: ação inválida "${acao}".`
      );

      continue;
    }


    const estadoDepois =
      texto(
        decisao?.estadoDepois
      );


    if (
      estadoDepois &&
      !ESTADOS_VALIDOS.has(
        estadoDepois
      )
    ) {
      erros.push(
        `${id}: estadoDepois inválido "${estadoDepois}".`
      );

      continue;
    }


    const resultado =
      mapaResultados.get(
        id
      ) ||
      null;


    /* ====================================
       SELECIONAR CANDIDATO
    ==================================== */

    if (
      acao ===
        "selecionar-candidato"
    ) {
      if (
        !resultado
      ) {
        erros.push(
          `${id}: não existe resultado correspondente no arquivo de candidatos visuais.`
        );

        continue;
      }


      const candidato =
        encontrarCandidatoExato({
          resultado,

          referencia:
            decisao
              .candidatoSelecionado
        });


      if (
        !candidato
      ) {
        erros.push(
          `${id}: candidato selecionado não corresponde exatamente a URL + título presentes no arquivo de candidatos.`
        );

        continue;
      }


      const urlLocal =
        texto(
          candidato
            .urlLocal
        );


      if (
        !urlLocal.startsWith(
          "/assets/hissatsu/candidatos-visuais/"
        )
      ) {
        erros.push(
          `${id}: candidato selecionado não está na pasta candidatos-visuais.`
        );

        continue;
      }


      let caminho;


      try {
        caminho =
          converterUrlPublicaParaCaminho(
            urlLocal
          );

      } catch (
        erro
      ) {
        erros.push(
          `${id}: ${erro.message}`
        );

        continue;
      }


      const raizCandidatos =
        path.resolve(
          PASTA_CANDIDATOS
        );


      if (
        !path
          .resolve(
            caminho
          )
          .startsWith(
            raizCandidatos +
            path.sep
          )
      ) {
        erros.push(
          `${id}: arquivo candidato está fora da pasta segura de candidatos.`
        );

        continue;
      }


      const validacao =
        await validarImagem(
          caminho
        );


      if (
        !validacao.valida
      ) {
        erros.push(
          `${id}: candidato selecionado não é uma imagem válida (${validacao.motivo}).`
        );

        continue;
      }


      preparadas.push({
        decisao,
        resultado,
        candidato,
        caminhoOrigem:
          caminho,

        formato:
          validacao.formato
      });


      continue;
    }


    /* ====================================
       MANTER REVISÃO
    ==================================== */

    if (
      acao ===
        "manter-revisao"
    ) {
      if (
        !resultado
      ) {
        erros.push(
          `${id}: decisão manter-revisao não possui resultado correspondente.`
        );

        continue;
      }


      const rejeitadosDeclarados =
        Array.isArray(
          decisao
            ?.candidatosRejeitadosNesteLote
        )
          ? decisao
              .candidatosRejeitadosNesteLote
          : [];


      const rejeitadosValidados =
        [];


      for (
        const rejeitado of
        rejeitadosDeclarados
      ) {
        const candidato =
          encontrarCandidatoExato({
            resultado,

            referencia:
              rejeitado
          });


        if (
          !candidato
        ) {
          erros.push(
            `${id}: candidato declarado como rejeitado não corresponde ao arquivo de candidatos (${texto(rejeitado?.tituloArquivo)}).`
          );

          continue;
        }


        rejeitadosValidados.push({
          candidato,

          motivo:
            texto(
              rejeitado?.motivo
            )
        });
      }


      preparadas.push({
        decisao,
        resultado,
        rejeitadosValidados
      });


      continue;
    }


    /* ====================================
       BUSCAR NOVAMENTE
    ==================================== */

    if (
      acao ===
        "buscar-novamente"
    ) {
      preparadas.push({
        decisao,
        resultado
      });
    }
  }


  if (
    erros.length >
      0
  ) {
    throw new Error(
      [
        "A aplicação foi cancelada antes de qualquer alteração.",
        "",
        "Erros encontrados:",
        "",
        ...erros.map(
          erro =>
            `- ${erro}`
        )
      ].join(
        "\n"
      )
    );
  }


  return preparadas;
}


/* ========================================
   PROMOÇÃO PARA REFERÊNCIA
======================================== */

async function promoverParaReferencia({
  id,
  caminhoOrigem,
  formato
}) {
  await fs.mkdir(
    PASTA_REFERENCIA,
    {
      recursive:
        true
    }
  );


  const extensao =
    formato.extensao;


  const destino =
    path.join(
      PASTA_REFERENCIA,
      `${id}${extensao}`
    );


  /*
    O candidato original NÃO é removido.

    Mantemos a camada de candidatos como
    histórico visual.
  */

  await fs.copyFile(
    caminhoOrigem,
    destino
  );


  const validacao =
    await validarImagem(
      destino
    );


  if (
    !validacao.valida
  ) {
    throw new Error(
      `${id}: a cópia promovida falhou na validação final (${validacao.motivo}).`
    );
  }


  return {
    caminho:
      destino,

    urlLocal:
      converterCaminhoParaUrlPublica(
        destino
      ),

    formato:
      validacao.formato
  };
}


/* ========================================
   EXECUÇÃO
======================================== */

async function main() {
  const dadosDecisoes =
    await lerJsonObrigatorio(
      ARQUIVO_DECISOES
    );


  const dadosCandidatos =
    await lerJsonObrigatorio(
      ARQUIVO_CANDIDATOS
    );


  const curadoria =
    await lerJsonSeguro(
      ARQUIVO_CURADORIA,
      {
        versao:
          2,

        estadoPadrao:
          "revisar",

        registros:
          {}
      }
    );


  if (
    !curadoria.registros ||
    typeof curadoria.registros !==
      "object" ||
    Array.isArray(
      curadoria.registros
    )
  ) {
    curadoria.registros =
      {};
  }


  const decisoes =
    Array.isArray(
      dadosDecisoes
        ?.decisoes
    )
      ? dadosDecisoes.decisoes
      : [];


  if (
    decisoes.length ===
      0
  ) {
    throw new Error(
      "Nenhuma decisão encontrada."
    );
  }


  /*
    Decisões já marcadas com aplicadaEm
    não são executadas de novo.
  */

  const decisoesPendentes =
    decisoes.filter(
      decisao =>
        !texto(
          decisao?.aplicadaEm
        )
    );


  console.log(
    `Decisões cadastradas: ${decisoes.length}`
  );


  console.log(
    `Decisões pendentes: ${decisoesPendentes.length}`
  );


  console.log(
    ""
  );


  if (
    decisoesPendentes.length ===
      0
  ) {
    console.log(
      "Nenhuma decisão pendente."
    );

    return;
  }


  const mapaResultados =
    criarMapaResultadosCandidatos(
      dadosCandidatos
    );


  /*
    PRIMEIRO validamos tudo.

    Até este ponto nenhum arquivo do projeto
    foi alterado.
  */

  const preparadas =
    await prevalidarDecisoes({
      decisoesPendentes,
      mapaResultados
    });


  console.log(
    "Pré-validação concluída."
  );


  console.log(
    "Todas as decisões pendentes são compatíveis com os candidatos atuais."
  );


  console.log(
    ""
  );


  let selecionadas =
    0;


  let aprovadas =
    0;


  let fallbacksRevisao =
    0;


  let mantidasRevisao =
    0;


  let buscarNovamente =
    0;


  let rejeitadosRegistrados =
    0;


  /*
    Agora aplicamos sobre uma cópia lógica
    da curadoria.
  */

  const novaCuradoria =
    structuredClone(
      curadoria
    );


  novaCuradoria.registros =
    novaCuradoria.registros ||
    {};


  const momento =
    new Date()
      .toISOString();


  for (
    const preparada of
    preparadas
  ) {
    const decisao =
      preparada.decisao;


    const id =
      texto(
        decisao.id
      );


    const acao =
      texto(
        decisao.acao
      );


    const registroAnterior =
      novaCuradoria
        .registros[
          id
        ] ||
      {};


    let candidatosRejeitados =
      normalizarListaRejeitados(
        registroAnterior
          .candidatosRejeitados
      );


    /* ====================================
       SELECIONAR CANDIDATO
    ==================================== */

    if (
      acao ===
        "selecionar-candidato"
    ) {
      const promocao =
        await promoverParaReferencia({
          id,

          caminhoOrigem:
            preparada
              .caminhoOrigem,

          formato:
            preparada
              .formato
        });


      /*
        Se a decisão pede para rejeitar os
        demais candidatos deste lote, eles
        entram no blacklist visual.
      */

      if (
        decisao
          .rejeitarDemaisCandidatosDoLote ===
        true
      ) {
        const candidatos =
          Array.isArray(
            preparada
              .resultado
              ?.candidatos
          )
            ? preparada
                .resultado
                .candidatos
            : [];


        for (
          const candidato of
          candidatos
        ) {
          if (
            texto(
              candidato
                ?.urlLocal
            ) ===
              texto(
                preparada
                  .candidato
                  ?.urlLocal
              ) &&
            texto(
              candidato
                ?.tituloArquivo
            ) ===
              texto(
                preparada
                  .candidato
                  ?.tituloArquivo
              )
          ) {
            continue;
          }


          const tamanhoAntes =
            candidatosRejeitados
              .length;


          candidatosRejeitados =
            adicionarRejeitado({
              lista:
                candidatosRejeitados,

              candidato,

              motivo:
                "Outra candidata foi escolhida como melhor referência visual neste lote.",

              origem:
                "candidatos-visuais-v1"
            });


          if (
            candidatosRejeitados
              .length >
            tamanhoAntes
          ) {
            rejeitadosRegistrados +=
              1;
          }
        }
      }


      const estadoDepois =
        texto(
          decisao.estadoDepois
        ) ||
        "revisar";


      novaCuradoria
        .registros[
          id
        ] = {
          ...registroAnterior,

          estado:
            estadoDepois,

          imagemAtual:
            promocao.urlLocal,

          candidatoAtual:
            texto(
              preparada
                .candidato
                ?.tituloArquivo
            ),

          candidatosRejeitados,

          classificacaoVisual:
            texto(
              decisao
                .classificacaoVisual
            ),

          ultimaDecisaoVisual: {
            acao:
              "selecionar-candidato",

            origem:
              "candidatos-visuais-v1",

            tituloArquivo:
              texto(
                preparada
                  .candidato
                  ?.tituloArquivo
              ),

            urlOrigem:
              texto(
                preparada
                  .candidato
                  ?.urlLocal
              ),

            urlReferencia:
              promocao.urlLocal,

            motivo:
              texto(
                decisao.motivo
              ),

            aplicadaEm:
              momento
          }
        };


      selecionadas +=
        1;


      if (
        estadoDepois ===
          "aprovada"
      ) {
        aprovadas +=
          1;


        console.log(
          `✅ ${id} — candidato promovido e APROVADO → ${promocao.urlLocal}`
        );

      } else {
        fallbacksRevisao +=
          1;


        console.log(
          `🟡 ${id} — candidato promovido como FALLBACK · continua em revisão → ${promocao.urlLocal}`
        );
      }


      continue;
    }


    /* ====================================
       MANTER REVISÃO
    ==================================== */

    if (
      acao ===
        "manter-revisao"
    ) {
      for (
        const item of
        preparada
          .rejeitadosValidados ||
        []
      ) {
        const tamanhoAntes =
          candidatosRejeitados
            .length;


        candidatosRejeitados =
          adicionarRejeitado({
            lista:
              candidatosRejeitados,

            candidato:
              item.candidato,

            motivo:
              item.motivo,

            origem:
              "candidatos-visuais-v1"
          });


        if (
          candidatosRejeitados
            .length >
          tamanhoAntes
        ) {
          rejeitadosRegistrados +=
            1;
        }
      }


      novaCuradoria
        .registros[
          id
        ] = {
          ...registroAnterior,

          estado:
            "revisar",

          candidatosRejeitados,

          candidatoPreferidoProvisorio:
            decisao
              .candidatoPreferidoProvisorio ||
            null,

          alternativasMantidas:
            Array.isArray(
              decisao
                .candidatosMantidosComoAlternativa
            )
              ? decisao
                  .candidatosMantidosComoAlternativa
              : [],

          classificacaoVisual:
            texto(
              decisao
                .classificacaoVisual
            ),

          ultimaDecisaoVisual: {
            acao:
              "manter-revisao",

            origem:
              "candidatos-visuais-v1",

            motivo:
              texto(
                decisao.motivo
              ),

            aplicadaEm:
              momento
          }
        };


      mantidasRevisao +=
        1;


      console.log(
        `🟠 ${id} — continua em revisão · nenhuma imagem promovida`
      );


      continue;
    }


    /* ====================================
       BUSCAR NOVAMENTE
    ==================================== */

    if (
      acao ===
        "buscar-novamente"
    ) {
      novaCuradoria
        .registros[
          id
        ] = {
          ...registroAnterior,

          estado:
            "revisar",

          classificacaoVisual:
            texto(
              decisao
                .classificacaoVisual
            ),

          ultimaDecisaoVisual: {
            acao:
              "buscar-novamente",

            origem:
              "candidatos-visuais-v1",

            motivo:
              texto(
                decisao.motivo
              ),

            aplicadaEm:
              momento
          }
        };


      buscarNovamente +=
        1;


      console.log(
        `🔎 ${id} — continua em revisão · buscar novamente`
      );
    }
  }


  /*
    Persistimos curadoria somente depois de
    todas as decisões terem sido processadas.
  */

  novaCuradoria
    .atualizadoEm =
    momento;


  await salvarJson(
    ARQUIVO_CURADORIA,
    novaCuradoria
  );


  /*
    Agora marcamos as decisões como
    aplicadas.

    Isso impede reaplicação acidental.
  */

  const idsAplicados =
    new Set(
      decisoesPendentes.map(
        decisao =>
          texto(
            decisao.id
          )
      )
    );


  const decisoesAtualizadas =
    decisoes.map(
      decisao => {
        const id =
          texto(
            decisao?.id
          );


        if (
          !idsAplicados.has(
            id
          ) ||
          texto(
            decisao?.aplicadaEm
          )
        ) {
          return decisao;
        }


        return {
          ...decisao,

          aplicadaEm:
            momento,

          statusAplicacao:
            "aplicada"
        };
      }
    );


  const arquivoDecisoesAtualizado = {
    ...dadosDecisoes,

    decisoes:
      decisoesAtualizadas,

    ultimaAplicacaoEm:
      momento
  };


  await salvarJson(
    ARQUIVO_DECISOES,
    arquivoDecisoesAtualizado
  );


  console.log(
    ""
  );


  console.log(
    "Decisões visuais aplicadas."
  );


  console.log(
    ""
  );


  console.log(
    `Candidatos promovidos: ${selecionadas}`
  );


  console.log(
    `  Aprovados definitivamente: ${aprovadas}`
  );


  console.log(
    `  Fallbacks mantidos em revisão: ${fallbacksRevisao}`
  );


  console.log(
    `Mantidas em revisão sem promoção: ${mantidasRevisao}`
  );


  console.log(
    `Marcadas para nova busca: ${buscarNovamente}`
  );


  console.log(
    `Candidatos rejeitados registrados: ${rejeitadosRegistrados}`
  );


  console.log(
    ""
  );


  console.log(
    "Curadoria atualizada:"
  );


  console.log(
    "documentacao/IMAGENS_HISSATSU_CURADORIA.json"
  );


  console.log(
    ""
  );


  console.log(
    "Decisões marcadas como aplicadas:"
  );


  console.log(
    "documentacao/IMAGENS_HISSATSU_DECISOES_CANDIDATOS_VISUAIS.json"
  );


  console.log(
    ""
  );


  console.log(
    "IMPORTANTE:"
  );


  console.log(
    "- O Banco factual não foi alterado."
  );


  console.log(
    "- Nenhuma mecânica foi alterada."
  );


  console.log(
    "- Os candidatos visuais originais foram preservados."
  );


  console.log(
    "- O manifesto ainda não foi regenerado."
  );


  console.log(
    "- O lote automático ainda não foi regenerado."
  );


  console.log(
    "- O catalogador NÃO foi executado."
  );
}


main()
  .catch(
    erro => {
      console.error(
        ""
      );


      console.error(
        "Falha aplicando decisões de candidatos visuais:"
      );


      console.error(
        erro
      );


      process.exitCode =
        1;
    }
  );