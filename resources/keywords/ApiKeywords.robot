*** Settings ***
Library    RequestsLibrary
Library    Collections
Resource    ../variables/Environment.robot

*** Keywords ***
Create API Session
    Create Session    vibration_api    ${API_BASE_URL}    verify=False    disable_warnings=1

Get API Response As JSON
    [Arguments]    ${endpoint}
    ${response}=    GET On Session    vibration_api    ${endpoint}
    Should Be Equal As Integers    ${response.status_code}    200
    ${json}=    Call Method    ${response}    json
    RETURN    ${json}

Verify MetadataPayload Structure
    [Arguments]    ${payload}
    Dictionary Should Contain Key    ${payload}    machine
    Dictionary Should Contain Key    ${payload}    spot
    Dictionary Should Contain Key    ${payload}    rpm
    Dictionary Should Contain Key    ${payload}    dynamicRange
    Dictionary Should Contain Key    ${payload}    interval

Verify DataPayload Structure
    [Arguments]    ${payload}
    Dictionary Should Contain Key    ${payload}    data
    ${series}=    Get From Dictionary    ${payload}    data
    ${series_count}=    Get Length    ${series}
    Should Be True    ${series_count} >= 3
    ${first_series}=    Get From List    ${series}    0
    Dictionary Should Contain Key    ${first_series}    name
    Dictionary Should Contain Key    ${first_series}    data
    ${points}=    Get From Dictionary    ${first_series}    data
    ${point_count}=    Get Length    ${points}
    Should Be True    ${point_count} > 0
    ${first_point}=    Get From List    ${points}    0
    Dictionary Should Contain Key    ${first_point}    datetime
    Dictionary Should Contain Key    ${first_point}    max

Verify Chart Series Coverage
    [Arguments]    ${payload}    @{expected_series}
    ${series}=    Get From Dictionary    ${payload}    data
    FOR    ${expected_name}    IN    @{expected_series}
        ${is_present}=    Evaluate    any(item['name'] == '${expected_name}' for item in ${series})
        Should Be True    ${is_present}
    END
