"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Filter, X } from "lucide-react"
import { useDashboard } from "@/lib/dashboard-context"

interface FilterState {
  dateFrom: string
  dateTo: string
  status: string
  searchTerm: string
}

export function AdvancedFilters() {
  const { state, applyFilters, resetFilters } = useDashboard()
  const [isExpanded, setIsExpanded] = useState(false)
  const [localFilters, setLocalFilters] = useState<FilterState>(state.filters)
  const applyButtonRef = useRef<HTMLButtonElement>(null)
  const timeoutRefs = useRef<NodeJS.Timeout[]>([])
  const isMountedRef = useRef(true)

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
      timeoutRefs.current.forEach((timeout) => clearTimeout(timeout))
      timeoutRefs.current = []
    }
  }, [])

  // Sync local filters with context when filters are reset
  useEffect(() => {
    setLocalFilters(state.filters)
  }, [state.filters])

  const clearTimeouts = useCallback(() => {
    timeoutRefs.current.forEach((timeout) => clearTimeout(timeout))
    timeoutRefs.current = []
  }, [])

  const addTimeout = useCallback((timeout: NodeJS.Timeout) => {
    timeoutRefs.current.push(timeout)
  }, [])

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleApplyFilters = async () => {
    try {
      await applyFilters(localFilters)

      // Show visual feedback with proper cleanup
      if (applyButtonRef.current && isMountedRef.current) {
        const button = applyButtonRef.current
        const originalText = button.textContent
        const originalClasses = button.className

        button.textContent = "Applied!"
        button.className = `${originalClasses} bg-green-500 text-white`

        const buttonTimeout = setTimeout(() => {
          if (button && isMountedRef.current) {
            button.textContent = originalText
            button.className = originalClasses
          }
        }, 2000)
        addTimeout(buttonTimeout)
      }

      // Highlight sections with proper cleanup
      const sectionsToHighlight = ["dashboard", "users", "analytics", "charts"]
      sectionsToHighlight.forEach((sectionId) => {
        const element = document.getElementById(sectionId)
        if (element && isMountedRef.current) {
          element.classList.add("highlight-section")
          const highlightTimeout = setTimeout(() => {
            if (element && isMountedRef.current) {
              element.classList.remove("highlight-section")
            }
          }, 3000)
          addTimeout(highlightTimeout)
        }
      })
    } catch (error) {
      console.error("Failed to apply filters:", error)
    }
  }

  const handleReset = () => {
    clearTimeouts()
    resetFilters()
  }

  // Get active filters count based on applied filters, not local filters
  const getActiveFiltersCount = () => {
    let count = 0
    if (state.appliedFilters.dateFrom) count++
    if (state.appliedFilters.dateTo) count++
    if (state.appliedFilters.status !== "all") count++
    if (state.appliedFilters.searchTerm) count++
    return count
  }

  // Check if local filters differ from applied filters
  const hasUnappliedChanges = () => {
    return JSON.stringify(localFilters) !== JSON.stringify(state.appliedFilters)
  }

  if (!isExpanded) {
    return (
      <Button
        variant="outline"
        onClick={() => setIsExpanded(true)}
        className="transition-all duration-200 hover:scale-105"
      >
        <Filter className="h-4 w-4 mr-2" />
        Advanced Filters
        {getActiveFiltersCount() > 0 && (
          <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
            {getActiveFiltersCount()}
          </span>
        )}
      </Button>
    )
  }

  return (
    <Card className="transition-all duration-300 animate-in slide-in-from-top-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Advanced Filters</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clearTimeouts()
              setIsExpanded(false)
            }}
            className="transition-all duration-200 hover:scale-105"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {state.error && <div className="text-sm text-red-500 mt-2">{state.error}</div>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dateFrom">From Date</Label>
            <div className="relative">
              <Input
                id="dateFrom"
                type="date"
                value={localFilters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                className="transition-all duration-200 focus:ring-2"
                disabled={state.isLoading}
              />
              <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateTo">To Date</Label>
            <div className="relative">
              <Input
                id="dateTo"
                type="date"
                value={localFilters.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                className="transition-all duration-200 focus:ring-2"
                disabled={state.isLoading}
              />
              <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={localFilters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
              disabled={state.isLoading}
            >
              <SelectTrigger className="transition-all duration-200 focus:ring-2">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search users..."
              value={localFilters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
              className="transition-all duration-200 focus:ring-2"
              disabled={state.isLoading}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            ref={applyButtonRef}
            onClick={handleApplyFilters}
            className="transition-all duration-200 hover:scale-105"
            disabled={state.isLoading || !hasUnappliedChanges()}
          >
            <Filter className="h-4 w-4 mr-2" />
            {state.isLoading ? "Applying..." : hasUnappliedChanges() ? "Apply Filters" : "Filters Applied"}
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="transition-all duration-200 hover:scale-105 bg-transparent"
            disabled={state.isLoading}
          >
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
