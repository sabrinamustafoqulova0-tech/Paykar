import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import type { Category, Product } from '../types'
import categoriesData from '../data/categories.json'
import productsData from '../data/products.json'
import { CategoryIcon } from './Icons'

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

export const CategoriesView: React.FC = () => {
  const navigate = useNavigate()

  // Calculate product count per category
  const getProductCount = (categoryId: number) => {
    return (productsData as unknown as Product[]).filter(p => p.categoryId === categoryId).length
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="categories-page-container"
      style={{ padding: '40px 0 60px' }}
    >
      {/* Page Header */}
      <div className="categories-header-section" style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 className="section-title" style={{ fontSize: '36px', marginBottom: '12px' }}>
          Каталог товаров
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
          Выберите нужный раздел для просмотра ассортимента и выгодных предложений от Paykar
        </p>
      </div>

      {/* Grid of Categories */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="categories-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}
      >
        {(categoriesData as Category[]).map(cat => {
          const count = getProductCount(cat.id)
          return (
            <motion.div
              key={cat.id}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              className="category-hub-card"
              style={{
                background: 'var(--bg-card)',
                border: 'var(--border-card)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                cursor: 'pointer'
              }}
              onClick={() => navigate(`/catalog?cat=${cat.id}`)}
            >
              <div>
                {/* Header: Icon and Count */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div
                    className="category-icon-wrapper"
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      background: 'rgba(8, 168, 38, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary-green)'
                    }}
                  >
                    <CategoryIcon slug={cat.slug} fontSize="large" />
                  </div>
                  <span
                    className="category-badge-count"
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--primary-green)',
                      background: 'rgba(8, 168, 38, 0.12)',
                      padding: '4px 12px',
                      borderRadius: '20px'
                    }}
                  >
                    {count} {count === 1 ? 'товар' : count > 1 && count < 5 ? 'товара' : 'товаров'}
                  </span>
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    marginBottom: '14px',
                    color: 'var(--text-main)'
                  }}
                >
                  {cat.name}
                </h3>

                {/* Subcategories tags/list */}
                <div
                  className="category-subtags"
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginBottom: '24px'
                  }}
                >
                  {cat.subcategories.map(sub => (
                    <button
                      key={sub.id}
                      className="category-subtag-btn"
                      style={{
                        fontSize: '12px',
                        background: 'var(--bg-main)',
                        border: 'var(--border-card)',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/catalog?cat=${cat.id}&sub=${sub.id}`)
                      }}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Link */}
              <div
                className="category-action-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: 'var(--primary-green)',
                  marginTop: 'auto'
                }}
              >
                <span>Перейти в раздел</span>
                <ArrowForwardIcon fontSize="small" className="arrow-icon-shift" />
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
