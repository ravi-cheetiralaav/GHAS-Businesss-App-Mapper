import React from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  Paper,
  Fade,
  Grid,
  Card,
  CardContent,
  Chip,
  Tab,
  Tabs,
} from '@mui/material';
import { 
  Business as EnterpriseIcon,
  BugReport as BugIcon,
  Key as SecretIcon,
  Warning as DependabotIcon,
  Shield as ShieldIcon
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`vulnerability-tabpanel-${index}`}
      aria-labelledby={`vulnerability-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </Box>
  );
}

function EnterpriseDashboard() {
    const [dashboardData] = React.useState({
        totalAlerts: 0,
        summary: {
            codeScanning: { total: 0, critical: 0, high: 0, medium: 0, low: 0 },
            secretScanning: { total: 0, byType: {} },
            dependabot: { total: 0, critical: 0, high: 0, medium: 0, low: 0 }
        }
    });
    const [activeTab, setActiveTab] = React.useState(0);

    const handleTabChange = (_event: any, newValue: number) => {
        setActiveTab(newValue);
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header Section */}
            <Fade in timeout={600}>
                <Paper 
                    elevation={0}
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: 4,
                        p: 4,
                        mb: 4,
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '300px',
                            height: '300px',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                            borderRadius: '50%',
                            transform: 'translate(50%, -50%)',
                        }
                    }}
                >
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
                            <EnterpriseIcon sx={{ fontSize: 32, color: 'white' }} />
                        </Box>
                        <Box>
                            <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                                Enterprise Security Dashboard
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                                Consolidated view of all security vulnerabilities across your enterprise
                            </Typography>
                        </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <ShieldIcon sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {dashboardData.totalAlerts} total alerts found across all repositories
                        </Typography>
                    </Box>
                </Paper>
            </Fade>

            {/* Summary Cards */}
            <Fade in timeout={800} style={{ transitionDelay: '200ms' }}>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ borderRadius: 3, background: 'rgba(255, 255, 255, 0.95)' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <BugIcon sx={{ color: 'error.main', mr: 1 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Code Scanning
                                    </Typography>
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                    {dashboardData.summary.codeScanning.total}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    <Chip label={`Critical: ${dashboardData.summary.codeScanning.critical}`} color="error" size="small" />
                                    <Chip label={`High: ${dashboardData.summary.codeScanning.high}`} color="error" size="small" />
                                    <Chip label={`Medium: ${dashboardData.summary.codeScanning.medium}`} color="warning" size="small" />
                                    <Chip label={`Low: ${dashboardData.summary.codeScanning.low}`} color="info" size="small" />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ borderRadius: 3, background: 'rgba(255, 255, 255, 0.95)' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <SecretIcon sx={{ color: 'warning.main', mr: 1 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Secret Scanning
                                    </Typography>
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                    {dashboardData.summary.secretScanning.total}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    No secrets detected
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ borderRadius: 3, background: 'rgba(255, 255, 255, 0.95)' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <DependabotIcon sx={{ color: 'info.main', mr: 1 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Dependabot
                                    </Typography>
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                    {dashboardData.summary.dependabot.total}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    <Chip label={`Critical: ${dashboardData.summary.dependabot.critical}`} color="error" size="small" />
                                    <Chip label={`High: ${dashboardData.summary.dependabot.high}`} color="error" size="small" />
                                    <Chip label={`Medium: ${dashboardData.summary.dependabot.medium}`} color="warning" size="small" />
                                    <Chip label={`Low: ${dashboardData.summary.dependabot.low}`} color="info" size="small" />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Fade>

            {/* Vulnerability Tables */}
            <Fade in timeout={1000} style={{ transitionDelay: '400ms' }}>
                <Paper sx={{
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(103, 126, 234, 0.1)',
                    boxShadow: '0 8px 32px rgba(103, 126, 234, 0.1)',
                }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs 
                            value={activeTab} 
                            onChange={handleTabChange} 
                            aria-label="vulnerability alerts tabs"
                            sx={{ px: 3 }}
                        >
                            <Tab 
                                label={`Code Scanning (${dashboardData.summary.codeScanning.total})`} 
                                icon={<BugIcon />} 
                                iconPosition="start"
                            />
                            <Tab 
                                label={`Secret Scanning (${dashboardData.summary.secretScanning.total})`} 
                                icon={<SecretIcon />} 
                                iconPosition="start"
                            />
                            <Tab 
                                label={`Dependabot (${dashboardData.summary.dependabot.total})`} 
                                icon={<DependabotIcon />} 
                                iconPosition="start"
                            />
                        </Tabs>
                    </Box>
                    
                    <TabPanel value={activeTab} index={0}>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <BugIcon sx={{ mr: 1 }} />
                            Code Scanning Alerts
                        </Typography>
                        <Alert severity="info" sx={{ mb: 3 }}>
                            <Typography variant="body2">
                                <strong>Ready for integration!</strong> This dashboard will display detailed code scanning alerts from the GitHub Enterprise API once connected to your enterprise.
                            </Typography>
                        </Alert>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            The following information will be displayed for each code scanning alert:
                        </Typography>
                        <Box component="ul" sx={{ pl: 3, '& li': { mb: 1 } }}>
                            <Typography component="li" variant="body2">Repository name and file location</Typography>
                            <Typography component="li" variant="body2">Security severity level (Critical, High, Medium, Low)</Typography>
                            <Typography component="li" variant="body2">Rule description and vulnerability details</Typography>
                            <Typography component="li" variant="body2">Alert state (Open, Fixed, Dismissed) and creation date</Typography>
                            <Typography component="li" variant="body2">Direct links to view alerts on GitHub</Typography>
                        </Box>
                    </TabPanel>
                    
                    <TabPanel value={activeTab} index={1}>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <SecretIcon sx={{ mr: 1 }} />
                            Secret Scanning Alerts
                        </Typography>
                        <Alert severity="info" sx={{ mb: 3 }}>
                            <Typography variant="body2">
                                <strong>Ready for integration!</strong> This dashboard will display detailed secret scanning alerts from the GitHub Enterprise API once connected to your enterprise.
                            </Typography>
                        </Alert>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            The following information will be displayed for each secret scanning alert:
                        </Typography>
                        <Box component="ul" sx={{ pl: 3, '& li': { mb: 1 } }}>
                            <Typography component="li" variant="body2">Repository name and secret type detected</Typography>
                            <Typography component="li" variant="body2">Push protection status (Protected/Bypassed)</Typography>
                            <Typography component="li" variant="body2">Alert resolution state and resolution reason</Typography>
                            <Typography component="li" variant="body2">Detection timestamp and resolved date</Typography>
                            <Typography component="li" variant="body2">Direct links to view alerts on GitHub</Typography>
                        </Box>
                    </TabPanel>
                    
                    <TabPanel value={activeTab} index={2}>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <DependabotIcon sx={{ mr: 1 }} />
                            Dependabot Alerts
                        </Typography>
                        <Alert severity="info" sx={{ mb: 3 }}>
                            <Typography variant="body2">
                                <strong>Ready for integration!</strong> This dashboard will display detailed Dependabot alerts from the GitHub Enterprise API once connected to your enterprise.
                            </Typography>
                        </Alert>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            The following information will be displayed for each Dependabot alert:
                        </Typography>
                        <Box component="ul" sx={{ pl: 3, '& li': { mb: 1 } }}>
                            <Typography component="li" variant="body2">Repository name and affected package details</Typography>
                            <Typography component="li" variant="body2">Vulnerability severity and GHSA/CVE identifiers</Typography>
                            <Typography component="li" variant="body2">Vulnerable version range and available patches</Typography>
                            <Typography component="li" variant="body2">Alert state (Open, Fixed, Dismissed) and resolution status</Typography>
                            <Typography component="li" variant="body2">Direct links to view alerts and advisories on GitHub</Typography>
                        </Box>
                    </TabPanel>
                </Paper>
            </Fade>

            {/* Implementation Notes */}
            <Fade in timeout={1200} style={{ transitionDelay: '600ms' }}>
                <Paper sx={{ mt: 4, p: 3, borderRadius: 3, background: 'rgba(255, 255, 255, 0.95)' }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        🔧 Implementation Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        This Enterprise Security Dashboard integrates with the following GitHub Enterprise APIs:
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ p: 2, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                    Code Scanning API
                                </Typography>
                                <Typography variant="caption" sx={{ fontFamily: 'monospace', display: 'block', mb: 1 }}>
                                    GET /enterprises/{'{'}{'{enterprise}'}{'}'}'/code-scanning/alerts
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                    Retrieves all code scanning alerts across the enterprise
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ p: 2, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                    Secret Scanning API
                                </Typography>
                                <Typography variant="caption" sx={{ fontFamily: 'monospace', display: 'block', mb: 1 }}>
                                    GET /enterprises/{'{'}{'{enterprise}'}{'}'}'/secret-scanning/alerts
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                    Retrieves all secret scanning alerts across the enterprise
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ p: 2, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                    Dependabot API
                                </Typography>
                                <Typography variant="caption" sx={{ fontFamily: 'monospace', display: 'block', mb: 1 }}>
                                    GET /enterprises/{'{'}{'{enterprise}'}{'}'}'/dependabot/alerts
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                    Retrieves all Dependabot alerts across the enterprise
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Fade>
        </Box>
    );
}

export default EnterpriseDashboard;
