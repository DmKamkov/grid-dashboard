/**
 * Centralized type definitions for the dashboard application
 */

export type BlockType = 'line' | 'bar' | 'text';

export type Theme = 'light' | 'dark';

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

export interface ThemeContextValue {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

export interface PDFTemplateData {
    title?: string;
    author?: string;
    date?: string;
    notes?: string;
    theme?: Theme;
}
