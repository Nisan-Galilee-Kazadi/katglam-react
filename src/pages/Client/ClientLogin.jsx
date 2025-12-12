import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, MapPin, Lock, ArrowRight, LogIn, AlertCircle } from 'lucide-react';

const ClientLogin = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        preferences: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name.trim() || !formData.phone.trim()) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        // Get clients from localStorage
        const clients = JSON.parse(localStorage.getItem('clients') || '[]');

        // Find client by name and phone
        const client = clients.find(c =>
            c.name.toLowerCase() === formData.name.toLowerCase().trim() &&
            c.phone === formData.phone.trim()
        );

        if (client) {
            // Set session
            localStorage.setItem('client_session', JSON.stringify(client));
            navigate('/client');
        } else {
            setError('Aucun compte trouvé avec ces informations. Veuillez vous inscrire.');
        }
    };

    const handleRegister = (e) => {
        e.preventDefault();
        setError('');

        // Validate all required fields
        if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.address.trim()) {
            setError('Veuillez remplir tous les champs obligatoires');
            return;
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Email invalide');
            return;
        }

        // Get existing clients
        const clients = JSON.parse(localStorage.getItem('clients') || '[]');

        // Check if phone already exists
        if (clients.some(c => c.phone === formData.phone.trim())) {
            setError('Ce numéro de téléphone est déjà enregistré');
            return;
        }

        // Create new client
        const newClient = {
            id: Date.now().toString(),
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim(),
            address: formData.address.trim(),
            preferences: formData.preferences.trim(),
            createdAt: new Date().toISOString()
        };

        // Save to localStorage
        clients.push(newClient);
        localStorage.setItem('clients', JSON.stringify(clients));

        // Set session
        localStorage.setItem('client_session', JSON.stringify(newClient));

        // Redirect to client dashboard
        navigate('/client');
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
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
                                ? 'Rejoignez KatGlamour et réservez facilement'
                                : 'Accédez à votre espace personnel'}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={isRegistering ? handleRegister : handleLogin} className="p-8 space-y-5">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2 animate-in slide-in-from-top">
                            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

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

                    {/* Registration-only fields */}
                    {isRegistering && (
                        <div className="space-y-5 animate-in slide-in-from-top">
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
                                        required
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

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-pink-500/30"
                    >
                        {isRegistering ? (
                            <>
                                S'inscrire <ArrowRight size={20} />
                            </>
                        ) : (
                            <>
                                Se connecter <LogIn size={20} />
                            </>
                        )}
                    </button>

                    {/* Toggle Mode */}
                    <div className="text-center pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => {
                                setIsRegistering(!isRegistering);
                                setError('');
                                setFormData({ name: '', phone: '', email: '', address: '', preferences: '' });
                            }}
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
