
import { Actor } from 'apify';

import { normalizeInput } from './lib/input.js';
import { saveData } from './lib/output.js';
import { timestampGuard } from './lib/utils.js';
import { generateThumbnail, getVideoDuration } from './lib/video.js';
import type { Input } from './types.js';

await Actor.init();


const input = await Actor.getInput<Input>();

if (!input) {
    throw new Error('No input provided');
}

const { files, outputFormat, quality, timestamp: inputTimestamp } = normalizeInput(input);

await Promise.all(
    files.map(async (fileUrl, index) => {
        try {
            const startTime = performance.now();

            const videoLengthSeconds = getVideoDuration(fileUrl);

            const timestamp = timestampGuard(inputTimestamp, videoLengthSeconds);

            const filename = `thumbnail-${index}-${timestamp}`;
            const filenameWithExt = `${filename}.${outputFormat}`;

            console.log(`⚡️ Creating thumbnail for ${fileUrl} with name: ${filenameWithExt}`);

            const imageBuffer = generateThumbnail(fileUrl, timestamp, quality, filenameWithExt);

            const endTime = performance.now();
            console.log(`✅ Thumbnail created successfully and took: ${(endTime - startTime).toFixed(2)}ms.`);

            await saveData(filenameWithExt, fileUrl, timestamp, outputFormat, quality, filenameWithExt, imageBuffer);
        } catch (error) {
            console.error('❌ Failed to create thumbnail for', fileUrl);
            console.error(error);
        }
    }),
);

await Actor.exit();
