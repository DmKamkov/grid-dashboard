import { createContext } from 'react';
import type { GridContextValue } from '../types';

export const GridContext = createContext<GridContextValue | undefined>(undefined);
