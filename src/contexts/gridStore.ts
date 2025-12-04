import { createContext, useContext } from 'react';

export type BlockType = 'line' | 'bar' | 'text';

export interface Block {
    id: string;
    type: BlockType;
    chartData?: number[]; // Store generated chart data for line/bar charts
}

export interface GridContextValue {
    cells: (Block | null)[];
    addBlock: (type: BlockType) => void;
    deleteBlock: (index: number) => void;
    moveBlock: (fromIndex: number, toIndex: number) => void;
}

export const GridContext = createContext<GridContextValue | undefined>(undefined);

export const useGrid = (): GridContextValue => {
    const ctx = useContext(GridContext);
    if (!ctx) {
        throw new Error('useGrid must be used within a GridProvider');
    }
    return ctx;
};
