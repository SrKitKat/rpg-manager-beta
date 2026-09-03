import React from "react";

import {
  normalizarRequisitosNarrativos
} from "./RequisitosTecnica.jsx";


/* ========================================
   ESTADOS DA TÉCNICA

   Importante:

   Estado registrado e elegibilidade não são
   a mesma coisa.

   Elegibilidade:
   "pode aprender?"

   Estado:
   "em que situação ela está?"
======================================== */

export const estadosTecnica = {

  bloqueada: {
    nome:
      "Bloqueada",

    descricao:
      "O personagem ainda não pode aprender esta técnica."
  },


  disponivel: {
    nome:
      "Disponível",

    descricao:
      "Todos os requisitos foram cumpridos e a técnica pode começar a ser aprendida."
  },


  desenvolvimento: {
    nome:
      "Em desenvolvimento",

    descricao:
      "O personagem já iniciou o treinamento ou desenvolvimento da técnica."
  },


  aprendida: {
    nome:
      "Aprendida",

    descricao:
      "A técnica já pode ser utilizada normalmente."
  },


  dominada: {
    nome:
      "Dominada",

    descricao:
      "O personagem alcançou domínio avançado desta técnica."
  }

};


/* ========================================
   ESTILOS
======================================== */

const estilos = {

  area: {
    display: "grid",
    gap: "10px"
  },


  bloco: {
    padding: "16px",
    border: "1px solid #303846",
    borderRadius: "12px",
    background: "#202631"
  },


  blocoSecundario: {
    padding: "13px 16px",
    border: "1px solid #303846",
    borderRadius: "10px",
    background: "#171b24"
  },


  etiqueta: {
    display: "block",
    margin: "0 0 5px",
    color: "#8d96a6",
    fontSize: "10px",
    fontWeight: "bold"
  },


  titulo: {
    display: "block",
    marginBottom: "7px",
    fontSize: "18px"
  },


  descricao: {
    margin: 0,
    color: "#b8c0ce",
    fontSize: "12px",
    lineHeight: "1.5"
  },


  nota: {
    margin: "6px 0 0",
    color: "#8d96a6",
    fontSize: "11px",
    lineHeight: "1.5"
  },


  linhaAnalise: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    marginTop: "10px",
    paddingTop: "10px",
    borderTop: "1px solid #303846",
    color: "#aeb7c4",
    fontSize: "11px"
  }

};


/* ========================================
   NORMALIZAR ESTADO
======================================== */

export function normalizarEstadoRegistrado(
  estado
) {
  if (
    estadosTecnica[
      estado
    ]
  ) {
    return estado;
  }


  return "bloqueada";
}


/* ========================================
   REQUISITOS NUMÉRICOS
======================================== */

export function verificarRequisitosNumericos({
  requisitosAtributos = {},
  atributosJogador = {}
}) {
  const requisitos =
    Object.entries(
      requisitosAtributos ||
      {}
    );


  if (
    requisitos.length ===
    0
  ) {
    return true;
  }


  return requisitos.every(
    ([
      chave,
      minimo
    ]) => {
      const atual =
        Number(
          atributosJogador[
            chave
          ]
        ) || 0;


      const necessario =
        Number(
          minimo
        ) || 0;


      return (
        atual >=
        necessario
      );
    }
  );
}


/* ========================================
   REQUISITOS NARRATIVOS
======================================== */

export function verificarRequisitosNarrativos({
  requisitosNarrativos = []
}) {
  const requisitos =
    normalizarRequisitosNarrativos(
      requisitosNarrativos
    );


  if (
    requisitos.length ===
    0
  ) {
    return true;
  }


  return requisitos.every(
    requisito =>
      requisito.cumprido
  );
}


/* ========================================
   TODOS OS REQUISITOS
======================================== */

export function verificarTodosRequisitos({
  requisitosAtributos = {},
  requisitosNarrativos = [],
  atributosJogador = {}
}) {
  const numericos =
    verificarRequisitosNumericos({
      requisitosAtributos,
      atributosJogador
    });


  const narrativos =
    verificarRequisitosNarrativos({
      requisitosNarrativos
    });


  return {
    numericos,
    narrativos,

    todos:
      numericos &&
      narrativos
  };
}


/* ========================================
   ELEGIBILIDADE

   Não altera estado salvo.

   Apenas responde:

   "Pelos requisitos existentes,
   pode aprender agora?"
======================================== */

export function descobrirElegibilidadeSugerida({
  requisitosAtributos = {},
  requisitosNarrativos = [],
  atributosJogador = {}
}) {
  const verificacao =
    verificarTodosRequisitos({
      requisitosAtributos,
      requisitosNarrativos,
      atributosJogador
    });


  return verificacao.todos
    ? "disponivel"
    : "bloqueada";
}


/* ========================================
   COMPATIBILIDADE

   Mantemos porque código antigo pode chamar
   esta função.

   Se a técnica já está em desenvolvimento,
   aprendida ou dominada, esse progresso não
   é apagado pela análise dos requisitos.
======================================== */

export function descobrirEstadoSugerido({
  estadoAtual,
  requisitosAtributos = {},
  requisitosNarrativos = [],
  atributosJogador = {}
}) {
  const estadoNormalizado =
    normalizarEstadoRegistrado(
      estadoAtual
    );


  if (
    estadoNormalizado ===
      "desenvolvimento" ||
    estadoNormalizado ===
      "aprendida" ||
    estadoNormalizado ===
      "dominada"
  ) {
    return estadoNormalizado;
  }


  return descobrirElegibilidadeSugerida({
    requisitosAtributos,
    requisitosNarrativos,
    atributosJogador
  });
}


