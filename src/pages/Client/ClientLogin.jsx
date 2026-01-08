import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, MapPin, Lock, ArrowRight, LogIn, AlertCircle, ArrowLeft, Check } from 'lucide-react';

const ClientLogin = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [registrationStep, setRegistrationStep] = useState(1); // 1 or 2
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        preferences: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    password: formData.phone
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Identifiants invalides');
            }

            console.log('Connexion réussie:', data);
            localStorage.setItem('token', data.token);
            localStorage.setItem('client_session', JSON.stringify(data.user));
            navigate('/client');
        } catch (err) {
            setError(err.message === 'Failed to fetch' ? 'Impossible de contacter le serveur (Port 5000)' : err.message);
        }
    };

    // Ajout de validations strictes pour chaque étape
    const handleRegistrationStep1 = (e) => {
        e.preventDefault();
        setError('');

        // Validation stricte des champs de l'étape 1
        if (!formData.name.trim() || !formData.phone.trim()) {
            setError('Veuillez remplir tous les champs requis pour continuer.');
            return;
        }

        // Vérification si le numéro de téléphone existe déjà
        const clients = JSON.parse(localStorage.getItem('clients') || '[]');
        if (clients.some(c => c.phone === formData.phone.trim())) {
            setError('Ce numéro de téléphone est déjà enregistré.');
            return;
        }

        // Passer à l'étape 2
        setRegistrationStep(2);
    };

    const handleRegister = (e) => {
        e.preventDefault();
        setError('');

        // Validation stricte des champs de l'étape 2
        if (!formData.email.trim() || !formData.address.trim()) {
            setError('Veuillez remplir tous les champs obligatoires pour terminer l\'inscription.');
            return;
        }

        // Validation ajustée pour rendre l'email facultatif
        if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Veuillez entrer une adresse email valide si vous en fournissez une.');
            return;
        }

        // Enregistrement du nouveau client
        const clients = JSON.parse(localStorage.getItem('clients') || '[]');
        const newClient = {
            id: Date.now().toString(),
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim(),
            address: formData.address.trim(),
            preferences: formData.preferences.trim(),
            createdAt: new Date().toISOString()
        };

        clients.push(newClient);
        localStorage.setItem('clients', JSON.stringify(clients));

        // Redirection après inscription
        localStorage.setItem('client_session', JSON.stringify(newClient));
        navigate('/client');
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    // Réinitialisation des données lors du changement de mode
    const toggleMode = () => {
        setIsRegistering(!isRegistering);
        setRegistrationStep(1);
        setError('');
        setFormData({ name: '', phone: '', email: '', address: '', preferences: '' });
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
            {/* Animated Background - Pink to Brown */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-pink-400 to-amber-800"></div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-900/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-300/10 rounded-full blur-3xl"></div>

            {/* Login Card */}
            <div className="relative z-10 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-white/20">
                {/* Header with Gradient - Pink to Brown */}
                <div className="relative bg-gradient-to-r from-pink-600 via-pink-500 to-amber-800 p-8 text-white text-center overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30 shadow-lg">
                            {isRegistering ? <User size={36} strokeWidth={2.5} /> : <LogIn size={36} strokeWidth={2.5} />}
                        </div>
                        <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">
                            {isRegistering ? 'Créer un compte' : 'Connexion'}
                        </h1>
                        <p className="text-pink-50 text-sm">
                            {isRegistering
                                ? `Étape ${registrationStep}/2 - ${registrationStep === 1 ? 'Informations de base' : 'Coordonnées'}`
                                : 'Accédez à votre espace personnel'}
                        </p>
                        {/* Step Indicator for Registration */}
                        {isRegistering && (
                            <div className="flex items-center justify-center gap-2 mt-4">
                                <div className={`h-2 w-2 rounded-full transition-all ${registrationStep >= 1 ? 'bg-white w-8' : 'bg-white/30'}`}></div>
                                <div className={`h-2 w-2 rounded-full transition-all ${registrationStep >= 2 ? 'bg-white w-8' : 'bg-white/30'}`}></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={isRegistering ? (registrationStep === 1 ? handleRegistrationStep1 : handleRegister) : handleLogin} className="p-8 space-y-5">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2 animate-in slide-in-from-top">
                            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Name and Phone - Step 1 Only */}
                    {isRegistering && registrationStep === 1 && (
                        <>
                            {/* Name */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Nom complet <span className="text-red-500">*</span>
                                </label>
                                <div className="relative group">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition" />
                                    <input
                                        type="text"
                                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition bg-gray-50 focus:bg-white"
                                        placeholder="Votre nom complet"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Numéro de téléphone <span className="text-red-500">*</span>
                                </label>
                                <div className="relative group">
                                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition" />
                                    <input
                                        type="tel"
                                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition bg-gray-50 focus:bg-white"
                                        placeholder="+243 XXX XXX XXX"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Registration Step 2 fields */}
                    {isRegistering && registrationStep === 2 && (
                        <div className="space-y-5 animate-in slide-in-from-right">
                            {/* Email */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <div className="relative group">
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition" />
                                    <input
                                        type="email"
                                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition bg-gray-50 focus:bg-white"
                                        placeholder="votre@email.com"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Adresse <span className="text-red-500">*</span>
                                </label>
                                <div className="relative group">
                                    <MapPin size={18} className="absolute left-4 top-4 text-gray-400 group-focus-within:text-pink-500 transition" />
                                    <textarea
                                        rows="2"
                                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none resize-none transition bg-gray-50 focus:bg-white"
                                        placeholder="Votre adresse complète"
                                        value={formData.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Preferences */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Préférences / Notes (optionnel)
                                </label>
                                <textarea
                                    rows="2"
                                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none resize-none transition bg-gray-50 focus:bg-white"
                                    placeholder="Allergies, préférences de style, etc."
                                    value={formData.preferences}
                                    onChange={(e) => handleInputChange('preferences', e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Login Fields */}
                    {!isRegistering && (
                        <>
                            {/* Name */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Nom Complet <span className="text-red-500">*</span>
                                </label>
                                <div className="relative group">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition" />
                                    <input
                                        type="text"
                                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition bg-gray-50 focus:bg-white"
                                        placeholder="Votre nom complet"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Phone (used as password) */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Numéro de téléphone <span className="text-red-500">*</span>
                                </label>
                                <div className="relative group">
                                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition" />
                                    <input
                                        type="tel"
                                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition bg-gray-50 focus:bg-white"
                                        placeholder="06 XX XX XX XX"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        required
                                    />
                                </div>
                                <p className="text-[10px] text-gray-400 italic">Ton numéro sert de mot de passe par défaut.</p>
                            </div>
                        </>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        {/* Back button for registration step 2 */}
                        {isRegistering && registrationStep === 2 && (
                            <button
                                type="button"
                                onClick={() => setRegistrationStep(1)}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <ArrowLeft size={20} />
                                Retour
                            </button>
                        )}

                        {/* Submit/Next Button */}
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-pink-500/30"
                        >
                            {isRegistering ? (
                                registrationStep === 1 ? (
                                    <>
                                        Suivant <ArrowRight size={20} />
                                    </>
                                ) : (
                                    <>
                                        <Check size={20} />
                                        Valider
                                    </>
                                )
                            ) : (
                                <>
                                    Se connecter <LogIn size={20} />
                                </>
                            )}
                        </button>
                    </div>

                    {/* Toggle Mode */}
                    <div className="text-center pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={toggleMode}
                            className="text-pink-600 hover:text-pink-700 font-semibold text-sm transition hover:underline"
                        >
                            {isRegistering
                                ? '← Déjà inscrit ? Se connecter'
                                : "Pas encore inscrit ? S'inscrire →"}
                        </button>
                    </div>

                    {/* Back to Home */}
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="text-gray-500 hover:text-gray-700 text-sm transition hover:underline"
                        >
                            ← Retour au site
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClientLogin;
