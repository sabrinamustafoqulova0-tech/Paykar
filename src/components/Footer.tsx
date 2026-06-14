import React from 'react'
import { useNavigate } from 'react-router-dom'
import navigationData from '../data/navigation.json'
import contactsData from '../data/contacts.json'

import TelegramIcon from '@mui/icons-material/Telegram'
import InstagramIcon from '@mui/icons-material/Instagram'
import FacebookIcon from '@mui/icons-material/Facebook'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import YouTubeIcon from '@mui/icons-material/YouTube'

const ViberIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" {...props}>
    <path d="M19.37 13.52c-.62-.48-1.5-.42-2.06.14l-.86.86c-.14.14-.36.17-.53.08a11.35 11.35 0 01-4.52-4.52c-.09-.17-.06-.39.08-.53l.86-.86c.56-.56.62-1.44.14-2.06L10.3 4.22c-.56-.72-1.63-.75-2.23-.07L6.46 5.86c-.95.95-1.2 2.37-.62 3.56 1.48 3.03 3.93 5.48 6.96 6.96 1.19.58 2.61.33 3.56-.62l1.71-1.61c.68-.6.65-1.67-.07-2.23l-2.41-2.4z"/>
  </svg>
)

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" {...props}>
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.72 2.96 1.85 3.97.1.09.21.19.32.28v3.46c-1.01-.16-1.98-.57-2.85-1.16-.27-.19-.52-.4-.75-.63-.03 2.61-.01 5.23-.03 7.84-.04 1.23-.39 2.45-1.04 3.5-1.07 1.8-3.03 2.86-5.12 2.72-2.32-.08-4.39-1.63-5.06-3.85-.79-2.48.29-5.22 2.58-6.31 1.15-.59 2.5-.7 3.73-.31v3.54c-.78-.31-1.67-.23-2.39.23-.9.52-1.36 1.59-1.12 2.61.21.98 1.07 1.7 2.08 1.73.94.05 1.84-.52 2.19-1.39.14-.33.2-.69.2-1.05V.02z" />
  </svg>
)

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
            
            <div className="footer-socials" style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
              <a href={contactsData.telegram} target="_blank" rel="noopener noreferrer" className="footer-social-link" title="Telegram" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '20px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                <TelegramIcon fontSize="inherit" />
              </a>
              <a href={contactsData.instagram} target="_blank" rel="noopener noreferrer" className="footer-social-link" title="Instagram" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '20px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                <InstagramIcon fontSize="inherit" />
              </a>
              <a href={contactsData.facebook} target="_blank" rel="noopener noreferrer" className="footer-social-link" title="Facebook" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '20px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                <FacebookIcon fontSize="inherit" />
              </a>
              <a href={(contactsData as any).whatsapp} target="_blank" rel="noopener noreferrer" className="footer-social-link" title="WhatsApp" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '20px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                <WhatsAppIcon fontSize="inherit" />
              </a>
              <a href={(contactsData as any).youtube} target="_blank" rel="noopener noreferrer" className="footer-social-link" title="YouTube" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '20px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                <YouTubeIcon fontSize="inherit" />
              </a>
              <a href={(contactsData as any).viber} target="_blank" rel="noopener noreferrer" className="footer-social-link" title="Viber" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '20px', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                <ViberIcon />
              </a>
              <a href={(contactsData as any).tiktok} target="_blank" rel="noopener noreferrer" className="footer-social-link" title="TikTok" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '20px', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                <TikTokIcon />
              </a>
            </div>
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
