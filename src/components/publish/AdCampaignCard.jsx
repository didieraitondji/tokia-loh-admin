import React, { useState } from 'react';
import {
    Pencil, Trash2, Copy, Pause, Play,
    Calendar, Wallet, Users, Eye, X
} from 'lucide-react';
import AdChannelBadge from './AdChannelBadge';

const formatPrice = (p) => `${Number(p).toLocaleString('fr-FR')} F`;

const STATUS_CONFIG = {
    'Active': { color: 'bg-success-2 text-success-1', dot: 'bg-success-1' },
    'En pause': { color: 'bg-warning-2 text-warning-1', dot: 'bg-warning-1' },
    'Terminée': { color: 'bg-neutral-3 text-neutral-6', dot: 'bg-neutral-5' },
    'Brouillon': { color: 'bg-secondary-5 text-secondary-1', dot: 'bg-secondary-1' },
};

// Aperçu message WhatsApp stylisé
const WhatsAppPreview = ({ message, productName, onClose }) => (
    <>
        <div className="fixed inset-0 bg-neutral-8/40 z-40 backdrop-blur-sm" onClick={onClose} />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-0 dark:bg-neutral-0 rounded-3 shadow-xl w-full max-w-sm overflow-hidden">
                {/* Header WhatsApp */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#075E54]">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center">
                            <span className="text-white text-xs font-bold font-poppins">TL</span>
                        </div>
                        <div>
                            <p className="text-white text-xs font-semibold font-poppins">Tokia-Loh</p>
                            <p className="text-[10px] text-[#8edbcf]">en ligne</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white opacity-70 hover:opacity-100 cursor-pointer">
                        <X size={16} />
                    </button>
                </div>

                {/* Corps chat */}
                <div className="bg-[#ECE5DD] dark:bg-[#0d1418] px-4 py-5 min-h-45">
                    <div className="bg-white dark:bg-[#1f2c34] rounded-2 rounded-tl-none px-3 py-2 max-w-[85%] shadow-sm">
                        {productName && (
                            <p className="text-[11px] font-semibold font-poppins text-[#075E54] mb-1">
                                🛍️ {productName}
                            </p>
                        )}
                        <p className="text-xs font-poppins text-neutral-8 dark:text-neutral-8 whitespace-pre-wrap leading-relaxed">
                            {message || 'Votre message apparaîtra ici...'}
                        </p>
                        <p className="text-[10px] text-neutral-5 text-right mt-1">
                            {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} ✓✓
                        </p>
                    </div>
                </div>

                <div className="px-4 py-3 border-t border-neutral-4 dark:border-neutral-4">
                    <p className="text-[11px] font-poppins text-neutral-5 text-center">
                        Aperçu du message WhatsApp
                    </p>
                </div>
            </div>
        </div>
    </>
);

const AdCampaignCard = ({ campaign, onEdit, onDelete, onDuplicate, onTogglePause }) => {
    const [showPreview, setShowPreview] = useState(false);

    const statusConf = STATUS_CONFIG[campaign.status] ?? STATUS_CONFIG['Brouillon'];
    const isActive = campaign.status === 'Active';
    const isEnded = campaign.status === 'Terminée';

    return (
        <>
            <div className="
                bg-neutral-0 dark:bg-neutral-0
                border border-neutral-4 dark:border-neutral-4
                rounded-3 flex flex-col overflow-hidden
                hover:shadow-md transition-shadow duration-200
            ">
                {/* ── Bande couleur + statut ── */}
                <div
                    className="h-2 w-full"
                    style={{ backgroundColor: campaign.color || '#0EA5E9' }}
                />

                {/* ── Corps ── */}
                <div className="p-4 flex flex-col gap-3 flex-1">
                    {/* Nom + statut */}
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold font-poppins text-neutral-8 dark:text-neutral-8 leading-tight">
                            {campaign.name}
                        </h3>
                        <span className={`
                            inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full
                            text-[11px] font-semibold font-poppins whitespace-nowrap shrink-0
                            ${statusConf.color}
                        `}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusConf.dot}`} />
                            {campaign.status}
                        </span>
                    </div>

                    {/* Produit mis en avant */}
                    {campaign.productName && (
                        <p className="text-[11px] font-poppins text-neutral-6">
                            🛍️ <span className="font-medium text-neutral-7 dark:text-neutral-7">{campaign.productName}</span>
                        </p>
                    )}

                    {/* Canaux */}
                    <div className="flex flex-wrap gap-1">
                        {campaign.channels?.map(ch => (
                            <AdChannelBadge key={ch} channel={ch} size="sm" />
                        ))}
                    </div>

                    {/* Métriques */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1 text-neutral-5">
                                <Wallet size={11} />
                                <span className="text-[10px] font-poppins">Budget</span>
                            </div>
                            <span className="text-xs font-semibold font-poppins text-neutral-8 dark:text-neutral-8">
                                {campaign.budget ? formatPrice(campaign.budget) : '—'}
                            </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1 text-neutral-5">
                                <Users size={11} />
                                <span className="text-[10px] font-poppins">Portée</span>
                            </div>
                            <span className="text-xs font-semibold font-poppins text-neutral-8 dark:text-neutral-8">
                                {campaign.estimatedReach
                                    ? campaign.estimatedReach >= 1000
                                        ? `~${(campaign.estimatedReach / 1000).toFixed(1)}k`
                                        : `~${campaign.estimatedReach}`
                                    : '—'}
                            </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1 text-neutral-5">
                                <Calendar size={11} />
                                <span className="text-[10px] font-poppins">Fin</span>
                            </div>
                            <span className="text-xs font-semibold font-poppins text-neutral-8 dark:text-neutral-8">
                                {campaign.dateTo || '—'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Actions ── */}
                <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-neutral-4 dark:border-neutral-4 bg-neutral-2 dark:bg-neutral-2">
                    {/* Aperçu WhatsApp */}
                    {campaign.message && campaign.channels?.includes('WhatsApp') && (
                        <button
                            onClick={() => setShowPreview(true)}
                            className="flex items-center gap-1 text-[11px] font-poppins font-medium text-[#16a34a] hover:underline cursor-pointer"
                        >
                            <Eye size={12} />
                            Aperçu
                        </button>
                    )}
                    {(!campaign.message || !campaign.channels?.includes('WhatsApp')) && (
                        <span />
                    )}

                    <div className="flex items-center gap-1">
                        {/* Pause / Reprendre */}
                        {!isEnded && (
                            <button
                                onClick={() => onTogglePause?.(campaign)}
                                title={isActive ? 'Mettre en pause' : 'Activer'}
                                className={`w-7 h-7 flex items-center justify-center rounded-2 transition-colors cursor-pointer
                                    ${isActive
                                        ? 'text-neutral-6 hover:bg-warning-2 hover:text-warning-1'
                                        : 'text-neutral-6 hover:bg-success-2 hover:text-success-1'
                                    }`}
                            >
                                {isActive ? <Pause size={13} /> : <Play size={13} />}
                            </button>
                        )}
                        {/* Modifier */}
                        <button
                            onClick={() => onEdit?.(campaign)}
                            title="Modifier"
                            className="w-7 h-7 flex items-center justify-center rounded-2 text-neutral-6 hover:bg-primary-5 hover:text-primary-1 transition-colors cursor-pointer"
                        >
                            <Pencil size={13} />
                        </button>
                        {/* Dupliquer */}
                        <button
                            onClick={() => onDuplicate?.(campaign)}
                            title="Dupliquer"
                            className="w-7 h-7 flex items-center justify-center rounded-2 text-neutral-6 hover:bg-secondary-5 hover:text-secondary-1 transition-colors cursor-pointer"
                        >
                            <Copy size={13} />
                        </button>
                        {/* Supprimer */}
                        <button
                            onClick={() => onDelete?.(campaign)}
                            title="Supprimer"
                            className="w-7 h-7 flex items-center justify-center rounded-2 text-neutral-6 hover:bg-danger-2 hover:text-danger-1 transition-colors cursor-pointer"
                        >
                            <Trash2 size={13} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Aperçu WhatsApp */}
            {showPreview && (
                <WhatsAppPreview
                    message={campaign.message}
                    productName={campaign.productName}
                    onClose={() => setShowPreview(false)}
                />
            )}
        </>
    );
};

export default AdCampaignCard;