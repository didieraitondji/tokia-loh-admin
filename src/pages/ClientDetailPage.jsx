import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
    ArrowLeft, User, Phone, MapPin, Calendar,
    ShoppingCart, CheckCircle, TrendingUp,
    PauseCircle, Ban, Trash2
} from 'lucide-react';
import Button from '../components/Button';
import ClientStatusBadge from '../components/clients/ClientStatusBadge';
import StatCard from '../components/dashboard/StatCard';
import OrdersTable from '../components/orders/OrdersTable';
import { MOCK_CLIENTS } from '../components/clients/ClientsTable';
import { MOCK_ORDERS } from '../components/orders/OrdersTable';

const formatPrice = (p) => `${Number(p).toLocaleString('fr-FR')} F`;

// Avatar grand format
const ClientAvatarLarge = ({ firstName, lastName }) => (
    <div className="w-16 h-16 rounded-full bg-primary-1 flex items-center justify-center shrink-0 shadow-md">
        <span className="text-xl font-bold font-poppins text-white">
            {firstName[0]}{lastName[0]}
        </span>
    </div>
);

const InfoCard = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 bg-neutral-2 dark:bg-neutral-2 rounded-md px-3 py-2.5">
        <span className="text-primary-1 shrink-0">{icon}</span>
        <div className="min-w-0">
            <p className="text-[11px] font-poppins text-neutral-6">{label}</p>
            <p className="text-xs font-semibold font-poppins text-neutral-8 dark:text-neutral-8 truncate">{value}</p>
        </div>
    </div>
);

const ClientDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // TODO : remplacer par appel API GET /clients/:id
        const found = MOCK_CLIENTS.find(c => c.id === Number(id));
        if (!found) { navigate('/clients'); return; }
        setClient(found);
        document.title = `Admin Tokia-Loh | ${found.firstName} ${found.lastName}`;

        // TODO : remplacer par appel API GET /orders?clientId=:id
        // On croise les ids de commandes du client avec MOCK_ORDERS
        const clientOrderIds = found.orders?.map(o => o.id) ?? [];
        const fullOrders = MOCK_ORDERS.filter(o => clientOrderIds.includes(o.id));
        // Pour les commandes non présentes dans MOCK_ORDERS, on construit un objet minimal
        const allOrders = found.orders?.map(clientOrder => {
            const full = fullOrders.find(o => o.id === clientOrder.id);
            return full ?? {
                id: clientOrder.id,
                date: `${clientOrder.date} 00:00`,
                client: { firstName: found.firstName, lastName: found.lastName, phone: found.phone, city: found.city },
                items: Array.from({ length: clientOrder.itemsCount }, (_, i) => ({ name: `Article ${i + 1}`, quantity: 1, unitPrice: Math.round(clientOrder.total / clientOrder.itemsCount) })),
                deliveryFee: 0,
                status: clientOrder.status,
            };
        }) ?? [];
        setOrders(allOrders);
    }, [id]);

    const stats = useMemo(() => ({
        total: orders.length,
        delivered: orders.filter(o => o.status === 'Livrée').length,
        spent: client?.orders?.reduce((acc, o) => acc + o.total, 0) ?? 0,
    }), [orders, client]);

    if (!client) return null;

    // ── Actions ──────────────────────────────────────────────
    const handleDisable = () => {
        const newStatus = client.status === 'Désactivé' ? 'Actif' : 'Désactivé';
        setClient(prev => ({ ...prev, status: newStatus }));
        // TODO : appel API PATCH /clients/:id/status
    };

    const handleBlock = () => {
        const newStatus = client.status === 'Bloqué' ? 'Actif' : 'Bloqué';
        setClient(prev => ({ ...prev, status: newStatus }));
        // TODO : appel API PATCH /clients/:id/status
    };

    const handleDelete = () => {
        if (!window.confirm(`Supprimer définitivement le client "${client.firstName} ${client.lastName}" ?`)) return;
        navigate('/clients');
        // TODO : appel API DELETE /clients/:id
    };

    return (
        <div className="flex flex-col gap-6">

            {/* ── En-tête navigation ── */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-3 dark:hover:bg-neutral-3 text-neutral-6 hover:text-neutral-8 transition-colors cursor-pointer"
                        title="Retour aux clients"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <div>
                        <h1 className="text-h5 font-bold font-poppins text-neutral-8 dark:text-neutral-8">
                            {client.firstName} {client.lastName}
                        </h1>
                        <p className="text-xs font-poppins text-neutral-6 mt-0.5">
                            Fiche client
                        </p>
                    </div>
                </div>

                {/* Boutons actions */}
                <div className="flex items-center gap-2 flex-wrap">
                    <Button
                        variant={client.status === 'Désactivé' ? 'outline' : 'ghost'}
                        size="normal"
                        icon={<PauseCircle size={14} />}
                        onClick={handleDisable}
                    >
                        {client.status === 'Désactivé' ? 'Réactiver' : 'Désactiver'}
                    </Button>
                    <Button
                        variant={client.status === 'Bloqué' ? 'outline' : 'dangerOutline'}
                        size="normal"
                        icon={<Ban size={14} />}
                        onClick={handleBlock}
                    >
                        {client.status === 'Bloqué' ? 'Débloquer' : 'Bloquer'}
                    </Button>
                    <Button
                        variant="danger"
                        size="normal"
                        icon={<Trash2 size={14} />}
                        onClick={handleDelete}
                    >
                        Supprimer
                    </Button>
                </div>
            </div>

            {/* ── Fiche client ── */}
            <div className="
                bg-neutral-0 dark:bg-neutral-0
                border border-neutral-4 dark:border-neutral-4
                rounded-md p-5
                flex flex-col sm:flex-row items-start gap-5
            ">
                <ClientAvatarLarge firstName={client.firstName} lastName={client.lastName} />

                <div className="flex-1 flex flex-col gap-4 min-w-0">
                    {/* Nom + badge statut */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-base font-bold font-poppins text-neutral-8 dark:text-neutral-8">
                            {client.firstName} {client.lastName}
                        </h2>
                        <ClientStatusBadge status={client.status} />
                    </div>

                    {/* Infos en grille */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">
                        <InfoCard icon={<User size={14} />} label="Nom complet" value={`${client.firstName} ${client.lastName}`} />
                        <InfoCard icon={<Phone size={14} />} label="Téléphone" value={client.phone} />
                        <InfoCard icon={<MapPin size={14} />} label="Ville" value={client.city} />
                        <InfoCard icon={<Calendar size={14} />} label="Inscrit le" value={client.registeredAt} />
                    </div>
                </div>
            </div>

            {/* ── StatCards activité ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                    title="Total commandes"
                    value={String(stats.total)}
                    icon={<ShoppingCart size={18} />}
                    color="primary"
                />
                <StatCard
                    title="Commandes livrées"
                    value={String(stats.delivered)}
                    icon={<CheckCircle size={18} />}
                    color="success"
                    trend={stats.delivered > 0 ? 'up' : 'neutral'}
                    trendLabel={stats.total > 0 ? `${Math.round((stats.delivered / stats.total) * 100)}%` : '0%'}
                />
                <StatCard
                    title="Total dépensé"
                    value={formatPrice(stats.spent)}
                    icon={<TrendingUp size={18} />}
                    color="secondary"
                />
            </div>

            {/* ── Historique des commandes avec OrdersTable ── */}
            <div className="flex flex-col gap-3">
                <div>
                    <p className="text-sm font-bold font-poppins text-neutral-8 dark:text-neutral-8">
                        Historique des commandes
                    </p>
                    <p className="text-[11px] font-poppins text-neutral-5 mt-0.5">
                        {orders.length} commande{orders.length > 1 ? 's' : ''} passée{orders.length > 1 ? 's' : ''} par ce client
                    </p>
                </div>

                {orders.length === 0 ? (
                    <div className="
                        bg-neutral-0 dark:bg-neutral-0
                        border border-neutral-4 dark:border-neutral-4
                        rounded-md flex flex-col items-center gap-2 py-12 text-neutral-5
                    ">
                        <ShoppingCart size={32} />
                        <p className="text-xs font-poppins">Aucune commande pour ce client</p>
                    </div>
                ) : (
                    /* OrdersTable réutilisé — navigation vers /orders/:id incluse */
                    <OrdersTable orders={orders} />
                )}
            </div>
        </div>
    );
};

export default ClientDetailPage;