import React, { useEffect, useMemo } from 'react';
import { ShoppingCart, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import StatCard from '../components/dashboard/StatCard';
import OrdersTable from '../components/orders/OrdersTable';

const OrdersPage = () => {
    const { orders, loading, updateStatus } = useOrders();

    useEffect(() => {
        document.title = 'Admin Tokia-Loh | Commandes';
    }, []);

    // ── Stats calculées depuis les vraies données ─────────────
    const stats = useMemo(() => ({
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
    }), [orders]);

    return (
        <div className="flex flex-col gap-6">

            {/* ── En-tête ── */}
            <div>
                <h1 className="text-h5 font-bold font-poppins text-neutral-8 dark:text-neutral-8">
                    Commandes
                </h1>
                <p className="text-xs font-poppins text-neutral-6 dark:text-neutral-6 mt-0.5">
                    Gérez et suivez toutes les commandes
                </p>
            </div>

            {/* ── Stats ── */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard title="Total commandes" value={loading ? '…' : String(stats.total)} icon={<ShoppingCart size={18} />} color="primary" />
                <StatCard title="En attente" value={loading ? '…' : String(stats.pending)} icon={<Clock size={18} />} color="warning" />
                <StatCard title="Livrées" value={loading ? '…' : String(stats.delivered)} icon={<CheckCircle size={18} />} color="success" />
                <StatCard title="Annulées" value={loading ? '…' : String(stats.cancelled)} icon={<XCircle size={18} />} color="danger" />
            </div>

            {/* ── Tableau ── */}
            <OrdersTable
                orders={orders}
                loading={loading}
                onStatusChange={updateStatus}
            />
        </div>
    );
};

export default OrdersPage;