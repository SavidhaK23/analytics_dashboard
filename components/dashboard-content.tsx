"use client"

import { MetricCards } from "@/components/metric-cards"
import { ChartsSection } from "@/components/charts-section"
import { UserDataTable } from "@/components/user-data-table"
import { RealTimeUpdates } from "@/components/real-time-updates"
import { AdvancedFilters } from "@/components/advanced-filters"
import { EnhancedDataTable } from "@/components/enhanced-data-table"
import { AnalyticsSection } from "@/components/analytics-section"
import { ReportsSection } from "@/components/reports-section"
import { InsightsSection } from "@/components/insights-section"
import { ErrorBoundary } from "@/components/error-boundary"
import { useDashboard } from "@/lib/dashboard-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export function DashboardContent() {
  const { state } = useDashboard()

  return (
    <div className="flex flex-1 flex-col gap-8 p-4">
      {/* Error Display */}
      {state.error && (
        <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {/* Dashboard Overview Section */}
      <section id="dashboard" className="scroll-section">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
            <p className="text-muted-foreground">Track your key metrics and performance indicators</p>
          </div>
          <ErrorBoundary>
            <RealTimeUpdates />
          </ErrorBoundary>
        </div>

        {/* Advanced Filters */}
        <div className="flex justify-end mb-6">
          <ErrorBoundary>
            <AdvancedFilters />
          </ErrorBoundary>
        </div>

        {/* Metrics Cards */}
        <ErrorBoundary>
          <MetricCards />
        </ErrorBoundary>
      </section>

      {/* Analytics Section */}
      <section id="analytics" className="scroll-section">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">Detailed analytics and performance metrics</p>
        </div>
        <ErrorBoundary>
          <AnalyticsSection />
        </ErrorBoundary>
      </section>

      {/* Charts Section */}
      <section id="charts" className="scroll-section">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Interactive Charts</h2>
          <p className="text-muted-foreground">Visual representation of your data with interactive charts</p>
        </div>
        <ErrorBoundary>
          <ChartsSection />
        </ErrorBoundary>
      </section>

      {/* Insights Section */}
      <section id="insights" className="scroll-section">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Business Insights</h2>
          <p className="text-muted-foreground">AI-powered insights and recommendations for your business</p>
        </div>
        <ErrorBoundary>
          <InsightsSection />
        </ErrorBoundary>
      </section>

      {/* Reports Section */}
      <section id="reports" className="scroll-section">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">Comprehensive reports and data analysis</p>
        </div>
        <ErrorBoundary>
          <ReportsSection />
        </ErrorBoundary>
      </section>

      {/* Users Section */}
      <section id="users" className="scroll-section">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">Manage and analyze user data with advanced filtering</p>
        </div>
        <ErrorBoundary>
          <UserDataTable />
        </ErrorBoundary>
        <div className="mt-6">
          <ErrorBoundary>
            <EnhancedDataTable />
          </ErrorBoundary>
        </div>
      </section>
    </div>
  )
}
