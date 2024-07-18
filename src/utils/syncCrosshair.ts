import Highcharts from "highcharts";

export const syncCrosshair = (chart: Highcharts.Chart, e: MouseEvent) => {
    const charts = Highcharts.charts;
    if (charts) {
      charts.forEach(function (syncedChart) {
        if (syncedChart && syncedChart !== chart) {
          const event = syncedChart.pointer.normalize(e); 
          const point = syncedChart.series[0].searchPoint(event, true); 
  
          if (point) {
            syncedChart.xAxis[0].drawCrosshair(event, point); 
            syncedChart.tooltip.refresh(point); 
          }
        }
      });
    }
  };
  