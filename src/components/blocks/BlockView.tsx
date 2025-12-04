import React from 'react';
import { LineChartBlock } from './LineChartBlock';
import { BarChartBlock } from './BarChartBlock';
import { TextBlock } from './TextBlock';
import type { Block } from '../../types';

interface BlockViewProps {
    block: Block;
}

export const BlockView: React.FC<BlockViewProps> = ({ block }) => {
    switch (block.type) {
        case 'line':
            return <LineChartBlock block={block} />;
        case 'bar':
            return <BarChartBlock block={block} />;
        case 'text':
            return <TextBlock block={block} />;
        default:
            return null;
    }
};
