import type { TelemetryEvent } from '../types/performance'

type TelemetryCallback = (event: TelemetryEvent) => void

const subscribers: TelemetryCallback[] = []

export const subscribeTelemetry = (cb: TelemetryCallback) => {
  subscribers.push(cb)
  return () => {
    const idx = subscribers.indexOf(cb)
    if (idx > -1) subscribers.splice(idx, 1)
  }
}

/**
 * Telemetry Simulation ping required by NFRs.
 * Logs a standardized console message whenever primary actions are taken.
 */
export const logTelemetry = (action: string, details: string) => {
  const message = `[Analytics] User interacted with Performance Optimization: ${action} - ${details}`
  console.log(message)

  const event: TelemetryEvent = {
    id: Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toLocaleTimeString(),
    action,
    details,
  }

  subscribers.forEach((cb) => cb(event))
}
