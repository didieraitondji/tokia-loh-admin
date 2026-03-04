import React, { useState, useEffect } from 'react';
import { Plus, MapPin, CheckCircle, XCircle, Truck } from 'lucide-react';
import Button from '../components/Button';
import StatCard from '../components/dashboard/StatCard';
import VillesTable, { MOCK_VILLES } from '../components/villes/VillesTable';
import VilleFormModal from '../components/villes/VilleFormModal';

const VillesPage = () => {
    const [villes, setVilles] = useState(MOCK_VILLES);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedVille, setSelectedVille] = useState(null);

    useEffect(() => {
        document.title = 'Admin Tokia-Loh | Villes';
    }, []);

    const handleCreate = () => {
        setSelectedVille(null);
        setModalOpen(true);
    };

    const handleEdit = (ville) => {
        setSelectedVille(ville);
        setModalOpen(true);
    };

    const handleClose = () => {
        setModalOpen(false);
        setSelectedVille(null);
    };

    const handleSave = (formData) => {
        if (selectedVille) {
            // Modification
            setVilles(prev => prev.map(v => v.id === selectedVille.id ? { ...v, ...formData } : v));
        } else {
            // Création
            const newVille = { ...formData, id: Date.now(), orders: 0 };
            setVilles(prev => [...prev, newVille]);
        }
        // TODO : appel API create ou update
    };

    const handleDelete = (ville) => {
        if (ville.orders > 0) {
            alert(`Impossible de supprimer "${ville.name}" : ${ville.orders} commande(s) sont associées à cette ville.`);
            return;
        }
        if (!window.confirm(`Supprimer la ville "${ville.name}" ?`)) return;
        setVilles(prev => prev.filter(v => v.id !== ville.id));
        // TODO : appel API delete
    };

    // Stats
    const total = villes.length;
    const actives = villes.filter(v => v.active).length;
    const inactives = villes.filter(v => !v.active).length;
    const avgFee = villes.length
        ? Math.round(villes.filter(v => v.fee > 0).reduce((acc, v) => acc + v.fee, 0) / villes.filter(v => v.fee > 0).length)
        : 0;

    return (
        <div className="flex flex-col gap-6">

            {/* ── En-tête ── */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-h5 font-bold font-poppins text-neutral-8 dark:text-neutral-8">
                        Villes
                    </h1>
                    <p className="text-xs font-poppins text-neutral-6 dark:text-neutral-6 mt-0.5">
                        Gérez les zones de livraison et les frais associés
                    </p>
                </div>
                <Button
                    variant="primary"
                    size="normal"
                    icon={<Plus size={15} />}
                    iconPosition="left"
                    onClick={handleCreate}
                >
                    <span className="hidden md:inline">
                        Nouvelle ville</span>
                </Button>
            </div>

            {/* ── Stats ── */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    title="Total villes"
                    value={String(total)}
                    icon={<MapPin size={18} />}
                    color="primary"
                />
                <StatCard
                    title="Villes actives"
                    value={String(actives)}
                    icon={<CheckCircle size={18} />}
                    trend="up"
                    trendLabel={`${Math.round((actives / total) * 100)}%`}
                    color="success"
                />
                <StatCard
                    title="Villes inactives"
                    value={String(inactives)}
                    icon={<XCircle size={18} />}
                    color="warning"
                />
                <StatCard
                    title="Frais moyen"
                    value={`${avgFee.toLocaleString('fr-FR')} F`}
                    icon={<Truck size={18} />}
                    color="secondary"
                />
            </div>

            {/* ── Info ── */}
            <div className="flex items-center gap-2 bg-secondary-5 dark:bg-secondary-5 border border-secondary-3 rounded-2 px-4 py-3">
                <span className="text-xs font-poppins text-secondary-7 dark:text-secondary-7">
                    💡 Désactiver une ville empêche les clients de passer des commandes vers cette destination.
                </span>
            </div>

            {/* ── Tableau ── */}
            <VillesTable
                villes={villes}
                setVilles={setVilles}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* ── Modal ── */}
            <VilleFormModal
                open={modalOpen}
                onClose={handleClose}
                ville={selectedVille}
                onSave={handleSave}
            />
        </div>
    );
};

export default VillesPage;