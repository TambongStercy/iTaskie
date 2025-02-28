import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import jsPDF from 'jspdf';
import autoTableLib from 'jspdf-autotable';
import { useTeamMemberStore, TeamMember } from '../utils/store';
import emailjs from '@emailjs/browser';
import { supabase, testSupabaseConnection, isSupabaseConfigured } from '../api/supabase';
import { useAuth } from '../contexts/AuthContext';
import { SupabaseSetupModal } from '../components/SupabaseSetupModal';
import { sendPdfReport } from '../api/email';

// Add type for the autoTable function that works with jsPDF
type AutoTableFunction = (doc: jsPDF, options: AutoTableOptions) => void;
const autoTable = autoTableLib as unknown as AutoTableFunction;

// For types only
interface AutoTableColumnStyles {
    [key: string]: {
        cellWidth?: number;
        halign?: 'left' | 'center' | 'right';
        valign?: 'top' | 'middle' | 'bottom';
        fillColor?: number[];
        textColor?: number[];
        fontStyle?: 'normal' | 'bold' | 'italic';
    };
}

interface AutoTableOptions {
    head: string[][];
    body: (string | number)[][];
    startY?: number;
    styles?: {
        fontSize?: number;
        font?: string;
        fontStyle?: string;
        overflow?: string;
        cellPadding?: number;
    };
    columnStyles?: AutoTableColumnStyles;
    headStyles?: {
        fillColor?: number[];
        textColor?: number | number[];
        fontStyle?: string;
    };
    alternateRowStyles?: {
        fillColor?: number[];
    };
    margin?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
}

// Task status types
type TaskStatus = 'to_do' | 'ongoing' | 'completed';
type TaskCategory = 'VASCLOUD' | 'RBT' | 'IT' | 'MM';

interface Task {
    id: string;  // Changed from number to string to match Supabase
    title: string;
    description: string;
    status: TaskStatus;
    category: TaskCategory;
    start_date: string;
    end_date: string;
    is_on_track: boolean;
    is_at_risk: boolean;
    is_completed: boolean;
    user_id?: string;  // Added to match Supabase
    created_at?: string; // Added to match Supabase
    priority?: 'low' | 'medium' | 'high'; // Added to match Supabase
}

// Local mock tasks as fallback
const MOCK_TASKS: Task[] = [
    {
        id: '1',
        title: 'Auditing information architecture',
        description: 'Create a design system for a hero section in 2 different variants. Create a simple presentation with these components. Create a simple presentation with these components. Need to arrange the information in a graph',
        status: 'to_do',
        category: 'VASCLOUD',
        start_date: 'Aug 20, 2025',
        end_date: 'Aug 25, 2025',
        is_on_track: true,
        is_at_risk: false,
        is_completed: false
    },
    {
        id: '2',
        title: 'Troubleshooting Revenue decrease',
        description: 'Revenue decrease with the TAC by checking the commands. We found from the commands we queried and the error codes where coming from the charging from their side. Need to contact customer to check this issue',
        status: 'ongoing',
        category: 'RBT',
        start_date: 'Aug 20, 2025',
        end_date: 'Aug 25, 2025',
        is_on_track: true,
        is_at_risk: false,
        is_completed: false
    },
    {
        id: '3',
        title: 'Auditing information architecture',
        description: 'Create a design system for a hero section in 2 different variants. Create a simple presentation with these components. Create a simple presentation with these components. Need to arrange the information in a graph',
        status: 'completed',
        category: 'VASCLOUD',
        start_date: 'Aug 20, 2025',
        end_date: 'Aug 25, 2025',
        is_on_track: false,
        is_at_risk: false,
        is_completed: true
    },
    {
        id: '4',
        title: 'Changing Faulty Disk on Dorado DC2',
        description: 'After getting the requested spare part from the SPM, we went to customer site to change the faulty disk on RBT Storage Dorado DC2. Change was successfull. Disk is now working normally.',
        status: 'ongoing',
        category: 'IT',
        start_date: 'Aug 20, 2025',
        end_date: 'Aug 21, 2025',
        is_on_track: false,
        is_at_risk: true,
        is_completed: false
    }
];

// Delete Confirmation Modal Component
const DeleteConfirmationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    taskTitle: string;
}> = ({ isOpen, onClose, onConfirm, taskTitle }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Delete Task</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-gray-600">
                        Are you sure you want to delete the task <span className="font-semibold">"{taskTitle}"</span>? This action cannot be undone.
                    </p>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

// Move Task Modal Component
const MoveTaskModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onMove: (newStatus: TaskStatus) => void;
    currentStatus: TaskStatus;
    taskTitle: string;
}> = ({ isOpen, onClose, onMove, currentStatus, taskTitle }) => {
    const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(currentStatus);

    if (!isOpen) return null;

    const handleMove = () => {
        onMove(selectedStatus);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Move Task</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-gray-600 mb-4">
                        Move <span className="font-semibold">"{taskTitle}"</span> to:
                    </p>

                    <div className="space-y-3">
                        <div
                            className={`flex items-center p-3 rounded-lg cursor-pointer border ${selectedStatus === 'to_do'
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200 hover:bg-gray-50'
                                }`}
                            onClick={() => setSelectedStatus('to_do')}
                        >
                            <div className={`w-4 h-4 rounded-full mr-3 ${selectedStatus === 'to_do' ? 'bg-indigo-500' : 'border border-gray-300'
                                }`}></div>
                            <span className="font-medium">To Do</span>
                        </div>

                        <div
                            className={`flex items-center p-3 rounded-lg cursor-pointer border ${selectedStatus === 'ongoing'
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200 hover:bg-gray-50'
                                }`}
                            onClick={() => setSelectedStatus('ongoing')}
                        >
                            <div className={`w-4 h-4 rounded-full mr-3 ${selectedStatus === 'ongoing' ? 'bg-indigo-500' : 'border border-gray-300'
                                }`}></div>
                            <span className="font-medium">Ongoing</span>
                        </div>

                        <div
                            className={`flex items-center p-3 rounded-lg cursor-pointer border ${selectedStatus === 'completed'
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200 hover:bg-gray-50'
                                }`}
                            onClick={() => setSelectedStatus('completed')}
                        >
                            <div className={`w-4 h-4 rounded-full mr-3 ${selectedStatus === 'completed' ? 'bg-indigo-500' : 'border border-gray-300'
                                }`}></div>
                            <span className="font-medium">Completed</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleMove}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Move
                    </button>
                </div>
            </div>
        </div>
    );
};

