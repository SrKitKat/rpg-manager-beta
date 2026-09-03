/* ========================================
   PORTÃO DE QUALIDADE — BANCO HISSATSU

   Não altera dados factuais.
   Apenas valida, classifica pendências e
   cria o contrato dos próximos lotes.
======================================== */

export const TIPOS_HISSATSU_SUPORTADOS = [
  "chute",
  "drible",
  "bloqueio",
  "defesa_goleiro",
  "passe",
  "suporte",
  "outro"
];

export const STATUS_LOCALIZACAO_HISSATSU = [
  "verificada",
  "pendente"
];

export const ESTADOS_CURADORIA_IMAGEM = [
  "aprovada",
  "revisar",
  "rejeitada",
  "pendente"
];

export const QUALIDADES_IMAGEM_HISSATSU = [
  "A",
  "B",
  "C",
  "D"
];

const TIPOS = new Set(TIPOS_HISSATSU_SUPORTADOS);
const STATUS_LOCALIZACAO = new Set(STATUS_LOCALIZACAO_HISSATSU);
const ESTADOS_CURADORIA = new Set(ESTADOS_CURADORIA_IMAGEM);
const QUALIDADES = new Set(QUALIDADES_IMAGEM_HISSATSU);

function texto(valor) {
  return String(valor ?? "").trim();
}

function objeto(valor) {
  return valor && typeof valor === "object" && !Array.isArray(valor)
    ? valor
    : {};
}

function lista(valor) {
  return Array.isArray(valor) ? valor : [];
}

function statusLocalizacao(valor) {
  const status = texto(valor).toLocaleLowerCase("pt-BR");
  return STATUS_LOCALIZACAO.has(status) ? status : "";
}

function estadoCuradoria(valor) {
  const estado = texto(valor).toLocaleLowerCase("pt-BR");
  return ESTADOS_CURADORIA.has(estado) ? estado : "";
}

function normalizarQualidadeImagem(valor) {
  const qualidade = texto(valor).toUpperCase();
  return QUALIDADES.has(qualidade) ? qualidade : "";
}

function obterNomes(registro) {
  const nomes = objeto(registro?.nomes);

  return {
    ptBR: texto(nomes.ptBR) || null,
    ingles: texto(nomes.ingles),
    original: texto(
      nomes.original ||
      registro?.nomeOriginal ||
      registro?.nome
    ),
    japonesRomanizado: texto(nomes.japonesRomanizado),
    alternativos: lista(nomes.alternativos).map(texto).filter(Boolean)
  };
}

function obterLocalizacao(registro) {
  const localizacao = objeto(registro?.localizacao);

  return {
    ptBR: statusLocalizacao(localizacao.ptBR),
    ingles: statusLocalizacao(localizacao.ingles),
    japonesRomanizado: statusLocalizacao(localizacao.japonesRomanizado)
  };
}

function obterImagem(registro) {
  const referencia = registro?.imagemReferencia;

  if (typeof referencia === "string") {
    const url = texto(referencia);

    return {
      url,
      fonte: "",
      fonteUrl: "",
      status: url ? "catalogada" : "pendente"
    };
  }

  const imagem = objeto(referencia);

  const url = texto(
    imagem.url ||
    registro?.imagem
  );

  return {
    url,
    fonte: texto(imagem.fonte),
    fonteUrl: texto(imagem.fonteUrl),
    status:
      texto(imagem.status) ||
      (url ? "catalogada" : "pendente")
  };
}


/* ========================================
   CURADORIA DE IMAGEM

   Pode vir do próprio registro ou de um
   arquivo externo antigo de curadoria.
======================================== */

export function normalizarCuradoriaImagemHissatsu(
  registro,
  curadoriaExterna = null
) {
  const interna =
    objeto(
      registro
        ?.metadados
        ?.curadoriaImagem
    );

  const externa =
    objeto(curadoriaExterna);

  const origem = {
    ...interna,
    ...externa
  };

  const imagem =
    obterImagem(registro);

  let estado =
    estadoCuradoria(
      origem.estado
    );

  let qualidade =
    normalizarQualidadeImagem(
      origem.qualidade
    );

  if (!estado) {
    estado =
      imagem.url
        ? "revisar"
        : "pendente";
  }

  if (!qualidade) {
    if (
      estado === "rejeitada"
    ) {
      qualidade = "D";
    } else if (
      estado === "aprovada"
    ) {
      /*
        Aprovação antiga não vira A
        automaticamente.

        Sem nota explícita, usamos B:
        boa e utilizável.
      */

      qualidade = "B";
    } else if (
      imagem.url
    ) {
      qualidade = "C";
    }
  }

  return {
    estado,
    qualidade,

    imagemAtual:
      texto(
        origem.imagemAtual ||
        imagem.url
      ),

    candidatoAtual:
      texto(
        origem.candidatoAtual
      ),

    fonteCandidato:
      texto(
        origem.fonteCandidato
      ),

    observacao:
      texto(
        origem.observacao
      ),

    criterios: {
      tecnicaIdentificavel:
        origem
          ?.criterios
          ?.tecnicaIdentificavel ===
        true,

      efeitoVisivel:
        origem
          ?.criterios
          ?.efeitoVisivel ===
        true,

      usuarioVisivel:
        origem
          ?.criterios
          ?.usuarioVisivel ===
        true,

      execucaoVisivel:
        origem
          ?.criterios
          ?.execucaoVisivel ===
        true,

      hud:
        origem
          ?.criterios
          ?.hud ===
        true
    },

    candidatosRejeitados:
      lista(
        origem
          .candidatosRejeitados
      )
        .map(
          item => ({
            tituloArquivo:
              texto(
                item
                  ?.tituloArquivo
              ),

            motivo:
              texto(
                item?.motivo
              )
          })
        )
        .filter(
          item =>
            item.tituloArquivo ||
            item.motivo
        )
  };
}


function problema(
  listaProblemas,
  codigo,
  mensagem,
  campo = ""
) {
  listaProblemas.push({
    codigo,
    campo,
    mensagem
  });
}


function validarLocalizacao({
  idioma,
  valor,
  status,
  erros,
  pendencias
}) {
  if (!status) {
    problema(
      erros,
      `localizacao_${idioma}_sem_status`,
      `A localização ${idioma} precisa declarar "verificada" ou "pendente".`,
      `localizacao.${idioma}`
    );

    return;
  }

  if (
    status === "verificada" &&
    !valor
  ) {
    problema(
      erros,
      `localizacao_${idioma}_verificada_sem_valor`,
      `A localização ${idioma} está verificada, mas não possui valor.`,
      `nomes.${idioma}`
    );

    return;
  }

  if (
    status === "pendente"
  ) {
    problema(
      pendencias,
      `localizacao_${idioma}_pendente`,
      `A localização ${idioma} ainda está pendente.`,
      `localizacao.${idioma}`
    );
  }
}


/* ========================================
   AUDITORIA DE UMA HISSATSU
======================================== */

