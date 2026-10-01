# Choosing the forecast model

The challenge lists, as a bonus, a prediction of the future of a time-series. Before
building it, five candidates were compared on the same data, to choose by measurement
and to know how far a forecast can be trusted. The numbers here were measured by
[`studies/forecast/compare.mjs`](../studies/forecast/compare.mjs) on 2026-10-01.

## The question

Given the history of a series up to now, what are its next 24 hours? The answer must
come with its uncertainty: a forecast is a trend with a band around it, never a single
line presented as certain.

## Data

Series stored by the simulator (assumption C13), read back through the API:

- 4 sensors, 2 on a pump and 2 on a fan, 7 series each: 28 series.
- 60 days at one reading every 10 minutes, 8,640 readings per series.
- 2 sensors healthy, and 2 degrading for the last 30 days: vibration rising 1.5 % of
  its level per day and temperature 0.1 °C per day.

The values are synthetic: a level, a daily cycle, a random spread and, for the
degrading sensors, a steady rise. That shapes what this study can say; see "Limits".

## Method

- **Hourly means.** Each series becomes one value per hour, the mean of its 6
  readings: 1,438 hours. It removes most of the random spread and makes a horizon of a
  day 24 steps instead of 144.
- **Split in time order.** The first 80 % of each series is history, the last 20 % is
  kept to judge the forecasts. Shuffling would let a model see the future.
- **Rolling origin.** Every 6 hours of the last 20 %, each candidate receives
  everything up to that hour and predicts the next 24: 45 origins per series. The
  forecast feeds on its own predictions, as it will in use; it never sees a real value
  after its origin.
- **Error.** The mean absolute error at each hour ahead, divided by the standard
  deviation of the series, so series in g, mm/s and °C can be averaged. An error of 1
  is as wide as the series usually moves.

## Candidates

| Candidate | What it predicts |
|---|---|
| Last value | the last hour, repeated |
| Same hour yesterday | each hour as it was 24 hours before |
| Mean of the history | the mean of everything seen |
| Linear autoregression | each hour as a weighted sum of the 48 hours before it, the weights fitted by least squares; the next hours are predicted from the predicted ones |
| Trend and daily profile | a straight line through the last two weeks, plus the usual departure of each hour of the day from it |

The first three need no fitting. They are the baselines: a model that does not beat
them is not worth its complexity.

## Results

Mean absolute error in standard deviations of each series, lower is better.

### Healthy vibration (12 series)

| Candidate | 1 h ahead | 6 h ahead | 12 h ahead | 24 h ahead | Mean of the 24 h |
|---|---|---|---|---|---|
| Last value | 0.36 | 1.24 | 1.82 | 0.30 | 1.16 |
| Same hour yesterday | 0.30 | 0.30 | 0.30 | 0.30 | 0.31 |
| Mean of the history | 0.82 | 0.90 | 0.91 | 0.92 | 0.88 |
| Linear autoregression | 0.22 | 0.22 | 0.22 | 0.22 | 0.23 |
| Trend and daily profile | 0.23 | 0.23 | 0.23 | 0.23 | 0.23 |

### Degrading vibration (12 series)

| Candidate | 1 h ahead | 6 h ahead | 12 h ahead | 24 h ahead | Mean of the 24 h |
|---|---|---|---|---|---|
| Last value | 0.29 | 0.94 | 1.37 | 0.29 | 0.89 |
| Same hour yesterday | 0.27 | 0.29 | 0.29 | 0.29 | 0.27 |
| Mean of the history | 2.68 | 2.70 | 2.71 | 2.82 | 2.74 |
| Linear autoregression | 0.18 | 0.19 | 0.19 | 0.21 | 0.19 |
| Trend and daily profile | 0.19 | 0.21 | 0.20 | 0.19 | 0.19 |

### Healthy temperature (2 series)

| Candidate | 1 h ahead | 6 h ahead | 12 h ahead | 24 h ahead | Mean of the 24 h |
|---|---|---|---|---|---|
| Last value | 0.23 | 1.28 | 1.88 | 0.06 | 1.15 |
| Same hour yesterday | 0.06 | 0.05 | 0.06 | 0.06 | 0.06 |
| Mean of the history | 0.82 | 0.92 | 0.94 | 0.94 | 0.90 |
| Linear autoregression | 0.04 | 0.05 | 0.05 | 0.05 | 0.05 |
| Trend and daily profile | 0.08 | 0.07 | 0.07 | 0.08 | 0.08 |

