import React, { useState, useEffect } from 'react';
import { format, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { X, Plus, Trash, User, Phone, Mail, MapPin, Clock, Palette, StickyNote, ArrowRight, ArrowLeft, Check, Lock, Loader2, Search, LockOpen } from 'lucide-react';
import { CALENDAR_CONFIG, isTimeSlotLocked, isDayFullyLocked } from './CalendarConfig';
import axios from 'axios';

const ReservationModal = ({ 
    date, 
    reservations = [], 
    onClose, 
    onAddReservation, 
    onDeleteReservation, 
    lockedTimeSlots = {}, 
    onToggleTimeSlotLock,
    onToggleAllTimeSlots
}) => {
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

    // Client selection states
    const [isNewClient, setIsNewClient] = useState(true);
    const [allClients, setAllClients] = useState([]);
    const [clientSearch, setClientSearch] = useState('');
    const [showClientList, setShowClientList] = useState(false);

    // Reset when modal opens/date changes
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`);
                setAllClients(response.data);
            } catch (error) {
                console.error('Error fetching clients for modal:', error);
            }
        };

        if (date) {
            fetchClients();
            setShowForm(false);
            setStep(1);
            setIsNewClient(true);
            setClientSearch('');
            setFormData({ clientName: '', phone: '', email: '', address: '', timeSlot: '', service: '', notes: '' });
            setErrors({});
            
            // Check if all time slots are locked for this date
            const allLocked = isDayFullyLocked(date, lockedTimeSlots);
            setIsLocked(allLocked);
        }
    }, [date, lockedTimeSlots]);

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

        if (isNewClient) {
            if (!formData.email.trim()) newErrors.email = "L'email est requis";
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email invalide";
            if (!formData.address.trim()) newErrors.address = "L'adresse est requise";
        }

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateStep2()) {
            const newReservation = {
                ...formData,
                date: date.toISOString(),
                status: 'confirmed',
                clientName: formData.clientName,
                clientPhone: formData.phone,
                clientEmail: formData.email,
                address: formData.address,
                isNewClientManual: isNewClient // Track if we should create a new user record on serve side (optional if handled here)
            };

            try {
                // If it's a new client, we first create the client record
                let clientId = formData.clientId;
                if (isNewClient) {
                    const clientResponse = await axios.post(`${import.meta.env.VITE_API_URL}/api/users`, {
                        name: formData.clientName,
                        phone: formData.phone,
                        email: formData.email,
                        address: formData.address
                    });
                    clientId = clientResponse.data._id;
                }

                const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/reservations`, {
                    ...newReservation,
                    clientId
                });
                onAddReservation(response.data);
                setShowForm(false);
            } catch (error) {
                console.error('Erreur lors de l\'ajout de la réservation :', error);
                const msg = error.response?.data?.message || 'Une erreur est survenue.';
                setErrors({ global: msg });
            }
        }
    };

    const handleDeleteReservation = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/reservations/${id}`);
            onDeleteReservation(id);
        } catch (error) {
            console.error('Erreur lors de la suppression de la réservation :', error);
        }
    };

    const [isLocked, setIsLocked] = useState(false);

    if (!date) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col border border-pink-100">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-pink-50/30 rounded-t-xl">
                    <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-pink-600 capitalize">
                        {format(date, 'EEEE d MMMM yyyy', { locale: fr })}
                    </h3>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleAllTimeSlots();
                            setIsLocked(!isLocked);
                        }}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        title={isLocked ? 'Déverrouiller tous les créneaux' : 'Tout verrouiller'}
                    >
                        {isLocked ? (
                            <LockOpen size={18} className="text-red-500" />
                        ) : (
                            <Lock size={18} className="text-gray-400 hover:text-gray-600" />
                        )}
                    </button>
                </div>
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
                                    <div key={resa._id || resa.id} className="bg-white border-l-4 border-pink-500 shadow-sm rounded-r-lg p-4 group relative hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-gray-800">{resa.clientName}</h4>
                                            <div className="flex items-center gap-1">
                                            <span className="bg-pink-100 text-pink-700 text-xs font-bold px-2 py-1 rounded-full">
                                                {resa.timeSlot}
                                            </span>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onToggleTimeSlotLock(resa.timeSlot);
                                                }}
                                                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                                title="Verrouiller ce créneau"
                                            >
                                                {isTimeSlotLocked(date, resa.timeSlot, lockedTimeSlots) ? (
                                                    <Lock size={14} className="text-red-500" />
                                                ) : (
                                                    <LockOpen size={14} className="text-gray-400" />
                                                )}
                                            </button>
                                        </div>
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
                                            onClick={() => handleDeleteReservation(resa._id || resa.id)}
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

                                    <div className="flex gap-2 p-1 bg-gray-100 rounded-lg mb-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsNewClient(true)}
                                            className={`flex-1 py-2 rounded-md transition font-medium text-sm ${isNewClient ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            Nouveau Client
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsNewClient(false)}
                                            className={`flex-1 py-2 rounded-md transition font-medium text-sm ${!isNewClient ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            Client Existant
                                        </button>
                                    </div>

                                    {!isNewClient ? (
                                        <div className="relative">
                                            <div className="relative">
                                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    placeholder="Rechercher un client..."
                                                    className="w-full pl-10 p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-pink-400"
                                                    value={clientSearch}
                                                    onChange={(e) => {
                                                        setClientSearch(e.target.value);
                                                        setShowClientList(true);
                                                    }}
                                                    onFocus={() => setShowClientList(true)}
                                                />
                                            </div>

                                            {showClientList && clientSearch && (
                                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                                                    {allClients
                                                        .filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()))
                                                        .map(c => (
                                                            <div
                                                                key={c._id}
                                                                className="p-3 hover:bg-pink-50 cursor-pointer border-b border-gray-50 last:border-0"
                                                                onClick={() => {
                                                                    setFormData({
                                                                        ...formData,
                                                                        clientName: c.name,
                                                                        phone: c.phone,
                                                                        email: c.email,
                                                                        address: c.address,
                                                                        clientId: c._id
                                                                    });
                                                                    setClientSearch(c.name);
                                                                    setShowClientList(false);
                                                                }}
                                                            >
                                                                <p className="font-bold text-gray-800">{c.name}</p>
                                                                <p className="text-xs text-gray-500">{c.phone}</p>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <div>
                                                <input
                                                    placeholder="Nom complet"
                                                    className={`w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-pink-400 ${errors.clientName ? 'border-red-500' : 'border-gray-300'}`}
                                                    value={formData.clientName}
                                                    onChange={e => handleInputChange('clientName', e.target.value)}
                                                />
                                                {errors.clientName && <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>}
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <input
                                                        placeholder="Téléphone"
                                                        className={`w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-pink-400 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                                                        value={formData.phone}
                                                        onChange={e => handleInputChange('phone', e.target.value)}
                                                    />
                                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                                </div>

                                                <div>
                                                    <input
                                                        placeholder="Email"
                                                        type="email"
                                                        className={`w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-pink-400 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                                        value={formData.email}
                                                        onChange={e => handleInputChange('email', e.target.value)}
                                                    />
                                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                                </div>
                                            </div>

                                            <div>
                                                <input
                                                    placeholder="Adresse de prestation"
                                                    className={`w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-pink-400 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                                                    value={formData.address}
                                                    onChange={e => handleInputChange('address', e.target.value)}
                                                />
                                                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                                            </div>
                                        </>
                                    )}
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
                                                <div 
                                                    key={slot.value} 
                                                    className={`p-3 rounded-lg border ${
                                                        isTimeSlotLocked(date, slot.value, lockedTimeSlots) 
                                                            ? 'border-red-200 bg-red-50 cursor-not-allowed' 
                                                            : !formData.timeSlot || formData.timeSlot !== slot.value 
                                                                ? 'border-gray-200 hover:border-pink-300' 
                                                                : 'border-pink-500 bg-pink-50'
                                                    } transition-colors ${!isTimeSlotLocked(date, slot.value, lockedTimeSlots) ? 'cursor-pointer' : ''}`}
                                                    onClick={() => !isTimeSlotLocked(date, slot.value, lockedTimeSlots) && handleInputChange('timeSlot', slot.value)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className={`font-medium ${isTimeSlotLocked(date, slot.value, lockedTimeSlots) ? 'text-gray-400' : ''}`}>
                                                            {slot.label}
                                                            {isTimeSlotLocked(date, slot.value, lockedTimeSlots) && <span className="ml-2 text-xs text-red-500">(Verrouillé)</span>}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <button 
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onToggleTimeSlotLock(slot.value);
                                                                }}
                                                                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                                                title={isTimeSlotLocked(date, slot.value, lockedTimeSlots) ? 'Déverrouiller ce créneau' : 'Verrouiller ce créneau'}
                                                            >
                                                                {isTimeSlotLocked(date, slot.value, lockedTimeSlots) ? (
                                                                    <LockOpen size={16} className="text-red-500" />
                                                                ) : (
                                                                    <Lock size={16} className="text-gray-400 hover:text-gray-600" />
                                                                )}
                                                            </button>
                                                            {formData.timeSlot === slot.value && !isTimeSlotLocked(date, slot.value, lockedTimeSlots) && (
                                                                <Check className="text-pink-600" size={18} />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
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
                                <X size={18} className="sm:hidden mx-auto" />
                                <span className="hidden sm:inline">Fermer</span>
                            </button>
                            <button
                                onClick={onLockDate}
                                className={`flex-1 px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition shadow
                                    ${isLocked ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600'}
                                `}
                            >
                                {isLocked ? (
                                    <><Lock size={16} /> <span className="hidden sm:inline">Déverrouiller</span></>
                                ) : (
                                    <><Lock size={16} /> <span className="hidden sm:inline">Verrouiller</span></>
                                )}
                            </button>
                            {!isLocked && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="flex-1 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition shadow hover:shadow-lg"
                                >
                                    <Plus size={18} /> <span className="hidden sm:inline">Nouveau</span>
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
