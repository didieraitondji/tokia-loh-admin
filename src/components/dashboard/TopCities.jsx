import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';

// Données mock — à remplacer par l'API
const MOCK_CITIES = [
    { city: 'Abidjan', orders: 312, total: '1 248 000 F' },
    { city: 'Bouaké', orders: 89, total: '356 000 F' },
    { city: 'Yamoussoukro', orders: 54, total: '216 000 F' },
    { city: 'San-Pédro', orders: 41, total: '164 000 F' },
    { city: 'Korhogo', orders: 28, total: '112 000 F' },
];

// Couleurs pour les barres (cycle sur les couleurs du design system)
const BAR_COLORS = [
    'bg-primary-1',
    'bg-secondary-1',
    'bg-primary-3',
    'bg-secondary-3',
    'bg-primary-4',
];

const TopCities = () => {
    const navigate = useNavigate();
    const maxOrders = MOCK_CITIES[0].orders; // la ville avec le plus de commandes

    return (
        <div className="
            bg-neutral-0 dark:bg-neutral-0
            border border-neutral-4 dark:border-neutral-4
            rounded-3 p-5 flex flex-col gap-5
        ">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold font-poppins text-neutral-8 dark:text-neutral-8">
                    Top 5 villes actives
                </h2>
                <button
                    onClick={() => navigate('/cities')}
                    className="flex items-center gap-1 text-xs font-poppins text-primary-1 hover:underline cursor-pointer"
                >
                    Gérer <ArrowRight size={13} />
                </button>
            </div>

            {/* Liste */}
            <div className="flex flex-col gap-4">
                {MOCK_CITIES.map((item, index) => {
                    const percent = Math.round((item.orders / maxOrders) * 100);
                    return (
                        <div key={item.city} className="flex flex-col gap-1.5">
                            {/* Ligne ville + stats */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {/* Rang */}
                                    <span className="text-[11px] font-bold font-poppins text-neutral-5 dark:text-neutral-6 w-4">
                                        #{index + 1}
                                    </span>
                                    <MapPin size={12} className="text-neutral-5 dark:text-neutral-6 shrink-0" />
                                    <span className="text-xs font-semibold font-poppins text-neutral-8 dark:text-neutral-8">
                                        {item.city}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[11px] font-poppins text-neutral-6 dark:text-neutral-6">
                                        {item.orders} cmd
                                    </span>
                                    <span className="text-[11px] font-semibold font-poppins text-neutral-7 dark:text-neutral-7">
                                        {item.total}
                                    </span>
                                </div>
                            </div>

                            {/* Barre de progression */}
                            <div className="w-full h-1.5 bg-neutral-3 dark:bg-neutral-3 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${BAR_COLORS[index]}`}
                                    style={{ width: `${percent}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TopCities;