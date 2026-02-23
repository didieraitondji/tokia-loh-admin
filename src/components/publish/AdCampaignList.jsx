import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import AdCampaignCard from './AdCampaignCard';

const STATUS_TABS = ['Toutes', 'Active', 'En pause', 'Brouillon', 'Terminée'];

const AdCampaignList = ({ campaigns, onEdit, onDelete, onDuplicate, onTogglePause }) => {
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('Toutes');

    const countByStatus = useMemo(() => {
        const map = { Toutes: campaigns.length };
        STATUS_TABS.slice(1).forEach(s => {
            map[s] = campaigns.filter(c => c.status === s).length;
        });
        return map;
    }, [campaigns]);

    const filtered = useMemo(() => {
        return campaigns.filter(c => {
            const matchTab = activeTab === 'Toutes' || c.status === activeTab;
            const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
            return matchTab && matchSearch;
        });
    }, [campaigns, search, activeTab]);

    return (
        <div className="flex flex-col gap-4">

            {/* Recherche + onglets */}
            <div className="
                bg-neutral-0 dark:bg-neutral-0
                border border-neutral-4 dark:border-neutral-4
                rounded-3 overflow-hidden
            ">
                {/* Recherche */}
                <div className="px-5 pt-4 pb-3 border-b border-neutral-4 dark:border-neutral-4">
                    <div className="relative max-w-sm">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-6 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Rechercher une campagne..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="
                                w-full pl-9 pr-4 py-2 text-xs font-poppins rounded-full
                                bg-neutral-3 dark:bg-neutral-3 border border-transparent
                                text-neutral-8 dark:text-neutral-8 placeholder:text-neutral-6
                                outline-none focus:border-primary-1 focus:bg-neutral-0 dark:focus:bg-neutral-0
                                focus:ring-2 focus:ring-primary-5 transition-all duration-200
                            "
                        />
                    </div>
                </div>

                {/* Onglets statut */}
                <div className="flex items-center overflow-x-auto border-b border-neutral-4 dark:border-neutral-4">
                    {STATUS_TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`
                                flex items-center gap-1.5 px-4 py-3 text-xs font-poppins font-medium
                                whitespace-nowrap border-b-2 transition-all duration-200 cursor-pointer
                                ${activeTab === tab
                                    ? 'border-primary-1 text-primary-1'
                                    : 'border-transparent text-neutral-6 hover:text-neutral-8 dark:hover:text-neutral-8'
                                }
                            `}
                        >
                            {tab}
                            <span className={`
                                inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold
                                ${activeTab === tab ? 'bg-primary-5 text-primary-1' : 'bg-neutral-3 text-neutral-6'}
                            `}>
                                {countByStatus[tab] ?? 0}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Grille de cartes */}
                <div className="p-5">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-12 text-neutral-5">
                            <Search size={32} />
                            <p className="text-xs font-poppins">Aucune campagne trouvée</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                            {filtered.map(campaign => (
                                <AdCampaignCard
                                    key={campaign.id}
                                    campaign={campaign}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onDuplicate={onDuplicate}
                                    onTogglePause={onTogglePause}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdCampaignList;