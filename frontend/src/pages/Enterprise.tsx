import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  Paper,
  Fade
} from '@mui/material';
import { 
  Business as EnterpriseIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { getEnterpriseVulnerabilities } from '../services/api';
import { EnterpriseVulnerability } from '../types';
import EnterpriseVulnerabilityTable from '../components/EnterpriseVulnerabilityTable';

const Enterprise: React.FC = () => {
    const [vulnerabilities, setVulnerabilities] = useState<EnterpriseVulnerability[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVulnerabilities = async () => {
            try {
                const data = await getEnterpriseVulnerabilities('YOUR_ENTERPRISE_NAME'); // Replace with your enterprise name
                setVulnerabilities(data);
            } catch (err) {
                setError('Failed to fetch enterprise vulnerabilities');
            } finally {
                setLoading(false);
            }
        };

        fetchVulnerabilities();
    }, []);

    if (loading) {
        return (
            <Box 
                display="flex" 
                flexDirection="column"
                justifyContent="center" 
                alignItems="center" 
                minHeight="60vh"
                sx={{
                    background: 'linear-gradient(135deg, rgba(103, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                    borderRadius: 3,
                    mx: 2,
                    my: 3,
                }}
            >
                <CircularProgress 
                    size={60}
                    sx={{
                        color: 'primary.main',
                        mb: 2,
                    }}
                />
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Loading enterprise vulnerabilities...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Fade in timeout={300}>
                <Alert 
                    severity="error"
                    sx={{
                        m: 3,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(229, 57, 53, 0.1) 100%)',
                        border: '1px solid rgba(244, 67, 54, 0.2)',
                        '& .MuiAlert-icon': {
                            color: 'error.main',
                        }
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        Failed to load enterprise vulnerabilities
                    </Typography>
                    <Typography variant="body2">
                        {error}
                    </Typography>
                </Alert>
            </Fade>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header Section */}
            <Fade in timeout={600}>
                <Paper 
                    elevation={0}
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: 4,
                        p: 4,
                        mb: 4,
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '300px',
                            height: '300px',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                            borderRadius: '50%',
                            transform: 'translate(50%, -50%)',
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ 
                            p: 1.5, 
                            borderRadius: '50%', 
                            background: 'rgba(255, 255, 255, 0.2)',
                            mr: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <EnterpriseIcon sx={{ fontSize: 32, color: 'white' }} />
                        </Box>
                        <Box>
                            <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5, color: 'white' }}>
                                Enterprise Risk
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400, color: 'white' }}>
                                Comprehensive vulnerability assessment across your enterprise
                            </Typography>
                        </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <SecurityIcon sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body1" sx={{ fontWeight: 500, color: 'white' }}>
                            Enterprise-wide vulnerability monitoring and insights
                        </Typography>
                    </Box>
                </Paper>
            </Fade>

            {/* Enterprise Vulnerability Table */}
            <Fade in timeout={800} style={{ transitionDelay: '200ms' }}>
                <Paper sx={{
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(103, 126, 234, 0.1)',
                    boxShadow: '0 8px 32px rgba(103, 126, 234, 0.1)',
                    p: 3,
                }}>
                    <EnterpriseVulnerabilityTable vulnerabilities={vulnerabilities} />
                </Paper>
            </Fade>
        </Box>
    );
};

export default Enterprise;