// Task Form Modal Component
const TaskFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
    task?: Task;
    onSave: (task: Partial<Task>) => void;
}> = ({ isOpen, onClose, mode, task, onSave }) => {
    const [title, setTitle] = useState(task?.title || '');
    const [project, setProject] = useState<TaskCategory>(task?.category || 'VASCLOUD');
    const [status, setStatus] = useState<TaskStatus>(task?.status || 'to_do');
    const [description, setDescription] = useState(task?.description || '');
    const [startDate, setStartDate] = useState(task?.start_date || '');
    const [endDate, setEndDate] = useState(task?.end_date || '');
    const [trackStatus, setTrackStatus] = useState(
        task?.is_completed ? 'completed' :
            task?.is_at_risk ? 'at_risk' :
                task?.is_on_track ? 'on_track' : 'off_track'
    );
    const [titleError, setTitleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');

    // Format date for date input (YYYY-MM-DD format required by HTML date inputs)
    const formatDateForInput = (dateString: string) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '';

            return date.toISOString().split('T')[0];
        } catch (error) {
            return '';
        }
    };

    // Update states when task prop changes
    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setProject(task.category);
            setStatus(task.status);
            setDescription(task.description);
            setStartDate(formatDateForInput(task.start_date));
            setEndDate(formatDateForInput(task.end_date));
            setTrackStatus(
                task.is_completed ? 'completed' :
                    task.is_at_risk ? 'at_risk' :
                        task.is_on_track ? 'on_track' : 'off_track'
            );
        }
    }, [task]);

    if (!isOpen) return null;

    const validateForm = () => {
        let isValid = true;

        // Validate title
        if (!title.trim()) {
            setTitleError('Title is required');
            isValid = false;
        } else {
            setTitleError('');
        }

        // Validate description
        if (!description.trim()) {
            setDescriptionError('Description is required');
            isValid = false;
        } else {
            setDescriptionError('');
        }

        return isValid;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        const updatedTask: Partial<Task> = {
            title,
            category: project,
            status: status,
            description,
            start_date: startDate,
            end_date: endDate,
            is_on_track: trackStatus === 'on_track',
            is_at_risk: trackStatus === 'at_risk',
            is_completed: trackStatus === 'completed'
        };

        onSave(updatedTask);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">
                        {mode === 'create' ? 'Create New Task' : 'Edit Task'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Task Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter task title"
                        className={`w-full p-3 text-lg font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${titleError ? 'border-red-500 bg-red-50' : ''}`}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    {titleError && <p className="mt-1 text-sm text-red-500">{titleError}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            className="w-full p-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={project}
                            onChange={(e) => setProject(e.target.value as TaskCategory)}
                            required
                        >
                            <option value="VASCLOUD">VASCLOUD(Default)</option>
                            <option value="RBT">RBT</option>
                            <option value="IT">IT</option>
                            <option value="MM">MM</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Task Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            className="w-full p-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as TaskStatus)}
                            required
                        >
                            <option value="to_do">To-Do</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        About Task <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        className={`w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] ${descriptionError ? 'border-red-500 bg-red-50' : ''}`}
                        placeholder="Tell us, how this tasks going"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                    {descriptionError && <p className="mt-1 text-sm text-red-500">{descriptionError}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Task Status <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-2">
                        <button
                            type="button"
                            className={`px-3 py-1 rounded-full flex items-center ${trackStatus === 'on_track'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-700'
                                }`}
                            onClick={() => setTrackStatus('on_track')}
                        >
                            <div className={`w-2 h-2 ${trackStatus === 'on_track' ? 'bg-white' : 'bg-green-500'} rounded-full mr-1`}></div>
                            On Track
                        </button>
                        <button
                            type="button"
                            className={`px-3 py-1 rounded-full flex items-center ${trackStatus === 'at_risk'
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-100 text-gray-700'
                                }`}
                            onClick={() => setTrackStatus('at_risk')}
                        >
                            <div className={`w-2 h-2 ${trackStatus === 'at_risk' ? 'bg-white' : 'bg-orange-500'} rounded-full mr-1`}></div>
                            At Risk
                        </button>
                        <button
                            type="button"
                            className={`px-3 py-1 rounded-full flex items-center ${trackStatus === 'off_track'
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-100 text-gray-700'
                                }`}
                            onClick={() => setTrackStatus('off_track')}
                        >
                            <div className={`w-2 h-2 ${trackStatus === 'off_track' ? 'bg-white' : 'bg-red-500'} rounded-full mr-1`}></div>
                            Off Track
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        {mode === 'create' ? 'Create Task' : 'Update Task'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Task options popup component
const TaskOptionsPopup: React.FC<{
    onClose: () => void,
    onEdit: () => void,
    onMove: () => void,
    onDelete: () => void
}> = ({ onClose, onEdit, onMove, onDelete }) => {
    return (
        <div className="absolute right-0 top-8 bg-white rounded-xl shadow-lg p-2 w-40 z-10">
            <button
                onClick={onEdit}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
            </button>
            <button
                onClick={onMove}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Move
            </button>
            <button
                onClick={onDelete}
                className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
            </button>
        </div>
    );
};

// Component for task card
const TaskCard: React.FC<{
    task: Task,
    onEdit: (task: Task) => void,
    onMove: (task: Task) => void,
    onDelete: (task: Task) => void
}> = ({ task, onEdit, onMove, onDelete }) => {
    const [showOptions, setShowOptions] = useState(false);

    // Format date helper function
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString; // Return original if invalid

            // Format as DD/MM/YYYY
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        } catch (error) {
            return dateString; // Return original on error
        }
    };

    const getCategoryBadge = (category: TaskCategory) => {
        switch (category) {
            case 'VASCLOUD':
                return (
                    <div className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full">
                        VASCLOUD
                    </div>
                );
            case 'RBT':
                return (
                    <div className="bg-purple-100 text-purple-600 text-xs px-3 py-1 rounded-full">
                        RBT
                    </div>
                );
            case 'IT':
                return (
                    <div className="bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full">
                        IT
                    </div>
                );
            case 'MM':
                return (
                    <div className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full">
                        MM
                    </div>
                );
            default:
                return null;
        }
    };

    const getStatusBadge = () => {
        if (task.is_completed) {
            return (
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">Completed</span>
                </div>
            );
        } else if (task.is_at_risk) {
            return (
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">At Risk</span>
                </div>
            );
        } else if (task.is_on_track) {
            return (
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">On Track</span>
                </div>
            );
        } else {
            return (
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">Off Track</span>
                </div>
            );
        }
    };

    const handleEdit = () => {
        onEdit(task);
        setShowOptions(false);
    };

    const handleMove = () => {
        onMove(task);
        setShowOptions(false);
    };

    const handleDelete = () => {
        onDelete(task);
        setShowOptions(false);
    };

    return (
        <div className="bg-white rounded-xl p-5 shadow-sm mb-4">
            <div className="flex justify-between items-start mb-4">
                {getCategoryBadge(task.category)}
                <div className="relative">
                    <button
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => setShowOptions(!showOptions)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                    {showOptions && (
                        <TaskOptionsPopup
                            onClose={() => setShowOptions(false)}
                            onEdit={handleEdit}
                            onMove={handleMove}
                            onDelete={handleDelete}
                        />
                    )}
                </div>
            </div>
            <h3 className="text-lg font-bold mb-2">{task.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{task.description}</p>

            <div className="flex justify-between items-center mb-4">
                <div>
                    <div className="text-xs text-gray-500">Start:</div>
                    <div className="text-sm font-medium">{formatDate(task.start_date)}</div>
                </div>
                <div>
                    <div className="text-xs text-gray-500">End:</div>
                    <div className="text-sm font-medium">{formatDate(task.end_date)}</div>
                </div>
            </div>

            <div className="flex justify-between items-center">
                {getStatusBadge()}

                {task.status !== 'completed' && (
                    <button className="flex items-center text-sm text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Mark as Completed
                    </button>
                )}
            </div>
        </div>
    );
};

// Column component
const TaskColumn: React.FC<{
    title: string;
    tasks: Task[];
    onAddTask?: () => void;
    onEditTask: (task: Task) => void;
    onMoveTask: (task: Task) => void;
    onDeleteTask: (task: Task) => void;
}> = ({ title, tasks, onAddTask, onEditTask, onMoveTask, onDeleteTask }) => {
    return (
        <div className="bg-gray-50 rounded-xl p-4 w-1/3">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">{title}</h2>
                {onAddTask && (
                    <button
                        onClick={onAddTask}
                        className="bg-indigo-100 text-indigo-600 rounded-full w-6 h-6 flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                )}
            </div>
            <div className="space-y-4">
                {tasks.map(task => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={onEditTask}
                        onMove={onMoveTask}
                        onDelete={onDeleteTask}
                    />
                ))}
            </div>
        </div>
    );
};

// Empty State Component
const EmptyState: React.FC<{ onCreateTask: () => void }> = ({ onCreateTask }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full py-20">
            <img
                src="/no-task.svg"
                alt="No tasks found"
                className="w-64 h-64 mb-8"
            />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Tasks found</h2>
            <p className="text-gray-500 mb-8">Create a task to organize your projects</p>
            <button
                onClick={onCreateTask}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Create a Task
            </button>
        </div>
    );
};

// Loading Modal Component
const LoadingModal: React.FC<{
    isOpen: boolean;
    message: string;
}> = ({ isOpen, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-gray-700 text-center font-medium">{message}</p>
            </div>
        </div>
    );
};

// Export Modal Component
const ExportModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    tasks: Task[];
}> = ({ isOpen, onClose, tasks }) => {
    const [selectedStatus, setSelectedStatus] = useState<'all' | 'to_do' | 'ongoing' | 'completed'>('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Preparing your report...');

    if (!isOpen) return null;

    // Helper function to verify jspdf-autotable is properly loaded
    const verifyJsPdfAutoTable = (): boolean => {
        try {
            // Create a new document
            const doc = new jsPDF();

            // Try to use autoTable with our typed function
            autoTable(doc, {
                head: [['Test']],
                body: [['Data']]
            });

            console.info('Successfully created a test autoTable');
            return true;
        } catch (error) {
            console.error('Error verifying jspdf-autotable:', error);
            return false;
        }
    };

    const handleExport = () => {
        // First verify that jspdf-autotable is properly loaded
        if (!verifyJsPdfAutoTable()) {
            setLoadingMessage('Error: PDF generation library not properly loaded. Please try refreshing the page.');
            setIsGenerating(true);
            setTimeout(() => {
                setIsGenerating(false);
            }, 3000); // Show error message for 3 seconds
            return;
        }

        // Continue with export logic
        let filteredTasks = [...tasks];

        // Filter by status
        if (selectedStatus !== 'all') {
            filteredTasks = filteredTasks.filter(task => task.status === selectedStatus);
        }

        // Filter by date range if dates are provided
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            filteredTasks = filteredTasks.filter(task => {
                const taskStartDate = new Date(task.start_date);
                const taskEndDate = new Date(task.end_date);

                // Include task if its date range overlaps with the selected date range
                return (
                    (taskStartDate >= start && taskStartDate <= end) || // Task starts within range
                    (taskEndDate >= start && taskEndDate <= end) || // Task ends within range
                    (taskStartDate <= start && taskEndDate >= end) // Task spans the entire range
                );
            });
        }

        // Show loading modal
        setLoadingMessage('Preparing your report...');
        setIsGenerating(true);

        // Use setTimeout to allow the loading modal to render before generating the PDF
        setTimeout(() => {
            try {
                // Update loading message
                setLoadingMessage('Generating PDF...');

                // Generate PDF using jsPDF and jspdf-autotable
                generatePDF(filteredTasks);

                // Update loading message to indicate download
                setLoadingMessage('Your download will begin shortly...');

                // Allow time for the browser to process the download
                setTimeout(() => {
                    // Hide loading modal and close the export modal
                    setIsGenerating(false);
                    onClose();
                }, 1500);
            } catch (error) {
                console.error('Error generating PDF:', error);
                // Display more detailed error information
                const errorMessage = error instanceof Error
                    ? `Error: ${error.message}`
                    : 'Unknown error occurred';
                setLoadingMessage(`Failed to generate PDF. ${errorMessage}. Please try again.`);

                setTimeout(() => {
                    setIsGenerating(false);
                }, 3000);
            }
        }, 100);
    };

    const generatePDF = (filteredTasks: Task[]) => {
        try {
            // Initialize jsPDF with portrait orientation
            const doc = new jsPDF();

            // Set document properties
            doc.setProperties({
                title: 'Taskie Task Report',
                subject: 'Task List',
                author: 'Taskie App',
                keywords: 'tasks, report, pdf',
                creator: 'Taskie App'
            });

            // Add title
            doc.setFontSize(20);
            doc.text('Taskie Task Report', 14, 22);

            // Add date
            doc.setFontSize(10);
            const today = new Date().toLocaleDateString();
            doc.text(`Generated on: ${today}`, 14, 30);

            // Add filter information
            doc.setFontSize(12);
            let yPos = 40;

            doc.text(`Status filter: ${selectedStatus === 'all' ? 'All Tasks' :
                selectedStatus === 'to_do' ? 'To Do' :
                    selectedStatus === 'ongoing' ? 'Ongoing' : 'Completed'}`, 14, yPos);
            yPos += 7;

            if (startDate && endDate) {
                doc.text(`Date range: ${startDate} to ${endDate}`, 14, yPos);
                yPos += 7;
            }

            // Add total count
            doc.text(`Total tasks: ${filteredTasks.length}`, 14, yPos);
            yPos += 10;

            // Prepare table data
            const tableColumn = [['Title', 'Category', 'Status', 'Start Date', 'End Date']];
            const tableRows = filteredTasks.map(task => [
                task.title,
                task.category,
                task.status === 'to_do' ? 'To Do' :
                    task.status === 'ongoing' ? 'Ongoing' : 'Completed',
                task.start_date,
                task.end_date
            ]);

            // Generate the table using our properly typed autoTable function
            autoTable(doc, {
                head: tableColumn,
                body: tableRows,
                startY: yPos,
                styles: {
                    fontSize: 10,
                    cellPadding: 3,
                    overflow: 'linebreak'
                },
                headStyles: {
                    fillColor: [63, 81, 181],
                    textColor: 255,
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [240, 240, 240]
                },
                margin: { top: 20 }
            });

            // Add page number to each page
            const pageCount = doc.internal.pages.length - 1; // -1 because jsPDF uses 1-based indexing with an empty first page
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                addPageNumber(i);
            }

            // Function to add page number
            function addPageNumber(pageNumber: number) {
                doc.setFontSize(10);
                doc.text(`Page ${pageNumber} of ${pageCount}`, 14, doc.internal.pageSize.height - 10);
            }

            // Save the PDF with a name
            try {
                doc.save('taskie_task_report.pdf');
            } catch (saveError) {
                console.error('Error saving PDF:', saveError);
                setLoadingMessage('Error saving PDF. Please try again.');
                setTimeout(() => setIsGenerating(false), 2000);
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            setLoadingMessage(`Error generating PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setTimeout(() => setIsGenerating(false), 3000);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                <div className="relative mx-auto p-8 bg-white w-96 rounded-md shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Export Tasks</h2>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Task Status
                        </label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value as any)}
                        >
                            <option value="all">All Tasks</option>
                            <option value="to_do">To Do</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date Range (Optional)
                        </label>
                        <div className="flex space-x-2">
                            <div className="w-1/2">
                                <label className="block text-xs text-gray-500 mb-1">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="block text-xs text-gray-500 mb-1">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate} // Can't select end date before start date
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleExport}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            disabled={Boolean(endDate) && startDate > endDate}
                        >
                            Export PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading Modal */}
            <LoadingModal
                isOpen={isGenerating}
                message={loadingMessage}
            />
        </>
    );
};

// New component for sending reports to team members
interface SendReportModalProps {
    onClose: () => void;
    tasks: Task[];
}

// Fixing function signature to match FC type
const SendReportModal: React.FC<SendReportModalProps> = ({ onClose, tasks }) => {
    const { teamMembers } = useTeamMemberStore();
    const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<'all' | 'to_do' | 'ongoing' | 'completed'>('all');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    // Find mentors for easy selection
    const mentors = teamMembers.filter(member => member.role.includes('Mentor'));

    // Helper function to verify jspdf-autotable is properly loaded
    const verifyJsPdfAutoTable = (): boolean => {
        try {
            // Create a new document
            const doc = new jsPDF();

            // Try to use autoTable with our typed function
            autoTable(doc, {
                head: [['Test']],
                body: [['Data']]
            });

            console.info('Successfully created a test autoTable');
            return true;
        } catch (error) {
            console.error('Error verifying jspdf-autotable:', error);
            return false;
        }
    };

    const handleSend = async () => {
        // First verify that jspdf-autotable is properly loaded
        if (!verifyJsPdfAutoTable()) {
            setLoadingMessage('Error: PDF generation library not properly loaded. Please try refreshing the page.');
            setIsGenerating(true);
            setTimeout(() => {
                setIsGenerating(false);
            }, 3000); // Show error message for 3 seconds
            return;
        }

        // Verify that a team member was selected
        if (!selectedMemberId) {
            setLoadingMessage('Please select a team member to send the report to.');
            setIsGenerating(true);
            setTimeout(() => {
                setIsGenerating(false);
            }, 3000); // Show error message for 3 seconds
            return;
        }

        // Find the selected team member
        const recipient = teamMembers.find(member => member.id === selectedMemberId);
        if (!recipient) {
            setLoadingMessage('The selected team member was not found. Please try again.');
            setIsGenerating(true);
            setTimeout(() => {
                setIsGenerating(false);
            }, 3000);
            return;
        }

        // Continue with export logic
        let filteredTasks = [...tasks];

        // Filter by status
        if (selectedStatus !== 'all') {
            filteredTasks = filteredTasks.filter(task => task.status === selectedStatus);
        }

        // Filter by date range if dates are provided
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            filteredTasks = filteredTasks.filter(task => {
                const taskStartDate = new Date(task.start_date);
                const taskEndDate = new Date(task.end_date);

                // Include task if its date range overlaps with the selected date range
                return (
                    (taskStartDate >= start && taskStartDate <= end) || // Task starts within range
                    (taskEndDate >= start && taskEndDate <= end) || // Task ends within range
                    (taskStartDate <= start && taskEndDate >= end) // Task spans the entire range
                );
            });
        }

        // Show loading modal
        setLoadingMessage(`Preparing report to send to ${recipient.name}...`);
        setIsGenerating(true);

        try {
            // Update loading message
            setLoadingMessage('Generating PDF...');

            // Generate PDF for email and wait for the result
            const result = await generatePDFForEmail(filteredTasks, recipient);

            if (result.success) {
                // Update loading message to indicate success
                setLoadingMessage(`Report successfully sent to ${recipient.name}!`);

                // Hide loading modal and close the modal after a delay
                setTimeout(() => {
                    setIsGenerating(false);
                    onClose();
                }, 1500);
            } else {
                // Show error message if sending failed
                setLoadingMessage(`Failed to send report: ${result.message}`);
                setTimeout(() => {
                    setIsGenerating(false);
                }, 3000);
            }
        } catch (error) {
            console.error('Error in send process:', error);
            // Display more detailed error information
            const errorMessage = error instanceof Error
                ? `Error: ${error.message}`
                : 'Unknown error occurred';
            setLoadingMessage(`Failed to send report. ${errorMessage}. Please try again.`);

            setTimeout(() => {
                setIsGenerating(false);
            }, 3000);
        }
    };

    // Function to generate PDF and send it via email
    const generatePDFForEmail = async (filteredTasks: Task[], recipient: TeamMember) => {
        try {
            // Initialize jsPDF with portrait orientation
            const doc = new jsPDF();

            // Set document properties
            doc.setProperties({
                title: 'Taskie Task Report',
                subject: 'Task List',
                author: 'Taskie App',
                keywords: 'tasks, report, pdf',
                creator: 'Taskie App'
            });

            // Add title
            doc.setFontSize(20);
            doc.text('Taskie Task Report', 14, 22);

            // Add date
            doc.setFontSize(10);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

            // Add recipient information
            doc.text(`Report for: ${recipient.name} (${recipient.email})`, 14, 38);
            doc.text(`Role: ${recipient.role}`, 14, 44);

            // Add summary
            doc.setFontSize(12);
            doc.text('Task Summary', 14, 55);
            doc.setFontSize(10);
            doc.text(`Total Tasks: ${filteredTasks.length}`, 14, 63);

            const completedTasks = filteredTasks.filter(task => task.is_completed).length;
            const pendingTasks = filteredTasks.length - completedTasks;

            doc.text(`Completed Tasks: ${completedTasks}`, 14, 69);
            doc.text(`Pending Tasks: ${pendingTasks}`, 14, 75);

            // Define table columns and data
            const tableColumn = ["Title", "Status", "Category", "Due Date"];
            const tableRows = filteredTasks.map(task => [
                task.title,
                task.status,
                task.category,
                new Date(task.end_date).toLocaleDateString()
            ]);

            // Add table to document using autoTable
            if (typeof (doc as any).autoTable === 'function') {
                const autoTable = (doc as any).autoTable as AutoTableFunction;

                autoTable(doc, {
                    head: [tableColumn],
                    body: tableRows,
                    startY: 85,
                    styles: { fontSize: 8 },
                    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
                    alternateRowStyles: { fillColor: [245, 245, 245] },
                    margin: { top: 20 }
                });
            } else {
                console.warn('AutoTable plugin is not available. Table could not be generated.');
                doc.text('Task Data (AutoTable not available):', 14, 85);
                // Simple fallback if autoTable is not available
                let y = 95;
                filteredTasks.forEach((task, i) => {
                    const status = task.is_completed ? 'Completed' : 'Pending';
                    doc.text(`${i + 1}. ${task.title} - ${status} - Due: ${new Date(task.end_date).toLocaleDateString()}`, 14, y);
                    y += 6;
                });
            }

            // Add page numbers
            const pageCount = (doc as any).internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                addPageNumber(i);
            }

            function addPageNumber(pageNumber: number) {
                doc.setFontSize(8);
                doc.text(`Page ${pageNumber} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
            }

            // Convert PDF to base64
            const pdfBase64 = doc.output('datauristring').split(',')[1];

            // Create email subject
            const subject = 'Task Report from Taskie App';


            // Send the email with PDF attachment and styled HTML
            const result = await sendPdfReport(
                recipient.email,
                recipient.name,
                recipient.role,
                subject,
                filteredTasks.length,
                completedTasks,
                pendingTasks,
                pdfBase64
            );

            return { success: true, message: 'Report sent successfully!' };
        } catch (error) {
            console.error('Error generating and sending PDF:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to send report'
            };
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                <div className="relative mx-auto p-8 bg-white w-96 rounded-md shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Send Task Report</h2>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Recipient
                        </label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={selectedMemberId || ''}
                            onChange={(e) => setSelectedMemberId(Number(e.target.value) || null)}
                        >
                            <option value="">Select a team member</option>
                            <optgroup label="Mentors">
                                {mentors.map(member => (
                                    <option key={`mentor-${member.id}`} value={member.id}>
                                        {member.name} ({member.role})
                                    </option>
                                ))}
                            </optgroup>
                            <optgroup label="Other Team Members">
                                {teamMembers
                                    .filter(member => !member.role.includes('Mentor'))
                                    .map(member => (
                                        <option key={`member-${member.id}`} value={member.id}>
                                            {member.name} ({member.role})
                                        </option>
                                    ))}
                            </optgroup>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Task Status
                        </label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value as any)}
                        >
                            <option value="all">All Tasks</option>
                            <option value="to_do">To Do</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date Range (Optional)
                        </label>
                        <div className="flex space-x-2">
                            <div className="w-1/2">
                                <label className="block text-xs text-gray-500 mb-1">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="block text-xs text-gray-500 mb-1">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate} // Can't select end date before start date
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSend}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            disabled={!selectedMemberId || (Boolean(endDate) && startDate > endDate)}
                        >
                            Send Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading Modal */}
            <LoadingModal
                isOpen={isGenerating}
                message={loadingMessage}
            />
        </>
    );
};

