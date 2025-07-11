import React, { useRef } from 'react';
import { useQuery } from 'react-query';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Fade,
  Grow,
  useTheme,
} from '@mui/material';
import { 
  PictureAsPdf as PictureAsPdfIcon,
  AnalyticsOutlined,
  SecurityOutlined,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { businessApplicationsApi, BusinessApplicationVulnerabilityData } from '../services/api';
import BusinessApplicationHeatmap from '../components/BusinessApplicationHeatmap';
import ApplicationRiskChart from '../components/ApplicationRiskChart';
import VulnerabilityTrendChart from '../components/VulnerabilityTrendChart';
import RepositoryDistributionChart from '../components/RepositoryDistributionChart';
import VulnerabilitySparkline from '../components/VulnerabilitySparkline';
import OrganizationVulnerabilityOverview from '../components/OrganizationVulnerabilityOverview';

const Analytics: React.FC = () => {
  const { organization } = useAuth();
  const theme = useTheme();
  const [isExportingPdf, setIsExportingPdf] = React.useState(false);
  const orgVulnOverviewRef = useRef<HTMLDivElement>(null);
  const distributionRef = useRef<HTMLDivElement>(null);
  const riskChartRef = useRef<HTMLDivElement>(null);
  const trendChartRef = useRef<HTMLDivElement>(null);
  const heatmapRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const { 
    data: vulnerabilityData, 
    isLoading: isVulnLoading, 
    error: vulnError 
  } = useQuery<BusinessApplicationVulnerabilityData[], Error>(
    ['businessApplicationVulnerabilities', organization],
    () => businessApplicationsApi.getVulnerabilityData(organization!),
    { 
      enabled: !!organization, 
    }
  );

  const handleExportToPdf = async () => {
    setIsExportingPdf(true);
    
    // Add PDF-specific styles to ensure gradients are captured properly
    const style = document.createElement('style');
    style.textContent = `
      .pdf-export-mode {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      /* Remove complex effects that don't export well */
      .pdf-export-mode .MuiPaper-root {
        box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
        backdrop-filter: none !important;
      }
      
      /* Main theme gradient - Primary blue/purple */
      .pdf-export-mode [style*="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"],
      .pdf-export-mode [style*="667eea"] {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        background-color: #667eea !important;
      }
      
      /* Error/Critical red gradients */
      .pdf-export-mode [style*="linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)"],
      .pdf-export-mode [style*="linear-gradient(135deg, #8B0000 0%, #B22222 100%)"],
      .pdf-export-mode [style*="linear-gradient(135deg, #FF4444 0%, #FF6666 100%)"],
      .pdf-export-mode [style*="FF6B6B"],
      .pdf-export-mode [style*="ff6b6b"] {
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%) !important;
        background-color: #ff6b6b !important;
      }
      
      /* Success/Low severity green gradients */
      .pdf-export-mode [style*="linear-gradient(135deg, #90EE90 0%, #A8F3A8 100%)"] {
        background: linear-gradient(135deg, #90EE90 0%, #A8F3A8 100%) !important;
        background-color: #90EE90 !important;
      }
      
      /* Warning/Medium orange gradients */
      .pdf-export-mode [style*="linear-gradient(135deg, #FFA500 0%, #FFB733 100%)"] {
        background: linear-gradient(135deg, #FFA500 0%, #FFB733 100%) !important;
        background-color: #FFA500 !important;
      }
      
      /* SAST vulnerabilities - Red */
      .pdf-export-mode [style*="linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)"] {
        background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%) !important;
        background-color: #FF6B6B !important;
      }
      
      /* Leaked Secrets - Teal */
      .pdf-export-mode [style*="linear-gradient(135deg, #4ECDC4 0%, #6FE5DB 100%)"],
      .pdf-export-mode [style*="4ECDC4"] {
        background: linear-gradient(135deg, #4ECDC4 0%, #6FE5DB 100%) !important;
        background-color: #4ECDC4 !important;
      }
      
      /* SCA vulnerabilities - Blue */
      .pdf-export-mode [style*="linear-gradient(135deg, #45B7D1 0%, #67C3D9 100%)"],
      .pdf-export-mode [style*="45B7D1"] {
        background: linear-gradient(135deg, #45B7D1 0%, #67C3D9 100%) !important;
        background-color: #45B7D1 !important;
      }
      
      /* Multi-color gradients for progress bars */
      .pdf-export-mode [style*="linear-gradient(90deg, #FF6B6B 0%, #4ECDC4 50%, #45B7D1 100%)"] {
        background: linear-gradient(90deg, #FF6B6B 0%, #4ECDC4 50%, #45B7D1 100%) !important;
      }
      
      .pdf-export-mode [style*="linear-gradient(90deg, #8B0000 0%, #FF4444 25%, #FFA500 50%, #90EE90 100%)"] {
        background: linear-gradient(90deg, #8B0000 0%, #FF4444 25%, #FFA500 50%, #90EE90 100%) !important;
      }
      
      .pdf-export-mode [style*="linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)"] {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%) !important;
      }
      
      /* White/Light gradients for cards */
      .pdf-export-mode [style*="linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)"] {
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%) !important;
        background-color: #ffffff !important;
      }
      
      /* Preserve text colors during PDF export - more specific rules */
      .pdf-export-mode .MuiTypography-root {
        color: inherit;
      }
      
      /* White text on dark gradient backgrounds */
      .pdf-export-mode [style*="667eea"] .MuiTypography-root,
      .pdf-export-mode [style*="667eea"] * {
        color: white !important;
      }
      
      .pdf-export-mode [style*="ff6b6b"] .MuiTypography-root,
      .pdf-export-mode [style*="ff6b6b"] * {
        color: white !important;
      }
      
      .pdf-export-mode [style*="4ECDC4"] .MuiTypography-root,
      .pdf-export-mode [style*="4ECDC4"] * {
        color: white !important;
      }
      
      .pdf-export-mode [style*="45B7D1"] .MuiTypography-root,
      .pdf-export-mode [style*="45B7D1"] * {
        color: white !important;
      }
      
      .pdf-export-mode [style*="74b9ff"] .MuiTypography-root,
      .pdf-export-mode [style*="74b9ff"] * {
        color: white !important;
      }
      
      /* Ensure icons maintain their colors */
      .pdf-export-mode .MuiSvgIcon-root {
        color: inherit !important;
      }
    `;
    document.head.appendChild(style);

    // Add PDF export mode class to body
    document.body.classList.add('pdf-export-mode');

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      const today = new Date().toISOString().slice(0, 10);
      const fileName = `Vulnerability_Analytics_${organization}_${today}.pdf`;
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 40;
      let yPos = margin;

      // Add title
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      const title = `Vulnerability Posture Insights Report for ${organization}`;
      const textLines = pdf.splitTextToSize(title, pdfWidth - margin * 2);
      pdf.text(textLines, pdfWidth / 2, yPos, { align: 'center' });
      yPos += (textLines.length * 22) + 20;

      const componentsToExport = [
        { ref: orgVulnOverviewRef, title: 'Organization Vulnerability Overview' },
        { ref: riskChartRef, title: 'Application Risk Distribution' },
        { ref: distributionRef, title: 'Repository Distribution by Business App' },
        { ref: trendChartRef, title: 'Vulnerability Trend' },
        { ref: heatmapRef, title: 'Vulnerability Heatmap' },
        { ref: tableRef, title: 'Business Applications Overview' },
      ];

      for (const { ref, title } of componentsToExport) {
        if (ref.current) {
          // Wait a bit for styles to apply
          await new Promise(resolve => setTimeout(resolve, 100));
          
          const canvas = await html2canvas(ref.current, { 
            scale: 3, // Higher scale for better quality
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            width: ref.current.scrollWidth,
            height: ref.current.scrollHeight,
            scrollX: 0,
            scrollY: 0,
            windowWidth: ref.current.scrollWidth,
            windowHeight: ref.current.scrollHeight,
            ignoreElements: (element) => {
              // Skip elements that might cause rendering issues
              return element.classList.contains('MuiBackdrop-root') ||
                     element.classList.contains('MuiModal-root');
            },
            onclone: (clonedDoc) => {
              // Ensure the cloned document also has our PDF styles
              clonedDoc.body.classList.add('pdf-export-mode');
              const clonedStyle = clonedDoc.createElement('style');
              clonedStyle.textContent = style.textContent;
              clonedDoc.head.appendChild(clonedStyle);
              
              // Force layout recalculation
              void clonedDoc.body.offsetHeight;
            }
          });
          const imgData = canvas.toDataURL('image/png', 1.0);
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          const ratio = imgWidth / (pdfWidth - margin * 2);
          const scaledHeight = imgHeight / ratio;

          if (yPos + scaledHeight + 40 > pdfHeight) {
            pdf.addPage();
            yPos = margin;
          }

          pdf.setFontSize(16);
          pdf.setFont('helvetica', 'bold');
          pdf.text(title, margin, yPos);
          yPos += 20;

          pdf.addImage(imgData, 'PNG', margin, yPos, pdfWidth - margin * 2, scaledHeight);
          yPos += scaledHeight + 20;
        }
      }

      pdf.save(fileName);
    } finally {
      // Clean up: remove PDF-specific styles and class
      document.body.classList.remove('pdf-export-mode');
      document.head.removeChild(style);
      setIsExportingPdf(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#d32f2f';
      case 'high': return '#f57c00';
      case 'medium': return '#fbc02d';
      case 'low': return '#388e3c';
      default: return '#757575';
    }
  };

  const repositoryDistributionData = vulnerabilityData?.map(app => ({
    name: app.name,
    value: app.repositoryCount,
  })) || [];

  if (isVulnLoading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 3,
          p: 4,
        }}
      >
        <AnalyticsOutlined 
          sx={{ 
            fontSize: 64, 
            color: 'white', 
            opacity: 0.7, 
            mb: 2,
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { opacity: 0.7, transform: 'scale(1)' },
              '50%': { opacity: 1, transform: 'scale(1.1)' },
              '100%': { opacity: 0.7, transform: 'scale(1)' },
            },
          }} 
        />
        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
          Loading Analytics Dashboard
        </Typography>
        <CircularProgress 
          size={60} 
          thickness={4}
          sx={{ 
            color: 'white',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }} 
        />
      </Box>
    );
  }

  if (vulnError) {
    return (
      <Alert severity="error">
        Failed to load analytics data: {vulnError.message}
      </Alert>
    );
  }

  return (
    <Fade in={true} timeout={600}>
      <Box>
        <Paper
          elevation={8}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 3,
            p: 3,
            mb: 3,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
            },
          }}
        >
          <Box 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center"
            sx={{ position: 'relative', zIndex: 1 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AnalyticsOutlined 
                sx={{ 
                  fontSize: 48, 
                  mr: 2,
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                }} 
              />
              <Box>
                <Typography 
                  variant="h4" 
                  fontWeight="bold" 
                  sx={{ 
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    mb: 1,
                  }}
                >
                  Analytics Dashboard
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    opacity: 0.9,
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  }}
                >
                  Vulnerability and security insights for {organization}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<PictureAsPdfIcon />}
              onClick={handleExportToPdf}
              sx={{
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                fontWeight: 'bold',
                px: 3,
                py: 1.5,
                '&:hover': {
                  background: 'rgba(255,255,255,0.3)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Export to PDF
            </Button>
          </Box>
        </Paper>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} ref={orgVulnOverviewRef}>
          <OrganizationVulnerabilityOverview />
        </Grid>
        {vulnerabilityData && vulnerabilityData.length > 0 ? (
          <>
            <Grid item xs={12} md={6} ref={distributionRef}>
                <RepositoryDistributionChart data={repositoryDistributionData} />
            </Grid>
            <Grid item xs={12} md={6} ref={riskChartRef}>
              <ApplicationRiskChart vulnerabilityData={vulnerabilityData} />
            </Grid>
            <Grid item xs={12} ref={trendChartRef}>
              <VulnerabilityTrendChart />
            </Grid>
            <Grid item xs={12} ref={heatmapRef}>
              <BusinessApplicationHeatmap vulnerabilityData={vulnerabilityData} />
            </Grid>
            <Grid item xs={12} ref={tableRef}>
              <Grow in={true} timeout={2000}>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <SecurityOutlined 
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
                        Business Applications Overview
                      </Typography>
                    </Box>
                    <TableContainer 
                      component={Paper} 
                      sx={{ 
                        mt: 2,
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow 
                            sx={{ 
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            }}
                          >
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                              Business Application
                            </TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                              Business Owner
                            </TableCell>
                            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>
                              Repositories
                            </TableCell>
                            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>
                              Vulnerability Chart
                            </TableCell>
                            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>
                              Total Vulnerabilities
                            </TableCell>
                            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>
                              Critical
                            </TableCell>
                            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>
                              High
                            </TableCell>
                            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>
                              Medium
                            </TableCell>
                            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>
                              Low
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {vulnerabilityData.map((app, index) => (
                            <TableRow 
                              key={app.id}
                              sx={{
                                '&:nth-of-type(odd)': {
                                  backgroundColor: 'rgba(102, 126, 234, 0.02)',
                                },
                                '&:hover': {
                                  backgroundColor: 'rgba(102, 126, 234, 0.08)',
                                  transform: 'scale(1.01)',
                                  transition: 'all 0.2s ease',
                                },
                                transition: 'all 0.2s ease',
                              }}
                            >
                              <TableCell sx={{ fontWeight: 500 }}>{app.name}</TableCell>
                              <TableCell sx={{ color: 'text.secondary' }}>{app.businessOwnerEmail}</TableCell>
                              <TableCell align="center">
                                <Box sx={{
                                  display: 'inline-flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  minWidth: 32, 
                                  padding: '4px 12px', 
                                  height: 32, 
                                  borderRadius: '16px',
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  color: 'white',
                                  fontWeight: 'bold', 
                                  fontSize: '0.85rem',
                                  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                                }}>
                                  {app.repositoryCount}
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <VulnerabilitySparkline data={app.vulnerabilities} />
                              </TableCell>
                              <TableCell align="center">
                                <Box sx={{
                                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                  minWidth: 32, padding: '4px 12px', height: 32, borderRadius: '16px',
                                  background: app.vulnerabilities.total > 0 ? 
                                    'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)' : 
                                    'linear-gradient(135deg, #90EE90 0%, #7BCF7B 100%)',
                                  color: 'white',
                                  fontWeight: 'bold', fontSize: '0.85rem',
                                  boxShadow: app.vulnerabilities.total > 0 ? 
                                    '0 2px 8px rgba(255, 165, 0, 0.3)' : 
                                    '0 2px 8px rgba(144, 238, 144, 0.3)',
                                }}>
                                  {app.vulnerabilities.total}
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <Box sx={{
                                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                  minWidth: 32, padding: '4px 12px', height: 32, borderRadius: '16px',
                                  background: app.vulnerabilities.critical > 0 ? 
                                    'linear-gradient(135deg, #8B0000 0%, #B22222 100%)' : 
                                    'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                                  color: app.vulnerabilities.critical > 0 ? 'white' : 'text.secondary',
                                  fontWeight: 'bold', fontSize: '0.85rem',
                                  boxShadow: app.vulnerabilities.critical > 0 ? 
                                    '0 2px 8px rgba(139, 0, 0, 0.4)' : 
                                    '0 1px 3px rgba(0, 0, 0, 0.1)',
                                }}>
                                  {app.vulnerabilities.critical}
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <Box sx={{
                                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                  minWidth: 32, padding: '4px 12px', height: 32, borderRadius: '16px',
                                  background: app.vulnerabilities.high > 0 ? 
                                    'linear-gradient(135deg, #FF4444 0%, #FF6666 100%)' : 
                                    'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                                  color: app.vulnerabilities.high > 0 ? 'white' : 'text.secondary',
                                  fontWeight: 'bold', fontSize: '0.85rem',
                                  boxShadow: app.vulnerabilities.high > 0 ? 
                                    '0 2px 8px rgba(255, 68, 68, 0.4)' : 
                                    '0 1px 3px rgba(0, 0, 0, 0.1)',
                                }}>
                                  {app.vulnerabilities.high}
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <Box sx={{
                                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                  minWidth: 32, padding: '4px 12px', height: 32, borderRadius: '16px',
                                  background: app.vulnerabilities.medium > 0 ? 
                                    'linear-gradient(135deg, #FFA500 0%, #FFB733 100%)' : 
                                    'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                                  color: app.vulnerabilities.medium > 0 ? 'white' : 'text.secondary',
                                  fontWeight: 'bold', fontSize: '0.85rem',
                                  boxShadow: app.vulnerabilities.medium > 0 ? 
                                    '0 2px 8px rgba(255, 165, 0, 0.4)' : 
                                    '0 1px 3px rgba(0, 0, 0, 0.1)',
                                }}>
                                  {app.vulnerabilities.medium}
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <Box sx={{
                                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                  minWidth: 32, padding: '4px 12px', height: 32, borderRadius: '16px',
                                  background: app.vulnerabilities.low > 0 ? 
                                    'linear-gradient(135deg, #90EE90 0%, #A8F3A8 100%)' : 
                                    'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                                  color: app.vulnerabilities.low > 0 ? 'white' : 'text.secondary',
                                  fontWeight: 'bold', fontSize: '0.85rem',
                                  boxShadow: app.vulnerabilities.low > 0 ? 
                                    '0 2px 8px rgba(144, 238, 144, 0.4)' : 
                                    '0 1px 3px rgba(0, 0, 0, 0.1)',
                                }}>
                                  {app.vulnerabilities.low}
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mt: 2 }}>
              No business applications found or vulnerability data not available. 
              Please ensure you have created business applications and they have repositories mapped.
            </Alert>
          </Grid>
        )}
      </Grid>
    </Box>
    </Fade>
  );
};

export default Analytics;
