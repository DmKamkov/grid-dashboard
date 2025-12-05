import { CHART_CONFIG, CHART_COLORS } from '../../constants';

export const getLineChartData = (chartData: number[]) => {
    return {
        labels: Array.from(CHART_CONFIG.LINE_CHART.MONTHS),
        datasets: [
            {
                label: 'Opinion (%)',
                data: chartData,
                borderColor: CHART_COLORS.LINE.BORDER,
                backgroundColor: CHART_COLORS.LINE.BACKGROUND,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: CHART_COLORS.LINE.POINT_BACKGROUND,
                pointBorderColor: CHART_COLORS.LINE.POINT_BORDER,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };
};

export const getBarChartData = (chartData: number[]) => {
    return {
        labels: Array.from(CHART_CONFIG.BAR_CHART.QUARTERS),
        datasets: [
            {
                label: 'Opinion (%)',
                data: chartData,
                backgroundColor: CHART_COLORS.BAR,
                borderRadius: 4,
            },
        ],
    };
};
