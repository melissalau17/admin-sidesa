"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "../components/ui/buttom";
import { useAuth } from "@/lib/auth/auth-provider"
import { LayoutDashboard, FileText, MessageSquare, Newspaper, DollarSign, LogOut,Users, type LucideIcon } from "lucide-react"

interface MenuItem {
   name: string
   href: string
   icon: LucideIcon
}

const menuItems: MenuItem[] = [
   {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
   },
   {
      name: "Data User",
      href: "/data-user",
      icon: Users,
   },
   {
      name: "Kelola Surat",
      href: "/kelola-surat",
      icon: FileText,
   },
   {
      name: "Laporan Masyarakat",
      href: "/laporan-masyarakat",
      icon: MessageSquare,
   },
   {
      name: "Berita Desa",
      href: "/berita-desa",
      icon: Newspaper,
   },
   {
      name: "Laporan Keuangan",
      href: "/laporan-keuangan",
      icon: DollarSign,
   },
]

export function Sidebar() {
   const pathname = usePathname()
   const { logout } = useAuth()

   return (
      <div className="flex h-screen flex-col border-r bg-[#004D40] text-white">
         <div className="p-4">
         <h1 className="text-xl font-bold">Admin Desa</h1>
         <p className="text-sm text-gray-300">Panel Administrasi</p>
         </div>
         <nav className="flex-1 space-y-2 p-2">
         {menuItems.map((item) => (
            <Link
               key={item.href}
               href={item.href}
               className={cn(
               "flex items-center rounded-md px-3 py-3 text-sm font-medium transition-colors",
               pathname === item.href ? "bg-[#00695C] text-white" : "text-white hover:bg-[#00695C] hover:text-white",
               )}
            >
               <item.icon className="mr-3 h-5 w-5" />
               {item.name}
            </Link>
         ))}
         </nav>
         <div className="p-4">
         <Button variant="secondary" className="w-full" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
         </Button>
         </div>
      </div>
   )
}

