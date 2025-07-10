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
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { businessApplicationsApi, githubApi, CreateBusinessApplicationRequest } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const BusinessApplications: React.FC = () => {
  const { organization } = useAuth();
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load business applications. Please try again.
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Business Applications</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Application
        </Button>
      </Box>

      <Grid container spacing={3}>
        {businessApps?.map((app) => (
          <Grid item xs={12} md={6} lg={4} key={app.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {app.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {app.description || 'No description'}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Owner: {app.businessOwnerEmail || 'Not specified'}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Repositories: {app.repositories.length}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {app.repositories.slice(0, 3).map((repo: any) => (
                    <Chip
                      key={repo.id}
                      label={repo.repositoryName}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                  {app.repositories.length > 3 && (
                    <Chip
                      label={`+${app.repositories.length - 3} more`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleOpen(app)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(app.id)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingApp ? 'Edit Business Application' : 'Create Business Application'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Business Owner Email"
              type="email"
              value={formData.businessOwnerEmail}
              onChange={(e) => setFormData({ ...formData, businessOwnerEmail: e.target.value })}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Repositories</InputLabel>
              <Select
                multiple
                value={formData.repositoryNames}
                onChange={(e) => setFormData({ ...formData, repositoryNames: e.target.value as string[] })}
                input={<OutlinedInput label="Repositories" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
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
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isLoading || updateMutation.isLoading}
            >
              {editingApp ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default BusinessApplications;
