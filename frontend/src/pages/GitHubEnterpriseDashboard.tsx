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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  AccountTree as OrganizationIcon,
  TrendingUp as RiskIcon,
  Close as CloseIcon,
  Shield as ShieldIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
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

interface OrganizationRiskSummary {
  organizationName: string;
  codeScanning: VulnerabilityStats;
  secretScanning: VulnerabilityStats;
  dependabot: VulnerabilityStats;
  totalRepositories: number;
  totalAlerts: number;
  riskScore: number;
  lastUpdated: string;
}

interface EnterpriseData {
  name: string;
  codeScanning: VulnerabilityStats;
  secretScanning: VulnerabilityStats;
  dependabot: VulnerabilityStats;
  organizationBreakdown?: OrganizationRiskSummary[];
  organizationSummary?: {
    totalOrganizations: number;
    totalRepositories: number;
    totalAlerts: number;
  };
}

const GitHubEnterpriseDashboard: React.FC = () => {
  const { token } = useAuth();
  const [enterpriseName, setEnterpriseName] = useState('');
  const [searchedEnterprise, setSearchedEnterprise] = useState('');
  const [enterpriseData, setEnterpriseData] = useState<EnterpriseData | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showAllOrganizations, setShowAllOrganizations] = useState<boolean>(false);
  const [showOrganizationTable, setShowOrganizationTable] = useState<boolean>(false);
  
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
    if (!enterpriseName.trim() || !token) return;
    
    setEnterpriseData(null);
    setSearchedEnterprise(enterpriseName.trim());
    setShowAllOrganizations(false);
    setShowOrganizationTable(false);
    
    try {
      const jobResponse = await startEnterpriseJob(enterpriseName.trim(), token);
      if (jobResponse?.useExistingResults && jobResponse.existingResults) {
        processEnterpriseResults(jobResponse.existingResults);
      }
    } catch (error) {
      console.error('Error starting enterprise job:', error);
    }
  };

  const processEnterpriseResults = (results: any) => {
    const processedData: EnterpriseData = {
      name: searchedEnterprise,
      codeScanning: results?.codeScanning || { total: 0, critical: 0, high: 0, medium: 0, low: 0, error: 0 },
      secretScanning: results?.secretScanning || { total: 0, critical: 0, high: 0, medium: 0, low: 0, error: 0 },
      dependabot: results?.dependabot || { total: 0, critical: 0, high: 0, medium: 0, low: 0, error: 0 },
      organizationBreakdown: results?.organizationBreakdown || [],
      organizationSummary: results?.organizationSummary || { totalOrganizations: 0, totalRepositories: 0, totalAlerts: 0 }
    };
    setEnterpriseData(processedData);
  };

  React.useEffect(() => {
    if (jobProgress?.status === 'COMPLETED' && jobProgress.partialResults) {
      processEnterpriseResults(jobProgress.partialResults);
    }
  }, [jobProgress, searchedEnterprise]);

  // GitHub color palette
  const github = {
    bg: {
      primary: '#f6f8fa',
      secondary: '#ffffff',
      canvas: '#ffffff',
      overlay: '#ffffff'
    },
    border: {
      default: '#d0d7de',
      muted: '#d8dee4'
    },
    fg: {
      default: '#24292f',
      muted: '#656d76',
      subtle: '#6e7781'
    },
    accent: {
      fg: '#0969da',
      emphasis: '#0550ae'
    },
    success: {
      fg: '#1a7f37',
      bg: '#dafbe1',
      border: '#2da44e'
    },
    danger: {
      fg: '#cf222e',
      bg: '#ffebe9',
      border: '#d73a49'
    },
    warning: {
      fg: '#9a6700',
      bg: '#fff8c5',
      border: '#d4a72c'
    },
    done: {
      fg: '#8250df',
      bg: '#fbefff',
      border: '#8250df'
    }
  };

  const renderVulnerabilityCard = (stats: VulnerabilityStats, title: string, icon: React.ReactNode, color: string) => (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${github.border.default}`,
        borderRadius: '8px',
        p: 3,
        bgcolor: github.bg.secondary,
        '&:hover': {
          boxShadow: '0 1px 3px rgba(27,31,36,0.12), 0 8px 24px rgba(27,31,36,0.12)',
          transform: 'translateY(-1px)',
          transition: 'all 0.2s ease'
        }
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <Box
          sx={{
            p: 1,
            borderRadius: '8px',
            bgcolor: github.bg.primary,
            border: `1px solid ${github.border.default}`,
            mr: 2,
            color: color
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, color: github.fg.default }}>
          {title}
        </Typography>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="h3" sx={{ fontWeight: 600, color: github.fg.default, mb: 1 }}>
          {stats.total}
        </Typography>
        <Typography variant="body2" sx={{ color: github.fg.muted }}>
          Total vulnerabilities
        </Typography>
      </Box>

      <Grid container spacing={1}>
        {stats.critical > 0 && (
          <Grid item>
            <Chip
              label={`${stats.critical} Critical`}
              size="small"
              sx={{
                bgcolor: github.danger.bg,
                color: github.danger.fg,
                border: `1px solid ${github.danger.border}`,
                fontWeight: 500,
                fontSize: '0.75rem'
              }}
            />
          </Grid>
        )}
        {stats.high > 0 && (
          <Grid item>
            <Chip
              label={`${stats.high} High`}
              size="small"
              sx={{
                bgcolor: '#fff8c5',
                color: '#9a6700',
                border: '1px solid #d4a72c',
                fontWeight: 500,
                fontSize: '0.75rem'
              }}
            />
          </Grid>
        )}
        {stats.medium > 0 && (
          <Grid item>
            <Chip
              label={`${stats.medium} Medium`}
              size="small"
              sx={{
                bgcolor: github.bg.primary,
                color: github.fg.muted,
                border: `1px solid ${github.border.default}`,
                fontWeight: 500,
                fontSize: '0.75rem'
              }}
            />
          </Grid>
        )}
        {stats.low > 0 && (
          <Grid item>
            <Chip
              label={`${stats.low} Low`}
              size="small"
              sx={{
                bgcolor: github.success.bg,
                color: github.success.fg,
                border: `1px solid ${github.success.border}`,
                fontWeight: 500,
                fontSize: '0.75rem'
              }}
            />
          </Grid>
        )}
      </Grid>
    </Paper>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: github.bg.primary,
      fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif'
    }}>
      {/* GitHub-style Header */}
      <Box sx={{
        bgcolor: github.bg.secondary,
        borderBottom: `1px solid ${github.border.default}`,
        py: 3,
        mb: 3,
        boxShadow: '0 1px 0 rgba(27,31,36,0.04)'
      }}>
        <Container maxWidth="xl">
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <Box sx={{
                p: 1.5,
                borderRadius: '8px',
                bgcolor: github.bg.primary,
                border: `1px solid ${github.border.default}`,
                mr: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <SecurityIcon sx={{ fontSize: 28, color: github.fg.default }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ 
                  fontWeight: 600,
                  color: github.fg.default,
                  mb: 0.5,
                  fontSize: '2rem',
                  lineHeight: 1.25
                }}>
                  Enterprise Security Overview
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: github.fg.muted,
                  fontSize: '1rem'
                }}>
                  Comprehensive vulnerability assessment across your GitHub Enterprise
                </Typography>
              </Box>
            </Box>
            
            {/* Connection Status */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                px: 2,
                py: 1,
                borderRadius: '6px',
                bgcolor: isConnected ? github.success.bg : github.danger.bg,
                border: isConnected ? `1px solid ${github.success.border}` : `1px solid ${github.danger.border}`,
                fontSize: '0.875rem'
              }}>
                {isConnected ? (
                  <>
                    <ConnectedIcon sx={{ fontSize: 16, color: github.success.fg, mr: 1 }} />
                    <Typography variant="body2" sx={{ color: github.success.fg, fontWeight: 500 }}>
                      Connected
                    </Typography>
                  </>
                ) : (
                  <>
                    <DisconnectedIcon sx={{ fontSize: 16, color: github.danger.fg, mr: 1 }} />
                    <Typography variant="body2" sx={{ color: github.danger.fg, fontWeight: 500 }}>
                      Disconnected
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ pb: 4 }}>
        {/* Enterprise Search Section */}
        <Paper 
          elevation={0}
          sx={{
            border: `1px solid ${github.border.default}`,
            borderRadius: '8px',
            p: 3,
            mb: 3,
            bgcolor: github.bg.secondary,
            boxShadow: '0 1px 3px rgba(27,31,36,0.12), 0 8px 24px rgba(27,31,36,0.12)'
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 600,
              color: github.fg.default,
              mb: 1,
              fontSize: '1.25rem'
            }}>
              Enterprise Analysis
            </Typography>
            <Typography variant="body2" sx={{ 
              color: github.fg.muted,
              fontSize: '0.875rem'
            }}>
              Enter your GitHub Enterprise name to start a comprehensive security analysis
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <TextField
              label="Enterprise Name"
              variant="outlined"
              fullWidth
              value={enterpriseName}
              onChange={(e) => setEnterpriseName(e.target.value)}
              placeholder="Enter GitHub Enterprise name..."
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '6px',
                  bgcolor: github.bg.primary,
                  '& fieldset': {
                    borderColor: github.border.default
                  },
                  '&:hover fieldset': {
                    borderColor: github.border.muted
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: github.accent.fg,
                    borderWidth: '2px'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: github.fg.muted,
                  fontSize: '0.875rem'
                },
                '& .MuiInputBase-input': {
                  color: github.fg.default,
                  fontSize: '0.875rem'
                }
              }}
            />
            <Button
              onClick={handleSearch}
              disabled={isLoading || !enterpriseName.trim()}
              variant="contained"
              size="large"
              startIcon={isLoading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <SearchIcon />}
              sx={{
                minWidth: '160px',
                borderRadius: '6px',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.875rem',
                bgcolor: github.success.border,
                color: 'white',
                px: 3,
                py: 1.5,
                '&:hover': {
                  bgcolor: github.success.fg
                },
                '&:disabled': {
                  bgcolor: github.fg.muted,
                  color: 'white'
                },
                boxShadow: '0 1px 0 rgba(27,31,36,0.04)'
              }}
            >
              {isLoading ? 'Analyzing...' : 'Analyze Enterprise'}
            </Button>
          </Box>
          
          {error && (
            <Alert 
              severity={error.startsWith('✅') ? 'success' : 'error'}
              sx={{
                mt: 2,
                borderRadius: '6px',
                bgcolor: error.startsWith('✅') ? github.success.bg : github.danger.bg,
                color: error.startsWith('✅') ? github.success.fg : github.danger.fg,
                border: error.startsWith('✅') ? `1px solid ${github.success.border}` : `1px solid ${github.danger.border}`,
                '& .MuiAlert-icon': {
                  color: error.startsWith('✅') ? github.success.fg : github.danger.fg
                }
              }}
            >
              {error}
            </Alert>
          )}
        </Paper>

        {/* Job Progress Display */}
        {jobProgress && (
          <Box sx={{ mb: 3 }}>
            <JobProgressDisplay 
              jobProgress={jobProgress}
            />
          </Box>
        )}

        {/* Enterprise Data Display */}
        {enterpriseData && (
          <>
            {/* Vulnerability Stats */}
            <Paper
              elevation={0}
              sx={{
                border: `1px solid ${github.border.default}`,
                borderRadius: '8px',
                mb: 3,
                bgcolor: github.bg.secondary,
                overflow: 'hidden'
              }}
            >
              <Box sx={{
                bgcolor: github.bg.primary,
                p: 3,
                borderBottom: `1px solid ${github.border.default}`
              }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: github.fg.default, mb: 1 }}>
                  {searchedEnterprise} - Security Dashboard
                </Typography>
                <Typography variant="body1" sx={{ color: github.fg.muted }}>
                  Real-time vulnerability analysis and risk assessment
                </Typography>
              </Box>

              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    {renderVulnerabilityCard(
                      enterpriseData.codeScanning,
                      'Code Scanning',
                      <CodeIcon />,
                      github.accent.fg
                    )}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {renderVulnerabilityCard(
                      enterpriseData.secretScanning,
                      'Secret Scanning',
                      <SecretIcon />,
                      github.done.fg
                    )}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {renderVulnerabilityCard(
                      enterpriseData.dependabot,
                      'Dependabot',
                      <DependabotIcon />,
                      github.success.fg
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Paper>

            {/* Organization Breakdown */}
            {enterpriseData.organizationBreakdown && enterpriseData.organizationBreakdown.length > 0 && (
              <Paper
                elevation={0}
                sx={{
                  border: `1px solid ${github.border.default}`,
                  borderRadius: '8px',
                  bgcolor: github.bg.secondary,
                  overflow: 'hidden'
                }}
              >
                <Box sx={{
                  bgcolor: github.bg.primary,
                  p: 3,
                  borderBottom: `1px solid ${github.border.default}`
                }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: github.fg.default, mb: 1 }}>
                    Organization Risk Breakdown
                  </Typography>
                  <Typography variant="body1" sx={{ color: github.fg.muted }}>
                    Risk assessment across {enterpriseData.organizationSummary?.totalOrganizations || 0} organizations
                    • {enterpriseData.organizationSummary?.totalRepositories || 0} repositories
                    • {enterpriseData.organizationSummary?.totalAlerts || 0} total alerts
                  </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: github.fg.default }}>
                      Organizations ({showAllOrganizations ? enterpriseData.organizationBreakdown.length : Math.min(6, enterpriseData.organizationBreakdown.length)} of {enterpriseData.organizationBreakdown.length})
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      {!showAllOrganizations && enterpriseData.organizationBreakdown.length > 6 && (
                        <Typography variant="body2" sx={{ color: github.fg.muted }}>
                          Showing top 6 by risk score
                        </Typography>
                      )}
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setShowOrganizationTable(true)}
                        sx={{ 
                          ml: 1,
                          fontSize: '0.8rem',
                          textTransform: 'none',
                          borderColor: github.border.default,
                          color: github.fg.default,
                          '&:hover': {
                            bgcolor: github.bg.primary,
                            borderColor: github.border.muted
                          }
                        }}
                      >
                        View Table
                      </Button>
                    </Box>
                  </Box>
                  
                  <Grid container spacing={3}>
                    {enterpriseData.organizationBreakdown
                      .sort((a, b) => b.riskScore - a.riskScore)
                      .slice(0, showAllOrganizations ? undefined : 6)
                      .map((org, index) => (
                        <Grid item xs={12} md={6} lg={4} key={org.organizationName}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              height: '100%',
                              borderRadius: '8px',
                              border: `1px solid ${github.border.default}`,
                              bgcolor: org.riskScore > 50 ? github.danger.bg : 
                                       org.riskScore > 25 ? github.warning.bg : github.success.bg,
                              '&:hover': {
                                boxShadow: '0 1px 3px rgba(27,31,36,0.12), 0 8px 24px rgba(27,31,36,0.12)',
                                transform: 'translateY(-1px)',
                                transition: 'all 0.2s ease'
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600, color: github.fg.default, mr: 1 }}>
                                {org.organizationName}
                              </Typography>
                              <Chip 
                                label={`Risk: ${org.riskScore.toFixed(1)}`}
                                size="small"
                                sx={{
                                  bgcolor: org.riskScore > 50 ? github.danger.border : 
                                           org.riskScore > 25 ? github.warning.border : github.success.border,
                                  color: 'white',
                                  fontWeight: 500
                                }}
                              />
                            </Box>
                            
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" sx={{ color: github.fg.muted, mb: 1 }}>
                                {org.totalRepositories} repositories • {org.totalAlerts} alerts
                              </Typography>
                              
                              <Grid container spacing={1}>
                                <Grid item xs={4}>
                                  <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="caption" sx={{ color: github.fg.muted }}>Code</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: github.fg.default }}>
                                      {org.codeScanning.total}
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={4}>
                                  <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="caption" sx={{ color: github.fg.muted }}>Secrets</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: github.fg.default }}>
                                      {org.secretScanning.total}
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={4}>
                                  <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="caption" sx={{ color: github.fg.muted }}>Dependencies</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: github.fg.default }}>
                                      {org.dependabot.total}
                                    </Typography>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {(org.codeScanning.critical + org.secretScanning.critical + org.dependabot.critical) > 0 && (
                                <Chip size="small" label={`${org.codeScanning.critical + org.secretScanning.critical + org.dependabot.critical} Critical`} 
                                      sx={{ bgcolor: github.danger.border, color: 'white', fontSize: '0.7rem' }} />
                              )}
                              {(org.codeScanning.high + org.secretScanning.high + org.dependabot.high) > 0 && (
                                <Chip size="small" label={`${org.codeScanning.high + org.secretScanning.high + org.dependabot.high} High`} 
                                      sx={{ bgcolor: github.warning.border, color: 'white', fontSize: '0.7rem' }} />
                              )}
                              {(org.codeScanning.medium + org.secretScanning.medium + org.dependabot.medium) > 0 && (
                                <Chip size="small" label={`${org.codeScanning.medium + org.secretScanning.medium + org.dependabot.medium} Medium`} 
                                      sx={{ bgcolor: github.fg.muted, color: 'white', fontSize: '0.7rem' }} />
                              )}
                              {(org.codeScanning.low + org.secretScanning.low + org.dependabot.low) > 0 && (
                                <Chip size="small" label={`${org.codeScanning.low + org.secretScanning.low + org.dependabot.low} Low`} 
                                      sx={{ bgcolor: github.success.border, color: 'white', fontSize: '0.7rem' }} />
                              )}
                            </Box>
                          </Paper>
                        </Grid>
                    ))}
                  </Grid>
                  
                  {enterpriseData.organizationBreakdown.length > 6 && (
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                      {!showAllOrganizations ? (
                        <Button 
                          variant="outlined"
                          onClick={() => setShowAllOrganizations(true)}
                          sx={{ 
                            borderRadius: '6px',
                            borderColor: github.border.default,
                            color: github.fg.default,
                            textTransform: 'none',
                            '&:hover': {
                              bgcolor: github.bg.primary,
                              borderColor: github.border.muted
                            }
                          }}
                        >
                          View All {enterpriseData.organizationBreakdown.length} Organizations
                        </Button>
                      ) : (
                        <Button 
                          variant="text"
                          onClick={() => setShowAllOrganizations(false)}
                          sx={{ 
                            borderRadius: '6px',
                            color: github.fg.muted,
                            textTransform: 'none',
                            '&:hover': {
                              bgcolor: github.bg.primary
                            }
                          }}
                        >
                          Show Less (Top 6 Organizations)
                        </Button>
                      )}
                    </Box>
                  )}
                </Box>
              </Paper>
            )}
          </>
        )}

        {/* Help Section */}
        {!enterpriseData && !isLoading && !jobProgress && (
          <Paper 
            elevation={0}
            sx={{
              border: `1px solid ${github.border.default}`,
              borderRadius: '8px',
              p: 3,
              bgcolor: github.bg.secondary
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ 
                p: 1, 
                borderRadius: '6px', 
                bgcolor: github.bg.primary,
                mr: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <ShieldIcon sx={{ fontSize: 24, color: github.accent.fg }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: github.fg.default }}>
                Getting Started
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: github.fg.muted, mb: 2 }}>
              To begin analyzing your GitHub Enterprise security posture:
            </Typography>
            <Box component="ul" sx={{ pl: 2, color: github.fg.muted }}>
              <Typography component="li" sx={{ mb: 1 }}>
                Enter your GitHub Enterprise organization name above
              </Typography>
              <Typography component="li" sx={{ mb: 1 }}>
                Click "Analyze Enterprise" to start the comprehensive scan
              </Typography>
              <Typography component="li">
                View consolidated vulnerability data across all enterprise repositories
              </Typography>
            </Box>
          </Paper>
        )}

        {/* Organization Table Dialog */}
        <Dialog
          open={showOrganizationTable}
          onClose={() => setShowOrganizationTable(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '8px',
              maxHeight: '90vh',
              border: `1px solid ${github.border.default}`
            }
          }}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: github.fg.default }}>
                Organization Risk Analysis
              </Typography>
              <IconButton 
                onClick={() => setShowOrganizationTable(false)}
                sx={{ color: github.fg.muted }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            {enterpriseData?.organizationBreakdown && enterpriseData.organizationBreakdown.length > 0 && (
              <TableContainer component={Paper} elevation={0} sx={{ bgcolor: github.bg.secondary }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead sx={{ bgcolor: github.bg.primary }}>
                    <TableRow>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        color: github.fg.default,
                        borderBottom: `1px solid ${github.border.default}`,
                        py: 2
                      }}>
                        Organization
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        color: github.fg.default,
                        borderBottom: `1px solid ${github.border.default}`,
                        textAlign: 'center'
                      }}>
                        Risk Score
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        color: github.fg.default,
                        borderBottom: `1px solid ${github.border.default}`,
                        textAlign: 'center'
                      }}>
                        Repositories
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        color: github.fg.default,
                        borderBottom: `1px solid ${github.border.default}`,
                        textAlign: 'center'
                      }}>
                        Total Alerts
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        color: github.fg.default,
                        borderBottom: `1px solid ${github.border.default}`,
                        textAlign: 'center'
                      }}>
                        Code Scanning
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        color: github.fg.default,
                        borderBottom: `1px solid ${github.border.default}`,
                        textAlign: 'center'
                      }}>
                        Secret Scanning
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        color: github.fg.default,
                        borderBottom: `1px solid ${github.border.default}`,
                        textAlign: 'center'
                      }}>
                        Dependabot
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        color: github.fg.default,
                        borderBottom: `1px solid ${github.border.default}`,
                        textAlign: 'center'
                      }}>
                        Critical/High
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {enterpriseData.organizationBreakdown
                      .sort((a, b) => b.riskScore - a.riskScore)
                      .map((org, index) => (
                        <TableRow 
                          key={org.organizationName}
                          sx={{ 
                            '&:hover': { 
                              bgcolor: github.bg.primary 
                            },
                            borderBottom: `1px solid ${github.border.default}`
                          }}
                        >
                          <TableCell sx={{ 
                            borderBottom: `1px solid ${github.border.default}`,
                            py: 2
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box sx={{
                                p: 1,
                                borderRadius: '6px',
                                bgcolor: github.bg.primary,
                                border: `1px solid ${github.border.default}`,
                                mr: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <OrganizationIcon sx={{ fontSize: 16, color: github.fg.default }} />
                              </Box>
                              <Box>
                                <Typography variant="body2" sx={{ 
                                  fontWeight: 600, 
                                  color: github.fg.default,
                                  fontSize: '0.875rem'
                                }}>
                                  {org.organizationName}
                                </Typography>
                                <Typography variant="caption" sx={{ 
                                  color: github.fg.muted,
                                  fontSize: '0.75rem'
                                }}>
                                  Updated: {new Date(org.lastUpdated).toLocaleDateString()}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ 
                            textAlign: 'center',
                            borderBottom: `1px solid ${github.border.default}`
                          }}>
                            <Chip 
                              label={org.riskScore.toFixed(1)}
                              size="small"
                              sx={{
                                bgcolor: org.riskScore > 50 ? github.danger.bg : 
                                         org.riskScore > 25 ? github.warning.bg : github.success.bg,
                                color: org.riskScore > 50 ? github.danger.fg : 
                                       org.riskScore > 25 ? github.warning.fg : github.success.fg,
                                border: org.riskScore > 50 ? `1px solid ${github.danger.border}` : 
                                        org.riskScore > 25 ? `1px solid ${github.warning.border}` : `1px solid ${github.success.border}`,
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                minWidth: '50px'
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ 
                            textAlign: 'center',
                            borderBottom: `1px solid ${github.border.default}`,
                            color: github.fg.default,
                            fontWeight: 500
                          }}>
                            {org.totalRepositories}
                          </TableCell>
                          <TableCell sx={{ 
                            textAlign: 'center',
                            borderBottom: `1px solid ${github.border.default}`,
                            color: github.fg.default,
                            fontWeight: 500
                          }}>
                            {org.totalAlerts}
                          </TableCell>
                          <TableCell sx={{ 
                            textAlign: 'center',
                            borderBottom: `1px solid ${github.border.default}`
                          }}>
                            <Box>
                              <Typography variant="body2" sx={{ 
                                fontWeight: 600, 
                                color: github.fg.default,
                                fontSize: '0.875rem',
                                mb: 0.5
                              }}>
                                {org.codeScanning.total}
                              </Typography>
                              {(org.codeScanning.critical + org.codeScanning.high) > 0 && (
                                <Typography variant="caption" sx={{ 
                                  color: github.danger.fg,
                                  fontSize: '0.7rem'
                                }}>
                                  {org.codeScanning.critical + org.codeScanning.high} critical/high
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ 
                            textAlign: 'center',
                            borderBottom: `1px solid ${github.border.default}`
                          }}>
                            <Box>
                              <Typography variant="body2" sx={{ 
                                fontWeight: 600, 
                                color: github.fg.default,
                                fontSize: '0.875rem',
                                mb: 0.5
                              }}>
                                {org.secretScanning.total}
                              </Typography>
                              {(org.secretScanning.critical + org.secretScanning.high) > 0 && (
                                <Typography variant="caption" sx={{ 
                                  color: github.danger.fg,
                                  fontSize: '0.7rem'
                                }}>
                                  {org.secretScanning.critical + org.secretScanning.high} critical/high
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ 
                            textAlign: 'center',
                            borderBottom: `1px solid ${github.border.default}`
                          }}>
                            <Box>
                              <Typography variant="body2" sx={{ 
                                fontWeight: 600, 
                                color: github.fg.default,
                                fontSize: '0.875rem',
                                mb: 0.5
                              }}>
                                {org.dependabot.total}
                              </Typography>
                              {(org.dependabot.critical + org.dependabot.high) > 0 && (
                                <Typography variant="caption" sx={{ 
                                  color: github.danger.fg,
                                  fontSize: '0.7rem'
                                }}>
                                  {org.dependabot.critical + org.dependabot.high} critical/high
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ 
                            textAlign: 'center',
                            borderBottom: `1px solid ${github.border.default}`
                          }}>
                            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                              {(org.codeScanning.critical + org.secretScanning.critical + org.dependabot.critical) > 0 && (
                                <Chip 
                                  size="small" 
                                  label={`${org.codeScanning.critical + org.secretScanning.critical + org.dependabot.critical} C`}
                                  sx={{ 
                                    bgcolor: github.danger.border, 
                                    color: 'white', 
                                    fontSize: '0.7rem',
                                    minWidth: '30px',
                                    height: '20px'
                                  }} 
                                />
                              )}
                              {(org.codeScanning.high + org.secretScanning.high + org.dependabot.high) > 0 && (
                                <Chip 
                                  size="small" 
                                  label={`${org.codeScanning.high + org.secretScanning.high + org.dependabot.high} H`}
                                  sx={{ 
                                    bgcolor: github.warning.border, 
                                    color: 'white', 
                                    fontSize: '0.7rem',
                                    minWidth: '30px',
                                    height: '20px'
                                  }} 
                                />
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DialogContent>
          <DialogActions sx={{ 
            p: 2, 
            borderTop: `1px solid ${github.border.default}`,
            bgcolor: github.bg.primary
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: github.fg.muted }}>
                {enterpriseData?.organizationBreakdown?.length || 0} organizations analyzed
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  onClick={() => setShowOrganizationTable(false)}
                  sx={{ 
                    color: github.fg.muted,
                    textTransform: 'none',
                    fontSize: '0.875rem'
                  }}
                >
                  Close
                </Button>
                <Button 
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: github.border.default,
                    color: github.fg.default,
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      bgcolor: github.bg.secondary,
                      borderColor: github.border.muted
                    }
                  }}
                  onClick={() => {
                    // Export functionality could be implemented here
                    console.log('Export organization data');
                  }}
                >
                  Export Data
                </Button>
              </Box>
            </Box>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default GitHubEnterpriseDashboard;
