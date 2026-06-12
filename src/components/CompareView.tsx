import React from 'react'
import { useNavigate } from 'react-router-dom'
import StarIcon from '@mui/icons-material/Star'
import { useStore } from '../context/StoreContext'

export const CompareView: React.FC = () => {
  const navigate = useNavigate()
  const { compareList, setCompareList, toggleCompare } = useStore()

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Сравнение товаров</h2>
        <button
          className="section-tab"
          onClick={() => setCompareList([])}
          disabled={compareList.length === 0}
        >
          Очистить список
        </button>
      </div>

      {compareList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <h3>Нет товаров для сравнения</h3>
          <p>Добавляйте товары в сравнение из каталога, чтобы сопоставить их характеристики.</p>
          <button
            className="checkout-btn"
            style={{ maxWidth: '200px', marginTop: '20px' }}
            onClick={() => navigate('/catalog')}
          >
            В каталог
          </button>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', backgroundColor: '#fff', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(0,0,0,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px', borderBottom: '2px solid rgba(0,0,0,0.06)', width: '200px' }}>Характеристика</th>
                {compareList.map(product => (
                  <th key={product.id} style={{ padding: '12px', borderBottom: '2px solid rgba(0,0,0,0.06)', minWidth: '180px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center' }}>
                      <img src={product.images[0]} alt={product.name} style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                      <div style={{ fontWeight: '700', fontSize: '13px', height: '36px', overflow: 'hidden' }}>{product.name}</div>
                      <div style={{ color: 'var(--primary-green)', fontWeight: '800' }}>{product.price} сомони</div>
                      <button style={{ color: '#ef5350', fontSize: '12px', fontWeight: 'bold' }} onClick={() => toggleCompare(product)}>
                        Удалить
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '12px', fontWeight: '700', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>Бренд</td>
                {compareList.map(p => (
                  <td key={p.id} style={{ padding: '12px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>{p.brand}</td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: '12px', fontWeight: '700', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>Рейтинг</td>
                {compareList.map(p => (
                  <td key={p.id} style={{ padding: '12px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <StarIcon fontSize="inherit" style={{ color: '#ffb400' }} /> {p.rating}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: '12px', fontWeight: '700', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>Описание</td>
                {compareList.map(p => (
                  <td key={p.id} style={{ padding: '12px', borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {p.description}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
