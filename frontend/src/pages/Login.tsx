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
} from '@mui/material';
import { Visibility, VisibilityOff, GitHub as GitHubIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { githubApi } from '../services/api';

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
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper elevation={8} sx={{ width: '100%', maxWidth: 400 }}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'center' }}>
                <GitHubIcon sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h4" component="h1" fontWeight="bold">
                  GHAS Insights
                </Typography>
              </Box>
              
              <Typography variant="h6" gutterBottom align="center" color="text.secondary">
                GitHub Advanced Security Vulnerability Insights
              </Typography>

              <Alert severity="info" sx={{ mt: 2, mb: 3 }}>
                <Typography variant="body2">
                  <strong>Setup Instructions:</strong><br />
                  1. Ensure the backend server is running on http://localhost:8080<br />
                  2. Personal Access Token (classic/fine grained)<br />
                  3. Enter your GitHub organization name
                </Typography>
              </Alert>

              {/* Backend Status Indicator */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    Backend Status:
                  </Typography>
                  {backendStatus === 'checking' && (
                    <Typography variant="body2" color="text.secondary">
                      Checking...
                    </Typography>
                  )}
                  {backendStatus === 'online' && (
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
                      ✅ Online
                    </Typography>
                  )}
                  {backendStatus === 'offline' && (
                    <Typography variant="body2" color="error.main" sx={{ fontWeight: 'bold' }}>
                      ❌ Offline
                    </Typography>
                  )}
                </Box>
                <Button 
                  size="small" 
                  onClick={checkBackendStatus}
                  disabled={backendStatus === 'checking'}
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
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePasswordVisibility} edge="end">
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
                  helperText="Enter your GitHub organization name"
                />

                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading || backendStatus === 'offline'}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {loading ? 'Authenticating...' : 
                   backendStatus === 'offline' ? 'Backend Offline' : 'Login'}
                </Button>
              </Box>

              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                Need help? Check the{' '}
                <a
                  href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub PAT documentation
                </a>
                {' '}for more information.
              </Typography>
            </CardContent>
          </Card>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
