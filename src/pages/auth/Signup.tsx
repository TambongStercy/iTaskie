import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/AuthLayout';
import { useAuth } from '../../contexts/AuthContext';

export const Signup = () => {
    const navigate = useNavigate();
    const { signUp, signIn } = useAuth();
    const [step, setStep] = useState(1);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState('');
    const [country, setCountry] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [timezone, setTimezone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);

    // Password validation function
    const validatePassword = (password: string): boolean => {
        // Supabase requires passwords to be at least 6 characters
        return password.length >= 6;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password || !firstName || !lastName) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            setError('');
            setLoading(true);

            // Register the user
            const userData = {
                first_name: firstName,
                last_name: lastName
            };

            const { data, error: signUpError } = await signUp(email, password, userData);

            if (signUpError) {
                throw new Error(signUpError.message);
            }

            // Sign in the user immediately after signup (skipping email verification)
            const { error: signInError } = await signIn(email, password);

            if (signInError) {
                throw new Error(signInError.message);
            }

            // Successful signup and login, redirect to dashboard
            navigate('/dashboard');
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : 'An unexpected error occurred';
            setError('Failed to create an account: ' + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleVerificationCodeChange = (index: number, value: string) => {
        if (value.length > 1) {
            value = value.charAt(0);
        }

        const newVerificationCode = [...verificationCode];
        newVerificationCode[index] = value;
        setVerificationCode(newVerificationCode);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            if (nextInput) {
                nextInput.focus();
            }
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const code = verificationCode.join('');

        try {
            // Simulate a delay for the mock verification
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Move to next step
            setStep(3);
        } catch (error) {
            setError('Invalid verification code');
        } finally {
            setLoading(false);
        }
    };

    const handleSetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (!validatePassword(password)) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            // Simulate a delay for the mock password setting
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Create a mock user and store in localStorage
            const mockUser = {
                id: '123456',
                email,
                user_metadata: {
                    first_name: firstName,
                    last_name: lastName,
                    department,
                    country,
                    phone_number: phoneNumber,
                    timezone
                }
            };
            localStorage.setItem('mockUser', JSON.stringify(mockUser));

            // Redirect to dashboard instead of login
            navigate('/');
        } catch (error) {
            setError('An error occurred while setting password');
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = () => {
        // Mock resend code
        alert('Verification code resent!');
    };

    const renderStep1 = () => (
        <>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Sign Up</h1>
                <div className="text-sm text-gray-500">
                    Step 1 of 2
                    <div className="mt-1">Signup</div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                            First name
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="input"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                            Last name
                        </label>
                        <input
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="input"
                            required
                        />
                    </div>
                </div>

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
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                        Department
                    </label>
                    <input
                        id="department"
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="input"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                            Country
                        </label>
                        <select
                            id="country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="input"
                            required
                        >
                            <option value="">Select country</option>
                            <option value="Cameroon">Cameroon</option>
                            <option value="Nigeria">Nigeria</option>
                            <option value="Ghana">Ghana</option>
                            <option value="Kenya">Kenya</option>
                            <option value="South Africa">South Africa</option>
                            {/* Add more countries as needed */}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone number
                        </label>
                        <input
                            id="phoneNumber"
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="input"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                        Timezone
                    </label>
                    <select
                        id="timezone"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="input"
                        required
                    >
                        <option value="">Select timezone</option>
                        <option value="GMT+1 (Douala)">GMT+1 (Douala)</option>
                        <option value="GMT+0 (London)">GMT+0 (London)</option>
                        <option value="GMT-5 (New York)">GMT-5 (New York)</option>
                        {/* Add more timezones as needed */}
                    </select>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
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
                        Confirm Password
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
                    {loading ? 'Creating account...' : 'Sign Up'}
                </button>

                <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="w-full btn btn-secondary py-2.5"
                >
                    Back to Login
                </button>
            </form>
        </>
    );

    const renderStep2 = () => (
        <>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Check your Mail</h1>
                <div className="text-sm text-gray-500">
                    Step 2 of 2
                    <div className="mt-1">Signup</div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                    {error}
                </div>
            )}

            <p className="text-gray-600 mb-4">
                We've sent a 6-digit confirmation code to <span className="text-blue-600">{email}</span>.
                <br />Make sure you enter correct code.
            </p>

            <form onSubmit={handleVerifyCode} className="space-y-6">
                <div className="flex justify-between">
                    {verificationCode.map((digit, index) => (
                        <input
                            key={index}
                            id={`code-${index}`}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
                            className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    ))}
                </div>

                <button
                    type="submit"
                    disabled={loading || verificationCode.some(digit => !digit)}
                    className="w-full btn btn-primary py-2.5"
                >
                    {loading ? 'Verifying...' : 'Verify'}
                </button>
            </form>

            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                    Didn't Receive code?{' '}
                    <button
                        type="button"
                        onClick={handleResendCode}
                        className="text-blue-600 hover:underline"
                    >
                        Resend Code
                    </button>
                </p>
            </div>

            <div className="mt-6">
                <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="w-full btn btn-secondary py-2.5"
                >
                    Back to Login
                </button>
            </div>
        </>
    );

    const renderStep3 = () => (
        <>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Set your password</h1>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSetPassword} className="space-y-4">
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
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
                        Confirm Password
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
                    {loading ? 'Setting password...' : 'Sign Up'}
                </button>

                <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="w-full btn btn-secondary py-2.5"
                >
                    Back to Login
                </button>
            </form>
        </>
    );

    return (
        <AuthLayout>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
        </AuthLayout>
    );
}; 