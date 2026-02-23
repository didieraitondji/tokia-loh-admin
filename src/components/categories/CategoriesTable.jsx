import React, { useState } from 'react';
import { Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import ProductStatusToggle from '../products/ProductStatusToggle';

// Données mock — à remplacer par l'API
const MOCK_CATEGORIES = [
    { id: 1, name: 'Robes', description: 'Robes et tenues féminines', order: 1, products: 18, active: true },
    { id: 2, name: 'Chaussures', description: 'Sandales, escarpins, baskets', order: 2, products: 12, active: true },
    { id: 3, name: 'Sacs', description: 'Sacs à main et à dos', order: 3, products: 9, active: true },
    { id: 4, name: 'Bijoux', description: 'Colliers, bracelets, bagues', order: 4, products: 21, active: true },
    { id: 5, name: 'Chemises', description: 'Chemises et hauts hommes', order: 5, products: 7, active: false },
    { id: 6, name: 'Accessoires', description: 'Ceintures, foulards...', order: 6, products: 5, active: true },
];

// Avatar lettre pour la catégorie
const CategoryAvatar = ({ name }) => (
    <div className="w-9 h-9 rounded-2 bg-primary-5 flex items-center justify-center shrink-0">
        <span className="text-xs font-bold font-poppins text-primary-1 uppercase">
            {name.slice(0, 2)}
        </span>
    </div>
);

const CategoriesTable = ({ onEdit, onDelete }) => {
    const [categories, setCategories] = useState(
        [...MOCK_CATEGORIES].sort((a, b) => a.order - b.order)
    );

    // Toggle actif/inactif
    const handleToggle = (id) => {
        setCategories(prev =>
            prev.map(c => c.id === id ? { ...c, active: !c.active } : c)
        );
    };

    // Déplacer vers le haut
    const moveUp = (index) => {
        if (index === 0) return;
        const updated = [...categories];
        [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
        // Recalcule les ordres
        setCategories(updated.map((c, i) => ({ ...c, order: i + 1 })));
    };

    // Déplacer vers le bas
    const moveDown = (index) => {
        if (index === categories.length - 1) return;
        const updated = [...categories];
        [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
        setCategories(updated.map((c, i) => ({ ...c, order: i + 1 })));
    };

    return (
        <div className="
            bg-neutral-0 dark:bg-neutral-0
            border border-neutral-4 dark:border-neutral-4
            rounded-3 overflow-hidden
        ">
            <div className="overflow-x-auto">
                <table className="w-full text-xs font-poppins">
                    <thead>
                        <tr className="bg-neutral-2 dark:bg-neutral-2 border-b border-neutral-4 dark:border-neutral-4">
                            {['Ordre', 'Catégorie', 'Description', 'Produits', 'Statut', 'Actions'].map(col => (
                                <th key={col} className="text-left px-5 py-3 text-neutral-6 dark:text-neutral-6 font-semibold uppercase tracking-wide whitespace-nowrap">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat, index) => (
                            <tr
                                key={cat.id}
                                className="border-b border-neutral-4 dark:border-neutral-4 last:border-0 hover:bg-neutral-2 dark:hover:bg-neutral-2 transition-colors duration-150"
                            >
                                {/* Ordre + boutons ▲▼ */}
                                <td className="px-5 py-3">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-6 text-center font-bold text-neutral-5 dark:text-neutral-6">
                                            {cat.order}
                                        </span>
                                        <div className="flex flex-col gap-0.5">
                                            <button
                                                onClick={() => moveUp(index)}
                                                disabled={index === 0}
                                                className="w-5 h-5 flex items-center justify-center rounded text-neutral-5 hover:text-primary-1 hover:bg-primary-5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                            >
                                                <ChevronUp size={12} />
                                            </button>
                                            <button
                                                onClick={() => moveDown(index)}
                                                disabled={index === categories.length - 1}
                                                className="w-5 h-5 flex items-center justify-center rounded text-neutral-5 hover:text-primary-1 hover:bg-primary-5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                            >
                                                <ChevronDown size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </td>

                                {/* Nom */}
                                <td className="px-5 py-3">
                                    <div className="flex items-center gap-3">
                                        <CategoryAvatar name={cat.name} />
                                        <span className="font-semibold text-neutral-8 dark:text-neutral-8">
                                            {cat.name}
                                        </span>
                                    </div>
                                </td>

                                {/* Description */}
                                <td className="px-5 py-3 text-neutral-6 dark:text-neutral-6 max-w-55 truncate">
                                    {cat.description || '—'}
                                </td>

                                {/* Nb produits */}
                                <td className="px-5 py-3">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary-5 text-primary-1 font-semibold text-[11px]">
                                        {cat.products} produit{cat.products > 1 ? 's' : ''}
                                    </span>
                                </td>

                                {/* Statut */}
                                <td className="px-5 py-3">
                                    <ProductStatusToggle
                                        active={cat.active}
                                        onChange={() => handleToggle(cat.id)}
                                    />
                                </td>

                                {/* Actions */}
                                <td className="px-5 py-3">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onEdit?.(cat)}
                                            className="w-7 h-7 flex items-center justify-center rounded-2 text-neutral-6 hover:bg-primary-5 hover:text-primary-1 transition-colors cursor-pointer"
                                            title="Modifier"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            onClick={() => onDelete?.(cat)}
                                            className="w-7 h-7 flex items-center justify-center rounded-2 text-neutral-6 hover:bg-danger-2 hover:text-danger-1 transition-colors cursor-pointer"
                                            title="Supprimer"
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

export default CategoriesTable;