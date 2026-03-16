import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
    ArrowLeft, User, Phone, MapPin, Calendar,
    ShoppingCart, CheckCircle, TrendingUp,
    PauseCircle, Ban, Trash2, Loader2
} from 'lucide-react';
import { useClients } from '../hooks/useClients';
import { useOrders } from '../hooks/useOrders';
import Button from '../components/Button';
import ClientStatusBadge from '../components/clients/ClientStatusBadge';
import StatCard from '../components/dashboard/StatCard';
import OrdersTable from '../components/orders/OrdersTable';

const formatPrice = (p) => `${Number(p).toLocaleString('fr-FR')} F`;

const ClientAvatarLarge = ({ firstName, lastName }) => (
    <div className="w-16 h-16 rounded-full bg-primary-1 flex items-center justify-center shrink-0 shadow-md">
        <span className="text-xl font-bold font-poppins text-white">
            {firstName?.[0]}{lastName?.[0]}
        </span>
    </div>
);

const InfoCard = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 bg-neutral-2 dark:bg-neutral-2 rounded-2 px-3 py-2.5">
        <span className="text-primary-1 shrink-0">{icon}</span>
        <div className="min-w-0">
            <p className="text-[11px] font-poppins text-neutral-6">{label}</p>
            <p className="text-xs font-semibold font-poppins text-neutral-8 dark:text-neutral-8 truncate">{value ?? '—'}</p>
        </div>
    </div>
);

const ClientDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // ── Données client ────────────────────────────────────────
    const { client, loading: clientLoading } = useClients(id);

    // ── Commandes du client via useOrders ─────────────────────
    const { orders, loading: ordersLoading, updateStatus } = useOrders({ clientId: id });

    // ── Redirection si introuvable ────────────────────────────
    React.useEffect(() => {
        if (!clientLoading && !client) navigate('/clients', { replace: true });
    }, [clientLoading, client, navigate]);

    React.useEffect(() => {
        if (client) {
            const fn = client.first_name ?? client.firstName ?? '';
            const ln = client.last_name ?? client.lastName ?? '';
            document.title = `Admin Tokia-Loh | ${fn} ${ln}`;
        }
    }, [client]);

    // ── Stats calculées depuis les vraies commandes ───────────
    const stats = useMemo(() => {
        const total = orders.length;
        const delivered = orders.filter(o => o.status === 'delivered').length;
        const spent = orders.reduce((acc, o) => {
            const sub = (o.items ?? []).reduce((s, i) => s + i.quantity * i.unitPrice, 0);
            return acc + sub + (o.delivery_fee ?? 0);
        }, 0);
        return { total, delivered, spent };
    }, [orders]);

    if (clientLoading) return (
        <div className="flex items-center justify-center h-48">
            <Loader2 size={24} className="animate-spin text-primary-1" />
        </div>
    );

    if (!client) return null;

    // Normalise les champs API snake_case → camelCase
    const firstName = client.first_name ?? client.firstName ?? '';
    const lastName = client.last_name ?? client.lastName ?? '';
    const phone = client.phone ?? '—';
    const city = client.city ?? '—';
    const registeredAt = client.created_at
        ? new Date(client.created_at).toLocaleDateString('fr-FR')
        : (client.registeredAt ?? '—');
    const status = client.is_active === false ? 'Désactivé'
        : client.is_blocked ? 'Bloqué'
            : 'Actif';

    // ── Actions ───────────────────────────────────────────────
    const handleDisable = () => {
        // TODO : appel API POST /accounts/clients/:id/deactivate/
        console.log('Désactiver/réactiver client :', id);
    };

    const handleBlock = () => {
        // TODO : appel API (endpoint à confirmer avec le backend)
        console.log('Bloquer/débloquer client :', id);
    };

    const handleDelete = () => {
        if (!window.confirm(`Supprimer définitivement "${firstName} ${lastName}" ?`)) return;
        // TODO : appel API DELETE /accounts/clients/:id/
        navigate('/clients');
    };

    return (
        <div className="flex flex-col gap-6">

            {/* ── En-tête ── */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-3 dark:hover:bg-neutral-3 text-neutral-6 hover:text-neutral-8 transition-colors cursor-pointer">
                        <ArrowLeft size={16} />
                    </button>
                    <div>
                        <h1 className="text-h5 font-bold font-poppins text-neutral-8 dark:text-neutral-8">
                            {firstName} {lastName}
                        </h1>
                        <p className="text-xs font-poppins text-neutral-6 mt-0.5">Fiche client</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <Button variant={status === 'Désactivé' ? 'outline' : 'ghost'} size="normal" onClick={handleDisable}>
                        <PauseCircle size={14} />
                        {status === 'Désactivé' ? 'Réactiver' : 'Désactiver'}
                    </Button>
                    <Button variant={status === 'Bloqué' ? 'outline' : 'dangerOutline'} size="normal" onClick={handleBlock}>
                        <Ban size={14} />
                        {status === 'Bloqué' ? 'Débloquer' : 'Bloquer'}
                    </Button>
                    <Button variant="danger" size="normal" onClick={handleDelete}>
                        <Trash2 size={14} /> Supprimer
                    </Button>
                </div>
            </div>

            {/* ── Fiche client ── */}
            <div className="bg-neutral-0 dark:bg-neutral-0 border border-neutral-4 dark:border-neutral-4 rounded-3 p-5 flex flex-col sm:flex-row items-start gap-5">
                <ClientAvatarLarge firstName={firstName} lastName={lastName} />
                <div className="flex-1 flex flex-col gap-4 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-base font-bold font-poppins text-neutral-8 dark:text-neutral-8">
                            {firstName} {lastName}
                        </h2>
                        <ClientStatusBadge status={status} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">
                        <InfoCard icon={<User size={14} />} label="Nom complet" value={`${firstName} ${lastName}`} />
                        <InfoCard icon={<Phone size={14} />} label="Téléphone" value={phone} />
                        <InfoCard icon={<MapPin size={14} />} label="Ville" value={city} />
                        <InfoCard icon={<Calendar size={14} />} label="Inscrit le" value={registeredAt} />
                    </div>
                </div>
            </div>

            {/* ── StatCards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                    title="Total commandes"
                    value={ordersLoading ? '…' : String(stats.total)}
                    icon={<ShoppingCart size={18} />}
                    color="primary"
                />
                <StatCard
                    title="Commandes livrées"
                    value={ordersLoading ? '…' : String(stats.delivered)}
                    icon={<CheckCircle size={18} />}
                    color="success"
                    trend={stats.delivered > 0 ? 'up' : 'neutral'}
                    trendLabel={stats.total > 0 ? `${Math.round((stats.delivered / stats.total) * 100)}%` : '0%'}
                />
                <StatCard
                    title="Total dépensé"
                    value={ordersLoading ? '…' : formatPrice(stats.spent)}
                    icon={<TrendingUp size={18} />}
                    color="secondary"
                />
            </div>

            {/* ── Historique commandes ── */}
            <div className="flex flex-col gap-3">
                <div>
                    <p className="text-sm font-bold font-poppins text-neutral-8 dark:text-neutral-8">
                        Historique des commandes
                    </p>
                    <p className="text-[11px] font-poppins text-neutral-5 mt-0.5">
                        {ordersLoading
                            ? '…'
                            : `${stats.total} commande${stats.total > 1 ? 's' : ''} passée${stats.total > 1 ? 's' : ''} par ce client`
                        }
                    </p>
                </div>

                {!ordersLoading && stats.total === 0 ? (
                    <div className="bg-neutral-0 dark:bg-neutral-0 border border-neutral-4 dark:border-neutral-4 rounded-3 flex flex-col items-center gap-2 py-12 text-neutral-5">
                        <ShoppingCart size={32} />
                        <p className="text-xs font-poppins">Aucune commande pour ce client</p>
                    </div>
                ) : (
                    <OrdersTable
                        orders={orders}
                        loading={ordersLoading}
                        onStatusChange={updateStatus}
                    />
                )}
            </div>
        </div>
    );
};

export default ClientDetailPage;