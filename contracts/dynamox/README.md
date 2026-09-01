# Contratos Dynamox (SCP-04)

Duas camadas, propositalmente separadas:

| Camada | Arquivo | Papel |
|---|---|---|
| Referência externa | `dynamox-public-api.openapi.json` | Snapshot **somente leitura** da API pública. Nunca editado à mão. |
| Contrato interno | `telemetry-cycle.schema.json` | Fronteira compartilhada entre gerador de telemetria, backend local e testes. |
| Exemplo | `examples/telemetry-cycle.example.json` | Payload determinístico da bomba P-101, válido contra o contrato interno. |

## Snapshot da API pública

| Campo | Valor |
|---|---|
| Fonte | `https://api.dynamox.solutions/openapi.json` |
| Versão da API (`info.version`) | `2.4.7` |
| Versão do OpenAPI | `3.1.0` |
| Rotas documentadas | 44 |
| Data da captura | 2026-08-26 |
| Tamanho | 364.019 bytes |
| SHA-256 | `cc6e0f07f9a2c16336a30acf09acdf56d97d64a01e0e90fceac9c30c04b225dd` |

Verificação:

```bash
sha256sum contracts/dynamox/dynamox-public-api.openapi.json
```

O snapshot foi obtido por uma requisição `GET` não autenticada ao documento público de especificação. **Nenhum endpoint produtivo foi chamado**, nenhum token, `x-api-key`, cookie ou credencial foi usado, e nenhum aparece nos arquivos deste diretório.

## Contrato interno

`telemetry-cycle.schema.json` é derivado do corpo do `POST /v1/telemetry-cycles` e reduzido ao que o protótipo precisa. Diferenças deliberadas em relação ao contrato público:

| Ponto | Público 2.4.7 | Interno | Motivo |
|---|---|---|---|
| `telemetryCycleData` | `additionalProperties: false` | idem | Preservado: nenhum campo novo pode ser adicionado nesse nível — é por isso que a chave de idempotência viaja no header HTTP, não no payload. |
| `dataPoints[].value` | `number \| boolean` | `number` | O protótipo só produz grandezas contínuas. |
| `dataPoints[].timestamp` | `date-time` (fração livre) | `YYYY-MM-DDTHH:mm:ss.SSSZ` | O armazenamento é `TIMESTAMPTZ(3)`. Aceitar precisão submilissegundo faria `…​.0001Z` e `…​.0002Z` colidirem na mesma amostra depois do truncamento — uma perda silenciosa. Fusos diferentes de `Z` também são recusados, para que o instante gravado seja exatamente o informado. |
| `attributes` | exige apenas `physicalQuantity` | exige `physicalQuantity` e `unit`; usa `axis` | Vibração triaxial é decomposta em uma medição escalar por eixo, e a unidade precisa ser explícita para o gráfico. |
| `physicalQuantity` | string livre | enum `acceleration \| velocity \| temperature \| rotationalSpeed` | Limita o protótipo ao que ele realmente gera. Grandezas vetoriais (`acceleration`, `velocity`) exigem `axis`; escalares (`temperature`, `rotationalSpeed`) não aceitam `axis` e são persistidas com `Axis.NONE`. |
| `resourceId` | `^[0-9a-fA-F]{24}$` | `^[0-9a-f]{24}$` | Normalizado em minúsculas; ver "Identificadores" abaixo. |
| `configuration` | objeto livre | exige `monitoringLocationMap` | Ver "Inconsistência registrada". |

### Identificadores

`resourceId` e `mapValue` são **identificadores internos determinísticos**: SHA-256 de uma entrada estável, truncado a 24 caracteres hexadecimais minúsculos. O formato coincide com o da API pública apenas para manter o payload compatível — **não são ObjectIds oficiais emitidos pela Dynamox** e não têm significado em nenhum workspace produtivo.

### Idempotência

A chave de idempotência é transportada no header HTTP `Idempotency-Key` (1–128 caracteres em `[A-Za-z0-9._~:-]`), nunca como campo novo no topo do payload — o schema usa `additionalProperties: false`. Para rastreabilidade, o mesmo valor pode ser copiado em `telemetryCycleData.metadata.cycleId`, cujo objeto permite propriedades adicionais.

**Chave e conteúdo são coisas distintas.** Além da chave, o backend calcula um `payloadFingerprint`: SHA-256 de 64 hexadecimais sobre uma serialização canônica do ciclo inteiro — identificador e modelo do sistema de medição, cada medição com seus atributos, **cada par `timestamp`/`value`**, `metadata`, `tags` e `configuration`. As chaves de objeto são ordenadas recursivamente e medições, amostras e tags são normalizadas, de modo que reordenar o JSON não muda o fingerprint, mas alterar qualquer valor muda. A serialização usa JSON puro, sem concatenar campos com `|` ou `:` — separadores que poderiam aparecer dentro dos próprios valores e tornar duas entradas diferentes indistinguíveis.

| Requisição | Resultado |
|---|---|
| Chave conhecida + mesmo fingerprint | `200` `duplicate:true` com o resultado original |
| Chave conhecida + fingerprint diferente | `409 IDEMPOTENCY_KEY_REUSED` |
| Chave nova + fingerprint conhecido | `200` `duplicate:true`, sem criar ciclo |
| Conteúdo inédito | `201` |

Quando o header não vem, o próprio fingerprint é usado como chave: reprocessar o mesmo lote é reconhecido como repetição sem nenhuma configuração do cliente.

## Inconsistência registrada — `monitoringLocationMap`

No `POST /v1/configuration-slots` do OpenAPI 2.4.7:

- o array `required` do corpo lista **`monitoringLocationMap`**;
- a única propriedade declarada em `properties` é **`monitoringLocationMapSchema`** (array de `{ mapLabel, mapValue }`, com `mapValue` no padrão `^[0-9a-fA-F]{24}$`).

Ou seja, a especificação exige um campo que ela mesma não declara.

**Decisão do projeto**: o campo canônico do domínio interno é **`monitoringLocationMap`**. `monitoringLocationMapSchema` é tratado apenas como **alias/inconsistência da especificação pública**, registrado aqui e no plano do BON-06 — não é fonte de verdade do nosso domínio. A decisão é coberta pelos testes de contrato do backend.

Consequência: nenhuma compatibilidade com um workspace produtivo é prometida. O uso real da plataforma dependeria do Resource Model correspondente, que não é público.

## Validação

```bash
npm run contracts:validate
```

O comando valida a sintaxe dos três JSONs e o exemplo contra o contrato interno (Ajv, JSON Schema 2020-12, com `ajv-formats` para `date-time`).

## Limites

- Estes arquivos descrevem telemetria **sintética e didática**; não representam medições de um equipamento real nem constituem produto oficial ou certificado da Dynamox.
- O snapshot público é material de referência de terceiros, versionado sem modificação para tornar as decisões auditáveis.
