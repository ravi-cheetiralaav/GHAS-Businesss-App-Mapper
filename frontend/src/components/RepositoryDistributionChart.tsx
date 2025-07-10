import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface RepositoryDistributionChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560', '#775DD0'];

const RepositoryDistributionChart: React.FC<RepositoryDistributionChartProps> = ({ data }) => {
  const chartOptions: Highcharts.Options = {
    chart: {
      type: 'pie',
      height: 300,
    },
    title: {
      text: undefined,
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b><br/>Repositories: <b>{point.y}</b>',
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
        },
        showInLegend: true,
      }
    },
    series: [{
      name: 'Repositories',
      type: 'pie',
      data: data.map((item, index) => ({
        name: `${item.name} (${item.value})`,
        y: item.value,
        color: COLORS[index % COLORS.length],
      })),
    }],
    credits: {
      enabled: false,
    },
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal',
    },
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Repository Distribution by Application
        </Typography>
        <Box sx={{ height: 300 }}>
          <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default RepositoryDistributionChart;
