import React from 'react';
import { TaskSummaryCard } from './TaskSummaryCard';

// Mock data for task summary
const SUMMARY_DATA = [
    {
        id: 1,
        title: 'Total Tasks',
        count: 24,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        ),
        change: 8,
        changeType: 'increase',
        bgColor: 'bg-blue-50',
    },
    {
        id: 2,
        title: 'Completed',
        count: 16,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ),
        change: 12,
        changeType: 'increase',
        bgColor: 'bg-green-50',
    },
    {
        id: 3,
        title: 'In Progress',
        count: 6,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        change: 2,
        changeType: 'decrease',
        bgColor: 'bg-yellow-50',
    },
    {
        id: 4,
        title: 'Overdue',
        count: 2,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        change: 1,
        changeType: 'increase',
        bgColor: 'bg-red-50',
    },
];

interface SummaryCardProps {
    title: string;
    count: number;
    icon: React.ReactNode;
    change: number;
    changeType: 'increase' | 'decrease';
    bgColor: string;
}

const SummaryCard = ({ title, count, icon, change, changeType, bgColor }: SummaryCardProps) => {
    return (
        <div className={`${bgColor} rounded-lg p-4 flex items-center`}>
            <div className="mr-4">
                {icon}
            </div>
            <div>
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                <div className="flex items-center">
                    <span className="text-2xl font-bold mr-2">{count}</span>
                    <div className={`flex items-center text-xs ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                        }`}>
                        {changeType === 'increase' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        )}
                        {change}%
                    </div>
                </div>
            </div>
        </div>
    );
};

export const TaskSummary = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <TaskSummaryCard
                title="Completed Task"
                count={10}
                total={20}
                color="purple"
            />
            <TaskSummaryCard
                title="Ongoing Task"
                count={5}
                total={20}
                color="blue"
            />
            <TaskSummaryCard
                title="To-do Task"
                count={5}
                total={20}
                color="indigo"
            />
        </div>
    );
}; 