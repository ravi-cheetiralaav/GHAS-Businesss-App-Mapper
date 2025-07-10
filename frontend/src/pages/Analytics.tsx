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
} from '@mui/material';
import { PictureAsPdf as PictureAsPdfIcon } from '@mui/icons-material';
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
        const canvas = await html2canvas(ref.current, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
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
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <div>
          <Typography variant="h4" gutterBottom>
            Analytics Dashboard
          </Typography>
          <Typography variant="h6" gutterBottom color="text.secondary">
            Vulnerability and security insights for {organization}
          </Typography>
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PictureAsPdfIcon />}
          onClick={handleExportToPdf}
        >
          Export to PDF
        </Button>
      </Box>

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
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Business Applications Overview
                  </Typography>
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Business Application</strong></TableCell>
                          <TableCell><strong>Business Owner</strong></TableCell>
                          <TableCell align="center"><strong>Repositories</strong></TableCell>
                          <TableCell align="center"><strong>Vulnerability Chart</strong></TableCell>
                          <TableCell align="center"><strong>Total Vulnerabilities</strong></TableCell>
                          <TableCell align="center"><strong>Critical</strong></TableCell>
                          <TableCell align="center"><strong>High</strong></TableCell>
                          <TableCell align="center"><strong>Medium</strong></TableCell>
                          <TableCell align="center"><strong>Low</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {vulnerabilityData.map((app) => (
                          <TableRow key={app.id}>
                            <TableCell>{app.name}</TableCell>
                            <TableCell>{app.businessOwnerEmail}</TableCell>
                            <TableCell align="center">{app.repositoryCount}</TableCell>
                            <TableCell align="center">
                              <VulnerabilitySparkline data={app.vulnerabilities} />
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                minWidth: 24, padding: '0 8px', height: 24, borderRadius: '12px',
                                backgroundColor: app.vulnerabilities.total > 0 ? 'warning.main' : 'success.light',
                                color: app.vulnerabilities.total > 0 ? 'white' : 'text.primary',
                                fontWeight: 'bold', fontSize: '0.8rem'
                              }}>
                                {app.vulnerabilities.total}
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                minWidth: 24, padding: '0 8px', height: 24, borderRadius: '12px',
                                backgroundColor: app.vulnerabilities.critical > 0 ? getSeverityColor('critical') : '#f5f5f5',
                                color: app.vulnerabilities.critical > 0 ? 'white' : 'text.secondary',
                                fontWeight: 'bold', fontSize: '0.8rem'
                              }}>
                                {app.vulnerabilities.critical}
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                minWidth: 24, padding: '0 8px', height: 24, borderRadius: '12px',
                                backgroundColor: app.vulnerabilities.high > 0 ? getSeverityColor('high') : '#f5f5f5',
                                color: app.vulnerabilities.high > 0 ? 'white' : 'text.secondary',
                                fontWeight: 'bold', fontSize: '0.8rem'
                              }}>
                                {app.vulnerabilities.high}
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                minWidth: 24, padding: '0 8px', height: 24, borderRadius: '12px',
                                backgroundColor: app.vulnerabilities.medium > 0 ? getSeverityColor('medium') : '#f5f5f5',
                                color: app.vulnerabilities.medium > 0 ? 'black' : 'text.secondary',
                                fontWeight: 'bold', fontSize: '0.8rem'
                              }}>
                                {app.vulnerabilities.medium}
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                minWidth: 24, padding: '0 8px', height: 24, borderRadius: '12px',
                                backgroundColor: app.vulnerabilities.low > 0 ? getSeverityColor('low') : '#f5f5f5',
                                color: app.vulnerabilities.low > 0 ? 'white' : 'text.secondary',
                                fontWeight: 'bold', fontSize: '0.8rem'
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
  );
};

export default Analytics;
