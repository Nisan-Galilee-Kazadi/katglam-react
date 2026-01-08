import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Calendar, List, History, LogOut, User, Menu, X } from 'lucide-react';

const ClientLayout = () => {
    const [client, setClient] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/client/login');
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Session invalide');
                }

                const userData = await response.json();
                setClient(userData);
            } catch (error) {
                console.error('Erreur session:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('client_session');
                navigate('/client/login');
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('client_session');
        navigate('/client/login');
    };

    if (!client) return null;

    return (
        <div className="flex h-screen bg-gray-50 font-sans flex-col md:flex-row relative overflow-hidden">
            {/* Mobile Header */}
            <header className="md:hidden bg-white p-4 shadow-sm flex items-center justify-between z-20 shrink-0 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="font-bold text-gray-800 text-lg">KatGlamour</span>
                </div>
                {client.photo ? (
                    <img
                        src={client.photo}
                        alt={client.name}
                        className="w-10 h-10 rounded-full object-cover shadow-sm"
                    />
                ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                        {client.name.charAt(0)}
                    </div>
                )}
            </header>

            {/* Sidebar Overlay for mobile */}
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
                        {client.photo ? (
                            <img
                                src={client.photo}
                                alt={client.name}
                                className="w-10 h-10 rounded-full object-cover shadow-md"
                            />
                        ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                                {client.name.charAt(0)}
                            </div>
                        )}
                        <div>
                            <h1 className="font-bold text-gray-800">KatGlamour</h1>
                            <p className="text-xs text-gray-500">Espace Client</p>
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
                            to="/client"
                            end
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-pink-50 text-pink-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                                }`
                            }
                        >
                            <List size={20} />
                            Tableau de bord
                        </NavLink>
                        <NavLink
                            to="/client/profile"
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-pink-50 text-pink-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                                }`
                            }
                        >
                            <User size={20} />
                            Mes infos
                        </NavLink>
                        <NavLink
                            to="/client/calendar"
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-pink-50 text-pink-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                                }`
                            }
                        >
                            <Calendar size={20} />
                            Réserver
                        </NavLink>
                        <NavLink
                            to="/client/reservations"
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-pink-50 text-pink-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                                }`
                            }
                        >
                            <List size={20} />
                            Mes Réservations
                        </NavLink>
                        <NavLink
                            to="/client/history"
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-pink-50 text-pink-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                                }`
                            }
                        >
                            <History size={20} />
                            Historique
                        </NavLink>
                    </nav>

                    <div className="p-4 border-t border-gray-100 mt-auto">
                        <div className="px-4 py-3 mb-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-semibold text-gray-800 truncate">{client.name}</p>
                            <p className="text-xs text-gray-500 truncate">{client.phone}</p>
                        </div>
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
            <main className="flex-1 overflow-auto p-2 md:p-4 w-full h-full bg-gray-50/50">
                <div className="w-full h-full">
                    <Outlet context={{ client }} />
                </div>
            </main>
        </div>
    );
};

export default ClientLayout;
