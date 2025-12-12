import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { X, Calendar, Clock, Palette, StickyNote, Send, Check } from 'lucide-react';
import { CALENDAR_CONFIG } from '../Admin/CalendarConfig';

const ReservationRequestModal = ({ date, client, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        timeSlot: '',
        service: '',
        notes: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.timeSlot) newErrors.timeSlot = "Le créneau horaire est requis";
        if (!formData.service) newErrors.service = "Le style de maquillage est requis";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        // Create reservation request
        const reservation = {
            id: Date.now().toString(),
            clientId: client.id,
            clientName: client.name,
            clientPhone: client.phone,
            clientEmail: client.email,
            clientAddress: client.address,
            date: date.toISOString(),
            timeSlot: formData.timeSlot,
            service: formData.service,
            notes: formData.notes,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Save to localStorage
        const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
        reservations.push(reservation);
        localStorage.setItem('reservations', JSON.stringify(reservations));

        // Show success message
        setSuccess(true);
        setTimeout(() => {
            onSubmit();
        }, 1500);
    };

    if (success) {
        return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center animate-in zoom-in">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check size={32} className="text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Demande envoyée !</h3>
                    <p className="text-gray-600">
                        Votre demande de réservation a été soumise avec succès.
                        Vous recevrez une confirmation une fois validée par l'administrateur.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col border border-pink-100">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gradient-to-r from-pink-50 to-pink-100">
                    <div>
                        <h3 className="text-lg font-bold text-pink-700 flex items-center gap-2">
                            <Calendar size={20} />
                            Demande de réservation
                        </h3>
                        <p className="text-sm text-pink-600 capitalize mt-1">
                            {format(date, 'EEEE d MMMM yyyy', { locale: fr })}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition text-gray-500"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                    {/* Client Info Display */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">Informations client</p>
                        <p className="font-semibold text-gray-800">{client.name}</p>
                        <p className="text-sm text-gray-600">{client.phone}</p>
                        <p className="text-sm text-gray-600">{client.email}</p>
                    </div>

                    {/* Time Slot */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Clock size={16} className="inline mr-1" />
                            Créneau horaire <span className="text-red-500">*</span>
                        </label>
                        <select
                            className={`w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-pink-400 ${errors.timeSlot ? 'border-red-500' : 'border-gray-300'
                                }`}
                            value={formData.timeSlot}
                            onChange={(e) => handleInputChange('timeSlot', e.target.value)}
                        >
                            <option value="">Sélectionnez un créneau</option>
                            {CALENDAR_CONFIG.timeSlots.map(slot => (
                                <option key={slot.value} value={slot.value}>{slot.label}</option>
                            ))}
                        </select>
                        {errors.timeSlot && <p className="text-red-500 text-xs mt-1">{errors.timeSlot}</p>}
                    </div>

                    {/* Service */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Palette size={16} className="inline mr-1" />
                            Style de maquillage <span className="text-red-500">*</span>
                        </label>
                        <select
                            className={`w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-pink-400 ${errors.service ? 'border-red-500' : 'border-gray-300'
                                }`}
                            value={formData.service}
                            onChange={(e) => handleInputChange('service', e.target.value)}
                        >
                            <option value="">Sélectionnez un style</option>
                            {CALENDAR_CONFIG.makeupStyles.map(style => (
                                <option key={style.value} value={style.value}>{style.label}</option>
                            ))}
                        </select>
                        {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service}</p>}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <StickyNote size={16} className="inline mr-1" />
                            Notes additionnelles (optionnel)
                        </label>
                        <textarea
                            rows="3"
                            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-pink-400 resize-none"
                            placeholder="Précisions, préférences, allergies..."
                            value={formData.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                        />
                    </div>

                    {/* Info */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-xs text-yellow-800">
                            <strong>Important :</strong> Votre demande sera soumise à validation.
                            Vous recevrez une confirmation par email une fois approuvée.
                        </p>
                    </div>
                </form>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-white transition font-medium"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition font-medium flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>Envoi...</>
                        ) : (
                            <>
                                <Send size={18} />
                                Envoyer la demande
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReservationRequestModal;
