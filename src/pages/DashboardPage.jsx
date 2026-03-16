import React, { useState, useEffect } from 'react';
import {
    ShoppingCart, Clock, CheckCircle, XCircle, Users, TrendingUp
} from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import StatCard from '../components/dashboard/StatCard';
import RecentOrders from '../components/dashboard/RecentOrders';
import LowStockList from '../components/dashboard/LowStockList';
import SalesChart from '../components/dashboard/SalesChart';
import TopCities from '../components/dashboard/TopCities';
import DateRangeFilter from '../components/dashboard/DateRangeFilter';

const CA_FILTERS = [
    { key: 'day', label: "Aujourd'hui" },
    { key: 'week', label: 'Cette semaine' },
    { key: 'month', label: 'Ce mois' },
];

// Formatte un montant en FCFA
const formatCFA = (amount) =>
    amount ? `${Number(amount).toLocaleString('fr-FR')} F` : '— F';

const DashboardPage = () => {
    const { stats, loading, error } = useDashboard();

    const [caFilter, setCaFilter] = useState('day');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        document.title = 'Admin Tokia-Loh | Tableau de bord';
    }, []);

    const handleDateChange = (type, value) => {
        if (type === 'start') setStartDate(value);
        else setEndDate(value);
        setActiveFilter('custom');
    };

    const handleQuickFilter = (filterKey) => {
        setActiveFilter(filterKey);
        const today = new Date();
        const fmt = (d) => d.toISOString().split('T')[0];
        if (filterKey === 'all') { setStartDate(''); setEndDate(''); }
        if (filterKey === 'today') { setStartDate(fmt(today)); setEndDate(fmt(today)); }
        if (filterKey === 'week') {
            const w = new Date(today); w.setDate(today.getDate() - 7);
            setStartDate(fmt(w)); setEndDate(fmt(today));
        }
        if (filterKey === 'month') {
            const m = new Date(today); m.setMonth(today.getMonth() - 1);
            setStartDate(fmt(m)); setEndDate(fmt(today));
        }
        // TODO : passer startDate/endDate à l'API
    };

    // ── Squelette de chargement ───────────────────────────────
    if (loading) return (
        <div className="flex flex-col gap-6 animate-pulse">
            <div className="h-8 w-48 bg-neutral-3 rounded-2" />
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-28 bg-neutral-3 dark:bg-neutral-3 rounded-3" />
                ))}
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="xl:col-span-2 h-72 bg-neutral-3 dark:bg-neutral-3 rounded-3" />
                <div className="h-72 bg-neutral-3 dark:bg-neutral-3 rounded-3" />
            </div>
        </div>
    );

    // ── Erreur ────────────────────────────────────────────────
    if (error) return (
        <div className="flex items-center justify-center h-48">
            <p className="text-sm font-poppins text-danger-1">{error}</p>
        </div>
    );

    return (
        <div className="flex flex-col gap-6">

            {/* ── Header ── */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-h5 font-bold font-poppins text-neutral-8 dark:text-neutral-8">
                        Dashboard
                    </h1>
                    <p className="text-xs font-poppins text-neutral-6 dark:text-neutral-6 mt-0.5">
                        Vue globale de l'activité Tokia-Loh
                    </p>
                </div>
                <DateRangeFilter
                    startDate={startDate}
                    endDate={endDate}
                    activeFilter={activeFilter}
                    onDateChange={handleDateChange}
                    onQuickFilter={handleQuickFilter}
                />
            </div>

            {/* ── StatCards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    title="Commandes totales"
                    value={stats?.total_orders?.toLocaleString('fr-FR') ?? '—'}
                    icon={<ShoppingCart size={18} />}
                    trend="up"
                    trendLabel="+24 ce mois"
                    color="primary"
                />
                <StatCard
                    title="En attente"
                    value={stats?.pending_orders?.toLocaleString('fr-FR') ?? '—'}
                    icon={<Clock size={18} />}
                    trend="neutral"
                    trendLabel="Stable"
                    color="warning"
                />
                <StatCard
                    title="Livrées"
                    value={stats?.delivered_orders?.toLocaleString('fr-FR') ?? '—'}
                    icon={<CheckCircle size={18} />}
                    trend="up"
                    trendLabel="+12% ce mois"
                    color="success"
                />
                <StatCard
                    title="Annulées"
                    value={stats?.cancelled_orders?.toLocaleString('fr-FR') ?? '—'}
                    icon={<XCircle size={18} />}
                    trend="down"
                    trendLabel="-2 cette semaine"
                    color="danger"
                />
            </div>

            {/* ── Graphique + Top villes ── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="xl:col-span-2">
                    <SalesChart data={stats?.sales_chart ?? []} />
                </div>
                <div>
                    <TopCities data={stats?.top_cities ?? []} />
                </div>
            </div>

            {/* ── CA + Clients ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Card CA avec filtre */}
                <div className="
                    bg-neutral-0 dark:bg-neutral-0
                    border border-neutral-4 dark:border-neutral-4
                    rounded-3 p-5 flex flex-col gap-4
                    hover:shadow-md transition-shadow duration-200
                ">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold font-poppins text-neutral-6 dark:text-neutral-6 uppercase tracking-wide">
                            Chiffre d'affaires
                        </span>
                        <div className="flex items-center gap-1 bg-neutral-3 dark:bg-neutral-3 rounded-full p-0.5">
                            {CA_FILTERS.map(f => (
                                <button
                                    key={f.key}
                                    onClick={() => setCaFilter(f.key)}
                                    className={`
                                        px-3 py-1 rounded-full text-[11px] font-semibold font-poppins
                                        transition-all duration-200 cursor-pointer
                                        ${caFilter === f.key
                                            ? 'bg-primary-1 text-neutral-0 shadow-sm'
                                            : 'text-neutral-6 dark:text-neutral-6 hover:text-neutral-8 dark:hover:text-neutral-8'
                                        }
                                    `}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-end justify-between gap-2">
                        {/* TODO : stats?.revenue_by_period[caFilter] quand l'API l'expose */}
                        <span className="text-h4 font-bold font-poppins text-neutral-8 dark:text-neutral-8 leading-none">
                            {formatCFA(stats?.total_revenue)}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-medium font-poppins text-success-1">
                            <TrendingUp size={13} /> En hausse
                        </span>
                    </div>
                </div>

                <StatCard
                    title="Clients inscrits"
                    value={stats?.total_clients?.toLocaleString('fr-FR') ?? '—'}
                    icon={<Users size={18} />}
                    trend="up"
                    trendLabel="+7 cette semaine"
                    color="secondary"
                />
            </div>

            {/* ── Commandes récentes + Ruptures ── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="xl:col-span-2">
                    <RecentOrders orders={stats?.recent_orders ?? []} />
                </div>
                <div>
                    <LowStockList products={stats?.low_stock ?? []} />
                </div>
            </div>

        </div>
    );
};

export default DashboardPage;