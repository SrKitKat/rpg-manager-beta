import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";

import {
  fileURLToPath
} from "node:url";


/* ========================================
   RPG MANAGER

   CORRETOR ROBUSTO — MIGRAÇÃO 903

   Corrige a função:
   tentarBaixarCategoria()

   DIFERENÇA PARA O CORRETOR ANTERIOR:

   - NÃO procura texto com espaçamento exato;
   - localiza a função pelo nome;
   - encontra automaticamente o bloco {...};
   - substitui a função inteira;
   - cria backup;
   - não altera nada se não conseguir
     identificar a função com segurança.

   REGRA NOVA:

   total oficial é autoridade.

   slots ocultos efetivos =
     min(
       total oficial - nomes encontrados,
       marcadores ??? encontrados
     )

   Exemplo:

   Shot:
     nomes = 366
     ??? = 3
     oficial = 369
     => 3 ocultos

   Defence:
     nomes = 176
     ??? = 2
     oficial = 176
     => 0 ocultos
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
    "migrarBancoHissatsu903.antes-contagem-v4.mjs"
  );


const NOME_FUNCAO =
  "async function tentarBaixarCategoria";


/* ========================================
   NOVA FUNÇÃO COMPLETA
======================================== */


const NOVA_FUNCAO = `async function tentarBaixarCategoria(
  base,
  config,
  idioma,
  porPagina
) {

  const paginas =
    Math.ceil(
      config.esperado /
      porPagina
    );


  const nomes =
    [];


  /*
    Quantidade BRUTA de "???" encontrada
    no HTML.

    Isso NÃO significa automaticamente
    quantidade de técnicas secretas.
  */

  let marcadoresSegredoEncontrados =
    0;


  const urls =
    [];


  for (
    let pagina = 1;
    pagina <= paginas;
    pagina += 1
  ) {

    const url =
      montarUrlOficial(
        base,
        config,
        pagina,
        porPagina
      );


    process.stdout.write(

      "  " +
      config.oficialEn +
      " " +
      idioma.toUpperCase() +
      " página " +
      pagina +
      "/" +
      paginas +
      "... "

    );


    const resposta =
      await fetchComRetry(
        url
      );


    const html =
      await resposta.text();


    const paginaAnalisada =
      analisarPaginaCategoria(
        html,
        config,
        idioma
      );


    nomes.push(
      ...paginaAnalisada.nomes
    );


    marcadoresSegredoEncontrados +=
      paginaAnalisada.segredos;


    urls.push(
      url
    );


    console.log(

      paginaAnalisada
        .nomes
        .length +

      " nomes + " +

      paginaAnalisada
        .segredos +

      " marcador(es) ???"

    );

  }


  /* ======================================
     REGRA CORRETA DE CONTAGEM

     O número oficial da LEVEL-5 é a
     autoridade.

     Um ??? somente representa um slot
     realmente oculto quando ainda falta
     um registro para atingir esse total.

     SHOT observado:

       366 nomes
       3 ???
       oficial 369

       faltam = 3
       ocultos = min(3, 3) = 3

     DEFENCE observado:

       176 nomes
       2 ???
       oficial 176

       faltam = 0
       ocultos = min(0, 2) = 0

     Portanto não transformamos elementos
     auxiliares da página em Hissatsu.
  ====================================== */


  const faltantesParaTotalOficial =
    Math.max(
      0,
      config.esperado -
      nomes.length
    );


  const segredosEfetivos =
    Math.min(
      faltantesParaTotalOficial,
      marcadoresSegredoEncontrados
    );


  const totalEfetivo =
    nomes.length +
    segredosEfetivos;


  console.log(

    "    resumo " +
    config.oficialEn +
    " " +
    idioma.toUpperCase() +
    ": " +

    nomes.length +
    " nome(s), " +

    marcadoresSegredoEncontrados +
    " marcador(es) ???, " +

    segredosEfetivos +
    " slot(s) oculto(s) efetivo(s), " +

    totalEfetivo +
    "/" +
    config.esperado

  );


  return {

    nomes,


    /*
      Mantemos o nome "segredos" porque
      o restante do migrador já utiliza
      esta propriedade.

      Agora ela contém somente os slots
      efetivamente necessários para fechar
      o total oficial.
    */

    segredos:
      segredosEfetivos,


    marcadoresSegredoEncontrados,


    faltantesParaTotalOficial,


    total:
      totalEfetivo,


    urls,


    porPagina

  };

}`;


/* ========================================
   LOCALIZAR ABERTURA DA FUNÇÃO
======================================== */


