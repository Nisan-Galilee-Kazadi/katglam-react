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

// Time Slot Management

/**
 * Get locked time slots from localStorage
 * @returns {Object} Object with dates as keys and arrays of time slots as values
 */
export const getLockedTimeSlots = () => {
    return JSON.parse(localStorage.getItem('locked_time_slots') || '{}');
};

/**
 * Save locked time slots to localStorage
 * @param {Object} lockedSlots - Object with dates as keys and arrays of time slots as values
 */
export const saveLockedTimeSlots = (lockedSlots) => {
    localStorage.setItem('locked_time_slots', JSON.stringify(lockedSlots));
};

/**
 * Get locked dates from localStorage (legacy function, kept for backward compatibility)
 * @returns {Array<string>} Array of ISO date strings
 * @deprecated Use getLockedTimeSlots instead for time slot management
 */
export const getLockedDates = () => {
    return [];
};

/**
 * Lock a specific date (legacy function, kept for backward compatibility)
 * @param {string} dateISO - ISO string of the date to lock
 * @returns {Array<string>} Empty array (legacy support)
 * @deprecated Use lockTimeSlot instead for time slot management
 */
export const lockDate = (dateISO) => {
    const locked = getLockedDates();
    if (!locked.includes(dateISO)) {
        const updated = [...locked, dateISO];
        localStorage.setItem('locked_dates', JSON.stringify(updated));
    }
    return [];
};

/**
 * Unlock a specific date (legacy function, kept for backward compatibility)
 * @param {string} dateISO - ISO string of the date to unlock
 * @returns {Array<string>} Empty array (legacy support)
 * @deprecated Use unlockTimeSlot instead for time slot management
 */
export const unlockDate = (dateISO) => {
    return [];
};

/**
 * Lock a specific time slot
 * @param {Date} date - Date object
 * @param {string} timeSlot - Time slot to lock (e.g., '09:00')
 * @returns {Object} Updated locked time slots
 */
export const lockTimeSlot = (date, timeSlot) => {
    const dateKey = date.toISOString().split('T')[0];
    const lockedSlots = getLockedTimeSlots();
    
    if (!lockedSlots[dateKey]) {
        lockedSlots[dateKey] = [];
    }
    
    if (!lockedSlots[dateKey].includes(timeSlot)) {
        lockedSlots[dateKey].push(timeSlot);
        saveLockedTimeSlots(lockedSlots);
    }
    
    return { ...lockedSlots };
};

/**
 * Unlock a specific time slot
 * @param {Date} date - Date object
 * @param {string} timeSlot - Time slot to unlock (e.g., '09:00')
 * @returns {Object} Updated locked time slots
 */
export const unlockTimeSlot = (date, timeSlot) => {
    const dateKey = date.toISOString().split('T')[0];
    const lockedSlots = getLockedTimeSlots();
    
    if (lockedSlots[dateKey]) {
        lockedSlots[dateKey] = lockedSlots[dateKey].filter(slot => slot !== timeSlot);
        
        // Remove the date key if no more time slots are locked
        if (lockedSlots[dateKey].length === 0) {
            delete lockedSlots[dateKey];
        }
        
        saveLockedTimeSlots(lockedSlots);
    }
    
    return { ...lockedSlots };
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
