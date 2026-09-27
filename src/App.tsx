import { useState, useCallback, useEffect } from 'react'
import type { PerformanceRecord, NetworkSpeed } from './types/performance'
import { INITIAL_PERFORMANCE_RECORDS } from './data/initialRecords'
import { logTelemetry } from './utils/telemetry'
import { MetricsOverview } from './components/MetricsOverview'
import { NetworkSimulator } from './components/NetworkSimulator'
import { PerformanceTable } from './components/PerformanceTable'
import { RecordFormModal } from './components/RecordFormModal'
import { TelemetryDrawer } from './components/TelemetryDrawer'
import { Gauge, ShieldCheck } from 'lucide-react'
import './index.css'

export function App() {
  const [records, setRecords] = useState<PerformanceRecord[]>(INITIAL_PERFORMANCE_RECORDS)
  const [networkSpeed, setNetworkSpeed] = useState<NetworkSpeed>('online')
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Telemetry ping on initial render
  useEffect(() => {
    logTelemetry('System Init', 'Floor staff loaded Performance Optimization dashboard')
  }, [])

  const handleNetworkSpeedChange = useCallback((speed: NetworkSpeed) => {
    setNetworkSpeed(speed)
    logTelemetry('Network Speed Change', `Switched mode to ${speed.toUpperCase()}`)
  }, [])

  const handleAddRecord = useCallback((newRecordData: Omit<PerformanceRecord, 'id' | 'lastAudited'>) => {
    const newRecord: PerformanceRecord = {
      ...newRecordData,
      id: `rec-${Date.now()}`,
      lastAudited: new Date().toISOString().replace('T', ' ').substring(0, 16),
    }

    setRecords((prev) => [newRecord, ...prev])
    logTelemetry('Add Record', `Added benchmark record: "${newRecord.title}"`)
  }, [])

  const handleOptimizeAsset = useCallback(async (recordId: string) => {
    const targetRecord = records.find((r) => r.id === recordId)
    const title = targetRecord ? targetRecord.title : recordId

    logTelemetry('Optimize Triggered', `Initiated asset optimization for: "${title}"`)

    // Simulate bad connectivity delay on Slow 3G
    if (networkSpeed === 'slow3g') {
      await new Promise((resolve) => setTimeout(resolve, 1500))
    } else {
      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    setRecords((prev) =>
      prev.map((rec) => {
        if (rec.id === recordId) {
          return {
            ...rec,
            lcp: Math.max(800, Math.round(rec.lcp * 0.55)),
            fid: Math.max(10, Math.round(rec.fid * 0.6)),
            cls: Number((rec.cls * 0.4).toFixed(2)),
            imageSizeKB: Math.max(120, Math.round(rec.imageSizeKB * 0.4)),
            status: 'Optimized',
            lastAudited: new Date().toISOString().replace('T', ' ').substring(0, 16),
            notes: (rec.notes ? `${rec.notes} | ` : '') + 'WebP compressed & CDN purged',
          }
        }
        return rec
      })
    )

    logTelemetry('Optimize Success', `Asset successfully optimized: "${title}"`)
  }, [networkSpeed, records])

  const handleDeleteRecord = useCallback((recordId: string) => {
    const targetRecord = records.find((r) => r.id === recordId)
    const title = targetRecord ? targetRecord.title : recordId

    setRecords((prev) => prev.filter((r) => r.id !== recordId))
    logTelemetry('Delete Record', `Removed record: "${title}"`)
  }, [records])

  const handleSearchChange = useCallback((query: string) => {
    if (query.trim()) {
      logTelemetry('Search Input', `Filtered records by: "${query}"`)
    }
  }, [])

  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="app-header" role="banner">
        <div className="brand-section">
          <div className="brand-badge">ENG-84718</div>
          <div>
            <h1 className="app-title">Performance Optimization</h1>
            <p className="app-subtitle">
              News Blog Editorial & Core Web Vitals Management System
            </p>
          </div>
        </div>

        <div className="header-meta">
          <div className="meta-pill">
            <Gauge size={14} aria-hidden="true" />
            <span>Target LCP &lt; 2.5s</span>
          </div>
          <div className="meta-pill">
            <ShieldCheck size={14} aria-hidden="true" />
            <span>XSS Sanitized</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" role="main">
        {/* Network Connectivity Simulator */}
        <NetworkSimulator
          currentSpeed={networkSpeed}
          onSpeedChange={handleNetworkSpeedChange}
        />

        {/* Core Web Vitals & Metrics Summary */}
        <MetricsOverview records={records} />

        {/* Interactive Benchmarks Table */}
        <PerformanceTable
          records={records}
          networkSpeed={networkSpeed}
          onAddRecordClick={() => setIsFormOpen(true)}
          onOptimizeAsset={handleOptimizeAsset}
          onDeleteRecord={handleDeleteRecord}
          onSearchChange={handleSearchChange}
        />
      </main>

      {/* Modal Form for Adding New Record */}
      <RecordFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleAddRecord}
      />

      {/* Simulated Telemetry Audit Drawer */}
      <TelemetryDrawer />
    </div>
  )
}

export default App
