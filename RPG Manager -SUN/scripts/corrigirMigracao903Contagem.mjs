import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";

import {
  fileURLToPath
} from "node:url";


/* ========================================
   RPG MANAGER

   CORREÇÃO DA CONTAGEM DO CATÁLOGO 903

   Corrige a interpretação de "???".

   Um "???" encontrado no HTML não é
   automaticamente uma nova Hissatsu.

   Só vira slot oculto quando realmente
   falta um registro para alcançar o total
   oficial da categoria.
======================================== */


const __filename =
  fileURLToPath(
    import.meta.url
  );


const __dirname =
  path.dirname(
    __filename
  );


const ROOT =
  path.resolve(
    __dirname,
    ".."
  );


const ALVO =
  path.join(
    ROOT,
    "scripts",
    "migrarBancoHissatsu903.mjs"
  );


const BACKUP =
  path.join(
    ROOT,
    "scripts",
    "migrarBancoHissatsu903.antes-contagem-v3.mjs"
  );


/* ========================================
   BLOCO ATUAL

   Este é o bloco que existe na versão
   que você acabou de executar.
======================================== */


const BLOCO_ANTIGO = `  return {

    nomes,

    segredos,

    total:
      nomes.length +
      segredos,

    urls,

    porPagina

  };`;


/* ========================================
   BLOCO CORRIGIDO
======================================== */


const BLOCO_NOVO = `  /*
    IMPORTANTE:

    "???" pode aparecer no HTML como
    elemento auxiliar de um card.

    Portanto, NÃO podemos simplesmente
    fazer:

      nomes + quantidade de ???

    A fonte de verdade continua sendo o
    total oficial informado pela LEVEL-5.

    Só consideramos um slot realmente
    oculto quando:

    1. ainda faltam registros para atingir
       o total oficial;

    2. existe pelo menos a mesma quantidade
       de marcadores ??? observados.

    Exemplos já observados:

    Shot:
      366 nomes
      3 marcadores ???
      total oficial 369

      => 3 slots ocultos.

    Defence:
      176 nomes
      2 marcadores ???
      total oficial 176

      => 0 slots ocultos adicionais.
  */


  const faltantesParaTotalOficial =
    Math.max(
      0,
      config.esperado -
      nomes.length
    );


  const segredosEfetivos =
    Math.min(
      faltantesParaTotalOficial,
      segredos
    );


  return {

    nomes,


    /*
      O restante do migrador já utiliza
      a propriedade "segredos".

      Para não precisarmos reescrever
      milhares de linhas, ela passa a
      representar SOMENTE os slots
      efetivamente ocultos.
    */

    segredos:
      segredosEfetivos,


    /*
      Mantemos também a quantidade bruta
      encontrada no HTML para auditoria.
    */

    marcadoresSegredoEncontrados:
      segredos,


    faltantesParaTotalOficial,


    total:
      nomes.length +
      segredosEfetivos,


    urls,

    porPagina

  };`;


/* ========================================
   EXECUÇÃO
======================================== */


async function main() {

  console.log(
    "\n========================================"
  );


  console.log(
    "CORREÇÃO DA CONTAGEM HISSATSU 903"
  );


  console.log(
    "========================================\n"
  );


  /* ======================================
     VALIDAR ARQUIVO
  ====================================== */


  if (
    !fs.existsSync(
      ALVO
    )
  ) {

    throw new Error(

      "Não encontrei " +
      "scripts/migrarBancoHissatsu903.mjs. " +
      "Coloque este corretor dentro da pasta scripts/."

    );

  }


  const original =
    await fsp.readFile(
      ALVO,
      "utf8"
    );


  /* ======================================
     NÃO APLICAR DUAS VEZES
  ====================================== */


  if (
    original.includes(
      "marcadoresSegredoEncontrados"
    )
  ) {

    console.log(
      "CORREÇÃO JÁ APLICADA."
    );


    console.log(
      "Nenhuma alteração necessária."
    );


    console.log(
      ""
    );


    return;

  }


  /* ======================================
     GARANTIR QUE ESTAMOS ALTERANDO
     EXATAMENTE A VERSÃO ESPERADA
  ====================================== */


  const ocorrencias =
    original
      .split(
        BLOCO_ANTIGO
      )
      .length -
    1;


  if (
    ocorrencias !==
    1
  ) {

    throw new Error(

      "Esperava encontrar exatamente 1 " +
      "bloco antigo de contagem, mas encontrei " +
      ocorrencias +
      ". Nenhum arquivo foi alterado."

    );

  }


  /* ======================================
     BACKUP
  ====================================== */


  if (
    !fs.existsSync(
      BACKUP
    )
  ) {

    await fsp.copyFile(
      ALVO,
      BACKUP
    );

  }


  /* ======================================
     APLICAR CORREÇÃO
  ====================================== */


  let atualizado =
    original.replace(
      BLOCO_ANTIGO,
      BLOCO_NOVO
    );


  /*
    Apenas melhora a mensagem exibida
    durante o download.

    Antes ela dizia "segredo(s)",
    dando a impressão de que todo ???
    já era uma Hissatsu secreta.

    Agora diz "marcador(es) ???".
  */


  atualizado =
    atualizado.replace(

      `      " nomes + " +

      paginaAnalisada
        .segredos +

      " segredo(s)"`,

      `      " nomes + " +

      paginaAnalisada
        .segredos +

      " marcador(es) ???"`

    );


  /* ======================================
     SALVAR
  ====================================== */


  await fsp.writeFile(
    ALVO,
    atualizado,
    "utf8"
  );


  /* ======================================
     CONFIRMAÇÃO
  ====================================== */


  console.log(
    "CORREÇÃO APLICADA COM SUCESSO."
  );


  console.log(
    ""
  );


  console.log(
    "Backup criado em:"
  );


  console.log(
    "scripts/migrarBancoHissatsu903.antes-contagem-v3.mjs"
  );


  console.log(
    ""
  );


  console.log(
    "NOVA REGRA:"
  );


  console.log(
    "faltantes = total oficial - nomes encontrados"
  );


  console.log(
    ""
  );


  console.log(
    "segredos efetivos ="
  );


  console.log(
    "min(faltantes, marcadores ??? encontrados)"
  );


  console.log(
    ""
  );


  console.log(
    "Agora execute:"
  );


  console.log(
    "node --check .\\scripts\\migrarBancoHissatsu903.mjs"
  );


  console.log(
    "node .\\scripts\\migrarBancoHissatsu903.mjs --self-test"
  );


  console.log(
    ""
  );

}


/* ========================================
   ERROS
======================================== */


main()
  .catch(
    erro => {

      console.error(
        "\nERRO AO APLICAR A CORREÇÃO:"
      );


      console.error(
        erro?.stack ||
        erro
      );


      console.error(
        "\nSe a validação falhou, o migrador principal não foi alterado."
      );


      process.exitCode =
        1;

    }
  );