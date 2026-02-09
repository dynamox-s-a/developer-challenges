# Use Cases Table

| Category | Use Case | Description |
| :--- | :--- | :--- |
| **Authentication** | User Login | Authenticate using fixed email and password to access private routes. |
| **Authentication** | User Logout | Securely terminate the session to prevent unauthorized access. |
| **Machine Management** | Create Machine | Register a new machine with a name and type ("Pump" or "Fan"). |
| **Machine Management** | Update Machine | Modify the name or type of an existing machine. |
| **Machine Management** | Delete Machine | Remove a machine that is no longer in use. |
| **Monitoring Points** | Create Monitoring Point | Define at least two monitoring points for an existing machine. |
| **Sensors** | Associate Sensor | Link a sensor to a monitoring point. |
| **Monitoring Points** | List Monitoring Points | View a paginated list (5 per page) with Machine Name, Type, Point Name, and Sensor Model. |
| **Monitoring Points** | Sort Monitoring Points | Sort the monitoring points list by any column in ascending or descending order. |
| **Telemetry** | Store Time-Series | Save raw sensor data as time-series for a monitoring point. |
| **Telemetry** | Retrieve Metrics | Retrieve total counts and basic metrics for stored time-series data. |
| **Telemetry** | Retrieve Full Data | Fetch the complete dataset of time-series records. |
| **Telemetry** | Visualize Data | Display time-series data in a chart or graph format for performance monitoring. |
| **Telemetry** | Delete Data | Remove specific time-series data from the server. |
