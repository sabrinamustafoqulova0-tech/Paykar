import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

import PhoneIcon from '@mui/icons-material/Phone'
import BarChartIcon from '@mui/icons-material/BarChart'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import HomeIcon from '@mui/icons-material/Home'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import InfoIcon from '@mui/icons-material/Info'
import ContactsIcon from '@mui/icons-material/Contacts'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import CategoryIcon from '@mui/icons-material/Category'

import { PaykarLogo } from './Icons'
import type { Product } from '../types'

// ─── Props ────────────────────────────────────────────────────────────────────

export interface HeaderProps {
  isLoggedIn: boolean
  handleLogout: () => void
  setLoginModalOpen: (open: boolean) => void
  setCallRequestOpen: (open: boolean) => void
  compareList: Product[]
  cartCount: number
  handleCartClick: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Header: React.FC<HeaderProps> = ({
  isLoggedIn,
  handleLogout,
  setLoginModalOpen,
  compareList,
  cartCount,
  handleCartClick,
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false)
    setMobileSearchOpen(false)
  }, [location.pathname])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const isActive = (path: string) => location.pathname === path

  interface NavLink {
    label: string
    path: string
    onClick: () => void | Promise<void>
    match?: () => boolean
    dropdownItems?: { label: string; onClick: () => void }[]
  }

  const navLinks: NavLink[] = [
    { label: 'Главная', path: '/', onClick: () => navigate('/') },
    {
      label: 'Как купить',
      path: '/delivery',
      onClick: () => navigate('/delivery'),
      match: () => location.pathname === '/delivery',
     
    },
    { label: 'Акции', path: '/promotions', onClick: () => navigate('/promotions') },
    {
      label: 'О нас',
      path: '/about',
      onClick: () => navigate('/about'),
      match: () => location.pathname === '/about',
    
    },
    { label: 'Контакты', path: '/contacts', onClick: () => navigate('/contacts'), match: () => isActive('/contacts') },
  ]

  return (
    <>
    <header className={`site-header-unified ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-unified-container">
        
        {/* Left Section: Logo */}
        <div className="header-left">
          <div className="logo-wrapper">
            <PaykarLogo onClick={() => { navigate('/'); setMobileMenuOpen(false) }} />
          </div>
        </div>

        {/* Center Section: Catalog & Search — hidden on mobile */}
        <div className="header-center header-center-desktop">
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="catalog-trigger-unified" 
            onClick={() => navigate('/categories')}
          >
            <MenuIcon fontSize="small" />
            <span>Каталог</span>
          </motion.button>

          <form onSubmit={handleSearchSubmit} className="search-form-unified" style={{ position: 'relative' }}>
            <motion.input
              type="text"
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              animate={{
                width: isSearchFocused ? 260 : 160
              }}
              transition={{
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="search-input-unified"
            />
          </form>
        </div>

        {/* Right Section: Navigation Links & Action Controls — hidden on mobile */}
        <div className="header-right header-right-desktop">
          <nav className="nav-links-unified" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {navLinks.map((link) => {
              const active = link.match ? link.match() : isActive(link.path)
              return (
                <div
                  key={link.label}
                  className="nav-link-wrapper"
                  onMouseEnter={() => setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                  style={{ position: 'relative', display: 'inline-block', paddingBottom: '12px', marginBottom: '-12px' }}
                >
                  <button
                    className={`nav-link-unified-item ${active ? 'active' : ''}`}
                    onClick={link.onClick}
                    style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {link.label}
                    {active && (
                      <motion.span 
                        layoutId="activeHeaderPillUnified"
                        className="nav-link-pill-unified"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>

                  <AnimatePresence>
                    {link.dropdownItems && activeDropdown === link.label && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="nav-dropdown-menu"
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: 'rgba(255, 255, 255, 0.92)',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                          border: 'var(--border-card)',
                          borderRadius: 'var(--radius-md)',
                          boxShadow: 'var(--shadow-glass)',
                          padding: '8px 0',
                          minWidth: '180px',
                          zIndex: 1000,
                          display: 'flex',
                          flexDirection: 'column',
                          marginTop: '4px'
                        }}
                      >
                        {link.dropdownItems?.map((item: any) => (
                          <button 
                            key={item.label} 
                            className="dropdown-item" 
                            onClick={(e) => {
                              e.stopPropagation()
                              item.onClick()
                              setActiveDropdown(null)
                            }}
                            style={{
                              padding: '10px 20px',
                              background: 'none',
                              border: 'none',
                              textAlign: 'left',
                              fontSize: '13.5px',
                              fontWeight: 600,
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              width: '100%'
                            }}
                          >
                            {item.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </nav>

          <div className="header-actions-unified">
            {/* Compare */}
            <motion.button 
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="action-btn-unified" 
              title="Сравнение" 
              onClick={() => navigate('/compare')}
            >
              <BarChartIcon fontSize="small" />
              <AnimatePresence>
                {compareList.length > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="action-badge-unified"
                  >
                    {compareList.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Cart */}
            <motion.button 
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="action-btn-unified cart-btn" 
              title="Корзина" 
              onClick={handleCartClick}
            >
              <ShoppingCartIcon fontSize="small" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="action-badge-unified"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Phone shortcode */}
            <a href="tel:+992446302020" className="phone-shortcode" title="Позвонить: +992 44 630 2020">
              <PhoneIcon fontSize="small" />
              <span>+992 44 630 2020</span>
            </a>

            {/* Auth button */}
            {isLoggedIn ? (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout} 
                className="auth-btn-unified logout"
              >
                Выйти
              </motion.button>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLoginModalOpen(true)} 
                className="auth-btn-unified login"
              >
                Войти
              </motion.button>
            )}
          </div>
        </div>

        {/* ── Mobile Controls (visible only on mobile) ── */}
        <div className="mobile-header-controls">
          {/* Mobile Cart */}
          <button 
            className="mobile-action-btn"
            onClick={handleCartClick}
            style={{ position: 'relative' }}
          >
            <ShoppingCartIcon fontSize="small" />
            {cartCount > 0 && (
              <span className="action-badge-unified">{cartCount}</span>
            )}
          </button>

          {/* Mobile Search toggle */}
          <button 
            className="mobile-action-btn"
            onClick={() => setMobileSearchOpen(v => !v)}
          >
            <SearchIcon fontSize="small" />
          </button>

          {/* Hamburger */}
          <button 
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(v => !v)}
            aria-label="Открыть меню"
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

      </div>

      {/* ── Mobile Search Bar (dropdown below header) ── */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            className="mobile-search-bar"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <form onSubmit={(e) => { handleSearchSubmit(e); setMobileSearchOpen(false) }} className="mobile-search-form">
              <SearchIcon fontSize="small" className="mobile-search-icon" />
              <input
                type="text"
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="mobile-search-input"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="mobile-search-clear">
                  <CloseIcon fontSize="small" />
                </button>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </header>

    {/* ── Mobile Menu Drawer ── */}
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="mobile-menu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <motion.nav
            className="mobile-menu-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
          >
            {/* Drawer header */}
            <div className="mobile-drawer-header">
              <PaykarLogo onClick={() => { navigate('/'); setMobileMenuOpen(false) }} />
              <button className="mobile-drawer-close" onClick={() => setMobileMenuOpen(false)}>
                <CloseIcon />
              </button>
            </div>

            {/* Phone link */}
            <a href="tel:+992446302020" className="mobile-drawer-phone">
              <PhoneIcon fontSize="small" />
              +992 44 630 2020
            </a>

            {/* Nav links */}
            <div className="mobile-drawer-nav">
              {[
                { label: 'Главная', path: '/', icon: <HomeIcon fontSize="small" /> },
                { label: 'Каталог', path: '/categories', icon: <CategoryIcon fontSize="small" /> },
                { label: 'Как купить', path: '/delivery', icon: <LocalShippingIcon fontSize="small" /> },
                { label: 'Акции', path: '/promotions', icon: <LocalOfferIcon fontSize="small" /> },
                { label: 'О нас', path: '/about', icon: <InfoIcon fontSize="small" /> },
                { label: 'Контакты', path: '/contacts', icon: <ContactsIcon fontSize="small" /> },
              ].map((item) => (
                <button
                  key={item.path}
                  className={`mobile-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => { navigate(item.path); setMobileMenuOpen(false) }}
                >
                  <span className="mobile-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Drawer footer actions */}
            <div className="mobile-drawer-footer">
              <button
                className="mobile-drawer-compare"
                onClick={() => { navigate('/compare'); setMobileMenuOpen(false) }}
              >
                <BarChartIcon fontSize="small" />
                Сравнение
                {compareList.length > 0 && (
                  <span className="mobile-badge">{compareList.length}</span>
                )}
              </button>

              {isLoggedIn ? (
                <button className="mobile-drawer-auth logout" onClick={() => { handleLogout(); setMobileMenuOpen(false) }}>
                  Выйти из аккаунта
                </button>
              ) : (
                <button className="mobile-drawer-auth login" onClick={() => { setLoginModalOpen(true); setMobileMenuOpen(false) }}>
                  Войти
                </button>
              )}
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
    </>
  )
}
