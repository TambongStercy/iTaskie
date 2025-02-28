import React, { useState } from 'react';
import { testEmailJS, testPdfAttachment } from '../utils/test-email';

/**
 * Component for testing email functionality with PDF attachments
 * Add this component to any page where you want to test email sending
 */
const EmailTester: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleTestRegularEmail = async () => {
        if (!email) {
            setError('Please enter an email address');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // Use the existing test function but replace the email
            const testResult = await testEmailJS();
            setResult(testResult);
        } catch (err) {
            setError('Failed to send test email: ' + (err instanceof Error ? err.message : String(err)));
        } finally {
            setLoading(false);
        }
    };

    const handleTestPdfAttachment = async () => {
        if (!email) {
            setError('Please enter an email address');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const testResult = await testPdfAttachment(email);
            setResult(testResult);
        } catch (err) {
            setError('Failed to send test email with PDF: ' + (err instanceof Error ? err.message : String(err)));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Email Functionality Tester</h2>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <button
                    onClick={handleTestRegularEmail}
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    Test Regular Email
                </button>

                <button
                    onClick={handleTestPdfAttachment}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    Test PDF Attachment
                </button>
            </div>

            {loading && (
                <div className="text-center my-4">
                    <p className="text-gray-600">Sending test email...</p>
                </div>
            )}

            {error && (
                <div className="p-3 bg-red-100 border border-red-200 rounded-md my-4">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {result && (
                <div className="p-3 bg-green-100 border border-green-200 rounded-md my-4">
                    <p className="text-green-700 font-medium">
                        {result.success ? 'Email sent successfully!' : 'Email sending failed'}
                    </p>
                    <pre className="mt-2 text-xs text-gray-600 overflow-x-auto">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}

            <div className="mt-4 text-sm text-gray-600">
                <p>This tool helps you test email functionality with and without PDF attachments.</p>
                <p className="mt-2">Make sure your EmailJS is correctly configured in your .env file with:</p>
                <ul className="list-disc ml-6 mt-1">
                    <li>VITE_EMAILJS_SERVICE_ID</li>
                    <li>VITE_EMAILJS_TEMPLATE_ID</li>
                    <li>VITE_EMAILJS_USER_ID</li>
                </ul>
            </div>
        </div>
    );
};

export default EmailTester; 