# API contract

The REST endpoints the web app and the simulator use. The generated OpenAPI
description is served at `/api/docs` and follows this contract. Rules referenced by
item are in [assumptions.md](assumptions.md).

## Conventions

- **Base path:** `/api`, without a version: the API has one client, in the same
  repository, and both change together.
- **Authentication:** every route requires the session cookie set by login, except
  `POST /api/auth/login` and `GET /api/health`. Without a valid cookie the answer is
  `401`.
- **Format:** JSON, except the CSV upload (`multipart/form-data`).
- **Identifiers:** UUIDs. A route id that is not a UUID answers `404` before any query, like
  an id that does not exist.
- **Timestamps:** ISO 8601 with an explicit offset, such as `2026-09-29T10:00:00Z`.
  Responses always use UTC.
- **Values:** machine type `Pump` or `Fan`; sensor model `TcAg`, `TcAs` or `HF+`;
  position codes as in B11; quantity `acceleration_rms`, `velocity_rms` or
  `temperature`; axis `H`, `V`, `A` or `null`.
- **Ownership:** a resource of another user answers exactly like a missing one, `404`
  (A4).

### Status codes

| Code | Meaning |
|---|---|
| `200` | success with a body |
| `201` | resource created |
| `204` | success without a body |
| `401` | missing or invalid session |
| `404` | resource not found, or owned by another user |
| `409` | the request is valid but conflicts with stored data: duplicate, dependent records, a type change that would invalidate points |
| `413` | upload larger than 2 MB |
| `422` | the request itself is invalid: a field, a CSV line, a sensor model not allowed for the machine type, a size limit |

### Errors

Every error body follows Problem Details (RFC 9457), as `application/problem+json`,
with an `errors` list that points at what failed:

```json
{
  "type": "urn:condition-monitor:error:validation",
  "title": "Invalid request",
  "status": 422,
  "detail": "2 fields are invalid.",
  "errors": [
    { "field": "type", "message": "Must be one of: Pump, Fan." },
    { "field": "number", "message": "Must be an integer greater than or equal to 1." }
  ]
}
```

A CSV error names the line (the header is line 1) and the CSV column; a JSON reading
names its index and its JSON field:

```json
{
  "type": "urn:condition-monitor:error:import",
  "title": "Import rejected",
  "status": 422,
  "detail": "3 lines are invalid. Nothing was stored.",
  "errors": [
    { "line": 4, "field": "timestamp", "message": "Must be ISO 8601 with an offset, such as 2026-09-29T10:00:00Z." },
    { "line": 9, "field": "serial_number", "message": "No installed sensor with serial number DX-009999." },
    { "line": 12, "field": "value", "message": "Conflicts with the stored value 2.31 at the same timestamp." }
  ]
}
```

The detail counts invalid readings or lines, not messages. At most 100 errors are
listed; when there are more, the detail says so, and the count still covers them all.
A file refused as a whole, before any line is judged, has one error on the field
`file` and no line: not UTF-8, semicolons as separator, a header with a missing,
repeated or unknown column, no readings, or more than 2,000.

A conflict lists the records involved:

```json
{
  "type": "urn:condition-monitor:error:conflict",
  "title": "Machine type cannot change",
  "status": 409,
  "detail": "2 monitoring points are not valid for Pump.",
  "errors": [
    { "monitoringPointId": "6f1c...", "name": "Fan shaft, drive end bearing", "reason": "Position FAN_SHAFT_DE belongs to Fan." },
    { "monitoringPointId": "9a42...", "name": "Motor, drive end bearing", "reason": "Sensor model TcAg is not allowed on Pump." }
  ]
}
```

Errors raised by the framework itself, such as an unknown route, carry the type
`about:blank`, which RFC 9457 reserves for problems with no meaning beyond their HTTP
status. The `urn:condition-monitor:error:*` types are raised by the API's own rules.

### Pagination

Paginated lists take `page` (from 1), `pageSize`, `sort` and `order` (`asc` or
`desc`), and answer:

```json
{ "items": [], "total": 23, "page": 2, "pageSize": 5 }
```

`sort` accepts only the keys listed for each route. The primary key is always the
last sort key, so items never skip or repeat between pages (B8). A page past the last
answers `200` with no items and the real `total`: the item that filled it may have
just been deleted.

## Health

`GET /api/health` is public and answers `200 { "status": "ok" }` while the API process
is up. Docker, CI and the web app use it to know the API is reachable.

## Authentication

