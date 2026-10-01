# Assumptions

The challenge leaves several points open. Each one is recorded below with the
decision taken and the reason for it.

## A. Authentication

**A1. Fixed credentials.** A single user is created by the database seed, with the
password stored as a bcrypt hash. Email and password come from environment variables;
`.env.example` ships test values, documented in the README. The evaluator can log in
without asking, and no password lives in plain text in the code.

**A2. Token storage.** The session is a JWT in an `httpOnly` cookie with
`SameSite=Strict`. Page scripts cannot read the token, which closes token theft
through XSS.

**A3. Logout.** Logout clears the cookie, and tokens are short-lived (1 hour). A
stateless JWT cannot be revoked on the server; the short lifetime bounds the exposure
of a token copied before logout.

**A4. Data ownership.** All data belongs to a user, and every query is scoped to the
authenticated user. This makes "my monitoring points" literal and keeps one user from
reaching another user's data. A sensor serial number registered by another user is
answered exactly like an unknown one, so a response never reveals that it exists.

**A5. Simulator authentication.** The simulator logs in with the same fixed user. A
real sensor would authenticate as a device with its own key; that is a second
authentication mechanism the challenge does not ask for.

## B. Assets: sectors, machines, monitoring points and sensors

**B1. "At least two monitoring points".** A machine accepts any number of monitoring
points, and no minimum is enforced at creation. The sentence describes a capability,
not a rule; enforcing a minimum would block step-by-step registration.

**B2. Free names.** Machine and monitoring point names are free text, as the challenge
asks for arbitrary names, and may repeat: only an empty name, or one longer than 100
characters, is rejected. Identification does not depend on names: a machine is
identified by its tag (B10), and a monitoring point by its machine and position (B11).
An earlier version of this assumption made names unique, to tell rows apart in the
list; the tag and the position columns made that restriction redundant, and it
contradicted the challenge.

**B3. Point and sensor.** A monitoring point has at most one sensor, and a sensor sits
on exactly one monitoring point, as a physical sensor is mounted at one location.

**B4. Sensor unique ID.** The sensor ID is its serial number, provided by the user and
unique across the whole system, enforced by a unique index. It is typed today; the
field is ready for a barcode reader, which behaves as a keyboard. The internal primary
key is separate.
The serial number is trimmed and uppercased, then must be 3 to 40 letters, digits or
hyphens, a `CHECK` repeating the rule in the database. Labels are printed in capitals,
and `dx-0012` typed by hand is the same sensor as `DX-0012`; accepting both spellings
as two sensors would let the same device be installed twice.

**B5. Changing a machine type.** A type change is rejected with `409` when any
monitoring point would become invalid: a `TcAg` or `TcAs` sensor under `Pump`, or an
installation position that belongs to the other type. The error lists those points.
Accepting the change would leave invalid data in the database.

**B6. Deleting a machine.** Deletion cascades to monitoring points, sensors,
time-series and readings. The interface asks for confirmation and shows what will be
removed, so nothing disappears silently.

**B7. Monitoring point without a sensor.** It is listed with an empty sensor model
("No sensor"), and sorts last in both orders, so the points that are measured come
first either way. Hiding the point would suggest it does not exist.

**B8. Pagination and sorting.** Pagination and sorting run on the server, 5 items per
page, by any column, always with a tiebreaker on the primary key so items never skip or
repeat between pages. Besides the four required columns, the list shows the machine tag
and the installation position. The screen offers no other page size: "up to 5" is read
as a fixed size, although the API accepts a `pageSize` parameter like every other list.

**B9. Sectors.** A sector is the physical area of the plant where machines are
installed, with a unique code and a name, in a single level. The seed creates one
sector, `DRY` (drying section of a paper machine). Deleting a sector that still has
machines is rejected with `409`, stating how many: a machine owns its points and
readings, but a sector does not own its machines, and wiping them in one click would be
too destructive.

