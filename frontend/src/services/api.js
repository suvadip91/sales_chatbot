const API_BASE_URL = 'http://127.0.0.1:8000'

export async function sendMessage(prompt, configName) {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, config_name: configName, customer_id: configName }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || response.statusText)
  }

  return response.json()
}

export async function fetchHistory(configName) {
  const response = await fetch(`${API_BASE_URL}/history?customer_id=${encodeURIComponent(configName)}`)
  if (!response.ok) {
    return []
  }

  const data = await response.json()
  return data.conversation_history || []
}

export async function resetConversation(configName) {
  const response = await fetch(`${API_BASE_URL}/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer_id: configName }),
  })

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  return response.json()
}
