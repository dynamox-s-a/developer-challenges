Durante a execução dos testes automatizados (especificamente o cenário de falha de API), identifiquei dois pontos na experiência do usuário que poderiam ser melhorados:
1. Ausência de Feedback de Erro: Ao simular uma falha no servidor (Erro 500), a aplicação não exibe nenhuma mensagem visual ao usuário.

Problema: O usuário fica sem saber se o sistema travou, se a internet caiu ou se os dados simplesmente não existem.
Comportamento Atual: A interface exibe espaços vazios.

2. Falta de "Retryability" (Re-tentativa)
Não existe um mecanismo para tentar recarregar apenas os gráficos falhos.

Problema: A única forma de recuperar o sistema após um erro momentâneo é recarregando a página inteira (F5), o que pode ser frustrante.

Para resolver esses problemas e tornar a aplicação mais robusta:

-Implementar um Empty State de Erro no lugar dos gráficos quando a API falhar;
-Adicionar um botão de "Tentar Novamente" nesse componente, permitindo que o usuário refaça a requisição sem reiniciar a aplicação;
-Exibir um Toast ou notificação discreta informando a natureza do erro.
