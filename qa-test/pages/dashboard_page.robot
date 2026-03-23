*** Settings ***
Library    Browser

Resource    ../resources/keywords.robot
Resource    ../resources/locators.robot

*** Keywords ***
Wait For Data Endpoint
    ${response}=    Wait For Response    **/data.json    
    Should Be Equal As Integers    ${response.status}    200
    

Wait For Metadata Endpoint
    ${response}=    Wait For Response    **/metadata.json    
    Should Be Equal As Integers    ${response.status}    200


Charts Titles Should Be Visible
    FOR    ${title}    IN    @{CHART_TITLES}
        ${element_text}=    Get Text    css=h6:has-text("${title}")
        Should Be Equal    ${element_text}    ${title}
    END


Chart Should Show Machine Information
    ${info}=    Get Elements    css=.MuiTypography-caption

    FOR    ${content}    IN    @{info}
        ${text}=    Get Text    ${content}
        Should Not Contain    ${text}    null
    END


Charts Tooltips Should Appear
    Wait For Elements State    css=.highcharts-container >>nth=0    visible
    ${charts}=    Get Element Count    css=.highcharts-container
    

    FOR    ${i}    IN RANGE    ${charts}
        Wait For Elements State    css=.highcharts-container >>nth=${i}        visible    
        Scroll To Element          css=.highcharts-container >> nth=${i}

        ${box}=    Get Bounding Box    css=.highcharts-container>>nth=${i}
        ${x1}=    Evaluate    ${box}[x] + 100
        ${y1}=    Evaluate    ${box}[y] + 100
        ${x2}=    Evaluate    ${box}[x] + 200
        ${y2}=    Evaluate    ${box}[y] + 120

        Mouse Move    ${x1}    ${y1}
        Mouse Move    ${x2}    ${y2}

        Take Screenshot  
        
        ${states}=    Get Element States    css=.highcharts-container >> nth=${i} >> .highcharts-tooltip
        Should Contain    ${states}    visible       

    END