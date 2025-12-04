import React from 'react';
import { Line } from 'react-chartjs-2';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '../../hooks';
import { getChartOptions, getLineChartData } from '../../utils/charts';
import { CHART_CONFIG } from '../../constants';
import type { Block, BlockType } from '../../types';

interface LineChartBlockProps {
    block: Block;
    blockIndex: number;
    onChangeType: (index: number, newType: BlockType) => void;
}

export const LineChartBlock: React.FC<LineChartBlockProps> = ({ block, blockIndex, onChangeType }) => {
    const { theme } = useTheme();
    const chartOptions = getChartOptions(theme, CHART_CONFIG.LINE_CHART.X_AXIS_TITLE);
    const chartData = getLineChartData(block.chartData || []);

    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = event.target.value as BlockType;
        if (newType !== block.type && (newType === 'line' || newType === 'bar')) {
            onChangeType(blockIndex, newType);
        }
    };

    return (
        <div className="block-content block-line-chart">
            <div className="block-title-row">
                <h4 className="block-title">Opinion Changes</h4>
                <div className="block-type-selector">
                    <select
                        value={block.type}
                        onChange={handleTypeChange}
                        className="chart-type-select"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <option value="line">Line Chart</option>
                        <option value="bar">Bar Chart</option>
                        <option value="text">Text Block</option>
                    </select>
                    <ChevronDown size={14} className="select-arrow" />
                </div>
            </div>
            <div className="chart-container">
                <Line data={chartData} options={chartOptions} />
            </div>
            <p className="block-description">
                <strong>Trend analysis</strong> reveals <em>monthly fluctuations</em> in public opinion, 
                with <strong>notable peaks and valleys</strong> indicating periods of significant change. 
                The data demonstrates how <em>public sentiment evolves</em> over time, reflecting 
                <strong>broader social and cultural shifts</strong> in contemporary society.
            </p>
        </div>
    );
};
