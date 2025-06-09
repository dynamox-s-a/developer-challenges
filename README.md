# Dynamox Admin Panel

Sistema de gerenciamento de máquinas e pontos de monitoramento desenvolvido com Next.js, TypeScript e Material UI 5.

## Funcionalidades

### ✅ Gerenciamento de Máquinas
- Criar máquinas com nome e tipo (Pump ou Fan)
- Editar máquinas existentes
- Excluir máquinas
- Listar todas as máquinas

### ✅ Pontos de Monitoramento e Sensores
- Criar pontos de monitoramento vinculados a máquinas
- Associar sensores aos pontos (TcAg, TcAs, HF+)
- **Regra de negócio**: Sensores TcAg e TcAs não permitidos para máquinas Pump
- Tabela paginada (5 itens por página)
- Ordenação por qualquer coluna (ascendente/descendente)
- Excluir pontos de monitoramento

### ✅ Interface
- Layout responsivo
- Notificações de sucesso/erro
- Confirmação antes de excluir
- Design limpo e profissional

## Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Material UI 5** - Biblioteca de componentes
- **Axios** - Cliente HTTP
- **json-server** - Mock API

## Como Executar

1. **Instalar dependências:**
\`\`\`bash
npm install
\`\`\`
ou
\`\`\`bash
yarn install
\`\`\`

2. **Instalar json-server globalmente (se necessário):**
\`\`\`bash
npm install -g json-server
\`\`\`

3. **Iniciar o json-server (backend mock):**
\`\`\`bash
npm run json-server
\`\`\`
Ou diretamente:
\`\`\`bash
npx json-server --watch db.json --port 3001
\`\`\`

4. **Em outro terminal, iniciar a aplicação:**
\`\`\`bash
npm run dev
\`\`\`
Ou
\`\`\`bash
yarn dev
\`\`\`

5. **Acessar:**
- Aplicação: http://localhost:3000
- API Mock: http://localhost:3001
- Dados: http://localhost:3001/machines e http://localhost:3001/monitoring-points

## Estrutura do Projeto

\`\`\`
├── app/                    # Páginas Next.js
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página inicial
│   └── globals.css        # Estilos globais
├── components/            # Componentes React
│   ├── MachineList.tsx    # Lista de máquinas
│   ├── MonitoringPointDialog.tsx  # Dialog para criar pontos
│   ├── MonitoringPointsTable.tsx  # Tabela de pontos
│   └── SafeTableContainer.tsx     # Container seguro para tabelas
├── services/             # Chamadas API
│   └── api.ts            # Cliente HTTP
├── types/                # Tipos TypeScript
│   └── index.ts          # Definições de tipos
├── lib/                  # Utilitários
│   └── theme.ts          # Tema Material UI
└── db.json              # Dados mock para json-server
\`\`\`

## Dados Iniciais

O arquivo `db.json` contém dados de exemplo:

### Máquinas
- **Bomba Principal** (tipo: Pump)
- **Ventilador Industrial** (tipo: Fan)

### Pontos de Monitoramento
- **Ponto B2** vinculado ao Ventilador Industrial com sensor TcAs

## Endpoints da API

O json-server cria automaticamente os seguintes endpoints:

### Máquinas
- `GET /machines` - Listar máquinas
- `POST /machines` - Criar máquina
- `PUT /machines/:id` - Atualizar máquina
- `DELETE /machines/:id` - Excluir máquina

### Pontos de Monitoramento
- `GET /monitoring-points` - Listar pontos
- `POST /monitoring-points` - Criar ponto
- `DELETE /monitoring-points/:id` - Excluir ponto

## Tipos de Dados

### Machine
\`\`\`typescript
interface Machine {
  id: string
  name: string
  type: "Pump" | "Fan"
}
\`\`\`

### MonitoringPoint
\`\`\`typescript
interface MonitoringPoint {
  id: string
  name: string
  machineId: string
  sensorModel: "TcAg" | "TcAs" | "HF+"
}
\`\`\`

## Regras de Negócio

1. **Validação de Sensores**: Sensores TcAg e TcAs não podem ser associados a máquinas do tipo Pump
2. **Paginação**: Tabela de pontos de monitoramento limitada a 5 registros por página
3. **Ordenação**: Possível ordenar por qualquer coluna da tabela
4. **Exclusão**: Confirmação obrigatória antes de excluir itens

## Testando a API

Você pode testar os endpoints diretamente:

\`\`\`bash
# Listar máquinas
curl http://localhost:3001/machines

# Listar pontos de monitoramento
curl http://localhost:3001/monitoring-points

# Criar nova máquina
curl -X POST http://localhost:3001/machines \
  -H "Content-Type: application/json" \
  -d '{"name": "Nova Máquina", "type": "Fan"}'
\`\`\`

## Características Técnicas

- **Client-side apenas**: Todos os componentes são client-side
- **Estado local**: Gerenciamento de estado com React hooks (useState/useEffect)
- **Responsivo**: Layout adaptável para diferentes tamanhos de tela
- **Feedback visual**: Loading states e notificações para melhor UX
- **Validação**: Validações client-side para melhor experiência do usuário
- **Tratamento de erros**: Notificações de erro para falhas na API
