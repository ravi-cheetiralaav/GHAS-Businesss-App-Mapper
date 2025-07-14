import { createTheme } from '@mui/material/styles';

// Centralized color constants
export const COLORS = {
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    primaryHover: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
    success: 'linear-gradient(135deg, #90EE90 0%, #7BCF7B 100%)',
    warning: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
    error: 'linear-gradient(135deg, #8B0000 0%, #B22222 100%)',
    criticalHigh: 'linear-gradient(135deg, #FF4444 0%, #FF6666 100%)',
    medium: 'linear-gradient(135deg, #FFA500 0%, #FFB733 100%)',
    low: 'linear-gradient(135deg, #90EE90 0%, #A8F3A8 100%)',
    background: {
      light: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      subtle: 'linear-gradient(135deg, rgba(103, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%)',
    }
  },
  severity: {
    critical: {
      primary: '#8B0000',
      light: '#FF4444',
      gradient: 'linear-gradient(135deg, #8B0000 0%, #B22222 100%)',
      bg: 'rgba(139, 0, 0, 0.1)',
      border: '#8B0000'
    },
    high: {
      primary: '#FF4444',
      light: '#FF6666',
      gradient: 'linear-gradient(135deg, #FF4444 0%, #FF6666 100%)',
      bg: 'rgba(255, 68, 68, 0.1)',
      border: '#FF4444'
    },
    medium: {
      primary: '#FFA500',
      light: '#FFB733',
      gradient: 'linear-gradient(135deg, #FFA500 0%, #FFB733 100%)',
      bg: 'rgba(255, 165, 0, 0.1)',
      border: '#FFA500'
    },
    low: {
      primary: '#90EE90',
      light: '#A8F3A8',
      gradient: 'linear-gradient(135deg, #90EE90 0%, #A8F3A8 100%)',
      bg: 'rgba(144, 238, 144, 0.1)',
      border: '#90EE90'
    }
  },
  risk: {
    high: {
      gradient: 'linear-gradient(135deg, rgba(139, 0, 0, 0.1) 0%, rgba(178, 34, 34, 0.15) 100%)',
      border: '#8B0000',
      accent: '#B22222',
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
  },
  github: {
    bg: {
      primary: '#f6f8fa',
      secondary: '#ffffff',
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
    }
  }
} as const;

// Common spacing and sizing
export const SPACING = {
  borderRadius: {
    small: 1,
    medium: 2,
    large: 3,
    pill: '16px',
    circle: '50%'
  },
  elevation: {
    low: 4,
    medium: 8,
    high: 16
  }
} as const;

// Typography weights
export const TYPOGRAPHY = {
  weights: {
    normal: 400,
    medium: 500,
    semiBold: 600,
    bold: 700
  }
} as const;

// Extended theme with custom styles
export const customTheme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      dark: '#764ba2',
      light: '#8B9DC3'
    },
    secondary: {
      main: '#764ba2',
      dark: '#5a3a7a',
      light: '#9b7dc4'
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2d3748',
      secondary: '#718096',
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
    h1: { fontWeight: TYPOGRAPHY.weights.semiBold, color: '#24292f' },
    h2: { fontWeight: TYPOGRAPHY.weights.semiBold, color: '#24292f' },
    h3: { fontWeight: TYPOGRAPHY.weights.semiBold, color: '#24292f' },
    h4: { fontWeight: TYPOGRAPHY.weights.semiBold, color: '#24292f' },
    h5: { fontWeight: TYPOGRAPHY.weights.semiBold, color: '#24292f' },
    h6: { fontWeight: TYPOGRAPHY.weights.semiBold, color: '#24292f' },
    body1: { color: '#24292f' },
    body2: { color: '#656d76' }
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: TYPOGRAPHY.weights.medium,
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
