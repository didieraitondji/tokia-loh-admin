import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Shield, Mail, User, AlertCircle } from 'lucide-react';
import Button from '../Button';

const SettingsAdminsManager = () => {
    const [admins, setAdmins] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // Charger les admins au montage
    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admins');
            const data = await response.json();
            setAdmins(data);
        } catch (err) {
            setError('Erreur lors du chargement des administrateurs');
        } finally {
            setLoading(false);
        }
    };

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
            setError('Tous les champs sont requis');
            return;
        }

        try {
            const response = await fetch('/api/admins', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAdmin)
            });

            if (!response.ok) throw new Error('Erreur lors de la création');

            const createdAdmin = await response.json();
            setAdmins([...admins, createdAdmin]);
            setNewAdmin({ name: '', email: '', password: '' });
            setIsAdding(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteAdmin = async (adminId) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet administrateur ?')) return;

        try {
            const response = await fetch(`/api/admins/${adminId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Erreur lors de la suppression');

            setAdmins(admins.filter(a => a.id !== adminId));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-neutral-6 text-sm font-poppins">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Message d'erreur */}
            {error && (
                <div className="
                    bg-danger-2 border border-danger-1
                    rounded-2 p-3 flex items-start gap-2
                ">
                    <AlertCircle size={16} className="text-danger-1 shrink-0 mt-0.5" />
                    <p className="text-xs font-poppins text-danger-1">{error}</p>
                </div>
            )}

            {/* Bouton ajouter */}
            {!isAdding && (
                <Button
                    type="submit"
                    variant="primary"
                    size="normal"
                    loading={loading}
                    className="mt-2 w-80"
                    onClick={() => setIsAdding(true)}
                >
                    <Plus size={14} />
                    {loading ? 'Ajouter en cours ...' : 'Ajouter un administrateur'}
                </Button>
            )}

            {/* Formulaire d'ajout */}
            {isAdding && (
                <div className="
                    bg-neutral-0 dark:bg-neutral-0
                    border border-neutral-4 dark:border-neutral-4
                    rounded-3 p-5
                ">
                    <h3 className="text-sm font-semibold font-poppins text-neutral-8 dark:text-neutral-8 mb-4">
                        Nouvel administrateur
                    </h3>

                    <form onSubmit={handleAddAdmin} className="flex flex-col gap-4">
                        {/* Nom */}
                        <div>
                            <label className="block text-xs font-medium font-poppins text-neutral-7 dark:text-neutral-7 mb-1.5">
                                Nom complet
                            </label>
                            <div className="relative">
                                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-6" />
                                <input
                                    type="text"
                                    value={newAdmin.name}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                    placeholder="Ex: Jean Dupont"
                                    className="
                                        w-full pl-9 pr-3 py-2.5 text-xs font-poppins
                                        bg-neutral-1 dark:bg-neutral-1
                                        border border-neutral-5 dark:border-neutral-5
                                        rounded-2 text-neutral-8 dark:text-neutral-8
                                        placeholder:text-neutral-6
                                        focus:outline-none focus:ring-2 focus:ring-primary-3
                                    "
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-medium font-poppins text-neutral-7 dark:text-neutral-7 mb-1.5">
                                Email
                            </label>
                            <div className="relative">
                                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-6" />
                                <input
                                    type="email"
                                    value={newAdmin.email}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                    placeholder="admin@tokia-loh.com"
                                    className="
                                        w-full pl-9 pr-3 py-2.5 text-xs font-poppins
                                        bg-neutral-1 dark:bg-neutral-1
                                        border border-neutral-5 dark:border-neutral-5
                                        rounded-2 text-neutral-8 dark:text-neutral-8
                                        placeholder:text-neutral-6
                                        focus:outline-none focus:ring-2 focus:ring-primary-3
                                    "
                                />
                            </div>
                        </div>

                        {/* Mot de passe */}
                        <div>
                            <label className="block text-xs font-medium font-poppins text-neutral-7 dark:text-neutral-7 mb-1.5">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                value={newAdmin.password}
                                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                placeholder="••••••••"
                                className="
                                    w-full px-3 py-2.5 text-xs font-poppins
                                    bg-neutral-1 dark:bg-neutral-1
                                    border border-neutral-5 dark:border-neutral-5
                                    rounded-2 text-neutral-8 dark:text-neutral-8
                                    placeholder:text-neutral-6
                                    focus:outline-none focus:ring-2 focus:ring-primary-3
                                "
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-2">

                            <Button
                                type="submit"
                                variant="primary"
                                size="normal"
                                loading={loading}
                                className="px-4"
                            >
                                Créer
                            </Button>

                            <Button
                                type="button"
                                variant="secondary"
                                size="normal"
                                onClick={() => {
                                    setIsAdding(false);
                                    setNewAdmin({ name: '', email: '', password: '' });
                                    setError('');
                                }}
                            >
                                Annuler
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Liste des admins */}
            <div className="
                bg-neutral-0 dark:bg-neutral-0
                border border-neutral-4 dark:border-neutral-4
                rounded-3 overflow-hidden
            ">
                {admins.length === 0 ? (
                    <div className="p-8 text-center">
                        <Shield size={32} className="mx-auto mb-3 text-neutral-5" />
                        <p className="text-sm font-poppins text-neutral-6">
                            Aucun administrateur
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-4 dark:divide-neutral-4">
                        {admins.map(admin => (
                            <div
                                key={admin.id}
                                className="
                                    flex items-center justify-between gap-4 p-4
                                    hover:bg-neutral-2 dark:hover:bg-neutral-2
                                    transition-colors duration-200
                                "
                            >
                                <div className="flex items-center gap-3">
                                    <div className="
                                        w-9 h-9 rounded-full bg-primary-5
                                        flex items-center justify-center shrink-0
                                    ">
                                        <Shield size={16} className="text-primary-1" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold font-poppins text-neutral-8 dark:text-neutral-8">
                                            {admin.name}
                                        </p>
                                        <p className="text-[11px] font-poppins text-neutral-6 dark:text-neutral-6">
                                            {admin.email}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDeleteAdmin(admin.id)}
                                    className="
                                        p-2 rounded-2 text-danger-1
                                        hover:bg-danger-2 transition-all duration-200
                                        cursor-pointer
                                    "
                                    title="Supprimer"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsAdminsManager;