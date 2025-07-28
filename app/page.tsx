import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardContent } from "@/components/dashboard-content"
import { DashboardProvider } from "@/lib/dashboard-context"

export default function Dashboard() {
  return (
    <DashboardProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">ADmyBRAND Insights</h1>
            </div>
          </header>
          <DashboardContent />
        </SidebarInset>
      </SidebarProvider>
    </DashboardProvider>
  )
}
