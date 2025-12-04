import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '../../hooks';
import { getChartOptions, getBarChartData } from '../../utils/charts';
import { CHART_CONFIG } from '../../constants';
import type { Block } from '../../types';

interface BarChartBlockProps {
    block: Block;
}

export const BarChartBlock: React.FC<BarChartBlockProps> = ({ block }) => {
    const { theme } = useTheme();
    const chartOptions = getChartOptions(theme, CHART_CONFIG.BAR_CHART.X_AXIS_TITLE);
    const chartData = getBarChartData(block.chartData || []);

    return (
        <div className="block-content block-bar-chart">
            <h4 className="block-title">Opinion Changes - Quarterly</h4>
            <div className="chart-container">
                <Bar data={chartData} options={chartOptions} />
            </div>
            <p className="block-description">
                Quarterly opinion changes on "Unnamed Topic" showing public sentiment shifts.
            </p>
        </div>
    );
};
