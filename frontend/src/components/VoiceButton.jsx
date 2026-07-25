import React from 'react'

export default function VoiceButton({ isListening, onToggleListening }) {
  return (
    <button className="secondary-btn" onClick={onToggleListening}>
      {isListening ? 'Stop speaking' : 'Start speaking'}
    </button>
  )
}
