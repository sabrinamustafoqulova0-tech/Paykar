import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import DeleteIcon from '@mui/icons-material/Delete'
import WarningIcon from '@mui/icons-material/Warning'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectCart, selectCartSubtotal, updateQuantity, removeFromCart, clearCart } from '../store/cartSlice'
import deliveryData from '../data/delivery.json'
import paymentData from '../data/payment.json'
import { PaymentMethodIcon } from './Icons'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
} as const

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
} as const


export const CartView: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const cart = useAppSelector(selectCart)
  const cartSubtotal = useAppSelector(selectCartSubtotal)

  // ── Local state (only relevant within this page) ──────────────────────────
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart')
  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    address: '',
    deliveryZone: deliveryData.cities[0]?.name || '',
    deliveryMethod: 1,
    paymentMethod: 1,
  })

  // ── Delivery price calculation ────────────────────────────────────────────
  const deliveryPrice = useMemo(() => {
    if (cart.length === 0) return 0
    const zone = deliveryData.cities.find(c => c.name === orderForm.deliveryZone) || deliveryData.cities[0]
    const freeFrom = (zone as any).freeFrom || 500
    return cartSubtotal >= freeFrom ? 0 : (zone?.price || 20)
  }, [cart.length, cartSubtotal, orderForm.deliveryZone])

  const cartTotal = cartSubtotal + deliveryPrice
  const isCartValidForCheckout = cartSubtotal >= 100

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="section-header">
        <h2 className="section-title">
          {checkoutStep === 'cart'
            ? 'Корзина покупателя'
            : checkoutStep === 'checkout'
            ? 'Оформление заказа'
            : 'Заказ успешно оформлен!'}
        </h2>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* ── Empty cart ───────────────────────────────────────────────────── */}
        {cart.length === 0 && checkoutStep !== 'success' ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ textAlign: 'center', padding: '60px 40px', color: 'var(--text-muted)' }}
          >
            <ShoppingCartIcon style={{ fontSize: '56px', color: 'var(--primary-green)', marginBottom: '20px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Ваша корзина пуста</h3>
            <p>Добавьте товары из каталога, чтобы сделать заказ.</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="checkout-btn" 
              style={{ maxWidth: '200px', marginTop: '24px' }} 
              onClick={() => navigate('/catalog')}
            >
              В каталог
            </motion.button>
          </motion.div>
        ) : (
          <React.Fragment>
            {/* ── Step 1: Cart items ───────────────────────────────────────── */}
            {checkoutStep === 'cart' && (
              <motion.div 
                key="cart-step"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.3 }}
                className="cart-layout"
              >
                <div className="cart-items-list">
                  {cart.map(item => (
                    <motion.div 
                      key={item.product.id} 
                      className="cart-item-row"
                      layout
                    >
                      <img src={item.product.images[0]} alt={item.product.name} className="cart-item-img" />
                      <div className="cart-item-info">
                        <h3 className="cart-item-name">{item.product.name}</h3>
                        <span className="cart-item-brand">Бренд: {item.product.brand}</span>
                      </div>

                      <div className="qty-selector" style={{ marginBottom: 0 }}>
                        <button className="qty-btn" onClick={() => dispatch(updateQuantity({ productId: item.product.id, quantity: item.quantity - 1 }))}>-</button>
                        <span className="qty-val">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => dispatch(updateQuantity({ productId: item.product.id, quantity: item.quantity + 1 }))}>+</button>
                      </div>

                      <div className="cart-item-price">
                        {item.product.price * item.quantity} c.
                        <div style={{ fontSize: '11.5px', fontWeight: '500', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {item.product.price} c. / шт
                        </div>
                      </div>

                      <button className="cart-item-delete" onClick={() => dispatch(removeFromCart(item.product.id))}>
                        <DeleteIcon fontSize="small" />
                      </button>
                    </motion.div>
                  ))}
                </div>

                <div className="cart-summary-card">
                  <h3 className="summary-title">Детали заказа</h3>
                  <div className="summary-row">
                    <span>Товары ({cart.reduce((s, i) => s + i.quantity, 0)} шт)</span>
                    <span>{cartSubtotal} сомони</span>
                  </div>
                  <div className="summary-row">
                    <span>Доставка (зона: {orderForm.deliveryZone})</span>
                    <span>{deliveryPrice === 0 ? 'Бесплатно' : `${deliveryPrice} сомони`}</span>
                  </div>

                  {!isCartValidForCheckout && (
                    <div style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.2)', color: '#b45309', padding: '14px', borderRadius: 'var(--radius-sm)', fontSize: '13px', marginTop: '20px', lineHeight: '1.5' }}>
                      <WarningIcon fontSize="inherit" style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                      <strong>Мин. сумма — 100 сомони.</strong> Добавьте ещё на <strong>{100 - cartSubtotal} сомони</strong>.
                    </div>
                  )}

                  <div className="summary-total-row">
                    <span>Итого:</span>
                    <span>{cartTotal} сомони</span>
                  </div>

                  <motion.button
                    whileHover={isCartValidForCheckout ? { scale: 1.02 } : {}}
                    whileTap={isCartValidForCheckout ? { scale: 0.98 } : {}}
                    className="checkout-btn"
                    disabled={!isCartValidForCheckout}
                    style={{ opacity: isCartValidForCheckout ? 1 : 0.5, cursor: isCartValidForCheckout ? 'pointer' : 'not-allowed' }}
                    onClick={() => setCheckoutStep('checkout')}
                  >
                    Перейти к оформлению
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Checkout form ────────────────────────────────────── */}
            {checkoutStep === 'checkout' && (
              <motion.div 
                key="checkout-step"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="cart-layout"
              >
                <div className="cart-items-list">
                  <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '24px' }}>Контактные данные и доставка</h3>
                  <form
                    className="checkout-form"
                    onSubmit={e => { e.preventDefault(); setCheckoutStep('success'); dispatch(clearCart()); }}
                  >
                    <div className="form-group">
                      <label>Ваше имя</label>
                      <input type="text" required className="form-input" placeholder="Иван Иванов"
                        value={orderForm.name} onChange={e => setOrderForm({ ...orderForm, name: e.target.value })} />
                    </div>

                    <div className="form-group">
                      <label>Номер телефона</label>
                      <input type="tel" required pattern="^\+992\d{9}$" className="form-input" placeholder="+992XXXXXXXXX"
                        value={orderForm.phone} onChange={e => setOrderForm({ ...orderForm, phone: e.target.value })} />
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Формат: +992XXXXXXXXX</span>
                    </div>

                    <div className="form-group">
                      <label>Зона доставки</label>
                      <select className="form-select" value={orderForm.deliveryZone}
                        onChange={e => setOrderForm({ ...orderForm, deliveryZone: e.target.value })}>
                        {deliveryData.cities.map((city, idx) => (
                          <option key={idx} value={city.name}>{city.name} ({city.price} сомони)</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Точный адрес</label>
                      <input type="text" required className="form-input" placeholder="ул. Рудаки, дом 15, кв. 42"
                        value={orderForm.address} onChange={e => setOrderForm({ ...orderForm, address: e.target.value })} />
                    </div>

                    <div className="form-group">
                      <label>Способ оплаты</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                        {paymentData.methods.map(method => (
                          <label key={method.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13.5px', cursor: 'pointer', padding: '12px', border: '1px solid rgba(28,25,23,0.06)', borderRadius: 'var(--radius-md)', transition: 'all 0.3s' }}>
                            <input type="radio" name="paymentMethod"
                              checked={orderForm.paymentMethod === method.id}
                              onChange={() => setOrderForm({ ...orderForm, paymentMethod: method.id })} />
                            <span>
                              <PaymentMethodIcon id={method.id} fontSize="small" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                              <strong style={{ color: 'var(--text-main)' }}>{method.name}</strong> — {method.description}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit" 
                      className="checkout-btn" 
                      style={{ marginTop: '24px' }}
                    >
                      Подтвердить заказ
                    </motion.button>
                  </form>
                </div>

                <div className="cart-summary-card">
                  <h3 className="summary-title">Состав заказа</h3>
                  <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '20px' }}>
                    {cart.map(item => (
                      <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '10px', color: 'var(--text-muted)' }}>
                        <span style={{ maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                          {item.product.name} x{item.quantity}
                        </span>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.product.price * item.quantity} c.</span>
                      </div>
                    ))}
                  </div>
                  <div className="summary-row" style={{ fontSize: '13px', borderTop: '1px solid rgba(28,25,23,0.06)', paddingTop: '14px' }}>
                    <span>Товары</span><span>{cartSubtotal} сомони</span>
                  </div>
                  <div className="summary-row" style={{ fontSize: '13px' }}>
                    <span>Доставка</span><span>{deliveryPrice === 0 ? 'Бесплатно' : `${deliveryPrice} сомони`}</span>
                  </div>
                  <div className="summary-total-row" style={{ fontSize: '18px' }}>
                    <span>Итого:</span><span>{cartTotal} сомони</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Step 3: Success ──────────────────────────────────────────── */}
            {checkoutStep === 'success' && (
              <motion.div 
                key="success-step"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{ textAlign: 'center', padding: '64px 32px', backgroundColor: '#fff', borderRadius: 'var(--radius-lg)', border: 'var(--border-card)', boxShadow: 'var(--shadow-modern)' }}
              >
                <CheckCircleIcon style={{ fontSize: '72px', color: 'var(--primary-green)', display: 'block', margin: '0 auto 24px' }} />
                <h3 style={{ fontSize: '26px', color: 'var(--primary-green)', fontWeight: 800 }}>Заказ успешно оформлен!</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '520px', margin: '18px auto 30px', lineHeight: '1.6', fontSize: '15px' }}>
                  Спасибо, <strong>{orderForm.name}</strong>! Менеджер свяжется с вами по номеру <strong>{orderForm.phone}</strong> в течение 10 минут.
                </p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="checkout-btn" 
                  style={{ maxWidth: '260px' }} 
                  onClick={() => navigate('/')}
                >
                  Вернуться на главную
                </motion.button>
              </motion.div>
            )}
          </React.Fragment>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
