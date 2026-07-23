# Sales Roleplay Voice Bot (MVP)

Build a minimal voice chatbot where a salesperson talks to an AI customer that speaks, asks questions, raises objections, and stays in character.

## Stack and structure

- Frontend: React/Vite, one simple page, browser microphone.
- Backend: Python/FastAPI.
- AI: HuggingFace Inference API with an instruction-following open-source model (for example, Qwen 3 Instruct, Llama 3.1 Instruct, or Mistral Small Instruct).
- Speech: browser Web Speech API (speech-to-text) and SpeechSynthesis API (text-to-speech). Do not add WebRTC or hosted speech services to the MVP.

```text
sales-roleplay-bot/{frontend,backend,instruction.md,README.md}
```

## Implementation order

1. **Backend:** Create FastAPI with `GET /health`, returning `{"status":"ok"}`. Test it before continuing.
2. **AI service:** Call HuggingFace Inference API and add `POST /generate` accepting `{"prompt":"Hello"}` and returning generated text. Verify it works.
3. **Frontend:** Create a React page with a large chat area, text input, and Send button; no styling is required.
4. **Integration:** Send messages through React → FastAPI → HuggingFace → FastAPI → React and display the conversation as a chat.
5. **Configuration:** Never hardcode personalities. Load a JSON configuration before every response, for example:

   ```json
   {"industry":"E-commerce","difficulty":"Medium","personality":"Skeptical","objection_style":"Price Sensitive"}
   ```

6. **Prompt:** Use one template for every request:

   ```text
   You are acting as a CUSTOMER, never an AI assistant. Stay in character.
   Industry: {industry}
   Difficulty: {difficulty}
   Personality: {personality}
   Objection Style: {objection_style}
   Reply naturally in 2-5 sentences and ask follow-up questions when appropriate.
   ```

7. **Memory:** Keep the conversation in a Python list and include prior User/Bot turns in each prompt. No database is needed.
8. **Voice input:** A `Start Speaking` button uses Web Speech API and places recognized text in the input box; no backend changes are needed.
9. **Voice output:** React reads each generated reply with SpeechSynthesis API; no backend changes are needed.
10. **Reset:** A `New Roleplay` button clears frontend chat, backend memory, and conversation history.
11. **Presets:** Add selectable JSON files under `configs/`, such as `easy.json`, `medium.json`, `hard.json`, `startup.json`, `enterprise.json`, `skeptical.json`, and `friendly.json`. The backend loads the selected file.
12. **E2E test:** Verify backend, frontend, voice input/output, in-character behavior, and visibly different behavior across configurations. Fix issues before adding features.

## Explicitly out of MVP scope

Voice infrastructure (WebRTC, streaming, Twilio, LiveKit, Daily, SIP); hosted speech models/services (Whisper, Faster Whisper, Deepgram, AssemblyAI, ElevenLabs, Cartesia, OpenAI TTS, Azure TTS); RAG, knowledge/product/pricing data, and CRM; analytics; authentication; persistence; deployment infrastructure; and advanced simulation such as emotions, buying intent, budgets, decision hierarchies, competitors, negotiation, or dynamic goals.

## Done when

Locally, a salesperson can start a React roleplay, speak through the browser, see speech converted to text, send the conversation through FastAPI to HuggingFace, receive a configurable in-character customer reply, see it displayed, hear it spoken aloud, and observe different behavior for different configurations—with minimal setup.
