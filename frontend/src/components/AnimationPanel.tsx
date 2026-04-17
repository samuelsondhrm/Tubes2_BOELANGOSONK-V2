import { useState, useRef, useEffect } from 'react'
import { useSSE } from '../hooks/useSSE'
import type { Algorithm } from '../types/api'

const BASE = import.meta.env.VITE_API_URL ?? ''

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#0f172a',
  border: '1px solid #334155',
  borderRadius: 6,
  color: '#e2e8f0',
  padding: '8px 12px',
  fontSize: 13,
  fontFamily: 'monospace',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  color: '#94a3b8',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  marginBottom: 4,
  display: 'block',
}

export function AnimationPanel() {
  const [inputMode, setInputMode] = useState<'url' | 'html'>('url')
  const [url, setUrl] = useState('')
  const [rawHtml, setRawHtml] = useState('')
  const [algorithm, setAlgorithm] = useState<Algorithm>('BFS')
  const [selector, setSelector] = useState('')
  const [limit, setLimit] = useState(-1)
  const [streamUrl, setStreamUrl] = useState<string | null>(null)

  const { steps, done, error } = useSSE(streamUrl)
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [steps])

  function handleStart(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (inputMode === 'url' && url) {
      params.set('url', url)
    } else if (rawHtml) {
      params.set('html', rawHtml)
    } else {
      return
    }
    params.set('algorithm', algorithm)
    params.set('selector', selector)
    params.set('limit', String(limit))
    setStreamUrl(`${BASE}/api/traverse/stream?${params.toString()}`)
  }

  function handleStop() {
    setStreamUrl(null)
  }

  const statusColor = (status: string) => {
    if (status === 'matched') return '#22c55e'
    if (status === 'skipped') return '#475569'
    return '#6366f1'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ color: '#4f46e5', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        Stream Animation
      </div>

      <form onSubmit={handleStart} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', gap: 0, borderRadius: 6, overflow: 'hidden', border: '1px solid #334155' }}>
          {(['url', 'html'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setInputMode(mode)}
              style={{
                flex: 1,
                padding: '7px 0',
                background: inputMode === mode ? '#6366f1' : '#1e293b',
                color: inputMode === mode ? '#fff' : '#64748b',
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {mode === 'url' ? 'URL' : 'Raw HTML'}
            </button>
          ))}
        </div>

        {inputMode === 'url' ? (
          <div>
            <label style={labelStyle}>Website URL</label>
            <input
              style={inputStyle}
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        ) : (
          <div>
            <label style={labelStyle}>Raw HTML</label>
            <textarea
              style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
              placeholder="<html>...</html>"
              value={rawHtml}
              onChange={(e) => setRawHtml(e.target.value)}
            />
          </div>
        )}

        <div>
          <label style={labelStyle}>Algorithm</label>
          <select
            style={{ ...inputStyle, cursor: 'pointer' }}
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
          >
            <option value="BFS">BFS</option>
            <option value="DFS">DFS</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>CSS Selector</label>
          <input
            style={inputStyle}
            type="text"
            placeholder="div, .class, #id"
            value={selector}
            onChange={(e) => setSelector(e.target.value)}
            required
          />
        </div>

        <div>
          <label style={labelStyle}>Limit (-1 = semua)</label>
          <input
            style={inputStyle}
            type="number"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          />
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: '9px 0',
              background: '#6366f1',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ▶ Start Stream
          </button>
          {streamUrl && !done && (
            <button
              type="button"
              onClick={handleStop}
              style={{
                padding: '9px 14px',
                background: '#7f1d1d',
                color: '#fca5a5',
                border: 'none',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Stop
            </button>
          )}
        </div>
      </form>

      {error && (
        <div style={{ background: '#450a0a', border: '1px solid #7f1d1d', borderRadius: 6, padding: '8px 12px', color: '#fca5a5', fontSize: 12 }}>
          {error}
        </div>
      )}

      {steps.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Live Log
            </span>
            <span style={{ color: done ? '#22c55e' : '#f59e0b', fontSize: 11, fontWeight: 600 }}>
              {done ? 'Done' : 'Streaming...'} ({steps.length} steps)
            </span>
          </div>
          <div
            ref={logRef}
            style={{
              maxHeight: 280,
              overflowY: 'auto',
              background: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: 6,
              padding: 8,
            }}
          >
            {steps.map((s) => (
              <div
                key={s.step}
                style={{
                  display: 'flex',
                  gap: 8,
                  padding: '3px 0',
                  borderBottom: '1px solid #1e293b',
                  fontSize: 11,
                  fontFamily: 'monospace',
                }}
              >
                <span style={{ color: '#475569', minWidth: 28 }}>#{s.step}</span>
                <span style={{ color: '#94a3b8', minWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {s.node_id}
                </span>
                <span style={{ color: '#6366f1', minWidth: 60 }}>&lt;{s.tag}&gt;</span>
                <span style={{ color: statusColor(s.status), marginLeft: 'auto' }}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
