import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CreditCard, CalendarCheck, TrendingUp, Clock, UserPlus, Calendar, PlusCircle, ArrowRight, Star } from 'lucide-react';
import axios from 'axios';

const DashboardHome = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    // Mock data for demonstration - in a real app, these would come from API calls
    const [stats, setStats] = useState({
        totalReservations: 0,
        activeClients: 0,
        monthlyRevenue: '0',
        conversionRate: '0'
    });

    const [upcomingReservations, setUpcomingReservations] = useState([]);

    const [topClients, setTopClients] = useState({
        mostFrequent: null,
        mostRecent: null
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard`);
                const { stats, upcomingReservations, topClients } = response.data;
                setStats(stats);
                setUpcomingReservations(upcomingReservations);
                setTopClients(topClients);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Bonjour, Kat !</h2>
                    <p className="text-gray-500 mt-1">Voici ce qui se passe dans votre salon aujourd'hui.</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={() => navigate('/admin/calendar')}
                        className="flex items-center space-x-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition shadow-sm"
                    >
                        <PlusCircle size={18} />
                        <span>Nouvelle Réservation</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Réservations" value={stats.totalReservations} trend="+12% ce mois" icon={<CalendarCheck />} color="bg-pink-50 text-pink-500" />
                <StatCard title="Clients Actifs" value={stats.activeClients} trend="+5% nouveaux" icon={<Users />} color="bg-blue-50 text-blue-500" />
                <StatCard title="Revenu Mensuel" value={`${stats.monthlyRevenue} €`} trend="-2% vs dernier mois" icon={<CreditCard />} color="bg-yellow-50 text-yellow-600" isNegative />
                <StatCard title="Taux de Conversion" value={`${stats.conversionRate}%`} trend="+4.5% ce mois" icon={<TrendingUp />} color="bg-purple-50 text-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Upcoming Reservations */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Clock className="text-pink-500" size={20} />
                                Prochaines Réservations
                            </h3>
                            <button
                                onClick={() => navigate('/admin/requests')}
                                className="text-pink-600 text-sm font-semibold hover:underline flex items-center gap-1"
                            >
                                Tout voir <ArrowRight size={14} />
                            </button>
                        </div>
                        <div className="p-0">
                            {upcomingReservations.length > 0 ? (
                                upcomingReservations.map((res) => (
                                    <div key={res.id} className="flex items-center justify-between p-6 hover:bg-gray-50 transition border-b border-gray-50 last:border-0">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold uppercase">
                                                {res.client.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{res.client}</p>
                                                <p className="text-sm text-gray-500">{res.service}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-gray-700">{res.time}</p>
                                            <span className={`text-xs px-2 py-1 rounded-full ${res.status === 'Confirmé' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {res.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center text-gray-500 italic">
                                    Aucune réservation à venir.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Tools Placeholder */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-6 rounded-2xl text-white shadow-md">
                            <h4 className="font-bold text-lg mb-2">Gestion Portfolio</h4>
                            <p className="text-pink-100 text-sm mb-4">Mettez à jour vos dernières réalisations pour attirer plus de clients.</p>
                            <button
                                onClick={() => navigate('/admin/portfolio')}
                                className="bg-white text-pink-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-pink-50 transition"
                            >
                                Gérer les photos
                            </button>
                        </div>
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl text-white shadow-md">
                            <h4 className="font-bold text-lg mb-2">Formations</h4>
                            <p className="text-gray-400 text-sm mb-4">Consultez les demandes pour vos prochaines sessions d'automaquillage.</p>
                            <button
                                onClick={() => navigate('/admin/formations')}
                                className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition"
                            >
                                Voir demandes
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar Content: Customers & Actions */}
                <div className="space-y-6">
                    {/* Top Clients */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Star className="text-yellow-500" size={20} />
                            Focus Clients
                        </h3>

                        <div className="space-y-6">
                            {topClients.mostFrequent ? (
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Le plus fidèle</p>
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-10 h-10 rounded-lg ${topClients.mostFrequent.avatarColor} flex items-center justify-center font-bold uppercase`}>
                                            {topClients.mostFrequent.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{topClients.mostFrequent.name}</p>
                                            <p className="text-xs text-gray-500">{topClients.mostFrequent.visits} visites</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 italic">Aucune donnée de fidélité.</p>
                            )}

                            <div className="pt-6 border-t border-gray-50">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Dernière Réservation</p>
                                {topClients.mostRecent ? (
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-10 h-10 rounded-lg ${topClients.mostRecent.avatarColor} flex items-center justify-center font-bold uppercase`}>
                                            {topClients.mostRecent.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{topClients.mostRecent.name}</p>
                                            <p className="text-xs text-gray-500">Faite le {new Date(topClients.mostRecent.date).toLocaleDateString('fr-FR')}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">Aucune réservation récente.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Fast Actions */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Actions Rapides</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <ActionButton icon={<UserPlus size={20} />} label="Client" onClick={() => navigate('/admin/clients')} />
                            <ActionButton icon={<Calendar size={20} />} label="Agenda" onClick={() => navigate('/admin/calendar')} />
                            <ActionButton icon={<CreditCard size={20} />} label="Facture" onClick={() => navigate('/admin/calendar')} />
                            <ActionButton icon={<TrendingUp size={20} />} label="Stats" onClick={() => navigate('/admin')} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Components
const StatCard = ({ title, value, trend, icon, color, isNegative = false }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-default">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-tight">{title}</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${color}`}>
                {icon}
            </div>
        </div>
        <div className="mt-4 flex items-center">
            <span className={`text-sm font-bold ${isNegative ? 'text-red-500' : 'text-emerald-500'} bg-opacity-10 px-2 py-0.5 rounded-md`}>
                {trend}
            </span>
        </div>
    </div>
);

const ActionButton = ({ icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-pink-50 hover:text-pink-600 transition group"
    >
        <div className="mb-2 text-gray-600 group-hover:text-pink-600">
            {icon}
        </div>
        <span className="text-xs font-bold text-gray-700 group-hover:text-pink-600">{label}</span>
    </button>
);

export default DashboardHome;
