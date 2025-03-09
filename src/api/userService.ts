import { supabase } from './supabase';
import { TeamMember } from '../utils/store';

// Profile interface to match user metadata structure
export interface UserProfile {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    role: string;
    language: string;
    timezone: string;
    timeFormat: string;
    country?: string;
    phoneNumber?: string;
}

// User service object with methods for interacting with Supabase
export const userService = {
    /**
     * Get the current user's profile from Supabase
     */
    async getProfile(): Promise<UserProfile | null> {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                return null;
            }

            // Map from Supabase user metadata to our profile structure
            return {
                id: user.id,
                email: user.email || '',
                firstName: user.user_metadata.first_name || '',
                lastName: user.user_metadata.last_name || '',
                department: user.user_metadata.department || '',
                role: user.user_metadata.role || '',
                language: user.user_metadata.language || 'English (Default)',
                timezone: user.user_metadata.timezone || '',
                timeFormat: user.user_metadata.time_format || '24Hours',
                country: user.user_metadata.country || '',
                phoneNumber: user.user_metadata.phone_number || ''
            };
        } catch (error) {
            console.error('Error getting user profile:', error);
            return null;
        }
    },

    /**
     * Update the current user's profile in Supabase
     */
    async updateProfile(profile: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> {
        try {
            // Convert our profile structure to Supabase metadata format
            const metadata = {
                first_name: profile.firstName,
                last_name: profile.lastName,
                department: profile.department,
                role: profile.role,
                language: profile.language,
                timezone: profile.timezone,
                time_format: profile.timeFormat,
                country: profile.country,
                phone_number: profile.phoneNumber
            };

            const { error } = await supabase.auth.updateUser({
                data: metadata
            });

            if (error) {
                throw error;
            }

            return { success: true };
        } catch (error: any) {
            console.error('Error updating profile:', error);
            return {
                success: false,
                error: error.message || 'Failed to update profile'
            };
        }
    },

    /**
     * Update the user's password
     */
    async updatePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
        try {
            // Verify current password by attempting to sign in
            const { data: { user }, error: signInError } = await supabase.auth.getUser();

            if (signInError || !user?.email) {
                throw new Error('Authentication error');
            }

            // Update to new password
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) {
                throw error;
            }

            return { success: true };
        } catch (error: any) {
            console.error('Error updating password:', error);
            return {
                success: false,
                error: error.message || 'Failed to update password'
            };
        }
    },

    // Team members methods

    /**
     * Get all team members from Supabase for the current user
     */
    async getTeamMembers(): Promise<TeamMember[]> {
        try {
            // Get the current user
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                console.log('No authenticated user found');
                throw new Error('Not authenticated');
            }

            console.log('Current user ID:', user.id);

            // First, let's fetch ALL team members to see what's in the database
            const { data: allTeamMembers, error: allError } = await supabase
                .from('team_members')
                .select('*');

            if (allError) {
                console.error('Error fetching all team members:', allError);
            } else {
                console.log('All team members in database:', allTeamMembers);
            }

            // Now fetch only the team members for the current user
            const { data, error } = await supabase
                .from('team_members')
                .select('*')
                .eq('user_id', user.id);

            if (error) {
                console.error('Error fetching user team members:', error);
                throw error;
            }

            console.log('Team members for current user:', data);
            return data || [];
        } catch (error) {
            console.error('Error fetching team members:', error);
            return [];
        }
    },

    /**
     * Add a new team member to Supabase
     */
    async addTeamMember(member: Omit<TeamMember, 'id'>): Promise<{ success: boolean; member?: TeamMember; error?: string }> {
        try {
            // Get the user ID for association
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('Not authenticated');
            }

            // Add user_id to track who added this team member
            const memberWithMetadata = {
                ...member,
                user_id: user.id
            };

            const { data, error } = await supabase
                .from('team_members')
                .insert([memberWithMetadata])
                .select();

            if (error) {
                throw error;
            }

            return {
                success: true,
                member: data?.[0] as TeamMember
            };
        } catch (error: any) {
            console.error('Error adding team member:', error);
            return {
                success: false,
                error: error.message || 'Failed to add team member'
            };
        }
    },

    /**
     * Update an existing team member in Supabase
     */
    async updateTeamMember(member: TeamMember): Promise<{ success: boolean; error?: string }> {
        try {
            const { error } = await supabase
                .from('team_members')
                .update(member)
                .eq('id', member.id);

            if (error) {
                throw error;
            }

            return { success: true };
        } catch (error: any) {
            console.error('Error updating team member:', error);
            return {
                success: false,
                error: error.message || 'Failed to update team member'
            };
        }
    },

    /**
     * Delete a team member from Supabase
     */
    async deleteTeamMember(memberId: number): Promise<{ success: boolean; error?: string }> {
        try {
            const { error } = await supabase
                .from('team_members')
                .delete()
                .eq('id', memberId);

            if (error) {
                throw error;
            }

            return { success: true };
        } catch (error: any) {
            console.error('Error deleting team member:', error);
            return {
                success: false,
                error: error.message || 'Failed to delete team member'
            };
        }
    },

    /**
     * Delete team members without a user_id
     */
    async cleanupTeamMembers(): Promise<{ success: boolean; error?: string }> {
        try {
            // Get the current user
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('Not authenticated');
            }

            // First, let's fetch ALL team members to see what's in the database
            const { data: allTeamMembers, error: allError } = await supabase
                .from('team_members')
                .select('*');

            if (allError) {
                console.error('Error fetching all team members:', allError);
                throw allError;
            }

            console.log('All team members before cleanup:', allTeamMembers);

            // Find team members without a user_id
            const teamMembersWithoutUserId = allTeamMembers?.filter(member => !member.user_id);

            if (teamMembersWithoutUserId && teamMembersWithoutUserId.length > 0) {
                console.log('Team members without user_id:', teamMembersWithoutUserId);

                // Delete team members without a user_id
                const { error } = await supabase
                    .from('team_members')
                    .delete()
                    .is('user_id', null);

                if (error) {
                    console.error('Error deleting team members without user_id:', error);
                    throw error;
                }

                console.log('Deleted team members without user_id');
            } else {
                console.log('No team members without user_id found');
            }

            return { success: true };
        } catch (error: any) {
            console.error('Error cleaning up team members:', error);
            return {
                success: false,
                error: error.message || 'Failed to clean up team members'
            };
        }
    },

    /**
     * Delete all team members (for testing purposes)
     */
    async deleteAllTeamMembers(): Promise<{ success: boolean; error?: string }> {
        try {
            // Get the current user
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('Not authenticated');
            }

            // Delete all team members for the current user
            const { error } = await supabase
                .from('team_members')
                .delete()
                .eq('user_id', user.id);

            if (error) {
                console.error('Error deleting all team members:', error);
                throw error;
            }

            console.log('Deleted all team members for current user');

            return { success: true };
        } catch (error: any) {
            console.error('Error deleting all team members:', error);
            return {
                success: false,
                error: error.message || 'Failed to delete all team members'
            };
        }
    }
}; 