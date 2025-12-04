import React, { useState, type ReactNode } from 'react';
import type { Block, BlockType, GridContextValue } from './gridStore';
import { GridContext } from './gridStore';

const INITIAL_ROWS = 3;
const COLUMNS = 3;

function createEmptyGrid(rows: number): (Block | null)[] {
    return Array.from({ length: rows * COLUMNS }, () => null);
}

export const GridProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cells, setCells] = useState<(Block | null)[]>(() => createEmptyGrid(INITIAL_ROWS));

    const ensureCapacity = (current: (Block | null)[]): (Block | null)[] => {
        if (current.some((cell) => cell === null)) {
            return current;
        }
        return [...current, ...createEmptyGrid(1)];
    };

    const shrinkToMinimum = (current: (Block | null)[]): (Block | null)[] => {
        const minCells = INITIAL_ROWS * COLUMNS; // 9 cells (3x3)
        if (current.length <= minCells) {
            return current;
        }
        // Check if all cells beyond the first 3 rows are empty
        const cellsBeyondThirdRow = current.slice(minCells);
        const hasItemsInFourthRowOrBeyond = cellsBeyondThirdRow.some((cell) => cell !== null);
        if (!hasItemsInFourthRowOrBeyond) {
            return current.slice(0, minCells);
        }
        return current;
    };

    // Generate random data between 0 and 100
    const generateRandomData = (count: number): number[] => {
        return Array.from({ length: count }, () => Math.floor(Math.random() * 101));
    };

    const addBlock = (type: BlockType) => {
        setCells((prev) => {
            const withCapacity = ensureCapacity(prev);
            const next = [...withCapacity];
            const index = next.findIndex((cell) => cell === null);
            if (index === -1) {
                return next;
            }
            
            // Generate chart data once when block is created
            let chartData: number[] | undefined;
            if (type === 'line') {
                chartData = generateRandomData(12); // 12 months
            } else if (type === 'bar') {
                chartData = generateRandomData(4); // 4 quarters
            }
            
            next[index] = {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                type,
                chartData,
            };
            return next;
        });
    };

    const deleteBlock = (index: number) => {
        setCells((prev) => {
            if (index < 0 || index >= prev.length) return prev;
            const next = [...prev];
            next[index] = null;
            return shrinkToMinimum(next);
        });
    };

    const moveBlock = (fromIndex: number, toIndex: number) => {
        setCells((prev) => {
            if (
                fromIndex === toIndex ||
                fromIndex < 0 ||
                fromIndex >= prev.length ||
                toIndex < 0 ||
                toIndex >= prev.length
            ) {
                return prev;
            }

            if (prev[toIndex] !== null) {
                return prev;
            }

            const next = [...prev];
            const block = next[fromIndex];
            if (!block) {
                return prev;
            }
            next[fromIndex] = null;
            next[toIndex] = block;
            return shrinkToMinimum(next);
        });
    };

    const value: GridContextValue = {
        cells,
        addBlock,
        deleteBlock,
        moveBlock,
    };

    return <GridContext.Provider value={value}>{children}</GridContext.Provider>;
};

