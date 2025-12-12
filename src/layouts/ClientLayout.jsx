import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Calendar, List, History, LogOut, User } from 'lucide-react';

const ClientLayout = () => {
    const [client, setClient] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if client is logged in
        const session = localStorage.getItem('client_session');
        if (!session) {
            navigate('/client/login');
        } else {
            setClient(JSON.parse(session));
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('client_session');
        navigate('/client/login');
    };

    if (!client) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo & Client Name */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                                    {client.name.charAt(0)}
                                </div>
                                <div>
                                    <h1 className="font-bold text-gray-800">KatGlamour</h1>
                                    <p className="text-xs text-gray-500">Espace Client</p>
                                </div>
                            </div>
                        </div>

                        {/* Client Info & Logout */}
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-medium text-gray-800">{client.name}</p>
                                <p className="text-xs text-gray-500">{client.phone}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                                <LogOut size={18} />
                                <span className="hidden sm:inline">Déconnexion</span>
                            </button>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <nav className="flex gap-1 -mb-px overflow-x-auto">
                        <NavLink
                            to="/client"
                            end
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition ${isActive
                                    ? 'border-pink-500 text-pink-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                                }`
                            }
                        >
                            <User size={18} />
                            Tableau de bord
                        </NavLink>
                        <NavLink
                            to="/client/calendar"
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition ${isActive
                                    ? 'border-pink-500 text-pink-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                                }`
                            }
                        >
                            <Calendar size={18} />
                            Réserver
                        </NavLink>
                        <NavLink
                            to="/client/reservations"
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition ${isActive
                                    ? 'border-pink-500 text-pink-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                                }`
                            }
                        >
                            <List size={18} />
                            Mes Réservations
                        </NavLink>
                        <NavLink
                            to="/client/history"
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition ${isActive
                                    ? 'border-pink-500 text-pink-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                                }`
                            }
                        >
                            <History size={18} />
                            Historique
                        </NavLink>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet context={{ client }} />
            </main>
        </div>
    );
};

export default ClientLayout;
