import React, { useState } from 'react'
import MarkunreadIcon from '@mui/icons-material/Markunread';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'

// Redux
import { useAppDispatch, useAppSelector } from './store/hooks'
import {
  login, logout, hideLoginToast,
  setLoginModalOpen, setLoginForm,
} from './store/authSlice'
import { clearCart } from './store/cartSlice'
import { selectCartItemCount } from './store/cartSlice'
import { selectCompareList } from './store/compareSlice'
import { selectSelectedProduct, setSelectedProduct } from './store/uiSlice'
import { addToCart } from './store/cartSlice'
import { toggleCompare } from './store/compareSlice'

// Global layout components
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { ChatWidget } from './components/ChatWidget'
import { LoginModal } from './components/LoginModal'
import { ProductDetailModal } from './components/ProductDetailModal'
import { ThemeCustomizer } from './components/ThemeCustomizer'

// Page-level views
import { HomeView } from './components/HomeView'
import { CatalogView } from './components/CatalogView'
import { CategoriesView } from './components/CategoriesView'
import { PromotionsView } from './components/PromotionsView'
import { AboutView } from './components/AboutView'
import { DeliveryView } from './components/DeliveryView'
import { ContactsView } from './components/ContactsView'
import { CompareView } from './components/CompareView'
import { CartView } from './components/CartView'

// Icons
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import PhoneIcon from '@mui/icons-material/Phone'
import SendIcon from '@mui/icons-material/Send'

import reviewsData from './data/reviews.json'
import type { Review } from './types'

// ─── Protected Route ──────────────────────────────────────────────────────────

const ProtectedCartRoute: React.FC = () => {
  const isLoggedIn = useAppSelector(s => s.auth.isLoggedIn)
  return isLoggedIn ? <CartView /> : <Navigate to="/" replace />
}

