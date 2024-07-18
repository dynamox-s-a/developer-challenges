import Highcharts from 'highcharts';

export const formatDateLabel = (value: number | string): string => {
  return Highcharts.dateFormat(
    '%e. %b',
    typeof value === 'number' ? value : new Date(value).getTime(),
  );
};
