import React from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router';
import ProductStatusToggle from '../products/ProductStatusToggle';

const formatPrice = (p) => `${Number(p).toLocaleString('fr-FR')} F`;

// Données mock — à remplacer par l'API
export const MOCK_VILLES = [
    { id: 1, name: 'Abidjan', fee: 1000, orders: 312, active: true },
    { id: 2, name: 'Bouaké', fee: 2000, orders: 89, active: true },
    { id: 3, name: 'Yamoussoukro', fee: 1500, orders: 54, active: true },
    { id: 4, name: 'San-Pédro', fee: 2500, orders: 41, active: true },
    { id: 5, name: 'Korhogo', fee: 2000, orders: 28, active: false },
    { id: 6, name: 'Man', fee: 2500, orders: 12, active: true },
    { id: 7, name: 'Daloa', fee: 2000, orders: 9, active: false },
    { id: 8, name: 'Gagnoa', fee: 2000, orders: 7, active: true },
];

const VilleAvatar = ({ name }) => (
    <div className="w-9 h-9 rounded-md bg-secondary-5 flex items-center justify-center shrink-0">
        <span className="text-xs font-bold font-poppins text-secondary-1 uppercase">
            {name.slice(0, 2)}
        </span>
    </div>
);

const VillesTable = ({ onEdit, onDelete, villes, setVilles }) => {
    const navigate = useNavigate();

    const handleToggle = (id) => {
        setVilles(prev => prev.map(v => v.id === id ? { ...v, active: !v.active } : v));
        // TODO : appel API PATCH /villes/:id/status
    };

    return (
        <div className="
            bg-neutral-0 dark:bg-neutral-0
            border border-neutral-4 dark:border-neutral-4
            rounded-md overflow-hidden
        ">
            <div className="overflow-x-auto">
                <table className="w-full text-xs font-poppins">
                    <thead>
                        <tr className="bg-neutral-2 dark:bg-neutral-2 border-b border-neutral-4 dark:border-neutral-4">
                            {['Ville', 'Frais de livraison', 'Commandes', 'Statut', 'Actions'].map(col => (
                                <th key={col} className="text-left px-5 py-3 text-neutral-6 dark:text-neutral-6 font-semibold uppercase tracking-wide whitespace-nowrap">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {villes.map(ville => (
                            <tr
                                key={ville.id}
                                onClick={() => navigate(`/cities/${ville.id}`)}
                                className="border-b border-neutral-4 dark:border-neutral-4 last:border-0 hover:bg-neutral-2 dark:hover:bg-neutral-2 transition-colors duration-150 cursor-pointer"
                            >
                                {/* Ville */}
                                <td className="px-5 py-3">
                                    <div className="flex items-center gap-3">
                                        <VilleAvatar name={ville.name} />
                                        <span className="font-semibold text-neutral-8 dark:text-neutral-8">
                                            {ville.name}
                                        </span>
                                    </div>
                                </td>

                                {/* Frais */}
                                <td className="px-5 py-3">
                                    {ville.fee === 0 ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-success-2 text-success-1 font-semibold text-[11px]">
                                            Gratuit
                                        </span>
                                    ) : (
                                        <span className="font-semibold text-neutral-8 dark:text-neutral-8">
                                            {formatPrice(ville.fee)}
                                        </span>
                                    )}
                                </td>

                                {/* Nb commandes */}
                                <td className="px-5 py-3">
                                    <span className="inline-flex items-center w-max px-2.5 py-1 rounded-full bg-primary-5 text-primary-1 font-semibold text-[11px]">
                                        {ville.orders} commande{ville.orders > 1 ? 's' : ''}
                                    </span>
                                </td>

                                {/* Toggle statut */}
                                <td className="px-5 py-3" onClick={e => e.stopPropagation()}>
                                    <ProductStatusToggle
                                        active={ville.active}
                                        onChange={() => handleToggle(ville.id)}
                                    />
                                </td>

                                {/* Actions */}
                                <td className="px-5 py-3" onClick={e => e.stopPropagation()}>
                                    <div className="flex items-center gap-1.5">

                                        {/* Voir le détail → /villes/:id */}
                                        <button
                                            onClick={() => navigate(`/cities/${ville.id}`)}
                                            title="Voir le détail"
                                            className="w-7 h-7 flex items-center justify-center rounded-md text-neutral-6 hover:bg-secondary-5 hover:text-secondary-1 transition-colors cursor-pointer"
                                        >
                                            <Eye size={14} />
                                        </button>

                                        {/* Modifier */}
                                        <button
                                            onClick={() => onEdit?.(ville)}
                                            title="Modifier"
                                            className="w-7 h-7 flex items-center justify-center rounded-md text-neutral-6 hover:bg-primary-5 hover:text-primary-1 transition-colors cursor-pointer"
                                        >
                                            <Pencil size={14} />
                                        </button>

                                        {/* Supprimer */}
                                        <button
                                            onClick={() => onDelete?.(ville)}
                                            title="Supprimer"
                                            className="w-7 h-7 flex items-center justify-center rounded-md text-neutral-6 hover:bg-danger-2 hover:text-danger-1 transition-colors cursor-pointer"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VillesTable;