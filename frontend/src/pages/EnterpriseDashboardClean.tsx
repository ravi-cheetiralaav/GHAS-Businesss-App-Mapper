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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
        {stats.total.toLocaleString()}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Total {type} vulnerabilities found
      </Typography>
      
      <Grid container spacing={2}>
        {stats.critical > 0 && (
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#ffebee' }}>
              <Typography variant="h6" color="error" sx={{ fontWeight: 'bold' }}>
                {stats.critical}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Critical
              </Typography>
            </Paper>
          </Grid>
        )}
        {stats.high > 0 && (
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fff3e0' }}>
              <Typography variant="h6" color="warning.main" sx={{ fontWeight: 'bold' }}>
                {stats.high}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                High
              </Typography>
            </Paper>
          </Grid>
        )}
        {stats.medium > 0 && (
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f3e5f5' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                {stats.medium}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Medium
              </Typography>
            </Paper>
          </Grid>
        )}
        {stats.low > 0 && (
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e8' }}>
              <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                {stats.low}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Low
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );

  const renderOrganizationTable = (organizations: OrganizationRiskSummary[]) => (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ bgcolor: 'primary.main' }}>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
              Organization
            </TableCell>
            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>
              Risk Score
            </TableCell>
            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>
              Repositories
            </TableCell>
            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>
              Total Alerts
            </TableCell>
            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>
              Code Scanning
            </TableCell>
            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>
              Secret Scanning
            </TableCell>
            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>
              Dependabot
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {organizations
            .sort((a, b) => b.riskScore - a.riskScore)
            .map((org) => (
              <TableRow 
                key={org.organizationName}
                sx={{ 
                  '&:hover': { bgcolor: 'action.hover' },
                  borderLeft: `4px solid ${
                    org.riskScore > 50 ? theme.palette.error.main :
                    org.riskScore > 25 ? theme.palette.warning.main :
                    theme.palette.success.main
                  }`
                }}
              >
                <TableCell sx={{ fontWeight: 'bold' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <OrganizationIcon sx={{ mr: 1, color: 'primary.main' }} />
                    {org.organizationName}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Chip 
                    label={org.riskScore.toFixed(1)}
                    size="small"
                    color={org.riskScore > 50 ? 'error' : org.riskScore > 25 ? 'warning' : 'success'}
                    sx={{ fontWeight: 'bold' }}
                  />
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  {org.totalRepositories}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  {org.totalAlerts}
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {org.codeScanning.total}
                    </Typography>
                    {(org.codeScanning.critical + org.codeScanning.high) > 0 && (
                      <Typography variant="caption" color="error">
                        {org.codeScanning.critical + org.codeScanning.high} critical/high
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {org.secretScanning.total}
                    </Typography>
                    {(org.secretScanning.critical + org.secretScanning.high) > 0 && (
                      <Typography variant="caption" color="error">
                        {org.secretScanning.critical + org.secretScanning.high} critical/high
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {org.dependabot.total}
                    </Typography>
                    {(org.dependabot.critical + org.dependabot.high) > 0 && (
                      <Typography variant="caption" color="error">
                        {org.dependabot.critical + org.dependabot.high} critical/high
                      </Typography>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EnterpriseIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Enterprise Security Dashboard
              </Typography>
              <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                {isConnected ? (
                  <Chip 
                    icon={<ConnectedIcon />} 
                    label="Connected" 
                    color="success" 
                    variant="outlined" 
                  />
                ) : (
                  <Chip 
                    icon={<DisconnectedIcon />} 
                    label="Disconnected" 
                    color="error" 
                    variant="outlined" 
                  />
                )}
              </Box>
            </Box>
            <Typography variant="body1" color="text.secondary">
              Comprehensive vulnerability assessment across your GitHub Enterprise
            </Typography>
          </Box>

          {/* Search Section */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Enterprise Analysis
            </Typography>
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
              />
              <Button
                onClick={handleSearch}
                disabled={isLoading || !enterpriseName.trim()}
                variant="contained"
                size="large"
                startIcon={isLoading ? <CircularProgress size={20} /> : <SearchIcon />}
                sx={{ minWidth: '160px' }}
              >
                {isLoading ? 'Analyzing...' : 'Analyze Enterprise'}
              </Button>
            </Box>
            
            {error && (
              <Alert 
                severity={error.startsWith('✅') ? 'success' : 'error'}
                sx={{ mt: 2 }}
              >
                {error}
              </Alert>
            )}
          </Paper>

          {/* Job Progress */}
          {jobProgress && (
            <Box sx={{ mb: 3 }}>
              <JobProgressDisplay jobProgress={jobProgress} />
            </Box>
          )}

          {/* Enterprise Data Display */}
          {enterpriseData && (
            <>
              {/* Main Dashboard */}
              <Paper sx={{ mb: 3 }}>
                <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Security Overview: {searchedEnterprise}
                  </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                  <Tabs
                    value={activeTab}
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    sx={{ mb: 3 }}
                  >
                    <Tab
                      icon={<CodeIcon />}
                      label={`Code Scanning (${enterpriseData.codeScanning.total})`}
                      iconPosition="start"
                    />
                    <Tab
                      icon={<SecretIcon />}
                      label={`Secret Scanning (${enterpriseData.secretScanning.total})`}
                      iconPosition="start"
                    />
                    <Tab
                      icon={<DependabotIcon />}
                      label={`Dependabot (${enterpriseData.dependabot.total})`}
                      iconPosition="start"
                    />
                  </Tabs>

                  {activeTab === 0 && renderVulnerabilityStats(enterpriseData.codeScanning, 'Code Scanning')}
                  {activeTab === 1 && renderVulnerabilityStats(enterpriseData.secretScanning, 'Secret Scanning')}
                  {activeTab === 2 && renderVulnerabilityStats(enterpriseData.dependabot, 'Dependabot')}
                </Box>
              </Paper>

              {/* Organization Breakdown */}
              {enterpriseData.organizationBreakdown && enterpriseData.organizationBreakdown.length > 0 && (
                <Paper>
                  <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Organization Risk Breakdown
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Risk assessment across {enterpriseData.organizationSummary?.totalOrganizations || 0} organizations
                      • {enterpriseData.organizationSummary?.totalRepositories || 0} repositories
                      • {enterpriseData.organizationSummary?.totalAlerts || 0} total alerts
                    </Typography>
                  </Box>

                  <Box sx={{ p: 3 }}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Organizations ({showAllOrganizations ? enterpriseData.organizationBreakdown.length : Math.min(6, enterpriseData.organizationBreakdown.length)} of {enterpriseData.organizationBreakdown.length})
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setShowOrganizationTable(true)}
                      >
                        View Table
                      </Button>
                    </Box>
                    
                    <Grid container spacing={3}>
                      {enterpriseData.organizationBreakdown
                        .sort((a, b) => b.riskScore - a.riskScore)
                        .slice(0, showAllOrganizations ? undefined : 6)
                        .map((org) => (
                          <Grid item xs={12} md={6} lg={4} key={org.organizationName}>
                            <Card sx={{ 
                              height: '100%',
                              borderLeft: `4px solid ${
                                org.riskScore > 50 ? theme.palette.error.main :
                                org.riskScore > 25 ? theme.palette.warning.main :
                                theme.palette.success.main
                              }`
                            }}>
                              <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    {org.organizationName}
                                  </Typography>
                                  <Chip 
                                    label={`Risk: ${org.riskScore.toFixed(1)}`}
                                    size="small"
                                    color={org.riskScore > 50 ? 'error' : org.riskScore > 25 ? 'warning' : 'success'}
                                  />
                                </Box>
                                
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                  {org.totalRepositories} repositories • {org.totalAlerts} alerts
                                </Typography>
                                
                                <Grid container spacing={1} sx={{ mb: 2 }}>
                                  <Grid item xs={4}>
                                    <Box sx={{ textAlign: 'center' }}>
                                      <Typography variant="caption" color="text.secondary">Code</Typography>
                                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        {org.codeScanning.total}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <Box sx={{ textAlign: 'center' }}>
                                      <Typography variant="caption" color="text.secondary">Secrets</Typography>
                                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        {org.secretScanning.total}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <Box sx={{ textAlign: 'center' }}>
                                      <Typography variant="caption" color="text.secondary">Dependencies</Typography>
                                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        {org.dependabot.total}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                </Grid>
                                
                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                  {(org.codeScanning.critical + org.secretScanning.critical + org.dependabot.critical) > 0 && (
                                    <Chip size="small" label={`${org.codeScanning.critical + org.secretScanning.critical + org.dependabot.critical} Critical`} color="error" />
                                  )}
                                  {(org.codeScanning.high + org.secretScanning.high + org.dependabot.high) > 0 && (
                                    <Chip size="small" label={`${org.codeScanning.high + org.secretScanning.high + org.dependabot.high} High`} color="warning" />
                                  )}
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                      ))}
                    </Grid>
                    
                    {enterpriseData.organizationBreakdown.length > 6 && (
                      <Box sx={{ mt: 3, textAlign: 'center' }}>
                        {!showAllOrganizations ? (
                          <Button 
                            variant="outlined"
                            onClick={() => setShowAllOrganizations(true)}
                          >
                            View All {enterpriseData.organizationBreakdown.length} Organizations
                          </Button>
                        ) : (
                          <Button 
                            variant="text"
                            onClick={() => setShowAllOrganizations(false)}
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
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SecurityIcon sx={{ mr: 2, fontSize: 24, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Getting Started
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                To begin analyzing your GitHub Enterprise security posture:
              </Typography>
              <Box component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
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
          >
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Organization Risk Analysis
                </Typography>
                <IconButton 
                  onClick={() => setShowOrganizationTable(false)}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
              {enterpriseData?.organizationBreakdown && renderOrganizationTable(enterpriseData.organizationBreakdown)}
            </DialogContent>
            <DialogActions>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 'auto' }}>
                {enterpriseData?.organizationBreakdown?.length || 0} organizations analyzed
              </Typography>
              <Button onClick={() => setShowOrganizationTable(false)}>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Fade>
  );
};

export default EnterpriseDashboard;
