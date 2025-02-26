interface TaskSummaryCardProps {
    title: string;
    count: number;
    total: number;
    color: 'blue' | 'indigo' | 'purple';
}

export const TaskSummaryCard = ({ title, count, total, color }: TaskSummaryCardProps) => {
    const percentage = Math.round((count / total) * 100);

    const getBackgroundColor = () => {
        switch (color) {
            case 'blue':
                return 'bg-blue-900';
            case 'indigo':
                return 'bg-indigo-800';
            case 'purple':
                return 'bg-purple-800';
            default:
                return 'bg-blue-900';
        }
    };

    const getProgressColor = () => {
        switch (color) {
            case 'blue':
                return '#3b82f6'; // blue-500
            case 'indigo':
                return '#6366f1'; // indigo-500
            case 'purple':
                return '#8b5cf6'; // purple-500
            default:
                return '#3b82f6';
        }
    };

    return (
        <div className={`${getBackgroundColor()} rounded-xl p-6 text-white shadow-sm`}>
            <h3 className="text-lg font-medium mb-4">{title}</h3>
            <div className="flex items-center justify-between">
                <div className="text-4xl font-bold">{count}</div>
                <div className="relative w-20 h-20">
                    {/* Background circle */}
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.2)"
                            strokeWidth="8"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke={getProgressColor()}
                            strokeWidth="8"
                            strokeDasharray={`${percentage * 2.51} 251`}
                            strokeDashoffset="0"
                            strokeLinecap="round"
                            transform="rotate(-90 50 50)"
                        />
                        <text
                            x="50"
                            y="55"
                            textAnchor="middle"
                            fontSize="16"
                            fontWeight="bold"
                            fill="white"
                        >
                            {percentage}%
                        </text>
                    </svg>
                </div>
            </div>
            <div className="mt-2 text-sm text-white/70">
                {total} Task
            </div>
        </div>
    );
}; 