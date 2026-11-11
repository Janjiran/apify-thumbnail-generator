export type OutputFormat = 'jpg' | 'png';

export type Quality = '1' | '5' | '15' | '30';

export type ThumbnailInput = {
    videoFile: string;
    timestamps?: number[];
    outputFormat?: OutputFormat;
    quality?: Quality;
}

export type Input = {
    thumbnails: ThumbnailInput[];
};


export type ThumbnailGeneratorOutput = {
    image: Buffer;
    filename: string;
    filenameWithExt: string;
    timestamp: number;
}