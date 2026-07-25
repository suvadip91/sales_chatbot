import React from 'react'
import { ChatProvider, useChatContext } from './context/ChatContext'
import ConfigSelector from './components/ConfigSelector'
import Header from './components/Header'
import ChatWindow from './components/ChatWindow'
import ChatInput from './components/ChatInput'
import useSpeechRecognition from './hooks/useSpeechRecognition'
import './styles/main.css'

function AppContent() {
  const { configName, setConfigName, messages, history, isSending, showHistory, setShowHistory, sendMessage, resetRoleplay } = useChatContext()
  const { isListening, startListening } = useSpeechRecognition()
  const [input, setInput] = React.useState('')

  const handleSend = () => {
    const trimmedInput = input.trim()
    if (!trimmedInput) return
    sendMessage(trimmedInput)
    setInput('')
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="app-shell">
      <Header />
      <main className="workspace">
        <aside className="sidebar">
          <ConfigSelector
            configName={configName}
            onConfigChange={setConfigName}
            onToggleHistory={() => setShowHistory((value) => !value)}
            onReset={resetRoleplay}
            showHistory={showHistory}
          />
          <section className="panel tips-panel">
            <h2>How it works</h2>
            <ul>
              <li>Speak naturally with the browser microphone.</li>
              <li>Send a message and hear the customer reply.</li>
              <li>Switch presets to test different objections.</li>
            </ul>
          </section>
        </aside>

        <section className="conversation-panel">
          <ChatWindow messages={messages} />
          <ChatInput
            input={input}
            setInput={setInput}
            onKeyDown={handleKeyDown}
            onSend={handleSend}
            isSending={isSending}
            isListening={isListening}
            onStartSpeaking={() => startListening((transcript) => setInput((current) => (current ? `${current} ${transcript}` : transcript)))}
          />
        </section>
      </main>

      {showHistory && (
        <section className="history-card">
          <h3>Conversation History</h3>
          {history.length === 0 ? (
            <p className="hint">No history yet for this preset.</p>
          ) : (
            history.map((entry, index) => (
              <div key={index} className="history-item">
                <strong>{entry.role === 'user' ? 'You' : entry.role === 'assistant' ? 'Customer' : entry.role}:</strong>{' '}
                {entry.content}
              </div>
            ))
          )}
        </section>
      )}
    </div>
  )
}

export default function App() {
  return (
    <ChatProvider>
      <AppContent />
    </ChatProvider>
  )
}
