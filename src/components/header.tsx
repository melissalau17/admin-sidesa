"use client"

import { Bell, User, Settings, LogOut, UserCircle } from "lucide-react"
import { Button } from "./ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth/auth-provider"
import * as Tooltip from "@radix-ui/react-tooltip"
import { useSocket } from "@/lib/socket/socket-provider";
import { Socket } from "socket.io-client";
import { useEffect, useState } from "react"

export function Header() {
    const { logout } = useAuth()
    const [notifications, setNotifications] = useState<any[]>([])
    const socket = useSocket()

    type NotificationType = {
        message: string;
        timestamp?: string;
    };

    useEffect(() => {
        if (!socket) return;

        const handleNotification = (data: NotificationType) => {
            setNotifications((prev) => [data, ...prev]);
        };

        socket.on("notification", handleNotification);

        return () => {
            socket.off("notification", handleNotification);
        };
    }, [socket]);


    return (
        <header className="flex flex-wrap sm:flex-nowrap h-auto sm:h-14 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 sm:px-6 py-2 sm:py-0 shadow-sm">
            {/* Logo / Judul - bisa tambahkan kalau diperlukan */}
            {/* <div className="text-lg font-semibold">Desa Digital</div> */}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Kumpulan Aksi (Notifikasi + Profil) */}
            <div className="flex items-center gap-2 flex-wrap">
                {/* Notifikasi */}
                <Tooltip.Provider delayDuration={300}>
                    <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-full">
                                            <Bell className="h-5 w-5" />
                                            <span className="sr-only">Notifikasi</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-80 bg-white border border-gray-200">
                                        <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {notifications.length === 0 ? (
                                            <div className="py-6 text-center">
                                                <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                                                <p className="text-sm text-muted-foreground">Tidak ada notifikasi saat ini</p>
                                            </div>
                                        ) : (
                                            <div className="max-h-64 overflow-y-auto">
                                                {notifications.map((notification, index) => (
                                                    <div
                                                        key={index}
                                                        className="px-4 py-2 border-b last:border-b-0 hover:bg-gray-50 transition"
                                                    >
                                                        <p className="text-sm font-medium">{notification.message}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(notification.timestamp || Date.now()).toLocaleString("id-ID", {
                                                                dateStyle: "short",
                                                                timeStyle: "short",
                                                            })}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                            <Tooltip.Content
                                side="bottom"
                                className="bg-white text-black text-sm px-2 py-1 rounded shadow-md"
                                sideOffset={5}
                            >
                                Notifikasi
                                <Tooltip.Arrow className="fill-white" />
                            </Tooltip.Content>
                        </Tooltip.Portal>
                    </Tooltip.Root>
                </Tooltip.Provider>

                {/* Profil */}
                <Tooltip.Provider delayDuration={300}>
                    <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-full">
                                            <User className="h-5 w-5" />
                                            <span className="sr-only">Profil</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200">
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
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Logout</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                            <Tooltip.Content
                                side="bottom"
                                className="bg-white text-black text-sm px-2 py-1 rounded shadow-md"
                                sideOffset={5}
                            >
                                Profil
                                <Tooltip.Arrow className="fill-white" />
                            </Tooltip.Content>
                        </Tooltip.Portal>
                    </Tooltip.Root>
                </Tooltip.Provider>
            </div>
        </header>
    )
}
