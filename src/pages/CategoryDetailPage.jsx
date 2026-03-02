import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
    ArrowLeft, Pencil, CheckCircle, XCircle,
    Package, Hash, TrendingUp
} from 'lucide-react';
import Button from '../components/Button';
import ProductStatusToggle from '../components/products/ProductStatusToggle';
import CategoryFormModal from '../components/categories/CategoryFormModal';
import StatCard from '../components/dashboard/StatCard';

// ── Mock catégories — à remplacer par GET /categories/:id ──────
const MOCK_CATEGORIES = [
    { id: 1, name: 'Robes', description: 'Robes et tenues féminines', order: 1, products: 18, active: true },
    { id: 2, name: 'Chaussures', description: 'Sandales, escarpins, baskets', order: 2, products: 12, active: true },
    { id: 3, name: 'Sacs', description: 'Sacs à main et à dos', order: 3, products: 9, active: true },
    { id: 4, name: 'Bijoux', description: 'Colliers, bracelets, bagues', order: 4, products: 21, active: true },
    { id: 5, name: 'Chemises', description: 'Chemises et hauts hommes', order: 5, products: 7, active: false },
    { id: 6, name: 'Accessoires', description: 'Ceintures, foulards...', order: 6, products: 5, active: true },
];

// ── Mock produits — à remplacer par GET /products?category=:id ──
const MOCK_PRODUCTS = [
    { id: 1, name: 'Robe Ankara Wax', category: 'Robes', price: 15000, salePrice: 11000, stock: 2, active: true, featured: true },
    { id: 2, name: 'Sandales tressées', category: 'Chaussures', price: 8000, salePrice: null, stock: 12, active: true, featured: false },
    { id: 3, name: 'Sac en raphia naturel', category: 'Sacs', price: 12000, salePrice: 9500, stock: 0, active: false, featured: false },
    { id: 4, name: 'Chemise bazin brodée', category: 'Chemises', price: 18000, salePrice: 14000, stock: 3, active: true, featured: true },
    { id: 5, name: 'Bracelet perles coco', category: 'Bijoux', price: 3500, salePrice: null, stock: 25, active: true, featured: false },
    { id: 6, name: 'Collier wax multicolor', category: 'Bijoux', price: 5000, salePrice: 3800, stock: 8, active: true, featured: false },
    { id: 7, name: 'Sac à dos tissu kente', category: 'Sacs', price: 22000, salePrice: null, stock: 5, active: true, featured: false },
    { id: 8, name: 'Robe bogolan naturel', category: 'Robes', price: 25000, salePrice: 20000, stock: 1, active: false, featured: false },
    { id: 9, name: 'Escarpins bazin', category: 'Chaussures', price: 14000, salePrice: null, stock: 6, active: true, featured: false },
    { id: 10, name: 'Sac pochette wax', category: 'Sacs', price: 7500, salePrice: 5900, stock: 4, active: true, featured: true },
    { id: 11, name: 'Bague perles dorées', category: 'Bijoux', price: 4500, salePrice: null, stock: 14, active: true, featured: false },
    { id: 12, name: 'Ceinture cuir tressé', category: 'Accessoires', price: 6000, salePrice: null, stock: 9, active: true, featured: false },
];

const formatPrice = (p) => `${Number(p).toLocaleString('fr-FR')} F`;
const calcDiscount = (price, salePrice) => salePrice ? Math.round(((price - salePrice) / price) * 100) : null;

// ── Sous-composants ───────────────────────────────────────────

const CategoryAvatar = ({ name, size = 'md' }) => {
    const sizes = { md: 'w-12 h-12 text-sm', lg: 'w-16 h-16 text-xl' };
    return (
        <div className={`${sizes[size]} rounded-md bg-primary-5 flex items-center justify-center shrink-0`}>
            <span className={`font-bold font-poppins text-primary-1 uppercase`}>
                {name.slice(0, 2)}
            </span>
        </div>
    );
};

