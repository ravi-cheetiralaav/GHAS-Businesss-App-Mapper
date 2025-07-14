import { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface JobProgress {
  jobId: string;
  enterpriseName: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  progress: number;
  currentTask: string;
  codeScanningProgress?: TaskProgress;
  secretScanningProgress?: TaskProgress;
  dependabotProgress?: TaskProgress;
  partialResults?: PartialResults;
  errorMessage?: string;
  createdAt?: string;
  estimatedCompletion?: string;
}

export interface TaskProgress {
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  message?: string;
  count?: number;
  error?: string;
}

export interface PartialResults {
  codeScanning?: VulnerabilityStats;
  secretScanning?: VulnerabilityStats;
  dependabot?: VulnerabilityStats;
}

export interface VulnerabilityStats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  error: number;
}

export interface JobStartResponse {
  jobId: string;
  enterpriseName: string;
  status: string;
  message: string;
  estimatedDurationMinutes: number;
  websocketUrl: string;
  useExistingResults: boolean;
  existingResults?: PartialResults;
}

export const useEnterpriseAsyncJob = () => {
  const [jobProgress, setJobProgress] = useState<JobProgress | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const clientRef = useRef<Client | null>(null);
  const currentJobIdRef = useRef<string | null>(null);

  const connectWebSocket = (jobId: string) => {
    try {
      console.log('🔌 Connecting to WebSocket for job:', jobId);
      
      // Disconnect existing connection
      if (clientRef.current) {
        clientRef.current.deactivate();
      }

      // Create new STOMP client
      const client = new Client({
        webSocketFactory: () => new SockJS(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/enterprise-progress`),
        connectHeaders: {},
        debug: (str: string) => {
          console.log('🔌 STOMP Debug:', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      client.onConnect = (frame: any) => {
        console.log('✅ WebSocket connected:', frame);
        setIsConnected(true);
        setError(null);

        // Subscribe to job-specific updates
        client.subscribe(`/topic/job/${jobId}`, (message: any) => {
          try {
            const update: JobProgress = JSON.parse(message.body);
            console.log('📨 Received job update:', update);
            setJobProgress(update);
            
            if (update.status === 'COMPLETED' || update.status === 'FAILED') {
              console.log('🏁 Job finished, disconnecting WebSocket');
              setTimeout(() => {
                client.deactivate();
              }, 2000); // Keep connection for 2 more seconds
            }
          } catch (e) {
            console.error('❌ Failed to parse WebSocket message:', e);
          }
        });
      };

      client.onStompError = (frame: any) => {
        console.error('❌ STOMP error:', frame);
        setError('WebSocket connection error');
        setIsConnected(false);
      };

      client.onWebSocketClose = () => {
        console.log('🔌 WebSocket disconnected');
        setIsConnected(false);
      };

      client.onWebSocketError = (error: any) => {
        console.error('❌ WebSocket error:', error);
        setError('WebSocket connection failed');
        setIsConnected(false);
      };

      clientRef.current = client;
      currentJobIdRef.current = jobId;
      client.activate();

    } catch (e) {
      console.error('❌ Failed to connect WebSocket:', e);
      setError('Failed to establish real-time connection');
    }
  };

  const startEnterpriseJob = async (enterpriseName: string, token: string): Promise<JobStartResponse | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🚀 Starting enterprise job for:', enterpriseName);

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/enterprise/${enterpriseName}/scan/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to start job: ${response.status} ${errorText}`);
      }

      const jobResponse: JobStartResponse = await response.json();
      console.log('✅ Job started:', jobResponse);

      // Always set initial job progress immediately (before WebSocket connection)
      const initialProgress: JobProgress = {
        jobId: jobResponse.jobId,
        enterpriseName: jobResponse.enterpriseName,
        status: jobResponse.useExistingResults ? 'COMPLETED' : (jobResponse.status === 'PROCESSING' ? 'PROCESSING' : 'PENDING'),
        progress: jobResponse.useExistingResults ? 100 : (jobResponse.status === 'PROCESSING' ? 1 : 0),
        currentTask: jobResponse.useExistingResults ? 'Using cached results' : (jobResponse.status === 'PROCESSING' ? 'Initializing enterprise scan...' : 'Starting enterprise scan...'),
        partialResults: jobResponse.existingResults,
      };
      
      console.log('📊 Setting initial progress:', initialProgress);
      setJobProgress(initialProgress);

      // If we don't have existing results, connect to WebSocket for real-time updates
      if (!jobResponse.useExistingResults) {
        // Small delay to ensure UI updates before WebSocket connection
        setTimeout(() => {
          connectWebSocket(jobResponse.jobId);
        }, 100);
      }

      return jobResponse;

    } catch (e: any) {
      console.error('❌ Failed to start enterprise job:', e);
      setError(e.message || 'Failed to start enterprise scan');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const pollJobStatus = async (jobId: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/enterprise/jobs/${jobId}/status`);
      
      if (response.ok) {
        const status: JobProgress = await response.json();
        setJobProgress(status);
        return status;
      }
    } catch (e) {
      console.error('❌ Failed to poll job status:', e);
    }
    return null;
  };

  const disconnect = () => {
    if (clientRef.current) {
      console.log('🔌 Disconnecting WebSocket');
      clientRef.current.deactivate();
      clientRef.current = null;
    }
    setIsConnected(false);
    currentJobIdRef.current = null;
  };

  const reset = () => {
    disconnect();
    setJobProgress(null);
    setError(null);
    setIsLoading(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return {
    jobProgress,
    isConnected,
    isLoading,
    error,
    startEnterpriseJob,
    pollJobStatus,
    disconnect,
    reset,
  };
};
