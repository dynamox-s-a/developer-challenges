import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import type { MetricKind } from "./types";

export const selectDashboard = (state: RootState) => state.dashboard;

export const selectFilteredSeries = createSelector(
  [selectDashboard],
  ({ series, periodDays }) => {
    if (!periodDays || series.length === 0) return series;

    const latestTimestamp = Math.max(
      ...series.flatMap((item) =>
        item.data.map((point) => Date.parse(point.datetime)),
      ),
    );
    const threshold = latestTimestamp - periodDays * 24 * 60 * 60 * 1000;

    return series.map((item) => ({
      ...item,
      data: item.data.filter(
        (point) => Date.parse(point.datetime) >= threshold,
      ),
    }));
  },
);

export const selectMetricSeries = (
  series: ReturnType<typeof selectFilteredSeries>,
  metric: MetricKind,
) =>
  series.filter((item) =>
    metric === "temperature"
      ? item.name === "temperature"
      : item.name.startsWith(metric),
  );
