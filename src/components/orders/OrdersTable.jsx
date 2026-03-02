import React, { useState, useMemo } from 'react';
import { Search, Eye } from 'lucide-react';
import { useNavigate } from 'react-router';
import OrderStatusBadge, { STATUS_CONFIG } from './OrderStatusBadge';

// Données mock — à remplacer par l'API
export const MOCK_ORDERS = [
    {
        id: '#1042', date: '23/06/2025 09:12',
        client: { firstName: 'Aminata', lastName: 'Koné', phone: '+225 07 00 11 22', city: 'Abidjan', latitude: 6.3654, longitude: 2.4183 },
        items: [
            { name: 'Robe Ankara Wax', quantity: 1, unitPrice: 15000 },
            { name: 'Bracelet perles coco', quantity: 2, unitPrice: 3500 },
        ],
        note: 'Merci de livrer après 17h svp.',
        deliveryFee: 1000,
        status: 'En attente',
    },
    {
        id: '#1041', date: '23/06/2025 08:47',
        client: { firstName: 'Kouadio', lastName: 'Hervé', phone: '+225 05 44 55 66', city: 'Bouaké', latitude: 6.3654, longitude: 2.4183 },
        items: [{ name: 'Sandales tressées', quantity: 1, unitPrice: 8000 }],
        note: '',
        deliveryFee: 2000,
        status: 'En livraison',
    },
    {
        id: '#1040', date: '22/06/2025 17:30',
        client: { firstName: 'Fatou', lastName: 'Diallo', phone: '+225 01 22 33 44', city: 'Abidjan', latitude: 6.3654, longitude: 2.4183 },
        items: [
            { name: 'Chemise bazin brodée', quantity: 1, unitPrice: 18000 },
            { name: 'Sac en raphia', quantity: 1, unitPrice: 12000 },
        ],
        note: 'Laisser chez le gardien si absent.',
        deliveryFee: 0,
        status: 'Livrée',
    },
    {
        id: '#1039', date: '22/06/2025 14:10',
        client: { firstName: 'Jean-Pierre', lastName: 'Aka', phone: '+225 07 88 99 00', city: 'Yamoussoukro', latitude: 6.3654, longitude: 2.4183 },
        items: [{ name: 'Collier wax multicolor', quantity: 1, unitPrice: 5000 }],
        note: '',
        deliveryFee: 1500,
        status: 'Confirmée',
    },
    {
        id: '#1038', date: '22/06/2025 11:05',
        client: { firstName: 'Marie', lastName: 'Bamba', phone: '+225 05 66 77 88', city: 'San-Pédro', latitude: 6.3654, longitude: 2.4183 },
        items: [{ name: 'Robe bogolan naturel', quantity: 1, unitPrice: 25000 }],
        note: 'Appeler avant de venir.',
        deliveryFee: 2500,
        status: 'En préparation',
    },
    {
        id: '#1037', date: '21/06/2025 16:22',
        client: { firstName: 'Oumar', lastName: 'Traoré', phone: '+225 01 33 44 55', city: 'Korhogo', latitude: 6.3654, longitude: 2.4183 },
        items: [{ name: 'Bracelet perles coco', quantity: 2, unitPrice: 3500 }],
        note: '',
        deliveryFee: 2000,
        status: 'Annulée',
    },
];

const STATUS_TABS = ['Toutes', ...Object.keys(STATUS_CONFIG)];
const formatPrice = (p) => `${Number(p).toLocaleString('fr-FR')} F`;
const calcTotal = (order) => {
    const sub = order.items?.reduce((acc, i) => acc + i.quantity * i.unitPrice, 0) ?? 0;
    return sub + (order.deliveryFee ?? 0);
};
// '#1042' → '1042'
const toUrlId = (orderId) => orderId.replace('#', '');

