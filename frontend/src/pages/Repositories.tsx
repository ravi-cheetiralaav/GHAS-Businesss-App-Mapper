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
} from '@mui/material';
import {
  Public as PublicIcon,
  Lock as PrivateIcon,
  Business as InternalIcon,
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

  // Try to fetch repositories with languages, fallback to regular repositories
  const { data: repositories, isLoading, error } = useQuery(
    ['repositories', organization],
    async () => {
      console.log('Fetching repositories for organization:', organization);
      try {
        // Try the enriched endpoint first
        const result = await githubApi.getOrganizationRepositoriesWithLanguages(organization!);
        console.log('Successfully fetched repositories with languages:', result);
        return result;
      } catch (error) {
        console.warn('Failed to fetch repositories with languages, falling back to basic endpoint:', error);
        // Fallback to the basic endpoint
        const fallbackResult = await githubApi.getOrganizationRepositories(organization!);
        console.log('Successfully fetched basic repositories:', fallbackResult);
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    console.error('Repository fetch error:', error);
    return (
      <Alert severity="error">
        Failed to load repositories: {error instanceof Error ? error.message : 'Unknown error'}. 
        Please check your GitHub token permissions and ensure the backend is running.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Repositories
      </Typography>
      
      <Typography variant="h6" gutterBottom color="text.secondary">
        Organization: {organization}
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Language</TableCell>
              <TableCell>Stars</TableCell>
              <TableCell>Forks</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {repositories?.map((repo) => (
              <TableRow key={repo.id}>
                <TableCell>
                  <a
                    href={repo.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    {repo.name}
                  </a>
                </TableCell>
                <TableCell>{repo.description || 'No description'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 200 }}>
                    {repo.languages && Object.keys(repo.languages).length > 0 ? (
                      Object.entries(repo.languages)
                        .sort(([,a], [,b]) => b - a) // Sort by bytes of code (descending)
                        .slice(0, 5) // Show top 5 languages
                        .map(([language, bytes]) => (
                          <Chip 
                            key={language}
                            label={language} 
                            size="small" 
                            color="primary"
                            title={`${bytes.toLocaleString()} bytes`}
                            sx={{ backgroundColor: 'primary.main', color: 'white' }}
                          />
                        ))
                    ) : repo.language ? (
                      <Chip 
                        label={repo.language} 
                        size="small" 
                        color="primary"
                        sx={{ backgroundColor: 'primary.main', color: 'white' }}
                      />
                    ) : (
                      <span style={{ color: '#666', fontSize: '0.875rem' }}>No language</span>
                    )}
                  </Box>
                </TableCell>
                <TableCell>{repo.stargazersCount}</TableCell>
                <TableCell>{repo.forksCount}</TableCell>
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
                      />
                    );
                  })()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Repositories;
