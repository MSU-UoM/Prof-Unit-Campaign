const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const uploadInput = document.getElementById('upload');
const downloadBtn = document.getElementById('download');
const zoomSlider = document.getElementById('zoom');

const FRAME_SRC = 'frames/frame.png';
const frameImg = new Image();
frameImg.src = FRAME_SRC;

let userImg = null;
let offsetX = 0, offsetY = 0;
let scale = 1;
let dragging = false;
let dragStartX, dragStartY;

// Touch state
let lastTouchDistance = null;
let isTouchDragging = false;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (userImg) {
    const iw = userImg.width;
    const ih = userImg.height;

    const sw = iw * scale;
    const sh = ih * scale;

    const dx = (canvas.width - sw) / 2 + offsetX;
    const dy = (canvas.height - sh) / 2 + offsetY;

    ctx.drawImage(userImg, dx, dy, sw, sh);
  }

  if (frameImg.complete && frameImg.naturalWidth > 0) {
    ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
  }

  downloadBtn.disabled = !userImg;
  zoomSlider.value = scale.toFixed(2);
}

// Upload image
uploadInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    userImg = new Image();
    userImg.onload = () => {
      scale = Math.max(canvas.width / userImg.width, canvas.height / userImg.height);
      offsetX = 0;
      offsetY = 0;
      draw();
    };
    userImg.src = reader.result;
  };
  reader.readAsDataURL(file);
});

// Mouse drag
canvas.addEventListener('mousedown', (e) => {
  if (!userImg) return;
  dragging = true;
  dragStartX = e.offsetX;
  dragStartY = e.offsetY;
});

canvas.addEventListener('mousemove', (e) => {
  if (dragging) {
    offsetX += e.offsetX - dragStartX;
    offsetY += e.offsetY - dragStartY;
    dragStartX = e.offsetX;
    dragStartY = e.offsetY;
    draw();
  }
});

canvas.addEventListener('mouseup', () => dragging = false);
canvas.addEventListener('mouseleave', () => dragging = false);

// Mouse wheel zoom
canvas.addEventListener('wheel', (e) => {
  if (!userImg) return;
  e.preventDefault();
  const zoomAmount = e.deltaY * -0.001;
  scale = Math.min(Math.max(0.5, scale + zoomAmount), 3);
  draw();
});

// Slider zoom
zoomSlider.addEventListener('input', () => {
  if (!userImg) return;
  scale = parseFloat(zoomSlider.value);
  draw();
});

// --- Touch events (drag + pinch) ---
canvas.addEventListener('touchstart', (e) => {
  if (!userImg) return;
  if (e.touches.length === 1) {
    // drag start
    isTouchDragging = true;
    dragStartX = e.touches[0].clientX;
    dragStartY = e.touches[0].clientY;
  } else if (e.touches.length === 2) {
    // pinch start
    isTouchDragging = false;
    lastTouchDistance = getTouchDistance(e.touches);
  }
});

canvas.addEventListener('touchmove', (e) => {
  if (!userImg) return;
  e.preventDefault();

  if (e.touches.length === 1 && isTouchDragging) {
    // dragging
    offsetX += e.touches[0].clientX - dragStartX;
    offsetY += e.touches[0].clientY - dragStartY;
    dragStartX = e.touches[0].clientX;
    dragStartY = e.touches[0].clientY;
    draw();
  } else if (e.touches.length === 2) {
    // pinch zoom
    const newDistance = getTouchDistance(e.touches);
    if (lastTouchDistance) {
      const delta = newDistance - lastTouchDistance;
      scale = Math.min(Math.max(0.5, scale + delta * 0.002), 3);
      draw();
    }
    lastTouchDistance = newDistance;
  }
}, { passive: false });

canvas.addEventListener('touchend', () => {
  isTouchDragging = false;
  lastTouchDistance = null;
});

// Helper: distance between two touches
function getTouchDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// Download
downloadBtn.addEventListener('click', () => {
  if (!userImg) return;
  const link = document.createElement('a');
  link.download = 'framed-profile.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

// Redraw when frame loads
frameImg.onload = draw;
