import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import type { ReactNode } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Admin Desa - Panel Administrasi",
  description: "Panel administrasi desa",
    generator: 'v0.dev',
  icons: {
    icon: '/homestay.svg',

  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className={inter.className}>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
      </body>
    </html>
  )
}

import './globals.css'