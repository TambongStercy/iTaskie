import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useTaskStore, Task } from '../utils/store';
import { format, startOfWeek, addDays } from 'date-fns';
import { supabase, testSupabaseConnection } from '../api/supabase';
import { useAuth } from '../contexts/AuthContext';

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
    const maxValue = Math.max(...data.flatMap(item => item.values)) || 5; // Maximum value for the chart

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
                        <div className="text-2xl font-bold" id="total-tasks"></div>
                        <div className="ml-2 px-2 py-1 bg-teal-100 text-teal-600 text-xs rounded-full">100%</div>
                    </div>
                </div>
                <div>
                    <div className="text-gray-500 text-sm">Task Completed</div>
                    <div className="flex items-center mt-1">
                        <div className="text-2xl font-bold" id="completed-tasks"></div>
                        <div className="ml-2 px-2 py-1 bg-teal-100 text-teal-600 text-xs rounded-full" id="completed-percentage"></div>
                    </div>
                </div>
                <div>
                    <div className="text-gray-500 text-sm">Pending Tasks</div>
                    <div className="flex items-center mt-1">
                        <div className="text-2xl font-bold" id="pending-tasks"></div>
                        <div className="ml-2 px-2 py-1 bg-teal-100 text-teal-600 text-xs rounded-full" id="pending-percentage"></div>
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
    taskCounts: Record<string, number>;
}> = ({ percentage, categories, taskCounts }) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'high':
                return 'bg-red-500';
            case 'medium':
                return 'bg-yellow-500';
            case 'low':
                return 'bg-green-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Task Priority Distribution</h2>

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
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)} mr-2`}></div>
                            <span className="text-sm capitalize">{category}</span>
                        </div>
                        <span className="text-sm font-medium">{taskCounts[category] || 0} tasks</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const AnalyticsPage: React.FC = () => {
    const { tasks: storeTasks, setTasks } = useTaskStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [usingLocalStorage, setUsingLocalStorage] = useState(false);
    const { user } = useAuth();

    // Fetch tasks from Supabase or local storage
    useEffect(() => {
        fetchTasks();
    }, [user]);

    const fetchTasks = async () => {
        if (!user) return;

        try {
            setIsLoading(true);
            setError(null);

            // First try to test the connection to Supabase
            const connectionTest = await testSupabaseConnection();

            // If connection test fails, use local storage
            if (!connectionTest.success) {
                console.log('Using local storage for tasks due to Supabase connection issue');
                setUsingLocalStorage(true);
                const localTasks = getLocalTasks();
                const userTasks = user.id ? localTasks.filter(task =>
                    !task.user_id || task.user_id === user.id
                ) : localTasks;
                setTasks(userTasks);
                setIsLoading(false);
                return;
            }

            // Try to fetch from Supabase
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('user_id', user.id);

            if (error) {
                throw error;
            }

            if (!data || data.length === 0) {
                // No data found, but connection successful
                setTasks([]);
                setIsLoading(false);
                return;
            }

            // Map Supabase data to our Task model
            const mappedTasks: Task[] = data.map(item => ({
                id: item.id,
                title: item.title,
                description: item.description,
                is_completed: item.is_completed,
                priority: item.priority,
                due_date: item.due_date,
                status: item.status || mapPriorityToStatus(item.priority, item.is_completed),
                user_id: item.user_id,
                created_at: item.created_at
            }));

            setTasks(mappedTasks);
            setUsingLocalStorage(false);
        } catch (error: any) {
            console.error('Error fetching tasks:', error);
            setError(`Error loading tasks: ${error.message || 'Unknown error'}`);

            // Fallback to local storage if Supabase fails
            setUsingLocalStorage(true);
            const localTasks = getLocalTasks();
            const userTasks = user?.id ? localTasks.filter(task =>
                !task.user_id || task.user_id === user.id
            ) : localTasks;
            setTasks(userTasks);
        } finally {
            setIsLoading(false);
        }
    };

    // Get tasks from local storage
    const getLocalTasks = (): Task[] => {
        try {
            const tasksJson = localStorage.getItem('tasks');
            return tasksJson ? JSON.parse(tasksJson) : [];
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return [];
        }
    };

    // Map priority to status
    const mapPriorityToStatus = (priority: string, isCompleted: boolean): 'to_do' | 'ongoing' | 'completed' => {
        if (isCompleted) return 'completed';
        return priority === 'high' ? 'ongoing' : 'to_do';
    };

    // Calculate analytics data from tasks
    const analyticsData = useMemo(() => {
        const tasks = storeTasks;

        // Count completed and pending tasks
        const tasksCompleted = tasks.filter(task => task.is_completed).length;
        const pendingTasks = tasks.length - tasksCompleted;
        const totalTasks = tasks.length;

        // Calculate completion percentage
        const completionPercentage = totalTasks > 0
            ? Math.round((tasksCompleted / totalTasks) * 100)
            : 0;

        // Count tasks by priority
        const priorityCounts: Record<string, number> = {
            high: 0,
            medium: 0,
            low: 0
        };

        tasks.forEach(task => {
            if (task.priority in priorityCounts) {
                priorityCounts[task.priority]++;
            }
        });

        // Generate weekly progress data
        const today = new Date();
        const startOfCurrentWeek = startOfWeek(today);

        // Initialize weekly data with days of the week
        const weeklyProgress = Array.from({ length: 7 }, (_, i) => {
            const day = addDays(startOfCurrentWeek, i);
            return {
                day: format(day, 'E')[0], // First letter of day name
                date: day,
                values: [0, 0] // [completed, total]
            };
        });

        // Populate with actual task data
        tasks.forEach(task => {
            const taskDate = new Date(task.created_at);
            const dayIndex = Math.floor((taskDate.getTime() - startOfCurrentWeek.getTime()) / (1000 * 60 * 60 * 24));

            // Only count tasks from current week
            if (dayIndex >= 0 && dayIndex < 7) {
                weeklyProgress[dayIndex].values[1]++; // Increment total
                if (task.is_completed) {
                    weeklyProgress[dayIndex].values[0]++; // Increment completed
                }
            }
        });

        return {
            tasksCompleted,
            pendingTasks,
            totalTasks,
            completionPercentage,
            weeklyProgress,
            priorityCounts,
            priorities: Object.keys(priorityCounts)
        };
    }, [storeTasks]);

    // Update the task count elements after render
    React.useEffect(() => {
        const totalTasksEl = document.getElementById('total-tasks');
        const completedTasksEl = document.getElementById('completed-tasks');
        const pendingTasksEl = document.getElementById('pending-tasks');
        const completedPercentageEl = document.getElementById('completed-percentage');
        const pendingPercentageEl = document.getElementById('pending-percentage');

        if (totalTasksEl) totalTasksEl.textContent = analyticsData.totalTasks.toString();
        if (completedTasksEl) completedTasksEl.textContent = analyticsData.tasksCompleted.toString();
        if (pendingTasksEl) pendingTasksEl.textContent = analyticsData.pendingTasks.toString();

        const completedPercentage = analyticsData.totalTasks > 0
            ? Math.round((analyticsData.tasksCompleted / analyticsData.totalTasks) * 100)
            : 0;
        const pendingPercentage = 100 - completedPercentage;

        if (completedPercentageEl) completedPercentageEl.textContent = `${completedPercentage}%`;
        if (pendingPercentageEl) pendingPercentageEl.textContent = `${pendingPercentage}%`;
    }, [analyticsData]);

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
                            <button
                                onClick={fetchTasks}
                                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh
                            </button>
                            <img
                                src="/user.svg"
                                alt="User profile"
                                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex justify-center items-center py-10">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                            <span className="ml-3 text-gray-600">Loading analytics...</span>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                            <p>{error}</p>
                            <p className="text-sm mt-1">Using {usingLocalStorage ? 'local storage' : 'Supabase'} data.</p>
                        </div>
                    )}

                    {/* Analytics Content */}
                    {!isLoading && (
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
                                    value={analyticsData.pendingTasks}
                                    color="bg-blue-500"
                                />

                                <StatsCard
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>}
                                    title="Completion Rate"
                                    value={`${analyticsData.completionPercentage}%`}
                                    color="bg-purple-500"
                                />

                                {/* Project Completion Chart */}
                                <ProjectCompletionChart
                                    percentage={analyticsData.completionPercentage}
                                    categories={analyticsData.priorities}
                                    taskCounts={analyticsData.priorityCounts}
                                />
                            </div>

                            {/* Right Column - Weekly Progress Chart */}
                            <div className="col-span-3">
                                <WeeklyProgressChart data={analyticsData.weeklyProgress} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage; 