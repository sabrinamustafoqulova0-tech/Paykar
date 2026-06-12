import React from 'react'
import CloseIcon from '@mui/icons-material/Close'

export interface LoginModalProps {
  open: boolean
  onClose: () => void
  loginForm: { phone: string; password: string }
  setLoginForm: React.Dispatch<React.SetStateAction<{ phone: string; password: string }>>
  onSubmit: (e: React.FormEvent) => void
}

export const LoginModal: React.FC<LoginModalProps> = ({
  open,
  onClose,
  loginForm,
  setLoginForm,
  onSubmit
}) => {
  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="login-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </button>
        <div className="logo" style={{ justifyContent: 'center', marginBottom: '20px' }}>
          <svg viewBox="0 0 100 100" style={{ width: '56px', height: '56px', flexShrink: 0 }}>
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
          <button type="submit" className="login-submit-btn">Войти</button>
        </form>
      </div>
    </div>
  )
}
