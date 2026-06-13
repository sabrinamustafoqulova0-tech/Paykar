import React, { useState } from 'react'
import { motion } from 'framer-motion'
import deliveryData from '../data/delivery.json'
import paymentData from '../data/payment.json'
import { PaymentMethodIcon } from './Icons'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
} as const

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
} as const


export const DeliveryView: React.FC = () => {
  const [activeMapZone, setActiveMapZone] = useState('Душанбе (Внутри города)')

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="section-header" id="delivery">
        <h2 className="section-title">Доставка и оплата по Душанбе</h2>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '36px'
        }}
      >
        <div style={{
          maxWidth: '560px',
          width: '100%',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
          background: 'var(--card-bg)',
          padding: '12px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          
        </div>
      </motion.div>

      <div className="delivery-grid">
        {/* ── Zones List ────────────────────────────────────────────────── */}
        <motion.div variants={itemVariants} className="delivery-zones-card">
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>Зоны обслуживания и тарифы</h3>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Нажмите на зону, чтобы увидеть её расположение на карте:
          </p>
          <div className="zones-list">
            {deliveryData.cities.map((city, idx) => (
              <motion.div
                key={idx}
                className="zone-row"
                style={{
                  cursor: 'pointer',
                  backgroundColor: activeMapZone === city.name ? 'var(--primary-green-light)' : 'transparent',
                  borderColor: activeMapZone === city.name ? 'var(--primary-green)' : 'rgba(28,25,23,0.05)'
                }}
                whileHover={{ scale: 1.02, x: 4 }}
                onClick={() => setActiveMapZone(city.name)}
              >
                <span className="zone-name">{city.name}</span>
                <div className="zone-details">
                  <span className="zone-price">{city.price} сомони</span>
                  <span className="zone-time">{city.deliveryTime}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Map Mockup ────────────────────────────────────────────────── */}
        <motion.div variants={itemVariants} className="delivery-map-card">
          <div className="map-canvas">
            <div className="map-grid-bg"></div>
            <div className="map-river"></div>
            {deliveryData.cities.map((city, idx) => (
              <motion.div
                key={idx}
                className={`map-zone-overlay zone-coord-${idx + 1} ${activeMapZone === city.name ? 'active' : ''}`}
                onClick={() => setActiveMapZone(city.name)}
                whileHover={{ scale: 1.05 }}
              >
                <span className="zone-badge">{city.name}</span>
              </motion.div>
            ))}
            <div className="map-pin main-hq" title="Центральный офис Пайкар">
              <div className="pin-pulse"></div>
              <div className="pin-label">Пайкар HQ</div>
            </div>
          </div>
          <img src="https://scontent.fdyu3-1.fna.fbcdn.net/v/t39.30808-6/488600639_999305975536760_3274087676808099012_n.jpg?stp=dst-jpg_tt6&cstp=mx1350x1350&ctp=s590x590&_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_ohc=IJGKoCFiegYQ7kNvwHgJyaF&_nc_oc=Adp4rv9kXD0iMN5f9aV9_i97BQHIQpjR9LtNw1NO5k7bKcSGE4U9C1nG6MECf-tDkFM&_nc_zt=23&_nc_ht=scontent.fdyu3-1.fna&_nc_gid=TXQ3mg7gIUcpIvKe_3EvQg&_nc_ss=7b289&oh=00_Af-xfrzvsLZUFHkkq2UPVCNapuOz_I7-wMPDcIDnaoRKbQ&oe=6A337F94" alt="Доставка Пайкар" style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-md)',marginTop: '10px', display: 'block' }} />

        </motion.div>
      </div>

      {/* ── Payment Methods ────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="section-header" style={{ marginTop: '56px' }} id="payment">
        <h2 className="section-title">Способы оплаты</h2>
      </motion.div>

      <motion.div variants={containerVariants} className="about-features" style={{ marginBottom: '48px' }}>
        {paymentData.methods.map(method => (
          <motion.div 
            key={method.id} 
            variants={itemVariants}
            className="feature-box"
            whileHover={{ y: -6 }}
          >
            <div className="feature-icon">
              <PaymentMethodIcon id={method.id} />
            </div>
            <div className="feature-details">
              <h3 className="feature-title">{method.name}</h3>
              <p className="feature-desc">{method.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Notes ─────────────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="delivery-notes">
        <h4 style={{ marginBottom: '12px', color: 'var(--primary-green)', fontWeight: 800 }}>Условия доставки:</h4>
        <ul style={{ paddingLeft: '24px', fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          <li>Приём заказов — круглосуточно на сайте.</li>
          <li>Доставка — ежедневно с <strong>08:00 до 22:00</strong>.</li>
          <li>Минимальная сумма заказа — <strong>100 сомони</strong>.</li>
          <li>При заказе от <strong>350 сомони</strong> — доставка по Зоне 1 <strong>бесплатно</strong>.</li>
        </ul>
      </motion.div>

      {/* ── Returns Policy ─────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="section-header" style={{ marginTop: '56px' }} id="returns">
        <h2 className="section-title">Возврат товара</h2>
      </motion.div>

      <motion.div variants={itemVariants} className="delivery-notes" style={{ marginBottom: '40px' }}>
        <h4 style={{ marginBottom: '12px', color: 'var(--primary-green)', fontWeight: 800 }}>Правила и порядок возврата:</h4>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
          Наш интернет-магазин ценит ваше доверие и гарантирует быстрое рассмотрение обращений по возврату:
        </p>
        <ul style={{ paddingLeft: '24px', fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          <li>Возврат товаров надлежащего качества возможен в течение <strong>14 дней</strong> с момента покупки, если сохранен товарный вид, упаковка и чеки.</li>
          <li>Скоропортящиеся продовольственные товары (мясо, молочные продукты и т.д.) подлежат возврату только в случае обнаружения ненадлежащего качества в момент получения у курьера.</li>
          <li>Для оформления возврата обратитесь в службу поддержки по короткому номеру <strong>4400</strong> или напишите нам в чат.</li>
        </ul>
      </motion.div>
    </motion.div>
  )
}
