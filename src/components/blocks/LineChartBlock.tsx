import React from 'react';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../../hooks';
import { getChartOptions, getLineChartData } from '../../utils/charts';
import { CHART_CONFIG } from '../../constants';
import type { Block } from '../../types';

interface LineChartBlockProps {
    block: Block;
}

export const LineChartBlock: React.FC<LineChartBlockProps> = ({ block }) => {
    const { theme } = useTheme();
    const chartOptions = getChartOptions(theme, CHART_CONFIG.LINE_CHART.X_AXIS_TITLE);
    const chartData = getLineChartData(block.chartData || []);

    return (
        <div className="block-content block-line-chart">
            <h4 className="block-title">Opinion Changes - Monthly</h4>
            <div className="chart-container">
                <Line data={chartData} options={chartOptions} />
            </div>
            <p className="block-description">
                Monthly opinion changes on "Unnamed Topic" tracking public perception over time.
            </p>
        </div>
    );
};
