# Signal Processing API

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/install/)

---

## Configuração

Copie o arquivo de exemplo e ajuste as variáveis conforme necessário:

```bash
cp .env.example .env
```

> O `.env` já vem pré-configurado para funcionar com o Docker Compose sem alterações.

---

## Subindo a aplicação

```bash
docker compose up --build
```

A API estará disponível em **http://localhost:8000**.

> Na primeira execução as tabelas são criadas automaticamente no banco.

---

## Banco de Dados

**PostgreSQL 16** — gerenciado via SQLAlchemy.

| Tabela | Descrição |
|--------|-----------|
| `time_series` | Metadados e métricas pré-computadas de cada série (min, max, média, violações) |
| `time_series_points` | Pontos individuais de cada série (`series_id`, `ts`, `value`) |

---

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST`   | `/api/v1/signal/series`                        | Cria uma nova série temporal com seus pontos e métricas pré-computadas |
| `GET`    | `/api/v1/signal/series/count`                  | Retorna o total de séries armazenadas |
| `GET`    | `/api/v1/signal/series/{series_id}/data`       | Retorna os pontos de uma série de forma paginada (`?offset=0`) |
| `GET`    | `/api/v1/signal/metrics/{series_id}`           | Retorna as métricas de uma série (min, max, média, violações) |
| `DELETE` | `/api/v1/signal/series/{series_id}`            | Remove uma série e todos os seus pontos |


Documentação interativa (Swagger): **http://localhost:8000/docs**

---

## Rodando os testes

```bash
# Sem Docker (requer ambiente Python local com dependências instaladas)
# Linux
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pytest -v
```

---

## Parando a aplicação

```bash
docker compose down          # para e remove os containers
docker compose down -v       # também remove o volume do banco
```

TODO:

- Inserir nova rota que retorna os ids das series presentes no banco.
- Talvez trocar timestamp do ponto da serie para os segundos desde 1970, provavelmente terá uma redução percebida na performance de escrita e armazenamento (provavelmente aumentaria o tempo de leitura para organizar o timestamp em data hora)...
- Nao foi inserido alembic para trabalhar com migrations, a criação da tabela é feita pelo lifespan da aplicação, para escalar pode nao ser uma boa caso duas aplicacoes subam ao mesmo tempo tentando criar tabela no banco...
- Criar CI.
- A Aplicação foi montada pensando numa modularização clara router->service->repository router cuida de validacoes de entrada e saida da rota, service cuida da logica da aplicacao e como os dados serão persistidos e repository cuida da persistencia e leitura em banco. Esse modelo facilita os testes automatizados, para nao utilizar o banco em testes automatizados de integracao parcial, consigo mockar as chamadas pro repository, assim como no exemplo do unico arquivo de teste criado Post...
- Subir a cobertura de testes.
- Atualmente a resposta pro client na criação de uma serie está sincrono, devolvemos detalhes da inserção como id registrado em banco após inserção, dependendo como essa aplicação crescer isso não será escalavel, dado que poderá haver outras comunicações durante a inserção, como por exemplo o acionamento para um servico de alarme ao perceber que há registros de pontos da serie violados para o objeto medido... Uma possivel solução seria criar uma fila de mensagens como o rabbitMQ e worker consumindo a fila para o registro em banco.
- Não foram realizados testes de carga na aplicacao, nem teste com aplicação hospedada em nuvem.
- O calculo das metricas pré computadas na criação da série não está redondo para teste, porque ao mesmo tempo que calcula as metricas com base no payload (isso na camada service logic busines) faz chamada de repository para persistir a serie em banco. Ainda é testavel mas precisará de um mock para o repository... Talvez o ideal fosse tornar uma funcao o calculo de metricas...
- Insercao de log na aplicacao.
- Criar os testes parciais com subida de banco. Nesse teste será preciso criar uma fixture que permita a utilizacao do lifespan pra criacao das tabelas. Depois alterado pra alembic.

resultados POST POSTMAN maquina local

pontos     tempo total ms
1500       193.74


GET paginado

pontos totais   offset 150 pontos paginados
1500            10 ms
