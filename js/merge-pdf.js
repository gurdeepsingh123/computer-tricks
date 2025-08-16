document.addEventListener('DOMContentLoaded', () => {
    const pdfInput = document.getElementById('pdf-input');
    const fileList = document.getElementById('file-list');
    const mergeBtn = document.getElementById('merge-btn');
    const downloadBtn = document.getElementById('download-btn');
    const status = document.getElementById('status');

    let selectedFiles = [];

    pdfInput.addEventListener('change', (e) => {
        selectedFiles = Array.from(e.target.files);
        fileList.innerHTML = ''; // Clear previous list
        selectedFiles.forEach(file => {
            const listItem = document.createElement('li');
            listItem.textContent = file.name;
            fileList.appendChild(listItem);
        });
        downloadBtn.style.display = 'none';
    });

    mergeBtn.addEventListener('click', async () => {
        if (selectedFiles.length < 2) {
            alert('Please select at least two PDF files to merge.');
            return;
        }

        status.textContent = 'Merging... Please wait.';
        mergeBtn.disabled = true;

        try {
            const { PDFDocument } = PDFLib;
            const mergedPdf = await PDFDocument.create();

            for (const file of selectedFiles) {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => {
                    mergedPdf.addPage(page);
                });
            }

            const mergedPdfBytes = await mergedPdf.save();
            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            downloadBtn.href = url;
            downloadBtn.style.display = 'inline-block';
            status.textContent = 'Merge complete! Click the download button.';

        } catch (error) {
            console.error('Error merging PDFs:', error);
            status.textContent = 'An error occurred while merging the PDFs.';
            alert('An error occurred. Please make sure all selected files are valid PDFs.');
        } finally {
            mergeBtn.disabled = false;
        }
    });
});
