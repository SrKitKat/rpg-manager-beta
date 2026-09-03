export const FAMILIAS_ARQUETIPO = {
  INTELECTUAL:
    "intelectual",

  INSPIRADOR:
    "inspirador",

  EXPLOSIVO:
    "explosivo",

  CRIATIVO:
    "criativo",

  COMPETITIVO:
    "competitivo"
};


export const FAMILIAS_TALENTO = {
  OFENSIVO:
    "ofensivo",

  DEFENSIVO:
    "defensivo",

  MEIO_CAMPO:
    "meio-campo",

  GOLEIRO:
    "goleiro"
};


/* ========================================
   ARQUÉTIPOS
======================================== */

export const arquetiposSuperOnze = [

  {
    id: "prodigio",

    nome: "Prodígio",

    icone: "⚡",

    familia:
      FAMILIAS_ARQUETIPO
        .EXPLOSIVO,

    frase:
      "Existem jogadores excelentes. Depois existem aqueles que mudam o futebol.",

    exemplos: [
      "Endou",
      "Gouenji",
      "Kidou",
      "Fubuki"
    ],

    passiva: {
      nome:
        "Brilho Natural",

      descricao:
        "Uma vez por partida, pode transformar um fracasso em sucesso parcial."
    },

    especializacao: [
      "Aprende Hissatsu mais rapidamente.",
      "Evolui técnicas com mais facilidade."
    ]
  },


  {
    id: "estrategista",

    nome: "Estrategista",

    icone: "🧠",

    familia:
      FAMILIAS_ARQUETIPO
        .INTELECTUAL,

    frase:
      "A partida já terminou. Só falta os outros perceberem.",

    exemplos: [
      "Kidou",
      "Fudou",
      "Otomura"
    ],

    passiva: {
      nome:
        "Xadrez em Campo",

      descricao:
        "Recebe bônus em Leitura de Campo, Roubo de Ritmo e Planejamento."
    },

    especializacao: [
      "Manipular o jogo."
    ]
  },


  {
    id: "protetor",

    nome: "Protetor",

    icone: "🛡️",

    familia:
      FAMILIAS_ARQUETIPO
        .INSPIRADOR,

    frase:
      "Enquanto eu estiver aqui... ninguém toca nos meus companheiros.",

    exemplos: [
      "Kabeyama",
      "Endou",
      "Domon"
    ],

    passiva: {
      nome:
        "Espírito Guardião",

      descricao:
        "Sempre que proteger um aliado, recupera um pouco de Ritmo."
    },

    especializacao: [
      "Defesa.",
      "Cobertura.",
      "Hissatsu cooperativas."
    ]
  },


  {
    id: "guerreiro",

    nome: "Guerreiro",

    icone: "🔥",

    familia:
      FAMILIAS_ARQUETIPO
        .EXPLOSIVO,

    frase:
      "Eu nunca recuo.",

    exemplos: [
      "Someoka",
      "Sakuma",
      "Kazemaru"
    ],

    passiva: {
      nome:
        "Determinação Absoluta",

      descricao:
        "Quanto mais desgastado, mais perigoso se torna."
    },

    especializacao: [
      "Momentum.",
      "Superação."
    ]
  },


  {
    id: "genio",

    nome: "Gênio",

    icone: "🎨",

    familia:
      FAMILIAS_ARQUETIPO
        .INTELECTUAL,

    frase:
      "Ninguém entende como ele fez aquilo.",

    exemplos: [
      "Aphrodi",
      "Shuu",
      "Taiyou"
    ],

    passiva: {
      nome:
        "Inspiração",

      descricao:
        "Pode criar soluções inesperadas. O Mestre pode conceder vantagens para ações extremamente criativas."
    },

    especializacao: [
      "Jogadas improváveis."
    ]
  },


  {
    id: "motor",

    nome: "Motor",

    icone: "⚙️",

    familia:
      FAMILIAS_ARQUETIPO
        .COMPETITIVO,

    frase:
      "Ele nunca para.",

    exemplos: [
      "Ichinose",
      "Kazemaru",
      "Shindou"
    ],

    passiva: {
      nome:
        "Energia Inesgotável",

      descricao:
        "Recupera Ritmo mais rapidamente."
    },

    especializacao: [
      "Movimento.",
      "Apoio."
    ]
  },


  {
    id: "lider",

    nome: "Líder",

    icone: "👑",

    familia:
      FAMILIAS_ARQUETIPO
        .INSPIRADOR,

    frase:
      "A equipe acredita porque ele acredita.",

    exemplos: [
      "Endou",
      "Kidou",
      "Tenma"
    ],

    passiva: {
      nome:
        "Inspirar",

      descricao:
        "Pode aumentar o Ritmo da Equipe."
    },

    especializacao: [
      "Laços.",
      "Cooperação."
    ]
  },


  {
    id: "duelista",

    nome: "Duelista",

    icone: "⚔️",

    familia:
      FAMILIAS_ARQUETIPO
        .COMPETITIVO,

    frase:
      "Eu quero enfrentar o melhor.",

    exemplos: [
      "Fubuki",
      "Tsurugi",
      "Edgar"
    ],

    passiva: {
      nome:
        "Desafio Aceito",

      descricao:
        "Ao enfrentar diretamente um adversário, recebe bônus crescentes."
    },

    especializacao: [
      "Confrontos individuais."
    ]
  },


  {
    id: "tecnico",

    nome: "Técnico",

    icone: "🧩",

    familia:
      FAMILIAS_ARQUETIPO
        .INTELECTUAL,

    frase:
      "Não preciso fazer o impossível. Preciso fazer o necessário perfeitamente.",

    passiva: {
      nome:
        "Fundamentos Perfeitos",

      descricao:
        "Recebe vantagem quando uma ação depende principalmente de precisão, controle e execução técnica."
    },

    especializacao: [
      "Controle de bola.",
      "Precisão.",
      "Execução consistente."
    ]
  },


  {
    id: "heroi",

    nome: "Herói",

    icone: "🌟",

    familia:
      FAMILIAS_ARQUETIPO
        .INSPIRADOR,

    frase:
      "Quando todo mundo pensa em desistir, é quando eu mais preciso continuar.",

    passiva: {
      nome:
        "Momento Heroico",

      descricao:
        "Em momentos decisivos de desvantagem ou grande pressão, pode receber uma vantagem narrativa para tentar mudar o rumo da partida."
    },

    especializacao: [
      "Viradas.",
      "Momentos decisivos.",
      "Inspirar esperança."
    ]
  },


  {
    id: "instintivo",

    nome: "Instintivo",

    icone: "🐾",

    familia:
      FAMILIAS_ARQUETIPO
        .EXPLOSIVO,

    frase:
      "Eu não pensei. Meu corpo simplesmente se moveu.",

    passiva: {
      nome:
        "Reflexo Selvagem",

      descricao:
        "Pode receber vantagem em reações imediatas quando não há tempo para planejar ou analisar a situação."
    },

    especializacao: [
      "Reflexos.",
      "Reações inesperadas.",
      "Decisões por instinto."
    ]
  },


  {
    id: "improvisador",

    nome: "Improvisador",

    icone: "🎲",

    familia:
      FAMILIAS_ARQUETIPO
        .CRIATIVO,

    frase:
      "O plano deu errado? Melhor ainda.",

    passiva: {
      nome:
        "Plano B",

      descricao:
        "Quando uma estratégia preparada falha ou a situação muda inesperadamente, pode adaptar a jogada e tentar uma solução alternativa com maior liberdade."
    },

    especializacao: [
      "Criatividade.",
      "Recuperação de erros.",
      "Jogadas não planejadas."
    ]
  },


  {
    id: "showman",

    nome: "Showman",

    icone: "🎭",

    familia:
      FAMILIAS_ARQUETIPO
        .CRIATIVO,

    frase:
      "Se todo mundo está olhando, então é melhor fazer valer a pena.",

    passiva: {
      nome:
        "Roubar a Cena",

      descricao:
        "Jogadas especialmente ousadas, estilosas ou marcantes podem gerar Ritmo ou impacto narrativo adicional quando forem bem-sucedidas."
    },

    especializacao: [
      "Estilo.",
      "Jogadas espetaculares.",
      "Impacto sobre público e adversários."
    ]
  },


  {
    id: "adaptavel",

    nome: "Adaptável",

    icone: "🔄",

    familia:
      FAMILIAS_ARQUETIPO
        .CRIATIVO,

    frase:
      "Se uma coisa não funciona, eu mudo.",

    passiva: {
      nome:
        "Aprendizado em Campo",

      descricao:
        "Após enfrentar repetidamente uma estratégia, adversário ou situação, pode receber vantagem para lidar com aquilo de uma forma diferente."
    },

    especializacao: [
      "Versatilidade.",
      "Aprendizado durante a partida.",
      "Mudança de função."
    ]
  },


  {
    id: "predador",

    nome: "Predador",

    icone: "🐺",

    familia:
      FAMILIAS_ARQUETIPO
        .COMPETITIVO,

    frase:
      "Uma fraqueza é tudo que eu preciso.",

    passiva: {
      nome:
        "Faro de Sangue",

      descricao:
        "Ao perceber uma fraqueza clara, desgaste ou abertura em um adversário, recebe vantagem ao pressionar diretamente esse ponto."
    },

    especializacao: [
      "Explorar fraquezas.",
      "Pressão constante.",
      "Finalização de confrontos."
    ]
  }

];


