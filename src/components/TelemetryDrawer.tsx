import React, { useState, useEffect } from 'react'
import type { TelemetryEvent } from '../types/performance'
import { subscribeTelemetry } from '../utils/telemetry'
import { Terminal, X, Trash2 } from 'lucide-react'

export const TelemetryDrawer: React.FC = () => {
  const [events, setEvents] = useState<TelemetryEvent[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeTelemetry((event) => {
      setEvents((prev) => [event, ...prev].slice(0, 50))
    })
    return unsubscribe
  }, [])

  return (
    <>
      <button
        type="button"
        className="telemetry-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Telemetry Console Log Viewer"
        title="View Simulated Telemetry Logs"
      >
        <Terminal size={16} />
        <span>Telemetry Log ({events.length})</span>
      </button>

      {isOpen && (
        <div className="telemetry-drawer" role="region" aria-label="Simulated Telemetry Logs">
          <div className="telemetry-header">
            <div className="telemetry-title">
              <Terminal size={16} />
              <span>Simulated Analytics Console Pings ([Analytics])</span>
            </div>
            <div className="telemetry-actions">
              <button
                type="button"
                className="btn-icon-small"
                onClick={() => setEvents([])}
                aria-label="Clear telemetry logs"
                title="Clear Logs"
              >
                <Trash2 size={14} />
              </button>
              <button
                type="button"
                className="btn-icon-small"
                onClick={() => setIsOpen(false)}
                aria-label="Close telemetry drawer"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="telemetry-body">
            {events.length === 0 ? (
              <div className="telemetry-empty">No telemetry events logged yet. Interact with the application to generate pings.</div>
            ) : (
              events.map((evt) => (
                <div key={evt.id} className="telemetry-line">
                  <span className="telemetry-time">[{evt.timestamp}]</span>{' '}
                  <span className="telemetry-tag">[Analytics]</span>{' '}
                  <span className="telemetry-action">{evt.action}:</span>{' '}
                  <span className="telemetry-detail">{evt.details}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  )
}
