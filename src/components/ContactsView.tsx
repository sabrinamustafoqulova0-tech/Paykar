import React from 'react'
import { motion } from 'framer-motion'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PersonIcon from '@mui/icons-material/Person'
import TelegramIcon from '@mui/icons-material/Telegram'
import InstagramIcon from '@mui/icons-material/Instagram'
import FacebookIcon from '@mui/icons-material/Facebook'

import contactsData from '../data/contacts.json'

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


export const ContactsView: React.FC = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="section-header">
        <h2 className="section-title">Наши контакты</h2>
      </motion.div>

      <div className="contacts-grid">
        <motion.div variants={itemVariants} className="contacts-info-card">
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
                 <motion.a 
                   whileHover={{ scale: 1.15 }}
                   whileTap={{ scale: 0.95 }}
                   href={contactsData.telegram} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="social-circle-btn" 
                   title="Telegram"
                 >
                   <TelegramIcon fontSize="inherit" />
                 </motion.a>
                 <motion.a 
                   whileHover={{ scale: 1.15 }}
                   whileTap={{ scale: 0.95 }}
                   href={contactsData.instagram} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="social-circle-btn" 
                   title="Instagram"
                 >
                   <InstagramIcon fontSize="inherit" />
                 </motion.a>
                 <motion.a 
                   whileHover={{ scale: 1.15 }}
                   whileTap={{ scale: 0.95 }}
                   href={contactsData.facebook} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="social-circle-btn" 
                   title="Facebook"
                 >
                   <FacebookIcon fontSize="inherit" />
                 </motion.a>
               </div>
            </div>
          </div>
        </motion.div>

        {/* Yandex Map Mockup */}
        <motion.div variants={itemVariants}>
          <div className="map-mockup" style={{ height: '100%', minHeight: '420px' }}>
            <svg className="map-svg" viewBox="0 0 400 300" style={{ backgroundColor: '#FAF9F6' }}>
              <path d="M 0,150 L 400,150" stroke="#E6E5E2" strokeWidth="15" fill="none" />
              <path d="M 200,0 L 200,300" stroke="#E6E5E2" strokeWidth="15" fill="none" />
              <rect x="220" y="80" width="100" height="50" fill="#E1DFDA" rx="8" />
              <text x="270" y="110" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#57534E">Айни 16б</text>
            </svg>
            <div className="map-marker" style={{ top: '35%', left: '60%' }}>
              <div className="marker-label" style={{ backgroundColor: 'var(--primary-green)', color: '#fff' }}>Супермаркет Пайкар</div>
              <div className="marker-dot"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
