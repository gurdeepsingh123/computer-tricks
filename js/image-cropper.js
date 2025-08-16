document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('image-input');
    const image = document.getElementById('image-to-crop');
    const cropBtn = document.getElementById('crop-btn');
    const downloadBtn = document.getElementById('download-btn');
    let cropper = null;
    let originalFileName = 'cropped-image.png';

    imageInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            originalFileName = files[0].name;
            const reader = new FileReader();
            reader.onload = (event) => {
                image.src = event.target.result;

                if (cropper) {
                    cropper.destroy();
                }

                cropper = new Cropper(image, {
                    aspectRatio: NaN, // Free ratio
                    viewMode: 1,
                    background: false,
                    responsive: true,
                    restore: false,
                    guides: true,
                    center: true,
                    highlight: true,
                    cropBoxMovable: true,
                    cropBoxResizable: true,
                    toggleDragModeOnDblclick: false,
                });

                cropBtn.style.display = 'inline-block';
                downloadBtn.style.display = 'none';
            };
            reader.readAsDataURL(files[0]);
        }
    });

    cropBtn.addEventListener('click', () => {
        if (!cropper) {
            alert('Please upload an image first.');
            return;
        }

        const canvas = cropper.getCroppedCanvas();

        if (canvas) {
            downloadBtn.href = canvas.toDataURL('image/png');
            downloadBtn.download = `cropped-${originalFileName}`;
            downloadBtn.style.display = 'inline-block';
        }
    });
});