A code typed in lowercase is uppercased (`dry` becomes `DRY`): its meaning is
unambiguous, and retyping it would only add friction. Because the code is unique across
the system (B10), a second user creating a code another user already has would get a
`409`, which reveals that the code exists elsewhere, against the spirit of A4. With a
single fixed user (A1) this cannot happen; supporting several users would mean making
codes and tags unique per user instead.

**B10. Machine tag.** A machine is identified in the plant by a tag built from its
sector, type and number, such as `DRY-FAN-01`, unique across the system. The number
goes from 1 to 999. The system suggests one above the highest number of that type in
the sector, not the first gap: in a plant a retired equipment number is not reused,
since documents and history still refer to it. The user can still type any free
number.
Changing the sector or the number rebuilds the tag. The tag is never typed as free
text, so it cannot disagree with the machine's actual sector. The free-text machine
name required by the challenge stays alongside it.

**B11. Installation positions.** Each machine type has its own list of positions,
numbered along the power flow, from the motor's free end to the driven equipment:

| Type | Position | Label |
|---|---|---|
| Pump | `PUMP_MOTOR_NDE` | Motor, non-drive end bearing |
| Pump | `PUMP_MOTOR_DE` | Motor, drive end bearing |
| Pump | `PUMP_COUPLING_SIDE` | Pump, coupling side bearing |
| Pump | `PUMP_IMPELLER_SIDE` | Pump, impeller side bearing |
| Pump | `PUMP_MECHANICAL_SEAL` | Pump, mechanical seal |
| Fan | `FAN_MOTOR_NDE` | Motor, non-drive end bearing |
| Fan | `FAN_MOTOR_DE` | Motor, drive end bearing |
| Fan | `FAN_SHAFT_DE` | Fan shaft, drive end bearing |
| Fan | `FAN_SHAFT_NDE` | Fan shaft, non-drive end bearing |
| Both | `OTHER` | Other location |

A position is accepted only for its own type, and the interface offers only those. A
position is unique per machine, except `OTHER`: a sensor needs a fixed spot for its
history to be comparable over time. Fans use "drive end" rather than "coupling side"
because they are often belt driven.

**B12. Monitoring point name.** The name is suggested from the position label and can
be edited, so the user does not type it for every position while the challenge's
free-text name is kept.

**B13. Sensor mounting.** Sensors are mounted on the bearing housing, the rigid part
closest to the bearing, with a standard orientation: sensor Z axis vertical, X axis
aligned with the machine shaft (axial) and Y axis horizontal. Readings are therefore
recorded in machine directions (horizontal, vertical, axial), not in sensor axes.

**B14. Sensor replacement.** A monitoring point holds its current sensor. Replacing a
sensor replaces the record, and the time-series stay on the point, so the bearing's
history continues. The identity of the previous sensor is not kept.
A sensor installed on another point is refused, not moved: the user removes it there
first. Moving it in one step would leave the other point without a sensor, a change
the user did not ask for on a screen that does not show that point.

**B15. Sensor model rule.** The challenge forbids `TcAg` and `TcAs` on `Pump` machines,
and that rule is implemented as stated. Field guidance for centrifugal pumps is finer
grained: 2.5 kHz sensors on the motor bearings and 13 kHz sensors on the pump bearings,
where cavitation and bearing faults show up at high frequency. The challenge rule is
stricter than that practice, per machine instead of per position.

## C. Time-series

**C1. What a time-series is.** A time-series is an entity of its own, identified by its
monitoring point, quantity and axis, holding readings `(timestamp, value)`. Its display
name is generated, such as "Velocity RMS, horizontal". Counting, deleting and
retrieving a full time-series only make sense if a series is a countable thing.

**C2. Owner of a time-series.** A time-series belongs to a monitoring point, not to a
sensor. Measurements are meant to be compared over time at a fixed spot, and a sensor
replacement must not split that history.

**C3. Input.** Readings arrive as CSV files uploaded in the interface or as JSON sent by
the simulator. Both carry the same content and go through the same validation.

