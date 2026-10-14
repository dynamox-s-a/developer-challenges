# Business Rules

Business rules define the constraints and behaviors the system must enforce. When a rule is shared between the frontend and backend, its logic is centralized in `libs/shared`. The backend is responsible for enforcing these rules regardless of frontend validation.

## BR-1 — Sensors Incompatible with Pumps

The `TcAg` and `TcAs` sensor models cannot be installed on machines of type `Pump`. This rule is enforced by the backend before persistence and by the frontend, which informs users when a sensor is unavailable. A rejected installation must preserve the previously installed sensor.

## BR-2 — Machine Type Changes

A machine cannot be changed to type `Pump` while it has sensors incompatible with that type. The operation is rejected with `409 CONFLICT`, identifying the sensor models that prevent the change. Renaming a pump or updating other fields without changing its type must not be blocked by this restriction.

## BR-3 — One Sensor per Monitoring Point

Each monitoring point can have at most one installed sensor. Installing another sensor atomically replaces the previous one, ensuring that a failure does not leave the monitoring point without its existing sensor. The operation uses `PUT` to represent an idempotent replacement.

## BR-4 — Sensor Identification

Each sensor has a globally unique, user-defined ID between 2 and 50 characters long, excluding leading and trailing whitespace. Uniqueness is enforced by the database, and attempts to register an existing ID are rejected with `409 CONFLICT`.

## BR-5 — Recommended Minimum Number of Monitoring Points

Each machine should have at least two monitoring points. This requirement is presented as a warning in the frontend rather than enforced as an API constraint. Machines below this minimum are flagged in the overview and machine list. The API allows monitoring points to be created incrementally without requiring all of them to be registered in a single operation.

## BR-6 — Duplicate Readings

Duplicate readings are ignored during ingestion without interrupting batch processing. The response reports the number of readings received and successfully inserted. A reading is considered a duplicate when it has the same combination of monitoring point, measurement metric, and timestamp. This allows batches to be safely resubmitted and makes it possible to identify records that were already stored.

## BR-7 — Maximum Readings per Batch

Each batch can contain up to 4,000 readings. The API rejects request bodies that exceed the allowed size limit with `413 PAYLOAD_TOO_LARGE`. The batch limit was established through performance measurements to meet the 350 ms latency budget. The maximum batch size and HTTP request body limit must remain compatible, and regression tests ensure that a batch containing the maximum allowed number of readings can be processed.

## BR-8 — Timestamps with Explicit Time Zones

Every reading must include a timestamp with an explicit time zone. Values without a time zone are rejected with `400` because they do not identify an unambiguous instant and may compromise time-series integrity. Before submission, the frontend converts date and time values to ISO 8601 format with an explicit time zone.

## BR-9 — Inclusive Range Boundaries

Query, measurement, and deletion ranges include both their start and end boundaries. The start and end values can be omitted independently, but the start value cannot be later than the end value. This convention is applied consistently across all operations to ensure predictable results, including when deleting a range.

## BR-10 — User Data Isolation

Each record belongs to the user who created it. The owner's identity is obtained from the verified authentication token, never from data supplied in the request body. All queries and operations involving records must enforce ownership. Records that do not exist or belong to another user return `404`, preventing the system from revealing the existence of another user's data.

## BR-11 — Cascading Deletion

Deleting a machine removes its monitoring points and dependent data, including sensors and readings. Deleting a user with associated records is prevented. These restrictions are enforced by the database, and the frontend explains the consequences of deletion before requesting confirmation.

## BR-12 — Enum Ordering

Enums used to sort machines, sensors, and measurement metrics must have their values declared in alphabetical order. PostgreSQL uses the declaration order of enum values when sorting, so changing that order may alter query results and must be handled as a database migration.

## BR-13 — Required Measurement Metric

Every reading must specify the physical quantity it represents, such as temperature, vibration velocity, or acceleration. The metric cannot be inferred from the sensor model because the same sensor may measure different physical quantities. Explicit identification is required to interpret values correctly and display chart axes accurately. The unit is derived from the metric and is neither stored nor transmitted separately, preventing inconsistent sources of information.

## BR-14 — Measurement Metric as Part of Reading Identity

A reading is uniquely identified by the combination of monitoring point, physical quantity, and timestamp. Different quantities may be recorded for the same monitoring point at the same instant. Including the quantity in the reading identity prevents valid readings from being incorrectly discarded as duplicates.

## BR-15 — Aggregations by Measurement Metric

Aggregation queries require a specific physical quantity. Operations such as minimum, maximum, and average are calculated separately for each quantity to prevent combining values with incompatible units. In the frontend, each chart represents a single quantity with its own Y-axis and unit. Aggregate indicators must also identify the unit of the displayed values.

## Adding New Rules

When adding a business rule:

1. Centralize in `libs/shared` any logic that must be shared between the frontend and backend.
2. Ensure the rule is enforced by the backend before persistence, when applicable.
3. Reuse the same logic in the frontend to provide immediate feedback without replacing server-side validation.
4. Test both expected behavior and rejection scenarios.
5. Document the rule here when it represents a relevant domain constraint or behavior.

For conflicts with the current state, use `409 CONFLICT`; for operations rejected by domain rules, use `422 UNPROCESSABLE ENTITY`, according to the semantics of the error.
