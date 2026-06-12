import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import DeleteIcon from '@mui/icons-material/Delete'
import WarningIcon from '@mui/icons-material/Warning'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

import { useStore } from '../context/StoreContext'
import deliveryData from '../data/delivery.json'
import paymentData from '../data/payment.json'
import { PaymentMethodIcon } from './Icons'

export const CartView: React.FC = () => {
  const navigate = useNavigate()
  const { cart, setCart, cartSubtotal, updateQuantity, removeFromCart } = useStore()

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
    <div>
      <div className="section-header">
        <h2 className="section-title">
          {checkoutStep === 'cart'
            ? 'Корзина покупателя'
            : checkoutStep === 'checkout'
            ? 'Оформление заказа'
            : 'Заказ успешно оформлен!'}
        </h2>
      </div>

      {/* ── Empty cart ───────────────────────────────────────────────────── */}
      {cart.length === 0 && checkoutStep !== 'success' ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <ShoppingCartIcon style={{ fontSize: '48px', marginBottom: '15px' }} />
          <h3>Ваша корзина пуста</h3>
          <p>Добавьте товары из каталога, чтобы сделать заказ.</p>
          <button className="checkout-btn" style={{ maxWidth: '200px', marginTop: '20px' }} onClick={() => navigate('/catalog')}>
            В каталог
          </button>
        </div>
      ) : (
        <>
          {/* ── Step 1: Cart items ───────────────────────────────────────── */}
          {checkoutStep === 'cart' && (
            <div className="cart-layout">
              <div className="cart-items-list">
                {cart.map(item => (
                  <div key={item.product.id} className="cart-item-row">
                    <img src={item.product.images[0]} alt={item.product.name} className="cart-item-img" />
                    <div className="cart-item-info">
                      <h3 className="cart-item-name">{item.product.name}</h3>
                      <span className="cart-item-brand">Бренд: {item.product.brand}</span>
                    </div>

                    <div className="qty-selector" style={{ marginBottom: 0 }}>
                      <button className="qty-btn" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>-</button>
                      <span className="qty-val">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
                    </div>

                    <div className="cart-item-price">
                      {item.product.price * item.quantity} c.
                      <div style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-muted)' }}>
                        {item.product.price} c. / шт
                      </div>
                    </div>

                    <button className="cart-item-delete" onClick={() => removeFromCart(item.product.id)}>
                      <DeleteIcon />
                    </button>
                  </div>
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
                  <div style={{ backgroundColor: '#fff3cd', border: '1px solid #ffeeba', color: '#856404', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '12px', marginTop: '15px', lineHeight: '1.4' }}>
                    <WarningIcon fontSize="inherit" style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                    <strong>Мин. сумма — 100 сомони.</strong> Добавьте ещё на <strong>{100 - cartSubtotal} сомони</strong>.
                  </div>
                )}

                <div className="summary-total-row">
                  <span>Итого:</span>
                  <span>{cartTotal} сомони</span>
                </div>

                <button
                  className="checkout-btn"
                  disabled={!isCartValidForCheckout}
                  style={{ opacity: isCartValidForCheckout ? 1 : 0.5, cursor: isCartValidForCheckout ? 'pointer' : 'not-allowed' }}
                  onClick={() => setCheckoutStep('checkout')}
                >
                  Перейти к оформлению
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Checkout form ────────────────────────────────────── */}
          {checkoutStep === 'checkout' && (
            <div className="cart-layout">
              <div className="cart-items-list">
                <h3>Контактные данные и доставка</h3>
                <form
                  className="checkout-form"
                  onSubmit={e => { e.preventDefault(); setCheckoutStep('success'); setCart([]); }}
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
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Формат: +992XXXXXXXXX</span>
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '5px' }}>
                      {paymentData.methods.map(method => (
                        <label key={method.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer', padding: '8px', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 'var(--radius-sm)' }}>
                          <input type="radio" name="paymentMethod"
                            checked={orderForm.paymentMethod === method.id}
                            onChange={() => setOrderForm({ ...orderForm, paymentMethod: method.id })} />
                          <span>
                            <PaymentMethodIcon id={method.id} fontSize="small" style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                            <strong>{method.name}</strong> — {method.description}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button type="submit" className="checkout-btn" style={{ marginTop: '20px' }}>
                    Подтвердить заказ
                  </button>
                </form>
              </div>

              <div className="cart-summary-card">
                <h3 className="summary-title">Состав заказа</h3>
                <div style={{ maxHeight: '180px', overflowY: 'auto', marginBottom: '15px' }}>
                  {cart.map(item => (
                    <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', color: 'var(--text-muted)' }}>
                      <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.product.name} x{item.quantity}
                      </span>
                      <span>{item.product.price * item.quantity} c.</span>
                    </div>
                  ))}
                </div>
                <div className="summary-row" style={{ fontSize: '12px', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '10px' }}>
                  <span>Товары</span><span>{cartSubtotal} сомони</span>
                </div>
                <div className="summary-row" style={{ fontSize: '12px' }}>
                  <span>Доставка</span><span>{deliveryPrice === 0 ? 'Бесплатно' : `${deliveryPrice} сомони`}</span>
                </div>
                <div className="summary-total-row" style={{ fontSize: '16px' }}>
                  <span>Итого:</span><span>{cartTotal} сомони</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Success ──────────────────────────────────────────── */}
          {checkoutStep === 'success' && (
            <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: 'var(--shadow-modern)' }}>
              <CheckCircleIcon style={{ fontSize: '64px', color: 'var(--primary-green)', display: 'block', margin: '0 auto 20px' }} />
              <h3 style={{ fontSize: '24px', color: 'var(--primary-green)', marginTop: '20px' }}>Заказ успешно оформлен!</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '15px auto 25px', lineHeight: '1.5' }}>
                Спасибо, <strong>{orderForm.name}</strong>! Менеджер свяжется с вами по номеру <strong>{orderForm.phone}</strong> в течение 10 минут.
              </p>
              <button className="checkout-btn" style={{ maxWidth: '240px' }} onClick={() => navigate('/')}>
                Вернуться на главную
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
