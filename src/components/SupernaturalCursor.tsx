import React, { useEffect, useRef } from 'react'

export const SupernaturalCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Accessibility check: prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    // Touch device check: do not show custom cursor on tablets/phones
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouchDevice) {
      return
    }

    // Hide standard cursor on body
    document.body.style.cursor = 'none'
    
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let animationFrameId: number

    let mouse = { x: -100, y: -100 }
    let smoothMouse = { x: -100, y: -100 }
    let isHoveringInteractive = false

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const interactive = target.closest('button, a, .product-card, .promo-card, .special-offer-card, .bento-card-inner') as HTMLElement
      
      let x = e.clientX
      let y = e.clientY

      if (interactive) {
        isHoveringInteractive = true
        // Magnetic pull: pull cursor coordinates 15% closer to the center of the interactive element
        const rect = interactive.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        
        const dx = centerX - x
        const dy = centerY - y
        
        // Pull distance capped at ~12px max
        const dist = Math.hypot(dx, dy)
        if (dist > 0) {
          const pull = Math.min(12, dist * 0.15)
          x += (dx / dist) * pull
          y += (dy / dist) * pull
        }
      } else {
        isHoveringInteractive = false
      }

      mouse.x = x
      mouse.y = y
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)

    // Retrieve theme colors
    const getPrimaryColor = () => {
      const style = getComputedStyle(document.documentElement)
      return style.getPropertyValue('--primary-green').trim() || '#08a826'
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      // Smooth mouse interpolation for outer ring delay (high damping for premium feel)
      const dx = mouse.x - smoothMouse.x
      const dy = mouse.y - smoothMouse.y
      smoothMouse.x += dx * 0.22
      smoothMouse.y += dy * 0.22

      const primary = getPrimaryColor()

      // Draw custom pointer (only if cursor on screen)
      if (mouse.x > 0 && mouse.y > 0) {
        // Target values based on hover state
        const outerRadius = isHoveringInteractive ? 16 : 8
        const outerOpacity = isHoveringInteractive ? 0.45 : 0.25
        
        // Outer glowing delay ring (Apple/Stripe style)
        ctx.save()
        ctx.beginPath()
        ctx.arc(smoothMouse.x, smoothMouse.y, outerRadius, 0, Math.PI * 2)
        ctx.strokeStyle = primary
        ctx.lineWidth = 1.5
        ctx.globalAlpha = outerOpacity
        ctx.stroke()
        ctx.restore()

        // Inner solid core dot
        ctx.save()
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2)
        ctx.fillStyle = primary
        ctx.globalAlpha = 0.9
        ctx.fill()
        ctx.restore()
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      document.body.style.cursor = 'auto'
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        pointerEvents: 'none',
        display: 'block'
      }}
    />
  )
}
