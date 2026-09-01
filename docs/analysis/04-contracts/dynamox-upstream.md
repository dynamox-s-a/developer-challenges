# API pública Dynamox — snapshot e uso

Este projeto usa **o documento** da API pública da Dynamox, nunca a API. Esta página
registra o que foi capturado, como isso é verificável e o que alimentou o contrato
interno.

## O snapshot

| Item | Valor |
|---|---|
| Arquivo | [`contracts/dynamox/dynamox-public-api.openapi.json`](../../../contracts/dynamox/dynamox-public-api.openapi.json) |
| Origem | `GET https://api.dynamox.solutions/openapi.json` — documento público de especificação |
| Versão da API (`info.version`) | `2.4.7` (OpenAPI 3.1.0) |
| Rotas | 44 paths |
| SHA-256 | `cc6e0f07f9a2c16336a30acf09acdf56d97d64a01e0e90fceac9c30c04b225dd` |

Verificação: `sha256sum contracts/dynamox/dynamox-public-api.openapi.json` — e
`npm run contracts:validate` confere a integridade do snapshot, do contrato interno e do
exemplo.

**Regra do projeto: o snapshot nunca é editado.** Nem para corrigir as inconsistências
que ele contém. Preservá-lo como recebido é o que torna auditável a diferença entre "a
especificação diz isso" e "nós decidimos aquilo". As decisões ficam no contrato interno e
nesta base, jamais na fonte de terceiros.

A captura foi uma requisição `GET` sem credencial ao documento de especificação: nenhum
endpoint produtivo foi chamado, nenhum token, cookie ou `x-api-key` foi usado, e nenhum
aparece neste repositório. O código impede ativamente qualquer chamada acidental à
plataforma real — ver [`../05-simulation/simulation-vs-real.md`](../05-simulation/simulation-vs-real.md).

## O que consumimos de fato

De 44 paths, o produto usa a estrutura de **um**:

| Operação pública | Uso aqui |
|---|---|
| `POST /v1/telemetry-cycles` | corpo inline copiado e reduzido → contrato interno de telemetria |
| `POST /v1/configuration-slots` | apenas o formato de `monitoringLocationMap` (rótulo do local × id do recurso) |
| `GET /v1/telemetry/metric-descriptor` | referência para `displayName` multilíngue nos atributos da medição |

Todo o resto (waveform, alert policies, workspaces, assets) foi **estudado e descartado**
para esta fase: são endpoints de leitura de uma plataforma que não temos, e implementar
clientes deles seria ficção. O inventário completo das operações analisadas, com o subtree
de cada uma e `$ref` resolvido, está em
[`dynamox-endpoint-inventory.json`](./dynamox-endpoint-inventory.json) (regenerável por
`npm run analysis:inventory`; o gerador é determinístico — duas execuções produzem bytes
idênticos).

## O que a especificação pública tem de problemático

A auditoria de drift catalogou oito inconsistências internas do snapshot, classificadas
por impacto. As que mudaram decisão nossa:

- **`monitoringLocationMap` × `monitoringLocationMapSchema`** — o `required` exige um
  campo que o `properties` não declara. Escolhemos `monitoringLocationMap` como canônico
  e registramos o outro como alias da fonte.
- **`components.securitySchemes` vazio** — 32 operações referenciam `HTTPBearer` e 11
  referenciam `bearerAuth`, mas nenhum dos dois é definido. Irrelevante para nós
  (não chamamos a API); bloqueador para quem gerasse um cliente.
- **Escrita × leitura de telemetria divergem** em nome e tipo de campos.
- **`GET /v1/waveforms/`** promete lista e declara objeto único → operação não consumida.

Catálogo completo, com classificação e nível de evidência:
[`dynamox-contract-drift.md`](./dynamox-contract-drift.md).

## Documentos desta pasta

| Documento | Papel |
|---|---|
| [`telemetry-contract.md`](./telemetry-contract.md) | contrato interno campo a campo × público, com classificação (o documento principal) |
| [`dynamox-sensor-api-mapping.md`](./dynamox-sensor-api-mapping.md) | análise de origem: inventário das 18 operações, perfis de sensor, taxonomia de evidência, decisão "GO com restrições" |
| [`dynamox-contract-drift.md`](./dynamox-contract-drift.md) | auditoria de drift: inconsistências da spec pública e divergências deliberadas nossas |
| [`dynamox-endpoint-inventory.json`](./dynamox-endpoint-inventory.json) | evidência bruta gerada do snapshot, sem truncamento silencioso |

Os três últimos são **análises preservadas** da fase de estudo: continuam corretos sobre o
snapshot, e é deles que saíram as decisões descritas em `telemetry-contract.md`. Onde uma
conclusão daquela época não virou código (o caso de `NormalizedMetric`), isso está dito
no documento de contrato.
