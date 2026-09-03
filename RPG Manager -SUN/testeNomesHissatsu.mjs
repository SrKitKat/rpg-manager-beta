import {
  bancoHissatsuFactual,
  bancoHissatsuSuperOnze,
  loteHissatsuIE1Nomes01Seguro,
  obterImagemReferenciaHissatsu,
  hissatsuCombinaBusca
} from "./src/features/habilidades/data/bancoHissatsuSuperOnze.js";

import {
  loteHissatsuIE1Nomes01
} from "./src/features/habilidades/data/bancoHissatsuLoteIE1Nomes01.js";


/* ========================================
   TESTE — CATALOGAÇÃO DOS 315 NOMES
======================================== */

function linha(titulo, valor) {
  console.log(
    `${titulo.padEnd(32)} ${valor}`
  );
}

function idsUnicos(lista) {
  return new Set(
    lista.map(
      registro => registro.id
    )
  ).size;
}

function buscarPorId(id) {
  return bancoHissatsuSuperOnze.find(
    registro => registro.id === id
  );
}

function idsComStatus(
  idioma,
  status
) {
  return bancoHissatsuSuperOnze
    .filter(
      registro =>
        registro
          ?.localizacao
          ?.[idioma] === status
    )
    .map(
      registro => registro.id
    );
}


/* ========================================
   CONTAGENS PRINCIPAIS
======================================== */

const totalFactual =
  bancoHissatsuFactual.length;

const totalFinal =
  bancoHissatsuSuperOnze.length;

const totalComplemento =
  loteHissatsuIE1Nomes01.length;

const totalComplementoSeguro =
  loteHissatsuIE1Nomes01Seguro.length;

const idsUnicosComplemento =
  idsUnicos(
    loteHissatsuIE1Nomes01
  );

const idsUnicosFinal =
  idsUnicos(
    bancoHissatsuSuperOnze
  );


/* ========================================
   LOCALIZAÇÕES
======================================== */

const inglesVerificados =
  idsComStatus(
    "ingles",
    "verificada"
  );

const inglesPendentes =
  idsComStatus(
    "ingles",
    "pendente"
  );

const japonesVerificados =
  idsComStatus(
    "japonesRomanizado",
    "verificada"
  );

const japonesPendentes =
  idsComStatus(
    "japonesRomanizado",
    "pendente"
  );


/* ========================================
   PT-BR
======================================== */

const comPtBR =
  bancoHissatsuSuperOnze.filter(
    registro =>
      String(
        registro
          ?.nomes
          ?.ptBR ||
        ""
      ).trim()
  ).length;


/* ========================================
   IMAGENS
======================================== */

const comImagem =
  bancoHissatsuSuperOnze.filter(
    registro =>
      Boolean(
        obterImagemReferenciaHissatsu(
          registro
        )?.url
      )
  ).length;


/* ========================================
   SEGURANÇA DE IDs
======================================== */

const idsFatuais =
  new Set(
    bancoHissatsuFactual.map(
      registro => registro.id
    )
  );

const idsComplemento =
  new Set(
    loteHissatsuIE1Nomes01.map(
      registro => registro.id
    )
  );

const extrasNoComplemento = [
  ...idsComplemento
].filter(
  id => !idsFatuais.has(id)
);

const faltandoNoComplemento = [
  ...idsFatuais
].filter(
  id => !idsComplemento.has(id)
);


/* ========================================
   CASOS IMPORTANTES
======================================== */

const casos = [
  "tenkuu-otoshi",
  "nekketsu-punch",
  "bakuretsu-punch",
  "sneaking-raid",
  "welcome-back",
  "bull-attack",
  "horizon"
];


/* ========================================
   RESULTADO
======================================== */

console.log(
  "\n=== BANCO DE HISSATSU ===\n"
);

linha(
  "FACTUAL:",
  totalFactual
);

linha(
  "FINAL:",
  totalFinal
);

linha(
  "HISSATSU NO COMPLEMENTO:",
  totalComplemento
);

linha(
  "COMPLEMENTO SEGURO:",
  totalComplementoSeguro
);

linha(
  "IDS UNICOS COMPLEMENTO:",
  idsUnicosComplemento
);

linha(
  "IDS UNICOS FINAL:",
  idsUnicosFinal
);


console.log(
  "\n=== LOCALIZACAO ===\n"
);

linha(
  "INGLES VERIFICADO:",
  inglesVerificados.length
);