**C4. Invalid readings.** A submission with any invalid reading is rejected as a whole
with `422`, stating the line and the reason of each invalid reading. Partial acceptance
would hide the loss. At most 100 errors are listed in one answer, a size a person can
read; the answer still counts every invalid reading, so none goes unmentioned.

**C5. Repeated readings.** A timestamp is unique within a series, enforced by the
database. A reading sent again with the same value is ignored and counted in the
report. The same timestamp with a different value is a conflict and rejects the
submission: overwriting would change stored data without anyone noticing. The same
applies inside one submission: a reading repeated in it is counted once and reported
as repeated, and two values for one instant are refused.
The stored value is compared after the insert, in the same transaction: comparing
before would leave a moment where a concurrent submission could store another value
that the insert then skips without noticing.

**C6. Metrics.** Count, minimum, maximum, mean, standard deviation, RMS, and first and
last timestamps, computed in the database. RMS is the metric that matters for
vibration; computing in the database keeps the latency budget.

**C7. Empty series.** Metrics come back as `null`, with a count of zero. Null means
"unknown"; zero would claim a measurement that never happened.

**C8. Size limits.** Each submission accepts up to 2,000 readings, and each series up
to 50,000, about one year at the 10-minute interval. The limits are explicit, and the
error states which one was exceeded. They are what makes the latency target a promise
rather than a hope, and both were put to the load test ([performance](performance.md)):
a submission of 10,000 readings, the first limit, took over a second to store, one of
5,000 still took longer than 350 ms, and one of 2,000 does not; series at their limit
of 50,000 are read within the target. A larger file is split by the user.

**C9. What a sensor sends.** The three sensor models measure triaxial vibration and
temperature. The time-series stored here are telemetry: scalar values over time.
Waveforms and spectra are out of scope; a spectrum is indexed by frequency, not time,
and waveforms would change the sizing of the whole database.

**C10. Quantities.** The list of quantities is closed, each with a fixed unit:

| Quantity | Unit | Axis |
|---|---|---|
| `acceleration_rms` | g | required |
| `velocity_rms` | mm/s | required |
| `temperature` | °C | not allowed |

With no unit column, the same unit cannot arrive spelled in different ways. A quantity
outside the list is rejected with an error, never dropped silently. An empty axis means
a quantity without direction, not an unknown one.

**C11. CSV layout.** One measurement per line, and one file may cover several
monitoring points, identified by the sensor serial number:

```
serial_number,timestamp,quantity,axis,value
DX-001234,2026-09-29T10:00:00Z,velocity_rms,H,2.31
DX-001234,2026-09-29T10:00:00Z,temperature,,48.2
```

The serial number resolves to the monitoring point where that sensor is currently
installed. Data from a sensor that has since been replaced does not resolve and is
rejected. The first reading of a new quantity and axis on a point creates the series.
The report is given per sensor: series created, readings inserted, repeated readings
ignored.

**C12. CSV reading rules.** UTF-8 with a mandatory header; columns are matched by name,
in any order. Comma as separator and dot as decimal mark; a file saved with semicolons
and decimal commas, as spreadsheet software does in Portuguese locales, is rejected
with a message saying so rather than producing wrong values. Timestamps are ISO 8601
with an explicit offset; a time without one is ambiguous. They keep milliseconds, the
precision of the database and of JavaScript dates; a finer one is refused, since two
readings a microsecond apart would silently become one.
A column the header does not recognize is refused rather than ignored: ignoring it
would drop its data without a word. A byte-order mark, which spreadsheets write at the
start of a UTF-8 file, is accepted; text in another encoding is refused, since its
accented letters would be stored corrupted.

**C13. Simulator.** A separate command-line application generates telemetry for the
installed sensors, discovered through the API or restricted to given serial numbers.
It runs in two modes: `backfill` sends a history and exits, `live` sends current
readings at a fixed interval (10 minutes by default). Each sensor produces the seven
series of C10 (acceleration and velocity on three axes, plus temperature). Values
follow configurable profiles per machine type, with seeded noise, so the same seed
reproduces the same values: running a backfill twice inserts nothing new. The
`--degrade` option makes a sensor's vibration and temperature rise slowly from a given
day, so there is a trend to forecast; being deterministic, a repeated run of a degrading
sensor also stores nothing new.

