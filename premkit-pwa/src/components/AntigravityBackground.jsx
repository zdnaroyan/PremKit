import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

// Google Antigravity prism spectrum around the radial ring (0 = 12 o'clock, clockwise)
const COLOR_STOPS = [
  { t: 0.0, r: 26, g: 115, b: 232 },   // 12:00 Vivid Electric Blue
  { t: 0.11, r: 58, g: 96, b: 232 },   // 1:20 Royal Cobalt-Indigo
  { t: 0.21, r: 112, g: 74, b: 206 },  // 2:30 Iris Violet
  { t: 0.32, r: 174, g: 58, b: 146 },  // 3:50 Plum-Magenta
  { t: 0.41, r: 228, g: 66, b: 62 },   // 4:55 Coral-Red
  { t: 0.47, r: 244, g: 134, b: 34 },  // 5:40 Warm Tangerine
  { t: 0.53, r: 236, g: 178, b: 24 },  // 6:20 Golden Amber Yellow
  { t: 0.61, r: 216, g: 86, b: 84 },   // 7:20 Warm Rose-Coral
  { t: 0.7, r: 156, g: 60, b: 148 },   // 8:25 Berry-Magenta
  { t: 0.8, r: 98, g: 78, b: 212 },    // 9:35 Violet-Indigo
  { t: 0.9, r: 44, g: 102, b: 238 },   // 10:45 Cobalt Blue
  { t: 1.0, r: 26, g: 115, b: 232 },   // 12:00 Wrap back to Electric Blue
]

function samplePrismColor(angleRad, timeSec, hueJitter) {
  let u = (angleRad + Math.PI * 0.5 + hueJitter + Math.sin(timeSec * 0.16) * 0.09) / (Math.PI * 2)
  u = ((u % 1) + 1) % 1

  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    const a = COLOR_STOPS[i]
    const b = COLOR_STOPS[i + 1]
    if (u >= a.t && u <= b.t) {
      const f = (u - a.t) / (b.t - a.t)
      return [
        Math.round(a.r + (b.r - a.r) * f),
        Math.round(a.g + (b.g - a.g) * f),
        Math.round(a.b + (b.b - a.b) * f),
      ]
    }
  }
  return [26, 115, 232]
}

function getResponsiveConfig(width, height) {
  if (width < 640) {
    // Smartphone (HP)
    return {
      spacing: 40,
      baseRadius: Math.max(138, Math.min(width * 0.4, height * 0.25, 190)),
      dashScale: 0.84,
      idleAmpX: width * 0.14,
      idleAmpY: height * 0.09,
    }
  }
  if (width < 1024) {
    // Tablet
    return {
      spacing: 46,
      baseRadius: Math.max(210, Math.min(width * 0.35, height * 0.34, 285)),
      dashScale: 0.94,
      idleAmpX: width * 0.13,
      idleAmpY: height * 0.1,
    }
  }
  // Laptop / Desktop
  return {
    spacing: 52,
    baseRadius: Math.max(260, Math.min(width * 0.3, height * 0.44, 345)),
    dashScale: 1.0,
    idleAmpX: width * 0.12,
    idleAmpY: height * 0.1,
  }
}

// Airy staggered hexagonal lattice with controlled organic jitter (zero clumping)
function createParticles(width, height, spacing) {
  const rowHeight = spacing * 0.866
  const cols = Math.ceil(width / spacing) + 3
  const rows = Math.ceil(height / rowHeight) + 3
  const startX = (width - (cols - 1) * spacing) * 0.5
  const startY = (height - (rows - 1) * rowHeight) * 0.5

  const cx = width * 0.5
  const cy = height * 0.48
  const list = []

  for (let r = 0; r < rows; r++) {
    const rowShift = r % 2 === 1 ? spacing * 0.5 : 0
    for (let c = 0; c < cols; c++) {
      const jitterX = (Math.random() - 0.5) * spacing * 0.62
      const jitterY = (Math.random() - 0.5) * rowHeight * 0.62
      const baseX = startX + c * spacing + rowShift + jitterX
      const baseY = startY + r * rowHeight + jitterY

      const dx = baseX - cx
      const dy = baseY - cy
      const d = Math.hypot(dx, dy) || 1

      list.push({
        baseX,
        baseY,
        x: baseX,
        y: baseY,
        dirX: dx / d,
        dirY: dy / d,
        energy: 0,
        sizeScale: 0.82 + Math.random() * 0.36,
        lengthScale: 0.8 + Math.random() * 0.42,
        hueJitter: (Math.random() - 0.5) * 0.16,
        ambientRadius: 0.55 + Math.random() * 0.32,
        phaseOffset: (Math.random() - 0.5) * 0.45,
      })
    }
  }
  return list
}

