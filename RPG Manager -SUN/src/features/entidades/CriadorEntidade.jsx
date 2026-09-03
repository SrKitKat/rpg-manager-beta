import React, {
  useState
} from "react";

import "./CriadorEntidade.css";

import {
  TIPOS_ENTIDADE,
  VISIBILIDADES_ENTIDADE
} from "../campanhas/campanhas.js";


const CONFIGURACOES_TIPO = {

  [TIPOS_ENTIDADE.PERSONAGEM]: {
    icone: "👤",
    nome: "Personagem",
    descricao:
      "Personagem vinculado a um participante ou à história da campanha."
  },

  [TIPOS_ENTIDADE.NPC]: {
    icone: "🎭",
    nome: "NPC",
    descricao:
      "Personagem organizado como NPC da campanha."
  },

  [TIPOS_ENTIDADE.ADVERSARIO]: {
    icone: "⚔️",
    nome: "Adversário",
    descricao:
      "Entidade organizada como oposição, rival ou ameaça."
  },

  [TIPOS_ENTIDADE.MONSTRO]: {
    icone: "👹",
    nome: "Monstro",
    descricao:
      "Criatura ou entidade organizada na categoria de monstros."
  },

  [TIPOS_ENTIDADE.AUXILIAR]: {
    icone: "🧰",
    nome: "Auxiliar",
    descricao:
      "Entidade auxiliar utilizada durante a campanha."
  }

};


const ETAPAS_CRIACAO_BASE = [

  {
    id: "informacoes",
    nome: "Informações"
  },

  {
    id: "atributos",
    nome: "Atributos"
  },

  {
    id: "recursos",
    nome: "Recursos"
  },

  {
    id: "caracteristicas",
    nome: "Características"
  },

  {
    id: "revisao",
    nome: "Revisão"
  }

];


const ETAPAS_EDICAO = [

  {
    id: "informacoes",
    nome: "Informações"
  },

  {
    id: "revisao",
    nome: "Revisão"
  }

];


function formatarChave(
  chave
) {
  const nomes = {

    vida:
      "Vida",

    gp:
      "GP",

    tp:
      "TP",

    ritmoIndividual:
      "Ritmo Individual",

    ritmoEquipe:
      "Ritmo da Equipe"

  };


  if (
    nomes[chave]
  ) {
    return nomes[chave];
  }


  return String(
    chave ||
    ""
  )
    .replace(
      /([A-Z])/g,
      " $1"
    )
    .replace(
      /^./,
      letra =>
        letra.toUpperCase()
    );
}


function formatarAtributo(
  chave
) {
  const nomes = {

    forca:
      "Força",

    destreza:
      "Destreza",

    constituicao:
      "Constituição",

    agilidade:
      "Agilidade",

    resistencia:
      "Resistência",

    visao:
      "Visão",

    percepcao:
      "Percepção",

    inteligencia:
      "Inteligência",

    sabedoria:
      "Sabedoria",

    sorte:
      "Sorte",

    carisma:
      "Carisma"

  };


  return (
    nomes[chave] ||
    formatarChave(
      chave
    )
  );
}


function obterTodasOpcoesColecao(
  colecao
) {
  if (
    Array.isArray(
      colecao?.opcoes
    )
  ) {
    return colecao.opcoes;
  }


  if (
    colecao?.opcoesPorGrupo &&
    typeof colecao.opcoesPorGrupo ===
    "object"
  ) {
    return Object.values(
      colecao.opcoesPorGrupo
    ).flat();
  }


  return [];
}


function obterIdItemColecao(
  valor
) {
  if (
    typeof valor ===
    "string"
  ) {
    return valor;
  }


  if (
    valor &&
    typeof valor ===
    "object"
  ) {
    return (
      valor.id ||
      valor.itemId ||
      null
    );
  }


  return null;
}


