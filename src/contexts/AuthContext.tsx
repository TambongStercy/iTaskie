import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// Remove the actual supabase import
// import { supabase } from '../api/supabase';

interface AuthContextType {
    user: any;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<any>;
    signUp: (email: string, password: string, userData: any) => Promise<any>;
    signOut: () => Promise<any>;
    resetPassword: (email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock getting the user session
        const getUser = async () => {
            // Simulate a delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Check if we have a user in localStorage (for mock persistence)
            const storedUser = localStorage.getItem('mockUser');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }

            setLoading(false);
        };

        getUser();

        // No need for auth state change listener in mock implementation

        return () => {
            // No cleanup needed for mock implementation
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        // Mock sign in
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Create a mock user
        const mockUser = {
            id: '123456',
            email,
            user_metadata: {
                first_name: 'John',
                last_name: 'Doe'
            }
        };

        // Store in state and localStorage for persistence
        setUser(mockUser);
        localStorage.setItem('mockUser', JSON.stringify(mockUser));

        return { data: { user: mockUser, session: { access_token: 'mock_token' } }, error: null };
    };

    const signUp = async (email: string, password: string, userData: any) => {
        // Mock sign up
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Create a mock user with the provided metadata
        const mockUser = {
            id: '123456',
            email,
            user_metadata: userData
        };

        // In a real implementation, we wouldn't set the user here since they need to verify email

        return { data: { user: mockUser }, error: null };
    };

    const signOut = async () => {
        // Mock sign out
        await new Promise(resolve => setTimeout(resolve, 500));

        // Clear user from state and localStorage
        setUser(null);
        localStorage.removeItem('mockUser');

        return { error: null };
    };

    const resetPassword = async (email: string) => {
        // Mock reset password
        await new Promise(resolve => setTimeout(resolve, 1000));

        return { error: null };
    };

    const value = {
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 