import React, { ReactNode } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  Analytics as AnalyticsIcon,
  Folder as RepositoryIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  GitHub as GitHubIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 260;

interface LayoutProps {
  children: ReactNode;
}

const GitHubLayout: React.FC<LayoutProps> = ({ children }) => {
  const { logout, organization } = useAuth();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // GitHub color palette
  const github = {
    bg: {
      primary: '#f6f8fa',
      secondary: '#ffffff',
      canvas: '#ffffff',
      overlay: '#ffffff'
    },
    border: {
      default: '#d0d7de',
      muted: '#d8dee4'
    },
    fg: {
      default: '#24292f',
      muted: '#656d76',
      subtle: '#6e7781'
    },
    accent: {
      fg: '#0969da',
      emphasis: '#0550ae'
    },
    neutral: {
      emphasis: '#6e7781',
      muted: '#afb8c1'
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/repositories', label: 'Repositories', icon: <RepositoryIcon /> },
    { path: '/business-applications', label: 'Business Apps', icon: <BusinessIcon /> },
    { path: '/analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
    { path: '/enterprise-dashboard', label: 'Enterprise Risk', icon: <SecurityIcon /> },
  ];

  const drawer = (
    <Box sx={{
      bgcolor: github.bg.secondary,
      height: '100%',
      borderRight: `1px solid ${github.border.default}`,
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 3,
        borderBottom: `1px solid ${github.border.default}`,
        bgcolor: github.bg.primary
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: '8px', 
            bgcolor: github.bg.secondary,
            border: `1px solid ${github.border.default}`,
            mr: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <GitHubIcon sx={{ color: github.fg.default, fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ 
              fontWeight: 600, 
              color: github.fg.default,
              fontSize: '1.125rem',
              lineHeight: 1.25
            }}>
              GHAS Insights
            </Typography>
            <Typography variant="caption" sx={{ 
              color: github.fg.muted,
              fontSize: '0.75rem'
            }}>
              Security Dashboard
            </Typography>
          </Box>
        </Box>
        
        {/* User info */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          p: 2,
          borderRadius: '6px',
          bgcolor: github.bg.secondary,
          border: `1px solid ${github.border.default}`
        }}>
          <Avatar sx={{ 
            width: 32, 
            height: 32, 
            bgcolor: github.accent.fg,
            fontSize: '0.875rem',
            mr: 1.5
          }}>
            <PersonIcon sx={{ fontSize: 18 }} />
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ 
              fontWeight: 600, 
              color: github.fg.default,
              fontSize: '0.875rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {organization || 'User'}
            </Typography>
            <Typography variant="caption" sx={{ 
              color: github.fg.muted,
              fontSize: '0.75rem'
            }}>
              GitHub Enterprise
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" sx={{ 
          color: github.fg.muted,
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          ml: 1,
          mb: 1,
          display: 'block'
        }}>
          Navigation
        </Typography>
        <List sx={{ p: 0 }}>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.path}
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              onClick={isMobile ? handleDrawerToggle : undefined}
              sx={{
                mb: 0.5,
                borderRadius: '6px',
                px: 1.5,
                py: 1,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: github.bg.primary,
                },
                '&.Mui-selected': {
                  bgcolor: github.accent.fg,
                  color: 'white',
                  '& .MuiListItemIcon-root': {
                    color: 'white'
                  },
                  '&:hover': {
                    bgcolor: github.accent.emphasis,
                  }
                }
              }}
            >
              <ListItemIcon sx={{ 
                color: location.pathname === item.path ? 'white' : github.fg.muted, 
                minWidth: 36
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                sx={{ 
                  '& .MuiTypography-root': { 
                    fontWeight: location.pathname === item.path ? 600 : 500,
                    fontSize: '0.875rem',
                    color: location.pathname === item.path ? 'white' : github.fg.default
                  } 
                }} 
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0,
        p: 2,
        borderTop: `1px solid ${github.border.default}`,
        bgcolor: github.bg.primary
      }}>
        <Button
          onClick={logout}
          startIcon={<LogoutIcon />}
          fullWidth
          sx={{
            justifyContent: 'flex-start',
            color: github.fg.muted,
            textTransform: 'none',
            fontSize: '0.875rem',
            borderRadius: '6px',
            py: 1,
            '&:hover': {
              bgcolor: github.bg.secondary,
              color: github.fg.default
            }
          }}
        >
          Sign out
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex',
      bgcolor: github.bg.primary,
      minHeight: '100vh'
    }}>
      {/* Mobile AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: github.bg.secondary,
          borderBottom: `1px solid ${github.border.default}`,
          display: { md: 'none' }
        }}
      >
        <Toolbar sx={{ minHeight: '64px !important' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2,
              color: github.fg.default,
              '&:hover': {
                bgcolor: github.bg.primary,
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <GitHubIcon sx={{ color: github.fg.default, mr: 1 }} />
            <Typography variant="h6" sx={{ 
              color: github.fg.default,
              fontWeight: 600,
              fontSize: '1.125rem'
            }}>
              GHAS Insights
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              position: 'relative'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          bgcolor: github.bg.primary,
          minHeight: '100vh',
          pt: { xs: 8, md: 0 }
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default GitHubLayout;
