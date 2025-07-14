import React from 'react';
import { useQuery } from 'react-query';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CircularProgress, 
  Alert,
  Fade,
  Chip,
  Paper
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  Storage as RepositoryIcon,
  TrendingUp as TrendingIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { businessApplicationsApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { styleMixins } from '../styles/mixins';
import { COLORS } from '../styles/theme';
import { GradientText } from '../components/common/StyledComponents';
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
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
        sx={{
          background: 'linear-gradient(135deg, rgba(103, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
          borderRadius: 3,
          mx: 2,
          my: 3,
        }}
      >
        <CircularProgress 
          size={60}
          sx={{
            color: 'primary.main',
            mb: 2,
          }}
        />
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
          Loading dashboard insights...
        </Typography>
      </Box>
    );
  }

  if (error || vulnError) {
    return (
      <Fade in timeout={300}>
        <Alert 
          severity="error"
          sx={{
            m: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(229, 57, 53, 0.1) 100%)',
            border: '1px solid rgba(244, 67, 54, 0.2)',
            '& .MuiAlert-icon': {
              color: 'error.main',
            }
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Failed to load dashboard data
          </Typography>
          <Typography variant="body2">
            Please check your connection and try again. If the problem persists, ensure the backend service is running.
          </Typography>
        </Alert>
      </Fade>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Fade in timeout={600}>
        <Paper elevation={0} sx={styleMixins.headerCard()}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: '50%', 
                background: 'rgba(255, 255, 255, 0.2)',
                mr: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <DashboardIcon sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5, color: 'white' }}>
                  Dashboard
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400, color: 'white' }}>
                  Overview of your organization's vulnerability insights
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <SecurityIcon sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body1" sx={{ fontWeight: 500, color: 'white' }}>
                Organization: <Chip label={organization} size="small" sx={{ 
                  ml: 1, 
                  background: 'rgba(255, 255, 255, 0.2)', 
                  color: 'white',
                  fontWeight: 600,
                }} />
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Fade>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Fade in timeout={800} style={{ transitionDelay: '100ms' }}>
            <Card sx={{
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(103, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              border: '1px solid rgba(103, 126, 234, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(103, 126, 234, 0.15)',
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BusinessIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Total Applications
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {stats?.totalApplications || 0}
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Fade in timeout={800} style={{ transitionDelay: '200ms' }}>
            <Card sx={{
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(233, 30, 99, 0.1) 100%)',
              border: '1px solid rgba(156, 39, 176, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(156, 39, 176, 0.15)',
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <RepositoryIcon sx={{ color: 'secondary.main', mr: 1.5, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Total Repositories
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {stats?.totalRepositories || 0}
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Fade in timeout={800} style={{ transitionDelay: '300ms' }}>
            <Card sx={{
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.1) 100%)',
              border: '1px solid rgba(76, 175, 80, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(76, 175, 80, 0.15)',
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingIcon sx={{ color: 'success.main', mr: 1.5, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Active Organization
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {organization}
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>

      {/* Charts Section */}
      {vulnerabilityData && vulnerabilityData.length > 0 && (
        <Fade in timeout={1000} style={{ transitionDelay: '400ms' }}>
          <Grid container spacing={4}>
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
        </Fade>
      )}

      {/* Quick Actions Section */}
      <Fade in timeout={1200} style={{ transitionDelay: '500ms' }}>
        <Paper sx={{ 
          mt: 4, 
          p: 4, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(103, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
          border: '1px solid rgba(103, 126, 234, 0.1)',
        }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
            Quick Actions
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontWeight: 500 }}>
            Use the navigation menu to explore different areas:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                p: 2, 
                borderRadius: 2, 
                background: 'rgba(103, 126, 234, 0.1)',
                border: '1px solid rgba(103, 126, 234, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(103, 126, 234, 0.15)',
                }
              }}>
                <RepositoryIcon sx={{ color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Repositories
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View and manage your organization's repositories
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                p: 2, 
                borderRadius: 2, 
                background: 'rgba(156, 39, 176, 0.1)',
                border: '1px solid rgba(156, 39, 176, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(156, 39, 176, 0.15)',
                }
              }}>
                <BusinessIcon sx={{ color: 'secondary.main', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Business Applications
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create and manage business application mappings
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                p: 2, 
                borderRadius: 2, 
                background: 'rgba(76, 175, 80, 0.1)',
                border: '1px solid rgba(76, 175, 80, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(76, 175, 80, 0.15)',
                }
              }}>
                <TrendingIcon sx={{ color: 'success.main', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Analytics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Analyze vulnerability insights and security metrics
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Fade>
    </Box>
  );
};

export default Dashboard;
