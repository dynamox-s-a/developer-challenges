*** Settings ***
Library    Browser
Resource    ../variables/Environment.robot
Resource    ../variables/Locators.robot

*** Keywords ***
Open Browser Session
    New Browser    browser=${BROWSER}    headless=${HEADLESS}
    New Context
    New Page
    Go To    ${BASE_URL}
    Wait For Elements State    ${PAGE_TITLE}    visible    timeout=${BROWSER_TIMEOUT}

Reload Browser Session
    Reload
    Wait For Elements State    ${PAGE_TITLE}    visible    timeout=${BROWSER_TIMEOUT}

Close Browser Session
    Run Keyword And Ignore Error    Close Browser
