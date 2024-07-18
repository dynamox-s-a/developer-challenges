import Highcharts from 'highcharts';

export const formatTooltip = function (
  this: Highcharts.TooltipFormatterContextObject,
): string {
  return `<b>${this.series.name}</b><br/>${Highcharts.dateFormat('%e. %b %H:%M', this.x as number)}: ${this.y}`;
};
