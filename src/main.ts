import { Actor } from 'apify';

import { normalizeInputs } from './lib/input.js';
import { saveData } from './lib/output.js';
import { timestampGuard } from './lib/utils.js';
import { generateThumbnails, getVideoDuration } from './lib/video.js';
import type { Input } from './types.js';

await Actor.init();

const inputs = await Actor.getInput<Input>();

if (!inputs || !inputs.thumbnails.length) {
    throw new Error('No input provided');
}

const normalizedInputs = normalizeInputs(inputs);

await Promise.all(
    normalizedInputs.map(async (input, index) => {
        const { fileUrl, outputFormat, quality, timestamps: inputTimestamps } = input;

        try {
            const startTime = performance.now();

            const videoLengthSeconds = await getVideoDuration(fileUrl);
            const timestamps = timestampGuard(inputTimestamps, videoLengthSeconds);

            console.log(`⚡️ Creating thumbnails for ${fileUrl}`);

            const thumbnails = await generateThumbnails(fileUrl, timestamps, quality, index, outputFormat);

            const endTime = performance.now();
            console.log(`✅ Thumbnails created successfully and took: ${(endTime - startTime).toFixed(2)}ms.`);

            for (const [i, thumbnail] of thumbnails.entries()) {
                console.log('Uploading thumbnail for fileUrl: ', fileUrl, ' | progress: ', i + 1, 'of', thumbnails.length);
                // await saveData(filenameWithExt, fileUrl, timestamp, outputFormat, quality, filenameWithExt, imageBuffer);
                await saveData(
                    thumbnail.filenameWithExt,
                    fileUrl,
                    thumbnail.timestamp,
                    outputFormat,
                    quality,
                    thumbnail.filenameWithExt,
                    thumbnail.image,
                );
            }
        } catch (error) {
            console.error('❌ Failed to create thumbnail for', fileUrl);
            console.error(error);
        }
    }),
);

await Actor.exit();
