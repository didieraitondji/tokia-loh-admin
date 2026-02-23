import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Trash2, Plus } from 'lucide-react';
import InputField from '../InputField';
import Button from '../Button';
import ProductStatusToggle from './ProductStatusToggle';

// Catégories mock — à remplacer par l'API
const MOCK_CATEGORIES = ['Robes', 'Chaussures', 'Sacs', 'Bijoux', 'Chemises', 'Accessoires'];

const EMPTY_FORM = {
    name: '',
    description: '',
    category: '',
    price: '',
    salePrice: '',
    stock: '',
    active: true,
    featured: false,
    mainImage: null,      // { file, preview }
    subImages: [],        // [{ file, preview }, ...]
};

// Calcul automatique du pourcentage de réduction
const calcDiscount = (price, salePrice) => {
    const p = parseFloat(price);
    const s = parseFloat(salePrice);
    if (!p || !s || s >= p) return null;
    return Math.round(((p - s) / p) * 100);
};

const ProductFormModal = ({ open, onClose, product = null, onSave }) => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const mainImageRef = useRef(null);
    const subImageRef = useRef(null);

    const isEdit = !!product;

    // Pré-remplir le formulaire en mode édition
    useEffect(() => {
        if (open) {
            setForm(product ? { ...EMPTY_FORM, ...product } : EMPTY_FORM);
            setErrors({});
        }
    }, [open, product]);

    // Bloquer le scroll de la page quand la modal est ouverte
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    if (!open) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    // Upload image principale
    const handleMainImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const preview = URL.createObjectURL(file);
        setForm(prev => ({ ...prev, mainImage: { file, preview } }));
    };

    // Upload images secondaires (max 4)
    const handleSubImages = (e) => {
        const files = Array.from(e.target.files);
        const remaining = 4 - form.subImages.length;
        const toAdd = files.slice(0, remaining).map(file => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setForm(prev => ({ ...prev, subImages: [...prev.subImages, ...toAdd] }));
    };

    const removeSubImage = (index) => {
        setForm(prev => ({
            ...prev,
            subImages: prev.subImages.filter((_, i) => i !== index),
        }));
    };

    // Validation
    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Nom requis';
        if (!form.category) e.category = 'Catégorie requise';
        if (!form.price) e.price = 'Prix requis';
        if (!form.stock && form.stock !== 0) e.stock = 'Stock requis';
        if (form.salePrice && parseFloat(form.salePrice) >= parseFloat(form.price)) {
            e.salePrice = 'Le prix réduit doit être inférieur au prix initial';
        }
        if (!form.mainImage) e.mainImage = 'Image principale requise';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        // TODO : appel API
        await new Promise(r => setTimeout(r, 1500));
        setLoading(false);
        onSave?.(form);
        onClose();
    };

    const discount = calcDiscount(form.price, form.salePrice);

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-neutral-8/40 dark:bg-neutral-8/60 z-40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="
                    bg-neutral-0 dark:bg-neutral-0
                    rounded-3 shadow-xl
                    w-full max-w-2xl max-h-[90vh]
                    flex flex-col overflow-hidden
                ">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-4 dark:border-neutral-4 shrink-0">
                        <h2 className="text-sm font-bold font-poppins text-neutral-8 dark:text-neutral-8">
                            {isEdit ? 'Modifier le produit' : 'Nouveau produit'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-3 dark:hover:bg-neutral-3 text-neutral-6 hover:text-neutral-8 transition-colors cursor-pointer"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Body scrollable */}
                    <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-5">

                        {/* Infos principales */}
                        <div className="flex flex-col gap-4">
                            <p className="text-xs font-semibold font-poppins text-neutral-6 uppercase tracking-wide">
                                Informations générales
                            </p>

                            <InputField
                                label="Nom du produit"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Ex: Robe Ankara Wax"
                                error={errors.name}
                                required
                            />

                            <InputField
                                label="Description"
                                name="description"
                                type="textarea"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Décrivez le produit..."
                            />

                            {/* Catégorie */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold font-poppins text-neutral-8 dark:text-neutral-8">
                                    Catégorie <span className="text-danger-1">*</span>
                                </label>
                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className="
                                        w-full rounded-full border border-neutral-5 dark:border-neutral-5
                                        bg-neutral-0 dark:bg-neutral-0
                                        px-4 py-2.5 text-small text-neutral-8 dark:text-neutral-8
                                        font-poppins outline-none
                                        focus:border-primary-1 focus:ring-2 focus:ring-primary-5
                                        transition-all duration-200 cursor-pointer
                                    "
                                >
                                    <option value="">Sélectionner une catégorie</option>
                                    {MOCK_CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                {errors.category && <p className="text-xs text-danger-1">{errors.category}</p>}
                            </div>
                        </div>

                        {/* Prix */}
                        <div className="flex flex-col gap-4">
                            <p className="text-xs font-semibold font-poppins text-neutral-6 uppercase tracking-wide">
                                Prix & Stock
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <InputField
                                    label="Prix initial (F)"
                                    name="price"
                                    type="number"
                                    value={form.price}
                                    onChange={handleChange}
                                    placeholder="Ex: 10000"
                                    error={errors.price}
                                    required
                                />
                                <div className="flex flex-col gap-1.5">
                                    <InputField
                                        label="Prix réduit (F)"
                                        name="salePrice"
                                        type="number"
                                        value={form.salePrice}
                                        onChange={handleChange}
                                        placeholder="Ex: 7500"
                                        error={errors.salePrice}
                                    />
                                    {/* Réduction calculée automatiquement */}
                                    {discount !== null && (
                                        <span className="text-[11px] font-semibold font-poppins text-success-1">
                                            ✓ Réduction de {discount}%
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <InputField
                                    label="Quantité en stock"
                                    name="stock"
                                    type="number"
                                    value={form.stock}
                                    onChange={handleChange}
                                    placeholder="Ex: 20"
                                    error={errors.stock}
                                    required
                                />
                                {/* Stock faible warning */}
                                {form.stock !== '' && parseInt(form.stock) <= 5 && parseInt(form.stock) > 0 && (
                                    <div className="flex items-end pb-2">
                                        <span className="text-[11px] font-semibold font-poppins text-warning-1">
                                            ⚠️ Stock faible
                                        </span>
                                    </div>
                                )}
                                {form.stock !== '' && parseInt(form.stock) === 0 && (
                                    <div className="flex items-end pb-2">
                                        <span className="text-[11px] font-semibold font-poppins text-danger-1">
                                            ⛔ Rupture de stock
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Images */}
                        <div className="flex flex-col gap-4">
                            <p className="text-xs font-semibold font-poppins text-neutral-6 uppercase tracking-wide">
                                Images
                            </p>

                            {/* Image principale */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold font-poppins text-neutral-8 dark:text-neutral-8">
                                    Image principale <span className="text-danger-1">*</span>
                                </label>

                                {form.mainImage ? (
                                    <div className="relative w-32 h-32 rounded-2 overflow-hidden border border-neutral-4 group">
                                        <img src={form.mainImage.preview ?? form.mainImage} alt="principale" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setForm(prev => ({ ...prev, mainImage: null }))}
                                            className="absolute inset-0 bg-neutral-8/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                                        >
                                            <Trash2 size={18} className="text-white" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => mainImageRef.current?.click()}
                                        className="
                                            w-32 h-32 rounded-2
                                            border-2 border-dashed border-neutral-4 dark:border-neutral-4
                                            flex flex-col items-center justify-center gap-2
                                            text-neutral-6 hover:border-primary-1 hover:text-primary-1
                                            transition-colors duration-200 cursor-pointer
                                        "
                                    >
                                        <Upload size={20} />
                                        <span className="text-[11px] font-poppins text-center">Ajouter</span>
                                    </button>
                                )}
                                <input ref={mainImageRef} type="file" accept="image/*" className="hidden" onChange={handleMainImage} />
                                {errors.mainImage && <p className="text-xs text-danger-1">{errors.mainImage}</p>}
                            </div>

                            {/* Images secondaires */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold font-poppins text-neutral-8 dark:text-neutral-8">
                                    Images secondaires
                                    <span className="text-neutral-6 font-normal ml-1">({form.subImages.length}/4)</span>
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {form.subImages.map((img, i) => (
                                        <div key={i} className="relative w-20 h-20 rounded-2 overflow-hidden border border-neutral-4 group">
                                            <img src={img.preview ?? img} alt={`sec-${i}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeSubImage(i)}
                                                className="absolute inset-0 bg-neutral-8/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                                            >
                                                <Trash2 size={14} className="text-white" />
                                            </button>
                                        </div>
                                    ))}

                                    {form.subImages.length < 4 && (
                                        <button
                                            type="button"
                                            onClick={() => subImageRef.current?.click()}
                                            className="
                                                w-20 h-20 rounded-2
                                                border-2 border-dashed border-neutral-4 dark:border-neutral-4
                                                flex flex-col items-center justify-center gap-1
                                                text-neutral-6 hover:border-primary-1 hover:text-primary-1
                                                transition-colors duration-200 cursor-pointer
                                            "
                                        >
                                            <Plus size={16} />
                                            <span className="text-[10px] font-poppins">Ajouter</span>
                                        </button>
                                    )}
                                </div>
                                <input ref={subImageRef} type="file" accept="image/*" multiple className="hidden" onChange={handleSubImages} />
                            </div>
                        </div>

                        {/* Statut & Vedette */}
                        <div className="flex flex-col gap-4">
                            <p className="text-xs font-semibold font-poppins text-neutral-6 uppercase tracking-wide">
                                Paramètres
                            </p>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold font-poppins text-neutral-8 dark:text-neutral-8">Produit actif</p>
                                        <p className="text-[11px] font-poppins text-neutral-6">Visible sur la boutique</p>
                                    </div>
                                    <ProductStatusToggle
                                        active={form.active}
                                        onChange={val => setForm(prev => ({ ...prev, active: val }))}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold font-poppins text-neutral-8 dark:text-neutral-8">Produit vedette ⭐</p>
                                        <p className="text-[11px] font-poppins text-neutral-6">Mis en avant sur la boutique</p>
                                    </div>
                                    <ProductStatusToggle
                                        active={form.featured}
                                        onChange={val => setForm(prev => ({ ...prev, featured: val }))}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-4 dark:border-neutral-4 shrink-0">
                        <Button variant="ghost" size="normal" onClick={onClose} type="button">
                            Annuler
                        </Button>
                        <Button variant="primary" size="normal" loading={loading} onClick={handleSubmit}>
                            {isEdit ? 'Enregistrer' : 'Créer le produit'}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductFormModal;