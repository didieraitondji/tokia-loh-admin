import React from 'react';
import { Megaphone, Users, Wallet, TrendingUp } from 'lucide-react';
import StatCard from '../dashboard/StatCard';

/*
  Props :
  - campaigns : array — liste complète des campagnes pour calculer les stats
*/
const AdStatsPanel = ({ campaigns = [] }) => {
    const actives = campaigns.filter(c => c.status === 'Active').length;
    const totalBudget = campaigns.reduce((acc, c) => acc + (Number(c.budget) || 0), 0);
    const totalReach = campaigns.reduce((acc, c) => acc + (c.estimatedReach || 0), 0);
    const avgConv = campaigns.length
        ? (campaigns.reduce((acc, c) => acc + (c.convRate || 0), 0) / campaigns.length).toFixed(1)
        : '0.0';

    return (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
                title="Campagnes actives"
                value={String(actives)}
                icon={<Megaphone size={18} />}
                color="primary"
                trend={actives > 0 ? 'up' : 'neutral'}
                trendLabel={`sur ${campaigns.length} total`}
            />
            <StatCard
                title="Portée estimée"
                value={totalReach >= 1000 ? `${(totalReach / 1000).toFixed(1)}k` : String(totalReach)}
                icon={<Users size={18} />}
                color="secondary"
                trend="up"
                trendLabel="personnes touchées"
            />
            <StatCard
                title="Budget total engagé"
                value={`${totalBudget.toLocaleString('fr-FR')} F`}
                icon={<Wallet size={18} />}
                color="warning"
            />
            <StatCard
                title="Taux de conversion moy."
                value={`${avgConv}%`}
                icon={<TrendingUp size={18} />}
                color="success"
                trend="up"
                trendLabel="vs mois dernier"
            />
        </div>
    );
};

export default AdStatsPanel;