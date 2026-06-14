import React, { useState } from 'react'
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
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div 
      className="product-card" 
      onClick={() => onSelect(product)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {product.discount && (
        <span className="product-badge badge-discount">-{product.discount}%</span>
      )}
      {product.isNew && !product.discount && (
        <span className="product-badge badge-new">Новинка</span>
      )}

      <div className="product-image-container" style={{ overflow: 'hidden' }}>
        <motion.img 
          src={product.images[0]} 
          alt={product.name} 
          className="product-image" 
          animate={{ scale: isHovered ? 1.03 : 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <span className="product-meta">{product.brand}</span>
      <h3 className="product-title">{product.name}</h3>

      <div className="product-rating">
        <StarIcon fontSize="inherit" style={{ marginRight: '2px' }} /> {product.rating} <span className="rating-count">({product.reviewCount})</span>
      </div>

      <div className="product-footer" onClick={(e) => e.stopPropagation()}>
        <div className="product-price-box">
          <motion.span 
            className="price-current"
            animate={{ fontWeight: isHovered ? 800 : 700 }}
            transition={{ duration: 0.25 }}
          >
            {product.price} <span>c.</span>
          </motion.span>
          {product.oldPrice && <span className="price-old">{product.oldPrice} c.</span>}
        </div>

        {/* Add to cart button slides up 6px on hover */}
        <motion.button 
          className="add-to-cart-btn" 
          onClick={(e) => {
            onAddToCart(product);
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const event = new CustomEvent('add-to-cart-animation', {
              detail: {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
                image: product.images[0]
              }
            });
            window.dispatchEvent(event);
          }}
          animate={{ y: isHovered ? -6 : 0 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <ShoppingCartIcon fontSize="small" />
        </motion.button>
      </div>
    </motion.div>
  )
}
