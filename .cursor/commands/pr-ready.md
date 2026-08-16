Prepare as alterações atuais para revisão, sem criar commit, push ou pull request.

Compare contra `origin/leonardo-jacomussi` para capturar tudo que será enviado ao remoto.

1. Revise todo o diff da branch, incluindo arquivos staged, unstaged e não rastreados.
2. Identifique bugs, regressões, mudanças fora do escopo e testes ausentes.
3. Verifique credenciais, `.env`, `.vercel`, artefatos gerados e arquivos pessoais acidentais.
4. Execute as validações proporcionais ao risco; para entrega final, use a skill
   `frontend-quality-gate`.
5. Confirme consistência entre `README.md`, blueprint, roadmap, arquitetura, testes, ADRs e
   contribuição.
6. Informe qualquer bloqueio sem contorná-lo silenciosamente.

Ao final, produza:

- resumo das mudanças;
- riscos e pendências;
- validações executadas e resultados;
- plano de testes para a PR;
- sugestão de commits semânticos por escopo.
