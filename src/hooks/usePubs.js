import { useState, useEffect, useCallback } from "react";
import { pubsAPI } from "../api/pubs.api";
import { MOCK_PUBS } from "../mockData";

const USE_MOCK = false; // 🔧 Passer à false quand l'API est prête

export const usePubs = () => {
  const [pubs, setPubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 400));
        setPubs(MOCK_PUBS);
      } else {
        const { data } = await pubsAPI.list();
        setPubs(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const create = async (payload) => {
    if (USE_MOCK) {
      const newItem = {
        ...payload,
        id: `pub-${Date.now()}`,
        is_active: true,
        created_at: new Date().toISOString(),
      };
      setPubs((prev) => [...prev, newItem]);
      return newItem;
    }
    const { data } = await pubsAPI.create(payload);
    setPubs((prev) => [...prev, data]);
    return data;
  };

  const update = async (id, payload) => {
    if (USE_MOCK) {
      setPubs((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...payload } : p)),
      );
      return { ...payload, id };
    }
    const { data } = await pubsAPI.update(id, payload);
    setPubs((prev) => prev.map((p) => (p.id === id ? data : p)));
    return data;
  };

  const remove = async (id) => {
    if (USE_MOCK) {
      setPubs((prev) => prev.filter((p) => p.id !== id));
      return;
    }
    await pubsAPI.delete(id);
    setPubs((prev) => prev.filter((p) => p.id !== id));
  };

  return { pubs, loading, error, create, update, remove, refetch: fetchAll };
};
