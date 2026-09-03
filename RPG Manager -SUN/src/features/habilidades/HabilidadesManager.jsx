import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import "./HabilidadesManager.css";

import {
  configuracaoCampanha
} from "../campanhas/configCampanha.js";

import BibliotecaHabilidades
  from "./BibliotecaHabilidades.jsx";

import {
  EditorRequisitosTecnica,
  VisualizadorRequisitosTecnica,
  normalizarRequisitosNarrativos
} from "./RequisitosTecnica.jsx";

import {
  EditorEstadoTecnica,
  VisualizadorEstadoTecnica
} from "./EstadoTecnica.jsx";

import {
  obterContextoBancoHissatsuLocal,
  carregarConfiguracoesBancoHissatsu
} from "./data/bancoHissatsuCampanhaStore.js";

import {
  resolverMecanicaHabilidade
} from "./mecanicaHabilidades.js";

import {
  habilidadeVeioDaBiblioteca,
  garantirBaseInstanciaHabilidade,
  obterBaseInstanciaHabilidade,
  compararInstanciaComBase,
  restaurarAlteracaoInstanciaDaBase,
  compararBaseInstanciaComReferenciaAtual,
  aplicarAtualizacaoReferenciaInstancia,
  atualizacaoReferenciaEstaIgnorada,
  marcarAtualizacaoReferenciaComoIgnorada,
  reabrirAtualizacaoReferenciaIgnorada,
  obterHistoricoAtualizacoesBanco,
  resolverCamadasImagemHabilidade,
  definirImagemFichaHabilidade
} from "./instanciaHabilidade.js";


const CONFIGURACAO_PADRAO = {
  rotulos: {
    singular:
      "Habilidade",

    plural:
      "Habilidades",

    nova:
      "Nova Habilidade",

    editar:
      "Editar Habilidade",

    biblioteca:
      "Biblioteca de Habilidades",

    parametros:
      "Parâmetros da habilidade"
  },

  tipoInicial:
    "outro",

  tipos: {
    outro: {
      nome:
        "Outro",

      icone:
        "✦",

      parametros:
        []
    }
  },

  escalaParametros: {
    minimo:
      0,

    maximo:
      10
  },

  custoPrincipal: {
    campo:
      "custoTP",

    nome:
      "Custo",

    unidade:
      "",

    icone:
      "◆",

    minimo:
      0
  },

  custosAdicionais:
    [],

  requisitos: {
    atributosDisponiveis:
      null
  },

  biblioteca: {
    ativo:
      false,

    registros:
      []
  }
};


function obterConfiguracaoHabilidades(
  configuracao
) {
  const habilidades =
    configuracao
      ?.habilidades ||
    {};

  return {
    ...CONFIGURACAO_PADRAO,
    ...habilidades,

    rotulos: {
      ...CONFIGURACAO_PADRAO.rotulos,
      ...(habilidades.rotulos || {})
    },

    escalaParametros: {
      ...CONFIGURACAO_PADRAO.escalaParametros,
      ...(habilidades.escalaParametros || {})
    },

    custoPrincipal: {
      ...CONFIGURACAO_PADRAO.custoPrincipal,
      ...(habilidades.custoPrincipal || {})
    },

    requisitos: {
      ...CONFIGURACAO_PADRAO.requisitos,
      ...(habilidades.requisitos || {})
    },

    biblioteca: {
      ...CONFIGURACAO_PADRAO.biblioteca,
      ...(habilidades.biblioteca || {})
    }
  };
}


function primeiroValorUtil(
  ...valores
) {
  return valores.find(
    valor =>
      valor !== undefined &&
      valor !== null &&
      valor !== ""
  );
}


function primeiroTexto(
  ...valores
) {
  const encontrado =
    valores.find(
      valor =>
        typeof valor === "string" &&
        valor.trim()
    );

  return encontrado || "";
}


function textoLimpo(
  valor
) {
  return String(
    valor ?? ""
  ).trim();
}


/* ========================================
   IMAGENS
======================================== */

function rotuloOrigemImagem(
  origem
) {
  switch (origem) {
    case "ficha":
      return "Imagem própria da ficha";

    case "campanha":
      return "Imagem personalizada da campanha";

    case "referencia":
      return "Imagem de referência do catálogo";

    case "legado":
      return "Imagem de registro antigo";

    default:
      return "Sem imagem cadastrada";
  }
}


function descricaoOrigemImagem(
  origem
) {
  switch (origem) {
    case "ficha":
      return "Esta ficha está usando uma imagem própria. Removê-la faz a técnica voltar automaticamente para a imagem herdada.";

    case "campanha":
      return "A ficha não possui imagem própria. Está usando a imagem definida pelo Mestre para esta campanha.";

    case "referencia":
      return "A ficha não possui imagem própria nem imagem personalizada da campanha. Está usando a referência visual do catálogo.";

    case "legado":
      return "Esta habilidade utiliza uma imagem salva pelo modelo anterior do sistema.";

    default:
      return "Nenhuma camada de imagem está disponível. O ícone do tipo será usado.";
  }
}


function obterTipos(
  configuracaoHabilidades
) {
  const tipos =
    configuracaoHabilidades
      ?.tipos;

  if (
    tipos &&
    typeof tipos === "object" &&
    Object.keys(tipos).length > 0
  ) {
    return tipos;
  }

  return CONFIGURACAO_PADRAO
    .tipos;
}


function descobrirTipo(
  valor,
  tipos
) {
  if (
    valor &&
    tipos[valor]
  ) {
    return valor;
  }

  const texto =
    String(valor || "")
      .trim()
      .toLowerCase();

  if (texto) {
    const encontrado =
      Object.entries(tipos)
        .find(
          ([, tipo]) =>
            String(
              tipo?.nome || ""
            )
              .trim()
              .toLowerCase() ===
            texto
        );

    if (encontrado) {
      return encontrado[0];
    }
  }

  if (tipos.outro) {
    return "outro";
  }

  return (
    Object.keys(tipos)[0] ||
    "outro"
  );
}


function obterParametrosTipo(
  tipo,
  tipos
) {
  const parametros =
    tipos
      ?.[tipo]
      ?.parametros;

  return Array.isArray(parametros)
    ? parametros
    : [];
}


function criarMapaParametrosConfigurados(
  tipos
) {
  const mapa = {};

  Object.values(tipos)
    .forEach(
      tipo => {
        (
          tipo?.parametros ||
          []
        ).forEach(
          parametro => {
            if (
              parametro?.chave
            ) {
              mapa[
                parametro.chave
              ] =
                parametro;
            }
          }
        );
      }
    );

  return mapa;
}


function normalizarParametros(
  habilidade,
  tipo,
  tipos
) {
  const origemAntiga =
    habilidade
      ?.atributos &&
    typeof habilidade.atributos === "object" &&
    !Array.isArray(habilidade.atributos)
      ? habilidade.atributos
      : {};

  const origemNova =
    habilidade
      ?.parametros &&
    typeof habilidade.parametros === "object" &&
    !Array.isArray(habilidade.parametros)
      ? habilidade.parametros
      : {};

  const resultado = {
    ...origemAntiga,
    ...origemNova
  };

  obterParametrosTipo(
    tipo,
    tipos
  ).forEach(
    parametro => {
      if (
        !Object.prototype
          .hasOwnProperty
          .call(
            resultado,
            parametro.chave
          )
      ) {
        resultado[
          parametro.chave
        ] =
          "";
      }
    }
  );

  return resultado;
}


function parametroFoiDefinido(
  valor
) {
  return (
    valor !== "" &&
    valor !== null &&
    valor !== undefined &&
    !Number.isNaN(Number(valor))
  );
}


function normalizarValorParametro(
  valor,
  configuracaoHabilidades
) {
  if (
    valor === "" ||
    valor === null ||
    valor === undefined
  ) {
    return "";
  }

  const numero =
    Number(valor);

  if (
    Number.isNaN(numero)
  ) {
    return "";
  }

  const minimoBruto =
    Number(
      configuracaoHabilidades
        ?.escalaParametros
        ?.minimo
    );

  const maximoBruto =
    Number(
      configuracaoHabilidades
        ?.escalaParametros
        ?.maximo
    );

  const minimo =
    Number.isNaN(minimoBruto)
      ? 0
      : minimoBruto;

  const maximo =
    Number.isNaN(maximoBruto)
      ? 10
      : maximoBruto;

  return Math.max(
    minimo,
    Math.min(
      maximo,
      numero
    )
  );
}


function normalizarEstado(
  estado
) {
  const validos = [
    "bloqueada",
    "disponivel",
    "desenvolvimento",
    "aprendida",
    "dominada"
  ];

  return validos.includes(estado)
    ? estado
    : "aprendida";
}


function normalizarRequisitosAtributos(
  requisitos
) {
  if (
    !requisitos ||
    typeof requisitos !== "object" ||
    Array.isArray(requisitos)
  ) {
    return {};
  }

  return {
    ...requisitos
  };
}


function normalizarNarrativosHabilidade(
  habilidade
) {
  const origem =
    Array.isArray(
      habilidade
        ?.requisitosNarrativos
    )
      ? habilidade
          .requisitosNarrativos
      : Array.isArray(
          habilidade?.requisitos
        )
        ? habilidade.requisitos
        : [];

  const estado =
    normalizarEstado(
      habilidade?.estado
    );

  const assumirCumpridos =
    [
      "desenvolvimento",
      "aprendida",
      "dominada"
    ].includes(estado);

  return normalizarRequisitosNarrativos(
    origem,
    {
      assumirCumpridos
    }
  );
}


function normalizarCustos(
  habilidade,
  configuracaoHabilidades
) {
  const salvos =
    habilidade
      ?.custos &&
    typeof habilidade.custos === "object" &&
    !Array.isArray(habilidade.custos)
      ? habilidade.custos
      : {};

  const resultado = {
    ...salvos
  };

  (
    configuracaoHabilidades
      ?.custosAdicionais ||
    []
  ).forEach(
    custo => {
      if (
        !Object.prototype
          .hasOwnProperty
          .call(
            resultado,
            custo.chave
          )
      ) {
        resultado[
          custo.chave
        ] =
          "";
      }
    }
  );

  if (
    typeof habilidade
      ?.condicoes === "string" &&
    habilidade.condicoes.trim() &&
    (
      resultado.condicao === "" ||
      resultado.condicao === undefined ||
      resultado.condicao === null
    )
  ) {
    resultado.condicao =
      habilidade.condicoes;
  }

  return resultado;
}


