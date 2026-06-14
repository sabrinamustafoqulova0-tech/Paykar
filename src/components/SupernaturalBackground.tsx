import React, { useEffect, useRef } from 'react'

export const SupernaturalBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    // Handle Resize & Retina
    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Get color from custom properties
    const getThemeColors = () => {
      const style = getComputedStyle(document.documentElement)
      const primary = style.getPropertyValue('--primary-green').trim() || '#08a826'
      const isDark = document.documentElement.getAttribute('data-theme') === 'midnight' || 
                     document.documentElement.getAttribute('data-theme') === 'cyber'
      return { primary, isDark }
    }

    // Nebula blob animation state
    let nebulaTime = 0
    const blobs = [
      { x: 0.25, y: 0.3, radius: 0.35, baseColor: 'rgba(8, 168, 38, 0.04)', colorOverride: null, speedX: 0.0007, speedY: 0.0005, phaseX: 0, phaseY: Math.PI / 4 },
      { x: 0.75, y: 0.7, radius: 0.4, baseColor: 'rgba(99, 102, 241, 0.03)', colorOverride: 'rgba(139, 92, 246, 0.035)', speedX: 0.0004, speedY: 0.0008, phaseX: Math.PI, phaseY: 0 },
      { x: 0.5, y: 0.5, radius: 0.3, baseColor: 'rgba(236, 72, 153, 0.02)', colorOverride: 'rgba(6, 182, 212, 0.025)', speedX: 0.0006, speedY: 0.0004, phaseX: Math.PI / 2, phaseY: Math.PI / 3 }
    ]

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      
      const { isDark } = getThemeColors()
      
      // Draw background space backdrop gradient
      const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, Math.max(width, height))
      if (isDark) {
        bgGrad.addColorStop(0, '#0a0915')
        bgGrad.addColorStop(1, '#020105')
      } else {
        bgGrad.addColorStop(0, '#fafaf9')
        bgGrad.addColorStop(1, '#f1f1ee')
      }
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, width, height)

      // Draw Nebula blobs
      nebulaTime += 0.002
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      
      blobs.forEach((blob) => {
        // Slowly update positions
        const curX = (blob.x + Math.sin(nebulaTime * 5 + blob.phaseX) * 0.08) * width
        const curY = (blob.y + Math.cos(nebulaTime * 5 + blob.phaseY) * 0.08) * height
        const radius = blob.radius * Math.max(width, height)
        
        // Custom color depending on current active theme preset
        let colorStr = blob.baseColor
        const themeId = document.documentElement.getAttribute('data-theme') || 'nature'
        
        if (themeId === 'cyber') {
          colorStr = blob.colorOverride || 'rgba(236, 72, 153, 0.08)'
        } else if (themeId === 'gold') {
          colorStr = 'rgba(217, 119, 6, 0.05)'
        } else {
          // Nature or Midnight
          if (blob.baseColor.includes('8, 168, 38')) {
            colorStr = `rgba(8, 168, 38, ${isDark ? '0.09' : '0.04'})`
          } else {
            colorStr = `rgba(16, 185, 129, ${isDark ? '0.06' : '0.03'})`
          }
        }

        const grad = ctx.createRadialGradient(curX, curY, 0, curX, curY, radius)
        grad.addColorStop(0, colorStr)
        grad.addColorStop(0.5, colorStr.replace('0.0', '0.02'))
        grad.addColorStop(1, 'rgba(0,0,0,0)')

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(curX, curY, radius, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.restore()

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
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
        zIndex: -10,
        pointerEvents: 'none',
        display: 'block'
      }}
    />
  )
}
