import {
  bancoHissatsuSuperOnze,
  hissatsuCombinaBusca
} from "./src/features/habilidades/data/bancoHissatsuSuperOnze.js";


/* ========================================
   DIAGNÓSTICO — BLAZING KNUCKLE
======================================== */

const CONSULTA = "blazing knuckle";

const idsInvestigados = [
  "nekketsu-punch",
  "bakuretsu-punch"
];


function contemConsulta(valor) {
  return (
    typeof valor === "string" &&
    valor
      .toLowerCase()
      .includes(CONSULTA)
  );
}


function procurarEmObjeto(
  valor,
  caminho = "",
  encontrados = []
) {
  if (contemConsulta(valor)) {
    encontrados.push({
      caminho,
      valor
    });

    return encontrados;
  }

  if (Array.isArray(valor)) {
    valor.forEach(
      (item, indice) => {
        procurarEmObjeto(
          item,
          `${caminho}[${indice}]`,
          encontrados
        );
      }
    );

    return encontrados;
  }

  if (
    valor &&
    typeof valor === "object"
  ) {
    for (
      const [
        chave,
        conteudo
      ] of Object.entries(valor)
    ) {
      const novoCaminho =
        caminho
          ? `${caminho}.${chave}`
          : chave;

      procurarEmObjeto(
        conteudo,
        novoCaminho,
        encontrados
      );
    }
  }

  return encontrados;
}


console.log(
  "\n=== RESULTADO DA BUSCA ===\n"
);

const encontradosPelaBusca =
  bancoHissatsuSuperOnze
    .filter(
      registro =>
        hissatsuCombinaBusca(
          registro,
          "Blazing Knuckle"
        )
    )
    .map(
      registro => registro.id
    );

console.log(
  encontradosPelaBusca
);


console.log(
  "\n=== INVESTIGANDO REGISTROS ===\n"
);


for (
  const id of idsInvestigados
) {
  const registro =
    bancoHissatsuSuperOnze.find(
      item => item.id === id
    );

  console.log(
    `\n--- ${id} ---\n`
  );

  if (!registro) {
    console.log(
      "REGISTRO NÃO ENCONTRADO"
    );

    continue;
  }

  console.log(
    "NOME ORIGINAL:",
    registro.nomeOriginal
  );

  console.log(
    "NOMES:",
    registro.nomes
  );

  console.log(
    "LOCALIZACAO:",
    registro.localizacao
  );


  const ocorrencias =
    procurarEmObjeto(
      registro
    );


  console.log(
    "\nOCORRENCIAS DE \"Blazing Knuckle\":"
  );


  if (!ocorrencias.length) {
    console.log(
      "Nenhuma ocorrência textual direta encontrada."
    );
  } else {
    for (
      const ocorrencia of ocorrencias
    ) {
      console.log(
        `${ocorrencia.caminho}:`,
        ocorrencia.valor
      );
    }
  }
}


console.log(
  "\n=== FIM DO DIAGNOSTICO ===\n"
);