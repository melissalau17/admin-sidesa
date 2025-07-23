import { useEffect, useState } from "react";
import axios from "axios";

interface DashboardStats {
    users: number;
    permohonans: number;
    newPermohonans: number;
    laporans: number;
    newLaporans: number;
    beritas: number;
    newBeritas: number;
}

export function useDashboardStats(token: string | null) {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                console.warn("No token found.");
                setLoading(false);
                return;
            }

            try {
                const [users, permohonans, laporans, beritas] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/letters`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reports`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/beritas`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                // optional helper function
                const countNew = (data: any[], key = "status", val = "baru") =>
                    Array.isArray(data) ? data.filter((item) => item[key] === val).length : 0;

                setStats({
                    users: users.data.length,
                    permohonans: permohonans.data.length,
                    newPermohonans: countNew(permohonans.data),
                    laporans: laporans.data.length,
                    newLaporans: countNew(laporans.data),
                    beritas: beritas.data.length,
                    newBeritas: countNew(beritas.data, "createdAt", ""), // replace with actual logic
                });
            } catch (err) {
                console.error("Gagal memuat statistik dashboard:", err);
                setStats(null);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return { stats, loading };
}
