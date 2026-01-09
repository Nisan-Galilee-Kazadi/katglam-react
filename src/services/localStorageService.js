import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/reservations`;

/**
 * Reservation Service for Reservation Management
 * Centralized service to handle all reservation operations
 */

const reservationService = {
    async getReservations() {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching reservations:', error);
            throw error;
        }
    },

    async getReservationRequests() {
        const reservations = await reservationService.getReservations();
        return reservations.filter(r => r.status === 'pending');
    },

    async getApprovedReservations() {
        const reservations = await reservationService.getReservations();
        return reservations.filter(r => r.status === 'confirmed');
    },

    async getRejectedReservations() {
        const reservations = await reservationService.getReservations();
        return reservations.filter(r => r.status === 'rejected');
    },

    async addReservation(reservation) {
        try {
            const response = await axios.post(API_URL, reservation);
            return response.data;
        } catch (error) {
            console.error('Error adding reservation:', error);
            throw error;
        }
    },

    async updateReservationStatus(id, status) {
        try {
            const response = await axios.put(`${API_URL}/${id}/status`, { status });
            return response.data;
        } catch (error) {
            console.error('Error updating reservation status:', error);
            throw error;
        }
    },

    async updateReservation(id, updates) {
        try {
            const response = await axios.put(`${API_URL}/${id}`, updates);
            return response.data;
        } catch (error) {
            console.error('Error updating reservation:', error);
            throw error;
        }
    },

    async deleteReservation(id) {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error('Error deleting reservation:', error);
            throw error;
        }
    },

    async getReservationById(id) {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching reservation by id:', error);
            return null;
        }
    }
};

/**
 * Get locked time slots from localStorage
 * @returns {Object} Object with dates as keys and arrays of locked time slots as values
 */
export const getLockedTimeSlots = () => {
    return JSON.parse(localStorage.getItem('locked_time_slots') || '{}');
};

/**
 * Lock a specific time slot
 * @param {string} dateISO - ISO string of the date
 * @param {string} timeSlot - Time slot to lock (e.g., "09:00")
 * @returns {Object} Updated locked time slots
 */
export const lockTimeSlot = (dateISO, timeSlot) => {
    const dateKey = dateISO.split('T')[0]; // Use only the date part as key
    const lockedSlots = getLockedTimeSlots();
    
    if (!lockedSlots[dateKey]) {
        lockedSlots[dateKey] = [];
    }
    
    if (!lockedSlots[dateKey].includes(timeSlot)) {
        lockedSlots[dateKey].push(timeSlot);
        localStorage.setItem('locked_time_slots', JSON.stringify(lockedSlots));
    }
    
    return { ...lockedSlots };
};

/**
 * Unlock a specific time slot
 * @param {string} dateISO - ISO string of the date
 * @param {string} timeSlot - Time slot to unlock (e.g., "09:00")
 * @returns {Object} Updated locked time slots
 */
export const unlockTimeSlot = (dateISO, timeSlot) => {
    const dateKey = dateISO.split('T')[0];
    const lockedSlots = getLockedTimeSlots();
    
    if (lockedSlots[dateKey]) {
        lockedSlots[dateKey] = lockedSlots[dateKey].filter(slot => slot !== timeSlot);
        
        // Remove date entry if no more locked slots
        if (lockedSlots[dateKey].length === 0) {
            delete lockedSlots[dateKey];
        }
        
        localStorage.setItem('locked_time_slots', JSON.stringify(lockedSlots));
    }
    
    return { ...lockedSlots };
};

/**
 * Check if a specific time slot is locked
 * @param {string} dateISO - ISO string of the date
 * @param {string} timeSlot - Time slot to check (e.g., "09:00")
 * @returns {boolean} True if the time slot is locked
 */
export const isTimeSlotLocked = (dateISO, timeSlot) => {
    const dateKey = dateISO.split('T')[0];
    const lockedSlots = getLockedTimeSlots();
    return lockedSlots[dateKey] && lockedSlots[dateKey].includes(timeSlot);
};

/**
 * Get all locked dates (for backward compatibility)
 * @returns {Array<string>} Array of ISO date strings
 */
export const getLockedDates = () => {
    const lockedSlots = getLockedTimeSlots();
    return Object.keys(lockedSlots).map(date => new Date(date).toISOString());
};

/**
 * Lock all time slots for a specific date (for backward compatibility)
 * @param {string} dateISO - ISO string of the date to lock
 * @returns {Array<string>} Updated list of locked dates
 */
export const lockDate = (dateISO) => {
    const locked = getLockedDates();
    if (!locked.includes(dateISO)) {
        const updated = [...locked, dateISO];
        localStorage.setItem('locked_dates', JSON.stringify(updated));
        return updated;
    }
    return locked;
};

/**
 * Unlock all time slots for a specific date (for backward compatibility)
 * @param {string} dateISO - ISO string of the date to unlock
 * @returns {Array<string>} Updated list of locked dates
 */
export const unlockDate = (dateISO) => {
    const dateKey = dateISO.split('T')[0];
    const lockedSlots = getLockedTimeSlots();
    
    if (lockedSlots[dateKey]) {
        delete lockedSlots[dateKey];
        localStorage.setItem('locked_time_slots', JSON.stringify(lockedSlots));
    }
    
    return getLockedDates();
};

// Export individual functions for easier destructuring
export const {
    getReservations,
    getReservationRequests,
    getApprovedReservations,
    getRejectedReservations,
    addReservation,
    updateReservationStatus,
    updateReservation,
    deleteReservation,
    getReservationById
} = reservationService;

export default reservationService;
