import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Trash2, Plus } from 'lucide-react';
import InputField from '../InputField';
import Button from '../Button';
import ProductStatusToggle from './ProductStatusToggle';

// Après les imports, avant MOCK_CATEGORIES
// Fonction pour obtenir la thumbnail YouTube
const getYouTubeThumbnail = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[7].length === 11) ? match[7] : null;

    if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`; // Qualité moyenne
        // Alternatives:
        // maxresdefault.jpg = Haute qualité
        // hqdefault.jpg = Haute qualité
        // mqdefault.jpg = Qualité moyenne
        // sddefault.jpg = Qualité standard
    }
    return null;
};

// Fonction pour obtenir la thumbnail Vimeo
const getVimeoThumbnail = async (url) => {
    const regExp = /vimeo.*\/(\d+)/i;
    const match = url.match(regExp);
    const videoId = match ? match[1] : null;

    if (videoId) {
        try {
            const response = await fetch(`https://vimeo.com/api/v2/video/${videoId}.json`);
            const data = await response.json();
            return data[0].thumbnail_large; // ou thumbnail_medium, thumbnail_small
        } catch (error) {
            return null;
        }
    }
    return null;
};

// Fonction pour détecter le type de vidéo
const getVideoType = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('vimeo.com')) return 'vimeo';
    return 'direct';
};


// Juste avant le composant ProductFormModal
const VideoThumbnail = ({ url }) => {
    const [thumbnail, setThumbnail] = React.useState(null);
    const [error, setError] = React.useState(false);
    const videoType = getVideoType(url);

    React.useEffect(() => {
        const loadThumbnail = async () => {
            if (videoType === 'youtube') {
                const thumb = getYouTubeThumbnail(url);
                setThumbnail(thumb);
            } else if (videoType === 'vimeo') {
                const thumb = await getVimeoThumbnail(url);
                setThumbnail(thumb);
            }
        };

        loadThumbnail();
    }, [url, videoType]);

    // Si l'image ne charge pas ou pas de thumbnail
    if (error || !thumbnail) {
        return (
            <div className="w-full h-full bg-neutral-2 dark:bg-neutral-3 flex items-center justify-center">
                {/* Icône VLC style */}
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" fill="#FF8800" stroke="#FF8800" strokeWidth="1" />
                    <circle cx="12" cy="12" r="4" fill="white" />
                    <path d="M12 8L9 14H15L12 8Z" fill="#FF8800" />
                </svg>
            </div>
        );
    }

    return (
        <img
            src={thumbnail}
            alt="video thumbnail"
            className="w-full h-full object-cover"
            onError={() => setError(true)}
        />
    );
};



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
    mainImage: null,
    subImages: [],

    // Nouvelles fonctionnalités
    hasSizes: false,          // Switch pour activer les tailles
    sizes: [],                // ['S', 'M', 'L', 'XL', 'XXL']
    hasColors: false,         // Switch pour activer les couleurs
    colors: [],               // [{ name: 'Rouge', hex: '#FF0000' }, ...]
};


