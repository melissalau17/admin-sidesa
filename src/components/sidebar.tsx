"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useAuth } from "@/lib/auth/auth-provider";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Newspaper,
  LogOut,
  Users,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";

interface MenuItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
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
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile toggle button - visible only on small screens */}
      <button
        className="md:hidden fixed bottom-4 right-4 z-50 bg-[#004D40] text-white p-3 rounded-full shadow-lg"
        onClick={toggleSidebar}
        aria-label={isOpen ? "Tutup menu" : "Buka menu"} // Added aria-label for accessibility
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar - different styles for mobile and desktop */}
      <div
        className={cn(
          "bg-[#004D40] text-white transition-all duration-300 ease-in-out z-40 flex flex-col h-screen", // Added flex flex-col h-screen
          // Mobile styles
          "fixed inset-y-0 left-0 w-64 transform",
          isOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop styles
          "md:relative md:translate-x-0 md:w-64" // md:h-screen removed as h-screen is now base
        )}
      >
        {/* Konten Sidebar sekarang di dalam div utama */}
        <div className="p-4">
          <h1 className="text-xl font-bold">Admin Desa</h1>
          <p className="text-sm text-gray-300">Panel Administrasi</p>
        </div>

        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-[#00695C] text-white"
                  : "text-white hover:bg-[#00695C] hover:text-white"
              )}
              onClick={() => setIsOpen(false)} // Close sidebar on mobile after click
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />{" "}
              {/* Added flex-shrink-0 */}
              <span>{item.name}</span>{" "}
              {/* Wrapped name in span for potential future styling */}
            </Link>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          {" "}
          {/* mt-auto to push logout to bottom */}
          <Button
            variant="secondary"
            className="w-full bg-red-600 hover:bg-red-700 text-white" // Example styling for logout
            onClick={() => {
              logout();
              setIsOpen(false); // Close sidebar on logout
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-1 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