| Route | Request | Success | Errors |
|---|---|---|---|
| `POST /api/auth/login` | `{ email, password }` | `204`, sets the session cookie | `401` wrong email or password (one message for both), `422` |
| `POST /api/auth/logout` | none | `204`, clears the cookie | `401` |
| `GET /api/auth/me` | none | `200 { id, email }` | `401` |

## Overview

`GET /api/overview` answers `200` with the counts of the authenticated user (E1):

```json
{ "sectors": 1, "machines": 4, "monitoringPoints": 17, "sensors": 15, "timeSeries": 105, "readings": 241920 }
```

## Sectors

A sector: `{ id, code, name, machineCount }`. The code is trimmed and uppercased, then
must be 2 to 10 letters or digits, so `dry` is stored as `DRY`. The name is trimmed and 1
to 100 characters long.

| Route | Request | Success | Errors |
|---|---|---|---|
| `GET /api/sectors` | none | `200`, all sectors, sorted by code, then id | |
| `POST /api/sectors` | `{ code, name }` | `201`, the sector | `409` code in use, `422` |
| `PATCH /api/sectors/:id` | `{ code?, name? }`, at least one | `200`, the sector | `404`, `409` code in use, `422`, also for an empty body |
| `DELETE /api/sectors/:id` | none | `204` | `404`, `409` the sector has machines, with `errors: [{ machineCount }]` (B9) |

The sector list is not paginated: a plant has few sectors.

## Machines

A machine:

```json
{
  "id": "…",
  "tag": "DRY-FAN-01",
  "name": "Hood exhaust fan, tending side",
  "type": "Fan",
  "number": 1,
  "sector": { "id": "…", "code": "DRY", "name": "Drying" }
}
```

| Route | Request | Success | Errors |
|---|---|---|---|
| `GET /api/machines` | query `sectorId?`, pagination | `200`, page of machines | `422` |
| `GET /api/machines/next-number` | query `sectorId`, `type` | `200 { number, tag }` | `404` sector, `409` numbers already reach 999, `422` |
| `POST /api/machines` | `{ sectorId, type, number, name }` | `201`, the machine | `404` sector, `409` tag in use, on the `number` field, `422` |
| `GET /api/machines/:id` | none | `200`, the machine with its points and counts | `404` |
| `PATCH /api/machines/:id` | `{ name?, type?, sectorId?, number? }` | `200`, the machine | `404`, `409` tag in use, `409` type change invalidates points (B5), `422` |
| `DELETE /api/machines/:id` | none | `204`, cascades to points, sensors, series and readings (B6) | `404` |

The type is `Pump` or `Fan`, the number 1 to 999 and the name free text of 1 to 100
characters that may repeat (B2); the tag is built on every answer, never stored (B10).

List: `pageSize` defaults to 10, at most 100. `sort` is one of:

| Key | Order |
|---|---|
| `tag` (default) | sector code, type, number, as the tag reads |
| `name` | name, then tag |
| `type` | type alphabetically, Fan before Pump, then sector code and number |
| `sector` | sector name, then tag |

`next-number` suggests one above the highest number of that type in the sector, so a
retired number is not reused (B10).

The detail adds the machine's monitoring points, in power-flow order (B11), and the
counts the interface shows before a deletion removes them (B6):

```json
{
  "id": "…",
  "tag": "DRY-FAN-01",
  "…": "the other machine fields",
  "monitoringPoints": [{ "id": "…", "name": "Motor, drive end bearing", "location": "FAN_MOTOR_DE", "machine": { "…": "…" }, "sensor": null }],
  "counts": { "monitoringPoints": 1, "sensors": 0 }
}
```

## Monitoring points

A monitoring point:

```json
{
  "id": "…",
  "name": "Motor, drive end bearing",
  "location": "FAN_MOTOR_DE",
  "machine": { "id": "…", "tag": "DRY-FAN-01", "name": "Hood exhaust fan, tending side", "type": "Fan" },
  "sensor": { "serialNumber": "DX-001234", "model": "TcAs" }
}
```

`sensor` is `null` when no sensor is installed.

| Route | Request | Success | Errors |
|---|---|---|---|
| `GET /api/monitoring-points` | pagination | `200`, page of points | `422` |
| `POST /api/machines/:id/monitoring-points` | `{ positions: [{ location, name? }] }` | `201 { items }`, the points created | `404` machine, `409` position in use, `422` |
| `GET /api/monitoring-points/:id` | none | `200`, the point | `404` |
| `PATCH /api/monitoring-points/:id` | `{ name?, location? }`, at least one | `200`, the point | `404`, `409` position in use, `422` |
| `DELETE /api/monitoring-points/:id` | none | `204`, cascades to sensor, series and readings | `404` |

