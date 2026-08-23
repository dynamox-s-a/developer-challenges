## Pré-requisitos

- Node.js `20.19+` ou `22.12+`
- npm

## Instalação

No diretório `dashboard`, instale as dependências:

```bash
npm install
```

## Executar em desenvolvimento

Use o comando abaixo para preparar o banco mock, iniciar a API local e subir o Vite:

```bash
npm run dev:full
```

Depois, abra:

```text
http://localhost:5173/data
```

Se o navegador abrir antes de a API mock estar pronta, atualize a página após aparecer a mensagem `JSON Server started on PORT :3001`.
