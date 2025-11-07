import { execSync } from 'node:child_process'
import fs from 'node:fs'

import { Actor } from 'apify'

import type { Input } from './types.js'
import { MIME_TYPE_BY_FORMAT } from './utils.js'

const DEFAULT_TIMESTAMP = 10
const DEFAULT_OUTPUT_FORMAT = 'png'
const DEFAULT_QUALITY = '1'

await Actor.init()

const kv = await Actor.openKeyValueStore()

const input = await Actor.getInput<Input>()

if (!input) {
    throw new Error('No input provided')
}

const files = Array.isArray(input.videoFile) ? input.videoFile : [input.videoFile]
const outputFormat = input.outputFormat ?? DEFAULT_OUTPUT_FORMAT
const quality = input.quality ?? DEFAULT_QUALITY
const inputTimestamp = input.timestamp ?? DEFAULT_TIMESTAMP

await Promise.all(files.map(async (fileUrl, index) => {
    try {
        const startTime = performance.now()
        const filename = `thumbnail-${index}.${outputFormat}`

        console.log(`⚡️ Creating thumbnail for ${fileUrl} with name: ${filename}`)

        const durationOutput = execSync(`ffprobe -i "${fileUrl}" -show_entries format=duration -v error -of csv="p=0"`, { encoding: 'utf-8' })

        const videoLengthSeconds = Number.parseFloat(durationOutput)
        console.log(`🎬 Video duration: ${videoLengthSeconds}s`)

        let timestamp = inputTimestamp

        if (videoLengthSeconds < timestamp) {
            console.warn(`⚠️ Video duration is less than timestamp. Video duration: ${videoLengthSeconds.toFixed(2)}s, timestamp: ${timestamp}s.\nUsing the last second of the video`)
            timestamp = videoLengthSeconds - 1
        }
        
        execSync(`ffmpeg -hide_banner -loglevel error -y -ss ${timestamp} -i "${fileUrl}" -frames:v 1 -q:v ${quality} "${filename}"`, { encoding: 'utf-8' })
        const imageBuffer = fs.readFileSync(filename)

        const mimeType = MIME_TYPE_BY_FORMAT[outputFormat]
        await Actor.setValue(`thumbnail-${index}`, imageBuffer, { contentType: mimeType })

        const endTime = performance.now()
        console.log(`✅ Thumbnail created successfully and took: ${(endTime - startTime).toFixed(2)}ms.`)

        const thumbnailImage = kv.getPublicUrl(`thumbnail-${index}`)

        await Actor.pushData({
            thumbnailImage,
            videoUrl: fileUrl,
            timestamp,
            outputFormat,
            quality,
            filename,
            mimeType,
        })
    } catch (error) {
        console.error('❌ Failed to create thumbnail for', fileUrl)
        console.error(error)
    }
}))

await Actor.exit()
