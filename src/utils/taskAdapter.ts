import { Task as SupabaseTask } from '../api/supabase';

// UI-specific task type
export interface UITask {
    id: string;
    title: string;
    description: string;
    status: 'to_do' | 'ongoing' | 'completed';
    category: 'VASCLOUD' | 'RBT' | 'IT' | 'MM';
    start_date: string;
    end_date: string;
    is_on_track: boolean;
    is_at_risk: boolean;
    is_completed: boolean;
    user_id?: string;
    created_at?: string;
    priority?: 'low' | 'medium' | 'high';
}

/**
 * Converts a Supabase task to the format used in the UI
 */
export function toUITask(supabaseTask: SupabaseTask): UITask {
    // Derive status from priority and completion status
    let status: 'to_do' | 'ongoing' | 'completed';
    if (supabaseTask.is_completed) {
        status = 'completed';
    } else if (supabaseTask.priority === 'high') {
        status = 'ongoing';
    } else {
        status = 'to_do';
    }

    return {
        id: supabaseTask.id,
        title: supabaseTask.title,
        description: supabaseTask.description || '',
        status,
        category: supabaseTask.category || 'VASCLOUD',
        start_date: supabaseTask.created_at,
        end_date: supabaseTask.due_date || '',
        is_on_track: !supabaseTask.is_completed && supabaseTask.priority !== 'high',
        is_at_risk: !supabaseTask.is_completed && supabaseTask.priority === 'high',
        is_completed: supabaseTask.is_completed,
        user_id: supabaseTask.user_id,
        created_at: supabaseTask.created_at,
        priority: supabaseTask.priority
    };
}

/**
 * Converts a UI task to the format used in Supabase
 */
export function toSupabaseTask(uiTask: Partial<UITask>): Partial<SupabaseTask> {
    // Map status back to priority for Supabase
    let priority: 'low' | 'medium' | 'high';
    if (uiTask.status === 'ongoing') {
        priority = 'high';
    } else if (uiTask.status === 'completed') {
        priority = 'medium';
    } else {
        priority = 'low';
    }

    return {
        id: uiTask.id,
        title: uiTask.title,
        description: uiTask.description || null,
        is_completed: uiTask.is_completed || false,
        due_date: uiTask.end_date || null,
        priority,
        user_id: uiTask.user_id,
        category: uiTask.category
    };
} 