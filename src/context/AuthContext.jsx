import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Charger l'utilisateur depuis localStorage au montage
    useEffect(() => {
        const storedUser = localStorage.getItem('tokia_admin_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Erreur lors du chargement de l\'utilisateur:', error);
                localStorage.removeItem('tokia_admin_user');
            }
        }
        setLoading(false);
    }, []);

    // Connexion
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('tokia_admin_user', JSON.stringify(userData));
    };

    // Déconnexion
    const logout = () => {
        setUser(null);
        localStorage.removeItem('tokia_admin_user');
        // actueliser le navigateur
        window.location.reload();
    };

    // Vérifier si l'utilisateur est connecté
    const isAuthenticated = () => {
        return user !== null;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé dans un AuthProvider');
    }
    return context;
};