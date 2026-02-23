import React, { useState, useEffect } from 'react';
import { Bell, Settings } from 'lucide-react';
import NotificationsList from '../components/notifications/NotificationsList';
import NotificationsSettings from '../components/notifications/NotificationsSettings';

const TABS = [
    { key: 'history', label: 'Historique', icon: <Bell size={15} /> },
    { key: 'settings', label: 'Configuration', icon: <Settings size={15} /> },
];

const NotificationsPage = () => {
    const [activeTab, setActiveTab] = useState('history');

    useEffect(() => {
        document.title = 'Admin Tokia-Loh | Notifications';
    }, []);

    return (
        <div className="flex flex-col gap-6">

            {/* ── En-tête ── */}
            <div>
                <h1 className="text-h5 font-bold font-poppins text-neutral-8 dark:text-neutral-8">
                    Notifications
                </h1>
                <p className="text-xs font-poppins text-neutral-6 dark:text-neutral-6 mt-0.5">
                    Historique et configuration de vos alertes
                </p>
            </div>

            {/* ── Onglets ── */}
            <div className="flex items-center gap-1 bg-neutral-3 dark:bg-neutral-3 rounded-full p-1 w-fit">
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`
                            flex items-center gap-2 px-5 py-2 rounded-full
                            text-xs font-semibold font-poppins
                            transition-all duration-200 cursor-pointer
                            ${activeTab === tab.key
                                ? 'bg-neutral-0 dark:bg-neutral-2 text-neutral-8 dark:text-neutral-8 shadow-sm'
                                : 'text-neutral-6 hover:text-neutral-8 dark:hover:text-neutral-8'
                            }
                        `}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Contenu selon l'onglet ── */}
            {activeTab === 'history' && <NotificationsList />}
            {activeTab === 'settings' && <NotificationsSettings />}
        </div>
    );
};

export default NotificationsPage;