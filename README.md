# Bulk Thumbnail Generator

Generate clean, high‑quality thumbnails from multiple videos at scale. Configure per‑video timestamps, format and quality. The Bulk Thumbnail Generator efficiently processes many video files or URLs in parallel, producing image thumbnails and storing them in the default key‑value store.

## Features

- **Scalable batch input**: Process one or hundreds of videos in parallel.
- **Timestamps control**: Choose one or more timestamps (seconds) to capture (default: 10s). If any timestamp exceeds the video length, the Actor automatically uses the last second of the video.
- **Output formats**: **PNG** or **JPG**.
- **Quality presets**: Best (1), Good (5), Medium (15), Low (31).
- **Binary outputs to KV store**: Images are saved to the default key‑value store.

## Input

Available in Apify Console in the [input tab](https://console.apify.com/organization/7eZs6cuW6YvNEj4Wb/actors/EEkdfG2bX3mC8KP7I/input).

- **thumbnails** (array, required): List of thumbnails to generate. Each item supports:
  - **videoFile** (string, required): Video file or direct URL. You can upload files in Console or pass URLs.
  - **timestamps** (array, optional, default: [10]): One or more timestamps (in seconds) to capture. If any value exceeds the video length, the last second is used.
  - **outputFormat** (string, optional, default: `png`): One of `png` or `jpg`.
  - **quality** (string, optional, default: `"1"`): One of `"1" | "5" | "15" | "31"`.

Example input:

```json
{
  "thumbnails": [
    {
      "videoFile": "https://example.com/video-1.mp4",
      "timestamps": [8, 12.5],
      "outputFormat": "jpg",
      "quality": "5"
    },
    {
      "videoFile": "https://example.com/video-2.mp4",
      "timestamps": [3]
    },
    {
      "videoFile": "https://example.com/video-3.mp4",
      "outputFormat": "png",
      "quality": "1",
      "timestamps": [12]
    }
  ]
}
```

## Output

The Bulk Thumbnail Generator writes image binaries to the default key‑value store with keys:

- `thumbnail-<index>-<timestamp>.<ext>` (one per timestamp in `timestamps`)
    - Example: `thumbnail-0-12.00.png`
    - `<index>` is the index of the item in the `thumbnails` array.
    - `<timestamp>` is the capture time in seconds formatted with two decimals, e.g., `12.00`.
    - `<ext>` matches `outputFormat` (`png` or `jpg`).

Content types:

- `image/png` for `png`
- `image/jpeg` for `jpg`

You can download the images from the Run’s Key‑Value Store in Apify Console or via API. In Console, open the run → Key‑Value Store → select `thumbnail-<index>-<timestamp>.<ext>` → Download.

## How it works

1. For each item in `thumbnails`, the Bulk Thumbnail Generator uses `ffprobe` to read the duration.
2. It clamps the requested timestamps if any are beyond the video length.
3. It runs `ffmpeg` to extract a single frame per timestamp and saves them.
4. The resulting images are stored in the default key‑value store as `thumbnail-<index>-<timestamp>.<ext>`.

## Notes & limits

- Multiple thumbnails can be created per `thumbnails` item via the `timestamps` array. To create a single thumbnail, provide one timestamp (or rely on the default `[10]`).
- Filenames include timestamps formatted to two decimals (e.g., `12.00`).
- Supported formats are those supported by ffmpeg (e.g., most common MP4/MOV/AVI/WebM).
