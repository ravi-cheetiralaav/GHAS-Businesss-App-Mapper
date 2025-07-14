import React from 'react';
import { useQuery } from 'react-query';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Fade,
  Link,
  Tooltip,
} from '@mui/material';
import {
  Public as PublicIcon,
  Lock as PrivateIcon,
  Business as InternalIcon,
  Storage as RepositoryIcon,
  Star as StarIcon,
  CallSplit as ForkIcon,
  Code as CodeIcon,
  OpenInNew as ExternalIcon,
} from '@mui/icons-material';
import { githubApi, GitHubRepository } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const getVisibilityConfig = (repo: GitHubRepository) => {
  // Use visibility field if available, otherwise fall back to isPrivate
  const visibility = repo.visibility || (repo.isPrivate ? 'private' : 'public');
  
  switch (visibility.toLowerCase()) {
    case 'public':
      return {
        label: 'Public',
        icon: <PublicIcon fontSize="small" />,
        color: 'success' as const,
      };
    case 'private':
      return {
        label: 'Private',
        icon: <PrivateIcon fontSize="small" />,
        color: 'error' as const,
      };
    case 'internal':
      return {
        label: 'Internal',
        icon: <InternalIcon fontSize="small" />,
        color: 'warning' as const,
      };
    default:
      return {
        label: repo.isPrivate ? 'Private' : 'Public',
        icon: repo.isPrivate ? <PrivateIcon fontSize="small" /> : <PublicIcon fontSize="small" />,
        color: repo.isPrivate ? 'error' as const : 'success' as const,
      };
  }
};

const Repositories: React.FC = () => {
  const { organization } = useAuth();

  // Fetch all repositories with languages
  const { data: repositories, isLoading, error } = useQuery(
    ['repositories', organization],
    async () => {
      console.log('Fetching repositories for organization:', organization);
      try {
        // Try the enriched endpoint first - now it fetches all repositories with language data
        const result = await githubApi.getOrganizationRepositoriesWithLanguages(organization!);
        console.log('Successfully fetched repositories with languages:', result.length, 'repositories');
        return result;
      } catch (error) {
        console.warn('Failed to fetch repositories with languages, falling back to basic endpoint:', error);
        // Fallback to the basic endpoint
        const fallbackResult = await githubApi.getOrganizationRepositories(organization!);
        console.log('Successfully fetched basic repositories:', fallbackResult.length, 'repositories');
        return fallbackResult;
      }
    },
    {
      enabled: !!organization,
      retry: 2,
      retryDelay: 1000,
    }
  );

  if (isLoading) {
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
          Loading repositories with language data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    console.error('Repository fetch error:', error);
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
            Failed to load repositories
          </Typography>
          <Typography variant="body2">
            {error instanceof Error ? error.message : 'Unknown error'}. 
            Please check your GitHub token permissions and ensure the backend is running.
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
              <RepositoryIcon sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                Repositories
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                Organization: {organization}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <CodeIcon sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {repositories?.length || 0} repositories with language analysis
            </Typography>
          </Box>
        </Paper>
      </Fade>

      {/* Repositories Table */}
      <Fade in timeout={800} style={{ transitionDelay: '200ms' }}>
        <TableContainer 
          component={Paper} 
          sx={{ 
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(103, 126, 234, 0.1)',
            boxShadow: '0 8px 32px rgba(103, 126, 234, 0.1)',
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{
                background: 'linear-gradient(135deg, rgba(103, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              }}>
                <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <RepositoryIcon sx={{ mr: 1, fontSize: 20 }} />
                    Name
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CodeIcon sx={{ mr: 1, fontSize: 20 }} />
                    Language
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <StarIcon sx={{ mr: 1, fontSize: 20 }} />
                    Stars
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ForkIcon sx={{ mr: 1, fontSize: 20 }} />
                    Forks
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {repositories?.map((repo: GitHubRepository, index: number) => (
                <Fade in timeout={300} style={{ transitionDelay: `${300 + index * 50}ms` }} key={repo.id}>
                  <TableRow 
                    sx={{
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(135deg, rgba(103, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                        transform: 'translateX(4px)',
                      }
                    }}
                  >
                    <TableCell>
                      <Tooltip title={`Click to open ${repo.name} on GitHub`} arrow>
                        <Link
                          href={repo.htmlUrl || (repo.fullName ? `https://github.com/${repo.fullName}` : `https://github.com/${organization}/${repo.name}`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            textDecoration: 'none',
                            color: 'primary.main',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            borderRadius: 1,
                            padding: '4px 8px',
                            '&:hover': {
                              color: 'primary.dark',
                              backgroundColor: 'rgba(103, 126, 234, 0.1)',
                              transform: 'translateX(2px)',
                              textDecoration: 'underline',
                            }
                          }}
                          onClick={(e) => {
                            console.log('Repository click:', {
                              name: repo.name,
                              htmlUrl: repo.htmlUrl,
                              fullName: repo.fullName,
                              fullRepo: repo
                            });
                            
                            e.preventDefault();
                            
                            // Try multiple URL construction strategies
                            let targetUrl = repo.htmlUrl;
                            
                            if (!targetUrl && repo.fullName) {
                              // Fallback: construct URL from fullName
                              targetUrl = `https://github.com/${repo.fullName}`;
                              console.log('Constructed URL from fullName:', targetUrl);
                            } else if (!targetUrl && repo.name) {
                              // Get organization from auth context and construct URL
                              targetUrl = `https://github.com/${organization}/${repo.name}`;
                              console.log('Constructed URL from org and name:', targetUrl);
                            }
                            
                            if (targetUrl) {
                              console.log('Opening URL:', targetUrl);
                              window.open(targetUrl, '_blank', 'noopener,noreferrer');
                            } else {
                              console.error('Could not determine repository URL for:', repo);
                              alert('Unable to open repository. URL not found.');
                            }
                          }}
                        >
                          {repo.name}
                          <ExternalIcon sx={{ ml: 1, fontSize: 16, opacity: 0.7 }} />
                        </Link>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {repo.description || 'No description'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 200 }}>
                        {repo.languages && Object.keys(repo.languages).length > 0 ? (
                          Object.entries(repo.languages)
                            .sort(([,a], [,b]) => (b as number) - (a as number)) // Sort by bytes of code (descending)
                            .slice(0, 5) // Show top 5 languages
                            .map(([language, bytes]) => (
                              <Chip 
                                key={language}
                                label={language} 
                                size="small" 
                                sx={{
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  color: 'white',
                                  fontWeight: 600,
                                  '&:hover': {
                                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                  }
                                }}
                                title={`${(bytes as number).toLocaleString()} bytes`}
                              />
                            ))
                        ) : repo.language ? (
                          <Chip 
                            label={repo.language} 
                            size="small" 
                            sx={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                            No language detected
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StarIcon sx={{ mr: 0.5, fontSize: 16, color: '#ffa726' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {repo.stargazersCount}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ForkIcon sx={{ mr: 0.5, fontSize: 16, color: 'primary.main' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {repo.forksCount}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const config = getVisibilityConfig(repo);
                        return (
                          <Chip
                            icon={config.icon}
                            label={config.label}
                            color={config.color}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontWeight: 600,
                              border: '2px solid',
                              '&:hover': {
                                transform: 'scale(1.05)',
                              }
                            }}
                          />
                        );
                      })()}
                    </TableCell>
                  </TableRow>
                </Fade>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Fade>
    </Box>
  );
};

export default Repositories;
