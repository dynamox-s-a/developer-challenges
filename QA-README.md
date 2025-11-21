Add Cypress tests and QA documentation (bilingual README)

📄 Descrição do PR

🇬🇧 English  
This PR adds Cypress automated tests for charts, header, and tooltip validation.  
A new file `QA-README.md` was created to document the test setup, structure, and limitations.  
Notably, the chart tooltip is implemented as a graphical overlay and does not exist in the DOM, making it non-automatable with Cypress selectors.  
**Recommendation:** enable `tooltip: { useHTML: true }` in Highcharts to allow automated testing.

🇧🇷 Português  
Este PR adiciona testes automatizados com Cypress para validação de gráficos, header e tooltip.  
Foi criado o arquivo `QA-README.md` para documentar a configuração dos testes, estrutura e limitações.  
**Observação importante:** o tooltip do gráfico é renderizado como overlay gráfico e não existe no DOM, tornando-o não automatizável via seletores do Cypress.  
**Recomendação:** habilitar `tooltip: { useHTML: true }` no Highcharts para permitir testes automatizados.
