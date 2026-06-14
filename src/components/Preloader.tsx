import React, { useEffect, useRef, useState } from 'react'

interface PreloaderProps {
  onComplete: () => void
}

interface Particle {
  x: number
  y: number
  targetX: number
  targetY: number
  vx: number
  vy: number
  size: number
  alpha: number
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [showSubText, setShowSubText] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    // Set high-density internal dimensions
    const width = 800
    const height = 400
    canvas.width = width
    canvas.height = height

    // 1. Draw text on a temporary offscreen canvas to scan its pixels
    const offscreenCanvas = document.createElement('canvas')
    offscreenCanvas.width = width
    offscreenCanvas.height = height
    const offCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true })
    if (!offCtx) return

    // Draw the "PAYKAR" text
    const text = 'Пайкар'
    offCtx.fillStyle = '#000000'
    offCtx.font = "900 110px 'Space Grotesk', 'Plus Jakarta Sans', system-ui, sans-serif"
    offCtx.textAlign = 'center'
    offCtx.textBaseline = 'middle'
    offCtx.fillText(text, width / 2, height / 2)

    // Get pixel data
    const imgData = offCtx.getImageData(0, 0, width, height)
    const pixels = imgData.data
    const targets: { x: number; y: number }[] = []

    // Scan pixels with a step of 4 to keep it performant
    const step = 4
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const index = (y * width + x) * 4
        const alpha = pixels[index + 3]
        if (alpha > 128) {
          targets.push({ x, y })
        }
      }
    }

    // Initialize particles
    const particles: Particle[] = []
    const particleCount = targets.length

    for (let i = 0; i < particleCount; i++) {
      const target = targets[i]
      // Start particles from outside the viewport bounds (circular layout)
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 300 + 400
      particles.push({
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        targetX: target.x,
        targetY: target.y,
        vx: 0,
        vy: 0,
        size: Math.random() * 1.5 + 1.2, // size range 1.2 to 2.7
        alpha: 0
      })
    }

    // Animation variables
    let animationFrameId: number
    const startTime = Date.now()
    let arrivedCount = 0
    let assemblingPhase = true

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      const timeElapsed = Date.now() - startTime
      arrivedCount = 0

      // Draw faint backing solid text for depth
      if (timeElapsed > 300) {
        ctx.save()
        ctx.fillStyle = 'rgba(8, 168, 38, 0.04)'
        ctx.font = "900 110px 'Space Grotesk', 'Plus Jakarta Sans', system-ui, sans-serif"
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(text, width / 2, height / 2)
        ctx.restore()
      }

      // Update and render particles
      particles.forEach((p) => {
        const dx = p.targetX - p.x
        const dy = p.targetY - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 2.0) {
          arrivedCount++
        }

        // Spring physics parameters for luxury-feel motion easing
        const stiffness = 0.08
        const friction = 0.82

        const ax = dx * stiffness
        const ay = dy * stiffness

        p.vx = (p.vx + ax) * friction
        p.vy = (p.vy + ay) * friction

        p.x += p.vx
        p.y += p.vy

        // Fade-in particle alpha
        if (p.alpha < 1) {
          p.alpha += 0.05
        }

        // Render particle with high quality neon glow
        ctx.save()
        ctx.fillStyle = `rgba(8, 168, 38, ${p.alpha})`
        ctx.shadowColor = '#08a826'
        ctx.shadowBlur = 3
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // Assembly trigger thresholds
      const targetArrivalRate = 0.88 // 88% particles near destination
      const minDuration = 1400       // at least 1.4s of particle motion

      if (arrivedCount / particleCount >= targetArrivalRate && timeElapsed > minDuration) {
        if (assemblingPhase) {
          assemblingPhase = false
          setShowSubText(true)
          
          // Trigger transition out sequence
          setTimeout(() => {
            setFadeOut(true)
          }, 1100)

          // Call onComplete when fully collapsed
          setTimeout(() => {
            onComplete()
          }, 1500)
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [onComplete])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#ffffff',
        zIndex: 9999999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: fadeOut ? 0 : 1,
        transform: fadeOut ? 'scale(1.02)' : 'scale(1)',
        pointerEvents: fadeOut ? 'none' : 'all'
      }}
    >
      <img style={{width:"180px", marginBottom:"-100px"}} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9cttNLlTRqqo2xEJvjHs5yL3Gd3HvOwhJQf3HUkMXoKQsRevPoOAHdJcX&s=10" alt="" />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: '90%', maxWidth: '650px' }}>
        {/* Particle Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: 'auto',
            aspectRatio: '2/1'
          }}
        />

        
      </div>
    </div>
  )
}
