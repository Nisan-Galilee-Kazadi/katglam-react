import React, { useState } from 'react';
import { format, isSameMonth, isToday, isSameDay } from 'date-fns';
import { Lock, Unlock, Clock } from 'lucide-react';
import { getStatusForReservations, isTimeSlotLocked } from './CalendarConfig';
import { motion, AnimatePresence } from 'framer-motion';

const CalendarCell = ({ date, monthStart, reservations = [], isClosed, onClick, lockedTimeSlots = {} }) => {
    const isCurrentMonth = isSameMonth(date, monthStart);
    const count = reservations.length;
    const [showTimeSlots, setShowTimeSlots] = useState(false);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPast = date < today;
    const isToday = isSameDay(date, new Date());
    
    // Get locked time slots for this date
    const dateKey = date.toISOString().split('T')[0];
    const dayLockedTimeSlots = lockedTimeSlots[dateKey] || [];
    
    // Toggle time slots visibility
    const toggleTimeSlots = (e) => {
        e.stopPropagation();
        setShowTimeSlots(!showTimeSlots);
    };

    // Check if date is in the past (before today, ignoring time)

    let status = isClosed ? 'closed' : getStatusForReservations(count);

    // Status Styles (Ported from legacy CSS)
    const statusStyles = {
        available: "bg-green-50 border-green-200 hover:bg-green-100",
        half: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100", // "Moitié plein"
        "almost-full": "bg-orange-50 border-orange-200 hover:bg-orange-100",
        full: "bg-red-50 border-red-200 hover:bg-red-100",
        closed: "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed opacity-60",
        past: "bg-gray-200 border-gray-300 text-gray-500 opacity-70", // New style for past dates
        default: "bg-white border-gray-200"
    };

    const indicatorColors = {
        available: "bg-green-400",
        half: "bg-yellow-400",
        "almost-full": "bg-orange-400",
        full: "bg-red-400",
        closed: "bg-gray-400",
        past: "bg-gray-400",
        default: "bg-gray-200"
    };

    // Determine effective style
    let currentStyle = statusStyles.default;
    let currentIndicator = indicatorColors.default;

    if (isPast) {
        currentStyle = statusStyles.past;
        currentIndicator = indicatorColors.past;
        // Override status to treat as closed for interactions if needed, but visually distinctive
    } else if (isClosed) {
        currentStyle = statusStyles.closed;
        currentIndicator = indicatorColors.closed;
    } else {
        currentStyle = statusStyles[status] || statusStyles.default;
        currentIndicator = indicatorColors[status] || indicatorColors.default;
    }

    const handleClick = () => {
        // Empêcher le clic sur les dates passées ou fermées
        if (isClosed || isPast) {
            return;
        }
        onClick(date);
    };

    return (
        <div 
            className={`relative min-h-[80px] p-2 border transition-all duration-200 
                ${!isCurrentMonth ? 'opacity-40 bg-gray-50' : currentStyle}
                ${!isClosed && !isPast && isCurrentMonth ? 
                    'hover:scale-[1.02] hover:shadow-md' : 
                    'opacity-80'}
                flex flex-col
            `}
            onClick={!isPast && !isClosed ? handleClick : undefined}
        >
            {/* Header: Day Number + Indicators */}
            <div className="flex justify-between items-start">
                <span 
                    className={`
                        text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full
                        ${isToday ? 'bg-pink-500 text-white shadow-sm' : 'text-gray-700'}
                    `}
                >
                    {format(date, 'd')}
                </span>

                <div className="flex items-center gap-1">
                    {/* Lock/Unlock indicator */}
                    {!isPast && !isClosed && (
                        <button 
                            onClick={toggleTimeSlots}
                            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                            title="Gérer les créneaux"
                        >
                            <Clock size={14} className="text-gray-500" />
                        </button>
                    )}

                    {/* Status Indicator Dot */}
                    {!isClosed && !isPast && (
                        <div 
                            className={`w-3 h-3 rounded-full ${currentIndicator}`}
                            title={`${count} réservations`}
                        />
                    )}
                </div>
            </div>

            {/* Content: Reservation Count Text */}
            {!isClosed && !isPast && count > 0 && (
                <div className="mt-auto text-xs font-medium text-gray-600">
                    {count} rés.
                </div>
            )}

            {/* Time Slots Popover */}
            <AnimatePresence>
                {showTimeSlots && !isClosed && !isPast && (
                    <motion.div 
                        className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-xs font-medium text-gray-700 mb-2">
                            Créneaux du {format(date, 'dd/MM/yyyy')}
                        </div>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                            {CALENDAR_CONFIG.timeSlots.map((slot) => {
                                const isLocked = isTimeSlotLocked(date, slot.value, lockedTimeSlots);
                                return (
                                    <div 
                                        key={slot.value}
                                        className={`flex items-center justify-between p-1 px-2 rounded text-xs ${isLocked ? 'bg-red-50' : 'hover:bg-gray-50'}`}
                                    >
                                        <span className={isLocked ? 'line-through text-gray-500' : ''}>
                                            {slot.label}
                                        </span>
                                        <button 
                                            className="p-1 rounded-full hover:bg-gray-200"
                                            onClick={() => {
                                                // This will be handled by the parent component
                                                // We'll use event delegation instead
                                                const event = new CustomEvent('toggleTimeSlotLock', {
                                                    detail: { date, timeSlot: slot.value }
                                                });
                                                window.dispatchEvent(event);
                                            }}
                                            title={isLocked ? 'Déverrouiller' : 'Verrouiller'}
                                        >
                                            {isLocked ? (
                                                <Lock size={12} className="text-red-500" />
                                            ) : (
                                                <Unlock size={12} className="text-green-500" />
                                            )}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Labels */}
            {isClosed && !isPast && (
                <div className="mt-auto flex flex-col items-center w-full">
                    <Lock size={14} className="text-gray-400 sm:mb-1" />
                    <span className="text-[10px] sm:text-xs italic text-gray-500 hidden sm:block">Fermé</span>
                </div>
            )}
            {isPast && (
                <div className="mt-auto text-[10px] sm:text-xs italic text-gray-500 text-center w-full hidden sm:block">
                    Passé
                </div>
            )}
        </div>
    );
};

export default CalendarCell;
