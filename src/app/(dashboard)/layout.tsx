"use client"

import { useAuth } from "@/lib/auth/auth-provider" // Updated import path
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import type { ReactNode } from "react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return null // Will be redirected by AuthProvider
  }

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-3 sm:p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
