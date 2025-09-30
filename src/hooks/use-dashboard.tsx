import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

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
  beritas: number;
  newBeritas: number;
  users: number;
  newUsers: number;
  activities: Activity[];
}

function formatTimeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
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

    let socket: Socket | null = null;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/dashboard`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }

        const json = await res.json();

        // transform activities to add timeAgo
        const activities = json.data.activities.map((a: { type: string; title: string; time: string }) => ({
          ...a,
          timeAgo: formatTimeAgo(a.time),
        }));

        setStats({ ...json.data, activities });
      } catch (err: unknown) {
        console.error("Failed to fetch dashboard data:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    };

    socket = io(process.env.NEXT_PUBLIC_API_URL as string, {
      auth: { token },
    });

    socket.on("dashboard:update", (newStats: DashboardStats) => {
      setStats(newStats);
    });

    return () => {
      if (socket) socket.disconnect();
    };

    fetchData();
  }, [token]);

  return { stats, loading, error };
}
