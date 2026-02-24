import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell
} from 'recharts';

// Données mock par période — à remplacer par l'API
const DATA = {
    day: [
        { category: 'Robes', ca: 45000, orders: 3 },
        { category: 'Chaussures', ca: 16000, orders: 2 },
        { category: 'Sacs', ca: 24000, orders: 2 },
        { category: 'Bijoux', ca: 10500, orders: 3 },
        { category: 'Chemises', ca: 18000, orders: 1 },
        { category: 'Accessoires', ca: 7000, orders: 2 },
    ],
    week: [
        { category: 'Robes', ca: 225000, orders: 15 },
        { category: 'Chaussures', ca: 96000, orders: 12 },
        { category: 'Sacs', ca: 144000, orders: 12 },
        { category: 'Bijoux', ca: 52500, orders: 15 },
        { category: 'Chemises', ca: 90000, orders: 5 },
        { category: 'Accessoires', ca: 35000, orders: 10 },
    ],
    month: [
        { category: 'Robes', ca: 900000, orders: 60 },
        { category: 'Chaussures', ca: 384000, orders: 48 },
        { category: 'Sacs', ca: 576000, orders: 48 },
        { category: 'Bijoux', ca: 210000, orders: 60 },
        { category: 'Chemises', ca: 360000, orders: 20 },
        { category: 'Accessoires', ca: 140000, orders: 40 },
    ],
};

// Alternance bleu / violet sur les barres
const BAR_COLORS = ['#0EA5E9', '#8B5CF6', '#0EA5E9', '#8B5CF6', '#0EA5E9', '#8B5CF6'];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-neutral-0 border border-neutral-4 rounded-2 px-3 py-2 shadow-md">
            <p className="text-[11px] font-semibold font-poppins text-neutral-6 mb-1">{label}</p>
            <p className="text-xs font-bold font-poppins text-neutral-8">
                {Number(payload[0].value).toLocaleString('fr-FR')} F
            </p>
            <p className="text-[11px] font-poppins text-neutral-5">
                {payload[0].payload.orders} commandes
            </p>
        </div>
    );
};

const SalesByCategoryChart = ({ period = 'month' }) => {
    const data = DATA[period] ?? DATA.month;

    return (
        <div className="
    bg-neutral-0 dark:bg-neutral-0
    border border-neutral-4 dark:border-neutral-4
    rounded-3 p-5 flex flex-col gap-5
">
            <h2 className="text-sm font-semibold font-poppins text-neutral-8 dark:text-neutral-8">
                Ventes par catégorie
            </h2>

            <ResponsiveContainer width="100%" height={260}>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--color-neutral-4)"
                        horizontal={false}
                    />
                    <XAxis
                        type="number"
                        tick={{
                            fontSize: 10,
                            fontFamily: 'Poppins',
                            fill: 'var(--color-neutral-6)'
                        }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
                    />
                    <YAxis
                        type="category"
                        dataKey="category"
                        tick={{
                            fontSize: 11,
                            fontFamily: 'Poppins',
                            fill: 'var(--color-neutral-6)'
                        }}
                        axisLine={false}
                        tickLine={false}
                        width={80}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="ca" radius={[0, 6, 6, 0]} barSize={20}>
                        {data.map((_, index) => (
                            <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SalesByCategoryChart;