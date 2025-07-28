"use client"

import type React from "react"
import { createContext, useContext, useReducer, useCallback, useMemo, useEffect } from "react"

interface FilterState {
  dateFrom: string
  dateTo: string
  status: string
  searchTerm: string
}

interface UserData {
  id: string
  name: string
  email: string
  status: "active" | "inactive" | "pending"
  revenue: number
  lastActive: string
  signupDate: string
  country: string
}

interface ReportData {
  id: number
  title: string
  description: string
  status: "completed" | "processing" | "scheduled"
  lastGenerated: string
  size: string
  type: string
}

interface MetricData {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative"
  description: string
  rawValue: number // Add raw value for consistency
}

interface AnalyticsData {
  month: string
  sessions: number
  pageViews: number
  bounceRate: number
}

interface ChartData {
  lineChartData: Array<{ month: string; revenue: number; users: number }>
  deviceData: Array<{ name: string; value: number; fill: string }>
  userDistribution: Array<{ name: string; value: number; fill: string }>
}

interface DashboardState {
  filters: FilterState
  appliedFilters: FilterState
  isLoading: boolean
  lastUpdated: Date
  error: string | null
  baseData: {
    users: UserData[]
    reports: ReportData[]
  }
}

type DashboardAction =
  | { type: "SET_FILTERS"; payload: FilterState }
  | { type: "APPLY_FILTERS"; payload: FilterState }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "UPDATE_BASE_DATA"; payload: any }
  | { type: "REFRESH_DATA" }
  | { type: "RESET_FILTERS" }
  | { type: "ADD_REPORT"; payload: ReportData }

const initialState: DashboardState = {
  filters: {
    dateFrom: "",
    dateTo: "",
    status: "all",
    searchTerm: "",
  },
  appliedFilters: {
    dateFrom: "",
    dateTo: "",
    status: "all",
    searchTerm: "",
  },
  isLoading: true,
  lastUpdated: new Date(),
  error: null,
  baseData: {
    users: [],
    reports: [],
  },
}

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case "SET_FILTERS":
      return { ...state, filters: action.payload }
    case "APPLY_FILTERS":
      return { ...state, appliedFilters: action.payload, filters: action.payload }
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload }
    case "UPDATE_BASE_DATA":
      return { ...state, baseData: action.payload, lastUpdated: new Date() }
    case "REFRESH_DATA":
      return { ...state, lastUpdated: new Date() }
    case "RESET_FILTERS":
      const resetFilters = initialState.filters
      return { ...state, filters: resetFilters, appliedFilters: resetFilters }
    case "ADD_REPORT":
      return {
        ...state,
        baseData: {
          ...state.baseData,
          reports: [...state.baseData.reports, action.payload],
        },
      }
    default:
      return state
  }
}

