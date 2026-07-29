*** Settings ***
Documentation    Verify chart headings are rendered and tooltips appear on hover.
Resource    ../../resources/pages/HomePage.robot
Resource    ../../resources/pages/ChartsSection.robot

*** Test Cases ***
Tooltip appears when hovering over the first chart series
    Open Application Page
    Wait For Dashboard Data Requests
    Page Should Contain Three Time Series Charts
    Hover Over First Chart And Verify Tooltip
    Close Application
