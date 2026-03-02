import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
    ArrowLeft, Pencil, Star, Tag,
    Package, CheckCircle, XCircle, AlertTriangle
} from 'lucide-react';
import Button from '../components/Button';
import ProductBadge from '../components/products/ProductBadge';
import ProductFormModal from '../components/products/ProductFormModal';

// Données mock — à remplacer par l'API GET /products/:id
const MOCK_PRODUCTS = [
    {
        id: 1,
        name: 'Robe Ankara Wax',
        description: 'Magnifique robe confectionnée en tissu Ankara Wax 100% coton. Coupe élégante et moderne, idéale pour les cérémonies et soirées. Disponible en taille S, M, L, XL.',
        category: 'Robes',
        price: 15000,
        salePrice: 11000,
        stock: 2,
        active: true,
        featured: true,
        mainImage: null,
        subImages: [],
    },
    {
        id: 2,
        name: 'Sandales tressées',
        description: 'Sandales artisanales tressées à la main. Confortables et résistantes, parfaites pour l\'été.',
        category: 'Chaussures',
        price: 8000,
        salePrice: null,
        stock: 12,
        active: true,
        featured: false,
        mainImage: null,
        subImages: [],
    },
    {
        id: 3,
        name: 'Sac en raphia naturel',
        description: 'Sac fabriqué en raphia naturel. Design unique et authentique, grand compartiment principal.',
        category: 'Sacs',
        price: 12000,
        salePrice: 9500,
        stock: 0,
        active: false,
        featured: false,
        mainImage: null,
        subImages: [],
    },
    {
        id: 4,
        name: 'Chemise bazin brodée',
        description: 'Chemise en tissu bazin de haute qualité, brodée à la main. Parfaite pour les occasions formelles.',
        category: 'Chemises',
        price: 18000,
        salePrice: 14000,
        stock: 3,
        active: true,
        featured: true,
        mainImage: null,
        subImages: [],
    },
    {
        id: 5,
        name: 'Bracelet perles coco',
        description: 'Bracelet artisanal en perles de noix de coco. Léger et coloré, s\'adapte à tous les poignets.',
        category: 'Bijoux',
        price: 3500,
        salePrice: null,
        stock: 25,
        active: true,
        featured: false,
        mainImage: null,
        subImages: [],
    },
    {
        id: 6,
        name: 'Collier wax multicolor',
        description: 'Collier composé de perles en tissu wax multicolore. Pièce unique fait main.',
        category: 'Bijoux',
        price: 5000,
        salePrice: 3800,
        stock: 8,
        active: true,
        featured: false,
        mainImage: null,
        subImages: [],
    },
    {
        id: 7,
        name: 'Sac à dos tissu kente',
        description: 'Sac à dos confectionné en tissu kente traditionnel. Spacieux avec plusieurs compartiments.',
        category: 'Sacs',
        price: 22000,
        salePrice: null,
        stock: 5,
        active: true,
        featured: false,
        mainImage: null,
        subImages: [],
    },
    {
        id: 8,
        name: 'Robe bogolan naturel',
        description: 'Robe en tissu bogolan teint naturellement. Design exclusif inspiré des traditions maliennes.',
        category: 'Robes',
        price: 25000,
        salePrice: 20000,
        stock: 1,
        active: false,
        featured: false,
        mainImage: null,
        subImages: [],
    },
];

const formatPrice = (p) => `${Number(p).toLocaleString('fr-FR')} F`;

const calcDiscount = (price, salePrice) => {
    if (!salePrice) return null;
    return Math.round(((price - salePrice) / price) * 100);
};

// Avatar grand format
const ProductAvatarLarge = ({ name }) => (
    <div className="w-full h-full bg-secondary-5 flex items-center justify-center">
        <span className="text-5xl font-bold font-poppins text-secondary-1 uppercase">
            {name.slice(0, 2)}
        </span>
    </div>
);

