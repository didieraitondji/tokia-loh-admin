import React, { useState, useEffect } from 'react';
import { Plus, Grid2X2 } from 'lucide-react';
import Button from '../components/Button';
import StatCard from '../components/dashboard/StatCard';
import CategoriesTable from '../components/categories/CategoriesTable';
import CategoryFormModal from '../components/categories/CategoryFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const CategoriesPage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => {
        document.title = 'Admin Tokia-Loh | Catégories';
    }, []);

    const handleCreate = () => {
        setSelectedCategory(null);
        setModalOpen(true);
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setModalOpen(true);
    };

    const handleClose = () => {
        setModalOpen(false);
        setSelectedCategory(null);
    };

    const handleSave = (formData) => {
        // TODO : appel API create ou update
        console.log('Sauvegarde catégorie :', formData);
    };

    const handleDelete = (category) => {
        setDeleteTarget(category); // ouvre toujours le modal
    };

    const handleConfirmDelete = () => {
        console.log('Suppression catégorie :', deleteTarget.id);
        setDeleteTarget(null);
    };
    return (
        <div className="flex flex-col gap-6">

            {/* ── En-tête ── */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-h5 font-bold font-poppins text-neutral-8 dark:text-neutral-8">
                        Catégories
                    </h1>
                    <p className="text-xs font-poppins text-neutral-6 dark:text-neutral-6 mt-0.5">
                        Gérez les catégories de votre boutique
                    </p>
                </div>

                <Button
                    variant="primary"
                    size="normal"
                    icon={<Plus size={15} />}
                    iconPosition="left"
                    onClick={handleCreate}
                >
                    <span className='hidden md:inline'>Nouvelle catégorie</span>
                </Button>
            </div>

            {/* ── Stats rapides ── */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <StatCard
                    title="Total catégories"
                    value="6"
                    icon={<Grid2X2 size={18} />}
                    color="primary"
                />
                <StatCard
                    title="Catégories actives"
                    value="5"
                    icon={<Grid2X2 size={18} />}
                    trend="up"
                    trendLabel="83%"
                    color="success"
                />
                <StatCard
                    title="Catégories inactives"
                    value="1"
                    icon={<Grid2X2 size={18} />}
                    color="warning"
                />
            </div>

            {/* ── Info ordre ── */}
            <div className="flex items-center gap-2 bg-primary-5 dark:bg-primary-5 border border-primary-4 rounded-2 px-4 py-3">
                <span className="text-xs font-poppins text-primary-7 dark:text-primary-7">
                    💡 Utilisez les flèches ▲▼ pour changer l'ordre d'affichage des catégories sur la boutique.
                </span>
            </div>

            {/* ── Tableau ── */}
            <CategoriesTable
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* ── Modal ── */}
            <CategoryFormModal
                open={modalOpen}
                onClose={handleClose}
                category={selectedCategory}
                onSave={handleSave}
            />

            <DeleteConfirmModal
                isOpen={!!deleteTarget}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteTarget(null)}
                mode={deleteTarget?.products > 0 ? 'error' : 'confirm'}
                title={
                    deleteTarget?.products > 0
                        ? 'Suppression impossible'
                        : 'Supprimer la catégorie'
                }
                message={
                    deleteTarget?.products > 0
                        ? `Impossible de supprimer "${deleteTarget?.name}" : ${deleteTarget?.products} produit(s) sont associés à cette catégorie.`
                        : `Voulez-vous vraiment supprimer "${deleteTarget?.name}" ? Cette action est irréversible.`
                }
            />
        </div>
    );
};

export default CategoriesPage;