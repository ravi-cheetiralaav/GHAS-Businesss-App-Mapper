import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Card,
  CardContent,
  CardActions,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Paper,
  Fade,
  Grow,
  useTheme,
  Avatar,
  Divider,
  SxProps,
  Theme,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  BusinessOutlined,
  PersonOutlined,
  FolderOutlined,
  CodeOutlined,
  SecurityOutlined,
} from '@mui/icons-material';
import { businessApplicationsApi, githubApi, CreateBusinessApplicationRequest } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { styleMixins } from '../styles/mixins';
import { COLORS } from '../styles/theme';
import { GradientText } from '../components/common/StyledComponents';

const BusinessApplications: React.FC = () => {
  const { organization } = useAuth();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<any>(null);
  const [formData, setFormData] = useState<CreateBusinessApplicationRequest>({
    name: '',
    description: '',
    organization: organization || '',
    businessOwnerEmail: '',
    repositoryNames: [],
  });

  const { data: businessApps, isLoading, error } = useQuery(
    ['businessApplications', organization],
    () => businessApplicationsApi.getAll(organization!),
    {
      enabled: !!organization,
    }
  );

  const { data: repositories } = useQuery(
    ['repositories', organization],
    () => githubApi.getOrganizationRepositories(organization!),
    {
      enabled: !!organization,
    }
  );

  const createMutation = useMutation(businessApplicationsApi.create, {
    onSuccess: () => {
      queryClient.invalidateQueries(['businessApplications']);
      handleClose();
    },
  });

  const updateMutation = useMutation(
    ({ id, data }: { id: number; data: CreateBusinessApplicationRequest }) =>
      businessApplicationsApi.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['businessApplications']);
        handleClose();
      },
    }
  );

  const deleteMutation = useMutation(businessApplicationsApi.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries(['businessApplications']);
    },
  });

  const handleOpen = (app?: any) => {
    if (app) {
      setEditingApp(app);
      setFormData({
        name: app.name,
        description: app.description,
        organization: app.organization,
        businessOwnerEmail: app.businessOwnerEmail,
        repositoryNames: app.repositories.map((r: any) => r.repositoryName),
      });
    } else {
      setEditingApp(null);
      setFormData({
        name: '',
        description: '',
        organization: organization || '',
        businessOwnerEmail: '',
        repositoryNames: [],
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingApp(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingApp) {
      updateMutation.mutate({ id: editingApp.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this business application?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 3,
          p: 4,
        }}
      >
        <BusinessOutlined 
          sx={{ 
            fontSize: 64, 
            color: 'white', 
            opacity: 0.7, 
            mb: 2,
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { opacity: 0.7, transform: 'scale(1)' },
              '50%': { opacity: 1, transform: 'scale(1.1)' },
              '100%': { opacity: 0.7, transform: 'scale(1)' },
            },
          }} 
        />
        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
          Loading Business Applications
        </Typography>
        <CircularProgress 
          size={60} 
          thickness={4}
          sx={{ 
            color: 'white',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }} 
        />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper 
        elevation={8}
        sx={{
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
          borderRadius: 3,
          p: 4,
        }}
      >
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center"
        >
          <SecurityOutlined 
            sx={{ 
              fontSize: 64, 
              color: 'white', 
              mb: 2,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
            }} 
          />
          <Typography variant="h6" sx={{ color: 'white', mb: 2, textAlign: 'center' }}>
            Failed to Load Business Applications
          </Typography>
          <Alert 
            severity="error" 
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: 2,
            }}
          >
            Failed to load business applications. Please try again.
          </Alert>
        </Box>
      </Paper>
    );
  }

  return (
    <Fade in={true} timeout={600}>
      <Box>
        {/* Enhanced Header */}
        <Paper elevation={8} sx={styleMixins.headerCard()}>
          <Box 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center"
            sx={{ position: 'relative', zIndex: 1 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <BusinessOutlined 
                sx={{ 
                  fontSize: 48, 
                  mr: 2,
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                }} 
              />
              <Box>
                <Typography 
                  variant="h4" 
                  fontWeight="bold" 
                  sx={{ 
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    mb: 0.5,
                    color: 'white',
                  }}
                >
                  Business Applications
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    opacity: 0.9,
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                    color: 'white',
                  }}
                >
                  Manage your organization's application portfolio
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
              sx={{
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                fontWeight: 'bold',
                px: 3,
                py: 1.5,
                '&:hover': {
                  background: 'rgba(255,255,255,0.3)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Add Application
            </Button>
          </Box>
        </Paper>

        {/* Enhanced Applications Grid */}
        <Grid container spacing={4}>
          {businessApps?.map((app, index) => (
            <Grid item xs={12} md={6} lg={4} key={app.id}>
              <Grow in={true} timeout={800 + index * 200}>
                <Card sx={[
                  styleMixins.elevatedCard(),
                  styleMixins.hoverEffect(-8),
                  {
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }
                ] as SxProps<Theme>}>
                  <CardContent sx={{ p: 3, flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={styleMixins.primaryAvatar()}>
                        <BusinessOutlined sx={{ fontSize: 24 }} />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <GradientText variant="h6" sx={{ mb: 0.5 }}>
                          {app.name}
                        </GradientText>
                      </Box>
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 2,
                        minHeight: '40px',
                        lineHeight: 1.5,
                      }}
                    >
                      {app.description || 'No description provided'}
                    </Typography>

                    <Divider sx={{ my: 2, opacity: 0.3 }} />

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonOutlined sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {app.businessOwnerEmail || 'Owner not specified'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <FolderOutlined sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                      <Paper
                        elevation={2}
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: 32,
                          padding: '4px 12px',
                          borderRadius: '16px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.875rem',
                        }}
                      >
                        {app.repositories.length} repositories
                      </Paper>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        <CodeOutlined sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                        Repositories:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {app.repositories.slice(0, 3).map((repo: any) => (
                          <Chip
                            key={repo.id}
                            label={repo.repositoryName}
                            size="small"
                            sx={{ 
                              backgroundColor: 'rgba(102, 126, 234, 0.1)',
                              color: theme.palette.primary.main,
                              fontWeight: 500,
                              '&:hover': {
                                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                              },
                            }}
                          />
                        ))}
                        {app.repositories.length > 3 && (
                          <Chip
                            label={`+${app.repositories.length - 3} more`}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: theme.palette.primary.main,
                              color: theme.palette.primary.main,
                              fontWeight: 500,
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ p: 2, pt: 0, justifyContent: 'flex-end' }}>
                    <IconButton 
                      onClick={() => handleOpen(app)}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        mr: 1,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDelete(app.id)}
                      sx={{
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                        color: 'white',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #ff5252 0%, #d63031 100%)',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>

        {/* Enhanced Dialog */}
        <Dialog 
          open={open} 
          onClose={handleClose} 
          maxWidth="md" 
          fullWidth
          PaperProps={{
            elevation: 16,
            sx: {
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              overflow: 'hidden',
            },
          }}
        >
          <Paper
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            }}
          >
            <DialogTitle 
              sx={{ 
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                py: 3,
              }}
            >
              <BusinessOutlined sx={{ fontSize: 32, mr: 2 }} />
              <Typography variant="h5" fontWeight="bold">
                {editingApp ? 'Edit Business Application' : 'Create Business Application'}
              </Typography>
            </DialogTitle>
          </Paper>
          
          <form onSubmit={handleSubmit}>
            <DialogContent sx={{ p: 4 }}>
              <TextField
                fullWidth
                label="Application Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: theme.palette.primary.main,
                  },
                }}
              />
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: theme.palette.primary.main,
                  },
                }}
              />
              <TextField
                fullWidth
                label="Business Owner Email"
                type="email"
                value={formData.businessOwnerEmail}
                onChange={(e) => setFormData({ ...formData, businessOwnerEmail: e.target.value })}
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: theme.palette.primary.main,
                  },
                }}
              />
              <FormControl 
                fullWidth 
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <InputLabel>Repositories</InputLabel>
                <Select
                  multiple
                  value={formData.repositoryNames}
                  onChange={(e) => setFormData({ ...formData, repositoryNames: e.target.value as string[] })}
                  input={<OutlinedInput label="Repositories" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip 
                          key={value} 
                          label={value} 
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                            color: theme.palette.primary.main,
                            fontWeight: 500,
                          }}
                        />
                      ))}
                    </Box>
                  )}
                >
                  {repositories?.map((repo) => (
                    <MenuItem key={repo.id} value={repo.name}>
                      {repo.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 2 }}>
              <Button 
                onClick={handleClose}
                variant="outlined"
                sx={{
                  borderColor: 'rgba(0,0,0,0.23)',
                  color: 'text.secondary',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: 'rgba(102, 126, 234, 0.04)',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={createMutation.isLoading || updateMutation.isLoading}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontWeight: 'bold',
                  px: 3,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                  },
                  '&:disabled': {
                    background: 'rgba(0,0,0,0.12)',
                    color: 'rgba(0,0,0,0.26)',
                  },
                }}
              >
                {editingApp ? 'Update Application' : 'Create Application'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default BusinessApplications;