- **Values.** The profiles in `apps/simulator/src/telemetry/profiles.ts` are synthetic
  levels of a healthy machine, not measurements: a level per quantity and axis, a daily
  load cycle, a fixed offset per sensor and quantity (the same on the three axes, so the
  profile's proportions hold) and a random spread.
- **Determinism.** Each value comes from a hash of the seed, the sensor, the series and
  the instant, never from a sequence, and instants are multiples of the interval since
  the epoch. The same reading always has the same value, so a repeated or overlapping
  run only repeats readings (C5). Changing the formula or the profiles changes the
  values: over data sent before such a change, the API refuses the new values as
  conflicts. Use another seed, or delete those series first.
- **Account.** The simulator logs in like the interface, with `SIMULATOR_EMAIL` and
  `SIMULATOR_PASSWORD` from the environment, never from the command line, which the
  shell history keeps. A session lasts one hour, so an answer `401` leads to one new
  login and one retry.
- **Limits.** Submissions hold at most 2,000 readings (C8). A backfill is limited by the
  50,000 readings of a series: 347 days at 10 minutes, more at a longer interval.
- **Failures.** A serial number asked for that is not installed stops the command with
  its name. A backfill that finds no sensor fails, since ending without data is not a
  success; the live mode says at each instant that it sent nothing. In live mode, a
  failed instant is reported and the next one is tried. Exit codes: 0 done, 1 could not
  do it, 2 wrong command line.

## D. Non-functional requirements

**D1. Latency below 350 ms.** Measured as API response time in a local environment,
with data volumes produced by the simulator, through a load test. Every published
number states how it was obtained. "All requests" is read as the 99th percentile of
each route: the 95th would leave one request in twenty out, and the maximum would fail
on a single pause that says nothing about the system. The maximum is published beside
it. The method, the numbers and what they changed are in
[performance](performance.md).

**D2. Unit tests.** Business rules are unit tested on both frontend and backend, and
the API has integration tests against a real database. The `Pump` rule is tested to
prove that both the API and the database reject invalid data, not only that valid data
passes.

## E. Interface

**E1. Time-series count.** The number of stored time-series appears on the overview
screen, beside the counts of sectors, machines, points, sensors and readings.

**E2. CSV import.** An upload is stored directly, with no preview step. The
all-or-nothing rule of C4 already guarantees that nothing is stored halfway. The
screen offers an example file: one day of the seven series of sensor `DX-000001`, with
synthetic values (a daily cycle plus fixed pseudo-random noise), not measurements.

**E3. Chart period.** The monitoring point screen offers the last 24 hours, 7 days, 30
days, or all readings. A period ends at the point's latest reading, not at the current
time: readings imported from last month would otherwise show an empty chart.

**E5. Forecast.** The monitoring point screen can forecast the next 24 hours of each
series, off by default, drawn as a dashed line with a shaded band and summarised in
words. The model is a linear autoregression over hourly means, chosen by measurement
([forecast-study.md](forecast-study.md)). The band is the model's own validation error,
and the screen states that error beside the baseline's, warning when the model is not
better. A series without a week of continuous history has no forecast, and the reason is
shown. The forecast is computed on request and kept in memory until the series gains or
loses a reading ([ADR 0012](adr/0012-forecast.md)): a forecast changes only when the
data does.

**E4. Condensed charts.** Above 1,000 readings in a series, the chart receives buckets
of minimum and maximum (ADR 0009) and draws each as a vertical stroke, so peaks stay
visible; the screen says when a chart is condensed. Where readings stop for much longer
than usual, the line is broken instead of bridged, so a gap in the data is seen as a
gap. A metric without readings is shown as "n/a", never as zero (C7).

## F. Out of scope for now

Fault detection, severity metrics and alerts are left for a later stage, once the
structure above works end to end.
