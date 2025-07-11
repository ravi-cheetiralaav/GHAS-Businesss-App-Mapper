import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsHeatmap from 'highcharts/modules/heatmap';
import {
  Card,
  CardContent,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid,
  Fade,
  Grow,
  useTheme,
  Paper,
} from '@mui/material';
import { GridOnOutlined } from '@mui/icons-material';
import { BusinessApplicationVulnerabilityData } from '../services/api';

// Initialize Heatmap module
try {
  require('highcharts/modules/heatmap')(Highcharts);
} catch (e) {
  // Module already loaded or not available
}

interface BusinessApplicationHeatmapProps {
  vulnerabilityData: BusinessApplicationVulnerabilityData[];
}

interface HeatmapDataPoint {
  x: number;
  y: number;
  value: number;
  name: string;
  vulnerabilityCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
}

const RiskLegend = () => {
  const legendItems = [
    { label: 'Low Risk', color: '#ffffcc' },
    { label: 'Medium Risk', color: '#ffeda0' },
    { label: 'High Risk', color: '#feb24c' },
    { label: 'Very High Risk', color: '#f03b20' },
    { label: 'Critical Risk', color: '#bd0026' },
  ];

  return (
    <Box mt={3}>
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Risk Level Legend
      </Typography>
      <Grid container spacing={2}>
        {legendItems.map((item) => (
          <Grid item key={item.label} xs>
            <Box display="flex" alignItems="center">
              <Box sx={{ width: 20, height: 20, backgroundColor: item.color, border: '1px solid #ccc', mr: 1 }} />
              <Typography variant="body2">{item.label}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Typography variant="caption" color="text.secondary" mt={1} display="block">
        This legend provides a general guide to the risk levels indicated by the heatmap colors. The actual color of each cell is determined by the specific vulnerability count and the selected view mode, based on a gradient from low to high risk.
      </Typography>
    </Box>
  );
};

const BusinessApplicationHeatmap: React.FC<BusinessApplicationHeatmapProps> = ({
  vulnerabilityData,
}) => {
  const theme = useTheme();
  const [viewMode, setViewMode] = useState<'total' | 'critical' | 'high'>('total');
  const [heatmapData, setHeatmapData] = useState<HeatmapDataPoint[]>([]);

  const handleViewModeChange = (event: SelectChangeEvent) => {
    setViewMode(event.target.value as 'total' | 'critical' | 'high');
  };

  useEffect(() => {
    if (!vulnerabilityData || vulnerabilityData.length === 0) {
      setHeatmapData([]);
      return;
    }

    // Calculate grid dimensions based on number of applications
    const appCount = vulnerabilityData.length;
    const gridSize = Math.ceil(Math.sqrt(appCount));
    
    const data: HeatmapDataPoint[] = vulnerabilityData.map((app, index) => {
      const x = index % gridSize;
      const y = Math.floor(index / gridSize);
      
      // Use actual vulnerability data from the API
      const totalVulns = app.vulnerabilities.total;
      const criticalCount = app.vulnerabilities.critical;
      const highCount = app.vulnerabilities.high;
      const mediumCount = app.vulnerabilities.medium;
      const lowCount = app.vulnerabilities.low;

      let value = totalVulns;
      if (viewMode === 'critical') value = criticalCount;
      if (viewMode === 'high') value = highCount;

      return {
        x,
        y,
        value,
        name: app.name,
        vulnerabilityCount: totalVulns,
        criticalCount,
        highCount,
        mediumCount,
        lowCount,
      };
    });

    setHeatmapData(data);
  }, [vulnerabilityData, viewMode]);

  const getColorStops = () => {
    switch (viewMode) {
      case 'critical':
        return [
          [0, '#ffffff'],
          [0.1, '#ffebee'],
          [0.3, '#ffcdd2'],
          [0.5, '#ef5350'],
          [0.7, '#d32f2f'],
          [0.9, '#b71c1c'],
          [1, '#8b0000'],
        ];
      case 'high':
        return [
          [0, '#ffffff'],
          [0.1, '#fff3e0'],
          [0.3, '#ffcc02'],
          [0.5, '#ff9800'],
          [0.7, '#f57c00'],
          [0.9, '#e65100'],
          [1, '#d84315'],
        ];
      default:
        return [
          [0, '#ffffff'],
          [0.1, '#ffebee'],
          [0.2, '#ffcdd2'],
          [0.4, '#ef5350'],
          [0.6, '#f44336'],
          [0.8, '#d32f2f'],
          [1, '#b71c1c'],
        ];
    }
  };

  const chartOptions: Highcharts.Options = {
    chart: {
      type: 'heatmap',
      marginTop: 40,
      marginBottom: 80,
      plotBorderWidth: 1,
      height: 500,
    },
    title: {
      text: `Business Applications - ${viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} Vulnerabilities`,
      style: {
        fontSize: '18px',
        fontWeight: 'bold',
      },
    },
    xAxis: {
      categories: [],
      title: undefined,
      labels: {
        enabled: false,
      },
    },
    yAxis: {
      categories: [],
      title: undefined,
      labels: {
        enabled: false,
      },
      reversed: true,
    },
    colorAxis: {
      min: 0,
      minColor: '#ffffff',
      maxColor: viewMode === 'critical' ? '#8b0000' : viewMode === 'high' ? '#d84315' : '#b71c1c',
      stops: getColorStops() as [number, string][],
    },
    legend: {
      align: 'right',
      layout: 'vertical',
      margin: 0,
      verticalAlign: 'top',
      y: 25,
      symbolHeight: 280,
    },
    tooltip: {
      useHTML: true,
      formatter: function (this: any) {
        const point = this.point;
        return `
          <div style="padding: 10px; min-width: 200px;">
            <h4 style="margin: 0 0 10px 0; color: #333;">${point.name}</h4>
            <div style="display: flex; flex-direction: column; gap: 5px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="font-weight: bold;">Total Vulnerabilities:</span>
                <span>${point.vulnerabilityCount}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #8b0000; font-weight: bold;">Critical:</span>
                <span>${point.criticalCount}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #d32f2f; font-weight: bold;">High:</span>
                <span>${point.highCount}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #f57c00; font-weight: bold;">Medium:</span>
                <span>${point.mediumCount}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #ff9800; font-weight: bold;">Low:</span>
                <span>${point.lowCount}</span>
              </div>
              <hr style="margin: 8px 0; border: none; border-top: 1px solid #eee;">
              <div style="display: flex; justify-content: space-between;">
                <span style="font-weight: bold;">Current View:</span>
                <span style="font-weight: bold;">${point.value}</span>
              </div>
            </div>
          </div>
        `;
      },
    },
    plotOptions: {
      heatmap: {
        borderWidth: 2,
        borderColor: '#ffffff',
        dataLabels: {
          enabled: true,
          color: '#000000',
          style: {
            textOutline: 'none',
            fontSize: '10px',
            fontWeight: 'bold',
          },
          formatter: function (this: any) {
            const point = this.point;
            const appName = point.name.length > 12 ? point.name.substring(0, 9) + '...' : point.name;
            return `${appName}<br/><b>${point.value}</b>`;
          },
        },
      },
    },
    series: [
      {
        type: 'heatmap',
        name: `${viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} Vulnerabilities`,
        data: heatmapData,
        dataLabels: {
          enabled: true,
        },
      },
    ],
    credits: {
      enabled: false,
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              align: 'center',
              verticalAlign: 'bottom',
              layout: 'horizontal',
            },
          },
        },
      ],
    },
  };

  const getLegendItems = () => {
    const items = [
      { label: 'Critical', color: '#8b0000', count: heatmapData.reduce((sum, item) => sum + item.criticalCount, 0) },
      { label: 'High', color: '#d32f2f', count: heatmapData.reduce((sum, item) => sum + item.highCount, 0) },
      { label: 'Medium', color: '#f57c00', count: heatmapData.reduce((sum, item) => sum + item.mediumCount, 0) },
      { label: 'Low', color: '#ff9800', count: heatmapData.reduce((sum, item) => sum + item.lowCount, 0) },
    ];
    return items;
  };

  return (
    <Fade in={true} timeout={1400}>
      <Card 
        elevation={8}
        sx={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          mb: 4,
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
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <GridOnOutlined 
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
                Business Applications Vulnerability Heatmap
              </Typography>
            </Box>
            <Box
              sx={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 2,
                p: 1,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid rgba(102, 126, 234, 0.2)',
              }}
            >
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel 
                  sx={{ 
                    color: theme.palette.text.primary,
                    '&.Mui-focused': { 
                      color: theme.palette.primary.main 
                    },
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  View Mode
                </InputLabel>
                <Select 
                  value={viewMode} 
                  label="View Mode" 
                  onChange={handleViewModeChange}
                  sx={{ 
                    color: theme.palette.text.primary,
                    backgroundColor: 'white',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(102, 126, 234, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                    '& .MuiSvgIcon-root': {
                      color: theme.palette.text.primary,
                    },
                    '& .MuiSelect-select': {
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      elevation: 8,
                      sx: {
                        backgroundColor: 'white',
                        borderRadius: 2,
                        mt: 1,
                        border: '1px solid rgba(0,0,0,0.1)',
                        '& .MuiMenuItem-root': {
                          color: theme.palette.text.primary,
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          py: 1.5,
                          px: 2,
                          '&:hover': {
                            backgroundColor: 'rgba(102, 126, 234, 0.08)',
                          },
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(102, 126, 234, 0.12)',
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                            '&:hover': {
                              backgroundColor: 'rgba(102, 126, 234, 0.16)',
                            },
                          },
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="total">Total Vulnerabilities</MenuItem>
                  <MenuItem value="critical">Critical Only</MenuItem>
                  <MenuItem value="high">High Priority Only</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {heatmapData.length > 0 ? (
            <Grow in={true} timeout={1800}>
              <Box>
                <Box mb={3}>
                  <Grid container spacing={2}>
                    {getLegendItems().map((item) => (
                      <Grid item key={item.label}>
                        <Paper
                          elevation={4}
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}CC 100%)`,
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            boxShadow: `0 4px 12px ${item.color}40`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: `0 6px 20px ${item.color}60`,
                            },
                          }}
                        >
                          {`${item.label}: ${item.count}`}
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                <Box sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 4 }}>
                  <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                </Box>
                <Typography variant="body2" color="text.secondary" mt={3} sx={{ fontStyle: 'italic' }}>
                  Each cell represents a business application with real vulnerability data from mapped repositories. 
                  The color intensity and numbers indicate the {viewMode === 'total' ? 'total' : viewMode} vulnerability count.
                  Hover over cells for detailed breakdown of all vulnerability types.
                </Typography>
                <RiskLegend />
              </Box>
            </Grow>
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height={300}
              sx={{
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                borderRadius: 2,
                border: '2px dashed rgba(0,0,0,0.1)',
              }}
            >
              <Box textAlign="center">
                <GridOnOutlined sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No vulnerability data available for heatmap
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Business applications need to have mapped repositories with vulnerability scanning enabled
                </Typography>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Fade>
  );
};

export default BusinessApplicationHeatmap;
