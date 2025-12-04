import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { Block, BlockType } from '../../types';

interface TextBlockProps {
    block: Block;
    blockIndex: number;
    onChangeType: (index: number, newType: BlockType) => void;
}

export const TextBlock: React.FC<TextBlockProps> = ({ block, blockIndex, onChangeType }) => {
    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = event.target.value as BlockType;
        if (newType !== block.type) {
            onChangeType(blockIndex, newType);
        }
    };

    return (
        <div className="block-content block-text">
            <div className="block-title-row">
                <h4 className="block-title">Opinion Analysis</h4>
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
            <div className="block-body">
                <p>
                    A recent nationwide survey reveals <strong>significant shifts in public opinion</strong> on key social issues, 
                    with <strong>over 60% of respondents</strong> expressing changing views compared to last year's data.
                </p>
                <p>
                    The study, conducted across <em>multiple demographic groups</em>, shows that <strong>younger generations</strong> 
                    are driving much of this change, with their perspectives diverging notably from older cohorts.
                </p>
                <p>
                    <em>Experts suggest</em> that these fluctuations reflect broader societal transformations, including 
                    increased access to information and evolving cultural norms. The data indicates that public sentiment 
                    is becoming <strong>more nuanced and context-dependent</strong> than in previous decades.
                </p>
                <p>
                    While some trends show <em>gradual evolution</em>, others demonstrate <strong>rapid shifts</strong> that 
                    researchers attribute to recent events and media coverage. This dynamic landscape underscores the 
                    importance of <strong>regular polling and continuous monitoring</strong> to capture the pulse of public opinion accurately.
                </p>
            </div>
        </div>
    );
};
