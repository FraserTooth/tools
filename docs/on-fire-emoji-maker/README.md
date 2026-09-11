# On Fire Emoji Maker — development notes

This is a standalone HTML tool designed to work both on GitHub Pages and when its `index.html` is opened directly in a browser.

## Why the flame frames are embedded

The GIF and PNG exports read pixels from a canvas. Browsers refuse that operation when any image drawn to the canvas is marked cross-origin (a “tainted canvas”). A direct `file://` page has an opaque origin, so even local PNG files can display normally yet taint the canvas during export.

The ten flame PNGs therefore remain in `flames/` as source assets, but the runtime editor embeds the same frames as `data:image/png;base64,...` values inside `index.html`. Data URLs are origin-clean, so `getImageData()`, PNG download, and GIF download all work when the tool is opened directly or served from GitHub Pages.

Do not change the runtime to load the flame files with `fetch()` when supporting direct opening: browsers block `fetch(file://...)` under CORS. Loading them with `<img>` can display the frames, but may still taint an export canvas under `file://`.

## If the flame artwork changes

1. Replace the PNGs in `flames/`.
2. Regenerate the matching base64 `flameData` entries in `index.html`.
3. Open the page directly from disk, upload an image, and test both PNG and GIF downloads.

Keep the two copies in sync. The local PNGs make the animation source easy to inspect; the embedded copy is the export-safe runtime version.

## GIF encoding

GIFs use the CDN-loaded `gifenc` module. It runs in the browser main thread rather than in a web worker, avoiding cross-origin worker startup issues that affected `gif.js` in local previews. It quantizes each rendered canvas frame, writes the ten frames, and downloads the resulting Blob.

No uploaded image is sent to a server: the `FileReader`, compositing canvas, and GIF encoder all run locally in the browser.
