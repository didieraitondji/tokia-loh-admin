import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Button from '../components/Button';
import AdStatsPanel from '../components/publish/AdStatsPanel';
import AdCampaignList from '../components/publish/AdCampaignList';
import AdCampaignForm from '../components/publish/AdCampaignForm';

// Données mock — à remplacer par l'API
const MOCK_CAMPAIGNS = [
    {
        id: 1,
        name: 'Soldes été 2025 — Robes',
        channels: ['WhatsApp', 'Facebook', 'Instagram'],
        productId: 1,
        productName: 'Robe Ankara Wax',
        message: "🌟 Profitez de nos soldes d'été !\n\nLa sublime *Robe Ankara Wax* est disponible à -26% pour une durée limitée.\n\n👉 Commandez maintenant et recevez-la chez vous en 2 jours.\n\nPayez à la livraison 🛵",
        color: '#0EA5E9',
        image: null,
        budget: 75000,
        dateFrom: '2025-06-01',
        dateTo: '2025-06-30',
        status: 'Active',
        estimatedReach: 17800,
        convRate: 3.2,
    },
    {
        id: 2,
        name: 'Promo Bijoux Fête des mères',
        channels: ['SMS', 'Email'],
        productId: 5,
        productName: 'Bracelet perles coco',
        message: "Offrez un bijou unique à votre maman !\nLivraison rapide • Paiement à la livraison ✅",
        color: '#8B5CF6',
        image: null,
        budget: 30000,
        dateFrom: '2025-05-20',
        dateTo: '2025-05-26',
        status: 'Terminée',
        estimatedReach: 6900,
        convRate: 4.1,
    },
    {
        id: 3,
        name: 'Lancement Sacs Raphia',
        channels: ['Instagram', 'Facebook'],
        productId: 3,
        productName: 'Sac en raphia naturel',
        message: "Nouvelle collection disponible ! 🧺\nSac en raphia 100% naturel — style & authenticité.",
        color: '#10B981',
        image: null,
        budget: 45000,
        dateFrom: '2025-06-15',
        dateTo: '2025-07-15',
        status: 'En pause',
        estimatedReach: 14600,
        convRate: 2.8,
    },
    {
        id: 4,
        name: 'Flash Sale Chaussures — 48h',
        channels: ['WhatsApp', 'SMS'],
        productId: 2,
        productName: 'Sandales tressées',
        message: "⚡ FLASH SALE — 48h seulement !\nSandales tressées à prix cassé. Stocks limités !",
        color: '#F59E0B',
        image: null,
        budget: 20000,
        dateFrom: '2025-07-01',
        dateTo: '2025-07-03',
        status: 'Brouillon',
        estimatedReach: 8000,
        convRate: 0,
    },
];

const PublishPage = () => {
    const [campaigns, setCampaigns] = useState(MOCK_CAMPAIGNS);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);

    useEffect(() => {
        document.title = 'Admin Tokia-Loh | Publicité';
    }, []);

    const handleCreate = () => {
        setSelectedCampaign(null);
        setModalOpen(true);
    };

    const handleEdit = (campaign) => {
        setSelectedCampaign(campaign);
        setModalOpen(true);
    };

    const handleClose = () => {
        setModalOpen(false);
        setSelectedCampaign(null);
    };

    const handleSave = (formData) => {
        if (selectedCampaign) {
            setCampaigns(prev => prev.map(c => c.id === formData.id ? formData : c));
        } else {
            setCampaigns(prev => [formData, ...prev]);
        }
        // TODO : appel API create ou update
    };

    const handleDelete = (campaign) => {
        if (!window.confirm(`Supprimer la campagne "${campaign.name}" ?`)) return;
        setCampaigns(prev => prev.filter(c => c.id !== campaign.id));
        // TODO : appel API delete
    };

    // Dupliquer une campagne
    const handleDuplicate = (campaign) => {
        const duplicate = {
            ...campaign,
            id: Date.now(),
            name: `${campaign.name} (copie)`,
            status: 'Brouillon',
        };
        setCampaigns(prev => [duplicate, ...prev]);
        // TODO : appel API create
    };

    // Pause / Reprendre
    const handleTogglePause = (campaign) => {
        const newStatus = campaign.status === 'Active' ? 'En pause' : 'Active';
        setCampaigns(prev =>
            prev.map(c => c.id === campaign.id ? { ...c, status: newStatus } : c)
        );
        // TODO : appel API PATCH /campaigns/:id/status
    };

    return (
        <div className="flex flex-col gap-6">

            {/* ── En-tête ── */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-h5 font-bold font-poppins text-neutral-8 dark:text-neutral-8">
                        Publicité
                    </h1>
                    <p className="text-xs font-poppins text-neutral-6 dark:text-neutral-6 mt-0.5">
                        Créez et gérez vos campagnes publicitaires
                    </p>
                </div>
                <Button
                    variant="primary"
                    size="normal"
                    icon={<Plus size={15} />}
                    iconPosition="left"
                    onClick={handleCreate}
                >
                    <span className="hidden sm:inline">Nouvelle campagne</span>
                </Button>
            </div>

            {/* ── Stats globales ── */}
            <AdStatsPanel campaigns={campaigns} />

            {/* ── Liste des campagnes ── */}
            <AdCampaignList
                campaigns={campaigns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onTogglePause={handleTogglePause}
            />

            {/* ── Modal formulaire ── */}
            <AdCampaignForm
                open={modalOpen}
                onClose={handleClose}
                campaign={selectedCampaign}
                onSave={handleSave}
            />
        </div>
    );
};

export default PublishPage;