"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, ChevronLeft, ChevronRight, Search, Download, FileText } from "lucide-react"
import { useDashboard } from "@/lib/dashboard-context"
import { Skeleton } from "@/components/ui/skeleton"

type SortField = "name" | "email" | "signupDate" | "status"
type SortDirection = "asc" | "desc"

export function UserDataTable() {
  const { state, filteredData, getExportData } = useDashboard()
  const [localSearchTerm, setLocalSearchTerm] = React.useState("")
  const [sortField, setSortField] = React.useState<SortField>("name")
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("asc")
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 5

  // Reset local search when global filters change
  React.useEffect(() => {
    setLocalSearchTerm("")
    setCurrentPage(1)
  }, [state.appliedFilters])

  // Get filtered and sorted data from context data
  const localFilteredData = React.useMemo(() => {
    let data = [...filteredData.users]

    // Apply local search on top of global filters
    if (localSearchTerm) {
      data = data.filter(
        (user) =>
          user.name.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(localSearchTerm.toLowerCase()),
      )
    }

    // Apply sorting
    data.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return 0
    })

    return data
  }, [filteredData.users, localSearchTerm, sortField, sortDirection])

  React.useEffect(() => {
    setCurrentPage(1)
  }, [localSearchTerm, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleExportCSV = () => {
    // Use consistent export data from context
    const exportData = getExportData()
    const headers = ["Name", "Email", "Signup Date", "Status"]
    const csvContent = [
      headers.join(","),
      ...exportData.map((user) => `"${user.name}","${user.email}","${user.signupDate}","${user.status}"`),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `users-data-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const handleExportPDF = () => {
    // Use consistent export data from context
    const exportData = getExportData()
    const printContent = `
ADmyBRAND Insights - User Report
Generated on: ${new Date().toLocaleDateString()}
Total Users: ${exportData.length}

User Details:
${exportData
  .map(
    (user) =>
      `Name: ${user.name}, Email: ${user.email}, Signup: ${formatDate(user.signupDate)}, Status: ${user.status}`,
  )
  .join("\n")}
    `

    const blob = new Blob([printContent], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `users-report-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const totalPages = Math.ceil(localFilteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = localFilteredData.slice(startIndex, startIndex + itemsPerPage)

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      inactive: "secondary",
      pending: "outline",
    } as const

    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (state.isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-64" />
          <div className="flex justify-between items-center mt-4">
            <Skeleton className="h-10 w-64" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-lg animate-in fade-in slide-in-from-bottom-4">
      <CardHeader>
        <CardTitle>User Data</CardTitle>
        <CardDescription>
          Manage and view user information with filtering and sorting ({filteredData.users.length} users from filters)
        </CardDescription>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="pl-8 transition-all duration-200 focus:ring-2"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="transition-all duration-200 hover:scale-105 bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              className="transition-all duration-200 hover:scale-105 bg-transparent"
            >
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("name")}
                    className="h-auto p-0 font-semibold transition-colors duration-200 hover:text-primary"
                  >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("email")}
                    className="h-auto p-0 font-semibold transition-colors duration-200 hover:text-primary"
                  >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("signupDate")}
                    className="h-auto p-0 font-semibold transition-colors duration-200 hover:text-primary"
                  >
                    Signup Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("status")}
                    className="h-auto p-0 font-semibold transition-colors duration-200 hover:text-primary"
                  >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((user, index) => (
                <TableRow
                  key={user.id}
                  className="transition-colors duration-200 hover:bg-muted/50 animate-in fade-in slide-in-from-left-4"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>{formatDate(user.signupDate)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, localFilteredData.length)} of{" "}
            {localFilteredData.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
