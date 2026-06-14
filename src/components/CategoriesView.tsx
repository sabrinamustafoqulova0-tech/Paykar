import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import type { Category, Product } from '../types'
import categoriesData from '../data/categories.json'
import productsData from '../data/products.json'
import { CategoryIcon } from './Icons'

// Custom descriptive text for the back of categories
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'molochnye-produkty': 'Свежие фермерские сыры, йогурты, натуральный творог и отборное молоко.',
  'myaso-ptitsa': 'Натуральная говядина, куриное филе и полуфабрикаты халяль высокой свежести.',
  'hleb-i-vypechka': 'Ароматный хлеб, традиционный таджикский нон и свежая выпечка к вашему столу.',
  'frukty-i-ovoshchi': 'Сочные спелые фрукты и хрустящие овощи из другого измерения, полные витаминов.',
  'bakaleya': 'Премиальные крупы, макаронные изделия высшего качества, масла и мука для выпечки.',
  'voda-i-napitki': 'Освежающие натуральные соки, газированная и экологически чистая питьевая вода.',
  'sladosti': 'Шоколад премиум-класса, мармелад, подарочные наборы конфет и десерты.',
  'chay-kofe-kakao': 'Отборные чайные листья, бодрящие кофейные зерна и ароматное горячее какао.',
  'konservirovannye-produkty': 'Мясные деликатесы, отборная рыба и овощные ассорти в удобном формате консервации.',
  'gotovaya-eda': 'Сытные готовые вторые блюда, свежие салаты и легкие завтраки от профессиональных шефов.',
  'krasota-i-gigiena': 'Средства личной гигиены, organic косметика и бытовая химия нового поколения.',
  'vse-dlya-detey': 'Гипоаллергенное детское питание, мягкие подгузники и безопасные развивающие игрушки.',
  'myasnaya-gastronomiya': 'Изысканные колбасы, сосиски и копчености от ведущих брендов.',
  'polufabrikaty-moreprodukty': 'Свежемороженая рыба, креветки, крабовое мясо и полуфабрикаты ручной лепки.',
  'sneki': 'Хрустящие чипсы, аппетитные сухарики и орехи для быстрых перекусов в любое время.',
  'dlya-zhivotnykh': 'Полезные корма премиум-класса, лакомства и средства гигиены для ваших питомцев.'
}

interface BentoCardProps {
  cat: Category
  index: number
  count: number
}

const BentoCard: React.FC<BentoCardProps> = ({ cat, index, count }) => {
  const navigate = useNavigate()
  const cardRef = React.useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = React.useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    card.style.setProperty('--x', `${x}px`)
    card.style.setProperty('--y', `${y}px`)
  }

  // Bento layout rules: define column/row spans for variety
  const getBentoStyle = () => {
    let gridSpan = 'span 1'
    if (index === 0 || index === 3 || index === 8 || index === 13) {
      gridSpan = 'span 2'
    }
    return {
      gridColumn: gridSpan
    }
  }

  const desc = CATEGORY_DESCRIPTIONS[cat.slug] || 'Качественные товары от Paykar с оперативной доставкой.'

  return (
    <div
      ref={cardRef}
      className={`bento-category-card-wrapper ${index === 0 || index === 3 || index === 8 || index === 13 ? 'large-bento' : ''} ${isHovered ? 'is-hovered' : ''}`}
      style={getBentoStyle()}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/catalog?cat=${cat.id}`)}
    >
      <div className="bento-card-inner">
        {/* FRONT SIDE */}
        <div className="bento-card-front">
          <div className="bento-shimmer" />
          
          <div className="bento-card-header">
            <div className="bento-icon-box">
              <CategoryIcon slug={cat.slug} fontSize="large" />
            </div>
            <span className="bento-count-badge">
              {count} товаров
            </span>
          </div>

          <div className="bento-card-title-box">
            <h3 className="bento-title">{cat.name}</h3>
            <div className="bento-hint">Наведите, чтобы увидеть больше</div>
          </div>
        </div>

        {/* BACK SIDE */}
        <div className="bento-card-back">
          <div className="bento-back-glow" />
          
          <div className="bento-back-content">
            <div>
              <h4 className="bento-back-title">{cat.name}</h4>
              <p className="bento-back-desc">{desc}</p>
              
              <div className="bento-subtags-container">
                {cat.subcategories.slice(0, 4).map(sub => (
                  <button
                    key={sub.id}
                    className="bento-subtag-link"
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

            <div className="bento-action-row">
              <span>Перейти в каталог</span>
              <ArrowForwardIcon fontSize="small" className="bento-arrow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const CategoriesView: React.FC = () => {
  const getProductCount = (categoryId: number) => {
    return (productsData as unknown as Product[]).filter(p => p.categoryId === categoryId).length
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="categories-page-container"
      style={{ padding: '40px 0 60px' }}
    >
      {/* Page Header */}
      <div className="categories-header-section" style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 className="section-title bento-page-title" style={{ fontSize: '40px', marginBottom: '12px' }}>
          Каталог Paykar
        </h1>
        <p className="bento-page-subtitle" style={{ fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
          Выберите категорию для перехода к свежим продуктам питания и качественным хозтоварам с доставкой по Душанбе
        </p>
      </div>

      {/* Bento Grid of Categories */}
      <div className="categories-bento-grid">
        {(categoriesData as Category[]).map((cat, idx) => {
          const count = getProductCount(cat.id)
          return (
            <BentoCard
              key={cat.id}
              cat={cat}
              index={idx}
              count={count}
            />
          )
        })}
      </div>
    </motion.div>
  )
}
