import React, { useState } from 'react';
import {
    ShoppingCart, Clock, CheckCircle, XCircle,
    TrendingUp, Users
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import RecentOrders from '../components/dashboard/RecentOrders';
import LowStockList from '../components/dashboard/LowStockList';
import SalesChart from '../components/dashboard/SalesChart';
import TopCities from '../components/dashboard/TopCities';

// Données mock CA — à remplacer par l'API
const CA_DATA = {
    day: { value: '48 500 F', trend: 'up', trendLabel: '+8% hier' },
    week: { value: '312 000 F', trend: 'up', trendLabel: '+15% sem. passée' },
    month: { value: '1 240 000 F', trend: 'down', trendLabel: '-3% mois passé' },
};

const CA_FILTERS = [
    { key: 'day', label: "Aujourd'hui" },
    { key: 'week', label: 'Cette semaine' },
    { key: 'month', label: 'Ce mois' },
];

const DashboardPage = () => {
    const [caFilter, setCaFilter] = useState('day');
    const ca = CA_DATA[caFilter];

    return (
        <div className="flex flex-col gap-6">

            {/* ── Titre de page ── */}
            <div>
                <h1 className="text-h5 font-bold font-poppins text-neutral-8 dark:text-neutral-8">
                    Dashboard
                </h1>
                <p className="text-xs font-poppins text-neutral-6 dark:text-neutral-6 mt-0.5">
                    Vue globale de l'activité Tokia-Loh
                </p>
            </div>

            {/* ── Cards de stats ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    title="Commandes totales"
                    value="1 042"
                    icon={<ShoppingCart size={18} />}
                    trend="up"
                    trendLabel="+24 ce mois"
                    color="primary"
                />
                <StatCard
                    title="En attente"
                    value="18"
                    icon={<Clock size={18} />}
                    trend="neutral"
                    trendLabel="Stable"
                    color="warning"
                />
                <StatCard
                    title="Livrées"
                    value="976"
                    icon={<CheckCircle size={18} />}
                    trend="up"
                    trendLabel="+12% ce mois"
                    color="success"
                />
                <StatCard
                    title="Annulées"
                    value="48"
                    icon={<XCircle size={18} />}
                    trend="down"
                    trendLabel="-2 cette semaine"
                    color="danger"
                />
            </div>

            {/* ── Graphique + Top villes ── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="xl:col-span-2">
                    <SalesChart />
                </div>
                <div>
                    <TopCities />
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
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold font-poppins text-neutral-6 dark:text-neutral-6 uppercase tracking-wide">
                            Chiffre d'affaires
                        </span>
                        {/* Filtres */}
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

                    {/* Valeur + tendance */}
                    <div className="flex items-end justify-between gap-2">
                        <span className="text-h4 font-bold font-poppins text-neutral-8 dark:text-neutral-8 leading-none">
                            {ca.value}
                        </span>
                        <span className={`flex items-center gap-1 text-xs font-medium font-poppins ${ca.trend === 'up' ? 'text-success-1' :
                            ca.trend === 'down' ? 'text-danger-1' : 'text-neutral-6'
                            }`}>
                            {ca.trendLabel}
                        </span>
                    </div>
                </div>

                {/* Nouveaux clients */}
                <StatCard
                    title="Clients inscrits"
                    value="284"
                    icon={<Users size={18} />}
                    trend="up"
                    trendLabel="+7 cette semaine"
                    color="secondary"
                />
            </div>

            {/* ── Tableau commandes + Ruptures ── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="xl:col-span-2">
                    <RecentOrders />
                </div>
                <div>
                    <LowStockList />
                </div>
            </div>

        </div>
    );
};

export default DashboardPage;