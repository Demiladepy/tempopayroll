'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Wifi,
  WifiOff,
  Cpu,
  Send,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

interface AIAssistantCardProps {
  businessId: string
}

type ApiStatus = 'idle' | 'checking' | 'ok' | 'fail'

export function AIAssistantCard({ businessId }: AIAssistantCardProps) {
  const [loading, setLoading] = useState(false)
  const [askLoading, setAskLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [answer, setAnswer] = useState<string | null>(null)
  const [question, setQuestion] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<'claude' | 'local' | null>(null)
  const [expanded, setExpanded] = useState(true)
  const [apiStatus, setApiStatus] = useState<ApiStatus>('idle')

  async function testConnection() {
    setApiStatus('checking')
    try {
      const res = await fetch('/api/ai/test')
      const data = await res.json()
      setApiStatus(data.ok ? 'ok' : 'fail')
    } catch {
      setApiStatus('fail')
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  async function fetchRecommendations() {
    setLoading(true)
    setError(null)
    setRecommendations([])
    setAnswer(null)
    setSource(null)
    try {
      const res = await fetch(
        `/api/ai/recommendations?business_id=${encodeURIComponent(businessId)}`
      )
      const data = await res.json()
      if (data.recommendations?.length) {
        setRecommendations(data.recommendations)
        setSource(data.source ?? null)
      }
      if (data.error) setError(data.error)
    } catch {
      setError('Request failed')
    } finally {
      setLoading(false)
    }
  }

  async function askQuestion(e: React.FormEvent) {
    e.preventDefault()
    const q = question.trim()
    if (!q || askLoading) return
    setAskLoading(true)
    setError(null)
    setRecommendations([])
    setAnswer(null)
    setSource(null)
    try {
      const res = await fetch(
        `/api/ai/recommendations?business_id=${encodeURIComponent(businessId)}&question=${encodeURIComponent(q)}`
      )
      const data = await res.json()
      if (data.recommendations?.length) {
        setAnswer(data.recommendations.join(' '))
        setSource(data.source ?? null)
      }
      if (data.error) setError(data.error)
    } catch {
      setError('Request failed')
    } finally {
      setAskLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary/5 via-background to-primary/5 shadow-lg shadow-primary/5">
      <div className="border-b border-border/50 bg-background/50 px-6 py-4 backdrop-blur-sm">
        <div
          className="flex cursor-pointer items-center justify-between gap-3"
          onClick={() => setExpanded((e) => !e)}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                AI Payroll Assistant
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                {apiStatus === 'checking' && (
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <LoadingSpinner className="h-3 w-3" />
                    Checking API…
                  </span>
                )}
                {apiStatus === 'ok' && (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                    <Wifi className="h-3.5 w-3.5" />
                    Claude connected
                  </span>
                )}
                {apiStatus === 'fail' && (
                  <span className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                    <WifiOff className="h-3.5 w-3.5" />
                    Using local insights
                  </span>
                )}
                {apiStatus === 'idle' && (
                  <button
                    type="button"
                    onClick={(ev) => {
                      ev.stopPropagation()
                      testConnection()
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Test connection
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(ev) => {
                ev.stopPropagation()
                testConnection()
              }}
              className="text-muted-foreground"
            >
              {apiStatus === 'ok' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : apiStatus === 'fail' ? (
                <XCircle className="h-4 w-4 text-amber-500" />
              ) : (
                'Test'
              )}
            </Button>
            {expanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="space-y-5 p-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Get smart suggestions for payment timing, exchange rates, and budget alerts. If the API is unavailable, local insights are shown automatically.
          </p>

          <form onSubmit={askQuestion} className="flex gap-2">
            <Input
              placeholder="Ask anything about your payroll…"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1 bg-background/80"
              disabled={askLoading}
            />
            <Button type="submit" size="icon" disabled={askLoading || !question.trim()} className="shrink-0">
              {askLoading ? (
                <LoadingSpinner className="h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={fetchRecommendations}
              disabled={loading}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <LoadingSpinner className="h-4 w-4" />
                  Getting recommendations…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Get recommendations
                </>
              )}
            </Button>
          </div>

          {error && (
            <p className="rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
              {error}
            </p>
          )}

          {source && (
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              {source === 'claude' ? (
                <>
                  <Wifi className="h-3.5 w-3.5" />
                  Powered by Claude
                </>
              ) : (
                <>
                  <Cpu className="h-3.5 w-3.5" />
                  Local insights (API unavailable)
                </>
              )}
            </p>
          )}

          {(recommendations.length > 0 || answer) && (
            <div className="rounded-xl border border-border/60 bg-card/50 p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-medium text-foreground">
                {answer ? 'Answer' : 'Recommendations'}
              </h3>
              {answer ? (
                <p className="text-sm leading-relaxed text-muted-foreground">{answer}</p>
              ) : (
                <ul className="space-y-2.5">
                  {recommendations.map((line, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span className="leading-relaxed text-foreground/90">{line}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
