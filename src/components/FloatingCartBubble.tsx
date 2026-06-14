import React, { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useAppSelector } from '../store/hooks'
import { selectCartItemCount } from '../store/cartSlice'

interface FloatingCartBubbleProps {
  onClick: () => void
}

export const FloatingCartBubble: React.FC<FloatingCartBubbleProps> = ({ onClick }) => {
  const cartCount = useAppSelector(selectCartItemCount)
  const controls = useAnimation()
  const [isBouncing, setIsBouncing] = useState(false)

  useEffect(() => {
    const handleBounce = () => {
      if (isBouncing) return
      setIsBouncing(true)
      
      // Bouncy feedback scale sequence
      controls.start({
        scale: [1, 1.12, 1],
        transition: { type: 'spring', stiffness: 100, damping: 15, duration: 0.4 }
      }).then(() => {
        setIsBouncing(false)
      })
    }

    window.addEventListener('cart-bounce', handleBounce)
    return () => window.removeEventListener('cart-bounce', handleBounce)
  }, [controls, isBouncing])

  // If there are no items, we can still show a subtle dormant state or hide it. 
  // Let's show it with an opacity of 0.85 when count > 0, and hide/make it scale down when 0 for maximum dynamic feel.
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: cartCount > 0 ? 1 : 0, 
        opacity: cartCount > 0 ? 1 : 0 
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="floating-cart-bubble-container"
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        zIndex: 9999
      }}
    >
      <motion.button
        animate={controls}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className="floating-cart-bubble"
      >
        <ShoppingCartIcon className="cart-bubble-icon" />
        
        {/* Count Badge */}
        {cartCount > 0 && (
          <span className="cart-bubble-badge">
            {cartCount}
          </span>
        )}
      </motion.button>
    </motion.div>
  )
}
