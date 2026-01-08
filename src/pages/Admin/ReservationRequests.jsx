import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CheckCircle, XCircle, Clock, User, Phone, Mail, MapPin, Calendar, Palette, StickyNote, RefreshCw } from 'lucide-react';
import reservationService, { updateReservationStatus } from '../../services/localStorageService';
import { CALENDAR_CONFIG } from './CalendarConfig';

const ReservationRequests = () => {
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState('pending'); // 'all', 'pending', 'confirmed', 'rejected'
    const [loading, setLoading] = useState(false);

    // Load requests from API
    const loadRequests = async () => {
        setLoading(true);
        try {
            const data = await reservationService.getReservations();
            setRequests(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des réservations:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadRequests();
    }, [filter]);

    // Handle approve
    const handleApprove = async (id) => {
        try {
            await updateReservationStatus(id, 'confirmed');
            await loadRequests();
        } catch (error) {
            console.error('Error approving reservation:', error);
        }
    };

    // Handle reject
    const handleReject = async (id) => {
        try {
            await updateReservationStatus(id, 'rejected');
            await loadRequests();
        } catch (error) {
            console.error('Error rejecting reservation:', error);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En attente', icon: Clock },
            confirmed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Confirmée', icon: CheckCircle },
            rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejetée', icon: XCircle }
        };
        const badge = badges[status] || badges.pending;
        const Icon = badge.icon;

        return (
            <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit`}>
                <Icon size={14} />
                {badge.label}
            </span>
        );
    };

    // Filter requests based on selected filter
    const filteredRequests = filter === 'all'
        ? requests
        : requests.filter(req => req.status === filter);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-pink-600 mb-2">Demandes de réservation</h2>
                        <p className="text-gray-600">Gérez les demandes de réservation des clients</p>
                    </div>
                    <button
                        onClick={loadRequests}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition text-gray-700"
                    >
                        <RefreshCw size={18} />
                        Actualiser
                    </button>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mt-6 flex-wrap">
                    {[
                        { value: 'all', label: 'Toutes' },
                        { value: 'pending', label: 'En attente' },
                        { value: 'confirmed', label: 'Confirmées' },
                        { value: 'rejected', label: 'Rejetées' }
                    ].map(f => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filter === f.value
                                ? 'bg-pink-500 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Requests List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-gray-500 mt-4">Chargement...</p>
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <Clock size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">Aucune demande trouvée</p>
                        <p className="text-gray-400 text-sm mt-2">
                            {filter === 'pending' && "Les nouvelles demandes apparaîtront ici"}
                            {filter === 'confirmed' && "Aucune réservation confirmée"}
                            {filter === 'rejected' && "Aucune demande rejetée"}
                            {filter === 'all' && "Aucune demande enregistrée"}
                        </p>
                    </div>
                ) : (
                    filteredRequests.map(request => {
                        const serviceLabel = CALENDAR_CONFIG.makeupStyles.find(s => s.value === request.service)?.label || request.service;
                        const timeSlotLabel = CALENDAR_CONFIG.timeSlots.find(t => t.value === request.timeSlot)?.label || request.timeSlot;

                        return (
                            <div key={request._id || request.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100">
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row justify-between gap-4 mb-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <User size={24} className="text-pink-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800">{request.clientName}</h3>
                                                <p className="text-sm text-gray-500">
                                                    Demande créée le {format(new Date(request.createdAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                                                </p>
                                            </div>
                                        </div>
                                        {getStatusBadge(request.status)}
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4 mb-4">
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <Phone size={18} className="text-pink-500 flex-shrink-0" />
                                            <span className="font-medium">{request.clientPhone || request.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <Mail size={18} className="text-pink-500 flex-shrink-0" />
                                            <span className="font-medium truncate">{request.clientEmail || request.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <Calendar size={18} className="text-pink-500 flex-shrink-0" />
                                            <span className="font-medium capitalize">
                                                {format(new Date(request.date), 'EEEE d MMMM yyyy', { locale: fr })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <Clock size={18} className="text-pink-500 flex-shrink-0" />
                                            <span className="font-medium">{timeSlotLabel}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <Palette size={18} className="text-pink-500 flex-shrink-0" />
                                            <span className="font-medium">{serviceLabel}</span>
                                        </div>
                                        {(request.clientAddress || request.address) && (
                                            <div className="flex items-center gap-3 text-gray-700">
                                                <MapPin size={18} className="text-pink-500 flex-shrink-0" />
                                                <span className="font-medium">{request.clientAddress || request.address}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Notes */}
                                    {request.notes && (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                                            <div className="flex items-start gap-2 text-gray-700">
                                                <StickyNote size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-sm text-yellow-800 mb-1">Notes du client :</p>
                                                    <p className="text-sm italic">{request.notes}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    {request.status === 'pending' && (
                                        <div className="flex gap-3 pt-4 border-t border-gray-100">
                                            <button
                                                onClick={() => handleApprove(request._id)}
                                                className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg"
                                            >
                                                <CheckCircle size={18} />
                                                Approuver
                                            </button>
                                            <button
                                                onClick={() => handleReject(request._id)}
                                                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg"
                                            >
                                                <XCircle size={18} />
                                                Rejeter
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ReservationRequests;
