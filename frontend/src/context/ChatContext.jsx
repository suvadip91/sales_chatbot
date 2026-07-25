import React, { createContext, useContext, useMemo, useState } from 'react'
import useChat from '../hooks/useChat'

const ChatContext = createContext(null)

export function ChatProvider({ children }) {
  const [configName, setConfigName] = useState('default')
  const chatState = useChat(configName)

  const value = useMemo(() => ({ configName, setConfigName, ...chatState }), [configName, chatState])

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}
