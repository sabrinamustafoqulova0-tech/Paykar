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
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import YouTubeIcon from '@mui/icons-material/YouTube'

import contactsData from '../data/contacts.json'

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
               <div className="social-links-row" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
                 <motion.a 
                   whileHover={{ scale: 1.15 }}
                   whileTap={{ scale: 0.95 }}
                   href={(contactsData as any).whatsapp} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="social-circle-btn" 
                   title="WhatsApp"
                 >
                   <WhatsAppIcon fontSize="inherit" />
                 </motion.a>
                 <motion.a 
                   whileHover={{ scale: 1.15 }}
                   whileTap={{ scale: 0.95 }}
                   href={(contactsData as any).youtube} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="social-circle-btn" 
                   title="YouTube"
                 >
                   <YouTubeIcon fontSize="inherit" />
                 </motion.a>
                 <motion.a 
                   whileHover={{ scale: 1.15 }}
                   whileTap={{ scale: 0.95 }}
                   href={(contactsData as any).viber} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="social-circle-btn" 
                   title="Viber"
                 >
                   <ViberIcon style={{ fontSize: '1.25rem' }} />
                 </motion.a>
                 <motion.a 
                   whileHover={{ scale: 1.15 }}
                   whileTap={{ scale: 0.95 }}
                   href={(contactsData as any).tiktok} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="social-circle-btn" 
                   title="TikTok"
                 >
                   <TikTokIcon style={{ fontSize: '1.1rem' }} />
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
