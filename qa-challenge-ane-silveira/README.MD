# QA Test Aplication - Dynamox


Test aplication validating the interface and behavior of a Machine Monitoring Dashboard.

It was used:  
Playwright Version 1.57.0
TypeScript/JavaScript

## Test Requirements

1. As a user, I want to view a screen containing a small header with machine information and some charts.
2. As a user, I want to view 3 time series charts for RMS Acceleration, RMS Velocity, and Temperature.
3. As a user, I want the data to be refreshed every time I access the page.
4. As a user, when hovering over the time series, I want to see a tooltip displaying the data values.

### Problems found on figma prototype:
-   Axis (y) in 'Velocidade RMS' chart has name 'Aceleração (g) on figma, but is named 'Aceleração RMS' in the app.

### Problems found in the app:
-   The last field in the header is rendered as 'null min'. Possibly because interval in /data.json is null.
    A test was created and it is currently failing for this specific scenario.
-   The temperature chart does not contain the hover element. 
    A test was created which confirms that the element could not be found.
-   Because the data.json is static, it's not possible to successfully test Requirement 3.

### Test I'd like to have done:
- Compare rendered curves with their data coming from data.json.
  - I didn't find a way to get the curve data from the rendered html.
- Improve tooltip test to also test the curve name and color.

