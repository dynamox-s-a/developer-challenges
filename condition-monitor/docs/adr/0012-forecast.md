# 0012. Forecast by linear autoregression, cached in memory

- Status: accepted
- Date: 2026-10-01

## Context

The challenge offers, as a bonus, a prediction of the future of a time-series. It must
come with its uncertainty, answer within the 350 ms latency target under load, and run
on Node, without a Python service.

## Decision

A **linear autoregression over hourly means**: each hour is a weighted sum of the 48
hours before it, the weights fitted by least squares, predicting 24 hours ahead. The
band around the forecast is the model's own error on the last fifth of the history,
which it was not fitted on, and that error is reported beside the baseline of repeating
the same hour a day earlier. The choice is backed by a study of five candidates on
simulated data ([forecast-study.md](../forecast-study.md)).

The forecast is **computed on each request and kept in memory** per series, with a
signature built from the series' reading count and the instant of its latest reading.
While the data is unchanged the kept forecast is returned; any reading added or removed
changes the signature and the forecast is computed again.

## Alternatives considered

- **A neural network.** Trained on request, it would miss the latency target; trained
  in the background, it would need a job, a store for models and a retraining rule.
  Nothing measured suggested it would do better than the linear model on these series.
- **Storing forecasts in the database.** A forecast is cheap to recompute and depends
  only on the readings, so a per-process memory cache needs nothing shared: another
  process reaches the same forecast from the same data.
- **No cache.** Measured at a 99th percentile around 440 ms under load, above the
  target: the fit over a month of hourly means runs on the thread that serves every
  request, and the screen asks for seven series at once ([performance](../performance.md)).

## Consequences

- The fit is a closed formula with no dependency, and its 49 weights can be read.
- The cache holds at most 1,000 series and drops the least recently computed; it is
  empty after a restart and fills on demand.
- A live sensor changes its series every interval, so in production each forecast is
  recomputed about that often; the cache helps most where a series is read more often
  than it is written.
- History is capped at 30 days, to keep the model about how the machine runs now and
  the computation short.
