document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('image-input');
    const widthInput = document.getElementById('width-input');
    const heightInput = document.getElementById('height-input');
    const resizeBtn = document.getElementById('resize-btn');
    const downloadBtn = document.getElementById('download-btn');
    const previewContainer = document.getElementById('preview');
    const canvas = document.getElementById('resize-canvas');
    const ctx = canvas.getContext('2d');

    let originalImage = null;
    let originalFileName = 'resized-image.png';

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        originalFileName = file.name;
        const reader = new FileReader();

        reader.onload = (event) => {
            originalImage = new Image();
            originalImage.onload = () => {
                previewContainer.innerHTML = ''; // Clear preview text
                const previewImage = new Image();
                previewImage.src = event.target.result;
                previewContainer.appendChild(previewImage);

                // Populate dimensions with original size
                widthInput.value = originalImage.width;
                heightInput.value = originalImage.height;
            };
            originalImage.src = event.target.result;
        };

        reader.readAsDataURL(file);
        downloadBtn.style.display = 'none';
    });

    resizeBtn.addEventListener('click', () => {
        if (!originalImage) {
            alert('Please upload an image first.');
            return;
        }

        const width = parseInt(widthInput.value);
        const height = parseInt(heightInput.value);

        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
            alert('Please enter valid width and height.');
            return;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw image on canvas
        ctx.drawImage(originalImage, 0, 0, width, height);

        // Get data URL
        const dataUrl = canvas.toDataURL('image/png');

        // Set download link
        downloadBtn.href = dataUrl;
        downloadBtn.download = `resized-${originalFileName}`;
        downloadBtn.style.display = 'inline-block';
    });
});
