"use client"

import { BarChart3, Calendar, Home, LineChart, PieChart, Settings, TrendingUp, Users } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState } from "react"

const items = [
  {
    title: "Dashboard",
    sectionId: "dashboard",
    icon: Home,
  },
  {
    title: "Analytics",
    sectionId: "analytics",
    icon: BarChart3,
  },
  {
    title: "Reports",
    sectionId: "reports",
    icon: LineChart,
  },
  {
    title: "Users",
    sectionId: "users",
    icon: Users,
  },
  {
    title: "Insights",
    sectionId: "insights",
    icon: TrendingUp,
  },
  {
    title: "Charts",
    sectionId: "charts",
    icon: PieChart,
  },
  {
    title: "Calendar",
    sectionId: "calendar",
    icon: Calendar,
  },
  {
    title: "Settings",
    sectionId: "settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const [activeSection, setActiveSection] = useState("dashboard")

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)

    // Add highlight effect
    const element = document.getElementById(sectionId)
    if (element) {
      // Smooth scroll to element
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      })

      // Add highlight animation
      element.classList.add("highlight-section")

      // Remove highlight after animation
      setTimeout(() => {
        element.classList.remove("highlight-section")
      }, 2000)
    }
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">ADmyBRAND</span>
            <span className="truncate text-xs text-muted-foreground">Insights</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={activeSection === item.sectionId}
                    onClick={() => scrollToSection(item.sectionId)}
                    className="cursor-pointer transition-all duration-200 hover:scale-105"
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2">
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
