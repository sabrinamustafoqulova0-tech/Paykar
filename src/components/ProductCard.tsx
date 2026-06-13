import React from 'react'
import { motion } from 'framer-motion'
import StarIcon from '@mui/icons-material/Star'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import type { Product } from '../types'

export interface ProductCardProps {
  product: Product
  onSelect: (product: Product) => void
  onAddToCart: (product: Product) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onAddToCart }) => {
  return (
    <motion.div 
      className="product-card" 
      onClick={() => onSelect(product)}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {product.discount && (
        <span className="product-badge badge-discount">-{product.discount}%</span>
      )}
      {product.isNew && !product.discount && (
        <span className="product-badge badge-new">Новинка</span>
      )}

      <div className="product-image-container">
        <motion.img 
          src={product.images[0]} 
          alt={product.name} 
          className="product-image" 
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <span className="product-meta">{product.brand}</span>
      <h3 className="product-title">{product.name}</h3>

      <div className="product-rating">
        <StarIcon fontSize="inherit" style={{ marginRight: '2px' }} /> {product.rating} <span className="rating-count">({product.reviewCount})</span>
      </div>

      <div className="product-footer" onClick={(e) => e.stopPropagation()}>
        <div className="product-price-box">
          <span className="price-current">{product.price} <span>c.</span></span>
          {product.oldPrice && <span className="price-old">{product.oldPrice} c.</span>}
        </div>
        <motion.button 
          className="add-to-cart-btn" 
          onClick={() => onAddToCart(product)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 450, damping: 15 }}
        >
          <ShoppingCartIcon fontSize="small" />
        </motion.button>
      </div>
    </motion.div>
  )
}