const OrdersTable = ({ orders }) => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('Toutes');

    const filtered = useMemo(() => {
        return orders.filter(o => {
            const matchTab = activeTab === 'Toutes' || o.status === activeTab;
            const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
                `${o.client.firstName} ${o.client.lastName}`.toLowerCase().includes(search.toLowerCase());
            return matchTab && matchSearch;
        });
    }, [orders, search, activeTab]);

    const countByStatus = useMemo(() => {
        const map = { Toutes: orders.length };
        Object.keys(STATUS_CONFIG).forEach(s => {
            map[s] = orders.filter(o => o.status === s).length;
        });
        return map;
    }, [orders]);

    return (
        <div className="
            bg-neutral-0 dark:bg-neutral-0
            border border-neutral-4 dark:border-neutral-4
            rounded-md overflow-hidden
        ">
            {/* ── Recherche ── */}
            <div className="px-5 pt-4 pb-3 border-b border-neutral-4 dark:border-neutral-4">
                <div className="relative max-w-sm">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-6 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Rechercher par N° ou client..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="
                            w-full pl-9 pr-4 py-2 text-xs font-poppins rounded-full
                            bg-neutral-3 dark:bg-neutral-3 border border-transparent
                            text-neutral-8 dark:text-neutral-8 placeholder:text-neutral-6
                            outline-none focus:border-primary-1 focus:bg-neutral-0 dark:focus:bg-neutral-0
                            focus:ring-2 focus:ring-primary-5 transition-all duration-200
                        "
                    />
                </div>
            </div>

            {/* ── Onglets statut ── */}
            <div className="flex items-center overflow-x-auto border-b border-neutral-4 dark:border-neutral-4">
                {STATUS_TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`
                            flex items-center gap-1.5 px-4 py-3 text-xs font-poppins font-medium
                            whitespace-nowrap border-b-2 transition-all duration-200 cursor-pointer
                            ${activeTab === tab
                                ? 'border-primary-1 text-primary-1'
                                : 'border-transparent text-neutral-6 hover:text-neutral-8 dark:hover:text-neutral-8'
                            }
                        `}
                    >
                        {tab}
                        {countByStatus[tab] > 0 && (
                            <span className={`
                                inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold
                                ${activeTab === tab ? 'bg-primary-5 text-primary-1' : 'bg-neutral-3 text-neutral-6'}
                            `}>
                                {countByStatus[tab]}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* ── Tableau ── */}
            <div className="overflow-x-auto">
                <table className="w-full text-xs font-poppins">
                    <thead>
                        <tr className="bg-neutral-2 dark:bg-neutral-2 border-b border-neutral-4 dark:border-neutral-4">
                            {['N° Commande', 'Client', 'Ville', 'Articles', 'Total', 'Statut', 'Date', ''].map(col => (
                                <th key={col} className="text-left px-4 py-3 text-neutral-6 dark:text-neutral-6 font-semibold uppercase tracking-wide whitespace-nowrap">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-4 py-10 text-center text-neutral-6 dark:text-neutral-6">
                                    Aucune commande trouvée
                                </td>
                            </tr>
                        ) : filtered.map(order => (
                            <tr
                                key={order.id}
                                onClick={() => navigate(`/orders/${toUrlId(order.id)}`)}
                                className="border-b border-neutral-4 dark:border-neutral-4 last:border-0 hover:bg-neutral-2 dark:hover:bg-neutral-2 transition-colors duration-150 cursor-pointer"
                            >
                                <td className="px-4 py-3 font-semibold text-primary-1">{order.id}</td>
                                <td className="px-4 py-3 text-neutral-8 dark:text-neutral-8 whitespace-nowrap">
                                    {order.client.firstName} {order.client.lastName}
                                </td>
                                <td className="px-4 py-3 text-neutral-6 dark:text-neutral-6 whitespace-nowrap">
                                    {order.client.city}
                                </td>
                                <td className="px-4 py-3 text-neutral-6 dark:text-neutral-6">
                                    {order.items?.length} article{order.items?.length > 1 ? 's' : ''}
                                </td>
                                <td className="px-4 py-3 font-semibold text-neutral-8 dark:text-neutral-8 whitespace-nowrap">
                                    {formatPrice(calcTotal(order))}
                                </td>
                                <td className="px-4 py-3">
                                    <OrderStatusBadge status={order.status} />
                                </td>
                                <td className="px-4 py-3 text-neutral-6 dark:text-neutral-6 whitespace-nowrap">
                                    {order.date}
                                </td>
                                {/* Bouton œil — stoppe la propagation de la ligne */}
                                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                                    <button
                                        onClick={() => navigate(`/orders/${toUrlId(order.id)}`)}
                                        title="Voir le détail"
                                        className="w-7 h-7 flex items-center justify-center rounded-md text-neutral-6 hover:bg-secondary-5 hover:text-secondary-1 transition-colors cursor-pointer"
                                    >
                                        <Eye size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersTable;