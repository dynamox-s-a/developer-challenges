type TelemetryPointInput = {
  timestamp: string
  x: number
  y: number
  z: number
  temperature: number
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function noise(scale: number) {
  return (Math.random() - 0.5) * 2 * scale
}

function round(n: number, decimals: number) {
  return Number(n.toFixed(decimals))
}

export function generateFakeTcAgSeries(params: {
  intervalMinutes: number
  pointsCount: number
}): TelemetryPointInput[] {
  const now = Date.now()
  const intervalMs = params.intervalMinutes * 60 * 1000

  const maxG = 16
  const minTemp = -10
  const maxTemp = 84

  const baseAmp = 0.6

  return Array.from({ length: params.pointsCount }).map((_, index) => {
    const time = now - (params.pointsCount - 1 - index) * intervalMs

    const x = baseAmp * Math.sin(index / 12) + noise(0.08)
    const y = baseAmp * Math.cos(index / 15) + noise(0.08)
    const z = baseAmp * Math.sin(index / 18) + noise(0.08)

    const temperature = 30 + Math.sin(index / 45) * 4 + Math.random() * 0.4

    return {
      timestamp: new Date(time).toISOString(),
      x: round(clamp(x, -maxG, maxG), 4),
      y: round(clamp(y, -maxG, maxG), 4),
      z: round(clamp(z, -maxG, maxG), 4),
      temperature: round(clamp(temperature, minTemp, maxTemp), 2)
    }
  })
}

export function generateFakeTcAsSeries(params: {
  intervalMinutes: number
  pointsCount: number
}): TelemetryPointInput[] {
  const now = Date.now()
  const intervalMs = params.intervalMinutes * 60 * 1000

  const maxG = 16
  const minTemp = -10
  const maxTemp = 84

  const baseAmp = 0.85
  const spikeEvery = 37 
  const spikeStrength = 2.2 
  const spikeWidth = 2 

  return Array.from({ length: params.pointsCount }).map((_, index) => {
    const time = now - (params.pointsCount - 1 - index) * intervalMs

    const drift = 1 + 0.12 * Math.sin(index / 90) 
    let x = baseAmp * drift * Math.sin(index / 10) + noise(0.1)
    let y = baseAmp * drift * Math.cos(index / 13) + noise(0.1)
    let z = baseAmp * drift * Math.sin(index / 17) + noise(0.1)

   
    const spikePhase = index % spikeEvery
    if (spikePhase < spikeWidth) {
      const k = 1 - spikePhase / spikeWidth 
      const spike = spikeStrength * k * (0.7 + Math.random() * 0.6)
      x += spike * (0.9 + Math.random() * 0.2)
      y += spike * (0.6 + Math.random() * 0.3)
      z += spike * (0.8 + Math.random() * 0.25)
    }

    const temperature =
      32 + Math.sin(index / 55) * 5 + index * 0.01 + noise(0.15)

    return {
      timestamp: new Date(time).toISOString(),
      x: round(clamp(x, -maxG, maxG), 4),
      y: round(clamp(y, -maxG, maxG), 4),
      z: round(clamp(z, -maxG, maxG), 4),
      temperature: round(clamp(temperature, minTemp, maxTemp), 2)
    }
  })
}

export function generateFakeHfSeries(params: {
  intervalMinutes: number
  pointsCount: number
  variant?: 'HF+' | 'HF+s'
  hfSMaxTemp?: 84 | 105 
}): TelemetryPointInput[] {
  const now = Date.now()
  const intervalMs = params.intervalMinutes * 60 * 1000

  const maxG = 16
  const minTemp = -10

  const variant = params.variant ?? 'HF+'
  const maxTemp = variant === 'HF+s' ? (params.hfSMaxTemp ?? 84) : 84

  const baseAmp = 0.35
  const baseNoise = 0.04 
  const eventCount = Math.max(1, Math.floor(params.pointsCount / 120)) 

  const centers = Array.from({ length: eventCount }).map(() =>
    Math.floor(params.pointsCount * (0.15 + Math.random() * 0.7))
  )
  const sigma = 2.2 
  const eventAmp = 3.0 

  function eventEnvelope(i: number) {
    let sum = 0
    for (const c of centers) {
      const d = i - c
      sum += Math.exp(-(d * d) / (2 * sigma * sigma))
    }
    return sum
  }

  return Array.from({ length: params.pointsCount }).map((_, index) => {
    const time = now - (params.pointsCount - 1 - index) * intervalMs

    const env = eventEnvelope(index)
    const burst = eventAmp * env

    const x =
      baseAmp * Math.sin(index / 11) +
      burst * (0.55 + Math.random() * 0.35) +
      noise(baseNoise)
    const y =
      baseAmp * Math.cos(index / 14) +
      burst * (0.45 + Math.random() * 0.35) +
      noise(baseNoise)
    const z =
      baseAmp * Math.sin(index / 19) +
      burst * (0.6 + Math.random() * 0.35) +
      noise(baseNoise)

    const temperature =
      38 +
      Math.sin(index / 80) * 6 +
      (env > 0.2 ? 6 * env : 0) +
      index * 0.02 +
      noise(0.12)

    return {
      timestamp: new Date(time).toISOString(),
      x: round(clamp(x, -maxG, maxG), 4),
      y: round(clamp(y, -maxG, maxG), 4),
      z: round(clamp(z, -maxG, maxG), 4),
      temperature: round(clamp(temperature, minTemp, maxTemp), 2)
    }
  })
}
