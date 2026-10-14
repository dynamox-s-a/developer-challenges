# Domain Model

**Source of truth:** `apps/api/prisma/schema.prisma`. Domain types shared with the frontend are located in `libs/shared/src/lib/*.ts`.

## 1. Entities and Relationships

| Relationship              | Cardinality | On Delete                                                     |
| ------------------------- | ----------- | ------------------------------------------------------------- |
| User → Machine            | 1 : N       | `Restrict` — users with associated machines cannot be deleted |
| Machine → MonitoringPoint | 1 : N       | `Cascade`                                                     |
| MonitoringPoint → Sensor  | 1 : 0..1    | `Cascade`                                                     |
| MonitoringPoint → Reading | 1 : N       | `Cascade`                                                     |

Deleting a machine removes its monitoring points, associated sensors, and all related readings. The UI informs the user of these consequences before requesting confirmation.

## 2. Entities and Attributes

### User

| Field       | Type       | Constraints and Notes       |
| ----------- | ---------- | --------------------------- |
| `id`        | `String`   | Primary key; UUID           |
| `email`     | `String`   | Unique                      |
| `password`  | `String`   | bcrypt hash, cost factor 10 |
| `createdAt` | `DateTime` | Creation timestamp          |

Users are created through the initial seed. The application does not provide a public registration endpoint.

### Machine

| Field         | Type          | Constraints and Notes         |
| ------------- | ------------- | ----------------------------- |
| `id`          | `String`      | Primary key; UUID             |
| `name`        | `String`      | 2–100 characters, trimmed     |
| `type`        | `MachineType` | Machine type: `Pump` or `Fan` |
| `createdById` | `String`      | Reference to the owning user  |
| `createdAt`   | `DateTime`    | Creation timestamp            |
| `updatedAt`   | `DateTime`    | Last update timestamp         |

A machine can have multiple monitoring points. The recommended minimum is two points per machine, but machines with fewer points are still allowed.

### MonitoringPoint

| Field         | Type       | Constraints and Notes               |
| ------------- | ---------- | ----------------------------------- |
| `id`          | `String`   | Primary key; UUID                   |
| `name`        | `String`   | 1–100 characters, trimmed           |
| `machineId`   | `String`   | Reference to the associated machine |
| `createdById` | `String`   | Reference to the creating user      |
| `createdAt`   | `DateTime` | Creation timestamp                  |

Monitoring point names do not need to be unique. Different machines, or even the same machine, can have points with identical names. Each point is identified by its own ID. Each monitoring point can have at most one sensor and can contain multiple readings.

### Sensor

| Field               | Type          | Constraints and Notes                                         |
| ------------------- | ------------- | ------------------------------------------------------------- |
| `id`                | `String`      | User-defined primary key; 2–50 characters and globally unique |
| `model`             | `SensorModel` | Sensor model                                                  |
| `monitoringPointId` | `String`      | Unique reference to the monitoring point                      |
| `createdById`       | `String`      | Reference to the creating user                                |
| `createdAt`         | `DateTime`    | Creation timestamp                                            |

The sensor ID is provided by the user and serves as the primary key. Global uniqueness is enforced by the database. The unique constraint on `monitoringPointId` ensures that each monitoring point has at most one sensor. Installing another sensor at the same point replaces the previous one within a transaction. Sensors of models `TcAg` and `TcAs` cannot be installed on machines of type `Pump`.

### Reading

| Field               | Type                | Constraints and Notes                                      |
| ------------------- | ------------------- | ---------------------------------------------------------- |
| `monitoringPointId` | `String`            | Reference to the monitoring point; part of the primary key |
| `metric`            | `MeasurementMetric` | Physical quantity being measured; part of the primary key  |
| `timestamp`         | `DateTime`          | Measurement timestamp; part of the primary key             |
| `value`             | `Float`             | Measured value in the unit associated with the metric      |

The composite primary key is `(monitoringPointId, metric, timestamp)`. It ensures that there is at most one reading per monitoring point, physical quantity, and timestamp. The unit of measurement is not stored separately. It is determined by the metric, avoiding conflicting sources of information.

## 3. Enumerations and Units

### Machine Types and Sensor Models

- `MachineType`: `Fan`, `Pump`.
- `SensorModel`: `HF+`, `TcAg`, `TcAs`.

The `HF+` model is stored as `HF_PLUS` in PostgreSQL because the `+` character cannot be used directly in an enum identifier.

### Physical Quantities

`MeasurementMetric` represents the three continuous telemetry quantities displayed in the DynaPredict platform charts.

| Metric                     | Unit   |
| -------------------------- | ------ |
| `temperature`              | `°C`   |
| `vibrationAccelerationRms` | `m/s²` |
| `vibrationVelocityRms`     | `mm/s` |

Units are defined in `libs/shared`, not in the database. Vibration units follow the conventions adopted by the project. Spectral data, frequency bands, and per-axis breakdowns (X/Y/Z) are outside the scope of this model. The system stores scalar samples and does not perform signal analysis. The `MeasurementMetric` values are declared in alphabetical order because server-side sorting depends on this convention ([BR-12](./03-business-rules.md#br-12--enum-ordering)).

## 4. Domain Invariants

| Invariant                                                                    | Enforcement                                                               |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Each sensor has a globally unique ID                                         | `Sensor` primary key                                                      |
| Each monitoring point has at most one sensor                                 | Unique constraint on `Sensor.monitoringPointId`                           |
| Duplicate readings for the same point, quantity, and timestamp are prevented | Composite primary key on `Reading`                                        |
| Every reading declares a physical quantity                                   | Required `metric` field                                                   |
| `TcAg` and `TcAs` sensors cannot be installed on `Pump` machines             | Compatibility validation before writes and when changing the machine type |
| Records belong to the corresponding user                                     | Creator reference and data ownership checks                               |

The recommended minimum of two monitoring points per machine is not a domain invariant. Machines with fewer points are allowed, and the UI displays a warning.
