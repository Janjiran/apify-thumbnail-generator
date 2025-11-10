import { execSync } from 'node:child_process';
import fs from 'node:fs';

export function getVideoDuration(fileUrl: string) {
    const durationOutput = execSync(`ffprobe -i "${fileUrl}" -show_entries format=duration -v error -of csv="p=0"`, {
        encoding: 'utf-8',
    });

    const videoLengthSeconds = Number.parseFloat(durationOutput);

    console.log(`🎬 Video duration: ${videoLengthSeconds}s`);
    return videoLengthSeconds;
}

export function generateThumbnail(fileUrl: string, timestamp: number, quality: string, outputPath: string) {
    execSync(
        `ffmpeg -hide_banner -loglevel error -y -ss ${timestamp} -i "${fileUrl}" -frames:v 1 -q:v ${quality} "${outputPath}"`,
        { encoding: 'utf-8' },
    );

    return fs.readFileSync(outputPath);
}
