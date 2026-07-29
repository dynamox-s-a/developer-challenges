*** Settings ***
Library    Browser
Resource    ../variables/Environment.robot
Resource    ../variables/Locators.robot

*** Keywords ***
Open Application Page
    New Browser    browser=${BROWSER}    headless=${HEADLESS}
    New Context
    New Page
    Go To    ${BASE_URL}
    Wait For Elements State    ${PAGE_TITLE}    visible    timeout=${BROWSER_TIMEOUT}

Reload Application Page
    Reload
    Wait For Elements State    ${PAGE_TITLE}    visible    timeout=${BROWSER_TIMEOUT}

Wait For Dashboard Data Requests
    Wait For Elements State    ${PAGE_TITLE}    visible    timeout=${BROWSER_TIMEOUT}
    Wait For Elements State    ${CHART_TITLE_ACCELERATION}    visible    timeout=${BROWSER_TIMEOUT}
    Wait For Elements State    ${CHART_TITLE_TEMPERATURE}    visible    timeout=${BROWSER_TIMEOUT}
    Wait For Elements State    ${CHART_TITLE_VELOCITY}    visible    timeout=${BROWSER_TIMEOUT}

Close Application
    Run Keyword And Ignore Error    Close Browser
