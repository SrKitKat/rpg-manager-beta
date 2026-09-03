import {
  bancoHissatsuSuperOnze as banco,
  METADADOS_CATALOGO_HISSATSU_903
} from "./src/features/habilidades/data/bancoHissatsuSuperOnze.js";


function contar(
  tipo
) {

  return banco.filter(
    item =>
      item.tipo ===
      tipo
  ).length;

}


function linha(
  titulo,
  valor
) {

  console.log(

    String(
      titulo
    ).padEnd(
      36
    ) +

    " " +

    valor

  );

}


const ids =
  new Set(
    banco.map(
      item =>
        item.id
    )
  );


const segredos =
  banco.filter(
    item =>
      item
        ?.metadados
        ?.segredoOficial ===
      true
  );


const nomeados =
  banco.filter(
    item =>
      item
        ?.metadados
        ?.segredoOficial !==
      true
  );


const ingles =
  nomeados.filter(
    item =>
      item
        ?.localizacao
        ?.ingles ===
        "verificada" &&
      item
        ?.nomes
        ?.ingles
  ).length;


const japones =
  nomeados.filter(
    item =>
      item
        ?.localizacao
        ?.japones ===
        "verificada" &&
      item
        ?.nomes
        ?.japones
  ).length;


const ptBR =
  nomeados.filter(
    item =>
      item
        ?.localizacao
        ?.ptBR ===
        "verificada" &&
      item
        ?.nomes
        ?.ptBR
  ).length;


const jpRom =
  nomeados.filter(
    item =>
      item
        ?.localizacao
        ?.japonesRomanizado ===
        "verificada" &&
      item
        ?.nomes
        ?.japonesRomanizado
  ).length;


const slotsImagem =
  banco.filter(
    item =>
      item
        ?.imagemReferencia
        ?.url
  ).length;


const placeholdersPendentes =
  nomeados.filter(
    item =>
      item
        ?.imagemReferencia
        ?.placeholder ===
      true
  ).length;


const imagensReais =
  nomeados.filter(
    item =>
      item
        ?.imagemReferencia
        ?.url &&
      item
        ?.imagemReferencia
        ?.placeholder !==
      true
  ).length;


const aprovadas =
  nomeados.filter(
    item =>
      item
        ?.metadados
        ?.curadoriaImagem
        ?.estado ===
      "aprovada"
  ).length;


const revisar =
  nomeados.filter(
    item =>
      item
        ?.metadados
        ?.curadoriaImagem
        ?.estado ===
      "revisar"
  ).length;


const pendentes =
  nomeados.filter(
    item =>
      item
        ?.metadados
        ?.curadoriaImagem
        ?.estado ===
      "pendente"
  ).length;


const fonteOficial =
  banco.filter(
    item =>
      String(
        item
          ?.metadados
          ?.referencia
          ?.fonteFactual ||
        ""
      )
        .includes(
          "LEVEL-5"
        )
  ).length;


console.log(
  "\n========================================"
);

console.log(
  "BANCO HISSATSU — AUDITORIA 903"
);

console.log(
  "========================================\n"
);


linha(
  "TOTAL:",
  banco.length
);

linha(
  "IDS UNICOS:",
  ids.size
);

linha(
  "NOMEADAS PUBLICAMENTE:",
  nomeados.length
);

linha(
  "SEGREDOS OFICIAIS ???:",
  segredos.length
);


console.log(
  ""
);


linha(
  "CHUTE / SHOT:",
  contar(
    "chute"
  )
);

linha(
  "DRIBLE / OFFENCE:",
  contar(
    "drible"
  )
);

linha(
  "BLOQUEIO / DEFENCE:",
  contar(
    "bloqueio"
  )
);

linha(
  "GOLEIRO / GOALKEEP:",
  contar(
    "defesa_goleiro"
  )
);


console.log(
  ""
);


linha(
  "INGLES OFICIAL VISIVEL:",
  ingles
);

linha(
  "JAPONES OFICIAL VISIVEL:",
  japones
);

linha(
  "PT-BR VERIFICADO:",
  ptBR
);

linha(
  "JP ROM. VERIFICADO:",
  jpRom
);


console.log(
  ""
);


linha(
  "SLOTS VISUAIS:",
  slotsImagem
);

linha(
  "IMAGENS/CANDIDATAS REAIS:",
  imagensReais
);

linha(
  "PLACEHOLDERS PENDENTES:",
  placeholdersPendentes
);

linha(
  "CURADORIA APROVADA:",
  aprovadas
);

linha(
  "CURADORIA REVISAR:",
  revisar
);

linha(
  "CURADORIA PENDENTE:",
  pendentes
);


console.log(
  ""
);


linha(
  "FONTE LEVEL-5:",
  fonteOficial
);


/* ========================================
   TESTES
======================================== */


const testes = {

  total903:
    banco.length ===
    903,


  ids903:
    ids.size ===
    903,


  categorias:

    contar(
      "chute"
    ) ===
      369 &&

    contar(
      "drible"
    ) ===
      167 &&

    contar(
      "bloqueio"
    ) ===
      176 &&

    contar(
      "defesa_goleiro"
    ) ===
      191,


  nomeadosMaisSegredos:

    nomeados.length +
      segredos.length ===
    903,


  inglesNomeados:
    ingles ===
    nomeados.length,


  japonesNomeados:
    japones ===
    nomeados.length,


  segredosOcultos:
    segredos.every(
      item =>
        item
          ?.localizacao
          ?.ingles ===
          "oculta" &&
        item
          ?.localizacao
          ?.japones ===
          "oculta"
    ),


  slots903:
    slotsImagem ===
    903,


  fonte903:
    fonteOficial ===
    903,


  metadados903:
    METADADOS_CATALOGO_HISSATSU_903
      ?.total ===
    903

};


console.log(
  "\n=== VALIDACAO ESTRUTURAL ===\n"
);


for (
  const [
    nome,
    passou
  ]
  of Object.entries(
    testes
  )
) {

  console.log(
    (
      passou
        ? "OK"
        : "ERRO"
    ) +
    " - " +
    nome
  );

}


const tudoCerto =
  Object.values(
    testes
  )
    .every(
      Boolean
    );


console.log(
  "\n========================================"
);


console.log(
  tudoCerto
    ? "RESULTADO: BANCO 903 APROVADO"
    : "RESULTADO: EXISTEM ERROS ESTRUTURAIS"
);


console.log(
  "========================================\n"
);


if (
  !tudoCerto
) {

  process.exitCode =
    1;

}
