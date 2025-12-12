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

export const getStatusForReservations = (count) => {
    // Logic from legacy cell.js
    if (count === 0) return 'available';
    if (count < 3) return 'available'; // 1-2
    if (count === 3) return 'half';
    if (count < 6) return 'almost-full'; // 4-5
    return 'full'; // 6+
};
