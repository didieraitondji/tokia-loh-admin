import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import InputField from '../InputField';
import Button from '../Button';
import ProductStatusToggle from '../products/ProductStatusToggle';

const EMPTY_FORM = {
    name: '',
    description: '',
    order: '',
    active: true,
    image: null,
    imagePreview: null
};

const CategoryFormModal = ({ open, onClose, category = null, onSave }) => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const isEdit = !!category;

    // Pré-remplir en mode édition
    useEffect(() => {
        if (open) {
            if (category) {
                setForm({
                    ...EMPTY_FORM,
                    ...category,
                    imagePreview: category.imageUrl || null // Si l'API retourne une URL
                });
            } else {
                setForm(EMPTY_FORM);
            }
            setErrors({});
        }
    }, [open, category]);

    // useEffect pour bloquer le scroll
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Vérifier le type de fichier
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({ ...prev, image: 'Veuillez sélectionner une image valide' }));
                return;
            }

            // Vérifier la taille (ex: max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, image: 'Image trop volumineuse (max 5MB)' }));
                return;
            }

            // Créer une preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm(prev => ({
                    ...prev,
                    image: file,
                    imagePreview: reader.result
                }));
            };
            reader.readAsDataURL(file);

            if (errors.image) setErrors(prev => ({ ...prev, image: '' }));
        }
    };

    const handleRemoveImage = () => {
        setForm(prev => ({ ...prev, image: null, imagePreview: null }));
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Nom de catégorie requis';
        if (form.order !== '' && (isNaN(form.order) || parseInt(form.order) < 1)) {
            e.order = "L'ordre doit être un nombre positif";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    /* const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        // TODO : appel API create ou update
        await new Promise(r => setTimeout(r, 1200));
        setLoading(false);
        onSave?.(form);
        onClose();
    }; */

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        // Créer un FormData pour envoyer le fichier
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('description', form.description);
        formData.append('order', form.order);
        formData.append('active', form.active);

        if (form.image) {
            formData.append('image', form.image);
        }

        // TODO : Remplacer par votre appel API réel
        // await axios.post('/api/categories', formData, {
        //     headers: { 'Content-Type': 'multipart/form-data' }
        // });

        await new Promise(r => setTimeout(r, 1200));
        setLoading(false);
        onSave?.(form);
        onClose();
    };

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-neutral-8/40 dark:bg-neutral-2/60 z-40 backdrop-blur-xs"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="
                    bg-neutral-0 dark:bg-neutral-0
                    rounded-3 shadow-xl
                    w-full max-w-md max-h-[90vh]
                    flex flex-col overflow-hidden rounded-md
                ">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-4 dark:border-neutral-4">
                        <h2 className="text-sm font-bold font-poppins text-neutral-8 dark:text-neutral-8">
                            {isEdit ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-3 dark:hover:bg-neutral-3 text-neutral-6 hover:text-neutral-8 transition-colors cursor-pointer"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4 overflow-auto">

                        <InputField
                            label="Nom de la catégorie"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Ex: Robes"
                            error={errors.name}
                            required
                        />

                        <InputField
                            label="Description"
                            name="description"
                            type="textarea"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Décrivez cette catégorie..."
                        />

                        {/* Upload d'image */}
                        <div>
                            <label className="block text-xs font-semibold font-poppins text-neutral-8 dark:text-neutral-8 mb-2">
                                Image de la catégorie
                            </label>

                            {form.imagePreview ? (
                                // Preview de l'image
                                <div className="relative w-full h-40 rounded-2 overflow-hidden border border-neutral-4 dark:border-neutral-4">
                                    <img
                                        src={form.imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-2 right-2 w-7 h-7 bg-neutral-0/90 rounded-full flex items-center justify-center hover:bg-neutral-0 transition-colors"
                                    >
                                        <X size={14} className="text-neutral-8" />
                                    </button>
                                </div>
                            ) : (
                                // Zone d'upload
                                <label className="w-full h-40 border-2 border-dashed border-neutral-4 dark:border-neutral-4 rounded-2 flex flex-col items-center justify-center gap-2 hover:border-neutral-6 hover:bg-neutral-2 dark:hover:bg-neutral-2            transition-colors cursor-pointer">
                                    <svg className="w-8 h-8 text-neutral-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span className="text-xs font-poppins text-neutral-6">
                                        Cliquer pour ajouter une image
                                    </span>
                                    <span className="text-[11px] font-poppins text-neutral-5">
                                        PNG, JPG jusqu'à 5MB
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            )}

                            {errors.image && (
                                <p className="text-[11px] font-poppins text-red-600 mt-1">
                                    {errors.image}
                                </p>
                            )}
                        </div>

                        <InputField
                            label="Ordre d'affichage"
                            name="order"
                            type="number"
                            value={form.order}
                            onChange={handleChange}
                            placeholder="Ex: 1"
                            hint="Laissez vide pour placer en dernier"
                            error={errors.order}
                        />

                        {/* Statut */}
                        <div className="flex items-center justify-between py-1">
                            <div>
                                <p className="text-xs font-semibold font-poppins text-neutral-8 dark:text-neutral-8">
                                    Catégorie active
                                </p>
                                <p className="text-[11px] font-poppins text-neutral-6">
                                    Visible sur la boutique
                                </p>
                            </div>
                            <ProductStatusToggle
                                active={form.active}
                                onChange={val => setForm(prev => ({ ...prev, active: val }))}
                            />
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-4 dark:border-neutral-4">
                        <Button variant="ghost" size="normal" onClick={onClose} type="button">
                            Annuler
                        </Button>
                        <Button variant="primary" size="normal" loading={loading} onClick={handleSubmit}>
                            {isEdit ? 'Enregistrer' : 'Créer la catégorie'}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CategoryFormModal;