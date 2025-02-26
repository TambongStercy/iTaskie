import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Dashboard } from './pages/Dashboard';
import { TaskPage } from './pages/TaskPage';
import { Login, Signup, ForgotPassword, ResetPassword } from './pages/auth';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
};

// Public route component (accessible only when not logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (user) {
        return <Navigate to="/dashboard" />;
    }

    return <>{children}</>;
};

// Export the router as expected by main.tsx
export const router = createBrowserRouter([
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    },
    {
        path: '/tasks',
        element: (
            <ProtectedRoute>
                <TaskPage />
            </ProtectedRoute>
        ),
    },
    {
        path: '/analytics',
        element: (
            <ProtectedRoute>
                <AnalyticsPage />
            </ProtectedRoute>
        ),
    },
    {
        path: '/settings',
        element: (
            <ProtectedRoute>
                <SettingsPage />
            </ProtectedRoute>
        ),
    },
    {
        path: '/login',
        element: (
            <PublicRoute>
                <Login />
            </PublicRoute>
        ),
    },
    {
        path: '/signup',
        element: (
            <PublicRoute>
                <Signup />
            </PublicRoute>
        ),
    },
    {
        path: '/forgot-password',
        element: (
            <PublicRoute>
                <ForgotPassword />
            </PublicRoute>
        ),
    },
    {
        path: '/reset-password',
        element: (
            <PublicRoute>
                <ResetPassword />
            </PublicRoute>
        ),
    },
    {
        path: '*',
        element: <Navigate to="/dashboard" />,
    },
]); 