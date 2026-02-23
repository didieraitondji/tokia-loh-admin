import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Trash2, Eye, MessageCircle } from 'lucide-react';
import InputField from '../InputField';
import Button from '../Button';
import ProductStatusToggle from '../products/ProductStatusToggle';
import AdChannelBadge, { CHANNEL_CONFIG } from './AdChannelBadge';

// Produits mock — à remplacer par l'API
const MOCK_PRODUCTS = [
    { id: 1, name: 'Robe Ankara Wax' },
    { id: 2, name: 'Sandales tressées' },
    { id: 3, name: 'Sac en raphia naturel' },
    { id: 4, name: 'Chemise bazin brodée' },
    { id: 5, name: 'Bracelet perles coco' },
    { id: 6, name: 'Collier wax multicolor' },
];

// Portée estimée par canal (mock)
const REACH_BY_CHANNEL = {
    WhatsApp: 3200,
    Facebook: 8500,
    Instagram: 6100,
    SMS: 4800,
    Email: 2100,
};

const PALETTE = ['#0EA5E9', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4'];

const CHANNELS = Object.keys(CHANNEL_CONFIG);

const EMPTY_FORM = {
    name: '',
    channels: [],
    productId: '',
    productName: '',
    message: '',
    color: '#0EA5E9',
    image: null,
    budget: '',
    dateFrom: '',
    dateTo: '',
    active: false,
    estimatedReach: 0,
    convRate: 2.5,
};

// Bulle WhatsApp inline (aperçu dans le formulaire)
const InlineWhatsAppPreview = ({ message, productName }) => (
    <div className="bg-[#ECE5DD] dark:bg-[#0d1418] rounded-2 p-3">
        <p className="text-[10px] font-poppins text-neutral-5 mb-2">Aperçu WhatsApp</p>
        <div className="bg-white dark:bg-[#1f2c34] rounded-2 rounded-tl-none px-3 py-2 max-w-[85%] shadow-sm">
            {productName && (
                <p className="text-[11px] font-semibold font-poppins text-[#075E54] mb-1">🛍️ {productName}</p>
            )}
            <p className="text-xs font-poppins text-neutral-8 dark:text-neutral-8 whitespace-pre-wrap leading-relaxed">
                {message || 'Votre message apparaîtra ici...'}
            </p>
            <p className="text-[10px] text-neutral-5 text-right mt-1">
                {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} ✓✓
            </p>
        </div>
    </div>
);

const AdCampaignForm = ({ open, onClose, campaign = null, onSave }) => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const imageRef = useRef(null);

    const isEdit = !!campaign;

    useEffect(() => {
        if (open) {
            setForm(campaign ? { ...EMPTY_FORM, ...campaign } : EMPTY_FORM);
            setErrors({});
            setShowPreview(false);
        }
    }, [open, campaign]);

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

    // Toggle canal
    const toggleChannel = (channel) => {
        setForm(prev => {
            const channels = prev.channels.includes(channel)
                ? prev.channels.filter(c => c !== channel)
                : [...prev.channels, channel];
            // Recalculer la portée estimée
            const estimatedReach = channels.reduce((acc, c) => acc + (REACH_BY_CHANNEL[c] || 0), 0);
            return { ...prev, channels, estimatedReach };
        });
        if (errors.channels) setErrors(prev => ({ ...prev, channels: '' }));
    };

    // Sélection produit
    const handleProduct = (e) => {
        const id = e.target.value;
        const prod = MOCK_PRODUCTS.find(p => String(p.id) === id);
        setForm(prev => ({ ...prev, productId: id, productName: prod?.name ?? '' }));
    };

    // Upload image
    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const preview = URL.createObjectURL(file);
        setForm(prev => ({ ...prev, image: { file, preview } }));
    };

    // Validation
    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Nom de la campagne requis';
        if (!form.channels.length) e.channels = 'Sélectionnez au moins un canal';
        if (!form.message.trim()) e.message = 'Message publicitaire requis';
        if (!form.dateFrom) e.dateFrom = 'Date de début requise';
        if (!form.dateTo) e.dateTo = 'Date de fin requise';
        if (form.dateFrom && form.dateTo && form.dateFrom > form.dateTo) {
            e.dateTo = 'La date de fin doit être après le début';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setLoading(true);
        await new Promise(r => setTimeout(r, 1200));
        setLoading(false);
        onSave?.({
            ...form,
            id: campaign?.id ?? Date.now(),
            status: form.active ? 'Active' : 'Brouillon',
        });
        onClose();
    };

    const hasWhatsApp = form.channels.includes('WhatsApp');

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-neutral-8/40 dark:bg-neutral-8/60 z-40 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="
                    bg-neutral-0 dark:bg-neutral-0
                    rounded-3 shadow-xl
                    w-full max-w-2xl max-h-[92vh]
                    flex flex-col overflow-hidden
                ">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-4 dark:border-neutral-4 shrink-0">
                        <h2 className="text-sm font-bold font-poppins text-neutral-8 dark:text-neutral-8">
                            {isEdit ? 'Modifier la campagne' : 'Nouvelle campagne publicitaire'}
                        </h2>
                        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-3 dark:hover:bg-neutral-3 text-neutral-6 hover:text-neutral-8 transition-colors cursor-pointer">
                            <X size={16} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-6">

                        {/* Infos campagne */}
                        <div className="flex flex-col gap-4">
                            <p className="text-xs font-semibold font-poppins text-neutral-6 uppercase tracking-wide">Informations générales</p>

                            <InputField
                                label="Nom de la campagne"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Ex: Soldes été 2025 — Robes"
                                error={errors.name}
                                required
                            />

                            {/* Produit mis en avant */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold font-poppins text-neutral-8 dark:text-neutral-8">
                                    Produit mis en avant
                                </label>
                                <select
                                    name="productId"
                                    value={form.productId}
                                    onChange={handleProduct}
                                    className="
                                        w-full rounded-full border border-neutral-5 dark:border-neutral-5
                                        bg-neutral-0 dark:bg-neutral-0
                                        px-4 py-2.5 text-xs font-poppins text-neutral-8 dark:text-neutral-8
                                        outline-none focus:border-primary-1 focus:ring-2 focus:ring-primary-5
                                        transition-all cursor-pointer
                                    "
                                >
                                    <option value="">Aucun produit spécifique</option>
                                    {MOCK_PRODUCTS.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Canaux */}
                        <div className="flex flex-col gap-3">
                            <p className="text-xs font-semibold font-poppins text-neutral-6 uppercase tracking-wide">
                                Canaux de diffusion <span className="text-danger-1">*</span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {CHANNELS.map(ch => {
                                    const selected = form.channels.includes(ch);
                                    return (
                                        <button
                                            key={ch}
                                            type="button"
                                            onClick={() => toggleChannel(ch)}
                                            className={`
                                                flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold font-poppins
                                                border-2 transition-all duration-200 cursor-pointer
                                                ${selected
                                                    ? 'border-primary-1 bg-primary-5 text-primary-1'
                                                    : 'border-neutral-4 text-neutral-6 hover:border-primary-3'
                                                }
                                            `}
                                        >
                                            <AdChannelBadge channel={ch} size="sm" />
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.channels && <p className="text-xs text-danger-1">{errors.channels}</p>}

                            {/* Portée estimée */}
                            {form.estimatedReach > 0 && (
                                <div className="flex items-center gap-2 bg-success-2 rounded-2 px-3 py-2">
                                    <span className="text-xs font-poppins font-medium text-success-1">
                                        👥 Portée estimée : ~{form.estimatedReach.toLocaleString('fr-FR')} personnes
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Message publicitaire */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold font-poppins text-neutral-6 uppercase tracking-wide">
                                    Message publicitaire <span className="text-danger-1">*</span>
                                </p>
                                {hasWhatsApp && (
                                    <button
                                        type="button"
                                        onClick={() => setShowPreview(v => !v)}
                                        className="flex items-center gap-1 text-[11px] font-poppins font-medium text-[#16a34a] hover:underline cursor-pointer"
                                    >
                                        <Eye size={12} />
                                        {showPreview ? 'Masquer l\'aperçu' : 'Aperçu WhatsApp'}
                                    </button>
                                )}
                            </div>

                            <InputField
                                name="message"
                                type="textarea"
                                value={form.message}
                                onChange={handleChange}
                                placeholder="Rédigez votre message publicitaire..."
                                error={errors.message}
                            />

                            {/* Aperçu WhatsApp inline */}
                            {showPreview && hasWhatsApp && (
                                <InlineWhatsAppPreview
                                    message={form.message}
                                    productName={form.productName}
                                />
                            )}
                        </div>

                        {/* Visuel */}
                        <div className="flex flex-col gap-3">
                            <p className="text-xs font-semibold font-poppins text-neutral-6 uppercase tracking-wide">Visuel</p>

                            <div className="flex items-start gap-4 flex-wrap">
                                {/* Couleur de fond */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-poppins text-neutral-6">Couleur d'accentuation</label>
                                    <div className="flex items-center gap-2">
                                        {PALETTE.map(col => (
                                            <button
                                                key={col}
                                                type="button"
                                                onClick={() => setForm(prev => ({ ...prev, color: col }))}
                                                className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${form.color === col ? 'border-neutral-8 scale-110' : 'border-transparent hover:scale-105'}`}
                                                style={{ backgroundColor: col }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Upload image */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-poppins text-neutral-6">Image (optionnel)</label>
                                    {form.image ? (
                                        <div className="relative w-16 h-16 rounded-2 overflow-hidden border border-neutral-4 group">
                                            <img src={form.image.preview ?? form.image} alt="visuel" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setForm(prev => ({ ...prev, image: null }))}
                                                className="absolute inset-0 bg-neutral-8/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                                            >
                                                <Trash2 size={14} className="text-white" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => imageRef.current?.click()}
                                            className="w-16 h-16 rounded-2 border-2 border-dashed border-neutral-4 flex flex-col items-center justify-center gap-1 text-neutral-6 hover:border-primary-1 hover:text-primary-1 transition-colors cursor-pointer"
                                        >
                                            <Upload size={14} />
                                        </button>
                                    )}
                                    <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
                                </div>
                            </div>
                        </div>

                        {/* Budget + dates */}
                        <div className="flex flex-col gap-4">
                            <p className="text-xs font-semibold font-poppins text-neutral-6 uppercase tracking-wide">Budget & Période</p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <InputField
                                    label="Budget alloué (F)"
                                    name="budget"
                                    type="number"
                                    value={form.budget}
                                    onChange={handleChange}
                                    placeholder="Ex: 50000"
                                    error={errors.budget}
                                />
                                <InputField
                                    label="Date de début"
                                    name="dateFrom"
                                    type="date"
                                    value={form.dateFrom}
                                    onChange={handleChange}
                                    error={errors.dateFrom}
                                    required
                                />
                                <InputField
                                    label="Date de fin"
                                    name="dateTo"
                                    type="date"
                                    value={form.dateTo}
                                    onChange={handleChange}
                                    error={errors.dateTo}
                                    required
                                />
                            </div>
                        </div>

                        {/* Statut */}
                        <div className="flex items-center justify-between py-1">
                            <div>
                                <p className="text-xs font-semibold font-poppins text-neutral-8 dark:text-neutral-8">Activer immédiatement</p>
                                <p className="text-[11px] font-poppins text-neutral-5">Sinon, la campagne sera sauvegardée en brouillon</p>
                            </div>
                            <ProductStatusToggle
                                active={form.active}
                                onChange={val => setForm(prev => ({ ...prev, active: val }))}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-4 dark:border-neutral-4 shrink-0">
                        <Button variant="ghost" size="normal" onClick={onClose}>Annuler</Button>
                        <Button variant="primary" size="normal" loading={loading} onClick={handleSubmit}>
                            {isEdit ? 'Enregistrer' : 'Créer la campagne'}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdCampaignForm;