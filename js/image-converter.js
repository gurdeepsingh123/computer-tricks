document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('image-input');
    const formatSelect = document.getElementById('format-select');
    const convertBtn = document.getElementById('convert-btn');
    const downloadBtn = document.getElementById('download-btn');
    const previewContainer = document.getElementById('preview');
    const canvas = document.getElementById('convert-canvas');
    const ctx = canvas.getContext('2d');

    let originalImage = null;
    let originalFileName = '';

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

                // Set canvas dimensions to original image size
                canvas.width = originalImage.width;
                canvas.height = originalImage.height;
            };
            originalImage.src = event.target.result;
        };

        reader.readAsDataURL(file);
        downloadBtn.style.display = 'none';
    });

    convertBtn.addEventListener('click', () => {
        if (!originalImage) {
            alert('Please upload an image first.');
            return;
        }

        // Draw image on canvas
        ctx.drawImage(originalImage, 0, 0);

        const format = formatSelect.value;
        const mimeType = `image/${format}`;
        const dataUrl = canvas.toDataURL(mimeType);

        // Set download link
        const newFileName = originalFileName.replace(/\.[^/.]+$/, `.${format}`);
        downloadBtn.href = dataUrl;
        downloadBtn.download = newFileName;
        downloadBtn.style.display = 'inline-block';
    });
});
