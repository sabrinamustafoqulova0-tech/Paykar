import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AppleIcon from '@mui/icons-material/Apple'
import AndroidIcon from '@mui/icons-material/Android'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import type { Category, Product } from '../types'
import categoriesData from '../data/categories.json'
import productsData from '../data/products.json'
import { CategoryIcon } from './Icons'
import { ProductCard } from './ProductCard'
import { useAppDispatch } from '../store/hooks'
import { addToCart } from '../store/cartSlice'
import { setSelectedProduct } from '../store/uiSlice'
import { BannerSlider } from './BannerSlider'
import { StoreLocations } from './StoreLocations'
import { SpecialOffers } from './SpecialOffers'
import { ScrollReveal } from './ScrollReveal'

// Custom descriptive text for the bento preview
const CATEGORY_MINI_DESCRIPTIONS: Record<string, string> = {
  'molochnye-produkty': 'Фермерские сыры, йогурты и свежее молоко.',
  'myaso-ptitsa': 'Сочное халяльное мясо и охлажденная птица.',
  'hleb-i-vypechka': 'Хлеб, традиционный нон и горячая выпечка.',
  'frukty-i-ovoshchi': 'Свежие фрукты и овощи из другого измерения.',
  'bakaleya': 'Крупы, макароны высшего качества и масла.',
  'voda-i-napitki': 'Природная вода, натуральные соки и напитки.'
}



