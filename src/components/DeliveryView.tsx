import React, { useState } from 'react'
import deliveryData from '../data/delivery.json'
import paymentData from '../data/payment.json'
import { PaymentMethodIcon } from './Icons'

export const DeliveryView: React.FC = () => {
  // Local state — only needed on this page
  const [activeMapZone, setActiveMapZone] = useState('Душанбе (Внутри города)')

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Доставка и оплата по Душанбе</h2>
      </div>

      <div className="delivery-grid">
        {/* ── Zones List ────────────────────────────────────────────────── */}
        <div className="delivery-zones-card">
          <h3>Зоны обслуживания и тарифы</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '15px' }}>
            Нажмите на зону, чтобы увидеть её расположение на карте:
          </p>
          <div className="zones-list">
            {deliveryData.cities.map((city, idx) => (
              <div
                key={idx}
                className="zone-row"
                style={{
                  cursor: 'pointer',
                  backgroundColor: activeMapZone === city.name ? 'var(--primary-green-light)' : 'transparent',
                  border: activeMapZone === city.name ? '1px solid var(--primary-green)' : '1px solid rgba(0,0,0,0.05)'
                }}
                onClick={() => setActiveMapZone(city.name)}
              >
                <span className="zone-name">{city.name}</span>
                <div className="zone-details">
                  <span className="zone-price">{city.price} сомони</span>
                  <span className="zone-time">{city.deliveryTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Map Mockup ────────────────────────────────────────────────── */}
        <div className="delivery-map-card">
          <div className="map-canvas">
            <div className="map-grid-bg"></div>
            <div className="map-river"></div>
            {deliveryData.cities.map((city, idx) => (
              <div
                key={idx}
                className={`map-zone-overlay zone-coord-${idx + 1} ${activeMapZone === city.name ? 'active' : ''}`}
                onClick={() => setActiveMapZone(city.name)}
              >
                <span className="zone-badge">{city.name}</span>
              </div>
            ))}
            <div className="map-pin main-hq" title="Центральный офис Пайкар">
              <div className="pin-pulse"></div>
              <div className="pin-label">Пайкар HQ</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Payment Methods ────────────────────────────────────────────────── */}
      <div className="section-header" style={{ marginTop: '50px' }}>
        <h2 className="section-title">Способы оплаты</h2>
      </div>

      <div className="about-features" style={{ marginBottom: '40px' }}>
        {paymentData.methods.map(method => (
          <div key={method.id} className="feature-box">
            <div className="feature-icon">
              <PaymentMethodIcon id={method.id} />
            </div>
            <div className="feature-details">
              <h3 className="feature-title">{method.name}</h3>
              <p className="feature-desc">{method.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Notes ─────────────────────────────────────────────────────────── */}
      <div className="delivery-notes">
        <h4 style={{ marginBottom: '10px', color: 'var(--primary-green)' }}>Условия доставки:</h4>
        <ul style={{ paddingLeft: '20px', fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          <li>Приём заказов — круглосуточно на сайте.</li>
          <li>Доставка — ежедневно с <strong>08:00 до 22:00</strong>.</li>
          <li>Минимальная сумма заказа — <strong>100 сомони</strong>.</li>
          <li>При заказе от <strong>350 сомони</strong> — доставка по Зоне 1 <strong>бесплатно</strong>.</li>
        </ul>
      </div>
    </div>
  )
}
