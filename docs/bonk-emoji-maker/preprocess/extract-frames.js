const gifFrames = require('gif-frames');
const fs = require('fs');
const path = require('path');

async function extractFrames() {
    const gifPath = path.join(__dirname, 'baguette_bonk_doge.gif');
    const framesDir = path.join(__dirname, 'frames');

    console.log('Extracting frames from baguette_bonk_doge.gif...');

    try {
        // Extract all frames from the GIF
        const frameData = await gifFrames({
            url: gifPath,
            frames: 'all',
            outputType: 'png',
            cumulative: false  // Extract each frame independently
        });

        console.log(`Found ${frameData.length} frames`);

        // Create the frames manifest
        const manifest = {
            sourceGif: 'baguette_bonk_doge.gif',
            frameCount: frameData.length,
            gifWidth: 0,  // Will be set from first frame
            gifHeight: 0, // Will be set from first frame
            frames: []
        };

        // Process each frame
        for (let i = 0; i < frameData.length; i++) {
            const frame = frameData[i];
            const frameFileName = `frame-${String(i).padStart(3, '0')}.png`;
            const framePath = path.join(framesDir, frameFileName);

            console.log(`Processing frame ${i + 1}/${frameData.length}...`);

            // Write frame to file
            await new Promise((resolve, reject) => {
                const writeStream = fs.createWriteStream(framePath);
                frame.getImage().pipe(writeStream);
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });

            // Get frame dimensions from the frameInfo
            if (i === 0) {
                manifest.gifWidth = frame.frameInfo.width || 112;
                manifest.gifHeight = frame.frameInfo.height || 112;
            }

            // Add frame info to manifest
            manifest.frames.push({
                index: i,
                path: `frames/${frameFileName}`,
                delay: frame.frameInfo.delay * 10, // Convert centiseconds to milliseconds
                disposal: frame.frameInfo.disposal || 0,
                // Placeholder coordinates - to be filled via visual editor
                dogPosition: {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0
                }
            });
        }

        // Write manifest to JSON file
        const manifestPath = path.join(framesDir, 'frame-data.json');
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

        console.log('\n✓ Frame extraction complete!');
        console.log(`✓ Extracted ${frameData.length} frames to frames/`);
        console.log(`✓ Created frames/frame-data.json with ${manifest.frames.length} frame entries`);
        console.log(`✓ GIF dimensions: ${manifest.gifWidth}x${manifest.gifHeight}`);
        console.log('\nNext step: Open coordinate-editor.html to set dog positions');

    } catch (error) {
        console.error('Error extracting frames:', error);
        process.exit(1);
    }
}

extractFrames();
