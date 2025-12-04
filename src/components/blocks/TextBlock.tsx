import React from 'react';
import type { Block } from '../../types';

interface TextBlockProps {
    block: Block;
}

export const TextBlock: React.FC<TextBlockProps> = () => {
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
};
