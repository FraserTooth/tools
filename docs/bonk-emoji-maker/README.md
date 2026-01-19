# 🥖 Bonk Emoji Maker

A web tool that lets you create custom "bonk" memes by replacing the dog in the classic baguette bonk GIF with any image you upload.

[**Try it here!**](https://frasertooth.github.io/tools/bonk-emoji-maker/)

## What It Does

Upload an image, and it gets bonked by a baguette! The tool:
- Takes any image you upload
- Replaces the dog in the original baguette bonk GIF
- Creates a custom animated GIF with your image getting squished vertically as the baguette bonks it
- Lets you download your custom bonk meme

The baguette appears on top of your image, creating the effect of bonking it from above. Your image maintains its horizontal width while getting vertically compressed during the bonk animation.

## Technical Approach

Built as a single-page HTML tool using vanilla JavaScript and gif.js for encoding. The project was developed entirely using **Claude Code** (Anthropic's CLI tool for Claude).

### Preprocessing Pipeline

The original baguette bonk GIF required preprocessing to enable custom overlays. To use the preprocessing tools, run `npm install` in the `preprocess/` directory first.

1. **Frame Extraction** (`preprocess/extract-frames.js`)
   - Used `gif-frames` npm package to extract all 25 frames
   - Saved as individual PNG files
   - Generated frame metadata (timing, dimensions)
   - Run with: `cd preprocess && npm run extract`

2. **Dog Position Mapping** (`preprocess/coordinate-editor.html`)
   - Visual tool to mark the dog's position in each frame
   - Drag-to-create bounding boxes with dual-corner resize handles
   - Saved coordinates to `frame-data.json`

3. **Dog Removal** (`preprocess/dog-scrubber.html`)
   - Brush tool to paint transparency over the dog
   - Erase mode for making pixels transparent
   - Paint mode for touch-ups with color sampling
   - Exported 25 "dogless" frames with transparent areas

### Runtime Tool

The main `index.html` tool:
- Loads 25 preprocessed frames with transparent dog areas
- Calculates constant horizontal center from first frame
- For each frame:
  - Draws uploaded image at dog position (background layer)
  - Scales width constantly, varies height for vertical squish
  - Draws frame with transparency on top (foreground layer)
- Uses gif.js with web workers for GIF encoding
- Handles transparency in output GIF

### Key Challenges Solved

1. **CORS Issues**: Initially tried base64 embedding images (170KB+ bloat), ultimately switched to loading from relative paths on server
2. **Worker Script Loading**: gif.js worker couldn't load from CDN due to CORS - solved by fetching worker as blob and using `URL.createObjectURL()` for same-origin loading
3. **Diagonal Shrinking Bug**: Image was shrinking diagonally - fixed by maintaining constant width and center X position, only varying height
4. **Layer Order**: Initially drew uploaded image on top - reversed to draw baguette on top for proper bonking effect
5. **Transparency**: Required specific gif.js configuration (`transparent: 0x00`, `dispose: 2`) to preserve transparency

## Project Structure

```
bonk-emoji-maker/
├── index.html              # Main tool (runs on GitHub Pages)
├── dogless_frames/         # 25 preprocessed frames with transparent dog areas
├── README.md               # This file
└── preprocess/             # Preprocessing tools (not deployed)
    ├── package.json        # Node dependencies for preprocessing
    ├── baguette_bonk_doge.gif
    ├── frames/             # Original extracted frames
    ├── extract-frames.js   # Node.js script to extract GIF frames
    ├── coordinate-editor.html
    └── dog-scrubber.html
```

## Development with Claude Code

This entire project was built using [Claude Code](https://github.com/anthropics/claude-code), Anthropic's CLI tool that provides Claude with direct access to your codebase. Key aspects of the development:

- **Tool-First Approach**: Rather than manually editing image frames, I asked Claude to build interactive HTML tools (coordinate-editor, dog-scrubber) that let me visually process the frames. This made the preprocessing much faster and more accurate.
- **Iterative Refinement**: Started with a plan, then built preprocessing tools, then the main tool
- **Visual Feedback Loop**: Each preprocessing tool provided immediate visual feedback, allowing validation before moving to the next step
- **Bug Fixing**: Fixed multiple issues through console logging and visual testing (CORS, diagonal shrinking, layer order, transparency)
- **Refactoring**: Cleaned up project structure after initial implementation

The preprocessing-first approach proved essential: by asking Claude to build visual tools to extract frames, mark positions, and scrub out the dog, we could validate the data interactively before building the final tool. This eliminated guesswork and manual pixel editing.

## GitHub Pages Deployment

The tool runs entirely client-side with no backend required. To deploy:

1. Ensure `index.html` and `dogless_frames/` are in the repo
2. Enable GitHub Pages in repository settings
3. The tool will be available at `https://yourusername.github.io/repository-name/bonk-emoji-maker/`

The gif.js worker script is fetched from CDN (jsdelivr.net) at runtime and converted to a blob URL to avoid CORS issues.

## Libraries Used

- [gif.js](https://github.com/jnordberg/gif.js) - Client-side GIF encoding (CDN)
- [gif-frames](https://www.npmjs.com/package/gif-frames) - Frame extraction (preprocessing only)

## License

MIT
