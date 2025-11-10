export function timestampGuard(inputTimestamp: number, videoLengthSeconds: number) {
    let timestamp = inputTimestamp;
    if (videoLengthSeconds < timestamp) {
        console.warn(
            `⚠️ Video duration is less than timestamp. Video duration: ${videoLengthSeconds.toFixed(2)}s, timestamp: ${timestamp}s.\nUsing the last second of the video`,
        );
        timestamp = videoLengthSeconds - 1;
    }

    return timestamp;
}