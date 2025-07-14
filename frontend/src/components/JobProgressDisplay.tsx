import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Card,
  Chip,
  Grid,
  Paper,
  useTheme,
  Fade,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Schedule as PendingIcon,
  Sync as ProcessingIcon,
} from '@mui/icons-material';
import { JobProgress, TaskProgress } from '../hooks/useEnterpriseAsyncJob';

interface JobProgressDisplayProps {
  jobProgress: JobProgress;
}

const JobProgressDisplay: React.FC<JobProgressDisplayProps> = ({ jobProgress }) => {
  const theme = useTheme();
  
  // Purple theme color palette
  const colors = {
    bg: {
      primary: theme.palette.background.default,
      secondary: theme.palette.background.paper,
    },
    border: {
      default: theme.palette.grey[300],
    },
    fg: {
      default: theme.palette.text.primary,
      muted: theme.palette.text.secondary,
    },
    accent: {
      fg: theme.palette.primary.main,
    },
    success: {
      fg: theme.palette.success.main,
      bg: theme.palette.success.light,
    },
    danger: {
      fg: theme.palette.error.main,
      bg: theme.palette.error.light,
    },
    warning: {
      fg: theme.palette.warning.main,
      bg: theme.palette.warning.light,
    },
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckIcon sx={{ color: colors.success.fg, fontSize: 20 }} />;
      case 'FAILED':
        return <ErrorIcon sx={{ color: colors.danger.fg, fontSize: 20 }} />;
      case 'PROCESSING':
        return <ProcessingIcon sx={{ color: colors.accent.fg, fontSize: 20 }} className="rotating" />;
      case 'PENDING':
      default:
        return <PendingIcon sx={{ color: colors.warning.fg, fontSize: 20 }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return colors.success.fg;
      case 'FAILED':
        return colors.danger.fg;
      case 'PROCESSING':
        return colors.accent.fg;
      case 'PENDING':
      default:
        return colors.warning.fg;
    }
  };

  const renderTaskProgress = (task: TaskProgress | undefined, label: string) => {
    if (!task) return null;

    return (
      <Box sx={{ mb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {label}
          </Typography>
          <Chip
            icon={getStatusIcon(task.status)}
            label={task.status}
            size="small"
            sx={{
              fontSize: '0.75rem',
              height: 24,
              bgcolor: `${getStatusColor(task.status)}15`,
              color: getStatusColor(task.status),
              border: `1px solid ${getStatusColor(task.status)}40`,
            }}
          />
        </Box>
        {task.message && (
          <Typography variant="caption" sx={{ color: colors.fg.muted, mt: 0.5 }}>
            {task.message}
          </Typography>
        )}
        {task.count !== undefined && (
          <Typography variant="body2" sx={{ color: colors.fg.default, mt: 0.5 }}>
            Found: {task.count} items
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Fade in={true}>
      <Paper 
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: '8px',
          border: `1px solid ${colors.border.default}`,
          bgcolor: colors.bg.secondary,
          boxShadow: '0 1px 3px rgba(27,31,36,0.12), 0 8px 24px rgba(27,31,36,0.12)',
        }}
      >
        <Box sx={{ 
          bgcolor: colors.bg.primary, 
          p: 3, 
          borderBottom: `1px solid ${colors.border.default}`,
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px'
        }}>
          {/* Header */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6" sx={{ 
              fontWeight: 600, 
              color: colors.fg.default,
              fontSize: '1.125rem'
            }}>
              Enterprise Scan Progress
            </Typography>
            <Chip
              icon={getStatusIcon(jobProgress.status)}
              label={jobProgress.status}
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                bgcolor: `${getStatusColor(jobProgress.status)}15`,
                color: getStatusColor(jobProgress.status),
                border: `1px solid ${getStatusColor(jobProgress.status)}40`,
              }}
            />
          </Box>

          {/* Current Task */}
          <Typography variant="body1" sx={{ 
            mb: 2, 
            fontWeight: 500,
            color: colors.fg.default
          }}>
            {jobProgress.currentTask || 'Processing...'}
          </Typography>

          {/* Progress Bar */}
          <Box sx={{ mb: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography variant="body2" sx={{ color: colors.fg.muted }}>
                Overall Progress
              </Typography>
              <Typography variant="body2" sx={{ 
                fontWeight: 600,
                color: colors.fg.default
              }}>
                {jobProgress.progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={jobProgress.progress}
              sx={{
                height: 8,
                borderRadius: '4px',
                bgcolor: colors.bg.primary,
                '& .MuiLinearProgress-bar': {
                  bgcolor: colors.accent.fg,
                  borderRadius: '4px'
                }
              }}
            />
          </Box>
        </Box>

        {/* Task Details */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: '6px',
                  border: `1px solid ${colors.border.default}`,
                  bgcolor: colors.bg.primary,
                  textAlign: 'center'
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                  Code Scanning
                </Typography>
                {renderTaskProgress(jobProgress.codeScanningProgress, 'Security Analysis')}
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 2, 
                  borderRadius: '6px',
                  border: `1px solid ${colors.border.default}`,
                  bgcolor: colors.bg.primary,
                  textAlign: 'center'
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                  Secret Scanning
                </Typography>
                {renderTaskProgress(jobProgress.secretScanningProgress, 'Secret Detection')}
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 2, 
                  borderRadius: '6px',
                  border: `1px solid ${colors.border.default}`,
                  bgcolor: colors.bg.primary,
                  textAlign: 'center'
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                  Dependabot
                </Typography>
                {renderTaskProgress(jobProgress.dependabotProgress, 'Dependency Analysis')}
              </Paper>
            </Grid>
          </Grid>

          {/* Error Message */}
          {jobProgress.errorMessage && (
            <Box 
              sx={{ 
                mt: 2, 
                p: 2, 
                borderRadius: 2,
                backgroundColor: colors.danger.bg,
                border: `1px solid ${colors.danger.fg}40`,
              }}
            >
              <Typography variant="body2" color="error" sx={{ fontWeight: 600 }}>
                Error: {jobProgress.errorMessage}
              </Typography>
            </Box>
          )}

          {/* Timing Information */}
          {(jobProgress.createdAt || jobProgress.estimatedCompletion) && (
            <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${colors.border.default}` }}>
              <Grid container spacing={2}>
                {jobProgress.createdAt && (
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Started: {new Date(jobProgress.createdAt).toLocaleTimeString()}
                    </Typography>
                  </Grid>
                )}
                {jobProgress.estimatedCompletion && jobProgress.status === 'PROCESSING' && (
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Est. completion: {new Date(jobProgress.estimatedCompletion).toLocaleTimeString()}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </Box>
      </Paper>
    </Fade>
  );
};

export default JobProgressDisplay;