List, the one required by the challenge: `pageSize` defaults to 5, at most 100. `sort`
is one of:

| Key | Order |
|---|---|
| `machineName` (default) | machine name, then tag |
| `machineType` | type, Fan before Pump, then sector code and number |
| `monitoringPointName` | point name, then tag |
| `sensorModel` | model as `HF+`, `TcAg`, `TcAs`; points without a sensor last in both orders (B7), then tag |
| `machineTag` | sector code, type, number, as the tag reads |
| `location` | position in power-flow order (B11), not by label, then tag |

`order` applies to the chosen column, and for `machineName` to the tag after it. The
other tiebreakers stay ascending and end in the position and the primary key, so rows
never skip or repeat between pages (B8).

Creation takes several positions at once, as selected in the interface, and is all or
nothing. A missing `name` defaults to the position label (B12). Every refused position
is named by its index, so the interface marks each one:

| Case | Status | `field` |
|---|---|---|
| Position of the other machine type | `422` | `positions.N.location` |
| Same position selected twice in the request | `422` | `positions.N.location` |
| Position already taken on the machine | `409` | `positions.N.location` |

`OTHER` is the only position that may repeat (B11). Moving a point with `PATCH` to a
taken position answers `409` on the `location` field.

## Sensor of a monitoring point

A point has at most one sensor, so the sensor is a sub-resource of the point.

| Route | Request | Success | Errors |
|---|---|---|---|
| `PUT /api/monitoring-points/:id/sensor` | `{ serialNumber, model }` | `200`, the point with its sensor | `404` point, `409` serial number installed elsewhere, `422` model not allowed for the machine type |
| `DELETE /api/monitoring-points/:id/sensor` | none | `204`; the series stay on the point | `404` point, or point without a sensor |
| `GET /api/sensors` | query `serialNumber?` (repeatable) | `200`, installed sensors | `422` |

`PUT` installs a sensor or replaces the current one (B14); sending the same sensor
again changes nothing. The serial number is trimmed and uppercased, then must be 3 to
40 letters, digits or hyphens, so `dx-0012` and `DX-0012` are one sensor (B4).

A sensor installed on another point is refused, not moved: it has to be removed there
first (B14). The `409` names the machine tag and the point when the sensor is the
user's own, and only says it is installed elsewhere when it is not (A4):

```json
{
  "type": "urn:condition-monitor:error:conflict",
  "title": "Sensor installed elsewhere",
  "status": 409,
  "detail": "Sensor DX-0012 is installed at DRY-FAN-01, Motor, drive end bearing. Remove it there first.",
  "errors": [{ "field": "serialNumber", "message": "DX-0012 is installed at DRY-FAN-01, Motor, drive end bearing. Remove it there first." }]
}
```

A `TcAg` or `TcAs` sensor on a pump answers `422` on the `model` field, naming the
accepted models (B15).

`GET /api/sensors` answers the installed sensors of the user, sorted by serial number:

```json
[{ "serialNumber": "DX-001234", "model": "TcAs", "monitoringPointId": "…", "location": "FAN_MOTOR_DE", "machineTag": "DRY-FAN-01", "machineType": "Fan" }]
```

It is how the simulator discovers what to simulate. `serialNumber`, repeated for
several, narrows the answer; each one is normalized as in B4, and at most 1,000 are
accepted. A serial number that is unknown, removed or another user's is absent from the
answer, the same in the three cases (A4); the caller compares what it asked with what
came back.

## Time-series

A time-series:

```json
{
  "id": "…",
  "monitoringPointId": "…",
  "quantity": "velocity_rms",
  "axis": "H",
  "unit": "mm/s",
  "label": "Velocity RMS, horizontal",
  "readingCount": 4320,
  "firstTimestamp": "2026-08-30T10:00:00Z",
  "lastTimestamp": "2026-09-29T10:00:00Z"
}
```

| Route | Request | Success | Errors |
|---|---|---|---|
| `GET /api/monitoring-points/:id/time-series` | none | `200`, the series of the point, by quantity then axis | `404` |
| `GET /api/time-series/:id/metrics` | query `from?`, `to?` | `200`, metrics | `404`, `422` |
| `GET /api/time-series/:id/readings` | query `from?`, `to?`, `maxPoints?` | `200`, readings or buckets | `404`, `422` |
| `DELETE /api/time-series/:id` | none | `204`, the series and its readings | `404` |
| `GET /api/time-series/:id/forecast` | none | `200`, the forecast or the reason there is none | `404` |

An interval includes both ends, and either end may be left out: without `from` it
starts at the first reading, without `to` it ends at the last. `to` before `from`
answers `422`. Timestamps in answers are UTC with milliseconds, such as
`2026-09-29T10:00:00.000Z`.

