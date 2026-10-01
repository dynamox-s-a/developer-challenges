# Latency measurements

The challenge asks for a latency below 350 ms between client and server for all
requests. This page states how that was measured, what was found and what was changed
because of it (assumption D1). Every number here was measured; none is an estimate
unless it says so.

## Result

With the data and the load described below, **every route of the API answers 99 % of
its requests below 350 ms**, and no request failed. Two runs in a row gave that result.
The table is the first one, taken on 2026-10-01 on a database just built by
`npm run load:setup`. Times are in milliseconds, as seen by the client.

| Route | Requests | p50 | p95 | p99 | Max |
|---|---|---|---|---|---|
| `GET /api/health` | 314 | 0 | 3 | 12 | 16 |
| `POST /api/auth/login` | 122 | 59 | 154 | 237 | 237 |
| `GET /api/auth/me` | 314 | 2 | 11 | 69 | 74 |
| `POST /api/auth/logout` | 105 | 1 | 1 | 5 | 8 |
| `GET /api/overview` | 314 | 3 | 10 | 32 | 88 |
| `GET /api/sectors` | 314 | 2 | 3 | 10 | 21 |
| `POST /api/sectors` | 105 | 9 | 26 | 39 | 55 |
| `PATCH /api/sectors/:id` | 105 | 3 | 12 | 25 | 59 |
| `DELETE /api/sectors/:id` | 105 | 2 | 4 | 15 | 21 |
| `GET /api/machines` | 314 | 4 | 13 | 23 | 33 |
| `GET /api/machines/next-number` | 105 | 2 | 10 | 27 | 52 |
| `POST /api/machines` | 105 | 4 | 16 | 42 | 128 |
| `GET /api/machines/:id` | 314 | 5 | 12 | 19 | 51 |
| `PATCH /api/machines/:id` | 105 | 5 | 11 | 22 | 28 |
| `DELETE /api/machines/:id` | 105 | 2 | 3 | 4 | 4 |
| `GET /api/monitoring-points` | 314 | 5 | 11 | 22 | 29 |
| `POST /api/machines/:id/monitoring-points` | 105 | 7 | 21 | 47 | 53 |
| `GET /api/monitoring-points/:id` | 314 | 3 | 11 | 34 | 62 |
| `PATCH /api/monitoring-points/:id` | 105 | 7 | 24 | 28 | 64 |
| `DELETE /api/monitoring-points/:id` | 105 | 2 | 5 | 6 | 8 |
| `PUT /api/monitoring-points/:id/sensor` | 105 | 8 | 17 | 26 | 26 |
| `DELETE /api/monitoring-points/:id/sensor` | 105 | 4 | 8 | 13 | 21 |
| `GET /api/sensors` | 314 | 4 | 15 | 28 | 70 |
| `GET /api/monitoring-points/:id/time-series` | 419 | 3 | 7 | 23 | 59 |
| `GET /api/time-series/:id/metrics` | 2198 | 9 | 36 | 59 | 99 |
| `GET /api/time-series/:id/readings` | 2198 | 23 | 153 | 199 | 272 |
| `DELETE /api/time-series/:id` | 105 | 3 | 5 | 6 | 12 |
| `POST /api/readings`, 14 readings | 346 | 14 | 32 | 69 | 115 |
| `POST /api/readings`, 1,995 readings | 9 | 167 | 277 | 314 | 323 |
| `POST /api/imports`, 1,008 lines | 13 | 93 | 225 | 321 | 345 |

### What this result does not say

- **The criterion is the 99th percentile of each route, not the maximum.** "All
  requests" is read strictly, so 95 % was not enough; but one garbage collection pause
  would fail a criterion on the maximum without saying anything about the system. The
  maximum is published and not gated. In these two runs every maximum was also below
  350 ms; in earlier runs single requests went above it while the 99th percentile of
  their route stayed far below.
- **Two routes have a thin margin.** The largest submission of readings had a 99th
  percentile of 314 and 312 ms in the two final runs, and 244 and 243 ms in two earlier
  ones with the same size; it runs only 8 or 9 times in a run, so its 99th percentile is
  close to its maximum. The CSV import had 321 ms in one final run and 170 ms in the
  other: it is slower when it coincides with a large submission. Another run on this
  machine could cross 350 ms on either.
- **It is one machine.** A laptop, with the load generator, the API and the database
  sharing its four cores. The numbers show that the application fits the limit there;
  they do not predict another machine, or a network between client and server.

## How it was measured

| | |
|---|---|
| Machine | Intel Core i5-8250U, 4 cores and 8 threads, 11 GB of memory, Ubuntu 24.04 |
| Software | Node.js 24.21, PostgreSQL 16.15 in Docker, k6 2.3.0 from its official image |
| API | production build, one process, against a database of its own |
| Data | 1 sector, 20 machines, 80 monitoring points, 80 sensors, 560 time-series |
| Readings | 2,738,736, from the simulator: 30 days for every sensor and 347 days for one, whose 7 series hold 49,968 readings each, just under the limit of 50,000 |
| Load | 10 concurrent virtual users for 2 minutes, after 20 seconds of warm-up left out of the numbers |
| Measured | `http_req_duration` of k6: from sending the request to receiving the whole answer |

The load is five flows at once:

- **8 operators** visiting the screens as the interface loads them: overview, the lists
  with random sort and page, a machine, and a monitoring point with its 14 requests in
  parallel. Half of the point visits open the point whose series are full.
