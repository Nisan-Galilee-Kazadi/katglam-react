import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Image, Settings, LogOut, Home, Lock, Menu, X, ClipboardList, Bell, User, BookOpen, DollarSign } from 'lucide-react';

const AdminLayout = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [pendingCount, setPendingCount] = useState(0);
    const navigate = useNavigate();

    // Load profile photo from localStorage
    useEffect(() => {
        const loadProfilePhoto = () => {
            const saved = localStorage.getItem('admin_profile');
            if (saved) {
                const profile = JSON.parse(saved);
                setProfilePhoto(profile.photo);
            }
        };
        loadProfilePhoto();

        // Listen for storage changes to update photo in real-time
        window.addEventListener('storage', loadProfilePhoto);
        // Listen for custom event when photo is updated
        window.addEventListener('profilePhotoUpdated', loadProfilePhoto);
        return () => {
            window.removeEventListener('storage', loadProfilePhoto);
            window.removeEventListener('profilePhotoUpdated', loadProfilePhoto);
        };
    }, []);

    // Load pending requests count
    useEffect(() => {
        const updatePendingCount = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations`);
                const reservations = await response.json();
                const pending = reservations.filter(r => r.status === 'pending').length;
                setPendingCount(pending);
            } catch (error) {
                console.error('Error fetching pending count:', error);
            }
        };

        updatePendingCount();
        const interval = setInterval(updatePendingCount, 10000); // Polling every 10s for live updates

        return () => clearInterval(interval);
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        // Simple hardcoded check for demo purposes
        if (password === 'admin123' || password === 'katglam2025') {
            setIsAuthenticated(true);
            sessionStorage.setItem('admin_auth', 'true');
        } else {
            setError('Code accès incorrect');
        }
    };

    useEffect(() => {
        if (sessionStorage.getItem('admin_auth') === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('admin_auth');
        setIsAuthenticated(false);
        navigate('/');
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 text-pink-500">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-2xl font-serif font-bold text-gray-800 mb-2">Accès Sécurisé</h1>
                    <p className="text-gray-500 mb-6">Veuillez entrer le code d'administration pour accéder au tableau de bord.</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-center text-lg tracking-widest"
                            placeholder="••••••••"
                            autoFocus
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button type="submit" className="w-full bg-pink-600 text-white font-bold py-3 rounded-xl hover:bg-pink-700 transition">
                            Déverrouiller
                        </button>
                        <button type="button" onClick={() => navigate('/')} className="text-gray-400 text-sm hover:text-gray-600">
                            Retour au site
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-gray-100 font-sans flex-col md:flex-row relative overflow-hidden">

            {/* Mobile Header */}
            <header className="md:hidden bg-white p-4 shadow-sm flex items-center justify-between z-20 shrink-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="font-bold text-gray-800 text-lg">KatGlamour</span>
                </div>
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                    {profilePhoto ? (
                        <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        'K'
                    )}
                </div>
            </header>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:relative inset-y-0 left-0 w-64 bg-white shadow-xl flex flex-col z-50 
                transform transition-transform duration-300 ease-in-out h-full
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                            {profilePhoto ? (
                                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                'K'
                            )}
                        </div>
                        <div>
                            <h1 className="font-bold text-gray-800">KatGlamour</h1>
                            <p className="text-xs text-gray-500">Admin Dashboard</p>
                        </div>
                    </div>
                    {/* Close button for mobile */}
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto flex flex-col">
                    <nav className="flex-1 p-4 space-y-2">
                        <NavLink
                            to="/admin"
                            end
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-pink-50 text-pink-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                                }`
                            }
                        >
                            <LayoutDashboard size={20} />
                            Dashboard
                        </NavLink>
                        <NavLink
                            to="/admin/calendar"
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-pink-50 text-pink-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                                }`
                            }
                        >
                            <Calendar size={20} />
                            Calendrier
                        </NavLink>
                        <NavLink
                            to="/admin/requests"
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${isActive ? 'bg-pink-50 text-pink-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                                }`
                            }
                        >
                            <ClipboardList size={20} />
                            Demandes
                            {pendingCount > 0 && (
                                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center animate-pulse">
                                    {pendingCount}
                                </span>
                            )}
                        </NavLink>
                        <NavLink
                            to="/admin/clients"
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-pink-50 text-pink-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                                }`
                            }
                        >
                            <User size={20} />
                            Clients
                        </NavLink>
                        <NavLink
                            to="/admin/portfolio"
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-pink-50 text-pink-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                                }`
                            }
                        >
                            <Image size={20} />
                            Portfolio
                        </NavLink>
                        <NavLink
                            to="/admin/formations"
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-pink-50 text-pink-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                                }`
                            }
                        >
                            <BookOpen size={20} />
                            Formations
                        </NavLink>
                        <NavLink
                            to="/admin/pricing"
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-pink-50 text-pink-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                                }`
                            }
                        >
                            <DollarSign size={20} />
                            Tarifs
                        </NavLink>
                        <NavLink
                            to="/admin/settings"
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-pink-50 text-pink-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                                }`
                            }
                        >
                            <Settings size={20} />
                            Paramètres
                        </NavLink>
                    </nav>

                    <div className="p-4 border-t border-gray-100 mt-auto">
                        <NavLink
                            to="/"
                            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors mb-2"
                        >
                            <Home size={20} />
                            Retour au site
                        </NavLink>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut size={20} />
                            Déconnexion
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-4 md:p-8 w-full h-full bg-gray-50/50">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
