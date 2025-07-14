import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Chip,
  Grid,
  Paper,
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
  // GitHub color palette
  const github = {
    bg: {
      primary: '#f6f8fa',
      secondary: '#ffffff',
    },
    border: {
      default: '#d0d7de',
    },
    fg: {
      default: '#24292f',
      muted: '#656d76',
    },
    accent: {
      fg: '#0969da',
    },
    success: {
      fg: '#1a7f37',
      bg: '#dafbe1',
    },
    danger: {
      fg: '#cf222e',
      bg: '#ffebe9',
    },
    warning: {
      fg: '#9a6700',
      bg: '#fff8c5',
    },
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckIcon sx={{ color: github.success.fg, fontSize: 20 }} />;
      case 'FAILED':
        return <ErrorIcon sx={{ color: github.danger.fg, fontSize: 20 }} />;
      case 'PROCESSING':
        return <ProcessingIcon sx={{ color: github.accent.fg, fontSize: 20 }} className="rotating" />;
      case 'PENDING':
      default:
        return <PendingIcon sx={{ color: github.warning.fg, fontSize: 20 }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return github.success.fg;
      case 'FAILED':
        return github.danger.fg;
      case 'PROCESSING':
        return github.accent.fg;
      case 'PENDING':
      default:
        return github.warning.fg;
    }
  };

  const renderTaskItem = (task: TaskProgress, taskName: string) => (
    <Box key={taskName} sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 500, color: github.fg.default }}>
          {taskName}
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
        <Typography variant="caption" sx={{ display: 'block', color: github.fg.muted }}>
          {task.message}
        </Typography>
      )}
      {task.count !== undefined && (
        <Typography variant="caption" sx={{ display: 'block', color: github.fg.muted }}>
          Found: {task.count} alerts
        </Typography>
      )}
      {task.error && (
        <Typography variant="caption" sx={{ display: 'block', color: github.danger.fg }}>
          Error: {task.error}
        </Typography>
      )}
    </Box>
  );

  return (
    <Fade in={true}>
      <Paper 
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: '8px',
          border: `1px solid ${github.border.default}`,
          bgcolor: github.bg.secondary,
          boxShadow: '0 1px 3px rgba(27,31,36,0.12), 0 8px 24px rgba(27,31,36,0.12)',
        }}
      >
        {/* Header */}
        <Box sx={{ 
          bgcolor: github.bg.primary, 
          p: 3, 
          borderBottom: `1px solid ${github.border.default}`,
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px'
        }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6" sx={{ 
              fontWeight: 600, 
              color: github.fg.default,
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
            color: github.fg.default
          }}>
            {jobProgress.currentTask || 'Processing...'}
          </Typography>

          {/* Progress Bar */}
          <Box sx={{ mb: 0 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography variant="body2" sx={{ color: github.fg.muted }}>
                Overall Progress
              </Typography>
              <Typography variant="body2" sx={{ 
                fontWeight: 600,
                color: github.fg.default
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
                bgcolor: github.bg.primary,
                '& .MuiLinearProgress-bar': {
                  bgcolor: github.accent.fg,
                  borderRadius: '4px'
                }
              }}
            />
          </Box>
        </Box>

        {/* Task Details */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Completed Tasks */}
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: '6px',
                  border: `1px solid ${github.border.default}`,
                  bgcolor: github.bg.primary,
                  textAlign: 'center'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, color: github.success.fg, mb: 1 }}>
                  {[
                    jobProgress.codeScanningProgress?.status === 'COMPLETED' ? 1 : 0,
                    jobProgress.secretScanningProgress?.status === 'COMPLETED' ? 1 : 0,
                    jobProgress.dependabotProgress?.status === 'COMPLETED' ? 1 : 0
                  ].reduce((a, b) => a + b, 0)}
                </Typography>
                <Typography variant="body2" sx={{ color: github.fg.muted }}>
                  Completed
                </Typography>
              </Paper>
            </Grid>

            {/* In Progress Tasks */}
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: '6px',
                  border: `1px solid ${github.border.default}`,
                  bgcolor: github.bg.primary,
                  textAlign: 'center'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, color: github.accent.fg, mb: 1 }}>
                  {[
                    jobProgress.codeScanningProgress?.status === 'PROCESSING' ? 1 : 0,
                    jobProgress.secretScanningProgress?.status === 'PROCESSING' ? 1 : 0,
                    jobProgress.dependabotProgress?.status === 'PROCESSING' ? 1 : 0
                  ].reduce((a, b) => a + b, 0)}
                </Typography>
                <Typography variant="body2" sx={{ color: github.fg.muted }}>
                  In Progress
                </Typography>
              </Paper>
            </Grid>

            {/* Failed Tasks */}
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: '6px',
                  border: `1px solid ${github.border.default}`,
                  bgcolor: github.bg.primary,
                  textAlign: 'center'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, color: github.danger.fg, mb: 1 }}>
                  {[
                    jobProgress.codeScanningProgress?.status === 'FAILED' ? 1 : 0,
                    jobProgress.secretScanningProgress?.status === 'FAILED' ? 1 : 0,
                    jobProgress.dependabotProgress?.status === 'FAILED' ? 1 : 0
                  ].reduce((a, b) => a + b, 0)}
                </Typography>
                <Typography variant="body2" sx={{ color: github.fg.muted }}>
                  Failed
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Task List */}
          {(jobProgress.codeScanningProgress || jobProgress.secretScanningProgress || jobProgress.dependabotProgress) && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                color: github.fg.default, 
                mb: 2,
                fontSize: '1rem'
              }}>
                Task Details
              </Typography>
              <Box sx={{ 
                maxHeight: '300px', 
                overflowY: 'auto',
                border: `1px solid ${github.border.default}`,
                borderRadius: '6px',
                p: 2,
                bgcolor: github.bg.primary
              }}>
                {jobProgress.codeScanningProgress && renderTaskItem(jobProgress.codeScanningProgress, 'Code Scanning')}
                {jobProgress.secretScanningProgress && renderTaskItem(jobProgress.secretScanningProgress, 'Secret Scanning')}
                {jobProgress.dependabotProgress && renderTaskItem(jobProgress.dependabotProgress, 'Dependabot')}
              </Box>
            </Box>
          )}

          {/* Error Display */}
          {jobProgress.errorMessage && (
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              borderRadius: '6px',
              bgcolor: github.danger.bg,
              border: `1px solid ${github.danger.fg}`,
            }}>
              <Typography variant="body2" sx={{ color: github.danger.fg, fontWeight: 600 }}>
                Error: {jobProgress.errorMessage}
              </Typography>
            </Box>
          )}

          {/* Timing Information */}
          {(jobProgress.createdAt || jobProgress.estimatedCompletion) && (
            <Box sx={{ 
              mt: 3, 
              pt: 2, 
              borderTop: `1px solid ${github.border.default}`
            }}>
              <Grid container spacing={2}>
                {jobProgress.createdAt && (
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: github.fg.muted }}>
                      Started: {new Date(jobProgress.createdAt).toLocaleTimeString()}
                    </Typography>
                  </Grid>
                )}
                {jobProgress.estimatedCompletion && jobProgress.status === 'PROCESSING' && (
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: github.fg.muted }}>
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