/* ========================================
   TALENTOS — ATACANTE / OFENSIVO
======================================== */

const talentosOfensivos = [

  {
    id: "artilheiro-nato",
    numero: 1,
    nome: "Artilheiro Nato",
    icone: "🎯",
    frase: "Meu objetivo é um só: marcar.",
    descricao:
      "Recebe bônus em testes de Finalização sempre que chutar dentro da área.",
    especialidade:
      "Finalizações curtas."
  },

  {
    id: "finalizador-cirurgico",
    numero: 2,
    nome: "Finalizador Cirúrgico",
    icone: "🎯",
    frase:
      "Força não ganha jogos. Precisão ganha.",
    descricao:
      "Pode trocar parte da Potência por Precisão ao realizar um chute."
  },

  {
    id: "cacador-de-espacos",
    numero: 3,
    nome: "Caçador de Espaços",
    icone: "🦅",
    frase:
      "Você nem percebe quando eu desapareço da marcação.",
    descricao:
      "Recebe bônus para encontrar espaços livres entre defensores."
  },

  {
    id: "velocista",
    numero: 4,
    nome: "Velocista",
    icone: "⚡",
    frase:
      "Se eu passar, ninguém mais me alcança.",
    descricao:
      "Após vencer um drible ou disputa de velocidade, recebe movimento adicional."
  },

  {
    id: "acrobata",
    numero: 5,
    nome: "Acrobata",
    icone: "🎭",
    frase:
      "Quanto mais impossível o chute... melhor.",
    descricao:
      "Recebe bônus em bicicletas, chutes aéreos e finalizações acrobáticas."
  },

  {
    id: "demolidor",
    numero: 6,
    nome: "Demolidor",
    icone: "💥",
    frase:
      "Não importa quem esteja na frente.",
    descricao:
      "Aumenta a potência de chutes realizados de média distância, porém reduz um pouco a precisão."
  },

  {
    id: "mestre-das-finalizacoes",
    numero: 7,
    nome:
      "Mestre das Finalizações",
    icone: "🎯",
    descricao:
      "Recebe bônus ao finalizar após um passe, uma tabela ou uma assistência."
  },

  {
    id: "atacante-fantasma",
    numero: 8,
    nome: "Atacante Fantasma",
    icone: "🦊",
    descricao:
      "Sempre que sair do campo de visão do marcador, pode realizar um teste para aparecer em posição vantajosa."
  },

  {
    id: "predador-da-area",
    numero: 9,
    nome: "Predador da Área",
    icone: "🔥",
    descricao:
      "Enquanto estiver dentro da área adversária, recebe bônus em rebotes, bolas divididas e segundas bolas."
  },

  {
    id: "especialista-contra-ataques",
    numero: 10,
    nome:
      "Especialista em Contra-Ataques",
    icone: "🌪️",
    descricao:
      "Após recuperar a posse, recebe bônus de velocidade e aceleração durante a jogada."
  },

  {
    id: "especialista-tabelas",
    numero: 11,
    nome:
      "Especialista em Tabelas",
    icone: "⚽",
    descricao:
      "Sempre que realizar uma tabela bem-sucedida, recebe bônus no próximo drible ou finalização."
  },

  {
    id: "leitura-do-goleiro",
    numero: 12,
    nome: "Leitura do Goleiro",
    icone: "🧠",
    descricao:
      "Antes de finalizar, pode realizar um teste de Leitura de Campo. Em caso de sucesso, descobre uma fraqueza momentânea do goleiro."
  },

  {
    id: "pressao-ofensiva",
    numero: 13,
    nome: "Pressão Ofensiva",
    icone: "⚡",
    descricao:
      "Mesmo sem a bola, pressiona constantemente a saída adversária e recebe bônus para recuperar bolas no campo ofensivo."
  },

  {
    id: "parceiro-ideal",
    numero: 14,
    nome: "Parceiro Ideal",
    icone: "🤝",
    descricao:
      "Especialista em Hissatsu Cooperativas. Reduz o custo de Ritmo dessas técnicas e melhora a sincronização."
  },

  {
    id: "espirito-inquebravel",
    numero: 15,
    nome:
      "Espírito Inquebrável",
    icone: "❤️",
    descricao:
      "Quando perder uma disputa importante, ganha um pequeno bônus temporário para a próxima tentativa de finalização."
  }

];


