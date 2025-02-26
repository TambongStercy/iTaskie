import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
        'Missing Supabase environment variables. Please check your .env file.'
    );
}

// Create Supabase client
export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
    return Boolean(supabaseUrl && supabaseAnonKey);
};

// Helper function to test the connection to Supabase
export const testSupabaseConnection = async () => {
    try {
        const { data, error } = await supabase.from('tasks').select('count', { count: 'exact' }).limit(1);
        if (error) throw error;
        return { success: true, message: 'Connected to Supabase successfully' };
    } catch (error: any) {
        console.error('Supabase connection test failed:', error);
        return {
            success: false,
            message: `Supabase connection failed: ${error.message || 'Unknown error'}`,
            error
        };
    }
};

export type Task = {
    id: string;
    title: string;
    description: string | null;
    is_completed: boolean;
    due_date: string | null;
    priority: 'low' | 'medium' | 'high';
    created_at: string;
    user_id: string;
    // Additional fields to support TaskPage interface
    category?: 'VASCLOUD' | 'RBT' | 'IT' | 'MM';
    status?: 'to_do' | 'ongoing' | 'completed';
    is_on_track?: boolean;
    is_at_risk?: boolean;
}; 