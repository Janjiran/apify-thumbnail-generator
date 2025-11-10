export type OutputFormat = 'jpg' | 'png';

export type Quality = '1' | '5' | '15' | '30';

export type Input = {
    videoFile: string | string[];
    timestamp?: number;
    outputFormat?: OutputFormat;
    quality?: Quality;
};