- **1 administrator** going through every write route on records created for it and
  removed at the end, including logout and login.
- **Sensors** sending a live-sized submission twice per second.
- **A CSV import** of one day of a sensor every 10 seconds.
- **The largest submission** the API accepts, every 15 seconds.

Writes use instants later than the simulated history, and never the sensor whose series
are full, so they neither conflict nor meet the series limit by accident. Before each
run, the readings written by earlier runs are deleted, so every run stores its readings
for real (see "A defect in the measurement" below).

### Running it

```bash
npm run load:setup
```

```bash
npm run load:test
```

The first recreates the database `condition_monitor_load`, builds the API and the
simulator, and stores the data above; it took 226 s, of which 190 s for the 30-day
backfill of the 80 sensors, 2,419,200 readings. The second starts the API on port 3100,
runs k6 in Docker and stops the API; it takes about three minutes. It exits with an
error when a route is above the limit, and writes the table to `load-tests/results/`.
Docker pulls the image `grafana/k6:2.3.0`, 111 MB, on the first run. The development
and test databases are not touched.

The load test does not run in CI: shared runners vary too much to be a ruler
([ADR 0011](adr/0011-k6-load-tests.md)).

## What the measurements changed

The first valid run had 5 of 30 routes above the limit. Each fix was measured before
the next one. The 99th percentile, in milliseconds, of the routes that only read, or
log in:

| Route | First run | Native bcrypt | Reading count | Final |
|---|---|---|---|---|
| `GET /api/health` | 127 | 17 | 6 | 12 |
| `POST /api/auth/login` | 1,099 | 224 | 201 | 237 |
| `GET /api/overview` | 945 | 1,011 | 14 | 32 |
| `GET /api/monitoring-points/:id/time-series` | 269 | 186 | 23 | 23 |
| `GET /api/time-series/:id/readings` | 357 | 326 | 217 | 199 |

1. **Password hashing left the main thread.** `GET /api/health`, which does nothing,
   had a 99th percentile of 127 ms: something held the single thread that serves every
   request. `bcryptjs` is pure JavaScript, and each login spent its hashing time on that
   thread, delaying all the others. The native `bcrypt` package computes in Node's
   thread pool and reads the same hashes. Login fell from 1,099 to 224 ms, and the idle
   routes with it.
2. **Each series keeps its count of readings.** The overview counted 2.7 million rows on
   every visit, and each submission counted the readings of its series to check the
   limit. The count is now a column kept by triggers in the database
   ([domain model](domain-model.md)). The overview fell from 1,011 to 14 ms, and the
   routes that competed with those counts improved too.
3. **A submission holds at most 2,000 readings, not 10,000.** Storing readings takes
   time in proportion to their number, and no fix above changes that. The limit was
   chosen by measuring sizes, each storing new readings, two runs each except the first:

   | Readings in the largest submission | p50 | p99 | |
   |---|---|---|---|
   | 9,996 (first run, before the fixes above) | 1,023 | 1,813 | above |
   | 4,998 | 366 and 397 | 443 and 521 | above |
   | 2,996 | 226 and 220 | 335 and 297 | within, barely; the CSV import reached 348 |
   | 1,995 | 155 to 168 | 243 to 314 | within, in four runs |

   The simulator sends smaller batches by itself, and a larger CSV file is split by the
   user. Making the import asynchronous, answering at once and storing in the
   background, would lift this limit; it was left out as too much for this stage.

### A defect in the measurement

The limit was first set to 5,000, on two runs where a submission of 4,998 readings had
a 99th percentile of 300 and 338 ms. Those runs were wrong. The load script wrote to
the same instants on every run, so only the first run after a setup stored anything:
the later ones sent readings already stored, which the API only counts as repeated, a
much cheaper path. Rebuilding the database to publish fresh numbers exposed it: the
same submission then took 362 ms at the median.

The runner now deletes what earlier runs wrote, so every run stores its readings, and
the sizes above were all measured that way. The table of routes that read or log in is
not affected by the defect.

## The forecast route under load

The forecast route (challenge bonus) was added to the load test, turned on in half the
visits to a monitoring point: one forecast request per series of the point, seven at
once. It is the heaviest read: a fit over a month of hourly means, on the thread that
serves every request.

- **Without a cache, it missed the target**: a 99th percentile around 440 ms, with the
  seven fits of a visit landing together. The fit was rewritten to run on typed arrays
  in a single pass, and a cache was added: a forecast is kept in memory until its series
  gains or loses a reading, since a forecast changes only when the data does
  ([ADR 0012](adr/0012-forecast.md)).
- **With the cache**, over four runs on 2026-10-01, the route's 99th percentile was 86,
  96, 76 and 84 ms, and its median about 8 ms.

The forecast is not what makes the largest submission and the CSV import sit near the
limit. A run with the forecast turned nearly off still had the largest submission at a
99th percentile of 552 ms once: those margins are the laptop's, measured while a browser
shared its cores, as "What this result does not say" explains. Two of the four runs with
the forecast on passed all 31 routes; the other two had the largest submission, or the
import, above 350 ms, as they do without the forecast. The forecast route itself stays
well within the target.

## Earlier measurements

- The first number of this stage: `GET /api/overview` alone, with no concurrency, took
  409 to 421 ms (three requests) before the reading count existed.
- bcrypt work factor, native package, median of 5 checks on an idle machine: 57 ms at
  cost 10 and 226 ms at cost 12. The API uses 10 (assumption A1).
