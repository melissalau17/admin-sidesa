"use client"

import { Bell, User } from "lucide-react"
import { Button } from "../components/ui/buttom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth-provider"

export function Header() {
  const { logout } = useAuth()

  return (
    <header className="flex h-14 items-center gap-4 border-b border-gray-200 bg-white px-6 shadow-sm">
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full border border-gray-200 hover:border-gray-300">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full border border-gray-200 hover:border-gray-300">
              <User className="h-5 w-5" />
              <span className="sr-only">User</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white text-red-500 border border-gray-200 rounded-md">
            <DropdownMenuItem onClick={logout} className="hover:bg-red-500 hover:text-white">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}