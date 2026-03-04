import React, { useState, useEffect } from 'react';
import { ShoppingCart, Clock, CheckCircle, XCircle } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import OrdersTable, { MOCK_ORDERS } from '../components/orders/OrdersTable';
import OrderDetailModal from '../components/orders/OrderDetailModal';

const OrdersPage = () => {
    const [orders, setOrders] = useState(MOCK_ORDERS);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        document.title = 'Admin Tokia-Loh | Commandes';
    }, []);

    const handleView = (order) => {
        setSelectedOrder(order);
        setModalOpen(true);
    };

    const handleClose = () => {
        setModalOpen(false);
        setSelectedOrder(null);
    };

    // Mise à jour du statut depuis la modal
    const handleStatusChange = (orderId, newStatus) => {
        setOrders(prev =>
            prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
        );
        // Mise à jour de la commande sélectionnée aussi
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : prev);
        // TODO : appel API PATCH /orders/:id/status
    };

    // Stats
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'En attente').length;
    const delivered = orders.filter(o => o.status === 'Livrée').length;
    const cancelled = orders.filter(o => o.status === 'Annulée').length;

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
                <StatCard
                    title="Total commandes"
                    value={String(total)}
                    icon={<ShoppingCart size={18} />}
                    color="primary"
                />
                <StatCard
                    title="En attente"
                    value={String(pending)}
                    icon={<Clock size={18} />}
                    color="warning"
                />
                <StatCard
                    title="Livrées"
                    value={String(delivered)}
                    icon={<CheckCircle size={18} />}
                    color="success"
                />
                <StatCard
                    title="Annulées"
                    value={String(cancelled)}
                    icon={<XCircle size={18} />}
                    color="danger"
                />
            </div>

            {/* ── Tableau ── */}
            <OrdersTable
                orders={orders}
                onView={handleView}
                onStatusChange={handleStatusChange}
            />

            {/* ── Modal détail ── */}
            <OrderDetailModal
                open={modalOpen}
                onClose={handleClose}
                order={selectedOrder}
                onStatusChange={handleStatusChange}
            />
        </div>
    );
};

export default OrdersPage;