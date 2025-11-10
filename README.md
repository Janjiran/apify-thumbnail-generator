# Bulk Thumbnail Generator

Generate clean, high‑quality thumbnails from multiple videos at scale. The Bulk Thumbnail Generator efficiently processes many video files or URLs in parallel, producing image thumbnails at specified timestamps and storing them in the default key‑value store.

## Features

- **Scalable batch input**: Process one or hundreds of videos in parallel.
- **Timestamp control**: Choose the exact second to capture a frame (default: 10s). If the timestamp exceeds the video length, the Actor automatically uses the last second of the video.
- **Output formats**: **PNG** or **JPG**.
- **Quality presets**: Best (1), Good (5), Medium (15), Low (30).
- **Binary outputs to KV store**: Images are saved to the default key‑value store.

## Input

Available in Apify Console in the [input tab](https://console.apify.com/organization/7eZs6cuW6YvNEj4Wb/actors/EEkdfG2bX3mC8KP7I/input).

- **videoFile** (array, required): Video file(s) or direct URL(s). You can upload files in Console or pass URLs.
- **timestamp** (integer, optional, default: 10): Second in the video to capture.
- **outputFormat** (string, optional, default: `png`): One of `png` or `jpg`.
- **quality** (string, optional, default: `1`): One of `"1" | "5" | "15" | "30"`.

## Output

The Bulk Thumbnail Generator writes image binaries to the default key‑value store with keys:

- `thumbnail-<index>-<timestamp>.<ext>` (one per input video)
    - Example: `thumbnail-0-12.png`
    - `<index>` is the index of the input video.
    - `<timestamp>` is the capture time in seconds, e.g., `12` or `12-5`.
    - `<ext>` matches `outputFormat` (`png` or `jpg`).

Content types:

- `image/png` for `png`
- `image/jpeg` for `jpg`

You can download the images from the Run’s Key‑Value Store in Apify Console or via API. In Console, open the run → Key‑Value Store → select `thumbnail-<index>-<timestamp>.<ext>` → Download.

## How it works

1. For each input video, the Bulk Thumbnail Generator uses `ffprobe` to read the duration.
2. It clamps the requested timestamp if it’s beyond the video length.
3. It runs `ffmpeg` to extract a single frame and saves it.
4. The resulting image is stored in the default key‑value store as `thumbnail-<index>-<timestamp>.<ext>`.

## Notes & limits

- One thumbnail per video per run (single timestamp). To create multiple timestamps, run multiple times.
- Supported formats are those supported by ffmpeg (e.g., most common MP4/MOV/AVI/WebM).
