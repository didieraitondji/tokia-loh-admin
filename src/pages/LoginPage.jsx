import { useAuth } from '../context/AuthContext';
import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import InputField from '../components/InputField';
import PhoneInputField from '../components/PhoneInputField';
import { useNavigate } from 'react-router';
import ThemeToggle from '../components/ThemeToggle';
import { auth } from '../config/firebase.config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import '../styles/phone-input-custom.css'; // Importer les styles personnalisés

const LoginPage = () => {

    // variable pour la navigation 
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    // Rediriger vers dashboard si déjà connecté
    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // utilisation de useEffect pour quelques tâches
    useEffect(() => {
        // changement du titre de la page
        document.title = 'Admin Tokia-Loh | Connexion';

        // Initialiser le RecaptchaVerifier au montage du composant
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': (response) => {
                    // reCAPTCHA résolu
                    console.log('reCAPTCHA résolu');
                }
            });
        }

        // Nettoyage au démontage
        return () => {
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        };
    }, []);

    // States pour le formulaire
    const [step, setStep] = useState(1); // 1 = saisie téléphone, 2 = saisie OTP
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [verificationId, setVerificationId] = useState('');
    const [isValidPhone, setIsValidPhone] = useState(false);

    // state pour le chargement
    const [loading, setLoading] = useState(false);

    // state pour les erreurs
    const [error, setError] = useState({});


    // Fonction pour valider le code OTP (6 chiffres)
    const validateOTP = (code) => {
        const re = /^\d{6}$/;
        return re.test(code);
    }

    // Gestion du changement du numéro de téléphone
    const handlePhoneChange = (value, country, e, formattedValue) => {
        // value contient le numéro avec le code pays (ex: "22561234567")
        const fullNumber = '+' + value;
        setPhoneNumber(fullNumber);

        // Validation automatique par react-phone-input-2
        // On vérifie si le numéro a le bon nombre de chiffres selon le pays
        const phoneLength = value.length - country.dialCode.length;

        // Définir la longueur attendue selon le pays
        const expectedLengths = {
            'ci': 10, // Côte d'Ivoire: 10 chiffres après +225
            'bj': 10,  // Bénin: 8 chiffres après +229
            'sn': 9,  // Sénégal: 9 chiffres après +221
            'tg': 8,  // Togo: 8 chiffres après +228
            'bf': 8   // Burkina Faso: 8 chiffres après +226
        };

        const expectedLength = expectedLengths[country.countryCode] || 8;
        const valid = phoneLength === expectedLength;

        setIsValidPhone(valid);

        if (!valid && value.length > 3) {
            setError({ phone: `Numéro invalide pour ${country.name}` });
        } else {
            setError({});
        }
    };

    // Gestion du changement du code OTP
    const handleOTPChange = (e) => {
        const { value } = e.target;
        // Limiter à 6 chiffres uniquement
        if (value.length <= 6 && /^\d*$/.test(value)) {
            setOtpCode(value);

            const newError = {};
            if (value && !validateOTP(value)) {
                newError.otp = 'Le code doit contenir 6 chiffres';
            }
            setError(newError);
        }
    };

    // Étape 1 : Envoi du code OTP
    const handleSendOTP = async (e) => {
        e.preventDefault();

        if (!phoneNumber || phoneNumber.length < 10) {
            setError({ phone: 'Veuillez entrer votre numéro de téléphone' });
            return;
        }

        if (!isValidPhone) {
            setError({ phone: 'Format de numéro invalide' });
            return;
        }

        setLoading(true);
        setError({});

        // TEMPORAIRE : Simulation sans Firebase
        setTimeout(() => {
            setVerificationId('fake-verification-id'); // ID fictif
            setStep(2); // Passer à l'étape de saisie du code
            setLoading(false);
        }, 1500); // Simule 1.5s de délai

        /* DÉSACTIVÉ TEMPORAIREMENT - NÉCESSITE FACTURATION FIREBASE
        try {
            const appVerifier = window.recaptchaVerifier;
            const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            setVerificationId(confirmationResult.verificationId);
            setStep(2);
            setLoading(false);
        } catch (err) {
            console.error('Erreur lors de l\'envoi du code:', err);
            let errorMessage = 'Erreur lors de l\'envoi du code';
            if (err.code === 'auth/invalid-phone-number') {
                errorMessage = 'Numéro de téléphone invalide';
            } else if (err.code === 'auth/too-many-requests') {
                errorMessage = 'Trop de tentatives. Réessayez plus tard';
            } else if (err.message === 'Numéro non enregistré') {
                errorMessage = 'Ce numéro n\'est pas enregistré dans le système';
            }
            setError({ global: errorMessage });
            setLoading(false);
        }
        */
    };

    // Étape 2 : Vérification du code OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        if (!otpCode) {
            setError({ otp: 'Veuillez entrer le code reçu' });
            return;
        }

        if (!validateOTP(otpCode)) {
            setError({ otp: 'Le code doit contenir 6 chiffres' });
            return;
        }

        setLoading(true);
        setError({});

        // TEMPORAIRE : Simulation sans Firebase
        setTimeout(() => {
            // Créer l'objet utilisateur
            const userData = {
                phone: phoneNumber,
                connectedAt: new Date().toISOString()
            };

            // Enregistrer dans le contexte et localStorage
            login(userData);

            setLoading(false);
            navigate('/dashboard');
        }, 1000);

        /* DÉSACTIVÉ TEMPORAIREMENT - NÉCESSITE FACTURATION FIREBASE
        try {
            const credential = auth.PhoneAuthProvider.credential(verificationId, otpCode);
            await auth.signInWithCredential(credential);
            setLoading(false);
            navigate('/dashboard');
        } catch (err) {
            console.error('Erreur lors de la vérification:', err);
            let errorMessage = 'Code invalide';
            if (err.code === 'auth/invalid-verification-code') {
                errorMessage = 'Code incorrect. Veuillez réessayer';
            } else if (err.code === 'auth/code-expired') {
                errorMessage = 'Le code a expiré. Demandez un nouveau code';
            }
            setError({ global: errorMessage });
            setLoading(false);
        }
        */
    };

    // Fonction pour retourner à l'étape 1
    const handleBackToPhone = () => {
        setStep(1);
        setOtpCode('');
        setError({});
    };

    return (
        <div className="min-h-screen bg-neutral-2 flex items-center justify-center p-4">

            {/* Conteneur invisible pour reCAPTCHA */}
            <div id="recaptcha-container"></div>

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
                        {step === 1
                            ? 'Connectez-vous avec votre numéro de téléphone'
                            : 'Entrez le code reçu par SMS'
                        }
                    </p>
                </div>

                {/* Badge sécurité */}
                <div className="flex items-center justify-center gap-2 bg-primary-5 text-primary-7 rounded-full px-4 py-1.5 text-xs font-medium font-poppins w-fit mx-auto">
                    <ShieldCheck size={13} />
                    {step === 1
                        ? 'Accès sécurisé — Administrateurs uniquement'
                        : 'Vérification en cours'
                    }
                </div>

                {/* ÉTAPE 1 : Saisie du numéro de téléphone */}
                {step === 1 && (
                    <form onSubmit={handleSendOTP} className="flex flex-col gap-4">

                        {/* Champ de numéro de téléphone avec sélecteur de pays */}
                        <PhoneInputField
                            label="Numéro de téléphone"
                            name="phone"
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                            error={error.phone}
                            placeholder="Entrez votre numéro"
                            required
                        />

                        {/* Erreur globale */}
                        {error.global && (
                            <p className="text-danger-1 text-xs font-poppins">{error.global}</p>
                        )}

                        {/* Bouton envoyer le code */}
                        <Button
                            type="submit"
                            variant="primary"
                            size="large"
                            loading={loading}
                            disabled={!isValidPhone || loading}
                            className="w-full mt-2"
                        >
                            {loading ? 'Envoi en cours...' : 'Envoyer le code'}
                        </Button>

                        {/* Aide */}
                        <p className="text-center text-xs text-neutral-6 font-poppins">
                            Disponible pour : CI 🇨🇮 • BJ 🇧🇯 • SN 🇸🇳 • TG 🇹🇬 • BF 🇧🇫
                        </p>
                    </form>
                )}

                {/* ÉTAPE 2 : Saisie du code OTP */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">

                        {/* Afficher le numéro masqué */}
                        <div className="bg-neutral-2 rounded-lg p-3 text-center">
                            <p className="text-xs text-neutral-6 font-poppins mb-1">
                                Code envoyé au
                            </p>
                            <p className="text-sm font-medium text-neutral-9 font-poppins">
                                {phoneNumber.slice(0, 4)}****{phoneNumber.slice(-2)}
                            </p>
                        </div>

                        <InputField
                            label="Code de vérification"
                            name="otp"
                            type="text"
                            value={otpCode}
                            onChange={handleOTPChange}
                            error={error.otp}
                            placeholder="000000"
                            maxLength={6}
                            required
                            className="text-center text-2xl tracking-widest"
                        />

                        {/* Erreur globale */}
                        {error.global && (
                            <p className="text-danger-1 text-xs font-poppins text-center">{error.global}</p>
                        )}

                        {/* Boutons */}
                        <div className="flex flex-col gap-2">
                            <Button
                                type="submit"
                                variant="primary"
                                size="large"
                                loading={loading}
                                className="w-full"
                            >
                                {loading ? 'Vérification...' : 'Se connecter'}
                            </Button>

                            {/* Bouton retour */}
                            <button
                                type="button"
                                onClick={handleBackToPhone}
                                className="flex items-center justify-center gap-2 text-neutral-6 hover:text-neutral-9 text-sm font-poppins transition-colors"
                            >
                                <ArrowLeft size={14} />
                                Changer de numéro
                            </button>
                        </div>

                        {/* Renvoyer le code */}
                        <button
                            type="button"
                            onClick={handleSendOTP}
                            disabled={loading}
                            className="text-primary-1 hover:text-primary-2 text-xs font-poppins text-center underline disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Renvoyer le code
                        </button>
                    </form>
                )}

                {/* Footer */}
                <p className="text-center text-xs text-neutral-6 font-poppins">
                    &copy; {new Date().getFullYear()} Tokia-Loh
                </p>
            </div>
        </div>
    );
};

export default LoginPage;