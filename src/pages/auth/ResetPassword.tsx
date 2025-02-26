import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/AuthLayout';
// Remove the actual backend imports
// import { supabase } from '../../api/supabase';
// import { useAuth } from '../../contexts/AuthContext';

export const ResetPassword = () => {
    // Remove the actual auth context usage
    // const { user } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Get the email from localStorage that was set in the ForgotPassword component
        const resetEmail = localStorage.getItem('resetEmail');
        if (resetEmail) {
            setEmail(resetEmail);
        } else {
            // If no email is found, redirect to forgot password
            navigate('/forgot-password');
        }
    }, [navigate]);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            // Mock password update - remove actual backend call
            // const { error } = await supabase.auth.updateUser({
            //     password,
            // });

            // if (error) throw error;

            // Simulate a delay for the mock password update
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Create a mock user and store in localStorage
            const mockUser = {
                id: '123456',
                email,
                user_metadata: {
                    first_name: 'User',
                    last_name: 'Account'
                }
            };
            localStorage.setItem('mockUser', JSON.stringify(mockUser));

            // Clean up the reset email
            localStorage.removeItem('resetEmail');

            // Navigate to dashboard instead of login
            navigate('/');
        } catch (error) {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Reset your password</h1>
                <p className="text-gray-600">Type in your new password for {email}</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 input"
                            required
                            minLength={6}
                        />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Password must be at least 6 characters long</p>
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Re-Type New Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-10 input"
                            required
                            minLength={6}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn btn-primary py-2.5"
                >
                    {loading ? 'Updating password...' : 'Reset Password'}
                </button>

                <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="w-full btn btn-secondary py-2.5"
                >
                    Back to Login
                </button>
            </form>
        </AuthLayout>
    );
}; 