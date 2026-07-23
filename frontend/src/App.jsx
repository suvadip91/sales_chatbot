import React, { useState, useRef, useEffect } from 'react'

export default function App() {
  const [messages, setMessages] = useState([]) // {sender: 'user'|'bot', text}
  const [input, setInput] = useState('')
  const listRef = useRef(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  function sendMessage() {
    if (!input.trim()) return
    const userMsg = { sender: 'user', text: input }
    setMessages((m) => [...m, userMsg])
    setInput('')

    // Integration will be added in step 4; for now, append a placeholder bot reply.
    setTimeout(() => {
      const botMsg = { sender: 'bot', text: "(bot reply placeholder)" }
      setMessages((m) => [...m, botMsg])
    }, 500)
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={{height: '100vh', display: 'flex', flexDirection: 'column'}}>
      <div ref={listRef} style={{flex: 1, padding: 12, overflow: 'auto', border:'1px solid #ddd'}}>
        {messages.length === 0 && <div style={{color:'#666'}}>No messages yet. Type below and press Send.</div>}
        {messages.map((m, i) => (
          <div key={i} style={{margin: '8px 0'}}>
            <strong>{m.sender === 'user' ? 'You' : 'Customer'}:</strong> {m.text}
          </div>
        ))}
      </div>

      <div style={{display: 'flex', gap: 8, padding: 12}}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type your message..."
          style={{flex: 1, minHeight: 50}}
        />
        <div style={{display:'flex', flexDirection:'column', gap:8}}>
          <button onClick={sendMessage} style={{width:100}}>Send</button>
          <button onClick={() => { setMessages([]); setInput('') }} style={{width:100}}>New Roleplay</button>
        </div>
      </div>
    </div>
  )
}
