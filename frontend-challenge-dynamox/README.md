# Desafio full-stack Dynamox - Frontend
> Implementação feita por Vinicius Tonini para resolucação do desafio full-stack da dynamos.

## Sobre o projeto
Foi desenvolvido um `frontend` com a utilização de React e Vite para consumir os recursos do `backend`. Utilizado Material UI para criação dos componentes e do `dashboard`. 

> [!NOTE]
> Usuário cadastrado para testes:
> 
> `Email: dynamoxchalleng@email.com`
>
> `Senha: dynamox123`

### Funcionalidades implementadas:
- [X] Criação de máquinas
- [X] Criação de pontos de monitoramento
- [X] Alocar sensores em pontos de monitoramento
- [X] Dashboard com os detalhes de máquinas, pontos de monitoramento e sensores
- [X] Implementado a regra para evitar sensores TcAG e TcAS ser alocado em máquinas do tipo `Pump` 
- [X] Utilizado Redux e Redux Thunk para armazenar estado do usuário apenas
- [X] Implementado `login` com autenticação JWT
- [X] Integração com o backend
- [X] Tela de configuração de usuário
- [X] Logout da aplicação

### Implementações não feitas no frontend:
- [] Remoção de máquinas, pontos de monitoramento e desassociar sensor
- [] Atualização de dados com as rotas PUT

## Tecnologias utilizadas
- React + Vite
- Typescript
- Material UI 5
- Redux e Redux Thunk

## Utilizar a aplicação localmente

Clone o repositório com:
```bash
git clone https://github.com/viniciusft81/developer-challenges.git
```
Em seguida, entre no diretório `frontend-challenge-dynamox`:
```bash
cd frontend-challenge-dynamox
```
## Instalação das dependências
Instale as dependências do projeto com o seguinte comando:

```bash
npm install
```

## Compile e rode o projeto

```bash
npm run dev
```
:clap: Pronto! O frontend está rodando localmente.
