import { Actor } from "apify";

import { MIME_TYPE_BY_FORMAT } from "../consts.js";
import type { OutputFormat } from "../types.js";

export async function saveData(
    filename: string,
    fileUrl: string,
    timestamp: number,
    outputFormat: OutputFormat,
    quality: string,
    filenameWithExt: string,
    imageBuffer: Buffer,
) {

    const kv = await Actor.openKeyValueStore();

    const mimeType = MIME_TYPE_BY_FORMAT[outputFormat];

    await Promise.all([
        Actor.setValue(filename, imageBuffer, { contentType: mimeType }),
        Actor.pushData({
            thumbnailImage: kv.getPublicUrl(filename),
            videoUrl: fileUrl,
            timestamp,
            outputFormat,
            quality,
            filename: filenameWithExt,
            mimeType,
        })
    ]);
}