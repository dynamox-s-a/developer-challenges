## Considerações QA Challenge

Durante a execução dos testes automatizados, foram validados os principais requisitos funcionais da aplicação utilizando Cypress com linguagem Javascript para testes de interface e API.

Os cenários implementados contemplam:

* Validação das informações exibidas no header da página, garantindo a exibição correta dos dados da máquina.
* Validação da presença dos três gráficos de séries (Aceleração RMS, Temperatura e Velocidade RMS).
* Validação de nova request feita para a API a cada acesso à página.
* Validação da exibição de tooltips ao interagir com os gráficos.

Durante a automação percebi que os elementos não possuem atributos únicos como ID ou data-test-id, exigindo a utilização de seletores baseados em classes geradas dinamicamente pela biblioteca de interface e pela implementação dos gráficos. Esse cenário aumenta a complexidade da manutenção dos testes e pode torná-los mais suscetíveis a falhas após alterações visuais da aplicação. Uma sugestão de melhoria seria adicionar os atributos de data-test-id ou data-cy para criação de testes mais confiáveis e mais robustos. 

Como resultado dos testes finalizados, foi possível verificar que **3 dos 4 requisitos funcionais foram atendidos com sucesso**:

✅ Exibição das informações da máquina no header.
✅ Exibição dos três gráficos.
✅ Nova request dos dados a cada acesso a página.
❌ Exibição de tooltip ao interagir com os gráficos.

O último requisito não foi considerado atendido devido a identificação de um defeito no gráfico de Temperatura, onde o tooltip não é exibido corretamente durante a interação do usuário. O bug foi documentado no arquivo bug-report.md.
