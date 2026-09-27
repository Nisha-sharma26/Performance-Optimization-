export type CategoryType = 
  | 'Breaking News'
  | 'Technology'
  | 'Opinion'
  | 'Politics'
  | 'Culture & Lifestyle'
  | 'Sports'

export type OptimizationStatus = 
  | 'Optimized'
  | 'In Progress'
  | 'Needs Optimization'
  | 'Failed'

export type NetworkSpeed = 'online' | 'slow3g' | 'offline'

export interface PerformanceRecord {
  id: string
  title: string
  category: CategoryType
  lcp: number // Largest Contentful Paint in ms
  fid: number // First Input Delay in ms
  cls: number // Cumulative Layout Shift
  imageSizeKB: number // Image payload size in KB
  status: OptimizationStatus
  lastAudited: string
  notes?: string
}

export interface MetricsSummary {
  avgLcp: number
  avgFid: number
  avgCls: number
  totalAssets: number
  optimizedCount: number
  passRate: number
  estimatedBandwidthSavedMB: number
  cdnHitRate: number
}

export interface ValidationErrors {
  title?: string
  category?: string
  lcp?: string
  imageSizeKB?: string
}

export interface TelemetryEvent {
  id: string
  timestamp: string
  action: string
  details: string
}
