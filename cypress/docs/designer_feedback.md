# Design Feedback: Prototype Inconsistencies and Missing States

While analyzing the provided prototype (`image_f4bf5f.png`) to map the automation scenarios, I noticed a few points that need alignment to ensure the final implementation meets both user expectations and technical behaviors.

## 1. Visual Inconsistencies (Copy/Paste Error)
In the third chart, titled **"Velocidade RMS"**, the Y-axis is incorrectly labeled as **"Aceleração RMS (g)"**. It appears the component was duplicated from the first chart and the axis label was not updated. 
* **Suggestion:** Update the Y-axis label to reflect velocity units (e.g., mm/s, as seen in the live application) and ensure the mock data lines differentiate from the Acceleration chart to avoid developer confusion during implementation.

## 2. Missing States (Unhappy Paths)
The current prototype only maps the "Happy Path" (data loaded successfully). To guide the frontend development properly, we should define the following states:

* **Loading State:** Since the application fetches data from `/data` and `/metadata` endpoints, how should the UI behave while waiting for the response? Should we use a Skeleton Screen, a central Spinner, or leave the containers blank?
* **Error State:** If the API returns an error (e.g., 500 Internal Server Error or 503 Service Unavailable), what is the visual feedback for the user? Should we display an error illustration or a "Try Again" button inside the chart containers?
* **Empty State:** If the API request is successful (Status 200) but the time series array is empty for a specific machine, how should the chart area be presented?