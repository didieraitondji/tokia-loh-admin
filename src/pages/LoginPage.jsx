import React, { useState, useEffect } from 'react';
import { Mail, Lock, ShieldCheck } from 'lucide-react';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { useNavigate } from 'react-router';
import ThemeToggle from '../components/ThemeToggle';

const LoginPage = () => {

    // variable pour la navigation 
    const navigate = useNavigate();

    // utilisation de useEffect pour quelques tâches
    useEffect(() => {
        // changement du titre de la page
        document.title = 'Admin Tokia-Loh | Connexion';

    }, []);

    // state pour le formulaire
    const [form, setForm] = useState({ email: '', password: '', remember: false });

    // state pour le chargement
    const [loading, setLoading] = useState(false);

    // state pour les erreurs
    const [error, setError] = useState({});


    // fonction pour valide rl'e-mail
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // fonction pour valider le mote de passe (ex: au moins 8 caractères, une majuscule, un chiffre)
    const validatePassword = (password) => {
        const re = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        return re.test(password);
    }


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));

        const newError = {};

        if (name === 'email') {

            if (!validateEmail(value)) {
                newError.email = 'Adresse email invalide';
            }
            if (value === "") {
                newError.email = 'Veuillez entrer votre adresse email';
            }
        }

        if (name === 'password') {
            if (!validatePassword(value)) {
                newError.password = 'Mot de passe invalide (au moins 8 caractères, une majuscule et un chiffre)';
            }
            if (value === "") {
                newError.password = 'Veuillez entrer votre mot de passe';
            }
        }

        setError(newError || {});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email || !form.password) {
            setError({ global: 'Veuillez remplir tous les champs' });
            return;
        }
        setLoading(true);

        // appelle à l'API pour l'authentification

        setTimeout(() => setLoading(false), 2000);

        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-neutral-2 flex items-center justify-center p-4">

            {/* Cercles décoratifs en arrière-plan */}
            <div className="fixed top-20 left-20 w-72 h-72 rounded-full bg-primary-5 blur-3xl opacity-60 pointer-events-none" />
            <div className="fixed bottom-20 right-20 w-96 h-96 rounded-full bg-secondary-5 blur-3xl opacity-60 pointer-events-none" />

            {/* Carte de connexion */}
            <div className="relative w-full max-w-md bg-neutral-0 rounded-10 shadow-lg p-8 flex flex-col gap-6">

                {/* Bouton thème en haut à droite */}
                <div className="absolute top-4 right-4">
                    <ThemeToggle />
                </div>

                {/* Logo + titre */}
                <div className="flex flex-col items-center gap-2">
                    {/* Logo TOKIA-LOH */}
                    <div className="flex items-center justify-center w-14 h-14 rounded-10 bg-neutral-2 mb-1">
                        <span className="font-poppins font-bold text-h4 leading-none">
                            <span className="text-primary-1">T</span>
                            <span className="text-secondary-1">L</span>
                        </span>
                    </div>

                    <h1 className="font-poppins font-bold text-h5 text-neutral-9">
                        Backoffice
                        <span className="text-primary-1"> Tokia</span>
                        <span className="text-secondary-1">-Loh</span>
                    </h1>
                    <p className="text-xs text-neutral-6 text-center font-poppins">
                        Connectez-vous pour accéder à l'administration
                    </p>
                </div>

                {/* Badge sécurité */}
                <div className="flex items-center justify-center gap-2 bg-primary-5 text-primary-7 rounded-full px-4 py-1.5 text-xs font-medium font-poppins w-fit mx-auto">
                    <ShieldCheck size={13} />
                    Accès sécurisé — Administrateurs uniquement
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <InputField
                        label="Adresse email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        error={error.email}
                        placeholder="admin@tokia-loh.com"
                        icon={<Mail size={15} />}
                        required
                    />

                    <InputField
                        label="Mot de passe"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        error={error.password}
                        placeholder="••••••••"
                        icon={<Lock size={15} />}
                        required
                    />

                    {/* Erreur */}
                    {error.global && <p className="text-danger-1 text-xs font-poppins">{error.global}</p>}

                    {/* Bouton connexion */}
                    <Button
                        type="submit"
                        variant="primary"
                        size="large"
                        loading={loading}
                        className="w-full mt-2"
                    >
                        {loading ? 'Connexion en cours...' : 'Se connecter'}
                    </Button>
                </form>

                {/* Footer */}
                <p className="text-center text-xs text-neutral-6 font-poppins">
                    &copy; {new Date().getFullYear()} Tokia-Loh
                </p>
            </div>
        </div>
    );
};

export default LoginPage;