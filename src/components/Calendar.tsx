import { useState } from 'react';
import { CalendarTaskList } from './CalendarTaskList';

// Days of the week
const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Mock data for the calendar
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Mock events data
const EVENTS = [
    {
        id: 1,
        title: 'VASCloud Service',
        startTime: '10:00am',
        endTime: '12:00pm',
        color: 'indigo',
    },
    {
        id: 2,
        title: 'SR Follow Up',
        startTime: '12:00pm',
        endTime: '1:00pm',
        color: 'green',
    },
];

interface CalendarProps {
    initialDate?: Date;
}

export const Calendar = ({ initialDate = new Date() }: CalendarProps) => {
    const [currentDate, setCurrentDate] = useState(initialDate);
    const [selectedDate, setSelectedDate] = useState(initialDate);

    // Get current month and year
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Get days in month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Get first day of month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    // Create calendar days array
    const calendarDays = Array(daysInMonth + firstDayOfMonth)
        .fill(null)
        .map((_, index) => {
            if (index < firstDayOfMonth) return null;
            return index - firstDayOfMonth + 1;
        });

    // Navigate to previous month
    const prevMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    };

    // Navigate to next month
    const nextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    };

    // Check if a date is today
    const isToday = (day: number) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
        );
    };

    // Check if a date is selected
    const isSelected = (day: number) => {
        return (
            day === selectedDate.getDate() &&
            currentMonth === selectedDate.getMonth() &&
            currentYear === selectedDate.getFullYear()
        );
    };

    // Mock data for events
    const hasEvent = (day: number) => {
        // For demo purposes, let's say days 10, 14, and 22 have events
        return [10, 14, 22].includes(day);
    };

    return (
        <div className="h-full flex flex-col bg-white overflow-y-auto custom-scrollbar">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Today's Schedule</h2>
                    <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
                        <button className="p-2 rounded-md bg-white shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm0 2h12v12H4V4z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button className="p-2 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <button onClick={prevMonth} className="p-1 rounded-full hover:bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <h3 className="text-lg font-medium">
                        {MONTHS[currentMonth]} {currentYear}
                    </h3>
                    <button onClick={nextMonth} className="p-1 rounded-full hover:bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-4">
                    {DAYS.map((day, index) => (
                        <div key={index} className="text-center text-xs font-medium text-gray-500">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((day, index) => (
                        <div key={index} className="aspect-square">
                            {day !== null && (
                                <button
                                    onClick={() => setSelectedDate(new Date(currentYear, currentMonth, day))}
                                    className={`w-full h-full flex items-center justify-center text-sm rounded-full
                  ${day === 14 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}
                `}
                                >
                                    {day}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-gray-200 mt-4"></div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="space-y-8">
                    {/* Time slots */}
                    <div className="flex items-start">
                        <div className="text-sm text-gray-500 w-16">09:00</div>
                        <div className="border-b border-gray-200 flex-1 pb-8"></div>
                    </div>

                    <div className="flex items-start">
                        <div className="text-sm text-gray-500 w-16">10:00</div>
                        <div className="flex-1">
                            <div className="bg-white rounded-lg border border-gray-200 p-4 relative">
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500 rounded-l-lg"></div>
                                <div className="pl-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-base font-medium">VASCloud Ser...</div>
                                            <div className="text-sm text-gray-500">10:00am - 12:00pm</div>
                                        </div>
                                        <button className="text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="text-sm text-gray-500 w-16">11:00</div>
                        <div className="border-b border-gray-200 flex-1 pb-8"></div>
                    </div>

                    <div className="flex items-start">
                        <div className="text-sm text-gray-500 w-16">12:00</div>
                        <div className="flex-1">
                            <div className="bg-white rounded-lg border border-gray-200 p-4 relative">
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500 rounded-l-lg"></div>
                                <div className="pl-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-base font-medium">SR Follow Up</div>
                                            <div className="text-sm text-gray-500">12:00pm - 1:00pm</div>
                                        </div>
                                        <button className="text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="text-sm text-gray-500 w-16">01:00</div>
                        <div className="border-b border-gray-200 flex-1 pb-8"></div>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <CalendarTaskList />
            </div>
        </div>
    );
}; 