**Metrics** (C6, C7), over the whole series or the given interval:

```json
{
  "count": 4320, "min": 1.02, "max": 4.87, "mean": 2.11, "stdDev": 0.43, "rms": 2.15,
  "firstTimestamp": "2026-08-30T10:00:00Z", "lastTimestamp": "2026-09-29T10:00:00Z"
}
```

`stdDev` is the population standard deviation. With no readings, `count` is `0` and
every other field is `null`; a single reading has a `stdDev` of `0`, which was measured.

**Readings.** Without `maxPoints`, the answer is every reading in the interval, and
without an interval, the full series:

```json
{ "downsampled": false, "readings": [{ "timestamp": "2026-09-29T10:00:00Z", "value": 2.31 }] }
```

With `maxPoints` (from 2 to 5,000) and more readings than that in the interval, the
interval is split into `maxPoints / 2` buckets and each returns its minimum and
maximum. An average would hide the peaks, and a vibration peak is what the operator
needs to see:

```json
{
  "downsampled": true,
  "buckets": [{ "start": "2026-09-29T00:00:00Z", "end": "2026-09-29T02:00:00Z", "min": 1.98, "max": 3.40, "count": 12 }]
}
```

The buckets have equal widths and span the requested interval, or the first and last
readings where an end is left out. A bucket holds the readings from its `start` up to,
not including, its `end`; the last one also holds a reading at its `end`. A bucket
without readings is left out, so a gap in the data stays a gap.

**Forecast** (challenge, section 8; [forecast-study.md](forecast-study.md)): the next 24
hours of the series, as hourly means, each with the band it should fall within. The
answer is `200` whether or not there is a forecast; a series of another user, or an id
that is not a UUID, is `404`.

```json
{
  "status": "available",
  "basedOn": { "from": "2026-08-30T00:00:00Z", "to": "2026-09-29T00:00:00Z", "hours": 720 },
  "validation": { "forecasts": 120, "error": 0.05, "baselineError": 0.08 },
  "points": [{ "timestamp": "2026-09-29T00:30:00Z", "value": 2.11, "lower": 1.98, "upper": 2.24 }]
}
```

`validation` is how the model did on the last fifth of the history it did not see,
against the baseline of repeating the same hour a day earlier, as mean absolute errors
in the unit of the series: a model with the larger error is not worth trusting over the
baseline. `lower` and `upper` are the forecast minus and plus the error that 90 % of
the validation forecasts stayed within at that hour ahead, so the band widens with the
horizon. A vibration forecast and its lower bound never go below zero.

With less than a week of continuous history up to the latest reading, there is no
forecast, and the answer says so rather than inventing a line:

```json
{ "status": "unavailable", "reason": "not-enough-history", "detail": "The series has 47 hours of continuous history up to its latest reading; a forecast needs 168." }
```

## Readings input

Two entry points, one validation (C3). Both are all or nothing (C4), accept up to
2,000 readings per submission, and refuse readings that would take a series beyond
50,000 readings (C8).

| Route | Request | Success | Errors |
|---|---|---|---|
| `POST /api/imports` | `multipart/form-data`, field `file`, a CSV as in C11 and C12 | `200`, report | `400` file sent in another field, `413` file over 2 MB, `422` with errors by line |
| `POST /api/readings` | `{ readings: [{ serialNumber, timestamp, quantity, axis, value }] }` | `200`, report | `413` body over 2 MB, `422` with errors by index |

Rules of every reading, whatever the entry point:

- `serialNumber` is trimmed and uppercased, and must be a sensor installed at a point
  of the user. An unknown serial number, a removed sensor and another user's sensor get
  the same answer (A4).
- `timestamp` is ISO 8601 with an offset, at most to the millisecond: finer precision
  would be lost in storage and could merge two readings.
- `axis` is `H`, `V` or `A` for vibration and `null` (an empty CSV cell) for
  temperature.
- `value` is a finite number; in CSV, a plain decimal with a dot.
- The same series and instant twice in one submission count as one reading and one
  repeat; with two values, the second is refused naming the first.

The report, per sensor (C11):

```json
{
  "sensors": [
    { "serialNumber": "DX-001234", "monitoringPointId": "…", "seriesCreated": 7, "readingsInserted": 1008, "readingsRepeated": 0 }
  ],
  "totals": { "seriesCreated": 7, "readingsInserted": 1008, "readingsRepeated": 0 }
}
```

The status is `200` rather than `201` because a valid submission may create nothing:
sending the same readings twice is accepted and reported as repeated (C5).
