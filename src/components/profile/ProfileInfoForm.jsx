import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import InputField from '../InputField';
import Button from '../Button';

/*
  Props :
  - profile  : object
  - onSave   : (updatedProfile) => void
*/
const ProfileInfoForm = ({ profile, onSave }) => {
    const [form, setForm] = useState({
        firstName: profile.firstName ?? '',
        lastName: profile.lastName ?? '',
        email: profile.email ?? '',
        phone: profile.phone ?? '',
        city: profile.city ?? '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
    const validatePhone = (p) => /^[+\d\s]{8,}$/.test(p);

    const validate = () => {
        const e = {};
        if (!form.firstName.trim()) e.firstName = 'Prénom requis';
        if (!form.lastName.trim()) e.lastName = 'Nom requis';
        if (!form.email.trim()) e.email = 'Email requis';
        else if (!validateEmail(form.email)) e.email = 'Email invalide';
        if (form.phone && !validatePhone(form.phone)) e.phone = 'Numéro invalide';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setLoading(true);
        // TODO : appel API PATCH /admin/profile
        await new Promise(r => setTimeout(r, 1200));
        setLoading(false);
        onSave?.(form);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="
            bg-neutral-0 dark:bg-neutral-0
            border border-neutral-4 dark:border-neutral-4
            rounded-md p-5 flex flex-col gap-5
        ">
            {/* En-tête section */}
            <div className="flex items-center gap-2 pb-1 border-b border-neutral-4 dark:border-neutral-4">
                <div className="w-7 h-7 rounded-md bg-primary-5 flex items-center justify-center">
                    <User size={14} className="text-primary-1" />
                </div>
                <div>
                    <p className="text-xs font-bold font-poppins text-neutral-8 dark:text-neutral-8">
                        Informations personnelles
                    </p>
                    <p className="text-[11px] font-poppins text-neutral-5">
                        Modifiez vos informations de profil
                    </p>
                </div>
            </div>

            {/* Champs modifiables */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                    label="Prénom"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Ex: Aminata"
                    error={errors.firstName}
                    required
                />
                <InputField
                    label="Nom"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Ex: Koné"
                    error={errors.lastName}
                    required
                />
                <InputField
                    label="Adresse email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Ex: admin@tokia-loh.com"
                    error={errors.email}
                    required
                />
                <InputField
                    label="Numéro de téléphone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Ex: +225 07 00 11 22"
                    error={errors.phone}
                />
                <div className="sm:col-span-2">
                    <InputField
                        label="Ville"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="Ex: Abidjan"
                    />
                </div>
            </div>

            {/* Champ lecture seule : date d'inscription */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold font-poppins text-neutral-6">
                    Date d'inscription
                </label>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-2 dark:bg-neutral-2 border border-neutral-4 dark:border-neutral-4">
                    <Lock size={13} className="text-neutral-5 shrink-0" />
                    <span className="text-xs font-poppins text-neutral-6">
                        {profile.registeredAt}
                    </span>
                    <span className="ml-auto text-[11px] font-poppins text-neutral-5 italic">
                        Non modifiable
                    </span>
                </div>
            </div>

            {/* Sauvegarder */}
            <div className="flex items-center justify-end gap-3 pt-1">
                {saved && (
                    <span className="text-xs font-poppins text-success-1 font-medium">
                        ✓ Informations mises à jour
                    </span>
                )}
                <Button variant="primary" size="normal" loading={loading} onClick={handleSubmit}>
                    Sauvegarder
                </Button>
            </div>
        </div>
    );
};

export default ProfileInfoForm;