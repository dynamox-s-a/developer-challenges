# Dynamox Signal Processing API 🚀

Esta é uma solução de alta performance para processamento de séries temporais, desenvolvida com foco em **baixa latência**, **observabilidade** e **automação de infraestrutura**.

## 🛠 Tecnologias e Decisões Técnicas

*   **FastAPI:** Escolhido pela performance assíncrona, garantindo latência < 350ms.
*   **PostgreSQL:** Persistência robusta com suporte a JSON para flexibilidade de dados.
*   **Pandas:** Processamento vetorial para cálculo de métricas (Mean, Max, Min) com alta eficiência.
*   **Docker & Compose:** Orquestração completa da stack (API + DB + Tester).
*   **Pytest:** Suíte de testes unitários para garantir a integridade da lógica de negócio.

## 📈 Diferenciais de Observabilidade (SRE)

Diferente de uma API comum, esta solução inclui:
*   **Middleware de Latência:** Monitoramento em tempo real de cada request, injetando o tempo de processamento nos headers (`X-Response-Time-MS`).
*   **Logging Estruturado:** Geração automática de `latency.log` com alertas de `WARNING` caso o limite de 350ms seja atingido.
*   **Healthcheck Proativo:** A API aguarda a prontidão real do banco de dados (PostgreSQL Healthy) antes de iniciar o serviço.

## 🚀 Como Executar (The "Single Command" Experience)

Para facilitar a avaliação, todo o processo de build, deploy e teste foi automatizado em um único script:

```bash
chmod +x run.sh
./run.sh