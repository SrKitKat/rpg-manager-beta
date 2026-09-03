import React from "react";


/* ========================================
   STATUS BOX
======================================== */

function StatusBox({

  titulo,

  atual,

  maximo,

  calcularPorcentagem,

  alterar

}) {

  const porcentagem =
    calcularPorcentagem(
      atual,
      maximo
    );


  return (

    <div className="status-box">

      <h3>
        {titulo}
      </h3>


      <strong>
        {atual}/{maximo}
      </strong>


      <div className="status-bar">

        <div
          className="status-bar-fill"

          style={{
            width:
              `${porcentagem}%`
          }}
        />

      </div>


      <p className="status-percentage">

        {porcentagem.toFixed(0)}%

      </p>


      <div className="buttons">

        <button
          type="button"

          onClick={() =>
            alterar(-10)
          }
        >
          -10
        </button>


        <button
          type="button"

          onClick={() =>
            alterar(-1)
          }
        >
          -1
        </button>


        <button
          type="button"

          onClick={() =>
            alterar(1)
          }
        >
          +1
        </button>


        <button
          type="button"

          onClick={() =>
            alterar(10)
          }
        >
          +10
        </button>

      </div>

    </div>

  );

}


export default StatusBox;