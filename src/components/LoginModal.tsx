import React from 'react'
import { motion } from 'framer-motion'
import CloseIcon from '@mui/icons-material/Close'

export interface LoginModalProps {
  open: boolean
  onClose: () => void
  loginForm: { phone: string; password: string }
  setLoginForm: (form: { phone: string; password: string }) => void
  onSubmit: (e: React.FormEvent) => void
}

export const LoginModal: React.FC<LoginModalProps> = ({
  open: _open,
  onClose,
  loginForm,
  setLoginForm,
  onSubmit
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } }}
      exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }}
      className="modal-overlay" 
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }}
        exit={{ opacity: 0, scale: 0.96, y: 12, transition: { duration: 0.25, ease: [0.7, 0, 0.84, 0] } }}
        className="login-card" 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </button>
        <div className="logo" style={{ justifyContent: 'center', marginBottom: '24px' }}>
          <svg viewBox="0 0 100 100" style={{ width: '64px', height: '64px', flexShrink: 0 }}>
            <g transform="translate(50, 50)">
              {[0, 72, 144, 216, 288].map((angle, idx) => (
                <g key={idx} transform={`rotate(${angle})`}>
                  <path d="M -7,-36 L 7,-36 L 14,-22 L 0,-8 L -14,-22 Z" fill="#18a44c" />
                </g>
              ))}
              <circle cx="0" cy="0" r="6" fill="#ffffff" />
            </g>
          </svg>
        </div>
        <h3 className="login-title">Вход в личный кабинет</h3>
        <p className="login-subtitle">Для оформления заказа или просмотра корзины необходимо авторизоваться</p>
        
        <form className="login-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label>Номер телефона или Email</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="+992XXXXXXXXX / email"
              value={loginForm.phone}
              onChange={(e) => setLoginForm({ ...loginForm, phone: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              required
              className="form-input"
              placeholder="••••••••"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            />
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="login-submit-btn"
          >
            Войти
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  )
}
