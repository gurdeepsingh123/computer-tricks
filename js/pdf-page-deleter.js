document.addEventListener('DOMContentLoaded', () => {
    const pdfInput = document.getElementById('pdf-input');
    const previewContainer = document.getElementById('preview-container');
    const deleteBtn = document.getElementById('delete-btn');
    const downloadBtn = document.getElementById('download-btn');
    const status = document.getElementById('status');

    // Set up pdf.js worker
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
            status.textContent = `PDF loaded. ${pdf.numPages} pages found. Click pages to select for deletion.`;

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 0.5 });

                const wrapper = document.createElement('div');
                wrapper.className = 'page-preview';
                wrapper.dataset.pageIndex = i - 1;

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

                wrapper.addEventListener('click', () => {
                    wrapper.classList.toggle('selected');
                });

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                await page.render(renderContext).promise;
            }
        } catch (error) {
            status.textContent = 'Error loading PDF.';
            alert('Could not load the PDF file. It may be corrupt or invalid.');
            console.error(error);
        }
    });

    deleteBtn.addEventListener('click', async () => {
        if (!pdfFileBuffer) {
            alert('Please upload a PDF file first.');
            return;
        }

        const selectedPages = document.querySelectorAll('.page-preview.selected');
        if (selectedPages.length === 0) {
            alert('Please select pages to delete by clicking on them.');
            return;
        }

        status.textContent = 'Deleting pages...';
        deleteBtn.disabled = true;

        try {
            const { PDFDocument } = PDFLib;
            const pdfDoc = await PDFDocument.load(pdfFileBuffer);

            const indicesToDelete = Array.from(selectedPages)
                .map(p => parseInt(p.dataset.pageIndex))
                .sort((a, b) => b - a); // Sort in descending order

            indicesToDelete.forEach(index => {
                pdfDoc.removePage(index);
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            downloadBtn.href = url;
            downloadBtn.download = `deleted-${pdfInput.files[0].name}`;
            downloadBtn.style.display = 'inline-block';
            status.textContent = 'Deletion complete! Click the download button.';

        } catch (error) {
            status.textContent = 'An error occurred during deletion.';
            console.error('Error deleting pages:', error);
        } finally {
            deleteBtn.disabled = false;
        }
    });
});
