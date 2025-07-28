"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, Activity, Target } from "lucide-react"
import { useDashboard } from "@/lib/dashboard-context"
import { AnalyticsSkeleton } from "@/components/loading-skeleton"
import { memo } from "react"

const AnalyticsMetricCard = memo(({ metric, index }: { metric: any; index: number }) => (
  <Card
    className="transition-all duration-300 hover:scale-105 hover:shadow-lg animate-in fade-in slide-in-from-bottom-4"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
      <metric.icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{metric.value}</div>
      <p className={`text-xs ${metric.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
        {metric.change} from last month
      </p>
    </CardContent>
  </Card>
))

AnalyticsMetricCard.displayName = "AnalyticsMetricCard"

export const AnalyticsSection = memo(() => {
  const { state, filteredData } = useDashboard()

  if (state.isLoading) {
    return <AnalyticsSkeleton />
  }

  const analyticsData = filteredData.analytics

  // Calculate dynamic metrics based on filtered data
  const totalSessions = analyticsData.reduce((sum, item) => sum + item.sessions, 0)
  const totalPageViews = analyticsData.reduce((sum, item) => sum + item.pageViews, 0)
  const avgBounceRate = (analyticsData.reduce((sum, item) => sum + item.bounceRate, 0) / analyticsData.length).toFixed(
    1,
  )
  const goalCompletion = Math.min(95, Math.max(60, (filteredData.users.length / 50) * 100)).toFixed(1)

  const analyticsMetrics = [
    {
      title: "Total Sessions",
      value: totalSessions.toLocaleString(),
      change: totalSessions > 500 ? "+12.5%" : "+8.2%",
      changeType: "positive" as const,
      icon: Activity,
    },
    {
      title: "Page Views",
      value: totalPageViews.toLocaleString(),
      change: totalPageViews > 1500 ? "+15.3%" : "+8.2%",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
    {
      title: "Bounce Rate",
      value: `${avgBounceRate}%`,
      change: Number.parseFloat(avgBounceRate) < 40 ? "-5.1%" : "-2.3%",
      changeType: "positive" as const,
      icon: TrendingDown,
    },
    {
      title: "Goal Completion",
      value: `${goalCompletion}%`,
      change: Number.parseFloat(goalCompletion) > 75 ? "+15.3%" : "+8.7%",
      changeType: "positive" as const,
      icon: Target,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Analytics Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {analyticsMetrics.map((metric, index) => (
          <AnalyticsMetricCard key={metric.title} metric={metric} index={index} />
        ))}
      </div>

      {/* Analytics Chart */}
      <Card className="transition-all duration-300 hover:shadow-lg animate-in fade-in slide-in-from-bottom-4">
        <CardHeader>
          <CardTitle>Website Analytics Trend</CardTitle>
          <CardDescription>Sessions, page views, and bounce rate over time (filtered data)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              sessions: {
                label: "Sessions",
                color: "hsl(var(--chart-1))",
              },
              pageViews: {
                label: "Page Views",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[400px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  stroke="var(--color-sessions)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-sessions)", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="pageViews"
                  stroke="var(--color-pageViews)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-pageViews)", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
})

AnalyticsSection.displayName = "AnalyticsSection"
