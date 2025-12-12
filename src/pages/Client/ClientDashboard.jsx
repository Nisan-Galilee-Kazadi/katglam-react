import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Plus } from 'lucide-react';

const ClientDashboard = () => {
    const { client } = useOutletContext();
    const [stats, setStats] = useState({
        pending: 0,
        confirmed: 0,
        total: 0
    });
    const [recentReservations, setRecentReservations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Load client's reservations
        const allReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
        const clientReservations = allReservations.filter(r => r.clientId === client.id);

        // Calculate stats
        const pending = clientReservations.filter(r => r.status === 'pending').length;
        const confirmed = clientReservations.filter(r => r.status === 'confirmed').length;

        setStats({
            pending,
            confirmed,
            total: clientReservations.length
        });

        // Get recent reservations (last 3)
        const recent = clientReservations
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3);
        setRecentReservations(recent);
    }, [client.id]);

    const getStatusBadge = (status) => {
        const badges = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: AlertCircle, label: 'En attente' },
            confirmed: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Confirmé' },
            cancelled: { bg: 'bg-gray-100', text: 'text-gray-700', icon: XCircle, label: 'Annulé' },
            rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Refusé' }
        };
        const badge = badges[status] || badges.pending;
        const Icon = badge.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                <Icon size={14} />
                {badge.label}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">Bienvenue, {client.name} !</h1>
                <p className="text-pink-100">Gérez vos réservations et prenez rendez-vous facilement</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">En attente</p>
                            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Clock size={24} className="text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Confirmées</p>
                            <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle size={24} className="text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total</p>
                            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                        </div>
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <Calendar size={24} className="text-gray-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Actions rapides</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                        onClick={() => navigate('/client/calendar')}
                        className="flex items-center gap-3 p-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition shadow-md"
                    >
                        <Plus size={24} />
                        <div className="text-left">
                            <p className="font-semibold">Nouvelle réservation</p>
                            <p className="text-xs text-pink-100">Choisir une date disponible</p>
                        </div>
                    </button>
                    <button
                        onClick={() => navigate('/client/reservations')}
                        className="flex items-center gap-3 p-4 bg-white border-2 border-pink-200 text-pink-600 rounded-lg hover:bg-pink-50 transition"
                    >
                        <Calendar size={24} />
                        <div className="text-left">
                            <p className="font-semibold">Voir mes réservations</p>
                            <p className="text-xs text-pink-400">Gérer vos rendez-vous</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Recent Reservations */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Réservations récentes</h2>
                {recentReservations.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <Calendar size={48} className="mx-auto mb-3 opacity-50" />
                        <p>Aucune réservation pour le moment</p>
                        <button
                            onClick={() => navigate('/client/calendar')}
                            className="mt-4 text-pink-600 hover:text-pink-700 font-medium"
                        >
                            Créer votre première réservation →
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentReservations.map(reservation => (
                            <div key={reservation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <p className="font-semibold text-gray-800">
                                            {new Date(reservation.date).toLocaleDateString('fr-FR', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'long'
                                            })}
                                        </p>
                                        {getStatusBadge(reservation.status)}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {reservation.timeSlot}
                                        </span>
                                        <span>{reservation.service}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientDashboard;
