DynaPredict

Descrição do Projeto

O projeto DynaPredict foi desenvolvido com o objetivo de monitorar e analisar dados de vibração de máquinas em tempo real, sendo particularmente útil para as indústrias de manutenção. Através da análise de grandezas físicas como velocidade e aceleração, o sistema busca identificar sinais que possam prevenir falhas nas máquinas em operação.

Requisitos

Para garantir o funcionamento adequado do sistema, siga os seguintes passos:

1. Instalação de Dependências: Precisamos baixar as dependências do projeto. Dependendo de qual gerenciador de pacotes você usa, siga um dos comandos abaixo:

- Para quem usa npm, execute: npm install
- Para quem usa yarn, execute: yarn install

   
2. Execução do Backend: Após a instalação das dependências, execute o backend do projeto com o comando em seguida. Isso proporcionará uma experiência mais completa ao usuário.

- Comando: npm run backend


Explicação das Funcionalidades

Ao acessar a tela `/data`, você encontrará:

- Dashboard Superior: Situado na parte superior da página, este dashboard exibe informações detalhadas da máquina selecionada, como:
  - Nome da máquina
  - RPM (rotações por minuto)
  - Tempo de ativação
  - Outras informações gerais relevantes

- Gráficos de Análise: Logo abaixo do dashboard, são apresentados três gráficos interativos:
    - Aceleração RMS: Mostra a variação da aceleração RMS (g) ao longo dos dias.
    - Temperatura: Exibe a variação da temperatura (ºC), da máquina ao longo dos dias.
    - Velocidade RMS: Demonstra a variação da velocidade RMS (g) ao longo dos dias.

Esses gráficos são atualizados automaticamente toda vez que a página é acessada ou recarregada, fornecendo dados atualizados para análise contínua.

Conclusão

O DynaPredict é uma ferramenta robusta para a análise de dados de vibração, facilitando a manutenção preventiva e a detecção precoce de falhas em máquinas industriais. Com uma interface intuitiva e dados em tempo real, o sistema oferece um suporte valioso para a gestão eficiente da manutenção industrial.
	
