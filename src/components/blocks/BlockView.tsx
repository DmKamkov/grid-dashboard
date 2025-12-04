import React from 'react';
import { LineChartBlock } from './LineChartBlock';
import { BarChartBlock } from './BarChartBlock';
import { TextBlock } from './TextBlock';
import type { Block, BlockType } from '../../types';

interface BlockViewProps {
    block: Block;
    blockIndex: number;
    onChangeType: (index: number, newType: BlockType) => void;
}

export const BlockView: React.FC<BlockViewProps> = ({ block, blockIndex, onChangeType }) => {
    switch (block.type) {
        case 'line':
            return <LineChartBlock block={block} blockIndex={blockIndex} onChangeType={onChangeType} />;
        case 'bar':
            return <BarChartBlock block={block} blockIndex={blockIndex} onChangeType={onChangeType} />;
        case 'text':
            return <TextBlock block={block} blockIndex={blockIndex} onChangeType={onChangeType} />;
        default:
            return null;
    }
};
