import React from 'react';
import './styles/App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { GridProvider } from './contexts/GridContext';
import { Dashboard } from './components/Dashboard';

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <GridProvider>
                <Dashboard />
            </GridProvider>
        </ThemeProvider>
    );
};

export default App;

