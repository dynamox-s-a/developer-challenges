# Arquivo histórico

Conteúdo preservado de etapas anteriores do projeto. **Nada aqui descreve necessariamente o
sistema atual** — vários destes documentos planejam ou analisam coisas que foram
substituídas, reduzidas ou cortadas.

Estar arquivado não significa estar errado: significa que o texto registra uma fase, e é
útil para entender *por que* o sistema tomou a forma que tem. Todo arquivo desta pasta
começa com um banner `HISTÓRICO` apontando o documento vigente sobre o assunto.

Para o sistema como ele é hoje, comece por
[`../00-overview/architecture-map.md`](../00-overview/architecture-map.md).

## `scp05/` — análise anterior à implementação

| Documento | O que é | Substituído por |
|---|---|---|
| [`dynamox-authentication-architecture.md`](./scp05/dynamox-authentication-architecture.md) | arquitetura de autenticação antes dos perfis de acesso | [`../02-api/auth-and-rbac.md`](../02-api/auth-and-rbac.md) |
| [`dynamox-digital-sensor-blueprint.md`](./scp05/dynamox-digital-sensor-blueprint.md) | plano do simulador com `NormalizedMetric` e Fuzzy — **nunca construídos** | [`../05-simulation/sensor-twin.md`](../05-simulation/sensor-twin.md) |
| [`dynamox-digital-sensor-map.md`](./scp05/dynamox-digital-sensor-map.md) | mapa mental da análise | [`../00-overview/architecture-map.md`](../00-overview/architecture-map.md) |
| [`dynamox-p101-visual-walkthrough.md`](./scp05/dynamox-p101-visual-walkthrough.md) | passeio conceitual com números ilustrativos escritos à mão | [`../00-overview/end-to-end-flow.md`](../00-overview/end-to-end-flow.md) |

As análises daquela fase que continuam **corretas e úteis** não foram arquivadas: elas vivem
em [`../04-contracts/`](../04-contracts/) (mapeamento sensor × API, auditoria de drift e
inventário de endpoints).

## `planning/` — planos do bônus

| Documento | O que é |
|---|---|
| [`BON-06_SENSOR_TWIN_IMPLEMENTATION_PLAN.md`](./planning/BON-06_SENSOR_TWIN_IMPLEMENTATION_PLAN.md) | plano original com ROS 1 Noetic + Gazebo 11 |
| [`BON-06_EXECUTION_PLAN_V2.md`](./planning/BON-06_EXECUTION_PLAN_V2.md) | plano de execução com escopo reduzido, sem Gazebo |

**Gazebo, Blender e Xacro foram cortados e nunca implementados.** Estes planos são o
registro dessa decisão — não uma intenção corrente. O status atual de cada fronteira está em
[`../05-simulation/simulation-vs-real.md`](../05-simulation/simulation-vs-real.md).
