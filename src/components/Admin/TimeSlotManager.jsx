import React, { useState, useEffect } from 'react';
import { format, isBefore, isAfter, isSameDay, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { X, Clock, Lock, Unlock, Check, Calendar as CalendarIcon, Clock as ClockIcon, AlertCircle, LockKeyhole, UnlockKeyhole } from 'lucide-react';
import { CALENDAR_CONFIG } from '../../pages/Admin/CalendarConfig';
import { isTimeSlotLocked, lockTimeSlot, unlockTimeSlot } from '../../services/localStorageService';

// Vérifie si un créneau est verrouillé pour une date donnée
const isSlotLocked = (date, timeSlot) => {
  return isTimeSlotLocked(date.toISOString(), timeSlot);
};

// Vérifie si un créneau est disponible (pas dans le passé et pas verrouillé)
const isTimeSlotAvailable = (date, timeSlot) => {
  const [hours, minutes] = timeSlot.split(':').map(Number);
  const slotDate = new Date(date);
  slotDate.setHours(hours, minutes, 0, 0);
  
  const now = new Date();
  const isInFuture = isAfter(slotDate, now) || isSameDay(slotDate, now);
  const isLocked = isSlotLocked(date, timeSlot);
  
  return isInFuture && !isLocked;
};

// Formate une date pour l'affichage
const formatDateDisplay = (date) => {
  return format(date, 'EEEE d MMMM yyyy', { locale: fr });
};

const TimeSlotManager = ({ 
  date, 
  onClose,
  onUpdate, // Callback pour notifier les mises à jour
  isAdmin = true
}) => {
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Charger les créneaux verrouillés au montage
  useEffect(() => {
    loadLockedSlots();
  }, [date]);
  
  // Charger les créneaux verrouillés pour la date sélectionnée
  const loadLockedSlots = () => {
    const dateKey = date.toISOString();
    const lockedSlots = CALENDAR_CONFIG.timeSlots
      .filter(slot => isTimeSlotLocked(dateKey, slot.value))
      .map(slot => slot.value);
    
    setSelectedSlots(lockedSlots);
  };
  
  // Notifier le composant parent des mises à jour
  const notifyUpdate = () => {
    if (onUpdate) {
      onUpdate();
    }
  };

  // Basculer l'état de verrouillage d'un créneau
  const toggleTimeSlot = async (timeSlot) => {
    if (!isAdmin) return; // Seul l'admin peut modifier les créneaux
    
    setIsProcessing(true);
    const dateKey = date.toISOString();
    
    try {
      if (isSlotLocked(date, timeSlot)) {
        // Déverrouiller le créneau
        await unlockTimeSlot(dateKey, timeSlot);
        setNotification({
          type: 'success',
          message: 'Créneau déverrouillé avec succès.'
        });
      } else {
        // Verrouiller le créneau
        await lockTimeSlot(dateKey, timeSlot);
        setNotification({
          type: 'success',
          message: 'Créneau verrouillé avec succès.'
        });
      }
      
      // Mettre à jour l'interface
      loadLockedSlots();
      notifyUpdate();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du créneau:', error);
      setNotification({
        type: 'error',
        message: 'Une erreur est survenue. Veuillez réessayer.'
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Verrouiller tous les créneaux de la journée
  const lockAllSlots = async () => {
    if (!isAdmin) return;
    
    setIsProcessing(true);
    const dateKey = date.toISOString();
    
    try {
      // Verrouiller tous les créneaux disponibles
      for (const slot of CALENDAR_CONFIG.timeSlots) {
        if (!isSlotLocked(date, slot.value)) {
          await lockTimeSlot(dateKey, slot.value);
        }
      }
      
      setNotification({
        type: 'success',
        message: 'Tous les créneaux ont été verrouillés pour cette journée.'
      });
      
      // Mettre à jour l'interface
      loadLockedSlots();
      notifyUpdate();
    } catch (error) {
      console.error('Erreur lors du verrouillage des créneaux:', error);
      setNotification({
        type: 'error',
        message: 'Erreur lors du verrouillage des créneaux.'
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Déverrouiller tous les créneaux de la journée
  const unlockAllSlots = async () => {
    if (!isAdmin) return;
    
    setIsProcessing(true);
    const dateKey = date.toISOString();
    
    try {
      // Déverrouiller tous les créneaux
      for (const slot of CALENDAR_CONFIG.timeSlots) {
        if (isSlotLocked(date, slot.value)) {
          await unlockTimeSlot(dateKey, slot.value);
        }
      }
      
      setNotification({
        type: 'success',
        message: 'Tous les créneaux ont été déverrouillés pour cette journée.'
      });
      
      // Mettre à jour l'interface
      loadLockedSlots();
      notifyUpdate();
    } catch (error) {
      console.error('Erreur lors du déverrouillage des créneaux:', error);
      setNotification({
        type: 'error',
        message: 'Erreur lors du déverrouillage des créneaux.'
      });
    } finally {
      setIsProcessing(false);
    }
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
  
  try {
    // Verrouiller tous les créneaux disponibles
    for (const slot of CALENDAR_CONFIG.timeSlots) {
      if (!isSlotLocked(date, slot.value)) {
        await lockTimeSlot(dateKey, slot.value);
      }
    }
    
    setNotification({
      type: 'success',
      message: 'Tous les créneaux ont été verrouillés pour cette journée.'
    });
    
    // Mettre à jour l'interface
    loadLockedSlots();
    notifyUpdate();
  } catch (error) {
    console.error('Erreur lors du verrouillage des créneaux:', error);
    setNotification({
      type: 'error',
      message: 'Erreur lors du verrouillage des créneaux.'
    });
  } finally {
    setIsProcessing(false);
  }
};

// Déverrouiller tous les créneaux de la journée
const unlockAllSlots = async () => {
  if (!isAdmin) return;
  
  setIsProcessing(true);
  const dateKey = date.toISOString();
  
  try {
    // Déverrouiller tous les créneaux
    for (const slot of CALENDAR_CONFIG.timeSlots) {
      if (isSlotLocked(date, slot.value)) {
        await unlockTimeSlot(dateKey, slot.value);
      }
    }
    
    setNotification({
      type: 'success',
      message: 'Tous les créneaux ont été déverrouillés pour cette journée.'
    });
    
    // Mettre à jour l'interface
    loadLockedSlots();
    notifyUpdate();
  } catch (error) {
    console.error('Erreur lors du déverrouillage des créneaux:', error);
    setNotification({
      type: 'error',
      message: 'Erreur lors du déverrouillage des créneaux.'
    });
  } finally {
    setIsProcessing(false);
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
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Gestion des créneaux
          </h3>
          <p className="text-sm text-gray-500">
            {formatDateDisplay(date)}
          </p>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 focus:outline-none"
          disabled={isProcessing}
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Notification */}
        {notification && (
          <div 
            className={`mb-4 p-3 rounded-md ${
              notification.type === 'error' 
                ? 'bg-red-50 text-red-700' 
                : 'bg-green-50 text-green-700'
            }`}
          >
            <div className="flex items-center">
              {notification.type === 'error' ? (
                <AlertCircle className="h-5 w-5 mr-2" />
              ) : (
                <Check className="h-5 w-5 mr-2" />
              )}
              <span className="text-sm">{notification.message}</span>
            </div>
          </div>
        )}
        
        {/* Quick Actions */}
        {isAdmin && (
          <div className="mb-6 space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Actions rapides</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={lockAllSlots}
                disabled={isProcessing}
                className="flex items-center justify-center space-x-2 px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm font-medium hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LockKeyhole className="h-4 w-4" />
                <span>Tout verrouiller</span>
              </button>
              <button
                onClick={unlockAllSlots}
                disabled={isProcessing}
                className="flex items-center justify-center space-x-2 px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm font-medium hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UnlockKeyhole className="h-4 w-4" />
                <span>Tout déverrouiller</span>
              </button>
            </div>
          </div>
        )}
        
        {/* Time Slots */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            {isAdmin ? 'Gestion des créneaux' : 'Créneaux disponibles'}
          </h4>
          
          <div className="grid grid-cols-2 gap-2">
            {CALENDAR_CONFIG.timeSlots.map((slot) => {
              const locked = isSlotLocked(date, slot.value);
              const available = isTimeSlotAvailable(date, slot.value);
              
              return (
                <button
                  key={slot.value}
                  onClick={() => toggleTimeSlot(slot.value)}
                  disabled={isProcessing || (!isAdmin && !available)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all flex items-center justify-between
                    ${locked 
                      ? 'bg-red-50 border-red-200 text-red-700' 
                      : available 
                        ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50' 
                        : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'}
                    ${isProcessing ? 'opacity-70' : ''}
                  `}
                  title={!available && !locked ? "Créneau non disponible" : "Cliquez pour modifier"}
                >
                  <span>{slot.label}</span>
                  {locked ? (
                    <Lock className="h-4 w-4 ml-2 flex-shrink-0" />
                  ) : available ? (
                    <Unlock className="h-4 w-4 ml-2 flex-shrink-0 text-gray-400" />
                  ) : null}
                </button>
              );
            })}
            const isDisabled = status === 'disabled' || status === 'locked';
            
            return (
              <button
                key={slot.value}
                onClick={() => toggleTimeSlot(slot.value, status === 'locked')}
                className={`p-2 rounded-md text-sm flex items-center justify-between transition-colors
                  ${status === 'locked' 
                    ? isAdmin 
                      ? 'bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 cursor-pointer' 
                      : 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
                    : ''}
                  ${status === 'selected' ? 'bg-blue-50 border-2 border-blue-300 text-blue-700' : ''}
                  ${status === 'disabled' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}
                  ${status === 'available' ? 'border border-gray-200 hover:bg-gray-50' : ''}
                `}
                disabled={status === 'disabled' || (status === 'locked' && !isAdmin)}
                title={
                  status === 'disabled' 
                    ? 'Créneau non disponible' 
                    : status === 'locked' 
                      ? isAdmin 
                        ? 'Cliquez pour déverrouiller ce créneau' 
                        : 'Créneau indisponible'
                      : ''
                }
              >
                <span className={status === 'locked' && !isAdmin ? 'opacity-50' : ''}>{slot.label}</span>
                {status === 'locked' && (
                  <div className="flex items-center gap-1">
                    <span className={`text-xs ${isAdmin ? 'text-red-500' : 'text-gray-400'}`}>
                      {isAdmin ? 'Verrouillé' : 'Indisponible'}
                    </span>
                    {isAdmin && <Unlock size={14} className="text-red-500 flex-shrink-0" />}
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