/* ========================================
   TALENTOS — ZAGUEIRO / DEFENSIVO
======================================== */

const talentosDefensivos = [

  {
    id: "muralha-inabalavel",
    numero: 1,
    nome: "Muralha Inabalável",
    icone: "🧱",
    frase:
      "Nada passa por mim.",
    descricao:
      "Quando um adversário tenta ultrapassá-lo com um drible, recebe bônus na disputa defensiva.",
    especialidade:
      "Marcação Individual."
  },

  {
    id: "interceptador-nato",
    numero: 2,
    nome: "Interceptador Nato",
    icone: "🧠",
    frase:
      "Eu não preciso roubar a bola... eu sei onde ela vai estar.",
    descricao:
      "Recebe bônus em testes de Interceptação e Leitura de Campo para cortar passes.",
    especialidade:
      "Antecipação."
  },

  {
    id: "corpo-de-ferro",
    numero: 3,
    nome: "Corpo de Ferro",
    icone: "🛡️",
    frase:
      "Pode tentar passar... você vai bater em uma parede.",
    descricao:
      "Sempre que disputar fisicamente uma bola, recebe bônus baseado na Constituição."
  },

  {
    id: "guardiao-da-area",
    numero: 4,
    nome: "Guardião da Área",
    icone: "🏰",
    descricao:
      "Dentro da grande área, recebe bônus para bloquear chutes e reduz parcialmente a potência de Hissatsus ofensivas."
  },

  {
    id: "ultimo-homem",
    numero: 5,
    nome: "Último Homem",
    icone: "🚧",
    descricao:
      "Quando for o último defensor antes do goleiro, ganha bônus nas ações defensivas e aumenta sua resistência mental."
  },

  {
    id: "cacador-de-atacantes",
    numero: 6,
    nome:
      "Caçador de Atacantes",
    icone: "🎯",
    descricao:
      "Escolha um atacante no início da partida. Enquanto o estiver marcando, recebe bônus em marcação e previsão de movimentos."
  },

  {
    id: "especialista-carrinhos",
    numero: 7,
    nome:
      "Especialista em Carrinhos",
    icone: "🦵",
    descricao:
      "Pode tentar recuperar a bola com carrinhos de forma mais eficiente, reduzindo a dependência de faltas."
  },

  {
    id: "dominador-aereo",
    numero: 8,
    nome: "Dominador Aéreo",
    icone: "🦅",
    descricao:
      "Recebe bônus em cabeceios defensivos, disputas aéreas e escanteios."
  },

  {
    id: "leitura-defensiva",
    numero: 9,
    nome: "Leitura Defensiva",
    icone: "👁️",
    descricao:
      "Ao perceber uma jogada adversária, pode realizar Leitura de Campo para prever sua intenção."
  },

  {
    id: "capitao-da-defesa",
    numero: 10,
    nome: "Capitão da Defesa",
    icone: "📢",
    descricao:
      "Aliados próximos recebem pequenos bônus defensivos."
  },

  {
    id: "cobertura-perfeita",
    numero: 11,
    nome: "Cobertura Perfeita",
    icone: "🔄",
    descricao:
      "Quando um companheiro falha na marcação, pode gastar Ritmo para assumir a cobertura imediatamente."
  },

  {
    id: "cortador-de-linhas",
    numero: 12,
    nome: "Cortador de Linhas",
    icone: "✂️",
    descricao:
      "Recebe bônus ao bloquear passes longos e destruir jogadas antes de se desenvolverem."
  },

  {
    id: "resistencia-absoluta",
    numero: 13,
    nome:
      "Resistência Absoluta",
    icone: "🛡️",
    descricao:
      "Ao sofrer uma Hissatsu defensiva ou colisão física, reduz parte do dano ou desgaste."
  },

  {
    id: "defensor-impiedoso",
    numero: 14,
    nome: "Defensor Impiedoso",
    icone: "⚔️",
    descricao:
      "Quanto maior o Momentum do adversário, maior o bônus recebido para enfrentá-lo."
  },

  {
    id: "pilar-da-equipe",
    numero: 15,
    nome: "Pilar da Equipe",
    icone: "❤️",
    descricao:
      "Quando sua equipe está perdendo, concede bônus de Ritmo aos companheiros próximos."
  }

];


