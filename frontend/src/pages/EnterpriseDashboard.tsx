import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Paper,
  Tabs,
  Tab,
  Chip,
  useTheme,
  Container,
  Fade,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Search as SearchIcon,
  Code as CodeIcon,
  VpnKey as SecretIcon,
  BugReport as DependabotIcon,
  Business as EnterpriseIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

interface VulnerabilityStats {
  total: number;
  high: number;
  medium: number;
  low: number;
}

interface EnterpriseData {
  name: string;
  codeScanning: VulnerabilityStats;
  secretScanning: VulnerabilityStats;
  dependabot: VulnerabilityStats;
}

const EnterpriseDashboard: React.FC = () => {
  const { token } = useAuth();
  const theme = useTheme();
  const [enterpriseName, setEnterpriseName] = useState('');
  const [searchedEnterprise, setSearchedEnterprise] = useState('');
  const [enterpriseData, setEnterpriseData] = useState<EnterpriseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleSearch = async () => {
    console.log('🔍 Starting enterprise search...');
    console.log('Enterprise name:', enterpriseName.trim());
    
    if (!enterpriseName.trim()) {
      console.warn('❌ No enterprise name provided');
      setError('Please enter an enterprise name');
      return;
    }

    if (!token) {
      console.warn('❌ No authentication token found');
      setError('No authentication token found. Please log in again.');
      return;
    }

    console.log('✅ Starting search with enterprise:', enterpriseName.trim());
    console.log('✅ Token available:', token ? 'Yes' : 'No');
    console.log('🚀 Setting loading state to true...');
    
    setLoading(true);
    setError(null);

    try {
      console.log('🌐 Making API calls to enterprise endpoints...');
      const startTime = Date.now();
      
      // Log API base URL and full endpoints
      console.log('API Base URL:', process.env.REACT_APP_API_URL || 'http://localhost:8080');
      console.log('Code scanning endpoint:', `/api/enterprise/${enterpriseName}/code-scanning/alerts`);
      console.log('Secret scanning endpoint:', `/api/enterprise/${enterpriseName}/secret-scanning/alerts`);
      console.log('Dependabot endpoint:', `/api/enterprise/${enterpriseName}/dependabot/alerts`);
      
      // Make API calls to get enterprise vulnerability data
      const [codeResponse, secretResponse, dependabotResponse] = await Promise.all([
        api.get(`/api/enterprise/${enterpriseName}/code-scanning/alerts`, {
          timeout: 300000 // 5 minutes timeout for enterprise data extraction
        }).then(response => {
          console.log('✅ Code scanning API call completed:', response.status);
          console.log('Code scanning data length:', response.data?.length || 0);
          return response;
        }).catch(error => {
          console.error('❌ Code scanning API call failed:', error);
          console.error('Error details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
          });
          throw error;
        }),
        api.get(`/api/enterprise/${enterpriseName}/secret-scanning/alerts`, {
          timeout: 300000 // 5 minutes timeout for enterprise data extraction
        }).then(response => {
          console.log('✅ Secret scanning API call completed:', response.status);
          console.log('Secret scanning data length:', response.data?.length || 0);
          return response;
        }).catch(error => {
          console.error('❌ Secret scanning API call failed:', error);
          console.error('Error details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
          });
          throw error;
        }),
        api.get(`/api/enterprise/${enterpriseName}/dependabot/alerts`, {
          timeout: 300000 // 5 minutes timeout for enterprise data extraction
        }).then(response => {
          console.log('✅ Dependabot API call completed:', response.status);
          console.log('Dependabot data length:', response.data?.length || 0);
          return response;
        }).catch(error => {
          console.error('❌ Dependabot API call failed:', error);
          console.error('Error details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
          });
          throw error;
        })
      ]);

      const endTime = Date.now();
      console.log(`⏱️ All API calls completed in ${endTime - startTime}ms`);

      // Log the actual data structure for debugging
      console.log('📊 Code scanning alerts:', codeResponse.data);
      console.log('📊 Secret scanning alerts:', secretResponse.data);
      console.log('📊 Dependabot alerts:', dependabotResponse.data);

      console.log('🔢 Processing vulnerability counts...');
      const mockData: EnterpriseData = {
        name: enterpriseName,
        codeScanning: {
          total: codeResponse.data?.length || 0,
          high: codeResponse.data?.filter((alert: any) => 
            alert.rule?.securitySeverityLevel === 'high' || alert.rule?.severity === 'high'
          )?.length || 0,
          medium: codeResponse.data?.filter((alert: any) => 
            alert.rule?.securitySeverityLevel === 'medium' || alert.rule?.severity === 'medium'
          )?.length || 0,
          low: codeResponse.data?.filter((alert: any) => 
            alert.rule?.securitySeverityLevel === 'low' || alert.rule?.severity === 'low'
          )?.length || 0,
        },
        secretScanning: {
          total: secretResponse.data?.length || 0,
          high: secretResponse.data?.length || 0, // All secrets are considered high priority
          medium: 0,
          low: 0,
        },
        dependabot: {
          total: dependabotResponse.data?.length || 0,
          high: dependabotResponse.data?.filter((alert: any) => 
            alert.securityAdvisory?.severity === 'high' || alert.securityVulnerability?.severity === 'high'
          )?.length || 0,
          medium: dependabotResponse.data?.filter((alert: any) => 
            alert.securityAdvisory?.severity === 'medium' || alert.securityVulnerability?.severity === 'medium'
          )?.length || 0,
          low: dependabotResponse.data?.filter((alert: any) => 
            alert.securityAdvisory?.severity === 'low' || alert.securityVulnerability?.severity === 'low'
          )?.length || 0,
        }
      };

      console.log('📈 Final processed data:', mockData);
      console.log('✅ Setting enterprise data and search complete');
      
      setEnterpriseData(mockData);
      setSearchedEnterprise(enterpriseName);
    } catch (err: any) {
      console.error('💥 Error in handleSearch:', err);
      console.error('💥 Error name:', err.name);
      console.error('💥 Error message:', err.message);
      console.error('💥 Error code:', err.code);
      console.error('💥 Error response:', err.response);
      
      if (err.response) {
        console.error('💥 Response status:', err.response.status);
        console.error('💥 Response headers:', err.response.headers);
        console.error('💥 Response data:', err.response.data);
      }
      
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. The enterprise has a large amount of data. Please try again.');
      } else if (err.response?.status === 401) {
        setError('Authentication failed. Please check your GitHub token and permissions.');
      } else if (err.response?.status === 404) {
        setError('Enterprise not found. Please check the enterprise name.');
      } else if (err.response?.status === 403) {
        setError('Access denied. You may not have permissions to access this enterprise data.');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch enterprise data. Please check the enterprise name and your access permissions.');
      }
    } finally {
      console.log('🏁 Setting loading state to false');
      setLoading(false);
    }
  };

  const renderVulnerabilityStats = (stats: VulnerabilityStats, type: string, icon: React.ReactNode) => (
    <Fade in={true}>
      <Paper 
        elevation={4}
        sx={{ 
          height: '100%',
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(103, 126, 234, 0.1)',
          boxShadow: '0 8px 32px rgba(103, 126, 234, 0.1)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Box sx={{ 
              p: 1.5, 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {React.cloneElement(icon as React.ReactElement, { 
                sx: { fontSize: 24, color: 'white' } 
              })}
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {type} Vulnerabilities
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={6} sm={3}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  textAlign: 'center', 
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(103, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                  border: '1px solid rgba(103, 126, 234, 0.1)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': { 
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(103, 126, 234, 0.15)',
                    background: 'linear-gradient(135deg, rgba(103, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  }
                }}
              >
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 'bold', 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1 
                  }}
                >
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Total
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  textAlign: 'center', 
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(229, 57, 53, 0.1) 100%)',
                  border: '1px solid rgba(244, 67, 54, 0.2)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': { 
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(244, 67, 54, 0.2)',
                    background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.15) 0%, rgba(229, 57, 53, 0.15) 100%)',
                  }
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: theme.palette.error.main, mb: 1 }}>
                  {stats.high}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  High
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  textAlign: 'center', 
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 193, 7, 0.1) 100%)',
                  border: '1px solid rgba(255, 152, 0, 0.2)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': { 
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(255, 152, 0, 0.2)',
                    background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.15) 0%, rgba(255, 193, 7, 0.15) 100%)',
                  }
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: theme.palette.warning.main, mb: 1 }}>
                  {stats.medium}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Medium
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  textAlign: 'center', 
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.1) 100%)',
                  border: '1px solid rgba(76, 175, 80, 0.2)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': { 
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(76, 175, 80, 0.2)',
                    background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(139, 195, 74, 0.15) 100%)',
                  }
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: theme.palette.success.main, mb: 1 }}>
                  {stats.low}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Low
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Paper>
    </Fade>
  );

  return (
    <Fade in={true} timeout={600}>
      <Box>
        {/* Header Section - Matching Analytics page style */}
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
              <SecurityIcon 
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
                  Enterprise Security Dashboard
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    opacity: 0.9,
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  }}
                >
                  Comprehensive vulnerability assessment across your enterprise
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        <Container maxWidth="lg">
          <Box sx={{ py: 2 }}>
            {/* Enterprise Search Section */}
            <Fade in={true} timeout={800} style={{ transitionDelay: '200ms' }}>
              <Paper 
                elevation={4}
                sx={{
                  mb: 4,
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(103, 126, 234, 0.1)',
                  boxShadow: '0 8px 32px rgba(103, 126, 234, 0.1)',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ 
                      p: 1.5, 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <EnterpriseIcon sx={{ fontSize: 24, color: 'white' }} />
                    </Box>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Search Enterprise
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={8}>
                        <TextField
                          fullWidth
                          value={enterpriseName}
                          onChange={(e) => setEnterpriseName(e.target.value)}
                          placeholder="Enter GitHub Enterprise name"
                          variant="outlined"
                          disabled={loading}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              background: 'rgba(103, 126, 234, 0.02)',
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#667eea',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#667eea',
                                borderWidth: 2,
                              },
                            },
                          }}
                          InputProps={{
                            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box display="flex" gap={1}>
                          <Button
                            onClick={handleSearch}
                            disabled={loading || !enterpriseName.trim()}
                            variant="contained"
                            size="large"
                            fullWidth
                            startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                            sx={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              borderRadius: 2,
                              fontWeight: 'bold',
                              py: 1.5,
                              '&:hover': {
                                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 25px rgba(103, 126, 234, 0.3)',
                              },
                              transition: 'all 0.3s ease',
                              '&:disabled': {
                                background: 'rgba(103, 126, 234, 0.3)',
                              },
                            }}
                          >
                            {loading ? 'Searching...' : 'Search'}
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                  {error && (
                    <Fade in={true}>
                      <Alert 
                        severity={error.startsWith('✅') ? 'success' : 'error'} 
                        sx={{ 
                          mt: 2,
                          borderRadius: 2,
                          ...(error.startsWith('✅') ? {
                            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.1) 100%)',
                            border: '1px solid rgba(76, 175, 80, 0.2)',
                          } : {
                            background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(229, 57, 53, 0.1) 100%)',
                            border: '1px solid rgba(244, 67, 54, 0.2)',
                          })
                        }}
                      >
                        {error}
                      </Alert>
                    </Fade>
                  )}
                </CardContent>
              </Paper>
            </Fade>

            {/* Enterprise Data Section */}
            {enterpriseData && (
              <Fade in={true} timeout={1000} style={{ transitionDelay: '400ms' }}>
                <Box>
                  <Paper
                    elevation={4}
                    sx={{
                      mb: 4,
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(103, 126, 234, 0.1)',
                      boxShadow: '0 8px 32px rgba(103, 126, 234, 0.1)',
                      p: 3,
                    }}
                  >
                    <Box sx={{ mb: 3 }}>
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          fontWeight: 'bold', 
                          mb: 1,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        Security Overview: {searchedEnterprise}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Consolidated vulnerability data from all repositories
                      </Typography>
                    </Box>

                    {/* Tab Navigation */}
                    <Paper
                      elevation={2}
                      sx={{
                        borderRadius: 2,
                        background: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs 
                          value={activeTab} 
                          onChange={(_, newValue) => setActiveTab(newValue)}
                          sx={{ 
                            px: 2,
                            '& .MuiTab-root': {
                              fontWeight: 'bold',
                              '&.Mui-selected': {
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                              },
                            },
                            '& .MuiTabs-indicator': {
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              height: 3,
                              borderRadius: '3px 3px 0 0',
                            },
                          }}
                        >
                    <Tab 
                      icon={<CodeIcon />}
                      label={
                        <Box display="flex" alignItems="center" gap={1}>
                          Code Scanning
                          <Chip 
                            label={enterpriseData.codeScanning.total} 
                            size="small" 
                            color={enterpriseData.codeScanning.total > 0 ? 'error' : 'default'}
                          />
                        </Box>
                      }
                      iconPosition="start"
                    />
                    <Tab 
                      icon={<SecretIcon />}
                      label={
                        <Box display="flex" alignItems="center" gap={1}>
                          Secret Scanning
                          <Chip 
                            label={enterpriseData.secretScanning.total} 
                            size="small" 
                            color={enterpriseData.secretScanning.total > 0 ? 'error' : 'default'}
                          />
                        </Box>
                      }
                      iconPosition="start"
                    />
                    <Tab 
                      icon={<DependabotIcon />}
                      label={
                        <Box display="flex" alignItems="center" gap={1}>
                          Dependabot
                          <Chip 
                            label={enterpriseData.dependabot.total} 
                            size="small" 
                            color={enterpriseData.dependabot.total > 0 ? 'error' : 'default'}
                          />
                        </Box>
                      }
                      iconPosition="start"
                    />
                  </Tabs>
                </Box>

                {/* Tab Content */}
                <CardContent sx={{ p: 3 }}>
                  {activeTab === 0 && renderVulnerabilityStats(
                    enterpriseData.codeScanning, 
                    'Code Scanning',
                    <CodeIcon color="primary" />
                  )}
                  {activeTab === 1 && renderVulnerabilityStats(
                    enterpriseData.secretScanning, 
                    'Secret Scanning',
                    <SecretIcon color="primary" />
                  )}
                  {activeTab === 2 && renderVulnerabilityStats(
                    enterpriseData.dependabot, 
                    'Dependabot',
                    <DependabotIcon color="primary" />
                  )}
                </CardContent>
              </Paper>
            </Paper>
          </Box>
        </Fade>
      )}

      {/* Help Section */}
      {!enterpriseData && !loading && (
        <Fade in={true} timeout={1200} style={{ transitionDelay: '600ms' }}>
          <Paper 
            elevation={2}
            sx={{ 
              p: 3, 
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(103, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              border: '1px solid rgba(103, 126, 234, 0.2)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ 
                p: 1, 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                mr: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <SecurityIcon sx={{ fontSize: 20, color: 'white' }} />
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Getting Started
              </Typography>
            </Box>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              <Typography component="li" color="text.secondary" sx={{ mb: 1 }}>
                Enter your GitHub Enterprise name in the search field above
              </Typography>
              <Typography component="li" color="text.secondary" sx={{ mb: 1 }}>
                Make sure your Personal Access Token has the necessary permissions
              </Typography>
              <Typography component="li" color="text.secondary">
                View consolidated vulnerability data across all enterprise repositories
              </Typography>
            </Box>
          </Paper>
        </Fade>
      )}
    </Box>
  </Container>
</Box>
</Fade>
  );
};

export default EnterpriseDashboard;