linha(
  "INGLES PENDENTE:",
  inglesPendentes.length
);

linha(
  "JP VERIFICADO:",
  japonesVerificados.length
);

linha(
  "JP PENDENTE:",
  japonesPendentes.length
);

linha(
  "PT-BR:",
  comPtBR
);

linha(
  "COM IMAGEM:",
  comImagem
);


console.log(
  "\n=== PENDENCIAS EM INGLES ===\n"
);

console.log(
  inglesPendentes
);


console.log(
  "\n=== SEGURANCA DOS 315 IDS ===\n"
);

linha(
  "EXTRAS:",
  extrasNoComplemento.length
);

linha(
  "FALTANDO:",
  faltandoNoComplemento.length
);

if (extrasNoComplemento.length) {
  console.log(
    "IDs extras:",
    extrasNoComplemento
  );
}

if (faltandoNoComplemento.length) {
  console.log(
    "IDs faltando:",
    faltandoNoComplemento
  );
}


/* ========================================
   CONFERÊNCIA DOS CASOS CRÍTICOS
======================================== */

console.log(
  "\n=== CASOS CRITICOS ===\n"
);

for (const id of casos) {
  const registro =
    buscarPorId(id);

  console.log(id);

  console.log(
    "  EN:",
    registro
      ?.nomes
      ?.ingles
  );

  console.log(
    "  JP:",
    registro
      ?.nomes
      ?.japonesRomanizado
  );

  console.log(
    "  STATUS EN:",
    registro
      ?.localizacao
      ?.ingles
  );

  console.log(
    "  STATUS JP:",
    registro
      ?.localizacao
      ?.japonesRomanizado
  );

  console.log("");
}


/* ========================================
   TESTE DE BUSCA
======================================== */

const buscas = [
  [
    "Celestial Smash",
    "tenkuu-otoshi"
  ],

  [
    "Fireball Knuckle",
    "nekketsu-punch"
  ],

  [
    "Blazing Knuckle",
    "bakuretsu-punch"
  ],

  [
    "Am-Bush",
    "sneaking-raid"
  ],

  [
    "Yo-Yo Ball",
    "welcome-back"
  ]
];


console.log(
  "=== BUSCA MULTILINGUE ===\n"
);

for (
  const [
    consulta,
    idEsperado
  ] of buscas
) {
  const encontrados =
    bancoHissatsuSuperOnze
      .filter(
        registro =>
          hissatsuCombinaBusca(
            registro,
            consulta
          )
      )
      .map(
        registro => registro.id
      );

  console.log(
    `${consulta}:`,
    encontrados,
    encontrados.includes(
      idEsperado
    )
      ? "OK"
      : "ERRO"
  );
}


/* ========================================
   VALIDAÇÃO FINAL
======================================== */

const testes = {
  factual315:
    totalFactual === 315,

  final315:
    totalFinal === 315,

  complemento315:
    totalComplemento === 315,

  complementoSeguro315:
    totalComplementoSeguro === 315,

  idsComplemento315:
    idsUnicosComplemento === 315,

  idsFinal315:
    idsUnicosFinal === 315,

  ingles313:
    inglesVerificados.length === 313,

  inglesPendentes2:
    inglesPendentes.length === 2,

  pendenciasCorretas:
    inglesPendentes.length === 2 &&
    inglesPendentes.includes(
      "bull-attack"
    ) &&
    inglesPendentes.includes(
      "horizon"
    ),

  japones18:
    japonesVerificados.length === 18,

  japonesPendentes297:
    japonesPendentes.length === 297,

  ptBR8:
    comPtBR === 8,

  imagens103:
    comImagem === 103,

  semExtras:
    extrasNoComplemento.length === 0,

  semFaltantes:
    faltandoNoComplemento.length === 0
};


console.log(
  "\n=== VALIDACAO FINAL ===\n"
);

for (
  const [
    teste,
    passou
  ] of Object.entries(
    testes
  )
) {
  console.log(
    `${passou ? "OK" : "ERRO"} - ${teste}`
  );
}


const tudoCerto =
  Object.values(
    testes
  ).every(Boolean);


console.log(
  "\n=============================="
);

console.log(
  tudoCerto
    ? "RESULTADO: TUDO CERTO"
    : "RESULTADO: EXISTEM ERROS"
);

console.log(
  "==============================\n"
);


if (!tudoCerto) {
  process.exitCode = 1;
}