function encontrarInicioFuncao(
  codigo
) {

  const indiceNome =
    codigo.indexOf(
      NOME_FUNCAO
    );


  if (
    indiceNome < 0
  ) {

    throw new Error(
      "Não encontrei a função tentarBaixarCategoria()."
    );

  }


  /*
    Garante que não existem duas funções
    com o mesmo nome.
  */

  const segundaOcorrencia =
    codigo.indexOf(
      NOME_FUNCAO,
      indiceNome +
      NOME_FUNCAO.length
    );


  if (
    segundaOcorrencia >= 0
  ) {

    throw new Error(
      "Encontrei mais de uma tentarBaixarCategoria(). Nenhum arquivo foi alterado."
    );

  }


  const indiceChave =
    codigo.indexOf(
      "{",
      indiceNome
    );


  if (
    indiceChave < 0
  ) {

    throw new Error(
      "Encontrei a função, mas não encontrei sua chave de abertura."
    );

  }


  return {
    indiceNome,
    indiceChave
  };

}


/* ========================================
   ENCONTRAR FIM DO BLOCO

   Pequeno leitor lexical para não contar
   chaves que estejam dentro de:

   - strings "..."
   - strings '...'
   - templates \`...\`
   - comentários //
   - comentários /* ... * /
======================================== */


function encontrarFimBloco(
  codigo,
  indiceChaveInicial
) {

  let profundidade =
    0;


  let estado =
    "codigo";


  let escapado =
    false;


  for (
    let i =
      indiceChaveInicial;

    i <
      codigo.length;

    i += 1
  ) {

    const atual =
      codigo[i];


    const proximo =
      codigo[
        i + 1
      ];


    /* ======================================
       STRING ASPAS DUPLAS
    ====================================== */

    if (
      estado ===
      "string-dupla"
    ) {

      if (
        escapado
      ) {

        escapado =
          false;

        continue;

      }


      if (
        atual ===
        "\\\\"
      ) {

        escapado =
          true;

        continue;

      }


      if (
        atual ===
        '"'
      ) {

        estado =
          "codigo";

      }


      continue;

    }


    /* ======================================
       STRING ASPAS SIMPLES
    ====================================== */

    if (
      estado ===
      "string-simples"
    ) {

      if (
        escapado
      ) {

        escapado =
          false;

        continue;

      }


      if (
        atual ===
        "\\\\"
      ) {

        escapado =
          true;

        continue;

      }


      if (
        atual ===
        "'"
      ) {

        estado =
          "codigo";

      }


      continue;

    }


    /* ======================================
       TEMPLATE STRING

       Na função atual não há expressões
       complexas em template literal.

       Ainda assim ignoramos suas chaves
       para evitar falso fechamento.
    ====================================== */

    if (
      estado ===
      "template"
    ) {

      if (
        escapado
      ) {

        escapado =
          false;

        continue;

      }


      if (
        atual ===
        "\\\\"
      ) {

        escapado =
          true;

        continue;

      }


      if (
        atual ===
        "`"
      ) {

        estado =
          "codigo";

      }


      continue;

    }


    /* ======================================
       COMENTÁRIO DE LINHA
    ====================================== */

    if (
      estado ===
      "comentario-linha"
    ) {

      if (
        atual ===
        "\\n"
      ) {

        estado =
          "codigo";

      }


      continue;

    }


    /* ======================================
       COMENTÁRIO DE BLOCO
    ====================================== */

    if (
      estado ===
      "comentario-bloco"
    ) {

      if (
        atual ===
          "*" &&
        proximo ===
          "/"
      ) {

        estado =
          "codigo";

        i +=
          1;

      }


      continue;

    }


    /* ======================================
       ENTRAR EM STRING / COMENTÁRIO
    ====================================== */

    if (
      atual ===
      '"'
    ) {

      estado =
        "string-dupla";

      continue;

    }


    if (
      atual ===
      "'"
    ) {

      estado =
        "string-simples";

      continue;

    }


    if (
      atual ===
      "`"
    ) {

      estado =
        "template";

      continue;

    }


    if (
      atual ===
        "/" &&
      proximo ===
        "/"
    ) {

      estado =
        "comentario-linha";

      i +=
        1;

      continue;

    }


    if (
      atual ===
        "/" &&
      proximo ===
        "*"
    ) {

      estado =
        "comentario-bloco";

      i +=
        1;

      continue;

    }


    /* ======================================
       CONTAR CHAVES REAIS
    ====================================== */

    if (
      atual ===
      "{"
    ) {

      profundidade +=
        1;

      continue;

    }


    if (
      atual ===
      "}"
    ) {

      profundidade -=
        1;


      if (
        profundidade ===
        0
      ) {

        return i;

      }

    }

  }


  throw new Error(
    "Não consegui localizar o fechamento da função."
  );

}


