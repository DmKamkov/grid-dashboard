import React, { useState, type ReactNode } from 'react';
import type { Block, BlockType, GridContextValue } from '../types';
import { GRID_CONFIG, CHART_CONFIG } from '../constants';
import { GridContext } from './GridContext.def';

const { COLUMNS, INITIAL_ROWS, MIN_CELLS } = GRID_CONFIG;

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
        if (current.length <= MIN_CELLS) {
            return current;
        }
        const cellsBeyondFirstRow = current.slice(MIN_CELLS);
        const hasItemsInSecondRowOrBeyond = cellsBeyondFirstRow.some((cell) => cell !== null);
        if (!hasItemsInSecondRowOrBeyond) {
            return current.slice(0, MIN_CELLS);
        }
        return current;
    };

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
            
            let chartData: number[] | undefined;
            if (type === 'line') {
                chartData = generateRandomData(CHART_CONFIG.LINE_CHART.DATA_POINTS);
            } else if (type === 'bar') {
                chartData = generateRandomData(CHART_CONFIG.BAR_CHART.DATA_POINTS);
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

    const changeBlockType = (index: number, newType: BlockType) => {
        setCells((prev) => {
            if (index < 0 || index >= prev.length) return prev;
            const block = prev[index];
            if (!block || block.type === newType) return prev;

            const next = [...prev];
            
            let chartData: number[] | undefined;
            if (newType === 'line' || newType === 'bar') {
                if (block.type === 'line' || block.type === 'bar') {
                    if (newType === 'line') {
                        chartData = block.chartData && block.chartData.length >= CHART_CONFIG.LINE_CHART.DATA_POINTS
                            ? block.chartData.slice(0, CHART_CONFIG.LINE_CHART.DATA_POINTS)
                            : generateRandomData(CHART_CONFIG.LINE_CHART.DATA_POINTS);
                    } else if (newType === 'bar') {
                        chartData = block.chartData && block.chartData.length >= CHART_CONFIG.BAR_CHART.DATA_POINTS
                            ? block.chartData.slice(0, CHART_CONFIG.BAR_CHART.DATA_POINTS)
                            : generateRandomData(CHART_CONFIG.BAR_CHART.DATA_POINTS);
                    }
                } else {
                    if (newType === 'line') {
                        chartData = generateRandomData(CHART_CONFIG.LINE_CHART.DATA_POINTS);
                    } else if (newType === 'bar') {
                        chartData = generateRandomData(CHART_CONFIG.BAR_CHART.DATA_POINTS);
                    }
                }
            }

            next[index] = {
                ...block,
                type: newType,
                chartData,
            };
            return next;
        });
    };

    const value: GridContextValue = {
        cells,
        addBlock,
        deleteBlock,
        moveBlock,
        changeBlockType,
    };

    return <GridContext.Provider value={value}>{children}</GridContext.Provider>;
};