function normalizarHabilidade(
  habilidade,
  configuracaoHabilidades
) {
  const tipos =
    obterTipos(
      configuracaoHabilidades
    );

  const tipo =
    descobrirTipo(
      habilidade?.tipo,
      tipos
    );

  const campoCusto =
    configuracaoHabilidades
      ?.custoPrincipal
      ?.campo ||
    "custoTP";

  const custo =
    primeiroValorUtil(
      habilidade
        ?.[campoCusto],

      habilidade?.custoTP,
      habilidade?.tp,
      habilidade?.custo,
      ""
    ) ?? "";

  const camadasImagem =
    resolverCamadasImagemHabilidade(
      habilidade ||
      {}
    );

  return {
    ...habilidade,

    nome:
      String(
        habilidade?.nome ||
        ""
      ),

    tipo,

    categoria:
      String(
        habilidade?.categoria ||
        ""
      ),

    elemento:
      String(
        habilidade?.elemento ||
        ""
      ),

    grau:
      String(
        primeiroValorUtil(
          habilidade?.grau,
          habilidade?.estagio,
          habilidade?.nivel,
          ""
        ) ?? ""
      ),

    estado:
      normalizarEstado(
        habilidade?.estado
      ),

    [campoCusto]:
      custo,

    /*
      "imagem" permanece como imagem efetiva
      para compatibilidade com as telas
      antigas.

      As camadas ficam explícitas abaixo.
    */

    imagem:
      camadasImagem.url,

    imagemFicha:
      camadasImagem.ficha,

    imagemCampanha:
      camadasImagem.campanha,

    imagemReferencia:
      camadasImagem.referencia,

    imagemOrigem:
      camadasImagem.origem,

    descricao:
      String(
        primeiroTexto(
          habilidade?.descricao,
          habilidade?.funcao,
          habilidade?.efeito
        )
      ),

    evolucao:
      String(
        habilidade?.evolucao ||
        ""
      ),

    parametros:
      normalizarParametros(
        habilidade,
        tipo,
        tipos
      ),

    custos:
      normalizarCustos(
        habilidade,
        configuracaoHabilidades
      ),

    requisitosAtributos:
      normalizarRequisitosAtributos(
        habilidade
          ?.requisitosAtributos
      ),

    requisitosNarrativos:
      normalizarNarrativosHabilidade(
        habilidade
      )
  };
}


function criarHabilidadeVazia(
  configuracaoHabilidades
) {
  const tipos =
    obterTipos(
      configuracaoHabilidades
    );

  const tipoInicial =
    descobrirTipo(
      configuracaoHabilidades
        ?.tipoInicial,
      tipos
    );

  const parametros = {};

  obterParametrosTipo(
    tipoInicial,
    tipos
  ).forEach(
    parametro => {
      parametros[
        parametro.chave
      ] =
        "";
    }
  );

  const custos = {};

  (
    configuracaoHabilidades
      ?.custosAdicionais ||
    []
  ).forEach(
    custo => {
      custos[
        custo.chave
      ] =
        "";
    }
  );

  const campoCusto =
    configuracaoHabilidades
      ?.custoPrincipal
      ?.campo ||
    "custoTP";

  return {
    nome:
      "",

    tipo:
      tipoInicial,

    categoria:
      "",

    elemento:
      "",

    grau:
      "",

    estado:
      "bloqueada",

    [campoCusto]:
      "",

    imagem:
      "",

    descricao:
      "",

    evolucao:
      "",

    parametros,

    custos,

    requisitosAtributos:
      {},

    requisitosNarrativos:
      []
  };
}


/* ========================================
   REGISTRO EFETIVO DO BANCO
======================================== */

function obterNomesRegistroBanco(
  registro,
  configuracaoHabilidades
) {
  const nomes =
    registro?.nomes &&
    typeof registro.nomes === "object"
      ? registro.nomes
      : {};

  const idioma =
    configuracaoHabilidades
      ?.localizacao
      ?.idiomaPrincipal ||
    "ptBR";

  const principal =
    textoLimpo(
      nomes[idioma] ||
      nomes.ptBR ||
      registro?.nome ||
      nomes.original
    );

  return {
    principal,

    nomes: {
      ...nomes,

      ptBR:
        nomes.ptBR ||
        principal,

      original:
        nomes.original ||
        registro?.nome ||
        principal
    }
  };
}


function obterIdOrigemBiblioteca(
  habilidade,
  configuracaoHabilidades
) {
  const configurados =
    configuracaoHabilidades
      ?.biblioteca
      ?.aquisicao
      ?.camposOrigem ||
    {};

  const campo =
    configurados.id ||
    "origemBibliotecaId";

  return (
    habilidade
      ?.[campo] ||
    habilidade
      ?.origemBibliotecaId ||
    null
  );
}


function obterReferenciaAtualDoBanco({
  habilidade,
  configuracaoHabilidades,
  estadoBanco
}) {
  const templateId =
    obterIdOrigemBiblioteca(
      habilidade,
      configuracaoHabilidades
    );

  if (!templateId) {
    return null;
  }

  const registros =
    Array.isArray(
      configuracaoHabilidades
        ?.biblioteca
        ?.registros
    )
      ? configuracaoHabilidades
          .biblioteca
          .registros
      : [];

  const registroOriginal =
    registros.find(
      registro =>
        registro?.id ===
        templateId
    );

  if (!registroOriginal) {
    return {
      encontrado:
        false,

      templateId
    };
  }

  const tipos =
    obterTipos(
      configuracaoHabilidades
    );

  const tipo =
    descobrirTipo(
      registroOriginal.tipo,
      tipos
    );

  const nomes =
    obterNomesRegistroBanco(
      registroOriginal,
      configuracaoHabilidades
    );

  const registroBase = {
    ...registroOriginal,

    nome:
      nomes.principal,

    nomes:
      nomes.nomes,

    tipo,

    descricao:
      primeiroTexto(
        registroOriginal.descricao,
        registroOriginal.funcao,
        registroOriginal.efeito
      )
  };

  const camadas =
    estadoBanco
      ?.templates
      ?.[templateId] ||
    {};

  const publicada =
    camadas.publicada ||
    null;

  const resolvida =
    resolverMecanicaHabilidade({
      registroBase,

      camada:
        publicada,

      configuracaoHabilidades
    });

  const campoCusto =
    configuracaoHabilidades
      ?.custoPrincipal
      ?.campo ||
    "custoTP";

  const imagemApresentacao =
    textoLimpo(
      camadas
        ?.apresentacao
        ?.imagemUrl
    );

  const imagemReferencia =
    registroBase
      ?.imagemReferencia ||
    (
      registroBase.imagem
        ? {
            url:
              textoLimpo(
                registroBase.imagem
              ),

            fonte:
              "",

            fonteUrl:
              "",

            status:
              "catalogada"
          }
        : null
    );

  const urlReferencia =
    typeof imagemReferencia ===
      "string"
      ? textoLimpo(
          imagemReferencia
        )
      : textoLimpo(
          imagemReferencia
            ?.url
        );

  const referenciaAtual = {
    ...registroBase,

    [campoCusto]:
      resolvida
        .efetiva
        .custoPrincipal,

    grau:
      resolvida
        .efetiva
        .grau,

    parametros: {
      ...(
        resolvida
          .efetiva
          .parametros ||
        {}
      )
    },

    custos: {
      ...(
        resolvida
          .efetiva
          .custos ||
        {}
      )
    },

    requisitosAtributos: {
      ...(
        resolvida
          .efetiva
          .requisitosAtributos ||
        {}
      )
    },

    requisitosNarrativos:
      normalizarRequisitosNarrativos(
        resolvida
          .efetiva
          .requisitosNarrativos ||
        []
      ),

    /*
      Aqui reconstruímos explicitamente
      as camadas atuais do Banco.

      A ficha continua sendo uma quarta
      camada separada.
    */

    imagemReferencia,

    imagemCampanha:
      imagemApresentacao,

    imagemFicha:
      "",

    imagem:
      imagemApresentacao ||
      urlReferencia ||
      registroBase.imagem ||
      ""
  };

  return {
    encontrado:
      true,

    templateId,

    referenciaAtual,

    versaoMecanicaAtual:
      publicada
        ?.versaoMecanica ??
      null,

    fonteMecanicaAtual:
      publicada
        ? "personalizada"
        : "padrao-campanha",

    versaoTemplateAtual:
      registroOriginal
        ?.versao ??
      1,

    nomeTemplateAtual:
      nomes.principal,

    metadadosAtuais:
      registroOriginal
        ?.metadados ||
      {}
  };
}


/* ========================================
   FORMATADORES
======================================== */

function formatarValorComparacao(
  valor
) {
  if (
    valor === "" ||
    valor === null ||
    valor === undefined
  ) {
    return "—";
  }

  if (
    typeof valor === "boolean"
  ) {
    return valor
      ? "Sim"
      : "Não";
  }

  if (
    Array.isArray(valor)
  ) {
    if (
      valor.length === 0
    ) {
      return "Nenhum";
    }

    return valor
      .map(
        item => {
          if (
            typeof item === "string"
          ) {
            return item;
          }

          if (
            item &&
            typeof item === "object"
          ) {
            return (
              item.texto ||
              item.descricao ||
              item.nome ||
              JSON.stringify(item)
            );
          }

          return String(item);
        }
      )
      .join(" · ");
  }

  if (
    typeof valor === "object"
  ) {
    const entradas =
      Object.entries(valor);

    if (
      entradas.length === 0
    ) {
      return "Nenhum";
    }

    return entradas
      .map(
        ([chave, valorItem]) =>
          `${chave}: ${valorItem}`
      )
      .join(" · ");
  }

  const resultado =
    String(valor);

  if (
    resultado.length > 140
  ) {
    return (
      `${resultado.slice(
        0,
        137
      )}...`
    );
  }

  return resultado;
}


function obterRotuloAlteracao(
  alteracao,
  tipos,
  configuracaoHabilidades
) {
  if (
    alteracao.grupo ===
    "parametros"
  ) {
    const parametro =
      Object.values(tipos)
        .flatMap(
          tipo =>
            tipo?.parametros ||
            []
        )
        .find(
          item =>
            item?.chave ===
            alteracao.chave
        );

    return (
      parametro?.nome ||
      alteracao.rotulo ||
      alteracao.chave
    );
  }

  if (
    alteracao.grupo ===
    "custos"
  ) {
    const custo =
      (
        configuracaoHabilidades
          ?.custosAdicionais ||
        []
      ).find(
        item =>
          item?.chave ===
          alteracao.chave
      );

    return (
      custo?.nome ||
      alteracao.rotulo ||
      alteracao.chave
    );
  }

  return (
    alteracao.rotulo ||
    alteracao.chave
  );
}


function rotuloAtualizacaoBanco(
  habilidade,
  atualizacao
) {
  const antiga =
    habilidade
      ?.origemBibliotecaVersaoMecanica;

  const nova =
    atualizacao
      ?.versaoMecanicaAtual;

  if (
    antiga &&
    nova &&
    antiga !== nova
  ) {
    return (
      `Mecânica V${antiga} → V${nova}`
    );
  }

  if (
    antiga === null &&
    nova
  ) {
    return (
      `Padrão da campanha → Mecânica V${nova}`
    );
  }

  if (
    antiga &&
    nova === null
  ) {
    return (
      `Mecânica V${antiga} → padrão atual`
    );
  }

  if (nova) {
    return (
      `Referência do Banco atualizada · V${nova}`
    );
  }

  return "Padrão da campanha atualizado";
}


