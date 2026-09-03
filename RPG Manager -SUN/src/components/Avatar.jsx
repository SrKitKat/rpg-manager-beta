import React from "react";


/* ========================================
   AVATAR DO PERSONAGEM
======================================== */

function Avatar({

  imagem,

  grande = false

}) {

  return (

    <div
      className={
        grande
          ? "character-icon large"
          : "character-icon"
      }
    >

      {imagem ? (

        <img
          src={imagem}

          alt="Avatar do personagem"

          className=
            "character-avatar"
        />

      ) : (

        <span>
          ⚡
        </span>

      )}

    </div>

  );

}


export default Avatar;