/* ========================================
   RESUMO DA ANÁLISE
======================================== */

function AnaliseRequisitos({
  requisitosAtributos = {},
  requisitosNarrativos = [],
  atributosJogador = {}
}) {
  const verificacao =
    verificarTodosRequisitos({
      requisitosAtributos,
      requisitosNarrativos,
      atributosJogador
    });


  const elegibilidade =
    verificacao.todos
      ? "disponivel"
      : "bloqueada";


  const configuracao =
    estadosTecnica[
      elegibilidade
    ];


  return (
    <div style={estilos.blocoSecundario}>

      <span style={estilos.etiqueta}>
        ELEGIBILIDADE PARA APRENDER
      </span>


      <strong>
        {configuracao.nome}
      </strong>


      <p style={estilos.nota}>

        {verificacao.todos
          ? "Todos os requisitos automáticos e narrativos estão cumpridos."
          : "Ainda existe pelo menos um requisito pendente."}

      </p>


      <div style={estilos.linhaAnalise}>

        <span>
          Automáticos
        </span>

        <strong>
          {verificacao.numericos
            ? "✓ Cumpridos"
            : "✕ Pendentes"}
        </strong>

      </div>


      <div
        style={{
          ...estilos.linhaAnalise,
          marginTop: "6px",
          paddingTop: "6px"
        }}
      >

        <span>
          Narrativos
        </span>

        <strong>
          {verificacao.narrativos
            ? "✓ Cumpridos"
            : "○ Pendentes"}
        </strong>

      </div>

    </div>
  );
}


/* ========================================
   VISUALIZADOR
======================================== */

export function VisualizadorEstadoTecnica({
  estado = "bloqueada",
  requisitosAtributos = {},
  requisitosNarrativos = [],
  atributosJogador = {}
}) {
  const estadoRegistrado =
    normalizarEstadoRegistrado(
      estado
    );


  const configuracaoEstado =
    estadosTecnica[
      estadoRegistrado
    ];


  return (
    <div style={estilos.area}>

      <div style={estilos.bloco}>

        <span style={estilos.etiqueta}>
          ESTADO REGISTRADO
        </span>


        <strong style={estilos.titulo}>
          {configuracaoEstado.nome}
        </strong>


        <p style={estilos.descricao}>
          {configuracaoEstado.descricao}
        </p>

      </div>


      <AnaliseRequisitos
        requisitosAtributos={
          requisitosAtributos
        }

        requisitosNarrativos={
          requisitosNarrativos
        }

        atributosJogador={
          atributosJogador
        }
      />


      <div style={estilos.blocoSecundario}>

        <span style={estilos.etiqueta}>
          COMO INTERPRETAR
        </span>


        <p style={estilos.nota}>
          A elegibilidade responde se o personagem
          já cumpre as condições necessárias para
          aprender. O estado registrado mostra o
          progresso real da técnica. A análise nunca
          muda o estado automaticamente.
        </p>

      </div>

    </div>
  );
}


/* ========================================
   EDITOR
======================================== */

export function EditorEstadoTecnica({
  estado = "bloqueada",
  requisitosAtributos = {},
  requisitosNarrativos = [],
  atributosJogador = {},
  onAlterar
}) {
  const estadoRegistrado =
    normalizarEstadoRegistrado(
      estado
    );


  return (
    <div style={estilos.area}>

      <div style={estilos.bloco}>

        <h3
          style={{
            marginTop:
              0
          }}
        >
          ESTADO DA TÉCNICA
        </h3>


        <p style={estilos.descricao}>
          Registre a situação real da técnica para
          este personagem. A disponibilidade
          calculada pelos requisitos aparece abaixo,
          mas não substitui sua escolha.
        </p>


        <label
          style={{
            display:
              "block",

            marginTop:
              "16px"
          }}
        >

          <span style={estilos.etiqueta}>
            ESTADO REGISTRADO
          </span>


          <select
            value={
              estadoRegistrado
            }
            onChange={
              evento =>
                onAlterar?.(
                  evento
                    .target
                    .value
                )
            }
          >

            {Object.entries(
              estadosTecnica
            ).map(
              ([
                chave,
                configuracao
              ]) => (

                <option
                  key={chave}
                  value={chave}
                >
                  {configuracao.nome}
                </option>

              )
            )}

          </select>

        </label>

      </div>


      <AnaliseRequisitos
        requisitosAtributos={
          requisitosAtributos
        }

        requisitosNarrativos={
          requisitosNarrativos
        }

        atributosJogador={
          atributosJogador
        }
      />


      <div style={estilos.blocoSecundario}>

        <span style={estilos.etiqueta}>
          FLUXO ESPERADO
        </span>


        <p style={estilos.nota}>
          🔒 Bloqueada → ◇ Disponível →
          ◐ Em desenvolvimento → ✓ Aprendida →
          ★ Dominada.
        </p>


        <p style={estilos.nota}>
          O Mestre ainda pode registrar um estado
          diferente quando a narrativa justificar.
          Isso fica explícito como estado registrado,
          sem falsificar a análise dos requisitos.
        </p>

      </div>

    </div>
  );
}


export default VisualizadorEstadoTecnica;