import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Trash2, Plus } from 'lucide-react';
import InputField from '../InputField';
import Button from '../Button';
import ProductStatusToggle from './ProductStatusToggle';

// Fonction pour extraire l'ID YouTube
const getYouTubeId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
};

// Fonction pour extraire l'ID Vimeo
const getVimeoId = (url) => {
    const regExp = /vimeo.*\/(\d+)/i;
    const match = url.match(regExp);
    return match ? match[1] : null;
};

// Fonction pour déterminer le type de vidéo
const getVideoType = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('vimeo.com')) return 'vimeo';
    return 'direct'; // URL directe vers un fichier vidéo
};

// Catégories mock — à remplacer par l'API
const MOCK_CATEGORIES = ['Robes', 'Chaussures', 'Sacs', 'Bijoux', 'Chemises', 'Accessoires'];

const EMPTY_FORM = {
    name: '',
    description: '',
    descriptionType: 'text',  // 'text' ou 'video'
    videoUrl: '',             // URL de la vidéo YouTube/Vimeo/externe
    videoFile: null,          // Fichier vidéo local { file, preview }
    category: '',
    price: '',
    salePrice: '',
    stock: '',
    active: true,
    featured: false,
    mainImage: null,
    subImages: [],            // Maintenant infini

    // Nouvelles fonctionnalités
    hasSizes: false,          // Switch pour activer les tailles
    sizes: [],                // ['S', 'M', 'L', 'XL', 'XXL']
    hasColors: false,         // Switch pour activer les couleurs
    colors: [],               // [{ name: 'Rouge', hex: '#FF0000' }, ...]
};

// Calcul automatique du pourcentage de réduction
const calcDiscount = (price, salePrice) => {
    const p = parseFloat(price);
    const s = parseFloat(salePrice);
    if (!p || !s || s >= p) return null;
    return Math.round(((p - s) / p) * 100);
};

