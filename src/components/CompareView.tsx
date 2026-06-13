import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import StarIcon from '@mui/icons-material/Star'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectCompareList, toggleCompare, clearCompare } from '../store/compareSlice'

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


export const CompareView: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const compareList = useAppSelector(selectCompareList)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="section-header">
        <h2 className="section-title">Сравнение товаров</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="section-tab"
          onClick={() => dispatch(clearCompare())}
          disabled={compareList.length === 0}
        >
          Очистить список
        </motion.button>
      </motion.div>

      <AnimatePresence mode="wait">
        {compareList.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ textAlign: 'center', padding: '60px 40px', color: 'var(--text-muted)' }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Нет товаров для сравнения</h3>
            <p>Добавляйте товары в сравнение из каталога, чтобы сопоставить их характеристики.</p>
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
          <motion.div 
            key="table"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{ overflowX: 'auto', backgroundColor: '#fff', padding: '24px', borderRadius: 'var(--radius-lg)', border: 'var(--border-card)', boxShadow: 'var(--shadow-modern)' }}
          >
            <table>
              <thead>
                <tr>
                  <th style={{ width: '200px', fontWeight: 800, color: 'var(--text-main)' }}>Характеристика</th>
                  {compareList.map(product => (
                    <th key={product.id} style={{ minWidth: '180px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <img src={product.images[0]} alt={product.name} style={{ width: '88px', height: '88px', objectFit: 'contain', backgroundColor: '#FAF9F6', padding: '8px', borderRadius: 'var(--radius-md)' }} />
                        <div style={{ fontWeight: '700', fontSize: '13.5px', height: '40px', overflow: 'hidden', color: 'var(--text-main)', lineHeight: '1.4' }}>{product.name}</div>
                        <div style={{ color: 'var(--primary-green)', fontWeight: '800', fontSize: '15px' }}>{product.price} сомони</div>
                        <button style={{ color: '#ef4444', fontSize: '12.5px', fontWeight: '800', transition: 'color 0.2s' }} onClick={() => dispatch(toggleCompare(product))}>
                          Удалить
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: '700', color: 'var(--text-main)' }}>Бренд</td>
                  {compareList.map(p => (
                    <td key={p.id}>{p.brand}</td>
                  ))}
                </tr>
                <tr>
                  <td style={{ fontWeight: '700', color: 'var(--text-main)' }}>Рейтинг</td>
                  {compareList.map(p => (
                    <td key={p.id}>
                      <StarIcon fontSize="inherit" style={{ color: '#fbbf24', verticalAlign: 'middle', marginRight: '4px' }} /> {p.rating}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td style={{ fontWeight: '700', color: 'var(--text-main)' }}>Описание</td>
                  {compareList.map(p => (
                    <td key={p.id} style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', minWidth: '220px' }}>
                      {p.description}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
