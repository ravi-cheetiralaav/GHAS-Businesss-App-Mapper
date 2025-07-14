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
  Wifi as ConnectedIcon,
  WifiOff as DisconnectedIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useEnterpriseAsyncJob } from '../hooks/useEnterpriseAsyncJob';
import JobProgressDisplay from '../components/JobProgressDisplay';

interface VulnerabilityStats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  error: number;
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
  const [activeTab, setActiveTab] = useState<number>(0);
  
  // Use the new async job hook
  const {
    jobProgress,
    isConnected,
    isLoading,
    error,
    startEnterpriseJob,
    reset,
  } = useEnterpriseAsyncJob();

  const handleSearch = async () => {
    console.log('🔍 Starting enterprise search...');
    console.log('Enterprise name:', enterpriseName.trim());
    
    if (!enterpriseName.trim()) {
      console.warn('❌ No enterprise name provided');
      return;
    }

    if (!token) {
      console.warn('❌ No authentication token found');
      return;
    }

    console.log('✅ Starting async enterprise job...');
    
    // Clear previous enterprise data but keep error state
    setEnterpriseData(null);
    setSearchedEnterprise(enterpriseName.trim());
    
    try {
      // Start the async job
      const jobResponse = await startEnterpriseJob(enterpriseName.trim(), token);
      
      if (jobResponse) {
        console.log('🎯 Job response received:', jobResponse);
        
        // If we have cached results, process them immediately
        if (jobResponse.useExistingResults && jobResponse.existingResults) {
          console.log('📋 Processing cached results...');
          processEnterpriseResults(jobResponse.existingResults);
        }
      }
    } catch (error) {
      console.error('❌ Error starting enterprise job:', error);
    }
  };

  const processEnterpriseResults = (results: any) => {
    console.log('📊 Processing enterprise results:', results);
    console.log('📊 Code scanning data:', results?.codeScanning);
    console.log('📊 Secret scanning data:', results?.secretScanning);
    console.log('📊 Dependabot data:', results?.dependabot);
    
    // Convert the results to the expected format
    // This is a simplified conversion - you may need to adjust based on the actual structure
    const processedData: EnterpriseData = {
      name: searchedEnterprise,
      codeScanning: results?.codeScanning || {
        total: 0, critical: 0, high: 0, medium: 0, low: 0, error: 0
      },
      secretScanning: results?.secretScanning || {
        total: 0, critical: 0, high: 0, medium: 0, low: 0, error: 0
      },
      dependabot: results?.dependabot || {
        total: 0, critical: 0, high: 0, medium: 0, low: 0, error: 0
      }
    };
    
    console.log('📊 Processed enterprise data:', processedData);
    setEnterpriseData(processedData);
  };

  // Watch for job completion
  React.useEffect(() => {
    if (jobProgress?.status === 'COMPLETED' && jobProgress.partialResults) {
      processEnterpriseResults(jobProgress.partialResults);
    }
  }, [jobProgress, searchedEnterprise]);

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
          <Grid container spacing={2}>
            {/* Total Card */}
            <Grid item xs={6} sm={2.4}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 2.5, 
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
                  variant="h4" 
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
            
            {/* Critical Card */}
            <Grid item xs={6} sm={2.4}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 2.5, 
                  textAlign: 'center', 
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(211, 47, 47, 0.1) 0%, rgba(211, 47, 47, 0.1) 100%)',
                  border: '1px solid rgba(211, 47, 47, 0.3)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': { 
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(211, 47, 47, 0.25)',
                    background: 'linear-gradient(135deg, rgba(211, 47, 47, 0.15) 0%, rgba(211, 47, 47, 0.15) 100%)',
                  }
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#d32f2f', mb: 1 }}>
                  {stats.critical}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Critical
                </Typography>
              </Paper>
            </Grid>
            
            {/* High Card */}
            <Grid item xs={6} sm={2.4}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 2.5, 
                  textAlign: 'center', 
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(245, 124, 0, 0.1) 0%, rgba(245, 124, 0, 0.1) 100%)',
                  border: '1px solid rgba(245, 124, 0, 0.3)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': { 
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(245, 124, 0, 0.25)',
                    background: 'linear-gradient(135deg, rgba(245, 124, 0, 0.15) 0%, rgba(245, 124, 0, 0.15) 100%)',
                  }
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f57c00', mb: 1 }}>
                  {stats.high}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  High
                </Typography>
              </Paper>
            </Grid>
            
            {/* Medium Card */}
            <Grid item xs={6} sm={2.4}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 2.5, 
                  textAlign: 'center', 
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(251, 192, 45, 0.1) 0%, rgba(251, 192, 45, 0.1) 100%)',
                  border: '1px solid rgba(251, 192, 45, 0.3)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': { 
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(251, 192, 45, 0.25)',
                    background: 'linear-gradient(135deg, rgba(251, 192, 45, 0.15) 0%, rgba(251, 192, 45, 0.15) 100%)',
                  }
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fbc02d', mb: 1 }}>
                  {stats.medium}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Medium
                </Typography>
              </Paper>
            </Grid>
            
            {/* Low Card */}
            <Grid item xs={6} sm={2.4}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 2.5, 
                  textAlign: 'center', 
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(56, 142, 60, 0.1) 0%, rgba(56, 142, 60, 0.1) 100%)',
                  border: '1px solid rgba(56, 142, 60, 0.3)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': { 
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(56, 142, 60, 0.25)',
                    background: 'linear-gradient(135deg, rgba(56, 142, 60, 0.15) 0%, rgba(56, 142, 60, 0.15) 100%)',
                  }
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#388e3c', mb: 1 }}>
                  {stats.low}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Low
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          
          {/* Second Row for Error severity */}
          {stats.error > 0 && (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={12}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 2.5, 
                    textAlign: 'center', 
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(123, 31, 162, 0.1) 100%)',
                    border: '1px solid rgba(156, 39, 176, 0.2)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': { 
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(156, 39, 176, 0.2)',
                      background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.15) 0%, rgba(123, 31, 162, 0.15) 100%)',
                    }
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, mb: 1 }}>
                    {stats.error}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Error (Unable to determine severity)
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          )}
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
                  Enterprise Risk Dashboard
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    opacity: 0.9,
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  }}
                >
                  Comprehensive risk assessment across your enterprise
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
                          disabled={isLoading}
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
                            disabled={isLoading || !enterpriseName.trim()}
                            variant="contained"
                            size="large"
                            fullWidth
                            startIcon={isLoading ? <CircularProgress size={20} /> : <SearchIcon />}
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
                            {isLoading ? 'Starting Analysis...' : 'Analyze Enterprise'}
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

            {/* Job Progress Display */}
            {jobProgress && (
              <JobProgressDisplay jobProgress={jobProgress} />
            )}

            {/* Connection Status */}
            {jobProgress && (
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                {isConnected ? (
                  <>
                    <ConnectedIcon sx={{ color: 'success.main', fontSize: 20 }} />
                    <Typography variant="caption" color="success.main">
                      Real-time updates connected
                    </Typography>
                  </>
                ) : (
                  <>
                    <DisconnectedIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                    <Typography variant="caption" color="warning.main">
                      Connecting to real-time updates...
                    </Typography>
                  </>
                )}
              </Box>
            )}

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
                                '& .tab-text': {
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  backgroundClip: 'text',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                },
                                '& .MuiChip-root': {
                                  // Ensure chips are not affected by the gradient text effect
                                  '& .MuiChip-label': {
                                    color: 'white !important',
                                    WebkitTextFillColor: 'white !important',
                                  },
                                },
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
                          <span className="tab-text">Code Scanning</span>
                          <Chip 
                            label={enterpriseData.codeScanning.total} 
                            size="small" 
                            sx={{
                              backgroundColor: enterpriseData.codeScanning.total > 0 ? '#f44336 !important' : '#e0e0e0 !important',
                              '& .MuiChip-label': {
                                color: enterpriseData.codeScanning.total > 0 ? 'white !important' : '#666 !important',
                                fontWeight: 'bold !important',
                                WebkitTextFillColor: enterpriseData.codeScanning.total > 0 ? 'white !important' : '#666 !important',
                              },
                            }}
                          />
                        </Box>
                      }
                      iconPosition="start"
                    />
                    <Tab 
                      icon={<SecretIcon />}
                      label={
                        <Box display="flex" alignItems="center" gap={1}>
                          <span className="tab-text">Secret Scanning</span>
                          <Chip 
                            label={enterpriseData.secretScanning.total} 
                            size="small" 
                            sx={{
                              backgroundColor: enterpriseData.secretScanning.total > 0 ? '#f44336 !important' : '#e0e0e0 !important',
                              '& .MuiChip-label': {
                                color: enterpriseData.secretScanning.total > 0 ? 'white !important' : '#666 !important',
                                fontWeight: 'bold !important',
                                WebkitTextFillColor: enterpriseData.secretScanning.total > 0 ? 'white !important' : '#666 !important',
                              },
                            }}
                          />
                        </Box>
                      }
                      iconPosition="start"
                    />
                    <Tab 
                      icon={<DependabotIcon />}
                      label={
                        <Box display="flex" alignItems="center" gap={1}>
                          <span className="tab-text">Dependabot</span>
                          <Chip 
                            label={enterpriseData.dependabot.total} 
                            size="small" 
                            sx={{
                              backgroundColor: enterpriseData.dependabot.total > 0 ? '#f44336 !important' : '#e0e0e0 !important',
                              '& .MuiChip-label': {
                                color: enterpriseData.dependabot.total > 0 ? 'white !important' : '#666 !important',
                                fontWeight: 'bold !important',
                                WebkitTextFillColor: enterpriseData.dependabot.total > 0 ? 'white !important' : '#666 !important',
                              },
                            }}
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
      {!enterpriseData && !isLoading && !jobProgress && (
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
