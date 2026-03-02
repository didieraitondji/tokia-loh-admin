import React, { useState, useEffect } from 'react';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileInfoForm from '../components/profile/ProfileInfoForm';
import ProfilePasswordForm from '../components/profile/ProfilePasswordForm';

// Données mock admin connecté — à remplacer par le contexte Auth
const MOCK_ADMIN = {
    firstName: 'Admin',
    lastName: 'Tokia',
    email: 'admin@tokia-loh.com',
    phone: '+225 07 00 11 22',
    city: 'Abidjan',
    registeredAt: '12/01/2025',
    avatar: null,
};

const ProfilePage = () => {
    const [profile, setProfile] = useState(MOCK_ADMIN);

    useEffect(() => {
        document.title = 'Admin Tokia-Loh | Mon profil';
    }, []);

    const handleAvatarChange = (avatar) => {
        setProfile(prev => ({ ...prev, avatar }));
        // TODO : appel API upload avatar
    };

    const handleInfoSave = (updatedInfo) => {
        setProfile(prev => ({ ...prev, ...updatedInfo }));
        // TODO : appel API PATCH /admin/profile
    };

    return (
        <div className="flex flex-col gap-6 max-w-2xl">

            {/* ── En-tête page ── */}
            <div>
                <h1 className="text-h5 font-bold font-poppins text-neutral-8 dark:text-neutral-8">
                    Mon profil
                </h1>
                <p className="text-xs font-poppins text-neutral-6 dark:text-neutral-6 mt-0.5">
                    Gérez vos informations personnelles et votre sécurité
                </p>
            </div>

            {/* ── Header profil ── */}
            <ProfileHeader
                profile={profile}
                onAvatarChange={handleAvatarChange}
            />

            {/* ── Formulaire infos ── */}
            <ProfileInfoForm
                profile={profile}
                onSave={handleInfoSave}
            />

            {/* ── Formulaire mot de passe ── */}
            <ProfilePasswordForm />
        </div>
    );
};

export default ProfilePage;