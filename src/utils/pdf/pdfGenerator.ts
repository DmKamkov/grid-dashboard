import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PDF_CONFIG } from '../../constants';

/**
 * Generates a PDF from the dashboard element with all graphs visible
 * @param elementId - The ID of the element to capture (default: 'dashboard-content')
 * @param showLoadingIndicator - Whether to show loading indicator (default: true)
 * @returns Promise that resolves when PDF is generated
 */
export async function generatePDF(
    elementId: string = 'dashboard-content',
    showLoadingIndicator: boolean = true
): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Element with id "${elementId}" not found`);
    }

    // Show loading indicator if requested
    if (showLoadingIndicator) {
        const loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'pdf-loading';
        loadingIndicator.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
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
    }

    try {
        // Wait a bit to ensure all charts are rendered and visible
        // (Theme switching is handled by the calling component)
        await new Promise(resolve => setTimeout(resolve, 500));

        // Get block positions BEFORE capturing to prevent splitting blocks across pages
        const blocks: Array<{ top: number; bottom: number; height: number }> = [];
        const blockElements = element.querySelectorAll('.block');
        const elementRect = element.getBoundingClientRect();
        
        blockElements.forEach((block) => {
            const blockRect = block.getBoundingClientRect();
            const relativeTop = blockRect.top - elementRect.top;
            const relativeBottom = blockRect.bottom - elementRect.top;
            blocks.push({
                top: relativeTop,
                bottom: relativeBottom,
                height: relativeBottom - relativeTop,
            });
        });

        // Configure html2canvas to capture charts properly
        const canvas = await html2canvas(element, {
            scale: PDF_CONFIG.SCALE,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            allowTaint: false,
            imageTimeout: PDF_CONFIG.TIMEOUT,
            onclone: (clonedDoc) => {
                // Set white background for PDF generation
                const appRoot = clonedDoc.querySelector('.app-root');
                if (appRoot) {
                    (appRoot as HTMLElement).style.backgroundColor = '#ffffff';
                }
                
                const canvasWrapper = clonedDoc.querySelector('.canvas-wrapper');
                if (canvasWrapper) {
                    (canvasWrapper as HTMLElement).style.background = '#ffffff';
                }
                
                // Ensure charts are visible in the cloned document
                const clonedElement = clonedDoc.getElementById(elementId);
                if (clonedElement) {
                    // Force visibility of all chart canvases
                    const chartCanvases = clonedElement.querySelectorAll('canvas');
                    chartCanvases.forEach((canvas) => {
                        (canvas as HTMLCanvasElement).style.display = 'block';
                    });

                    // Remove borders and make empty cells invisible while keeping grid structure
                    const cells = clonedElement.querySelectorAll('.canvas-cell');
                    cells.forEach((cell) => {
                        const htmlCell = cell as HTMLElement;
                        
                        // Remove all borders from all cells
                        htmlCell.style.border = 'none';
                        htmlCell.style.boxShadow = 'none';
                        
                        // Make empty cells completely invisible (transparent background)
                        if (cell.classList.contains('cell-empty')) {
                            htmlCell.style.background = 'transparent';
                        } else {
                            // Keep filled cells visible but remove borders
                            htmlCell.style.background = 'transparent';
                        }
                    });

                    // Hide delete buttons in PDF
                    const deleteButtons = clonedElement.querySelectorAll('.block-delete');
                    deleteButtons.forEach((btn) => {
                        (btn as HTMLElement).style.display = 'none';
                    });

                    // Hide chart type selectors in PDF
                    const chartTypeSelectors = clonedElement.querySelectorAll('.block-type-selector');
                    chartTypeSelectors.forEach((selector) => {
                        (selector as HTMLElement).style.display = 'none';
                    });
                }
            },
        });

        // Calculate PDF dimensions
        const imgWidth = PDF_CONFIG.PAGE_SIZE.WIDTH;
        const pageHeight = PDF_CONFIG.PAGE_SIZE.HEIGHT;
        const canvasScale = PDF_CONFIG.SCALE;
        const scaleX = imgWidth / canvas.width;
        const scaleY = scaleX; // Maintain aspect ratio
        
        // Convert block positions from DOM pixels to canvas pixels
        // html2canvas uses scale: 2, so canvas is 2x the DOM size
        const blocksInCanvas = blocks.map(block => ({
            top: block.top * canvasScale,
            bottom: block.bottom * canvasScale,
            height: block.height * canvasScale,
        }));

        // Create PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        let currentY = 0;

        // Add "DASHBOARD" title at the beginning
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        pdf.text('DASHBOARD', 105, 20, { align: 'center' });

        currentY = 30;

        // Add dashboard image with smart page breaks
        let imageY = currentY;
        let sourceY = 0; // Source Y position in canvas (pixels)
        
        while (sourceY < canvas.height) {
            // Calculate how much we can fit on current page (in canvas pixels)
            const remainingPageSpace = pageHeight - imageY;
            let maxSourceHeightPixels = remainingPageSpace / scaleY;
            
            // Check all blocks to ensure none are split
            for (const block of blocksInCanvas) {
                // If block would be split by the current page break
                const pageBreakY = sourceY + maxSourceHeightPixels;
                if (block.top < pageBreakY && block.bottom > pageBreakY) {
                    // Block would be split - adjust page break to before this block
                    // But only if block hasn't started yet on this page
                    if (block.top >= sourceY) {
                        // Block starts on this page - ensure entire block fits
                        const blockEndInMM = imageY + (block.bottom - sourceY) * scaleY;
                        if (blockEndInMM > pageHeight) {
                            // Block doesn't fit - start new page before this block
                            maxSourceHeightPixels = block.top - sourceY;
                        }
                    } else {
                        // Block started before this page - ensure it ends on this page
                        const blockEndInMM = imageY + (block.bottom - sourceY) * scaleY;
                        if (blockEndInMM > pageHeight) {
                            // Block would be split - limit to end of page
                            maxSourceHeightPixels = (pageHeight - imageY) / scaleY;
                        }
                    }
                }
            }
            
            // Ensure we don't exceed canvas bounds
            const heightToAdd = Math.max(0, Math.min(maxSourceHeightPixels, canvas.height - sourceY));
            
            if (heightToAdd <= 0) break;
            
            const heightInMM = heightToAdd * scaleY;
            
            // Create a temporary canvas for this page section
            const pageCanvas = document.createElement('canvas');
            pageCanvas.width = canvas.width;
            pageCanvas.height = Math.ceil(heightToAdd);
            const ctx = pageCanvas.getContext('2d');
            
            if (ctx) {
                ctx.drawImage(
                    canvas,
                    0, sourceY, canvas.width, heightToAdd, // Source
                    0, 0, canvas.width, heightToAdd // Destination
                );
                
                const pageImgData = pageCanvas.toDataURL('image/png');
                pdf.addImage(pageImgData, 'PNG', 0, imageY, imgWidth, heightInMM);
            }
            
            sourceY += heightToAdd;
            
            // If there's more content, add a new page
            if (sourceY < canvas.height) {
                pdf.addPage();
                imageY = 0;
            }
        }

        // Save the PDF
        const fileName = `Dashboard_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(fileName);
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
    } finally {
        // Remove loading indicator only if we created it
        if (showLoadingIndicator) {
            const loadingEl = document.getElementById('pdf-loading');
            if (loadingEl) {
                loadingEl.remove();
            }
        }
    }
}
