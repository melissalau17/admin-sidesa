import { useEffect, useState } from "react";

interface DashboardStats {
  permohonans: number;
  newPermohonans: number;
  laporans: number;
  newLaporans: number;
  beritas: number;
  newBeritas: number;
  users: number;
  newUsers: number;
  activities: {
    type: "permohonan" | "laporan" | "berita" | string;
    title: string;
    timeAgo: string;
  }[];
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
        setStats(json.data);
      } catch (err: any) {
        console.error("Failed to fetch dashboard data:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return { stats, loading, error };
}