export const TaskPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('Deadline');
    const [isExporting, setIsExporting] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
    const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [supabaseError, setSupabaseError] = useState(false);
    const [showSetupInstructions, setShowSetupInstructions] = useState(false);
    const [usingLocalStorage, setUsingLocalStorage] = useState(false);
    const [connectionTestMessage, setConnectionTestMessage] = useState<string | null>(null);

    const { user } = useAuth();

    // New state for delete confirmation modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

    // New state for move task modal
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    const [taskToMove, setTaskToMove] = useState<Task | null>(null);

    // Check local storage for tasks
    const getLocalTasks = (): Task[] => {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            try {
                return JSON.parse(storedTasks);
            } catch (e) {
                console.error('Error parsing tasks from localStorage:', e);
            }
        }
        return MOCK_TASKS;
    };

    // Save tasks to local storage
    const saveTasksToLocalStorage = (tasksList: Task[]) => {
        localStorage.setItem('tasks', JSON.stringify(tasksList));
    };

    // Fetch tasks from Supabase on component mount
    useEffect(() => {
        if (user) {
            testConnection();
            fetchTasks();
        }
    }, [user]);

    // Test connection to Supabase
    const testConnection = async () => {
        if (!isSupabaseConfigured()) {
            setSupabaseError(true);
            setUsingLocalStorage(true);
            setShowSetupInstructions(true);
            setConnectionTestMessage("Supabase is not configured. Check your .env file.");
            return;
        }

        const result = await testSupabaseConnection();
        if (!result.success) {
            setSupabaseError(true);
            setUsingLocalStorage(true);
            setShowSetupInstructions(true);
            setConnectionTestMessage(result.message);
        }
    };

    const fetchTasks = async () => {
        if (!user) return;

        try {
            setLoading(true);

            // Check if we're already in local storage mode
            if (usingLocalStorage) {
                const localTasks = getLocalTasks();
                const userTasks = user.id ? localTasks.filter(task =>
                    !task.user_id || task.user_id === user.id
                ) : localTasks;
                setTasks(userTasks);
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
                return;
            }

            // Map Supabase data to our Task model
            const mappedTasks: Task[] = data.map(item => ({
                id: item.id,
                title: item.title,
                description: item.description || '',
                status: mapPriorityToStatus(item.priority, item.is_completed),
                category: item.category || 'VASCLOUD',
                start_date: item.created_at,
                end_date: item.due_date || '',
                is_on_track: !item.is_completed && item.priority !== 'high',
                is_at_risk: !item.is_completed && item.priority === 'high',
                is_completed: item.is_completed,
                user_id: item.user_id,
                created_at: item.created_at,
                priority: item.priority
            }));

            setTasks(mappedTasks);
            setSupabaseError(false);
        } catch (error: any) {
            console.error('Error fetching tasks:', error);

            // Set detailed error message
            setError(`Supabase error: ${error.message || 'Unknown error'}`);

            // Use localStorage as fallback
            setUsingLocalStorage(true);
            setSupabaseError(true);
            setShowSetupInstructions(true);

            // Get tasks from local storage
            const localTasks = getLocalTasks();

            // Filter to only show tasks for the current user (for multi-user systems)
            const userTasks = user.id ? localTasks.filter(task =>
                !task.user_id || task.user_id === user.id
            ) : localTasks;

            setTasks(userTasks);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to map priority and completion status to our TaskStatus
    const mapPriorityToStatus = (priority: string, isCompleted: boolean): TaskStatus => {
        if (isCompleted) return 'completed';
        return priority === 'high' ? 'ongoing' : 'to_do';
    };

    // Helper function to map our TaskStatus to Supabase priority
    const mapStatusToPriority = (status: TaskStatus): 'low' | 'medium' | 'high' => {
        switch (status) {
            case 'ongoing': return 'high';
            case 'completed': return 'medium';
            case 'to_do':
            default: return 'low';
        }
    };

    // Filter tasks by status
    const todoTasks = tasks.filter(task => task.status === 'to_do');
    const ongoingTasks = tasks.filter(task => task.status === 'ongoing');
    const completedTasks = tasks.filter(task => task.status === 'completed');

    // Check if there are any tasks
    const hasTasks = tasks.length > 0;

    const handleAddTask = (status: TaskStatus) => {
        setFormMode('create');
        setCurrentTask({
            id: '',
            title: '',
            description: '',
            status: status,
            category: 'VASCLOUD',
            start_date: new Date().toISOString().split('T')[0],
            end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            is_on_track: true,
            is_at_risk: false,
            is_completed: status === 'completed'
        });
        setIsFormOpen(true);
    };

    const handleEditTask = (task: Task) => {
        setFormMode('edit');
        setCurrentTask(task);
        setIsFormOpen(true);
    };

    const handleMoveTask = (task: Task) => {
        setTaskToMove(task);
        setIsMoveModalOpen(true);
    };

    const handleDeleteTask = (task: Task) => {
        setTaskToDelete(task);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteTask = async () => {
        if (!taskToDelete) return;

        try {
            setLoading(true);

            if (!usingLocalStorage && user) {
                // Try to delete from Supabase
                try {
                    const { error } = await supabase
                        .from('tasks')
                        .delete()
                        .eq('id', taskToDelete.id)
                        .eq('user_id', user.id);

                    if (error) throw error;
                } catch (error) {
                    console.error('Error deleting task from Supabase:', error);
                    setUsingLocalStorage(true);
                    setSupabaseError(true);
                }
            }

            // Always update local state
            const updatedTasks = tasks.filter(task => task.id !== taskToDelete.id);
            setTasks(updatedTasks);

            // If using localStorage, save the updated list
            if (usingLocalStorage) {
                saveTasksToLocalStorage(updatedTasks);
            }

            setIsDeleteModalOpen(false);
            setTaskToDelete(null);
        } catch (error) {
            console.error('Error deleting task:', error);
            setError('Failed to delete task');
        } finally {
            setLoading(false);
        }
    };

    const confirmMoveTask = async (newStatus: TaskStatus) => {
        if (!taskToMove) return;

        try {
            setLoading(true);

            // Prepare update data
            const isCompleted = newStatus === 'completed';
            const priority = mapStatusToPriority(newStatus);

            if (!usingLocalStorage && user) {
                // Try to update in Supabase
                try {
                    const { error } = await supabase
                        .from('tasks')
                        .update({
                            is_completed: isCompleted,
                            priority: priority
                        })
                        .eq('id', taskToMove.id)
                        .eq('user_id', user.id);

                    if (error) throw error;
                } catch (error) {
                    console.error('Error updating task in Supabase:', error);
                    setUsingLocalStorage(true);
                    setSupabaseError(true);
                }
            }

            // Always update local state
            const updatedTasks = tasks.map(task =>
                task.id === taskToMove.id
                    ? {
                        ...task,
                        status: newStatus,
                        is_completed: isCompleted,
                        is_on_track: !isCompleted && priority !== 'high',
                        is_at_risk: !isCompleted && priority === 'high',
                        priority: priority
                    }
                    : task
            );

            setTasks(updatedTasks);

            // If using localStorage, save the updated list
            if (usingLocalStorage) {
                saveTasksToLocalStorage(updatedTasks);
            }

            setIsMoveModalOpen(false);
            setTaskToMove(null);
        } catch (error) {
            console.error('Error moving task:', error);
            setError('Failed to update task status');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveTask = async (taskData: Partial<Task>) => {
        if (!user) return;

        try {
            setLoading(true);

            // Generate a unique ID for new tasks in localStorage mode
            const generateId = () => {
                return Date.now().toString() + Math.random().toString(36).substring(2, 9);
            };

            // Prepare data
            const supabaseData = {
                title: taskData.title,
                description: taskData.description,
                is_completed: taskData.is_completed || false,
                priority: mapStatusToPriority(taskData.status as TaskStatus),
                due_date: taskData.end_date,
                category: taskData.category,
                user_id: user.id
            };

            if (formMode === 'create') {
                // Try Supabase first if not already in localStorage mode
                if (!usingLocalStorage) {
                    try {
                        const { data, error } = await supabase
                            .from('tasks')
                            .insert([supabaseData])
                            .select();

                        if (error) throw error;

                        if (data && data.length > 0) {
                            // Map the returned Supabase data to our Task model
                            const newTask: Task = {
                                id: data[0].id,
                                title: data[0].title,
                                description: data[0].description || '',
                                status: taskData.status as TaskStatus,
                                category: data[0].category || 'VASCLOUD',
                                start_date: data[0].created_at,
                                end_date: data[0].due_date || '',
                                is_on_track: !data[0].is_completed && data[0].priority !== 'high',
                                is_at_risk: !data[0].is_completed && data[0].priority === 'high',
                                is_completed: data[0].is_completed,
                                user_id: data[0].user_id,
                                created_at: data[0].created_at
                            };

                            const updatedTasks = [...tasks, newTask];
                            setTasks(updatedTasks);
                        }
                    } catch (error) {
                        console.error('Error creating task in Supabase:', error);
                        setUsingLocalStorage(true);
                        setSupabaseError(true);
                    }
                }

                // If using localStorage or Supabase failed
                if (usingLocalStorage) {
                    // Create new task with local ID
                    const newTask: Task = {
                        id: generateId(),
                        title: taskData.title || 'New Task',
                        description: taskData.description || '',
                        status: taskData.status as TaskStatus,
                        category: taskData.category || 'VASCLOUD',
                        start_date: new Date().toISOString(),
                        end_date: taskData.end_date || new Date().toISOString(),
                        is_on_track: taskData.is_on_track || false,
                        is_at_risk: taskData.is_at_risk || false,
                        is_completed: taskData.is_completed || false,
                        user_id: user.id,
                        created_at: new Date().toISOString(),
                        priority: mapStatusToPriority(taskData.status as TaskStatus)
                    };

                    const updatedTasks = [...tasks, newTask];
                    setTasks(updatedTasks);
                    saveTasksToLocalStorage(updatedTasks);
                }
            } else {
                // Update existing task
                if (currentTask) {
                    // Try Supabase first if not already in localStorage mode
                    if (!usingLocalStorage) {
                        try {
                            const { error } = await supabase
                                .from('tasks')
                                .update(supabaseData)
                                .eq('id', currentTask.id)
                                .eq('user_id', user.id);

                            if (error) throw error;
                        } catch (error) {
                            console.error('Error updating task in Supabase:', error);
                            setUsingLocalStorage(true);
                            setSupabaseError(true);
                        }
                    }

                    // Always update local state
                    const updatedTasks = tasks.map(task =>
                        task.id === currentTask.id
                            ? {
                                ...task,
                                ...taskData,
                                is_completed: taskData.is_completed || false,
                                is_on_track: (taskData.is_on_track !== undefined) ? taskData.is_on_track : task.is_on_track,
                                is_at_risk: (taskData.is_at_risk !== undefined) ? taskData.is_at_risk : task.is_at_risk
                            }
                            : task
                    );

                    setTasks(updatedTasks);

                    // If using localStorage, save the updated list
                    if (usingLocalStorage) {
                        saveTasksToLocalStorage(updatedTasks);
                    }
                }
            }
        } catch (error) {
            console.error('Error saving task:', error);
            setError('Failed to save task');
        } finally {
            setLoading(false);
        }
    };

    // Update the "Send" button click handler to open the SendReportModal
    const handleSendClick = () => {
        setIsSending(true);
    };

    // Add loading state for initial data fetch
    if (loading && tasks.length === 0) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading tasks...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                <div className="p-8 h-full overflow-y-auto custom-scrollbar">
                    {/* Header with user profile and notification */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold">Explore Task</h1>
                            {usingLocalStorage && (
                                <div className="flex items-center text-amber-600 text-sm mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    Using local storage (Supabase not configured)
                                    <button
                                        className="ml-2 underline hover:text-amber-800"
                                        onClick={() => setShowSetupInstructions(true)}
                                    >
                                        Show setup guide
                                    </button>
                                </div>
                            )}
                            {error && (
                                <div className="text-red-600 text-sm mt-1">
                                    <span>{error}</span>
                                </div>
                            )}
                            {connectionTestMessage && (
                                <div className="text-orange-600 text-sm mt-1">
                                    <span>{connectionTestMessage}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 bg-white rounded-full shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>
                            <img
                                src="/user.svg"
                                alt="User profile"
                                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                            />
                        </div>
                    </div>

                    {hasTasks ? (
                        <>
                            {/* Search and filters */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="relative w-1/3">
                                    <input
                                        type="text"
                                        placeholder="Search Task"
                                        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center bg-white rounded-lg shadow-sm px-3 py-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                        </svg>
                                        <span className="text-sm text-gray-700 mr-2">Sort By:</span>
                                        <select
                                            className="text-sm font-medium border-none bg-transparent focus:outline-none"
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                        >
                                            <option>Deadline</option>
                                            <option>Priority</option>
                                            <option>Date Created</option>
                                        </select>
                                    </div>

                                    <button
                                        className="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm text-gray-700"
                                        onClick={() => setIsExporting(true)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        Export
                                    </button>

                                    <button
                                        className="flex items-center px-6 py-2 bg-indigo-600 rounded-lg text-white"
                                        onClick={handleSendClick}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                        Send
                                    </button>
                                </div>
                            </div>

                            {/* Task columns */}
                            <div className="flex space-x-6">
                                <TaskColumn
                                    title="To Do"
                                    tasks={todoTasks}
                                    onAddTask={() => handleAddTask('to_do')}
                                    onEditTask={handleEditTask}
                                    onMoveTask={handleMoveTask}
                                    onDeleteTask={handleDeleteTask}
                                />
                                <TaskColumn
                                    title="Ongoing"
                                    tasks={ongoingTasks}
                                    onAddTask={() => handleAddTask('ongoing')}
                                    onEditTask={handleEditTask}
                                    onMoveTask={handleMoveTask}
                                    onDeleteTask={handleDeleteTask}
                                />
                                <TaskColumn
                                    title="Completed"
                                    tasks={completedTasks}
                                    onAddTask={() => handleAddTask('completed')}
                                    onEditTask={handleEditTask}
                                    onMoveTask={handleMoveTask}
                                    onDeleteTask={handleDeleteTask}
                                />
                            </div>
                        </>
                    ) : (
                        <EmptyState onCreateTask={() => handleAddTask('to_do')} />
                    )}
                </div>
            </div>

            {/* Task Form Modal */}
            {isFormOpen && (
                <TaskFormModal
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    mode={formMode}
                    task={currentTask}
                    onSave={handleSaveTask}
                />
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDeleteTask}
                    taskTitle={taskToDelete?.title || ''}
                />
            )}

            {/* Move Task Modal */}
            {isMoveModalOpen && (
                <MoveTaskModal
                    isOpen={isMoveModalOpen}
                    onClose={() => setIsMoveModalOpen(false)}
                    onMove={confirmMoveTask}
                    currentStatus={taskToMove?.status || 'to_do'}
                    taskTitle={taskToMove?.title || ''}
                />
            )}

            {/* Export Modal */}
            {isExporting && (
                <ExportModal
                    isOpen={isExporting}
                    onClose={() => setIsExporting(false)}
                    tasks={tasks}
                />
            )}

            {/* Send Report Modal */}
            {isSending && (
                <SendReportModal
                    onClose={() => setIsSending(false)}
                    tasks={tasks}
                />
            )}

            {/* Updated Supabase Setup Modal with error message */}
            {showSetupInstructions && (
                <SupabaseSetupModal
                    onClose={() => setShowSetupInstructions(false)}
                    errorMessage={error || connectionTestMessage || undefined}
                />
            )}
        </div>
    );
}; 