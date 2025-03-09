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
    status: 'to_do' | 'ongoing' | 'completed';
    user_id: string;
    created_at: string;
}

// Team member interface
export interface TeamMember {
    id: number;
    name: string;
    email: string;
    role: string;
    user_id?: string; // Add user_id field to associate with the current user
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

// Team member store interface
interface TeamMemberStore {
    teamMembers: TeamMember[];
    setTeamMembers: (members: TeamMember[]) => void;
    addTeamMember: (member: TeamMember) => void;
    updateTeamMember: (member: TeamMember) => void;
    deleteTeamMember: (memberId: number) => void;
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
        created_at: new Date().toISOString(),
        status: 'to_do'
    },
    {
        id: '2',
        title: 'Review team updates',
        description: 'Check the weekly updates from the development team',
        is_completed: true,
        priority: 'medium',
        due_date: new Date().toISOString(),
        user_id: '123456',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        status: 'completed'
    }
];

// Create team member store
export const useTeamMemberStore = create<TeamMemberStore>((set) => ({
    teamMembers: [], // Initialize with empty array instead of mock data
    setTeamMembers: (members) => set({ teamMembers: members }),
    addTeamMember: (member) => set((state) => ({ teamMembers: [...state.teamMembers, member] })),
    updateTeamMember: (member) =>
        set((state) => ({
            teamMembers: state.teamMembers.map((m) => (m.id === member.id ? member : m)),
        })),
    deleteTeamMember: (memberId) =>
        set((state) => ({
            teamMembers: state.teamMembers.filter((m) => m.id !== memberId),
        })),
}));

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