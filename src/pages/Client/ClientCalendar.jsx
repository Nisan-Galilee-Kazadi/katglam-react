import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths, isSameDay, isPast, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Lock, Check } from 'lucide-react';
import ReservationRequestModal from './ReservationRequestModal';
import { getLockedDates, getReservations } from '../../services/localStorageService';
import { CALENDAR_CONFIG } from '../Admin/CalendarConfig';

const ClientCalendar = () => {
    const { client } = useOutletContext();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [lockedDates, setLockedDates] = useState([]); // Array of ISO date strings
    const [closedDays, setClosedDays] = useState([]); // Array of day indices (0-6)

    useEffect(() => {
        const loadData = async () => {
            try {
                const token = localStorage.getItem('token');

                // Load availability from API instead of localStorage
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations/availability`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const activeReservations = await response.json();
                    setReservations(activeReservations);
                }

                // Load locked dates from admin (specific dates locked)
                // Note: Ideally this should also be an API call
                const adminLockedDates = getLockedDates();
                setLockedDates(adminLockedDates);

                // Load closed days from business hours (recurring weekly closures)
                const businessHours = JSON.parse(localStorage.getItem('business_hours') || '{}');
                const locked = [];

                // Get closed days from business hours
                Object.entries(businessHours).forEach(([day, hours]) => {
                    if (hours.closed) {
                        const dayIndex = {
                            'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
                            'thursday': 4, 'friday': 5, 'saturday': 6
                        }[day];
                        locked.push(dayIndex);
                    }
                });

                setClosedDays(locked);
            } catch (error) {
                console.error('Error loading client calendar data:', error);
            }
        };
        loadData();
    }, []);

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale: fr });
    const endDate = endOfWeek(monthEnd, { locale: fr });
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const isDayAvailable = (day) => {
        if (isPast(startOfDay(day)) && !isSameDay(day, new Date())) {
            return false;
        }

        const dayISO = day.toISOString();
        if (lockedDates.includes(dayISO)) {
            return false;
        }

        if (closedDays.includes(day.getDay())) {
            return false;
        }

        const dayReservations = reservations.filter(r =>
            isSameDay(new Date(r.date), day)
        );

        return dayReservations.length < 6;
    };

    const getReservationCount = (day) => {
        return reservations.filter(r =>
            isSameDay(new Date(r.date), day)
        ).length;
    };

    const handleDayClick = (day) => {
        if (isDayAvailable(day)) {
            setSelectedDate(day);
        }
    };

    const handleReservationSubmit = async () => {
        try {
            // Reload reservations availability after new request
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations/availability`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const activeReservations = await response.json();
                setReservations(activeReservations);
            }
            setSelectedDate(null);
        } catch (error) {
            console.error('Error reloading reservations after submit:', error);
        }
    };

    return (
        <div className="w-full h-full pb-2">
            <style>
                {`
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                    .scrollbar-hide {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}
            </style>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 sm:p-3 scrollbar-hide">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-6">
                    <h2 className="text-2xl font-bold text-gray-800 text-center lg:text-left">
                        Réserver un rendez-vous
                    </h2>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                        {/* Today Button */}
                        <button
                            onClick={() => setCurrentDate(new Date())}
                            className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-pink-600 bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-lg transition whitespace-nowrap"
                        >
                            Aujourd'hui
                        </button>

                        {/* Month Navigation */}
                        <div className="flex items-center justify-between bg-gray-50 rounded-lg border border-gray-200 p-1 w-full sm:w-auto">
                            <button
                                onClick={prevMonth}
                                className="p-2 hover:bg-white hover:shadow-sm rounded-md transition text-gray-600"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <span className="flex-1 sm:w-40 text-center font-semibold text-gray-800 capitalize text-sm sm:text-base">
                                {format(currentDate, 'MMMM yyyy', { locale: fr })}
                            </span>
                            <button
                                onClick={nextMonth}
                                className="p-2 hover:bg-white hover:shadow-sm rounded-md transition text-gray-600"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Days Header */}
                <div className="grid grid-cols-7 border border-b-0 border-gray-200 rounded-t-lg bg-gray-100 overflow-hidden">
                    {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, i) => (
                        <div key={day} className={`py-3 text-center font-semibold text-sm ${i >= 5 ? 'text-pink-500' : 'text-gray-600'}`}>
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 border border-gray-200 bg-gray-200 gap-px rounded-b-lg overflow-hidden">
                    {calendarDays.map((day) => {
                        const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                        const isToday = isSameDay(day, new Date());
                        const isAvailable = isDayAvailable(day);
                        const reservationCount = getReservationCount(day);
                        const isPastDay = isPast(startOfDay(day)) && !isToday;

                        return (
                            <div
                                key={day.toISOString()}
                                onClick={() => handleDayClick(day)}
                                className={`
                                    aspect-square p-1 sm:p-2 bg-white flex flex-col border-b border-r border-gray-100
                                    ${!isCurrentMonth ? 'opacity-40' : ''}
                                    ${isAvailable && isCurrentMonth ? 'cursor-pointer hover:bg-pink-50' : 'cursor-not-allowed'}
                                    ${isToday ? 'ring-2 ring-pink-500 ring-inset z-10' : ''}
                                `}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`text-sm font-medium ${isToday ? 'text-pink-600 font-bold' :
                                        isPastDay ? 'text-gray-400' :
                                            'text-gray-700'
                                        }`}>
                                        {format(day, 'd')}
                                    </span>
                                    {!isAvailable && isCurrentMonth && (
                                        <Lock size={14} className="text-red-400" />
                                    )}
                                </div>

                                {isCurrentMonth && !isPastDay && (
                                    <div className="flex-1 flex items-center justify-center">
                                        {isAvailable ? (
                                            <div className="text-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${reservationCount < 3 ? 'bg-green-100 text-green-600' :
                                                    reservationCount === 3 ? 'bg-yellow-100 text-yellow-600' :
                                                        reservationCount < 6 ? 'bg-orange-100 text-orange-600' :
                                                            'bg-red-100 text-red-600'
                                                    }`}>
                                                    <Check size={16} />
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">{Math.max(0, 6 - reservationCount)} places</p>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                                    <Lock size={16} className="text-red-600" />
                                                </div>
                                                <p className="text-xs text-red-500 mt-1 hidden sm:block">Fermé</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-green-100 border-2 border-green-400"></span>
                        <span>Disponible</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-yellow-100 border-2 border-yellow-400"></span>
                        <span>Peu de places</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-red-100 border-2 border-red-400"></span>
                        <span>Complet / Fermé</span>
                    </div>
                </div>

                {/* Info Box */}
                <div className="mt-6 p-4 bg-pink-50 border border-pink-200 rounded-lg">
                    <p className="text-sm text-pink-800">
                        <strong>Note :</strong> Cliquez sur une date disponible pour faire une demande de réservation.
                        Votre demande sera soumise à validation par l'administrateur.
                    </p>
                </div>
            </div>

            {/* Reservation Request Modal */}
            {selectedDate && (
                <ReservationRequestModal
                    date={selectedDate}
                    client={client}
                    onClose={() => setSelectedDate(null)}
                    onSubmit={handleReservationSubmit}
                    occupiedSlots={reservations
                        .filter(r => isSameDay(new Date(r.date), selectedDate))
                        .map(r => r.timeSlot)
                    }
                />
            )}
        </div>
    );
};

export default ClientCalendar;
