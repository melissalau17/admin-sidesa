"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType {
   isAuthenticated: boolean
   login: (redirect?: boolean) => void
   logout: () => void
}

const AuthContext = createContext<AuthContextType>({
   isAuthenticated: false,
   login: () => {},
   logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

interface AuthProviderProps {
   children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
   const [isLoading, setIsLoading] = useState<boolean>(true)
   const router = useRouter()
   const pathname = usePathname()

   useEffect(() => {
      const authStatus = localStorage.getItem("isAuthenticated")
      setIsAuthenticated(authStatus === "true")
      setIsLoading(false)
   }, [])

   useEffect(() => {
      if (!isLoading) {
         const isPublicRoute = pathname === "/" || pathname === "/login"

         if (!isAuthenticated && !isPublicRoute) {
         router.push("/login")
         }
      }
   }, [isAuthenticated, isLoading, pathname, router])

   const login = (redirect = true) => {
      setIsAuthenticated(true)
      localStorage.setItem("isAuthenticated", "true")
      if (redirect) {
         router.push("/dashboard")
      }
   }

   const logout = () => {
      // First clear the authentication state
      localStorage.removeItem("isAuthenticated")
      // Then set the state to trigger UI updates
      setIsAuthenticated(false)
      // Force redirect to landing page
      window.location.href = "/"
   }

   return (
      <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{!isLoading && children}</AuthContext.Provider>
   )
}
