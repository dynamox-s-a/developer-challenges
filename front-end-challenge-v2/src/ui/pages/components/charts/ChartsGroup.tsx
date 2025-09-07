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

// Busca binária pelo ponto mais próximo em X
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

// Extrai clientX/clientY de MouseEvent ou TouchEvent
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

  // Encontra o chart onde o evento ocorreu
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

  // Sincroniza por timestamp: calcula xValue no chart de origem e aplica nos demais
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
        const series = chart.series[0];
        if (!series) return;

        const p = nearestPoint(series, xValue);
        if (!p) return;

        // Constrói um evento posicionado no mesmo timestamp dentro deste chart
        const plotX = axis.toPixels(xValue, true); // px no plot deste chart
        const chartPos = chart.pointer.getChartPosition();
        const clientX =
          chartPos.left + chart.plotLeft + plotX - window.pageXOffset;
        const clientY =
          chartPos.top +
          chart.plotTop +
          (p.plotY ?? chart.plotHeight / 2) -
          window.pageYOffset;
        const mouse = new MouseEvent("mousemove", {
          clientX,
          clientY,
          bubbles: true,
          cancelable: true,
        });
        const e = chart.pointer.normalize(mouse);

        p.setState("hover");
        chart.tooltip.refresh(p, e);
        axis.drawCrosshair(e, p);
      });
    },
    [listCharts, findOriginChart]
  );

  const handleLeave = useCallback(() => {
    listCharts().forEach((c) => {
      c.tooltip.hide(0);
      c.xAxis[0].hideCrosshair();
      // remove hover state para garantir o marker sumir
      c.series[0]?.points.forEach((pt) => pt.setState(""));
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
