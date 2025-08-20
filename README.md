# Profile Frame Tool (Single Frame)

This is a tiny site you can host on GitHub Pages. It lets users upload a photo, overlays one PNG frame, and downloads the result as a PNG.

## Files
- `index.html` — the page
- `style.css` — styles
- `script.js` — logic
- `frames/frame.png` — your overlay frame (PNG with a transparent center)

## How to publish on GitHub Pages (step by step, web only)
1. Go to https://github.com and create a new repository (e.g., **profile-frame-site**). Keep it **Public**.
2. On the repo page, click **Add file → Upload files**.
3. Drag-and-drop all files from this folder, including the `frames` directory with `frame.png`. Click **Commit changes**.
4. Open **Settings → Pages** (left sidebar).
5. Under **Build and deployment**, set:
   - **Source**: *Deploy from a branch*
   - **Branch**: `main` and folder `/ (root)`
6. Click **Save**. Wait a minute, then your site will be live at:
   - `https://YOUR-USERNAME.github.io/REPO-NAME/`

## Replace the sample frame
- Put your own **1080×1080** PNG with transparent areas in `frames/frame.png` (same name).
- If your frame is another size, you can still use it; the script scales it to the canvas.

## Optional: change output size
Open `index.html` and change the canvas size:
```html
<canvas id="canvas" width="1080" height="1080"></canvas>
```
Use `720` or `2048` depending on your quality needs.

## Local testing
Open `index.html` directly in your browser. Select a photo → Download.
