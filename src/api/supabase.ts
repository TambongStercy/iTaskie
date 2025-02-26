import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Task = {
    id: string;
    title: string;
    description: string | null;
    is_completed: boolean;
    due_date: string | null;
    priority: 'low' | 'medium' | 'high';
    created_at: string;
    user_id: string;
}; 