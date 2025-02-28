import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useTeamMemberStore, TeamMember } from '../utils/store';
import { useAuth } from '../contexts/AuthContext';
import { userService, UserProfile } from '../api/userService';

// Role options for team members
const ROLE_OPTIONS = [
    'Technical Director, TD',
    'Product Manager, PM',
    'Mentor',
    'Spare Part Manager, SPM',
    'Other(You can edit)'
];

// Use the store instead of local constants
// const TEAM_MEMBERS = [
//     { id: 1, name: 'Xi Jing', email: 'xijing@gmail.com', role: 'Team Leader, TL' },
//     { id: 2, name: 'Mougnutou Ghislain', email: 'mougnutoughislain@gmail.com', role: 'Product Manager, PM' },
//     { id: 3, name: 'Dogmo Tsiaze Emilienne', email: 'dogmotsiaze@gmail.com', role: 'Mentor' },
// ];

// Password criteria component
const PasswordCriteria: React.FC = () => {
    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium mb-2">Password Criteria</h3>
            <ul className="text-sm space-y-1">
                <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>at least 8 characters</span>
                </li>
                <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>one symbol, e.g #$&*</span>
                </li>
                <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>One number, e.g 1234567890</span>
                </li>
                <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>One lowercase, e.g qwertya</span>
                </li>
                <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>One Uppercase letter e.g ABRKPO</span>
                </li>
                <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Must not contain the same characters</span>
                </li>
            </ul>
        </div>
    );
};

// Team member popup component
const TeamMemberPopup: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}> = ({ isOpen, onClose, onEdit, onDelete }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
            <button
                className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-700"
                onClick={onEdit}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Member
            </button>
            <button
                className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-50 text-red-600 border-t border-gray-100"
                onClick={onDelete}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Member
            </button>
        </div>
    );
};

