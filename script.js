const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const zoomInput = document.getElementById("zoom");
const download = document.getElementById("download");

let img = new Image();
let frame = new Image();
frame.src = "frames/frame.png"; // your campaign frame

let photo = null;
let offsetX = 0, offsetY = 0;
let scale = 1;
let dragging = false;
let startX, startY;

upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    img.onload = () => {
      photo = img;
      offsetX = 0;
      offsetY = 0;
      scale = 1;
      draw();
      download.disabled = false;
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (photo) {
    const w = photo.width * scale;
    const h = photo.height * scale;
    const x = canvas.width / 2 - w / 2 + offsetX;
    const y = canvas.height / 2 - h / 2 + offsetY;
    ctx.drawImage(photo, x, y, w, h);
  }

  // --- Border guide box (crop limit) ---
  ctx.strokeStyle = "red";
  ctx.lineWidth = 4;
  ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

  // Frame overlay on top
  if (frame.complete) {
    ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
  }
}

// Mouse drag
canvas.addEventListener("mousedown", (e) => {
  dragging = true;
  startX = e.offsetX;
  startY = e.offsetY;
});
canvas.addEventListener("mouseup", () => dragging = false);
canvas.addEventListener("mouseout", () => dragging = false);
canvas.addEventListener("mousemove", (e) => {
  if (dragging) {
    offsetX += e.offsetX - startX;
    offsetY += e.offsetY - startY;
    startX = e.offsetX;
    startY = e.offsetY;
    draw();
  }
});

// Zoom control
zoomInput.addEventListener("input", () => {
  scale = parseFloat(zoomInput.value);
  draw();
});

// Download image
download.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "campaign-profile.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

frame.onload = draw;
