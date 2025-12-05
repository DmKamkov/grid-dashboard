import React, { useState, useEffect } from 'react';
import { Trash2, FileDown, LayoutGrid, LineChart, BarChart3, FileText, ChevronDown, PieChart, AreaChart, Target, Gauge, Image, X } from 'lucide-react';
import { useGrid } from '../hooks';
import { BlockView } from './blocks';
import { ThemeSwitcher } from './ThemeSwitcher';
import { generatePDF } from '../utils/pdf/pdfGenerator';
import type { BlockType } from '../types';

interface BlockOption {
    type: BlockType | 'pie' | 'area' | 'scatter' | 'gauge' | 'text-image';
    label: string;
    icon: React.ReactNode;
}

export const Dashboard: React.FC = () => {
    const { cells, addBlock, deleteBlock, moveBlock, changeBlockType } = useGrid();
    const [dragSourceIndex, setDragSourceIndex] = useState<number | null>(null);
    const [dragTargetIndex, setDragTargetIndex] = useState<number | null>(null);
    const [isCustomPanelOpen, setIsCustomPanelOpen] = useState(false);
    const [pinnedBlocks, setPinnedBlocks] = useState<BlockType[]>(['line', 'bar', 'text']);

    const allBlockOptions: BlockOption[] = [
        { type: 'line', label: 'Line Chart', icon: <LineChart size={20} /> },
        { type: 'bar', label: 'Bar Chart', icon: <BarChart3 size={20} /> },
        { type: 'text', label: 'Text Block', icon: <FileText size={20} /> },
        { type: 'pie', label: 'Pie Chart', icon: <PieChart size={20} /> },
        { type: 'area', label: 'Area Chart', icon: <AreaChart size={20} /> },
        { type: 'scatter', label: 'Scatter Plot', icon: <Target size={20} /> },
        { type: 'gauge', label: 'Gauge Chart', icon: <Gauge size={20} /> },
        { type: 'text-image', label: 'Text with Image', icon: <Image size={20} /> },
    ];

    const pinnedOptions = allBlockOptions.filter(opt => 
        pinnedBlocks.includes(opt.type as BlockType)
    );
    const availableOptions = allBlockOptions.filter(opt => 
        !pinnedBlocks.includes(opt.type as BlockType)
    );

    const togglePin = (blockType: BlockType | string) => {
        if (blockType === 'pie' || blockType === 'area' || blockType === 'scatter' || blockType === 'gauge' || blockType === 'text-image') {
            return;
        }
        
        const type = blockType as BlockType;
        setPinnedBlocks(prev => {
            if (prev.includes(type)) {
                if (prev.length > 1) {
                    return prev.filter(t => t !== type);
                }
                return prev;
            } else {
                return [...prev, type];
            }
        });
    };

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

    useEffect(() => {
        const hasBlocks = cells.some((cell) => cell !== null);
        
        if (!hasBlocks) {
            return;
        }

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [cells]);

    const handleExportPDF = async () => {
        try {
            await generatePDF('dashboard-content', true);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    return (
        <div className="app-root">
        <header className="app-header">
            <div className="app-header-top">
                <h1 className="app-title">DASHBOARD</h1>
                <ThemeSwitcher />
            </div>
            <div className="controls">
                {pinnedOptions.map((option) => {
                    const IconComponent = option.type === 'line' ? LineChart :
                                         option.type === 'bar' ? BarChart3 :
                                         FileText;
                    return (
                        <button 
                            key={option.type} 
                            type="button" 
                            onClick={() => addBlock(option.type as BlockType)}
                        >
                            <IconComponent size={16} />
                            Add {option.label}
                        </button>
                    );
                })}
                <button 
                    type="button" 
                    onClick={() => setIsCustomPanelOpen(!isCustomPanelOpen)}
                    className="blocks-selector-btn"
                    aria-label="Select Blocks"
                >
                    <ChevronDown size={16} />
                </button>
                <button 
                    type="button" 
                    onClick={handleExportPDF}
                    className="pdf-export-btn"
                >
                    <FileDown size={16} />
                    Export PDF
                </button>
            </div>
        </header>

        {isCustomPanelOpen && (
            <>
                <div className="custom-panel-overlay" onClick={() => setIsCustomPanelOpen(false)} />
                <div className="custom-panel">
                    <div className="custom-panel-header">
                        <h3 className="custom-panel-title">Pinned blocks</h3>
                        <button
                            type="button"
                            className="custom-panel-close"
                            onClick={() => setIsCustomPanelOpen(false)}
                            aria-label="Close"
                        >
                            <X size={16} />
                        </button>
                    </div>
                    <div className="custom-panel-content">
                        <div className="pinned-blocks-section">
                            <div className="blocks-row">
                                {pinnedOptions.map((option) => {
                                    const IconComponent = option.type === 'line' ? LineChart :
                                                         option.type === 'bar' ? BarChart3 :
                                                         FileText;
                                    return (
                                        <button
                                            key={option.type}
                                            type="button"
                                            className="block-option-btn block-option-pinned"
                                            onClick={() => togglePin(option.type)}
                                        >
                                            <IconComponent size={16} />
                                            {option.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="available-blocks-section">
                            <h4 className="section-title">
                                Available <span className="section-subtitle">(will be added in the future)</span>
                            </h4>
                            <div className="blocks-row">
                                {availableOptions.map((option) => {
                                    const IconComponent = option.type === 'line' ? LineChart :
                                                         option.type === 'bar' ? BarChart3 :
                                                         option.type === 'text' ? FileText :
                                                         option.type === 'pie' ? PieChart :
                                                         option.type === 'area' ? AreaChart :
                                                         option.type === 'scatter' ? Target :
                                                         option.type === 'gauge' ? Gauge :
                                                         Image;
                                    const isFutureBlock = option.type === 'pie' || option.type === 'area' || 
                                                         option.type === 'scatter' || option.type === 'gauge' || 
                                                         option.type === 'text-image';
                                    return (
                                        <button
                                            key={option.type}
                                            type="button"
                                            className="block-option-btn block-option-available"
                                            onClick={() => togglePin(option.type)}
                                            disabled={isFutureBlock}
                                        >
                                            <IconComponent size={16} />
                                            {option.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )}

        <main className="canvas-wrapper" id="dashboard-content">
            <div className="canvas-grid">
                {cells.map((cell, index) => {
                    const isDraggingFromHere = dragSourceIndex === index;
                    const isPotentialTarget = dragTargetIndex === index;
                    const isEmpty = cell === null;
                    const hasAnyBlocks = cells.some((c) => c !== null);
                    const isFirstEmptyCell = index === 0 && isEmpty && !hasAnyBlocks;

                    return (
                        <div
                            key={index}
                            className={[
                                'canvas-cell',
                                isEmpty ? 'cell-empty' : 'cell-filled',
                                isPotentialTarget ? 'cell-drop-target' : '',
                                isFirstEmptyCell ? 'cell-empty-state' : '',
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
                                    <BlockView block={cell} blockIndex={index} onChangeType={changeBlockType} />
                                </div>
                            )}
                            {isFirstEmptyCell && (
                                <div className="empty-state-message">
                                    <div className="empty-state-icon">
                                        <LayoutGrid size={48} />
                                    </div>
                                    <div className="empty-state-text">Add your first block</div>
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