/* ========================================
   VALIDAÇÃO SIMPLES DO RESULTADO
======================================== */


function validarCodigoAtualizado(
  codigo
) {

  const requisitos = [

    "async function tentarBaixarCategoria",

    "marcadoresSegredoEncontrados",

    "faltantesParaTotalOficial",

    "segredosEfetivos",

    "totalEfetivo"

  ];


  const faltando =
    requisitos.filter(
      item =>
        !codigo.includes(
          item
        )
    );


  if (
    faltando.length
  ) {

    throw new Error(

      "Código atualizado não passou pela validação interna. Faltando: " +
      faltando.join(
        ", "
      )

    );

  }


  const quantidadeFuncoes =
    codigo
      .split(
        NOME_FUNCAO
      )
      .length -
    1;


  if (
    quantidadeFuncoes !==
    1
  ) {

    throw new Error(

      "Depois da alteração deveria existir exatamente uma tentarBaixarCategoria(), mas existem " +
      quantidadeFuncoes +
      "."

    );

  }


  return true;

}


/* ========================================
   MAIN
======================================== */


async function main() {

  console.log(
    "\n========================================"
  );


  console.log(
    "CORREÇÃO ROBUSTA — CONTAGEM 903 V2"
  );


  console.log(
    "========================================\n"
  );


  /* ======================================
     ARQUIVO EXISTE?
  ====================================== */


  if (
    !fs.existsSync(
      ALVO
    )
  ) {

    throw new Error(

      "Não encontrei:\n" +
      ALVO

    );

  }


  const original =
    await fsp.readFile(
      ALVO,
      "utf8"
    );


  /* ======================================
     JÁ CORRIGIDO?
  ====================================== */


  if (
    original.includes(
      "marcadoresSegredoEncontrados"
    ) &&
    original.includes(
      "segredosEfetivos"
    )
  ) {

    console.log(
      "A correção V2 já parece estar aplicada."
    );


    console.log(
      ""
    );


    console.log(
      "Nenhuma alteração foi feita."
    );


    return;

  }


  /* ======================================
     LOCALIZAR A FUNÇÃO
  ====================================== */


  const {
    indiceNome,
    indiceChave
  } =
    encontrarInicioFuncao(
      original
    );


  const indiceFim =
    encontrarFimBloco(
      original,
      indiceChave
    );


  console.log(
    "Função tentarBaixarCategoria() localizada."
  );


  console.log(

    "Intervalo encontrado: " +
    indiceNome +
    " até " +
    indiceFim

  );


  /* ======================================
     MONTAR NOVO ARQUIVO
  ====================================== */


  const antes =
    original.slice(
      0,
      indiceNome
    );


  const depois =
    original.slice(
      indiceFim +
      1
    );


  const atualizado =
    antes +
    NOVA_FUNCAO +
    depois;


  validarCodigoAtualizado(
    atualizado
  );


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


    console.log(
      "Backup criado:"
    );


    console.log(
      "scripts/migrarBancoHissatsu903.antes-contagem-v4.mjs"
    );

  } else {

    console.log(
      "Backup anterior já existe e foi preservado."
    );

  }


  /* ======================================
     SALVAR
  ====================================== */


  await fsp.writeFile(
    ALVO,
    atualizado,
    "utf8"
  );


  console.log(
    ""
  );


  console.log(
    "CORREÇÃO APLICADA COM SUCESSO."
  );


  console.log(
    ""
  );


  console.log(
    "A nova regra é:"
  );


  console.log(
    ""
  );


  console.log(
    "faltantes = total oficial - nomes encontrados"
  );


  console.log(
    ""
  );


  console.log(
    "slots ocultos = min(faltantes, marcadores ???)"
  );


  console.log(
    ""
  );


  console.log(
    "Isso impede que ??? auxiliares sejam contados como novas Hissatsu."
  );


  console.log(
    ""
  );


  console.log(
    "Agora execute:"
  );


  console.log(
    ""
  );


  console.log(
    "node --check .\\scripts\\migrarBancoHissatsu903.mjs"
  );


  console.log(
    ""
  );


  console.log(
    "node .\\scripts\\migrarBancoHissatsu903.mjs --self-test"
  );


  console.log(
    ""
  );

}


/* ========================================
   ERRO
======================================== */


main()
  .catch(
    erro => {

      console.error(
        "\nERRO:"
      );


      console.error(
        erro?.stack ||
        erro
      );


      console.error(
        "\nNenhuma substituição deve ser considerada concluída se este corretor terminar com erro."
      );


      process.exitCode =
        1;

    }
  );
  
