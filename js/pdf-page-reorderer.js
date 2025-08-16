document.addEventListener('DOMContentLoaded', () => {
    const pdfInput = document.getElementById('pdf-input');
    const previewContainer = document.getElementById('preview-container');
    const saveBtn = document.getElementById('save-btn');
    const downloadBtn = document.getElementById('download-btn');
    const status = document.getElementById('status');

    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';

    let pdfFileBuffer = null;

    pdfInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        status.textContent = 'Loading PDF...';
        previewContainer.innerHTML = '';
        downloadBtn.style.display = 'none';

        pdfFileBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument(pdfFileBuffer);

        try {
            const pdf = await loadingTask.promise;
            status.textContent = `PDF loaded. ${pdf.numPages} pages found. Drag to reorder.`;

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 0.5 });

                const wrapper = document.createElement('div');
                wrapper.className = 'page-preview';
                wrapper.dataset.originalPageIndex = i - 1;

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const pageNumber = document.createElement('div');
                pageNumber.className = 'page-number';
                pageNumber.textContent = i;

                wrapper.appendChild(canvas);
                wrapper.appendChild(pageNumber);
                previewContainer.appendChild(wrapper);

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                await page.render(renderContext).promise;
            }

            // Initialize SortableJS
            new Sortable(previewContainer, {
                animation: 150,
                ghostClass: 'sortable-ghost'
            });

        } catch (error) {
            status.textContent = 'Error loading PDF.';
            alert('Could not load the PDF file. It may be corrupt or invalid.');
            console.error(error);
        }
    });

    saveBtn.addEventListener('click', async () => {
        if (!pdfFileBuffer) {
            alert('Please upload a PDF file first.');
            return;
        }

        status.textContent = 'Reordering pages...';
        saveBtn.disabled = true;

        try {
            const { PDFDocument } = PDFLib;
            const pdfDoc = await PDFDocument.load(pdfFileBuffer);
            const newPdfDoc = await PDFDocument.create();

            const reorderedPageElements = previewContainer.querySelectorAll('.page-preview');
            const originalIndices = Array.from(reorderedPageElements).map(el => parseInt(el.dataset.originalPageIndex));

            const copiedPages = await newPdfDoc.copyPages(pdfDoc, originalIndices);
            copiedPages.forEach(page => newPdfDoc.addPage(page));

            const pdfBytes = await newPdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            downloadBtn.href = url;
            downloadBtn.download = `reordered-${pdfInput.files[0].name}`;
            downloadBtn.style.display = 'inline-block';
            status.textContent = 'Reordering complete! Click the download button.';

        } catch (error) {
            status.textContent = 'An error occurred during reordering.';
            console.error('Error reordering pages:', error);
        } finally {
            saveBtn.disabled = false;
        }
    });
});
