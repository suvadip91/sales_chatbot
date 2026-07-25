import { useEffect, useState } from 'react'
import { fetchHistory, resetConversation, sendMessage as sendMessageRequest } from '../services/api'
import { speakText } from '../services/speechService'

export default function useChat(configName) {
  const [messages, setMessages] = useState([])
  const [history, setHistory] = useState([])
  const [isSending, setIsSending] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    loadHistory()
  }, [configName])

  async function loadHistory() {
    const nextHistory = await fetchHistory(configName)
    setHistory(nextHistory)
  }

  async function sendMessage(input) {
    if (!input.trim() || isSending) {
      return
    }

    const userMessage = { sender: 'user', text: input.trim() }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    setIsSending(true)

    try {
      const data = await sendMessageRequest(input.trim(), configName)
      const botMessage = { sender: 'bot', text: data.response }
      setMessages((prevMessages) => [...prevMessages, botMessage])
      speakText(data.response)
      const nextHistory = await fetchHistory(configName)
      setHistory(nextHistory)
    } catch (error) {
      const botMessage = { sender: 'bot', text: `Error: ${error.message}` }
      setMessages((prevMessages) => [...prevMessages, botMessage])
    } finally {
      setIsSending(false)
    }
  }

  async function resetRoleplay() {
    setMessages([])
    setHistory([])
    try {
      await resetConversation(configName)
    } catch (error) {
      console.error('Reset failed', error)
    }
  }

  return {
    messages,
    history,
    isSending,
    showHistory,
    setShowHistory,
    sendMessage,
    resetRoleplay,
    loadHistory,
  }
}
