# RPG Manager — SUN

Aplicação web para gerenciamento de campanhas, fichas, entidades e habilidades de RPG, com conteúdo especializado de Super Onze/Inazuma Eleven.

## Requisitos

- Node.js 22.x
- npm

## Comandos

```bash
npm ci
npm run dev
```

Validações disponíveis:

```bash
npm run lint
npm run build
npm run audit:catalog
npm run verify
```

O projeto ainda não possui uma suíte de testes automatizados. `npm run verify` executa o lint, o build de produção e a auditoria estrutural do catálogo oficial com 903 técnicas.

## Estrutura

```text
src/
├── app/                         # Componente raiz e estilos da aplicação
├── components/                  # Componentes compartilhados entre domínios
├── features/
│   ├── campanhas/               # Campanhas, configuração, dashboard e anotações
│   ├── entidades/               # NPCs, adversários, monstros e auxiliares
│   ├── fichas/                  # Criação, edição e visualização de fichas
│   └── habilidades/             # Biblioteca, mecânicas, requisitos e técnicas
│       └── data/                # Catálogo e composição do banco de Hissatsu
│           └── legacy/          # Versões históricas preservadas
├── assets/                      # Assets importados pelo código-fonte
├── styles/                      # Folha de estilos global
└── main.jsx                     # Ponto de entrada do React

public/                          # Assets servidos sem transformação pelo Vite
scripts/                         # Migração, curadoria e manutenção do catálogo
dados/                           # Entradas e relatórios de migrações
documentacao/                    # Relatórios e manifestos de curadoria
```

## Arquitetura e persistência

- React 19 com Vite 8.
- Aplicação exclusivamente cliente; não há API própria ou autenticação remota.
- O estado persistente usa `localStorage` e `sessionStorage`.
- As chaves e os formatos persistidos são contratos de compatibilidade e não devem ser renomeados sem migração.
- O catálogo Hissatsu é composto por módulos em `src/features/habilidades/data`.
- O deploy da SPA é configurado em `vercel.json`; arquivos de trabalho são excluídos por `.vercelignore`.

## Convenções de manutenção

- Código específico de um domínio deve permanecer dentro da respectiva pasta em `features`.
- Somente componentes realmente compartilhados devem ir para `components`.
- Dados históricos ficam em `data/legacy`; não devem ser importados pela aplicação ativa.
- Scripts que geram módulos precisam escrever em `src/features/habilidades/data`.
- Antes de alterar persistência, procure todas as ocorrências das constantes `CHAVE_*` e preserve compatibilidade com dados existentes.
- Execute `npm run verify` antes de publicar.

## Deploy

O build de produção é gerado em `dist`:

```bash
npm run build
```

As regras atuais da Vercel e o fallback de SPA estão preservados em `vercel.json`.
