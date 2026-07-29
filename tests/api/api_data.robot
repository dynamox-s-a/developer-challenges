*** Settings ***
Documentation    Validate the data endpoint contract for time series payloads.
Resource    ../../resources/keywords/ApiKeywords.robot

*** Test Cases ***
Data endpoint returns valid time series payload
    Create API Session
    ${payload}=    Get API Response As JSON    /data.json
    Verify DataPayload Structure    ${payload}
    Verify Chart Series Coverage    ${payload}    accelerationRms/x    accelerationRms/y    accelerationRms/z
    Verify Chart Series Coverage    ${payload}    velocityRms/x    velocityRms/y    velocityRms/z
    Verify Chart Series Coverage    ${payload}    temperature
