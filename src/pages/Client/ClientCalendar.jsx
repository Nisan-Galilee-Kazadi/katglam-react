import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths, isSameDay, isPast, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Lock, Check } from 'lucide-react';
import ReservationRequestModal from './ReservationRequestModal';

const ClientCalendar = () => {
    const { client } = useOutletContext();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [lockedDates, setLockedDates] = useState([]);

    useEffect(() => {
        // Load all reservations to check availability
        const allReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
        setReservations(allReservations);

        // Load locked dates from admin settings
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

        setLockedDates(locked);
    }, []);

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale: fr });
    const endDate = endOfWeek(monthEnd, { locale: fr });
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const isDayAvailable = (day) => {
        // Check if day is in the past
        if (isPast(startOfDay(day)) && !isSameDay(day, new Date())) {
            return false;
        }

        // Check if day is a closed day
        if (lockedDates.includes(day.getDay())) {
            return false;
        }

        // Check if day is fully booked (6 reservations max)
        const dayReservations = reservations.filter(r =>
            isSameDay(new Date(r.date), day) &&
            (r.status === 'confirmed' || r.status === 'pending')
        );

        return dayReservations.length < 6;
    };

    const getReservationCount = (day) => {
        return reservations.filter(r =>
            isSameDay(new Date(r.date), day) &&
            (r.status === 'confirmed' || r.status === 'pending')
        ).length;
    };

    const handleDayClick = (day) => {
        if (isDayAvailable(day)) {
            setSelectedDate(day);
        }
    };

    const handleReservationSubmit = () => {
        // Reload reservations after new request
        const allReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
        setReservations(allReservations);
        setSelectedDate(null);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">Réserver un rendez-vous</h2>

                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 p-1">
                        <button
                            onClick={() => setCurrentDate(new Date())}
                            className="px-3 py-1 text-sm font-medium text-pink-600 hover:bg-pink-100 rounded-md transition"
                        >
                            Aujourd'hui
                        </button>
                        <div className="w-px h-4 bg-gray-300 mx-2"></div>
                        <button
                            onClick={prevMonth}
                            className="p-2 hover:bg-white hover:shadow-sm rounded-md transition text-gray-600"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span className="w-40 text-center font-semibold text-gray-800 capitalize">
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
                                    min-h-[80px] p-2 bg-white flex flex-col
                                    ${!isCurrentMonth ? 'opacity-40' : ''}
                                    ${isAvailable && isCurrentMonth ? 'cursor-pointer hover:bg-pink-50' : 'cursor-not-allowed'}
                                    ${isToday ? 'ring-2 ring-pink-500 ring-inset' : ''}
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
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${reservationCount === 0 ? 'bg-green-100 text-green-600' :
                                                        reservationCount <= 2 ? 'bg-green-100 text-green-600' :
                                                            reservationCount <= 4 ? 'bg-yellow-100 text-yellow-600' :
                                                                'bg-orange-100 text-orange-600'
                                                    }`}>
                                                    <Check size={16} />
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">{6 - reservationCount} places</p>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                                    <Lock size={16} className="text-red-600" />
                                                </div>
                                                <p className="text-xs text-red-500 mt-1">Fermé</p>
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
                />
            )}
        </div>
    );
};

export default ClientCalendar;