// Tableau produits inline (réutilise la logique de ProductsTable, filtré par catégorie)
const CategoryProductsTable = ({ products, onEditProduct }) => {
    const navigate = useNavigate();
    const [list, setList] = useState(products);

    // Sync si products change (ex: après modification)
    useEffect(() => { setList(products); }, [products]);

    const handleToggleStatus = (id) => setList(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
    const handleToggleFeatured = (id) => setList(prev => prev.map(p => p.id === id ? { ...p, featured: !p.featured } : p));

    if (list.length === 0) {
        return (
            <div className="flex flex-col items-center gap-2 py-12 text-neutral-5">
                <Package size={32} />
                <p className="text-xs font-poppins">Aucun produit dans cette catégorie</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-xs font-poppins">
                <thead>
                    <tr className="bg-neutral-2 dark:bg-neutral-2 border-b border-neutral-4 dark:border-neutral-4">
                        {['Produit', 'Prix', 'Réduction', 'Stock', 'Statut', 'Vedette', 'Actions'].map(col => (
                            <th key={col} className="text-left px-4 py-3 text-neutral-6 dark:text-neutral-6 font-semibold uppercase tracking-wide whitespace-nowrap">
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {list.map(product => {
                        const discount = calcDiscount(product.price, product.salePrice);
                        return (
                            <tr key={product.id} className="border-b border-neutral-4 dark:border-neutral-4 last:border-0 hover:bg-neutral-2 dark:hover:bg-neutral-2 transition-colors duration-150">

                                {/* Produit */}
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-md bg-secondary-5 flex items-center justify-center shrink-0">
                                            <span className="text-[10px] font-bold font-poppins text-secondary-1 uppercase">
                                                {product.name.slice(0, 2)}
                                            </span>
                                        </div>
                                        <span className="font-medium text-neutral-8 dark:text-neutral-8 max-w-45 truncate">
                                            {product.name}
                                        </span>
                                    </div>
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
                                    <span className={`font-semibold ${product.stock === 0 ? 'text-danger-1' : product.stock <= 5 ? 'text-warning-1' : 'text-neutral-8 dark:text-neutral-8'}`}>
                                        {product.stock === 0
                                            ? 'Rupture'
                                            : `${product.stock} unité${product.stock > 1 ? 's' : ''}`
                                        }
                                    </span>
                                </td>

                                {/* Statut */}
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
                                        className="cursor-pointer transition-colors duration-200"
                                        title={product.featured ? 'Retirer des vedettes' : 'Mettre en vedette'}
                                    >
                                        <svg
                                            width="16" height="16" viewBox="0 0 24 24"
                                            fill={product.featured ? 'currentColor' : 'none'}
                                            stroke="currentColor" strokeWidth="2"
                                            className={product.featured ? 'text-warning-1' : 'text-neutral-4'}
                                        >
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                        </svg>
                                    </button>
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1.5">
                                        {/* Voir détail produit */}
                                        <button
                                            onClick={() => navigate(`/products/${product.id}`)}
                                            title="Voir le détail"
                                            className="w-7 h-7 flex items-center justify-center rounded-md text-neutral-6 hover:bg-secondary-5 hover:text-secondary-1 transition-colors cursor-pointer"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                                            </svg>
                                        </button>
                                        {/* Modifier */}
                                        <button
                                            onClick={() => onEditProduct?.(product)}
                                            title="Modifier"
                                            className="w-7 h-7 flex items-center justify-center rounded-md text-neutral-6 hover:bg-primary-5 hover:text-primary-1 transition-colors cursor-pointer"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

// ── Page principale ───────────────────────────────────────────

const CategoryDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        // TODO : remplacer par appel API GET /categories/:id
        const found = MOCK_CATEGORIES.find(c => c.id === Number(id));
        if (!found) { navigate('/categories'); return; }
        setCategory(found);
        document.title = `Admin Tokia-Loh | ${found.name}`;

        // TODO : remplacer par appel API GET /products?category=found.name
        const filtered = MOCK_PRODUCTS.filter(p => p.category === found.name);
        setProducts(filtered);
    }, [id]);

    // Stats calculées depuis les produits réels
    const stats = useMemo(() => {
        const actifs = products.filter(p => p.active).length;
        const ruptures = products.filter(p => p.stock === 0).length;
        const stockFaible = products.filter(p => p.stock > 0 && p.stock <= 5).length;
        const caTotal = products.reduce((acc, p) => acc + (p.salePrice ?? p.price), 0);
        return { actifs, ruptures, stockFaible, caTotal };
    }, [products]);

    if (!category) return null;

    const handleCategorySave = (formData) => {
        setCategory(prev => ({ ...prev, ...formData }));
        // TODO : appel API PATCH /categories/:id
    };

    const handleToggleStatus = () => {
        setCategory(prev => ({ ...prev, active: !prev.active }));
        // TODO : appel API PATCH /categories/:id/status
    };

    return (
        <div className="flex flex-col gap-6">

            {/* ── En-tête navigation ── */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-3 dark:hover:bg-neutral-3 text-neutral-6 hover:text-neutral-8 transition-colors cursor-pointer"
                        title="Retour aux catégories"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <div>
                        <h1 className="text-h5 font-bold font-poppins text-neutral-8 dark:text-neutral-8">
                            {category.name}
                        </h1>
                        <p className="text-xs font-poppins text-neutral-6 mt-0.5">
                            Détail de la catégorie
                        </p>
                    </div>
                </div>

                <Button
                    variant="primary"
                    size="normal"
                    icon={<Pencil size={14} />}
                    iconPosition="left"
                    onClick={() => setModalOpen(true)}
                >
                    Modifier la catégorie
                </Button>
            </div>

            {/* ── Fiche catégorie ── */}
            <div className="
                bg-neutral-0 dark:bg-neutral-0
                border border-neutral-4 dark:border-neutral-4
                rounded-md p-5
                flex flex-col sm:flex-row items-start gap-5
            ">
                <CategoryAvatar name={category.name} size="lg" />

                <div className="flex-1 flex flex-col gap-3 min-w-0">
                    {/* Nom + statut */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-base font-bold font-poppins text-neutral-8 dark:text-neutral-8">
                            {category.name}
                        </h2>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold font-poppins ${category.active ? 'bg-success-2 text-success-1' : 'bg-neutral-3 text-neutral-6'}`}>
                            {category.active
                                ? <><CheckCircle size={11} /> Active</>
                                : <><XCircle size={11} /> Inactive</>
                            }
                        </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs font-poppins text-neutral-6">
                        {category.description || <span className="italic">Aucune description</span>}
                    </p>

                    {/* Méta-infos */}
                    <div className="flex items-center gap-5 flex-wrap pt-1">
                        <div className="flex items-center gap-1.5 text-xs font-poppins text-neutral-6">
                            <Hash size={12} className="text-primary-1" />
                            Ordre d'affichage : <span className="font-semibold text-neutral-8 dark:text-neutral-8 ml-1">{category.order}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-poppins text-neutral-6">
                            <Package size={12} className="text-primary-1" />
                            <span className="font-semibold text-neutral-8 dark:text-neutral-8">{products.length}</span> produit{products.length > 1 ? 's' : ''}
                        </div>
                    </div>
                </div>

                {/* Toggle statut */}
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                    <span className="text-[11px] font-poppins text-neutral-5">Statut</span>
                    <ProductStatusToggle
                        active={category.active}
                        onChange={handleToggleStatus}
                    />
                </div>
            </div>

            {/* ── StatCards ── */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    title="Produits total"
                    value={String(products.length)}
                    icon={<Package size={18} />}
                    color="primary"
                />
                <StatCard
                    title="Produits actifs"
                    value={String(stats.actifs)}
                    icon={<CheckCircle size={18} />}
                    color="success"
                    trend={stats.actifs > 0 ? 'up' : 'neutral'}
                    trendLabel={`${Math.round((stats.actifs / (products.length || 1)) * 100)}%`}
                />
                <StatCard
                    title="En rupture"
                    value={String(stats.ruptures)}
                    icon={<XCircle size={18} />}
                    color="danger"
                />
                <StatCard
                    title="Valeur catalogue"
                    value={`${stats.caTotal.toLocaleString('fr-FR')} F`}
                    icon={<TrendingUp size={18} />}
                    color="secondary"
                />
            </div>

            {/* ── Tableau des produits ── */}
            <div className="
                bg-neutral-0 dark:bg-neutral-0
                border border-neutral-4 dark:border-neutral-4
                rounded-md overflow-hidden
            ">
                {/* Header du tableau */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-4 dark:border-neutral-4">
                    <div>
                        <p className="text-sm font-bold font-poppins text-neutral-8 dark:text-neutral-8">
                            Produits de la catégorie
                        </p>
                        <p className="text-[11px] font-poppins text-neutral-5 mt-0.5">
                            {products.length} produit{products.length > 1 ? 's' : ''} dans "{category.name}"
                        </p>
                    </div>
                </div>

                {/* Tableau */}
                <CategoryProductsTable
                    products={products}
                    onEditProduct={(product) => {
                        // TODO : ouvrir ProductFormModal si souhaité
                        navigate(`/products/${product.id}`);
                    }}
                />
            </div>

            {/* ── Modal modification catégorie ── */}
            <CategoryFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                category={category}
                onSave={handleCategorySave}
            />
        </div>
    );
};

export default CategoryDetailPage;