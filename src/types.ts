export type OutputFormat = 'jpg' | 'png';

export type Quality = '1' | '5' | '15' | '30';

export type ThumbnailInput = {
    videoFile: string;
    timestamp?: number;
    outputFormat?: OutputFormat;
    quality?: Quality;
}

export type Input = {
    thumbnails: ThumbnailInput[];
};
