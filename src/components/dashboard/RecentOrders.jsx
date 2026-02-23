import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';

// Badge de statut
const STATUS = {
    'En attente': 'bg-warning-2 text-warning-1',
    'Confirmée': 'bg-primary-5 text-primary-1',
    'En préparation': 'bg-secondary-5 text-secondary-1',
    'En livraison': 'bg-primary-4 text-primary-7',
    'Livrée': 'bg-success-2 text-success-1',
    'Annulée': 'bg-danger-2 text-danger-1',
};

const StatusBadge = ({ status }) => (
    <span className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full
        text-[11px] font-semibold font-poppins whitespace-nowrap
        ${STATUS[status] ?? 'bg-neutral-3 text-neutral-6'}
    `}>
        {status}
    </span>
);

// Données mock — à remplacer par l'API
const MOCK_ORDERS = [
    { id: '#1042', client: 'Aminata Koné', ville: 'Abidjan', total: '15 500 F', status: 'En attente', date: '23/06/2025 09:12' },
    { id: '#1041', client: 'Kouadio Hervé', ville: 'Bouaké', total: '8 200 F', status: 'En livraison', date: '23/06/2025 08:47' },
    { id: '#1040', client: 'Fatou Diallo', ville: 'Abidjan', total: '22 000 F', status: 'Livrée', date: '22/06/2025 17:30' },
    { id: '#1039', client: 'Jean-Pierre Aka', ville: 'Yamoussoukro', total: '5 000 F', status: 'Confirmée', date: '22/06/2025 14:10' },
    { id: '#1038', client: 'Marie Bamba', ville: 'San-Pédro', total: '11 750 F', status: 'En préparation', date: '22/06/2025 11:05' },
    { id: '#1037', client: 'Oumar Traoré', ville: 'Korhogo', total: '3 400 F', status: 'Annulée', date: '21/06/2025 16:22' },
];

const RecentOrders = () => {
    const navigate = useNavigate();

    return (
        <div className="
            bg-neutral-0 dark:bg-neutral-0
            border border-neutral-4 dark:border-neutral-4
            rounded-3 overflow-hidden
        ">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-4 dark:border-neutral-4">
                <h2 className="text-sm font-semibold font-poppins text-neutral-8 dark:text-neutral-8">
                    Dernières commandes
                </h2>
                <button
                    onClick={() => navigate('/orders')}
                    className="flex items-center gap-1 text-xs font-poppins text-primary-1 hover:underline cursor-pointer"
                >
                    Voir tout <ArrowRight size={13} />
                </button>
            </div>

            {/* Tableau */}
            <div className="overflow-x-auto">
                <table className="w-full text-xs font-poppins">
                    <thead>
                        <tr className="bg-neutral-2 dark:bg-neutral-2 border-b border-neutral-4 dark:border-neutral-4">
                            {['N° Commande', 'Client', 'Ville', 'Total', 'Statut', 'Date'].map(col => (
                                <th key={col} className="text-left px-5 py-3 text-neutral-6 dark:text-neutral-6 font-semibold uppercase tracking-wide whitespace-nowrap">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_ORDERS.map((order, i) => (
                            <tr
                                key={order.id}
                                onClick={() => navigate(`/orders/${order.id}`)}
                                className="
                                    border-b border-neutral-4 dark:border-neutral-4 last:border-0
                                    hover:bg-neutral-2 dark:hover:bg-neutral-2
                                    transition-colors duration-150 cursor-pointer
                                "
                            >
                                <td className="px-5 py-3 font-semibold text-primary-1">{order.id}</td>
                                <td className="px-5 py-3 text-neutral-8 dark:text-neutral-8 whitespace-nowrap">{order.client}</td>
                                <td className="px-5 py-3 text-neutral-6 dark:text-neutral-6 whitespace-nowrap">{order.ville}</td>
                                <td className="px-5 py-3 font-semibold text-neutral-8 dark:text-neutral-8 whitespace-nowrap">{order.total}</td>
                                <td className="px-5 py-3"><StatusBadge status={order.status} /></td>
                                <td className="px-5 py-3 text-neutral-6 dark:text-neutral-6 whitespace-nowrap">{order.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentOrders;