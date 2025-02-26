import { useState, FormEvent } from 'react';
import { useTaskStore, Task } from '../utils/store';
// Remove the actual backend imports
// import { supabase, Task } from '../api/supabase';
// import { useAuth } from '../contexts/AuthContext';

// Use the Task interface from the store instead of defining it locally
// interface Task {
//     id: string;
//     title: string;
//     description?: string;
//     is_completed: boolean;
//     priority: 'low' | 'medium' | 'high';
//     due_date?: string;
//     user_id: string;
//     created_at: string;
// }

interface TaskFormProps {
    editTask?: Task;
    onClose?: () => void;
}

export const TaskForm = ({ editTask, onClose }: TaskFormProps) => {
    const { addTask, updateTask, setError } = useTaskStore();
    // Remove the actual auth context usage
    // const { user } = useAuth();
    const [title, setTitle] = useState(editTask?.title || '');
    const [description, setDescription] = useState(editTask?.description || '');
    const [dueDate, setDueDate] = useState(editTask?.due_date || '');
    const [priority, setPriority] = useState<Task['priority']>(editTask?.priority || 'medium');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Mock user check - remove actual auth context usage
        // if (!user) {
        //     setError('You must be logged in to create or edit tasks');
        //     return;
        // }

        // Mock user ID for task creation
        const mockUserId = '123456';

        try {
            const taskData = {
                title,
                description: description || null, // Ensure description is string | null, not undefined
                due_date: dueDate || null, // Ensure due_date is string | null, not undefined
                priority,
                is_completed: editTask?.is_completed || false,
                user_id: mockUserId, // Use mock user ID instead of actual user ID
            };

            // Simulate a delay for the mock database operation
            await new Promise(resolve => setTimeout(resolve, 500));

            if (editTask) {
                // Mock database update - remove actual backend call
                // const { data, error } = await supabase
                //     .from('tasks')
                //     .update(taskData)
                //     .eq('id', editTask.id)
                //     .select()
                //     .single();

                // if (error) throw error;

                // Create a mock updated task
                const updatedTask: Task = {
                    ...editTask,
                    ...taskData,
                    created_at: editTask.created_at
                };

                updateTask(updatedTask);
            } else {
                // Mock database insert - remove actual backend call
                // const { data, error } = await supabase
                //     .from('tasks')
                //     .insert([taskData])
                //     .select()
                //     .single();

                // if (error) throw error;

                // Create a mock new task
                const newTask: Task = {
                    id: Date.now().toString(), // Generate a unique ID
                    ...taskData,
                    created_at: new Date().toISOString(),
                };

                addTask(newTask);
            }

            onClose?.();
        } catch (error) {
            setError('An error occurred');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input mt-1"
                    required
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input mt-1"
                    rows={3}
                />
            </div>

            <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                    Due Date
                </label>
                <input
                    type="date"
                    id="dueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="input mt-1"
                />
            </div>

            <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                    Priority
                </label>
                <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Task['priority'])}
                    className="input mt-1"
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-secondary"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                >
                    {editTask ? 'Update' : 'Create'} Task
                </button>
            </div>
        </form>
    );
}; 