/* ========================================
   TALENTOS — MEIO-CAMPISTA
======================================== */

const talentosMeioCampo = [

  {
    id: "maestro",
    numero: 1,
    nome: "Maestro",
    icone: "🧠",
    frase:
      "O jogo acontece no meu tempo.",
    descricao:
      "Ao iniciar uma jogada ofensiva, pode gastar 1 ponto de Ritmo para conceder bônus à próxima ação de um aliado."
  },

  {
    id: "leitor-do-campo",
    numero: 2,
    nome: "Leitor do Campo",
    icone: "👁️",
    frase:
      "Eu já vi essa jogada antes mesmo dela acontecer.",
    descricao:
      "Recebe bônus em testes de Leitura de Campo para antecipar movimentações, passes e espaços."
  },

  {
    id: "passe-milimetrico",
    numero: 3,
    nome: "Passe Milimétrico",
    icone: "🎯",
    frase:
      "A bola chega exatamente onde precisa.",
    descricao:
      "Recebe bônus em passes longos, inversões de jogo e assistências."
  },

  {
    id: "regente",
    numero: 4,
    nome: "Regente",
    icone: "⚽",
    frase:
      "Cada jogador é uma peça da minha estratégia.",
    descricao:
      "Uma vez por rodada, pode reorganizar a movimentação de um aliado próximo sem custo adicional de Ritmo."
  },

  {
    id: "mudanca-de-ritmo",
    numero: 5,
    nome: "Mudança de Ritmo",
    icone: "⚡",
    frase:
      "Agora acelera!",
    descricao:
      "Após um passe bem-sucedido, pode gastar Ritmo para aumentar temporariamente a velocidade de um aliado."
  },

  {
    id: "criador-de-espacos",
    numero: 6,
    nome: "Criador de Espaços",
    icone: "🎨",
    frase:
      "Se não existe um caminho... eu crio um.",
    descricao:
      "Recebe bônus para abrir linhas de passe e desmontar marcações."
  },

  {
    id: "motor-da-equipe",
    numero: 7,
    nome: "Motor da Equipe",
    icone: "🔄",
    frase:
      "Enquanto eu correr, ninguém para.",
    descricao:
      "Ao completar uma sequência de ações bem-sucedidas, recupera uma pequena quantidade de Ritmo Individual."
  },

  {
    id: "box-to-box",
    numero: 8,
    nome: "Box-to-Box",
    icone: "🏃",
    frase:
      "Meu lugar é o campo inteiro.",
    descricao:
      "Reduz o custo de Ritmo ao alternar entre funções ofensivas e defensivas durante a mesma jogada."
  },

  {
    id: "elo-da-equipe",
    numero: 9,
    nome: "Elo da Equipe",
    icone: "🤝",
    frase:
      "Sozinhos somos bons. Juntos somos imparáveis.",
    descricao:
      "Aliados próximos recebem um pequeno bônus em testes cooperativos."
  },

  {
    id: "primeiro-combate",
    numero: 10,
    nome: "Primeiro Combate",
    icone: "🛡️",
    frase:
      "Antes do zagueiro, existe eu.",
    descricao:
      "Recebe bônus ao tentar recuperar a posse ainda no meio-campo."
  },

  {
    id: "manipulador",
    numero: 11,
    nome: "Manipulador",
    icone: "🎭",
    frase:
      "Vocês estão jogando exatamente como eu queria.",
    descricao:
      "Após um teste bem-sucedido de Leitura de Campo, pode induzir um erro tático ou abrir um espaço."
  },

  {
    id: "coracao-do-time",
    numero: 12,
    nome: "Coração do Time",
    icone: "❤️",
    frase:
      "Quando todos desanimam... eu continuo.",
    descricao:
      "Quando a equipe perder Ritmo ou Momentum, pode gastar Ritmo Individual para recuperar parte do Ritmo da Equipe."
  },

  {
    id: "capitao-nato",
    numero: 13,
    nome: "Capitão Nato",
    icone: "📢",
    frase:
      "Continuem acreditando!",
    descricao:
      "Uma vez por partida, pode inspirar companheiros, concedendo bônus temporário em resistência mental e Controle Emocional."
  },

  {
    id: "roubo-de-ritmo",
    numero: 14,
    nome: "Roubo de Ritmo",
    icone: "🌀",
    frase:
      "Agora vocês jogam no meu tempo.",
    descricao:
      "Ao interceptar uma jogada importante, reduz parte do Ritmo inimigo e gera Ritmo para sua equipe."
  },

  {
    id: "olhos-do-maestro",
    numero: 15,
    nome: "Olhos do Maestro",
    icone: "🌟",
    frase:
      "Existe uma oportunidade... e só eu consegui enxergá-la.",
    descricao:
      "Antes de um passe decisivo, pode realizar Leitura de Campo. Em caso de sucesso, cria vantagem para a próxima ação ofensiva."
  }

];