// Homepage Bento Card
const HomeBentoCard: React.FC<{ cat: Category; index: number; count: number }> = ({ cat, index, count }) => {
  const navigate = useNavigate()
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    card.style.setProperty('--x', `${x}px`)
    card.style.setProperty('--y', `${y}px`)
  }

  const desc = CATEGORY_MINI_DESCRIPTIONS[cat.slug] || 'Свежие продукты с быстрой доставкой.'

  // Homepage bento layout spans: 1st and 4th cells are larger
  const gridSpan = index === 0 || index === 3 ? 'span 2' : 'span 1'

  return (
    <motion.div
      ref={cardRef}
      className={`home-bento-card-wrapper ${index === 0 || index === 3 ? 'large' : ''} ${isHovered ? 'is-hovered' : ''}`}
      style={{ gridColumn: gridSpan }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/catalog?cat=${cat.id}`)}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
    >
      <div className="bento-card-inner">
        {/* FRONT */}
        <div className="bento-card-front">
          <div className="bento-shimmer" />
          <div className="bento-card-header">
            <div className="bento-icon-box">
              <CategoryIcon slug={cat.slug} fontSize="medium" />
            </div>
            <span className="bento-count-badge">{count} товаров</span>
          </div>
          <div className="bento-card-title-box">
            <h3 className="bento-title">{cat.name}</h3>
            <span className="bento-hint">Наведите для деталей</span>
          </div>
        </div>

        {/* BACK */}
        <div className="bento-card-back">
          <div className="bento-back-glow" />
          <div className="bento-back-content">
            <h4 className="bento-back-title">{cat.name}</h4>
            <p className="bento-back-desc">{desc}</p>
            <div className="bento-action-row" style={{ marginTop: 'auto' }}>
              <span>Смотреть все</span>
              <ArrowForwardIcon fontSize="small" className="bento-arrow" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export const HomeView: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  
  const addToCartFn = (product: any, qty?: number) => dispatch(addToCart({ product, quantity: qty }))
  const setSelectedProductFn = (product: any) => dispatch(setSelectedProduct(product))

  // Momentum Carousel Drag Physics
  const carouselRef = useRef<HTMLDivElement>(null)
  const [carouselWidth, setCarouselWidth] = useState(0)

  useEffect(() => {
    if (carouselRef.current) {
      setCarouselWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth)
    }
  }, [])

  // Trigger recalibration of carousel width on resize
  useEffect(() => {
    const handleResize = () => {
      if (carouselRef.current) {
        setCarouselWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Get item count per category
  const getProductCount = (categoryId: number) => {
    return (productsData as unknown as Product[]).filter(p => p.categoryId === categoryId).length
  }

  // Slice first 6 categories for home bento grid preview
  const homeCategories = (categoriesData as Category[]).slice(0, 6)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="home-view"
    >
      {/* ── Supernatural Hero Section ── */}
      

      {/* ── Banner Slider ── */}
      <ScrollReveal>
        <BannerSlider />
      </ScrollReveal>

      {/* ── Promo Sidebar & Secondary Cards ─────────────────────────────── */}
      <ScrollReveal>
        <div className="home-promo-grid">
          <motion.div 
            whileHover={{ y: -6 }}
            className="promo-card" 
            style={{ backgroundImage: `url('/paykar_mobile_promo.png')` }}
          >
            <div className="promo-card-content">
              <h3 className="promo-card-title">Мобильное приложение</h3>
              <p className="promo-card-desc">Покупки и дисконтная карта Пайкар всегда в вашем смартфоне.</p>
            </div>
            <span className="promo-card-badge">
              <AppleIcon fontSize="inherit" style={{ marginRight: '4px' }} /> AppStore / <AndroidIcon fontSize="inherit" style={{ marginRight: '4px', marginLeft: '4px' }} /> Google Play
            </span>
          </motion.div>

          <motion.div 
            whileHover={{ y: -6 }}
            className="promo-card" 
            style={{ backgroundImage: `url('/paykar_delivery_promo.png')` }}
          >
            <div className="promo-card-content">
              <h3 className="promo-card-title">Режим работы</h3>
              <p className="promo-card-desc">Супермаркеты открыты ежедневно с 08:00 до 00:00.</p>
            </div>
            <span className="promo-card-badge">
              <AccessTimeIcon fontSize="inherit" style={{ marginRight: '4px' }} /> Доставка 9:00 - 21:00
            </span>
          </motion.div>
        </div>
      </ScrollReveal>

      {/* ── Special Offers / Promos ────────────────── */}
      <ScrollReveal>
        <SpecialOffers />
      </ScrollReveal>

      {/* ── Bento Categories Grid Preview ───────────────────────────────── */}
      <ScrollReveal>
        <div className="section-header" style={{ marginTop: '48px' }}>
          <h2 className="section-title">Каталог продуктов</h2>
          <button className="view-all-bento-btn" onClick={() => navigate('/categories')}>
            <span>Все категории</span>
            <ArrowForwardIcon fontSize="small" />
          </button>
        </div>

        <div className="home-categories-bento-grid">
          {homeCategories.map((cat, idx) => {
            const count = getProductCount(cat.id)
            return (
              <HomeBentoCard
                key={cat.id}
                cat={cat}
                index={idx}
                count={count}
              />
            )
          })}
        </div>
      </ScrollReveal>

      {/* ── Featured Products (Horizontal Momentum Carousel) ─────────────── */}
      <ScrollReveal>
        <div className="section-header" style={{ marginTop: '56px' }}>
          <h2 className="section-title">Хиты продаж</h2>
          <div className="section-tab-group">
            <span className="section-tab active">Популярные товары</span>
          </div>
        </div>

        {/* Momentum Drag Carousel Container */}
        <div className="carousel-container-outer" ref={carouselRef}>
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: -carouselWidth }}
            dragElastic={0.2}
            dragTransition={{ bounceStiffness: 400, bounceDamping: 25 }}
            whileTap={{ cursor: 'grabbing' }}
            className="carousel-container-inner"
          >
            {(productsData as unknown as Product[]).slice(0, 10).map(product => (
              <div key={product.id} className="carousel-product-card-wrap">
                <ProductCard
                  product={product}
                  onSelect={setSelectedProductFn}
                  onAddToCart={addToCartFn}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </ScrollReveal>

      {/* ── Store Locations & Yandex Map ── */}
      <ScrollReveal>
        <StoreLocations />
      </ScrollReveal>
    </motion.div>
  )
}
