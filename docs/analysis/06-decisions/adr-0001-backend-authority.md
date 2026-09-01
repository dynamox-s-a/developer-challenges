# ADR-0001 — Backend como autoridade de validação e autorização

**Status:** Aceito

## Contexto

O desafio exige regras que não podem ser burladas: uma máquina `Pump` não aceita sensores
`TcAg`/`TcAs`; um ponto tem no máximo um sensor; nomes são únicos. Depois, os perfis de
acesso (ADMIN/VIEWER) foram acrescentados a um sistema que já tinha telas prontas.

A tentação natural é resolver isso na interface: esconder a opção proibida, desabilitar o
botão. Mas a API é chamável diretamente — o próprio sensor twin a consome sem passar pela
tela. Uma regra que só existe na UI não é regra, é sugestão.

## Decisão

Toda regra de negócio e toda decisão de autorização acontecem **no servidor**. O frontend
espelha o resultado para dar boa experiência, nunca para decidir.

Três consequências concretas:

1. Validação de entrada em parsers próprios de cada módulo; regra de domínio em
   `libs/domain`, aplicada pelo service dentro de transação quando há corrida possível.
2. Autorização por guard global cuja regra padrão vem do **método HTTP** — leitura livre
   para autenticados, mutação restrita —, em vez de uma lista de rotas anotadas.
3. `401` (não autenticado) e `403` (autenticado sem permissão) são estados distintos e
   testados como tal.

## Alternativas consideradas

- **Confiar na interface** (esconder o que não pode). Rejeitada: qualquer cliente HTTP
  contorna, e o próprio produto tem um cliente que não é a UI.
- **Anotar cada rota com o perfil exigido.** Rejeitada como padrão: funciona até alguém
  criar um endpoint novo e esquecer a anotação — e o esquecimento falha *aberto*. A regra
  por método faz a mutação nascer restrita; `@Roles(...)` cobre as exceções.
- **Validar com `class-validator` + `ValidationPipe` global.** Rejeitada: o erro sairia no
  vocabulário da biblioteca, e as validações do projeto (UUID vs inexistente, whitelist de
  ordenação, limites) ficariam espalhadas entre decorators e serviços.

## Consequências

- O frontend fica mais simples: exibe o erro real da API em vez de reimplementar regra.
- Esconder um botão vira **experiência**, não segurança — e é assim que está documentado.
- Todo caminho de mutação precisa de teste de autorização, inclusive verificando que a
  recusa **não** alterou o estado persistido.
- Um endpoint novo de mutação já nasce protegido; um endpoint novo de leitura precisa ser
  pensado quanto a exposição de dados.

## Evidência

- `apps/api/src/auth/roles.guard.ts` — regra por método HTTP, `403` explícito.
- `apps/api/src/auth/auth.module.ts` — os dois guards como `APP_GUARD`, na ordem certa.
- `libs/domain/src/index.ts` — `canMutate`, `isSensorModelAllowedForMachine`.
- `apps/api/src/monitoring-points/monitoring-points.service.ts` — `SELECT … FOR UPDATE`
  antes de decidir a regra Pump ⇒ HF+.
- `apps/api/test/rbac-and-query.e2e-spec.ts` — VIEWER recebe `403` em toda mutação e o
  estado permanece intacto; sem token é `401`.
- Documento irmão: [`../02-api/auth-and-rbac.md`](../02-api/auth-and-rbac.md).
