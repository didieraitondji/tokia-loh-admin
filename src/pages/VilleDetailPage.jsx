import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
    ArrowLeft, Pencil, ShoppingCart,
    CheckCircle, Clock, TrendingUp, MapPin
} from 'lucide-react';
import Button from '../components/Button';
import ProductStatusToggle from '../components/products/ProductStatusToggle';
import StatCard from '../components/dashboard/StatCard';
import OrdersTable from '../components/orders/OrdersTable';
import VilleFormModal from '../components/villes/VilleFormModal';
import { MOCK_VILLES } from '../components/villes/VillesTable';
import { MOCK_ORDERS } from '../components/orders/OrdersTable';

const formatPrice = (p) => `${Number(p).toLocaleString('fr-FR')} F`;

// Avatar grand format
const VilleAvatarLarge = ({ name }) => (
    <div className="w-16 h-16 rounded-[14px] bg-secondary-1 flex items-center justify-center shrink-0 shadow-md">
        <span className="text-xl font-bold font-poppins text-white uppercase">
            {name.slice(0, 2)}
        </span>
    </div>
);

const VilleDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ville, setVille] = useState(null);
    const [orders, setOrders] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        // TODO : remplacer par appel API GET /villes/:id
        const found = MOCK_VILLES.find(v => v.id === Number(id));
        if (!found) { navigate('/villes'); return; }
        setVille(found);
        document.title = `Admin Tokia-Loh | ${found.name}`;

        // TODO : remplacer par appel API GET /orders?city=found.name
        const cityOrders = MOCK_ORDERS.filter(o => o.client.city === found.name);
        setOrders(cityOrders);
    }, [id]);

    // Stats calculées dynamiquement depuis les commandes réelles
    const stats = useMemo(() => {
        if (!ville) return {};
        const livrees = orders.filter(o => o.status === 'Livrée').length;
        const enCours = orders.filter(o => ['En attente', 'Confirmée', 'En préparation', 'En livraison'].includes(o.status)).length;
        const caFrais = orders.filter(o => o.status === 'Livrée').length * ville.fee;
        return { livrees, enCours, caFrais };
    }, [orders, ville]);

    if (!ville) return null;

    const handleToggleStatus = () => {
        setVille(prev => ({ ...prev, active: !prev.active }));
        // TODO : appel API PATCH /villes/:id/status
    };

    const handleSave = (formData) => {
        setVille(prev => ({ ...prev, ...formData }));
        // TODO : appel API PATCH /villes/:id
    };

    return (
        <div className="flex flex-col gap-6">

            {/* ── En-tête navigation ── */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/villes')}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-3 dark:hover:bg-neutral-3 text-neutral-6 hover:text-neutral-8 transition-colors cursor-pointer"
                        title="Retour aux villes"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <div>
                        <h1 className="text-h5 font-bold font-poppins text-neutral-8 dark:text-neutral-8">
                            {ville.name}
                        </h1>
                        <p className="text-xs font-poppins text-neutral-6 mt-0.5">
                            Détail de la ville
                        </p>
                    </div>
                </div>

                <Button
                    variant="primary"
                    size="normal"
                    icon={<Pencil size={14} />}
                    iconPosition="left"
                    onClick={() => setModalOpen(true)}
                >
                    Modifier la ville
                </Button>
            </div>

            {/* ── Fiche ville ── */}
            <div className="
                bg-neutral-0 dark:bg-neutral-0
                border border-neutral-4 dark:border-neutral-4
                rounded-md p-5
                flex flex-col sm:flex-row items-start gap-5
            ">
                <VilleAvatarLarge name={ville.name} />

                <div className="flex-1 flex flex-col gap-4 min-w-0">
                    {/* Nom + badge frais */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-base font-bold font-poppins text-neutral-8 dark:text-neutral-8">
                            {ville.name}
                        </h2>
                        {ville.fee === 0 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-success-2 text-success-1 font-semibold text-[11px] font-poppins">
                                Livraison gratuite
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary-5 text-primary-1 font-semibold text-[11px] font-poppins">
                                {formatPrice(ville.fee)} / livraison
                            </span>
                        )}
                    </div>

                    {/* Infos */}
                    <div className="flex items-center gap-5 flex-wrap">
                        <div className="flex items-center gap-1.5 text-xs font-poppins text-neutral-6">
                            <MapPin size={12} className="text-secondary-1" />
                            Zone de livraison active
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-poppins text-neutral-6">
                            <ShoppingCart size={12} className="text-primary-1" />
                            <span className="font-semibold text-neutral-8 dark:text-neutral-8">{ville.orders}</span>
                            &nbsp;commande{ville.orders > 1 ? 's' : ''} au total
                        </div>
                    </div>
                </div>

                {/* Toggle statut */}
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                    <span className="text-[11px] font-poppins text-neutral-5">Livraison active</span>
                    <ProductStatusToggle
                        active={ville.active}
                        onChange={handleToggleStatus}
                    />
                </div>
            </div>

            {/* ── StatCards ── */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    title="Total commandes"
                    value={String(orders.length)}
                    icon={<ShoppingCart size={18} />}
                    color="primary"
                />
                <StatCard
                    title="Livrées"
                    value={String(stats.livrees)}
                    icon={<CheckCircle size={18} />}
                    color="success"
                    trend={stats.livrees > 0 ? 'up' : 'neutral'}
                    trendLabel={orders.length > 0 ? `${Math.round((stats.livrees / orders.length) * 100)}%` : '0%'}
                />
                <StatCard
                    title="En cours"
                    value={String(stats.enCours)}
                    icon={<Clock size={18} />}
                    color="warning"
                />
                <StatCard
                    title="CA frais livraison"
                    value={ville.fee === 0 ? 'Gratuit' : formatPrice(stats.caFrais)}
                    icon={<TrendingUp size={18} />}
                    color="secondary"
                />
            </div>

            {/* ── Commandes de la ville avec OrdersTable ── */}
            <div className="flex flex-col gap-3">
                <div>
                    <p className="text-sm font-bold font-poppins text-neutral-8 dark:text-neutral-8">
                        Commandes livrées à {ville.name}
                    </p>
                    <p className="text-[11px] font-poppins text-neutral-5 mt-0.5">
                        {orders.length} commande{orders.length > 1 ? 's' : ''} pour cette ville
                    </p>
                </div>

                {orders.length === 0 ? (
                    <div className="
                        bg-neutral-0 dark:bg-neutral-0
                        border border-neutral-4 dark:border-neutral-4
                        rounded-md flex flex-col items-center gap-2 py-12 text-neutral-5
                    ">
                        <ShoppingCart size={32} />
                        <p className="text-xs font-poppins">Aucune commande pour {ville.name}</p>
                    </div>
                ) : (
                    /* OrdersTable réutilisé — onglets statut + recherche + navigation /orders/:id inclus */
                    <OrdersTable orders={orders} />
                )}
            </div>

            {/* ── Modal modification ── */}
            <VilleFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                ville={ville}
                onSave={handleSave}
            />
        </div>
    );
};

export default VilleDetailPage;