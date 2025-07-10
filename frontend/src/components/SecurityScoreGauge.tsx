import React from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, CircularProgressProps } from '@mui/material';

interface SecurityScoreGaugeProps {
  score: number;
}

function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} size={120} thickness={4} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h4" component="div" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

const SecurityScoreGauge: React.FC<SecurityScoreGaugeProps> = ({ score }) => {
  const getColor = (value: number) => {
    if (value < 40) return 'error';
    if (value < 75) return 'warning';
    return 'success';
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom align="center">
          Overall Security Score
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150 }}>
          <CircularProgressWithLabel value={score} color={getColor(score)} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default SecurityScoreGauge;
