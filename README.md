# Thumbnail Generator

Generate clean, high‑quality thumbnails from videos at a specific timestamp. Feed it one or many video files or URLs, pick the output format (PNG or JPG), set the quality, and the Actor will produce image thumbnails and store them in the default key‑value store.

Inspired by the Apify idea: [Generate thumbnail from video](https://apify.com/ideas/generate-thumbnail-from-video-8908cb34).

## Features
- **Batch input**: Provide one or multiple video files/URLs.
- **Timestamp control**: Choose the exact second to capture a frame (default: 10s). If the timestamp exceeds the video length, the Actor automatically uses the last second of the video.
- **Output formats**: **PNG** or **JPG**.
- **Quality presets**: Best (1), Good (5), Medium (15), Low (30).
- **Binary outputs to KV store**: Images are saved to the default key‑value store.
 
## Input
Defined in `.actor/input_schema.json` and available in Apify Console.

- **videoFile** (array, required): Video file(s) or direct URL(s). You can upload files in Console or pass URLs.
- **timestamp** (integer, optional, default: 10): Second in the video to capture.
- **outputFormat** (string, optional, default: `png`): One of `png` or `jpg`.
- **quality** (string, optional, default: `1`): One of `"1" | "5" | "15" | "30"`.

## Output
The Actor writes image binaries to the default key‑value store with keys:
- `thumbnail-0`, `thumbnail-1`, ... (one per input video)

Content types:
- `image/png` for `png`
- `image/jpeg` for `jpg`

You can download the images from the Run’s Key‑Value Store in Apify Console or via API. In Console, open the run → Key‑Value Store → select `thumbnail-<index>` → Download.


## How it works
1. For each input video, the Actor uses `ffprobe` to read the duration.
2. It clamps the requested timestamp if it’s beyond the video length.
3. It runs `ffmpeg` to extract a single frame and saves it.
4. The resulting image is stored in the default key‑value store as `thumbnail-<index>`.

## Notes & limits
- One thumbnail per video per run (single timestamp). To create multiple timestamps, run multiple times.
- Supported formats are those supported by ffmpeg (e.g., most common MP4/MOV/AVI/WebM).
