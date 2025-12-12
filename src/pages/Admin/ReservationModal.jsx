import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { X, Plus, Trash, User, Phone, Mail, MapPin, Clock, Palette, StickyNote, ArrowRight, ArrowLeft, Check, Lock, Loader2 } from 'lucide-react';
import { CALENDAR_CONFIG } from './CalendarConfig';

const ReservationModal = ({ date, reservations = [], onClose, onAddReservation, onDeleteReservation, onLockDate, isLocked }) => {
    const [showForm, setShowForm] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        clientName: '',
        phone: '',
        email: '',
        address: '',
        timeSlot: '',
        service: '',
        notes: ''
    });
    const [errors, setErrors] = useState({});

    // Reset when modal opens/date changes
    useEffect(() => {
        setShowForm(false);
        setStep(1);
        setFormData({ clientName: '', phone: '', email: '', address: '', timeSlot: '', service: '', notes: '' });
        setErrors({});
    }, [date]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user types
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.clientName.trim()) newErrors.clientName = "Le nom est requis";
        if (!formData.phone.trim()) newErrors.phone = "Le téléphone est requis";

        if (!formData.email.trim()) newErrors.email = "L'email est requis";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email invalide";

        if (!formData.address.trim()) newErrors.address = "L'adresse est requise";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.timeSlot) newErrors.timeSlot = "Le créneau est requis";
        if (!formData.service) newErrors.service = "Le style est requis";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep1()) {
            setStep(2);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateStep2()) {
            onAddReservation({ ...formData, date: date, id: Date.now() });
            setShowForm(false);
        }
    };

    if (!date) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col border border-pink-100">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-pink-50/30 rounded-t-xl">
                    <h3 className="text-xl font-bold text-pink-600 capitalize flex items-center gap-2">
                        {format(date, 'EEEE d MMMM yyyy', { locale: fr })}
                        {isLocked && <Lock size={16} className="text-red-500" />}
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition text-gray-500">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {!showForm ? (
                        /* List Mode */
                        <div className="space-y-4">
                            {reservations.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">
                                    <p className="mb-2">Aucune réservation pour cette date</p>
                                    {!isLocked && (
                                        <button
                                            onClick={() => setShowForm(true)}
                                            className="text-pink-500 font-medium hover:underline"
                                        >
                                            Créer la première ?
                                        </button>
                                    )}
                                </div>
                            ) : (
                                reservations.map(resa => (
                                    <div key={resa.id} className="bg-white border-l-4 border-pink-500 shadow-sm rounded-r-lg p-4 group relative hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-gray-800">{resa.clientName}</h4>
                                            <span className="bg-pink-100 text-pink-700 text-xs font-bold px-2 py-1 rounded-full">
                                                {resa.timeSlot}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <div className="flex items-center gap-2"><Phone size={14} /> {resa.phone}</div>
                                            <div className="flex items-center gap-2"><Palette size={14} /> {
                                                CALENDAR_CONFIG.makeupStyles.find(s => s.value === resa.service)?.label || resa.service
                                            }</div>
                                            {resa.notes && (
                                                <div className="flex items-start gap-2 mt-2 pt-2 border-t border-gray-50 italic text-gray-500">
                                                    <StickyNote size={14} className="mt-0.5 shrink-0" /> {resa.notes}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => onDeleteReservation(resa.id)}
                                            className="absolute top-2 right-2 p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Supprimer"
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        /* Form Mode (Multi-step) */
                        <form onSubmit={handleSubmit} className="space-y-4 animate-in slide-in-from-right duration-300">
                            {/* Step Indicator */}
                            <div className="flex items-center justify-center gap-2 mb-6">
                                <span className={`w-3 h-3 rounded-full ${step === 1 ? 'bg-pink-500 ring-2 ring-pink-200' : 'bg-green-500'}`}></span>
                                <span className="w-12 h-0.5 bg-gray-200"></span>
                                <span className={`w-3 h-3 rounded-full ${step === 2 ? 'bg-pink-500 ring-2 ring-pink-200' : 'bg-gray-300'}`}></span>
                            </div>

                            {step === 1 && (
                                <div className="space-y-4">
                                    <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                                        <User size={20} className="text-pink-500" /> Informations Client
                                    </h4>

                                    <div>
                                        <input
                                            placeholder="Nom complet"
                                            className={`w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-pink-400 ${errors.clientName ? 'border-red-500' : 'border-gray-300'}`}
                                            value={formData.clientName}
                                            onChange={e => handleInputChange('clientName', e.target.value)}
                                        />
                                        {errors.clientName && <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>}
                                    </div>

                                    <div>
                                        <input
                                            placeholder="Téléphone"
                                            className={`w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-pink-400 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                                            value={formData.phone}
                                            onChange={e => handleInputChange('phone', e.target.value)}
                                        />
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                    </div>

                                    <div>
                                        <input
                                            placeholder="Email"
                                            type="email"
                                            className={`w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-pink-400 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                            value={formData.email}
                                            onChange={e => handleInputChange('email', e.target.value)}
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <input
                                            placeholder="Adresse de prestation"
                                            className={`w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-pink-400 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                                            value={formData.address}
                                            onChange={e => handleInputChange('address', e.target.value)}
                                        />
                                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-4">
                                    <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                                        <Clock size={20} className="text-pink-500" /> Détails Réservation
                                    </h4>

                                    <div>
                                        <select
                                            className={`w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-pink-400 ${errors.timeSlot ? 'border-red-500' : 'border-gray-300'}`}
                                            value={formData.timeSlot}
                                            onChange={e => handleInputChange('timeSlot', e.target.value)}
                                        >
                                            <option value="">Sélectionnez un créneau</option>
                                            {CALENDAR_CONFIG.timeSlots.map(slot => (
                                                <option key={slot.value} value={slot.value}>{slot.label}</option>
                                            ))}
                                        </select>
                                        {errors.timeSlot && <p className="text-red-500 text-xs mt-1">{errors.timeSlot}</p>}
                                    </div>

                                    <div>
                                        <select
                                            className={`w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-pink-400 ${errors.service ? 'border-red-500' : 'border-gray-300'}`}
                                            value={formData.service}
                                            onChange={e => handleInputChange('service', e.target.value)}
                                        >
                                            <option value="">Sélectionnez un style</option>
                                            {CALENDAR_CONFIG.makeupStyles.map(s => (
                                                <option key={s.value} value={s.value}>{s.label}</option>
                                            ))}
                                        </select>
                                        {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service}</p>}
                                    </div>

                                    <div>
                                        <textarea
                                            placeholder="Notes additionnelles..."
                                            rows="3"
                                            className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-pink-400 border-gray-300"
                                            value={formData.notes}
                                            onChange={e => handleInputChange('notes', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </form>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex gap-3">
                    {!showForm ? (
                        <>
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white transition"
                            >
                                Fermer
                            </button>
                            <button
                                onClick={onLockDate}
                                className={`flex-1 px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition shadow
                                    ${isLocked ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600'}
                                `}
                            >
                                {isLocked ? <><Lock size={16} /> Déverrouiller</> : <><Lock size={16} /> Verrouiller</>}
                            </button>
                            {!isLocked && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="flex-1 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition shadow hover:shadow-lg"
                                >
                                    <Plus size={18} /> Nouveau
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="flex-1 flex gap-3">
                                {step === 1 ? (
                                    <button
                                        onClick={() => setShowForm(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-white"
                                    >
                                        Annuler
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setStep(1)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-white flex items-center gap-2"
                                    >
                                        <ArrowLeft size={16} /> Retour
                                    </button>
                                )}
                            </div>

                            <div className="flex-1 flex justify-end">
                                {step === 1 ? (
                                    <button
                                        onClick={handleNext}
                                        className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg flex items-center gap-2 transition shadow-md"
                                    >
                                        Suivant <ArrowRight size={16} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2 transition shadow-md"
                                    >
                                        <Check size={16} /> Valider
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReservationModal;
