import { useState } from 'react'
import { api } from '../api/client'
import type { LCAResponse } from '../types/api'

const inputStyle: React.CSSProperties = {
  flex: 1,
  background: '#0f172a',
  border: '1px solid #334155',
  borderRadius: 6,
  color: '#e2e8f0',
  padding: '8px 12px',
  fontSize: 13,
  fontFamily: 'monospace',
  boxSizing: 'border-box',
  minWidth: 0,
}

export function LCAPanel() {
  const [nodeA, setNodeA] = useState('')
  const [nodeB, setNodeB] = useState('')
  const [result, setResult] = useState<LCAResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await api.lca({ node_id_a: nodeA.trim(), node_id_b: nodeB.trim() })
      setResult(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ color: '#4f46e5', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        Lowest Common Ancestor
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              style={inputStyle}
              type="text"
              placeholder="Node ID A (e.g. node-5)"
              value={nodeA}
              onChange={(e) => setNodeA(e.target.value)}
              required
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              style={inputStyle}
              type="text"
              placeholder="Node ID B (e.g. node-12)"
              value={nodeB}
              onChange={(e) => setNodeB(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '9px 0',
            background: loading ? '#334155' : '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Mencari...' : 'Cari LCA'}
        </button>
      </form>

      {error && (
        <div style={{ background: '#450a0a', border: '1px solid #7f1d1d', borderRadius: 6, padding: '8px 12px', color: '#fca5a5', fontSize: 12 }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ background: '#1e293b', borderRadius: 8, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ color: '#94a3b8', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            Hasil LCA
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#64748b', fontSize: 12 }}>Node</span>
            <span style={{ color: '#22c55e', fontFamily: 'monospace', fontSize: 13, fontWeight: 700 }}>
              &lt;{result.lca_node.tag}&gt;
            </span>
            <span style={{ color: '#6366f1', fontFamily: 'monospace', fontSize: 12 }}>
              {result.lca_node.id}
            </span>
          </div>

          {result.lca_node.id_attr && (
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ color: '#64748b', fontSize: 12 }}>id</span>
              <span style={{ color: '#f59e0b', fontFamily: 'monospace', fontSize: 12 }}>#{result.lca_node.id_attr}</span>
            </div>
          )}

          {result.lca_node.classes.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ color: '#64748b', fontSize: 12 }}>classes</span>
              {result.lca_node.classes.map((cls) => (
                <span key={cls} style={{ color: '#818cf8', fontFamily: 'monospace', fontSize: 12 }}>.{cls}</span>
              ))}
            </div>
          )}

          <div style={{ borderTop: '1px solid #334155', paddingTop: 8, display: 'flex', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ color: '#64748b', fontSize: 11 }}>Depth A ({nodeA})</span>
              <span style={{ color: '#e2e8f0', fontFamily: 'monospace', fontSize: 13 }}>{result.depth_a}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ color: '#64748b', fontSize: 11 }}>Depth B ({nodeB})</span>
              <span style={{ color: '#e2e8f0', fontFamily: 'monospace', fontSize: 13 }}>{result.depth_b}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
