import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export interface GitHubRepository {
  id: number;
  name: string;
  fullName: string;
  description: string;
  htmlUrl: string;
  cloneUrl: string;
  language: string;
  languages?: { [key: string]: number };
  stargazersCount: number;
  forksCount: number;
  size: number;
  defaultBranch: string;
  isPrivate: boolean;
  visibility?: string;
  isFork: boolean;
  hasIssues: boolean;
  hasProjects: boolean;
  hasWiki: boolean;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  owner: {
    login: string;
    avatarUrl: string;
    htmlUrl: string;
    type: string;
  };
}

export interface BusinessApplication {
  id: number;
  name: string;
  description: string;
  organization: string;
  businessOwnerEmail: string;
  createdAt: string;
  repositories: RepositoryMapping[];
}

export interface RepositoryMapping {
  id: number;
  repositoryName: string;
  repositoryUrl: string;
  repositoryFullName: string;
  createdAt: string;
}

export interface CreateBusinessApplicationRequest {
  name: string;
  description: string;
  organization: string;
  businessOwnerEmail: string;
  repositoryNames: string[];
}

export interface BusinessApplicationStats {
  totalApplications: number;
  totalRepositories: number;
  repositories: string[];
}

export interface VulnerabilityStats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface BusinessApplicationVulnerabilityData {
  id: number;
  name: string;
  organization: string;
  businessOwnerEmail: string;
  repositoryCount: number;
  vulnerabilities: VulnerabilityStats;
  createdAt: string;
}

export interface VulnerabilityTrendData {
  month: string;
  severities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface OrganizationVulnerabilityStats {
  sastVulnerabilities: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  leakedSecrets: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  scaVulnerabilities: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  totalVulnerabilities: number;
  repositoriesScanned: number;
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('github_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// GitHub API service
export const githubApi = {
  // Health check endpoint
  healthCheck: async (): Promise<boolean> => {
    try {
      const response = await api.get('/health');
      return response.status === 200;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },

  validateToken: async (token: string): Promise<boolean> => {
    try {
      // Create a separate axios instance for token validation to avoid interceptor conflicts
      const response = await axios.post(`${API_BASE_URL}/github/validate-token`, {}, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      return response.data;
    } catch (error: any) {
      console.error('Token validation failed:', error);
      
      // Re-throw with more specific error information
      if (error.code === 'ERR_NETWORK') {
        const networkError = new Error('Cannot connect to backend server');
        networkError.name = 'NETWORK_ERROR';
        throw networkError;
      }
      
      throw error;
    }
  },

  getOrganizationRepositories: async (orgName: string): Promise<GitHubRepository[]> => {
    try {
      const response = await api.get(`/github/organizations/${orgName}/repositories`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch repositories:', error);
      throw error;
    }
  },

  getOrganizationRepositoriesWithLanguages: async (orgName: string): Promise<GitHubRepository[]> => {
    try {
      const response = await api.get(`/github/organizations/${orgName}/repositories-with-languages`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch repositories with languages:', error);
      throw error;
    }
  },

  getVulnerabilityAlerts: async (orgName: string, repoName: string): Promise<any> => {
    try {
      const response = await api.get(`/github/organizations/${orgName}/repositories/${repoName}/vulnerability-alerts`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch vulnerability alerts:', error);
      throw error;
    }
  },

  getSecurityAdvisories: async (orgName: string, repoName: string): Promise<any> => {
    try {
      const response = await api.get(`/github/organizations/${orgName}/repositories/${repoName}/security-advisories`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch security advisories:', error);
      throw error;
    }
  },

  getOrganizationVulnerabilityStats: async (orgName: string): Promise<OrganizationVulnerabilityStats> => {
    try {
      console.log('Fetching organization vulnerability stats for:', orgName);
      const response = await api.get(`/github/organizations/${orgName}/vulnerability-stats`);
      console.log('Organization vulnerability stats response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch organization vulnerability stats:', error);
      throw error;
    }
  },
};

export const getEnterpriseVulnerabilities = async (enterprise: string): Promise<any> => {
    const response = await api.get(`/enterprise/${enterprise}/vulnerabilities`);
    return response.data;
};

// Business Applications API service
export const businessApplicationsApi = {
  getAll: async (organization: string): Promise<BusinessApplication[]> => {
    try {
      const response = await api.get(`/business-applications?organization=${organization}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch business applications:', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<BusinessApplication> => {
    try {
      const response = await api.get(`/business-applications/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch business application:', error);
      throw error;
    }
  },

  create: async (data: CreateBusinessApplicationRequest): Promise<BusinessApplication> => {
    try {
      const response = await api.post('/business-applications', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create business application:', error);
      throw error;
    }
  },

  update: async (id: number, data: CreateBusinessApplicationRequest): Promise<BusinessApplication> => {
    try {
      const response = await api.put(`/business-applications/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update business application:', error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/business-applications/${id}`);
    } catch (error) {
      console.error('Failed to delete business application:', error);
      throw error;
    }
  },

  getStats: async (organization: string): Promise<BusinessApplicationStats> => {
    try {
      const response = await api.get(`/business-applications/stats?organization=${organization}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch business application stats:', error);
      throw error;
    }
  },

  getVulnerabilityData: async (organization: string): Promise<BusinessApplicationVulnerabilityData[]> => {
    try {
      console.log('Fetching vulnerability data for organization:', organization);
      const response = await api.get(`/business-applications/vulnerability-data?organization=${organization}`);
      console.log('Vulnerability data response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch business application vulnerability data:', error);
      throw error;
    }
  },

  getVulnerabilityDataDebug: async (organization: string): Promise<BusinessApplicationVulnerabilityData[]> => {
    try {
      console.log('Fetching vulnerability data (debug mode) for organization:', organization);
      const response = await api.get(`/business-applications/vulnerability-data-debug?organization=${organization}`);
      console.log('Vulnerability data debug response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch business application vulnerability data (debug):', error);
      throw error;
    }
  },

  getVulnerabilityTrend: async (organization: string): Promise<VulnerabilityTrendData[]> => {
    try {
      console.log('Fetching vulnerability trend data for organization:', organization);
      const response = await api.get(`/business-applications/vulnerability-trend?organization=${organization}`);
      console.log('Vulnerability trend data response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch business application vulnerability trend data:', error);
      throw error;
    }
  },
};
