import {
  normalizarImagemReferencia
} from "./bancoHissatsuEstrutura.js";


function texto(valor) {
  return String(
    valor ?? ""
  ).trim();
}


/* ========================================
   COMPLEMENTOS DE IMAGEM

   Responsabilidade:
   - complementar uma Hissatsu existente;
   - preservar o mesmo ID;
   - preencher / mapear imagem de referência
     sem duplicar a técnica.

   Observação:
   - se "url" estiver vazia, ainda assim o lote
     pode registrar a fonte pesquisada;
   - isso permite separar:
       dado principal
       x
       curadoria visual
======================================== */

export function criarComplementoImagemHissatsu({
  id,
  imagemReferencia = null
}) {
  const imagemPronta =
    normalizarImagemReferencia(
      imagemReferencia
    );

  return {
    id: texto(id),

    imagem:
      imagemPronta.url,

    imagemReferencia:
      imagemPronta
  };
}