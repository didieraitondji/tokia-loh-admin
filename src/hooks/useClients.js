import { useState, useEffect, useCallback } from "react";
import { clientsAPI } from "../api/client.api";

export const useClients = (id = null) => {
  const [clients, setClients] = useState([]);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await clientsAPI.list();
      // Django REST retourne { count, next, previous, results: [...] }
      setClients(Array.isArray(data) ? data : (data.results ?? []));
    } catch (err) {
      setError(err.message ?? "Erreur lors du chargement des clients");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOne = useCallback(async (clientId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await clientsAPI.detail(clientId);
      setClient(data);
    } catch (err) {
      setError(err.message ?? "Erreur lors du chargement du client");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) fetchOne(id);
    else fetchAll();
  }, [id, fetchAll, fetchOne]);

  const verify = async (clientId) => {
    const { data } = await clientsAPI.verify(clientId);
    return data;
  };

  const deactivate = async (clientId) => {
    const { data } = await clientsAPI.deactivate(clientId);
    // Mettre à jour la liste locale
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, is_active: false } : c)),
    );
    if (client?.id === clientId) {
      setClient((prev) => ({ ...prev, is_active: false }));
    }
    return data;
  };

  return {
    clients,
    client,
    loading,
    error,
    verify,
    deactivate,
    refetch: id ? () => fetchOne(id) : fetchAll,
  };
};
