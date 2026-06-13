import React from 'react'
import { motion } from 'framer-motion'

interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: 90, 
        scale: 0.92,
        rotateX: 12,
        z: -50
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        rotateX: 0,
        z: 0
      }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        type: 'spring',
        stiffness: 60,
        damping: 14,
        mass: 0.9,
        delay: delay
      }}
      style={{ 
        transformOrigin: 'center top',
        perspective: '1200px',
        backfaceVisibility: 'hidden',
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </motion.div>
  )
}