// Ligne d'info réutilisable
const InfoRow = ({ label, children }) => (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-neutral-4 dark:border-neutral-4 last:border-0">
        <span className="text-xs font-poppins text-neutral-6 shrink-0 min-w-30">{label}</span>
        <div className="text-xs font-semibold font-poppins text-neutral-8 dark:text-neutral-8 text-right">
            {children}
        </div>
    </div>
);

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        // TODO : remplacer par appel API GET /products/:id
        const found = MOCK_PRODUCTS.find(p => p.id === Number(id));
        if (!found) { navigate('/products'); return; }
        setProduct(found);
        document.title = `Admin Tokia-Loh | ${found.name}`;
    }, [id]);

    if (!product) return null;

    const discount = calcDiscount(product.price, product.salePrice);
    const allImages = [product.mainImage, ...(product.subImages ?? [])].filter(Boolean);
    const hasImages = allImages.length > 0;

    const stockBadge = product.stock === 0
        ? 'out-of-stock'
        : product.stock <= 5 ? 'low-stock' : null;

    const handleSave = (formData) => {
        setProduct(prev => ({ ...prev, ...formData }));
        // TODO : appel API PATCH /products/:id
    };

    return (
        <div className="flex flex-col gap-6">

            {/* ── En-tête navigation ── */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-3 dark:hover:bg-neutral-3 text-neutral-6 hover:text-neutral-8 transition-colors cursor-pointer"
                        title="Retour aux produits"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <div>
                        <h1 className="text-h5 font-bold font-poppins text-neutral-8 dark:text-neutral-8">
                            {product.name}
                        </h1>
                        <p className="text-xs font-poppins text-neutral-6 mt-0.5">
                            Détail du produit
                        </p>
                    </div>
                </div>

                {/* Bouton modifier */}
                <Button
                    variant="primary"
                    size="normal"
                    icon={<Pencil size={14} />}
                    iconPosition="left"
                    onClick={() => setModalOpen(true)}
                >
                    Modifier le produit
                </Button>
            </div>

            {/* ── Contenu principal ── */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-start">

                {/* ── Colonne gauche : images ── */}
                <div className="xl:col-span-2 flex flex-col gap-3">

                    {/* Image principale */}
                    <div className="
                        aspect-square rounded-md overflow-hidden
                        bg-neutral-2 dark:bg-neutral-2
                        border border-neutral-4 dark:border-neutral-4
                    ">
                        {hasImages ? (
                            <img
                                src={allImages[activeImage]?.preview ?? allImages[activeImage]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <ProductAvatarLarge name={product.name} />
                        )}
                    </div>

                    {/* Miniatures images secondaires */}
                    {allImages.length > 1 && (
                        <div className="flex gap-2 flex-wrap">
                            {allImages.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImage(i)}
                                    className={`
                                        w-14 h-14 rounded-md overflow-hidden border-2 transition-all cursor-pointer
                                        ${activeImage === i ? 'border-primary-1' : 'border-neutral-4 hover:border-primary-3'}
                                    `}
                                >
                                    <img
                                        src={img?.preview ?? img}
                                        alt={`img-${i}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Colonne droite : infos ── */}
                <div className="xl:col-span-3 flex flex-col gap-4">

                    {/* Badges statut */}
                    <div className="flex flex-wrap gap-2">
                        <ProductBadge type={product.active ? 'active' : 'inactive'} />
                        {product.featured && <ProductBadge type="featured" />}
                        {stockBadge && <ProductBadge type={stockBadge} />}
                    </div>

                    {/* Prix */}
                    <div className="
                        bg-neutral-0 dark:bg-neutral-0
                        border border-neutral-4 dark:border-neutral-4
                        rounded-md px-5 py-4 flex items-center gap-4 flex-wrap
                    ">
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold font-poppins text-primary-1">
                                {formatPrice(product.salePrice ?? product.price)}
                            </span>
                            {product.salePrice && (
                                <span className="line-through text-sm font-poppins text-neutral-5">
                                    {formatPrice(product.price)}
                                </span>
                            )}
                        </div>
                        {discount && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-success-2 text-success-1 text-sm font-bold font-poppins">
                                <Tag size={13} />
                                -{discount}%
                            </span>
                        )}
                    </div>

                    {/* Infos détaillées */}
                    <div className="
                        bg-neutral-0 dark:bg-neutral-0
                        border border-neutral-4 dark:border-neutral-4
                        rounded-md px-5 py-2
                    ">
                        <InfoRow label="Catégorie">
                            <span className="inline-flex items-center gap-1.5">
                                <Package size={12} className="text-primary-1" />
                                {product.category}
                            </span>
                        </InfoRow>

                        <InfoRow label="Stock disponible">
                            <span className={
                                product.stock === 0 ? 'text-danger-1' :
                                    product.stock <= 5 ? 'text-warning-1' :
                                        'text-success-1'
                            }>
                                {product.stock} unité{product.stock > 1 ? 's' : ''}
                                {product.stock === 0 && ' — Rupture'}
                                {product.stock > 0 && product.stock <= 5 && ' — Stock faible'}
                            </span>
                        </InfoRow>

                        <InfoRow label="Statut">
                            <span className={`inline-flex items-center gap-1 ${product.active ? 'text-success-1' : 'text-neutral-6'}`}>
                                {product.active
                                    ? <><CheckCircle size={12} /> Actif — visible sur la boutique</>
                                    : <><XCircle size={12} /> Inactif — masqué</>
                                }
                            </span>
                        </InfoRow>

                        <InfoRow label="Produit vedette">
                            <span className={`inline-flex items-center gap-1 ${product.featured ? 'text-warning-1' : 'text-neutral-5'}`}>
                                <Star size={12} className={product.featured ? 'fill-warning-1' : ''} />
                                {product.featured ? 'Oui — mis en avant' : 'Non'}
                            </span>
                        </InfoRow>

                        {product.salePrice && (
                            <InfoRow label="Prix original">
                                <span className="line-through text-neutral-5">
                                    {formatPrice(product.price)}
                                </span>
                            </InfoRow>
                        )}
                    </div>

                    {/* Description */}
                    {product.description && (
                        <div className="
                            bg-neutral-0 dark:bg-neutral-0
                            border border-neutral-4 dark:border-neutral-4
                            rounded-md px-5 py-4 flex flex-col gap-2
                        ">
                            <p className="text-xs font-semibold font-poppins text-neutral-6 uppercase tracking-wide">
                                Description
                            </p>
                            <p className="text-xs font-poppins text-neutral-7 dark:text-neutral-7 leading-relaxed">
                                {product.description}
                            </p>
                        </div>
                    )}

                    {/* Alerte stock faible */}
                    {product.stock > 0 && product.stock <= 5 && (
                        <div className="flex items-center gap-2 bg-warning-2 border border-warning-1 rounded-md px-4 py-3">
                            <AlertTriangle size={14} className="text-warning-1 shrink-0" />
                            <p className="text-xs font-poppins font-medium text-warning-1">
                                Stock faible — seulement {product.stock} unité{product.stock > 1 ? 's' : ''} restante{product.stock > 1 ? 's' : ''}. Pensez à réapprovisionner.
                            </p>
                        </div>
                    )}
                    {product.stock === 0 && (
                        <div className="flex items-center gap-2 bg-danger-2 border border-danger-1 rounded-md px-4 py-3">
                            <AlertTriangle size={14} className="text-danger-1 shrink-0" />
                            <p className="text-xs font-poppins font-medium text-danger-1">
                                Rupture de stock — ce produit n'est plus disponible à la commande.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Modal modification ── */}
            <ProductFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                product={product}
                onSave={handleSave}
            />
        </div>
    );
};

export default ProductDetailPage;