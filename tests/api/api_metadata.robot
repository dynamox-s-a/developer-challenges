*** Settings ***
Documentation    Validate the metadata endpoint contract for the dashboard header.
Resource    ../../resources/keywords/ApiKeywords.robot

*** Test Cases ***
Metadata endpoint returns monitoring point information
    Create API Session
    ${metadata}=    Get API Response As JSON    /metadata.json
    Verify MetadataPayload Structure    ${metadata}
