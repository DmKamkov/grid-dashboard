import React from 'react';
import { Bar } from 'react-chartjs-2';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '../../hooks';
import { getChartOptions, getBarChartData } from '../../utils/charts';
import { CHART_CONFIG } from '../../constants';
import type { Block, BlockType } from '../../types';

interface BarChartBlockProps {
    block: Block;
    blockIndex: number;
    onChangeType: (index: number, newType: BlockType) => void;
}

export const BarChartBlock: React.FC<BarChartBlockProps> = ({ block, blockIndex, onChangeType }) => {
    const { theme } = useTheme();
    const chartOptions = getChartOptions(theme, CHART_CONFIG.BAR_CHART.X_AXIS_TITLE);
    const chartData = getBarChartData(block.chartData || []);

    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = event.target.value as BlockType;
        if (newType !== block.type) {
            onChangeType(blockIndex, newType);
        }
    };

    return (
        <div className="block-content block-bar-chart">
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
                <Bar data={chartData} options={chartOptions} />
            </div>
            <p className="block-description">
                <strong>Quarterly comparisons</strong> highlight <em>distinct patterns</em> in public 
                sentiment across different time periods. The data shows <strong>clear variations</strong> 
                between quarters, suggesting that <em>seasonal factors and major events</em> play a 
                significant role in shaping <strong>public opinion dynamics</strong>.
            </p>
        </div>
    );
};
