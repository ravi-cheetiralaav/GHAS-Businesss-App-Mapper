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
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 240;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { logout, organization } = useAuth();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

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
      background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
      height: '100%',
      color: 'white',
    }}>
      <Toolbar sx={{ 
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            p: 1, 
            borderRadius: '50%', 
            background: 'rgba(255, 255, 255, 0.2)',
            mr: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <GitHubIcon sx={{ color: 'white', fontSize: 20 }} />
          </Box>
          <Typography variant="h6" noWrap sx={{ fontWeight: 700, color: 'white' }}>
            GHAS Insights
          </Typography>
        </Box>
      </Toolbar>
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.path}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            onClick={isMobile ? handleDrawerToggle : undefined}
            sx={{
              mx: 1,
              mb: 1,
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.15)',
                transform: 'translateX(4px)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              },
              '&.Mui-selected': {
                background: 'rgba(255, 255, 255, 0.2)',
                borderLeft: '4px solid white',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.25)',
                }
              }
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label} 
              sx={{ 
                '& .MuiTypography-root': { 
                  fontWeight: location.pathname === item.path ? 700 : 500,
                  color: 'white'
                } 
              }} 
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { md: 'none' },
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ 
            flexGrow: 1, 
            color: 'white',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              px: 2,
              py: 0.5,
              mr: 2,
            }}>
              {organization}
            </Box>
            Vulnerability Insights
          </Typography>
          <Button 
            color="inherit" 
            onClick={logout} 
            startIcon={<LogoutIcon />}
            sx={{
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
                transform: 'translateY(-1px)',
              },
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          background: 'linear-gradient(135deg, rgba(103, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%)',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Container maxWidth="xl" sx={{ py: 2 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

interface LayoutProps {
  children: ReactNode;
}

export default Layout;
