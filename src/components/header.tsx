"use client"

import { Bell, User, Settings, LogOut, UserCircle } from "lucide-react"
import { Button } from "../components/ui/buttom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth-provider"

export function Header() {
  const { logout } = useAuth()

  return (
    <header className="flex h-14 items-center gap-4 border-b border-gray-200 bg-white px-6 shadow-sm">
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild> 
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifikasi</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-white border-gray-200">
            <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="py-6 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">Tidak ada notifikasi saat ini</p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">Profil</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border-gray-200">
            <div className="flex items-center gap-2 p-2">
              <div className="bg-primary rounded-full p-1">
                <UserCircle className="h-8 w-8 text-[#003C43]" />
              </div>
              <div className="flex flex-col space-y-0.5">
                <p className="text-sm font-medium">Admin Desa</p>
                <p className="text-xs text-muted-foreground">admin@desa.id</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-gray-200">
              <User className="mr-2 h-4 w-4" />
              <span>Profil Saya</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-200">
              <Settings className="mr-2 h-4 w-4" />
              <span>Pengaturan</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600 hover:bg-red-500 hover:text-white">
              <LogOut className="mr-2 h-4 w-4 " />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}