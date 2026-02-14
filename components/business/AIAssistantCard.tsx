'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react'

interface AIAssistantCardProps {
  businessId: string
}

export function AIAssistantCard({ businessId }: AIAssistantCardProps) {
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(true)

  async function fetchRecommendations() {
    setLoading(true)
    setError(null)
    setRecommendations([])
    try {
      const res = await fetch(`/api/ai/recommendations?business_id=${encodeURIComponent(businessId)}`)
      const data = await res.json()
      if (data.recommendations?.length) {
        setRecommendations(data.recommendations)
      }
      if (data.error && !data.recommendations?.length) {
        setError(data.error)
      }
    } catch {
      setError('Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <div
        className="flex cursor-pointer items-center justify-between gap-2"
        onClick={() => setExpanded((e) => !e)}
      >
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Payroll Assistant
        </h2>
        {expanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      {expanded && (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Get suggestions for payment timing, exchange rates, and budget alerts.
          </p>
          <Button onClick={fetchRecommendations} disabled={loading} className="gap-2">
            {loading ? (
              <>
                <LoadingSpinner className="h-4 w-4" />
                Getting recommendations...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Get recommendations
              </>
            )}
          </Button>
          {error && (
            <p className="text-sm text-muted-foreground">{error}</p>
          )}
          {recommendations.length > 0 && (
            <ul className="space-y-2 border-t pt-4">
              {recommendations.map((line, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-primary">•</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Card>
  )
}
