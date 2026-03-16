import { useState, useEffect, useCallback } from "react";
import { dashboardAPI } from "../api/dashboard.api";
import { MOCK_DASHBOARD } from "../mockData";

const USE_MOCK = false; // à Passer à false quand l'API est prête

export const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 400));
        setStats(MOCK_DASHBOARD);
      } else {
        const { data } = await dashboardAPI.get();
        setStats(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { stats, loading, error, refetch: fetch };
};
