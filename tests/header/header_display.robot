*** Settings ***
Documentation    Verify the dashboard header uses metadata from the backend.
Resource    ../../resources/pages/HomePage.robot
Resource    ../../resources/pages/HeaderSection.robot
Resource    ../../resources/keywords/ApiKeywords.robot

*** Test Cases ***
Header displays metadata from API
    Create API Session
    ${metadata}=    Get API Response As JSON    /metadata.json
    Open Application Page
    Wait For Dashboard Data Requests
    Page Header Should Match Metadata    ${metadata}
    Close Application
