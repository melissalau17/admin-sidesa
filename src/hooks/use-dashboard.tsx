import { useEffect, useState } from "react";
import { io } from "socket.io-client";

interface Activity {
    type: "permohonan" | "laporan" | "berita" | string;
    title: string;
    time: string;
    timeAgo: string;
}

interface DashboardStats {
    permohonans: number;
    newPermohonans: number;
    laporans: number;
    newLaporans: number;
    beritas: {
        total: number;
        newThisWeek: number;
    };
    users: {
        total: number;
        newThisMonth: number;
    };
    activities: Activity[];
}

// More human-friendly time formatting
function formatTimeAgo(dateString: string): string {
    const now = Date.now();
    const time = new Date(dateString).getTime();
    if (isNaN(time)) return "waktu tidak valid";

    let diffSec = Math.floor((now - time) / 1000);

    if (diffSec < 60) return "baru saja";

    const days = Math.floor(diffSec / 86400);
    diffSec -= days * 86400;

    const hours = Math.floor(diffSec / 3600);
    diffSec -= hours * 3600;

    const minutes = Math.floor(diffSec / 60);

    if (days > 0) return `${days} hari lalu`;
    if (hours > 0) return `${hours} jam ${minutes > 0 ? `${minutes} menit ` : ""}lalu`;
    return `${minutes} menit lalu`;
}

interface ApiActivity {
    type: string;
    title: string;
    time: string;
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

        let socket: ReturnType<typeof io> | null = null;

        const fetchData = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

                const json = await res.json();

                const activities: Activity[] = json.data.activities.map((a: ApiActivity) => ({
                    ...a,
                    timeAgo: formatTimeAgo(a.time),
                }));

                setStats({
                    ...json.data,
                    beritas: { ...json.data.beritas },
                    users: { ...json.data.users },
                    activities,
                });
            } catch (err: unknown) {
                console.error("Failed to fetch dashboard data:", err);
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        socket = io(process.env.NEXT_PUBLIC_API_URL as string, { auth: { token } });

        socket.on("dashboard:update", (newStats: DashboardStats) => {
            const activities: Activity[] = newStats.activities.map((a: Activity) => ({
                ...a,
                timeAgo: formatTimeAgo(a.time),
            }));
            setStats({ ...newStats, activities });
        });

        return () => {
            socket?.disconnect();
        };
    }, [token]);

    return { stats, loading, error };
}