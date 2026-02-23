import React, { useState } from 'react';
import { CheckCheck, Trash2 } from 'lucide-react';
import NotificationsBadge, { NOTIF_TYPE_CONFIG } from './NotificationsBadge';
import Button from '../Button';

// Données mock — à remplacer par l'API
const MOCK_NOTIFICATIONS = [
    { id: 1, type: 'Commande', message: 'Nouvelle commande #1042 reçue de Aminata Koné', date: '23/06/2025 09:12', read: false },
    { id: 2, type: 'Client', message: 'Nouveau client inscrit : Kouadio Hervé (Bouaké)', date: '23/06/2025 08:47', read: false },
    { id: 3, type: 'Stock', message: 'Produit "Robe Ankara Wax" en stock faible (2 restants)', date: '22/06/2025 17:30', read: false },
    { id: 4, type: 'Annulation', message: 'Commande #1037 annulée par Oumar Traoré', date: '21/06/2025 16:22', read: true },
    { id: 5, type: 'Commande', message: 'Nouvelle commande #1041 reçue de Kouadio Hervé', date: '23/06/2025 08:47', read: true },
    { id: 6, type: 'Stock', message: 'Produit "Sandales tressées" en rupture de stock', date: '20/06/2025 11:05', read: true },
    { id: 7, type: 'Commande', message: 'Nouvelle commande #1040 reçue de Fatou Diallo', date: '22/06/2025 17:30', read: true },
    { id: 8, type: 'Client', message: 'Nouveau client inscrit : Marie Bamba (San-Pédro)', date: '14/06/2025 09:00', read: true },
];

// Icône du type en grand pour l'avatar
const NotifAvatar = ({ type }) => {
    const config = NOTIF_TYPE_CONFIG[type];
    if (!config) return null;
    return (
        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${config.color}`}>
            {React.cloneElement(config.icon, { size: 15 })}
        </div>
    );
};

const NotificationsList = () => {
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [filter, setFilter] = useState('Toutes');

    const unreadCount = notifications.filter(n => !n.read).length;

    const FILTER_TABS = ['Toutes', 'Non lues', ...Object.keys(NOTIF_TYPE_CONFIG)];

    const filtered = notifications.filter(n => {
        if (filter === 'Non lues') return !n.read;
        if (filter === 'Toutes') return true;
        return n.type === filter;
    });

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        // TODO : appel API
    };

    const markRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        // TODO : appel API
    };

    const deleteNotif = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        // TODO : appel API
    };

    return (
        <div className="flex flex-col gap-4">

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold font-poppins text-neutral-6 uppercase tracking-wide">
                        Historique
                    </span>
                    {unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-danger-2 text-danger-1 text-[10px] font-bold font-poppins">
                            {unreadCount}
                        </span>
                    )}
                </div>
                {unreadCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={<CheckCheck size={13} />}
                        onClick={markAllRead}
                    >
                        Tout marquer comme lu
                    </Button>
                )}
            </div>

            {/* Onglets filtre */}
            <div className="flex items-center gap-0 overflow-x-auto border-b border-neutral-4 dark:border-neutral-4">
                {FILTER_TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`
                            px-4 py-2.5 text-xs font-poppins font-medium whitespace-nowrap
                            border-b-2 transition-all duration-200 cursor-pointer
                            ${filter === tab
                                ? 'border-primary-1 text-primary-1'
                                : 'border-transparent text-neutral-6 hover:text-neutral-8 dark:hover:text-neutral-8'
                            }
                        `}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Liste */}
            <div className="
                bg-neutral-0 dark:bg-neutral-0
                border border-neutral-4 dark:border-neutral-4
                rounded-3 overflow-hidden
            ">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-12 text-neutral-5">
                        <CheckCheck size={32} />
                        <p className="text-xs font-poppins">Aucune notification</p>
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-4 dark:divide-neutral-4">
                        {filtered.map(notif => (
                            <div
                                key={notif.id}
                                className={`
                                    flex items-start gap-3 px-5 py-4
                                    transition-colors duration-150
                                    ${!notif.read ? 'bg-primary-5 dark:bg-primary-5' : 'hover:bg-neutral-2 dark:hover:bg-neutral-2'}
                                `}
                            >
                                {/* Avatar type */}
                                <NotifAvatar type={notif.type} />

                                {/* Contenu */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <NotificationsBadge type={notif.type} />
                                        {!notif.read && (
                                            <span className="w-2 h-2 rounded-full bg-primary-1 shrink-0" />
                                        )}
                                    </div>
                                    <p className={`text-xs font-poppins ${!notif.read ? 'font-semibold text-neutral-8 dark:text-neutral-8' : 'text-neutral-7 dark:text-neutral-7'}`}>
                                        {notif.message}
                                    </p>
                                    <p className="text-[11px] font-poppins text-neutral-5 mt-1">
                                        {notif.date}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1.5 shrink-0">
                                    {!notif.read && (
                                        <button
                                            onClick={() => markRead(notif.id)}
                                            title="Marquer comme lu"
                                            className="w-7 h-7 flex items-center justify-center rounded-1.5 text-neutral-6 hover:bg-primary-5 hover:text-primary-1 transition-colors cursor-pointer"
                                        >
                                            <CheckCheck size={14} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteNotif(notif.id)}
                                        title="Supprimer"
                                        className="w-7 h-7 flex items-center justify-center rounded-1.5 text-neutral-6 hover:bg-danger-2 hover:text-danger-1 transition-colors cursor-pointer"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsList;