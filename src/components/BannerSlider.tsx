import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import bannersData from '../data/banners.json'

interface Banner {
  id: number
  title: string
  subtitle: string
  buttonText: string
  buttonLink: string
  image: string
  bgColor: string
  isActive: boolean
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
}

const contentVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.08,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
    }
  })
}

export const BannerSlider: React.FC = () => {
  const navigate = useNavigate()
  const activeBanners = bannersData.filter(b => b.isActive) as Banner[]
  
  const [[page, direction], setPage] = useState([0, 0])
  const [isHovered, setIsHovered] = useState(false)

  const paginate = useCallback((newDirection: number) => {
    setPage(([prevPage]) => {
      let nextPage = prevPage + newDirection
      if (nextPage < 0) nextPage = activeBanners.length - 1
      if (nextPage >= activeBanners.length) nextPage = 0
      return [nextPage, newDirection]
    })
  }, [activeBanners.length])

  // Autoplay
  useEffect(() => {
    if (isHovered) return
    const timer = setInterval(() => {
      paginate(1)
    }, 6000)
    return () => clearInterval(timer)
  }, [paginate, isHovered])

  const activeIndex = ((page % activeBanners.length) + activeBanners.length) % activeBanners.length
  const currentBanner = activeBanners[activeIndex]

  if (activeBanners.length === 0) return null

  return (
    <div 
      className="banner-slider-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={page}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 }
          }}
          className="banner-slide"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.75) 30%, rgba(0, 0, 0, 0.2) 100%), url(${currentBanner.image})`
          }}
        >
          <div className="banner-slide-content">
            <motion.span 
              custom={0}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="banner-badge"
              style={{ backgroundColor: currentBanner.bgColor }}
            >
              Пайкар Доставка
            </motion.span>
            
            <motion.h1 
              custom={1}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="banner-title"
            >
              {currentBanner.title}
            </motion.h1>
            
            <motion.p 
              custom={2}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="banner-subtitle"
            >
              {currentBanner.subtitle}
            </motion.p>
            
            <motion.button 
              custom={3}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05, backgroundColor: 'var(--primary-green-hover)' }}
              whileTap={{ scale: 0.95 }}
              className="banner-btn"
              onClick={() => {
                if (currentBanner.buttonLink.startsWith('http')) {
                  window.open(currentBanner.buttonLink, '_blank')
                } else {
                  navigate(currentBanner.buttonLink)
                }
              }}
            >
              {currentBanner.buttonText}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button 
        className="banner-arrow left" 
        onClick={() => paginate(-1)} 
        aria-label="Previous Slide"
      >
        <KeyboardArrowLeftIcon fontSize="large" />
      </button>
      <button 
        className="banner-arrow right" 
        onClick={() => paginate(1)} 
        aria-label="Next Slide"
      >
        <KeyboardArrowRightIcon fontSize="large" />
      </button>

      {/* Slide Indicators / Dots */}
      <div className="banner-dots">
        {activeBanners.map((_, index) => (
          <button
            key={index}
            className={`banner-dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => {
              const dir = index > activeIndex ? 1 : -1
              setPage([index, dir])
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
