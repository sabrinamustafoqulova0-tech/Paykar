import React from 'react'
import { motion } from 'framer-motion'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'

export const SupernaturalHero: React.FC = () => {
  // Scroll to catalog handler
  const handleScrollToCatalog = () => {
    const section = document.querySelector('.section-header')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Float animation preset
  const floatTransition = (duration: number, delay: number) => ({
    duration,
    repeat: Infinity,
    repeatType: 'reverse' as const,
    ease: 'easeInOut' as const,
    delay
  })

  // Title words for blur reveal
  const titleWords = "Доставка продуктов питания на дом и в офис".split(" ")

  return (
    <div className="supernatural-hero-container" style={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* Premium Ken Burns background image */}
      <motion.div
        initial={{ scale: 1.0 }}
        animate={{ scale: 1.06 }}
        transition={{ duration: 10, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url("/paykar_store_interior.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
          filter: 'blur(1px) brightness(0.95)',
          zIndex: 1
        }}
      />

      <div className="hero-flex" style={{ position: 'relative', zIndex: 2 }}>
        {/* Left Side text */}
        <div className="hero-text-block">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="hero-badge"
          >
            <AutoAwesomeIcon fontSize="inherit" style={{ color: 'var(--primary-green)', marginRight: '6px' }} />
            <span>ОНЛАЙН СУПЕРМАРКЕТ PAYKAR</span>
          </motion.div>

          {/* Premium word-by-word blur-reveal */}
          <h1 className="hero-title" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.22em 0.18em' }}>
            {titleWords.map((word, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, filter: 'blur(8px)', y: 12 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.1 + idx * 0.05
                }}
                style={{ display: 'inline-block' }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="hero-subtitle"
            style={{ fontSize: '1.25rem', fontWeight: 500 }}
          >
            г. Душанбе — быстро, свежо, удобно
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="hero-btn-row"
            style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
          >
            <motion.button 
              className="supernatural-btn secondary" 
              style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)' }} 
              onClick={() => window.dispatchEvent(new CustomEvent('open-call-request'))}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            >
              <span>Заказать звонок</span>
            </motion.button>
            
            <motion.button 
              className="supernatural-btn" 
              onClick={handleScrollToCatalog}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            >
              <span>В каталог</span>
              <ArrowDownwardIcon fontSize="small" className="btn-arrow" />
            </motion.button>
          </motion.div>
        </div>

        {/* Right Side: Organic gently floating products */}
        <div className="hero-canvas-block" style={{ position: 'relative', minHeight: '450px' }}>
          <motion.img
            src="/hero_apple.png"
            alt="Свежее яблоко"
            animate={{ y: [-12, 12], rotate: [-2, 2] }}
            transition={floatTransition(5.5, 0)}
            style={{
              position: 'absolute',
              top: '15%',
              left: '12%',
              width: '130px',
              height: 'auto',
              filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.12))',
              zIndex: 3
            }}
          />
          <motion.img
            src="/hero_milk.png"
            alt="Натуральное молоко"
            animate={{ y: [12, -12], rotate: [3, -3] }}
            transition={floatTransition(6.5, 0.4)}
            style={{
              position: 'absolute',
              top: '25%',
              right: '12%',
              width: '135px',
              height: 'auto',
              filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.12))',
              zIndex: 2
            }}
          />
          <motion.img
            src="/hero_avocado.png"
            alt="Авокадо"
            animate={{ y: [-10, 10], rotate: [-4, 4] }}
            transition={floatTransition(5.8, 0.8)}
            style={{
              position: 'absolute',
              bottom: '12%',
              left: '38%',
              width: '120px',
              height: 'auto',
              filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.12))',
              zIndex: 4
            }}
          />
        </div>
      </div>
    </div>
  )
}
