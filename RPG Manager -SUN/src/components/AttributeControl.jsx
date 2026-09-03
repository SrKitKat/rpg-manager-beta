import React, {
  useEffect,
  useState
} from "react";


/* ========================================
   CONTROLE DE ATRIBUTO
======================================== */

function AttributeControl({

  nome,

  valor,

  onDefinir

}) {


  /* ========================================
     VALOR TEMPORÁRIO DO CAMPO
  ======================================== */

  const [
    texto,
    setTexto
  ] = useState(
    String(
      valor ?? 0
    )
  );


  const [
    editando,
    setEditando
  ] = useState(false);


  /* ========================================
     SINCRONIZAR COM O VALOR DA FICHA
  ======================================== */

  useEffect(() => {

    if (
      editando
    ) {

      return;

    }


    setTexto(
      String(
        valor ?? 0
      )
    );

  }, [
    valor,
    editando
  ]);


  /* ========================================
     COMEÇAR EDIÇÃO
  ======================================== */

  function iniciarEdicao(
    evento
  ) {

    setEditando(
      true
    );


    /*
      Seleciona o conteúdo inteiro.

      Exemplo:
      25 → toca → digita 30
      substitui diretamente.
    */

    evento
      .currentTarget
      .select();

  }


  /* ========================================
     DIGITAR
  ======================================== */

  function alterarTexto(
    evento
  ) {

    const novoTexto =
      evento.target.value;


    /*
      Campo vazio é permitido
      enquanto o usuário está digitando.
    */

    if (
      novoTexto === ""
    ) {

      setTexto("");

      return;

    }


    /*
      Somente números inteiros positivos.
    */

    if (
      /^\d+$/.test(
        novoTexto
      )
    ) {

      setTexto(
        novoTexto
      );

    }

  }


  /* ========================================
     CONFIRMAR VALOR
  ======================================== */

  function confirmarValor() {

    /*
      Se o usuário deixar vazio,
      consideramos zero.
    */

    const numero =
      texto === ""
        ? 0
        : Number(texto);


    const valorFinal =
      Number.isNaN(numero)
        ? 0
        : Math.max(
            0,
            numero
          );


    setTexto(
      String(
        valorFinal
      )
    );


    setEditando(
      false
    );


    onDefinir(
      valorFinal
    );

  }


  /* ========================================
     ENTER
  ======================================== */

  function verificarEnter(
    evento
  ) {

    if (
      evento.key === "Enter"
    ) {

      evento
        .currentTarget
        .blur();

    }

  }


  /* ========================================
     BOTÕES RÁPIDOS
  ======================================== */

  function usarBotao(
    quantidade
  ) {

    const atual =
      Number(valor) || 0;


    const novoValor =
      Math.max(
        0,
        atual + quantidade
      );


    setTexto(
      String(
        novoValor
      )
    );


    setEditando(
      false
    );


    onDefinir(
      novoValor
    );

  }


  return (

    <div className="attribute attribute-clean">


      {/* ========================================
          PARTE SUPERIOR
      ======================================== */}

      <div className="attribute-top">


        <span className="attribute-name">

          {nome.toUpperCase()}

        </span>


        <input
          className="attribute-value-input"

          type="text"

          inputMode="numeric"

          value={
            texto
          }

          onFocus={
            iniciarEdicao
          }

          onChange={
            alterarTexto
          }

          onBlur={
            confirmarValor
          }

          onKeyDown={
            verificarEnter
          }

          autoComplete="off"

          spellCheck="false"

          aria-label={
            `Valor de ${nome}`
          }
        />

      </div>


      {/* ========================================
          BOTÕES
      ======================================== */}

      <div className="attribute-actions">


        <button
          type="button"

          onClick={() =>
            usarBotao(-5)
          }
        >
          -5
        </button>


        <button
          type="button"

          onClick={() =>
            usarBotao(-1)
          }
        >
          −
        </button>


        <button
          type="button"

          onClick={() =>
            usarBotao(1)
          }
        >
          +
        </button>


        <button
          type="button"

          onClick={() =>
            usarBotao(5)
          }
        >
          +5
        </button>


      </div>

    </div>

  );

}


export default AttributeControl;
