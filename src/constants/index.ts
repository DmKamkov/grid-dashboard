// Grid Configuration
export const GRID_CONFIG = {
    COLUMNS: 3,
    INITIAL_ROWS: 1,
    MIN_CELLS: 3, // 1 row (3 cells)
} as const;

// Chart Configuration
export const CHART_CONFIG = {
    LINE_CHART: {
        DATA_POINTS: 12, // Monthly data
        MONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        X_AXIS_TITLE: 'Months',
    },
    BAR_CHART: {
        DATA_POINTS: 4, // Quarterly data
        QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
        X_AXIS_TITLE: 'Quarters',
    },
    DATA_RANGE: {
        MIN: 0,
        MAX: 100,
    },
} as const;

// Chart Visual Configuration
export const CHART_COLORS = {
    LINE: {
        BORDER: '#10b981',
        BACKGROUND: 'rgba(188, 243, 156, 0.2)',
        POINT_BACKGROUND: '#BCF39C',
        POINT_BORDER: '#10b981',
    },
    BAR: ['#BCF39C', '#10b981', '#BCF39C', '#10b981'],
} as const;

// Theme Colors
export const THEME_COLORS = {
    LIGHT: {
        TEXT: '#4a7c65',
        GRID: 'rgba(16, 185, 129, 0.1)',
    },
    DARK: {
        TEXT: '#94a3b8',
        GRID: 'rgba(148, 163, 184, 0.1)',
    },
} as const;

// PDF Configuration
export const PDF_CONFIG = {
    PAGE_SIZE: {
        WIDTH: 210, // A4 width in mm
        HEIGHT: 297, // A4 height in mm
    },
    SCALE: 2,
    TIMEOUT: 15000,
} as const;
