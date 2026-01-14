import { create } from 'zustand'
import { apiClient, type Job as ApiJob, type JobKind } from '@/lib/api'

// Local status for UI state (idle, uploading are frontend-only)
export type JobStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'failed'

export interface Job {
  id: string
  shareId: string
  status: JobStatus
  kind: JobKind
  inputUrls?: string[]
  outputUrls?: string[]
  error?: string
  createdAt: string
  roomType?: string
  stylePreset?: string
  shareUrl?: string
}

interface JobsState {
  currentJobId: string | null
  currentJobStatus: JobStatus
  currentOutputs: string[]
  currentError: string | null
  history: Job[]
  isPolling: boolean
  
  // Actions
  startJob: (jobId: string, kind: JobKind) => void
  updateJobStatus: (status: JobStatus) => void
  setOutputs: (outputs: string[]) => void
  setError: (error: string) => void
  reset: () => void
  addToHistory: (job: Job) => void
  setHistory: (history: Job[]) => void
  setPolling: (isPolling: boolean) => void
  fetchHistory: () => Promise<void>
}

export const useJobsStore = create<JobsState>((set, get) => ({
  currentJobId: null,
  currentJobStatus: 'idle',
  currentOutputs: [],
  currentError: null,
  history: [],
  isPolling: false,

  startJob: (jobId, kind) => set({
    currentJobId: jobId,
    currentJobStatus: 'processing',
    currentOutputs: [],
    currentError: null,
  }),

  updateJobStatus: (status) => set({ currentJobStatus: status }),

  setOutputs: (outputs) => set({ 
    currentOutputs: outputs,
    currentJobStatus: 'completed',
  }),

  setError: (error) => set({ 
    currentError: error,
    currentJobStatus: 'failed',
  }),

  reset: () => set({
    currentJobId: null,
    currentJobStatus: 'idle',
    currentOutputs: [],
    currentError: null,
    isPolling: false,
  }),

  addToHistory: (job) => set((state) => ({
    history: [job, ...state.history.filter(j => j.id !== job.id).slice(0, 49)], // Keep last 50, avoid duplicates
  })),

  setHistory: (history) => set({ history }),

  setPolling: (isPolling) => set({ isPolling }),

  fetchHistory: async () => {
    try {
      const response = await apiClient.getJobHistory()
      // Map API jobs to store jobs, converting statuses
      const mappedHistory: Job[] = (response.items || []).map((job: ApiJob): Job => {
        // Convert API status to store status
        let status: JobStatus = 'processing'
        if (job.status === 'completed') status = 'completed'
        else if (job.status === 'failed') status = 'failed'
        else if (job.status === 'created' || job.status === 'processing') status = 'processing'
        
        return {
          id: job.id,
          shareId: job.shareId,
          status,
          kind: job.kind,
          inputUrls: job.inputUrls,
          outputUrls: job.outputUrls,
          error: job.error,
          createdAt: job.createdAt || new Date().toISOString(),
          roomType: job.roomType,
          stylePreset: job.stylePreset,
          shareUrl: job.shareUrl,
        }
      })
      set({ history: mappedHistory })
    } catch (error) {
      console.error('Failed to fetch job history:', error)
    }
  },
}))
