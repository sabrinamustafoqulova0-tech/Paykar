import React from 'react'
import { motion } from 'framer-motion'
import CloseIcon from '@mui/icons-material/Close'
import StarIcon from '@mui/icons-material/Star'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import type { Product, Review } from '../types'

export interface ProductDetailModalProps {
  product: Product | null
  onClose: () => void
  onAddToCart: (product: Product) => void
  compareList: Product[]
  onToggleCompare: (product: Product) => void
  reviews: Review[]
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  compareList,
  onToggleCompare,
  reviews
}) => {
  if (!product) return null

  const isInCompare = compareList.some(c => c.id === product.id)

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal-overlay" 
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </button>
        
        <div className="product-detail-layout">
          {/* Image */}
          <div className="detail-img-container">
            <img src={product.images[0]} alt={product.name} className="detail-img" />
          </div>

          {/* Info */}
          <div className="detail-info">
            <span className="detail-brand">{product.brand}</span>
            <h2 className="detail-title">{product.name}</h2>
            
            <div className="product-rating" style={{ marginBottom: '12px' }}>
              <StarIcon fontSize="inherit" style={{ color: '#fbbf24', marginRight: '4px' }} /> {product.rating} <span className="rating-count">({product.reviewCount} отзывов)</span>
            </div>

            <div className="detail-price-row">
              <span className="detail-price">{product.price} сомони</span>
              {product.oldPrice && (
                <span className="price-old" style={{ fontSize: '16px', marginBottom: '6px' }}>{product.oldPrice} сомони</span>
              )}
            </div>

            <p className="detail-desc">{product.description}</p>

            {/* Specs Table */}
            <table className="detail-spec-table">
              <tbody>
                {Object.entries(product.specifications).map(([key, val]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '16px' }}>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="detail-action-btn"
                onClick={() => { onAddToCart(product); onClose(); }}
              >
                <ShoppingCartIcon fontSize="small" style={{ marginRight: '6px' }} /> В корзину
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="action-btn"
                style={{ border: '1px solid rgba(28,25,23,0.1)', borderRadius: 'var(--radius-md)', padding: '12px 18px', fontWeight: 700 }}
                title="В сравнение"
                onClick={() => { onToggleCompare(product); }}
              >
                {isInCompare ? '✓ В сравнении' : '📊 Сравнить'}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h3 className="reviews-title">Отзывы покупателей ({reviews.length})</h3>
          {reviews.length === 0 ? (
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>Отзывов о данном товаре пока нет. Будьте первым!</p>
          ) : (
            <div className="reviews-list">
              {reviews.map((rev) => (
                <div key={rev.id} className="review-item">
                  <div className="review-header">
                    <span className="review-user" style={{ fontWeight: 700 }}>
                      {rev.userName} 
                      {rev.isVerified && <span style={{ color: 'var(--primary-green)', fontSize: '11px', marginLeft: '6px', fontWeight: 600 }}>✓ Проверенный покупатель</span>}
                    </span>
                    <span className="review-date">{rev.date}</span>
                  </div>
                  <div className="product-rating" style={{ marginBottom: '8px', fontSize: '12px', color: '#fbbf24' }}>
                    {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                  </div>
                  <p className="review-body">{rev.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </motion.div>
    </motion.div>
  )
}
