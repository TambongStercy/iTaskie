import React from 'react';
import { Sidebar } from '../components/Sidebar';

// Mock data for analytics
const analyticsData = {
    tasksCompleted: 54,
    pendingTasks: 6,
    totalTasks: 60,
    analyticsResults: 82,
    weeklyProgress: [
        { day: 'M', values: [1, 5] },
        { day: 'T', values: [1, 5] },
        { day: 'W', values: [2, 3] },
        { day: 'T', values: [1, 2] },
        { day: 'F', values: [2, 4] },
        { day: 'S', values: [1, 3] },
        { day: 'S', values: [1, 2] },
    ],
    projectCompletion: {
        percentage: 100,
        categories: ['RBT', 'VASCLOUD', 'IT']
    }
};

// Task Stats Card Component
const StatsCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string | number;
    color: string;
}> = ({ icon, title, value, color }) => {
    return (
        <div className="bg-white rounded-xl p-5 shadow-sm mb-4 flex items-center">
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mr-4`}>
                {icon}
            </div>
            <div>
                <div className="text-sm text-gray-500">{title}</div>
                <div className="text-2xl font-bold">{value}</div>
            </div>
        </div>
    );
};

// Weekly Progress Chart Component
const WeeklyProgressChart: React.FC<{
    data: { day: string; values: number[] }[];
}> = ({ data }) => {
    const maxValue = 5; // Maximum value for the chart

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Tasks Progress</h2>
                <div className="relative">
                    <select className="appearance-none bg-white border border-gray-200 rounded-full px-4 py-2 pr-8 text-sm font-medium focus:outline-none">
                        <option>Weekly</option>
                        <option>Monthly</option>
                        <option>Yearly</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="flex h-64 items-end space-x-6">
                {data.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="w-full flex flex-col items-center justify-end h-52">
                            {item.values.map((value, i) => (
                                <div
                                    key={i}
                                    className={`w-4 mb-1 rounded-sm ${i === 0 ? 'bg-indigo-900' : 'bg-indigo-200'}`}
                                    style={{ height: `${(value / maxValue) * 100}%` }}
                                ></div>
                            ))}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">{item.day}</div>
                    </div>
                ))}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
                <div>
                    <div className="text-gray-500 text-sm">Total Tasks</div>
                    <div className="flex items-center mt-1">
                        <div className="text-2xl font-bold">{analyticsData.totalTasks}</div>
                        <div className="ml-2 px-2 py-1 bg-teal-100 text-teal-600 text-xs rounded-full">100%</div>
                    </div>
                </div>
                <div>
                    <div className="text-gray-500 text-sm">Task Completed</div>
                    <div className="flex items-center mt-1">
                        <div className="text-2xl font-bold">{analyticsData.tasksCompleted}</div>
                        <div className="ml-2 px-2 py-1 bg-teal-100 text-teal-600 text-xs rounded-full">90%</div>
                    </div>
                </div>
                <div>
                    <div className="text-gray-500 text-sm">Pending Tasks</div>
                    <div className="flex items-center mt-1">
                        <div className="text-2xl font-bold">{analyticsData.pendingTasks}</div>
                        <div className="ml-2 px-2 py-1 bg-teal-100 text-teal-600 text-xs rounded-full">10%</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Project Completion Chart Component
const ProjectCompletionChart: React.FC<{
    percentage: number;
    categories: string[];
}> = ({ percentage, categories }) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'RBT':
                return 'bg-blue-500';
            case 'VASCLOUD':
                return 'bg-purple-500';
            case 'IT':
                return 'bg-indigo-900';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Your Project Tasks</h2>

            <div className="flex justify-center mb-6">
                <div className="relative w-48 h-48">
                    <svg className="w-full h-full" viewBox="0 0 200 200">
                        <circle
                            cx="100"
                            cy="100"
                            r={radius}
                            fill="none"
                            stroke="#e6e6e6"
                            strokeWidth="15"
                        />
                        <circle
                            cx="100"
                            cy="100"
                            r={radius}
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="15"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            transform="rotate(-90 100 100)"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#4F46E5" />
                                <stop offset="100%" stopColor="#9333EA" />
                            </linearGradient>
                        </defs>
                        <text
                            x="100"
                            y="100"
                            dominantBaseline="middle"
                            textAnchor="middle"
                            fontSize="24"
                            fontWeight="bold"
                        >
                            {percentage}%
                        </text>
                    </svg>
                </div>
            </div>

            <div className="space-y-3">
                {categories.map((category, index) => (
                    <div key={index} className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)} mr-2`}></div>
                        <span className="text-sm">{category}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const AnalyticsPage: React.FC = () => {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                <div className="p-8 h-full overflow-y-auto custom-scrollbar">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold">Analytics</h1>
                        <div className="flex items-center space-x-4">
                            <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                Export
                            </button>
                            <img
                                src="/user.svg"
                                alt="User profile"
                                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Analytics Content */}
                    <div className="grid grid-cols-4 gap-6">
                        {/* Left Column - Stats Cards */}
                        <div className="col-span-1 space-y-6">
                            <StatsCard
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>}
                                title="Tasks Completed"
                                value={analyticsData.tasksCompleted}
                                color="bg-purple-500"
                            />

                            <StatsCard
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>}
                                title="Pending Tasks"
                                value={`0${analyticsData.pendingTasks}`}
                                color="bg-blue-500"
                            />

                            <StatsCard
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>}
                                title="Analytics Results"
                                value={`${analyticsData.analyticsResults}%`}
                                color="bg-purple-500"
                            />

                            {/* Project Completion Chart */}
                            <ProjectCompletionChart
                                percentage={analyticsData.projectCompletion.percentage}
                                categories={analyticsData.projectCompletion.categories}
                            />
                        </div>

                        {/* Right Column - Weekly Progress Chart */}
                        <div className="col-span-3">
                            <WeeklyProgressChart data={analyticsData.weeklyProgress} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage; 