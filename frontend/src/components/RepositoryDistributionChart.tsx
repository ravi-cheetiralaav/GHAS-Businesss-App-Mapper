import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Paper,
  Fade,
  Grow,
  useTheme,
} from '@mui/material';
import { AccountTreeOutlined } from '@mui/icons-material';

interface RepositoryDistributionChartProps {
  data: { name: string; value: number }[];
}

const MODERN_COLORS = [
  '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', 
  '#00f2fe', '#43e97b', '#38f9d7', '#ffecd2', '#fcb69f'
];

const RepositoryDistributionChart: React.FC<RepositoryDistributionChartProps> = ({ data }) => {
  const theme = useTheme();
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
        color: MODERN_COLORS[index % MODERN_COLORS.length],
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
    <Fade in={true} timeout={800}>
      <Card 
        elevation={8}
        sx={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AccountTreeOutlined 
              sx={{ 
                fontSize: 32, 
                mr: 2, 
                color: theme.palette.primary.main,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
              }} 
            />
            <Typography 
              variant="h6" 
              fontWeight="bold"
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Repository Distribution by Application
            </Typography>
          </Box>
          <Grow in={true} timeout={1200}>
            <Box sx={{ height: 320 }}>
              <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
              />
            </Box>
          </Grow>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default RepositoryDistributionChart;