### Degrading temperature (2 series)

| Candidate | 1 h ahead | 6 h ahead | 12 h ahead | 24 h ahead | Mean of the 24 h |
|---|---|---|---|---|---|
| Last value | 0.21 | 1.27 | 1.84 | 0.08 | 1.14 |
| Same hour yesterday | 0.07 | 0.08 | 0.08 | 0.08 | 0.07 |
| Mean of the history | 1.03 | 0.99 | 0.97 | 1.01 | 0.99 |
| Linear autoregression | 0.05 | 0.06 | 0.06 | 0.06 | 0.05 |
| Trend and daily profile | 0.08 | 0.08 | 0.07 | 0.08 | 0.08 |

### Reading them

- **The linear autoregression is the best or tied for best in every group.** On
  vibration it ties with the trend and daily profile; on temperature it is ahead of it.
- **The baseline to beat is "same hour yesterday", not "last value".** Repeating the
  last value is good one hour ahead and bad at 12 hours, when the daily cycle is at its
  opposite. Against yesterday's hour the autoregression is 26 % better on healthy
  vibration (0.23 against 0.31) and 30 % on degrading vibration (0.19 against 0.27).
  The forecast route therefore reports its error beside that of "same hour yesterday".
- **The mean is useless once a series drifts**: 2.74 on degrading vibration.
- **The window barely matters here.** Windows of 24, 48 and 72 hours gave the same
  errors within 0.01. The window stays at 48 hours because it sees two whole daily
  cycles and costs nothing measurable, not because it measured better.

## Decision

The forecast route uses the **linear autoregression on hourly means, with a window of
48 hours and a horizon of 24 hours**. Besides the errors above:

- It is fitted by least squares, a closed formula: the same history always gives the
  same forecast, in milliseconds, with no training to schedule and no model to store.
  The result is kept in memory until the series changes, so the fit runs once per change,
  not once per view ([ADR 0012](adr/0012-forecast.md)).
- It has no dependency, and each of its 49 numbers can be read: the weight of each
  past hour.
- Its uncertainty is measured the same way as here: the errors at each hour ahead over
  the last 20 % of the series become the band around the forecast.

A neural network was considered and left out. Trained on request, it would not answer
within the 350 ms the challenge requires; trained in the background, it would need a
job, a store for models and a rule for when to retrain. Nothing measured here suggests
it would repay that: the series are well described by a linear model.

## Limits

- **The data is simulated, and simple.** A level, a daily cycle and a straight rise are
  exactly what a linear model and "trend and daily profile" assume, so both do well by
  construction. Real vibration is less regular, and how far ahead a forecast stays useful
  on it was not measured here. That is why the route does not assume it is good: it
  measures its own error on each series and reports it beside the forecast.
- **Hourly means hide what happens within the hour.** A peak of ten minutes is not
  forecast; the forecast is about the level.
- **A steady rise is the easy kind of degradation.** A fault that appears suddenly is
  not predicted by any candidate here; that is detection, not forecasting.
- **24 hours.** Longer horizons were not measured. At this horizon a slow degradation
  barely moves the forecast: the degrading series rose about 0.05 mm/s per day, less than
  the daily cycle the model follows, so the forecast answers "how the next day looks",
  not "when a level is crossed". That longer-horizon question the study did not take on.

## Running it

With the API running and `SIMULATOR_EMAIL` and `SIMULATOR_PASSWORD` in `.env`:

1. Create a pump and a fan, each with two monitoring points, and install the sensors
   `SIM-0001` and `SIM-0002` on the pump (`HF+`) and `SIM-0003` and `SIM-0004` on the fan.
2. Store 60 days, two of the sensors degrading since 30 days before the run:

   ```bash
   npm run simulate -- backfill --days 60 --degrade SIM-0002 --degrade SIM-0004 --degrade-since 2026-09-01
   ```

3. Compare the candidates, which takes about 10 seconds:

   ```bash
   node studies/forecast/compare.mjs
   ```

`WINDOW=24` before the command changes the window, and `DEGRADING=SIM-0002,SIM-0004`
names the sensors to group as degrading. With another date of run the instants differ,
and the numbers with them, slightly.
