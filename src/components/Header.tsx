import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import LocationOnIcon from '@mui/icons-material/LocationOn'
import InfoIcon from '@mui/icons-material/Info'
import EmailIcon from '@mui/icons-material/Email'
import PersonIcon from '@mui/icons-material/Person'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import PhoneIcon from '@mui/icons-material/Phone'
import SearchIcon from '@mui/icons-material/Search'
import BarChartIcon from '@mui/icons-material/BarChart'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import MenuIcon from '@mui/icons-material/Menu'
import HomeIcon from '@mui/icons-material/Home'
import LocalMallIcon from '@mui/icons-material/LocalMall'

import { PaykarLogo } from './Icons'
import type { CartItem, Product } from '../types'
import categoriesData from '../data/categories.json'
import type { Category } from '../types'

// ─── Props ────────────────────────────────────────────────────────────────────

export interface HeaderProps {
  isLoggedIn: boolean
  handleLogout: () => void
  setLoginModalOpen: (open: boolean) => void
  setCallRequestOpen: (open: boolean) => void
  compareList: Product[]
  cart: CartItem[]
  handleCartClick: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Header: React.FC<HeaderProps> = ({
  isLoggedIn,
  handleLogout,
  setLoginModalOpen,
  setCallRequestOpen,
  compareList,
  cart,
  handleCartClick,
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')

  // Navigate to catalog with optional category filter
  const goToCategory = (slug: string) => {
    const cat = (categoriesData as Category[]).find(c => c.slug === slug)
    if (cat) navigate(`/catalog?cat=${cat.id}`)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      {/* ── Topbar ─────────────────────────────────────────────────────────── */}
      <div className="topbar">
        <div className="container">
          <div className="topbar-left">
            <span><LocationOnIcon fontSize="inherit" /> Город: <strong>Душанбе</strong></span>
            <span>Сеть супермаркетов Пайкар</span>
          </div>
          <div className="topbar-right">
            <button onClick={() => navigate('/delivery')} className="topbar-link">
              <InfoIcon fontSize="inherit" /> Доставка и оплата
            </button>
            <button onClick={() => navigate('/about')} className="topbar-link">
              <InfoIcon fontSize="inherit" /> О компании
            </button>
            <button onClick={() => navigate('/contacts')} className="topbar-link">
              <EmailIcon fontSize="inherit" /> Контакты
            </button>

            {isLoggedIn ? (
              <button onClick={handleLogout} className="topbar-link" style={{ color: '#ef5350', fontWeight: 'bold' }}>
                <ExitToAppIcon fontSize="inherit" /> Выйти
              </button>
            ) : (
              <button onClick={() => setLoginModalOpen(true)} className="topbar-link" style={{ fontWeight: 'bold' }}>
                <PersonIcon fontSize="inherit" /> Войти
              </button>
            )}

            <span className="topbar-phone"><PhoneIcon fontSize="inherit" /> 4400</span>
          </div>
        </div>
      </div>

      {/* ── Midbar ─────────────────────────────────────────────────────────── */}
      <div className="midbar">
        <div className="container">
          <PaykarLogo onClick={() => navigate('/')} />

          {/* Search */}
          <form className="search-container" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="search-input"
              placeholder="Поиск продуктов..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button">
              <SearchIcon />
            </button>
          </form>

          {/* Call widget */}
          <div className="contact-call">
            <span className="call-number">+992 44 630 2020</span>
            <button className="call-request" onClick={() => setCallRequestOpen(true)}>
              ЗАКАЗАТЬ ЗВОНОК
            </button>
          </div>

          {/* Action buttons */}
          <div className="actions-container">
            <button className="action-btn" title="Сравнение" onClick={() => navigate('/compare')}>
              <BarChartIcon />
              {compareList.length > 0 && <span className="action-badge">{compareList.length}</span>}
            </button>
            <button className="action-btn" title="Корзина" onClick={handleCartClick}>
              <ShoppingCartIcon />
              {cart.length > 0 && <span className="action-badge">{cart.reduce((s, i) => s + i.quantity, 0)}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="navbar">
        <div className="container">
          <button className="catalog-trigger" onClick={() => navigate('/catalog')}>
            <MenuIcon fontSize="small" /> КАТАЛОГ
          </button>

          <ul className="nav-links">
            <li>
              <button
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                onClick={() => navigate('/')}
              >
                <HomeIcon fontSize="inherit" /> Главная
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${location.pathname === '/catalog' && location.search.includes('gotovaya-eda') ? 'active' : ''}`}
                onClick={() => goToCategory('gotovaya-eda')}
              >
                <LocalMallIcon fontSize="inherit" /> Готовая еда
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${location.pathname === '/catalog' && location.search.includes('hleb-i-vypechka') ? 'active' : ''}`}
                onClick={() => goToCategory('hleb-i-vypechka')}
              >
                <LocalMallIcon fontSize="inherit" /> Выпечка
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${isActive('/delivery') ? 'active' : ''}`}
                onClick={() => navigate('/delivery')}
              >
                Доставка
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                onClick={() => navigate('/about')}
              >
                О нас
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${isActive('/contacts') ? 'active' : ''}`}
                onClick={() => navigate('/contacts')}
              >
                Контакты
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}
