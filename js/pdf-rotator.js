document.addEventListener('DOMContentLoaded', () => {
    const pdfInput = document.getElementById('pdf-input');
    const pagesInput = document.getElementById('pages-input');
    const angleSelect = document.getElementById('angle-select');
    const rotateBtn = document.getElementById('rotate-btn');
    const downloadBtn = document.getElementById('download-btn');
    const status = document.getElementById('status');

    let selectedFile = null;

    pdfInput.addEventListener('change', (e) => {
        selectedFile = e.target.files[0];
        if (selectedFile) {
            status.textContent = `File selected: ${selectedFile.name}`;
            downloadBtn.style.display = 'none';
        }
    });

    // Function to parse page ranges like "1, 3, 5-7"
    function parsePageRanges(input, maxPages) {
        if (input.trim().toLowerCase() === 'all') {
            return Array.from({ length: maxPages }, (_, i) => i);
        }
        const indices = new Set();
        const parts = input.split(',');
        for (const part of parts) {
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(Number);
                for (let i = start; i <= end; i++) {
                    if (i > 0 && i <= maxPages) indices.add(i - 1);
                }
            } else {
                const pageNum = Number(part);
                if (pageNum > 0 && pageNum <= maxPages) indices.add(pageNum - 1);
            }
        }
        return Array.from(indices);
    }

    rotateBtn.addEventListener('click', async () => {
        if (!selectedFile) {
            alert('Please select a PDF file first.');
            return;
        }

        status.textContent = 'Rotating... Please wait.';
        rotateBtn.disabled = true;

        try {
            const { PDFDocument, degrees } = PDFLib;
            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pageCount = pdfDoc.getPageCount();

            const pagesToRotate = parsePageRanges(pagesInput.value, pageCount);
            if (pagesToRotate.length === 0) {
                throw new Error("No valid pages selected for rotation.");
            }

            const angle = parseInt(angleSelect.value);

            pagesToRotate.forEach(pageIndex => {
                const page = pdfDoc.getPage(pageIndex);
                const currentRotation = page.getRotation().angle;
                page.setRotation(degrees(currentRotation + angle));
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            downloadBtn.href = url;
            downloadBtn.download = `rotated-${selectedFile.name}`;
            downloadBtn.style.display = 'inline-block';
            status.textContent = 'Rotation complete! Click the download button.';

        } catch (error) {
            console.error('Error rotating PDF:', error);
            status.textContent = 'An error occurred during rotation.';
            alert(error.message || 'An error occurred. Please check the page numbers and ensure the file is a valid PDF.');
        } finally {
            rotateBtn.disabled = false;
        }
    });
});
