import { useState } from 'react';

// Mock data for the chart
const CHART_DATA = {
    daily: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        completed: [3, 5, 2, 4, 6, 3, 2],
        ongoing: [2, 3, 4, 2, 1, 2, 1],
    },
    weekly: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        completed: [12, 18, 15, 20],
        ongoing: [8, 10, 7, 5],
    },
    monthly: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        completed: [45, 52, 38, 65, 48, 56],
        ongoing: [30, 25, 18, 22, 15, 20],
    },
};

interface TabButtonProps {
    label: string;
    active: boolean;
    onClick: () => void;
}

const TabButton = ({ label, active, onClick }: TabButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${active
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-500 hover:bg-gray-100'
                }`}
        >
            {label}
        </button>
    );
};

export const TaskChart = () => {
    const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

    // Get data based on selected time range
    const data = CHART_DATA[timeRange];

    // Calculate max value for the chart
    const maxValue = Math.max(
        ...data.completed,
        ...data.ongoing
    );

    // Calculate chart dimensions
    const chartHeight = 200;
    const chartWidth = 100 * data.labels.length;

    // Calculate points for the line charts
    const getPoints = (values: number[]) => {
        const pointGap = chartWidth / (values.length - 1);

        return values.map((value, index) => {
            const x = index * pointGap;
            const y = chartHeight - (value / maxValue) * chartHeight;
            return { x, y };
        });
    };

    const completedPoints = getPoints(data.completed);
    const ongoingPoints = getPoints(data.ongoing);

    // Generate SVG path for the lines with smooth curves
    const generateSmoothPath = (points: { x: number; y: number }[]) => {
        if (points.length < 2) return '';

        let path = `M ${points[0].x},${points[0].y}`;

        for (let i = 0; i < points.length - 1; i++) {
            const current = points[i];
            const next = points[i + 1];

            // Calculate control points for the curve
            const controlX1 = current.x + (next.x - current.x) / 3;
            const controlY1 = current.y;
            const controlX2 = current.x + 2 * (next.x - current.x) / 3;
            const controlY2 = next.y;

            // Add cubic bezier curve command
            path += ` C ${controlX1},${controlY1} ${controlX2},${controlY2} ${next.x},${next.y}`;
        }

        return path;
    };

    // Generate area paths with smooth curves
    const generateSmoothAreaPath = (points: { x: number; y: number }[]) => {
        if (points.length < 2) return '';

        const smoothPath = generateSmoothPath(points);
        return `${smoothPath} L ${points[points.length - 1].x},${chartHeight} L ${points[0].x},${chartHeight} Z`;
    };

    const completedPath = generateSmoothPath(completedPoints);
    const ongoingPath = generateSmoothPath(ongoingPoints);
    const completedAreaPath = generateSmoothAreaPath(completedPoints);
    const ongoingAreaPath = generateSmoothAreaPath(ongoingPoints);

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Task Progress</h2>
                <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
                    <TabButton
                        label="Daily"
                        active={timeRange === 'daily'}
                        onClick={() => setTimeRange('daily')}
                    />
                    <TabButton
                        label="Weekly"
                        active={timeRange === 'weekly'}
                        onClick={() => setTimeRange('weekly')}
                    />
                    <TabButton
                        label="Monthly"
                        active={timeRange === 'monthly'}
                        onClick={() => setTimeRange('monthly')}
                    />
                </div>
            </div>

            <div className="flex">
                {/* Y-axis labels */}
                <div className="flex flex-col justify-between text-xs text-gray-400 pr-2 py-2 h-[200px]">
                    <div>{maxValue}</div>
                    <div>{Math.round(maxValue * 0.75)}</div>
                    <div>{Math.round(maxValue * 0.5)}</div>
                    <div>{Math.round(maxValue * 0.25)}</div>
                    <div>0</div>
                </div>

                {/* Chart area */}
                <div className="flex-1 relative">
                    {/* Grid lines */}
                    <div className="absolute inset-0">
                        <div className="border-b border-gray-100 h-1/4"></div>
                        <div className="border-b border-gray-100 h-1/4"></div>
                        <div className="border-b border-gray-100 h-1/4"></div>
                        <div className="border-b border-gray-100 h-1/4"></div>
                    </div>

                    {/* Chart */}
                    <svg width="100%" height={chartHeight} className="overflow-visible">
                        {/* Area fill for completed tasks */}
                        <path
                            d={completedAreaPath}
                            fill="url(#blueGradient)"
                            opacity="0.2"
                        />

                        {/* Area fill for ongoing tasks */}
                        <path
                            d={ongoingAreaPath}
                            fill="url(#yellowGradient)"
                            opacity="0.2"
                        />

                        {/* Gradients */}
                        <defs>
                            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#3B82F6" />
                                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#F59E0B" />
                                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Completed tasks line */}
                        <path
                            d={completedPath}
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* Ongoing tasks line */}
                        <path
                            d={ongoingPath}
                            fill="none"
                            stroke="#F59E0B"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeDasharray="4 4"
                        />

                        {/* Data points for completed tasks */}
                        {completedPoints.map((point, index) => (
                            <circle
                                key={`completed-${index}`}
                                cx={point.x}
                                cy={point.y}
                                r="5"
                                fill="#3B82F6"
                                stroke="white"
                                strokeWidth="2"
                            />
                        ))}

                        {/* Data points for ongoing tasks */}
                        {ongoingPoints.map((point, index) => (
                            <circle
                                key={`ongoing-${index}`}
                                cx={point.x}
                                cy={point.y}
                                r="5"
                                fill="#F59E0B"
                                stroke="white"
                                strokeWidth="2"
                            />
                        ))}
                    </svg>

                    {/* X-axis labels */}
                    <div className="flex justify-between mt-2">
                        {data.labels.map((label, index) => (
                            <div key={index} className="text-xs text-gray-400">
                                {label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center mt-6 space-x-6">
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Completed Tasks</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Ongoing Tasks</span>
                </div>
            </div>
        </div>
    );
}; 