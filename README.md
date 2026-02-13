# Sensory Application UI/UX

## Sobre

Uma aplicação frontend utilizando das técnologias especificadas no desafio para a vaga de fullstack na Dynamox. Projeto focado em estruturação de dados e formatação dos mesmos através de mecanismos e componentes utilizando typescript e NextJS

## Estrutura do projeto

```sh
<root>
├── src/
│   ├── app/                    # App Router do Next.js (páginas e API)
│   │   ├── api/                # Rotas de API (backend)
│   │   │   ├── auth/           # Endpoints de autenticação (login, register)
│   │   │   ├── machine/        # CRUD de máquinas e sensores associados
│   │   │   ├── monitoring/     # Pontos de monitoramento e análises
│   │   │   ├── sensor/         # Gerenciamento de sensores
│   │   │   └── time-series/    # Dados de séries temporais
│   │   ├── auth/               # Páginas de login e registro
│   │   ├── dashboard/          # Página principal com visualizações
│   │   └── ...                 # Demais rotas e layouts
│   ├── components/             # Componentes React reutilizáveis
│   │   ├── ui/                # Componentes base (botões, inputs, cards)
│   │   ├── charts/            # Gráficos (Recharts)
│   │   ├── forms/             # Formulários complexos
│   │   └── layout/            # Header, Sidebar, etc.
│   ├── hooks/                 # Hooks customizados (integração com API)
│   ├── lib/                   # Configurações de serviços (MongoDB, auth)
│   ├── types/                 # Tipagens globais do TypeScript
│   └── utils/                 # Funções utilitárias (formatação, helpers)
├── public/                    # Arquivos estáticos (favicon, imagens)
├── .env.example               # Exemplo de variáveis de ambiente
├── next.config.ts            # Configuração do Next.js
├── tailwind.config.ts        # Configuração do Tailwind CSS
├── Dockerfile               # Configuração da imagem docker
├── docker-compose.yaml        # Configuração dos serviços de container docker
├── vercel.json               # Configuração para deploy na Vercel (opcional)
└── package.json
```

## Ferramentas

- Typescript
- NextJS
- React
- MongoDB

## Deploy Local
1. Instalar das dependencias (npm, yarn ou pnpm): `pnpm install.`
2. Configuração das variaveis de ambiente do banco de dados e autenticação.
3. Rodar em desenvolvimentoo: `pnpm run dev`
4. Rodar em produção: `pnpm run build | pnpm start`
5. Caso queira acessar a aplicação com maior facilidade: [clique aqui para entrar na aplicação!](https://fullstack-dynamox.vercel.app?_vercel_share=NupmsUzpJQt90nw5sVsHFxc5vWbwjLzL)

