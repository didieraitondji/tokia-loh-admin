import React, { useState, useMemo } from 'react';
import { Search, Pencil, Trash2, Star, Filter } from 'lucide-react';
import ProductStatusToggle from './ProductStatusToggle';
import ProductBadge from './ProductBadge';

// Données mock — à remplacer par l'API
const MOCK_PRODUCTS = [
    { id: 1, name: 'Robe Ankara Wax', category: 'Robes', price: 15000, salePrice: 11000, stock: 2, active: true, featured: true },
    { id: 2, name: 'Sandales tressées', category: 'Chaussures', price: 8000, salePrice: null, stock: 12, active: true, featured: false },
    { id: 3, name: 'Sac en raphia naturel', category: 'Sacs', price: 12000, salePrice: 9500, stock: 0, active: false, featured: false },
    { id: 4, name: 'Chemise bazin brodée', category: 'Chemises', price: 18000, salePrice: 14000, stock: 3, active: true, featured: true },
    { id: 5, name: 'Bracelet perles coco', category: 'Bijoux', price: 3500, salePrice: null, stock: 25, active: true, featured: false },
    { id: 6, name: 'Collier wax multicolor', category: 'Bijoux', price: 5000, salePrice: 3800, stock: 8, active: true, featured: false },
    { id: 7, name: 'Sac à dos tissu kente', category: 'Sacs', price: 22000, salePrice: null, stock: 5, active: true, featured: false },
    { id: 8, name: 'Robe bogolan naturel', category: 'Robes', price: 25000, salePrice: 20000, stock: 1, active: false, featured: false },
];

const CATEGORIES = ['Toutes', 'Robes', 'Chaussures', 'Sacs', 'Chemises', 'Bijoux', 'Accessoires'];

const formatPrice = (p) => p ? `${p.toLocaleString('fr-FR')} F` : '—';

const calcDiscount = (price, salePrice) => {
    if (!salePrice) return null;
    return Math.round(((price - salePrice) / price) * 100);
};

const getStockBadgeType = (stock) => {
    if (stock === 0) return 'out-of-stock';
    if (stock <= 5) return 'low-stock';
    return null;
};

// Avatar produit sans image
const ProductAvatar = ({ name }) => (
    <div className="w-10 h-10 rounded-2 bg-secondary-5 flex items-center justify-center shrink-0">
        <span className="text-xs font-bold font-poppins text-secondary-1 uppercase">
            {name.slice(0, 2)}
        </span>
    </div>
);

