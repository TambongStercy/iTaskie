import { useEffect } from 'react';
import { useTaskStore } from '../utils/store';
import { supabase, Task } from '../api/supabase';
import { useAuth } from '../contexts/AuthContext';

export const useTasks = () => {
    const { setTasks, setLoading, setError } = useTaskStore();
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        const fetchTasks = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('tasks')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setTasks(data as Task[]);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();

        // Subscribe to real-time changes
        const channel = supabase
            .channel('tasks_channel')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'tasks',
                    filter: `user_id=eq.${user.id}`,
                },
                async () => {
                    // Refetch tasks when changes occur
                    await fetchTasks();
                }
            )
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, [user]);

    return useTaskStore();
}; 