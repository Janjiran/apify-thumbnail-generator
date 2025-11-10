import { DEFAULT_OUTPUT_FORMAT, DEFAULT_QUALITY, DEFAULT_TIMESTAMP } from '../consts.js';
import type { Input } from '../types.js';

export function normalizeInput(input: Input) {
    const files = Array.isArray(input.videoFile) ? input.videoFile : [input.videoFile];

    return {
        files,
        outputFormat: input.outputFormat ?? DEFAULT_OUTPUT_FORMAT,
        quality: input.quality ?? DEFAULT_QUALITY,
        timestamp: input.timestamp ?? DEFAULT_TIMESTAMP,
    };
}
