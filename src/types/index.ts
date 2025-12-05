export type BlockType = 'line' | 'bar' | 'text';

export type Theme = 'light' | 'dark';

export interface Block {
    id: string;
    type: BlockType;
    chartData?: number[];
}

export interface GridContextValue {
    cells: (Block | null)[];
    addBlock: (type: BlockType) => void;
    deleteBlock: (index: number) => void;
    moveBlock: (fromIndex: number, toIndex: number) => void;
    changeBlockType: (index: number, newType: BlockType) => void;
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
