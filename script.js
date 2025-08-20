// Basic single-frame tool
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const uploadInput = document.getElementById('upload');
const downloadBtn = document.getElementById('download');

const FRAME_SRC = 'frames/frame.png'; // replace this image with your real frame
const frameImg = new Image();
frameImg.crossOrigin = 'anonymous';
frameImg.src = FRAME_SRC;

let userImg = null;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (userImg) {
    // cover fit the user image into the square canvas (1080x1080)
    const cw = canvas.width, ch = canvas.height;
    const iw = userImg.width, ih = userImg.height;
    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale, sh = ih * scale;
    const dx = (cw - sw) / 2;
    const dy = (ch - sh) / 2;
    ctx.drawImage(userImg, dx, dy, sw, sh);
  }
  if (frameImg.complete && frameImg.naturalWidth > 0) {
    ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
  }
  downloadBtn.disabled = !userImg;
}

uploadInput.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    userImg = new Image();
    userImg.onload = draw;
    userImg.src = reader.result;
  };
  reader.readAsDataURL(file);
});

frameImg.onload = draw;

downloadBtn.addEventListener('click', () => {
  if (!userImg) return;
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = 'profile-with-frame.png';
  a.click();
});
