# Dashboard Test Traceability

This document maps the BDD-style requirements provided in the challenge to the automated tests implemented using Robot Framework.

---

#  Requirements

The following requirements were provided:

**REQ-01**

As a user, I want to view a screen containing a small header with machine information and some charts.

**REQ-02**

As a user, I want to view 3 time series charts for RMS Acceleration, RMS Velocity, and Temperature.

**REQ-03**

As a user, I want the data to be refreshed every time I access the page.

**REQ-04**

As a user, when hovering over the time series, I want to see a tooltip displaying the data values.

---

#  Test Coverage Mapping

| Requirement ID | Description | Automated Test Case | Test File |
|----------------|-------------|---------------------|-----------|
| REQ-01 | Dashboard should display header | Dashboard Should Display Header | tests/dashboard_tests.robot |
| REQ-01 | Machine information should be visible | Chart Should Show Machine Information | tests/dashboard_tests.robot |
| REQ-02 | Dashboard should display 3 charts | Dashboard Should Display Chart Titles | tests/dashboard_tests.robot |
| REQ-03 | Data should be requested when page loads | Dashboard Should Request Data Endpoint | tests/dashboard_tests.robot |
| REQ-03 | Metadata should be requested when page loads | Dashboard Should Request Metadata Endpoint | tests/dashboard_tests.robot |
| REQ-04 | Tooltip should appear when hovering charts | Dashboard Charts Should Show Tooltip | tests/dashboard_tests.robot |

---

#  Automated Test Suite

The automated tests are implemented in the following file:

tests/dashboard_tests.robot

---

#  Implemented test cases:

Dashboard Should Request Data Endpoint
Dashboard Should Request Metadata Endpoint
Dashboard Should Display Header
Dashboard Should Display Chart Titles
Chart Should Show Machine Information
Dashboard Charts Should Show Tooltip

---

#  Automation Scope

The automated tests validate the following behaviors:

- Dashboard page loading
- API requests for data and metadata
- Header visibility
- Machine information visibility
- Presence of the three charts
- Tooltip visibility when hovering chart data

---

#  Technology Used

The automation was implemented using:

- Robot Framework
- Browser Library (Playwright)