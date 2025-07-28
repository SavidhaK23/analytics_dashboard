"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { useDashboard } from "@/lib/dashboard-context"
import { ChartSkeleton } from "@/components/loading-skeleton"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Info, Eye, EyeOff } from "lucide-react"

export function ChartsSection() {
  const { state, filteredData } = useDashboard()
  const [showRevenueInfo, setShowRevenueInfo] = useState(false)
  const [showDeviceInfo, setShowDeviceInfo] = useState(false)
  const [showDistributionInfo, setShowDistributionInfo] = useState(false)
  const [showConversionsInfo, setShowConversionsInfo] = useState(false)
  const [activeDataPoint, setActiveDataPoint] = useState<any>(null)

  if (state.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-full lg:col-span-2">
          <ChartSkeleton height="300px" />
        </div>
        <ChartSkeleton height="280px" />
        <ChartSkeleton height="300px" />
        <div className="col-span-full lg:col-span-2">
          <ChartSkeleton height="350px" />
        </div>
      </div>
    )
  }

  const { lineChartData, deviceData, userDistribution } = filteredData.chartData

  // Calculate insights for each chart
  const revenueInsights = {
    totalRevenue: lineChartData.reduce((sum, item) => sum + item.revenue, 0),
    totalUsers: lineChartData.reduce((sum, item) => sum + item.users, 0),
    avgRevenue: lineChartData.reduce((sum, item) => sum + item.revenue, 0) / lineChartData.length,
    growth:
      lineChartData.length > 1
        ? (
            ((lineChartData[lineChartData.length - 1].revenue - lineChartData[0].revenue) / lineChartData[0].revenue) *
            100
          ).toFixed(1)
        : 0,
    bestMonth: lineChartData.reduce((max, item) => (item.revenue > max.revenue ? item : max), lineChartData[0]),
  }

  const deviceInsights = {
    totalDevices: deviceData.reduce((sum, item) => sum + item.value, 0),
    topDevice: deviceData.reduce((max, item) => (item.value > max.value ? item : max), deviceData[0]),
    mobilePercentage: (
      ((deviceData.find((d) => d.name === "Mobile")?.value || 0) /
        deviceData.reduce((sum, item) => sum + item.value, 0)) *
      100
    ).toFixed(1),
  }

  const distributionInsights = {
    totalUsers: userDistribution.reduce((sum, item) => sum + item.value, 0),
    newUserPercentage: (
      ((userDistribution.find((d) => d.name === "New Users")?.value || 0) /
        userDistribution.reduce((sum, item) => sum + item.value, 0)) *
      100
    ).toFixed(1),
    retentionRate: (
      ((userDistribution.find((d) => d.name === "Returning Users")?.value || 0) /
        userDistribution.reduce((sum, item) => sum + item.value, 0)) *
      100
    ).toFixed(1),
  }

  const conversionsInsights = {
    totalConversions: lineChartData.reduce((sum, item) => sum + item.users, 0),
    avgConversions: lineChartData.reduce((sum, item) => sum + item.users, 0) / lineChartData.length,
    bestConversionMonth: lineChartData.reduce((max, item) => (item.users > max.users ? item : max), lineChartData[0]),
    conversionTrend:
      lineChartData.length > 1
        ? (
            ((lineChartData[lineChartData.length - 1].users - lineChartData[0].users) / lineChartData[0].users) *
            100
          ).toFixed(1)
        : 0,
  }

  const handleChartClick = (data: any, chartType: string) => {
    setActiveDataPoint({ ...data, chartType })
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Revenue & Users Trend Chart */}
      <Card className="col-span-full lg:col-span-2 transition-all duration-300 hover:shadow-lg animate-in fade-in slide-in-from-left-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Revenue & Users Trend</CardTitle>
              <CardDescription>Monthly revenue and user growth over time (filtered data)</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRevenueInfo(!showRevenueInfo)}
              className="transition-all duration-200 hover:scale-105"
            >
              {showRevenueInfo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="ml-2">{showRevenueInfo ? "Hide" : "Show"} Info</span>
            </Button>
          </div>

          {showRevenueInfo && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-2 animate-in fade-in slide-in-from-top-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">${revenueInsights.totalRevenue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-medium">Total Users</p>
                  <p className="text-2xl font-bold text-blue-600">{revenueInsights.totalUsers.toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-medium">Growth Rate</p>
                  <div className="flex items-center gap-1">
                    {Number(revenueInsights.growth) > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <p
                      className={`text-lg font-bold ${Number(revenueInsights.growth) > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {revenueInsights.growth}%
                    </p>
                  </div>
                </div>
                <div>
                  <p className="font-medium">Best Month</p>
                  <p className="text-lg font-bold">{revenueInsights.bestMonth.month}</p>
                  <p className="text-sm text-muted-foreground">${revenueInsights.bestMonth.revenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              revenue: {
                label: "Revenue",
                color: "hsl(var(--chart-1))",
              },
              users: {
                label: "Users",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={lineChartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                onClick={(data) => handleChartClick(data, "revenue")}
              >
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke="var(--color-revenue)"
                  fill="var(--color-revenue)"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stackId="1"
                  stroke="var(--color-users)"
                  fill="var(--color-users)"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Device Usage Chart */}
      <Card
        className="transition-all duration-300 hover:shadow-lg animate-in fade-in slide-in-from-right-4"
        style={{ animationDelay: "200ms" }}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Device Usage</CardTitle>
              <CardDescription>Traffic by device type (filtered data)</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeviceInfo(!showDeviceInfo)}
              className="transition-all duration-200 hover:scale-105"
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>

          {showDeviceInfo && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-2 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Sessions:</span>
                  <Badge variant="secondary">{deviceInsights.totalDevices.toLocaleString()}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Top Device:</span>
                  <Badge variant="default">{deviceInsights.topDevice.name}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Mobile Traffic:</span>
                  <Badge variant="outline">{deviceInsights.mobilePercentage}%</Badge>
                </div>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent className="pb-4">
          <ChartContainer
            config={{
              desktop: {
                label: "Desktop",
                color: "hsl(var(--chart-1))",
              },
              mobile: {
                label: "Mobile",
                color: "hsl(var(--chart-2))",
              },
              tablet: {
                label: "Tablet",
                color: "hsl(var(--chart-3))",
              },
              other: {
                label: "Other",
                color: "hsl(var(--chart-4))",
              },
            }}
            className="h-[280px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={deviceData}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                onClick={(data) => handleChartClick(data, "device")}
              >
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" radius={4} fill="var(--color-desktop)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* User Distribution Chart */}
      <Card
        className="transition-all duration-300 hover:shadow-lg animate-in fade-in slide-in-from-bottom-4"
        style={{ animationDelay: "300ms" }}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Distribution</CardTitle>
              <CardDescription>Breakdown of user engagement levels (filtered data)</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDistributionInfo(!showDistributionInfo)}
              className="transition-all duration-200 hover:scale-105"
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>

          {showDistributionInfo && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-2 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Users:</span>
                  <Badge variant="secondary">{distributionInsights.totalUsers.toLocaleString()}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>New Users:</span>
                  <Badge variant="default">{distributionInsights.newUserPercentage}%</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Retention Rate:</span>
                  <Badge variant="outline">{distributionInsights.retentionRate}%</Badge>
                </div>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              newUsers: {
                label: "New Users",
                color: "hsl(var(--chart-1))",
              },
              returningUsers: {
                label: "Returning Users",
                color: "hsl(var(--chart-2))",
              },
              inactiveUsers: {
                label: "Inactive Users",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart onClick={(data) => handleChartClick(data, "distribution")}>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Monthly Conversions Chart */}
      <Card
        className="col-span-full lg:col-span-2 transition-all duration-300 hover:shadow-lg animate-in fade-in slide-in-from-bottom-4"
        style={{ animationDelay: "400ms" }}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Monthly Conversions</CardTitle>
              <CardDescription>Conversion rates by month with detailed breakdown (filtered data)</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConversionsInfo(!showConversionsInfo)}
              className="transition-all duration-200 hover:scale-105"
            >
              {showConversionsInfo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="ml-2">{showConversionsInfo ? "Hide" : "Show"} Info</span>
            </Button>
          </div>

          {showConversionsInfo && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-2 animate-in fade-in slide-in-from-top-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="font-medium">Total Conversions</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {conversionsInsights.totalConversions.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Avg/Month</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(conversionsInsights.avgConversions).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Trend</p>
                  <div className="flex items-center gap-1">
                    {Number(conversionsInsights.conversionTrend) > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <p
                      className={`text-lg font-bold ${Number(conversionsInsights.conversionTrend) > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {conversionsInsights.conversionTrend}%
                    </p>
                  </div>
                </div>
                <div>
                  <p className="font-medium">Best Month</p>
                  <p className="text-lg font-bold">{conversionsInsights.bestConversionMonth.month}</p>
                  <p className="text-sm text-muted-foreground">
                    {conversionsInsights.bestConversionMonth.users.toLocaleString()} conversions
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent className="pb-4">
          <ChartContainer
            config={{
              conversions: {
                label: "Conversions",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[350px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={lineChartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                onClick={(data) => handleChartClick(data, "conversions")}
              >
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="users" fill="var(--color-conversions)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Active Data Point Info */}
      {activeDataPoint && (
        <Card className="col-span-full animate-in fade-in slide-in-from-bottom-4 border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Chart Data Point Details
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveDataPoint(null)}
                className="transition-all duration-200 hover:scale-105"
              >
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="font-medium text-muted-foreground">Chart Type</p>
                <p className="text-lg font-bold capitalize">{activeDataPoint.chartType}</p>
              </div>
              {activeDataPoint.month && (
                <div>
                  <p className="font-medium text-muted-foreground">Month</p>
                  <p className="text-lg font-bold">{activeDataPoint.month}</p>
                </div>
              )}
              {activeDataPoint.revenue && (
                <div>
                  <p className="font-medium text-muted-foreground">Revenue</p>
                  <p className="text-lg font-bold text-green-600">${activeDataPoint.revenue.toLocaleString()}</p>
                </div>
              )}
              {activeDataPoint.users && (
                <div>
                  <p className="font-medium text-muted-foreground">Users</p>
                  <p className="text-lg font-bold text-blue-600">{activeDataPoint.users.toLocaleString()}</p>
                </div>
              )}
              {activeDataPoint.name && (
                <div>
                  <p className="font-medium text-muted-foreground">Device</p>
                  <p className="text-lg font-bold">{activeDataPoint.name}</p>
                </div>
              )}
              {activeDataPoint.value && (
                <div>
                  <p className="font-medium text-muted-foreground">Value</p>
                  <p className="text-lg font-bold text-purple-600">{activeDataPoint.value.toLocaleString()}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
