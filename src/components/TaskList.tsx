import { useState } from 'react';
import { useTaskStore, Task } from '../utils/store';
// Remove the actual supabase import
// import { Task, supabase } from '../api/supabase';
import { format } from 'date-fns';
import { CheckCircleIcon, XCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { TaskForm } from './TaskForm';

// Remove local Task interface definition and use the one from store.ts
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

export const TaskList = () => {
    const { tasks, updateTask, deleteTask, setError } = useTaskStore();
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const handleToggleComplete = async (task: Task) => {
        try {
            const updatedTask = { ...task, is_completed: !task.is_completed };

            // Mock database update - remove actual backend call
            // const { error } = await supabase
            //     .from('tasks')
            //     .update(updatedTask)
            //     .eq('id', task.id);

            // Simulate a delay for the mock update
            await new Promise(resolve => setTimeout(resolve, 500));

            // if (error) throw error;
            updateTask(updatedTask);
        } catch (error) {
            setError('An error occurred');
        }
    };

    const handleDelete = async (taskId: string) => {
        try {
            // Mock database delete - remove actual backend call
            // const { error } = await supabase
            //     .from('tasks')
            //     .delete()
            //     .eq('id', taskId);

            // Simulate a delay for the mock delete
            await new Promise(resolve => setTimeout(resolve, 500));

            // if (error) throw error;
            deleteTask(taskId);
        } catch (error) {
            setError('An error occurred');
        }
    };

    const getPriorityColor = (priority: Task['priority']) => {
        switch (priority) {
            case 'high':
                return 'text-red-600';
            case 'medium':
                return 'text-yellow-600';
            default:
                return 'text-green-600';
        }
    };

    return (
        <div className="space-y-4">
            {tasks.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                    <p className="text-gray-500">No tasks yet. Create a new task to get started!</p>
                </div>
            ) : (
                tasks.map((task) => (
                    <div
                        key={task.id}
                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between"
                    >
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => handleToggleComplete(task)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                {task.is_completed ? (
                                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                ) : (
                                    <XCircleIcon className="h-6 w-6" />
                                )}
                            </button>
                            <div>
                                <h3 className={`text-lg font-medium ${task.is_completed ? 'line-through text-gray-400' : ''}`}>
                                    {task.title}
                                </h3>
                                {task.description && (
                                    <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                                )}
                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                    {task.due_date && (
                                        <span>Due: {format(new Date(task.due_date), 'MMM d, yyyy')}</span>
                                    )}
                                    <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setEditingTask(task)}
                                className="p-1 hover:bg-gray-100 rounded-full"
                            >
                                <PencilIcon className="h-5 w-5 text-gray-500" />
                            </button>
                            <button
                                onClick={() => handleDelete(task.id)}
                                className="p-1 hover:bg-gray-100 rounded-full"
                            >
                                <TrashIcon className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                    </div>
                ))
            )}

            {editingTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
                        <TaskForm
                            editTask={editingTask}
                            onClose={() => setEditingTask(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}; 