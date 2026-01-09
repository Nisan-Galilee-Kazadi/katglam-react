// Format: YYYY-MM-DD
const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
};

export const CALENDAR_CONFIG = {
    // Limites de réservations par statut
    limits: {
        available: 0,   // Vert : 0-2 réservations (selon cell.js)
        few: 2,         // (Not used in cell.js logic explicitly, but kept for ref)
        half: 3,        // Jaune/Moitié plein : 3 réservations
        almostFull: 5,  // Orange : 4-5 réservations
        full: 6,        // Rouge : 6+ réservations
    },

    // Jours de la semaine fermés (0 = dimanche)
    closedDays: [], // Aucun jour fermé par défaut (ouvert le dimanche)

    // Créneaux horaires disponibles
    timeSlots: [
        { value: "09:00", label: "09:00 - 10:30" },
        { value: "11:00", label: "11:00 - 12:30" },
        { value: "14:00", label: "14:00 - 15:30" },
        { value: "16:00", label: "16:00 - 17:30" },
        { value: "18:00", label: "18:00 - 19:30" },
        { value: "20:00", label: "20:00 - 21:30" },
    ],

    // Styles de maquillage disponibles
    makeupStyles: [
        { value: "jour", label: "Maquillage jour" },
        { value: "soiree", label: "Maquillage soirée" },
        { value: "mariage", label: "Maquillage mariage" },
        { value: "artistique", label: "Maquillage artistique" },
        { value: "formation", label: "Formation" },
    ],
};

// Fonction utilitaire pour déterminer le statut en fonction du nombre de réservations
export const getStatusForReservations = (count) => {
    if (count === 0) return 'available';
    if (count <= 2) return 'available';
    if (count === 3) return 'half';
    if (count <= 5) return 'almost-full';
    return 'full';
};

// Vérifie si un créneau horaire est verrouillé
export const isTimeSlotLocked = (date, timeSlot, lockedSlots) => {
    if (!lockedSlots) return false;
    const dateKey = formatDateKey(date);
    return lockedSlots[dateKey]?.includes(timeSlot) || false;
};

// Vérifie si tous les créneaux d'une journée sont verrouillés
export const isDayFullyLocked = (date, lockedSlots) => {
    if (!lockedSlots) return false;
    const dateKey = formatDateKey(date);
    return lockedSlots[dateKey]?.length === CALENDAR_CONFIG.timeSlots.length;
};

// Verrouille un créneau horaire
export const lockTimeSlot = (date, timeSlot, lockedSlots) => {
    const dateKey = formatDateKey(date);
    const updated = { ...lockedSlots };
    
    if (!updated[dateKey]) {
        updated[dateKey] = [];
    }
    
    if (!updated[dateKey].includes(timeSlot)) {
        updated[dateKey] = [...updated[dateKey], timeSlot];
    }
    
    return updated;
};

// Déverrouille un créneau horaire
export const unlockTimeSlot = (date, timeSlot, lockedSlots) => {
    const dateKey = formatDateKey(date);
    if (!lockedSlots[dateKey]) return lockedSlots;
    
    const updated = { ...lockedSlots };
    updated[dateKey] = updated[dateKey].filter(slot => slot !== timeSlot);
    
    // Supprimer la clé de date si aucun créneau n'est verrouillé
    if (updated[dateKey].length === 0) {
        delete updated[dateKey];
    }
    
    return updated;
};

// Bascule le verrouillage d'un créneau horaire
export const toggleTimeSlotLock = (date, timeSlot, lockedSlots) => {
    if (isTimeSlotLocked(date, timeSlot, lockedSlots)) {
        return unlockTimeSlot(date, timeSlot, lockedSlots);
    } else {
        return lockTimeSlot(date, timeSlot, lockedSlots);
    }
};

// Vérifie si une date est complètement verrouillée (tous les créneaux)
export const isDateLocked = (date, lockedSlots) => {
    if (!lockedSlots) return false;
    const dateKey = formatDateKey(date);
    return lockedSlots[dateKey]?.length === CALENDAR_CONFIG.timeSlots.length;
};
