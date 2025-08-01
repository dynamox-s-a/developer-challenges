# Full Stack Challenge

## O que foi implementado

### 1. Gerenciamento de Máquinas
- Adição, edição e exclusão de máquinas.
- Validação para evitar nomes duplicados de máquinas.

### 2. Monitoramento e Sensores
- Criação da funcionalidade de pontos de monitoramento para máquinas.
- Cada ponto possui:
  - `name` (nome do ponto de monitoramento)
  - Associação a uma máquina existente 
  - Sensor associado, com modelo entre ["TcAg", "TcAs", "HF+"]
- Regras de negócio aplicadas:
  - Sensores "TcAg" e "TcAs" **não podem** ser associados a máquinas do tipo "Pump".
- Formulário para adicionar pontos e sensores com validação.
- Listagem paginada e ordenável dos pontos de monitoramento exibindo:
  - Nome da Máquina
  - Tipo da Máquina
  - Nome do Ponto
  - Modelo do Sensor

### 3. Integração no Dashboard
- Dashboard contendo:
  - Formulário e lista de máquinas
  - Formulário e lista de pontos de monitoramento com sensores
- Controle do estado de edição para máquinas (adição e edição no mesmo formulário).

---

## Como rodar o projeto

1. Instale as dependências:

```bash
npm install
```
2. Rode o projeto
```bash
npm run dev
```
3. Acesse [http://localhost:5173](http://localhost:5173) no navegador.