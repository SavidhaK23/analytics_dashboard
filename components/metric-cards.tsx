"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, DollarSign, TrendingUp, Users, Zap } from "lucide-react"
import { useDashboard } from "@/lib/dashboard-context"
import { Skeleton } from "@/components/ui/skeleton"

const iconMap = {
  "Total Revenue": DollarSign,
  "Active Users": Users,
  Conversions: Zap,
  "Conversion Rate": TrendingUp,
}

export function MetricCards() {
  const { state, filteredData } = useDashboard()

  if (state.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <div className="flex items-center">
                <Skeleton className="h-3 w-3 rounded mr-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const metrics = filteredData.metrics

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => {
        const IconComponent = iconMap[metric.title as keyof typeof iconMap] || DollarSign

        return (
          <Card
            key={metric.title}
            className="transition-all duration-300 hover:scale-105 hover:shadow-lg animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <IconComponent className="h-4 w-4 text-muted-foreground transition-colors duration-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold transition-all duration-200">{metric.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {metric.changeType === "positive" ? (
                  <ArrowUpIcon className="mr-1 h-3 w-3 text-green-500 transition-transform duration-200 hover:scale-110" />
                ) : (
                  <ArrowDownIcon className="mr-1 h-3 w-3 text-red-500 transition-transform duration-200 hover:scale-110" />
                )}
                <span className={metric.changeType === "positive" ? "text-green-500" : "text-red-500"}>
                  {metric.change}
                </span>
                <span className="ml-1">{metric.description}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
