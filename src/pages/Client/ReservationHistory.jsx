import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Clock, CheckCircle, XCircle, History as HistoryIcon } from 'lucide-react';

const ReservationHistory = () => {
    const { client } = useOutletContext();
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const allReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
        const clientHistory = allReservations
            .filter(r => r.clientId === client.id)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        setHistory(clientHistory);
    }, [client.id]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed':
                return <CheckCircle size={20} className="text-green-600" />;
            case 'cancelled':
            case 'rejected':
                return <XCircle size={20} className="text-red-600" />;
            default:
                return <Clock size={20} className="text-yellow-600" />;
        }
    };

    const getStatusLabel = (status) => {
        const labels = {
            pending: 'En attente',
            confirmed: 'Confirmé',
            cancelled: 'Annulé',
            rejected: 'Refusé'
        };
        return labels[status] || status;
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-700',
            confirmed: 'bg-green-100 text-green-700',
            cancelled: 'bg-gray-100 text-gray-700',
            rejected: 'bg-red-100 text-red-700'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <HistoryIcon size={28} />
                    Historique des réservations
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                    Consultez toutes vos réservations passées et actuelles
                </p>
            </div>

            {/* History List */}
            {history.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <HistoryIcon size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Aucun historique</h3>
                    <p className="text-gray-500">Vous n'avez pas encore de réservations</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
                    {history.map((reservation, index) => (
                        <div
                            key={reservation.id}
                            className="p-6 hover:bg-gray-50 transition"
                        >
                            <div className="flex items-start gap-4">
                                {/* Timeline Indicator */}
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                                        {getStatusIcon(reservation.status)}
                                    </div>
                                    {index < history.length - 1 && (
                                        <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                        <h3 className="font-bold text-gray-800">
                                            {format(new Date(reservation.date), 'EEEE d MMMM yyyy', { locale: fr })}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold w-fit ${getStatusColor(reservation.status)}`}>
                                            {getStatusLabel(reservation.status)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-gray-400" />
                                            <span>{reservation.timeSlot}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-gray-400" />
                                            <span>{reservation.service}</span>
                                        </div>
                                    </div>

                                    {reservation.notes && (
                                        <p className="text-sm text-gray-500 italic mb-2">
                                            Note: {reservation.notes}
                                        </p>
                                    )}

                                    <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                                        <span>
                                            Demandé: {format(new Date(reservation.createdAt), 'dd/MM/yyyy HH:mm')}
                                        </span>
                                        {reservation.updatedAt !== reservation.createdAt && (
                                            <span>
                                                Mis à jour: {format(new Date(reservation.updatedAt), 'dd/MM/yyyy HH:mm')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Stats Summary */}
            {history.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                        <p className="text-2xl font-bold text-gray-800">{history.length}</p>
                        <p className="text-xs text-gray-600 mt-1">Total</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">
                            {history.filter(r => r.status === 'confirmed').length}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">Confirmés</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                        <p className="text-2xl font-bold text-yellow-600">
                            {history.filter(r => r.status === 'pending').length}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">En attente</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                        <p className="text-2xl font-bold text-gray-600">
                            {history.filter(r => r.status === 'cancelled' || r.status === 'rejected').length}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">Annulés</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReservationHistory;
