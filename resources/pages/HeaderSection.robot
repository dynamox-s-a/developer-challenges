*** Settings ***
Library    Browser
Resource    ../variables/Locators.robot

*** Keywords ***
Page Should Contain Header Information
    Wait For Elements State    ${METADATA_MACHINE}    visible    timeout=${BROWSER_TIMEOUT}
    Wait For Elements State    ${METADATA_SPOT}    visible    timeout=${BROWSER_TIMEOUT}
    Wait For Elements State    ${METADATA_RPM}    visible    timeout=${BROWSER_TIMEOUT}
    Wait For Elements State    ${METADATA_DYNAMIC_RANGE}    visible    timeout=${BROWSER_TIMEOUT}
    Wait For Elements State    ${METADATA_INTERVAL}    visible    timeout=${BROWSER_TIMEOUT}

Page Header Should Match Metadata
    [Arguments]    ${metadata}
    ${machine}=    Get Text    ${METADATA_MACHINE}
    ${spot}=    Get Text    ${METADATA_SPOT}
    ${rpm}=    Get Text    ${METADATA_RPM}
    ${dynamic_range}=    Get Text    ${METADATA_DYNAMIC_RANGE}
    ${interval}=    Get Text    ${METADATA_INTERVAL}
    Should Be Equal    ${machine}    ${metadata['machine']}
    Should Be Equal    ${spot}    ${metadata['spot']}
    Should Be Equal    ${rpm}    ${metadata['rpm']}
    Should Be Equal    ${dynamic_range}    ${metadata['dynamicRange']}
    Run Keyword If    '${metadata['interval']}' == 'None'    Should Be Equal    ${interval}    null min
    ...    ELSE    Should Be Equal    ${interval}    ${metadata['interval']}
