import { ReactNode } from 'react';
import { Logo } from './Logo';

interface AuthLayoutProps {
    children: ReactNode;
    rightSideContent?: ReactNode;
}

export const AuthLayout = ({ children, rightSideContent }: AuthLayoutProps) => {
    return (
        <div className="flex min-h-screen">
            <div className="flex-1 flex flex-col justify-between p-8">
                <div>
                    <Logo />
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-md">{children}</div>
                </div>
                <div className="text-sm text-gray-600 flex items-center space-x-2 justify-center">
                    <a href="#" className="hover:underline">Terms and conditions</a>
                    <span>•</span>
                    <a href="#" className="hover:underline">Privacy policy</a>
                </div>
            </div>
            <div className="hidden lg:block lg:w-1/2 bg-blue-600 text-white">
                {rightSideContent || (
                    <div className="h-full flex items-center justify-center p-12">
                        <div className="max-w-xl">
                            <h2 className="text-4xl font-bold mb-6">
                                IT'S ALWAYS BETTER TO WRITE YOUR TASKS DOWN AND MONITOR YOUR PROGRESS
                            </h2>
                            <p className="text-xl">
                                Manage all your tasks in one place and stay organized.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}; 