import { create } from 'zustand';
// Remove the actual supabase import
// import { Task } from '../api/supabase';

// Define Task type locally since we're removing the supabase import
export interface Task {
    id: string;
    title: string;
    description: string | null;
    is_completed: boolean;
    priority: 'low' | 'medium' | 'high';
    due_date: string | null;
    user_id: string;
    created_at: string;
}

interface TaskStore {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
    setTasks: (tasks: Task[]) => void;
    addTask: (task: Task) => void;
    updateTask: (task: Task) => void;
    deleteTask: (taskId: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

// Initialize with some mock tasks
const mockTasks: Task[] = [
    {
        id: '1',
        title: 'Complete project proposal',
        description: 'Finish the project proposal for the client meeting',
        is_completed: false,
        priority: 'high',
        due_date: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
        user_id: '123456',
        created_at: new Date().toISOString()
    },
    {
        id: '2',
        title: 'Review team updates',
        description: 'Check the weekly updates from the development team',
        is_completed: true,
        priority: 'medium',
        due_date: new Date().toISOString(),
        user_id: '123456',
        created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    }
];

export const useTaskStore = create<TaskStore>((set) => ({
    tasks: mockTasks, // Initialize with mock tasks
    isLoading: false,
    error: null,
    setTasks: (tasks) => set({ tasks }),
    addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
    updateTask: (task) =>
        set((state) => ({
            tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
        })),
    deleteTask: (taskId) =>
        set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== taskId),
        })),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
})); 