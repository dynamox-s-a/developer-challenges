# 🛠️ Dynamox Admin Panel

Sistema de gerenciamento de máquinas e pontos de monitoramento desenvolvido com **Next.js**, **TypeScript** e **Material UI 5**.

## ✨ Funcionalidades

### ✅ Gerenciamento de Máquinas
- Criar máquinas com nome e tipo (Pump ou Fan)
- Editar e excluir máquinas existentes
- Listar todas as máquinas cadastradas

### ✅ Pontos de Monitoramento e Sensores
- Criar pontos de monitoramento vinculados a uma máquina
- Associar sensores aos pontos (TcAg, TcAs, HF+)
- **Regra de negócio:** Sensores TcAg e TcAs **não são permitidos** em máquinas do tipo **Pump**
- Listagem paginada (5 itens por página)
- Ordenação por qualquer coluna (ascendente e descendente)
- Exclusão de pontos com confirmação

### ✅ Interface e Experiência do Usuário
- Layout responsivo
- Notificações de sucesso e erro
- Confirmação antes de exclusões
- Visual moderno e limpo com Material UI

## 🧰 Tecnologias Utilizadas

- **Next.js 14** – Framework React para SSR/SPA
- **TypeScript** – Tipagem estática
- **Material UI 5** – Componentes visuais
- **Axios** – Cliente HTTP
- **json-server** – API mock

## ▶️ Como Executar

1. **Instale as dependências:**
```bash
npm install
# ou
yarn install
```

2. **Instale o json-server (se necessário):**
```bash
npm install -g json-server
```

3. **Inicie o json-server (API mock):**
```bash
npm run json-server
# ou diretamente
npx json-server --watch db.json --port 3001
```

4. **Em outro terminal, inicie a aplicação:**
```bash
npm run dev
# ou
yarn dev
```

5. **Acesse:**
- Aplicação: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:3001](http://localhost:3001)
- Endpoints: `/machines` e `/monitoring-points`

## 📁 Estrutura do Projeto

```
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── MachineList.tsx
│   ├── MonitoringPointDialog.tsx
│   ├── MonitoringPointsTable.tsx
│   └── SafeTableContainer.tsx
├── services/
│   └── api.ts
├── types/
│   └── index.ts
└── db.json
```

## 🧪 Dados Iniciais

O arquivo `db.json` já contém dados de exemplo:

- **Máquinas**
  - *Bomba Principal* (Pump)
  - *Ventilador Industrial* (Fan)
- **Ponto de Monitoramento**
  - *Ponto B2* (vinculado ao Ventilador com sensor TcAs)

## 🌐 Endpoints Disponíveis

### Máquinas
- `GET /machines`
- `POST /machines`
- `PUT /machines/:id`
- `DELETE /machines/:id`

### Pontos de Monitoramento
- `GET /monitoring-points`
- `POST /monitoring-points`
- `DELETE /monitoring-points/:id`

## 📦 Tipos

### `Machine`
```ts
interface Machine {
  id: string;
  name: string;
  type: "Pump" | "Fan";
}
```

### `MonitoringPoint`
```ts
interface MonitoringPoint {
  id: string;
  name: string;
  machineId: string;
  sensorModel: "TcAg" | "TcAs" | "HF+";
}
```

## 📋 Regras de Negócio

1. **Validação de Sensores**: TcAg e TcAs não podem ser usados em máquinas do tipo Pump  
2. **Paginação**: Tabela limitada a 5 itens por página  
3. **Ordenação**: Ordenação por qualquer coluna da tabela  
4. **Confirmação**: Exclusão de itens exige confirmação do usuário

## 🧪 Testando a API Manualmente

```bash
curl http://localhost:3001/machines
curl http://localhost:3001/monitoring-points
curl -X POST http://localhost:3001/machines -H "Content-Type: application/json" -d '{"name": "Nova Máquina", "type": "Fan"}'
```

## 🛠️ Características Técnicas

- **Client-side**: Todos os componentes são renderizados no cliente
- **Gerenciamento de Estado**: React hooks (useState/useEffect)
- **Responsivo**: Adaptado para múltiplos dispositivos
- **UX**: Feedback visual com estados de loading e alertas
- **Validação**: Regras aplicadas no front-end
- **Erros**: Tratamento e exibição amigável de falhas