// Liste de couleurs prédéfinies avec leurs noms en français
const PRESET_COLORS = [
    { name: 'Noir', hex: '#000000' },
    { name: 'Blanc', hex: '#FFFFFF' },
    { name: 'Gris', hex: '#808080' },
    { name: 'Rouge', hex: '#EF4444' },
    { name: 'Rose', hex: '#EC4899' },
    { name: 'Orange', hex: '#F97316' },
    { name: 'Jaune', hex: '#EAB308' },
    { name: 'Vert', hex: '#10B981' },
    { name: 'Bleu', hex: '#3B82F6' },
    { name: 'Indigo', hex: '#6366F1' },
    { name: 'Violet', hex: '#8B5CF6' },
    { name: 'Marron', hex: '#92400E' },
    { name: 'Beige', hex: '#D4C5B9' },
    { name: 'Kaki', hex: '#8D7B68' },
    { name: 'Marine', hex: '#1E3A8A' },
    { name: 'Bordeaux', hex: '#7F1D1D' },
    { name: 'Turquoise', hex: '#14B8A6' },
    { name: 'Corail', hex: '#FB7185' },
    { name: 'Or', hex: '#D97706' },
    { name: 'Argent', hex: '#94A3B8' },
];

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
    const [showImageUrlModal, setShowImageUrlModal] = useState(false);
    const [tempImageUrl, setTempImageUrl] = useState('');
    const [tempImageType, setTempImageType] = useState('main');

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

    // Gestion des URLs d'images
    const handleAddImageUrl = () => {
        if (!tempImageUrl.trim()) return;

        if (tempImageType === 'main') {
            setForm(prev => ({ ...prev, mainImage: tempImageUrl }));
        } else {
            setForm(prev => ({
                ...prev,
                subImages: [...prev.subImages, tempImageUrl]
            }));
        }

        setTempImageUrl('');
        setShowImageUrlModal(false);
    };

    // Gestion des tailles
    const handleAddSize = (size) => {
        if (!form.sizes.includes(size)) {
            setForm(prev => ({ ...prev, sizes: [...prev.sizes, size] }));
        }
    };

    const handleRemoveSize = (size) => {
        setForm(prev => ({
            ...prev,
            sizes: prev.sizes.filter(s => s !== size)
        }));
    };

    // Gestion des couleurs
    const handleAddColor = (colorName, colorHex) => {
        if (!colorName.trim()) return;
        setForm(prev => ({
            ...prev,
            colors: [...prev.colors, { name: colorName, hex: colorHex }]
        }));
    };

    const handleRemoveColor = (index) => {
        setForm(prev => ({
            ...prev,
            colors: prev.colors.filter((_, i) => i !== index)
        }));
    };

    const handleSubMedia = (e) => {
        const files = Array.from(e.target.files);
        const toAdd = files.map(file => {
            const isVideo = file.type.startsWith('video/');
            return {
                file,
                preview: URL.createObjectURL(file),
                type: isVideo ? 'video' : 'image', // Identifier le type
            };
        });
        setForm(prev => ({ ...prev, subImages: [...prev.subImages, ...toAdd] }));
    };

    const removeSubImage = (index) => {
        setForm(prev => ({
            ...prev,
            subImages: prev.subImages.filter((_, i) => i !== index),
        }));
    };

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

        // Créer un FormData pour envoyer les fichiers
        const formData = new FormData();

        // Ajouter tous les champs texte
        formData.append('name', form.name);
        formData.append('description', form.description);
        formData.append('category', form.category);
        formData.append('price', form.price);
        formData.append('salePrice', form.salePrice);
        formData.append('stock', form.stock);
        formData.append('active', form.active);
        formData.append('featured', form.featured);

        // Ajouter l'image principale
        if (form.mainImage) {
            if (typeof form.mainImage === 'string') {
                formData.append('mainImageUrl', form.mainImage);
            } else {
                formData.append('mainImage', form.mainImage.file);
            }
        }

        // Ajouter les médias secondaires (images + vidéos)
        form.subImages.forEach((media, index) => {
            if (typeof media === 'string') {
                // C'est une URL
                formData.append(`subMediaUrl_${index}`, media);
            } else {
                // C'est un fichier
                const fieldName = media.type === 'video' ? 'subVideo' : 'subImage';
                formData.append(`${fieldName}_${index}`, media.file);
            }
        });

        // Ajouter les tailles et couleurs
        formData.append('hasSizes', form.hasSizes);
        formData.append('sizes', JSON.stringify(form.sizes));
        formData.append('hasColors', form.hasColors);
        formData.append('colors', JSON.stringify(form.colors));

        // TODO : Remplacer par votre appel API réel
        // await axios.post('/api/products', formData, {
        //     headers: { 'Content-Type': 'multipart/form-data' }
        // });

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
                className="fixed inset-0 bg-neutral-8/40 dark:bg-neutral-2/60 z-40 backdrop-blur-sm"
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
                                        w-full rounded-md border border-neutral-5 dark:border-neutral-5
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
                                        <img
                                            src={typeof form.mainImage === 'string' ? form.mainImage : form.mainImage.preview}
                                            alt="principale"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setForm(prev => ({ ...prev, mainImage: null }))}
                                            className="absolute inset-0 bg-neutral-8/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                                        >
                                            <Trash2 size={18} className="text-white" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
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
                                            <span className="text-[11px] font-poppins text-center">Fichier</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setTempImageType('main');
                                                setShowImageUrlModal(true);
                                            }}
                                            className="w-32 h-32 rounded-2 border-2 border-dashed border-neutral-4 dark:border-neutral-4 flex flex-col items-center justify-center gap-2 text-neutral-6 hover:border-primary-1 hover:text-primary-1 transition-colors duration-200 cursor-pointer">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                            </svg>
                                            <span className="text-[11px] font-poppins text-center">URL</span>
                                        </button>
                                    </div>
                                )}
                                <input ref={mainImageRef} type="file" accept="image/*" className="hidden" onChange={handleMainImage} />
                                {errors.mainImage && <p className="text-xs text-danger-1">{errors.mainImage}</p>}
                            </div>

                            {/* Médias secondaires (illimitées) */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold font-poppins text-neutral-8 dark:text-neutral-8">
                                    Médias secondaires (images & vidéos)
                                    <span className="text-neutral-6 font-normal ml-1">({form.subImages.length})</span>
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {form.subImages.map((media, i) => {
                                        // Détecter si c'est une vidéo
                                        let isVideo = false;
                                        let isYouTubeVimeo = false;

                                        if (typeof media === 'string') {
                                            // C'est une URL
                                            const videoType = getVideoType(media);
                                            isYouTubeVimeo = videoType === 'youtube' || videoType === 'vimeo';
                                            isVideo = isYouTubeVimeo || media.match(/\.(mp4|webm|ogg|mov|avi)$/i);
                                        } else {
                                            // C'est un fichier
                                            isVideo = media.type === 'video';
                                        }

                                        return (
                                            <div key={i} className="relative w-20 h-20 rounded-2 overflow-hidden border border-neutral-4 group">
                                                {isVideo ? (
                                                    <>
                                                        {/* YouTube/Vimeo : afficher thumbnail */}
                                                        {typeof media === 'string' && isYouTubeVimeo ? (
                                                            <VideoThumbnail url={media} />
                                                        ) : (
                                                            /* Vidéo fichier ou URL directe */
                                                            <video
                                                                src={typeof media === 'string' ? media : media.preview}
                                                                className="w-full h-full object-cover"
                                                                muted
                                                            />
                                                        )}
                                                    </>
                                                ) : (
                                                    <img
                                                        src={typeof media === 'string' ? media : media.preview}
                                                        alt={`media-${i}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}

                                                {/* Badge type */}
                                                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-neutral-8/70 text-[9px] font-bold text-white uppercase">
                                                    {isVideo ? '🎬' : '🖼️'}
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => removeSubImage(i)}
                                                    className="absolute inset-0 bg-neutral-8/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                                                >
                                                    <Trash2 size={14} className="text-white" />
                                                </button>
                                            </div>
                                        );
                                    })}

                                    {/* Bouton ajouter fichier */}
                                    <button
                                        type="button"
                                        onClick={() => subImageRef.current?.click()}
                                        className="w-20 h-20 rounded-2 border-2 border-dashed border-neutral-4 dark:border-neutral-4 flex flex-col items-center justify-center gap-1 text-neutral-6 hover:border-primary-1 hover:text-primary-1 transition-colors duration-200 cursor-pointer">
                                        <Upload size={16} />
                                        <span className="text-[10px] font-poppins">Fichier</span>
                                    </button>

                                    {/* Bouton ajouter URL */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setTempImageType('sub');
                                            setShowImageUrlModal(true);
                                        }}
                                        className="w-20 h-20 rounded-2 border-2 border-dashed border-neutral-4 dark:border-neutral-4 flex flex-col items-center justify-center gap-1 text-neutral-6 hover:border-primary-1 hover:text-primary-1 transition-colors duration-200 cursor-pointer">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                        <span className="text-[10px] font-poppins">URL</span>
                                    </button>
                                </div>
                                <input
                                    ref={subImageRef}
                                    type="file"
                                    accept="image/*,video/*"
                                    multiple
                                    className="hidden"
                                    onChange={handleSubMedia}
                                />
                            </div>
                        </div>

                        {/* Tailles */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold font-poppins text-neutral-6 uppercase tracking-wide">
                                    Tailles
                                </p>
                                <ProductStatusToggle
                                    active={form.hasSizes}
                                    onChange={val => setForm(prev => ({ ...prev, hasSizes: val, sizes: val ? prev.sizes : [] }))}
                                />
                            </div>

                            {form.hasSizes && (
                                <div className="flex flex-col gap-3">
                                    {/* Sélection rapide des tailles standards */}
                                    <div className="flex flex-wrap gap-2">
                                        {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map(size => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => {
                                                    if (form.sizes.includes(size)) {
                                                        handleRemoveSize(size);
                                                    } else {
                                                        handleAddSize(size);
                                                    }
                                                }}
                                                className={`
                            px-4 py-2 rounded-full text-xs font-semibold font-poppins
                            transition-all duration-200 cursor-pointer
                            ${form.sizes.includes(size)
                                                        ? 'bg-primary-1 text-white'
                                                        : 'bg-neutral-2 text-neutral-6 hover:bg-neutral-3'
                                                    }
                        `}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Tailles personnalisées */}
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="Autre taille (ex: 38, 42, etc.)"
                                            className="flex-1 rounded-full border border-neutral-5 dark:border-neutral-5 bg-neutral-0 dark:bg-neutral-0 px-4 py-2 text-small text-neutral-8 dark:text-neutral-8 font-poppins outline-none focus:border-primary-1 focus:ring-2 focus:ring-primary-5"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const val = e.target.value.trim();
                                                    if (val) {
                                                        handleAddSize(val);
                                                        e.target.value = '';
                                                    }
                                                }
                                            }}
                                        />
                                    </div>

                                    {/* Liste des tailles ajoutées */}
                                    {form.sizes.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-3">
                                            <span className="text-xs font-semibold text-neutral-6">Tailles sélectionnées :</span>
                                            {form.sizes.map((size, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center gap-1 px-3 py-1 bg-primary-5 rounded-full"
                                                >
                                                    <span className="text-xs font-semibold text-primary-1">{size}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveSize(size)}
                                                        className="cursor-pointer"
                                                    >
                                                        <X size={12} className="text-primary-1" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Couleurs */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold font-poppins text-neutral-6 uppercase tracking-wide">
                                    Couleurs
                                </p>
                                <ProductStatusToggle
                                    active={form.hasColors}
                                    onChange={val => setForm(prev => ({ ...prev, hasColors: val, colors: val ? prev.colors : [] }))}
                                />
                            </div>

                            {form.hasColors && (
                                <div className="flex flex-col gap-3">
                                    {/* Sélecteur de couleur avec aperçu */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-medium font-poppins text-neutral-7 dark:text-neutral-7">
                                            Sélectionner une couleur
                                        </label>
                                        <select
                                            id="colorSelect"
                                            onChange={(e) => {
                                                const selectedColor = PRESET_COLORS.find(c => c.hex === e.target.value);
                                                if (selectedColor && !form.colors.find(c => c.hex === selectedColor.hex)) {
                                                    handleAddColor(selectedColor.name, selectedColor.hex);
                                                    e.target.value = ''; // Reset le select
                                                }
                                            }}
                                            className="
                        w-full rounded-md border border-neutral-5 dark:border-neutral-5
                        bg-neutral-0 dark:bg-neutral-0
                        px-4 py-2.5 text-small text-neutral-8 dark:text-neutral-8
                        font-poppins outline-none
                        focus:border-primary-1 focus:ring-2 focus:ring-primary-5
                        transition-all duration-200 cursor-pointer
                    "
                                            defaultValue=""
                                        >
                                            <option value="">Choisir une couleur...</option>
                                            {PRESET_COLORS.map(color => (
                                                <option
                                                    key={color.hex}
                                                    value={color.hex}
                                                    disabled={form.colors.some(c => c.hex === color.hex)}
                                                >
                                                    {color.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Grille visuelle des couleurs (alternative plus UX) */}
                                    <div>
                                        <label className="text-xs font-medium font-poppins text-neutral-7 dark:text-neutral-7 mb-2 block">
                                            Ou sélectionner visuellement
                                        </label>
                                        <div className="grid grid-cols-10 gap-2">
                                            {PRESET_COLORS.map(color => {
                                                const isSelected = form.colors.some(c => c.hex === color.hex);
                                                return (
                                                    <button
                                                        key={color.hex}
                                                        type="button"
                                                        onClick={() => {
                                                            if (!isSelected) {
                                                                handleAddColor(color.name, color.hex);
                                                            }
                                                        }}
                                                        disabled={isSelected}
                                                        className={`
                                    w-full aspect-square rounded-md border-2 
                                    transition-all duration-200
                                    ${isSelected
                                                                ? 'border-neutral-4 opacity-40 cursor-not-allowed'
                                                                : 'border-transparent hover:border-primary-1 hover:scale-110 cursor-pointer'
                                                            }
                                `}
                                                        style={{ backgroundColor: color.hex }}
                                                        title={color.name}
                                                    >
                                                        {isSelected && (
                                                            <span className="text-white text-xs">✓</span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Liste des couleurs sélectionnées */}
                                    {form.colors.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-3 border-t border-neutral-3">
                                            <span className="text-xs font-semibold text-neutral-6 w-full mb-1">
                                                Couleurs sélectionnées :
                                            </span>
                                            {form.colors.map((color, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center gap-2 px-3 py-2 bg-neutral-2 rounded-full"
                                                >
                                                    <div
                                                        className="w-5 h-5 rounded-full border-2 border-neutral-4"
                                                        style={{ backgroundColor: color.hex }}
                                                    />
                                                    <span className="text-xs font-semibold text-neutral-8">{color.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveColor(i)}
                                                        className="cursor-pointer hover:bg-neutral-3 rounded-full p-0.5 transition-colors"
                                                    >
                                                        <X size={12} className="text-neutral-6" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
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

            {/* Modal URL d'image */}
            {showImageUrlModal && (
                <>
                    <div
                        className="fixed inset-0 bg-neutral-8/60 z-60 backdrop-blur-sm"
                        onClick={() => setShowImageUrlModal(false)}
                    />
                    <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
                        <div className="bg-neutral-0 dark:bg-neutral-0 rounded-3 shadow-xl w-full max-w-md p-6">
                            <h3 className="text-sm font-bold font-poppins text-neutral-8 mb-4">
                                Ajouter un média via URL
                            </h3>
                            <InputField
                                label="URL du média (image ou vidéo)"
                                value={tempImageUrl}
                                onChange={(e) => setTempImageUrl(e.target.value)}
                                placeholder="https://exemple.com/media.jpg ou .mp4"
                                hint="Formats acceptés : JPG, PNG, MP4, WEBM, etc."
                            />
                            <div className="flex justify-end gap-3 mt-4">
                                <Button
                                    variant="ghost"
                                    size="normal"
                                    onClick={() => setShowImageUrlModal(false)}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    variant="primary"
                                    size="normal"
                                    onClick={handleAddImageUrl}
                                >
                                    Ajouter
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default ProductFormModal;