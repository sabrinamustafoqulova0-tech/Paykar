import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SettingsIcon from '@mui/icons-material/Settings'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'

interface ThemePreset {
  id: string
  name: string
  primary: string
  hover: string
  bg: string
  cardBg: string
  textMain: string
  textMuted: string
  bgGradient: string
  borderCard: string
  isDark: boolean
}

const PRESETS: ThemePreset[] = [
  {
    id: 'nature',
    name: 'Nature Emerald (По умолчанию)',
    primary: '#08a826',
    hover: '#09c52d',
    bg: '#FAFAF9',
    cardBg: '#ffffff',
    textMain: '#1C1917',
    textMuted: '#78716C',
    borderCard: '1px solid rgba(28, 25, 23, 0.05)',
    bgGradient: 'radial-gradient(at 0% 0%, rgba(8, 168, 38, 0.02) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(8, 168, 38, 0.04) 0px, transparent 50%), #FAFAF9',
    isDark: false
  },
  {
    id: 'midnight',
    name: 'Midnight Luxury (Темный)',
    primary: '#08a826',
    hover: '#09c52d',
    bg: '#0C0A09',
    cardBg: '#1C1917',
    textMain: '#FAFAF9',
    textMuted: '#A8A29E',
    borderCard: '1px solid rgba(255, 255, 255, 0.05)',
    bgGradient: 'radial-gradient(at 0% 0%, rgba(8, 168, 38, 0.08) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(28, 25, 23, 0.8) 0px, transparent 50%), #0C0A09',
    isDark: true
  },
  {
    id: 'cyber',
    name: 'Cyber Punk (Футуристичный)',
    primary: '#EC4899',
    hover: '#DB2777',
    bg: '#0F0B1E',
    cardBg: '#1A1435',
    textMain: '#F3F4F6',
    textMuted: '#9CA3AF',
    borderCard: '1px solid rgba(236, 72, 153, 0.15)',
    bgGradient: 'radial-gradient(at 0% 0%, rgba(236, 72, 153, 0.12) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(99, 102, 241, 0.12) 0px, transparent 50%), #0F0B1E',
    isDark: true
  },
  {
    id: 'gold',
    name: 'Royal Sand (Золотой песок)',
    primary: '#D97706',
    hover: '#B45309',
    bg: '#FDFBF7',
    cardBg: '#ffffff',
    textMain: '#292524',
    textMuted: '#78716C',
    borderCard: '1px solid rgba(217, 119, 6, 0.1)',
    bgGradient: 'radial-gradient(at 0% 0%, rgba(217, 119, 6, 0.03) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(217, 119, 6, 0.05) 0px, transparent 50%), #FDFBF7',
    isDark: false
  }
]

export const ThemeCustomizer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activePreset, setActivePreset] = useState('nature')
  const [radius, setRadius] = useState('16px')
  const [font, setFont] = useState('Plus Jakarta Sans')
  const [blurValue, setBlurValue] = useState('20px')

  // Load from LocalStorage
  useEffect(() => {
    const savedPreset = localStorage.getItem('paykar-theme-preset') || 'nature'
    const savedRadius = localStorage.getItem('paykar-theme-radius') || '16px'
    const savedFont = localStorage.getItem('paykar-theme-font') || 'Plus Jakarta Sans'
    const savedBlur = localStorage.getItem('paykar-theme-blur') || '20px'

    setActivePreset(savedPreset)
    setRadius(savedRadius)
    setFont(savedFont)
    setBlurValue(savedBlur)

    applyPreset(savedPreset)
    applyRadius(savedRadius)
    applyFont(savedFont)
    applyBlur(savedBlur)
  }, [])

  const applyPreset = (presetId: string) => {
    const preset = PRESETS.find(p => p.id === presetId) || PRESETS[0]
    const root = document.documentElement
    
    // Set Theme Attribute for specific CSS overrides
    root.setAttribute('data-theme', preset.id)
    
    // Set CSS Custom Variables
    root.style.setProperty('--primary-green', preset.primary)
    root.style.setProperty('--primary-green-hover', preset.hover)
    root.style.setProperty('--text-main', preset.textMain)
    root.style.setProperty('--text-muted', preset.textMuted)
    root.style.setProperty('--bg-gradient', preset.bgGradient)
    root.style.setProperty('--bg-card', preset.cardBg)
    root.style.setProperty('--border-card', preset.borderCard)

    if (preset.isDark) {
      root.style.setProperty('--bg-input', '#292524')
      root.style.setProperty('--bg-input-focus', '#1C1917')
      root.style.setProperty('--border-focus', `1px solid ${preset.primary}`)
      root.style.setProperty('--primary-green-glow', `rgba(${preset.id === 'cyber' ? '236, 72, 153' : '8, 168, 38'}, 0.2)`)
    } else {
      root.style.setProperty('--bg-input', '#F5F5F4')
      root.style.setProperty('--bg-input-focus', '#ffffff')
      root.style.setProperty('--border-focus', '1px solid rgba(8, 168, 38, 0.4)')
      root.style.setProperty('--primary-green-glow', 'rgba(8, 168, 38, 0.12)')
    }

    localStorage.setItem('paykar-theme-preset', presetId)
    setActivePreset(presetId)
  }

  const applyRadius = (r: string) => {
    const root = document.documentElement
    root.style.setProperty('--radius-sm', r === '4px' ? '2px' : r === '16px' ? '10px' : '16px')
    root.style.setProperty('--radius-md', r)
    root.style.setProperty('--radius-lg', r === '4px' ? '8px' : r === '16px' ? '24px' : '36px')
    root.style.setProperty('--radius-xl', r === '4px' ? '12px' : r === '16px' ? '32px' : '48px')
    
    localStorage.setItem('paykar-theme-radius', r)
    setRadius(r)
  }

  const applyFont = (f: string) => {
    const root = document.documentElement
    root.style.setProperty('--font-family', f)
    document.body.style.fontFamily = `'${f}', -apple-system, BlinkMacSystemFont, sans-serif`
    
    localStorage.setItem('paykar-theme-font', f)
    setFont(f)
  }

  const applyBlur = (b: string) => {
    const root = document.documentElement
    root.style.setProperty('--glass-blur', b)
    
    localStorage.setItem('paykar-theme-blur', b)
    setBlurValue(b)
  }

  const resetAll = () => {
    applyPreset('nature')
    applyRadius('16px')
    applyFont('Plus Jakarta Sans')
    applyBlur('20px')
  }

  return (
    <>
      {/* Floating Control Button */}
      <motion.button
        className="theme-floating-trigger"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1, rotate: 30 }}
        whileTap={{ scale: 0.9 }}
        title="Настройка стиля интерфейса"
      >
        <SettingsIcon fontSize="medium" />
      </motion.button>

      {/* Side panel overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="theme-overlay"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="theme-drawer"
            >
              <div className="theme-drawer-header">
                <h3>Кастомизация стиля</h3>
                <button className="theme-close-btn" onClick={() => setIsOpen(false)}>
                  <CloseIcon />
                </button>
              </div>

              <div className="theme-drawer-body">
                {/* 1. Theme Presets */}
                <div className="theme-section">
                  <h4 className="theme-section-title">Цветовая гамма (Preset)</h4>
                  <div className="theme-presets-grid">
                    {PRESETS.map((p) => (
                      <button
                        key={p.id}
                        className={`preset-card ${activePreset === p.id ? 'active' : ''}`}
                        onClick={() => applyPreset(p.id)}
                        style={{
                          background: p.bg,
                          border: activePreset === p.id ? `2.5px solid ${p.primary}` : '1.5px solid rgba(28,25,23,0.1)'
                        }}
                      >
                        <div className="preset-color-dots">
                          <span style={{ backgroundColor: p.primary }} />
                          <span style={{ backgroundColor: p.cardBg }} />
                        </div>
                        <span className="preset-name" style={{ color: p.textMain }}>{p.name}</span>
                        {activePreset === p.id && (
                          <div className="preset-active-badge" style={{ backgroundColor: p.primary }}>
                            <CheckIcon style={{ fontSize: '12px', color: '#ffffff' }} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Border Radius */}
                <div className="theme-section">
                  <h4 className="theme-section-title">Скругление углов (Radius)</h4>
                  <div className="theme-options-row">
                    {[
                      { id: '4px', label: 'Острый' },
                      { id: '16px', label: 'Скругленный' },
                      { id: '28px', label: 'Ультра-круглый' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        className={`theme-option-btn ${radius === opt.id ? 'active' : ''}`}
                        onClick={() => applyRadius(opt.id)}
                      >
                        {opt.label} ({opt.id})
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Fonts */}
                <div className="theme-section">
                  <h4 className="theme-section-title">Шрифт интерфейса (Font)</h4>
                  <div className="theme-presets-grid">
                    {[
                      { id: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans (Премиум)' },
                      { id: 'Outfit', label: 'Outfit (Современный)' },
                      { id: 'Inter', label: 'Inter (Классический)' },
                      { id: 'Playfair Display', label: 'Playfair Display (Роскошный)' }
                    ].map((f) => (
                      <button
                        key={f.id}
                        className={`theme-option-btn font-card ${font === f.id ? 'active' : ''}`}
                        onClick={() => applyFont(f.id)}
                        style={{ fontFamily: `'${f.id}', sans-serif` }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Glassmorphism Blur */}
                <div className="theme-section">
                  <h4 className="theme-section-title">Интенсивность размытия (Blur)</h4>
                  <div className="theme-options-row">
                    {[
                      { id: '0px', label: 'Выкл' },
                      { id: '12px', label: 'Среднее' },
                      { id: '30px', label: 'Максимум' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        className={`theme-option-btn ${blurValue === opt.id ? 'active' : ''}`}
                        onClick={() => applyBlur(opt.id)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="theme-drawer-footer">
                <button className="theme-reset-btn" onClick={resetAll}>
                  Сбросить настройки
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
