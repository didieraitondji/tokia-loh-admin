import React from 'react';
import { ShoppingCart, UserPlus, AlertTriangle, XCircle } from 'lucide-react';

export const NOTIF_TYPE_CONFIG = {
    'Commande': { color: 'bg-primary-5 text-primary-1', icon: <ShoppingCart size={11} /> },
    'Client': { color: 'bg-secondary-5 text-secondary-1', icon: <UserPlus size={11} /> },
    'Stock': { color: 'bg-warning-2 text-warning-1', icon: <AlertTriangle size={11} /> },
    'Annulation': { color: 'bg-danger-2 text-danger-1', icon: <XCircle size={11} /> },
};

const NotificationsBadge = ({ type }) => {
    const config = NOTIF_TYPE_CONFIG[type];
    if (!config) return null;

    return (
        <span className={`
            inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full
            text-[11px] font-semibold font-poppins whitespace-nowrap
            ${config.color}
        `}>
            {config.icon}
            {type}
        </span>
    );
};

export default NotificationsBadge;