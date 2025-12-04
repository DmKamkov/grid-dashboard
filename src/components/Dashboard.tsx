import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useGrid } from '../contexts/gridStore';
import { BlockView } from './Block';
import { ThemeSwitcher } from './ThemeSwitcher';

export const Dashboard: React.FC = () => {
    const { cells, addBlock, deleteBlock, moveBlock } = useGrid();
    const [dragSourceIndex, setDragSourceIndex] = useState<number | null>(null);
    const [dragTargetIndex, setDragTargetIndex] = useState<number | null>(null);

    const handleDragStart = (index: number) => {
        setDragSourceIndex(index);
    };

    const handleDragEnd = () => {
        setDragSourceIndex(null);
        setDragTargetIndex(null);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>, index: number) => {
        event.preventDefault();
        if (cells[index] === null) {
            setDragTargetIndex(index);
        } else {
            setDragTargetIndex(null);
        }
    };

    const handleDrop = (index: number) => {
        if (dragSourceIndex !== null && index !== dragSourceIndex && cells[index] === null) {
            moveBlock(dragSourceIndex, index);
        }
        setDragSourceIndex(null);
        setDragTargetIndex(null);
    };

    return (
        <div className="app-root">
        <header className="app-header">
            <div className="app-header-top">
                <h1 className="app-title">Grid Dashboard</h1>
                <ThemeSwitcher />
            </div>
            <div className="controls">
                <button type="button" onClick={() => addBlock('line')}>
                    Add Line Chart
                </button>
                <button type="button" onClick={() => addBlock('bar')}>
                    Add Bar Chart
                </button>
                <button type="button" onClick={() => addBlock('text')}>
                    Add Text Block
                </button>
            </div>
        </header>

        <main className="canvas-wrapper">
            <div className="canvas-grid">
                {cells.map((cell, index) => {
                    const isDraggingFromHere = dragSourceIndex === index;
                    const isPotentialTarget = dragTargetIndex === index;
                    const isEmpty = cell === null;

                    return (
                        <div
                            key={index}
                            className={[
                                'canvas-cell',
                                isEmpty ? 'cell-empty' : 'cell-filled',
                                isPotentialTarget ? 'cell-drop-target' : '',
                            ].filter(Boolean).join(' ')}
                            onDragOver={(event) => handleDragOver(event, index)}
                            onDrop={() => handleDrop(index)}
                        >
                            {cell && (
                                <div
                                    className={['block', isDraggingFromHere ? 'block-dragging' : ''].join(' ')}
                                    draggable
                                    onDragStart={() => handleDragStart(index)}
                                    onDragEnd={handleDragEnd}
                                >
                                    <button
                                        type="button"
                                        className="block-delete"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            deleteBlock(index);
                                        }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                    <BlockView block={cell} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </main>
        </div>
    );
};


