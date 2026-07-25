import { useRef, useState } from 'react'
import { createSpeechRecognition } from '../services/speechService'

export default function useSpeechRecognition() {
  const recognitionRef = useRef(null)
  const [isListening, setIsListening] = useState(false)

  const startListening = (onTranscript) => {
    if (!recognitionRef.current) {
      recognitionRef.current = createSpeechRecognition(
        (transcript) => {
          onTranscript(transcript)
        },
        (error) => {
          console.error('Speech recognition error', error)
        },
        () => {
          setIsListening(false)
        },
      )
    }

    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  return { isListening, startListening }
}
