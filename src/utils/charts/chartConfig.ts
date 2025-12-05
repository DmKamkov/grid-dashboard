import type { Theme } from '../../types';
import { THEME_COLORS } from '../../constants';

export const getChartOptions = (theme: Theme, xAxisTitle?: string) => {
    const textColor = theme === 'light' ? THEME_COLORS.LIGHT.TEXT : THEME_COLORS.DARK.TEXT;
    const gridColor = theme === 'light' ? THEME_COLORS.LIGHT.GRID : THEME_COLORS.DARK.GRID;
    
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
                    callback: function(value: unknown) {
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
