import { useState, useEffect, useCallback } from "react";
import { dashboardAPI } from "../api/dashboard.api";

const USE_MOCK = true; // 🔧 Passer à false quand l'API est prête

// ── Mock orders ───────────────────────────────────────────────
const MOCK_ORDERS = [
  {
    id: "ord-1042",
    date: "2025-06-23T09:12:00Z",
    client: {
      id: "client-001",
      firstName: "Aminata",
      lastName: "Koné",
      phone: "+225 07 00 11 22",
      city: "Abidjan",
      address: "Cocody, Rue des Jardins",
      latitude: 5.36,
      longitude: -4.0083,
    },
    items: [
      { name: "Robe Ankara Wax", quantity: 1, unitPrice: 15000 },
      { name: "Bracelet perles coco", quantity: 2, unitPrice: 3500 },
    ],
    note: "Merci de livrer après 17h svp.",
    delivery_fee: 1000,
    status: "pending",
  },
  {
    id: "ord-1041",
    date: "2025-06-23T08:47:00Z",
    client: {
      id: "client-002",
      firstName: "Kouadio",
      lastName: "Hervé",
      phone: "+225 05 44 55 66",
      city: "Bouaké",
      address: "Quartier Commerce",
      latitude: 7.6881,
      longitude: -5.0319,
    },
    items: [{ name: "Sandales tressées", quantity: 1, unitPrice: 8000 }],
    note: "",
    delivery_fee: 2000,
    status: "shipping",
  },
  {
    id: "ord-1040",
    date: "2025-06-22T17:30:00Z",
    client: {
      id: "client-003",
      firstName: "Fatou",
      lastName: "Diallo",
      phone: "+225 01 22 33 44",
      city: "Abidjan",
      address: "Marcory, Rue 12",
      latitude: 5.3111,
      longitude: -3.9969,
    },
    items: [
      { name: "Chemise bazin brodée", quantity: 1, unitPrice: 18000 },
      { name: "Sac en raphia", quantity: 1, unitPrice: 12000 },
    ],
    note: "Laisser chez le gardien si absent.",
    delivery_fee: 0,
    status: "delivered",
  },
  {
    id: "ord-1039",
    date: "2025-06-22T14:10:00Z",
    client: {
      id: "client-004",
      firstName: "Jean-Pierre",
      lastName: "Aka",
      phone: "+225 07 88 99 00",
      city: "Yamoussoukro",
      address: "Avenue Houphouët-Boigny",
      latitude: 6.8276,
      longitude: -5.2893,
    },
    items: [{ name: "Collier wax multicolor", quantity: 1, unitPrice: 5000 }],
    note: "",
    delivery_fee: 1500,
    status: "confirmed",
  },
  {
    id: "ord-1038",
    date: "2025-06-22T11:05:00Z",
    client: {
      id: "client-005",
      firstName: "Marie",
      lastName: "Bamba",
      phone: "+225 05 66 77 88",
      city: "San-Pédro",
      address: "Centre-ville",
      latitude: 4.7485,
      longitude: -6.6363,
    },
    items: [{ name: "Robe bogolan naturel", quantity: 1, unitPrice: 25000 }],
    note: "Appeler avant de venir.",
    delivery_fee: 2500,
    status: "preparing",
  },
  {
    id: "ord-1037",
    date: "2025-06-21T16:22:00Z",
    client: {
      id: "client-006",
      firstName: "Oumar",
      lastName: "Traoré",
      phone: "+225 01 33 44 55",
      city: "Korhogo",
      address: "Quartier Nord",
      latitude: 9.458,
      longitude: -5.6294,
    },
    items: [{ name: "Bracelet perles coco", quantity: 2, unitPrice: 3500 }],
    note: "",
    delivery_fee: 2000,
    status: "cancelled",
  },
];

/**
 * Normalise une commande reçue de l'API vers le format interne.
 *
 * Champs attendus de l'API :
 *   id, created_at, status, delivery_fee, note
 *   items      : [{ name, quantity, unit_price }]
 *   client     : { id, first_name, last_name, phone, city, address, latitude, longitude }
 */
