*** Variables ***
${PAGE_TITLE}                     xpath=//h6[normalize-space()='Análise de dados']
${METADATA_MACHINE}               xpath=//span[normalize-space()='Máquina 1023']
${METADATA_SPOT}                  xpath=//span[normalize-space()='Ponto 20192']
${METADATA_RPM}                   xpath=//span[normalize-space()='200']
${METADATA_DYNAMIC_RANGE}         xpath=//span[normalize-space()='16g']
${METADATA_INTERVAL}              xpath=//span[normalize-space()='% min']

${CHART_TITLE_ACCELERATION}       xpath=//h6[normalize-space()='Aceleração RMS']
${CHART_TITLE_TEMPERATURE}        xpath=//h6[normalize-space()='Temperatura']
${CHART_TITLE_VELOCITY}           xpath=//h6[normalize-space()='Velocidade RMS']
${CHART_CANVAS}                   xpath=(//div[contains(@class,'highcharts-container')])[1]
${TOOLTIP}                        xpath=//*[contains(@class, 'highcharts-tooltip')]
