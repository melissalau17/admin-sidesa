"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType {
   isAuthenticated: boolean
   login: () => void
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
      // Check if user is authenticated on client side
      const authStatus = localStorage.getItem("isAuthenticated")
      setIsAuthenticated(authStatus === "true")
      setIsLoading(false)
   }, [])

   useEffect(() => {
      if (!isLoading) {
         // Only handle redirections for non-login pages when not authenticated
         // Let the login page handle its own redirections
         if (!isAuthenticated && pathname !== "/login") {
         router.push("/login")
         }
      }
   }, [isAuthenticated, isLoading, pathname, router])

   const login = () => {
      setIsAuthenticated(true)
      localStorage.setItem("isAuthenticated", "true")
   }

   const logout = () => {
      setIsAuthenticated(false)
      localStorage.removeItem("isAuthenticated")
      router.push("/login")
   }

   return (
      <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{!isLoading && children}</AuthContext.Provider>
   )
}

