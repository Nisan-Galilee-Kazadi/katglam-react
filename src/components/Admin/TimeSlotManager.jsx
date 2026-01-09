import React, { useState, useEffect } from 'react';
import { format, isBefore, isAfter, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { X, Clock, Lock, Unlock, Check, Calendar as CalendarIcon, Clock as ClockIcon, AlertCircle } from 'lucide-react';
import { CALENDAR_CONFIG } from '../../pages/Admin/CalendarConfig';

// Helper function to check if a time slot is in the past
const isPastDate = (date) => {
  const now = new Date();
  return isBefore(date, now) && !isSameDay(date, now);
};

// Helper function to check if two dates are the same day
const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Helper function to check if a time slot is available (not in the past and within working hours)
const isTimeSlotAvailable = (date, timeSlot) => {
  const [hours, minutes] = timeSlot.split(':').map(Number);
  const slotDate = new Date(date);
  slotDate.setHours(hours, minutes, 0, 0);
  
  const now = new Date();
  return isAfter(slotDate, now) || isSameDay(slotDate, now);
};

const TimeSlotManager = ({ 
  date, 
  onClose, 
  onLockDate, 
  onUnlockDate,
  onLockTimeSlots,
  lockedSlots = [],
  isDayLocked = false
}) => {
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [isLocking, setIsLocking] = useState(false);
  const [viewMode, setViewMode] = useState('select'); // 'select' or 'manage'
  const [notification, setNotification] = useState(null);
  
  // Initialize selected slots and reset view mode when date changes
  useEffect(() => {
    if (lockedSlots && lockedSlots.length > 0) {
      setSelectedSlots([...lockedSlots]);
    } else {
      setSelectedSlots([]);
    }
    setViewMode('select');
    setNotification(null);
  }, [date, lockedSlots]);

  const toggleTimeSlot = (timeSlot, isLocked) => {
    // Si le créneau est verrouillé et qu'on clique dessus, on le déverrouille
    if (isLocked) {
      onUnlockDate([timeSlot]);
      return;
    }
    
    // Sinon, on gère la sélection normale
    setSelectedSlots(prev => {
      if (prev.includes(timeSlot)) {
        return prev.filter(t => t !== timeSlot);
      } else {
        return [...prev, timeSlot];
      }
    });
  };

  const handleLockSelected = () => {
    if (selectedSlots.length === 0) {
      setNotification({
        type: 'error',
        message: 'Veuillez sélectionner au moins un créneau horaire.'
      });
      return;
    }
    
    setIsLocking(true);
    try {
      onLockTimeSlots(selectedSlots);
      setNotification({
        type: 'success',
        message: `Créneau(x) verrouillé(s) avec succès pour le ${format(date, 'dd/MM/yyyy')}`
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Erreur lors du verrouillage des créneaux. Veuillez réessayer.'
      });
    } finally {
      setIsLocking(false);
    }
  };

  const handleUnlockAll = () => {
    try {
      onUnlockDate(lockedSlots);
      setSelectedSlots([]);
      setNotification({
        type: 'success',
        message: 'Tous les créneaux ont été déverrouillés avec succès.'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Erreur lors du déverrouillage des créneaux. Veuillez réessayer.'
      });
    }
  };

  const handleLockAllDay = () => {
    const allTimeSlots = CALENDAR_CONFIG.timeSlots
      .map(slot => slot.value)
      .filter(timeSlot => isTimeSlotAvailable(date, timeSlot));
    
    if (allTimeSlots.length === 0) {
      setNotification({
        type: 'warning',
        message: 'Aucun créneau disponible à verrouiller pour cette date.'
      });
      return;
    }
    
    setSelectedSlots(allTimeSlots);
    setNotification({
      type: 'info',
      message: 'Tous les créneaux disponibles ont été sélectionnés. Cliquez sur "Verrouiller les créneaux" pour confirmer.'
    });
  };

  const isSlotLocked = (timeSlot) => {
    return lockedSlots.includes(timeSlot);
  };

  const isSlotSelected = (timeSlot) => {
    return selectedSlots.includes(timeSlot);
  };

  const isSlotDisabled = (timeSlot) => {
    return isPastDate(date) || !isTimeSlotAvailable(date, timeSlot);
  };

  const getSlotStatus = (timeSlot) => {
    if (isSlotLocked(timeSlot)) return 'locked';
    if (isSlotSelected(timeSlot)) return 'selected';
    if (isSlotDisabled(timeSlot)) return 'disabled';
    return 'available';
  };

  const selectAllSlots = () => {
    const availableSlots = CALENDAR_CONFIG.timeSlots
      .map(slot => slot.value)
      .filter(timeSlot => !isSlotDisabled(timeSlot) && !isSlotLocked(timeSlot));
    
    if (availableSlots.length === 0) {
      setNotification({
        type: 'warning',
        message: 'Aucun créneau disponible à sélectionner.'
      });
      return;
    }
    
    setSelectedSlots(prev => {
      // If all available slots are already selected, deselect all
      const allSelected = availableSlots.every(slot => prev.includes(slot));
      if (allSelected) {
        return prev.filter(slot => !availableSlots.includes(slot));
      }
      // Otherwise, add all available slots
      return [...new Set([...prev, ...availableSlots])];
    });
  };

  if (!date) return null;
  
  const availableSlots = CALENDAR_CONFIG.timeSlots.filter(
    slot => !isSlotDisabled(slot.value)
  ).length;
  
  const lockedSlotsCount = lockedSlots.length;
  const selectedSlotsCount = selectedSlots.length;

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            Gestion des créneaux
          </h3>
          <p className="text-sm text-gray-600">
            {format(date, 'EEEE d MMMM yyyy', { locale: fr })}
          </p>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1 -mt-1 -mr-1"
          aria-label="Fermer"
        >
          <X size={20} />
        </button>
      </div>

      {/* Notification Area */}
      {notification && (
        <div className={`mb-4 p-3 rounded-md text-sm ${
          notification.type === 'error' ? 'bg-red-50 text-red-700' :
          notification.type === 'success' ? 'bg-green-50 text-green-700' :
          notification.type === 'warning' ? 'bg-yellow-50 text-yellow-700' :
          'bg-blue-50 text-blue-700'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'error' && <AlertCircle size={16} />}
            {notification.type === 'success' && <Check size={16} />}
            {notification.type === 'warning' && <AlertCircle size={16} />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Day Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CalendarIcon size={18} className="text-gray-500" />
            <span className="font-medium">Statut de la journée</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
              {availableSlots} créneaux disponibles
            </span>
            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
              {lockedSlotsCount} créneaux bloqués
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleLockAllDay}
            className={`px-3 py-2 text-sm rounded-md flex-1 flex items-center justify-center gap-2 ${
              isDayLocked 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            {isDayLocked ? (
              <>
                <Unlock size={14} />
                <span>Déverrouiller la journée</span>
              </>
            ) : (
              <>
                <Lock size={14} />
                <span>Bloquer toute la journée</span>
              </>
            )}
          </button>
          
          <button
            onClick={selectAllSlots}
            className="px-3 py-2 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md flex items-center justify-center gap-2 flex-1"
          >
            <Check size={14} />
            <span>Tout sélectionner</span>
          </button>
        </div>
      </div>

      {/* Time Slots Grid */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium text-gray-700 flex items-center gap-2">
            <ClockIcon size={16} className="text-gray-500" />
            Créneaux horaires
          </h4>
          <span className="text-sm text-gray-500">
            {selectedSlotsCount} sélectionné(s)
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border rounded-lg">
          {CALENDAR_CONFIG.timeSlots.map((slot) => {
            const status = getSlotStatus(slot.value);
            const isDisabled = status === 'disabled' || status === 'locked';
            
            return (
              <button
                key={slot.value}
                onClick={() => toggleTimeSlot(slot.value, status === 'locked')}
                className={`p-2 rounded-md text-sm flex items-center justify-between transition-colors
                  ${status === 'locked' ? 'bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 cursor-pointer' : ''}
                  ${status === 'selected' ? 'bg-blue-50 border-2 border-blue-300 text-blue-700' : ''}
                  ${status === 'disabled' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}
                  ${status === 'available' ? 'border border-gray-200 hover:bg-gray-50' : ''}
                `}
                disabled={status === 'disabled'}
                title={status === 'disabled' ? 'Créneau non disponible' : status === 'locked' ? 'Cliquez pour déverrouiller ce créneau' : ''}
              >
                <span>{slot.label}</span>
                {status === 'locked' && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-red-500">Verrouillé</span>
                    <Unlock size={14} className="text-red-500 flex-shrink-0" />
                  </div>
                )}
                {status === 'selected' && <Check size={14} className="text-blue-500 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t">
        <div className="text-xs text-gray-500 flex items-center">
          <div className="flex items-center mr-3">
            <div className="w-3 h-3 rounded-full bg-blue-100 border-2 border-blue-300 mr-1"></div>
            <span>Sélectionné</span>
          </div>
          <div className="flex items-center mr-3">
            <div className="w-3 h-3 rounded-full bg-red-100 border border-red-200 mr-1"></div>
            <span>Bloqué</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-100 mr-1"></div>
            <span>Disponible</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex-1 sm:flex-none"
          >
            Fermer
          </button>
          <button
            onClick={handleLockSelected}
            disabled={selectedSlots.length === 0 || isLocking}
            className={`px-4 py-2 text-sm text-white rounded-md flex items-center justify-center gap-2 flex-1 sm:flex-none
              ${selectedSlots.length > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}
              ${isLocking ? 'opacity-70' : ''}
            `}
          >
            {isLocking ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <Lock size={16} />
                <span>
                  {selectedSlots.length > 0 
                    ? `Verrouiller ${selectedSlots.length} créneau(x)`
                    : 'Sélectionnez des créneaux'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotManager;
