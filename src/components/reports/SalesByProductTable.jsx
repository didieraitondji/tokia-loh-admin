import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const formatPrice = (p) => `${Number(p).toLocaleString('fr-FR')} F`;

// Données mock par période — à remplacer par l'API
const DATA = {
    day: [
        { rank: 1, name: 'Robe Ankara Wax', category: 'Robes', qty: 3, ca: 45000, trend: 'up' },
        { rank: 2, name: 'Chemise bazin brodée', category: 'Chemises', qty: 1, ca: 18000, trend: 'neutral' },
        { rank: 3, name: 'Sac en raphia naturel', category: 'Sacs', qty: 2, ca: 24000, trend: 'up' },
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

const RANK_STYLES = [
    'bg-warning-2 text-warning-1',
    'bg-neutral-3 text-neutral-6',
    'bg-neutral-2 text-neutral-5',
];

const TrendIcon = ({ trend }) => {
    if (trend === 'up') return <TrendingUp size={13} className="text-success-1" />;
    if (trend === 'down') return <TrendingDown size={13} className="text-danger-1" />;
    return <Minus size={13} className="text-neutral-5" />;
};

// Avatar produit
const ProductAvatar = ({ name }) => (
    <div className="w-8 h-8 rounded-1.5 bg-secondary-5 flex items-center justify-center shrink-0">
        <span className="text-[10px] font-bold font-poppins text-secondary-1 uppercase">
            {name.slice(0, 2)}
        </span>
    </div>
);

const SalesByProductTable = ({ period = 'month' }) => {
    const data = DATA[period] ?? DATA.month;

    return (
        <div className="
            bg-neutral-0 dark:bg-neutral-0
            border border-neutral-4 dark:border-neutral-4
            rounded-3 overflow-hidden
        ">
            {/* Header */}
            <div className="px-5 py-4 border-b border-neutral-4 dark:border-neutral-4">
                <h2 className="text-sm font-semibold font-poppins text-neutral-8 dark:text-neutral-8">
                    Top produits vendus
                </h2>
            </div>

            {/* Tableau */}
            <div className="overflow-x-auto">
                <table className="w-full text-xs font-poppins">
                    <thead>
                        <tr className="bg-neutral-2 dark:bg-neutral-2 border-b border-neutral-4 dark:border-neutral-4">
                            {['#', 'Produit', 'Catégorie', 'Qté vendue', 'CA généré', 'Tendance'].map(col => (
                                <th key={col} className="text-left px-5 py-3 text-neutral-6 dark:text-neutral-6 font-semibold uppercase tracking-wide whitespace-nowrap">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row) => (
                            <tr
                                key={row.rank}
                                className="border-b border-neutral-4 dark:border-neutral-4 last:border-0 hover:bg-neutral-2 dark:hover:bg-neutral-2 transition-colors"
                            >
                                {/* Rang */}
                                <td className="px-5 py-3">
                                    <span className={`
                                        inline-flex items-center justify-center w-6 h-6 rounded-full
                                        text-[11px] font-bold font-poppins
                                        ${RANK_STYLES[row.rank - 1] ?? 'bg-neutral-2 text-neutral-5'}
                                    `}>
                                        {row.rank}
                                    </span>
                                </td>

                                {/* Produit */}
                                <td className="px-5 py-3">
                                    <div className="flex items-center gap-2.5">
                                        <ProductAvatar name={row.name} />
                                        <span className="font-medium text-neutral-8 dark:text-neutral-8 whitespace-nowrap">
                                            {row.name}
                                        </span>
                                    </div>
                                </td>

                                {/* Catégorie */}
                                <td className="px-5 py-3 text-neutral-6 dark:text-neutral-6 whitespace-nowrap">
                                    {row.category}
                                </td>

                                {/* Quantité */}
                                <td className="px-5 py-3 font-semibold text-neutral-8 dark:text-neutral-8">
                                    {row.qty} unités
                                </td>

                                {/* CA */}
                                <td className="px-5 py-3 font-semibold text-primary-1 whitespace-nowrap">
                                    {formatPrice(row.ca)}
                                </td>

                                {/* Tendance */}
                                <td className="px-5 py-3">
                                    <TrendIcon trend={row.trend} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesByProductTable;