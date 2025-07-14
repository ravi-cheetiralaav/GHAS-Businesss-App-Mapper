import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  Fade,
  LinearProgress,
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  GitHub as GitHubIcon,
  SecurityOutlined,
  RefreshOutlined,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { githubApi } from '../services/api';
import * as designSystem from '../styles/theme';
import { styleMixins } from '../styles/mixins';
import { GradientText } from '../components/common/StyledComponents';

const Login: React.FC = () => {
  const [token, setToken] = useState('');
  const [organization, setOrganization] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const { login, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Check backend status on component mount
  React.useEffect(() => {
    checkBackendStatus();
  }, []);

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const checkBackendStatus = async () => {
    setBackendStatus('checking');
    try {
      const isOnline = await githubApi.healthCheck();
      setBackendStatus(isOnline ? 'online' : 'offline');
    } catch (error) {
      setBackendStatus('offline');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!token.trim()) {
      setError('Please enter a GitHub Personal Access Token.');
      setLoading(false);
      return;
    }

    if (!organization.trim()) {
      setError('Please enter a GitHub organization name.');
      setLoading(false);
      return;
    }

    try {
      const isValid = await githubApi.validateToken(token);
      if (isValid) {
        login(token, organization);
        navigate('/');
      } else {
        setError('Invalid GitHub token. Please check your Personal Access Token.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Provide more specific error messages based on the error type
      if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error')) {
        setError('Cannot connect to the backend server. Please ensure the backend is running on http://localhost:8080');
      } else if (err.response?.status === 401) {
        setError('Invalid GitHub token. Please check your Personal Access Token.');
      } else if (err.response?.status === 403) {
        setError('Access denied. Please ensure your token has the required permissions.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later or contact support.');
      } else {
        setError(`Failed to validate token: ${err.message || 'Unknown error'}. Please check that the backend server is running.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowToken(!showToken);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: designSystem.COLORS.gradients.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <Paper 
            elevation={24} 
            sx={{ 
              width: '100%', 
              maxWidth: 450,
              mx: 'auto',
              borderRadius: designSystem.SPACING.borderRadius.large,
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Card elevation={0} sx={{ background: 'transparent' }}>
              <CardContent sx={{ p: 6 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 4, 
                  justifyContent: 'center',
                  animation: 'fadeInDown 0.8s ease-out',
                  '@keyframes fadeInDown': {
                    '0%': { opacity: 0, transform: 'translateY(-20px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                  }
                }}>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: '50%', 
                    background: designSystem.COLORS.gradients.primary,
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <GitHubIcon sx={{ fontSize: 32, color: 'white' }} />
                  </Box>
                  <Box>
                    <GradientText variant="h4" sx={{ 
                      fontWeight: designSystem.TYPOGRAPHY.weights.bold,
                    }}>
                      GHAS Security
                    </GradientText>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: designSystem.TYPOGRAPHY.weights.medium }}>
                      Advanced Security Platform
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 3, 
                  justifyContent: 'center',
                  animation: 'fadeIn 1s ease-out 0.2s both',
                  '@keyframes fadeIn': {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                  }
                }}>
                  <SecurityOutlined sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" align="center" color="text.secondary" sx={{ fontWeight: designSystem.TYPOGRAPHY.weights.medium }}>
                    GitHub Advanced Security Vulnerability Insights
                  </Typography>
                </Box>

                <Alert 
                  severity="info" 
                  sx={{ 
                    mt: 2, 
                    mb: 3,
                    borderRadius: designSystem.SPACING.borderRadius.medium,
                    background: designSystem.COLORS.gradients.background.subtle,
                    border: '1px solid rgba(103, 126, 234, 0.2)',
                    '& .MuiAlert-icon': {
                      color: 'primary.main',
                    }
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: designSystem.TYPOGRAPHY.weights.medium }}>
                    <strong>Setup Instructions:</strong><br />
                    1. Ensure the backend server is running on http://localhost:8080<br />
                    2. Personal Access Token (classic/fine grained)<br />
                    3. Enter your GitHub organization name
                  </Typography>
                </Alert>

                {/* Backend Status Indicator */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  mb: 3, 
                  p: 2.5, 
                  background: designSystem.COLORS.gradients.background.subtle,
                  borderRadius: designSystem.SPACING.borderRadius.medium,
                  border: '1px solid rgba(103, 126, 234, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 20px rgba(103, 126, 234, 0.15)',
                  }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 1, fontWeight: designSystem.TYPOGRAPHY.weights.semiBold }}>
                      Backend Status:
                    </Typography>
                    {backendStatus === 'checking' && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LinearProgress 
                          sx={{ 
                            mr: 1, 
                            width: 60,
                            height: 4,
                            borderRadius: designSystem.SPACING.borderRadius.medium,
                            backgroundColor: 'rgba(103, 126, 234, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              background: designSystem.COLORS.gradients.primary,
                            }
                          }} 
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: designSystem.TYPOGRAPHY.weights.medium }}>
                          Checking...
                        </Typography>
                      </Box>
                    )}
                    {backendStatus === 'online' && (
                      <Typography variant="body2" color="success.main" sx={{ fontWeight: designSystem.TYPOGRAPHY.weights.bold }}>
                        ✅ Online
                      </Typography>
                    )}
                    {backendStatus === 'offline' && (
                      <Typography variant="body2" color="error.main" sx={{ fontWeight: designSystem.TYPOGRAPHY.weights.bold }}>
                        ❌ Offline
                      </Typography>
                    )}
                  </Box>
                  <Button 
                    size="small" 
                    onClick={checkBackendStatus}
                    disabled={backendStatus === 'checking'}
                    startIcon={<RefreshOutlined />}
                    sx={{
                      borderRadius: designSystem.SPACING.borderRadius.medium,
                      textTransform: 'none',
                      fontWeight: designSystem.TYPOGRAPHY.weights.semiBold,
                      background: designSystem.COLORS.gradients.primary,
                      color: 'white',
                      '&:hover': {
                        background: designSystem.COLORS.gradients.primaryHover,
                        transform: 'translateY(-1px)',
                      },
                      '&:disabled': {
                        background: 'rgba(0, 0, 0, 0.12)',
                        color: 'rgba(0, 0, 0, 0.26)',
                      }
                    }}
                  >
                    Refresh
                  </Button>
                </Box>

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    label="GitHub Personal Access Token"
                    type={showToken ? 'text' : 'password'}
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                    margin="normal"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: designSystem.SPACING.borderRadius.medium,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 2px 10px rgba(103, 126, 234, 0.15)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 4px 20px rgba(103, 126, 234, 0.25)',
                        }
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: 'primary.main',
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton 
                            onClick={handleTogglePasswordVisibility} 
                            edge="end"
                            sx={{
                              '&:hover': {
                                background: 'rgba(103, 126, 234, 0.1)',
                              }
                            }}
                          >
                            {showToken ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    helperText="Generate a Personal Access Token"
                  />
                  
                  <TextField
                    fullWidth
                    label="GitHub Organization"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    required
                    margin="normal"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: designSystem.SPACING.borderRadius.medium,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 2px 10px rgba(103, 126, 234, 0.15)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 4px 20px rgba(103, 126, 234, 0.25)',
                        }
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: 'primary.main',
                      }
                    }}
                    helperText="Enter your GitHub organization name"
                  />

                  {error && (
                    <Fade in timeout={300}>
                      <Alert 
                        severity="error" 
                        sx={{ 
                          mt: 2,
                          borderRadius: designSystem.SPACING.borderRadius.medium,
                          background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(229, 57, 53, 0.1) 100%)',
                          border: '1px solid rgba(244, 67, 54, 0.2)',
                        }}
                      >
                        {error}
                      </Alert>
                    </Fade>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading || backendStatus === 'offline'}
                    sx={{ 
                      mt: 3, 
                      mb: 2,
                      py: 1.5,
                      borderRadius: designSystem.SPACING.borderRadius.medium,
                      fontSize: '1.1rem',
                      fontWeight: designSystem.TYPOGRAPHY.weights.bold,
                      textTransform: 'none',
                      background: designSystem.COLORS.gradients.primary,
                      boxShadow: '0 4px 20px rgba(103, 126, 234, 0.4)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: designSystem.COLORS.gradients.primaryHover,
                        boxShadow: '0 6px 25px rgba(103, 126, 234, 0.5)',
                        transform: 'translateY(-2px)',
                      },
                      '&:disabled': {
                        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.08) 100%)',
                        color: 'rgba(0, 0, 0, 0.26)',
                        boxShadow: 'none',
                      }
                    }}
                  >
                    {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LinearProgress 
                          sx={{ 
                            mr: 2, 
                            width: 20,
                            height: 2,
                            borderRadius: 1,
                            backgroundColor: 'rgba(255, 255, 255, 0.3)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: 'white',
                            }
                          }} 
                        />
                        Authenticating...
                      </Box>
                    ) : backendStatus === 'offline' ? 'Backend Offline' : 'Login to GHAS Insights'}
                  </Button>
                </Box>

                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3, fontWeight: 500 }}>
                  Need help? Check the{' '}
                  <a
                    href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      color: '#667eea', 
                      textDecoration: 'none',
                      fontWeight: 600,
                      transition: 'color 0.3s ease',
                    }}
                  >
                    GitHub PAT documentation
                  </a>
                  {' '}for more information.
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;
