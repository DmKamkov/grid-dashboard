import React, { useState, useEffect } from 'react';
import { FileDown, X } from 'lucide-react';
import { generatePDF } from '../../utils/pdf/pdfGenerator';
import { useTheme } from '../../hooks';
import type { PDFTemplateData, Theme } from '../../types';
import './PDFTemplateForm.css';

interface PDFTemplateFormProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PDFTemplateForm: React.FC<PDFTemplateFormProps> = ({ isOpen, onClose }) => {
    const { theme: currentTheme, setTheme } = useTheme();
    const [formData, setFormData] = useState<PDFTemplateData>({
        title: '',
        date: new Date().toLocaleDateString(),
        notes: '',
        theme: currentTheme,
    });
    const [isGenerating, setIsGenerating] = useState(false);

    // Sync theme when modal opens or current theme changes
    useEffect(() => {
        if (isOpen) {
            setFormData((prev) => ({ ...prev, theme: currentTheme }));
        }
    }, [isOpen, currentTheme]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);

        const dashboardElement = document.getElementById('dashboard-content');
        const appRootElement = document.querySelector('.app-root');
        const originalTheme = currentTheme;
        let dashboardWasHidden = false;
        let appRootWasHidden = false;

        // Create and show loading overlay FIRST to cover any visual changes
        const loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'pdf-loading';
        loadingIndicator.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            color: white;
            font-size: 18px;
            font-family: system-ui, sans-serif;
        `;
        loadingIndicator.textContent = 'Generating PDF...';
        document.body.appendChild(loadingIndicator);

        // Small delay to ensure overlay is rendered
        await new Promise(resolve => setTimeout(resolve, 50));

        try {
            // Hide dashboard content before theme change to prevent visible color change
            // The loading overlay already covers it, but we hide it as extra protection
            if (dashboardElement) {
                dashboardElement.style.opacity = '0';
                dashboardElement.style.pointerEvents = 'none';
                dashboardWasHidden = true;
            }
            if (appRootElement) {
                (appRootElement as HTMLElement).style.opacity = '0';
                appRootWasHidden = true;
            }

            // Small delay to ensure hiding is complete
            await new Promise(resolve => setTimeout(resolve, 50));

            // Temporarily switch theme if different from current
            if (formData.theme && formData.theme !== currentTheme) {
                setTheme(formData.theme);
                // Wait for theme to apply and components to re-render
                await new Promise(resolve => setTimeout(resolve, 400));
            }

            // Temporarily restore opacity for html2canvas capture
            // (html2canvas needs to see the element, but user won't see it due to loading overlay)
            if (dashboardElement && dashboardWasHidden) {
                dashboardElement.style.opacity = '1';
            }
            if (appRootElement && appRootWasHidden) {
                (appRootElement as HTMLElement).style.opacity = '1';
            }
            await new Promise(resolve => setTimeout(resolve, 50));

            await generatePDF('dashboard-content', formData, false); // Pass false to skip loading overlay creation

            // Hide again after capture (before theme restore)
            if (dashboardElement && dashboardWasHidden) {
                dashboardElement.style.opacity = '0';
            }
            if (appRootElement && appRootWasHidden) {
                (appRootElement as HTMLElement).style.opacity = '0';
            }

            // Restore original theme if it was changed
            if (formData.theme && formData.theme !== originalTheme) {
                setTheme(originalTheme);
                // Wait for theme to restore
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            onClose();
            // Reset form
            setFormData({
                title: '',
                date: new Date().toLocaleDateString(),
                notes: '',
                theme: currentTheme,
            });
        } catch (error) {
            console.error('Error generating PDF:', error);
            // Restore original theme on error
            if (formData.theme && formData.theme !== originalTheme) {
                setTheme(originalTheme);
            }
        } finally {
            // Remove loading overlay
            const loadingEl = document.getElementById('pdf-loading');
            if (loadingEl) {
                loadingEl.remove();
            }

            // Always restore visibility
            if (dashboardElement && dashboardWasHidden) {
                dashboardElement.style.opacity = '';
                dashboardElement.style.pointerEvents = '';
            }
            if (appRootElement && appRootWasHidden) {
                (appRootElement as HTMLElement).style.opacity = '';
            }
            setIsGenerating(false);
        }
    };

    const handleChange = (field: keyof PDFTemplateData, value: string | Theme) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    if (!isOpen) return null;

    return (
        <div className="pdf-modal-overlay" onClick={onClose}>
            <div className="pdf-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="pdf-modal-header">
                    <h2 className="pdf-modal-title">Generate PDF Template</h2>
                    <button
                        type="button"
                        className="pdf-modal-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="pdf-form">
                    <div className="pdf-form-group">
                        <label htmlFor="pdf-title" className="pdf-form-label">
                            Title
                        </label>
                        <input
                            id="pdf-title"
                            type="text"
                            className="pdf-form-input"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="Enter dashboard title"
                        />
                    </div>

                    <div className="pdf-form-group">
                        <label htmlFor="pdf-date" className="pdf-form-label">
                            Date
                        </label>
                        <input
                            id="pdf-date"
                            type="text"
                            className="pdf-form-input"
                            value={formData.date}
                            onChange={(e) => handleChange('date', e.target.value)}
                            placeholder="Enter date"
                        />
                    </div>

                    <div className="pdf-form-group">
                        <label htmlFor="pdf-notes" className="pdf-form-label">
                            Notes
                        </label>
                        <textarea
                            id="pdf-notes"
                            className="pdf-form-textarea"
                            value={formData.notes}
                            onChange={(e) => handleChange('notes', e.target.value)}
                            placeholder="Enter additional notes or comments"
                            rows={4}
                        />
                    </div>

                    <div className="pdf-form-group">
                        <label className="pdf-form-label">Theme</label>
                        <div className="pdf-theme-selector">
                            <label className="pdf-theme-option">
                                <input
                                    type="radio"
                                    name="pdf-theme"
                                    value="light"
                                    checked={formData.theme === 'light'}
                                    onChange={(e) => handleChange('theme', e.target.value as Theme)}
                                />
                                <span>Light</span>
                            </label>
                            <label className="pdf-theme-option">
                                <input
                                    type="radio"
                                    name="pdf-theme"
                                    value="dark"
                                    checked={formData.theme === 'dark'}
                                    onChange={(e) => handleChange('theme', e.target.value as Theme)}
                                />
                                <span>Dark</span>
                            </label>
                        </div>
                    </div>

                    <div className="pdf-form-actions">
                        <button
                            type="button"
                            className="pdf-btn pdf-btn-secondary"
                            onClick={onClose}
                            disabled={isGenerating}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="pdf-btn pdf-btn-primary"
                            disabled={isGenerating}
                        >
                            <FileDown size={16} />
                            {isGenerating ? 'Generating...' : 'Generate PDF'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
