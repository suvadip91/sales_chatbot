import React from 'react'

export default function MessageBubble({ message }) {
  return (
    <div className={`bubble ${message.sender === 'user' ? 'user' : 'bot'}`}>
      <strong>{message.sender === 'user' ? 'You' : 'Customer'}</strong>
      <p>{message.text}</p>
    </div>
  )
}
