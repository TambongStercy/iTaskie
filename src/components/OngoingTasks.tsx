import { useState } from 'react';

// Mock data for ongoing tasks
const MOCK_TASKS = [
    {
        id: 1,
        title: 'VASCloud Service Flows',
        startTime: '9:00 am',
        progress: 24,
    },
    {
        id: 2,
        title: 'Troubleshooting RBT',
        startTime: '9:00 am',
        progress: 24,
    },
    {
        id: 3,
        title: 'UI Design Review',
        startTime: '11:30 am',
        progress: 60,
    },
    {
        id: 4,
        title: 'API Integration',
        startTime: '2:00 pm',
        progress: 35,
    },
];

export const OngoingTasks = () => {
    const [tasks] = useState(MOCK_TASKS);

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Ongoing Tasks</h2>

            <div className="space-y-4">
                {tasks.map(task => (
                    <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex items-center space-x-4">
                            {/* Play button */}
                            <button className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                            </button>

                            {/* Start time */}
                            <div className="flex flex-col w-24 flex-shrink-0">
                                <div className="text-xs text-gray-500">Start from</div>
                                <div className="text-sm text-gray-500">{task.startTime}</div>
                            </div>

                            {/* Task title */}
                            <div className="font-medium flex-grow">{task.title}</div>

                            {/* Completion percentage */}
                            <div className="text-blue-500 font-medium w-32 text-right">{task.progress}% complete</div>

                            {/* Reminder button */}
                            <button className="flex items-center bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Reminder
                            </button>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-blue-500 h-2.5 rounded-full"
                                    style={{ width: `${task.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}; 