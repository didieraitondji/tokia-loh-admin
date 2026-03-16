import React from 'react';
import { Clock, CheckCircle, Package, Truck, Star, XCircle } from 'lucide-react';

/**
 * STATUS_CONFIG — clés = valeurs API (snake_case)
 * label         = texte affiché en français
 */
export const STATUS_CONFIG = {
    pending: { label: 'En attente', color: 'bg-warning-2 text-warning-1', icon: <Clock size={11} /> },
    confirmed: { label: 'Confirmée', color: 'bg-primary-5 text-primary-1', icon: <CheckCircle size={11} /> },
    preparing: { label: 'En préparation', color: 'bg-secondary-5 text-secondary-1', icon: <Package size={11} /> },
    shipping: { label: 'En livraison', color: 'bg-primary-4 text-primary-7', icon: <Truck size={11} /> },
    delivered: { label: 'Livrée', color: 'bg-success-2 text-success-1', icon: <Star size={11} /> },
    cancelled: { label: 'Annulée', color: 'bg-danger-2 text-danger-1', icon: <XCircle size={11} /> },
};

const OrderStatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status];
    if (!config) return null;
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold font-poppins whitespace-nowrap ${config.color}`}>
            {config.icon}
            {config.label}
        </span>
    );
};

export default OrderStatusBadge;