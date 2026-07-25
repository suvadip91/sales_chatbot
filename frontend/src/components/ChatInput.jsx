import React from 'react'

export default function ChatInput({ input, setInput, onKeyDown, onSend, isSending, onStartSpeaking, isListening }) {
  return (
    <div className="composer">
      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Type your message..."
      />
      <div className="composer-actions">
        <button className="secondary-btn" onClick={onStartSpeaking}>
          {isListening ? 'Stop speaking' : 'Start speaking'}
        </button>
        <button className="primary-btn" onClick={onSend} disabled={isSending}>
          {isSending ? 'Sending…' : 'Send'}
        </button>
      </div>
    </div>
  )
}
