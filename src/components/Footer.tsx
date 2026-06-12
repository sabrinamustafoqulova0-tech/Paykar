import React from 'react'
import { useNavigate } from 'react-router-dom'
import navigationData from '../data/navigation.json'

export const Footer: React.FC = () => {
  const navigate = useNavigate()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          {/* Col 1 — Buyers */}
          <div>
            <h4 className="footer-col-title">Покупателям</h4>
            <ul className="footer-links">
              {navigationData.footer.buyers.map((item, idx) => (
                <li key={idx} className="footer-link-item">
                  <button
                    onClick={() => item.path === '/delivery' ? navigate('/delivery') : navigate('/')}
                    className="footer-link"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2 — Partners */}
          <div>
            <h4 className="footer-col-title">Партнерам</h4>
            <ul className="footer-links">
              {navigationData.footer.partners.map((item, idx) => (
                <li key={idx} className="footer-link-item">
                  <button
                    onClick={() => item.path.includes('stores') ? navigate('/contacts') : navigate('/about')}
                    className="footer-link"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Info */}
          <div>
            <h4 className="footer-col-title">Информация</h4>
            <ul className="footer-links">
              {navigationData.footer.info.map((item, idx) => (
                <li key={idx} className="footer-link-item">
                  <button
                    onClick={() => {
                      if (item.path === '/about') navigate('/about')
                      else if (item.path === '/contacts') navigate('/contacts')
                      else navigate('/about')
                    }}
                    className="footer-link"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contacts */}
          <div>
            <h4 className="footer-col-title">Контакты</h4>
            <p className="footer-contact-item">Короткий номер: <strong>4400</strong></p>
            <p className="footer-contact-item">Телефон: <strong>+992 44 630 2020</strong></p>
            <p className="footer-contact-item">Адрес: г. Душанбе, ул. Айни, 16б</p>
            <p className="footer-contact-item">Email: info@paykar.tj</p>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Торговая сеть «Пайкар». Все права защищены.</span>
          <span>Разработано для портфолио</span>
        </div>
      </div>
    </footer>
  )
}