function formatarDataHora(
  valor
) {
  if (!valor) {
    return "—";
  }

  const data =
    new Date(valor);

  if (
    Number.isNaN(
      data.getTime()
    )
  ) {
    return "—";
  }

  return data.toLocaleString(
    "pt-BR",
    {
      dateStyle:
        "short",

      timeStyle:
        "short"
    }
  );
}


function rotuloHistoricoAtualizacao(
  item
) {
  const antiga =
    item
      ?.deVersaoMecanica;

  const nova =
    item
      ?.paraVersaoMecanica;

  if (
    antiga &&
    nova
  ) {
    return (
      `V${antiga} → V${nova}`
    );
  }

  if (
    !antiga &&
    nova
  ) {
    return (
      `Padrão → V${nova}`
    );
  }

  if (
    antiga &&
    !nova
  ) {
    return (
      `V${antiga} → padrão`
    );
  }

  return "Atualização de referência";
}


/* ========================================
   BARRA DE PARÂMETRO
======================================== */

function BarraParametro({
  parametro,
  valor,
  configuracaoHabilidades
}) {
  const minimoBruto =
    Number(
      configuracaoHabilidades
        ?.escalaParametros
        ?.minimo
    );

  const maximoBruto =
    Number(
      configuracaoHabilidades
        ?.escalaParametros
        ?.maximo
    );

  const minimo =
    Number.isNaN(minimoBruto)
      ? 0
      : minimoBruto;

  const maximo =
    Number.isNaN(maximoBruto) ||
    maximoBruto <= minimo
      ? 10
      : maximoBruto;

  const definido =
    parametroFoiDefinido(valor);

  const numero =
    definido
      ? Number(valor)
      : 0;

  const porcentagem =
    definido
      ? Math.max(
          0,
          Math.min(
            100,
            (
              (numero - minimo) /
              (maximo - minimo)
            ) *
            100
          )
        )
      : 0;

  return (
    <div className="habilidades-manager-parametro">

      <div className="habilidades-manager-parametro-topo">

        <strong>
          {parametro.nome ||
            parametro.chave}
        </strong>

        <span>
          {definido
            ? `${numero}/${maximo}`
            : "NÃO DEFINIDO"}
        </span>

      </div>

      <div className="habilidades-manager-barra">

        <div
          className={[
            "habilidades-manager-barra-preenchimento",

            definido
              ? ""
              : "habilidades-manager-barra-vazia"
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            width:
              `${porcentagem}%`
          }}
        />

      </div>

    </div>
  );
}


/* ========================================
   COMPONENTE
======================================== */

