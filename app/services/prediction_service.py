from __future__ import annotations

from typing import Optional

import numpy as np

from app.models.timeseries import DataPoint, TimeSeries
from app.schemas.timeseries import DataPointOut, PredictOut


class PredictionService:

    @staticmethod
    def predict(
        series: TimeSeries,
        data_points: list[DataPoint],
        steps: int,
        method: str,
    ) -> PredictOut:
        if len(data_points) < 2:
            raise ValueError("Need at least 2 data points to run a prediction.")

        timestamps = np.array([dp.timestamp for dp in data_points], dtype=np.float64)
        values = np.array([dp.value for dp in data_points], dtype=np.float64)

        interval = float(np.median(np.diff(timestamps)))
        future_ts = np.array(
            [timestamps[-1] + interval * i for i in range(1, steps + 1)],
            dtype=np.float64,
        )

        if method == "auto":
            method = PredictionService._pick_best(timestamps, values)

        if method == "linear":
            preds, lower, upper = PredictionService._linear(timestamps, values, future_ts)
        else:
            preds, lower, upper = PredictionService._holt_winters(values, steps)

        def _points(ts: np.ndarray, vals: np.ndarray) -> list[DataPointOut]:
            return [DataPointOut(timestamp=float(t), value=round(float(v), 6)) for t, v in zip(ts, vals)]

        return PredictOut(
            series_id=series.id,
            series_name=series.name,
            method_used=method,
            steps=steps,
            interval_seconds=interval,
            predictions=_points(future_ts, preds),
            confidence_lower=_points(future_ts, lower) if lower is not None else None,
            confidence_upper=_points(future_ts, upper) if upper is not None else None,
        )

    @staticmethod
    def _pick_best(timestamps: np.ndarray, values: np.ndarray) -> str:
        # hold out last 20% to compare models
        split = max(2, int(len(values) * 0.8))
        train_ts, train_v = timestamps[:split], values[:split]
        test_v = values[split:]

        if len(test_v) == 0:
            return "linear"

        test_ts = timestamps[split:]
        lin_pred, _, _ = PredictionService._linear(train_ts, train_v, test_ts)
        rmse_lin = float(np.sqrt(np.mean((lin_pred - test_v) ** 2)))

        hw_pred, _, _ = PredictionService._holt_winters(train_v, len(test_v))
        rmse_hw = float(np.sqrt(np.mean((hw_pred - test_v) ** 2)))

        return "holt_winters" if rmse_hw < rmse_lin else "linear"

    @staticmethod
    def _linear(
        timestamps: np.ndarray,
        values: np.ndarray,
        future_ts: np.ndarray,
    ) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
        # normalise to avoid floating point issues with large unix timestamps
        t0 = timestamps[0]
        t = timestamps - t0
        ft = future_ts - t0

        n = len(t)
        A = np.column_stack([np.ones(n), t])
        coeffs, _, _, _ = np.linalg.lstsq(A, values, rcond=None)
        a, b = coeffs

        preds = a + b * ft

        # 95% prediction interval
        residuals = values - (a + b * t)
        s2 = np.sum(residuals ** 2) / max(n - 2, 1)
        t_mean = np.mean(t)
        ss_t = np.sum((t - t_mean) ** 2) or 1.0
        se = np.sqrt(s2 * (1 + 1 / n + (ft - t_mean) ** 2 / ss_t))

        return preds, preds - 1.96 * se, preds + 1.96 * se

    @staticmethod
    def _holt_winters(
        values: np.ndarray,
        steps: int,
    ) -> tuple[np.ndarray, Optional[np.ndarray], Optional[np.ndarray]]:
        try:
            from statsmodels.tsa.holtwinters import ExponentialSmoothing

            fit = ExponentialSmoothing(
                values,
                trend="add",
                seasonal=None,
                initialization_method="estimated",
            ).fit(optimized=True, remove_bias=True)

            forecast = fit.forecast(steps)
            # simulate to get confidence bands since statsmodels doesn't give them directly
            sims = fit.simulate(steps, repetitions=200, error="add")
            lower = np.percentile(sims, 2.5, axis=1)
            upper = np.percentile(sims, 97.5, axis=1)
            return forecast, lower, upper

        except Exception:
            # statsmodels not available or fitting failed, fall back to manual holt
            return PredictionService._holt_numpy(values, steps)

    @staticmethod
    def _holt_numpy(values: np.ndarray, steps: int) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
        # grid search over alpha/beta to minimise SSE
        best = {"sse": float("inf"), "alpha": 0.3, "beta": 0.1}

        for alpha in np.arange(0.1, 1.0, 0.1):
            for beta in np.arange(0.0, 0.5, 0.1):
                level, trend = values[0], values[1] - values[0]
                sse = 0.0
                for v in values[1:]:
                    err = v - (level + trend)
                    sse += err ** 2
                    new_level = alpha * v + (1 - alpha) * (level + trend)
                    trend = beta * (new_level - level) + (1 - beta) * trend
                    level = new_level
                if sse < best["sse"]:
                    best = {"sse": sse, "alpha": alpha, "beta": beta}

        alpha, beta = best["alpha"], best["beta"]
        level, trend = values[0], values[1] - values[0]
        residuals = []

        for v in values[1:]:
            pred = level + trend
            residuals.append(v - pred)
            new_level = alpha * v + (1 - alpha) * (level + trend)
            trend = beta * (new_level - level) + (1 - beta) * trend
            level = new_level

        preds = np.array([level + trend * i for i in range(1, steps + 1)])
        se = float(np.std(residuals)) if residuals else 0.0
        return preds, preds - 1.96 * se, preds + 1.96 * se
