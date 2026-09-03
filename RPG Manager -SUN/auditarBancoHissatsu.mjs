import fs from "node:fs";
import path from "node:path";
import {
  fileURLToPath
} from "node:url";

import {
  bancoHissatsuFactual,
  bancoHissatsuSuperOnze
} from "./src/features/habilidades/data/bancoHissatsuSuperOnze.js";

import {
  auditarBancoHissatsuQualidade
} from "./src/features/habilidades/data/bancoHissatsuQualidade.js";


/* ========================================
   AUDITORIA ÚNICA — BANCO HISSATSU

   Não altera nenhum arquivo.
======================================== */


const __filename =
  fileURLToPath(
    import.meta.url
  );

const __dirname =
  path.dirname(
    __filename
  );


function linha(
  titulo,
  valor
) {
  console.log(
    `${titulo.padEnd(34)} ${valor}`
  );
}


function secao(
  texto
) {
  console.log(
    `\n=== ${texto} ===\n`
  );
}


/* ========================================
   CURADORIA ANTIGA — OPCIONAL

   Se o arquivo antigo ainda existir,
   reaproveitamos automaticamente as
   decisões humanas já registradas.

   Se não existir, o teste continua.
======================================== */

function carregarCuradoriaAntiga() {
  const caminhos = [
    path.join(
      __dirname,
      "IMAGENS_HISSATSU_CURADORIA_v2_revisada.json"
    ),

    path.join(
      __dirname,
      "IMAGENS_HISSATSU_CURADORIA.json"
    ),

    path.join(
      __dirname,
      "dados",
      "IMAGENS_HISSATSU_CURADORIA_v2_revisada.json"
    )
  ];

  for (
    const caminho of caminhos
  ) {
    if (
      !fs.existsSync(
        caminho
      )
    ) {
      continue;
    }

    try {
      const json =
        JSON.parse(
          fs.readFileSync(
            caminho,
            "utf8"
          )
        );

      const registros =
        json?.registros &&
        typeof json.registros ===
          "object"
          ? json.registros
          : (
              json &&
              typeof json ===
                "object" &&
              !Array.isArray(json)
                ? json
                : {}
            );

      return {
        caminho,
        registros
      };
    } catch (erro) {
      console.warn(
        "AVISO: falha ao ler curadoria antiga:",
        caminho
      );

      console.warn(
        erro?.message ||
        erro
      );
    }
  }

  return {
    caminho: "",
    registros: {}
  };
}


const curadoriaAntiga =
  carregarCuradoriaAntiga();


/* ========================================
   EXECUTAR AUDITORIA
======================================== */

const auditoria =
  auditarBancoHissatsuQualidade({
    banco:
      bancoHissatsuSuperOnze,

    curadoriaPorId:
      curadoriaAntiga
        .registros,

    /*
      O Banco legado não será bloqueado
      porque ainda não possui fonte factual
      estruturada em todos os registros.

      Nos próximos lotes isso poderá ser
      obrigatório.
    */

    exigirFonteFactual:
      false
  });


const resumo =
  auditoria.resumo;


/* ========================================
   CABEÇALHO
======================================== */

console.log(
  "\n========================================"
);

console.log(
  "BANCO HISSATSU — PORTÃO DE QUALIDADE"
);

console.log(
  "========================================\n"
);


linha(
  "FACTUAL:",
  bancoHissatsuFactual.length
);

linha(
  "FINAL:",
  bancoHissatsuSuperOnze.length
);

linha(
  "IDS UNICOS:",
  resumo.idsUnicos
);

linha(
  "IDS DUPLICADOS NO FINAL:",
  resumo.idsDuplicados
);

linha(
  "CURADORIA ANTIGA CARREGADA:",
  curadoriaAntiga.caminho
    ? Object.keys(
        curadoriaAntiga.registros
      ).length
    : 0
);


/* ========================================
   ESTADO GERAL
======================================== */

secao(
  "ESTADO GERAL"
);

linha(
  "COMPLETAS:",
  resumo.completas
);

linha(
  "PARCIAIS:",
  resumo.parciais
);

linha(
  "BLOQUEADAS:",
  resumo.bloqueadas
);

linha(
  "ERROS BLOQUEANTES:",
  resumo.errosBloqueantes
);

linha(
  "PENDENCIAS:",
  resumo.pendencias
);

linha(
  "AVISOS:",
  resumo.avisos
);


/* ========================================
   LOCALIZAÇÃO
======================================== */

secao(
  "LOCALIZACAO"
);

linha(
  "INGLES VERIFICADO:",
  resumo
    .localizacao
    .ingles
    .verificada
);

