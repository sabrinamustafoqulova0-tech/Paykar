import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppleIcon from '@mui/icons-material/Apple'
import AndroidIcon from '@mui/icons-material/Android'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

import type { Category } from '../types'
import bannersData from '../data/banners.json'
import categoriesData from '../data/categories.json'
import productsData from '../data/products.json'
import { CategoryIcon } from './Icons'
import { ProductCard } from './ProductCard'
import { useStore } from '../context/StoreContext'
import type { Product } from '../types'

export const HomeView: React.FC = () => {
  const navigate = useNavigate()
  const { addToCart, setSelectedProduct } = useStore()
  const [activeBanner, setActiveBanner] = useState(0)

  // Auto-advance banner
  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner(prev => (prev + 1) % bannersData.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const handleBannerClick = (buttonLink: string) => {
    if (buttonLink.startsWith('/category/')) {
      const slug = buttonLink.replace('/category/', '')
      const cat = (categoriesData as Category[]).find(c => c.slug === slug)
      if (cat) navigate(`/catalog?cat=${cat.id}`)
    } else {
      navigate('/catalog')
    }
  }

  return (
    <>
      {/* ── Hero Promo Grid ─────────────────────────────────────────────── */}
      <div className="home-promo-grid">
        {/* Banner Slider */}
        <div className="slider-wrapper">
          {bannersData.map((banner, index) => (
            <div
              key={banner.id}
              className="slide"
              style={{
                backgroundImage: `url(${banner.image})`,
                display: index === activeBanner ? 'flex' : 'none',
                backgroundColor: banner.bgColor
              }}
            >
              <div className="slide-overlay"></div>
              <div className="slide-content">
                <h2 className="slide-title">{banner.title}</h2>
                <p className="slide-subtitle">{banner.subtitle}</p>
                <button className="slide-btn" onClick={() => handleBannerClick(banner.buttonLink)}>
                  {banner.buttonText}
                </button>
              </div>
            </div>
          ))}
          <div className="slider-nav">
            {bannersData.map((_, index) => (
              <span
                key={index}
                className={`slider-dot ${index === activeBanner ? 'active' : ''}`}
                onClick={() => setActiveBanner(index)}
              />
            ))}
          </div>
        </div>

        {/* Sidebar promo cards */}
        <div className="promo-sidebar">
          <div className="promo-card" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1563013544-824ae1d704d3?w=500&auto=format&fit=crop&q=60')` }}>
            <div className="promo-card-content">
              <h3 className="promo-card-title">Мобильное приложение</h3>
              <p className="promo-card-desc">Покупки и дисконтная карта Пайкар в вашем смартфоне.</p>
            </div>
            <span className="promo-card-badge">
              <AppleIcon fontSize="inherit" /> AppStore / <AndroidIcon fontSize="inherit" /> Play
            </span>
          </div>

          <div className="promo-card" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=500&auto=format&fit=crop&q=60')` }}>
            <div className="promo-card-content">
              <h3 className="promo-card-title">Режим работы</h3>
              <p className="promo-card-desc">Супермаркеты открыты ежедневно с 08:00 до 00:00.</p>
            </div>
            <span className="promo-card-badge">
              <AccessTimeIcon fontSize="inherit" /> Доставка 9:00 - 21:00
            </span>
          </div>
        </div>
      </div>

      {/* ── Quick Category Bar ──────────────────────────────────────────── */}
      <div className="quick-categories">
        {(categoriesData as Category[]).map(cat => (
          <div
            key={cat.id}
            className="quick-cat-item"
            onClick={() => navigate(`/catalog?cat=${cat.id}`)}
          >
            <div className="quick-cat-circle">
              <CategoryIcon slug={cat.slug} />
            </div>
            <span className="quick-cat-name">{cat.name}</span>
          </div>
        ))}
      </div>

      {/* ── Featured Products ───────────────────────────────────────────── */}
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
            onSelect={setSelectedProduct}
            onAddToCart={addToCart}
          />
        ))}
      </div>
    </>
  )
}
