import React from 'react';
import { isSupabaseConfigured } from '../api/supabase';

interface SupabaseSetupModalProps {
    onClose: () => void;
    errorMessage?: string;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({ onClose, errorMessage }) => {
    const supabaseConfigured = isSupabaseConfigured();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Supabase Setup Guide & Troubleshooting</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="prose prose-indigo mb-6 max-w-none">
                    {errorMessage && (
                        <div className="p-4 bg-red-100 border-l-4 border-red-500 mb-6">
                            <p className="font-bold">Error Message:</p>
                            <p className="text-red-800">{errorMessage}</p>
                        </div>
                    )}

                    <div className="p-4 bg-amber-100 border-l-4 border-amber-500 mb-6">
                        <p className="font-bold">Current Status:</p>
                        <p>
                            {supabaseConfigured
                                ? "✅ Environment variables are set in .env file"
                                : "❌ Environment variables not found in .env file"}
                        </p>
                        <p>
                            {supabaseConfigured
                                ? "⚠️ However, we're still experiencing connection issues"
                                : "Please set up your environment variables as shown below"}
                        </p>
                    </div>

                    <h3>Complete Setup Guide</h3>

                    <h4>1. Create a Supabase Project</h4>
                    <ol className="list-decimal pl-5">
                        <li>Go to <a href="https://app.supabase.com" target="_blank" rel="noreferrer" className="text-indigo-600">Supabase.com</a> and sign in</li>
                        <li>Click "New Project"</li>
                        <li>Choose an organization and enter a name for your project</li>
                        <li>Create a secure database password (and save it somewhere safe)</li>
                        <li>Choose a region close to your users</li>
                        <li>Click "Create new project" and wait for it to be created (this may take a few minutes)</li>
                    </ol>

                    <h4>2. Create the Tasks Table</h4>
                    <ol className="list-decimal pl-5">
                        <li>In your Supabase project dashboard, go to the "Table Editor" in the left sidebar</li>
                        <li>Click "Create a new table"</li>
                        <li>Set the table name to <code className="bg-gray-100 p-1 rounded">tasks</code></li>
                        <li>Enable "Enable Row Level Security (RLS)"</li>
                        <li>Add the following columns:
                            <ul className="list-disc pl-5 mt-2">
                                <li><code className="bg-gray-100 p-1 rounded">id</code> (type: uuid, primary key, default: uuid_generate_v4())</li>
                                <li><code className="bg-gray-100 p-1 rounded">title</code> (type: text, NOT NULL)</li>
                                <li><code className="bg-gray-100 p-1 rounded">description</code> (type: text)</li>
                                <li><code className="bg-gray-100 p-1 rounded">is_completed</code> (type: boolean, default: false)</li>
                                <li><code className="bg-gray-100 p-1 rounded">priority</code> (type: text, default: 'low')</li>
                                <li><code className="bg-gray-100 p-1 rounded">due_date</code> (type: timestamp with time zone)</li>
                                <li><code className="bg-gray-100 p-1 rounded">user_id</code> (type: text, NOT NULL)</li>
                                <li><code className="bg-gray-100 p-1 rounded">created_at</code> (type: timestamp with time zone, default: now())</li>
                                <li><code className="bg-gray-100 p-1 rounded">category</code> (type: text, default: 'VASCLOUD')</li>
                            </ul>
                        </li>
                        <li>Click "Save" to create the table</li>
                    </ol>

                    <h4>3. Create RLS Policies for the Tasks Table</h4>
                    <ol className="list-decimal pl-5">
                        <li>Go to the Authentication → Policies section in the Supabase dashboard</li>
                        <li>Select the "tasks" table</li>
                        <li>Click "Add Policy" → "Create Policy from scratch"</li>
                        <li>For the SELECT policy:
                            <ul className="list-disc pl-5 mt-2">
                                <li>Policy Name: allow_select_own_tasks</li>
                                <li>Using expression: <code className="bg-gray-100 p-1 rounded">auth.uid() = user_id</code></li>
                            </ul>
                        </li>
                        <li>Create similar policies for INSERT, UPDATE, and DELETE operations, all with the condition <code className="bg-gray-100 p-1 rounded">auth.uid() = user_id</code></li>
                    </ol>

                    <h4>4. Get Your API Keys</h4>
                    <ol className="list-decimal pl-5">
                        <li>Go to Project Settings → API in the left sidebar</li>
                        <li>You'll see "Project URL" and "API Key" (under anon public)</li>
                        <li>Copy these values for the next step</li>
                    </ol>

                    <h4>5. Create .env File</h4>
                    <ol className="list-decimal pl-5">
                        <li>Create a file named <code className="bg-gray-100 p-1 rounded">.env</code> in the root directory of your project</li>
                        <li>Add the following lines, replacing the values with your actual Supabase URL and anon key:
                            <pre className="bg-gray-100 p-2 rounded mt-2">
                                VITE_SUPABASE_URL=https://your-project-id.supabase.co<br />
                                VITE_SUPABASE_ANON_KEY=your-anon-key
                            </pre>
                        </li>
                        <li>Save the file</li>
                        <li>Restart your development server</li>
                    </ol>

                    <h4>Common Troubleshooting Steps</h4>
                    <ul className="list-disc pl-5">
                        <li><strong>404 Error</strong>: Ensure your table name is exactly "tasks" (all lowercase)</li>
                        <li><strong>401 Error</strong>: Check that your API keys are correct and properly set in the .env file</li>
                        <li><strong>403 Error</strong>: You need to set up RLS policies correctly</li>
                        <li><strong>Browser Console Errors</strong>: Check the browser's console (F12) for more detailed error messages</li>
                        <li><strong>CORS Issues</strong>: Go to Supabase Project Settings → API → API Settings and add your application's domain to the allowed CORS origins</li>
                    </ul>

                    <p className="mt-4">In the meantime, we've enabled a local storage fallback so you can still use the app.</p>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Got it, use local storage for now
                    </button>
                </div>
            </div>
        </div>
    );
}; 