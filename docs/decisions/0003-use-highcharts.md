# ADR 0003 — Usar Highcharts para séries temporais sincronizadas

## Status

Aceita.

## Contexto

O dashboard precisa exibir sete séries agrupadas em três métricas e sincronizar tooltip e
crosshair entre gráficos pelo instante equivalente. A biblioteca deve suportar séries temporais,
eixos, múltiplas séries e uma API para interação coordenada.

## Decisão

Usar Highcharts com `highcharts-react-official`.

Options são geradas a partir do modelo interno. A sincronização usa um adapter local sobre a API
imperativa da biblioteca, permitindo testar busca de pontos e coordenação sem acoplar toda a lógica
a tipos concretos do Highcharts.

Instâncias, tooltip e crosshair permanecem em refs e são atualizados diretamente, fora do Redux.

## Alternativas consideradas

### Recharts

Oferece integração declarativa com React, mas exigiria construir parte maior da sincronização e do
tooltip compartilhado.

### Chart.js

Atende gráficos temporais, porém a integração entre múltiplas instâncias também exigiria plugins e
adapters específicos.

### D3

Fornece controle completo, mas aumentaria significativamente implementação, acessibilidade,
manutenção e testes para um desafio com prazo limitado.

## Consequências

Positivas:

- suporte maduro a séries temporais e múltiplos eixos;
- API de tooltip, pointer e crosshair adequada ao requisito;
- exemplo oficial próximo ao comportamento solicitado;
- atualização imperativa sem render React a cada `mousemove`;
- lógica de sincronização isolada e testável.

Negativas:

- dependência relevante no bundle;
- APIs imperativas exigem cleanup cuidadoso;
- JSDOM não reproduz layout SVG, deslocando parte da validação para Cypress;
- mudanças de versão podem exigir revisar o adapter e as options.