export function auditarHissatsuQualidade(
  registro,
  {
    curadoria = null,
    exigirFonteFactual = false
  } = {}
) {
  const erros = [];
  const pendencias = [];
  const avisos = [];

  const id =
    texto(
      registro?.id
    );

  const nomes =
    obterNomes(
      registro
    );

  const localizacao =
    obterLocalizacao(
      registro
    );

  const imagem =
    obterImagem(
      registro
    );

  const tipo =
    texto(
      registro?.tipo
    );

  const curadoriaImagem =
    normalizarCuradoriaImagemHissatsu(
      registro,
      curadoria
    );


  /* ======================================
     ESTRUTURA BÁSICA
  ====================================== */

  if (!id) {
    problema(
      erros,
      "id_ausente",
      "A Hissatsu não possui ID estável.",
      "id"
    );
  }

  if (!nomes.original) {
    problema(
      erros,
      "nome_original_ausente",
      "A Hissatsu precisa possuir nome original/factual.",
      "nomes.original"
    );
  }

  if (!tipo) {
    problema(
      erros,
      "tipo_ausente",
      "A Hissatsu não possui tipo.",
      "tipo"
    );
  } else if (
    !TIPOS.has(tipo)
  ) {
    problema(
      erros,
      "tipo_invalido",
      `Tipo não reconhecido pelo Banco: ${tipo}.`,
      "tipo"
    );
  }


  /* ======================================
     LOCALIZAÇÕES
  ====================================== */

  validarLocalizacao({
    idioma: "ptBR",
    valor: nomes.ptBR,
    status: localizacao.ptBR,
    erros,
    pendencias
  });

  validarLocalizacao({
    idioma: "ingles",
    valor: nomes.ingles,
    status: localizacao.ingles,
    erros,
    pendencias
  });

  validarLocalizacao({
    idioma:
      "japonesRomanizado",

    valor:
      nomes
        .japonesRomanizado,

    status:
      localizacao
        .japonesRomanizado,

    erros,
    pendencias
  });


  /* ======================================
     IMAGEM
  ====================================== */

  if (!imagem.url) {
    problema(
      pendencias,
      "imagem_ausente",
      "A Hissatsu ainda não possui imagem de referência.",
      "imagemReferencia.url"
    );
  } else {
    if (!imagem.fonte) {
      problema(
        avisos,
        "imagem_sem_fonte_texto",
        "A imagem existe, mas não possui identificação textual da fonte.",
        "imagemReferencia.fonte"
      );
    }

    if (!imagem.fonteUrl) {
      problema(
        avisos,
        "imagem_sem_fonte_url",
        "A imagem existe, mas não possui URL de origem registrada.",
        "imagemReferencia.fonteUrl"
      );
    }
  }


  /* ======================================
     CURADORIA VISUAL
  ====================================== */

  if (
    curadoriaImagem.estado ===
    "pendente"
  ) {
    problema(
      pendencias,
      "imagem_curadoria_pendente",
      "A imagem ainda não passou pela curadoria visual.",
      "metadados.curadoriaImagem.estado"
    );
  }

  if (
    curadoriaImagem.estado ===
    "revisar"
  ) {
    problema(
      pendencias,
      "imagem_precisa_revisao",
      "A referência visual existe, mas continua marcada para revisão.",
      "metadados.curadoriaImagem.estado"
    );
  }

  if (
    curadoriaImagem.estado ===
    "rejeitada"
  ) {
    problema(
      pendencias,
      "imagem_rejeitada",
      "A referência visual atual foi rejeitada e precisa de substituição.",
      "metadados.curadoriaImagem.estado"
    );
  }


  /* ======================================
     FONTE FACTUAL
  ====================================== */

  const referencia =
    objeto(
      registro
        ?.metadados
        ?.referencia
    );

  const fonteFactual =
    texto(
      referencia.fonteFactual ||
      referencia.fonte ||
      registro
        ?.metadados
        ?.fonteFactual
    );

  if (
    exigirFonteFactual &&
    !fonteFactual
  ) {
    problema(
      erros,
      "fonte_factual_ausente",
      "Registros novos precisam indicar uma fonte factual.",
      "metadados.referencia.fonteFactual"
    );
  } else if (
    !fonteFactual
  ) {
    /*
      No Banco antigo isso é aviso,
      não erro.

      Assim não obrigamos as 315 a
      recomeçar do zero.
    */

    problema(
      avisos,
      "fonte_factual_nao_estruturada",
      "O registro legado ainda não possui fonte factual no novo padrão.",
      "metadados.referencia.fonteFactual"
    );
  }


  /* ======================================
     RESULTADO DA HISSATSU
  ====================================== */

  const bloqueada =
    erros.length > 0;

  const completa =
    !bloqueada &&
    pendencias.length === 0;

  return {
    id,

    nome:
      nomes.ptBR ||
      nomes.original ||
      id ||
      "Sem nome",

    tipo,

    nomes,
    localizacao,
    imagem,
    curadoriaImagem,

    erros,
    pendencias,
    avisos,

    bloqueada,
    completa,

    status:
      bloqueada
        ? "bloqueada"
        : completa
          ? "completa"
          : "parcial"
  };
}


/* ========================================
   COLISÕES DE NOMES
======================================== */

