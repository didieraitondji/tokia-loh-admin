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
};

const CategoryFormModal = ({ open, onClose, category = null, onSave }) => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const isEdit = !!category;

    // Pré-remplir en mode édition
    useEffect(() => {
        if (open) {
            setForm(category ? { ...EMPTY_FORM, ...category } : EMPTY_FORM);
            setErrors({});
        }
    }, [open, category]);

    // Bloquer le scroll
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

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Nom de catégorie requis';
        if (form.order !== '' && (isNaN(form.order) || parseInt(form.order) < 1)) {
            e.order = "L'ordre doit être un nombre positif";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        // TODO : appel API create ou update
        await new Promise(r => setTimeout(r, 1200));
        setLoading(false);
        onSave?.(form);
        onClose();
    };

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
                    w-full max-w-md
                    flex flex-col overflow-hidden
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
                    <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">

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