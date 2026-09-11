# Tools

Small, single-purpose HTML tools for GitHub Pages. Each tool lives under `docs/<tool-name>/` and should run entirely in the browser.

## Shared conventions for emoji and meme makers

Emoji makers typically combine a user-uploaded image with a sequence of transparent or animated artwork, then export a PNG or GIF. Keep that entire workflow client-side: read uploads with `FileReader`, composite them with a `<canvas>`, and create the download as a Blob. Do not upload a user's image to a service.

### Canvas and CORS

Canvas exports fail if any image drawn onto the canvas is cross-origin (a *tainted canvas*). This matters even for local development: when an HTML file is opened as `file://`, browsers may display adjacent PNG files but still forbid reading the resulting canvas pixels.

For artwork that must support direct opening as well as GitHub Pages:

- Keep editable/source frame files in the tool folder.
- Embed export-critical frames as `data:image/png;base64,...` values in the runtime HTML, or only use assets from a server that explicitly allows CORS.
- Do not use `fetch()` to load local frame files in a `file://` page; browsers block `fetch(file://...)`.
- Before shipping, open the HTML directly from disk, upload a test image, and verify both PNG and GIF exports.

If a tool only needs to run from GitHub Pages, same-origin relative assets are usually sufficient. Choose the asset strategy deliberately and document it in the tool's README.

### Animated GIFs

Use libraries from a CDN only. Prefer an encoder that can run directly in the browser when local-file compatibility matters: worker-based encoders can fail when a browser blocks the worker's source or blob URL. Keep timing, layer order, and frame count in clear constants or configuration near the top of the tool script.

### Tool checklist

- Works with an uploaded PNG, JPG, or WebP.
- Shows a live preview before download.
- Exports without a backend.
- Is usable from its GitHub Pages path and, where intended, directly from disk.
- Has a focused `README.md` when it uses non-obvious asset preparation or export behavior.