const DashboardContext = createContext<{
  state: DashboardState
  dispatch: React.Dispatch<DashboardAction>
  filteredData: {
    users: UserData[]
    metrics: MetricData[]
    analytics: AnalyticsData[]
    chartData: ChartData
  }
  applyFilters: (filters: FilterState) => void
  refreshData: () => Promise<void>
  resetFilters: () => void
  addReport: (report: Omit<ReportData, "id">) => void
  getExportData: () => UserData[] // Add consistent export data
} | null>(null)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState)

  // Initialize base data on first load
  const initializeData = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "SET_ERROR", payload: null })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const baseData = {
        users: generateBaseUsers(),
        reports: generateBaseReports(),
      }

      dispatch({ type: "UPDATE_BASE_DATA", payload: baseData })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to load data" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])

  // Initialize data on mount
  useEffect(() => {
    initializeData()
  }, [initializeData])

  // Memoized filtered data with consistent calculations
  const filteredData = useMemo(() => {
    if (!state.baseData.users.length) {
      return {
        users: [],
        metrics: getDefaultMetrics(),
        analytics: getDefaultAnalytics(),
        chartData: getDefaultChartData(),
      }
    }

    return generateConsistentFilteredData(state.baseData.users, state.appliedFilters)
  }, [state.baseData.users, state.appliedFilters])

  // Get consistent export data
  const getExportData = useCallback(() => {
    return filteredData.users
  }, [filteredData.users])

  const applyFilters = useCallback(async (filters: FilterState) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "SET_ERROR", payload: null })

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 800))

      dispatch({ type: "APPLY_FILTERS", payload: filters })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to apply filters" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])

  const refreshData = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "SET_ERROR", payload: null })

      // Simulate API refresh - update timestamps and some values but keep core data
      await new Promise((resolve) => setTimeout(resolve, 1200))

      const updatedUsers = state.baseData.users.map((user) => ({
        ...user,
        lastActive: Math.random() > 0.7 ? new Date().toLocaleDateString() : user.lastActive,
        revenue: Math.random() > 0.8 ? Math.floor(Math.random() * 10000) + 100 : user.revenue,
      }))

      dispatch({
        type: "UPDATE_BASE_DATA",
        payload: {
          ...state.baseData,
          users: updatedUsers,
        },
      })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to refresh data" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
      dispatch({ type: "REFRESH_DATA" })
    }
  }, [state.baseData])

  const resetFilters = useCallback(() => {
    dispatch({ type: "RESET_FILTERS" })
  }, [])

  const addReport = useCallback((report: Omit<ReportData, "id">) => {
    const newReport: ReportData = {
      ...report,
      id: Date.now(), // Simple ID generation
    }
    dispatch({ type: "ADD_REPORT", payload: newReport })
  }, [])

  return (
    <DashboardContext.Provider
      value={{
        state,
        dispatch,
        filteredData,
        applyFilters,
        refreshData,
        resetFilters,
        addReport,
        getExportData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return context
}

// Helper functions with consistent calculations
function generateBaseUsers(): UserData[] {
  const statuses: ("active" | "inactive" | "pending")[] = ["active", "inactive", "pending"]
  const countries = ["USA", "UK", "Canada", "Germany", "France", "Australia", "Japan", "Brazil"]
  const names = [
    "John Doe",
    "Jane Smith",
    "Bob Johnson",
    "Alice Brown",
    "Charlie Wilson",
    "Diana Davis",
    "Eve Miller",
    "Frank Garcia",
    "Grace Lee",
    "Henry Taylor",
    "Ivy Chen",
    "Jack Robinson",
    "Kate Williams",
    "Liam Anderson",
    "Mia Thompson",
    "Noah Davis",
    "Olivia Wilson",
    "Paul Martinez",
    "Quinn Taylor",
    "Ruby Johnson",
  ]

  return Array.from({ length: 50 }, (_, i) => ({
    id: `user-${i + 1}`,
    name: names[i % names.length],
    email: `${names[i % names.length].toLowerCase().replace(" ", ".")}@example.com`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    revenue: Math.floor(Math.random() * 10000) + 100,
    lastActive: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    signupDate: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    country: countries[Math.floor(Math.random() * countries.length)],
  }))
}

function generateBaseReports(): ReportData[] {
  return [
    {
      id: 1,
      title: "Monthly Performance Report",
      description: "Comprehensive analysis of monthly metrics and KPIs",
      status: "completed",
      lastGenerated: "2024-01-15",
      size: "2.4 MB",
      type: "PDF",
    },
    {
      id: 2,
      title: "User Engagement Analysis",
      description: "Detailed breakdown of user behavior and engagement patterns",
      status: "processing",
      lastGenerated: "2024-01-14",
      size: "1.8 MB",
      type: "Excel",
    },
    {
      id: 3,
      title: "Revenue Analytics Report",
      description: "Financial performance and revenue trend analysis",
      status: "completed",
      lastGenerated: "2024-01-13",
      size: "3.1 MB",
      type: "PDF",
    },
    {
      id: 4,
      title: "Traffic Sources Report",
      description: "Analysis of traffic sources and conversion rates",
      status: "scheduled",
      lastGenerated: "2024-01-12",
      size: "1.5 MB",
      type: "CSV",
    },
  ]
}

// Consistent data generation using same base calculations
function generateConsistentFilteredData(users: UserData[], filters: FilterState) {
  const { dateFrom, dateTo, status, searchTerm } = filters

  // Filter users based on applied filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !searchTerm ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = status === "all" || user.status === status

    const matchesDate =
      (!dateFrom || new Date(user.signupDate) >= new Date(dateFrom)) &&
      (!dateTo || new Date(user.signupDate) <= new Date(dateTo))

    return matchesSearch && matchesStatus && matchesDate
  })

  // Use consistent base calculations for all derived data
  const baseCalculations = calculateBaseMetrics(filteredUsers)

  return {
    users: filteredUsers,
    metrics: generateMetricsFromBase(baseCalculations),
    analytics: generateAnalyticsFromBase(baseCalculations),
    chartData: generateChartDataFromBase(baseCalculations),
  }
}

// Base calculations that all components use
function calculateBaseMetrics(users: UserData[]) {
  const totalRevenue = users.reduce((sum, user) => sum + user.revenue, 0)
  const activeUsers = users.filter((user) => user.status === "active").length
  const inactiveUsers = users.filter((user) => user.status === "inactive").length
  const pendingUsers = users.filter((user) => user.status === "pending").length
  const totalUsers = users.length
  const conversionRate = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0
  const conversions = Math.floor(totalUsers * 0.23)
  const avgRevenue = totalUsers > 0 ? totalRevenue / totalUsers : 0

  // Country distribution
  const countryDistribution = users.reduce(
    (acc, user) => {
      acc[user.country] = (acc[user.country] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return {
    totalRevenue,
    activeUsers,
    inactiveUsers,
    pendingUsers,
    totalUsers,
    conversionRate,
    conversions,
    avgRevenue,
    countryDistribution,
    users,
  }
}

function generateMetricsFromBase(base: ReturnType<typeof calculateBaseMetrics>): MetricData[] {
  return [
    {
      title: "Total Revenue",
      value: `$${base.totalRevenue.toLocaleString()}`,
      rawValue: base.totalRevenue,
      change: base.totalRevenue > 50000 ? "+20.1%" : "+15.3%",
      changeType: "positive" as const,
      description: "from filtered data",
    },
    {
      title: "Active Users",
      value: base.activeUsers.toString(),
      rawValue: base.activeUsers,
      change: base.activeUsers > 20 ? "+18.1%" : "+12.5%",
      changeType: "positive" as const,
      description: "from filtered data",
    },
    {
      title: "Conversions",
      value: base.conversions.toString(),
      rawValue: base.conversions,
      change: base.conversions > 10 ? "+19%" : "+8.2%",
      changeType: "positive" as const,
      description: "from filtered data",
    },
    {
      title: "Conversion Rate",
      value: `${base.conversionRate.toFixed(1)}%`,
      rawValue: base.conversionRate,
      change: base.conversionRate > 50 ? "+2.1%" : "-1.8%",
      changeType: base.conversionRate > 50 ? ("positive" as const) : ("negative" as const),
      description: "from filtered data",
    },
  ]
}

function generateAnalyticsFromBase(base: ReturnType<typeof calculateBaseMetrics>): AnalyticsData[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]
  const baseMultiplier = Math.max(base.totalUsers / 10, 1)

  return months.map((month, index) => ({
    month,
    sessions: Math.floor(baseMultiplier * (50 + index * 10 + Math.random() * 20)),
    pageViews: Math.floor(baseMultiplier * (150 + index * 30 + Math.random() * 50)),
    bounceRate: Math.floor(Math.random() * 15 + 30),
  }))
}

function generateChartDataFromBase(base: ReturnType<typeof calculateBaseMetrics>): ChartData {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]
  const baseRevenue = base.totalUsers > 0 ? base.totalRevenue / 7 : 1000
  const baseUsers = Math.max(base.totalUsers / 7, 1)

  const lineChartData = months.map((month, index) => ({
    month,
    revenue: Math.floor(baseRevenue * (0.8 + index * 0.1 + Math.random() * 0.3)),
    users: Math.floor(baseUsers * (0.9 + index * 0.05 + Math.random() * 0.2)),
  }))

  const deviceData = [
    { name: "Desktop", value: Math.floor(Math.max(base.totalUsers * 0.4, 10)), fill: "hsl(var(--chart-1))" },
    { name: "Mobile", value: Math.floor(Math.max(base.totalUsers * 0.35, 8)), fill: "hsl(var(--chart-2))" },
    { name: "Tablet", value: Math.floor(Math.max(base.totalUsers * 0.2, 5)), fill: "hsl(var(--chart-3))" },
    { name: "Other", value: Math.floor(Math.max(base.totalUsers * 0.05, 2)), fill: "hsl(var(--chart-4))" },
  ]

  const userDistribution = [
    { name: "New Users", value: Math.floor(Math.max(base.totalUsers * 0.45, 10)), fill: "hsl(var(--chart-1))" },
    { name: "Returning Users", value: Math.floor(Math.max(base.totalUsers * 0.35, 8)), fill: "hsl(var(--chart-2))" },
    { name: "Inactive Users", value: Math.floor(Math.max(base.totalUsers * 0.2, 5)), fill: "hsl(var(--chart-3))" },
  ]

  return {
    lineChartData,
    deviceData,
    userDistribution,
  }
}

function getDefaultMetrics(): MetricData[] {
  return [
    {
      title: "Total Revenue",
      value: "$0",
      rawValue: 0,
      change: "+0%",
      changeType: "positive",
      description: "loading...",
    },
    {
      title: "Active Users",
      value: "0",
      rawValue: 0,
      change: "+0%",
      changeType: "positive",
      description: "loading...",
    },
    {
      title: "Conversions",
      value: "0",
      rawValue: 0,
      change: "+0%",
      changeType: "positive",
      description: "loading...",
    },
    {
      title: "Conversion Rate",
      value: "0%",
      rawValue: 0,
      change: "+0%",
      changeType: "positive",
      description: "loading...",
    },
  ]
}

function getDefaultAnalytics(): AnalyticsData[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]
  return months.map((month) => ({
    month,
    sessions: 0,
    pageViews: 0,
    bounceRate: 0,
  }))
}

function getDefaultChartData(): ChartData {
  return {
    lineChartData: [
      { month: "Jan", revenue: 4000, users: 2400 },
      { month: "Feb", revenue: 3000, users: 1398 },
      { month: "Mar", revenue: 2000, users: 9800 },
      { month: "Apr", revenue: 2780, users: 3908 },
      { month: "May", revenue: 1890, users: 4800 },
      { month: "Jun", revenue: 2390, users: 3800 },
      { month: "Jul", revenue: 3490, users: 4300 },
    ],
    deviceData: [
      { name: "Desktop", value: 400, fill: "hsl(var(--chart-1))" },
      { name: "Mobile", value: 300, fill: "hsl(var(--chart-2))" },
      { name: "Tablet", value: 200, fill: "hsl(var(--chart-3))" },
      { name: "Other", value: 100, fill: "hsl(var(--chart-4))" },
    ],
    userDistribution: [
      { name: "New Users", value: 45, fill: "hsl(var(--chart-1))" },
      { name: "Returning Users", value: 35, fill: "hsl(var(--chart-2))" },
      { name: "Inactive Users", value: 20, fill: "hsl(var(--chart-3))" },
    ],
  }
}
