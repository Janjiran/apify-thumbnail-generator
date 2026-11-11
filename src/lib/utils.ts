export function timestampGuard(inputTimestamps: number[], videoLengthSeconds: number) {
    return inputTimestamps.map((timestamp) => {
        if (timestamp > videoLengthSeconds) {
            console.warn(
                `⚠️ Video duration is less than timestamp. Video duration: ${videoLengthSeconds}s, timestamp: ${timestamp}s.\nUsing the last second of the video`,
            );
            return videoLengthSeconds - 1;
        }
        return timestamp;
    });
}