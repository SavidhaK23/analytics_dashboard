"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react"
import { useDashboard } from "@/lib/dashboard-context"
import { useMemo } from "react"
import { InsightsSkeleton } from "@/components/loading-skeleton"

export function InsightsSection() {
  const { state, filteredData } = useDashboard()

  // Generate dynamic insights based on filtered data
  const insights = useMemo(() => {
    if (!filteredData.users.length) return []

    const users = filteredData.users
    const activeUsers = users.filter((u) => u.status === "active").length
    const totalRevenue = users.reduce((sum, u) => sum + u.revenue, 0)
    const avgRevenue = totalRevenue / users.length
    const recentUsers = users.filter((u) => {
      const signupDate = new Date(u.signupDate)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      return signupDate > thirtyDaysAgo
    }).length

    const generatedInsights = []

    // Revenue insight
    if (avgRevenue > 5000) {
      generatedInsights.push({
        id: 1,
        title: "High-Value User Segment",
        description: `Your filtered user segment shows exceptional value with an average revenue of $${avgRevenue.toFixed(
          0,
        )} per user. This is ${Math.round(((avgRevenue - 3000) / 3000) * 100)}% above the baseline.`,
        type: "positive",
        impact: "high",
        category: "Revenue",
        actionable: true,
      })
    } else if (avgRevenue < 2000) {
      generatedInsights.push({
        id: 1,
        title: "Revenue Optimization Opportunity",
        description: `The current filtered segment shows lower average revenue of $${avgRevenue.toFixed(
          0,
        )} per user. Consider targeted upselling campaigns for this segment.`,
        type: "opportunity",
        impact: "high",
        category: "Revenue",
        actionable: true,
      })
    }

    // User engagement insight
    const engagementRate = (activeUsers / users.length) * 100
    if (engagementRate > 70) {
      generatedInsights.push({
        id: 2,
        title: "Excellent User Engagement",
        description: `${engagementRate.toFixed(
          1,
        )}% of users in this segment are active, indicating strong product-market fit. This segment could be ideal for referral programs.`,
        type: "achievement",
        impact: "medium",
        category: "Engagement",
        actionable: true,
      })
    } else if (engagementRate < 40) {
      generatedInsights.push({
        id: 2,
        title: "Engagement Improvement Needed",
        description: `Only ${engagementRate.toFixed(
          1,
        )}% of users in this segment are active. Consider re-engagement campaigns or product improvements for this group.`,
        type: "warning",
        impact: "high",
        category: "Engagement",
        actionable: true,
      })
    }

    // Growth insight
    if (recentUsers > users.length * 0.3) {
      generatedInsights.push({
        id: 3,
        title: "Strong Growth Momentum",
        description: `${recentUsers} users (${Math.round(
          (recentUsers / users.length) * 100,
        )}%) joined in the last 30 days. This segment shows healthy growth patterns.`,
        type: "positive",
        impact: "medium",
        category: "Growth",
        actionable: false,
      })
    }

    // Data quality insight
    if (users.length < 10) {
      generatedInsights.push({
        id: 4,
        title: "Limited Data Sample",
        description: `Current filters result in only ${users.length} users. Consider broadening filters for more comprehensive insights and better statistical significance.`,
        type: "warning",
        impact: "medium",
        category: "Data Quality",
        actionable: true,
      })
    }

    return generatedInsights
  }, [filteredData.users])

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "opportunity":
        return <Lightbulb className="h-5 w-5 text-blue-500" aria-hidden="true" />
      case "positive":
        return <TrendingUp className="h-5 w-5 text-green-500" aria-hidden="true" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" aria-hidden="true" />
      case "achievement":
        return <CheckCircle className="h-5 w-5 text-green-500" aria-hidden="true" />
      default:
        return <Lightbulb className="h-5 w-5" aria-hidden="true" />
    }
  }

  const getImpactBadge = (impact: string) => {
    const variants = {
      high: "destructive",
      medium: "secondary",
      low: "outline",
    } as const

    return (
      <Badge variant={variants[impact as keyof typeof variants]} aria-label={`${impact} impact level`}>
        {impact} impact
      </Badge>
    )
  }

  const handleTakeAction = (insightTitle: string) => {
    // In a real app, this would navigate to relevant sections or open action dialogs
    alert(`Taking action on: ${insightTitle}`)
  }

  if (state.isLoading) {
    return <InsightsSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Insights Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">AI-Powered Insights</h3>
          <p className="text-sm text-muted-foreground">
            Dynamic recommendations based on your filtered data ({filteredData.users.length} users)
          </p>
        </div>
        <Button
          variant="outline"
          className="transition-all duration-200 hover:scale-105 bg-transparent"
          aria-label="View all insights"
        >
          View All Insights
        </Button>
      </div>

      {/* Dynamic Insights Grid */}
      <div className="grid gap-4" role="region" aria-label="Business insights">
        {insights.length === 0 ? (
          <Card className="transition-all duration-300 animate-in fade-in slide-in-from-left-4">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
                <h3 className="text-lg font-semibold mb-2">No Insights Available</h3>
                <p className="text-muted-foreground">
                  Apply filters or refresh data to generate personalized insights.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          insights.map((insight, index) => (
            <Card
              key={insight.id}
              className="transition-all duration-300 hover:shadow-lg animate-in fade-in slide-in-from-left-4"
              style={{ animationDelay: `${index * 100}ms` }}
              role="article"
              aria-labelledby={`insight-title-${insight.id}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div aria-label={`${insight.type} insight`}>{getInsightIcon(insight.type)}</div>
                    <div className="space-y-1">
                      <CardTitle className="text-lg" id={`insight-title-${insight.id}`}>
                        {insight.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" aria-label={`Category: ${insight.category}`}>
                          {insight.category}
                        </Badge>
                        {getImpactBadge(insight.impact)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <CardDescription className="text-sm leading-relaxed" aria-describedby={`insight-title-${insight.id}`}>
                    {insight.description}
                  </CardDescription>

                  {insight.actionable && (
                    <Button
                      onClick={() => handleTakeAction(insight.title)}
                      className="transition-all duration-200 hover:scale-105"
                      aria-label={`Take action on ${insight.title}`}
                    >
                      Take Action
                      <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
