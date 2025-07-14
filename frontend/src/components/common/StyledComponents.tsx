import React from 'react';
import { Box, Typography, Chip, SxProps, Theme } from '@mui/material';
import { styleMixins, styleUtils } from '../../styles/mixins';

interface SeverityChipProps {
  severity: 'critical' | 'high' | 'medium' | 'low';
  count: number;
  label?: string;
  size?: 'small' | 'medium';
  sx?: SxProps<Theme>;
}

export const SeverityChip: React.FC<SeverityChipProps> = ({
  severity,
  count,
  label,
  size = 'medium',
  sx
}) => {
  const displayLabel = label || severity.charAt(0).toUpperCase() + severity.slice(1);
  
  return (
    <Box sx={sx ? [styleMixins.severityChip(severity), sx] as SxProps<Theme> : styleMixins.severityChip(severity)}>
      <Typography variant={size === 'small' ? 'caption' : 'body2'} sx={{ fontWeight: 'bold' }}>
        {count} {displayLabel}
      </Typography>
    </Box>
  );
};

interface RiskScoreChipProps {
  score: number;
  label?: string;
  sx?: SxProps<Theme>;
}

export const RiskScoreChip: React.FC<RiskScoreChipProps> = ({
  score,
  label,
  sx
}) => {
  return (
    <Chip
      label={label || score.toFixed(1)}
      size="small"
      sx={sx ? [styleMixins.riskScoreChip(score), sx] as SxProps<Theme> : styleMixins.riskScoreChip(score)}
    />
  );
};

interface GradientTextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2';
  sx?: SxProps<Theme>;
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  variant = 'h6',
  sx
}) => {
  return (
    <Typography
      variant={variant}
      sx={[
        styleMixins.gradientText(),
        { fontWeight: 'bold' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Typography>
  );
};

interface StatsBoxProps {
  severity: 'critical' | 'high' | 'medium' | 'low';
  count: number;
  label: string;
  sx?: SxProps<Theme>;
}

export const StatsBox: React.FC<StatsBoxProps> = ({
  severity,
  count,
  label,
  sx
}) => {
  return (
    <Box sx={sx ? [styleMixins.statsBox(severity), sx] as SxProps<Theme> : styleMixins.statsBox(severity)}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
        {count}
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.9 }}>
        {label}
      </Typography>
    </Box>
  );
};

interface AlertCountChipProps {
  count: number;
  sx?: SxProps<Theme>;
}

export const AlertCountChip: React.FC<AlertCountChipProps> = ({
  count,
  sx
}) => {
  return (
    <Box sx={sx ? [styleMixins.alertCountChip(count), sx] as SxProps<Theme> : styleMixins.alertCountChip(count)}>
      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
        {count}
      </Typography>
    </Box>
  );
};

interface VulnerabilityCountChipProps {
  total: number;
  critical: number;
  high: number;
  sx?: SxProps<Theme>;
}

export const VulnerabilityCountChip: React.FC<VulnerabilityCountChipProps> = ({
  total,
  critical,
  high,
  sx
}) => {
  return (
    <Box sx={sx ? [styleMixins.vulnerabilityCountChip(total, critical, high), sx] as SxProps<Theme> : styleMixins.vulnerabilityCountChip(total, critical, high)}>
      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
        {total}
      </Typography>
    </Box>
  );
};

interface RepositoryCountChipProps {
  count: number;
  sx?: SxProps<Theme>;
}

export const RepositoryCountChip: React.FC<RepositoryCountChipProps> = ({
  count,
  sx
}) => {
  return (
    <Box sx={sx ? [styleMixins.repositoryCountChip(count), sx] as SxProps<Theme> : styleMixins.repositoryCountChip(count)}>
      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
        {count}
      </Typography>
    </Box>
  );
};

interface VulnerabilityCountWithWarningProps {
  total: number;
  critical: number;
  high: number;
  sx?: SxProps<Theme>;
}

export const VulnerabilityCountWithWarning: React.FC<VulnerabilityCountWithWarningProps> = ({
  total,
  critical,
  high,
  sx
}) => {
  const criticalHighCount = critical + high;
  
  const baseSx = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 0.5
  };
  
  return (
    <Box sx={sx ? [baseSx, sx] as SxProps<Theme> : baseSx}>
      <VulnerabilityCountChip total={total} critical={critical} high={high} />
      {criticalHighCount > 0 && (
        <Typography variant="caption" sx={{ 
          color: '#8B0000', 
          fontWeight: 500,
          fontSize: '0.7rem',
        }}>
          {criticalHighCount} critical/high
        </Typography>
      )}
    </Box>
  );
};
