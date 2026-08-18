// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let zoomLevel = 1;

const pdfFile = 'Loup-Garou_Minecraft_Documentation.pdf';

// Get all DOM elements
const pdfRender = document.getElementById('pdf-render');
const pageNumInput = document.getElementById('page-num');
const pageCountSpan = document.getElementById('page-count');
const prevBtn = document.getElementById('prev-page');
const nextBtn = document.getElementById('next-page');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const zoomLevelSpan = document.getElementById('zoom-level');
const loadingDiv = document.getElementById('loading');
const fullscreenBtn = document.getElementById('fullscreen');

// Commands to highlight
const COMMANDS = ['/lg join', '/jukebox', '/lg ready'];

// Render page
function renderPage(num) {
    pageRendering = true;
    loadingDiv.style.display = 'block';

    pdfDoc.getPage(num).then(page => {
        const scale = zoomLevel;
        const viewport = page.getViewport({ scale: scale });

        // Create canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        page.render(renderContext).promise.then(() => {
            // Extract and highlight text
            page.getTextContent().then(textContent => {
                highlightCommandsOnCanvas(context, textContent, viewport, canvas);
                
                pdfRender.innerHTML = '';
                pdfRender.appendChild(canvas);
                pageRendering = false;
                loadingDiv.style.display = 'none';

                if (pageNumPending !== null) {
                    pageNum = pageNumPending;
                    pageNumPending = null;
                    renderPage(pageNum);
                }
            });
        });
    });
}

// Highlight commands on canvas
function highlightCommandsOnCanvas(context, textContent, viewport, canvas) {
    // Save original context state
    const originalFillStyle = context.fillStyle;
    
    // Find text items containing commands
    textContent.items.forEach(item => {
        COMMANDS.forEach(command => {
            if (item.str.includes(command)) {
                // Highlight with green glow effect
                context.fillStyle = '#00FF00';
                context.shadowColor = 'rgba(0, 255, 0, 0.8)';
                context.shadowBlur = 10;
                
                // Draw highlight rectangle
                const padding = 2;
                context.fillRect(
                    item.transform[4] - padding,
                    item.transform[5] - padding,
                    item.width + (padding * 2),
                    item.height + (padding * 2)
                );
                
                // Restore original text
                context.fillStyle = originalFillStyle;
                context.shadowColor = 'transparent';
            }
        });
    });
    
    // Restore original context state
    context.fillStyle = originalFillStyle;
}

// Queue page rendering
function queueRenderPage(num) {
    if (num < 1 || num > pdfDoc.numPages) {
        return;
    }

    if (pageRendering) {
        pageNumPending = num;
    } else {
        pageNum = num;
        renderPage(pageNum);
    }

    pageNumInput.value = pageNum;
}

// Previous page
prevBtn.addEventListener('click', () => {
    if (pageNum > 1) {
        queueRenderPage(pageNum - 1);
    }
});

// Next page
nextBtn.addEventListener('click', () => {
    if (pageNum < pdfDoc.numPages) {
        queueRenderPage(pageNum + 1);
    }
});

// Go to page
pageNumInput.addEventListener('change', (e) => {
    const num = parseInt(e.target.value);
    if (!isNaN(num)) {
        queueRenderPage(num);
    }
});

// Zoom in
zoomInBtn.addEventListener('click', () => {
    zoomLevel += 0.25;
    if (zoomLevel > 3) zoomLevel = 3;
    updateZoom();
    queueRenderPage(pageNum);
});

// Zoom out
zoomOutBtn.addEventListener('click', () => {
    zoomLevel -= 0.25;
    if (zoomLevel < 0.5) zoomLevel = 0.5;
    updateZoom();
    queueRenderPage(pageNum);
});

// Update zoom display
function updateZoom() {
    zoomLevelSpan.textContent = Math.round(zoomLevel * 100) + '%';
}

// Fullscreen
fullscreenBtn.addEventListener('click', () => {
    const pdfViewer = document.querySelector('.pdf-viewer-container');
    if (!document.fullscreenElement) {
        pdfViewer.requestFullscreen().catch(err => {
            alert('Erreur mode plein écran: ' + err.message);
        });
    } else {
        document.exitFullscreen();
    }
});

// Load PDF
pdfjsLib.getDocument(pdfFile).promise.then(doc => {
    pdfDoc = doc;
    pageCountSpan.textContent = '/ ' + pdfDoc.numPages;
    pageNumInput.max = pdfDoc.numPages;

    // Render first page
    renderPage(pageNum);
    loadingDiv.style.display = 'none';

    console.log('PDF chargé avec succès - ' + pdfDoc.numPages + ' pages');
    console.log('Commandes mises en évidence:', COMMANDS);
}).catch(error => {
    console.error('Erreur au chargement du PDF:', error);
    loadingDiv.textContent = 'Erreur au chargement du PDF. Vérifiez que le fichier existe.';
    loadingDiv.style.color = '#FF0000';
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && pageNum > 1) {
        queueRenderPage(pageNum - 1);
    } else if (e.key === 'ArrowRight' && pageNum < pdfDoc.numPages) {
        queueRenderPage(pageNum + 1);
    } else if (e.key === '+' || e.key === '=') {
        zoomLevel += 0.25;
        if (zoomLevel > 3) zoomLevel = 3;
        updateZoom();
        queueRenderPage(pageNum);
    } else if (e.key === '-') {
        zoomLevel -= 0.25;
        if (zoomLevel < 0.5) zoomLevel = 0.5;
        updateZoom();
        queueRenderPage(pageNum);
    }
});

// Initialize zoom
updateZoom();