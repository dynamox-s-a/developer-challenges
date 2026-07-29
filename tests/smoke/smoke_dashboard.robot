*** Settings ***
Documentation    Smoke test for the main dashboard journey.
Resource    ../../resources/pages/HomePage.robot
Resource    ../../resources/pages/HeaderSection.robot
Resource    ../../resources/pages/ChartsSection.robot

*** Test Cases ***
Dashboard loads successfully with header and charts
    Open Application Page
    Wait For Dashboard Data Requests
    Page Should Contain Header Information
    Page Should Contain Three Time Series Charts
    Close Application
