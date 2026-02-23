import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router';

// Fausses notifications pour la démo — à remplacer par l'API
const MOCK_NOTIFICATIONS = [
    { id: 1, message: 'Nouvelle commande #1042 reçue', time: 'Il y a 2 min', read: false },
    { id: 2, message: 'Produit "Robe Ankara" en rupture', time: 'Il y a 15 min', read: false },
    { id: 3, message: 'Nouveau client inscrit', time: 'Il y a 1h', read: true },
];

const TopBar = ({ onMenuToggle, showSearch = true }) => {
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [notifOpen, setNotifOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const notifRef = useRef(null);
    const userRef = useRef(null);

    const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

    // Ferme les dropdowns si clic en dehors
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
            if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        // TODO : appel API logout + clear token
        navigate('/login');
    };

    return (
        <header className="
            h-16 px-4 flex items-center justify-between gap-4
            bg-neutral-0 dark:bg-neutral-0
            border-b border-neutral-4 dark:border-neutral-4
            shrink-0
        ">

            {/* ── Gauche : bouton menu mobile ── */}
            <button
                onClick={onMenuToggle}
                className="
                    flex items-center justify-center w-9 h-9 rounded-2
                    text-neutral-7 dark:text-neutral-6
                    hover:bg-neutral-3 dark:hover:bg-neutral-3
                    transition-colors duration-200 cursor-pointer
                    md:hidden
                "
            >
                <Menu size={20} />
            </button>

            {/* si show search est faut, on va mettre une div par défaut pour ne pas gaté le design */}
            {!showSearch && <div className="flex-1 max-w-sm relative" />}

            {/* ── Centre : barre de recherche ── */}
            {showSearch && (<div className="flex-1 max-w-sm relative">
                <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-6 dark:text-neutral-6 pointer-events-none"
                />
                <input
                    type="text"
                    placeholder="Rechercher..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="
                        w-full pl-9 pr-4 py-2 text-xs font-poppins
                        bg-neutral-3 dark:bg-neutral-3
                        border border-transparent
                        text-neutral-8 dark:text-neutral-8
                        placeholder:text-neutral-6 dark:placeholder:text-neutral-6
                        rounded-full outline-none
                        focus:border-primary-1 focus:bg-neutral-0 dark:focus:bg-neutral-0
                        focus:ring-2 focus:ring-primary-5
                        transition-all duration-200
                    "
                />
            </div>
            )}

            {/* ── Droite : notifs + user ── */}
            <div className="flex items-center gap-2">

                {/* Cloche notifications */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => { setNotifOpen(p => !p); setUserMenuOpen(false); }}
                        className="
                            relative flex items-center justify-center w-9 h-9 rounded-full
                            text-neutral-7 dark:text-neutral-6
                            hover:bg-neutral-3 dark:hover:bg-neutral-3
                            hover:text-primary-1 transition-all duration-200 cursor-pointer
                        "
                    >
                        <Bell size={18} />
                        {unreadCount > 0 && (
                            <span className="
                                absolute top-1 right-1 w-4 h-4 rounded-full
                                bg-danger-1 text-white text-[10px] font-bold
                                flex items-center justify-center leading-none
                            ">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Dropdown notifications */}
                    {notifOpen && (
                        <div className="
                            absolute right-0 top-12 w-80 z-50
                            bg-neutral-0 dark:bg-neutral-0
                            border border-neutral-4 dark:border-neutral-4
                            rounded-3 shadow-lg overflow-hidden
                        ">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-4 dark:border-neutral-4">
                                <span className="text-sm font-semibold font-poppins text-neutral-8 dark:text-neutral-8">
                                    Notifications
                                </span>
                                {unreadCount > 0 && (
                                    <span className="text-xs font-poppins text-primary-1 cursor-pointer hover:underline">
                                        Tout marquer lu
                                    </span>
                                )}
                            </div>

                            <div className="max-h-72 overflow-y-auto">
                                {MOCK_NOTIFICATIONS.map(notif => (
                                    <div
                                        key={notif.id}
                                        className={`
                                            flex flex-col gap-0.5 px-4 py-3
                                            border-b border-neutral-4 dark:border-neutral-4 last:border-0
                                            cursor-pointer transition-colors duration-150
                                            hover:bg-neutral-2 dark:hover:bg-neutral-2
                                            ${!notif.read ? 'bg-primary-5 dark:bg-primary-5' : ''}
                                        `}
                                    >
                                        <span className="text-xs font-poppins text-neutral-8 dark:text-neutral-8 font-medium">
                                            {notif.message}
                                        </span>
                                        <span className="text-[11px] font-poppins text-neutral-6 dark:text-neutral-6">
                                            {notif.time}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="px-4 py-2.5 text-center">
                                <button
                                    onClick={() => navigate('/notifications')}
                                    className="text-xs font-poppins text-primary-1 hover:underline cursor-pointer"
                                >
                                    Voir toutes les notifications
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Avatar + menu utilisateur */}
                <div className="relative" ref={userRef}>
                    <button
                        onClick={() => { setUserMenuOpen(p => !p); setNotifOpen(false); }}
                        className="
                            flex items-center gap-2 px-2 py-1.5 rounded-full
                            hover:bg-neutral-3 dark:hover:bg-neutral-3
                            transition-colors duration-200 cursor-pointer
                        "
                    >
                        {/* Avatar initiales */}
                        <div className="
                            w-8 h-8 rounded-full shrink-0
                            bg-primary-5 dark:bg-primary-5
                            flex items-center justify-center
                        ">
                            <span className="text-xs font-bold font-poppins text-primary-1">AD</span>
                        </div>
                        <div className="hidden sm:flex flex-col items-start leading-tight">
                            <span className="text-xs font-semibold font-poppins text-neutral-8 dark:text-neutral-8">
                                Admin
                            </span>
                            <span className="text-[11px] font-poppins text-neutral-6 dark:text-neutral-6">
                                Super Admin
                            </span>
                        </div>
                        <ChevronDown size={14} className="text-neutral-6 dark:text-neutral-6 hidden sm:block" />
                    </button>

                    {/* Dropdown user */}
                    {userMenuOpen && (
                        <div className="
                            absolute right-0 top-12 w-48 z-50
                            bg-neutral-0 dark:bg-neutral-0
                            border border-neutral-4 dark:border-neutral-4
                            rounded-3 shadow-lg overflow-hidden
                        ">
                            <button
                                onClick={() => { navigate('/settings'); setUserMenuOpen(false); }}
                                className="
                                    flex items-center gap-3 w-full px-4 py-2.5
                                    text-xs font-poppins text-neutral-7 dark:text-neutral-7
                                    hover:bg-neutral-3 dark:hover:bg-neutral-3
                                    hover:text-neutral-8 dark:hover:text-neutral-8
                                    transition-colors duration-150 cursor-pointer
                                "
                            >
                                <User size={15} />
                                Mon profil
                            </button>
                            <button
                                onClick={() => { navigate('/settings'); setUserMenuOpen(false); }}
                                className="
                                    flex items-center gap-3 w-full px-4 py-2.5
                                    text-xs font-poppins text-neutral-7 dark:text-neutral-7
                                    hover:bg-neutral-3 dark:hover:bg-neutral-3
                                    hover:text-neutral-8 dark:hover:text-neutral-8
                                    transition-colors duration-150 cursor-pointer
                                "
                            >
                                <Settings size={15} />
                                Paramètres
                            </button>

                            <div className="border-t border-neutral-4 dark:border-neutral-4" />

                            <button
                                onClick={handleLogout}
                                className="
                                    flex items-center gap-3 w-full px-4 py-2.5
                                    text-xs font-poppins text-danger-1
                                    hover:bg-danger-2 transition-colors duration-150 cursor-pointer
                                "
                            >
                                <LogOut size={15} />
                                Déconnexion
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
};

export default TopBar;