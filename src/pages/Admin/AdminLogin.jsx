import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Simple hardcoded check matches AdminLayout
        if (password === 'admin123' || password === 'katglam2025') {
            sessionStorage.setItem('isAuthenticated', 'true');
            navigate('/admin');
        } else {
            alert('Mot de passe incorrect');
        }
    };

    return (
        <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
                <div className="bg-pink-100 p-4 rounded-full inline-block mb-4 text-pink-500">
                    <Lock size={32} />
                </div>
                <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Accès Administrateur</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="w-full bg-pink-600 text-white font-bold py-3 rounded-xl hover:bg-pink-700 transition"
                    >
                        Connexion
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
