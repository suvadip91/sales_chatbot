import React from 'react'

export default function ChatWindow({ messages }) {
  return (
    <div className="messages">
      {messages.length === 0 ? (
        <div className="empty-state">
          <h3>Start your first roleplay</h3>
          <p>Pick a preset, type a message, and let the customer respond.</p>
        </div>
      ) : (
        messages.map((message, index) => (
          <div key={index} className={`bubble ${message.sender === 'user' ? 'user' : 'bot'}`}>
            <strong>{message.sender === 'user' ? 'You' : 'Customer'}</strong>
            <p>{message.text}</p>
          </div>
        ))
      )}
    </div>
  )
}
