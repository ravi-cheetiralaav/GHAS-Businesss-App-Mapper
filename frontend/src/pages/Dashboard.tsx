import React from 'react';
import { useQuery } from 'react-query';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { businessApplicationsApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import VulnerabilityOverviewChart from '../components/VulnerabilityOverviewChart';
import ApplicationRiskChart from '../components/ApplicationRiskChart';
import VulnerabilityTrendChart from '../components/VulnerabilityTrendChart';

const Dashboard: React.FC = () => {
  const { organization } = useAuth();

  const { data: stats, isLoading, error } = useQuery(
    ['businessApplicationStats', organization],
    () => businessApplicationsApi.getStats(organization!),
    {
      enabled: !!organization,
    }
  );

  const { data: vulnerabilityData, isLoading: isVulnLoading, error: vulnError } = useQuery(
    ['businessApplicationVulnerabilities', organization],
    () => businessApplicationsApi.getVulnerabilityData(organization!),
    {
      enabled: !!organization,
    }
  );

  if (isLoading || isVulnLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || vulnError) {
    return (
      <Alert severity="error">
        Failed to load dashboard data. Please try again.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Typography variant="h6" gutterBottom color="text.secondary">
        Overview of your organization's vulnerability insights
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Applications
              </Typography>
              <Typography variant="h3" color="primary">
                {stats?.totalApplications || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Repositories
              </Typography>
              <Typography variant="h3" color="secondary">
                {stats?.totalRepositories || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Organization
              </Typography>
              <Typography variant="h5" color="text.primary">
                {organization}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {vulnerabilityData && vulnerabilityData.length > 0 && (
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} md={6}>
            <VulnerabilityOverviewChart vulnerabilityData={vulnerabilityData} />
          </Grid>
          <Grid item xs={12} md={6}>
            <ApplicationRiskChart vulnerabilityData={vulnerabilityData} />
          </Grid>
          <Grid item xs={12}>
            <VulnerabilityTrendChart />
          </Grid>
        </Grid>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Use the navigation menu to:
        </Typography>
        <ul>
          <li>View and manage repositories</li>
          <li>Create and manage business applications</li>
          <li>Analyze vulnerability insights and security metrics</li>
        </ul>
      </Box>
    </Box>
  );
};

export default Dashboard;
