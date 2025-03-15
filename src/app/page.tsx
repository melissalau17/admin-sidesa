"use client"

import { useEffect } from "react"

export default function Home() {
  useEffect(() => {
    // Check authentication status
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"

    // Redirect based on authentication status
    if (isAuthenticated) {
      window.location.href = "/dashboard"
    } else {
      window.location.href = "/login"
    }
  }, [])

  // Return null while redirecting
  return null
}

