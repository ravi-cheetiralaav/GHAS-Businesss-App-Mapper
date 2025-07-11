import React, { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Fade,
  Grow,
  useTheme,
  IconButton,
  Tooltip,
  Popover,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { AssessmentOutlined, InfoOutlined } from '@mui/icons-material';
import { BusinessApplicationVulnerabilityData } from '../services/api';

interface ApplicationRiskChartProps {
  vulnerabilityData: BusinessApplicationVulnerabilityData[];
}

const ApplicationRiskChart: React.FC<ApplicationRiskChartProps> = ({ vulnerabilityData }) => {
  const theme = useTheme();
  const [infoAnchorEl, setInfoAnchorEl] = useState<HTMLElement | null>(null);
  
  const handleInfoClick = (event: React.MouseEvent<HTMLElement>) => {
    setInfoAnchorEl(event.currentTarget);
  };
  
  const handleInfoClose = () => {
    setInfoAnchorEl(null);
  };
  
  const infoOpen = Boolean(infoAnchorEl);
  
  const calculateRiskScore = (vulnerabilities: BusinessApplicationVulnerabilityData['vulnerabilities']) => {
    return (
      vulnerabilities.critical * 10 +
      vulnerabilities.high * 5 +
      vulnerabilities.medium * 2 +
      vulnerabilities.low * 1
    );
  };

  const getBarColor = (risk: number) => {
    if (risk > 100) return '#8B0000';
    if (risk > 50) return '#FF4444';
    if (risk > 20) return '#FFA500';
    return '#90EE90';
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
    <Fade in={true} timeout={1000}>
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
            background: 'linear-gradient(90deg, #8B0000 0%, #FF4444 25%, #FFA500 50%, #90EE90 100%)',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AssessmentOutlined 
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
                flex: 1,
              }}
            >
              Application Risk Score
            </Typography>
            <Tooltip title="Click for calculation details" arrow>
              <IconButton 
                onClick={handleInfoClick}
                size="small"
                sx={{ 
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  },
                }}
              >
                <InfoOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Grow in={true} timeout={1400}>
            <Box sx={{ height: 320 }}>
              <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
              />
            </Box>
          </Grow>
          
          {/* Info Popover */}
          <Popover
            open={infoOpen}
            anchorEl={infoAnchorEl}
            onClose={handleInfoClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            sx={{
              '& .MuiPopover-paper': {
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                border: '1px solid rgba(0,0,0,0.08)',
              },
            }}
          >
            <Paper sx={{ p: 3, maxWidth: 400 }}>
              <Typography 
                variant="h6" 
                fontWeight="bold" 
                sx={{ 
                  mb: 2,
                  color: theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <AssessmentOutlined fontSize="small" />
                Risk Score Calculation
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                The application risk score is calculated using a weighted formula based on vulnerability severity:
              </Typography>
              
              <Box 
                sx={{ 
                  backgroundColor: 'rgba(102, 126, 234, 0.05)',
                  borderRadius: 1,
                  p: 2,
                  mb: 2,
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                }}
              >
                <Typography 
                  variant="body2" 
                  fontFamily="monospace"
                  sx={{ 
                    fontWeight: 'bold',
                    color: theme.palette.primary.main,
                    textAlign: 'center',
                  }}
                >
                  Risk Score = (Critical × 10) + (High × 5) + (Medium × 2) + (Low × 1)
                </Typography>
              </Box>
              
              <List dense sx={{ py: 0 }}>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 12, height: 12, backgroundColor: '#8B0000', borderRadius: '50%' }} />
                          <Typography variant="body2" fontWeight="500">Critical vulnerabilities</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">× 10 points</Typography>
                      </Box>
                    }
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 12, height: 12, backgroundColor: '#FF4444', borderRadius: '50%' }} />
                          <Typography variant="body2" fontWeight="500">High vulnerabilities</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">× 5 points</Typography>
                      </Box>
                    }
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 12, height: 12, backgroundColor: '#FFA500', borderRadius: '50%' }} />
                          <Typography variant="body2" fontWeight="500">Medium vulnerabilities</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">× 2 points</Typography>
                      </Box>
                    }
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 12, height: 12, backgroundColor: '#90EE90', borderRadius: '50%' }} />
                          <Typography variant="body2" fontWeight="500">Low vulnerabilities</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">× 1 point</Typography>
                      </Box>
                    }
                  />
                </ListItem>
              </List>
              
              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Higher scores indicate greater security risk. Applications are sorted by risk score in descending order.
                </Typography>
              </Box>
            </Paper>
          </Popover>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default ApplicationRiskChart;
