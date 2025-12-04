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

const getChartOptions = (theme: 'light' | 'dark', xAxisTitle?: string) => {
    const textColor = theme === 'light' ? '#4a7c65' : '#94a3b8';
    const gridColor = theme === 'light' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(148, 163, 184, 0.1)';
    
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
                title: {
                    display: !!xAxisTitle,
                    text: xAxisTitle || '',
                    color: textColor,
                    font: {
                        size: 11,
                        weight: '500',
                    },
                    padding: {
                        top: 8,
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
                    callback: function(value) {
                        return value + '%';
                    },
                },
                beginAtZero: true,
                max: 100,
                title: {
                    display: false,
                },
            },
        },
    };
};

const getLineChartData = (chartData: number[]) => {
    // Opinion changes on "Unnamed Topic" - Monthly data
    const borderColor = '#10b981';
    const backgroundColor = 'rgba(188, 243, 156, 0.2)';
    
    return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Opinion (%)',
                data: chartData,
                borderColor,
                backgroundColor,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#BCF39C',
                pointBorderColor: '#10b981',
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };
};

const getBarChartData = (chartData: number[]) => {
    // Opinion changes on "Unnamed Topic" by Quarter
    const colors = [
        '#BCF39C',
        '#10b981',
        '#BCF39C',
        '#10b981',
    ];
    
    return {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
            {
                label: 'Opinion (%)',
                data: chartData,
                backgroundColor: colors,
                borderRadius: 4,
            },
        ],
    };
};

export const BlockView: React.FC<BlockProps> = ({ block }) => {
    const { theme } = useTheme();
    const lineChartOptions = getChartOptions(theme, 'Months'); // Show "Months" for line chart
    const barChartOptions = getChartOptions(theme, 'Quarters'); // Show "Quarters" for bar chart
    const lineChartData = block.chartData ? getLineChartData(block.chartData) : getLineChartData([]);
    const barChartData = block.chartData ? getBarChartData(block.chartData) : getBarChartData([]);

    if (block.type === 'text') {
        return (
            <div className="block-content block-text">
                <h4 className="block-title">Opinion Analysis</h4>
                <div className="block-body">
                    <p>Public opinion on "Unnamed Topic" has shown significant variation throughout the year, reflecting changing perspectives and evolving attitudes.</p>
                    <p>The data tracks how people's views have shifted over time, capturing the dynamic nature of public sentiment on this subject.</p>
                    <p>Opinion percentages range from 0% to 100%, representing the full spectrum of public views and perspectives.</p>
                    <p>These changes highlight the importance of continuous monitoring and analysis to understand evolving public opinion trends.</p>
                </div>
            </div>
        );
    }

    if (block.type === 'bar') {
        return (
            <div className="block-content block-bar-chart">
                <h4 className="block-title">Opinion Changes - Quarterly</h4>
                <div className="chart-container">
                    <Bar data={barChartData} options={barChartOptions} />
                </div>
                <p className="block-description">
                    Quarterly opinion changes on "Unnamed Topic" showing public sentiment shifts.
                </p>
            </div>
        );
    }

    return (
        <div className="block-content block-line-chart">
            <h4 className="block-title">Opinion Changes - Monthly</h4>
            <div className="chart-container">
                <Line data={lineChartData} options={lineChartOptions} />
            </div>
            <p className="block-description">
                Monthly opinion changes on "Unnamed Topic" tracking public perception over time.
            </p>
        </div>
    );
};


