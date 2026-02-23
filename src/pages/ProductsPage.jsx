import React, { useState } from 'react';
import { Plus, Package } from 'lucide-react';
import { useEffect } from 'react';
import Button from '../components/Button';
import ProductsTable from '../components/products/ProductsTable';
import ProductFormModal from '../components/products/ProductFormModal';
import StatCard from '../components/dashboard/StatCard';

const ProductsPage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => {
        document.title = 'Admin Tokia-Loh | Produits';
    }, []);

    // Ouvrir modal création
    const handleCreate = () => {
        setSelectedProduct(null);
        setModalOpen(true);
    };

    // Ouvrir modal édition
    const handleEdit = (product) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    // Fermer modal
    const handleClose = () => {
        setModalOpen(false);
        setSelectedProduct(null);
    };

    // Sauvegarde (création ou modification)
    const handleSave = (formData) => {
        // TODO : appel API create ou update
        console.log('Sauvegarde produit :', formData);
    };

    // Suppression
    const handleDelete = (product) => {
        // TODO : confirmation + appel API delete
        if (window.confirm(`Supprimer "${product.name}" ?`)) {
            console.log('Suppression produit :', product.id);
        }
    };

    return (
        <div className="flex flex-col gap-6">

            {/* ── En-tête de page ── */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-h5 font-bold font-poppins text-neutral-8 dark:text-neutral-8">
                        Produits
                    </h1>
                    <p className="text-xs font-poppins text-neutral-6 dark:text-neutral-6 mt-0.5">
                        Gérez votre catalogue de produits
                    </p>
                </div>

                <Button
                    variant="primary"
                    size="normal"
                    icon={<Plus size={15} />}
                    iconPosition="left"
                    onClick={handleCreate}
                >
                    Nouveau produit
                </Button>
            </div>

            {/* ── Stats rapides ── */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    title="Total produits"
                    value="84"
                    icon={<Package size={18} />}
                    color="primary"
                />
                <StatCard
                    title="Produits actifs"
                    value="71"
                    icon={<Package size={18} />}
                    trend="up"
                    trendLabel="84%"
                    color="success"
                />
                <StatCard
                    title="Stock faible"
                    value="7"
                    icon={<Package size={18} />}
                    trend="down"
                    trendLabel="À réapprovisionner"
                    color="warning"
                />
                <StatCard
                    title="Ruptures"
                    value="3"
                    icon={<Package size={18} />}
                    trend="down"
                    trendLabel="Urgent"
                    color="danger"
                />
            </div>

            {/* ── Tableau des produits ── */}
            <ProductsTable
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* ── Modal formulaire ── */}
            <ProductFormModal
                open={modalOpen}
                onClose={handleClose}
                product={selectedProduct}
                onSave={handleSave}
            />
        </div>
    );
};

export default ProductsPage;