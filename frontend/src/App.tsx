import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Repositories from './pages/Repositories';
import BusinessApplications from './pages/BusinessApplications';
import Analytics from './pages/Analytics';
import EnterpriseDashboard from './pages/EnterpriseDashboard';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea', // Purple gradient start
      dark: '#764ba2', // Purple gradient end
      light: '#8B9DC3'
    },
    secondary: {
      main: '#764ba2', // Purple gradient end
      dark: '#5a3a7a',
      light: '#9b7dc4'
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2d3748', // Dark gray for good contrast
      secondary: '#718096', // Medium gray
    },
    error: {
      main: '#e53e3e',
      light: '#fed7d7',
      dark: '#c53030'
    },
    warning: {
      main: '#d69e2e',
      light: '#faf089',
      dark: '#b7791f'
    },
    success: {
      main: '#38a169',
      light: '#c6f6d5',
      dark: '#2f855a'
    },
    grey: {
      50: '#f6f8fa',
      100: '#eaeef2',
      200: '#d0d7de',
      300: '#afb8c1',
      400: '#8c959f',
      500: '#6e7781',
      600: '#656d76',
      700: '#24292f',
      800: '#1b1f23',
      900: '#0d1117'
    }
  },
  typography: {
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif',
    h1: {
      fontWeight: 600,
      color: '#24292f'
    },
    h2: {
      fontWeight: 600,
      color: '#24292f'
    },
    h3: {
      fontWeight: 600,
      color: '#24292f'
    },
    h4: {
      fontWeight: 600,
      color: '#24292f'
    },
    h5: {
      fontWeight: 600,
      color: '#24292f'
    },
    h6: {
      fontWeight: 600,
      color: '#24292f'
    },
    body1: {
      color: '#24292f'
    },
    body2: {
      color: '#656d76'
    }
  },
  shape: {
    borderRadius: 6, // GitHub's border radius
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 6,
          fontSize: '0.875rem'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid #d0d7de',
          boxShadow: 'none'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid #d0d7de',
          boxShadow: 'none'
        }
      }
    }
  }
});

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/repositories" element={
        <ProtectedRoute>
          <Layout>
            <Repositories />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/business-applications" element={
        <ProtectedRoute>
          <Layout>
            <BusinessApplications />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute>
          <Layout>
            <Analytics />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/enterprise-dashboard" element={
        <ProtectedRoute>
          <Layout>
            <EnterpriseDashboard />
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
