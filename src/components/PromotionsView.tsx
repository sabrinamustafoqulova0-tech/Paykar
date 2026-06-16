import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import FlashOnIcon from '@mui/icons-material/FlashOn'

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
    transition: { staggerChildren: 0.04 }
  }
} as const

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } }
} as const

export const PromotionsView: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const promoProducts = (productsData as unknown as Product[]).filter(p => p.discount && p.discount > 0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: '32px 0 60px' }}
    >
      {/* ── Page Header ── */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <LocalOfferIcon style={{ color: '#dc2626', fontSize: '28px' }} />
          <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.6px' }}>Акции и скидки</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', maxWidth: '560px' }}>
          Выгодные предложения и скидки на популярные товары от супермаркета Пайкар
        </p>
      </div>

      {/* ── Promo Banner Cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '40px'
      }}>
        {/* Card 1 */}
        <motion.div
          whileHover={{ y: -3 }}
          style={{
            background: 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(220,38,38,0.04) 100%)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '20px 22px',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/catalog?cat=13')}
        >
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            fontSize: '10.5px', fontWeight: 700, color: '#dc2626',
            background: 'rgba(220,38,38,0.1)', padding: '3px 10px',
            borderRadius: '20px', textTransform: 'uppercase', marginBottom: '12px'
          }}>
            <FlashOnIcon style={{ fontSize: '12px' }} /> Акция недели
          </span>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>Скидки до -30%</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5', marginBottom: '14px' }}>
            Мясные деликатесы и колбасы по выгодным ценам.
          </p>
          <button
            style={{
              background: '#dc2626', color: '#fff', border: 'none',
              padding: '8px 16px', borderRadius: '20px',
              fontWeight: 700, fontSize: '12px', cursor: 'pointer'
            }}
          >
            Смотреть →
          </button>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          whileHover={{ y: -3 }}
          style={{
            background: 'linear-gradient(135deg, rgba(8,168,38,0.08) 0%, rgba(5,122,27,0.04) 100%)',
            border: '1px solid rgba(8,168,38,0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '20px 22px',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/delivery')}
        >
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            fontSize: '10.5px', fontWeight: 700, color: 'var(--primary-green)',
            background: 'rgba(8,168,38,0.1)', padding: '3px 10px',
            borderRadius: '20px', textTransform: 'uppercase', marginBottom: '12px'
          }}>
            <LocalShippingIcon style={{ fontSize: '12px' }} /> Постоянная акция
          </span>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>Бесплатная доставка</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5', marginBottom: '14px' }}>
            При заказе от 350 сомони доставка бесплатна.
          </p>
          <button
            style={{
              background: 'var(--primary-green)', color: '#fff', border: 'none',
              padding: '8px 16px', borderRadius: '20px',
              fontWeight: 700, fontSize: '12px', cursor: 'pointer'
            }}
          >
            Подробнее →
          </button>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          whileHover={{ y: -3 }}
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(217,119,6,0.04) 100%)',
            border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '20px 22px',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/catalog')}
        >
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            fontSize: '10.5px', fontWeight: 700, color: '#d97706',
            background: 'rgba(245,158,11,0.1)', padding: '3px 10px',
            borderRadius: '20px', textTransform: 'uppercase', marginBottom: '12px'
          }}>
            <LocalOfferIcon style={{ fontSize: '12px' }} /> Сладости
          </span>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>Скидки на сладости</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5', marginBottom: '14px' }}>
            Шоколад, конфеты и кондитерские изделия со скидкой.
          </p>
          <button
            style={{
              background: '#d97706', color: '#fff', border: 'none',
              padding: '8px 16px', borderRadius: '20px',
              fontWeight: 700, fontSize: '12px', cursor: 'pointer'
            }}
          >
            В каталог →
          </button>
        </motion.div>
      </div>

      {/* ── Divider + count ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800 }}>
          Товары со скидкой
          <span style={{
            marginLeft: '10px', fontSize: '13px', fontWeight: 700,
            color: '#dc2626', background: 'rgba(220,38,38,0.08)',
            padding: '3px 10px', borderRadius: '20px'
          }}>
            {promoProducts.length} товаров
          </span>
        </h2>
      </div>

      {/* ── Product Grid ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: '20px'
        }}
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
