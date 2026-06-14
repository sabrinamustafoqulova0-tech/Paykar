import React, { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import FolderIcon from '@mui/icons-material/Folder'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

import type { Category, Subcategory, Product } from '../types'
import categoriesData from '../data/categories.json'
import productsData from '../data/products.json'
import { CategoryIcon } from './Icons'
import { ProductCard } from './ProductCard'
import { useAppDispatch } from '../store/hooks'
import { addToCart } from '../store/cartSlice'
import { setSelectedProduct } from '../store/uiSlice'

export const CatalogView: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  
  const addToCartFn = (product: any, qty?: number) => dispatch(addToCart({ product, quantity: qty }))
  const setSelectedProductFn = (product: any) => dispatch(setSelectedProduct(product))

  // ── Read filters from URL ─────────────────────────────────────────────────
  const catParam  = searchParams.get('cat')
  const subParam  = searchParams.get('sub')
  const qParam    = searchParams.get('q') || ''
  const minPrice  = searchParams.get('minPrice') || ''
  const maxPrice  = searchParams.get('maxPrice') || ''
  const sortBy    = searchParams.get('sort') || 'default'

  // ── Derive selected category/subcategory from URL params ─────────────────
  const selectedCategory: Category | null = useMemo(() => {
    if (!catParam) return null
    return (categoriesData as Category[]).find(c => c.id === parseInt(catParam)) ?? null
  }, [catParam])

  const selectedSubcategory: Subcategory | null = useMemo(() => {
    if (!subParam || !selectedCategory) return null
    return selectedCategory.subcategories.find(s => s.id === parseInt(subParam)) ?? null
  }, [subParam, selectedCategory])

  // ── URL update helpers ────────────────────────────────────────────────────
  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString())
    if (value) next.set(key, value); else next.delete(key)
    setSearchParams(next)
  }

  const selectCategory = (cat: Category) => {
    const next = new URLSearchParams()
    next.set('cat', String(cat.id))
    setSearchParams(next)
  }

  const selectSubcategory = (sub: Subcategory) => {
    const next = new URLSearchParams(searchParams.toString())
    next.set('sub', String(sub.id))
    setSearchParams(next)
  }

  const clearCategory = () => setSearchParams({})

  // ── Filtered & sorted product list ────────────────────────────────────────
  const filteredProducts: Product[] = useMemo(() => {
    let list = productsData as unknown as Product[]

    if (selectedCategory) list = list.filter(p => p.categoryId === selectedCategory.id)
    if (selectedSubcategory) list = list.filter(p => p.subcategoryId === selectedSubcategory.id)

    if (qParam) {
      const q = qParam.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      )
    }

    if (minPrice) list = list.filter(p => p.price >= parseFloat(minPrice))
    if (maxPrice) list = list.filter(p => p.price <= parseFloat(maxPrice))

    if (sortBy === 'price-asc')  list = [...list].sort((a, b) => a.price - b.price)
    if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    if (sortBy === 'rating')     list = [...list].sort((a, b) => b.rating - a.rating)

    return list
  }, [selectedCategory, selectedSubcategory, qParam, minPrice, maxPrice, sortBy])

  return (
    <div className="catalog-layout">
      {/* ── Sidebar (Purely Static category menu) ───────────────────────── */}
      <div className="sidebar-card">
        <h3 className="sidebar-title">Каталог товаров</h3>
        <ul className="sidebar-menu">
          <li>
            <button
              className={`sidebar-cat-btn ${!selectedCategory ? 'active' : ''}`}
              onClick={clearCategory}
            >
              <span>
                <FolderIcon fontSize="small" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Все категории
              </span>
            </button>
          </li>

          {(categoriesData as Category[]).map(cat => (
            <li key={cat.id} className="sidebar-item">
              <button
                className={`sidebar-cat-btn ${selectedCategory?.id === cat.id ? 'active' : ''}`}
                onClick={() => selectCategory(cat)}
              >
                <span>
                  <CategoryIcon slug={cat.slug} fontSize="small" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  {cat.name}
                </span>
                {selectedCategory?.id === cat.id ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
              </button>

              {/* Instant static submenu */}
              {selectedCategory?.id === cat.id && (
                <ul className="sidebar-sub-menu">
                  {cat.subcategories.map(sub => (
                    <li key={sub.id} className="sidebar-sub-item">
                      <button
                        className={`sidebar-sub-link ${selectedSubcategory?.id === sub.id ? 'active' : ''}`}
                        onClick={() => selectSubcategory(sub)}
                      >
                        — {sub.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        <div className="filter-section">
          <h4 className="filter-title">Фильтр по цене</h4>
          <div className="price-filter-inputs">
            <input
              type="number"
              placeholder="От"
              className="price-input"
              value={minPrice}
              onChange={e => setParam('minPrice', e.target.value)}
            />
            <span style={{ color: 'var(--text-muted)' }}>—</span>
            <input
              type="number"
              placeholder="До"
              className="price-input"
              value={maxPrice}
              onChange={e => setParam('maxPrice', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── Catalog Content (Instant grid rendering) ──────────────────────── */}
      <div style={{ minWidth: 0 }}>
        {/* Breadcrumbs */}
        <div className="breadcrumbs">
          <button onClick={() => navigate('/')}>Главная</button>
          <span className="breadcrumb-separator">/</span>
          <button onClick={clearCategory}>Каталог</button>
          {selectedCategory && (
            <>
              <span className="breadcrumb-separator">/</span>
              <button onClick={() => setParam('sub', '')}>{selectedCategory.name}</button>
            </>
          )}
          {selectedSubcategory && (
            <>
              <span className="breadcrumb-separator">/</span>
              <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{selectedSubcategory.name}</span>
            </>
          )}
        </div>

        {/* Header + sorting */}
        <div className="catalog-content-header">
          <h2 className="catalog-title">
            {selectedSubcategory?.name ?? selectedCategory?.name ?? 'Все категории'}
          </h2>
          <div className="catalog-sorting">
            <span>Сортировка:</span>
            <select
              className="sort-select"
              value={sortBy}
              onChange={e => setParam('sort', e.target.value)}
            >
              <option value="default">По умолчанию</option>
              <option value="price-asc">Сначала дешевые</option>
              <option value="price-desc">Сначала дорогие</option>
              <option value="rating">По рейтингу</option>
            </select>
          </div>
        </div>

        {/* Instant product grid, only crossfading states */}
        <AnimatePresence mode="wait">
          {filteredProducts.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{ textAlign: 'center', padding: '60px 40px', color: 'var(--text-muted)' }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Товары не найдены</h3>
              <p>Попробуйте сбросить фильтры или изменить поисковый запрос.</p>
            </motion.div>
          ) : (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="product-grid"
            >
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={setSelectedProductFn}
                  onAddToCart={addToCartFn}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
