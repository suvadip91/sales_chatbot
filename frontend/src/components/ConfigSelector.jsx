import React from 'react'

const presets = [
  { value: 'default', label: 'Default' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
  { value: 'skeptical', label: 'Skeptical' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'startup', label: 'Startup' },
  { value: 'enterprise', label: 'Enterprise' },
]

export default function ConfigSelector({ configName, onConfigChange, onToggleHistory, onReset, showHistory }) {
  return (
    <section className="panel">
      <h2>Scenario</h2>
      <label className="field-label" htmlFor="preset-select">Preset config</label>
      <select id="preset-select" value={configName} onChange={(event) => onConfigChange(event.target.value)}>
        {presets.map((preset) => (
          <option key={preset.value} value={preset.value}>
            {preset.label}
          </option>
        ))}
      </select>
      <p className="hint">Each preset shifts the customer tone, industry, and objection style.</p>
      <button className="secondary-btn" onClick={onToggleHistory}>
        {showHistory ? 'Hide history' : 'Show history'}
      </button>
      <button className="ghost-btn" onClick={onReset}>New Roleplay</button>
    </section>
  )
}
