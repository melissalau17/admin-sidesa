import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

interface Activity {
    type: string;
    title: string;
    time: string; // ISO string
    timeAgo: string;
}

interface DashboardStats {
    permohonans: number;
    newPermohonans: number;
    laporans: number;
    newLaporans: number;
    beritas: { total: number; newThisWeek: number };
    users: { total: number; newThisMonth: number };
    activities: Activity[];
}

function formatTimeAgo(dateString: string): string {
    const time = new Date(dateString).getTime();
    if (isNaN(time)) return "waktu tidak valid";

    const diffMs = Date.now() - time;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) return "baru saja";
    if (diffMinutes < 60) return `${diffMinutes} menit lalu`;

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    if (hours < 24) return minutes === 0 ? `${hours} jam lalu` : `${hours} jam ${minutes} menit lalu`;

    const days = Math.floor(hours / 24);
    const remHours = hours % 24;
    return remHours === 0 ? `${days} hari lalu` : `${days} hari ${remHours} jam lalu`;
}

export function useDashboard(token: string | null) {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            // fetch logic
        };

        fetchData();

        // Initialize Socket.IO
        const socket: Socket = io(process.env.NEXT_PUBLIC_API_URL as string, { auth: { token } });

        socket.on("dashboard:update", (newStats: DashboardStats) => {
            const activities: Activity[] = newStats.activities.map(a => ({
                ...a,
                timeAgo: formatTimeAgo(a.time),
            }));
            setStats({ ...newStats, activities });
        });

        const interval = setInterval(() => {
            setStats(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    activities: prev.activities.map(a => ({
                        ...a,
                        timeAgo: formatTimeAgo(a.time),
                    })),
                };
            });
        }, 60_000);

        return () => {
            socket.disconnect();
            clearInterval(interval);
        };
    }, [token]);

    return { stats, loading, error };
}
