import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AppleIcon from '@mui/icons-material/Apple'
import AndroidIcon from '@mui/icons-material/Android'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

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

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
} as const

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
} as const


export const HomeView: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  
  const addToCartFn = (product: any, qty?: number) => dispatch(addToCart({ product, quantity: qty }))
  const setSelectedProductFn = (product: any) => dispatch(setSelectedProduct(product))

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="home-view"
    >
      {/* ── Premium Banner Slider (Enters immediately with a 3D drop-fade on mount) ── */}
      <motion.div 
        initial={{ opacity: 0, y: -40, scale: 0.96, rotateX: -5 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        transition={{ type: 'spring', stiffness: 50, damping: 14, mass: 1 }}
        style={{ transformOrigin: 'center bottom', perspective: '1200px' }}
      >
        <BannerSlider />
      </motion.div>

      {/* ── Promo Sidebar & Secondary Cards ─────────────────────────────── */}
      <ScrollReveal>
        <div className="home-promo-grid">
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -6 }}
            className="promo-card" 
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1563013544-824ae1d704d3?w=600&auto=format&fit=crop&q=80')` }}
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
            variants={itemVariants}
            whileHover={{ y: -6 }}
            className="promo-card" 
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&auto=format&fit=crop&q=80')` }}
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

      {/* ── Special Offers / Promos (As in User Photo) ────────────────── */}
      <ScrollReveal>
        <SpecialOffers />
      </ScrollReveal>

      {/* ── Quick Category Bar ──────────────────────────────────────────── */}
      <ScrollReveal>
        <div className="quick-categories">
          {(categoriesData as Category[]).map(cat => (
            <motion.div
              key={cat.id}
              className="quick-cat-item"
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate(`/catalog?cat=${cat.id}`)}
            >
              <div className="quick-cat-circle">
                <CategoryIcon slug={cat.slug} />
              </div>
              <span className="quick-cat-name">{cat.name}</span>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>

      {/* ── Featured Products ───────────────────────────────────────────── */}
      <ScrollReveal>
        <div className="section-header">
          <h2 className="section-title">Наши предложения</h2>
          <div className="section-tab-group">
            <span className="section-tab active">Популярные товары</span>
          </div>
        </div>

        <div className="product-grid">
          {(productsData as unknown as Product[]).slice(0, 8).map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={setSelectedProductFn}
              onAddToCart={addToCartFn}
            />
          ))}
        </div>
      </ScrollReveal>

      {/* ── Store Locations & Yandex Map (As in User Photo / paykar.shop) ── */}
      <ScrollReveal>
        <StoreLocations />
      </ScrollReveal>
    </motion.div>
  )
}
