import { execSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import type { ThumbnailGeneratorOutput } from '../types.js';

export async function getVideoDuration(fileUrl: string) {
    const durationOutput = execSync(
        `ffprobe -i "${fileUrl}" -show_entries format=duration -v error -of csv="p=0"`,
        { encoding: 'utf-8' },
    );
    const videoLengthSeconds = Number.parseFloat(durationOutput);
    console.log(`🎬 Video duration: ${videoLengthSeconds}s`);
    return Number(videoLengthSeconds.toFixed(2));
}

export async function generateThumbnails(
    fileUrl: string,
    timestamps: number[],
    quality: string,
    index: number,
    outputFormat: string,
): Promise<ThumbnailGeneratorOutput[]> {
    try {
        // First, try to create thumbnails without downloading the file to temp
        return createFfmpegThumbnails(timestamps, index, outputFormat, fileUrl, quality);
    } catch (err) {
        console.warn('ffmpeg failed on remote URL, downloading to temp and retrying…', err);
        const extension = path.extname(new URL(fileUrl).pathname).replace(/^\./, '') || 'mp4';

        const tmpFilePath = await downloadToTemp(fileUrl, extension);
        
        return createFfmpegThumbnails(timestamps, index, outputFormat, tmpFilePath, quality);
    }
}

export function createFfmpegThumbnails(
    timestamps: number[],
    index: number,
    outputFormat: string,
    fileUrl: string,
    quality: string,
): ThumbnailGeneratorOutput[] {
    const thumbnails = []

    for (const timestamp of timestamps) {
        console.log(`⏳ Creating thumbnail for ${fileUrl} at timestamp: ${timestamp}`);
        const filename = `thumbnail-${index}-${timestamp}`;
        const filenameWithExt = `${filename}.${outputFormat}`;

        ffmpegCreateThumbnail(fileUrl, timestamp, quality, filenameWithExt);
        thumbnails.push({
            image: fs.readFileSync(filenameWithExt),
            filename,
            filenameWithExt,
            timestamp,
        });
    }

    return thumbnails;
}

function ffmpegCreateThumbnail(
    fileUrl: string,
    timestamp: number,
    quality: string,
    outputPath: string,
) {
    execSync(
        `ffmpeg -hide_banner -loglevel error -y -ss ${timestamp} -i "${fileUrl}" -frames:v 1 -q:v ${quality} "${outputPath}"`,
        { encoding: 'utf-8' },
    );
}

async function downloadToTemp(
    url: string, 
    extension: string,
) {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to download file: ${res.status} ${res.statusText}`);
    }

    const tmpFileName = `tmp-video-${crypto.randomUUID()}.${extension}`
    const arrayBuf = await res.arrayBuffer();

    const tmpPath = path.join(os.tmpdir(), tmpFileName);
    fs.writeFileSync(tmpPath, Buffer.from(arrayBuf));

    return tmpPath;
}