export default function AntigravityBackground() {
  const canvasRef = useRef(null)
  const pulseRef = useRef(0)
  const { pathname } = useLocation()
  const prevPathRef = useRef(pathname)

  // Gentle smooth wave pulse when navigating between pages
  useEffect(() => {
    if (pathname !== prevPathRef.current) {
      prevPathRef.current = pathname
      pulseRef.current = Math.min(1, pulseRef.current + 0.55)
    }
  }, [pathname])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let width = window.innerWidth
    let height = window.innerHeight
    let lastGridWidth = width
    let lastGridHeight = height
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let cfg = getResponsiveConfig(width, height)
    let particles = createParticles(width, height, cfg.spacing)

    // Critically damped spring state for silky C2-continuous cursor tracking
    let focusX = width * 0.5
    let focusY = height * 0.48
    let focusVx = 0
    let focusVy = 0
    let pointerInfluence = 0

    const pointer = {
      x: width * 0.5,
      y: height * 0.48,
      active: false,
      lastMoveTime: 0,
    }

    const applyCanvasSize = (forceRebuild = false) => {
      const nextW = window.innerWidth
      const nextH = window.innerHeight
      const nextDpr = Math.min(window.devicePixelRatio || 1, 2)

      // Avoid regenerating grid on minor mobile browser address-bar height changes
      const significantResize =
        forceRebuild ||
        nextW !== lastGridWidth ||
        Math.abs(nextH - lastGridHeight) > 130

      width = nextW
      height = nextH
      dpr = nextDpr
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cfg = getResponsiveConfig(width, height)

      if (significantResize) {
        lastGridWidth = width
        lastGridHeight = height
        particles = createParticles(width, height, cfg.spacing)
        focusX = Math.min(width, Math.max(0, focusX))
        focusY = Math.min(height, Math.max(0, focusY))
      }
    }

    applyCanvasSize(true)

    const updatePointer = (x, y) => {
      pointer.x = x
      pointer.y = y
      pointer.active = true
      pointer.lastMoveTime = performance.now()
    }

    const onPointerMove = (e) => {
      updatePointer(e.clientX, e.clientY)
    }

    const onTouchStart = (e) => {
      const touch = e.touches && e.touches[0]
      if (!touch) return
      updatePointer(touch.clientX, touch.clientY)
    }

    const onTouchMove = (e) => {
      const touch = e.touches && e.touches[0]
      if (!touch) return
      updatePointer(touch.clientX, touch.clientY)
    }

    const onPointerDown = (e) => {
      if (typeof e.clientX === 'number' && typeof e.clientY === 'number') {
        updatePointer(e.clientX, e.clientY)
      }
      pulseRef.current = Math.min(1, pulseRef.current + 0.42)
    }

    const onPointerLeave = () => {
      pointer.active = false
    }

    const onResize = () => applyCanvasSize(false)
    const onOrientationChange = () => applyCanvasSize(true)

    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('orientationchange', onOrientationChange, { passive: true })
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    document.addEventListener('mouseleave', onPointerLeave)

    // Critically damped spring constants (smooth acceleration & zero overshoot)
    const SPRING_K = 14.5
    const SPRING_D = 7.62 // ~2 * sqrt(SPRING_K)

    const renderFrame = (timeSec, dt, isStatic = false) => {
      ctx.clearRect(0, 0, width, height)

      // Smoothly decay route/tap ripple impulse
      if (!isStatic && pulseRef.current > 0.001) {
        pulseRef.current *= Math.exp(-1.55 * dt)
      } else if (pulseRef.current <= 0.001) {
        pulseRef.current = 0
      }

      // Serene autonomous orbital drift when pointer is idle/offscreen
      const idleX =
        width * 0.5 +
        Math.cos(timeSec * 0.28) * cfg.idleAmpX +
        Math.sin(timeSec * 0.16) * (cfg.idleAmpX * 0.35)
      const idleY =
        height * 0.48 +
        Math.sin(timeSec * 0.22) * cfg.idleAmpY +
        Math.cos(timeSec * 0.33) * (cfg.idleAmpY * 0.32)

      const nowMs = performance.now()
      const recentlyActive = pointer.active && nowMs - pointer.lastMoveTime < 5000
      const targetInfluence = recentlyActive ? 1 : 0
      const influenceLerp = isStatic ? 0 : 1 - Math.exp(-(recentlyActive ? 3.8 : 0.75) * dt)
      pointerInfluence += (targetInfluence - pointerInfluence) * influenceLerp

      // Subtle living breath around stationary cursor
      const breathX = Math.sin(timeSec * 0.52) * 8
      const breathY = Math.cos(timeSec * 0.43) * 8

      const targetX = idleX * (1 - pointerInfluence) + (pointer.x + breathX) * pointerInfluence
      const targetY = idleY * (1 - pointerInfluence) + (pointer.y + breathY) * pointerInfluence

      if (isStatic) {
        focusX = width * 0.5
        focusY = height * 0.48
        focusVx = 0
        focusVy = 0
      } else {
        const ax = (targetX - focusX) * SPRING_K - focusVx * SPRING_D
        const ay = (targetY - focusY) * SPRING_K - focusVy * SPRING_D
        focusVx += ax * dt
        focusVy += ay * dt
        focusX += focusVx * dt
        focusY += focusVy * dt
      }

      const focusSpeed = Math.min(750, Math.hypot(focusVx, focusVy))
      const speedRatio = focusSpeed / 750
      const activeRadius = cfg.baseRadius + pulseRef.current * 24 + speedRatio * 16

      const posLerp = isStatic ? 1 : 1 - Math.exp(-4.6 * dt)
      const energyLerp = isStatic ? 1 : 1 - Math.exp(-5.4 * dt)
      const dirLerp = isStatic ? 1 : 1 - Math.exp(-6.8 * dt)
      const globalBreath = Math.sin(timeSec * 0.48) * 0.032

      ctx.lineCap = 'round'

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Spatially coherent low-frequency fluid wave field (particles glide together like silk)
        let homeX = p.baseX
        let homeY = p.baseY
        if (!isStatic) {
          const f1 = p.baseX * 0.0052 + p.baseY * 0.003 - timeSec * 0.46 + p.phaseOffset
          const f2 = p.baseX * 0.0026 - p.baseY * 0.005 + timeSec * 0.36
          homeX += Math.sin(f1) * 7.5 + Math.cos(f2) * 4.2
          homeY += Math.cos(f1 * 0.88) * 7.5 + Math.sin(f2) * 4.2
        }

        const hdx = homeX - focusX
        const hdy = homeY - focusY
        const hDist = Math.hypot(hdx, hdy) || 0.001
        const hAngle = Math.atan2(hdy, hdx)

        // Organic low-harmonic undulating ring silhouette (exact Antigravity fluid wave shape)
        const contourMod =
          1 +
          Math.sin(hAngle * 2 - timeSec * 0.34) * 0.092 +
          Math.cos(hAngle * 3 + timeSec * 0.24) * 0.062 +
          globalBreath

        const localR = activeRadius * contourMod
        const delta = hDist - localR
        // Crisp inner calm eye & soft natural outer taper
        const sigma = delta < 0 ? localR * 0.29 : localR * 0.39
        const ringEnv = Math.exp(-(delta * delta) / (2 * sigma * sigma))

        // Broad, slow outward-propagating concentric Antigravity swell wave
        const swellPhase = hDist * 0.0145 - timeSec * 0.96
        const swell = Math.sin(swellPhase)
        const ux = hdx / hDist
        const uy = hdy / hDist

        // Smooth radial magnetic lift & gentle inertial drag from cursor movement
        const radialLift = (swell * 12.5 - delta * 0.085) * ringEnv
        const desiredX = homeX + ux * radialLift + focusVx * 0.02 * ringEnv
        const desiredY = homeY + uy * radialLift + focusVy * 0.02 * ringEnv

        p.x += (desiredX - p.x) * posLerp
        p.y += (desiredY - p.y) * posLerp

        // Smooth orientation vector interpolation (guarantees zero 180° snap near cursor center)
        const dx = p.x - focusX
        const dy = p.y - focusY
        const dist = Math.hypot(dx, dy)
        if (dist > 10) {
          const tx = dx / dist
          const ty = dy / dist
          p.dirX += (tx - p.dirX) * dirLerp
          p.dirY += (ty - p.dirY) * dirLerp
          const dirMag = Math.hypot(p.dirX, p.dirY) || 1
          p.dirX /= dirMag
          p.dirY /= dirMag
        }

        // Smooth wave-modulated particle energy (size, dash length & opacity)
        const waveMod = 0.8 + 0.2 * (swell * 0.5 + 0.5)
        const targetEnergy = Math.min(
          1,
          ringEnv * waveMod * (1 + pulseRef.current * 0.16 + speedRatio * 0.1),
        )
        p.energy += (targetEnergy - p.energy) * energyLerp

        const renderAngle = Math.atan2(p.dirY, p.dirX)
        const [r, g, b] = samplePrismColor(renderAngle, timeSec, p.hueJitter)

        if (p.energy < 0.055) {
          // Delicate sparse micro-dots outside the ring & inside the calm center eye
          const microAlpha = 0.12 + p.energy * 2.0
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${microAlpha.toFixed(3)})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.ambientRadius * cfg.dashScale, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // Slim, airy radially oriented rounded capsule / dash
          const shaped = Math.pow(p.energy, 0.92)
          const halfLen = shaped * 3.85 * p.lengthScale * cfg.dashScale
          const thickness = (0.85 + shaped * 1.48) * p.sizeScale * cfg.dashScale
          const alpha = Math.min(0.92, 0.18 + shaped * 0.74)

          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`
          ctx.lineWidth = thickness
          ctx.beginPath()
          ctx.moveTo(p.x - p.dirX * halfLen, p.y - p.dirY * halfLen)
          ctx.lineTo(p.x + p.dirX * halfLen, p.y + p.dirY * halfLen)
          ctx.stroke()
        }
      }
    }

    let rafId = 0
    let lastTs = performance.now()
    let elapsedSec = 0

    const loop = (ts) => {
      const dt = Math.min(0.04, Math.max(0.001, (ts - lastTs) / 1000))
      lastTs = ts
      elapsedSec += dt
      renderFrame(elapsedSec, dt, false)
      rafId = requestAnimationFrame(loop)
    }

    const start = () => {
      cancelAnimationFrame(rafId)
      if (reducedMotionQuery.matches) {
        renderFrame(1.2, 0.016, true)
        return
      }
      lastTs = performance.now()
      rafId = requestAnimationFrame(loop)
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId)
      } else {
        start()
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    reducedMotionQuery.addEventListener?.('change', start)
    start()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onOrientationChange)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('mouseleave', onPointerLeave)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      reducedMotionQuery.removeEventListener?.('change', start)
    }
  }, [])

  return <canvas ref={canvasRef} className="antigravity-bg" aria-hidden="true" />
}
