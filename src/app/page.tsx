"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { PublicHeader } from "@/components/public-header" 
import { LandingPageContent } from "@/components/landing/landing-page-content" 
import { useAuth } from "@/lib/auth/auth-provider" 

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  return (
    <>
      <PublicHeader />
      <LandingPageContent />
    </>
  )
}
