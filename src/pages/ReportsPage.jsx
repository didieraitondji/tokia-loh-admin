import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingCart, Package, BarChart2 } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import SalesChart from '../components/dashboard/SalesChart';
import ReportFilters from '../components/reports/ReportFilters';
import SalesByCategoryChart from '../components/reports/SalesByCategoryChart';
import SalesByProductTable from '../components/reports/SalesByProductTable';
import ReportExporter from '../components/reports/ReportExporter';

// Données mock résumées par période — à remplacer par l'API
const SUMMARY = {
    day: { ca: '120 500 F', orders: 8, products: 13, growth: '+8%' },
    week: { ca: '642 000 F', orders: 47, products: 89, growth: '+15%' },
    month: { ca: '2 580 000 F', orders: 189, products: 340, growth: '+22%' },
};

// Mock données pour l'export — normalement passées depuis l'état
const MOCK_PRODUCTS_DATA = {
    day: [
        { rank: 1, name: 'Robe Ankara Wax', category: 'Robes', qty: 3, ca: 45000, trend: 'up' },
        { rank: 2, name: 'Sac en raphia naturel', category: 'Sacs', qty: 2, ca: 24000, trend: 'up' },
        { rank: 3, name: 'Chemise bazin brodée', category: 'Chemises', qty: 1, ca: 18000, trend: 'neutral' },
        { rank: 4, name: 'Sandales tressées', category: 'Chaussures', qty: 2, ca: 16000, trend: 'down' },
        { rank: 5, name: 'Bracelet perles coco', category: 'Bijoux', qty: 3, ca: 10500, trend: 'up' },
    ],
    week: [
        { rank: 1, name: 'Robe Ankara Wax', category: 'Robes', qty: 15, ca: 225000, trend: 'up' },
        { rank: 2, name: 'Sac en raphia naturel', category: 'Sacs', qty: 12, ca: 144000, trend: 'up' },
        { rank: 3, name: 'Sandales tressées', category: 'Chaussures', qty: 12, ca: 96000, trend: 'neutral' },
        { rank: 4, name: 'Chemise bazin brodée', category: 'Chemises', qty: 5, ca: 90000, trend: 'down' },
        { rank: 5, name: 'Bracelet perles coco', category: 'Bijoux', qty: 15, ca: 52500, trend: 'up' },
    ],
    month: [
        { rank: 1, name: 'Robe Ankara Wax', category: 'Robes', qty: 60, ca: 900000, trend: 'up' },
        { rank: 2, name: 'Sac en raphia naturel', category: 'Sacs', qty: 48, ca: 576000, trend: 'up' },
        { rank: 3, name: 'Sandales tressées', category: 'Chaussures', qty: 48, ca: 384000, trend: 'down' },
        { rank: 4, name: 'Chemise bazin brodée', category: 'Chemises', qty: 20, ca: 360000, trend: 'neutral' },
        { rank: 5, name: 'Bracelet perles coco', category: 'Bijoux', qty: 60, ca: 210000, trend: 'up' },
    ],
};

const MOCK_CATEGORIES_DATA = {
    day: [
        { category: 'Robes', ca: 45000, orders: 3 },
        { category: 'Sacs', ca: 24000, orders: 2 },
        { category: 'Chaussures', ca: 16000, orders: 2 },
        { category: 'Bijoux', ca: 10500, orders: 3 },
        { category: 'Chemises', ca: 18000, orders: 1 },
        { category: 'Accessoires', ca: 7000, orders: 2 },
    ],
    week: [
        { category: 'Robes', ca: 225000, orders: 15 },
        { category: 'Sacs', ca: 144000, orders: 12 },
        { category: 'Chaussures', ca: 96000, orders: 12 },
        { category: 'Bijoux', ca: 52500, orders: 15 },
        { category: 'Chemises', ca: 90000, orders: 5 },
        { category: 'Accessoires', ca: 35000, orders: 10 },
    ],
    month: [
        { category: 'Robes', ca: 900000, orders: 60 },
        { category: 'Sacs', ca: 576000, orders: 48 },
        { category: 'Chaussures', ca: 384000, orders: 48 },
        { category: 'Bijoux', ca: 210000, orders: 60 },
        { category: 'Chemises', ca: 360000, orders: 20 },
        { category: 'Accessoires', ca: 140000, orders: 40 },
    ],
};

// Dates par défaut
const today = new Date().toISOString().slice(0, 10);
const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);

const ReportsPage = () => {
    const [period, setPeriod] = useState('month');
    const [dateFrom, setDateFrom] = useState(weekAgo);
    const [dateTo, setDateTo] = useState(today);

    useEffect(() => {
        document.title = 'Admin Tokia-Loh | Rapports';
    }, []);

    const summary = SUMMARY[period];
    const productsData = MOCK_PRODUCTS_DATA[period];
    const categoriesData = MOCK_CATEGORIES_DATA[period];

    return (
        <div className="flex flex-col gap-6">

            {/* ── En-tête ── */}
            <div>
                <h1 className="text-h5 font-bold font-poppins text-neutral-8 dark:text-neutral-8">
                    Rapports & Analytiques
                </h1>
                <p className="text-xs font-poppins text-neutral-6 dark:text-neutral-6 mt-0.5">
                    Analysez les performances de Tokia-Loh
                </p>
            </div>

            {/* ── Filtre période ── */}
            <ReportFilters
                period={period}
                onPeriodChange={setPeriod}
                dateFrom={dateFrom}
                dateTo={dateTo}
                onDateChange={({ from, to }) => { setDateFrom(from); setDateTo(to); }}
            />

            {/* ── Stats résumées ── */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    title="CA de la période"
                    value={summary.ca}
                    icon={<TrendingUp size={18} />}
                    trend="up"
                    trendLabel={summary.growth}
                    color="primary"
                />
                <StatCard
                    title="Commandes"
                    value={String(summary.orders)}
                    icon={<ShoppingCart size={18} />}
                    trend="up"
                    trendLabel="vs période préc."
                    color="secondary"
                />
                <StatCard
                    title="Produits vendus"
                    value={String(summary.products)}
                    icon={<Package size={18} />}
                    color="success"
                />
                <StatCard
                    title="Panier moyen"
                    value={`${Math.round(
                        parseInt(summary.ca.replace(/\s/g, '')) / summary.orders
                    ).toLocaleString('fr-FR')} F`}
                    icon={<BarChart2 size={18} />}
                    color="warning"
                />
            </div>

            {/* ── Graphique ventes (réutilisé depuis dashboard) ── */}
            <SalesChart />

            {/* ── Catégories + Top produits ── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <SalesByCategoryChart period={period} />
                <SalesByProductTable period={period} />
            </div>

            {/* ── Export ── */}
            <ReportExporter
                products={productsData}
                categories={categoriesData}
                period={period}
            />
        </div>
    );
};

export default ReportsPage;