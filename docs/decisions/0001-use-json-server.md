# ADR 0001 — Usar json-server no desenvolvimento

## Status

Aceita.

## Contexto

O desafio exige buscar o dataset fornecido por uma API REST mock e sugere `json-server`. A solução
também precisa ser simples de iniciar localmente e publicar na Vercel sem transformar o mock em um
backend de produção.

## Decisão

Usar `json-server` com [`mock/db.json`](../../mock/db.json) no desenvolvimento e nos testes
end-to-end locais.

Em produção, usar uma Vercel Function que importa o mesmo arquivo e responde ao endpoint
`GET /api/measurements`. O runtime muda, mas payload e fonte de dados permanecem iguais.

## Alternativas consideradas

### Mockar Axios no frontend

Reduziria setup, mas não atenderia à integração com uma API REST nem exercitaria a fronteira HTTP
nos cenários de sucesso.

### Hospedar json-server como processo persistente

Reproduziria o runtime local, porém adicionaria serviço e operação desnecessários para um dataset
estático e somente leitura.

### Implementar backend e banco de dados

Não é requisito deste desafio front-end e criaria autenticação, persistência, deploy e manutenção
sem benefício para a avaliação solicitada.

## Consequências

Positivas:

- execução local previsível;
- integração HTTP real;
- uma única fonte de dados;
- paridade de contrato entre local e produção;
- testes e deploy simples.

Negativas:

- a Function não reproduz todos os comportamentos do `json-server`;
- a API é somente leitura e sem persistência;
- mudanças no contrato exigem atualização coordenada de mock, Function, mapper, testes e docs.