/* ========================================
   TALENTOS — GOLEIRO
======================================== */

const talentosGoleiro = [

  {
    id: "muralha-intransponivel",
    numero: 1,
    nome:
      "Muralha Intransponível",
    icone: "🧱",
    frase:
      "Enquanto eu estiver aqui, o gol continuará fechado.",
    descricao:
      "Recebe bônus em defesas diretas contra finalizações comuns."
  },

  {
    id: "olhos-de-aguia",
    numero: 2,
    nome: "Olhos de Águia",
    icone: "🦅",
    frase:
      "Antes da bola sair do pé dele... eu já sabia onde ela iria.",
    descricao:
      "Recebe bônus em Leitura de Campo para prever lado, tipo e força de uma finalização."
  },

  {
    id: "reflexos-felinos",
    numero: 3,
    nome: "Reflexos Felinos",
    icone: "🐈",
    frase:
      "Um instante decide tudo.",
    descricao:
      "Recebe bônus em defesas à queima-roupa, rebotes e mudanças repentinas de direção."
  },

  {
    id: "leitor-de-atacantes",
    numero: 4,
    nome: "Leitor de Atacantes",
    icone: "👁️",
    descricao:
      "Após enfrentar o mesmo atacante algumas vezes, recebe bônus cumulativo nas próximas defesas contra ele."
  },

  {
    id: "espirito-do-capitao",
    numero: 5,
    nome: "Espírito do Capitão",
    icone: "👑",
    frase:
      "Não abaixem a cabeça!",
    descricao:
      "Ao realizar uma defesa importante, recupera parte do Ritmo da Equipe."
  },

  {
    id: "maos-firmes",
    numero: 6,
    nome: "Mãos Firmes",
    icone: "🧤",
    descricao:
      "Reduz drasticamente a chance de conceder rebotes."
  },

  {
    id: "punhos-de-aco",
    numero: 7,
    nome: "Punhos de Aço",
    icone: "👊",
    frase:
      "Se eu não consigo segurar... eu afasto.",
    descricao:
      "Ao optar por espalmar, envia a bola muito mais longe."
  },

  {
    id: "comandante-da-defesa",
    numero: 8,
    nome:
      "Comandante da Defesa",
    icone: "📢",
    descricao:
      "Recebe bônus ao coordenar posicionamento, marcação e organização da área. Aliados próximos recebem pequeno bônus defensivo."
  },

  {
    id: "inicio-perfeito",
    numero: 9,
    nome: "Início Perfeito",
    icone: "🚀",
    descricao:
      "Após defender, pode iniciar imediatamente um contra-ataque e recebe bônus em lançamentos."
  },

  {
    id: "guardiao-grande-area",
    numero: 10,
    nome:
      "Guardião da Grande Área",
    icone: "🏰",
    descricao:
      "Dentro da área, recebe bônus em suas ações defensivas."
  },

  {
    id: "crescer-na-pressao",
    numero: 11,
    nome: "Crescer na Pressão",
    icone: "🔥",
    descricao:
      "Quanto maior a potência do chute adversário, maior o bônus recebido."
  },

  {
    id: "inabalavel",
    numero: 12,
    nome: "Inabalável",
    icone: "🛡️",
    descricao:
      "Mesmo sofrendo um gol, recebe resistência mental e evita perda excessiva de Ritmo."
  },

  {
    id: "defensor-do-impossivel",
    numero: 13,
    nome:
      "Defensor do Impossível",
    icone: "🌟",
    descricao:
      "Uma vez por partida, pode tentar defender uma bola considerada praticamente indefensável, mesmo com grandes penalidades."
  },

  {
    id: "sincronia-defensiva",
    numero: 14,
    nome: "Sincronia Defensiva",
    icone: "🤝",
    descricao:
      "Sempre que um zagueiro bloquear parcialmente um chute, recebe bônus adicional para concluir a defesa."
  },

  {
    id: "ultima-esperanca",
    numero: 15,
    nome: "Última Esperança",
    icone: "❤️",
    frase:
      "Se ninguém conseguiu impedir... ainda existe eu.",
    descricao:
      "Quando toda a defesa falhar, recebe um bônus significativo na tentativa final de defesa."
  }

];