function CriadorEntidade({
  modo = "criar",

  novaFicha,

  tipoEntidade,
  tiposPermitidos = [],
  podeAlterarTipo = true,

  nomeProprietario =
    "Não identificado",

  configuracao = null,

  alterarCampo,
  alterarAtributo,
  definirAtributo,
  alterarRecurso,

  onAlterarTipo,

  inputFotoRef,
  selecionarAvatar,
  abrirSeletorDeFoto,
  removerAvatar,
  usarImagemPorUrl,

  onCriar,
  onSalvar,
  onVoltar
}) {
  const [
    etapa,
    setEtapa
  ] = useState(
    "informacoes"
  );


  const [
    urlImagem,
    setUrlImagem
  ] = useState(
    ""
  );


  const [
    gruposSelecionados,
    setGruposSelecionados
  ] = useState(
    {}
  );


  const [
    colecoesAbertas,
    setColecoesAbertas
  ] = useState(
    {}
  );


  const editando =
    modo === "editar";


  const configuracaoTipo =
    CONFIGURACOES_TIPO[
      tipoEntidade
    ] ||
    CONFIGURACOES_TIPO[
      TIPOS_ENTIDADE.PERSONAGEM
    ];


  const colecoesProgressao =
    configuracao
      ?.progressao
      ?.colecoes ||
    [];


  const colecoesProgressaoCriacao =
    colecoesProgressao.filter(
      colecao =>
        colecao
          ?.criacaoInicial
          ?.habilitado !==
        false
    );


  const temCaracteristicas =
    colecoesProgressaoCriacao.length >
    0;


  const etapasBase =
    editando
      ? ETAPAS_EDICAO
      : ETAPAS_CRIACAO_BASE.filter(
          item =>
            item.id !==
              "caracteristicas" ||
            temCaracteristicas
        );


  const etapas =
    etapasBase.map(
      (
        item,
        indice
      ) => ({
        ...item,
        numero:
          indice + 1
      })
    );


  const indiceEtapa =
    etapas.findIndex(
      item =>
        item.id ===
        etapa
    );


  const numeroEtapaAtual =
    Math.max(
      1,
      indiceEtapa + 1
    );


  const atributos =
    Object.entries(
      novaFicha
        ?.atributos ||
      {}
    );


  const chavesRecursosCriador =
    new Set(
      (
        configuracao
          ?.recursos ||
        []
      )
        .filter(
          recurso =>
            recurso
              ?.exibirNoCriador ===
            true
        )
        .map(
          recurso =>
            recurso.chave
        )
    );


  const recursos =
    Object.entries(
      novaFicha
        ?.recursos ||
      {}
    ).filter(
      ([chave]) =>
        chavesRecursosCriador.has(
          chave
        )
    );


  /* ========================================
     ESTRUTURA FUNCIONAL GENÉRICA
  ======================================== */

  const estruturaFuncional =
    configuracao
      ?.estruturaFuncional
      ?.ativo ===
    false
      ? null
      : configuracao
          ?.estruturaFuncional ||
        null;


  const campoFuncaoPrincipal =
    estruturaFuncional
      ?.campoPrincipal ||
    "posicao";


  const campoFuncaoSecundaria =
    estruturaFuncional
      ?.campoSecundario ||
    "especializacaoFuncao";


  const rotuloFuncaoPrincipal =
    estruturaFuncional
      ?.rotuloPrincipal ||
    "Função";


  const rotuloFuncaoSecundaria =
    estruturaFuncional
      ?.rotuloSecundario ||
    "Especialização";


  const opcoesFuncaoPrincipal =
    Array.isArray(
      estruturaFuncional
        ?.opcoes
    )
      ? estruturaFuncional.opcoes
      : [];


  const valorFuncaoPrincipalBruto =
    novaFicha
      ?.informacoes
      ?.[campoFuncaoPrincipal] ??
    novaFicha
      ?.[campoFuncaoPrincipal] ??
    novaFicha?.posicao ??
    estruturaFuncional
      ?.valorInicial ??
    "";


  const definicaoFuncaoDireta =
    opcoesFuncaoPrincipal.find(
      opcao =>
        opcao.valor ===
          valorFuncaoPrincipalBruto ||
        opcao.id ===
          valorFuncaoPrincipalBruto
    ) ||
    null;


  const definicaoFuncaoPorEspecializacao =
    definicaoFuncaoDireta
      ? null
      : opcoesFuncaoPrincipal.find(
          opcao =>
            Array.isArray(
              opcao.especializacoes
            ) &&
            opcao.especializacoes.includes(
              valorFuncaoPrincipalBruto
            )
        ) ||
        null;


  const funcaoPrincipalAtual =
    definicaoFuncaoDireta
      ?.valor ||
    definicaoFuncaoPorEspecializacao
      ?.valor ||
    valorFuncaoPrincipalBruto ||
    "";


  const especializacaoSalva =
    novaFicha
      ?.informacoes
      ?.[campoFuncaoSecundaria] ??
    novaFicha
      ?.[campoFuncaoSecundaria] ??
    "";


  const especializacaoFuncaoAtual =
    especializacaoSalva ||
    (
      definicaoFuncaoPorEspecializacao
        ? valorFuncaoPrincipalBruto
        : ""
    );


  const definicaoFuncaoAtual =
    opcoesFuncaoPrincipal.find(
      opcao =>
        opcao.valor ===
          funcaoPrincipalAtual ||
        opcao.id ===
          funcaoPrincipalAtual
    ) ||
    null;


  const especializacoesDisponiveis =
    Array.isArray(
      definicaoFuncaoAtual
        ?.especializacoes
    )
      ? definicaoFuncaoAtual
          .especializacoes
      : [];


  const funcaoPrincipalEhConhecida =
    Boolean(
      definicaoFuncaoAtual
    );


  const especializacaoEhConhecida =
    especializacoesDisponiveis.includes(
      especializacaoFuncaoAtual
    );


  const posicoesLegadas =
    Array.isArray(
      configuracao?.posicoes
    )
      ? configuracao.posicoes
      : [];


  function alterarFuncaoPrincipal(
    valor
  ) {
    const novaDefinicao =
      opcoesFuncaoPrincipal.find(
        opcao =>
          opcao.valor ===
            valor ||
          opcao.id ===
            valor
      ) ||
      null;


    const novasEspecializacoes =
      Array.isArray(
        novaDefinicao
          ?.especializacoes
      )
        ? novaDefinicao
            .especializacoes
        : [];


    const especializacaoMantida =
      novasEspecializacoes.includes(
        especializacaoFuncaoAtual
      )
        ? especializacaoFuncaoAtual
        : "";


    alterarCampo?.(
      "informacoes",
      {
        ...(
          novaFicha
            ?.informacoes ||
          {}
        ),

        [campoFuncaoPrincipal]:
          valor,

        [campoFuncaoSecundaria]:
          especializacaoMantida
      }
    );


    alterarCampo?.(
      campoFuncaoPrincipal,
      valor
    );
  }


  function alterarEspecializacaoFuncao(
    valor
  ) {
    alterarCampo?.(
      "informacoes",
      {
        ...(
          novaFicha
            ?.informacoes ||
          {}
        ),

        [campoFuncaoPrincipal]:
          funcaoPrincipalAtual,

        [campoFuncaoSecundaria]:
          valor
      }
    );
  }


  function resumoFuncaoAtual() {
    if (
      !funcaoPrincipalAtual
    ) {
      return "Sem função definida";
    }


    if (
      especializacaoFuncaoAtual
    ) {
      return `${funcaoPrincipalAtual} · ${especializacaoFuncaoAtual}`;
    }


    return funcaoPrincipalAtual;
  }


  function obterCampoColecao(
    colecao
  ) {
    return (
      colecao
        ?.armazenamento
        ?.campo ||
      null
    );
  }


  function obterFormatoColecao(
    colecao
  ) {
    return (
      colecao
        ?.armazenamento
        ?.formato ||
      "unico"
    );
  }


  function obterValorColecao(
    colecao
  ) {
    const campo =
      obterCampoColecao(
        colecao
      );


    if (!campo) {
      return null;
    }


    const valor =
      novaFicha?.[campo];


    if (
      obterFormatoColecao(
        colecao
      ) === "lista"
    ) {
      return Array.isArray(
        valor
      )
        ? valor
        : [];
    }


    return valor ?? null;
  }


  function obterIdsSelecionadosColecao(
    colecao
  ) {
    const valor =
      obterValorColecao(
        colecao
      );


    if (
      obterFormatoColecao(
        colecao
      ) === "lista"
    ) {
      return valor
        .map(
          obterIdItemColecao
        )
        .filter(Boolean);
    }


    const id =
      obterIdItemColecao(
        valor
      ) ||
      (
        typeof valor ===
        "string"
          ? valor
          : null
      );


    return id
      ? [id]
      : [];
  }


  function obterQuantidadeSelecionada(
    colecao
  ) {
    return obterIdsSelecionadosColecao(
      colecao
    ).length;
  }


  function opcaoEstaSelecionada(
    colecao,
    opcaoId
  ) {
    return obterIdsSelecionadosColecao(
      colecao
    ).includes(
      opcaoId
    );
  }


  function obterMinimoColecao(
    colecao
  ) {
    const configuracaoCriacao =
      colecao
        ?.criacaoInicial ||
      {};


    const minimoEspecifico =
      configuracaoCriacao
        ?.minimoPorTipo
        ?.[tipoEntidade];


    const valor =
      minimoEspecifico ??
      configuracaoCriacao.minimo ??
      0;


    return Math.max(
      0,
      Number(
        valor
      ) ||
      0
    );
  }


  function obterMaximoColecao(
    colecao
  ) {
    const configuracaoCriacao =
      colecao
        ?.criacaoInicial ||
      {};


    const maximoEspecifico =
      configuracaoCriacao
        ?.maximoPorTipo
        ?.[tipoEntidade];


    const valor =
      maximoEspecifico ??
      configuracaoCriacao.maximo;


    if (
      valor === undefined ||
      valor === null ||
      valor === ""
    ) {
      return null;
    }


    return Math.max(
      0,
      Number(
        valor
      ) ||
      0
    );
  }


  function fecharSelecaoColecao(
    colecao
  ) {
    if (
      !colecao?.id
    ) {
      return;
    }


    setColecoesAbertas(
      anterior => ({
        ...anterior,

        [colecao.id]:
          false
      })
    );
  }


  function criarValorInicialItemColecao(
    colecao,
    opcao
  ) {
    const armazenamento =
      colecao
        ?.armazenamento ||
      {};


    if (
      armazenamento.item !==
      "objeto"
    ) {
      return opcao.id;
    }


    const valoresIniciais =
      armazenamento
        ?.valoresIniciais &&
      typeof armazenamento.valoresIniciais ===
        "object"
        ? armazenamento.valoresIniciais
        : {};


    const item = {
      ...valoresIniciais,

      id:
        opcao.id
    };


    if (
      armazenamento.registrarAquisicao ===
      true
    ) {
      item.adquiridoEmNivel =
        Math.max(
          1,
          Number(
            novaFicha?.nivel
          ) ||
          1
        );


      item.adquiridoEm =
        Date.now();
    }


    return item;
  }


  function alterarEscolhaColecao(
    colecao,
    opcao
  ) {
    if (
      !colecao ||
      !opcao
    ) {
      return;
    }


    const campo =
      obterCampoColecao(
        colecao
      );


    if (!campo) {
      return;
    }


    const formato =
      obterFormatoColecao(
        colecao
      );


    const maximo =
      obterMaximoColecao(
        colecao
      );


    if (
      formato === "lista"
    ) {
      const atuais =
        obterValorColecao(
          colecao
        );


      const selecionada =
        opcaoEstaSelecionada(
          colecao,
          opcao.id
        );


      if (selecionada) {
        alterarCampo?.(
          campo,
          atuais.filter(
            item =>
              obterIdItemColecao(
                item
              ) !==
              opcao.id
          )
        );

        return;
      }


      const novoItem =
        criarValorInicialItemColecao(
          colecao,
          opcao
        );


      if (
        maximo === 1
      ) {
        alterarCampo?.(
          campo,
          [
            novoItem
          ]
        );


        fecharSelecaoColecao(
          colecao
        );

        return;
      }


      if (
        maximo !== null &&
        atuais.length >=
          maximo
      ) {
        return;
      }


      alterarCampo?.(
        campo,
        [
          ...atuais,
          novoItem
        ]
      );

      return;
    }


    const atual =
      obterValorColecao(
        colecao
      );


    const idAtual =
      obterIdItemColecao(
        atual
      ) ||
      (
        typeof atual ===
        "string"
          ? atual
          : null
      );


    const selecionada =
      idAtual ===
      opcao.id;


    alterarCampo?.(
      campo,
      selecionada
        ? null
        : opcao.id
    );


    if (
      !selecionada &&
      maximo === 1
    ) {
      fecharSelecaoColecao(
        colecao
      );
    }
  }


  function removerEscolhaColecao(
    colecao,
    opcaoId
  ) {
    const campo =
      obterCampoColecao(
        colecao
      );


    if (!campo) {
      return;
    }


    if (
      obterFormatoColecao(
        colecao
      ) === "lista"
    ) {
      const atuais =
        obterValorColecao(
          colecao
        );


      alterarCampo?.(
        campo,
        atuais.filter(
          item =>
            obterIdItemColecao(
              item
            ) !==
            opcaoId
        )
      );

      return;
    }


    const atual =
      obterValorColecao(
        colecao
      );


    const idAtual =
      obterIdItemColecao(
        atual
      ) ||
      (
        typeof atual ===
        "string"
          ? atual
          : null
      );


    if (
      idAtual ===
      opcaoId
    ) {
      alterarCampo?.(
        campo,
        null
      );
    }
  }


  function colecaoEhObrigatoria(
    colecao
  ) {
    return obterMinimoColecao(
      colecao
    ) > 0;
  }


  function colecaoEstaPreenchida(
    colecao
  ) {
    return (
      obterQuantidadeSelecionada(
        colecao
      ) >=
      obterMinimoColecao(
        colecao
      )
    );
  }


  function obterRegraColecao(
    colecao
  ) {
    const minimo =
      obterMinimoColecao(
        colecao
      );


    const maximo =
      obterMaximoColecao(
        colecao
      );


    if (
      minimo === 0 &&
      maximo === null
    ) {
      return "OPCIONAL";
    }


    if (
      minimo === 0 &&
      maximo !== null
    ) {
      return `ATÉ ${maximo}`;
    }


    if (
      minimo === 1 &&
      maximo === 1
    ) {
      return "1 OBRIGATÓRIO";
    }


    if (
      maximo === null
    ) {
      return `MÍNIMO ${minimo}`;
    }


    if (
      minimo === maximo
    ) {
      return `${minimo} OBRIGATÓRIOS`;
    }


    return `${minimo}–${maximo}`;
  }


  function validarCriacao() {
    const nome =
      String(
        novaFicha?.nome ||
        ""
      ).trim();


    if (!nome) {
      alert(
        "Digite um nome antes de continuar."
      );

      setEtapa(
        "informacoes"
      );

      return false;
    }


    if (!editando) {
      const faltando =
        colecoesProgressaoCriacao.find(
          colecao =>
            colecaoEhObrigatoria(
              colecao
            ) &&
            !colecaoEstaPreenchida(
              colecao
            )
        );


      if (faltando) {
        alert(
          `Defina ${faltando.singular || faltando.nome} antes de criar o personagem.`
        );

        setEtapa(
          "caracteristicas"
        );

        return false;
      }
    }


    return true;
  }


  function irAnterior() {
    if (
      indiceEtapa <=
      0
    ) {
      onVoltar?.();
      return;
    }


    setEtapa(
      etapas[
        indiceEtapa - 1
      ].id
    );
  }


  function executarAcaoFinal() {
    if (
      !validarCriacao()
    ) {
      return;
    }


    if (editando) {
      onSalvar?.();
      return;
    }


    onCriar?.();
  }


  function irProxima() {
    if (
      etapa ===
      "informacoes"
    ) {
      const nome =
        String(
          novaFicha?.nome ||
          ""
        ).trim();


      if (!nome) {
        alert(
          "Digite um nome antes de continuar."
        );

        return;
      }
    }


    if (
      etapa ===
      "caracteristicas"
    ) {
      const faltando =
        colecoesProgressaoCriacao.find(
          colecao =>
            colecaoEhObrigatoria(
              colecao
            ) &&
            !colecaoEstaPreenchida(
              colecao
            )
        );


      if (faltando) {
        alert(
          `Defina ${faltando.singular || faltando.nome} antes de continuar.`
        );

        return;
      }
    }


    if (
      indiceEtapa >=
      etapas.length - 1
    ) {
      executarAcaoFinal();
      return;
    }


    setEtapa(
      etapas[
        indiceEtapa + 1
      ].id
    );
  }


  function usarUrl() {
    const url =
      urlImagem.trim();


    if (!url) {
      return;
    }


    usarImagemPorUrl?.(
      url
    );
  }


  function obterAfinidadeColecao(
    colecao
  ) {
    const mapaAfinidade =
      colecao
        ?.afinidadePorFuncaoPrincipal ||
      colecao
        ?.afinidadePorPosicao ||
      null;


    return (
      mapaAfinidade
        ?.[funcaoPrincipalAtual] ||
      null
    );
  }


  function obterGrupoAtivo(
    colecao
  ) {
    if (
      Object.prototype
        .hasOwnProperty
        .call(
          gruposSelecionados,
          colecao.id
        )
    ) {
      return gruposSelecionados[
        colecao.id
      ];
    }


    const afinidade =
      obterAfinidadeColecao(
        colecao
      );


    if (afinidade) {
      return afinidade;
    }


    return (
      colecao
        ?.grupos
        ?.[0]
        ?.id ||
      null
    );
  }


  function obterOpcoesVisiveis(
    colecao
  ) {
    if (
      Array.isArray(
        colecao?.opcoes
      )
    ) {
      return colecao.opcoes;
    }


    if (
      colecao?.opcoesPorGrupo
    ) {
      const grupo =
        obterGrupoAtivo(
          colecao
        );


      if (
        grupo === "todos"
      ) {
        return obterTodasOpcoesColecao(
          colecao
        );
      }


      return (
        colecao
          .opcoesPorGrupo[
            grupo
          ] ||
        []
      );
    }


    return [];
  }


  function obterNomeOpcao(
    colecao,
    id
  ) {
    return (
      obterTodasOpcoesColecao(
        colecao
      ).find(
        opcao =>
          opcao.id ===
          id
      )
      ?.nome ||
      id
    );
  }


  function obterOpcoesSelecionadas(
    colecao
  ) {
    const todas =
      obterTodasOpcoesColecao(
        colecao
      );


    return obterIdsSelecionadosColecao(
      colecao
    ).map(
      id =>
        todas.find(
          opcao =>
            opcao.id ===
            id
        ) || {
          id,
          nome:
            id,
          icone:
            "✦"
        }
    );
  }


  function resumoEscolhaColecao(
    colecao
  ) {
    const ids =
      obterIdsSelecionadosColecao(
        colecao
      );


    if (
      ids.length ===
      0
    ) {
      return "Nenhum";
    }


    return ids
      .map(
        id =>
          obterNomeOpcao(
            colecao,
            id
          )
      )
      .join(", ");
  }


  function colecaoEstaAberta(
    colecao
  ) {
    return Boolean(
      colecoesAbertas[
        colecao.id
      ]
    );
  }


  function alternarColecaoAberta(
    colecao
  ) {
    setColecoesAbertas(
      anterior => ({
        ...anterior,

        [colecao.id]:
          !anterior[
            colecao.id
          ]
      })
    );
  }


  function textoBotaoColecao(
    colecao
  ) {
    if (
      colecaoEstaAberta(
        colecao
      )
    ) {
      return "FECHAR SELEÇÃO";
    }


    const quantidade =
      obterQuantidadeSelecionada(
        colecao
      );


    const singular =
      String(
        colecao.singular ||
        colecao.nome ||
        "ITEM"
      ).toUpperCase();


    if (
      quantidade === 0
    ) {
      return `＋ ADICIONAR ${singular}`;
    }


    if (
      obterFormatoColecao(
        colecao
      ) === "unico"
    ) {
      return `↔ TROCAR ${singular}`;
    }


    return "⚙ GERENCIAR ESCOLHAS";
  }


  return (
    <div className="criador-entidade">

      <header className="criador-entidade-topo">

        <button
          type="button"
          className="criador-entidade-voltar"
          onClick={
            irAnterior
          }
        >
          ←
        </button>


        <div className="criador-entidade-identidade">

          <div className="criador-entidade-icone">
            {configuracaoTipo.icone}
          </div>


          <div>

            <p className="criador-entidade-etiqueta">

              {editando
                ? "EDITAR ENTIDADE"
                : "RPG MANAGER"}

            </p>


            <h1>

              {editando
                ? `Editar ${configuracaoTipo.nome}`
                : `Criar ${configuracaoTipo.nome}`}

            </h1>


            <p>

              {editando
                ? "Altere somente a identidade e os dados básicos. Atributos, recursos e progressão possuem módulos próprios na ficha."
                : "Defina o estado inicial da entidade. Depois da criação, cada parte passa a ser administrada pelo seu módulo correspondente."}

            </p>

          </div>

        </div>

      </header>


      <main className="criador-entidade-conteudo">

        <nav
          className={
            etapas.length === 5
              ? "criador-entidade-etapas criador-entidade-etapas-cinco"
              : "criador-entidade-etapas"
          }
        >

          {etapas.map(
            item => {

              const ativo =
                item.id ===
                etapa;


              const indiceItem =
                etapas.findIndex(
                  etapaItem =>
                    etapaItem.id ===
                    item.id
                );


              const concluido =
                indiceItem <
                indiceEtapa;


              return (
                <button
                  key={
                    item.id
                  }
                  type="button"
                  className={[
                    "criador-entidade-etapa",

                    ativo
                      ? "criador-entidade-etapa-ativa"
                      : "",

                    concluido
                      ? "criador-entidade-etapa-concluida"
                      : ""
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() =>
                    setEtapa(
                      item.id
                    )
                  }
                >

                  <span>

                    {concluido
                      ? "✓"
                      : item.numero}

                  </span>

                  {item.nome}

                </button>
              );
            }
          )}

        </nav>


        {etapa ===
          "informacoes" && (

          <section className="criador-entidade-painel">

            <div className="criador-entidade-secao-topo">

              <div>

                <p className="criador-entidade-etiqueta">
                  ETAPA {numeroEtapaAtual}
                </p>

                <h2>
                  Informações base
                </h2>

                <p>
                  O nome é a identificação mínima exigida
                  pelo RPG Manager. Os demais campos definem
                  o estado inicial e podem permanecer com os
                  padrões da campanha quando não houver nada
                  especial para alterar.
                </p>

              </div>

            </div>


            <div className="criador-entidade-principal">

              <div className="criador-entidade-imagem-area">

                <div className="criador-entidade-avatar">

                  {novaFicha?.imagem ? (

                    <img
                      src={
                        novaFicha.imagem
                      }
                      alt="Prévia da entidade"
                    />

                  ) : (

                    <span>
                      {configuracaoTipo.icone}
                    </span>

                  )}

                </div>


                <input
                  ref={
                    inputFotoRef
                  }
                  type="file"
                  accept="image/*"
                  onChange={
                    selecionarAvatar
                  }
                  hidden
                />


                <button
                  type="button"
                  className="criador-entidade-botao-secundario"
                  onClick={
                    abrirSeletorDeFoto
                  }
                >
                  🖼 ESCOLHER IMAGEM
                </button>


                {novaFicha?.imagem && (

                  <button
                    type="button"
                    className="criador-entidade-botao-texto"
                    onClick={
                      removerAvatar
                    }
                  >
                    REMOVER IMAGEM
                  </button>

                )}


                <div className="criador-entidade-url">

                  <input
                    type="text"
                    value={
                      urlImagem
                    }
                    onChange={
                      evento =>
                        setUrlImagem(
                          evento
                            .target
                            .value
                        )
                    }
                    placeholder="Ou cole uma URL de imagem..."
                  />

                  <button
                    type="button"
                    onClick={
                      usarUrl
                    }
                  >
                    USAR
                  </button>

                </div>

              </div>


              <div className="criador-entidade-formulario">

                <label className="criador-entidade-campo criador-entidade-campo-grande">

                  <span>
                    NOME · OBRIGATÓRIO
                  </span>

                  <input
                    type="text"
                    value={
                      novaFicha?.nome ||
                      ""
                    }
                    onChange={
                      evento =>
                        alterarCampo?.(
                          "nome",
                          evento
                            .target
                            .value
                        )
                    }
                    placeholder="Nome da entidade"
                    autoFocus
                  />

                </label>


                <label className="criador-entidade-campo">

                  <span>
                    CLASSIFICAÇÃO
                  </span>

                  <select
                    value={
                      tipoEntidade
                    }
                    disabled={
                      !podeAlterarTipo
                    }
                    onChange={
                      evento =>
                        onAlterarTipo?.(
                          evento
                            .target
                            .value
                        )
                    }
                  >

                    {tiposPermitidos.map(
                      tipo => {

                        const config =
                          CONFIGURACOES_TIPO[
                            tipo
                          ];


                        if (!config) {
                          return null;
                        }


                        return (
                          <option
                            key={
                              tipo
                            }
                            value={
                              tipo
                            }
                          >
                            {config.icone}{" "}
                            {config.nome}
                          </option>
                        );
                      }
                    )}

                  </select>

                </label>


                <label className="criador-entidade-campo">

                  <span>
                    VISIBILIDADE
                  </span>

                  <select
                    value={
                      novaFicha
                        ?.visibilidade ||
                      VISIBILIDADES_ENTIDADE.CAMPANHA
                    }
                    onChange={
                      evento =>
                        alterarCampo?.(
                          "visibilidade",
                          evento
                            .target
                            .value
                        )
                    }
                  >

                    <option
                      value={
                        VISIBILIDADES_ENTIDADE.CAMPANHA
                      }
                    >
                      🌐 Toda a campanha
                    </option>


                    <option
                      value={
                        VISIBILIDADES_ENTIDADE.MESTRE
                      }
                    >
                      👑 Mestre + proprietário
                    </option>


                    <option
                      value={
                        VISIBILIDADES_ENTIDADE.PROPRIETARIO
                      }
                    >
                      🔒 Somente proprietário
                    </option>


                    {novaFicha
                      ?.visibilidade ===
                      VISIBILIDADES_ENTIDADE.RESTRITA && (

                      <option
                        value={
                          VISIBILIDADES_ENTIDADE.RESTRITA
                        }
                      >
                        👥 Restrita
                      </option>

                    )}

                  </select>

                </label>


                <label className="criador-entidade-campo criador-entidade-campo-grande">

                  <span>
                    PROPRIETÁRIO
                  </span>

                  <input
                    value={
                      nomeProprietario
                    }
                    readOnly
                  />

                </label>


                {estruturaFuncional ? (

                  <>

                    <label className="criador-entidade-campo">

                      <span>
                        {String(
                          rotuloFuncaoPrincipal
                        ).toUpperCase()}
                      </span>


                      <select
                        value={
                          funcaoPrincipalAtual
                        }
                        onChange={
                          evento =>
                            alterarFuncaoPrincipal(
                              evento
                                .target
                                .value
                            )
                        }
                      >

                        <option value="">
                          Não definido
                        </option>


                        {!funcaoPrincipalEhConhecida &&
                        funcaoPrincipalAtual && (

                          <option
                            value={
                              funcaoPrincipalAtual
                            }
                          >
                            {funcaoPrincipalAtual}
                          </option>

                        )}


                        {opcoesFuncaoPrincipal.map(
                          opcao => (

                            <option
                              key={
                                opcao.id ||
                                opcao.valor
                              }
                              value={
                                opcao.valor
                              }
                            >
                              {opcao.nome ||
                                opcao.valor}
                            </option>

                          )
                        )}

                      </select>

                    </label>


                    {(especializacoesDisponiveis.length >
                      0 ||
                      especializacaoFuncaoAtual) && (

                      <label className="criador-entidade-campo">

                        <span>
                          {String(
                            rotuloFuncaoSecundaria
                          ).toUpperCase()}
                        </span>


                        <select
                          value={
                            especializacaoFuncaoAtual
                          }
                          onChange={
                            evento =>
                              alterarEspecializacaoFuncao(
                                evento
                                  .target
                                  .value
                              )
                          }
                        >

                          <option value="">
                            Sem especialização
                          </option>


                          {!especializacaoEhConhecida &&
                          especializacaoFuncaoAtual && (

                            <option
                              value={
                                especializacaoFuncaoAtual
                              }
                            >
                              {especializacaoFuncaoAtual}
                            </option>

                          )}


                          {especializacoesDisponiveis.map(
                            especializacao => (

                              <option
                                key={
                                  especializacao
                                }
                                value={
                                  especializacao
                                }
                              >
                                {especializacao}
                              </option>

                            )
                          )}

                        </select>

                      </label>

                    )}

                  </>

                ) : (

                  <label className="criador-entidade-campo">

                    <span>
                      FUNÇÃO / POSIÇÃO
                    </span>


                    {posicoesLegadas.length >
                    0 ? (

                      <select
                        value={
                          novaFicha?.posicao ||
                          ""
                        }
                        onChange={
                          evento =>
                            alterarCampo?.(
                              "posicao",
                              evento
                                .target
                                .value
                            )
                        }
                      >

                        {posicoesLegadas.map(
                          posicao => (

                            <option
                              key={
                                posicao
                              }
                              value={
                                posicao
                              }
                            >
                              {posicao}
                            </option>

                          )
                        )}

                      </select>

                    ) : (

                      <input
                        type="text"
                        value={
                          novaFicha?.posicao ||
                          ""
                        }
                        onChange={
                          evento =>
                            alterarCampo?.(
                              "posicao",
                              evento
                                .target
                                .value
                            )
                        }
                        placeholder="Opcional"
                      />

                    )}

                  </label>

                )}


                <label className="criador-entidade-campo">

                  <span>
                    RAÇA / ESPÉCIE
                  </span>

                  <input
                    type="text"
                    value={
                      novaFicha?.raca ||
                      ""
                    }
                    onChange={
                      evento =>
                        alterarCampo?.(
                          "raca",
                          evento
                            .target
                            .value
                        )
                    }
                    placeholder="Ex.: Humano"
                  />

                </label>


                <label className="criador-entidade-campo">

                  <span>
                    IDADE
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={
                      novaFicha?.idade ??
                      0
                    }
                    onChange={
                      evento =>
                        alterarCampo?.(
                          "idade",
                          evento
                            .target
                            .value
                        )
                    }
                  />

                </label>


                <label className="criador-entidade-campo">

                  <span>
                    ALTURA
                  </span>

                  <input
                    type="text"
                    value={
                      novaFicha?.altura ||
                      ""
                    }
                    onChange={
                      evento =>
                        alterarCampo?.(
                          "altura",
                          evento
                            .target
                            .value
                        )
                    }
                    placeholder="Opcional"
                  />

                </label>


                <label className="criador-entidade-campo">

                  <span>
                    LADO / PÉ DOMINANTE
                  </span>

                  <input
                    type="text"
                    value={
                      novaFicha
                        ?.peDominante ||
                      ""
                    }
                    onChange={
                      evento =>
                        alterarCampo?.(
                          "peDominante",
                          evento
                            .target
                            .value
                        )
                    }
                    placeholder="Ex.: Direito"
                  />

                </label>


                <label className="criador-entidade-campo">

                  <span>
                    NÍVEL
                  </span>

                  <input
                    type="number"
                    min="1"
                    value={
                      novaFicha?.nivel ??
                      1
                    }
                    onChange={
                      evento =>
                        alterarCampo?.(
                          "nivel",
                          evento
                            .target
                            .value
                        )
                    }
                  />

                </label>


                <label className="criador-entidade-campo">

                  <span>
                    EXPERIÊNCIA
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={
                      novaFicha
                        ?.experiencia ??
                      0
                    }
                    onChange={
                      evento =>
                        alterarCampo?.(
                          "experiencia",
                          evento
                            .target
                            .value
                        )
                    }
                  />

                </label>


                <label className="criador-entidade-campo">

                  <span>
                    EXP. MÁXIMA
                  </span>

                  <input
                    type="number"
                    min="1"
                    value={
                      novaFicha
                        ?.experienciaMax ??
                      100
                    }
                    onChange={
                      evento =>
                        alterarCampo?.(
                          "experienciaMax",
                          evento
                            .target
                            .value
                        )
                    }
                  />

                </label>

              </div>

            </div>

          </section>

        )}


        {etapa ===
          "atributos" && (

          <section className="criador-entidade-painel">

            <div className="criador-entidade-secao-topo">

              <div>

                <p className="criador-entidade-etiqueta">
                  ETAPA {numeroEtapaAtual}
                </p>

                <h2>
                  Atributos iniciais
                </h2>

                <p>
                  Os valores já começam com o padrão da
                  campanha. Altere apenas quando esta entidade
                  realmente começar diferente desse padrão.
                  Resistência permanece como atributo e não
                  como recurso consumível.
                </p>

              </div>

            </div>


            <div className="criador-entidade-atributos">

              {atributos.map(
                ([
                  nome,
                  valor
                ]) => (

                  <article
                    key={
                      nome
                    }
                    className="criador-entidade-atributo"
                  >

                    <strong>
                      {formatarAtributo(
                        nome
                      )}
                    </strong>


                    <div>

                      <button
                        type="button"
                        onClick={() =>
                          alterarAtributo?.(
                            nome,
                            -1
                          )
                        }
                      >
                        −
                      </button>


                      <input
                        type="number"
                        min="0"
                        value={
                          valor
                        }
                        onChange={
                          evento =>
                            definirAtributo?.(
                              nome,
                              evento
                                .target
                                .value
                            )
                        }
                      />


                      <button
                        type="button"
                        onClick={() =>
                          alterarAtributo?.(
                            nome,
                            1
                          )
                        }
                      >
                        +
                      </button>

                    </div>

                  </article>

                )
              )}

            </div>

          </section>

        )}


        {etapa ===
          "recursos" && (

          <section className="criador-entidade-painel">

            <div className="criador-entidade-secao-topo">

              <div>

                <p className="criador-entidade-etiqueta">
                  ETAPA {numeroEtapaAtual}
                </p>

                <h2>
                  Recursos iniciais
                </h2>

                <p>
                  Vida, GP e TP já recebem os valores
                  padrão da campanha. Esta etapa existe
                  para representar exceções no estado
                  inicial, não para obrigar uma configuração
                  manual em toda nova ficha.
                </p>

              </div>

            </div>


            <div className="criador-entidade-recursos">

              {recursos.map(
                ([
                  chave,
                  recurso
                ]) => (

                  <article
                    key={
                      chave
                    }
                    className="criador-entidade-recurso"
                  >

                    <div>

                      <span>
                        RECURSO
                      </span>

                      <h3>
                        {formatarChave(
                          chave
                        )}
                      </h3>

                    </div>


                    <label>

                      <span>
                        ATUAL
                      </span>

                      <input
                        type="number"
                        min="0"
                        value={
                          recurso?.atual ??
                          0
                        }
                        onChange={
                          evento =>
                            alterarRecurso?.(
                              chave,
                              "atual",
                              evento
                                .target
                                .value
                            )
                        }
                      />

                    </label>


                    <label>

                      <span>
                        MÁXIMO
                      </span>

                      <input
                        type="number"
                        min="0"
                        value={
                          recurso?.maximo ??
                          0
                        }
                        onChange={
                          evento =>
                            alterarRecurso?.(
                              chave,
                              "maximo",
                              evento
                                .target
                                .value
                            )
                        }
                      />

                    </label>

                  </article>

                )
              )}

            </div>


            <div className="criador-entidade-fluxo-automatico">

              <span>
                ♫
              </span>

              <div>

                <strong>
                  Fluxo inicial automático
                </strong>

                <p>
                  Ritmo Individual, Ritmo da Equipe,
                  Momentum e Condições começam com os
                  valores definidos pela campanha. Depois,
                  ficam sob controle dos módulos próprios
                  da ficha.
                </p>

              </div>

            </div>

          </section>

        )}


        {etapa ===
          "caracteristicas" && (

          <section className="criador-entidade-painel">

            <div className="criador-entidade-secao-topo">

              <div>

                <p className="criador-entidade-etiqueta">
                  ETAPA {numeroEtapaAtual}
                </p>

                <h2>
                  Características iniciais
                </h2>

                <p>
                  Esta etapa registra apenas aquilo que a
                  entidade já possui quando é criada.
                  Coleções opcionais podem começar vazias.
                  Depois da criação, novas aquisições e
                  evoluções pertencem aos módulos próprios
                  da ficha.
                </p>

              </div>

            </div>


            <div className="criador-entidade-caracteristicas">

              {colecoesProgressaoCriacao.map(
                colecao => {

                  const grupoAtivo =
                    obterGrupoAtivo(
                      colecao
                    );


                  const afinidade =
                    obterAfinidadeColecao(
                      colecao
                    );


                  const opcoes =
                    obterOpcoesVisiveis(
                      colecao
                    );


                  const selecionadas =
                    obterOpcoesSelecionadas(
                      colecao
                    );


                  const aberta =
                    colecaoEstaAberta(
                      colecao
                    );


                  const minimo =
                    obterMinimoColecao(
                      colecao
                    );


                  const maximo =
                    obterMaximoColecao(
                      colecao
                    );


                  return (
                    <section
                      key={
                        colecao.id
                      }
                      className="criador-entidade-colecao"
                    >

                      <header className="criador-entidade-colecao-topo">

                        <div>

                          <p className="criador-entidade-etiqueta">

                            {colecao.tipo ===
                            "passiva"
                              ? "PASSIVA"
                              : "CARACTERÍSTICA"}

                          </p>


                          <h3>
                            {colecao.nome}
                          </h3>


                          <p>
                            {colecao.descricao}
                          </p>

                        </div>


                        <div className="criador-entidade-colecao-regra">

                          <span>
                            NA CRIAÇÃO
                          </span>

                          <strong>
                            {obterRegraColecao(
                              colecao
                            )}
                          </strong>

                        </div>

                      </header>


                      <div className="criador-entidade-colecao-estado">

                        <div className="criador-entidade-colecao-estado-topo">

                          <div>

                            <span>
                              ESTADO INICIAL
                            </span>

                            <strong>
                              {selecionadas.length ===
                              0
                                ? "Nenhum adicionado"
                                : (
                                  selecionadas.length ===
                                  1
                                    ? "1 adicionado"
                                    : `${selecionadas.length} adicionados`
                                )}
                            </strong>

                          </div>


                          <small>

                            {minimo >
                            0
                              ? `Mínimo ${minimo}`
                              : "Pode começar vazio"}

                            {maximo !==
                            null
                              ? ` · Máximo ${maximo} na criação`
                              : ""}

                          </small>

                        </div>


                        {selecionadas.length >
                        0 ? (

                          <div className="criador-entidade-escolhas-iniciais">

                            {selecionadas.map(
                              opcao => (

                                <article
                                  key={
                                    opcao.id
                                  }
                                  className="criador-entidade-escolha-inicial"
                                >

                                  <span className="criador-entidade-escolha-inicial-icone">
                                    {opcao.icone ||
                                      "✦"}
                                  </span>


                                  <div className="criador-entidade-escolha-inicial-conteudo">

                                    <div className="criador-entidade-escolha-inicial-cabecalho">

                                      <strong>
                                        {opcao.nome}
                                      </strong>

                                    </div>


                                    {opcao.passiva?.nome && (

                                      <span className="criador-entidade-escolha-inicial-meta">

                                        <b>
                                          {opcao.passiva.nome}
                                        </b>

                                        {" — "}

                                        {opcao.passiva.descricao}

                                      </span>

                                    )}


                                    {!opcao.passiva &&
                                    opcao.descricao && (

                                      <span className="criador-entidade-escolha-inicial-meta">
                                        {opcao.descricao}
                                      </span>

                                    )}

                                  </div>


                                  <button
                                    type="button"
                                    className="criador-entidade-escolha-remover"
                                    onClick={() =>
                                      removerEscolhaColecao(
                                        colecao,
                                        opcao.id
                                      )
                                    }
                                  >
                                    REMOVER
                                  </button>

                                </article>

                              )
                            )}

                          </div>

                        ) : (

                          <p className="criador-entidade-colecao-vazio">

                            {minimo >
                            0
                              ? "Esta campanha exige uma escolha inicial para esta coleção."
                              : "Nenhuma escolha inicial é necessária. Você pode deixar esta coleção vazia e adquirir conteúdo depois."}

                          </p>

                        )}


                        <div className="criador-entidade-colecao-acoes">

                          <button
                            type="button"
                            className="criador-entidade-botao-secundario"
                            onClick={() =>
                              alternarColecaoAberta(
                                colecao
                              )
                            }
                          >
                            {textoBotaoColecao(
                              colecao
                            )}
                          </button>

                        </div>

                      </div>


                      {aberta && (

                        <div className="criador-entidade-seletor-opcoes">

                          <div className="criador-entidade-seletor-topo">

                            <div>

                              <span>
                                SELEÇÃO
                              </span>

                              <strong>
                                Consulte as opções da campanha
                              </strong>

                            </div>


                            <small>
                              Escolher aqui define apenas o estado inicial.
                            </small>

                          </div>


                          {Array.isArray(
                            colecao.grupos
                          ) &&
                          colecao.grupos.length >
                          0 && (

                            <div className="criador-entidade-grupos">

                              <button
                                type="button"
                                className={[
                                  "criador-entidade-filtro",

                                  grupoAtivo ===
                                  "todos"
                                    ? "criador-entidade-filtro-ativo"
                                    : ""
                                ]
                                  .filter(Boolean)
                                  .join(" ")}
                                onClick={() =>
                                  setGruposSelecionados(
                                    anterior => ({
                                      ...anterior,

                                      [colecao.id]:
                                        "todos"
                                    })
                                  )
                                }
                              >
                                TODOS
                              </button>


                              {colecao.grupos.map(
                                grupo => {

                                  const ativo =
                                    grupo.id ===
                                    grupoAtivo;


                                  const recomendado =
                                    grupo.id ===
                                    afinidade;


                                  return (
                                    <button
                                      key={
                                        grupo.id
                                      }
                                      type="button"
                                      className={[
                                        "criador-entidade-filtro",

                                        ativo
                                          ? "criador-entidade-filtro-ativo"
                                          : "",

                                        recomendado
                                          ? "criador-entidade-filtro-recomendado"
                                          : ""
                                      ]
                                        .filter(Boolean)
                                        .join(" ")}
                                      onClick={() =>
                                        setGruposSelecionados(
                                          anterior => ({
                                            ...anterior,

                                            [colecao.id]:
                                              grupo.id
                                          })
                                        )
                                      }
                                    >

                                      {grupo.icone}
                                      {" "}
                                      {grupo.nome}


                                      {recomendado && (
                                        <small>
                                          AFINIDADE
                                        </small>
                                      )}

                                    </button>
                                  );
                                }
                              )}

                            </div>

                          )}


                          <div className="criador-entidade-opcoes">

                            {opcoes.map(
                              opcao => {

                                const selecionada =
                                  opcaoEstaSelecionada(
                                    colecao,
                                    opcao.id
                                  );


                                return (
                                  <button
                                    key={
                                      opcao.id
                                    }
                                    type="button"
                                    className={[
                                      "criador-entidade-opcao",

                                      selecionada
                                        ? "criador-entidade-opcao-selecionada"
                                        : ""
                                    ]
                                      .filter(Boolean)
                                      .join(" ")}
                                    onClick={() =>
                                      alterarEscolhaColecao(
                                        colecao,
                                        opcao
                                      )
                                    }
                                  >

                                    <span className="criador-entidade-opcao-icone">
                                      {opcao.icone ||
                                        "✦"}
                                    </span>


                                    <span className="criador-entidade-opcao-conteudo">

                                      <span className="criador-entidade-opcao-cabecalho">

                                        <strong>
                                          {opcao.nome}
                                        </strong>


                                        {selecionada && (
                                          <small className="criador-entidade-selecionado-selo">
                                            ✓ ADICIONADO
                                          </small>
                                        )}

                                      </span>


                                      {opcao.frase && (

                                        <em>
                                          “{opcao.frase}”
                                        </em>

                                      )}


                                      {opcao.passiva?.nome && (

                                        <span className="criador-entidade-opcao-passiva">

                                          <b>
                                            {opcao.passiva.nome}
                                          </b>

                                          {" — "}

                                          {opcao.passiva.descricao}

                                        </span>

                                      )}


                                      {!opcao.passiva &&
                                      opcao.descricao && (

                                        <span className="criador-entidade-opcao-descricao">
                                          {opcao.descricao}
                                        </span>

                                      )}

                                    </span>

                                  </button>
                                );
                              }
                            )}

                          </div>

                        </div>

                      )}

                    </section>
                  );
                }
              )}

            </div>

          </section>

        )}


        {etapa ===
          "revisao" && (

          <section className="criador-entidade-painel">

            <div className="criador-entidade-secao-topo">

              <div>

                <p className="criador-entidade-etiqueta">
                  ETAPA {numeroEtapaAtual}
                </p>


                <h2>

                  {editando
                    ? "Revisar alterações"
                    : "Revisar estado inicial"}

                </h2>


                <p>

                  {editando
                    ? "Confira as alterações de identidade antes de salvar."
                    : "Confira o estado com que esta entidade entrará na campanha. O que não foi alterado continuará usando os padrões definidos pela campanha."}

                </p>

              </div>

            </div>


            <div className="criador-entidade-revisao">

              <div className="criador-entidade-revisao-identidade">

                <div className="criador-entidade-revisao-avatar">

                  {novaFicha?.imagem ? (

                    <img
                      src={
                        novaFicha.imagem
                      }
                      alt={
                        novaFicha.nome
                      }
                    />

                  ) : (

                    <span>
                      {configuracaoTipo.icone}
                    </span>

                  )}

                </div>


                <div>

                  <span className="criador-entidade-tipo-selo">
                    {configuracaoTipo.nome}
                  </span>


                  <h2>
                    {novaFicha?.nome ||
                      "Sem nome"}
                  </h2>


                  <p>
                    {resumoFuncaoAtual()}
                  </p>

                </div>

              </div>


              <div className="criador-entidade-revisao-grid">

                <article>

                  <span>
                    NÍVEL
                  </span>

                  <strong>
                    {novaFicha?.nivel ||
                      1}
                  </strong>

                </article>


                <article>

                  <span>
                    PROPRIETÁRIO
                  </span>

                  <strong>
                    {nomeProprietario}
                  </strong>

                </article>


                <article>

                  <span>
                    ATRIBUTOS
                  </span>

                  <strong>
                    {atributos.length}
                  </strong>

                </article>


                <article>

                  <span>
                    RECURSOS
                  </span>

                  <strong>
                    {recursos.length}
                  </strong>

                </article>

              </div>


              {!editando &&
              colecoesProgressaoCriacao.length >
              0 && (

                <div className="criador-entidade-revisao-caracteristicas">

                  {colecoesProgressaoCriacao.map(
                    colecao => (

                      <article
                        key={
                          colecao.id
                        }
                      >

                        <span>
                          {String(
                            colecao.singular ||
                            colecao.nome
                          ).toUpperCase()}
                        </span>

                        <strong>
                          {resumoEscolhaColecao(
                            colecao
                          )}
                        </strong>

                      </article>

                    )
                  )}

                </div>

              )}


              <div className="criador-entidade-aviso">

                <span>
                  ℹ️
                </span>

                <p>

                  {editando
                    ? "Esta edição altera apenas identidade e informações básicas. Atributos, recursos, Ritmo, Momentum, condições, habilidades e progressão continuam em seus módulos próprios."
                    : "A criação define apenas o ponto de partida. Depois que a entidade existir, atributos, recursos, Arquétipos, Talentos, Habilidades, Ritmo, Momentum, condições e futuras progressões passam a ser administrados em seus módulos próprios."}

                </p>

              </div>

            </div>

          </section>

        )}


        <footer className="criador-entidade-rodape">

          <button
            type="button"
            className="criador-entidade-botao-secundario"
            onClick={
              irAnterior
            }
          >
            ←{" "}

            {indiceEtapa ===
            0
              ? "CANCELAR"
              : "VOLTAR"}

          </button>


          <span>

            Etapa{" "}
            {numeroEtapaAtual}
            {" "}
            de{" "}
            {etapas.length}

          </span>


          <button
            type="button"
            className="criador-entidade-botao-principal"
            onClick={
              irProxima
            }
          >

            {etapa ===
            "revisao"
              ? (
                editando
                  ? "💾 SALVAR ALTERAÇÕES"
                  : `CRIAR ${configuracaoTipo.nome.toUpperCase()}`
              )
              : "CONTINUAR →"}

          </button>

        </footer>

      </main>

    </div>
  );
}


export default CriadorEntidade;