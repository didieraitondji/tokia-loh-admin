import React from 'react';
import { MessageCircle, Facebook, Instagram, MessageSquare, Mail } from 'lucide-react';

export const CHANNEL_CONFIG = {
    WhatsApp: { color: 'bg-[#dcfce7] text-[#16a34a]', icon: <MessageCircle size={11} /> },
    Facebook: { color: 'bg-[#dbeafe] text-[#1d4ed8]', icon: <Facebook size={11} /> },
    Instagram: { color: 'bg-[#fce7f3] text-[#be185d]', icon: <Instagram size={11} /> },
    SMS: { color: 'bg-warning-2 text-warning-1', icon: <MessageSquare size={11} /> },
    Email: { color: 'bg-primary-5 text-primary-1', icon: <Mail size={11} /> },
};

const AdChannelBadge = ({ channel, size = 'normal' }) => {
    const config = CHANNEL_CONFIG[channel];
    if (!config) return null;

    return (
        <span className={`
            inline-flex items-center gap-1 rounded-full font-semibold font-poppins whitespace-nowrap
            ${config.color}
            ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-[11px]'}
        `}>
            {config.icon}
            {channel}
        </span>
    );
};

export default AdChannelBadge;