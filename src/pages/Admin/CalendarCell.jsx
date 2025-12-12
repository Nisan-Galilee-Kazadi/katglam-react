import React from 'react';
import { format, isSameMonth, isToday } from 'date-fns';
import { getStatusForReservations } from './CalendarConfig';

const CalendarCell = ({ date, monthStart, reservations = [], isClosed, onClick }) => {
    const isCurrentMonth = isSameMonth(date, monthStart);
    const count = reservations.length;

    // Check if date is in the past (before today, ignoring time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPast = date < today;

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
        // Prevent clicking strictly on past dates or closed dates if desired
        // Legacy admin "past" dates were not clickable or just info
        if (!isClosed && !isPast) {
            onClick(date);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`
                relative min-h-[80px] p-2 border transition-all duration-200 
                ${!isCurrentMonth ? 'opacity-40 bg-gray-50' : currentStyle}
                ${!isClosed && !isPast && isCurrentMonth ? 'hover:scale-[1.02] hover:shadow-md cursor-pointer' : ''}
                flex flex-col
            `}
        >
            {/* Header: Day Number + Indicator */}
            <div className="flex justify-between items-start">
                <span className={`
                    text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full
                    ${isToday(date) ? 'bg-pink-500 text-white shadow-sm' : 'text-gray-700'}
                `}>
                    {format(date, 'd')}
                </span>

                {/* Status Indicator Dot */}
                {(!isClosed && !isPast) && (
                    <div className={`w-3 h-3 rounded-full ${currentIndicator}`}
                        title={`${count} réservations`}
                    />
                )}
            </div>

            {/* Content: Reservation Count Text */}
            {!isClosed && !isPast && count > 0 && (
                <div className="mt-auto text-xs font-medium text-gray-600">
                    {count} rés.
                </div>
            )}

            {/* Labels */}
            {isClosed && !isPast && (
                <div className="mt-auto text-xs italic text-gray-500 text-center w-full">
                    Fermé
                </div>
            )}
            {isPast && (
                <div className="mt-auto text-xs italic text-gray-500 text-center w-full">
                    Passé
                </div>
            )}
        </div>
    );
};

export default CalendarCell;
