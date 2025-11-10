import { DEFAULT_OUTPUT_FORMAT, DEFAULT_QUALITY, DEFAULT_TIMESTAMP } from '../consts.js';
import type { Input } from '../types.js';

export function normalizeInputs(inputs: Input) {

    return inputs.thumbnails.map(input => {

        const outputFormat = input.outputFormat ?? DEFAULT_OUTPUT_FORMAT;
        const quality = input.quality ?? DEFAULT_QUALITY;
        const timestamp = input.timestamp ?? DEFAULT_TIMESTAMP;

        return {
            fileUrl: input.videoFile,
            outputFormat,
            quality,
            timestamp,
        }
    })
}
