import React from 'react'
import type { NetworkSpeed } from '../types/performance'
import { Wifi, WifiOff, Gauge } from 'lucide-react'

interface NetworkSimulatorProps {
  currentSpeed: NetworkSpeed
  onSpeedChange: (speed: NetworkSpeed) => void
}

export const NetworkSimulator: React.FC<NetworkSimulatorProps> = ({
  currentSpeed,
  onSpeedChange,
}) => {
  return (
    <div className="network-simulator-bar" role="region" aria-label="Network Connectivity Simulator">
      <div className="network-info">
        <span className="network-label">
          {currentSpeed === 'online' && <Wifi size={16} className="text-good" aria-hidden="true" />}
          {currentSpeed === 'slow3g' && <Gauge size={16} className="text-warn" aria-hidden="true" />}
          {currentSpeed === 'offline' && <WifiOff size={16} className="text-danger" aria-hidden="true" />}
          Network Simulator Mode:
        </span>
      </div>

      <div className="network-controls">
        <label htmlFor="network-speed-select" className="sr-only">
          Network Speed Connectivity
        </label>
        <select
          id="network-speed-select"
          aria-label="Network Speed Connectivity"
          value={currentSpeed}
          onChange={(e) => onSpeedChange(e.target.value as NetworkSpeed)}
          className="network-select"
        >
          <option value="online">Online (High-Speed Fiber / 5G)</option>
          <option value="slow3g">Slow 3G (Simulated 400ms latency)</option>
          <option value="offline">Offline (Cached Local Data)</option>
        </select>

        {currentSpeed === 'slow3g' && (
          <span className="badge-warning" role="status">
            Slow 3G Active (Async ops delayed)
          </span>
        )}
        {currentSpeed === 'offline' && (
          <span className="badge-offline" role="status">
            Offline Mode
          </span>
        )}
      </div>
    </div>
  )
}