// Composant de prévisualisation vidéo
const VideoPreview = ({ videoUrl, videoFile, onRemove }) => {
    const videoType = getVideoType(videoUrl);

    // Si c'est un fichier local
    if (videoFile) {
        return (
            <div className="relative w-full aspect-video rounded-2 overflow-hidden border border-neutral-4 bg-neutral-1">
                <video
                    src={videoFile.preview}
                    controls
                    className="w-full h-full object-contain"
                >
                    Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
                <button
                    type="button"
                    onClick={onRemove}
                    className="absolute top-2 right-2 w-8 h-8 bg-neutral-0/90 rounded-full flex items-center justify-center hover:bg-neutral-0 transition-colors cursor-pointer shadow-lg"
                >
                    <Trash2 size={14} className="text-neutral-8" />
                </button>
            </div>
        );
    }

    // Si c'est YouTube
    if (videoType === 'youtube') {
        const videoId = getYouTubeId(videoUrl);
        if (!videoId) {
            return (
                <div className="w-full aspect-video rounded-2 border border-danger-1 bg-danger-5 flex items-center justify-center">
                    <p className="text-xs text-danger-1 font-semibold">URL YouTube invalide</p>
                </div>
            );
        }

        return (
            <div className="relative w-full aspect-video rounded-2 overflow-hidden border border-neutral-4">
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video preview"
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
                <button
                    type="button"
                    onClick={onRemove}
                    className="absolute top-2 right-2 w-8 h-8 bg-neutral-0/90 rounded-full flex items-center justify-center hover:bg-neutral-0 transition-colors cursor-pointer shadow-lg z-10"
                >
                    <Trash2 size={14} className="text-neutral-8" />
                </button>
            </div>
        );
    }

    // Si c'est Vimeo
    if (videoType === 'vimeo') {
        const videoId = getVimeoId(videoUrl);
        if (!videoId) {
            return (
                <div className="w-full aspect-video rounded-2 border border-danger-1 bg-danger-5 flex items-center justify-center">
                    <p className="text-xs text-danger-1 font-semibold">URL Vimeo invalide</p>
                </div>
            );
        }

        return (
            <div className="relative w-full aspect-video rounded-2 overflow-hidden border border-neutral-4">
                <iframe
                    src={`https://player.vimeo.com/video/${videoId}`}
                    title="Vimeo video preview"
                    className="w-full h-full"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                />
                <button
                    type="button"
                    onClick={onRemove}
                    className="absolute top-2 right-2 w-8 h-8 bg-neutral-0/90 rounded-full flex items-center justify-center hover:bg-neutral-0 transition-colors cursor-pointer shadow-lg z-10"
                >
                    <Trash2 size={14} className="text-neutral-8" />
                </button>
            </div>
        );
    }

    // Si c'est une URL directe
    if (videoType === 'direct') {
        return (
            <div className="relative w-full aspect-video rounded-2 overflow-hidden border border-neutral-4 bg-neutral-1">
                <video
                    src={videoUrl}
                    controls
                    className="w-full h-full object-contain"
                >
                    Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
                <button
                    type="button"
                    onClick={onRemove}
                    className="absolute top-2 right-2 w-8 h-8 bg-neutral-0/90 rounded-full flex items-center justify-center hover:bg-neutral-0 transition-colors cursor-pointer shadow-lg"
                >
                    <Trash2 size={14} className="text-neutral-8" />
                </button>
            </div>
        );
    }

    return null;
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
    const videoFileRef = useRef(null);

    const isEdit = !!product;

    // Pré-remplir le formulaire en mode édition
    useEffect(() => {
        if (open) {
            setForm(product ? { ...EMPTY_FORM, ...product } : EMPTY_FORM);
            setErrors({});
        }
    }, [open, product]);

    // Nettoyer les URLs d'objet créées
    useEffect(() => {
        return () => {
            if (form.videoFile?.preview) {
                URL.revokeObjectURL(form.videoFile.preview);
            }
        };
    }, [form.videoFile]);

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

    // Gestion du fichier vidéo local
    const handleVideoFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Vérifier que c'est bien une vidéo
        if (!file.type.startsWith('video/')) {
            setErrors(prev => ({ ...prev, videoFile: 'Veuillez sélectionner un fichier vidéo valide' }));
            return;
        }

        // Vérifier la taille (max 100MB par exemple)
        const maxSize = 100 * 1024 * 1024; // 100MB
        if (file.size > maxSize) {
            setErrors(prev => ({ ...prev, videoFile: 'Vidéo trop volumineuse (max 100MB)' }));
            return;
        }

        const preview = URL.createObjectURL(file);
        setForm(prev => ({
            ...prev,
            videoFile: { file, preview },
            videoUrl: '' // Réinitialiser l'URL si un fichier est uploadé
        }));

        if (errors.videoFile) setErrors(prev => ({ ...prev, videoFile: '' }));
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

    // Valider l'URL de la vidéo en temps réel
    const isValidVideoUrl = (url) => {
        if (!url) return null; // null = pas encore d'URL
        const type = getVideoType(url);

        if (type === 'youtube') {
            return !!getYouTubeId(url);
        }
        if (type === 'vimeo') {
            return !!getVimeoId(url);
        }
        if (type === 'direct') {
            // Vérifier si l'URL se termine par une extension vidéo
            return /\.(mp4|webm|ogg|mov|avi)$/i.test(url);
        }

        return false;
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

    /* const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Nom requis';
        if (!form.category) e.category = 'Catégorie requise';
        if (!form.price) e.price = 'Prix requis';
        if (!form.stock && form.stock !== 0) e.stock = 'Stock requis';
        if (form.salePrice && parseFloat(form.salePrice) >= parseFloat(form.price)) {
            e.salePrice = 'Le prix réduit doit être inférieur au prix initial';
        }
        if (!form.mainImage) e.mainImage = 'Image principale requise';

        // Validation pour la vidéo
        if (form.descriptionType === 'video' && !form.videoUrl.trim()) {
            e.videoUrl = 'URL de vidéo requise';
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    }; */

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

        // Validation pour la vidéo (URL ou fichier requis si mode vidéo)
        if (form.descriptionType === 'video' && !form.videoUrl.trim() && !form.videoFile) {
            e.videoUrl = 'Veuillez ajouter une vidéo (fichier ou URL)';
        }

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
        formData.append('descriptionType', form.descriptionType);
        formData.append('category', form.category);
        formData.append('price', form.price);
        formData.append('salePrice', form.salePrice);
        formData.append('stock', form.stock);
        formData.append('active', form.active);
        formData.append('featured', form.featured);

        // Ajouter la vidéo
        if (form.descriptionType === 'video') {
            if (form.videoFile) {
                formData.append('videoFile', form.videoFile.file);
            } else if (form.videoUrl) {
                formData.append('videoUrl', form.videoUrl);
            }
        }

        // Ajouter l'image principale
        if (form.mainImage) {
            if (typeof form.mainImage === 'string') {
                formData.append('mainImageUrl', form.mainImage);
            } else {
                formData.append('mainImage', form.mainImage.file);
            }
        }

        // Ajouter les images secondaires
        form.subImages.forEach((img, index) => {
            if (typeof img === 'string') {
                formData.append(`subImageUrl_${index}`, img);
            } else {
                formData.append(`subImage_${index}`, img.file);
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

                            {/* Description avec switch texte/vidéo */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold font-poppins text-neutral-8 dark:text-neutral-8">
                                    Description
                                </label>

                                {/* Switch texte/vidéo */}
                                <div className="flex gap-2 mb-2">
                                    <button
                                        type="button"
                                        onClick={() => setForm(prev => ({ ...prev, descriptionType: 'text' }))}
                                        className={`px-4 py-2 rounded-full cursor-pointer text-xs font-semibold font-poppins transition-all duration-200 ${form.descriptionType === 'text'
                                            ? 'bg-primary-1 text-white'
                                            : 'bg-neutral-2 text-neutral-6 hover:bg-neutral-3'
                                            }`}
                                    >
                                        Texte
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setForm(prev => ({ ...prev, descriptionType: 'video' }))}
                                        className={`px-4 py-2 rounded-full cursor-pointer text-xs font-semibold font-poppins transition-all duration-200 ${form.descriptionType === 'video'
                                            ? 'bg-primary-1 text-white'
                                            : 'bg-neutral-2 text-neutral-6 hover:bg-neutral-3'
                                            }`}
                                    >
                                        Vidéo
                                    </button>
                                </div>

                                {form.descriptionType === 'text' ? (
                                    <InputField
                                        name="description"
                                        type="textarea"
                                        value={form.description}
                                        onChange={handleChange}
                                        placeholder="Décrivez le produit..."
                                    />
                                ) : (
                                    <div className="flex flex-col gap-3">

                                        {/* Preview de la vidéo si elle existe */}
                                        {(form.videoFile || form.videoUrl) && (
                                            <VideoPreview
                                                videoUrl={form.videoUrl}
                                                videoFile={form.videoFile}
                                                onRemove={() => setForm(prev => ({ ...prev, videoFile: null, videoUrl: '' }))}
                                            />
                                        )}

                                        {/* Options d'ajout de vidéo (seulement si aucune vidéo n'est présente) */}
                                        {!form.videoFile && !form.videoUrl && (
                                            <>
                                                {/* Boutons d'upload */}
                                                <div className="flex gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => videoFileRef.current?.click()}
                                                        className="
                                flex-1 h-32 rounded-2
                                border-2 border-dashed border-neutral-4 dark:border-neutral-4
                                flex flex-col items-center justify-center gap-2
                                text-neutral-6 hover:border-primary-1 hover:text-primary-1
                                transition-colors duration-200 cursor-pointer
                            "
                                                    >
                                                        <Upload size={24} />
                                                        <span className="text-xs font-semibold font-poppins">Fichier vidéo</span>
                                                        <span className="text-[11px] font-poppins text-neutral-5">
                                                            MP4, AVI, MOV (max 100MB)
                                                        </span>
                                                    </button>

                                                    <div className="flex items-center text-neutral-5">
                                                        <span className="text-xs font-semibold">OU</span>
                                                    </div>

                                                    <div className="flex-1 h-32 rounded-2 border-2 border-dashed border-neutral-4 dark:border-neutral-4 flex flex-col items-center justify-center gap-2 p-4">
                                                        <svg className="w-6 h-6 text-neutral-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                        </svg>
                                                        <span className="text-xs font-semibold font-poppins text-neutral-6 text-center">
                                                            URL vidéo
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Input URL (toujours visible) */}
                                                <div className="relative">
                                                    <InputField
                                                        name="videoUrl"
                                                        value={form.videoUrl}
                                                        onChange={handleChange}
                                                        placeholder="https://www.youtube.com/watch?v=... ou URL directe"
                                                        hint="YouTube, Vimeo, ou lien direct vers une vidéo"
                                                    />
                                                    {form.videoUrl && (
                                                        <div className="absolute right-3 top-9">
                                                            {isValidVideoUrl(form.videoUrl) ? (
                                                                <span className="text-success-1 text-xs">✓ URL valide</span>
                                                            ) : (
                                                                <span className="text-danger-1 text-xs">✗ URL invalide</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Input file caché */}
                                                <input
                                                    ref={videoFileRef}
                                                    type="file"
                                                    accept="video/*"
                                                    className="hidden"
                                                    onChange={handleVideoFile}
                                                />

                                                {errors.videoFile && (
                                                    <p className="text-xs text-danger-1">{errors.videoFile}</p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

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

                            {/* Images secondaires (illimitées) */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold font-poppins text-neutral-8 dark:text-neutral-8">
                                    Images secondaires
                                    <span className="text-neutral-6 font-normal ml-1">({form.subImages.length})</span>
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {form.subImages.map((img, i) => (
                                        <div key={i} className="relative w-20 h-20 rounded-2 overflow-hidden border border-neutral-4 group">
                                            <img
                                                src={typeof img === 'string' ? img : img.preview}
                                                alt={`sec-${i}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeSubImage(i)}
                                                className="absolute inset-0 bg-neutral-8/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                                            >
                                                <Trash2 size={14} className="text-white" />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Bouton ajouter fichier */}
                                    <button
                                        type="button"
                                        onClick={() => subImageRef.current?.click()}
                                        className=" w-20 h-20 rounded-2 border-2 border-dashed border-neutral-4 dark:border-neutral-4 flex flex-col items-center justify-center gap-1 text-neutral-6 hover:border-primary-1 hover:text-primary-1 transition-colors duration-200 cursor-pointer ">
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
                                        className="w-20 h-20 rounded-2 border-2 border-dashed border-neutral-4 dark:border-neutral-4 flex flex-col items-center justify-center gap-1 text-neutral-6 hover:border-primary-1 hover:text-primary-1       transition-colors duration-200 cursor-pointer">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                        <span className="text-[10px] font-poppins">URL</span>
                                    </button>
                                </div>
                                <input ref={subImageRef} type="file" accept="image/*" multiple className="hidden" onChange={handleSubImages} />
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
                                    {/* Formulaire d'ajout de couleur */}
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            id="colorName"
                                            placeholder="Nom de la couleur (ex: Rouge)"
                                            className="flex-1 rounded-md border border-neutral-5 dark:border-neutral-5 bg-neutral-0 dark:bg-neutral-0 px-4 py-2 text-small text-neutral-8 dark:text-neutral-8 font-poppins outline-none focus:border-primary-1 focus:ring-2 focus:ring-primary-5"
                                        />
                                        <input
                                            type="color"
                                            id="colorHex"
                                            defaultValue="#000000"
                                            className="w-15 h-10 p-0 rounded-md border border-neutral-5 cursor-pointer"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const name = document.getElementById('colorName').value;
                                                const hex = document.getElementById('colorHex').value;
                                                if (name.trim()) {
                                                    handleAddColor(name, hex);
                                                    document.getElementById('colorName').value = '';
                                                    document.getElementById('colorHex').value = '#000000';
                                                }
                                            }}
                                            className="px-4 py-2 bg-primary-1 text-white rounded-full text-xs font-semibold hover:bg-primary-2 transition-colors cursor-pointer"
                                        >
                                            Ajouter
                                        </button>
                                    </div>

                                    {/* Liste des couleurs ajoutées */}
                                    {form.colors.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-3">
                                            {form.colors.map((color, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center gap-2 px-3 py-2 bg-neutral-2 rounded-full"
                                                >
                                                    <div
                                                        className="w-5 h-5 rounded-full border border-neutral-4"
                                                        style={{ backgroundColor: color.hex }}
                                                    />
                                                    <span className="text-xs font-semibold text-neutral-8">{color.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveColor(i)}
                                                        className="cursor-pointer"
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
                                Ajouter une image via URL
                            </h3>
                            <InputField
                                label="URL de l'image"
                                value={tempImageUrl}
                                onChange={(e) => setTempImageUrl(e.target.value)}
                                placeholder="https://exemple.com/image.jpg"
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