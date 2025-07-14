import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Card,
  CardContent,
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckIcon sx={{ color: theme.palette.success.main, fontSize: 20 }} />;
      case 'FAILED':
        return <ErrorIcon sx={{ color: theme.palette.error.main, fontSize: 20 }} />;
      case 'PROCESSING':
        return <ProcessingIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} className="rotating" />;
      case 'PENDING':
      default:
        return <PendingIcon sx={{ color: theme.palette.warning.main, fontSize: 20 }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return theme.palette.success.main;
      case 'FAILED':
        return theme.palette.error.main;
      case 'PROCESSING':
        return theme.palette.primary.main;
      case 'PENDING':
      default:
        return theme.palette.warning.main;
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
              backgroundColor: `${getStatusColor(task.status)}15`,
              color: getStatusColor(task.status),
              '& .MuiChip-icon': {
                fontSize: 16,
              }
            }}
          />
        </Box>
        {task.message && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {task.message}
          </Typography>
        )}
        {task.count !== undefined && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            Found: {task.count} alerts
          </Typography>
        )}
        {task.error && (
          <Typography variant="caption" color="error" sx={{ display: 'block' }}>
            Error: {task.error}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Fade in={true}>
      <Card 
        elevation={4}
        sx={{
          mb: 3,
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(103, 126, 234, 0.1)',
          boxShadow: '0 8px 32px rgba(103, 126, 234, 0.1)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Enterprise Scan Progress
            </Typography>
            <Chip
              icon={getStatusIcon(jobProgress.status)}
              label={jobProgress.status}
              sx={{
                fontSize: '0.85rem',
                fontWeight: 600,
                backgroundColor: `${getStatusColor(jobProgress.status)}15`,
                color: getStatusColor(jobProgress.status),
              }}
            />
          </Box>

          {/* Current Task */}
          <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
            {jobProgress.currentTask || 'Processing...'}
          </Typography>

          {/* Progress Bar */}
          <Box sx={{ mb: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography variant="body2" color="text.secondary">
                Overall Progress
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {jobProgress.progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={jobProgress.progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(103, 126, 234, 0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                },
              }}
            />
          </Box>

          {/* Task Details */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  background: 'rgba(103, 126, 234, 0.03)',
                  border: '1px solid rgba(103, 126, 234, 0.1)',
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
                elevation={1} 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  background: 'rgba(103, 126, 234, 0.03)',
                  border: '1px solid rgba(103, 126, 234, 0.1)',
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
                elevation={1} 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  background: 'rgba(103, 126, 234, 0.03)',
                  border: '1px solid rgba(103, 126, 234, 0.1)',
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
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                border: '1px solid rgba(244, 67, 54, 0.2)',
              }}
            >
              <Typography variant="body2" color="error" sx={{ fontWeight: 600 }}>
                Error: {jobProgress.errorMessage}
              </Typography>
            </Box>
          )}

          {/* Timing Information */}
          {(jobProgress.createdAt || jobProgress.estimatedCompletion) && (
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(103, 126, 234, 0.1)' }}>
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
        </CardContent>
      </Card>
    </Fade>
  );
};

export default JobProgressDisplay;
