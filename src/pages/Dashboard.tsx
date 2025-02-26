import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TaskList } from '../components/TaskList';
import { TaskForm } from '../components/TaskForm';
import { Sidebar } from '../components/Sidebar';
import { TaskSummary } from '../components/TaskSummary';
import { TaskChart } from '../components/TaskChart';
import { Calendar } from '../components/Calendar';
import { OngoingTasks } from '../components/OngoingTasks';

export const Dashboard = () => {
    const { user, signOut } = useAuth();
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleSignOut = () => {
        signOut();
    };

    // Mock user data
    const userName = user?.email?.split('@')[0] || 'Nyando Onongewene';

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                <div className="flex h-full">
                    {/* Left Content (75% width) */}
                    <div className="w-3/4 p-8 overflow-y-auto custom-scrollbar">
                        {/* User Greeting */}
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Hi, {userName}</h1>
                                <p className="text-gray-600">Let's finish your task today!</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button className="relative p-2 bg-white rounded-full shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
                                </button>
                                <img
                                    src="https://randomuser.me/api/portraits/women/44.jpg"
                                    alt="User profile"
                                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Task Summary Cards */}
                        <TaskSummary />

                        {/* Task Chart */}
                        <div className="mb-8">
                            <TaskChart />
                        </div>

                        {/* Ongoing Tasks */}
                        <OngoingTasks />
                    </div>

                    {/* Right Content - Calendar (25% width) */}
                    <div className="w-1/4 border-l border-gray-200 bg-white overflow-hidden">
                        <Calendar />
                    </div>
                </div>
            </div>

            {/* Task Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Add New Task</h2>
                            <button
                                onClick={() => setIsFormOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <TaskForm onClose={() => setIsFormOpen(false)} />
                    </div>
                </div>
            )}
        </div>
    );
}; 