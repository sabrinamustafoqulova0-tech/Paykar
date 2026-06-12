import React from 'react'
import ChatIcon from '@mui/icons-material/Chat'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'

export interface ChatWidgetProps {
  chatOpen: boolean
  setChatOpen: (open: boolean) => void
  chatInput: string
  setChatInput: (input: string) => void
  chatMessages: Array<{ sender: 'user' | 'operator'; text: string }>
  sendChatMessage: (e: React.FormEvent) => void
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  chatOpen,
  setChatOpen,
  chatInput,
  setChatInput,
  chatMessages,
  sendChatMessage
}) => {
  return (
    <div className="chat-popup">
      {chatOpen && (
        <div className="chat-box">
          <div className="chat-box-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Чат с поддержкой Пайкар</span>
            <button style={{ color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setChatOpen(false)}>
              <CloseIcon fontSize="small" />
            </button>
          </div>
          
          <div className="chat-box-body" style={{ height: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.sender === 'user' ? 'var(--primary-green-light)' : 'var(--bg-input)',
                  color: 'var(--text-main)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  maxWidth: '85%',
                  fontSize: '12.5px',
                  lineHeight: '1.4',
                  border: '1px solid rgba(0,0,0,0.03)'
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <form className="chat-box-input" onSubmit={sendChatMessage}>
            <input
              type="text"
              placeholder="Задать вопрос..."
              className="chat-input"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button type="submit" className="chat-send-btn">
              <SendIcon fontSize="small" />
            </button>
          </form>
        </div>
      )}
      <button className="chat-bubble-btn" onClick={() => setChatOpen(!chatOpen)}>
        <ChatIcon />
      </button>
    </div>
  )
}
