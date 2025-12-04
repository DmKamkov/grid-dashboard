import { useContext } from 'react';
import { GridContext } from '../contexts/GridContext.def';
import type { GridContextValue } from '../types';

export const useGrid = (): GridContextValue => {
    const ctx = useContext(GridContext);
    if (!ctx) {
        throw new Error('useGrid must be used within a GridProvider');
    }
    return ctx;
};
