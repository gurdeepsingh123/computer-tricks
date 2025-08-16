document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('image-input');
    const qualitySlider = document.getElementById('quality-slider');
    const qualityValue = document.getElementById('quality-value');
    const compressBtn = document.getElementById('compress-btn');
    const downloadBtn = document.getElementById('download-btn');
    const previewContainer = document.getElementById('preview');
    const sizeInfo = document.getElementById('size-info');
    const canvas = document.getElementById('compress-canvas');
    const ctx = canvas.getContext('2d');

    let originalImage = null;
    let originalFileName = 'compressed-image.jpg';
    let originalFileSize = 0;

    // Update quality value display
    qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = qualitySlider.value;
    });

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        originalFileName = file.name.replace(/\.[^/.]+$/, "") + '.jpg'; // Output will be jpg
        originalFileSize = file.size;
        const reader = new FileReader();

        reader.onload = (event) => {
            originalImage = new Image();
            originalImage.onload = () => {
                previewContainer.innerHTML = ''; // Clear preview text
                const previewImage = new Image();
                previewImage.src = event.target.result;
                previewContainer.appendChild(previewImage);

                // Set canvas dimensions to original image size
                canvas.width = originalImage.width;
                canvas.height = originalImage.height;
            };
            originalImage.src = event.target.result;
        };

        reader.readAsDataURL(file);
        downloadBtn.style.display = 'none';
        sizeInfo.style.display = 'none';
    });

    compressBtn.addEventListener('click', () => {
        if (!originalImage) {
            alert('Please upload an image first.');
            return;
        }

        // Draw image on canvas
        ctx.drawImage(originalImage, 0, 0);

        const quality = parseFloat(qualitySlider.value);

        // Get data URL with specified quality for JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', quality);

        // Set download link
        downloadBtn.href = dataUrl;
        downloadBtn.download = originalFileName;
        downloadBtn.style.display = 'inline-block';

        // Calculate and display file sizes
        const compressedSizeBytes = atob(dataUrl.split(',')[1]).length;
        const originalSizeKB = (originalFileSize / 1024).toFixed(2);
        const compressedSizeKB = (compressedSizeBytes / 1024).toFixed(2);

        sizeInfo.innerHTML = `Original size: <strong>${originalSizeKB} KB</strong> | Compressed size: <strong>${compressedSizeKB} KB</strong>`;
        sizeInfo.style.display = 'block';
    });
});
