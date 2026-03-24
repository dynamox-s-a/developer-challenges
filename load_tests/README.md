# Load Tests — Locust

## Instalação

```bash
source .venv/bin/activate
pip install locust
```

## Executar (modo interativo)

```bash
# Sobe a API primeiro
docker-compose up -d

# Inicia o Locust
locust -f load_tests/locustfile.py --host=http://localhost:80
```

Acesse **http://localhost:8089** e configure:
- **Number of users**: 50–200
- **Spawn rate**: 10 users/s
- **Run time**: 60s

## Executar (headless / CI)

```bash
locust -f load_tests/locustfile.py \
  --host=http://localhost:80 \
  --headless \
  -u 100 \
  -r 10 \
  --run-time 120s \
  --html load_tests/report.html \
  --csv  load_tests/results
```

## Perfis de usuário

| User | Comportamento | Peso |
|---|---|---|
| `ProducerUser` | Cria séries continuamente | 2x |
| `ConsumerUser` | Lê métricas, predições, listagem | 5x |
| `CleanupUser` | Deleta séries periodicamente | 1x |

## SLOs validados automaticamente

- **p95 latência < 350ms**
- **Taxa de erros < 1%**

Se algum SLO for violado, o processo termina com exit code 1 (falha no CI).
