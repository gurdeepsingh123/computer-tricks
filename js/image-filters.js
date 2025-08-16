document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('image-input');
    const filterButtons = document.querySelectorAll('.filter-buttons .btn');
    const downloadBtn = document.getElementById('download-btn');
    const canvas = document.getElementById('filter-canvas');
    const ctx = canvas.getContext('2d');

    let originalImage = null;
    let originalFileName = 'filtered-image.png';

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        originalFileName = file.name;
        const reader = new FileReader();

        reader.onload = (event) => {
            originalImage = new Image();
            originalImage.onload = () => {
                canvas.width = originalImage.width;
                canvas.height = originalImage.height;
                ctx.filter = 'none';
                ctx.drawImage(originalImage, 0, 0);
                downloadBtn.style.display = 'none';
            };
            originalImage.src = event.target.result;
        };

        reader.readAsDataURL(file);
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (!originalImage) {
                alert('Please upload an image first.');
                return;
            }

            const filter = e.target.dataset.filter;
            applyFilter(filter);
        });
    });

    function applyFilter(filter) {
        ctx.filter = filter;
        ctx.drawImage(originalImage, 0, 0); // Redraw image with the new filter

        const dataUrl = canvas.toDataURL('image/png');
        downloadBtn.href = dataUrl;
        downloadBtn.download = `filtered-${originalFileName}`;
        downloadBtn.style.display = 'inline-block';
    }
});