const normalizeOrder = (raw) => ({
  id: raw.id,
  date: raw.created_at ?? raw.date,
  status: raw.status,
  delivery_fee: raw.delivery_fee ?? 0,
  note: raw.note ?? "",
  items: (raw.items ?? []).map((i) => ({
    name: i.name ?? i.product_name,
    quantity: i.quantity,
    unitPrice: i.unit_price ?? i.unitPrice,
  })),
  client: {
    id: raw.client?.id,
    firstName: raw.client?.first_name ?? raw.client?.firstName,
    lastName: raw.client?.last_name ?? raw.client?.lastName,
    phone: raw.client?.phone,
    city: raw.client?.city,
    address: raw.client?.address,
    latitude: raw.client?.latitude,
    longitude: raw.client?.longitude,
  },
});

/**
 * useOrders — gère la liste et le détail des commandes.
 *
 * Usage liste :
 *   const { orders, loading, error, updateStatus } = useOrders();
 *
 * Usage avec filtres :
 *   const { orders } = useOrders({ status: 'pending', search: 'Koné' });
 *
 * Usage détail :
 *   const { order, loading } = useOrders({ id: 'ord-1042' });
 *
 * Usage historique client :
 *   const { orders } = useOrders({ clientId: 'uuid-xxx' });
 */
export const useOrders = (options = {}) => {
  const {
    id = null,
    clientId = null,
    status,
    search,
    ordering,
    page,
  } = options;

  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Fetch liste ───────────────────────────────────────────
  const fetchAll = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 400));
        let result = [...MOCK_ORDERS];
        if (params.status)
          result = result.filter((o) => o.status === params.status);
        if (params.search) {
          const q = params.search.toLowerCase();
          result = result.filter(
            (o) =>
              `${o.client.firstName} ${o.client.lastName}`
                .toLowerCase()
                .includes(q) || o.id.includes(q),
          );
        }
        setOrders(result);
      } else {
        const { data } = await dashboardAPI.listOrders({
          status: params.status,
          search: params.search,
          ordering: params.ordering ?? "-created_at",
          page: params.page,
        });
        // Pagination Django REST : { results: [...], count, next, previous }
        const list = Array.isArray(data) ? data : (data.results ?? []);
        setOrders(list.map(normalizeOrder));
      }
    } catch (err) {
      setError(err.message ?? "Erreur lors du chargement des commandes");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch détail par id ───────────────────────────────────
  const fetchOne = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 400));
        setOrder(MOCK_ORDERS.find((o) => o.id === orderId) ?? null);
      } else {
        // Pas d'endpoint GET /orders/:id en v2 — on charge toute la liste
        // et on filtre. TODO : simplifier si l'endpoint est ajouté en v3
        const { data } = await dashboardAPI.listOrders();
        const list = Array.isArray(data) ? data : (data.results ?? []);
        const found = list.find((o) => o.id === orderId);
        setOrder(found ? normalizeOrder(found) : null);
      }
    } catch (err) {
      setError(err.message ?? "Erreur lors du chargement de la commande");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch historique d'un client ──────────────────────────
  const fetchClientHistory = useCallback(async (cId) => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 400));
        setOrders(MOCK_ORDERS.filter((o) => o.client.id === cId));
      } else {
        const { data } = await dashboardAPI.getClientOrderHistory(cId);
        const list = Array.isArray(data) ? data : (data.results ?? []);
        setOrders(list.map(normalizeOrder));
      }
    } catch (err) {
      setError(err.message ?? "Erreur chargement historique client");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Déclenchement auto ────────────────────────────────────
  useEffect(() => {
    if (id) fetchOne(id);
    else if (clientId) fetchClientHistory(clientId);
    else fetchAll({ status, search, ordering, page });
  }, [
    id,
    clientId,
    status,
    search,
    ordering,
    page,
    fetchAll,
    fetchOne,
    fetchClientHistory,
  ]);

  // ── Mise à jour statut (optimiste + rollback) ─────────────
  const updateStatus = async (orderId, newStatus) => {
    // Mise à jour locale immédiate
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );
    setOrder((prev) =>
      prev?.id === orderId ? { ...prev, status: newStatus } : prev,
    );

    if (!USE_MOCK) {
      try {
        await dashboardAPI.updateOrderStatus(orderId, newStatus);
      } catch (err) {
        // Rollback en cas d'erreur API
        setError(err.message ?? "Erreur mise à jour statut");
        fetchAll({ status, search, ordering, page });
      }
    }
  };

  return {
    orders,
    order,
    loading,
    error,
    updateStatus,
    fetchClientHistory,
    refetch: id
      ? () => fetchOne(id)
      : clientId
        ? () => fetchClientHistory(clientId)
        : () => fetchAll({ status, search, ordering, page }),
  };
};
