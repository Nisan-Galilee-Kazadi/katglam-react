import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Clock, AlertCircle, CheckCircle, XCircle, Trash2 } from 'lucide-react';

const MyReservations = () => {
    const { client } = useOutletContext();
    const [reservations, setReservations] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (client?.id) {
            loadReservations();
        }
    }, [client]);

    const loadReservations = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations/my`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                // Backend already sorts by date desc (from controller: sort({ date: -1 }))
                setReservations(data);
            }
        } catch (error) {
            console.error('Erreur chargement réservations:', error);
        }
    };

    const handleCancelReservation = async (reservationId) => {
        if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return;

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations/${reservationId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'cancelled' })
            });

            if (response.ok) {
                loadReservations(); // Reload list
            } else {
                alert('Erreur lors de l\'annulation');
            }
        } catch (error) {
            console.error('Erreur annulation:', error);
            alert('Erreur lors de l\'annulation');
        }
    };

    const getStatusConfig = (status) => {
        const configs = {
            pending: {
                bg: 'bg-yellow-100',
                text: 'text-yellow-700',
                border: 'border-yellow-300',
                icon: AlertCircle,
                label: 'En attente',
                description: 'Votre demande est en cours de validation'
            },
            confirmed: {
                bg: 'bg-green-100',
                text: 'text-green-700',
                border: 'border-green-300',
                icon: CheckCircle,
                label: 'Confirmé',
                description: 'Votre réservation est confirmée'
            },
            cancelled: {
                bg: 'bg-gray-100',
                text: 'text-gray-700',
                border: 'border-gray-300',
                icon: XCircle,
                label: 'Annulé',
                description: 'Réservation annulée'
            },
            rejected: {
                bg: 'bg-red-100',
                text: 'text-red-700',
                border: 'border-red-300',
                icon: XCircle,
                label: 'Refusé',
                description: 'Demande refusée par l\'administrateur'
            }
        };
        return configs[status] || configs.pending;
    };

    const filteredReservations = reservations.filter(r => {
        if (filter === 'all') return true;
        if (filter === 'active') return r.status === 'pending' || r.status === 'confirmed';
        return r.status === filter;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Mes Réservations</h1>
                    <p className="text-gray-600 text-sm mt-1">Gérez vos demandes et rendez-vous</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${filter === 'all'
                            ? 'bg-white text-pink-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        Tous ({reservations.length})
                    </button>
                    <button
                        onClick={() => setFilter('active')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${filter === 'active'
                            ? 'bg-white text-pink-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        Actifs ({reservations.filter(r => r.status === 'pending' || r.status === 'confirmed').length})
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${filter === 'pending'
                            ? 'bg-white text-pink-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        En attente
                    </button>
                </div>
            </div>

            {/* Reservations List */}
            {filteredReservations.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {filter === 'all' ? 'Aucune réservation' : 'Aucune réservation dans cette catégorie'}
                    </h3>
                    <p className="text-gray-500 mb-6">
                        {filter === 'all'
                            ? 'Vous n\'avez pas encore de réservation. Commencez par en créer une !'
                            : 'Changez de filtre pour voir d\'autres réservations'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredReservations.map(reservation => {
                        const statusConfig = getStatusConfig(reservation.status);
                        const StatusIcon = statusConfig.icon;
                        const canCancel = reservation.status === 'pending' || reservation.status === 'confirmed';

                        return (
                            <div
                                key={reservation._id}
                                className={`bg-white rounded-xl shadow-sm border-2 ${statusConfig.border} p-6 hover:shadow-md transition`}
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    {/* Main Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-full ${statusConfig.bg} flex items-center justify-center flex-shrink-0`}>
                                                <StatusIcon size={24} className={statusConfig.text} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-bold text-gray-800 text-lg">
                                                        {format(new Date(reservation.date), 'EEEE d MMMM yyyy', { locale: fr })}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
                                                        {statusConfig.label}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={16} className="text-gray-400" />
                                                        <span>{reservation.timeSlot}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={16} className="text-gray-400" />
                                                        <span>{reservation.service}</span>
                                                    </div>
                                                </div>
                                                {reservation.notes && (
                                                    <p className="text-sm text-gray-500 mt-2 italic">
                                                        Note: {reservation.notes}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-400 mt-2">
                                                    Demandé le {format(new Date(reservation.createdAt), 'dd/MM/yyyy à HH:mm')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {canCancel && (
                                        <div className="flex lg:flex-col gap-2">
                                            <button
                                                onClick={() => handleCancelReservation(reservation._id)}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition border border-red-200 text-sm font-medium"
                                            >
                                                <Trash2 size={16} />
                                                Annuler
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Status Description */}
                                <div className={`mt-4 pt-4 border-t ${statusConfig.border}`}>
                                    <p className={`text-sm ${statusConfig.text}`}>
                                        {statusConfig.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyReservations;
