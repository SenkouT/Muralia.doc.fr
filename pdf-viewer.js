// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let zoomLevel = 1;

const pdfFile = 'Loup-Garou_Minecraft_Documentation.pdf';

// Get DOM elements
const pdfRender = document.getElementById('pdf-render');
const pageNumInput = document.getElementById('page-num');
const pageCountSpan = document.getElementById('page-count');
const prevBtn = document.getElementById('prev-page');
const nextBtn = document.getElementById('next-page');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const zoomLevelSpan = document.getElementById('zoom-level');
const loadingDiv = document.getElementById('loading');

// Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const navSidebar = document.getElementById('nav-sidebar');
const navBtns = document.querySelectorAll('.nav-btn');
const docTab = document.getElementById('doc-tab');
const boutiqueTab = document.getElementById('boutique-tab');

// Menu burger toggle
menuToggle.addEventListener('click', () => {
    navSidebar.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.menu-burger') && !e.target.closest('.nav-sidebar')) {
        navSidebar.classList.remove('active');
    }
});

// Tab switching
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Show selected tab
        const tabId = btn.getAttribute('data-tab');
        if (tabId === 'doc') {
            docTab.classList.add('active');
            // Render PDF page when switching to doc tab
            if (pdfDoc) {
                renderPage(pageNum);
            }
        } else if (tabId === 'boutique') {
            boutiqueTab.classList.add('active');
        }

        // Close menu
        navSidebar.classList.remove('active');
    });
});

// Render page
function renderPage(num) {
    pageRendering = true;
    loadingDiv.style.display = 'block';

    pdfDoc.getPage(num).then(page => {
        const scale = zoomLevel;
        const viewport = page.getViewport({ scale: scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        page.render({
            canvasContext: context,
            viewport: viewport
        }).promise.then(() => {
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

// Load PDF
pdfjsLib.getDocument(pdfFile).promise.then(doc => {
    pdfDoc = doc;
    pageCountSpan.textContent = '/ ' + pdfDoc.numPages;
    pageNumInput.max = pdfDoc.numPages;
    renderPage(pageNum);
    loadingDiv.style.display = 'none';
}).catch(error => {
    console.error('Erreur au chargement du PDF:', error);
    loadingDiv.textContent = 'Erreur au chargement du PDF';
    loadingDiv.style.color = '#FF0000';
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (!pdfDoc) return;
    
    if (e.key === 'ArrowLeft' && pageNum > 1) {
        queueRenderPage(pageNum - 1);
    } else if (e.key === 'ArrowRight' && pageNum < pdfDoc.numPages) {
        queueRenderPage(pageNum + 1);
    }
});

updateZoom();