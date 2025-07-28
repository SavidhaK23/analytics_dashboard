import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ADmyBRAND Insights - Modern Analytics Dashboard",
  description:
    "Comprehensive analytics dashboard with real-time data visualization, interactive charts, and advanced filtering capabilities",
  keywords: "analytics, dashboard, data visualization, business intelligence, metrics",
  authors: [{ name: "ADmyBRAND Team" }],
  viewport: "width=device-width, initial-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