linha(
  "INGLES PENDENTE:",
  resumo
    .localizacao
    .ingles
    .pendente
);

linha(
  "JP VERIFICADO:",
  resumo
    .localizacao
    .japonesRomanizado
    .verificada
);

linha(
  "JP PENDENTE:",
  resumo
    .localizacao
    .japonesRomanizado
    .pendente
);

linha(
  "PT-BR VERIFICADO:",
  resumo
    .localizacao
    .ptBR
    .verificada
);

linha(
  "PT-BR PENDENTE:",
  resumo
    .localizacao
    .ptBR
    .pendente
);


/* ========================================
   IMAGENS
======================================== */

secao(
  "IMAGENS"
);

linha(
  "COM IMAGEM:",
  resumo
    .imagens
    .comImagem
);

linha(
  "SEM IMAGEM:",
  resumo
    .imagens
    .semImagem
);

console.log("");

linha(
  "CURADORIA APROVADA:",
  resumo
    .imagens
    .estados
    .aprovada
);

linha(
  "CURADORIA REVISAR:",
  resumo
    .imagens
    .estados
    .revisar
);

linha(
  "CURADORIA REJEITADA:",
  resumo
    .imagens
    .estados
    .rejeitada
);

linha(
  "CURADORIA PENDENTE:",
  resumo
    .imagens
    .estados
    .pendente
);

console.log("");

linha(
  "QUALIDADE A:",
  resumo
    .imagens
    .qualidades
    .A
);

linha(
  "QUALIDADE B:",
  resumo
    .imagens
    .qualidades
    .B
);

linha(
  "QUALIDADE C:",
  resumo
    .imagens
    .qualidades
    .C
);

linha(
  "QUALIDADE D:",
  resumo
    .imagens
    .qualidades
    .D
);

linha(
  "NAO CLASSIFICADA:",
  resumo
    .imagens
    .qualidades
    .naoClassificada
);


/* ========================================
   COLISÕES DE NOMES
======================================== */

secao(
  "COLISOES DE NOMES"
);

linha(
  "COLISOES ENCONTRADAS:",
  auditoria
    .colisoesNomes
    .length
);


for (
  const colisao of auditoria
    .colisoesNomes
    .slice(0, 20)
) {
  console.log(
    `- ${colisao.chave}:`,
    colisao.ids
  );
}


if (
  auditoria
    .colisoesNomes
    .length >
  20
) {
  console.log(
    `... e mais ${
      auditoria
        .colisoesNomes
        .length - 20
    } colisões.`
  );
}


/* ========================================
   REGISTROS BLOQUEADOS
======================================== */

secao(
  "REGISTROS BLOQUEADOS"
);


if (
  !auditoria
    .bloqueadas
    .length
) {
  console.log(
    "Nenhum registro bloqueado."
  );
} else {
  for (
    const item of auditoria
      .bloqueadas
      .slice(0, 30)
  ) {
    console.log(
      `\n${
        item.id ||
        "SEM-ID"
      } — ${item.nome}`
    );

    for (
      const erro of item.erros
    ) {
      console.log(
        `  ERRO: ${erro.codigo} — ${erro.mensagem}`
      );
    }
  }

  if (
    auditoria
      .bloqueadas
      .length >
    30
  ) {
    console.log(
      `\n... e mais ${
        auditoria
          .bloqueadas
          .length - 30
      } registros bloqueados.`
    );
  }
}


/* ========================================
   AMOSTRA DE PENDÊNCIAS
======================================== */

secao(
  "AMOSTRA DE PENDENCIAS"
);


const comPendencia =
  auditoria
    .analises
    .filter(
      item =>
        item
          .pendencias
          .length >
        0
    );


for (
  const item of comPendencia
    .slice(0, 20)
) {
  console.log(
    `\n${item.id} — ${item.nome}`
  );

  for (
    const pendencia of item
      .pendencias
      .slice(0, 6)
  ) {
    console.log(
      `  - ${pendencia.codigo}`
    );
  }
}


if (
  comPendencia.length >
  20
) {
  console.log(
    `\n... e mais ${
      comPendencia.length -
      20
    } registros com pendências.`
  );
}


/* ========================================
   RESULTADO
======================================== */

console.log(
  "\n========================================"
);


if (
  resumo.errosBloqueantes ===
  0
) {
  console.log(
    "RESULTADO: BANCO ESTRUTURALMENTE VALIDO"
  );

  console.log(
    "Pendencias permanecem visiveis, mas nao sao tratadas como dados verificados."
  );
} else {
  console.log(
    "RESULTADO: EXISTEM ERROS BLOQUEANTES"
  );

  process.exitCode = 1;
}


console.log(
  "========================================\n"
);