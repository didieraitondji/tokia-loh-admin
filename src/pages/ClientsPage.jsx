import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserMinus, UserX } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import ClientsTable, { MOCK_CLIENTS } from '../components/clients/ClientsTable';
import ClientDetailModal from '../components/clients/ClientDetailModal';

const ClientsPage = () => {
    const [clients, setClients] = useState(MOCK_CLIENTS);
    const [selectedClient, setSelectedClient] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        document.title = 'Admin Tokia-Loh | Clients';
    }, []);

    const handleView = (client) => {
        setSelectedClient(client);
        setModalOpen(true);
    };

    const handleClose = () => {
        setModalOpen(false);
        setSelectedClient(null);
    };

    // Désactiver / Réactiver
    const handleDisable = (client) => {
        const newStatus = client.status === 'Désactivé' ? 'Actif' : 'Désactivé';
        const updated = { ...client, status: newStatus };
        setClients(prev => prev.map(c => c.id === client.id ? updated : c));
        setSelectedClient(prev => prev?.id === client.id ? updated : prev);
        // TODO : appel API PATCH /clients/:id/status
    };

    // Bloquer / Débloquer
    const handleBlock = (client) => {
        const newStatus = client.status === 'Bloqué' ? 'Actif' : 'Bloqué';
        const updated = { ...client, status: newStatus };
        setClients(prev => prev.map(c => c.id === client.id ? updated : c));
        setSelectedClient(prev => prev?.id === client.id ? updated : prev);
        // TODO : appel API PATCH /clients/:id/status
    };

    // Supprimer
    const handleDelete = (client) => {
        if (!window.confirm(`Supprimer définitivement le compte de ${client.firstName} ${client.lastName} ?`)) return;
        setClients(prev => prev.filter(c => c.id !== client.id));
        handleClose();
        // TODO : appel API DELETE /clients/:id
    };

    // Stats
    const total = clients.length;
    const actifs = clients.filter(c => c.status === 'Actif').length;
    const desactives = clients.filter(c => c.status === 'Désactivé').length;
    const bloques = clients.filter(c => c.status === 'Bloqué').length;

    return (
        <div className="flex flex-col gap-6">

            {/* ── En-tête ── */}
            <div>
                <h1 className="text-h5 font-bold font-poppins text-neutral-8 dark:text-neutral-8">
                    Clients
                </h1>
                <p className="text-xs font-poppins text-neutral-6 dark:text-neutral-6 mt-0.5">
                    Gérez la base de clients de Tokia-Loh
                </p>
            </div>

            {/* ── Stats ── */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    title="Total clients"
                    value={String(total)}
                    icon={<Users size={18} />}
                    color="primary"
                />
                <StatCard
                    title="Actifs"
                    value={String(actifs)}
                    icon={<UserCheck size={18} />}
                    trend="up"
                    trendLabel={`${Math.round((actifs / total) * 100)}%`}
                    color="success"
                />
                <StatCard
                    title="Désactivés"
                    value={String(desactives)}
                    icon={<UserMinus size={18} />}
                    color="warning"
                />
                <StatCard
                    title="Bloqués"
                    value={String(bloques)}
                    icon={<UserX size={18} />}
                    color="danger"
                />
            </div>

            {/* ── Tableau ── */}
            <ClientsTable
                clients={clients}
                setClients={setClients}
                onView={handleView}
                onDisable={handleDisable}
                onBlock={handleBlock}
                onDelete={handleDelete}
            />

            {/* ── Modal fiche client ── */}
            <ClientDetailModal
                open={modalOpen}
                onClose={handleClose}
                client={selectedClient}
                onDisable={handleDisable}
                onBlock={handleBlock}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default ClientsPage;