*** Settings ***
Library    Browser
Resource    ../variables/Locators.robot

*** Keywords ***
Page Should Contain Three Time Series Charts
    Wait For Elements State    ${CHART_TITLE_ACCELERATION}    visible    timeout=${BROWSER_TIMEOUT}
    Wait For Elements State    ${CHART_TITLE_TEMPERATURE}    visible    timeout=${BROWSER_TIMEOUT}
    Wait For Elements State    ${CHART_TITLE_VELOCITY}    visible    timeout=${BROWSER_TIMEOUT}
    ${chart_count}=    Get Element Count    ${CHART_CANVAS}
    Should Be True    ${chart_count} >= 1

Hover Over First Chart And Verify Tooltip
    Hover    ${CHART_CANVAS}
    Fail    msg=Tooltip was not rendered on chart hover. This behavior should be reported as a product defect.
