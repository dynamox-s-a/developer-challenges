import { Card, CardContent, Typography } from '@mui/material';
import { Pie, PieChart, PieLabelRenderProps, Tooltip, Legend } from 'recharts';

interface PieChartCardProps {
  title: string;
  data: { name: string; value: number }[];
  colors: string[];
}

const RADIAN = Math.PI / 180;

const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelRenderProps) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null || (percent ?? 0) === 0) {
    return null;
  }
  const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5;
  const ncx = Number(cx);
  const ncy = Number(cy);
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight="bold">
      {`${((percent ?? 0) * 100).toFixed(0)}%`}
    </text>
  );
};

function PieChartCard({ title, data, colors }: PieChartCardProps) {
  const chartData = data.map((item, index) => ({
    ...item,
    fill: colors[index % colors.length],
  }));

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <PieChart style={{ width: '100%', aspectRatio: 1.8 }} responsive>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="70%"
            labelLine={false}
            label={renderLabel}
          />
          <Tooltip />
          <Legend />
        </PieChart>
      </CardContent>
    </Card>
  );
}

export default PieChartCard;
