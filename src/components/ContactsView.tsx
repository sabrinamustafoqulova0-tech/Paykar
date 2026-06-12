import React from 'react'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PersonIcon from '@mui/icons-material/Person'
import TelegramIcon from '@mui/icons-material/Telegram'
import InstagramIcon from '@mui/icons-material/Instagram'
import FacebookIcon from '@mui/icons-material/Facebook'

import contactsData from '../data/contacts.json'

export const ContactsView: React.FC = () => {
  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Наши контакты</h2>
      </div>

      <div className="contacts-grid">
        <div className="contacts-info-card">
          <div className="contact-item">
            <div className="contact-item-icon"><PhoneIcon /></div>
            <div className="contact-item-details">
              <span className="contact-item-title">Телефоны поддержки</span>
              {contactsData.phone.map((ph, i) => (
                <span key={i} className="contact-item-value">{ph}</span>
              ))}
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-item-icon"><EmailIcon /></div>
            <div className="contact-item-details">
              <span className="contact-item-title">Электронная почта</span>
              <span className="contact-item-value">{contactsData.email}</span>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-item-icon"><LocationOnIcon /></div>
            <div className="contact-item-details">
              <span className="contact-item-title">Адрес главного офиса</span>
              <span className="contact-item-value">{contactsData.address}</span>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-item-icon"><AccessTimeIcon /></div>
            <div className="contact-item-details">
              <span className="contact-item-title">Время работы</span>
              <span className="contact-item-value">Будни: {contactsData.workingHours.weekdays}</span>
              <span className="contact-item-value">Суббота: {contactsData.workingHours.saturday}</span>
              <span className="contact-item-value">Воскресенье: {contactsData.workingHours.sunday}</span>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-item-icon"><PersonIcon /></div>
            <div className="contact-item-details">
              <span className="contact-item-title">Социальные сети</span>
               <div className="social-links-row">
                 <a href={contactsData.telegram} target="_blank" rel="noopener noreferrer" className="social-circle-btn" title="Telegram"><TelegramIcon fontSize="inherit" /></a>
                 <a href={contactsData.instagram} target="_blank" rel="noopener noreferrer" className="social-circle-btn" title="Instagram"><InstagramIcon fontSize="inherit" /></a>
                 <a href={contactsData.facebook} target="_blank" rel="noopener noreferrer" className="social-circle-btn" title="Facebook"><FacebookIcon fontSize="inherit" /></a>
               </div>
            </div>
          </div>
        </div>

        {/* Yandex Map Mockup */}
        <div>
          <div className="map-mockup" style={{ height: '100%', minHeight: '380px' }}>
            <svg className="map-svg" viewBox="0 0 400 300" style={{ backgroundColor: '#f5f5f5' }}>
              <path d="M 0,150 L 400,150" stroke="#d5d5d5" strokeWidth="15" fill="none" />
              <path d="M 200,0 L 200,300" stroke="#d5d5d5" strokeWidth="15" fill="none" />
              <rect x="220" y="80" width="100" height="50" fill="#cdcdcd" rx="4" />
              <text x="270" y="110" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#555">Айни 16б</text>
            </svg>
            <div className="map-marker" style={{ top: '35%', left: '60%' }}>
              <div className="marker-label" style={{ backgroundColor: 'var(--primary-green)', color: '#fff' }}>Супермаркет Пайкар</div>
              <div className="marker-dot"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
