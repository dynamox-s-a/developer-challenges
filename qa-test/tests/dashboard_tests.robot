*** Settings ***
Library    Browser

Resource    ../resources/keywords.robot
Resource    ../resources/variables.robot
Resource    ../pages/dashboard_page.robot

Suite Setup    Open Browser
Suite Teardown  Close Browser



*** Test Cases ***

Dashboard Should Request Data Endpoint
      Open Dashboard
      Wait For Data Endpoint
    

Dashboard Should Request Metadata Endpoint
    Open Dashboard
    Wait For Metadata Endpoint


 Dashboard Should Display Header
    Open Dashboard
    Header Should Be Visible


 Dashboard Should Display Chart Titles
    Open Dashboard
    Charts Titles Should Be Visible
    Chart Should Show Machine Information


 Dashboard Charts Should Show Tooltip
    Open Dashboard
    Charts Tooltips Should Appear
    



