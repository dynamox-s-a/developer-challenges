import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import Highcharts from "highcharts";
import {
  selectAcceleration,
  selectVelocity,
  selectTemperature,
} from "@/domain/data/selectors";
import AccelerationChart from "./AccelerationChart";
import VelocityChart from "./VelocityChart";
import TemperatureChart from "./TemperatureChart";
import { PreparedSeries } from "@/domain/data/types";

function computeExtremes(...groups: PreparedSeries[][]) {
  let min = Infinity,
    max = -Infinity;
  for (const arr of groups) {
    for (const s of arr) {
      for (const [x] of s.points) {
        if (x < min) min = x;
        if (x > max) max = x;
      }
    }
  }
  return min === Infinity ? null : { xMin: min, xMax: max };
}

function nearestPoint(
  series: Highcharts.Series,
  x: number
): Highcharts.Point | null {
  const pts = series.points as Highcharts.Point[];
  if (!pts || pts.length === 0) return null;

  let lo = 0,
    hi = pts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const midX = pts[mid].x as number;
    if (midX < x) lo = mid + 1;
    else hi = mid;
  }
  let cand = pts[lo];
  if (lo > 0) {
    const prev = pts[lo - 1];
    if (Math.abs((prev.x as number) - x) <= Math.abs((cand.x as number) - x)) {
      cand = prev;
    }
  }
  return cand;
}

function toMouseEvent(native: MouseEvent | TouchEvent): MouseEvent {
  let clientX: number, clientY: number;
  if ("touches" in native && native.touches.length) {
    clientX = native.touches[0].clientX;
    clientY = native.touches[0].clientY;
  } else {
    const m = native as MouseEvent;
    clientX = m.clientX;
    clientY = m.clientY;
  }
  return new MouseEvent("mousemove", {
    clientX,
    clientY,
    bubbles: true,
    cancelable: true,
  });
}

export default function ChartsGroup() {
  const acc = useSelector(selectAcceleration);
  const vel = useSelector(selectVelocity);
  const tmp = useSelector(selectTemperature);

  const [accChart, setAccChart] = useState<Highcharts.Chart | null>(null);
  const [velChart, setVelChart] = useState<Highcharts.Chart | null>(null);
  const [tmpChart, setTmpChart] = useState<Highcharts.Chart | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const extremes = useMemo(
    () => computeExtremes(acc, vel, tmp),
    [acc, vel, tmp]
  );

  const listCharts = useCallback(
    () => [accChart, velChart, tmpChart].filter(Boolean) as Highcharts.Chart[],
    [accChart, velChart, tmpChart]
  );

  const findOriginChart = useCallback(
    (target: EventTarget | null) => {
      const charts = listCharts();
      const node = target as Node | null;
      for (const c of charts) {
        if (node && c.container.contains(node)) return c;
      }
      return charts[0] ?? null;
    },
    [listCharts]
  );

  const handleMove = useCallback(
    (native: MouseEvent | TouchEvent) => {
      const charts = listCharts();
      if (charts.length === 0) return;

      const origin = findOriginChart(native.target || null) ?? charts[0];
      const originMouse = toMouseEvent(native);
      const originNorm = origin.pointer.normalize(originMouse);
      const xValue = origin.xAxis[0].toValue(originNorm.chartX);

      charts.forEach((chart) => {
        const axis = chart.xAxis[0];

        const points = chart.series
          .filter((s) => s.visible !== false)
          .map((s) => nearestPoint(s, xValue))
          .filter((p): p is Highcharts.Point => !!p);

        if (points.length === 0) return;

        const plotX = axis.toPixels(xValue, true);
        const chartPos = chart.pointer.getChartPosition();
        const clientX =
          chartPos.left + chart.plotLeft + plotX - window.pageXOffset;
        const clientY =
          chartPos.top +
          chart.plotTop +
          (points[0].plotY ?? chart.plotHeight / 2) -
          window.pageYOffset;

        const mouse = new MouseEvent("mousemove", {
          clientX,
          clientY,
          bubbles: true,
          cancelable: true,
        });
        const e = chart.pointer.normalize(mouse);

        points.forEach((pt) => pt.setState("hover"));
        chart.tooltip.refresh(points, e);

        axis.drawCrosshair(e, points[0]);
      });
    },
    [listCharts, findOriginChart]
  );

  const handleLeave = useCallback(() => {
    listCharts().forEach((c) => {
      c.tooltip.hide(0);
      c.xAxis[0].hideCrosshair();
      c.series.forEach((s) => s.points.forEach((pt) => pt.setState("")));
    });
  }, [listCharts]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMouseMove = (e: MouseEvent) => handleMove(e);
    const onTouchMove = (e: TouchEvent) => handleMove(e);
    const onTouchStart = (e: TouchEvent) => handleMove(e);
    const onMouseLeave = () => handleLeave();

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [handleMove, handleLeave]);

  return (
    <div ref={containerRef}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <AccelerationChart
              series={acc}
              onReady={setAccChart}
              xMin={extremes?.xMin}
              xMax={extremes?.xMax}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <VelocityChart
              series={vel}
              onReady={setVelChart}
              xMin={extremes?.xMin}
              xMax={extremes?.xMax}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={12} lg={4}>
          <Paper sx={{ p: 2 }}>
            <TemperatureChart
              series={tmp}
              onReady={setTmpChart}
              xMin={extremes?.xMin}
              xMax={extremes?.xMax}
            />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
