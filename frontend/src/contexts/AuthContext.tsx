import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  organization: string | null;
  login: (token: string, organization: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [organization, setOrganization] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already authenticated on app load
    const storedToken = localStorage.getItem('github_token');
    const storedOrg = localStorage.getItem('github_organization');
    
    if (storedToken && storedOrg) {
      setToken(storedToken);
      setOrganization(storedOrg);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (newToken: string, newOrganization: string) => {
    localStorage.setItem('github_token', newToken);
    localStorage.setItem('github_organization', newOrganization);
    setToken(newToken);
    setOrganization(newOrganization);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('github_token');
    localStorage.removeItem('github_organization');
    setToken(null);
    setOrganization(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    token,
    organization,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
