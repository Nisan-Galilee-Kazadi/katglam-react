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
 * Get locked dates from localStorage
 * @returns {Array<string>} Array of ISO date strings
 */
export const getLockedDates = () => {
    return JSON.parse(localStorage.getItem('locked_dates') || '[]');
};

/**
 * Lock a specific date
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
 * Unlock a specific date
 * @param {string} dateISO - ISO string of the date to unlock
 * @returns {Array<string>} Updated list of locked dates
 */
export const unlockDate = (dateISO) => {
    const locked = getLockedDates();
    const updated = locked.filter(d => d !== dateISO);
    localStorage.setItem('locked_dates', JSON.stringify(updated));
    return updated;
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
