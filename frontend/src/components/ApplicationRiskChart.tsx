import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { BusinessApplicationVulnerabilityData } from '../services/api';

interface ApplicationRiskChartProps {
  vulnerabilityData: BusinessApplicationVulnerabilityData[];
}

const ApplicationRiskChart: React.FC<ApplicationRiskChartProps> = ({ vulnerabilityData }) => {
  const calculateRiskScore = (vulnerabilities: BusinessApplicationVulnerabilityData['vulnerabilities']) => {
    return (
      vulnerabilities.critical * 10 +
      vulnerabilities.high * 5 +
      vulnerabilities.medium * 2 +
      vulnerabilities.low * 1
    );
  };

  const getBarColor = (risk: number) => {
    if (risk > 100) return '#d32f2f';
    if (risk > 50) return '#f57c00';
    if (risk > 20) return '#fbc02d';
    return '#388e3c';
  };

  const chartData = vulnerabilityData.map(app => ({
    name: app.name,
    risk: calculateRiskScore(app.vulnerabilities),
  })).sort((a, b) => b.risk - a.risk);

  const chartOptions: Highcharts.Options = {
    chart: {
      type: 'bar',
      height: 300,
    },
    title: {
      text: undefined,
    },
    xAxis: {
      categories: chartData.map(item => item.name),
      title: {
        text: null,
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Risk Score',
        align: 'high',
      },
      labels: {
        overflow: 'justify',
      },
    },
    tooltip: {
      valueSuffix: ' points',
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">Risk Score: </td>' +
        '<td style="padding:0"><b>{point.y}</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          format: '{point.y}',
        },
      },
    },
    series: [{
      name: 'Risk Score',
      type: 'bar',
      data: chartData.map(item => ({
        name: item.name,
        y: item.risk,
        color: getBarColor(item.risk),
      })),
    }],
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Application Risk Score
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

export default ApplicationRiskChart;
