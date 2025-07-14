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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
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
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useEnterpriseAsyncJob } from '../hooks/useEnterpriseAsyncJob';
import JobProgressDisplay from '../components/JobProgressDisplay';
import { styleMixins } from '../styles/mixins';
import { COLORS } from '../styles/theme';
import { GradientText, StatsBox, SeverityChip, RiskScoreChip, AlertCountChip, VulnerabilityCountChip, RepositoryCountChip, VulnerabilityCountWithWarning } from '../components/common/StyledComponents';

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

const EnterpriseDashboard: React.FC = () => {
  const { token } = useAuth();
  const theme = useTheme();
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

  const renderVulnerabilityStats = (stats: VulnerabilityStats, type: string) => (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      {/* Main count display using centralized styles */}
      <Box sx={{
        ...styleMixins.centerContent(),
        minWidth: 80,
        padding: '8px 20px',
        height: 80,
        borderRadius: '40px',
        background: stats.total > 0 ? COLORS.gradients.warning : COLORS.gradients.success,
        color: 'white',
        fontWeight: 'bold',
        fontSize: '2rem',
        boxShadow: stats.total > 0 
          ? '0 4px 15px rgba(255, 165, 0, 0.4)' 
          : '0 4px 15px rgba(144, 238, 144, 0.4)',
        mb: 2,
      }}>
        {stats.total.toLocaleString()}
      </Box>
      
      {/* Gradient text using reusable component */}
      <GradientText variant="h6" sx={{ mb: 3 }}>
        Total {type} vulnerabilities found
      </GradientText>
      
      {/* Stats grid using reusable StatsBox component */}
      <Grid container spacing={2}>
        {stats.critical > 0 && (
          <Grid item xs={6} sm={3}>
            <StatsBox severity="critical" count={stats.critical} label="Critical" />
          </Grid>
        )}
        {stats.high > 0 && (
          <Grid item xs={6} sm={3}>
            <StatsBox severity="high" count={stats.high} label="High" />
          </Grid>
        )}
        {stats.medium > 0 && (
          <Grid item xs={6} sm={3}>
            <StatsBox severity="medium" count={stats.medium} label="Medium" />
          </Grid>
        )}
        {stats.low > 0 && (
          <Grid item xs={6} sm={3}>
            <StatsBox severity="low" count={stats.low} label="Low" />
          </Grid>
        )}
      </Grid>
    </Box>
  );

  const renderOrganizationTable = (organizations: OrganizationRiskSummary[]) => (
    <TableContainer 
      component={Paper} 
      sx={{ 
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={styleMixins.tableHeader()}>
            <TableCell sx={styleMixins.tableHeaderCell()}>
              Organization
            </TableCell>
            <TableCell align="center" sx={styleMixins.tableHeaderCell()}>
              Risk Score
            </TableCell>
            <TableCell align="center" sx={styleMixins.tableHeaderCell()}>
              Repositories
            </TableCell>
            <TableCell align="center" sx={styleMixins.tableHeaderCell()}>
              Total Alerts
            </TableCell>
            <TableCell align="center" sx={styleMixins.tableHeaderCell()}>
              Code Scanning
            </TableCell>
            <TableCell align="center" sx={styleMixins.tableHeaderCell()}>
              Secret Scanning
            </TableCell>
            <TableCell align="center" sx={styleMixins.tableHeaderCell()}>
              Dependabot
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {organizations
            .sort((a, b) => b.riskScore - a.riskScore)
            .map((org, index) => (
              <TableRow 
                key={org.organizationName}
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
                <TableCell sx={{ fontWeight: 500 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <OrganizationIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    {org.organizationName}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <RiskScoreChip score={org.riskScore} />
                </TableCell>
                <TableCell align="center">
                  <RepositoryCountChip count={org.totalRepositories} />
                </TableCell>
                <TableCell align="center">
                  <AlertCountChip count={org.totalAlerts} />
                </TableCell>
                <TableCell align="center">
                  <VulnerabilityCountWithWarning 
                    total={org.codeScanning.total}
                    critical={org.codeScanning.critical}
                    high={org.codeScanning.high}
                  />
                </TableCell>
                <TableCell align="center">
                  <VulnerabilityCountWithWarning 
                    total={org.secretScanning.total}
                    critical={org.secretScanning.critical}
                    high={org.secretScanning.high}
                  />
                </TableCell>
                <TableCell align="center">
                  <VulnerabilityCountWithWarning 
                    total={org.dependabot.total}
                    critical={org.dependabot.critical}
                    high={org.dependabot.high}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Fade in={true} timeout={800}>
      <Box>
        {/* Enhanced Header Section with Purple Gradient */}
        <Paper elevation={8} sx={styleMixins.headerCard()}>
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
                    color: 'white',
                  }}
                >
                  Enterprise Risk Dashboard
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    opacity: 0.9,
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                    color: 'white',
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
              <Card sx={{ ...styleMixins.elevatedCard(), mb: 4 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <EnterpriseIcon 
                      sx={{ 
                        fontSize: 32, 
                        mr: 2, 
                        color: theme.palette.primary.main,
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                      }} 
                    />
                    <GradientText variant="h6">
                      Enterprise Analysis
                    </GradientText>
                  </Box>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
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
                      <Button
                        onClick={handleSearch}
                        disabled={isLoading || !enterpriseName.trim()}
                        variant="contained"
                        size="large"
                        fullWidth
                        startIcon={isLoading ? <CircularProgress size={20} /> : <SearchIcon />}
                        sx={{
                          ...styleMixins.primaryButton(),
                          '&:disabled': {
                            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.08) 100%)',
                            color: 'rgba(0, 0, 0, 0.26)',
                          }
                        }}
                      >
                        {isLoading ? 'Analyzing...' : 'Analyze Enterprise'}
                      </Button>
                    </Grid>
                  </Grid>

                  {error && (
                    <Fade in timeout={300}>
                      <Alert 
                        severity={error.startsWith('✅') ? 'success' : 'error'}
                        sx={{ 
                          mt: 3,
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
              </Card>
            </Fade>

            {/* Job Progress Display */}
            {jobProgress && (
              <JobProgressDisplay jobProgress={jobProgress} />
            )}

            {/* Enterprise Data Section */}
            {enterpriseData && (
              <Fade in={true} timeout={1000} style={{ transitionDelay: '400ms' }}>
                <Box>
                  <Card
                    elevation={8}
                    sx={{
                      mb: 4,
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
                        zIndex: 1,
                      },
                    }}
                  >
                    {/* Purple Gradient Header Section */}
                    <Box 
                      sx={{ 
                        p: 3,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        position: 'relative',
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
                      <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                        <SecurityIcon 
                          sx={{ 
                            fontSize: 32, 
                            mr: 2,
                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                          }} 
                        />
                        <Box>
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              fontWeight: 'bold', 
                              mb: 0.5,
                              color: 'white',
                              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                            }}
                          >
                            Security Overview: {searchedEnterprise}
                          </Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              color: 'white',
                              opacity: 0.9,
                              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                            }}
                          >
                            Consolidated vulnerability data from all repositories
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <CardContent sx={{ p: 3, position: 'relative', zIndex: 2 }}>
                      {/* Remove the old header content since it's now in the purple section above */}

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
                          'Code Scanning'
                        )}
                        {activeTab === 1 && renderVulnerabilityStats(
                          enterpriseData.secretScanning, 
                          'Secret Scanning'
                        )}
                        {activeTab === 2 && renderVulnerabilityStats(
                          enterpriseData.dependabot, 
                          'Dependabot'
                        )}
                      </CardContent>
                    </Paper>

                    {/* Organization Breakdown */}
                    {enterpriseData.organizationBreakdown && enterpriseData.organizationBreakdown.length > 0 && (
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
                  <Box sx={{ 
                    p: 3, 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    position: 'relative',
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
                  }}>
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <OrganizationIcon 
                          sx={{ 
                            fontSize: 32, 
                            mr: 2,
                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                          }} 
                        />
                        <Typography variant="h5" sx={{ 
                          fontWeight: 'bold', 
                          color: 'white',
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        }}>
                          Organization Risk Breakdown
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ 
                        color: 'white',
                        opacity: 0.9,
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      }}>
                        Risk assessment across {enterpriseData.organizationSummary?.totalOrganizations || 0} organizations
                        • {enterpriseData.organizationSummary?.totalRepositories || 0} repositories
                        • {enterpriseData.organizationSummary?.totalAlerts || 0} total alerts
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ p: 3 }}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}>
                        Organizations ({showAllOrganizations ? enterpriseData.organizationBreakdown.length : Math.min(6, enterpriseData.organizationBreakdown.length)} of {enterpriseData.organizationBreakdown.length})
                      </Typography>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => setShowOrganizationTable(true)}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          fontWeight: 'bold',
                          borderRadius: 2,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 15px rgba(103, 126, 234, 0.4)',
                          },
                        }}
                      >
                        View Table
                      </Button>
                    </Box>
                    
                    <Grid container spacing={3}>
                      {enterpriseData.organizationBreakdown
                        .sort((a, b) => b.riskScore - a.riskScore)
                        .slice(0, showAllOrganizations ? undefined : 6)
                        .map((org) => {
                          // Calculate risk level and colors
                          const isHighRisk = org.riskScore > 50;
                          const isMediumRisk = org.riskScore > 25 && org.riskScore <= 50;
                          const isLowRisk = org.riskScore <= 25;
                          
                          const riskColors = {
                            high: {
                              gradient: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(229, 57, 53, 0.15) 100%)',
                              border: '#f44336',
                              accent: '#d32f2f',
                              chipBg: '#ffebee'
                            },
                            medium: {
                              gradient: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(245, 124, 0, 0.15) 100%)',
                              border: '#ff9800',
                              accent: '#f57c00',
                              chipBg: '#fff3e0'
                            },
                            low: {
                              gradient: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(56, 142, 60, 0.15) 100%)',
                              border: '#4caf50',
                              accent: '#388e3c',
                              chipBg: '#e8f5e8'
                            }
                          };
                          
                          const currentRiskColors = isHighRisk ? riskColors.high : 
                                                  isMediumRisk ? riskColors.medium : 
                                                  riskColors.low;
                          
                          return (
                          <Grid item xs={12} md={6} lg={4} key={org.organizationName}>
                            <Card sx={{ 
                              height: '100%',
                              borderRadius: 3,
                              background: currentRiskColors.gradient,
                              border: `2px solid ${currentRiskColors.border}`,
                              position: 'relative',
                              overflow: 'hidden',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: `0 8px 25px ${currentRiskColors.border}40`,
                                border: `2px solid ${currentRiskColors.accent}`,
                              },
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: `linear-gradient(90deg, ${currentRiskColors.border} 0%, ${currentRiskColors.accent} 100%)`,
                              }
                            }}>
                              <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                  <Typography variant="h6" sx={{ 
                                    fontWeight: 'bold',
                                    color: currentRiskColors.accent,
                                  }}>
                                    {org.organizationName}
                                  </Typography>
                                  <Chip 
                                    label={`Risk: ${org.riskScore.toFixed(1)}`}
                                    size="small"
                                    sx={{
                                      backgroundColor: currentRiskColors.chipBg,
                                      color: currentRiskColors.accent,
                                      fontWeight: 'bold',
                                      border: `1px solid ${currentRiskColors.border}`,
                                    }}
                                  />
                                </Box>
                                
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                  {org.totalRepositories} repositories • {org.totalAlerts} alerts
                                </Typography>
                                
                                <Grid container spacing={1} sx={{ mb: 2 }}>
                                  <Grid item xs={4}>
                                    <Box sx={{ 
                                      textAlign: 'center',
                                      p: 1,
                                      borderRadius: 2,
                                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                      border: `1px solid ${currentRiskColors.border}30`,
                                    }}>
                                      <Typography variant="caption" color="text.secondary">Code</Typography>
                                      <Typography variant="h6" sx={{ 
                                        fontWeight: 'bold',
                                        color: org.codeScanning.total > 0 ? currentRiskColors.accent : 'text.primary'
                                      }}>
                                        {org.codeScanning.total}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <Box sx={{ 
                                      textAlign: 'center',
                                      p: 1,
                                      borderRadius: 2,
                                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                      border: `1px solid ${currentRiskColors.border}30`,
                                    }}>
                                      <Typography variant="caption" color="text.secondary">Secrets</Typography>
                                      <Typography variant="h6" sx={{ 
                                        fontWeight: 'bold',
                                        color: org.secretScanning.total > 0 ? currentRiskColors.accent : 'text.primary'
                                      }}>
                                        {org.secretScanning.total}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <Box sx={{ 
                                      textAlign: 'center',
                                      p: 1,
                                      borderRadius: 2,
                                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                      border: `1px solid ${currentRiskColors.border}30`,
                                    }}>
                                      <Typography variant="caption" color="text.secondary">Dependencies</Typography>
                                      <Typography variant="h6" sx={{ 
                                        fontWeight: 'bold',
                                        color: org.dependabot.total > 0 ? currentRiskColors.accent : 'text.primary'
                                      }}>
                                        {org.dependabot.total}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                </Grid>
                                
                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                  {(org.codeScanning.critical + org.secretScanning.critical + org.dependabot.critical) > 0 && (
                                    <Chip 
                                      size="small" 
                                      label={`${org.codeScanning.critical + org.secretScanning.critical + org.dependabot.critical} Critical`} 
                                      sx={{
                                        backgroundColor: '#ffebee',
                                        color: '#d32f2f',
                                        fontWeight: 'bold',
                                        border: '1px solid #f44336',
                                      }}
                                    />
                                  )}
                                  {(org.codeScanning.high + org.secretScanning.high + org.dependabot.high) > 0 && (
                                    <Chip 
                                      size="small" 
                                      label={`${org.codeScanning.high + org.secretScanning.high + org.dependabot.high} High`} 
                                      sx={{
                                        backgroundColor: '#fff3e0',
                                        color: '#f57c00',
                                        fontWeight: 'bold',
                                        border: '1px solid #ff9800',
                                      }}
                                    />
                                  )}
                                  {(org.codeScanning.medium + org.secretScanning.medium + org.dependabot.medium) > 0 && (
                                    <Chip 
                                      size="small" 
                                      label={`${org.codeScanning.medium + org.secretScanning.medium + org.dependabot.medium} Medium`} 
                                      sx={{
                                        backgroundColor: '#f3e5f5',
                                        color: '#7b1fa2',
                                        fontWeight: 'bold',
                                        border: '1px solid #9c27b0',
                                      }}
                                    />
                                  )}
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                          );
                        })}
                    </Grid>
                    
                    {enterpriseData.organizationBreakdown.length > 6 && (
                      <Box sx={{ mt: 3, textAlign: 'center' }}>
                        {!showAllOrganizations ? (
                          <Button 
                            variant="contained"
                            onClick={() => setShowAllOrganizations(true)}
                            sx={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              fontWeight: 'bold',
                              borderRadius: 2,
                              px: 3,
                              '&:hover': {
                                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 15px rgba(103, 126, 234, 0.4)',
                              },
                            }}
                          >
                            View All {enterpriseData.organizationBreakdown.length} Organizations
                          </Button>
                        ) : (
                          <Button 
                            variant="outlined"
                            onClick={() => setShowAllOrganizations(false)}
                            sx={{
                              borderColor: '#667eea',
                              color: '#667eea',
                              fontWeight: 'bold',
                              borderRadius: 2,
                              px: 3,
                              '&:hover': {
                                borderColor: '#5a6fd8',
                                backgroundColor: 'rgba(103, 126, 234, 0.1)',
                                color: '#5a6fd8',
                              },
                            }}
                          >
                            Show Less (Top 6 Organizations)
                          </Button>
                        )}
                      </Box>
                    )}
                  </Box>
                </Card>
              )}
                    </CardContent>
                  </Card>
                </Box>
              </Fade>
            )}

            {/* Help Section */}
            {!enterpriseData && !isLoading && !jobProgress && (
            <Fade in={true} timeout={1200} style={{ transitionDelay: '600ms' }}>
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
                    <SecurityIcon 
                      sx={{ 
                        fontSize: 32, 
                        mr: 2, 
                        color: theme.palette.primary.main,
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                      }} 
                    />
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
                  <Typography component="li" color="text.secondary" sx={{ mb: 1 }}>
                    Click "Analyze Enterprise" to begin the comprehensive security assessment
                  </Typography>
                  <Typography component="li" color="text.secondary">
                    Review the consolidated vulnerability data and risk breakdown
                  </Typography>
                </Box>
                </CardContent>
              </Card>
            </Fade>
          )}

          {/* Organization Table Dialog */}
          <Dialog
            open={showOrganizationTable}
            onClose={() => setShowOrganizationTable(false)}
            maxWidth="lg"
            fullWidth
          >
            <DialogTitle
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <RiskIcon 
                    sx={{ 
                      fontSize: 28, 
                      mr: 2,
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                    }} 
                  />
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold',
                    color: 'white',
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  }}>
                    Organization Risk Analysis
                  </Typography>
                </Box>
                <IconButton 
                  onClick={() => setShowOrganizationTable(false)}
                  sx={{
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
              {enterpriseData?.organizationBreakdown && renderOrganizationTable(enterpriseData.organizationBreakdown)}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 'auto' }}>
                {enterpriseData?.organizationBreakdown?.length || 0} organizations analyzed
              </Typography>
              <Button 
                onClick={() => setShowOrganizationTable(false)}
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: 2,
                  px: 3,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 15px rgba(103, 126, 234, 0.4)',
                  },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
          </Box>
        </Container>
      </Box>
    </Fade>
  );
};

export default EnterpriseDashboard;
