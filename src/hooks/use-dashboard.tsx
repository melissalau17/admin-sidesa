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

function formatTimeAgo(dateString: string): string {
    const time = new Date(dateString).getTime();
    if (isNaN(time)) return "waktu tidak valid";

    const diffMs = Date.now() - time;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) return "baru saja";
    if (diffMinutes < 60) return `${diffMinutes} menit lalu`;

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    if (hours < 24) {
        return minutes === 0
            ? `${hours} jam lalu`
            : `${hours} jam ${minutes} menit lalu`;
    }

    const days = Math.floor(hours / 24);
    const remHours = hours % 24;
    return remHours === 0
        ? `${days} hari lalu`
        : `${days} hari ${remHours} jam lalu`;
}

interface ApiActivity {
    type: string;
    title: string;
    createdAt: string;
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
                    type: a.type,
                    title: a.title,
                    time: a.createdAt,           // store original timestamp
                    timeAgo: formatTimeAgo(a.createdAt), // calculate "x menit lalu"
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

        socket.on("dashboard:update", (newStats: { activities: ApiActivity[] } & Omit<DashboardStats, 'activities'>) => {
            const activities: Activity[] = newStats.activities.map((a: ApiActivity) => ({
                type: a.type,
                title: a.title,
                time: a.createdAt,
                timeAgo: formatTimeAgo(a.createdAt),
            }));
            setStats({ ...newStats, activities });
        });

        return () => {
            socket?.disconnect();
        };
    }, [token]);

    return { stats, loading, error };
}
