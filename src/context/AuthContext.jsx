import React, { createContext, useContext, useState, useCallback } from 'react';
import { authAPI } from '../api/auth.api';
import { MOCK_LOGIN_RESPONSE } from '../mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    // Recharge depuis localStorage si déjà connecté
    const [admin, setAdmin] = useState(() => {
        try {
            const stored = localStorage.getItem('admin');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ── Login ─────────────────────────────────────────────────
    const USE_MOCK = false; // à Passer à false quand l'API est prête

    const login = useCallback(async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            let token, adminData;

            if (USE_MOCK) {
                await new Promise(r => setTimeout(r, 800));
                token = MOCK_LOGIN_RESPONSE.token;
                adminData = MOCK_LOGIN_RESPONSE.admin;
            } else {
                const { data } = await authAPI.login(email, password);
                token = data.token ?? data.access ?? data.key;
                adminData = data.admin ?? data.user ?? data;
            }

            localStorage.setItem('token', token);
            localStorage.setItem('admin', JSON.stringify(adminData));
            setAdmin(adminData);
            return { success: true };
        } catch (err) {
            const message = err.message ?? 'Identifiants incorrects';
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    }, []);

    // ── Logout ────────────────────────────────────────────────
    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        setAdmin(null);
        setError(null);
        // La redirection est gérée par le router (ProtectedRoute)
    }, []);

    // ── Changer mot de passe ──────────────────────────────────
    const changePassword = useCallback(async (oldPassword, newPassword, confirmNewPassword) => {
        if (!admin?.email) throw new Error('Admin non connecté');
        const { data } = await authAPI.changePassword(
            admin.email,
            oldPassword,
            newPassword,
            confirmNewPassword
        );
        return data;
    }, [admin]);

    // ── Mot de passe oublié ───────────────────────────────────
    const forgotPassword = useCallback(async (email) => {
        const { data } = await authAPI.forgotPassword(email);
        return data;
    }, []);

    // ── Réinitialiser mot de passe ────────────────────────────
    const resetPassword = useCallback(async (email, otp, newPassword, confirmNewPassword) => {
        const { data } = await authAPI.resetPassword(email, otp, newPassword, confirmNewPassword);
        return data;
    }, []);

    const value = {
        admin,
        isAuthenticated: !!admin,
        loading,
        error,
        login,
        logout,
        changePassword,
        forgotPassword,
        resetPassword,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider');
    return context;
};