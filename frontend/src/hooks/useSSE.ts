import { useState, useEffect, useRef } from 'react'
import type { TraversalStep } from '../types/api'

interface UseSSEResult {
  steps: TraversalStep[]
  done: boolean
  error: string | null
}

export function useSSE(url: string | null): UseSSEResult {
  const [steps, setSteps] = useState<TraversalStep[]>([])
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (esRef.current) {
      esRef.current.close()
      esRef.current = null
    }

    if (!url) return

    const resetTimeout = window.setTimeout(() => {
      setSteps([])
      setDone(false)
      setError(null)
    }, 0)

    const es = new EventSource(url)
    esRef.current = es

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data) as TraversalStep & { done?: boolean }
        if (data.done) {
          setDone(true)
          es.close()
          return
        }
        setSteps((prev) => [...prev, data])
      } catch {
        // ignore
      }
    }

    es.onerror = () => {
      setError('Stream connection error')
      setDone(true)
      es.close()
    }

    return () => {
      window.clearTimeout(resetTimeout)
      es.close()
    }
  }, [url])

  return { steps, done, error }
}
