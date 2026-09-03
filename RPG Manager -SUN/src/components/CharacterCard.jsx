import React from "react";

import Avatar from "./Avatar.jsx";


function CharacterCard({

  ficha,

  onAbrir,

  onExcluir

}) {

  return (

    <div className="character-card">


      {/* ========================================
          AVATAR
      ======================================== */}

      <Avatar
        imagem={
          ficha.imagem
        }
      />


      {/* ========================================
          INFORMAÇÕES
      ======================================== */}

      <div className="character-info">

        <h2>
          {ficha.nome}
        </h2>


        <p>

          Nível {ficha.nivel}

          {" • "}

          {ficha.posicao}

        </p>


        {/* ========================================
            STATUS RÁPIDO
        ======================================== */}

        <div className="stats">

          <span>

            ❤️ {
              ficha.vida
            }/
            {
              ficha.vidaMax
            }

          </span>


          <span>

            ⚡ {
              ficha.tp
            }/
            {
              ficha.tpMax
            }

          </span>


          <span>

            🔥 {
              ficha.momentum ?? 0
            }/10

          </span>

        </div>


        {/* ========================================
            AÇÕES
        ======================================== */}

        <div
          style={{
            display:
              "flex",

            gap:
              "10px",

            flexWrap:
              "wrap"
          }}
        >

          <button
            type="button"

            className="open-button"

            onClick={
              onAbrir
            }
          >

            ABRIR

          </button>


          <button
            type="button"

            className="delete-button"

            onClick={
              onExcluir
            }
          >

            EXCLUIR

          </button>

        </div>

      </div>

    </div>

  );

}


export default CharacterCard;