function HabilidadesManager({
  habilidades = [],
  atributosJogador = {},
  configuracao =
    configuracaoCampanha,
  somenteLeitura = false,

  onCriar,
  onEditar,
  onExcluir
}) {
  const configuracaoHabilidades =
    useMemo(
      () =>
        obterConfiguracaoHabilidades(
          configuracao
        ),
      [
        configuracao
      ]
    );

  const tipos =
    obterTipos(
      configuracaoHabilidades
    );

  const rotulos =
    configuracaoHabilidades
      .rotulos;

  const campoCustoPrincipal =
    configuracaoHabilidades
      ?.custoPrincipal
      ?.campo ||
    "custoTP";

  const bibliotecaAtiva =
    Boolean(
      configuracaoHabilidades
        ?.biblioteca
        ?.ativo
    );

  const totalBanco =
    Array.isArray(
      configuracaoHabilidades
        ?.biblioteca
        ?.registros
    )
      ? configuracaoHabilidades
          .biblioteca
          .registros
          .length
      : 0;

  const contextoBanco =
    obterContextoBancoHissatsuLocal();

  const estadoBanco =
    carregarConfiguracoesBancoHissatsu(
      contextoBanco
        .campanhaId
    );

  const [
    visualizacaoPrincipal,
    setVisualizacaoPrincipal
  ] = useState(
    "adquiridas"
  );

  const [
    mostrandoEditor,
    setMostrandoEditor
  ] = useState(false);

  const [
    indiceEditando,
    setIndiceEditando
  ] = useState(null);

  const [
    indiceAberto,
    setIndiceAberto
  ] = useState(null);

  const [
    origemEdicao,
    setOrigemEdicao
  ] = useState("lista");

  const [
    detalhesCustosAbertos,
    setDetalhesCustosAbertos
  ] = useState(false);

  const [
    mecanicaAvancadaAberta,
    setMecanicaAvancadaAberta
  ] = useState(false);

  const [
    historicoBancoAberto,
    setHistoricoBancoAberto
  ] = useState(false);

  const [
    formulario,
    setFormulario
  ] = useState(
    () =>
      criarHabilidadeVazia(
        configuracaoHabilidades
      )
  );


  /* ======================================
     MIGRAÇÃO DE TÉCNICAS ANTIGAS
  ====================================== */

  useEffect(
    () => {
      if (!onEditar) {
        return;
      }

      habilidades.forEach(
        (
          habilidade,
          indice
        ) => {
          const migrada =
            garantirBaseInstanciaHabilidade(
              habilidade,
              configuracaoHabilidades
            );

          if (
            migrada !== habilidade
          ) {
            onEditar(
              indice,
              migrada
            );
          }
        }
      );
    },
    [
      habilidades,
      onEditar,
      configuracaoHabilidades
    ]
  );


  /* ======================================
     ATUALIZAÇÃO DISPONÍVEL?
  ====================================== */

  function obterAtualizacaoBanco(
    habilidade
  ) {
    if (
      !habilidadeVeioDaBiblioteca(
        habilidade,
        configuracaoHabilidades
      )
    ) {
      return null;
    }

    const comBase =
      garantirBaseInstanciaHabilidade(
        habilidade,
        configuracaoHabilidades
      );

    const referencia =
      obterReferenciaAtualDoBanco({
        habilidade:
          comBase,

        configuracaoHabilidades,

        estadoBanco
      });

    if (
      !referencia ||
      !referencia.encontrado
    ) {
      return {
        encontrado:
          false,

        temAlteracoes:
          false,

        ignorada:
          false
      };
    }

    const comparacao =
      compararBaseInstanciaComReferenciaAtual(
        comBase,
        referencia
          .referenciaAtual,
        configuracaoHabilidades
      );

    const ignorada =
      comparacao.temAlteracoes &&
      atualizacaoReferenciaEstaIgnorada(
        comBase,
        referencia
          .referenciaAtual,
        configuracaoHabilidades
      );

    return {
      ...referencia,
      ...comparacao,
      ignorada
    };
  }


  function aplicarAtualizacaoBanco(
    indice,
    atualizacao
  ) {
    if (
      somenteLeitura ||
      !onEditar ||
      !habilidades[indice] ||
      !atualizacao
        ?.encontrado ||
      !atualizacao
        ?.temAlteracoes
    ) {
      return;
    }

    const confirmou =
      window.confirm(
        "Aplicar a referência atual do Banco? Campos que o personagem nunca alterou serão atualizados. Personalizações individuais serão preservadas."
      );

    if (!confirmou) {
      return;
    }

    const habilidadeAtual =
      garantirBaseInstanciaHabilidade(
        habilidades[indice],
        configuracaoHabilidades
      );

    const atualizada =
      aplicarAtualizacaoReferenciaInstancia({
        habilidade:
          habilidadeAtual,

        referenciaAtual:
          atualizacao
            .referenciaAtual,

        configuracaoHabilidades,

        versaoMecanicaAtual:
          atualizacao
            .versaoMecanicaAtual,

        fonteMecanicaAtual:
          atualizacao
            .fonteMecanicaAtual,

        versaoTemplateAtual:
          atualizacao
            .versaoTemplateAtual,

        nomeTemplateAtual:
          atualizacao
            .nomeTemplateAtual,

        metadadosAtuais:
          atualizacao
            .metadadosAtuais
      });

    onEditar(
      indice,
      atualizada
    );
  }


  function manterMinhaVersao(
    indice,
    atualizacao
  ) {
    if (
      somenteLeitura ||
      !onEditar ||
      !habilidades[indice] ||
      !atualizacao
        ?.encontrado ||
      !atualizacao
        ?.temAlteracoes
    ) {
      return;
    }

    const habilidadeAtual =
      garantirBaseInstanciaHabilidade(
        habilidades[indice],
        configuracaoHabilidades
      );

    const marcada =
      marcarAtualizacaoReferenciaComoIgnorada({
        habilidade:
          habilidadeAtual,

        referenciaAtual:
          atualizacao
            .referenciaAtual,

        configuracaoHabilidades,

        versaoMecanicaAtual:
          atualizacao
            .versaoMecanicaAtual
      });

    onEditar(
      indice,
      marcada
    );
  }


  function reconsiderarAtualizacaoBanco(
    indice
  ) {
    if (
      somenteLeitura ||
      !onEditar ||
      !habilidades[indice]
    ) {
      return;
    }

    const atual =
      garantirBaseInstanciaHabilidade(
        habilidades[indice],
        configuracaoHabilidades
      );

    const reaberta =
      reabrirAtualizacaoReferenciaIgnorada(
        atual
      );

    onEditar(
      indice,
      reaberta
    );
  }


  function abrirAdquiridas() {
    setVisualizacaoPrincipal(
      "adquiridas"
    );

    setMostrandoEditor(false);
    setIndiceAberto(null);
    setHistoricoBancoAberto(false);
  }


  function abrirBiblioteca() {
    if (!bibliotecaAtiva) {
      return;
    }

    setVisualizacaoPrincipal(
      "biblioteca"
    );

    setMostrandoEditor(false);
    setIndiceAberto(null);
    setHistoricoBancoAberto(false);
  }


  function NavegacaoPrincipal() {
    if (!bibliotecaAtiva) {
      return null;
    }

    return (
      <div
        className="habilidades-manager-subnavegacao"
        role="tablist"
        aria-label="Visualização de habilidades"
      >

        <button
          type="button"
          role="tab"
          aria-selected={
            visualizacaoPrincipal ===
            "adquiridas"
          }
          className={
            visualizacaoPrincipal ===
            "adquiridas"
              ? "habilidades-manager-subnavegacao-botao habilidades-manager-subnavegacao-botao-ativo"
              : "habilidades-manager-subnavegacao-botao"
          }
          onClick={
            abrirAdquiridas
          }
        >
          ADQUIRIDAS

          <span>
            {habilidades.length}
          </span>
        </button>


        <button
          type="button"
          role="tab"
          aria-selected={
            visualizacaoPrincipal ===
            "biblioteca"
          }
          className={
            visualizacaoPrincipal ===
            "biblioteca"
              ? "habilidades-manager-subnavegacao-botao habilidades-manager-subnavegacao-botao-ativo"
              : "habilidades-manager-subnavegacao-botao"
          }
          onClick={
            abrirBiblioteca
          }
        >
          {(
            rotulos.biblioteca ||
            "Biblioteca"
          ).toUpperCase()}

          <span>
            {totalBanco}
          </span>
        </button>

      </div>
    );
  }


  function abrirNova() {
    if (somenteLeitura) {
      return;
    }

    setVisualizacaoPrincipal(
      "adquiridas"
    );

    setFormulario(
      criarHabilidadeVazia(
        configuracaoHabilidades
      )
    );

    setIndiceEditando(null);
    setOrigemEdicao("lista");
    setIndiceAberto(null);
    setDetalhesCustosAbertos(false);
    setMecanicaAvancadaAberta(false);
    setHistoricoBancoAberto(false);
    setMostrandoEditor(true);
  }


  function abrirDetalhes(
    indice
  ) {
    setVisualizacaoPrincipal(
      "adquiridas"
    );

    setIndiceAberto(indice);
    setDetalhesCustosAbertos(false);
    setHistoricoBancoAberto(false);
    setMostrandoEditor(false);
  }


  function abrirEdicao(
    habilidade,
    indice,
    origem = "lista"
  ) {
    if (somenteLeitura) {
      return;
    }

    const comBase =
      garantirBaseInstanciaHabilidade(
        habilidade,
        configuracaoHabilidades
      );

    setVisualizacaoPrincipal(
      "adquiridas"
    );

    setFormulario(
      normalizarHabilidade(
        comBase,
        configuracaoHabilidades
      )
    );

    setIndiceEditando(indice);
    setOrigemEdicao(origem);
    setIndiceAberto(null);
    setMecanicaAvancadaAberta(false);
    setHistoricoBancoAberto(false);
    setMostrandoEditor(true);
  }


  function retornarDaEdicao() {
    const voltarParaDetalhes =
      origemEdicao ===
        "detalhes" &&
      indiceEditando !== null;

    setMostrandoEditor(false);

    setIndiceAberto(
      voltarParaDetalhes
        ? indiceEditando
        : null
    );

    setIndiceEditando(null);
    setOrigemEdicao("lista");
    setHistoricoBancoAberto(false);

    setVisualizacaoPrincipal(
      "adquiridas"
    );
  }


  function cancelarEdicao() {
    retornarDaEdicao();
  }


  function alterarCampo(
    campo,
    valor
  ) {
    setFormulario(
      anterior => ({
        ...anterior,

        [campo]:
          valor
      })
    );
  }


  /*
    A imagem da ficha possui tratamento
    próprio porque não deve apagar a imagem
    herdada da campanha ou do catálogo.
  */

  function alterarImagemFicha(
    valor
  ) {
    setFormulario(
      anterior =>
        definirImagemFichaHabilidade(
          anterior,
          valor
        )
    );
  }


  function alterarTipo(
    novoTipo
  ) {
    const tipo =
      descobrirTipo(
        novoTipo,
        tipos
      );

    const parametrosTipo =
      obterParametrosTipo(
        tipo,
        tipos
      );

    setFormulario(
      anterior => {
        const parametros = {
          ...(anterior.parametros || {})
        };

        parametrosTipo.forEach(
          parametro => {
            if (
              !Object.prototype
                .hasOwnProperty
                .call(
                  parametros,
                  parametro.chave
                )
            ) {
              parametros[
                parametro.chave
              ] =
                "";
            }
          }
        );

        return {
          ...anterior,
          tipo,
          parametros
        };
      }
    );
  }


  function alterarParametro(
    chave,
    valor
  ) {
    setFormulario(
      anterior => ({
        ...anterior,

        parametros: {
          ...(anterior.parametros || {}),

          [chave]:
            valor
        }
      })
    );
  }


  function alterarCusto(
    chave,
    valor
  ) {
    setFormulario(
      anterior => ({
        ...anterior,

        custos: {
          ...(anterior.custos || {}),

          [chave]:
            valor
        }
      })
    );
  }


  function alterarRequisitoAtributo(
    nome,
    valor
  ) {
    setFormulario(
      anterior => ({
        ...anterior,

        requisitosAtributos: {
          ...(anterior.requisitosAtributos || {}),

          [nome]:
            valor
        }
      })
    );
  }


  function removerRequisitoAtributo(
    nome
  ) {
    setFormulario(
      anterior => {
        const novos = {
          ...(anterior.requisitosAtributos || {})
        };

        delete novos[nome];

        return {
          ...anterior,

          requisitosAtributos:
            novos
        };
      }
    );
  }


  function alterarRequisitosNarrativos(
    requisitos
  ) {
    setFormulario(
      anterior => ({
        ...anterior,

        requisitosNarrativos:
          normalizarRequisitosNarrativos(
            requisitos
          )
      })
    );
  }


  function restaurarAlteracao(
    indice,
    alteracao
  ) {
    if (
      somenteLeitura ||
      !onEditar ||
      !habilidades[indice]
    ) {
      return;
    }

    const atualComBase =
      garantirBaseInstanciaHabilidade(
        habilidades[indice],
        configuracaoHabilidades
      );

    const restaurada =
      restaurarAlteracaoInstanciaDaBase({
        habilidade:
          atualComBase,

        alteracao,

        configuracaoHabilidades
      });

    onEditar(
      indice,
      restaurada
    );
  }


  function salvar() {
    if (somenteLeitura) {
      return;
    }

    const nome =
      String(
        formulario.nome ||
        ""
      ).trim();

    if (!nome) {
      alert(
        `Digite um nome para a ${rotulos.singular.toLowerCase()}.`
      );

      return;
    }

    const parametrosConfigurados =
      criarMapaParametrosConfigurados(
        tipos
      );

    const parametrosProntos = {};

    Object.entries(
      formulario.parametros ||
      {}
    ).forEach(
      ([chave, valor]) => {
        parametrosProntos[
          chave
        ] =
          parametrosConfigurados[chave]
            ? normalizarValorParametro(
                valor,
                configuracaoHabilidades
              )
            : valor;
      }
    );

    const requisitosAtributosProntos =
      {};

    Object.entries(
      formulario
        .requisitosAtributos ||
      {}
    ).forEach(
      ([nomeAtributo, valor]) => {
        if (
          valor === "" ||
          valor === null ||
          valor === undefined
        ) {
          return;
        }

        const numero =
          Number(valor);

        if (
          Number.isNaN(numero)
        ) {
          return;
        }

        requisitosAtributosProntos[
          nomeAtributo
        ] =
          Math.max(
            0,
            numero
          );
      }
    );

    const custosProntos = {
      ...(formulario.custos || {})
    };

    (
      configuracaoHabilidades
        ?.custosAdicionais ||
      []
    ).forEach(
      custo => {
        const valor =
          formulario
            ?.custos
            ?.[custo.chave];

        if (
          custo.tipo ===
          "numero"
        ) {
          if (
            valor === "" ||
            valor === null ||
            valor === undefined
          ) {
            custosProntos[
              custo.chave
            ] =
              "";

            return;
          }

          const numero =
            Number(valor);

          custosProntos[
            custo.chave
          ] =
            Number.isNaN(numero)
              ? ""
              : Math.max(
                  Number(
                    custo.minimo
                  ) || 0,

                  numero
                );

          return;
        }

        custosProntos[
          custo.chave
        ] =
          String(
            valor ||
            ""
          ).trim();
      }
    );

    const custoBruto =
      formulario[
        campoCustoPrincipal
      ];

    const custoPrincipal =
      custoBruto === "" ||
      custoBruto === null ||
      custoBruto === undefined
        ? ""
        : Math.max(
            Number(
              configuracaoHabilidades
                ?.custoPrincipal
                ?.minimo
            ) || 0,

            Number(custoBruto) || 0
          );

    const grau =
      String(
        formulario.grau ||
        ""
      ).trim();

    const descricao =
      String(
        formulario.descricao ||
        ""
      ).trim();

    let habilidadePronta = {
      ...formulario,

      nome,

      tipo:
        formulario.tipo,

      categoria:
        String(
          formulario.categoria ||
          ""
        ).trim(),

      elemento:
        String(
          formulario.elemento ||
          ""
        ).trim(),

      grau,

      estagio:
        grau,

      estado:
        formulario.estado,

      [campoCustoPrincipal]:
        custoPrincipal,

      imagem:
        String(
          formulario.imagem ||
          ""
        ).trim(),

      descricao,

      funcao:
        descricao,

      evolucao:
        String(
          formulario.evolucao ||
          ""
        ).trim(),

      parametros:
        parametrosProntos,

      atributos: {
        ...parametrosProntos
      },

      custos:
        custosProntos,

      condicoes:
        String(
          custosProntos.condicao ||
          formulario?.condicoes ||
          ""
        ).trim(),

      requisitosAtributos:
        requisitosAtributosProntos,

      requisitosNarrativos:
        normalizarRequisitosNarrativos(
          formulario
            .requisitosNarrativos
        )
    };


    /*
      Se a técnica veio do Banco, "imagem"
      não é mais editada diretamente.

      A URL digitada pertence somente à
      camada da ficha.

      Se imagemFicha estiver vazia, o helper
      restaura campanha → referência.
    */

    if (
      habilidadeVeioDaBiblioteca(
        formulario,
        configuracaoHabilidades
      )
    ) {
      habilidadePronta =
        definirImagemFichaHabilidade(
          habilidadePronta,
          textoLimpo(
            formulario
              ?.imagemFicha
          )
        );
    }


    if (
      indiceEditando === null
    ) {
      onCriar?.(
        habilidadePronta
      );

    } else {
      onEditar?.(
        indiceEditando,
        habilidadePronta
      );
    }

    retornarDaEdicao();
  }


  /* ======================================
     DETALHES
  ====================================== */

  if (
    indiceAberto !== null &&
    habilidades[indiceAberto]
  ) {
    const habilidadeOriginal =
      garantirBaseInstanciaHabilidade(
        habilidades[indiceAberto],
        configuracaoHabilidades
      );

    const habilidade =
      normalizarHabilidade(
        habilidadeOriginal,
        configuracaoHabilidades
      );

    const tipo =
      tipos[
        habilidade.tipo
      ] ||
      tipos.outro ||
      {};

    const parametrosTipo =
      obterParametrosTipo(
        habilidade.tipo,
        tipos
      );

    const parametrosDefinidos =
      parametrosTipo.filter(
        parametro =>
          parametroFoiDefinido(
            habilidade
              .parametros
              ?.[parametro.chave]
          )
      );

    const custoPrincipal =
      habilidade[
        campoCustoPrincipal
      ];

    const unidadeCusto =
      configuracaoHabilidades
        ?.custoPrincipal
        ?.unidade ||
      "";

    const veioDoBanco =
      habilidadeVeioDaBiblioteca(
        habilidadeOriginal,
        configuracaoHabilidades
      );

    const camadasImagem =
      resolverCamadasImagemHabilidade(
        habilidadeOriginal
      );

    const baseInstancia =
      veioDoBanco
        ? obterBaseInstanciaHabilidade(
            habilidadeOriginal
          )
        : null;

    const comparacaoInstancia =
      veioDoBanco
        ? compararInstanciaComBase(
            habilidade,
            configuracaoHabilidades
          )
        : null;

    const atualizacaoBanco =
      veioDoBanco
        ? obterAtualizacaoBanco(
            habilidadeOriginal
          )
        : null;

    const historicoBanco =
      veioDoBanco
        ? obterHistoricoAtualizacoesBanco(
            habilidadeOriginal
          )
        : [];

    const versaoMecanicaOrigem =
      habilidadeOriginal
        .origemBibliotecaVersaoMecanica;

    const baseReconstruida =
      Boolean(
        habilidadeOriginal
          ?.instanciaHabilidade
          ?.baseReconstruida
      );

    return (
      <div className="habilidades-manager">

        <div className="habilidades-manager-detalhes-topo">

          <button
            type="button"
            className="habilidades-manager-botao-secundario"
            onClick={() =>
              setIndiceAberto(null)
            }
          >
            ← {rotulos.plural.toUpperCase()}
          </button>


          {!somenteLeitura && (

            <button
              type="button"
              className="habilidades-manager-botao-principal"
              onClick={() =>
                abrirEdicao(
                  habilidades[indiceAberto],
                  indiceAberto,
                  "detalhes"
                )
              }
            >
              ✏ EDITAR
            </button>

          )}

        </div>


        <section className="habilidades-manager-hero">

          {camadasImagem.url ? (

            <img
              src={
                camadasImagem.url
              }
              alt={
                habilidade.nome
              }
              className="habilidades-manager-hero-imagem"
            />

          ) : (

            <div className="habilidades-manager-hero-placeholder">
              {tipo.icone || "⚡"}
            </div>

          )}


          <div className="habilidades-manager-hero-identidade">

            <span className="habilidades-manager-etiqueta">
              {rotulos.singular.toUpperCase()}
            </span>

            <h2>
              {habilidade.nome}
            </h2>

            <p>
              {tipo.icone
                ? `${tipo.icone} `
                : ""}

              {tipo.nome ||
                habilidade.tipo}

              {habilidade.categoria
                ? ` · ${habilidade.categoria}`
                : ""}

              {habilidade.elemento
                ? ` · ${habilidade.elemento}`
                : ""}
            </p>


            {veioDoBanco && (

              <p
                style={{
                  marginTop:
                    "12px",

                  color:
                    camadasImagem.origem ===
                    "ficha"
                      ? "#e3bd55"
                      : "#8f99a8",

                  fontSize:
                    "11px",

                  fontWeight:
                    700
                }}
              >
                ◈ {rotuloOrigemImagem(
                  camadasImagem.origem
                )}
              </p>

            )}

          </div>

        </section>


        <div className="habilidades-manager-resumo-grid">

          <article className="habilidades-manager-resumo-card">
            <span>TIPO</span>
            <strong>
              {tipo.nome ||
                habilidade.tipo}
            </strong>
          </article>

          <article className="habilidades-manager-resumo-card">
            <span>ELEMENTO</span>
            <strong>
              {habilidade.elemento ||
                "—"}
            </strong>
          </article>

          <article className="habilidades-manager-resumo-card">
            <span>ESTÁGIO</span>
            <strong>
              {habilidade.grau ||
                "—"}
            </strong>
          </article>

          <article className="habilidades-manager-resumo-card">
            <span>CUSTO</span>

            <strong>
              {configuracaoHabilidades
                ?.custoPrincipal
                ?.icone ||
                "◆"}

              {" "}

              {custoPrincipal === ""
                ? "—"
                : custoPrincipal}

              {custoPrincipal !== "" &&
              unidadeCusto
                ? ` ${unidadeCusto}`
                : ""}
            </strong>
          </article>

        </div>


        {veioDoBanco && (

          <section className="habilidades-manager-bloco">

            <div className="habilidades-manager-bloco-topo">

              <div>
                <span className="habilidades-manager-etiqueta">
                  APRESENTAÇÃO DA FICHA
                </span>

                <h3>
                  {rotuloOrigemImagem(
                    camadasImagem.origem
                  )}
                </h3>
              </div>


              <small>
                {camadasImagem.origem ===
                "ficha"
                  ? "personalizada"
                  : "herdada"}
              </small>

            </div>


            <p className="habilidades-manager-descricao">
              {descricaoOrigemImagem(
                camadasImagem.origem
              )}
            </p>


            <div
              className="habilidades-manager-resumo-grid"
              style={{
                marginTop:
                  "14px",

                marginBottom:
                  0
              }}
            >

              <article className="habilidades-manager-resumo-card">

                <span>FICHA</span>

                <strong>
                  {camadasImagem.ficha
                    ? "Personalizada"
                    : "—"}
                </strong>

              </article>


              <article className="habilidades-manager-resumo-card">

                <span>CAMPANHA</span>

                <strong>
                  {camadasImagem.campanha
                    ? "Disponível"
                    : "—"}
                </strong>

              </article>


              <article className="habilidades-manager-resumo-card">

                <span>REFERÊNCIA</span>

                <strong>
                  {camadasImagem
                    .referencia
                    ?.url
                    ? "Disponível"
                    : "—"}
                </strong>

              </article>


              <article className="habilidades-manager-resumo-card">

                <span>EM USO</span>

                <strong>
                  {camadasImagem.origem ===
                  "ficha"
                    ? "Ficha"
                    : camadasImagem.origem ===
                        "campanha"
                      ? "Campanha"
                      : camadasImagem.origem ===
                          "referencia"
                        ? "Referência"
                        : camadasImagem.origem ===
                            "legado"
                          ? "Legado"
                          : "Ícone"}
                </strong>

              </article>

            </div>

          </section>

        )}


        {veioDoBanco &&
        atualizacaoBanco
          ?.encontrado &&
        atualizacaoBanco
          ?.temAlteracoes &&
        !atualizacaoBanco
          ?.ignorada && (

          <section
            className="habilidades-manager-bloco"
            style={{
              borderColor:
                "#7a6425",

              background:
                "#1d1c17"
            }}
          >

            <div className="habilidades-manager-bloco-topo">

              <div>

                <span
                  className="habilidades-manager-etiqueta"
                  style={{
                    color:
                      "#e2bd52"
                  }}
                >
                  ↑ ATUALIZAÇÃO DISPONÍVEL
                </span>

                <h3>
                  {rotuloAtualizacaoBanco(
                    habilidadeOriginal,
                    atualizacaoBanco
                  )}
                </h3>

              </div>


              <small
                style={{
                  color:
                    "#e2bd52"
                }}
              >
                {atualizacaoBanco.quantidade}
                {" "}
                {atualizacaoBanco.quantidade === 1
                  ? "mudança"
                  : "mudanças"}
              </small>

            </div>


            <p className="habilidades-manager-descricao">
              O Banco mudou desde a base usada por esta ficha. Você pode aplicar a nova referência ou manter esta ficha como está.
            </p>


            <div className="habilidades-manager-custos">

              {atualizacaoBanco
                .alteracoes
                .map(
                  alteracao => (

                    <article
                      key={
                        `banco-${alteracao.grupo}-${alteracao.chave}`
                      }
                    >

                      <div>

                        <strong>
                          {obterRotuloAlteracao(
                            alteracao,
                            tipos,
                            configuracaoHabilidades
                          )}
                        </strong>

                        <span>
                          Base da ficha:{" "}
                          {formatarValorComparacao(
                            alteracao.base
                          )}

                          {"  →  "}

                          Banco atual:{" "}
                          {formatarValorComparacao(
                            alteracao.atual
                          )}
                        </span>

                      </div>

                    </article>

                  )
                )}

            </div>


            <div
              className="habilidades-manager-card-acoes"
              style={{
                marginTop:
                  "16px"
              }}
            >

              {!somenteLeitura && (

                <button
                  type="button"
                  className="habilidades-manager-botao-principal"
                  onClick={() =>
                    aplicarAtualizacaoBanco(
                      indiceAberto,
                      atualizacaoBanco
                    )
                  }
                >
                  ↑ APLICAR ATUALIZAÇÃO DO BANCO
                </button>

              )}


              {!somenteLeitura && (

                <button
                  type="button"
                  className="habilidades-manager-botao-secundario"
                  onClick={() =>
                    manterMinhaVersao(
                      indiceAberto,
                      atualizacaoBanco
                    )
                  }
                >
                  MANTER MINHA VERSÃO
                </button>

              )}

            </div>


            <p
              className="habilidades-manager-ajuda"
              style={{
                marginTop:
                  "14px",

                marginBottom:
                  0
              }}
            >
              Aplicar atualiza campos que a ficha nunca personalizou e preserva as exceções individuais. Manter minha versão apenas silencia esta referência específica; se o Banco mudar novamente, o aviso volta automaticamente.
            </p>

          </section>

        )}


        {veioDoBanco &&
        atualizacaoBanco
          ?.encontrado &&
        atualizacaoBanco
          ?.temAlteracoes &&
        atualizacaoBanco
          ?.ignorada && (

          <section className="habilidades-manager-bloco">

            <div className="habilidades-manager-bloco-topo">

              <div>

                <span className="habilidades-manager-etiqueta">
                  ATUALIZAÇÃO MANTIDA FORA DA FICHA
                </span>

                <h3>
                  {rotuloAtualizacaoBanco(
                    habilidadeOriginal,
                    atualizacaoBanco
                  )}
                </h3>

              </div>

              <small>
                decisão desta ficha
              </small>

            </div>


            <p className="habilidades-manager-descricao">
              Esta referência do Banco foi vista, mas você escolheu continuar usando a base atual desta ficha. Nada foi apagado e você pode reconsiderar a qualquer momento.
            </p>


            {!somenteLeitura && (

              <div className="habilidades-manager-card-acoes">

                <button
                  type="button"
                  className="habilidades-manager-botao-secundario"
                  onClick={() =>
                    reconsiderarAtualizacaoBanco(
                      indiceAberto
                    )
                  }
                >
                  ↺ RECONSIDERAR ATUALIZAÇÃO
                </button>

              </div>

            )}

          </section>

        )}


        {veioDoBanco &&
        atualizacaoBanco &&
        !atualizacaoBanco.encontrado && (

          <section className="habilidades-manager-bloco">

            <span className="habilidades-manager-etiqueta">
              ORIGEM DO BANCO
            </span>

            <p className="habilidades-manager-descricao">
              O template original desta habilidade não foi encontrado no Banco atual. A cópia da ficha continua preservada e utilizável.
            </p>

          </section>

        )}


        {veioDoBanco && (

          <section className="habilidades-manager-bloco">

            <div className="habilidades-manager-bloco-topo">

              <div>

                <span className="habilidades-manager-etiqueta">
                  ORIGEM DA INSTÂNCIA
                </span>

                <h3>
                  {rotulos.biblioteca ||
                    "Biblioteca"}
                </h3>

              </div>


              <small>
                {comparacaoInstancia
                  ?.temAlteracoes
                  ? `${comparacaoInstancia.quantidade} personalização${comparacaoInstancia.quantidade === 1 ? "" : "ões"}`
                  : "Base preservada"}
              </small>

            </div>


            <p className="habilidades-manager-descricao">
              Esta é uma cópia independente na ficha. Alterações feitas aqui não modificam a habilidade geral do Banco.
            </p>


            <div
              className="habilidades-manager-resumo-grid"
              style={{
                marginTop:
                  "14px",

                marginBottom:
                  "14px"
              }}
            >

              <article className="habilidades-manager-resumo-card">
                <span>TEMPLATE</span>

                <strong>
                  {habilidadeOriginal
                    .origemBibliotecaNome ||
                    baseInstancia
                      ?.nome ||
                    "—"}
                </strong>
              </article>


              <article className="habilidades-manager-resumo-card">
                <span>BASE MECÂNICA</span>

                <strong>
                  {versaoMecanicaOrigem
                    ? `V${versaoMecanicaOrigem}`
                    : "Padrão da campanha"}
                </strong>
              </article>


              <article className="habilidades-manager-resumo-card">
                <span>PERSONALIZAÇÕES</span>

                <strong>
                  {comparacaoInstancia
                    ?.quantidade ||
                    0}
                </strong>
              </article>


              <article className="habilidades-manager-resumo-card">
                <span>BASE HISTÓRICA</span>

                <strong>
                  {baseReconstruida
                    ? "Reconstruída"
                    : "Capturada"}
                </strong>
              </article>

            </div>


            {baseReconstruida && (

              <div
                className="habilidades-manager-vazio"
                style={{
                  textAlign:
                    "left",

                  marginBottom:
                    "14px"
                }}
              >
                Esta técnica foi adquirida antes do sistema de base histórica. O estado que ela possuía na migração foi preservado como primeira referência conhecida.
              </div>

            )}


            {comparacaoInstancia
              ?.temAlteracoes ? (

              <>

                <div className="habilidades-manager-bloco-topo">

                  <div>

                    <span className="habilidades-manager-etiqueta">
                      ALTERAÇÕES INDIVIDUAIS
                    </span>

                    <h3>
                      Base → atual
                    </h3>

                  </div>

                </div>


                <div className="habilidades-manager-custos">

                  {comparacaoInstancia
                    .alteracoes
                    .map(
                      alteracao => (

                        <article
                          key={
                            `${alteracao.grupo}-${alteracao.chave}`
                          }
                        >

                          <div>

                            <strong>
                              {obterRotuloAlteracao(
                                alteracao,
                                tipos,
                                configuracaoHabilidades
                              )}
                            </strong>

                            <span>
                              Base:{" "}
                              {formatarValorComparacao(
                                alteracao.base
                              )}

                              {"  →  "}

                              Atual:{" "}
                              {formatarValorComparacao(
                                alteracao.atual
                              )}
                            </span>

                          </div>


                          {!somenteLeitura && (

                            <button
                              type="button"
                              className="habilidades-manager-botao-secundario"
                              onClick={() =>
                                restaurarAlteracao(
                                  indiceAberto,
                                  alteracao
                                )
                              }
                            >
                              ↶ RESTAURAR BASE
                            </button>

                          )}

                        </article>

                      )
                    )}

                </div>

              </>

            ) : (

              <div className="habilidades-manager-vazio">
                Nenhuma personalização individual detectada. A instância corresponde à sua base atual.
              </div>

            )}


            {historicoBanco.length > 0 && (

              <div
                style={{
                  marginTop:
                    "16px"
                }}
              >

                <button
                  type="button"
                  className="habilidades-manager-expandir"
                  onClick={() =>
                    setHistoricoBancoAberto(
                      anterior =>
                        !anterior
                    )
                  }
                >
                  <span>
                    {historicoBancoAberto
                      ? "▲"
                      : "▼"}
                  </span>

                  Histórico de atualizações do Banco

                  <small>
                    {historicoBanco.length}
                    {" "}
                    {historicoBanco.length === 1
                      ? "registro"
                      : "registros"}
                  </small>
                </button>


                {historicoBancoAberto && (

                  <div className="habilidades-manager-custos">

                    {[...historicoBanco]
                      .reverse()
                      .map(
                        (
                          item,
                          indiceHistorico
                        ) => (

                          <article
                            key={
                              `${item.atualizadaEm || "historico"}-${indiceHistorico}`
                            }
                          >

                            <div>

                              <strong>
                                {rotuloHistoricoAtualizacao(
                                  item
                                )}
                              </strong>

                              <span>
                                {formatarDataHora(
                                  item.atualizadaEm
                                )}
                                {" · "}
                                {item.quantidadeAlteracoes || 0}
                                {" "}
                                {(item.quantidadeAlteracoes || 0) === 1
                                  ? "mudança"
                                  : "mudanças"}
                              </span>

                              {Array.isArray(
                                item.campos
                              ) &&
                              item.campos.length > 0 && (

                                <span
                                  style={{
                                    marginTop:
                                      "4px"
                                  }}
                                >
                                  Campos:{" "}
                                  {item.campos
                                    .map(
                                      campo =>
                                        obterRotuloAlteracao(
                                          campo,
                                          tipos,
                                          configuracaoHabilidades
                                        )
                                    )
                                    .join(", ")}
                                </span>

                              )}

                            </div>

                          </article>

                        )
                      )}

                  </div>

                )}

              </div>

            )}

          </section>

        )}


        <div className="habilidades-manager-bloco">

          <VisualizadorEstadoTecnica
            estado={
              habilidade.estado
            }

            requisitosAtributos={
              habilidade
                .requisitosAtributos
            }

            requisitosNarrativos={
              habilidade
                .requisitosNarrativos
            }

            atributosJogador={
              atributosJogador
            }
          />

        </div>


        <section className="habilidades-manager-bloco">

          <div className="habilidades-manager-bloco-topo">

            <div>
              <span className="habilidades-manager-etiqueta">
                FUNÇÃO
              </span>

              <h3>
                Descrição
              </h3>
            </div>

          </div>

          <p className="habilidades-manager-descricao">
            {habilidade.descricao ||
              "Nenhuma descrição cadastrada."}
          </p>

        </section>


        <section className="habilidades-manager-bloco">

          <div className="habilidades-manager-bloco-topo">

            <div>
              <span className="habilidades-manager-etiqueta">
                MECÂNICA
              </span>

              <h3>
                {rotulos.parametros}
              </h3>
            </div>

            <small>
              {tipo.nome ||
                habilidade.tipo}
            </small>

          </div>


          {parametrosDefinidos.length > 0 ? (

            <div className="habilidades-manager-parametros">

              {parametrosDefinidos.map(
                parametro => (

                  <BarraParametro
                    key={
                      parametro.chave
                    }
                    parametro={
                      parametro
                    }
                    valor={
                      habilidade
                        .parametros[
                          parametro.chave
                        ]
                    }
                    configuracaoHabilidades={
                      configuracaoHabilidades
                    }
                  />

                )
              )}

            </div>

          ) : (

            <div className="habilidades-manager-vazio">
              Nenhum parâmetro mecânico foi definido para esta{" "}
              {rotulos.singular.toLowerCase()}.
            </div>

          )}

        </section>


        <section className="habilidades-manager-bloco">

          <div className="habilidades-manager-bloco-topo">

            <div>
              <span className="habilidades-manager-etiqueta">
                APRENDIZADO
              </span>

              <h3>
                Requisitos
              </h3>
            </div>

          </div>

          <VisualizadorRequisitosTecnica
            requisitosAtributos={
              habilidade
                .requisitosAtributos
            }
            requisitosNarrativos={
              habilidade
                .requisitosNarrativos
            }
            atributosJogador={
              atributosJogador
            }
            atributosDisponiveis={
              configuracaoHabilidades
                ?.requisitos
                ?.atributosDisponiveis
            }
          />

        </section>


        {habilidade.evolucao && (

          <section className="habilidades-manager-bloco">

            <div className="habilidades-manager-bloco-topo">

              <div>
                <span className="habilidades-manager-etiqueta">
                  PROGRESSÃO
                </span>

                <h3>
                  Evolução registrada
                </h3>
              </div>

            </div>

            <p className="habilidades-manager-descricao">
              {habilidade.evolucao}
            </p>

          </section>

        )}


        <section className="habilidades-manager-bloco">

          <button
            type="button"
            className="habilidades-manager-expandir"
            onClick={() =>
              setDetalhesCustosAbertos(
                anterior =>
                  !anterior
              )
            }
          >
            <span>
              {detalhesCustosAbertos
                ? "▲"
                : "▼"}
            </span>

            Custos e condições avançadas
          </button>


          {detalhesCustosAbertos && (

            <div className="habilidades-manager-custos">

              <article>
                <span>
                  {configuracaoHabilidades
                    ?.custoPrincipal
                    ?.nome ||
                    "Custo"}
                </span>

                <strong>
                  {custoPrincipal === ""
                    ? "—"
                    : custoPrincipal}

                  {custoPrincipal !== "" &&
                  unidadeCusto
                    ? ` ${unidadeCusto}`
                    : ""}
                </strong>
              </article>


              {(
                configuracaoHabilidades
                  ?.custosAdicionais ||
                []
              ).map(
                custo => {
                  const valor =
                    habilidade
                      ?.custos
                      ?.[custo.chave];

                  return (
                    <article
                      key={custo.chave}
                    >
                      <span>
                        {custo.nome}
                      </span>

                      <strong>
                        {valor === "" ||
                        valor === null ||
                        valor === undefined
                          ? "—"
                          : valor}
                      </strong>
                    </article>
                  );
                }
              )}

            </div>

          )}

        </section>

      </div>
    );
  }


  /* ======================================
     EDITOR
  ====================================== */

  if (mostrandoEditor) {
    const tipo =
      tipos[
        formulario.tipo
      ] ||
      tipos.outro ||
      {};

    const parametrosTipo =
      obterParametrosTipo(
        formulario.tipo,
        tipos
      );

    const escalaMinima =
      configuracaoHabilidades
        ?.escalaParametros
        ?.minimo ??
      0;

    const escalaMaxima =
      configuracaoHabilidades
        ?.escalaParametros
        ?.maximo ??
      10;

    const formularioVeioDoBanco =
      habilidadeVeioDaBiblioteca(
        formulario,
        configuracaoHabilidades
      );

    const comparacaoFormulario =
      formularioVeioDoBanco
        ? compararInstanciaComBase(
            formulario,
            configuracaoHabilidades
          )
        : null;

    const camadasImagemFormulario =
      resolverCamadasImagemHabilidade(
        formulario
      );

    return (
      <div className="habilidades-manager">

        <div className="habilidades-manager-editor-topo">

          <div>

            <span className="habilidades-manager-etiqueta">
              {indiceEditando === null
                ? "CRIAR"
                : "EDITAR"}
            </span>

            <h2>
              {indiceEditando === null
                ? rotulos.nova
                : rotulos.editar}
            </h2>

            <p>
              Informações principais ficam acessíveis. Mecânica, custos e requisitos permanecem em uma camada avançada.
            </p>

          </div>

        </div>


        {formularioVeioDoBanco && (

          <section className="habilidades-manager-editor-secao">

            <div className="habilidades-manager-bloco-topo">

              <div>
                <span className="habilidades-manager-etiqueta">
                  INSTÂNCIA DA FICHA
                </span>

                <h3>
                  Personalização individual
                </h3>
              </div>

              <small>
                {comparacaoFormulario
                  ?.quantidade ||
                  0}
                {" "}
                alteração
                {(comparacaoFormulario
                  ?.quantidade ||
                  0) === 1
                  ? ""
                  : "ões"}
              </small>

            </div>

            <p className="habilidades-manager-descricao">
              Esta habilidade veio do {rotulos.biblioteca || "Banco"}. Tudo que você alterar aqui afeta somente esta ficha.
            </p>

          </section>

        )}


        <section className="habilidades-manager-editor-secao">

          <div className="habilidades-manager-bloco-topo">
            <div>
              <span className="habilidades-manager-etiqueta">
                PRINCIPAL
              </span>

              <h3>
                Informações da técnica
              </h3>
            </div>
          </div>


          <div className="habilidades-manager-form-grid">

            <label className="habilidades-manager-campo habilidades-manager-campo-grande">
              <span>NOME</span>

              <input
                type="text"
                value={formulario.nome}
                onChange={
                  evento =>
                    alterarCampo(
                      "nome",
                      evento.target.value
                    )
                }
                placeholder="Ex.: Furacão de Fogo"
              />
            </label>


            <label className="habilidades-manager-campo">
              <span>TIPO</span>

              <select
                value={formulario.tipo}
                onChange={
                  evento =>
                    alterarTipo(
                      evento.target.value
                    )
                }
              >
                {Object.entries(tipos)
                  .map(
                    ([
                      chave,
                      configuracaoTipo
                    ]) => (

                      <option
                        key={chave}
                        value={chave}
                      >
                        {configuracaoTipo.icone
                          ? `${configuracaoTipo.icone} `
                          : ""}

                        {configuracaoTipo.nome}
                      </option>

                    )
                  )}
              </select>
            </label>


            <label className="habilidades-manager-campo">
              <span>CATEGORIA</span>

              <input
                type="text"
                value={formulario.categoria}
                onChange={
                  evento =>
                    alterarCampo(
                      "categoria",
                      evento.target.value
                    )
                }
                placeholder="Opcional"
              />
            </label>


            <label className="habilidades-manager-campo">
              <span>ELEMENTO</span>

              <input
                type="text"
                value={formulario.elemento}
                onChange={
                  evento =>
                    alterarCampo(
                      "elemento",
                      evento.target.value
                    )
                }
                placeholder="Ex.: Fogo"
              />
            </label>


            <label className="habilidades-manager-campo">
              <span>GRAU / ESTÁGIO</span>

              <input
                type="text"
                value={formulario.grau}
                onChange={
                  evento =>
                    alterarCampo(
                      "grau",
                      evento.target.value
                    )
                }
                placeholder="Ex.: Básico, V2, G5..."
              />
            </label>


            <label className="habilidades-manager-campo">

              <span>
                {(
                  configuracaoHabilidades
                    ?.custoPrincipal
                    ?.nome ||
                  "CUSTO"
                ).toUpperCase()}
              </span>

              <input
                type="number"
                min={
                  configuracaoHabilidades
                    ?.custoPrincipal
                    ?.minimo ??
                  0
                }
                value={
                  formulario[
                    campoCustoPrincipal
                  ]
                }
                onChange={
                  evento =>
                    alterarCampo(
                      campoCustoPrincipal,
                      evento.target.value
                    )
                }
                placeholder="Opcional"
              />

            </label>


            {formularioVeioDoBanco ? (

              <>

                <label className="habilidades-manager-campo habilidades-manager-campo-grande">

                  <span>
                    IMAGEM PRÓPRIA DA FICHA — URL
                  </span>

                  <input
                    type="url"
                    value={
                      camadasImagemFormulario
                        .ficha
                    }
                    onChange={
                      evento =>
                        alterarImagemFicha(
                          evento
                            .target
                            .value
                        )
                    }
                    placeholder="Deixe vazio para usar a imagem herdada"
                  />

                </label>


                <div
                  className="habilidades-manager-campo-grande"
                  style={{
                    padding:
                      "12px",

                    border:
                      "1px solid #303a48",

                    borderRadius:
                      "9px",

                    background:
                      "#121820"
                  }}
                >

                  <span
                    className="habilidades-manager-etiqueta"
                    style={{
                      marginBottom:
                        "7px"
                    }}
                  >
                    IMAGEM ATUAL
                  </span>


                  <strong
                    style={{
                      display:
                        "block",

                      color:
                        camadasImagemFormulario.origem ===
                        "ficha"
                          ? "#e3bd55"
                          : "#b8bec8"
                    }}
                  >
                    {rotuloOrigemImagem(
                      camadasImagemFormulario.origem
                    )}
                  </strong>


                  <p
                    className="habilidades-manager-ajuda"
                    style={{
                      marginTop:
                        "6px",

                      marginBottom:
                        0
                    }}
                  >
                    {descricaoOrigemImagem(
                      camadasImagemFormulario.origem
                    )}
                  </p>


                  {camadasImagemFormulario.ficha && (

                    <button
                      type="button"
                      className="habilidades-manager-botao-secundario"
                      style={{
                        marginTop:
                          "12px"
                      }}
                      onClick={() =>
                        alterarImagemFicha("")
                      }
                    >
                      ↶ USAR IMAGEM HERDADA
                    </button>

                  )}

                </div>


                {camadasImagemFormulario.url && (

                  <div className="habilidades-manager-previa-imagem habilidades-manager-campo-grande">

                    <img
                      src={
                        camadasImagemFormulario.url
                      }
                      alt="Prévia"
                    />

                  </div>

                )}

              </>

            ) : (

              <>

                <label className="habilidades-manager-campo habilidades-manager-campo-grande">
                  <span>IMAGEM — URL</span>

                  <input
                    type="url"
                    value={
                      formulario.imagem
                    }
                    onChange={
                      evento =>
                        alterarCampo(
                          "imagem",
                          evento.target.value
                        )
                    }
                    placeholder="https://..."
                  />
                </label>


                {formulario.imagem && (

                  <div className="habilidades-manager-previa-imagem habilidades-manager-campo-grande">

                    <img
                      src={
                        formulario.imagem
                      }
                      alt="Prévia"
                    />

                  </div>

                )}

              </>

            )}


            <label className="habilidades-manager-campo habilidades-manager-campo-grande">
              <span>DESCRIÇÃO / FUNÇÃO</span>

              <textarea
                value={formulario.descricao}
                onChange={
                  evento =>
                    alterarCampo(
                      "descricao",
                      evento.target.value
                    )
                }
                placeholder="Descreva o funcionamento da técnica..."
              />
            </label>

          </div>

        </section>


        <section className="habilidades-manager-editor-secao">

          <div className="habilidades-manager-bloco-topo">
            <div>
              <span className="habilidades-manager-etiqueta">
                SITUAÇÃO ATUAL
              </span>

              <h3>
                Estado e elegibilidade
              </h3>
            </div>
          </div>

          <EditorEstadoTecnica
            estado={formulario.estado}
            requisitosAtributos={
              formulario.requisitosAtributos
            }
            requisitosNarrativos={
              formulario.requisitosNarrativos
            }
            atributosJogador={
              atributosJogador
            }
            onAlterar={
              novoEstado =>
                alterarCampo(
                  "estado",
                  novoEstado
                )
            }
          />

        </section>


        <section className="habilidades-manager-editor-secao">

          <button
            type="button"
            className="habilidades-manager-expandir habilidades-manager-expandir-destaque"
            onClick={() =>
              setMecanicaAvancadaAberta(
                anterior =>
                  !anterior
              )
            }
          >
            <span>
              {mecanicaAvancadaAberta
                ? "▲"
                : "▼"}
            </span>

            Mecânica avançada da técnica

            <small>
              Parâmetros, custos, requisitos e evolução
            </small>
          </button>


          {mecanicaAvancadaAberta && (

            <div className="habilidades-manager-avancado">

              <section className="habilidades-manager-subsecao">

                <div className="habilidades-manager-bloco-topo">
                  <div>
                    <span className="habilidades-manager-etiqueta">
                      {tipo.nome ||
                        formulario.tipo}
                    </span>

                    <h3>
                      {rotulos.parametros}
                    </h3>
                  </div>

                  <small>
                    {escalaMinima}
                    {"–"}
                    {escalaMaxima}
                  </small>
                </div>


                <p className="habilidades-manager-ajuda">
                  Cada tipo possui seus próprios parâmetros. Campo vazio significa “não definido”, não valor zero.
                </p>


                {parametrosTipo.length > 0 ? (

                  <div className="habilidades-manager-parametros-editor">

                    {parametrosTipo.map(
                      parametro => (

                        <label
                          key={parametro.chave}
                          className="habilidades-manager-parametro-editor"
                        >
                          <span>
                            {parametro.nome ||
                              parametro.chave}
                          </span>

                          <input
                            type="number"
                            min={escalaMinima}
                            max={escalaMaxima}
                            value={
                              formulario
                                ?.parametros
                                ?.[parametro.chave] ??
                              ""
                            }
                            onChange={
                              evento =>
                                alterarParametro(
                                  parametro.chave,
                                  evento.target.value
                                )
                            }
                            placeholder="Não definido"
                          />
                        </label>

                      )
                    )}

                  </div>

                ) : (

                  <div className="habilidades-manager-vazio">
                    Este tipo não possui parâmetros configurados.
                  </div>

                )}

              </section>


              <section className="habilidades-manager-subsecao">

                <div className="habilidades-manager-bloco-topo">
                  <div>
                    <span className="habilidades-manager-etiqueta">
                      UTILIZAÇÃO
                    </span>

                    <h3>
                      Custos e condições
                    </h3>
                  </div>
                </div>


                <div className="habilidades-manager-form-grid">

                  {(
                    configuracaoHabilidades
                      ?.custosAdicionais ||
                    []
                  ).map(
                    custo => (

                      <label
                        key={custo.chave}
                        className={[
                          "habilidades-manager-campo",

                          custo.tipo === "texto"
                            ? "habilidades-manager-campo-grande"
                            : ""
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >

                        <span>
                          {custo.nome.toUpperCase()}
                        </span>


                        {custo.tipo === "numero" ? (

                          <input
                            type="number"
                            min={
                              custo.minimo ??
                              0
                            }
                            value={
                              formulario
                                ?.custos
                                ?.[custo.chave] ??
                              ""
                            }
                            onChange={
                              evento =>
                                alterarCusto(
                                  custo.chave,
                                  evento.target.value
                                )
                            }
                            placeholder={
                              custo.opcional
                                ? "Opcional"
                                : "0"
                            }
                          />

                        ) : (

                          <input
                            type="text"
                            value={
                              formulario
                                ?.custos
                                ?.[custo.chave] ??
                              ""
                            }
                            onChange={
                              evento =>
                                alterarCusto(
                                  custo.chave,
                                  evento.target.value
                                )
                            }
                            placeholder={
                              custo.placeholder ||
                              (
                                custo.opcional
                                  ? "Opcional"
                                  : ""
                              )
                            }
                          />

                        )}

                      </label>

                    )
                  )}

                </div>

              </section>


              <section className="habilidades-manager-subsecao">

                <div className="habilidades-manager-bloco-topo">
                  <div>
                    <span className="habilidades-manager-etiqueta">
                      APRENDIZADO
                    </span>

                    <h3>
                      Requisitos
                    </h3>
                  </div>
                </div>

                <EditorRequisitosTecnica
                  requisitosAtributos={
                    formulario
                      .requisitosAtributos
                  }
                  requisitosNarrativos={
                    formulario
                      .requisitosNarrativos
                  }
                  atributosDisponiveis={
                    configuracaoHabilidades
                      ?.requisitos
                      ?.atributosDisponiveis
                  }
                  onAlterarAtributo={
                    alterarRequisitoAtributo
                  }
                  onRemoverAtributo={
                    removerRequisitoAtributo
                  }
                  onAlterarNarrativos={
                    alterarRequisitosNarrativos
                  }
                />

              </section>


              <section className="habilidades-manager-subsecao">

                <div className="habilidades-manager-bloco-topo">
                  <div>
                    <span className="habilidades-manager-etiqueta">
                      PROGRESSÃO
                    </span>

                    <h3>
                      Evolução registrada
                    </h3>
                  </div>
                </div>

                <label className="habilidades-manager-campo">

                  <span>
                    OBSERVAÇÃO / EVOLUÇÃO
                  </span>

                  <textarea
                    value={formulario.evolucao}
                    onChange={
                      evento =>
                        alterarCampo(
                          "evolucao",
                          evento.target.value
                        )
                    }
                    placeholder="Ex.: evoluiu para V2 após treinamento específico."
                  />

                </label>

              </section>

            </div>

          )}

        </section>


        <div className="habilidades-manager-editor-acoes">

          <button
            type="button"
            className="habilidades-manager-botao-secundario"
            onClick={
              cancelarEdicao
            }
          >
            CANCELAR
          </button>

          <button
            type="button"
            className="habilidades-manager-botao-principal"
            onClick={
              salvar
            }
          >
            💾 SALVAR {rotulos.singular.toUpperCase()}
          </button>

        </div>

      </div>
    );
  }


  /* ======================================
     BANCO
  ====================================== */

  if (
    visualizacaoPrincipal === "biblioteca" &&
    bibliotecaAtiva
  ) {
    return (
      <div className="habilidades-manager">

        <NavegacaoPrincipal />

        <BibliotecaHabilidades
          habilidadesAdquiridas={
            habilidades
          }
          atributosJogador={
            atributosJogador
          }
          configuracaoHabilidades={
            configuracaoHabilidades
          }
          somenteLeitura={
            somenteLeitura
          }
          onAdquirir={
            onCriar
          }
        />

      </div>
    );
  }


  /* ======================================
     ADQUIRIDAS
  ====================================== */

  return (
    <div className="habilidades-manager">

      <NavegacaoPrincipal />


      <div className="habilidades-manager-lista-topo">

        <div>
          <span className="habilidades-manager-etiqueta">
            ADQUIRIDAS
          </span>

          <h2>
            {rotulos.plural}
          </h2>

          <p>
            Informações principais ficam visíveis. Mecânica, requisitos, custos, evolução e origem ficam atrás de ABRIR.
          </p>
        </div>


        {!somenteLeitura && (

          <button
            type="button"
            className="habilidades-manager-botao-principal"
            onClick={
              abrirNova
            }
          >
            ＋ {rotulos.nova.toUpperCase()}
          </button>

        )}

      </div>


      {habilidades.length === 0 ? (

        <div className="habilidades-manager-vazio habilidades-manager-vazio-grande">
          Nenhuma{" "}
          {rotulos.singular.toLowerCase()} cadastrada.
        </div>

      ) : (

        <div className="habilidades-manager-lista">

          {habilidades.map(
            (
              habilidade,
              indice
            ) => {
              const comBase =
                garantirBaseInstanciaHabilidade(
                  habilidade,
                  configuracaoHabilidades
                );

              const normalizada =
                normalizarHabilidade(
                  comBase,
                  configuracaoHabilidades
                );

              const tipo =
                tipos[
                  normalizada.tipo
                ] ||
                tipos.outro ||
                {};

              const custo =
                normalizada[
                  campoCustoPrincipal
                ];

              const unidade =
                configuracaoHabilidades
                  ?.custoPrincipal
                  ?.unidade ||
                "";

              const veioDoBanco =
                habilidadeVeioDaBiblioteca(
                  comBase,
                  configuracaoHabilidades
                );

              const camadasImagem =
                resolverCamadasImagemHabilidade(
                  comBase
                );

              const comparacao =
                veioDoBanco
                  ? compararInstanciaComBase(
                      normalizada,
                      configuracaoHabilidades
                    )
                  : null;

              const atualizacaoBanco =
                veioDoBanco
                  ? obterAtualizacaoBanco(
                      comBase
                    )
                  : null;

              return (
                <article
                  key={
                    habilidade.id ??
                    `${normalizada.nome}-${indice}`
                  }
                  className="habilidades-manager-card"
                >

                  <div className="habilidades-manager-card-imagem">

                    {camadasImagem.url ? (

                      <img
                        src={
                          camadasImagem.url
                        }
                        alt={
                          normalizada.nome
                        }
                      />

                    ) : (

                      <span>
                        {tipo.icone ||
                          "⚡"}
                      </span>

                    )}

                  </div>


                  <div className="habilidades-manager-card-corpo">

                    <div className="habilidades-manager-card-titulo">

                      <div>
                        <h3>
                          {normalizada.nome ||
                            "Sem nome"}
                        </h3>

                        <p>
                          {tipo.nome ||
                            normalizada.tipo}

                          {normalizada.categoria
                            ? ` · ${normalizada.categoria}`
                            : ""}

                          {normalizada.elemento
                            ? ` · ${normalizada.elemento}`
                            : ""}
                        </p>
                      </div>


                      <div className="habilidades-manager-card-meta">

                        <span>
                          {normalizada.grau ||
                            "—"}
                        </span>

                        <strong>
                          {configuracaoHabilidades
                            ?.custoPrincipal
                            ?.icone ||
                            "◆"}

                          {" "}

                          {custo === ""
                            ? "—"
                            : custo}

                          {custo !== "" &&
                          unidade
                            ? ` ${unidade}`
                            : ""}
                        </strong>

                      </div>

                    </div>


                    {normalizada.descricao && (

                      <p className="habilidades-manager-card-descricao">
                        {normalizada.descricao}
                      </p>

                    )}


                    {veioDoBanco && (

                      <p
                        className="habilidades-manager-card-descricao"
                        style={{
                          color:
                            comparacao
                              ?.temAlteracoes
                              ? "#e3bd55"
                              : "#8fb69a",

                          fontSize:
                            "12px"
                        }}
                      >
                        ◈ {rotulos.biblioteca || "Banco"}

                        {" · "}

                        {comparacao
                          ?.temAlteracoes
                          ? `${comparacao.quantidade} personalização${comparacao.quantidade === 1 ? "" : "ões"}`
                          : "base intacta"}

                        {" · "}

                        {camadasImagem.origem ===
                        "ficha"
                          ? "imagem da ficha"
                          : camadasImagem.origem ===
                              "campanha"
                            ? "imagem da campanha"
                            : camadasImagem.origem ===
                                "referencia"
                              ? "imagem de referência"
                              : "imagem herdada"}
                      </p>

                    )}


                    {atualizacaoBanco
                      ?.encontrado &&
                    atualizacaoBanco
                      ?.temAlteracoes &&
                    !atualizacaoBanco
                      ?.ignorada && (

                      <p
                        className="habilidades-manager-card-descricao"
                        style={{
                          color:
                            "#e6bf52",

                          fontSize:
                            "12px",

                          fontWeight:
                            800
                        }}
                      >
                        ↑ ATUALIZAÇÃO DO BANCO DISPONÍVEL
                        {" · "}
                        {rotuloAtualizacaoBanco(
                          comBase,
                          atualizacaoBanco
                        )}
                      </p>

                    )}


                    {atualizacaoBanco
                      ?.encontrado &&
                    atualizacaoBanco
                      ?.temAlteracoes &&
                    atualizacaoBanco
                      ?.ignorada && (

                      <p
                        className="habilidades-manager-card-descricao"
                        style={{
                          color:
                            "#8f99a8",

                          fontSize:
                            "12px"
                        }}
                      >
                        ○ Atualização atual do Banco mantida fora desta ficha
                      </p>

                    )}


                    <div className="habilidades-manager-card-acoes">

                      <button
                        type="button"
                        className="habilidades-manager-botao-secundario"
                        onClick={() =>
                          abrirDetalhes(
                            indice
                          )
                        }
                      >
                        ABRIR
                      </button>


                      {!somenteLeitura && (

                        <button
                          type="button"
                          className="habilidades-manager-botao-secundario"
                          onClick={() =>
                            abrirEdicao(
                              habilidade,
                              indice,
                              "lista"
                            )
                          }
                        >
                          EDITAR
                        </button>

                      )}


                      {!somenteLeitura && (

                        <button
                          type="button"
                          className="habilidades-manager-botao-perigo"
                          onClick={() =>
                            onExcluir?.(
                              indice
                            )
                          }
                        >
                          EXCLUIR
                        </button>

                      )}

                    </div>

                  </div>

                </article>
              );
            }
          )}

        </div>

      )}

    </div>
  );
}


export default HabilidadesManager;