import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'

import type { Product } from '../types'
import productsData from '../data/products.json'
import { ProductCard } from './ProductCard'
import { useAppDispatch } from '../store/hooks'
import { addToCart } from '../store/cartSlice'
import { setSelectedProduct } from '../store/uiSlice'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
} as const

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
} as const

export const PromotionsView: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  // Filter products that have discounts
  const promoProducts = (productsData as unknown as Product[]).filter(p => p.discount && p.discount > 0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="promotions-page-container"
      style={{ padding: '40px 0 60px' }}
    >
      {/* Page Header */}
      <div className="promotions-header-section" style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 className="section-title" style={{ fontSize: '36px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <LocalOfferIcon style={{ fontSize: '40px', color: '#dc2626' }} />
          Акции и скидки
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
          Выгодные предложения, скидки на популярные товары и специальные условия доставки от супермаркета Paykar
        </p>
      </div>

      {/* Promo Cards / Banners Grid */}
      <div className="promotions-banners" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '56px' }}>
        <motion.div
          whileHover={{ y: -4 }}
          style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(220, 38, 38, 0.04) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 'var(--radius-lg)',
            padding: '30px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#dc2626', background: 'rgba(220, 38, 38, 0.1)', padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase' }}>Акция недели</span>
          <h3 style={{ fontSize: '22px', fontWeight: 800, marginTop: '16px', marginBottom: '10px' }}>Скидки до -30%</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.6', marginBottom: '20px' }}>
            Покупайте сосиски, колбасы и мясные деликатесы по выгодным ценам в разделе «Мясная гастрономия».
          </p>
          <button
            onClick={() => navigate('/catalog?cat=13')}
            style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer' }}
          >
            Смотреть мясное
          </button>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          style={{
            background: 'linear-gradient(135deg, rgba(8, 168, 38, 0.08) 0%, rgba(5, 122, 27, 0.04) 100%)',
            border: '1px solid rgba(8, 168, 38, 0.2)',
            borderRadius: 'var(--radius-lg)',
            padding: '30px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary-green)', background: 'rgba(8, 168, 38, 0.1)', padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase' }}>Постоянная акция</span>
          <h3 style={{ fontSize: '22px', fontWeight: 800, marginTop: '16px', marginBottom: '10px' }}>Бесплатная доставка</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.6', marginBottom: '20px' }}>
            Закажите продукты на сумму от 350 сомони, и мы доставим их совершенно бесплатно в любую точку Зоны 1.
          </p>
          <button
            onClick={() => navigate('/delivery')}
            style={{ background: 'var(--primary-green)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer' }}
          >
            Условия доставки
          </button>
        </motion.div>
      </div>

      {/* Promotional Products Section */}
      <h2 className="section-title" style={{ fontSize: '24px', marginBottom: '28px' }}>Товары со скидкой</h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="products-grid"
      >
        {promoProducts.map(product => (
          <motion.div key={product.id} variants={cardVariants}>
            <ProductCard
              product={product}
              onAddToCart={(p: Product) => { dispatch(addToCart({ product: p })) }}
              onSelect={(p: Product) => { dispatch(setSelectedProduct(p)) }}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
