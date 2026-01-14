import { create } from 'zustand'

export type JobStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'failed'
export type JobKind = 't2i' | 'edit' | 'i2v'

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
    history: [job, ...state.history.slice(0, 49)], // Keep last 50
  })),

  setHistory: (history) => set({ history }),

  setPolling: (isPolling) => set({ isPolling }),
}))