/* ========================================
   COLEÇÃO FINAL
======================================== */

export const talentosPosicionaisSuperOnze = {

  [FAMILIAS_TALENTO.OFENSIVO]:
    talentosOfensivos,


  [FAMILIAS_TALENTO.DEFENSIVO]:
    talentosDefensivos,


  [FAMILIAS_TALENTO.MEIO_CAMPO]:
    talentosMeioCampo,


  [FAMILIAS_TALENTO.GOLEIRO]:
    talentosGoleiro

};


/* ========================================
   MODELO GENÉRICO DE PROGRESSÃO

   Este arquivo descreve o conteúdo e a
   natureza das coleções.

   Regras específicas de criação como
   mínimo e máximo ficam em
   configCampanha.js.
======================================== */

export const colecoesProgressaoSuperOnze = [

  {
    id:
      "arquetipos",

    nome:
      "Arquétipos",

    singular:
      "Arquétipo",

    tipo:
      "caracteristica",

    permiteMultiplos:
      true,

    usaAfinidade:
      false
  },


  {
    id:
      "talentos-posicionais",

    nome:
      "Talentos Posicionais",

    singular:
      "Talento Posicional",

    tipo:
      "passiva",

    permiteMultiplos:
      true,

    usaAfinidade:
      true
  }

];