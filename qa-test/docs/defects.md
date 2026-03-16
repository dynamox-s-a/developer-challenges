# Defects Report

This document lists the defects identified during the automated testing of the dashboard application.

---

# DEFECT-01 – Machine Information Container Displays "null" Value

## Summary
The machine information section displays the value **"null min"** for the time interval field.

## Description
When the dashboard loads, the machine information header displays multiple machine attributes. One of the fields representing the time interval shows the value **"null min"**, indicating that there are some error with the import of the data.

## Steps to Reproduce

1. Open the dashboard page.
2. Observe the machine information displayed in the header.
3. Notice the field displaying the time interval on the right side.

## Expected Result
The machine information should display a valid time interval value.

## Actual Result
The value **"null min"** is displayed.

# DEFECT-02 –Temperature Chart Tooltip is being shown on Hover effect

## Summary
The temperature chart does not display a tooltip when the user hovers over chart.

## Description
The dashboard contains 3 charts. When hovering over each one of the charts, a tooltip should appear. This behavior works correctly for the first and third charts but currently is failing for the second chart.

## Steps to Reproduce

1. Open the dashboard page.
2. Scroll to the second chart section.
3. Hover over chart time.
4. Notice that the tooltip is not being shown

## Expected Result
A tooltip should appear displaying the data values for the hovered point.

## Actual Result
No tooltip appears when hovering over the second chart.
