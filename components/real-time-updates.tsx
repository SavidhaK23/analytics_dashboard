"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useDashboard } from "@/lib/dashboard-context"

export function RealTimeUpdates() {
  const { state, refreshData } = useDashboard()
  const [autoRefresh, setAutoRefresh] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      isMountedRef.current = false
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (autoRefresh && isMountedRef.current) {
      intervalRef.current = setInterval(() => {
        if (isMountedRef.current) {
          refreshData()
        }
      }, 30000) // Update every 30 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [autoRefresh, refreshData])

  const handleManualRefresh = () => {
    if (isMountedRef.current) {
      refreshData()
    }
  }

  const handleAutoToggle = () => {
    setAutoRefresh(!autoRefresh)
  }

  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <span>Last updated: {state.lastUpdated.toLocaleTimeString()}</span>
      <Button
        variant="outline"
        size="sm"
        onClick={handleManualRefresh}
        disabled={state.isLoading}
        className="transition-all duration-200 hover:scale-105 bg-transparent"
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${state.isLoading ? "animate-spin" : ""}`} />
        Refresh
      </Button>
      <Button
        variant={autoRefresh ? "default" : "outline"}
        size="sm"
        onClick={handleAutoToggle}
        className="transition-all duration-200 hover:scale-105"
      >
        {autoRefresh ? "Auto ON" : "Auto OFF"}
      </Button>
    </div>
  )
}
