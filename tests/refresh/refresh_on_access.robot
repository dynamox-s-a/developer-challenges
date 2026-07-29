*** Settings ***
Documentation    Verify the dashboard refreshes data on repeated access.
Resource    ../../resources/pages/HomePage.robot

*** Test Cases ***
Dashboard fetches fresh data on repeated access
    Open Application Page
    Wait For Dashboard Data Requests
    Reload Application Page
    Wait For Dashboard Data Requests
    Close Application