// ─── App Content ──────────────────────────────────────────────────────────────

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  // ── Auth state from Redux ────────────────────────────────────────────────
  const isLoggedIn      = useAppSelector(s => s.auth.isLoggedIn)
  const loginModalOpen  = useAppSelector(s => s.auth.loginModalOpen)
  const showLoginToast  = useAppSelector(s => s.auth.showLoginToast)
  const loginForm       = useAppSelector(s => s.auth.loginForm)

  // ── Cart / Compare / UI from Redux ───────────────────────────────────────
  const cartCount       = useAppSelector(selectCartItemCount)
  const compareList     = useAppSelector(selectCompareList)
  const selectedProduct = useAppSelector(selectSelectedProduct)

  // ── Active product reviews (derived) ────────────────────────────────────
  const activeProductReviews: Review[] = selectedProduct
    ? (reviewsData as Review[]).filter(r => r.productId === selectedProduct.id)
    : []

  // ── Auth handlers ────────────────────────────────────────────────────────
  const handleCartClick = () => {
    if (!isLoggedIn) {
      dispatch(setLoginModalOpen(true))
    } else {
      navigate('/cart')
    }
  }

  const handleFakeLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(login())
    navigate('/cart')
    setTimeout(() => dispatch(hideLoginToast()), 3000)
  }

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearCart())
    navigate('/')
  }

  // ── Chat state (local, UI-only) ──────────────────────────────────────────
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'operator'; text: string }>>([
    { sender: 'operator', text: 'Здравствуйте! Готов помочь вам. Напишите мне, если у вас появятся вопросы.' }
  ])

  // ── Call-request state (local, UI-only) ──────────────────────────────────
  const [callRequestOpen, setCallRequestOpen] = useState(false)
  const [callRequestPhone, setCallRequestPhone] = useState('')
  const [callRequestSuccess, setCallRequestSuccess] = useState(false)

  // ── Chat handler ──────────────────────────────────────────────────────────
  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    const userMsg = chatInput
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }])
    setChatInput('')
    setTimeout(() => {
      let reply = 'Спасибо за ваше сообщение! Наш оператор ответит вам в ближайшее время.'
      const lower = userMsg.toLowerCase()
      if (lower.includes('доставк') || lower.includes('адрес')) {
        reply = 'Доставка по Душанбе — в течение 2 часов. Стоимость от 20 сомони. Бесплатно от 500 сомони.'
      } else if (lower.includes('оплат') || lower.includes('карт')) {
        reply = 'Принимаем наличные, Корти Милли (терминал у курьера), Alif Mobi QR.'
      } else if (lower.includes('рассроч') || lower.includes('салом')) {
        reply = 'Принимаем карту рассрочки Салом от Alif на 1-2 месяца без процентов.'
      } else if (lower.includes('минимальн') || lower.includes('заказ')) {
        reply = 'Минимальная сумма заказа для доставки — 100 сомони.'
      }
      setChatMessages(prev => [...prev, { sender: 'operator', text: reply }])
    }, 1000)
  }

  // ── Call-request handler ──────────────────────────────────────────────────
  const handleCallRequest = (e: React.FormEvent) => {
    e.preventDefault()
    if (!callRequestPhone.trim()) return
    setCallRequestSuccess(true)
    setTimeout(() => {
      setCallRequestOpen(false)
      setCallRequestSuccess(false)
      setCallRequestPhone('')
    }, 3000)
  }

  return (
    <div id="root">

      {/* ── Toast banner ──────────────────────────────────────────────────── */}
      {showLoginToast && (
        <div className="toast-banner">
          <CheckIcon fontSize="small" />
          <span>Вход выполнен! Добро пожаловать.</span>
        </div>
      )}

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <Header
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        setLoginModalOpen={(open) => dispatch(setLoginModalOpen(open))}
        setCallRequestOpen={setCallRequestOpen}
        compareList={compareList}
        cartCount={cartCount}
        handleCartClick={handleCartClick}
      />

      {/* ── Main content with React Router routes ─────────────────────────── */}
      <main className="main-content">
        <div className="container">
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/catalog" element={<CatalogView />} />
            <Route path="/categories" element={<CategoriesView />} />
            <Route path="/promotions" element={<PromotionsView />} />
            <Route path="/about" element={<AboutView />} />
            <Route path="/delivery" element={<DeliveryView />} />
            <Route path="/contacts" element={<ContactsView />} />
            <Route path="/compare" element={<CompareView />} />
            <Route path="/cart" element={<ProtectedCartRoute />} />
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <Footer />

      {/* ── Floating side panel ───────────────────────────────────────────── */}
      <div className="sticky-widget">
        <a href="tel:4400" className="sticky-tab" title="Позвонить"><PhoneIcon fontSize="small" /></a>
        <a href="https://t.me/tmpaykar" target="_blank" rel="noopener noreferrer" className="sticky-tab" title="Telegram"><SendIcon fontSize="small" /></a>
        <button className="sticky-tab" title="Написать" onClick={() => setChatOpen(!chatOpen)}>
          <MarkunreadIcon />
        </button>
      </div>

      {/* ── Chat widget ───────────────────────────────────────────────────── */}
      <ChatWidget
        chatOpen={chatOpen}
        setChatOpen={setChatOpen}
        chatInput={chatInput}
        setChatInput={setChatInput}
        chatMessages={chatMessages}
        sendChatMessage={sendChatMessage}
      />

      {/* ── Login modal ───────────────────────────────────────────────────── */}
      <LoginModal
        open={loginModalOpen}
        onClose={() => dispatch(setLoginModalOpen(false))}
        loginForm={loginForm}
        setLoginForm={(form) => dispatch(setLoginForm(form))}
        onSubmit={handleFakeLoginSubmit}
      />

      {/* ── Product detail modal ──────────────────────────────────────────── */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => dispatch(setSelectedProduct(null))}
        onAddToCart={(product) => { dispatch(addToCart({ product })) }}
        compareList={compareList}
        onToggleCompare={(product) => dispatch(toggleCompare(product))}
        reviews={activeProductReviews}
      />

      {/* ── Call request modal ────────────────────────────────────────────── */}
      {callRequestOpen && (
        <div className="modal-overlay" onClick={() => setCallRequestOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', padding: '30px' }}>
            <button className="modal-close" onClick={() => setCallRequestOpen(false)}>
              <CloseIcon fontSize="small" />
            </button>
            <h3 className="section-title" style={{ fontSize: '20px', marginBottom: '15px' }}>Заказать обратный звонок</h3>

            {callRequestSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckIcon style={{ fontSize: '48px', color: 'var(--primary-green)', marginBottom: '10px' }} />
                <p style={{ fontWeight: 'bold', color: 'var(--primary-green)' }}>Заявка отправлена!</p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '5px' }}>Мы перезвоним вам в ближайшее время.</p>
              </div>
            ) : (
              <form onSubmit={handleCallRequest} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  Оставьте свой номер, и наш специалист свяжется с вами.
                </p>
                <div className="form-group">
                  <label>Номер телефона</label>
                  <input
                    type="tel"
                    required
                    pattern="^\+992\d{9}$"
                    className="form-input"
                    placeholder="+992XXXXXXXXX"
                    value={callRequestPhone}
                    onChange={e => setCallRequestPhone(e.target.value)}
                  />
                </div>
                <button type="submit" className="checkout-btn">Жду звонка</button>
              </form>
            )}
          </div>
        </div>
      )}
      {/* ── Theme customizer panel ────────────────────────────────────────── */}
      <ThemeCustomizer />

    </div>
  )
}

// ─── Root App ──────────────────────────────────────────────────────────────────

const App: React.FC = () => <AppContent />

export default App