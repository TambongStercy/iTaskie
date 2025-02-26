import React from 'react';

// Task status types
type TaskStatus = 'on_track' | 'at_risk' | 'off_track' | 'not_started';

interface Task {
    id: number;
    title: string;
    date: string;
    status: TaskStatus;
    category: string;
    completed: boolean;
}

// Mock data for tasks
const MOCK_TASKS: Task[] = [
    {
        id: 1,
        title: 'Troubleshoo...',
        date: '01 Sep 2025',
        status: 'on_track',
        category: 'RBT',
        completed: false
    },
    {
        id: 2,
        title: 'RBT Flows',
        date: '01 Sep 2025',
        status: 'on_track',
        category: 'RBT',
        completed: false
    },
    {
        id: 3,
        title: 'VASCloud tr...',
        date: '03 Sep 2025',
        status: 'at_risk',
        category: 'VASCLOUD',
        completed: false
    },
    {
        id: 4,
        title: 'Mobile Mo...',
        date: '06 Sep 2025',
        status: 'off_track',
        category: 'MM',
        completed: false
    }
];

const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
        case 'on_track':
            return (
                <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-full flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                    On Track
                </div>
            );
        case 'at_risk':
            return (
                <div className="bg-orange-400 text-white text-xs px-3 py-1 rounded-full flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                    At Risk
                </div>
            );
        case 'off_track':
            return (
                <div className="bg-red-500 text-white text-xs px-3 py-1 rounded-full flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                    Off Track
                </div>
            );
        default:
            return null;
    }
};

export const CalendarTaskList: React.FC = () => {
    const completedCount = MOCK_TASKS.filter(task => task.completed).length;
    const totalCount = MOCK_TASKS.length;

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Task</h2>
                <a href="#" className="text-indigo-600 font-medium">see more...</a>
            </div>

            <div className="flex items-center mb-6">
                <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </div>
                <span className="text-gray-800 font-medium">{completedCount}/{totalCount} completed</span>
            </div>

            <div className="space-y-4">
                {MOCK_TASKS.map(task => (
                    <div key={task.id} className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-md border ${task.completed ? 'bg-indigo-600 border-indigo-600' : 'border-indigo-600'} flex items-center justify-center mr-3`}>
                                {task.completed && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            <div>
                                <div className="font-medium text-gray-800">{task.title}</div>
                                <div className="text-gray-500 text-sm">{task.date}</div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="mr-4 font-medium">{task.category}</div>
                            {getStatusBadge(task.status)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}; 