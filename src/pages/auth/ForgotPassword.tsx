import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/AuthLayout';
import { Logo } from '../../components/Logo';

export const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Store the email in localStorage for the reset password page
            localStorage.setItem('resetEmail', email);

            // Navigate to reset password page instead of showing success message
            navigate('/reset-password');
        } catch (error) {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <div className="mb-8">
                    <Logo />
                </div>
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm">
                    <h1 className="text-3xl font-bold text-center mb-2">Recovery Email Sent!</h1>
                    <p className="text-gray-600 text-center mb-6">
                        Please check your email for next steps to reset your password.
                    </p>
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="btn btn-primary py-2.5 px-6"
                        >
                            Back to Login
                        </button>
                    </div>
                    <div className="mt-4 text-center">
                        <button
                            type="button"
                            onClick={() => window.location.href = 'mailto:support@itaskie.com'}
                            className="text-blue-600 hover:underline text-sm"
                        >
                            Contact support
                        </button>
                    </div>
                </div>
                <div className="mt-8 text-sm text-gray-600 flex items-center space-x-2">
                    <a href="#" className="hover:underline">Terms and conditions</a>
                    <span>•</span>
                    <a href="#" className="hover:underline">Privacy policy</a>
                </div>
            </div>
        );
    }

    return (
        <AuthLayout>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Reset your password</h1>
                <p className="text-gray-600">Type in your registered email address to reset password</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                        </div>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 input"
                            placeholder="your@email.com"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn btn-primary py-2.5"
                >
                    <span className="flex items-center justify-center">
                        {loading ? 'Sending...' : 'Next'}
                        {!loading && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        )}
                    </span>
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