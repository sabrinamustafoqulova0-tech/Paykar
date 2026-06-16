import React, { useRef, useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import ChatIcon from '@mui/icons-material/Chat'
import PersonIcon from '@mui/icons-material/Person'

// ── Gemini API Config ──────────────────────────────────────────────────────────
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`

// ── System prompt для Gemini ──────────────────────────────────────────────────
const SYSTEM_PROMPT = `Ты — умный AI-ассистент интернет-магазина Пайкар (paykar.shop) в Душанбе, Таджикистан.
Ты помогаешь покупателям найти нужные товары, даёшь рекомендации и отвечаешь на вопросы о магазине.

ИНФОРМАЦИЯ О МАГАЗИНЕ:
- Название: Пайкар (Paykar) — ведущий продуктовый супермаркет в Душанбе
- Телефон: +992 44 630 2020
- Telegram: @tmpaykar
- Доставка по Душанбе: в течение 2 часов, от 20 сомони, бесплатно от 500 сомони
- Минимальный заказ для доставки: 100 сомони
- Оплата: наличные, Корти Милли (терминал у курьера), Alif Mobi QR, карта рассрочки Салом

ОСНОВНЫЕ КАТЕГОРИИ И ПОПУЛЯРНЫЕ ТОВАРЫ:
1. Молочные продукты: Молоко Весёлый Молочник 3.2% 1л (14 сомони), Сметана Простоквашино 15% 300г (18 сом), Сыр Hochland плавленый 140г (21 сом)
2. Мясо и птица: Говядина свежая мякоть 1кг (85 сом), Цыплёнок-бройлер 1кг (34 сом), Котлеты домашние 500г (38 сом)
3. Хлеб и выпечка: Лепёшка таджикская Нон (5 сом), Батон нарезной 400г (4 сом), Самбуса слоёная с говядиной (7 сом за шт)
4. Фрукты и овощи: Бананы 1кг (24 сом), Томаты розовые 1кг (16 сом), Смесь орехов 200г (32 сом)
5. Бакалея: Рис Девзира 1кг (25 сом), Макароны Шебекинские 450г (11 сом), Масло подсолнечное 1л (19 сом)
6. Вода и напитки: Coca-Cola 1.5л (11 сом), Вода Шохамбари 1.5л (4 сом), Сок Sandora 1л (18 сом)
7. Сладости: Шоколад Alpen Gold 85г (11 сом), Raffaello 150г (39 сом), Merci Finest Selection 250г (69 сом)
8. Чай, кофе: Чай Tess Pleasure 100г (19 сом), Кофе Jacobs Monarch 95г (48 сом)
9. Консервы: Шпроты Либава 160г (23 сом), Тушёная говядина 325г (26 сом), Горошек Bonduelle 400г (16 сом)
10. Готовая еда: Салат Оливье 1кг (42 сом), Плов душанбинский 350г (24 сом), Сырники 150г (14 сом)
11. Красота и гигиена: Ariel 1.5кг (59 сом), Colgate 75мл (19 сом), Head&Shoulders 400мл (44 сом)
12. Для детей: Pampers Active Baby р.4 50шт (169 сом)

ПРАВИЛА ПОВЕДЕНИЯ:
- Отвечай кратко, дружелюбно и полезно
- Отвечай на языке вопроса (русский, таджикский, узбекский, английский)
- Давай конкретные рекомендации с ценами
- Если товар не найден — предложи похожий
- Всегда предлагай добавить товар в корзину или перейти в каталог
- Используй эмодзи для живости (умеренно)`

// ── Types ────────────────────────────────────────────────────────────────────
export interface ChatMessage {
  sender: 'user' | 'ai'
  text: string
  isLoading?: boolean
}

export interface ChatWidgetProps {
  chatOpen: boolean
  setChatOpen: (open: boolean) => void
  chatInput: string
  setChatInput: (input: string) => void
  chatMessages: ChatMessage[]
  sendChatMessage: (e: React.FormEvent) => void
}

// ── Gemini API function ───────────────────────────────────────────────────────
export async function askGemini(
  history: ChatMessage[],
  userMessage: string
): Promise<string> {
  const contents = [
    {
      role: 'user',
      parts: [{ text: SYSTEM_PROMPT }]
    },
    {
      role: 'model',
      parts: [{ text: 'Понял! Я готов помогать покупателям Пайкар. 🛒' }]
    },
    ...history.filter(m => !m.isLoading).map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    })),
    {
      role: 'user',
      parts: [{ text: userMessage }]
    }
  ]

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 400,
        topP: 0.9
      }
    })
  })

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}))
    const errMsg = errBody?.error?.message || `HTTP ${response.status}`
    throw new Error(errMsg)
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Извините, не смог получить ответ. Попробуйте ещё раз.'
}

// ── ChatWidget Component ──────────────────────────────────────────────────────
export const ChatWidget: React.FC<ChatWidgetProps> = ({
  chatOpen,
  setChatOpen,
  chatInput,
  setChatInput,
  chatMessages,
  sendChatMessage
}) => {
  const bodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isTyping, setIsTyping] = useState(false)

  // Auto scroll to bottom
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [chatMessages])

  // Focus input when chat opens
  useEffect(() => {
    if (chatOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [chatOpen])

  return (
    <div className="chat-popup">
      {/* Chat Box */}
      {chatOpen && (
        <div className="chat-box" style={{
          width: '360px',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(8,168,38,0.12)',
          border: '1.5px solid rgba(8,168,38,0.15)',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          animation: 'chatSlideIn 0.3s cubic-bezier(0.16,1,0.3,1)'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #08a826 0%, #05831d 100%)',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <SmartToyIcon style={{ color: '#fff', fontSize: '22px' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: '14.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Пайкар AI
                <span style={{
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  borderRadius: '20px',
                  padding: '2px 8px',
                  fontSize: '10px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <AutoAwesomeIcon style={{ fontSize: '10px' }} />
                  Gemini
                </span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', marginTop: '2px' }}>
                {isTyping ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span className="typing-dot" /> печатает...
                  </span>
                ) : (
                  '● Онлайн — AI помощник'
                )}
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              style={{
                color: 'rgba(255,255,255,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.1)',
                transition: 'background 0.2s',
                flexShrink: 0
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
            >
              <CloseIcon fontSize="small" />
            </button>
          </div>

          {/* Messages Body */}
          <div
            ref={bodyRef}
            style={{
              height: '300px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              padding: '16px',
              backgroundColor: '#f8faf8'
            }}
          >
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-end',
                  gap: '8px',
                  animation: `msgFadeIn 0.25s ease ${idx === chatMessages.length - 1 ? '0s' : '0s'} both`
                }}
              >
                {/* Avatar */}
                {msg.sender === 'ai' && (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #08a826, #05831d)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <SmartToyIcon style={{ color: '#fff', fontSize: '14px' }} />
                  </div>
                )}
                {msg.sender === 'user' && (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#e8f5e9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <PersonIcon style={{ color: '#08a826', fontSize: '14px' }} />
                  </div>
                )}

                {/* Bubble */}
                <div style={{
                  maxWidth: '78%',
                  padding: msg.isLoading ? '12px 16px' : '10px 14px',
                  borderRadius: msg.sender === 'user'
                    ? '18px 18px 4px 18px'
                    : '18px 18px 18px 4px',
                  backgroundColor: msg.sender === 'user'
                    ? 'linear-gradient(135deg, #08a826, #05831d)'
                    : '#ffffff',
                  background: msg.sender === 'user'
                    ? 'linear-gradient(135deg, #08a826 0%, #05831d 100%)'
                    : '#ffffff',
                  color: msg.sender === 'user' ? '#fff' : '#1a1a1a',
                  fontSize: '13px',
                  lineHeight: '1.55',
                  boxShadow: msg.sender === 'user'
                    ? '0 2px 10px rgba(8,168,38,0.3)'
                    : '0 2px 8px rgba(0,0,0,0.08)',
                  border: msg.sender === 'ai' ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {msg.isLoading ? (
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <span className="loading-dot" style={{ '--d': '0s' } as React.CSSProperties} />
                      <span className="loading-dot" style={{ '--d': '0.15s' } as React.CSSProperties} />
                      <span className="loading-dot" style={{ '--d': '0.3s' } as React.CSSProperties} />
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Suggestions */}
          <div style={{
            padding: '8px 14px 4px',
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
            backgroundColor: '#f8faf8',
            borderTop: '1px solid rgba(0,0,0,0.05)'
          }}>
            {['🥛 Молочные продукты', '🚚 Доставка', '💳 Оплата', '🥩 Мясо'].map(tag => (
              <button
                key={tag}
                onClick={() => {
                  setChatInput(tag.replace(/^[^\s]+ /, ''))
                  inputRef.current?.focus()
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: '20px',
                  border: '1.5px solid rgba(8,168,38,0.3)',
                  backgroundColor: 'rgba(8,168,38,0.06)',
                  color: '#08a826',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(8,168,38,0.15)'
                  e.currentTarget.style.borderColor = '#08a826'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(8,168,38,0.06)'
                  e.currentTarget.style.borderColor = 'rgba(8,168,38,0.3)'
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={sendChatMessage}
            style={{
              display: 'flex',
              gap: '8px',
              padding: '12px 14px',
              backgroundColor: '#fff',
              borderTop: '1px solid rgba(0,0,0,0.08)',
              alignItems: 'center'
            }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Спросите о товаре..."
              className="chat-input"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '24px',
                border: '1.5px solid rgba(0,0,0,0.1)',
                fontSize: '13px',
                outline: 'none',
                backgroundColor: '#f5f7f5',
                transition: 'border-color 0.2s',
                color: '#1a1a1a'
              }}
              onFocus={e => (e.currentTarget.style.borderColor = '#08a826')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)')}
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: chatInput.trim()
                  ? 'linear-gradient(135deg, #08a826, #05831d)'
                  : '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.2s',
                cursor: chatInput.trim() ? 'pointer' : 'not-allowed',
                boxShadow: chatInput.trim() ? '0 4px 12px rgba(8,168,38,0.35)' : 'none'
              }}
            >
              <SendIcon style={{ color: '#fff', fontSize: '18px' }} />
            </button>
          </form>

          {/* Powered by */}
          <div style={{
            textAlign: 'center',
            padding: '6px',
            fontSize: '10px',
            color: '#aaa',
            backgroundColor: '#fff'
          }}>
            Powered by Google Gemini AI
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        className="chat-bubble-btn"
        onClick={() => setChatOpen(!chatOpen)}
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #08a826 0%, #05831d 100%)',
          boxShadow: '0 6px 20px rgba(8,168,38,0.4)',
          border: 'none',
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
      >
        {chatOpen ? (
          <CloseIcon style={{ color: '#fff', fontSize: '24px' }} />
        ) : (
          <>
            <ChatIcon style={{ color: '#fff', fontSize: '26px' }} />
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '14px',
              height: '14px',
              backgroundColor: '#ff4444',
              borderRadius: '50%',
              border: '2px solid #fff',
              animation: 'pulse 2s infinite'
            }} />
          </>
        )}
      </button>
    </div>
  )
}