// Member Modal Component (for both Add and Edit)
const MemberModal: React.FC<{
    isOpen: boolean;
    mode: 'add' | 'edit';
    member?: { name: string; email: string; role: string };
    onClose: () => void;
    onSubmit: (member: { name: string; email: string; role: string }) => void;
}> = ({ isOpen, mode, member, onClose, onSubmit }) => {
    const [name, setName] = useState(member?.name || '');
    const [email, setEmail] = useState(member?.email || '');
    const [role, setRole] = useState(member?.role || ROLE_OPTIONS[0]);
    const [showRoleOptions, setShowRoleOptions] = useState(false);

    // Update state when editing a member
    React.useEffect(() => {
        if (mode === 'edit' && member) {
            setName(member.name);
            setEmail(member.email);
            setRole(member.role);
        }
    }, [mode, member]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (name && email && role) {
            onSubmit({ name, email, role });

            // Only reset form on add mode, not edit
            if (mode === 'add') {
                setName('');
                setEmail('');
                setRole(ROLE_OPTIONS[0]);
            }

            onClose();
        }
    };

    const modalTitle = mode === 'add' ? 'Add New Members' : 'Edit Member';
    const buttonText = mode === 'add' ? 'Add new member' : 'Save changes';
    const description = mode === 'add'
        ? 'These members will receive the reports you send via iTaskie'
        : 'Update the member information';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header */}
                <h2 className="text-xl font-bold mb-1">{modalTitle}</h2>
                <p className="text-gray-500 text-sm mb-6">{description}</p>

                {/* Form */}
                <div className="space-y-5">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-gray-200 rounded-lg"
                            placeholder="Xu Xin 000xxxx"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full p-3 border border-gray-200 rounded-lg"
                            placeholder="xuxin@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <div className="relative">
                            <button
                                type="button"
                                className="w-full p-3 border border-gray-200 rounded-lg text-left flex justify-between items-center"
                                onClick={() => setShowRoleOptions(!showRoleOptions)}
                            >
                                <span>{role}</span>
                                <svg className={`h-5 w-5 text-gray-400 transform ${showRoleOptions ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>

                            {showRoleOptions && (
                                <div className="absolute top-full left-0 right-0 mt-1 border border-gray-200 bg-white rounded-lg shadow-lg z-10">
                                    {ROLE_OPTIONS.map((option) => (
                                        <button
                                            key={option}
                                            type="button"
                                            className="block w-full text-left px-4 py-3 hover:bg-gray-50"
                                            onClick={() => {
                                                setRole(option);
                                                setShowRoleOptions(false);
                                            }}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-6 py-3 bg-indigo-500 text-white rounded-lg"
                            onClick={handleSubmit}
                        >
                            {buttonText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Team table component
const TeamTable: React.FC<{
    members: TeamMember[];
    onEdit: (memberId: number) => void;
    onDelete: (memberId: number) => void;
    isLoading: boolean;
}> = ({ members, onEdit, onDelete, isLoading }) => {
    const [activePopup, setActivePopup] = useState<number | null>(null);

    return (
        <div className="mt-6">
            <div className="bg-indigo-500 rounded-t-lg text-white grid grid-cols-12 p-4">
                <div className="col-span-1 font-medium">SN</div>
                <div className="col-span-3 font-medium">Name</div>
                <div className="col-span-5 font-medium">Email Address</div>
                <div className="col-span-3 font-medium">Role</div>
            </div>
            <div className="border-x border-b rounded-b-lg">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">
                        <svg className="animate-spin h-8 w-8 mx-auto mb-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading team members...
                    </div>
                ) : members.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No team members found. Add your first team member by clicking the "Add new members" button.
                    </div>
                ) : (
                    members.map((member) => (
                        <div key={`team-member-${member.id}`} className="grid grid-cols-12 p-4 border-b last:border-b-0 items-center">
                            <div className="col-span-1 text-gray-600">{member.id}</div>
                            <div className="col-span-3 text-gray-800 font-medium">{member.name}</div>
                            <div className="col-span-5 text-gray-600">{member.email}</div>
                            <div className="col-span-2 text-gray-800">{member.role}</div>
                            <div className="col-span-1 flex justify-center relative">
                                <button
                                    className="text-gray-500"
                                    onClick={() => setActivePopup(activePopup === member.id ? null : member.id)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                </button>

                                {activePopup === member.id && (
                                    <TeamMemberPopup
                                        isOpen={true}
                                        onClose={() => setActivePopup(null)}
                                        onEdit={() => onEdit(member.id)}
                                        onDelete={() => onDelete(member.id)}
                                    />
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// Settings page component
export const SettingsPage: React.FC = () => {
    // Get the auth context for signout functionality
    const { signOut } = useAuth();

    // State to track the active tab
    const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'team' | 'notifications'>('profile');

    // State for edit mode
    const [editMode, setEditMode] = useState(false);

    // State for profile data
    const [profile, setProfile] = useState<UserProfile>({
        firstName: '',
        lastName: '',
        email: '',
        department: '',
        role: '',
        language: 'English (Default)',
        timezone: '',
        timeFormat: '24Hours'
    });

    // State for loading status
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // State for password data
    const [password, setPassword] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    // State for team data
    const { teamMembers, setTeamMembers, deleteTeamMember, addTeamMember, updateTeamMember } = useTeamMemberStore();

    // State for modals and member management
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);
    const [activePopup, setActivePopup] = useState<number | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<number | null>(null);

    // Fetch user profile on component mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            setIsLoading(true);
            try {
                const userProfile = await userService.getProfile();
                if (userProfile) {
                    setProfile(userProfile);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setStatusMessage({
                    type: 'error',
                    text: 'Failed to load user profile. Please try again.'
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    // Fetch team members on component mount
    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                const members = await userService.getTeamMembers();
                if (members.length > 0) {
                    setTeamMembers(members);
                }
            } catch (error) {
                console.error('Error fetching team members:', error);
            }
        };

        if (activeTab === 'team') {
            fetchTeamMembers();
        }
    }, [activeTab, setTeamMembers]);

    // Toggle edit mode
    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    // Handle save profile changes
    const handleSave = async () => {
        setIsLoading(true);
        setStatusMessage(null);

        try {
            const result = await userService.updateProfile(profile);

            if (result.success) {
                setStatusMessage({
                    type: 'success',
                    text: 'Profile updated successfully'
                });
                setEditMode(false);
            } else {
                setStatusMessage({
                    type: 'error',
                    text: result.error || 'Failed to update profile'
                });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setStatusMessage({
                type: 'error',
                text: 'An unexpected error occurred'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle password update
    const handleUpdatePassword = async () => {
        setIsLoading(true);
        setStatusMessage(null);

        // Validate password match
        if (password.new !== password.confirm) {
            setStatusMessage({
                type: 'error',
                text: 'New passwords do not match'
            });
            setIsLoading(false);
            return;
        }

        try {
            const result = await userService.updatePassword(password.current, password.new);

            if (result.success) {
                setStatusMessage({
                    type: 'success',
                    text: 'Password updated successfully'
                });
                // Clear password fields
                setPassword({
                    current: '',
                    new: '',
                    confirm: ''
                });
            } else {
                setStatusMessage({
                    type: 'error',
                    text: result.error || 'Failed to update password'
                });
            }
        } catch (error) {
            console.error('Error updating password:', error);
            setStatusMessage({
                type: 'error',
                text: 'An unexpected error occurred'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle cancel edit
    const handleCancel = () => {
        setEditMode(false);
        // Reset any changes by refetching the profile
        userService.getProfile().then(userProfile => {
            if (userProfile) {
                setProfile(userProfile);
            }
        });
    };

    // Determine the title based on active tab and edit mode
    const getTitle = () => {
        if (activeTab === 'profile') return editMode ? 'Edit Profile' : 'Profile';
        if (activeTab === 'password') return 'Change Password';
        if (activeTab === 'team') return editMode ? 'Edit Team' : 'Team';
        return 'Notifications';
    };

    // Handle member edit
    const handleEditMember = (memberId: number) => {
        const member = teamMembers.find(m => m.id === memberId);
        if (member) {
            setCurrentMember(member);
            setModalMode('edit');
            setShowMemberModal(true);
        }
    };

    // Handle member delete
    const handleDeleteMember = (memberId: number) => {
        setMemberToDelete(memberId);
        setShowDeleteConfirm(true);
    };

    // Confirm delete member
    const confirmDeleteMember = async () => {
        if (memberToDelete !== null) {
            setIsLoading(true);
            try {
                const result = await userService.deleteTeamMember(memberToDelete);

                if (result.success) {
                    // Update local state after successful deletion
                    deleteTeamMember(memberToDelete);
                    setStatusMessage({
                        type: 'success',
                        text: 'Team member deleted successfully'
                    });
                } else {
                    setStatusMessage({
                        type: 'error',
                        text: result.error || 'Failed to delete team member'
                    });
                }
            } catch (error) {
                console.error('Error deleting team member:', error);
                setStatusMessage({
                    type: 'error',
                    text: 'An unexpected error occurred'
                });
            } finally {
                setIsLoading(false);
                setMemberToDelete(null);
                setShowDeleteConfirm(false);
            }
        }
    };

    // Handle member submit (add or update)
    const handleMemberSubmit = async (memberData: { name: string; email: string; role: string }) => {
        setIsLoading(true);
        setStatusMessage(null);

        try {
            if (modalMode === 'add') {
                // Add new member to Supabase
                const result = await userService.addTeamMember(memberData);

                if (result.success && result.member) {
                    // Update local state after successful addition
                    addTeamMember(result.member);
                    setStatusMessage({
                        type: 'success',
                        text: 'Team member added successfully'
                    });
                } else {
                    setStatusMessage({
                        type: 'error',
                        text: result.error || 'Failed to add team member'
                    });
                }
            } else if (modalMode === 'edit' && currentMember) {
                // Update existing member in Supabase
                const updatedMember: TeamMember = {
                    ...currentMember,
                    name: memberData.name,
                    email: memberData.email,
                    role: memberData.role
                };

                const result = await userService.updateTeamMember(updatedMember);

                if (result.success) {
                    // Update local state after successful update
                    updateTeamMember(updatedMember);
                    setStatusMessage({
                        type: 'success',
                        text: 'Team member updated successfully'
                    });
                } else {
                    setStatusMessage({
                        type: 'error',
                        text: result.error || 'Failed to update team member'
                    });
                }
            }
        } catch (error) {
            console.error('Error managing team member:', error);
            setStatusMessage({
                type: 'error',
                text: 'An unexpected error occurred'
            });
        } finally {
            setIsLoading(false);
            setShowMemberModal(false);
        }
    };

    // Tab content rendering
    const renderProfileTab = () => (
        <div className="space-y-6">
            {/* Name */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-indigo-600 mb-2">First name</label>
                    <input
                        type="text"
                        className="w-full p-3 border border-gray-200 rounded-lg"
                        value={profile.firstName}
                        readOnly={!editMode}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-indigo-600 mb-2">Last name</label>
                    <input
                        type="text"
                        className="w-full p-3 border border-gray-200 rounded-lg"
                        value={profile.lastName}
                        readOnly={!editMode}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    />
                </div>
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-indigo-600 mb-2">Email</label>
                <div className="flex">
                    <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </span>
                    <input
                        type="email"
                        className="w-full p-3 border border-gray-200 rounded-r-lg"
                        value={profile.email}
                        readOnly={true} // Email cannot be changed after registration
                        disabled={true}
                    />
                </div>
                {editMode && (
                    <p className="mt-1 text-xs text-gray-500">Email address cannot be changed after registration</p>
                )}
            </div>

            {/* Department */}
            <div>
                <label className="block text-sm font-medium text-indigo-600 mb-2">Department</label>
                <input
                    type="text"
                    className="w-full p-3 border border-gray-200 rounded-lg"
                    value={profile.department}
                    readOnly={!editMode}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                />
            </div>

            {/* Role */}
            <div>
                <label className="block text-sm font-medium text-indigo-600 mb-2">Role</label>
                <input
                    type="text"
                    className="w-full p-3 border border-gray-200 rounded-lg"
                    value={profile.role}
                    readOnly={!editMode}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                />
            </div>

            {/* Country (if available) */}
            {profile.country !== undefined && (
                <div>
                    <label className="block text-sm font-medium text-indigo-600 mb-2">Country</label>
                    <input
                        type="text"
                        className="w-full p-3 border border-gray-200 rounded-lg"
                        value={profile.country}
                        readOnly={!editMode}
                        onChange={(e) => setProfile({ ...profile, country: e.target.value || '' })}
                    />
                </div>
            )}

            {/* Phone Number (if available) */}
            {profile.phoneNumber !== undefined && (
                <div>
                    <label className="block text-sm font-medium text-indigo-600 mb-2">Phone Number</label>
                    <input
                        type="text"
                        className="w-full p-3 border border-gray-200 rounded-lg"
                        value={profile.phoneNumber}
                        readOnly={!editMode}
                        onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value || '' })}
                    />
                </div>
            )}

            {/* Language */}
            <div>
                <label className="block text-sm font-medium text-indigo-600 mb-2">Language</label>
                <div className="relative">
                    <select
                        className="w-full p-3 border border-gray-200 rounded-lg appearance-none"
                        value={profile.language}
                        disabled={!editMode}
                        onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                    >
                        <option>English (Default)</option>
                        <option>French</option>
                        <option>Spanish</option>
                        <option>German</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Timezone */}
            <div>
                <label className="block text-sm font-medium text-indigo-600 mb-2">Timezone</label>
                <div className="relative">
                    <select
                        className="w-full p-3 border border-gray-200 rounded-lg appearance-none"
                        value={profile.timezone}
                        disabled={!editMode}
                        onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                    >
                        <option value="">Select timezone</option>
                        <option value="GMT+1 (Douala)">GMT+1 (Douala)</option>
                        <option value="GMT+0 (London)">GMT+0 (London)</option>
                        <option value="GMT-5 (New York)">GMT-5 (New York)</option>
                        <option value="GMT-8 (Los Angeles)">GMT-8 (Los Angeles)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Time Format */}
            <div>
                <label className="block text-sm font-medium text-indigo-600 mb-2">Time Format</label>
                <div className="grid grid-cols-2 gap-4">
                    <label className={`border rounded-lg p-3 flex items-center ${profile.timeFormat === '24Hours' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
                        <input
                            type="radio"
                            className="form-radio h-5 w-5 text-indigo-600"
                            checked={profile.timeFormat === '24Hours'}
                            disabled={!editMode}
                            onChange={() => setProfile({ ...profile, timeFormat: '24Hours' })}
                        />
                        <span className="ml-2">24 Hours</span>
                    </label>
                    <label className={`border rounded-lg p-3 flex items-center ${profile.timeFormat === '12Hours' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
                        <input
                            type="radio"
                            className="form-radio h-5 w-5 text-indigo-600"
                            checked={profile.timeFormat === '12Hours'}
                            disabled={!editMode}
                            onChange={() => setProfile({ ...profile, timeFormat: '12Hours' })}
                        />
                        <span className="ml-2">12 Hours</span>
                    </label>
                </div>
            </div>
        </div>
    );

    const renderPasswordTab = () => (
        <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-6">
                {/* Previous Password */}
                <div>
                    <label className="block text-sm font-medium text-indigo-600 mb-2">Previous Password</label>
                    <div className="relative">
                        <input
                            type="password"
                            className="w-full p-3 border border-gray-200 rounded-lg pr-10"
                            value={password.current}
                            onChange={(e) => setPassword({ ...password, current: e.target.value })}
                        />
                        <button className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* New Password */}
                <div>
                    <label className="block text-sm font-medium text-indigo-600 mb-2">New Password</label>
                    <div className="relative">
                        <input
                            type="password"
                            className="w-full p-3 border border-gray-200 rounded-lg pr-10"
                            value={password.new}
                            onChange={(e) => setPassword({ ...password, new: e.target.value })}
                        />
                        <button className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Re-Type New Password */}
                <div>
                    <label className="block text-sm font-medium text-indigo-600 mb-2">Re-Type New Password</label>
                    <div className="relative">
                        <input
                            type="password"
                            className="w-full p-3 border border-gray-200 rounded-lg pr-10"
                            value={password.confirm}
                            onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                        />
                        <button className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="col-span-1">
                <PasswordCriteria />
            </div>
        </div>
    );

    const renderTeamTab = () => (
        <TeamTable
            members={teamMembers}
            onEdit={(memberId) => handleEditMember(memberId)}
            onDelete={(memberId) => handleDeleteMember(memberId)}
            isLoading={isLoading}
        />
    );

    const renderNotificationsTab = () => (
        <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-4">Email Notifications</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Weekly Report</p>
                            <p className="text-sm text-gray-500">Receive a weekly report summary of your tasks</p>
                        </div>
                        <div className="relative">
                            <label className="switch">
                                <input type="checkbox" checked={true} />
                                <span className="w-10 h-5 bg-gray-200 rounded-full transition"></span>
                            </label>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Task Assignments</p>
                            <p className="text-sm text-gray-500">Get notified when you are assigned a new task</p>
                        </div>
                        <div className="relative">
                            <label className="switch">
                                <input type="checkbox" checked={true} />
                                <span className="w-10 h-5 bg-gray-200 rounded-full transition"></span>
                            </label>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Task Due Date Reminders</p>
                            <p className="text-sm text-gray-500">Get reminders for upcoming task deadlines</p>
                        </div>
                        <div className="relative">
                            <label className="switch">
                                <input type="checkbox" checked={false} />
                                <span className="w-10 h-5 bg-gray-200 rounded-full transition"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-4">System Notifications</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Team Updates</p>
                            <p className="text-sm text-gray-500">Get notified when team members are added or removed</p>
                        </div>
                        <div className="relative">
                            <label className="switch">
                                <input type="checkbox" checked={true} />
                                <span className="w-10 h-5 bg-gray-200 rounded-full transition"></span>
                            </label>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Project Updates</p>
                            <p className="text-sm text-gray-500">Get notified when projects are added or updated</p>
                        </div>
                        <div className="relative">
                            <label className="switch">
                                <input type="checkbox" checked={false} />
                                <span className="w-10 h-5 bg-gray-200 rounded-full transition"></span>
                            </label>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">System Maintenance</p>
                            <p className="text-sm text-gray-500">Get notified about system maintenance or updates</p>
                        </div>
                        <div className="relative">
                            <label className="switch">
                                <input type="checkbox" checked={false} />
                                <span className="w-10 h-5 bg-gray-200 rounded-full transition"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                <div className="p-8 h-full overflow-y-auto custom-scrollbar">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold">Settings</h1>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={signOut}
                                className="flex items-center px-4 py-2 bg-white border border-gray-200 text-red-600 rounded-lg hover:bg-gray-50 transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Sign Out
                            </button>
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

                    {/* Status Message */}
                    {statusMessage && (
                        <div className={`mb-4 p-3 rounded-md ${statusMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {statusMessage.text}
                        </div>
                    )}

                    {/* Loading Indicator */}
                    {isLoading && (
                        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md flex items-center">
                            <svg className="animate-spin h-5 w-5 mr-3 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </div>
                    )}

                    {/* Settings Content */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        {/* Header Banner */}
                        <div className="h-72 bg-gradient-to-r from-purple-400 via-blue-500 to-teal-300"></div>

                        {/* Profile Section */}
                        <div className="px-8 pb-8 relative">
                            {/* Profile Picture - Positioned to overlap the top of the banner */}
                            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden absolute -top-11 left-8 shadow-md">
                                <img
                                    src="/user.svg"
                                    alt="Profile"
                                    className="w-full h-full object-cover bg-white"
                                />
                            </div>

                            {/* Title and Actions - Positioned to the right of the profile image */}
                            <div className="flex justify-between items-center pt-6 pb-4">
                                <div className="pl-40">
                                    <h2 className="text-2xl font-bold">{getTitle()}</h2>
                                </div>
                                <div className="space-x-4">
                                    {activeTab === 'password' ? (
                                        <button
                                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                                            onClick={handleUpdatePassword}
                                            disabled={isLoading}
                                        >
                                            Change Password
                                        </button>
                                    ) : activeTab === 'team' ? (
                                        <div className="flex space-x-4">
                                            <button
                                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg flex items-center hover:bg-indigo-700 transition"
                                                onClick={() => {
                                                    setModalMode('add');
                                                    setCurrentMember(null);
                                                    setShowMemberModal(true);
                                                }}
                                                disabled={isLoading}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                Add new members
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex space-x-4">
                                            {!editMode ? (
                                                <button
                                                    className="px-6 py-2 rounded-lg border border-transparent bg-indigo-100 text-indigo-700 font-medium hover:bg-indigo-200 transition"
                                                    onClick={toggleEditMode}
                                                    disabled={isLoading}
                                                >
                                                    Edit
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        className="px-6 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                                                        onClick={handleCancel}
                                                        disabled={isLoading}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                                                        onClick={handleSave}
                                                        disabled={isLoading}
                                                    >
                                                        Save
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Navigation Tabs */}
                            <div className="border-b mt-6 mb-6">
                                <nav className="flex space-x-8">
                                    <button
                                        className={`pb-4 px-2 ${activeTab === 'profile' ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium' : 'text-gray-500'}`}
                                        onClick={() => setActiveTab('profile')}
                                    >
                                        Profile
                                    </button>
                                    <button
                                        className={`pb-4 px-2 ${activeTab === 'password' ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium' : 'text-gray-500'}`}
                                        onClick={() => setActiveTab('password')}
                                    >
                                        Password
                                    </button>
                                    <button
                                        className={`pb-4 px-2 ${activeTab === 'team' ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium' : 'text-gray-500'}`}
                                        onClick={() => setActiveTab('team')}
                                    >
                                        Team
                                    </button>
                                    <button
                                        className={`pb-4 px-2 ${activeTab === 'notifications' ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium' : 'text-gray-500'}`}
                                        onClick={() => setActiveTab('notifications')}
                                    >
                                        Notifications
                                    </button>
                                </nav>
                            </div>

                            {/* Tab Content */}
                            <div>
                                {activeTab === 'profile' && renderProfileTab()}
                                {activeTab === 'password' && renderPasswordTab()}
                                {activeTab === 'team' && renderTeamTab()}
                                {activeTab === 'notifications' && renderNotificationsTab()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Member Modal (for Add/Edit) */}
                <MemberModal
                    isOpen={showMemberModal}
                    mode={modalMode}
                    member={currentMember || undefined}
                    onClose={() => setShowMemberModal(false)}
                    onSubmit={handleMemberSubmit}
                />

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                            <h2 className="text-xl font-bold mb-4">Delete Team Member</h2>
                            <p className="mb-6">Are you sure you want to delete this team member? This action cannot be undone.</p>

                            <div className="flex justify-end space-x-3">
                                <button
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setMemberToDelete(null);
                                    }}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                                    onClick={confirmDeleteMember}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}; 