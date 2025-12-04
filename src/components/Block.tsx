import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useTheme } from '../contexts/ThemeContext';
import type { Block } from '../contexts/gridStore';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface BlockProps {
    block: Block;
}

const getChartOptions = (theme: 'light' | 'dark') => {
    const textColor = theme === 'light' ? '#64748b' : '#94a3b8';
    const gridColor = theme === 'light' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.1)';
    
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: textColor,
                    font: {
                        size: 10,
                    },
                },
            },
            y: {
                grid: {
                    color: gridColor,
                },
                ticks: {
                    color: textColor,
                    font: {
                        size: 10,
                    },
                },
            },
        },
    };
};

const getLineChartData = () => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [
        {
            label: 'Sales',
            data: [12, 19, 15, 25],
            borderColor: 'rgba(96, 165, 250, 0.9)',
            backgroundColor: 'rgba(96, 165, 250, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#22c55e',
            pointBorderColor: '#22c55e',
            pointRadius: 4,
            pointHoverRadius: 6,
        },
    ],
});

const getBarChartData = () => ({
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
        {
            label: 'Revenue',
            data: [35, 70, 50, 85],
            backgroundColor: [
                'rgba(99, 102, 241, 0.8)',
                'rgba(34, 197, 94, 0.8)',
                'rgba(99, 102, 241, 0.8)',
                'rgba(34, 197, 94, 0.8)',
            ],
            borderRadius: 4,
        },
    ],
});

export const BlockView: React.FC<BlockProps> = ({ block }) => {
    const { theme } = useTheme();
    const chartOptions = getChartOptions(theme);
    const lineChartData = getLineChartData();
    const barChartData = getBarChartData();

    if (block.type === 'text') {
        return (
            <div className="block-content block-text">
                <h4 className="block-title">Text Block</h4>
                <div className="block-body">
                    <p>This is a sample text block with additional content to demonstrate the text display capabilities.</p>
                    <p>The dashboard provides a flexible grid layout where you can organize various types of content blocks.</p>
                    <p>You can drag and drop blocks to rearrange them, or delete blocks using the hover button in the top-right corner.</p>
                    <p>Each block type serves a different purpose: charts visualize data trends, while text blocks provide context and information.</p>
                    <p>The responsive design ensures the dashboard works well on different screen sizes, automatically adjusting the column layout.</p>
                </div>
            </div>
        );
    }

    if (block.type === 'bar') {
        return (
            <div className="block-content block-bar-chart">
                <h4 className="block-title">Bar Chart</h4>
                <div className="chart-container">
                    <Bar data={barChartData} options={chartOptions} />
                </div>
                <p className="block-description">
                    Quarterly revenue performance showing steady growth throughout the year.
                </p>
            </div>
        );
    }

    return (
        <div className="block-content block-line-chart">
            <h4 className="block-title">Line Chart</h4>
            <div className="chart-container">
                <Line data={lineChartData} options={chartOptions} />
            </div>
            <p className="block-description">
                Monthly sales trend indicating positive momentum over the period.
            </p>
        </div>
    );
};


