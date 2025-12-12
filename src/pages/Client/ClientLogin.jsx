import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, MapPin, Lock, ArrowRight, LogIn } from 'lucide-react';

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
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-yellow-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 text-white text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        {isRegistering ? <User size={32} /> : <LogIn size={32} />}
                    </div>
                    <h1 className="text-2xl font-bold mb-2">
                        {isRegistering ? 'Créer un compte' : 'Connexion Client'}
                    </h1>
                    <p className="text-pink-100 text-sm">
                        {isRegistering
                            ? 'Inscrivez-vous pour réserver vos rendez-vous'
                            : 'Accédez à votre espace de réservation'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={isRegistering ? handleRegister : handleLogin} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom complet <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                                placeholder="Votre nom"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Numéro de téléphone <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="tel"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                                placeholder="+243 XXX XXX XXX"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Registration-only fields */}
                    {isRegistering && (
                        <>
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                                        placeholder="votre@email.com"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Adresse <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
                                    <textarea
                                        rows="2"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none resize-none"
                                        placeholder="Votre adresse complète"
                                        value={formData.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Preferences */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Préférences / Notes (optionnel)
                                </label>
                                <textarea
                                    rows="2"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none resize-none"
                                    placeholder="Allergies, préférences de style, etc."
                                    value={formData.preferences}
                                    onChange={(e) => handleInputChange('preferences', e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold py-3 rounded-lg hover:from-pink-600 hover:to-pink-700 transition flex items-center justify-center gap-2 shadow-lg"
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
                            className="text-pink-600 hover:text-pink-700 font-medium text-sm"
                        >
                            {isRegistering
                                ? 'Déjà inscrit ? Se connecter'
                                : "Pas encore inscrit ? S'inscrire"}
                        </button>
                    </div>

                    {/* Back to Home */}
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="text-gray-500 hover:text-gray-700 text-sm"
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
