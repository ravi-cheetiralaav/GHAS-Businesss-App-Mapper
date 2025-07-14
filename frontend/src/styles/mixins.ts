import { SxProps, Theme } from '@mui/material/styles';
import { COLORS, SPACING, TYPOGRAPHY } from './theme';

// Reusable style mixins
export const styleMixins = {
  // Common gradients
  primaryGradient: {
    background: COLORS.gradients.primary,
  },
  
  primaryGradientHover: {
    background: COLORS.gradients.primaryHover,
  },

  // Card styles
  elevatedCard: (elevation: number = SPACING.elevation.medium): SxProps<Theme> => ({
    elevation,
    borderRadius: SPACING.borderRadius.large,
    background: COLORS.gradients.background.light,
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
  }),

  // Header cards
  headerCard: (): SxProps<Theme> => ({
    background: COLORS.gradients.primary,
    borderRadius: SPACING.borderRadius.large,
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
  }),

  // Severity-based styles
  severityChip: (severity: 'critical' | 'high' | 'medium' | 'low'): SxProps<Theme> => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 32,
    padding: '4px 12px',
    height: 32,
    borderRadius: SPACING.borderRadius.pill,
    background: COLORS.severity[severity].gradient,
    color: 'white',
    fontWeight: TYPOGRAPHY.weights.bold,
    fontSize: '0.85rem',
    boxShadow: `0 2px 8px ${COLORS.severity[severity].primary}40`,
    '&:hover': {
      transform: 'scale(1.05)',
      transition: 'all 0.2s ease',
    }
  }),

  // Risk score styles
  riskScoreChip: (riskScore: number): SxProps<Theme> => {
    const riskLevel = riskScore > 50 ? 'high' : riskScore > 25 ? 'medium' : 'low';
    const colors = COLORS.risk[riskLevel];
    
    return {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 32,
      padding: '4px 12px',
      height: 32,
      borderRadius: SPACING.borderRadius.pill,
      background: colors.gradient,
      color: 'white',
      fontWeight: TYPOGRAPHY.weights.bold,
      fontSize: '0.85rem',
      boxShadow: `0 2px 8px ${colors.border}40`,
    };
  },

  // Hover effects
  hoverEffect: (translateY: number = -4): SxProps<Theme> => ({
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: `translateY(${translateY}px)`,
      boxShadow: '0 12px 40px rgba(102, 126, 234, 0.2)',
    },
  }),

  // Button gradients
  primaryButton: (): SxProps<Theme> => ({
    background: COLORS.gradients.primary,
    borderRadius: SPACING.borderRadius.medium,
    fontWeight: TYPOGRAPHY.weights.bold,
    py: 1.5,
    '&:hover': {
      background: COLORS.gradients.primaryHover,
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
    },
    '&:disabled': {
      background: 'rgba(102, 126, 234, 0.3)',
      color: 'rgba(255, 255, 255, 0.5)',
    },
  }),

  // Gradient text
  gradientText: (): SxProps<Theme> => ({
    background: COLORS.gradients.primary,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }),

  // Center alignment
  centerContent: (): SxProps<Theme> => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),

  // Flex layouts
  flexBetween: (): SxProps<Theme> => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }),

  flexColumn: (): SxProps<Theme> => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }),

  // Table header styles
  tableHeader: (): SxProps<Theme> => ({
    background: COLORS.gradients.primary,
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
  }),

  tableHeaderCell: (): SxProps<Theme> => ({
    color: 'white',
    fontWeight: TYPOGRAPHY.weights.bold,
  }),

  // Stats box
  statsBox: (severity: 'critical' | 'high' | 'medium' | 'low'): SxProps<Theme> => ({
    p: 2,
    textAlign: 'center',
    borderRadius: SPACING.borderRadius.medium,
    background: COLORS.severity[severity].gradient,
    color: 'white',
    boxShadow: `0 4px 12px ${COLORS.severity[severity].primary}40`,
  }),

  // Dialog styles
  dialogPaper: (): SxProps<Theme> => ({
    borderRadius: SPACING.borderRadius.large,
    background: COLORS.gradients.background.light,
    overflow: 'hidden',
  }),

  // Avatar styles
  primaryAvatar: (): SxProps<Theme> => ({
    background: COLORS.gradients.primary,
    width: 48,
    height: 48,
  }),

  // Paper with subtle background
  subtlePaper: (): SxProps<Theme> => ({
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: SPACING.borderRadius.large,
    border: '1px solid rgba(102, 126, 234, 0.2)',
  }),

  // Loading state
  loadingOverlay: (): SxProps<Theme> => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(2px)',
    zIndex: 1,
  }),

  // Form field styles
  formField: (): SxProps<Theme> => ({
    '& .MuiOutlinedInput-root': {
      borderRadius: SPACING.borderRadius.medium,
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 2px 10px rgba(103, 126, 234, 0.15)',
      },
      '&.Mui-focused': {
        boxShadow: '0 4px 20px rgba(103, 126, 234, 0.25)',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#667eea',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#667eea',
        borderWidth: 2,
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'primary.main',
    }
  }),

  // Alert count chip
  alertCountChip: (count: number): SxProps<Theme> => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 32,
    padding: '4px 12px',
    height: 32,
    borderRadius: SPACING.borderRadius.pill,
    background: count > 0 ? COLORS.gradients.warning : COLORS.gradients.success,
    color: 'white',
    fontWeight: TYPOGRAPHY.weights.bold,
    fontSize: '0.85rem',
    boxShadow: count > 0 
      ? '0 2px 8px rgba(255, 165, 0, 0.3)' 
      : '0 2px 8px rgba(144, 238, 144, 0.3)',
  }),

  // Vulnerability count chip with severity-based coloring
  vulnerabilityCountChip: (total: number, critical: number, high: number): SxProps<Theme> => {
    let background: string;
    let boxShadow: string;
    
    if (total === 0) {
      background = COLORS.gradients.success;
      boxShadow = '0 2px 8px rgba(144, 238, 144, 0.3)';
    } else if ((critical + high) > 0) {
      background = COLORS.gradients.error;
      boxShadow = '0 2px 8px rgba(139, 0, 0, 0.4)';
    } else {
      background = COLORS.gradients.warning;
      boxShadow = '0 2px 8px rgba(255, 165, 0, 0.3)';
    }

    return {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 32,
      padding: '4px 12px',
      height: 32,
      borderRadius: SPACING.borderRadius.pill,
      background,
      color: 'white',
      fontWeight: TYPOGRAPHY.weights.bold,
      fontSize: '0.85rem',
      boxShadow,
    };
  },

  // Repository count chip
  repositoryCountChip: (count: number): SxProps<Theme> => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 32,
    padding: '4px 12px',
    height: 32,
    borderRadius: SPACING.borderRadius.pill,
    background: COLORS.gradients.primary,
    color: 'white',
    fontWeight: TYPOGRAPHY.weights.bold,
    fontSize: '0.85rem',
    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
  }),
} as const;

// Utility functions for common calculations
export const styleUtils = {
  getSeverityLevel: (score: number): 'critical' | 'high' | 'medium' | 'low' => {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  },

  getRiskLevel: (score: number): 'high' | 'medium' | 'low' => {
    if (score > 50) return 'high';
    if (score > 25) return 'medium';
    return 'low';
  },

  getSeverityColor: (severity: 'critical' | 'high' | 'medium' | 'low') => COLORS.severity[severity],
  
  getRiskColor: (risk: 'high' | 'medium' | 'low') => COLORS.risk[risk],

  // Common responsive values
  responsive: {
    xs: { xs: 12 },
    sm: { xs: 12, sm: 6 },
    md: { xs: 12, md: 4 },
    lg: { xs: 12, sm: 6, md: 4, lg: 3 },
  },
};
