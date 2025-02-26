import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';

// Task status types
type TaskStatus = 'to_do' | 'ongoing' | 'completed';
type TaskCategory = 'VASCLOUD' | 'RBT' | 'IT' | 'MM';

interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    category: TaskCategory;
    start_date: string;
    end_date: string;
    is_on_track: boolean;
    is_at_risk: boolean;
    is_completed: boolean;
}

// Mock data for tasks
const MOCK_TASKS: Task[] = [
    {
        id: 1,
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
        id: 2,
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
        id: 3,
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
        id: 4,
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

    if (!isOpen) return null;

    const handleSubmit = () => {
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
                    <input
                        type="text"
                        placeholder="Creating Awesome Mobile Apps |"
                        className="w-full text-xl font-bold border-none focus:outline-none focus:ring-0"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                    <div className="relative">
                        <select
                            className="w-full p-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={project}
                            onChange={(e) => setProject(e.target.value as TaskCategory)}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Task Type</label>
                    <div className="relative">
                        <select
                            className="w-full p-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as TaskStatus)}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">About Task</label>
                    <textarea
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                        placeholder="Tell us, how this tasks going"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                <div className="mb-4">
                    <div className="flex space-x-2">
                        <button
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="21/02/2025"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center px-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="21/02/2025"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center px-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
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
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        {mode === 'create' ? 'Create New Task' : 'Save'}
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
                    <div className="text-sm font-medium">{task.start_date}</div>
                </div>
                <div>
                    <div className="text-xs text-gray-500">End:</div>
                    <div className="text-sm font-medium">{task.end_date}</div>
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

export const TaskPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('Deadline');
    const [isExporting, setIsExporting] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
    const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
    const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);

    // New state for delete confirmation modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

    // New state for move task modal
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    const [taskToMove, setTaskToMove] = useState<Task | null>(null);

    // Filter tasks by status
    const todoTasks = tasks.filter(task => task.status === 'to_do');
    const ongoingTasks = tasks.filter(task => task.status === 'ongoing');
    const completedTasks = tasks.filter(task => task.status === 'completed');

    // Check if there are any tasks
    const hasTasks = tasks.length > 0;

    const handleAddTask = (status: TaskStatus) => {
        setFormMode('create');
        setCurrentTask(undefined);
        // If status is provided, set the initial status for the new task
        if (status) {
            setCurrentTask({
                ...currentTask,
                status: status,
                is_completed: status === 'completed'
            } as Task);
        }
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

    const confirmDeleteTask = () => {
        if (taskToDelete) {
            const updatedTasks = tasks.filter(task => task.id !== taskToDelete.id);
            setTasks(updatedTasks);
            setIsDeleteModalOpen(false);
            setTaskToDelete(null);
        }
    };

    const confirmMoveTask = (newStatus: TaskStatus) => {
        if (taskToMove) {
            const updatedTasks = tasks.map(task =>
                task.id === taskToMove.id
                    ? {
                        ...task,
                        status: newStatus,
                        // Update completion status if moved to completed
                        is_completed: newStatus === 'completed'
                    }
                    : task
            );
            setTasks(updatedTasks);
            setIsMoveModalOpen(false);
            setTaskToMove(null);
        }
    };

    const handleSaveTask = (taskData: Partial<Task>) => {
        if (formMode === 'create') {
            // Create new task
            const newTask: Task = {
                id: Math.max(0, ...tasks.map(t => t.id)) + 1,
                title: taskData.title || 'New Task',
                description: taskData.description || '',
                status: taskData.status || 'to_do',
                category: taskData.category || 'VASCLOUD',
                start_date: taskData.start_date || new Date().toLocaleDateString(),
                end_date: taskData.end_date || new Date().toLocaleDateString(),
                is_on_track: taskData.is_on_track || false,
                is_at_risk: taskData.is_at_risk || false,
                is_completed: taskData.is_completed || false
            };
            setTasks([...tasks, newTask]);
        } else {
            // Update existing task
            if (currentTask) {
                const updatedTasks = tasks.map(task =>
                    task.id === currentTask.id
                        ? { ...task, ...taskData }
                        : task
                );
                setTasks(updatedTasks);
            }
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                <div className="p-8 h-full overflow-y-auto custom-scrollbar">
                    {/* Header with user profile and notification */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold">Explore Task</h1>
                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 bg-white rounded-full shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>
                            <img
                                src="https://randomuser.me/api/portraits/men/44.jpg"
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
                                        onClick={() => setIsExporting(!isExporting)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        Export
                                    </button>

                                    <button
                                        className="flex items-center px-6 py-2 bg-indigo-600 rounded-lg text-white"
                                        onClick={() => setIsSending(!isSending)}
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
            <TaskFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                mode={formMode}
                task={currentTask}
                onSave={handleSaveTask}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDeleteTask}
                taskTitle={taskToDelete?.title || ''}
            />

            {/* Move Task Modal */}
            <MoveTaskModal
                isOpen={isMoveModalOpen}
                onClose={() => setIsMoveModalOpen(false)}
                onMove={confirmMoveTask}
                currentStatus={taskToMove?.status || 'to_do'}
                taskTitle={taskToMove?.title || ''}
            />
        </div>
    );
}; 