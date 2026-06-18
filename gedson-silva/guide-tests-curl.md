# Guia de Testes da API Time Series

Este documento descreve como validar manualmente todos os endpoints da API utilizando **curl** ou **Postman**.

## Pré-requisitos

Suba a aplicação:

```bash
uvicorn app.main:app --reload
```

Verifique se a API está disponível:

```bash
curl http://localhost:8000/health
```

Resposta esperada:

```json
{
  "status": "ok"
}
```

---

# Variáveis Utilizadas

Durante os testes, substitua:

```text
<SERIES_ID>
```

pelo ID retornado na criação da série.

Exemplo:

```text
3c8e8b3f-d7e0-45c6-8f71-4a8f4d87c1d1
```

---

# 1. Criar Série Temporal

## Objetivo

Cadastrar uma nova série temporal com múltiplos pontos.

## Curl

```bash
curl -X POST "http://localhost:8000/api/v1/series/" \
-H "Content-Type: application/json" \
-d '{
  "name": "sensor-test",
  "points": [
    {
      "timestamp": "2024-01-01T00:00:00Z",
      "value": 1.0
    },
    {
      "timestamp": "2024-01-01T00:01:00Z",
      "value": 2.0
    },
    {
      "timestamp": "2024-01-01T00:02:00Z",
      "value": 3.0
    },
    {
      "timestamp": "2024-01-01T00:03:00Z",
      "value": 4.0
    },
    {
      "timestamp": "2024-01-01T00:04:00Z",
      "value": 5.0
    }
  ]
}'
```

## Postman

### Método

```text
POST
```

### URL

```text
http://localhost:8000/api/v1/series/
```

### Headers

```text
Content-Type: application/json
```

### Body (Raw / JSON)

```json
{
  "name": "sensor-test",
  "points": [
    {
      "timestamp": "2024-01-01T00:00:00Z",
      "value": 1.0
    },
    {
      "timestamp": "2024-01-01T00:01:00Z",
      "value": 2.0
    },
    {
      "timestamp": "2024-01-01T00:02:00Z",
      "value": 3.0
    },
    {
      "timestamp": "2024-01-01T00:03:00Z",
      "value": 4.0
    },
    {
      "timestamp": "2024-01-01T00:04:00Z",
      "value": 5.0
    }
  ]
}
```

## Resultado Esperado

Status:

```text
201 Created
```

Exemplo:

```json
{
  "id": "3c8e8b3f-d7e0-45c6-8f71-4a8f4d87c1d1",
  "name": "sensor-test",
  "created_at": "2026-06-15T12:00:00Z",
  "points": [...]
}
```

Copie o valor de `id`.

---

# 2. Contar Séries

## Curl

```bash
curl http://localhost:8000/api/v1/series/count
```

## Postman

### Método

```text
GET
```

### URL

```text
http://localhost:8000/api/v1/series/count
```

## Resultado Esperado

```json
{
  "count": 1
}
```

---

# 3. Buscar Série por ID

## Curl

```bash
curl http://localhost:8000/api/v1/series/<SERIES_ID>
```

## Exemplo

```bash
curl http://localhost:8000/api/v1/series/3c8e8b3f-d7e0-45c6-8f71-4a8f4d87c1d1
```

## Resultado Esperado

Status:

```text
200 OK
```

Resposta:

```json
{
  "id": "...",
  "name": "sensor-test",
  "created_at": "...",
  "points": [...]
}
```

---

# 4. Buscar Série Inexistente

## Curl

```bash
curl http://localhost:8000/api/v1/series/id-inexistente
```

## Resultado Esperado

Status:

```text
404 Not Found
```

Resposta:

```json
{
  "detail": "Série não encontrada"
}
```

---

# 5. Consultar Métricas

## Curl

```bash
curl http://localhost:8000/api/v1/series/<SERIES_ID>/metrics
```

## Exemplo

```bash
curl http://localhost:8000/api/v1/series/3c8e8b3f-d7e0-45c6-8f71-4a8f4d87c1d1/metrics
```

## Resultado Esperado

```json
{
  "series_id": "...",
  "count": 5,
  "min": 1.0,
  "max": 5.0,
  "mean": 3.0,
  "median": 3.0,
  "std": 1.414213562,
  "range": 4.0
}
```

---

# 6. Consultar Predição (Bônus)

## Curl

```bash
curl "http://localhost:8000/api/v1/series/<SERIES_ID>/predict?steps=5"
```

## Exemplo

```bash
curl "http://localhost:8000/api/v1/series/3c8e8b3f-d7e0-45c6-8f71-4a8f4d87c1d1/predict?steps=5"
```

## Resultado Esperado

```json
{
  "series_id": "...",
  "method": "linear_regression",
  "steps": 5,
  "predicted_points": [
    {
      "step": 1,
      "value": 6.0
    },
    {
      "step": 2,
      "value": 7.0
    }
  ]
}
```

---

# 7. Testar Predição com Poucos Pontos

Criar uma série contendo apenas um ponto.

## Payload

```json
{
  "name": "single-point",
  "points": [
    {
      "timestamp": "2024-01-01T00:00:00Z",
      "value": 10
    }
  ]
}
```

## Chamada

```bash
curl "http://localhost:8000/api/v1/series/<SERIES_ID>/predict"
```

## Resultado Esperado

```text
422 Unprocessable Entity
```

```json
{
  "detail": "Mínimo de 2 pontos para predição"
}
```

---

# 8. Excluir Série

## Curl

```bash
curl -X DELETE \
"http://localhost:8000/api/v1/series/<SERIES_ID>"
```

## Resultado Esperado

Status:

```text
204 No Content
```

Sem corpo de resposta.

---

# 9. Validar Exclusão

Após remover a série:

```bash
curl http://localhost:8000/api/v1/series/<SERIES_ID>
```

## Resultado Esperado

```text
404 Not Found
```

```json
{
  "detail": "Série não encontrada"
}
```

---

# 10. Testar Payload Inválido

## Curl

```bash
curl -X POST "http://localhost:8000/api/v1/series/" \
-H "Content-Type: application/json" \
-d '{
  "name": "invalid",
  "points": []
}'
```

## Resultado Esperado

```text
422 Unprocessable Entity
```

Resposta semelhante:

```json
{
  "detail": [
    {
      "msg": "A série deve ter pelo menos 1 ponto"
    }
  ]
}
```

---

# Checklist Manual

- [ ] Health check funcionando
- [ ] Criar série
- [ ] Buscar série
- [ ] Contar séries
- [ ] Consultar métricas
- [ ] Consultar predição
- [ ] Testar série inexistente
- [ ] Testar payload inválido
- [ ] Excluir série
- [ ] Confirmar exclusão
- [ ] Tempo de resposta abaixo de 350ms