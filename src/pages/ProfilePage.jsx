import React, { useState } from 'react';
import { User, Phone, Mail, Edit2, Check, X, Shield, CheckCircle, Key } from 'lucide-react';

const ProfilePage = ({ user, onUpdateProfile }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phone: user?.phone || '',
        email: user?.email || ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdateProfile(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            phone: user?.phone || '',
            email: user?.email || ''
        });
        setIsEditing(false);
    };

    // Générer les initiales pour l'avatar
    const getInitials = () => {
        const first = formData.firstName?.charAt(0) || '';
        const last = formData.lastName?.charAt(0) || '';
        return (first + last).toUpperCase();
    };

    return (
        <div className="flex flex-col gap-6">
            {/* ── Header ── */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-h5 font-bold font-poppins text-neutral-8 dark:text-neutral-8">
                        Mon Profil
                    </h1>
                    <p className="text-xs font-poppins text-neutral-6 dark:text-neutral-6 mt-0.5">
                        Gérez vos informations personnelles
                    </p>
                </div>
            </div>

            {/* ── Card Avatar & Infos principales ── */}
            <div className="bg-neutral-0 dark:bg-neutral-0 border border-neutral-4 dark:border-neutral-4 rounded-3 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Avatar */}
                    <div className="">
                        <div className="w-24 h-24 rounded-full from-primary-1 to-secondary-1 flex items-center justify-center shadow-lg">
                            <span className="text-3xl font-bold font-poppins text-neutral-0">
                                {getInitials()}
                            </span>
                        </div>
                    </div>

                    {/* Infos */}
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                            <div>
                                <h2 className="text-h6 font-bold font-poppins text-neutral-8 dark:text-neutral-8 mb-2">
                                    {formData.firstName} {formData.lastName}
                                </h2>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-6 border border-primary-4">
                                    <Shield size={14} className="text-primary-1" />
                                    <span className="text-xs font-semibold font-poppins text-primary-1">
                                        Administrateur
                                    </span>
                                </div>
                            </div>

                            {/* Bouton modifier */}
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-2 bg-primary-1 text-neutral-0 font-medium text-sm font-poppins hover:bg-primary-2 transition-colors"
                                >
                                    <Edit2 size={16} />
                                    Modifier
                                </button>
                            )}
                        </div>

                        {/* Stats rapides */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="flex items-center gap-3 px-4 py-3 rounded-2 bg-success-6 border border-success-4">
                                <CheckCircle size={18} className="text-success-1" />
                                <div>
                                    <p className="text-xs font-medium font-poppins text-neutral-6 dark:text-neutral-6">
                                        Statut
                                    </p>
                                    <p className="text-sm font-semibold font-poppins text-neutral-8 dark:text-neutral-8">
                                        Compte actif
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 px-4 py-3 rounded-2 bg-primary-6 border border-primary-4">
                                <Shield size={18} className="text-primary-1" />
                                <div>
                                    <p className="text-xs font-medium font-poppins text-neutral-6 dark:text-neutral-6">
                                        Rôle
                                    </p>
                                    <p className="text-sm font-semibold font-poppins text-neutral-8 dark:text-neutral-8">
                                        Administrateur
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 px-4 py-3 rounded-2 bg-secondary-6 border border-secondary-4">
                                <Key size={18} className="text-secondary-1" />
                                <div>
                                    <p className="text-xs font-medium font-poppins text-neutral-6 dark:text-neutral-6">
                                        Accès
                                    </p>
                                    <p className="text-sm font-semibold font-poppins text-neutral-8 dark:text-neutral-8">
                                        Complet
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Formulaire d'édition ── */}
            <div className="bg-neutral-0 dark:bg-neutral-0 border border-neutral-4 dark:border-neutral-4 rounded-3 p-6 hover:shadow-md transition-shadow duration-200">
                <h3 className="text-base font-semibold font-poppins text-neutral-8 dark:text-neutral-8 mb-5">
                    Informations personnelles
                </h3>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Prénom */}
                        <div>
                            <label className="block text-xs font-semibold font-poppins text-neutral-7 dark:text-neutral-7 mb-2">
                                Prénom
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-6">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-2 border border-neutral-4 bg-neutral-0 text-neutral-8 text-sm font-poppins focus:outline-none focus:border-primary-1 focus:ring-1 focus:ring-primary-1 disabled:bg-neutral-2 disabled:cursor-not-allowed transition-colors"
                                    placeholder="Votre prénom"
                                />
                            </div>
                        </div>

                        {/* Nom */}
                        <div>
                            <label className="block text-xs font-semibold font-poppins text-neutral-7 dark:text-neutral-7 mb-2">
                                Nom
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-6">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-2 border border-neutral-4 bg-neutral-0 text-neutral-8 text-sm font-poppins focus:outline-none focus:border-primary-1 focus:ring-1 focus:ring-primary-1 disabled:bg-neutral-2 disabled:cursor-not-allowed transition-colors"
                                    placeholder="Votre nom"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold font-poppins text-neutral-7 dark:text-neutral-7 mb-2">
                                Adresse email
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-6">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-2 border border-neutral-4 bg-neutral-0 text-neutral-8 text-sm font-poppins focus:outline-none focus:border-primary-1 focus:ring-1 focus:ring-primary-1 disabled:bg-neutral-2 disabled:cursor-not-allowed transition-colors"
                                    placeholder="email@exemple.com"
                                />
                            </div>
                        </div>

                        {/* Téléphone */}
                        <div>
                            <label className="block text-xs font-semibold font-poppins text-neutral-7 dark:text-neutral-7 mb-2">
                                Numéro de téléphone
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-6">
                                    <Phone size={18} />
                                </div>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-2 border border-neutral-4 bg-neutral-0 text-neutral-8 text-sm font-poppins focus:outline-none focus:border-primary-1 focus:ring-1 focus:ring-primary-1 disabled:bg-neutral-2 disabled:cursor-not-allowed transition-colors"
                                    placeholder="+229 XX XX XX XX"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Boutons d'action (visible uniquement en mode édition) */}
                    {isEditing && (
                        <div className="flex gap-3 justify-end mt-6 pt-5 border-t border-neutral-4">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-2 border border-neutral-4 text-neutral-8 font-medium text-sm font-poppins hover:bg-neutral-2 transition-colors"
                            >
                                <X size={16} />
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-2 bg-primary-1 text-neutral-0 font-medium text-sm font-poppins hover:bg-primary-2 transition-colors"
                            >
                                <Check size={16} />
                                Enregistrer
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;