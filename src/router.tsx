import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import App from './App';
import { useAuth, AuthProvider } from './contexts/AuthContext';
import { Dashboard } from './pages/Dashboard';
import { TaskPage } from './pages/TaskPage';
import { Login, Signup, ForgotPassword, ResetPassword } from './pages/auth';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

// Protected route wrapper component
const ProtectedRoute = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

// Public route wrapper component (redirects to dashboard if already logged in)
const PublicRoute = () => {
    const { user } = useAuth();

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

// Root layout that provides the auth context
const RootLayout = () => {
    return (
        <AuthProvider>
            <App />
        </AuthProvider>
    );
};

// Export the router as expected by main.tsx
export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                path: '/',
                element: <Navigate to="/dashboard" replace />
            },
            // Protected routes
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: '/dashboard',
                        element: <Dashboard />
                    },
                    {
                        path: '/tasks',
                        element: <TaskPage />
                    },
                    {
                        path: '/analytics',
                        element: <AnalyticsPage />
                    },
                    {
                        path: '/settings',
                        element: <SettingsPage />
                    }
                ]
            },
            // Public routes
            {
                element: <PublicRoute />,
                children: [
                    {
                        path: '/login',
                        element: <Login />
                    },
                    {
                        path: '/signup',
                        element: <Signup />
                    },
                    {
                        path: '/forgot-password',
                        element: <ForgotPassword />
                    },
                    {
                        path: '/reset-password',
                        element: <ResetPassword />
                    }
                ]
            }
        ]
    }
]); 