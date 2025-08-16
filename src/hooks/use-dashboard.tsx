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

// tipe data dasar untuk respon (bisa kamu refine sesuai schema API)
interface BaseItem {
  status?: string;
  createdAt?: string;
}

export function useDashboardStats(token: string | null) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      console.warn("No token found.");
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [users, permohonans, laporans, beritas] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, { headers }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/letters`, { headers }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reports`, { headers }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/beritas`, { headers }),
        ]);

        const countNew = <T extends BaseItem>(
          data: T[],
          key: keyof T = "status",
          val: string = "baru"
        ) =>
          Array.isArray(data)
            ? data.filter((item) => item[key] === val).length
            : 0;

        setStats({
          users: users.data.length,
          permohonans: permohonans.data.length,
          newPermohonans: countNew(permohonans.data),
          laporans: laporans.data.length,
          newLaporans: countNew(laporans.data),
          beritas: beritas.data.length,
          // ini masih dummy, tergantung logika new beritas kamu
          newBeritas: countNew(beritas.data, "createdAt", ""),
        });
      } catch (err) {
        console.error("Gagal memuat statistik dashboard:", err);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  return { stats, loading };
}