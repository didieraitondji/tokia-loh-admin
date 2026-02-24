import React, { useState } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';

// Données mock — à remplacer par l'API
const DATA = {
    week: [
        { label: 'Lun', commandes: 12, ca: 48000 },
        { label: 'Mar', commandes: 19, ca: 76000 },
        { label: 'Mer', commandes: 8, ca: 32000 },
        { label: 'Jeu', commandes: 24, ca: 96000 },
        { label: 'Ven', commandes: 31, ca: 124000 },
        { label: 'Sam', commandes: 27, ca: 108000 },
        { label: 'Dim', commandes: 15, ca: 60000 },
    ],
    month: [
        { label: 'S1', commandes: 58, ca: 232000 },
        { label: 'S2', commandes: 74, ca: 296000 },
        { label: 'S3', commandes: 61, ca: 244000 },
        { label: 'S4', commandes: 89, ca: 356000 },
    ],
};

const FILTERS = [
    { key: 'week', label: '7 jours' },
    { key: 'month', label: '30 jours' },
];

const METRICS = [
    { key: 'commandes', label: 'Commandes', color: '#0EA5E9' },
    { key: 'ca', label: "Chiffre d'affaires", color: '#8B5CF6' },
];

// Tooltip personnalisé
const CustomTooltip = ({ active, payload, label, metric }) => {
    if (!active || !payload?.length) return null;
    const val = payload[0]?.value;
    return (
        <div className="bg-neutral-0 border border-neutral-4 rounded-4 px-3 py-2 shadow-md">
            <p className="text-[11px] font-semibold font-poppins text-neutral-6 mb-1">{label}</p>
            <p className="text-xs font-bold font-poppins text-neutral-8">
                {metric === 'ca' ? `${val.toLocaleString('fr-FR')} F` : `${val} commandes`}
            </p>
        </div>
    );
};

const SalesChart = () => {
    const [filter, setFilter] = useState('week');
    const [metric, setMetric] = useState('commandes');

    const data = DATA[filter];
    const activeMetric = METRICS.find(m => m.key === metric);

    return (
        <div className="
    bg-neutral-0 dark:bg-neutral-0
    border border-neutral-4 dark:border-neutral-4
    rounded-3 p-5 flex flex-col gap-5
">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-sm font-semibold font-poppins text-neutral-8 dark:text-neutral-8">
                    Évolution des ventes
                </h2>

                <div className="flex items-center gap-2 flex-wrap">
                    {/* Filtre métrique */}
                    <div className="flex items-center gap-1 bg-neutral-3 dark:bg-neutral-3 rounded-full p-0.5">
                        {METRICS.map(m => (
                            <button
                                key={m.key}
                                onClick={() => setMetric(m.key)}
                                className={`
                            px-3 py-1 rounded-full text-[11px] font-semibold font-poppins
                            transition-all duration-200 cursor-pointer
                            ${metric === m.key
                                        ? 'bg-neutral-0 dark:bg-neutral-2 text-neutral-8 dark:text-neutral-8 shadow-sm'
                                        : 'text-neutral-6 hover:text-neutral-8 dark:hover:text-neutral-8'
                                    }
                        `}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>

                    {/* Filtre période */}
                    <div className="flex items-center gap-1 bg-neutral-3 dark:bg-neutral-3 rounded-full p-0.5">
                        {FILTERS.map(f => (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key)}
                                className={`
                            px-3 py-1 rounded-full text-[11px] font-semibold font-poppins
                            transition-all duration-200 cursor-pointer
                            ${filter === f.key
                                        ? 'bg-primary-1 text-neutral-0 shadow-sm'
                                        : 'text-neutral-6 hover:text-neutral-8 dark:hover:text-neutral-8'
                                    }
                        `}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Graphique */}
            <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={activeMetric.color} stopOpacity={0.15} />
                            <stop offset="95%" stopColor={activeMetric.color} stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--color-neutral-4)"
                        vertical={false}
                    />

                    <XAxis
                        dataKey="label"
                        tick={{
                            fontSize: 11,
                            fontFamily: 'Poppins',
                            fill: 'var(--color-neutral-6)'
                        }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{
                            fontSize: 11,
                            fontFamily: 'Poppins',
                            fill: 'var(--color-neutral-6)'
                        }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={v => metric === 'ca' ? `${(v / 1000).toFixed(0)}k` : v}
                    />

                    <Tooltip content={<CustomTooltip metric={metric} />} />

                    <Area
                        type="monotone"
                        dataKey={metric}
                        stroke={activeMetric.color}
                        strokeWidth={2.5}
                        fill="url(#colorGradient)"
                        dot={{ r: 4, fill: activeMetric.color, strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: activeMetric.color, strokeWidth: 0 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SalesChart;