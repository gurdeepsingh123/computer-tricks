document.addEventListener('DOMContentLoaded', () => {
    const pdfInput = document.getElementById('pdf-input');
    const splitBtn = document.getElementById('split-btn');
    const status = document.getElementById('status');
    const downloadLinksContainer = document.getElementById('download-links');

    let selectedFile = null;

    pdfInput.addEventListener('change', (e) => {
        selectedFile = e.target.files[0];
        if (selectedFile) {
            status.textContent = `File selected: ${selectedFile.name}`;
            downloadLinksContainer.innerHTML = ''; // Clear previous links
        }
    });

    splitBtn.addEventListener('click', async () => {
        if (!selectedFile) {
            alert('Please select a PDF file to split.');
            return;
        }

        status.textContent = 'Splitting... Please wait.';
        splitBtn.disabled = true;
        downloadLinksContainer.innerHTML = '';

        try {
            const { PDFDocument } = PDFLib;
            const originalFileName = selectedFile.name.replace(/\.pdf$/i, '');
            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pageCount = pdfDoc.getPageCount();

            for (let i = 0; i < pageCount; i++) {
                // Create a new document for each page
                const newDoc = await PDFDocument.create();
                const [copiedPage] = await newDoc.copyPages(pdfDoc, [i]);
                newDoc.addPage(copiedPage);

                const pdfBytes = await newDoc.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = `${originalFileName}-page-${i + 1}.pdf`;
                a.textContent = `Download Page ${i + 1}`;
                downloadLinksContainer.appendChild(a);
            }

            status.textContent = `Splitting complete. ${pageCount} pages were created.`;

        } catch (error) {
            console.error('Error splitting PDF:', error);
            status.textContent = 'An error occurred while splitting the PDF.';
            alert('An error occurred. Please make sure the selected file is a valid PDF.');
        } finally {
            splitBtn.disabled = false;
        }
    });
});
