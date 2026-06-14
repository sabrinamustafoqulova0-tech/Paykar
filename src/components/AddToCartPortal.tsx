import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FlyingItem {
  id: number
  startX: number
  startY: number
  targetX: number
  targetY: number
  image: string
}

export const AddToCartPortal: React.FC = () => {
  const [items, setItems] = useState<FlyingItem[]>([])

  useEffect(() => {
    const handleAddToCartAnim = (e: Event) => {
      const customEvent = e as CustomEvent<{ x: number; y: number; image: string }>
      if (!customEvent.detail) return

      const { x: startX, y: startY, image } = customEvent.detail

      // Find cart destination coords
      let targetX = window.innerWidth - 80
      let targetY = window.innerHeight - 80

      const stickyCart = document.querySelector('.floating-cart-bubble')
      const headerCart = document.querySelector('.action-btn-unified.cart-btn')

      if (stickyCart) {
        const rect = stickyCart.getBoundingClientRect()
        targetX = rect.left + rect.width / 2
        targetY = rect.top + rect.height / 2
      } else if (headerCart) {
        const rect = headerCart.getBoundingClientRect()
        targetX = rect.left + rect.width / 2
        targetY = rect.top + rect.height / 2
      }

      const newItem: FlyingItem = {
        id: Date.now() + Math.random(),
        startX,
        startY,
        targetX,
        targetY,
        image
      }

      setItems((prev) => [...prev, newItem])
    }

    window.addEventListener('add-to-cart-animation', handleAddToCartAnim)
    return () => {
      window.removeEventListener('add-to-cart-animation', handleAddToCartAnim)
    }
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, pointerEvents: 'none' }}>
      <AnimatePresence>
        {items.map((item) => (
          <motion.img
            key={item.id}
            src={item.image}
            alt="Добавляемый товар"
            initial={{
              position: 'fixed',
              top: item.startY,
              left: item.startX,
              width: 50,
              height: 50,
              borderRadius: '12px',
              border: '2px solid var(--primary-green)',
              backgroundColor: '#ffffff',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              transform: 'translate(-50%, -50%)',
              scale: 0.8,
              opacity: 1,
              zIndex: 99999
            }}
            animate={{
              top: item.targetY,
              left: item.targetX,
              scale: 0.15,
              opacity: 0.5
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.65,
              ease: [0.16, 1, 0.3, 1]
            }}
            onAnimationComplete={() => {
              // Trigger cart bounce
              const event = new CustomEvent('cart-bounce')
              window.dispatchEvent(event)
              // Remove item from list
              setItems((prev) => prev.filter((i) => i.id !== item.id))
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
