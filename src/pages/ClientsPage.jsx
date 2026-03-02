import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserMinus, UserX } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import ClientsTable, { MOCK_CLIENTS } from '../components/clients/ClientsTable';

const ClientsPage = () => {
    const [clients, setClients] = useState(MOCK_CLIENTS);

    useEffect(() => {
        document.title = 'Admin Tokia-Loh | Clients';
        // TODO : appel API GET /clients
    }, []);

    // ── Actions inline depuis le tableau ─────────────────────
    const handleDisable = (client) => {
        const newStatus = client.status === 'Désactivé' ? 'Actif' : 'Désactivé';
        setClients(prev => prev.map(c => c.id === client.id ? { ...c, status: newStatus } : c));
        // TODO : appel API PATCH /clients/:id/status
    };

    const handleBlock = (client) => {
        const newStatus = client.status === 'Bloqué' ? 'Actif' : 'Bloqué';
        setClients(prev => prev.map(c => c.id === client.id ? { ...c, status: newStatus } : c));
        // TODO : appel API PATCH /clients/:id/status
    };

    const handleDelete = (client) => {
        if (!window.confirm(`Supprimer définitivement "${client.firstName} ${client.lastName}" ?`)) return;
        setClients(prev => prev.filter(c => c.id !== client.id));
        // TODO : appel API DELETE /clients/:id
    };

    // ── Stats ─────────────────────────────────────────────────
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
                    Gérez vos clients et leur historique
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
                    title="Clients actifs"
                    value={String(actifs)}
                    icon={<UserCheck size={18} />}
                    color="success"
                    trend="up"
                    trendLabel={`${Math.round((actifs / total) * 100)}%`}
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

            {/* ── Tableau clients ── */}
            <ClientsTable
                clients={clients}
                setClients={setClients}
                onDisable={handleDisable}
                onBlock={handleBlock}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default ClientsPage;