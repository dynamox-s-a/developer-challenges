*** Settings ***
Library    Browser
Resource    variables.robot
Resource    locators.robot

*** Keywords ***

Open Dashboard
    New Browser    ${BROWSER}    headless=${HEADLESS}
    New Page       ${BASE_URL}
    

Header Should Be Visible
    Wait For Elements State    ${HEADER_TITLE}    visible