function chaveNome(valor) {
  return texto(valor)
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLocaleLowerCase(
      "pt-BR"
    )
    .replace(
      /['’´`]/g,
      ""
    )
    .replace(
      /[-_/]+/g,
      " "
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim();
}


export function encontrarColisoesNomesHissatsu(
  banco = []
) {
  const indice =
    new Map();

  for (
    const registro of lista(
      banco
    )
  ) {
    const id =
      texto(
        registro?.id
      );

    const nomes =
      obterNomes(
        registro
      );

    const valores = [
      nomes.ptBR,
      nomes.ingles,
      nomes.original,
      nomes.japonesRomanizado,
      ...nomes.alternativos
    ]
      .map(texto)
      .filter(Boolean);

    for (
      const valor of valores
    ) {
      const chave =
        chaveNome(valor);

      if (!chave) {
        continue;
      }

      if (
        !indice.has(chave)
      ) {
        indice.set(
          chave,
          []
        );
      }

      indice
        .get(chave)
        .push({
          id,
          valor
        });
    }
  }

  return [
    ...indice.entries()
  ]
    .map(
      ([
        chave,
        ocorrencias
      ]) => ({
        chave,

        ids: [
          ...new Set(
            ocorrencias
              .map(
                item =>
                  item.id
              )
              .filter(Boolean)
          )
        ],

        ocorrencias
      })
    )
    .filter(
      item =>
        item.ids.length > 1
    );
}


/* ========================================
   AUDITORIA DO BANCO INTEIRO
======================================== */

export function auditarBancoHissatsuQualidade({
  banco = [],
  curadoriaPorId = {},
  exigirFonteFactual = false
} = {}) {
  const registros =
    lista(
      banco
    );

  const mapaIds =
    new Map();


  /* ======================================
     IDs
  ====================================== */

  for (
    const registro of registros
  ) {
    const id =
      texto(
        registro?.id
      );

    if (!id) {
      continue;
    }

    mapaIds.set(
      id,
      (
        mapaIds.get(id) ||
        0
      ) + 1
    );
  }

  const idsDuplicados =
    [
      ...mapaIds.entries()
    ]
      .filter(
        ([
          ,
          quantidade
        ]) =>
          quantidade > 1
      )
      .map(
        ([
          id,
          quantidade
        ]) => ({
          id,
          quantidade
        })
      );


  /* ======================================
     REGISTROS
  ====================================== */

  const curadorias =
    objeto(
      curadoriaPorId
    );

  const analises =
    registros.map(
      registro => {
        const id =
          texto(
            registro?.id
          );

        return auditarHissatsuQualidade(
          registro,
          {
            curadoria:
              curadorias[id] ||
              null,

            exigirFonteFactual
          }
        );
      }
    );


  /* ======================================
     LOCALIZAÇÃO
  ====================================== */

  const contarLocalizacao =
    (
      idioma,
      status
    ) =>
      analises.filter(
        item =>
          item
            .localizacao
            [idioma] ===
          status
      ).length;


  /* ======================================
     IMAGENS
  ====================================== */

  const estadosImagem = {
    aprovada: 0,
    revisar: 0,
    rejeitada: 0,
    pendente: 0
  };

  const qualidadesImagem = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    naoClassificada: 0
  };

  let comImagem = 0;

  for (
    const item of analises
  ) {
    if (
      item.imagem.url
    ) {
      comImagem += 1;
    }

    const estado =
      item
        .curadoriaImagem
        .estado;

    if (
      Object.hasOwn(
        estadosImagem,
        estado
      )
    ) {
      estadosImagem[estado] +=
        1;
    }

    const qualidade =
      item
        .curadoriaImagem
        .qualidade;

    if (
      qualidade &&
      Object.hasOwn(
        qualidadesImagem,
        qualidade
      )
    ) {
      qualidadesImagem[
        qualidade
      ] += 1;
    } else {
      qualidadesImagem
        .naoClassificada += 1;
    }
  }


  /* ======================================
     ESTADO GERAL
  ====================================== */

  const bloqueadas =
    analises.filter(
      item =>
        item.bloqueada
    );

  const completas =
    analises.filter(
      item =>
        item.completa
    );

  const parciais =
    analises.filter(
      item =>
        !item.bloqueada &&
        !item.completa
    );


  return {
    resumo: {
      total:
        registros.length,

      idsUnicos:
        mapaIds.size,

      idsDuplicados:
        idsDuplicados.length,

      bloqueadas:
        bloqueadas.length,

      parciais:
        parciais.length,

      completas:
        completas.length,

      errosBloqueantes:
        idsDuplicados.length +
        analises.reduce(
          (
            soma,
            item
          ) =>
            soma +
            item.erros.length,
          0
        ),

      pendencias:
        analises.reduce(
          (
            soma,
            item
          ) =>
            soma +
            item.pendencias.length,
          0
        ),

      avisos:
        analises.reduce(
          (
            soma,
            item
          ) =>
            soma +
            item.avisos.length,
          0
        ),

      localizacao: {
        ingles: {
          verificada:
            contarLocalizacao(
              "ingles",
              "verificada"
            ),

          pendente:
            contarLocalizacao(
              "ingles",
              "pendente"
            )
        },

        japonesRomanizado: {
          verificada:
            contarLocalizacao(
              "japonesRomanizado",
              "verificada"
            ),

          pendente:
            contarLocalizacao(
              "japonesRomanizado",
              "pendente"
            )
        },

        ptBR: {
          verificada:
            contarLocalizacao(
              "ptBR",
              "verificada"
            ),

          pendente:
            contarLocalizacao(
              "ptBR",
              "pendente"
            )
        }
      },

      imagens: {
        comImagem,

        semImagem:
          registros.length -
          comImagem,

        estados:
          estadosImagem,

        qualidades:
          qualidadesImagem
      }
    },

    idsDuplicados,

    colisoesNomes:
      encontrarColisoesNomesHissatsu(
        registros
      ),

    bloqueadas,
    parciais,
    completas,
    analises
  };
}


/* ========================================
   PORTÃO DOS PRÓXIMOS LOTES

   Pendência é permitida.
   Erro estrutural não é.
======================================== */

export function validarLoteHissatsuParaEntrada({
  lote = [],
  idsExistentes = [],
  exigirFonteFactual = true
} = {}) {
  const registros =
    lista(
      lote
    );

  const existentes =
    new Set(
      lista(
        idsExistentes
      )
        .map(
          item =>
            typeof item ===
            "string"
              ? texto(item)
              : texto(
                  item?.id
                )
        )
        .filter(Boolean)
    );

  const vistos =
    new Set();

  const duplicadosNoLote =
    [];

  const repetidosComBanco =
    [];


  /* ======================================
     DUPLICIDADES
  ====================================== */

  for (
    const registro of registros
  ) {
    const id =
      texto(
        registro?.id
      );

    if (!id) {
      continue;
    }

    if (
      vistos.has(id)
    ) {
      duplicadosNoLote.push(
        id
      );
    }

    vistos.add(id);

    if (
      existentes.has(id)
    ) {
      repetidosComBanco.push(
        id
      );
    }
  }


  /* ======================================
     QUALIDADE INDIVIDUAL
  ====================================== */

  const analises =
    registros.map(
      registro =>
        auditarHissatsuQualidade(
          registro,
          {
            exigirFonteFactual
          }
        )
    );

  const errosEstruturais =
    analises.filter(
      item =>
        item.erros.length >
        0
    );

  const duplicados = [
    ...new Set(
      duplicadosNoLote
    )
  ];

  const repetidos = [
    ...new Set(
      repetidosComBanco
    )
  ];


  return {
    aprovado:
      duplicados.length === 0 &&
      repetidos.length === 0 &&
      errosEstruturais.length ===
        0,

    resumo: {
      recebidas:
        registros.length,

      idsUnicosNoLote:
        vistos.size,

      duplicadosNoLote:
        duplicados.length,

      repetidosComBanco:
        repetidos.length,

      comErroEstrutural:
        errosEstruturais.length,

      comPendencias:
        analises.filter(
          item =>
            item
              .pendencias
              .length >
            0
        ).length
    },

    duplicadosNoLote:
      duplicados,

    repetidosComBanco:
      repetidos,

    errosEstruturais,
    analises
  };
}


/* ========================================
   METADADOS PADRÃO DOS PRÓXIMOS LOTES

   Evita que cada expansão invente um
   formato diferente.
======================================== */

export function criarMetadadosQualidadeHissatsu({
  fonteFactual = "",
  fonteFactualUrl = "",

  estadoImagem = "pendente",
  qualidadeImagem = "",
  observacaoImagem = "",

  criteriosImagem = {},

  candidatosRejeitados = []
} = {}) {
  return {
    referencia: {
      fonteFactual:
        texto(
          fonteFactual
        ),

      fonteFactualUrl:
        texto(
          fonteFactualUrl
        )
    },

    curadoriaImagem: {
      estado:
        estadoCuradoria(
          estadoImagem
        ) ||
        "pendente",

      qualidade:
        normalizarQualidadeImagem(
          qualidadeImagem
        ),

      observacao:
        texto(
          observacaoImagem
        ),

      criterios: {
        tecnicaIdentificavel:
          criteriosImagem
            ?.tecnicaIdentificavel ===
          true,

        efeitoVisivel:
          criteriosImagem
            ?.efeitoVisivel ===
          true,

        usuarioVisivel:
          criteriosImagem
            ?.usuarioVisivel ===
          true,

        execucaoVisivel:
          criteriosImagem
            ?.execucaoVisivel ===
          true,

        hud:
          criteriosImagem
            ?.hud ===
          true
      },

      candidatosRejeitados:
        lista(
          candidatosRejeitados
        )
    }
  };
}