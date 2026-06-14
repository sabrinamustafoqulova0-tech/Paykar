import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import BoltIcon from '@mui/icons-material/Bolt'

interface Promotion {
  id: number
  title: string
  dateText: string
  targetDate: Date
  imageUrl: string
  color: string
}

// Live ticking timers using target end dates relative to current date (in June/July 2026)
const now = new Date()
const promotionsData: Promotion[] = [
  {
    id: 1,
    title: 'Акция в честь священного праздника Иди Курбон',
    dateText: 'с 23 мая по 26 июня',
    targetDate: new Date(now.getTime() + (13 * 24 * 60 + 9 * 60 + 33) * 60 * 1000), 
    imageUrl: 'https://paykar.shop/upload/iblock/ddb/2esfdk0hx9pj5gksz4rw8z8lmslxiejw.jpg',
    color: '#009640'
  },
  {
    id: 2,
    title: 'Объединим усилия ради детей!',
    dateText: 'с 18 мая по 18 июня',
    targetDate: new Date(now.getTime() + (4 * 24 * 60 + 22 * 60 + 33) * 60 * 1000), 
    imageUrl: 'https://paykar.shop/upload/iblock/c04/5brdg8ndb6qthrjv592fwxe3kbz27061.jpg',
    color: '#3b82f6'
  },
  {
    id: 3,
    title: 'Акция «2+1» от Увелка!',
    dateText: 'с 11 по 30 июня',
    targetDate: new Date(now.getTime() + (17 * 24 * 60 + 14 * 60 + 58) * 60 * 1000), 
    imageUrl: 'https://paykar.shop/upload/iblock/e71/z9oszjeecwwrvszat9ps8oue5pf9fsfv.jpg',
    color: '#f97316'
  },
  {
    id: 4,
    title: 'FIFA Комбо-акция в «Пайкар»!',
    dateText: 'с 13 июня по 19 июля',
    targetDate: new Date(now.getTime() + (35 * 24 * 60 + 8 * 60 + 12) * 60 * 1000), 
    imageUrl: 'https://paykar.shop/upload/iblock/f63/jenii7402gjemvweoaz6251gb5zexnnr.jpg',
    color: '#dc2626'
  }
]

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 80, damping: 15 } }
}

const TimerCountdown: React.FC<{ targetDate: Date }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTime = () => {
      const difference = +targetDate - +new Date()
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      })
    }

    calculateTime()
    const timer = setInterval(calculateTime, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="promo-timer-badge">
      <span className="timer-unit">{timeLeft.days}д</span>
      <span className="timer-colon">:</span>
      <span className="timer-unit">{timeLeft.hours}ч</span>
      <span className="timer-colon">:</span>
      <span className="timer-unit">{timeLeft.minutes}м</span>
    </div>
  )
}

export const SpecialOffers: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="special-offers-section">
      <div className="section-header">
        <h2 className="section-title">Выгодные предложения</h2>
        <button className="view-all-link" onClick={() => navigate('/promotions')}>
          ВСЕ АКЦИИ
        </button>
      </div>

      <motion.div 
        className="special-offers-grid"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.12 }
          }
        }}
      >
        {promotionsData.map((promo) => (
          <motion.div
            key={promo.id}
            variants={cardVariants}
            className="special-offer-card"
            onClick={() => navigate('/promotions')}
          >
            <div className="promo-image-wrapper">
              <img src={promo.imageUrl} alt={promo.title} className="promo-banner-img" />
              <div className="promo-overlay-gradient" />
              <div className="promo-shimmer-sweep" />

              <TimerCountdown targetDate={promo.targetDate} />
              
              <div className="promo-category-badge" style={{ backgroundColor: promo.color }}>
                Акции Пайкар
              </div>
            </div>

            <div className="promo-card-footer">
              <div className="promo-date-row">
                <BoltIcon className="promo-date-icon" />
                <span>{promo.dateText}</span>
              </div>
              <h3 className="promo-card-title-text">{promo.title}</h3>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
