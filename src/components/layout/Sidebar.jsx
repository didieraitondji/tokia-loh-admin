import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavLink, useNavigate } from 'react-router';
import {
    LayoutDashboard, Package, Grid2X2, ShoppingCart,
    Users, MapPin, Bell, BarChart2, Settings,
    LogOut, ChevronLeft, ChevronRight,
    Rss
} from 'lucide-react';
import LogoutConfirmModal from '../LogoutConfirmModal';
import ThemeToggle from '../ThemeToggle';

// ── Navigation items ────────────────────────────────────────────
const navMain = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/products', icon: Package, label: 'Produits' },
    { to: '/categories', icon: Grid2X2, label: 'Catégories' },
    { to: '/orders', icon: ShoppingCart, label: 'Commandes' },
    { to: '/clients', icon: Users, label: 'Clients' },
    { to: '/cities', icon: MapPin, label: 'Villes' },
];

const navSecondary = [
    { to: '/notifications', icon: Bell, label: 'Notifications' },
    { to: '/publish', icon: Rss, label: 'Publicité' }, // pour la partie publicité icon rss
    { to: '/reports', icon: BarChart2, label: 'Rapports' },
    { to: '/settings', icon: Settings, label: 'Paramètres' },
];

// ── NavItem ──────────────────────────────────────────────────────
const NavItem = ({ to, icon: Icon, label, collapsed, onNavigate }) => (
    <NavLink
        to={to}
        title={collapsed ? label : ''}
        onClick={onNavigate}
        className={({ isActive }) => `
            flex items-center gap-3 px-3 py-2.5 rounded-2
            text-sm font-medium font-poppins
            transition-all duration-200 group relative
            ${isActive
                ? 'bg-primary-5 text-primary-1'
                : 'text-neutral-7 dark:text-neutral-6 hover:bg-neutral-3 dark:hover:bg-neutral-3 hover:text-neutral-8 dark:hover:text-neutral-8'
            }
        `}
    >
        <Icon size={18} className="shrink-0" />
        {!collapsed && <span className="truncate">{label}</span>}

        {/* Tooltip quand collapsed */}
        {collapsed && (
            <span className="
                absolute left-full ml-3 px-2 py-1 text-xs font-poppins
                bg-neutral-9 dark:bg-neutral-7 text-neutral-0 dark:text-neutral-8
                rounded-2 whitespace-nowrap
                opacity-0 group-hover:opacity-100 pointer-events-none
                transition-opacity duration-200 z-50
            ">
                {label}
            </span>
        )}
    </NavLink>
);

// ── Sidebar ──────────────────────────────────────────────────────
const Sidebar = ({ collapsed, onToggle, onNavigate }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
        // fermer la sidebar si on clique sur le bouton de logout
        onToggle();
    };

    const handleConfirmLogout = () => {
        logout();
        setIsLogoutModalOpen(false);
    };

    const handleCancelLogout = () => {
        setIsLogoutModalOpen(false);
    };

    return (
        <div className="w-full">
            <aside className={`
            relative flex flex-col
            bg-neutral-0 dark:bg-neutral-0
            border-r border-neutral-4 dark:border-neutral-4
            transition-all duration-300 ease-in-out
            h-screen shrink-0
            ${collapsed ? 'w-16' : 'w-60'}
            `}>

                {/* ── Logo ── */}
                <div className={`
                flex items-center h-16 px-4 border-b border-neutral-4 dark:border-neutral-4
                ${collapsed ? 'justify-center' : 'gap-3'}
            `}>
                    <div className="flex items-center justify-center w-8 h-8 rounded-2 bg-neutral-3 dark:bg-neutral-3 shrink-0">
                        <span className="font-poppins font-bold text-sm leading-none">
                            <span className="text-primary-1">T</span>
                            <span className="text-secondary-1">L</span>
                        </span>
                    </div>
                    {!collapsed && (
                        <span className="font-poppins font-bold text-sm text-neutral-8 dark:text-neutral-8">
                            <span className="text-primary-1">Tokia</span>
                            <span className="text-secondary-1">-Loh</span>
                        </span>
                    )}
                </div>

                {/* ── Navigation principale ── */}
                <nav className="flex flex-col gap-1 px-2 pt-4 flex-1 overflow-y-auto overflow-x-hidden">
                    {navMain.map(item => (
                        <NavItem key={item.to} {...item} collapsed={collapsed} onNavigate={onNavigate} />
                    ))}

                    {/* Séparateur */}
                    <div className="my-3 border-t border-neutral-4 dark:border-neutral-4" />

                    {navSecondary.map(item => (
                        <NavItem key={item.to} {...item} collapsed={collapsed} onNavigate={onNavigate} />
                    ))}
                </nav>

                {/* ── Bas de sidebar : ThemeToggle + Déconnexion ── */}
                <div className="px-2 pb-4 flex flex-col gap-1 border-t border-neutral-4 dark:border-neutral-4 pt-3">

                    {/* ThemeToggle */}
                    <div className={`flex ${collapsed ? 'justify-center' : 'items-center gap-3 px-3 py-2'}`}>
                        <ThemeToggle />
                        {!collapsed && (
                            <span className="text-sm font-medium font-poppins text-neutral-7 dark:text-neutral-6">
                                Thème
                            </span>
                        )}
                    </div>

                    {/* Déconnexion */}
                    <button
                        onClick={handleLogoutClick}
                        title={collapsed ? 'Déconnexion' : ''}
                        className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-2 w-full
                        text-sm font-medium font-poppins text-danger-1
                        hover:bg-danger-2 transition-all duration-200
                        cursor-pointer group relative
                        ${collapsed ? 'justify-center' : ''}
                    `}
                    >
                        <LogOut size={18} className="shrink-0" />
                        {!collapsed && <span>Déconnexion</span>}

                        {collapsed && (
                            <span className="
                            absolute left-full ml-3 px-2 py-1 text-xs font-poppins
                            bg-neutral-9 dark:bg-neutral-7 text-neutral-0 dark:text-neutral-8
                            rounded-2 whitespace-nowrap
                            opacity-0 group-hover:opacity-100 pointer-events-none
                            transition-opacity duration-200 z-50
                        ">
                                Déconnexion
                            </span>
                        )}
                    </button>
                </div>

                {/* ── Bouton collapse (flèche sur le bord) ── */}
                <button
                    onClick={onToggle}
                    className="
                    absolute -right-3 top-20
                    w-6 h-6 rounded-full
                    bg-neutral-0 dark:bg-neutral-2
                    border border-neutral-4 dark:border-neutral-4
                    flex items-center justify-center
                    text-neutral-6 dark:text-neutral-6
                    hover:text-primary-1 hover:border-primary-1
                    transition-all duration-200
                    cursor-pointer z-10 shadow-sm
                "
                >
                    {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
                </button>
            </aside>
            <LogoutConfirmModal
                isOpen={isLogoutModalOpen}
                onConfirm={handleConfirmLogout}
                onCancel={handleCancelLogout}
            />
        </div>
    );
};

export default Sidebar;