const ProductsTable = ({ onEdit, onDelete, onToggleStatus, onToggleFeatured }) => {
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('Toutes');
    const [stockFilter, setStockFilter] = useState('all');   // all | low | out
    const [statusFilter, setStatusFilter] = useState('all');   // all | active | inactive
    const [products, setProducts] = useState(MOCK_PRODUCTS);

    // Handlers locaux (à brancher sur l'API)
    const handleToggleStatus = (id) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
        onToggleStatus?.(id);
    };

    const handleToggleFeatured = (id) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, featured: !p.featured } : p));
        onToggleFeatured?.(id);
    };

    // Filtrage
    const filtered = useMemo(() => {
        return products.filter(p => {
            const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
            const matchCat = catFilter === 'Toutes' || p.category === catFilter;
            const matchStock = stockFilter === 'all'
                ? true
                : stockFilter === 'out' ? p.stock === 0 : p.stock <= 5 && p.stock > 0;
            const matchStatus = statusFilter === 'all'
                ? true
                : statusFilter === 'active' ? p.active : !p.active;
            return matchSearch && matchCat && matchStock && matchStatus;
        });
    }, [products, search, catFilter, stockFilter, statusFilter]);

    return (
        <div className="
            bg-neutral-0 dark:bg-neutral-0
            border border-neutral-4 dark:border-neutral-4
            rounded-3 overflow-hidden
        ">
            {/* ── Barre de recherche + filtres ── */}
            <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-neutral-4 dark:border-neutral-4">

                {/* Recherche */}
                <div className="relative flex-1 min-w-48">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-6 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Rechercher un produit..."
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

                {/* Filtre catégorie */}
                <select
                    value={catFilter}
                    onChange={e => setCatFilter(e.target.value)}
                    className="
                        px-3 py-2 text-xs font-poppins rounded-full cursor-pointer
                        bg-neutral-3 dark:bg-neutral-3 border border-transparent
                        text-neutral-7 dark:text-neutral-7 outline-none
                        focus:border-primary-1 transition-all duration-200
                    "
                >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>

                {/* Filtre stock */}
                <select
                    value={stockFilter}
                    onChange={e => setStockFilter(e.target.value)}
                    className="
                        px-3 py-2 text-xs font-poppins rounded-full cursor-pointer
                        bg-neutral-3 dark:bg-neutral-3 border border-transparent
                        text-neutral-7 dark:text-neutral-7 outline-none
                        focus:border-primary-1 transition-all duration-200
                    "
                >
                    <option value="all">Tout le stock</option>
                    <option value="low">Stock faible</option>
                    <option value="out">Rupture</option>
                </select>

                {/* Filtre statut */}
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="
                        px-3 py-2 text-xs font-poppins rounded-full cursor-pointer
                        bg-neutral-3 dark:bg-neutral-3 border border-transparent
                        text-neutral-7 dark:text-neutral-7 outline-none
                        focus:border-primary-1 transition-all duration-200
                    "
                >
                    <option value="all">Tous les statuts</option>
                    <option value="active">Actifs</option>
                    <option value="inactive">Inactifs</option>
                </select>

                {/* Compteur résultats */}
                <span className="text-[11px] font-poppins text-neutral-6 whitespace-nowrap ml-auto">
                    {filtered.length} produit{filtered.length > 1 ? 's' : ''}
                </span>
            </div>

            {/* ── Tableau ── */}
            <div className="overflow-x-auto">
                <table className="w-full text-xs font-poppins">
                    <thead>
                        <tr className="bg-neutral-2 dark:bg-neutral-2 border-b border-neutral-4 dark:border-neutral-4">
                            {['Produit', 'Catégorie', 'Prix', 'Réduction', 'Stock', 'Statut', 'Vedette', 'Actions'].map(col => (
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
                                    Aucun produit trouvé
                                </td>
                            </tr>
                        ) : filtered.map(product => {
                            const discount = calcDiscount(product.price, product.salePrice);
                            const stockBadge = getStockBadgeType(product.stock);

                            return (
                                <tr
                                    key={product.id}
                                    className="border-b border-neutral-4 dark:border-neutral-4 last:border-0 hover:bg-neutral-2 dark:hover:bg-neutral-2 transition-colors duration-150"
                                >
                                    {/* Produit */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <ProductAvatar name={product.name} />
                                            <span className="font-medium text-neutral-8 dark:text-neutral-8 max-w-40 truncate">
                                                {product.name}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Catégorie */}
                                    <td className="px-4 py-3 text-neutral-6 dark:text-neutral-6 whitespace-nowrap">
                                        {product.category}
                                    </td>

                                    {/* Prix */}
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-neutral-8 dark:text-neutral-8">
                                                {formatPrice(product.salePrice ?? product.price)}
                                            </span>
                                            {product.salePrice && (
                                                <span className="line-through text-neutral-5 text-[11px]">
                                                    {formatPrice(product.price)}
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Réduction */}
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {discount
                                            ? <span className="text-success-1 font-semibold">-{discount}%</span>
                                            : <span className="text-neutral-5">—</span>
                                        }
                                    </td>

                                    {/* Stock */}
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <span className={`font-semibold ${product.stock === 0 ? 'text-danger-1' : product.stock <= 5 ? 'text-warning-1' : 'text-neutral-8 dark:text-neutral-8'}`}>
                                                {product.stock}
                                            </span>
                                            {stockBadge && <ProductBadge type={stockBadge} />}
                                        </div>
                                    </td>

                                    {/* Statut toggle */}
                                    <td className="px-4 py-3">
                                        <ProductStatusToggle
                                            active={product.active}
                                            onChange={() => handleToggleStatus(product.id)}
                                        />
                                    </td>

                                    {/* Vedette */}
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleToggleFeatured(product.id)}
                                            title={product.featured ? 'Retirer des vedettes' : 'Mettre en vedette'}
                                            className="cursor-pointer transition-colors duration-200"
                                        >
                                            <Star
                                                size={16}
                                                className={product.featured ? 'fill-warning-1 text-warning-1' : 'text-neutral-4'}
                                            />
                                        </button>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => onEdit?.(product)}
                                                className="w-7 h-7 flex items-center justify-center rounded-1.5 text-neutral-6 hover:bg-primary-5 hover:text-primary-1 transition-colors duration-150 cursor-pointer"
                                                title="Modifier"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                onClick={() => onDelete?.(product)}
                                                className="w-7 h-7 flex items-center justify-center rounded-1.5 text-neutral-6 hover:bg-danger-2 hover:text-danger-1 transition-colors duration-150 cursor-pointer"
                                                title="Supprimer"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductsTable;