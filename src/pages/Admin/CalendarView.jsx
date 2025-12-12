import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import CalendarCell from './CalendarCell';
import ReservationModal from './ReservationModal';
import { CALENDAR_CONFIG } from './CalendarConfig';

const CalendarView = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [lockedDates, setLockedDates] = useState([]); // Array of date strings ISO

    // Navigation
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    // Calendar Generation
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale: fr });
    const endDate = endOfWeek(monthEnd, { locale: fr });
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    // Handlers
    const handleDayClick = (day) => {
        setSelectedDate(day);
    };

    const handleAddReservation = (newResa) => {
        setReservations([...reservations, newResa]);
    };

    const handleDeleteReservation = (id) => {
        setReservations(reservations.filter(r => r.id !== id));
    };

    const handleLockDate = () => {
        if (!selectedDate) return;
        const dateKey = selectedDate.toISOString();
        if (lockedDates.includes(dateKey)) {
            setLockedDates(lockedDates.filter(d => d !== dateKey));
        } else {
            setLockedDates([...lockedDates, dateKey]);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Main Calendar Section */}
            <section className="bg-white rounded-xl shadow-md p-6">

                {/* Header with Navigation */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-yellow-700 flex items-center gap-2">
                        Calendrier des réservations
                    </h2>

                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 p-1">
                        <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-sm font-medium text-pink-600 hover:bg-pink-100 rounded-md transition">
                            Aujourd'hui
                        </button>
                        <div className="w-px h-4 bg-gray-300 mx-2"></div>
                        <button onClick={prevMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-md transition text-gray-600">
                            <ChevronLeft size={18} />
                        </button>
                        <span className="w-40 text-center font-semibold text-gray-800 capitalize">
                            {format(currentDate, 'MMMM yyyy', { locale: fr })}
                        </span>
                        <button onClick={nextMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-md transition text-gray-600">
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    <button
                        onClick={() => setSelectedDate(new Date())}
                        className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition flex items-center gap-2 shadow-sm"
                    >
                        <Plus size={18} /> Nouvelle réservation
                    </button>
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
                        const dayReservations = reservations.filter(r => isSameDay(new Date(r.date), day));
                        const isLocked = lockedDates.includes(day.toISOString()) || CALENDAR_CONFIG.closedDays.includes(day.getDay());

                        return (
                            <CalendarCell
                                key={day.toISOString()}
                                date={day}
                                monthStart={monthStart}
                                reservations={dayReservations}
                                isClosed={isLocked}
                                onClick={handleDayClick}
                            />
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-green-100 border-2 border-green-400"></span>
                        <span>Disponible (0-2)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-yellow-100 border-2 border-yellow-400"></span>
                        <span>Moitié plein (3)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-orange-100 border-2 border-orange-400"></span>
                        <span>Presque complet (4-5)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-red-100 border-2 border-red-400"></span>
                        <span>Complet (6)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-gray-200 border-2 border-gray-400"></span>
                        <span>Fermé / Passé</span>
                    </div>
                </div>

            </section>

            {/* Upcoming Reservations Panel */}
            <section className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold text-pink-500 mb-4">
                    Réservations à venir (14 prochains jours)
                </h3>
                <div className="text-center text-gray-500 py-4 italic">
                    {reservations.length > 0
                        ? 'Voir le calendrier pour plus de détails.'
                        : 'Aucune réservation à venir.'}
                </div>
            </section>

            {/* Modal */}
            {selectedDate && (
                <ReservationModal
                    date={selectedDate}
                    reservations={reservations.filter(r => isSameDay(new Date(r.date), selectedDate))}
                    isLocked={lockedDates.includes(selectedDate.toISOString())}
                    onClose={() => setSelectedDate(null)}
                    onAddReservation={handleAddReservation}
                    onDeleteReservation={handleDeleteReservation}
                    onLockDate={handleLockDate}
                />
            )}
        </div>
    );
};

export default CalendarView;
